import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    // Get client IP from headers
    const clientIp = req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || 
                     req.headers.get("cf-connecting-ip") || 
                     req.headers.get("x-real-ip") || "";

    // Try ip-api.com (no CORS issues server-side, HTTP is fine from server)
    try {
      const url = clientIp 
        ? `http://ip-api.com/json/${clientIp}?fields=city,regionName,region,status`
        : `http://ip-api.com/json/?fields=city,regionName,region,status`;
      
      const res = await fetch(url);
      const data = await res.json();
      
      if (data.status === "success" && data.city && data.region) {
        return new Response(
          JSON.stringify({ city: data.city, state: data.region }),
          { headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
    } catch (e) {
      console.error("ip-api.com failed:", e);
    }

    // Fallback: ipwho.is (no CORS from server-side)
    try {
      const url = clientIp ? `https://ipwho.is/${clientIp}` : `https://ipwho.is/`;
      const res = await fetch(url);
      const data = await res.json();
      
      if (data.success !== false && data.city && data.region) {
        return new Response(
          JSON.stringify({ city: data.city, state: data.region }),
          { headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
    } catch (e) {
      console.error("ipwho.is failed:", e);
    }

    // Default fallback
    return new Response(
      JSON.stringify({ city: "São Paulo", state: "SP" }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (error) {
    console.error("Location error:", error);
    return new Response(
      JSON.stringify({ city: "São Paulo", state: "SP" }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
