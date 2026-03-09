import { useCallback, useEffect, useRef } from "react";
import { supabase } from "@/integrations/supabase/client";

const PIXEL_ID = "2001064117481543";
const STORAGE_KEY = "meta_pixel_events";

interface TrackedEvent {
  event_name: string;
  timestamp: number;
}

const generateEventId = (): string =>
  `${Date.now()}_${Math.random().toString(36).substring(2, 11)}`;

const getVisitorId = (): string => {
  const key = "meta_visitor_id";
  let id = localStorage.getItem(key);
  if (!id) {
    id = `visitor_${Date.now()}_${Math.random().toString(36).substring(2, 15)}`;
    localStorage.setItem(key, id);
  }
  return id;
};

const wasEventTracked = (eventName: string): boolean => {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (!stored) return false;
    const events: TrackedEvent[] = JSON.parse(stored);
    const oneDayAgo = Date.now() - 86400000;
    const valid = events.filter(e => e.timestamp > oneDayAgo);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(valid));
    return valid.some(e => e.event_name === eventName);
  } catch { return false; }
};

const markEventTracked = (eventName: string): void => {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    const events: TrackedEvent[] = stored ? JSON.parse(stored) : [];
    events.push({ event_name: eventName, timestamp: Date.now() });
    localStorage.setItem(STORAGE_KEY, JSON.stringify(events));
  } catch {}
};

const isProduction = (): boolean => {
  if (typeof window === "undefined") return false;
  const h = window.location.hostname;
  if (h.includes("localhost") || h.includes("127.0.0.1")) return false;
  if (h.startsWith("id-preview--")) return false;
  return true;
};

// Get browser cookies for fbc/fbp
const getCookie = (name: string): string | undefined => {
  try {
    const match = document.cookie.match(new RegExp('(^| )' + name + '=([^;]+)'));
    return match ? match[2] : undefined;
  } catch { return undefined; }
};

const initPixel = (): void => {
  if (typeof window === "undefined") return;
  if (!isProduction()) return;
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
};

export const useMetaPixel = () => {
  const initializedRef = useRef(false);

  useEffect(() => {
    if (!initializedRef.current) {
      initPixel();
      initializedRef.current = true;
    }
  }, []);

  const sendServerEvent = useCallback(async (
    eventName: string,
    eventId: string,
    params?: {
      value?: number;
      currency?: string;
      content_name?: string;
      content_id?: string;
      email?: string;
      phone?: string;
      name?: string;
      transaction_id?: string;
    }
  ) => {
    try {
      const fbc = getCookie("_fbc") || "";
      const fbp = getCookie("_fbp") || "";
      
      await supabase.functions.invoke("meta-pixel", {
        body: {
          event_name: eventName,
          event_id: eventId,
          event_source_url: window.location.href,
          user_agent: navigator.userAgent,
          fbc,
          fbp,
          external_id: getVisitorId(),
          email: params?.email,
          phone: params?.phone,
          name: params?.name,
          value: params?.value,
          currency: params?.currency || "BRL",
          content_name: params?.content_name,
          content_id: params?.content_id,
          transaction_id: params?.transaction_id,
        },
      });
    } catch (err) {
      console.error("CAPI send error:", err);
    }
  }, []);

  const trackEvent = useCallback(async (
    eventName: string,
    params?: {
      value?: number;
      currency?: string;
      content_name?: string;
      content_id?: string;
      email?: string;
      phone?: string;
      name?: string;
      transaction_id?: string;
      skipDedupe?: boolean;
    }
  ) => {
    if (!isProduction()) return;

    const skipDedupe = params?.skipDedupe || eventName === "Purchase";
    if (!skipDedupe && wasEventTracked(eventName)) return;

    const eventId = generateEventId();

    // Client-side fbq
    if ((window as any).fbq) {
      const fbqParams: Record<string, any> = {};
      if (params?.value) fbqParams.value = params.value;
      if (params?.currency) fbqParams.currency = params.currency;
      if (params?.content_name) fbqParams.content_name = params.content_name;
      if (params?.content_id) {
        fbqParams.content_ids = [params.content_id];
        fbqParams.content_type = "product";
      }
      (window as any).fbq("track", eventName, fbqParams, { eventID: eventId });
    }

    // Server-side CAPI
    sendServerEvent(eventName, eventId, params);

    if (!skipDedupe) markEventTracked(eventName);
  }, [sendServerEvent]);

  const trackViewContent = useCallback((contentName: string, contentId: string, value?: number) => {
    trackEvent("ViewContent", { content_name: contentName, content_id: contentId, value, currency: "BRL" });
  }, [trackEvent]);

  const trackInitiateCheckout = useCallback((value: number, contentName: string, contentId: string) => {
    trackEvent("InitiateCheckout", { value, currency: "BRL", content_name: contentName, content_id: contentId });
  }, [trackEvent]);

  const trackAddToCart = useCallback((value: number, contentName: string, contentId: string) => {
    trackEvent("AddToCart", { value, currency: "BRL", content_name: contentName, content_id: contentId });
  }, [trackEvent]);

  const trackAddPaymentInfo = useCallback((email?: string, phone?: string, name?: string) => {
    trackEvent("AddPaymentInfo", { email, phone, name });
  }, [trackEvent]);

  const trackPurchase = useCallback((
    value: number, contentName: string, contentId: string, transactionId: string,
    email?: string, phone?: string, name?: string
  ) => {
    trackEvent("Purchase", {
      value, currency: "BRL", content_name: contentName, content_id: contentId,
      transaction_id: transactionId, email, phone, name, skipDedupe: true,
    });
  }, [trackEvent]);

  return { trackEvent, trackViewContent, trackInitiateCheckout, trackAddToCart, trackAddPaymentInfo, trackPurchase };
};
