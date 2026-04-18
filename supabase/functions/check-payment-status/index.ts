import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface StatusRequest {
  transactionId: string;
}

const SIGILO_TX_URL = 'https://app.sigilopay.com.br/api/v1/gateway/transactions';

// Normalize SigiloPay status to our internal status
function normalizeStatus(raw: string): string {
  const s = raw.toUpperCase();
  if (s === 'COMPLETED' || s === 'PAID') return 'paid';
  if (s === 'PENDING') return 'pending';
  if (s === 'REFUNDED') return 'refunded';
  if (s === 'CHARGED_BACK') return 'chargeback';
  if (s === 'FAILED' || s === 'REJECTED' || s === 'CANCELED') return 'failed';
  return s.toLowerCase();
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  // SigiloPay webhook callback (POST without transactionId in body)
  // We just acknowledge — the frontend polls for status independently.
  if (req.method === 'POST') {
    try {
      const body = await req.json().catch(() => ({}));
      // If this looks like a webhook (no transactionId field), ack it
      if (!body.transactionId) {
        console.log('SigiloPay webhook received:', JSON.stringify(body));
        return new Response(
          JSON.stringify({ received: true }),
          { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }

      // Otherwise treat as status check
      return await handleStatusCheck(body as StatusRequest);
    } catch (error) {
      console.error('Webhook/status error:', error);
      return new Response(
        JSON.stringify({ error: error instanceof Error ? error.message : 'Unknown error' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }
  }

  return new Response(
    JSON.stringify({ error: 'Method not allowed' }),
    { status: 405, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
  );
});

async function handleStatusCheck(body: StatusRequest): Promise<Response> {
  const publicKey = Deno.env.get('SIGILOPAY_PUBLIC_KEY');
  const secretKey = Deno.env.get('SIGILOPAY_SECRET_KEY');

  if (!publicKey || !secretKey) {
    console.error('Missing SigiloPay credentials');
    return new Response(
      JSON.stringify({ error: 'Payment gateway not configured' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }

  if (!body.transactionId) {
    return new Response(
      JSON.stringify({ error: 'Transaction ID is required' }),
      { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }

  console.log('Checking SigiloPay payment status for:', body.transactionId);

  const apiUrl = `${SIGILO_TX_URL}?id=${encodeURIComponent(body.transactionId)}`;

  const response = await fetch(apiUrl, {
    method: 'GET',
    headers: {
      'x-public-key': publicKey,
      'x-secret-key': secretKey,
      'Content-Type': 'application/json',
    },
  });

  const responseText = await response.text();
  console.log('SigiloPay status raw response:', response.status, responseText);

  // Rate limiting → return pending
  if (response.status === 429) {
    return new Response(
      JSON.stringify({
        success: true,
        transactionId: body.transactionId,
        status: 'pending',
        rawStatus: 'RATE_LIMITED',
        paymentMethod: null,
        paidAt: null,
      }),
      { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }

  let data: Record<string, unknown> = {};
  if (responseText && responseText.trim()) {
    try {
      data = JSON.parse(responseText);
    } catch (parseError) {
      console.error('Failed to parse status response:', parseError);
      return new Response(
        JSON.stringify({ error: 'Invalid response from payment gateway' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }
  }

  if (!response.ok) {
    const errorMessage =
      (data.message as string) ||
      (data.errorDescription as string) ||
      'Failed to check payment status';
    return new Response(
      JSON.stringify({ error: errorMessage, details: data }),
      { status: response.status || 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }

  const rawStatus = String(data.status ?? '');
  const normalizedStatus = normalizeStatus(rawStatus);

  return new Response(
    JSON.stringify({
      success: true,
      transactionId: data.id || body.transactionId,
      status: normalizedStatus,
      rawStatus,
      paymentMethod: data.paymentMethod || null,
      paidAt: data.payedAt || null,
    }),
    { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
  );
}
