// Google Analytics Measurement ID
const GA_MEASUREMENT_ID = "G-6ZWPYJD8TH";

// Extend window to include gtag
declare global {
  interface Window {
    gtag: (...args: unknown[]) => void;
    dataLayer: unknown[];
  }
}

// Check if running on production domain
const isProduction = (): boolean => {
  if (typeof window === "undefined") return false;
  const hostname = window.location.hostname;
  // Only track on production domain, not on lovable.app or localhost
  return !hostname.includes("lovable.app") && 
         !hostname.includes("localhost") && 
         !hostname.includes("127.0.0.1");
};

export const useGoogleAnalytics = () => {
  // Track page view
  const trackPageView = (pagePath: string, pageTitle: string) => {
    if (!isProduction()) return;
    if (typeof window !== "undefined" && window.gtag) {
      window.gtag("event", "page_view", {
        page_path: pagePath,
        page_title: pageTitle,
      });
    }
  };

  // Track view item (product page)
  const trackViewItem = (
    itemId: string,
    itemName: string,
    value: number,
    currency: string = "BRL"
  ) => {
    if (!isProduction()) return;
    if (typeof window !== "undefined" && window.gtag) {
      window.gtag("event", "view_item", {
        currency,
        value: value / 100, // Convert cents to reais
        items: [
          {
            item_id: itemId,
            item_name: itemName,
            price: value / 100,
            quantity: 1,
          },
        ],
      });
    }
  };

  // Track begin checkout
  const trackBeginCheckout = (
    value: number,
    itemId: string,
    itemName: string,
    quantity: number = 1,
    currency: string = "BRL"
  ) => {
    if (!isProduction()) return;
    if (typeof window !== "undefined" && window.gtag) {
      window.gtag("event", "begin_checkout", {
        currency,
        value: value / 100,
        items: [
          {
            item_id: itemId,
            item_name: itemName,
            price: value / 100,
            quantity,
          },
        ],
      });
    }
  };

  // Track add payment info
  const trackAddPaymentInfo = (
    value: number,
    paymentType: string,
    currency: string = "BRL"
  ) => {
    if (!isProduction()) return;
    if (typeof window !== "undefined" && window.gtag) {
      window.gtag("event", "add_payment_info", {
        currency,
        value: value / 100,
        payment_type: paymentType,
      });
    }
  };

  // Track purchase (when Pix is generated)
  const trackPurchase = (
    transactionId: string,
    value: number,
    itemId: string,
    itemName: string,
    quantity: number = 1,
    currency: string = "BRL"
  ) => {
    if (!isProduction()) return;
    if (typeof window !== "undefined" && window.gtag) {
      window.gtag("event", "purchase", {
        transaction_id: transactionId,
        currency,
        value: value / 100,
        items: [
          {
            item_id: itemId,
            item_name: itemName,
            price: value / 100,
            quantity,
          },
        ],
      });
    }
  };

  // Track add to cart
  const trackAddToCart = (
    itemId: string,
    itemName: string,
    value: number,
    quantity: number = 1,
    currency: string = "BRL"
  ) => {
    if (!isProduction()) return;
    if (typeof window !== "undefined" && window.gtag) {
      window.gtag("event", "add_to_cart", {
        currency,
        value: value / 100,
        items: [
          {
            item_id: itemId,
            item_name: itemName,
            price: value / 100,
            quantity,
          },
        ],
      });
    }
  };

  // Track generate lead (for Pix generation)
  const trackGenerateLead = (
    value: number,
    currency: string = "BRL"
  ) => {
    if (!isProduction()) return;
    if (typeof window !== "undefined" && window.gtag) {
      window.gtag("event", "generate_lead", {
        currency,
        value: value / 100,
      });
    }
  };

  return {
    trackPageView,
    trackViewItem,
    trackBeginCheckout,
    trackAddPaymentInfo,
    trackPurchase,
    trackAddToCart,
    trackGenerateLead,
  };
};
