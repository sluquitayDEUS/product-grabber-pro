import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};
const json = (b: unknown, status = 200) =>
  new Response(JSON.stringify(b), { status, headers: { ...corsHeaders, 'Content-Type': 'application/json' } });

serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response(null, { headers: corsHeaders });
  try {
    const apiKey = Deno.env.get('ABACATEPAY_API_KEY');
    if (!apiKey) return json({ error: 'Payment gateway not configured' }, 500);

    const body = await req.json();
    if (body.paymentMethod !== 'pix') return json({ error: 'Only PIX is supported' }, 400);
    const amount = Math.round(Number(body.amount));
    if (!Number.isFinite(amount) || amount < 100) return json({ error: 'Invalid amount' }, 400);

    const c = body.customer || {};
    const payload: Record<string, unknown> = {
      amount,
      expiresIn: 15 * 60,
      description: 'Pedido Shopee Oficial'.slice(0, 37),
      metadata: { externalId: `lov_${Date.now()}` },
    };
    const phone = String(c.phone || '').replace(/\D/g, '');
    const taxId = String(c.document || '').replace(/\D/g, '');
    if (c.name && c.email && phone && taxId) {
      payload.customer = { name: c.name, email: c.email, cellphone: phone, taxId };
    }

    const res = await fetch('https://api.abacatepay.com/v1/pixQrCode/create', {
      method: 'POST',
      headers: { Authorization: `Bearer ${apiKey}`, 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
    const text = await res.text();
    console.log('AbacatePay create:', res.status, text);
    let data: any = {};
    try { data = JSON.parse(text); } catch { /* ignore */ }
    if (!res.ok || data.error || !data.data) {
      return json({ error: data.error || `Payment failed (${res.status})` }, res.status >= 400 ? res.status : 500);
    }
    const d = data.data;
    return json({
      success: true,
      transactionId: d.id,
      status: String(d.status || 'PENDING').toLowerCase(),
      paymentMethod: 'pix',
      pix: { qrCode: d.brCode, qrCodeBase64: d.brCodeBase64, expiresAt: d.expiresAt },
    });
  } catch (e) {
    console.error(e);
    return json({ error: e instanceof Error ? e.message : 'Unknown error' }, 500);
  }
});
