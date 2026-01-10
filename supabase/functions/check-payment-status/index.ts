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
    const secretKey = Deno.env.get('PAYMENT_GATEWAY_SECRET_KEY');

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

    // Build authentication header (Basic Auth)
    const auth = 'Basic ' + btoa(`${publicKey}:${secretKey}`);

    // Call Furia Pay API to get transaction status
    const response = await fetch(`https://api.furiapaybr.com/v1/transactions/${body.transactionId}`, {
      method: 'GET',
      headers: {
        'Authorization': auth,
        'Content-Type': 'application/json',
      },
    });

    const data = await response.json();
    console.log('Furia Pay status response:', response.status, JSON.stringify(data, null, 2));

    if (!response.ok) {
      return new Response(
        JSON.stringify({ 
          error: data.message || 'Failed to check payment status',
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
