import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface PaymentRequest {
  amount: number; // in cents
  paymentMethod: 'pix' | 'credit_card';
  installments?: number;
  cardToken?: string;
  customer: {
    name: string;
    email: string;
    document: string; // CPF
    phone?: string;
  };
  shipping?: {
    street: string;
    number: string;
    complement?: string;
    neighborhood: string;
    city: string;
    state: string;
    zipcode: string;
    fee?: number; // in cents
  };
  items: Array<{
    title: string;
    quantity: number;
    unitPrice: number; // in cents
    tangible: boolean;
  }>;
  externalRef?: string;
}

const SIGILO_API_URL = 'https://app.sigilopay.com.br/api/v1/gateway/pix/receive';

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const publicKey = Deno.env.get('SIGILOPAY_PUBLIC_KEY');
    const secretKey = Deno.env.get('SIGILOPAY_SECRET_KEY');

    if (!publicKey || !secretKey) {
      console.error('Missing SigiloPay credentials');
      return new Response(
        JSON.stringify({ error: 'Payment gateway not configured' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const body: PaymentRequest = await req.json();
    console.log('Payment request received:', {
      amount: body.amount,
      method: body.paymentMethod,
      customer: body.customer?.email,
    });

    if (body.paymentMethod !== 'pix') {
      return new Response(
        JSON.stringify({ error: 'Only PIX payment is currently supported with SigiloPay integration' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const cleanDocument = body.customer.document.replace(/\D/g, '');
    const cleanPhone = body.customer.phone ? body.customer.phone.replace(/\D/g, '') : undefined;

    // Convert amount from cents to BRL (reais with decimals)
    const amountInReais = Number((body.amount / 100).toFixed(2));
    const shippingFeeInReais = body.shipping?.fee
      ? Number((body.shipping.fee / 100).toFixed(2))
      : 0;

    // Sum of (price * quantity) of all products in reais
    const productsTotal = body.items.reduce(
      (sum, item) => sum + (item.unitPrice / 100) * item.quantity,
      0
    );

    // SigiloPay validates: amount === sum(products) + shippingFee + extraFee - discount
    // We use discount to balance any residual difference (e.g. PIX discount applied client-side)
    let discount = Number((productsTotal + shippingFeeInReais - amountInReais).toFixed(2));
    let extraFee = 0;
    if (discount < 0) {
      // amount is greater than products+shipping → put difference in extraFee
      extraFee = Number((-discount).toFixed(2));
      discount = 0;
    }

    const identifier = `lov_${Date.now()}_${Math.random().toString(36).slice(2, 10)}`;

    const callbackUrl = `${Deno.env.get('SUPABASE_URL')}/functions/v1/check-payment-status`;

    const sigiloPayload: Record<string, unknown> = {
      identifier,
      amount: amountInReais,
      shippingFee: shippingFeeInReais,
      extraFee,
      discount,
      client: {
        name: body.customer.name,
        email: body.customer.email,
        document: cleanDocument,
        ...(cleanPhone && { phone: cleanPhone }),
      },
      products: body.items.map((item, idx) => ({
        id: `prod_${idx}_${Date.now()}`,
        name: item.title,
        quantity: item.quantity,
        price: Number((item.unitPrice / 100).toFixed(2)),
      })),
      metadata: {
        provider: 'lovable-checkout',
        externalRef: body.externalRef || identifier,
      },
      callbackUrl,
    };

    console.log('Sending to SigiloPay:', JSON.stringify(sigiloPayload, null, 2));

    const response = await fetch(SIGILO_API_URL, {
      method: 'POST',
      headers: {
        'x-public-key': publicKey,
        'x-secret-key': secretKey,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(sigiloPayload),
    });

    const responseText = await response.text();
    console.log('SigiloPay raw response:', response.status, responseText);

    let data: Record<string, unknown> = {};
    if (responseText && responseText.trim()) {
      try {
        data = JSON.parse(responseText);
      } catch (parseError) {
        console.error('Failed to parse SigiloPay response:', parseError);
        return new Response(
          JSON.stringify({
            error: 'Invalid response from payment gateway',
            details: { status: response.status, body: responseText },
          }),
          { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }
    }

    if (!response.ok || data.errorCode || data.statusCode) {
      const errorMessage =
        (data.message as string) ||
        (data.errorDescription as string) ||
        `Payment failed with status ${response.status}`;
      console.error('SigiloPay error:', errorMessage, data);
      return new Response(
        JSON.stringify({ error: errorMessage, details: data }),
        { status: response.status || 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const transactionId = data.transactionId as string;
    const pixData = data.pix as Record<string, unknown> | undefined;
    const pixCode = (pixData?.code as string) || '';

    // Calculate expiration: 15 minutes from now
    const expiresAt = new Date(Date.now() + 15 * 60 * 1000).toISOString();

    return new Response(
      JSON.stringify({
        success: true,
        transactionId,
        status: String(data.status || 'PENDING').toLowerCase(),
        paymentMethod: 'pix',
        pix: {
          qrCode: pixCode,
          expiresAt,
        },
      }),
      { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('Payment error:', error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : 'Unknown error' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
