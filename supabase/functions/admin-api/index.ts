import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const ADMIN_PASSWORD = Deno.env.get("ADMIN_PASSWORD");

const handler = async (req: Request): Promise<Response> => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabase = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
    );

    const url = new URL(req.url);
    const action = url.searchParams.get("action");

    // Login action
    if (action === "login") {
      const { password } = await req.json();
      
      if (password !== ADMIN_PASSWORD) {
        return new Response(
          JSON.stringify({ error: "Senha incorreta" }),
          { status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }

      // Generate session token
      const sessionToken = crypto.randomUUID();
      
      // Save session
      const { error } = await supabase
        .from("admin_sessions")
        .insert({ session_token: sessionToken });

      if (error) {
        throw error;
      }

      return new Response(
        JSON.stringify({ success: true, sessionToken }),
        { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Validate session for other actions
    const authHeader = req.headers.get("Authorization");
    const sessionToken = authHeader?.replace("Bearer ", "");

    if (!sessionToken) {
      return new Response(
        JSON.stringify({ error: "Não autorizado" }),
        { status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const { data: session, error: sessionError } = await supabase
      .from("admin_sessions")
      .select("*")
      .eq("session_token", sessionToken)
      .gt("expires_at", new Date().toISOString())
      .maybeSingle();

    if (sessionError || !session) {
      return new Response(
        JSON.stringify({ error: "Sessão inválida ou expirada" }),
        { status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // List abandoned carts
    if (action === "list") {
      const { data: carts, error } = await supabase
        .from("abandoned_carts")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;

      return new Response(
        JSON.stringify({ success: true, carts }),
        { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Mark as contacted
    if (action === "contact") {
      const { id, notes } = await req.json();
      
      const { error } = await supabase
        .from("abandoned_carts")
        .update({ contacted: true, notes, updated_at: new Date().toISOString() })
        .eq("id", id);

      if (error) throw error;

      return new Response(
        JSON.stringify({ success: true }),
        { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Delete cart
    if (action === "delete") {
      const { id } = await req.json();
      
      const { error } = await supabase
        .from("abandoned_carts")
        .delete()
        .eq("id", id);

      if (error) throw error;

      return new Response(
        JSON.stringify({ success: true }),
        { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Logout
    if (action === "logout") {
      await supabase
        .from("admin_sessions")
        .delete()
        .eq("session_token", sessionToken);

      return new Response(
        JSON.stringify({ success: true }),
        { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    return new Response(
      JSON.stringify({ error: "Ação inválida" }),
      { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );

  } catch (error: any) {
    console.error("Admin API error:", error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
};

serve(handler);
