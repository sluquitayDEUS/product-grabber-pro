import { useCallback, useEffect, useRef } from "react";
import { supabase } from "@/integrations/supabase/client";

const PIXEL_ID = "1843828709886859";

const generateEventId = (): string => {
  return `${Date.now()}_${Math.random().toString(36).substring(2, 11)}`;
};

const isProduction = (): boolean => {
  if (typeof window === "undefined") return false;
  const hostname = window.location.hostname;
  const allowedDomains = [
    "shoppbr.shoppofertabr-aquavolt.shop",
    "www.shoppbr.shoppofertabr-aquavolt.shop",
    "promocao.shoppbr-aquavolt-promo.shop",
    "www.promocao.shoppbr-aquavolt-promo.shop",
  ];
  return allowedDomains.includes(hostname);
};

// Read browser cookie value
const getCookie = (name: string): string | undefined => {
  if (typeof document === "undefined") return undefined;
  const match = document.cookie.match(new RegExp(`(^| )${name}=([^;]+)`));
  return match ? decodeURIComponent(match[2]) : undefined;
};

// Get _fbc — if absent but fbclid is in URL, build it per Meta spec
const getFbc = (): string | undefined => {
  const cookie = getCookie("_fbc");
  if (cookie) return cookie;
  if (typeof window === "undefined") return undefined;
  const url = new URL(window.location.href);
  const fbclid = url.searchParams.get("fbclid");
  if (!fbclid) return undefined;
  const fbc = `fb.1.${Date.now()}.${fbclid}`;
  // Persist for subsequent events
  try {
    document.cookie = `_fbc=${fbc}; max-age=${60 * 60 * 24 * 90}; path=/`;
  } catch { /* ignore */ }
  return fbc;
};

const initPixel = (): void => {
  if (typeof window === "undefined") return;
  if (!isProduction()) {
    console.log("Meta Pixel: Disabled on non-production domain");
    return;
  }
  if ((window as any).fbq) return;

  const fbq = function (...args: any[]) {
    (fbq as any).callMethod
      ? (fbq as any).callMethod.apply(fbq, args)
      : (fbq as any).queue.push(args);
  };
  (fbq as any).push = fbq;
  (fbq as any).loaded = true;
  (fbq as any).version = "2.0";
  (fbq as any).queue = [];
  (window as any).fbq = fbq;
  (window as any)._fbq = fbq;

  const script = document.createElement("script");
  script.async = true;
  script.src = "https://connect.facebook.net/en_US/fbevents.js";
  document.head.appendChild(script);

  (window as any).fbq("init", PIXEL_ID);
  (window as any).fbq("track", "PageView");
};

interface CustomerParams {
  email?: string;
  phone?: string;
  name?: string;
  document?: string;
  street?: string;
  number?: string;
  complement?: string;
  neighborhood?: string;
  city?: string;
  state?: string;
  zipcode?: string;
}

interface TrackEventParams extends CustomerParams {
  value?: number;
  currency?: string;
  content_name?: string;
  content_id?: string;
  transaction_id?: string;
  quantity?: number;
}

// Advanced Matching for browser pixel (clear text — Meta hashes client-side)
const buildBrowserUserData = (params?: CustomerParams): Record<string, string> => {
  const ud: Record<string, string> = {};
  if (!params) return ud;

  if (params.email) ud.em = params.email.toLowerCase().trim();
  if (params.phone) {
    const clean = params.phone.replace(/\D/g, "");
    if (clean) ud.ph = clean.length >= 10 ? `55${clean}` : clean;
  }
  if (params.name) {
    const parts = params.name.trim().split(/\s+/);
    if (parts[0]) ud.fn = parts[0].toLowerCase();
    if (parts.length > 1) ud.ln = parts[parts.length - 1].toLowerCase();
  }
  if (params.document) {
    const cleanDoc = params.document.replace(/\D/g, "");
    if (cleanDoc) ud.external_id = cleanDoc;
  }
  if (params.city) ud.ct = params.city.toLowerCase().trim();
  if (params.state) ud.st = params.state.toLowerCase().trim();
  if (params.zipcode) {
    const cleanZip = params.zipcode.replace(/\D/g, "");
    if (cleanZip) ud.zp = cleanZip;
  }
  ud.country = "br";

  return ud;
};

