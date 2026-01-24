import { useCallback, useEffect, useRef } from "react";
import { supabase } from "@/integrations/supabase/client";

const PIXEL_ID = "1428100488706955";
const STORAGE_KEY = "meta_pixel_events";

interface TrackedEvent {
  event_name: string;
  timestamp: number;
}

// Generate unique event ID for deduplication
const generateEventId = (): string => {
  return `${Date.now()}_${Math.random().toString(36).substring(2, 11)}`;
};

// Get visitor ID based on fingerprint (stored in localStorage)
const getVisitorId = (): string => {
  const key = "meta_visitor_id";
  let visitorId = localStorage.getItem(key);
  if (!visitorId) {
    visitorId = `visitor_${Date.now()}_${Math.random().toString(36).substring(2, 15)}`;
    localStorage.setItem(key, visitorId);
  }
  return visitorId;
};

// Check if event was already tracked (deduplication)
const wasEventTracked = (eventName: string): boolean => {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (!stored) return false;
    
    const events: TrackedEvent[] = JSON.parse(stored);
    const now = Date.now();
    const oneDayAgo = now - 24 * 60 * 60 * 1000; // 24 hours
    
    // Clean old events
    const validEvents = events.filter(e => e.timestamp > oneDayAgo);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(validEvents));
    
    return validEvents.some(e => e.event_name === eventName);
  } catch {
    return false;
  }
};

// Mark event as tracked
const markEventTracked = (eventName: string): void => {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    const events: TrackedEvent[] = stored ? JSON.parse(stored) : [];
    events.push({ event_name: eventName, timestamp: Date.now() });
    localStorage.setItem(STORAGE_KEY, JSON.stringify(events));
  } catch {
    // Ignore storage errors
  }
};

// Check if running on production domain
//
// IMPORTANT:
// - We allow tracking on the published *.lovable.app domain.
// - We block tracking on preview domains (id-preview--*.lovable.app) and localhost.
const isProduction = (): boolean => {
  if (typeof window === "undefined") return false;
  const hostname = window.location.hostname;

  if (hostname.includes("localhost") || hostname.includes("127.0.0.1")) return false;
  if (hostname.startsWith("id-preview--")) return false;

  return true;
};

// Initialize Meta Pixel base code
const initPixel = (): void => {
  if (typeof window === "undefined") return;
  if (!isProduction()) {
    console.log("Meta Pixel: Disabled on non-production domain");
    return;
  }
  if ((window as any).fbq) return;

  const fbq = function(...args: any[]) {
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

  // Load the Facebook pixel script
  const script = document.createElement("script");
  script.async = true;
  script.src = "https://connect.facebook.net/en_US/fbevents.js";
  document.head.appendChild(script);

  // Initialize pixel
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
    // Skip tracking on non-production domains
    if (!isProduction()) {
      console.log(`Meta Pixel: Skipping ${eventName} on non-production domain`);
      return;
    }

    // Check deduplication (skip for Purchase which should always track)
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

      (window as any).fbq("track", eventName, fbqParams, { eventID: eventId });
      console.log(`Meta Pixel (client): ${eventName}`, fbqParams, eventId);
    }

    // Server-side tracking via Conversion API
    try {
      const { data, error } = await supabase.functions.invoke("meta-pixel", {
        body: {
          event_name: eventName,
          event_id: eventId,
          event_source_url: window.location.href,
          user_ip: "", // Will be detected server-side
          user_agent: navigator.userAgent,
          email: params?.email,
          phone: params?.phone,
          name: params?.name,
          external_id: visitorId,
          value: params?.value,
          currency: params?.currency || "BRL",
          content_name: params?.content_name,
          content_id: params?.content_id,
          transaction_id: params?.transaction_id,
        },
      });

      if (error) {
        console.error("Meta Pixel CAPI error:", error);
      } else {
        console.log(`Meta Pixel (server): ${eventName}`, data);
      }
    } catch (err) {
      console.error("Meta Pixel CAPI error:", err);
    }

    // Mark event as tracked (for deduplication)
    if (!skipDedupe) {
      markEventTracked(eventName);
    }
  }, []);

  const trackViewContent = useCallback((contentName: string, contentId: string, value?: number) => {
    trackEvent("ViewContent", {
      content_name: contentName,
      content_id: contentId,
      value,
      currency: "BRL",
    });
  }, [trackEvent]);

  const trackInitiateCheckout = useCallback((value: number, contentName: string, contentId: string) => {
    trackEvent("InitiateCheckout", {
      value,
      currency: "BRL",
      content_name: contentName,
      content_id: contentId,
    });
  }, [trackEvent]);

  const trackAddToCart = useCallback((value: number, contentName: string, contentId: string) => {
    trackEvent("AddToCart", {
      value,
      currency: "BRL",
      content_name: contentName,
      content_id: contentId,
    });
  }, [trackEvent]);

  const trackAddPaymentInfo = useCallback((email?: string, phone?: string, name?: string) => {
    trackEvent("AddPaymentInfo", {
      email,
      phone,
      name,
    });
  }, [trackEvent]);

  const trackPurchase = useCallback((
    value: number,
    contentName: string,
    contentId: string,
    transactionId: string,
    email?: string,
    phone?: string,
    name?: string
  ) => {
    trackEvent("Purchase", {
      value,
      currency: "BRL",
      content_name: contentName,
      content_id: contentId,
      transaction_id: transactionId,
      email,
      phone,
      name,
      skipDedupe: true, // Always track purchases
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
