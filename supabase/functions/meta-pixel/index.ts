import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface MetaEventData {
  event_name: string;
  event_time: number;
  event_id: string;
  event_source_url: string;
  action_source: string;
  user_data: {
    client_ip_address?: string;
    client_user_agent?: string;
    em?: string[];
    ph?: string[];
    fn?: string[];
    external_id?: string[];
  };
  custom_data?: {
    value?: number;
    currency?: string;
    content_name?: string;
    content_ids?: string[];
    content_type?: string;
    contents?: Array<{
      id: string;
      quantity: number;
      item_price?: number;
    }>;
  };
}

interface RequestBody {
  event_name: string;
  event_id: string;
  event_source_url: string;
  user_ip: string;
  user_agent: string;
  email?: string;
  phone?: string;
  name?: string;
  external_id?: string;
  value?: number;
  currency?: string;
  content_name?: string;
  content_id?: string;
  transaction_id?: string;
}

// Hash SHA-256
async function hashData(data: string): Promise<string> {
  const encoder = new TextEncoder();
  const dataBuffer = encoder.encode(data.toLowerCase().trim());
  const hashBuffer = await crypto.subtle.digest("SHA-256", dataBuffer);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map(b => b.toString(16).padStart(2, "0")).join("");
}

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const accessToken = Deno.env.get("META_ACCESS_TOKEN");
    const pixelId = "1428100488706955";

    if (!accessToken) {
      console.error("META_ACCESS_TOKEN not configured");
      return new Response(
        JSON.stringify({ error: "Meta access token not configured" }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const body: RequestBody = await req.json();
    console.log("Received event request:", body.event_name, body.event_id);

    // Get real client IP from headers (Cloudflare/proxy headers)
    const clientIp = req.headers.get("cf-connecting-ip") 
      || req.headers.get("x-real-ip") 
      || req.headers.get("x-forwarded-for")?.split(",")[0]?.trim()
      || body.user_ip
      || "";

    // Build user_data with hashed values
    const userData: MetaEventData["user_data"] = {
      client_ip_address: clientIp,
      client_user_agent: body.user_agent,
    };

    if (body.email) {
      userData.em = [await hashData(body.email)];
    }
    if (body.phone) {
      const cleanPhone = body.phone.replace(/\D/g, "");
      userData.ph = [await hashData(cleanPhone)];
    }
    if (body.name) {
      const firstName = body.name.split(" ")[0];
      userData.fn = [await hashData(firstName)];
    }
    if (body.external_id) {
      userData.external_id = [await hashData(body.external_id)];
    }

    // Build custom_data based on event type
    const customData: MetaEventData["custom_data"] = {};
    
    if (body.value !== undefined) {
      customData.value = body.value;
      customData.currency = body.currency || "BRL";
    }
    if (body.content_name) {
      customData.content_name = body.content_name;
    }
    if (body.content_id) {
      customData.content_ids = [body.content_id];
      customData.content_type = "product";
      customData.contents = [{
        id: body.content_id,
        quantity: 1,
        item_price: body.value,
      }];
    }

    const eventData: MetaEventData = {
      event_name: body.event_name,
      event_time: Math.floor(Date.now() / 1000),
      event_id: body.event_id,
      event_source_url: body.event_source_url,
      action_source: "website",
      user_data: userData,
    };

    if (Object.keys(customData).length > 0) {
      eventData.custom_data = customData;
    }

    // Attach transaction_id as order_id for Purchase (helps attribution & debugging)
    if (body.transaction_id) {
      customData.content_ids = customData.content_ids || [];
      (customData as any).order_id = body.transaction_id;
    }

    const payload = {
      data: [eventData],
    };

    console.log("Sending to Meta:", JSON.stringify(payload, null, 2));

    const response = await fetch(
      `https://graph.facebook.com/v18.0/${pixelId}/events?access_token=${accessToken}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      }
    );

    const result = await response.json();
    console.log("Meta API response:", result);

    if (!response.ok) {
      console.error("Meta API error:", result);
      return new Response(
        JSON.stringify({ error: "Meta API error", details: result }),
        { status: response.status, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    return new Response(
      JSON.stringify({ success: true, events_received: result.events_received }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (error) {
    console.error("Error processing meta pixel event:", error);
    const message = error instanceof Error ? error.message : "Unknown error";
    return new Response(
      JSON.stringify({ error: message }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
