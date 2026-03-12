import { useCallback, useEffect, useRef } from "react";
import { supabase } from "@/integrations/supabase/client";

const PIXEL_ID = "712591894471734";
const STORAGE_KEY = "meta_pixel_events";

interface TrackedEvent {
  event_name: string;
  timestamp: number;
}

const generateEventId = (): string => {
  return `${Date.now()}_${Math.random().toString(36).substring(2, 11)}`;
};

const getVisitorId = (): string => {
  const key = "meta_visitor_id";
  let visitorId = localStorage.getItem(key);
  if (!visitorId) {
    visitorId = `visitor_${Date.now()}_${Math.random().toString(36).substring(2, 15)}`;
    localStorage.setItem(key, visitorId);
  }
  return visitorId;
};

const wasEventTracked = (eventName: string): boolean => {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (!stored) return false;
    const events: TrackedEvent[] = JSON.parse(stored);
    const oneDayAgo = Date.now() - 24 * 60 * 60 * 1000;
    const validEvents = events.filter(e => e.timestamp > oneDayAgo);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(validEvents));
    return validEvents.some(e => e.event_name === eventName);
  } catch {
    return false;
  }
};

const markEventTracked = (eventName: string): void => {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    const events: TrackedEvent[] = stored ? JSON.parse(stored) : [];
    events.push({ event_name: eventName, timestamp: Date.now() });
    localStorage.setItem(STORAGE_KEY, JSON.stringify(events));
  } catch {
    // Ignore
  }
};

const isProduction = (): boolean => {
  if (typeof window === "undefined") return false;
  const hostname = window.location.hostname;
  return hostname === "shoppbr.shoppofertabr-aquavolt.shop" || hostname === "www.shoppbr.shoppofertabr-aquavolt.shop";
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
};

interface CustomerParams {
  email?: string;
  phone?: string;
  name?: string;
  document?: string; // CPF
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
  skipDedupe?: boolean;
  quantity?: number;
}

export const useMetaPixel = () => {
  const initializedRef = useRef(false);

  useEffect(() => {
    if (!initializedRef.current) {
      initPixel();
      initializedRef.current = true;
    }
  }, []);

  const trackEvent = useCallback(async (eventName: string, params?: TrackEventParams) => {
    if (!isProduction()) {
      console.log(`Meta Pixel: Skipping ${eventName} on non-production domain`);
      return;
    }

    const skipDedupe = params?.skipDedupe || eventName === "Purchase";
    if (!skipDedupe && wasEventTracked(eventName)) {
      console.log(`Meta Pixel: Event ${eventName} already tracked, skipping`);
      return;
    }

    const eventId = generateEventId();
    const visitorId = getVisitorId();

    // Client-side tracking via fbq
    if ((window as any).fbq) {
      const fbqParams: Record<string, any> = {};
      if (params?.value) fbqParams.value = params.value;
      if (params?.currency) fbqParams.currency = params.currency;
      if (params?.content_name) fbqParams.content_name = params.content_name;
      if (params?.content_id) {
        fbqParams.content_ids = [params.content_id];
        fbqParams.content_type = "product";
      }
      if (params?.quantity) {
        fbqParams.num_items = params.quantity;
      }
      (window as any).fbq("track", eventName, fbqParams, { eventID: eventId });
      console.log(`Meta Pixel (client): ${eventName}`, fbqParams, eventId);
    }

    // Server-side CAPI tracking with full customer data
    try {
      await supabase.functions.invoke("meta-pixel", {
        body: {
          event_name: eventName,
          event_id: eventId,
          event_source_url: window.location.href,
          user_agent: navigator.userAgent,
          user_ip: "",
          // Customer identification data
          email: params?.email || "",
          phone: params?.phone || "",
          name: params?.name || "",
          document: params?.document || "",
          external_id: visitorId,
          // Address data
          city: params?.city || "",
          state: params?.state || "",
          zipcode: params?.zipcode || "",
          street: params?.street || "",
          neighborhood: params?.neighborhood || "",
          // Commerce data
          value: params?.value,
          currency: params?.currency || "BRL",
          content_name: params?.content_name,
          content_id: params?.content_id,
          transaction_id: params?.transaction_id,
          quantity: params?.quantity,
        },
      });
      console.log(`Meta Pixel (CAPI): ${eventName} sent successfully`);
    } catch (err) {
      console.error(`Meta Pixel (CAPI): Failed to send ${eventName}`, err);
    }

    if (!skipDedupe) {
      markEventTracked(eventName);
    }
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
      skipDedupe: true,
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