// Send server-side event via Conversions API (deduped by event_id)
const sendCapiEvent = async (
  eventName: string,
  eventId: string,
  params?: TrackEventParams
) => {
  try {
    const customData: Record<string, unknown> = {};
    if (params?.value !== undefined) {
      customData.value = params.value;
      customData.currency = params.currency || "BRL";
    }
    if (params?.content_name) customData.content_name = params.content_name;
    if (params?.content_id) {
      customData.content_ids = [params.content_id];
      customData.content_type = "product";
    }
    if (params?.quantity) customData.num_items = params.quantity;
    if (params?.transaction_id) customData.order_id = params.transaction_id;

    await supabase.functions.invoke("meta-conversions-api", {
      body: {
        event_name: eventName,
        event_id: eventId,
        event_source_url: window.location.href,
        action_source: "website",
        user_data: {
          email: params?.email,
          phone: params?.phone,
          name: params?.name,
          document: params?.document,
          city: params?.city,
          state: params?.state,
          zipcode: params?.zipcode,
          fbp: getCookie("_fbp"),
          fbc: getFbc(),
          client_user_agent: navigator.userAgent,
        },
        custom_data: customData,
      },
    });
  } catch (err) {
    console.error("CAPI send failed:", err);
  }
};

export const useMetaPixel = () => {
  const initializedRef = useRef(false);
  const firedEventsRef = useRef(new Set<string>());

  useEffect(() => {
    if (!initializedRef.current) {
      initPixel();
      initializedRef.current = true;
    }
  }, []);

  const trackEvent = useCallback((eventName: string, params?: TrackEventParams) => {
    if (!isProduction()) {
      console.log(`Meta Pixel: Skipping ${eventName} on non-production`);
      return;
    }

    const dedupeKey = eventName === "Purchase"
      ? `${eventName}_${params?.transaction_id || Date.now()}`
      : eventName;

    if (firedEventsRef.current.has(dedupeKey)) {
      console.log(`Meta Pixel: ${eventName} already fired, skipping`);
      return;
    }

    if (!(window as any).fbq) return;

    const eventId = generateEventId();

    // Re-init with Advanced Matching for this event
    const userData = buildBrowserUserData(params);
    if (Object.keys(userData).length > 0) {
      (window as any).fbq("init", PIXEL_ID, userData);
    }

    const fbqParams: Record<string, any> = {};
    if (params?.value !== undefined) {
      fbqParams.value = params.value;
      fbqParams.currency = params.currency || "BRL";
    }
    if (params?.content_name) fbqParams.content_name = params.content_name;
    if (params?.content_id) {
      fbqParams.content_ids = [params.content_id];
      fbqParams.content_type = "product";
    }
    if (params?.quantity) fbqParams.num_items = params.quantity;
    if (params?.transaction_id) fbqParams.order_id = params.transaction_id;

    // 1) Browser Pixel
    (window as any).fbq("track", eventName, fbqParams, { eventID: eventId });
    console.log(`Meta Pixel (browser): ${eventName}`, fbqParams, eventId);

    // 2) Server-side CAPI (deduped via same event_id)
    sendCapiEvent(eventName, eventId, params);

    firedEventsRef.current.add(dedupeKey);
  }, []);

  const trackViewContent = useCallback((contentName: string, contentId: string, value?: number) => {
    trackEvent("ViewContent", { content_name: contentName, content_id: contentId, value, currency: "BRL" });
  }, [trackEvent]);

  const trackInitiateCheckout = useCallback((value: number, contentName: string, contentId: string) => {
    trackEvent("InitiateCheckout", { value, currency: "BRL", content_name: contentName, content_id: contentId });
  }, [trackEvent]);

  const trackAddToCart = useCallback((value: number, contentName: string, contentId: string) => {
    trackEvent("AddToCart", { value, currency: "BRL", content_name: contentName, content_id: contentId });
  }, [trackEvent]);

  const trackAddPaymentInfo = useCallback((params?: CustomerParams) => {
    trackEvent("AddPaymentInfo", params);
  }, [trackEvent]);

  const trackPurchase = useCallback((
    value: number,
    contentName: string,
    contentId: string,
    transactionId: string,
    customerData?: CustomerParams,
    quantity?: number
  ) => {
    trackEvent("Purchase", {
      value,
      currency: "BRL",
      content_name: contentName,
      content_id: contentId,
      transaction_id: transactionId,
      quantity,
      ...customerData,
    });
  }, [trackEvent]);

  return {
    trackEvent,
    trackViewContent,
    trackInitiateCheckout,
    trackAddToCart,
    trackAddPaymentInfo,
    trackPurchase,
  };
};
