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
    const secretKey = Deno.env.get('FURIAPAY_SECRET_KEY');

    if (!publicKey || !secretKey) {
      console.error('Missing Furia Pay credentials - PUBLIC_KEY or SECRET_KEY not set');
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

    // Build authentication header (Basic Auth as per Furia Pay documentation)
    // Format: Basic Base64(PUBLIC_KEY:SECRET_KEY)
    const credentials = `${publicKey}:${secretKey}`;
    const encodedCredentials = btoa(credentials);
    const auth = `Basic ${encodedCredentials}`;

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
    // NOTE: We try multiple base URLs because some accounts/environments respond on different domains.
    const createEndpoints = [
      'https://api.furiapaybr.app/v1/payment-transactions/create',
      'https://api.furiapaybr.app/v1/payment-transactions',
      'https://api.furiapaybr.com/v1/payment-transactions/create',
      'https://api.furiapaybr.com/v1/payment-transactions',
    ];

    let lastStatus = 0;
    let lastBody = '';
    let response: Response | null = null;

    for (const url of createEndpoints) {
      response = await fetch(url, {
        method: 'POST',
        headers: {
          'Authorization': auth,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(furiaPayload),
      });

      lastStatus = response.status;
      lastBody = await response.text();
      console.log('Furia Pay raw response:', url, lastStatus, lastBody);

      // If endpoint not found, try the fallback
      if (lastStatus === 404) continue;

      // Otherwise stop here (success or other error)
      break;
    }

    if (!response) {
      return new Response(
        JSON.stringify({ error: 'Payment gateway request not executed' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    let data: Record<string, unknown> = {};
    if (lastBody && lastBody.trim()) {
      try {
        data = JSON.parse(lastBody);
      } catch (parseError) {
        console.error('Failed to parse Furia Pay response:', parseError);
        return new Response(
          JSON.stringify({
            error: 'Invalid response from payment gateway',
            details: { status: lastStatus, body: lastBody },
          }),
          { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }
    }

    console.log('Furia Pay parsed response:', lastStatus, JSON.stringify(data, null, 2));

    if (!response.ok) {
      return new Response(
        JSON.stringify({
          error: (data.message as string) || `Payment failed with status ${lastStatus}`,
          details: data,
        }),
        { status: lastStatus || 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Return success response with payment data
    const pixData = data.pix as Record<string, unknown> | undefined;
    const cardData = data.card as Record<string, unknown> | undefined;

    return new Response(
      JSON.stringify({
        success: true,
        transactionId: data.id,
        status: data.status,
        paymentMethod: body.paymentMethod,
        // PIX specific data - note: API returns qrcode not qrCodeUrl
        ...(body.paymentMethod === 'pix' && pixData && {
          pix: {
            qrCode: pixData.qrcode || pixData.qrCode,
            expiresAt: pixData.expirationDate || pixData.expiresAt,
          },
        }),
        // Credit card specific data
        ...(body.paymentMethod === 'credit_card' && cardData && {
          cardLastDigits: cardData.lastDigits,
          cardBrand: cardData.brand,
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
