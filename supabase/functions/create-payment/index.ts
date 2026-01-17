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

    // Clean document (CPF) - only digits
    const cleanDocument = body.customer.document.replace(/\D/g, '');

    // Build Furia Pay payload according to official documentation
    // https://furiapaybrasil.readme.io/reference/createpaymenttransaction
    const furiaPayload: Record<string, unknown> = {
      amount: body.amount,
      payment_method: body.paymentMethod, // snake_case as per docs
      customer: {
        name: body.customer.name,
        email: body.customer.email,
        document: {
          type: 'cpf',
          number: cleanDocument,
        },
        ...(body.customer.phone && {
          phone: body.customer.phone.replace(/\D/g, ''),
        }),
      },
      items: body.items.map(item => ({
        title: item.title,
        quantity: item.quantity,
        unit_price: item.unitPrice, // snake_case
        tangible: item.tangible,
      })),
      metadata: {
        source: 'aquavolt-checkout',
      },
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

    // Add PIX expiration if PIX payment (15 minutes = 900 seconds)
    if (body.paymentMethod === 'pix') {
      furiaPayload.pix = {
        expires_in: 900, // snake_case as per docs
      };
    }

    // Add shipping if provided
    if (body.shipping) {
      furiaPayload.shipping = {
        street: body.shipping.street,
        street_number: body.shipping.number, // snake_case
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
      furiaPayload.external_ref = body.externalRef; // snake_case
    }

    console.log('Sending to Furia Pay:', JSON.stringify(furiaPayload, null, 2));

    // Call Furia Pay API - official endpoint from documentation
    // https://furiapaybrasil.readme.io/reference/createpaymenttransaction
    // Endpoint: POST /v1/payment-transaction/create (singular, not plural)
    const apiUrl = 'https://api.furiapaybr.app/v1/payment-transaction/create';

    console.log('Calling Furia Pay API:', apiUrl);

    const response = await fetch(apiUrl, {
      method: 'POST',
      headers: {
        'Authorization': auth,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(furiaPayload),
    });

    const responseText = await response.text();
    console.log('Furia Pay raw response:', response.status, responseText);

    let data: Record<string, unknown> = {};
    if (responseText && responseText.trim()) {
      try {
        data = JSON.parse(responseText);
      } catch (parseError) {
        console.error('Failed to parse Furia Pay response:', parseError);
        return new Response(
          JSON.stringify({
            error: 'Invalid response from payment gateway',
            details: { status: response.status, body: responseText },
          }),
          { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }
    }

    console.log('Furia Pay parsed response:', response.status, JSON.stringify(data, null, 2));

    // Check for success=false in the response body
    const errorMessages = (data.error_messages as string[] | undefined) || [];
    if (data.success === false || errorMessages.length > 0) {
      const errorMessages = data.error_messages as string[] || [];
      const errorMessage = errorMessages.join(', ') || 'Payment failed';
      
      console.error('Furia Pay error:', errorMessage, data);
      
      return new Response(
        JSON.stringify({
          error: errorMessage,
          details: data,
        }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    if (!response.ok) {
      // Extract error message from response
      const errorMessage = (data.message as string) || 
                          (data.error as string) || 
                          `Payment failed with status ${response.status}`;
      
      console.error('Furia Pay error:', errorMessage, data);
      
      return new Response(
        JSON.stringify({
          error: errorMessage,
          details: data,
        }),
        { status: response.status || 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Response is wrapped in a "data" object according to Furia Pay API
    const paymentData = (data.data || data) as Record<string, unknown>;
    const pixData = paymentData.pix as Record<string, unknown> | undefined;
    const cardData = paymentData.card as Record<string, unknown> | undefined;

    return new Response(
      JSON.stringify({
        success: true,
        transactionId: paymentData.id,
        status: paymentData.status,
        paymentMethod: body.paymentMethod,
        // PIX specific data - API returns qr_code (snake_case)
        ...(body.paymentMethod === 'pix' && pixData && {
          pix: {
            qrCode: pixData.qr_code || pixData.qrcode || pixData.qrCode,
            expiresAt: pixData.expiration_date || pixData.expirationDate || pixData.expiresAt,
          },
        }),
        // Credit card specific data
        ...(body.paymentMethod === 'credit_card' && cardData && {
          cardLastDigits: cardData.last_digits || cardData.lastDigits,
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
