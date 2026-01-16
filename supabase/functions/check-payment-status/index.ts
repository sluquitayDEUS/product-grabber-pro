import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface StatusRequest {
  transactionId: string;
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
      console.error('Missing Furia Pay credentials');
      return new Response(
        JSON.stringify({ error: 'Payment gateway not configured' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const body: StatusRequest = await req.json();
    
    if (!body.transactionId) {
      return new Response(
        JSON.stringify({ error: 'Transaction ID is required' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    console.log('Checking payment status for:', body.transactionId);

    // Build authentication header (Basic Auth as per Furia Pay documentation)
    const credentials = `${publicKey}:${secretKey}`;
    const encodedCredentials = btoa(credentials);
    const auth = `Basic ${encodedCredentials}`;

    // Call Furia Pay API to get transaction status
    const response = await fetch(`https://api.furiapaybr.app/v1/payment-transactions/${body.transactionId}`, {
      method: 'GET',
      headers: {
        'Authorization': auth,
        'Content-Type': 'application/json',
      },
    });

    // Handle empty response body
    const responseText = await response.text();
    console.log('Furia Pay status raw response:', response.status, responseText);

    let data: Record<string, unknown> = {};
    if (responseText && responseText.trim()) {
      try {
        data = JSON.parse(responseText);
      } catch (parseError) {
        console.error('Failed to parse Furia Pay status response:', parseError);
        return new Response(
          JSON.stringify({ 
            error: 'Invalid response from payment gateway',
            details: { status: response.status, body: responseText }
          }),
          { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }
    }

    console.log('Furia Pay status parsed response:', response.status, JSON.stringify(data, null, 2));

    if (!response.ok) {
      return new Response(
        JSON.stringify({ 
          error: (data.message as string) || 'Failed to check payment status',
          details: data 
        }),
        { status: response.status, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Return status
    return new Response(
      JSON.stringify({
        success: true,
        transactionId: data.id,
        status: data.status, // 'pending', 'paid', 'refused', 'refunded', etc.
        paymentMethod: data.paymentMethod,
        paidAt: data.paidAt || null,
      }),
      { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('Check payment status error:', error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : 'Unknown error' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
