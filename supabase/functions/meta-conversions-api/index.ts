import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const PIXEL_ID = "1843828709886859";
const API_VERSION = "v21.0";

interface CustomerData {
  email?: string;
  phone?: string;
  name?: string;
  document?: string; // CPF
  city?: string;
  state?: string;
  zipcode?: string;
  street?: string;
  neighborhood?: string;
  dob?: string; // YYYYMMDD
  gender?: 'm' | 'f';
}

interface CustomData {
  value?: number;
  currency?: string;
  content_name?: string;
  content_ids?: string[];
  content_type?: string;
  num_items?: number;
  order_id?: string;
}

interface CapiRequest {
  event_name: string;
  event_id: string;
  event_source_url: string;
  action_source?: 'website' | 'email' | 'app' | 'phone_call' | 'chat' | 'physical_store' | 'system_generated' | 'other';
  user_data: CustomerData & {
    fbp?: string;
    fbc?: string;
    client_user_agent?: string;
    client_ip_address?: string;
  };
  custom_data?: CustomData;
}

async function sha256(input: string): Promise<string> {
  const data = new TextEncoder().encode(input);
  const hash = await crypto.subtle.digest("SHA-256", data);
  return Array.from(new Uint8Array(hash))
    .map(b => b.toString(16).padStart(2, "0"))
    .join("");
}

const normalize = {
  email: (v: string) => v.toLowerCase().trim(),
  phone: (v: string) => {
    const digits = v.replace(/\D/g, "");
    // Brazilian numbers: prefix with 55 if not present
    if (digits.length >= 10 && digits.length <= 11) return `55${digits}`;
    return digits;
  },
  name: (v: string) => v.toLowerCase().trim().replace(/\s+/g, ""),
  city: (v: string) => v.toLowerCase().replace(/[^a-z]/g, ""),
  state: (v: string) => v.toLowerCase().replace(/[^a-z]/g, "").slice(0, 2),
  zip: (v: string) => v.replace(/\D/g, ""),
  document: (v: string) => v.replace(/\D/g, ""),
  country: () => "br",
};

async function buildHashedUserData(ud: CapiRequest["user_data"]): Promise<Record<string, string | string[]>> {
  const out: Record<string, string | string[]> = {};

  if (ud.email) out.em = await sha256(normalize.email(ud.email));
  if (ud.phone) {
    const ph = normalize.phone(ud.phone);
    if (ph) out.ph = await sha256(ph);
  }
  if (ud.name) {
    const parts = ud.name.trim().split(/\s+/);
    if (parts[0]) out.fn = await sha256(normalize.name(parts[0]));
    if (parts.length > 1) out.ln = await sha256(normalize.name(parts[parts.length - 1]));
  }
  if (ud.city) out.ct = await sha256(normalize.city(ud.city));
  if (ud.state) out.st = await sha256(normalize.state(ud.state));
  if (ud.zipcode) {
    const z = normalize.zip(ud.zipcode);
    if (z) out.zp = await sha256(z);
  }
  out.country = await sha256(normalize.country());

  if (ud.document) {
    const doc = normalize.document(ud.document);
    if (doc) out.external_id = await sha256(doc);
  }

  if (ud.dob) out.db = await sha256(ud.dob.replace(/\D/g, ""));
  if (ud.gender) out.ge = await sha256(ud.gender);

  // Non-hashed fields
  if (ud.fbp) (out as any).fbp = ud.fbp;
  if (ud.fbc) (out as any).fbc = ud.fbc;
  if (ud.client_user_agent) (out as any).client_user_agent = ud.client_user_agent;
  if (ud.client_ip_address) (out as any).client_ip_address = ud.client_ip_address;

  return out;
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const accessToken = Deno.env.get('META_CAPI_ACCESS_TOKEN');
    if (!accessToken) {
      return new Response(JSON.stringify({ error: 'CAPI not configured' }), {
        status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const body: CapiRequest = await req.json();

    // Capture client IP from request headers if not provided
    const forwarded = req.headers.get('x-forwarded-for') || '';
    const clientIp = body.user_data.client_ip_address || forwarded.split(',')[0]?.trim() || '';
    const userAgent = body.user_data.client_user_agent || req.headers.get('user-agent') || '';

    const userData = await buildHashedUserData({
      ...body.user_data,
      client_ip_address: clientIp,
      client_user_agent: userAgent,
    });

    const event = {
      event_name: body.event_name,
      event_time: Math.floor(Date.now() / 1000),
      event_id: body.event_id,
      event_source_url: body.event_source_url,
      action_source: body.action_source || 'website',
      user_data: userData,
      custom_data: body.custom_data || {},
    };

    const payload = { data: [event] };

    const url = `https://graph.facebook.com/${API_VERSION}/${PIXEL_ID}/events?access_token=${accessToken}`;
    console.log('Sending CAPI event:', body.event_name, body.event_id);

    const response = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });

    const responseData = await response.json();
    console.log('CAPI response:', response.status, JSON.stringify(responseData));

    if (!response.ok) {
      return new Response(JSON.stringify({ error: 'CAPI failed', details: responseData }), {
        status: response.status, headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    return new Response(JSON.stringify({ success: true, data: responseData }), {
      status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('CAPI error:', error);
    return new Response(JSON.stringify({ error: error instanceof Error ? error.message : 'Unknown' }), {
      status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
