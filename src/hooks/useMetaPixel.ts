import { useCallback, useEffect, useRef } from "react";

const PIXEL_ID = "911500998376053";

const generateEventId = (): string => {
  return `${Date.now()}_${Math.random().toString(36).substring(2, 11)}`;
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

  // Init with empty — we'll use Advanced Matching on each event
  (window as any).fbq("init", PIXEL_ID);
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

// Build Advanced Matching user data for fbq
const buildUserData = (params?: CustomerParams): Record<string, string> => {
  const ud: Record<string, string> = {};
  if (!params) return ud;

  if (params.email) ud.em = params.email.toLowerCase().trim();
  if (params.phone) {
    const clean = params.phone.replace(/\D/g, "");
    if (clean) ud.ph = clean;
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

    // Deduplicate per page session (except Purchase which always fires)
    const dedupeKey = eventName === "Purchase"
      ? `${eventName}_${params?.transaction_id || Date.now()}`
      : eventName;

    if (firedEventsRef.current.has(dedupeKey)) {
      console.log(`Meta Pixel: ${eventName} already fired this session, skipping`);
      return;
    }

    if (!(window as any).fbq) return;

    const eventId = generateEventId();

    // Update user data via Advanced Matching
    const userData = buildUserData(params);
    if (Object.keys(userData).length > 0) {
      (window as any).fbq("init", PIXEL_ID, userData);
    }

    // Build event params
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

    (window as any).fbq("track", eventName, fbqParams, { eventID: eventId });
    console.log(`Meta Pixel: ${eventName}`, fbqParams, eventId);

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
