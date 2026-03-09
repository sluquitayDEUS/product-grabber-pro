import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

async function hashSHA256(data: string): Promise<string> {
  const buf = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(data.toLowerCase().trim()));
  return Array.from(new Uint8Array(buf)).map(b => b.toString(16).padStart(2, "0")).join("");
}

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const accessToken = Deno.env.get("META_ACCESS_TOKEN");
    const pixelId = "2001064117481543";

    if (!accessToken) {
      return new Response(JSON.stringify({ error: "Meta access token not configured" }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } });
    }

    const body = await req.json();

    // Get real client IP
    const clientIp = req.headers.get("cf-connecting-ip")
      || req.headers.get("x-real-ip")
      || req.headers.get("x-forwarded-for")?.split(",")[0]?.trim()
      || "";

    // Build user_data with ALL parameters from Meta's spec
    const userData: Record<string, any> = {
      client_ip_address: clientIp,
      client_user_agent: body.user_agent || "",
    };

    // Cookie-based identifiers (fbc & fbp) — NOT hashed per Meta spec
    if (body.fbc) userData.fbc = body.fbc;
    if (body.fbp) userData.fbp = body.fbp;

    // Hashed PII fields
    if (body.email) userData.em = [await hashSHA256(body.email)];
    if (body.phone) {
      const clean = body.phone.replace(/\D/g, "");
      if (clean) userData.ph = [await hashSHA256(clean)];
    }
    if (body.name) {
      const parts = body.name.trim().split(/\s+/);
      if (parts[0]) userData.fn = [await hashSHA256(parts[0])];
      if (parts.length > 1) userData.ln = [await hashSHA256(parts[parts.length - 1])];
    }
    if (body.external_id) userData.external_id = [await hashSHA256(body.external_id)];

    // Country defaults to BR
    userData.country = [await hashSHA256("br")];

    // Build custom_data
    const customData: Record<string, any> = {};
    if (body.value !== undefined) {
      customData.value = body.value;
      customData.currency = body.currency || "BRL";
    }
    if (body.content_name) customData.content_name = body.content_name;
    if (body.content_id) {
      customData.content_ids = [body.content_id];
      customData.content_type = "product";
      customData.contents = [{ id: body.content_id, quantity: 1, item_price: body.value }];
    }
    if (body.transaction_id) customData.order_id = body.transaction_id;

    const eventData: Record<string, any> = {
      event_name: body.event_name,
      event_time: Math.floor(Date.now() / 1000),
      event_id: body.event_id,
      event_source_url: body.event_source_url || "",
      action_source: "website",
      user_data: userData,
      opt_out: false,
      data_processing_options: [],
      data_processing_options_country: 0,
      data_processing_options_state: 0,
    };

    if (Object.keys(customData).length > 0) eventData.custom_data = customData;

    const payload = { data: [eventData] };

    console.log("CAPI →", body.event_name, body.event_id);

    const response = await fetch(
      `https://graph.facebook.com/v21.0/${pixelId}/events?access_token=${accessToken}`,
      { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(payload) }
    );

    const result = await response.json();

    if (!response.ok) {
      console.error("Meta API error:", result);
      return new Response(JSON.stringify({ error: "Meta API error", details: result }),
        { status: response.status, headers: { ...corsHeaders, "Content-Type": "application/json" } });
    }

    return new Response(JSON.stringify({ success: true, events_received: result.events_received }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } });
  } catch (error) {
    console.error("CAPI error:", error);
    return new Response(JSON.stringify({ error: error instanceof Error ? error.message : "Unknown error" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } });
  }
});
