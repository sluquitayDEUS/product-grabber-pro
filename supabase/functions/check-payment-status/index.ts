import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const publicKey = Deno.env.get('FURIAPAY_PUBLIC_KEY');
    const secretKey = Deno.env.get('FURIAPAY_SECRET_KEY');

    if (!publicKey || !secretKey) {
      return new Response(
        JSON.stringify({ error: 'Payment gateway not configured' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const body = await req.json();
    if (!body.transactionId) {
      return new Response(
        JSON.stringify({ error: 'Transaction ID is required' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const auth = `Basic ${btoa(`${publicKey}:${secretKey}`)}`;
    const apiUrl = `https://api.furiapaybr.app/v1/payment-transaction/info/${body.transactionId}`;

    const response = await fetch(apiUrl, {
      method: 'GET',
      headers: { 'Authorization': auth, 'Content-Type': 'application/json' },
    });

    const responseText = await response.text();

    let data: Record<string, unknown> = {};
    if (responseText?.trim()) {
      try { data = JSON.parse(responseText); } catch {
        return new Response(
          JSON.stringify({ error: 'Invalid response from payment gateway' }),
          { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }
    }

    // Handle 429 rate limit gracefully — return PENDING instead of error
    if (response.status === 429) {
      return new Response(
        JSON.stringify({ success: true, status: "pending", rawStatus: "PENDING", transactionId: body.transactionId, rateLimited: true }),
        { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    if (!response.ok) {
      return new Response(
        JSON.stringify({ error: 'Failed to check payment status', details: data }),
        { status: response.status || 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const paymentData = (data.data || data) as Record<string, unknown>;
    const rawStatus = String(paymentData.status ?? "");

    return new Response(
      JSON.stringify({
        success: true,
        transactionId: paymentData.id,
        status: rawStatus.toLowerCase(),
        rawStatus,
        paymentMethod: paymentData.payment_method,
        paidAt: paymentData.paid_at || null,
      }),
      { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : 'Unknown error' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
