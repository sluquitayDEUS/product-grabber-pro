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

serve(async (req) => {
  // Handle CORS preflight
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const publicKey = Deno.env.get('FURIAPAY_PUBLIC_KEY');
    const secretKey = Deno.env.get('PAYMENT_GATEWAY_SECRET_KEY');

    if (!publicKey || !secretKey) {
      console.error('Missing Furia Pay credentials');
      return new Response(
        JSON.stringify({ error: 'Payment gateway not configured' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const body: PaymentRequest = await req.json();
    console.log('Payment request received:', { 
      amount: body.amount, 
      method: body.paymentMethod,
      customer: body.customer?.email 
    });

    // Build authentication header (Basic Auth)
    const auth = 'Basic ' + btoa(`${publicKey}:${secretKey}`);

    // Build Furia Pay payload
    const furiaPayload: Record<string, unknown> = {
      amount: body.amount,
      paymentMethod: body.paymentMethod,
      customer: {
        name: body.customer.name,
        email: body.customer.email,
        document: {
          type: 'cpf',
          number: body.customer.document.replace(/\D/g, ''),
        },
        ...(body.customer.phone && {
          phone: body.customer.phone.replace(/\D/g, ''),
        }),
      },
      items: body.items.map(item => ({
        title: item.title,
        quantity: item.quantity,
        unitPrice: item.unitPrice,
        tangible: item.tangible,
      })),
    };

    // Add card data if credit card payment
    if (body.paymentMethod === 'credit_card') {
      if (!body.cardToken) {
        return new Response(
          JSON.stringify({ error: 'Card token is required for credit card payments' }),
          { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }
      furiaPayload.card = { hash: body.cardToken };
      furiaPayload.installments = body.installments || 1;
    }

    // Add PIX expiration if PIX payment (15 minutes)
    if (body.paymentMethod === 'pix') {
      furiaPayload.pix = {
        expiresIn: 900, // 15 minutes
      };
    }

    // Add shipping if provided
    if (body.shipping) {
      furiaPayload.shipping = {
        street: body.shipping.street,
        streetNumber: body.shipping.number,
        complement: body.shipping.complement || '',
        neighborhood: body.shipping.neighborhood,
        city: body.shipping.city,
        state: body.shipping.state,
        zipcode: body.shipping.zipcode.replace(/\D/g, ''),
        country: 'br',
        fee: typeof body.shipping.fee === 'number' ? body.shipping.fee : 0,
      };
    }

    // Add external reference if provided
    if (body.externalRef) {
      furiaPayload.externalRef = body.externalRef;
    }

    console.log('Sending to Furia Pay:', JSON.stringify(furiaPayload, null, 2));

    // Call Furia Pay API
    const response = await fetch('https://api.furiapaybr.app/v1/payment-transactions/create', {
      method: 'POST',
      headers: {
        'authorization': auth,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(furiaPayload),
    });

    const data = await response.json();
    console.log('Furia Pay response:', response.status, JSON.stringify(data, null, 2));

    if (!response.ok) {
      return new Response(
        JSON.stringify({ 
          error: data.message || 'Payment failed',
          details: data 
        }),
        { status: response.status, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Return success response with payment data
    return new Response(
      JSON.stringify({
        success: true,
        transactionId: data.id,
        status: data.status,
        paymentMethod: body.paymentMethod,
        // PIX specific data - note: API returns qrcode not qrCodeUrl
        ...(body.paymentMethod === 'pix' && data.pix && {
          pix: {
            qrCode: data.pix.qrcode || data.pix.qrCode,
            expiresAt: data.pix.expirationDate || data.pix.expiresAt,
          },
        }),
        // Credit card specific data
        ...(body.paymentMethod === 'credit_card' && {
          cardLastDigits: data.card?.lastDigits,
          cardBrand: data.card?.brand,
        }),
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
