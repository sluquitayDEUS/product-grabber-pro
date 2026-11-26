import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};
const json = (b: unknown, status = 200) =>
  new Response(JSON.stringify(b), { status, headers: { ...corsHeaders, 'Content-Type': 'application/json' } });

function normalize(s: string) {
  const u = s.toUpperCase();
  if (u === 'PAID') return 'paid';
  if (u === 'PENDING') return 'pending';
  if (u === 'EXPIRED') return 'expired';
  if (u === 'REFUNDED') return 'refunded';
  if (u === 'CANCELLED' || u === 'CANCELED') return 'failed';
  return u.toLowerCase();
}

serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response(null, { headers: corsHeaders });
  if (req.method !== 'POST') return json({ error: 'Method not allowed' }, 405);
  try {
    const body = await req.json().catch(() => ({}));
    // Webhook from AbacatePay (billing.paid etc.) — acknowledge
    if (!body.transactionId) {
      console.log('AbacatePay webhook:', JSON.stringify(body));
      return json({ received: true });
    }
    const apiKey = Deno.env.get('ABACATEPAY_API_KEY');
    if (!apiKey) return json({ error: 'Payment gateway not configured' }, 500);

    const res = await fetch(
      `https://api.abacatepay.com/v1/pixQrCode/check?id=${encodeURIComponent(body.transactionId)}`,
      { headers: { Authorization: `Bearer ${apiKey}` } },
    );
    if (res.status === 429) return json({ success: true, transactionId: body.transactionId, status: 'pending' });
    const data: any = await res.json().catch(() => ({}));
    if (!res.ok || data.error) return json({ error: data.error || 'Status check failed' }, res.status || 500);
    const raw = String(data.data?.status ?? '');
    return json({ success: true, transactionId: body.transactionId, status: normalize(raw), rawStatus: raw });
  } catch (e) {
    return json({ error: e instanceof Error ? e.message : 'Unknown error' }, 500);
  }
});
