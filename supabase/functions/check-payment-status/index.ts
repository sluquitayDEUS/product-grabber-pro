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
    // NOTE: We try multiple base URLs because some accounts/environments respond on different domains.
    const statusEndpoints = [
      `https://api.furiapaybr.app/v1/payment-transactions/${body.transactionId}`,
      `https://api.furiapaybr.app/v1/transactions/${body.transactionId}`,
      `https://api.furiapaybr.com/v1/payment-transactions/${body.transactionId}`,
      `https://api.furiapaybr.com/v1/transactions/${body.transactionId}`,
    ];

    let lastStatus = 0;
    let lastBody = '';
    let response: Response | null = null;

    for (const url of statusEndpoints) {
      response = await fetch(url, {
        method: 'GET',
        headers: {
          'Authorization': auth,
          'Content-Type': 'application/json',
        },
      });

      lastStatus = response.status;
      lastBody = await response.text();
      console.log('Furia Pay status raw response:', url, lastStatus, lastBody);

      if (lastStatus === 404) continue;
      break;
    }

    if (!response) {
      return new Response(
        JSON.stringify({ error: 'Failed to check payment status' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    let data: Record<string, unknown> = {};
    if (lastBody && lastBody.trim()) {
      try {
        data = JSON.parse(lastBody);
      } catch (parseError) {
        console.error('Failed to parse Furia Pay status response:', parseError);
        return new Response(
          JSON.stringify({
            error: 'Invalid response from payment gateway',
            details: { status: lastStatus, body: lastBody },
          }),
          { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }
    }

    console.log('Furia Pay status parsed response:', lastStatus, JSON.stringify(data, null, 2));

    if (!response.ok) {
      return new Response(
        JSON.stringify({
          error: (data.message as string) || 'Failed to check payment status',
          details: data,
        }),
        { status: lastStatus || 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
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
