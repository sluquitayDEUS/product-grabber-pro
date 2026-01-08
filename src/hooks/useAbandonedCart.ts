import { useCallback, useEffect, useRef } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useCart } from '@/contexts/CartContext';

const STORAGE_KEY = 'abandoned_cart_data';
const INACTIVITY_TIMEOUT = 3 * 60 * 1000; // 3 minutes in milliseconds

interface StoredCartData {
  customer: {
    name: string;
    email: string;
    document: string;
    phone?: string;
  };
  shipping: {
    street: string;
    number: string;
    complement?: string;
    neighborhood: string;
    city: string;
    state: string;
    zipcode: string;
  };
  product: {
    name: string;
    quantity: number;
    price: number;
  };
  totalAmount: number;
  savedAt: number;
  notified: boolean;
  pixGenerated: boolean;
  dataComplete: boolean;
}

export const useAbandonedCart = () => {
  const { customer, shippingAddress, product, totalPriceInCents, quantity } = useCart();
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const lastActivityRef = useRef<number>(Date.now());
  const notifyingRef = useRef<boolean>(false);

  const isDataComplete = useCallback(() => {
    return !!(
      customer.name &&
      customer.email &&
      customer.document &&
      shippingAddress.street &&
      shippingAddress.number &&
      shippingAddress.neighborhood &&
      shippingAddress.city &&
      shippingAddress.state &&
      shippingAddress.zipcode
    );
  }, [customer, shippingAddress]);

  // Save cart data to localStorage whenever it changes
  const saveCartData = useCallback(() => {
    const dataComplete = isDataComplete();
    
    // Only save if we have at least partial data
    if (!customer.name && !customer.email) return;

    const existingData = localStorage.getItem(STORAGE_KEY);
    const existing: StoredCartData | null = existingData ? JSON.parse(existingData) : null;

    // Don't overwrite if already notified or pix generated
    if (existing?.notified || existing?.pixGenerated) return;

    const data: StoredCartData = {
      customer: {
        name: customer.name,
        email: customer.email,
        document: customer.document,
        phone: customer.phone || undefined,
      },
      shipping: {
        street: shippingAddress.street,
        number: shippingAddress.number,
        complement: shippingAddress.complement || undefined,
        neighborhood: shippingAddress.neighborhood,
        city: shippingAddress.city,
        state: shippingAddress.state,
        zipcode: shippingAddress.zipcode,
      },
      product: {
        name: product.name,
        quantity: quantity,
        price: product.price,
      },
      totalAmount: totalPriceInCents,
      savedAt: Date.now(),
      notified: false,
      pixGenerated: false,
      dataComplete,
    };

    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    console.log('Cart data saved, dataComplete:', dataComplete);
  }, [customer, shippingAddress, product, quantity, totalPriceInCents, isDataComplete]);

  // Send abandoned cart notification
  const sendNotification = useCallback(async (type: 'credit_card_attempt' | 'checkout_abandoned') => {
    // Prevent duplicate notifications
    if (notifyingRef.current) {
      console.log('Already sending notification, skipping...');
      return;
    }

    const storedData = localStorage.getItem(STORAGE_KEY);
    if (!storedData) {
      console.log('No stored cart data found');
      return;
    }

    const data: StoredCartData = JSON.parse(storedData);
    
    // Only send if data is complete
    if (!data.dataComplete) {
      console.log('Cart data is not complete, skipping notification');
      return;
    }

    if (data.notified || data.pixGenerated) {
      console.log('Already notified or pix generated, skipping');
      return;
    }

    notifyingRef.current = true;

    try {
      console.log('Sending abandoned cart notification:', type);
      
      const response = await supabase.functions.invoke('abandoned-cart', {
        body: {
          type,
          customer: data.customer,
          shipping: data.shipping,
          product: data.product,
          totalAmount: data.totalAmount,
        },
      });

      console.log('Notification response:', response);

      if (response.error) {
        console.error('Edge function error:', response.error);
      } else {
        // Mark as notified
        data.notified = true;
        localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
        console.log('Abandoned cart notification sent successfully');
      }
    } catch (error) {
      console.error('Failed to send abandoned cart notification:', error);
    } finally {
      notifyingRef.current = false;
    }
  }, []);

  // Check for stale cart data on mount (user returned after being away)
  useEffect(() => {
    const checkStaleCart = async () => {
      const storedData = localStorage.getItem(STORAGE_KEY);
      if (!storedData) return;

      const data: StoredCartData = JSON.parse(storedData);
      
      // If already notified or pix generated, skip
      if (data.notified || data.pixGenerated) return;
      
      // Only check if data is complete
      if (!data.dataComplete) return;

      // Check if 3 minutes have passed since last save
      const timeSinceSave = Date.now() - data.savedAt;
      if (timeSinceSave >= INACTIVITY_TIMEOUT) {
        console.log('Stale cart detected, sending notification...');
        await sendNotification('checkout_abandoned');
      }
    };

    checkStaleCart();
  }, [sendNotification]);

  // Save data whenever cart changes
  useEffect(() => {
    saveCartData();
  }, [saveCartData]);

  // Setup inactivity timer
  useEffect(() => {
    const resetTimer = () => {
      lastActivityRef.current = Date.now();
      
      // Update savedAt in storage
      const storedData = localStorage.getItem(STORAGE_KEY);
      if (storedData) {
        const data: StoredCartData = JSON.parse(storedData);
        if (!data.notified && !data.pixGenerated) {
          data.savedAt = Date.now();
          localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
        }
      }

      // Clear existing timeout
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }

      // Set new timeout for 3 minutes
      timeoutRef.current = setTimeout(async () => {
        const stored = localStorage.getItem(STORAGE_KEY);
        if (stored) {
          const cartData: StoredCartData = JSON.parse(stored);
          if (!cartData.notified && !cartData.pixGenerated && cartData.dataComplete) {
            console.log('Inactivity timeout reached, sending notification...');
            await sendNotification('checkout_abandoned');
          }
        }
      }, INACTIVITY_TIMEOUT);
    };

    // Track user activity
    const events = ['mousedown', 'mousemove', 'keydown', 'scroll', 'touchstart', 'click'];
    
    events.forEach(event => {
      document.addEventListener(event, resetTimer, { passive: true });
    });

    // Initial timer setup
    resetTimer();

    // Handle visibility change (tab switch, minimize)
    const handleVisibilityChange = async () => {
      if (document.hidden) {
        // User left the tab, save current timestamp
        const storedData = localStorage.getItem(STORAGE_KEY);
        if (storedData) {
          const data: StoredCartData = JSON.parse(storedData);
          if (!data.notified && !data.pixGenerated) {
            data.savedAt = Date.now();
            localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
          }
        }
      } else {
        // User came back, check if 3 minutes passed
        const storedData = localStorage.getItem(STORAGE_KEY);
        if (storedData) {
          const data: StoredCartData = JSON.parse(storedData);
          if (!data.notified && !data.pixGenerated && data.dataComplete) {
            const timeSinceSave = Date.now() - data.savedAt;
            if (timeSinceSave >= INACTIVITY_TIMEOUT) {
              await sendNotification('checkout_abandoned');
            } else {
              // Reset timer for remaining time
              resetTimer();
            }
          }
        }
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);

    // Handle page unload - save timestamp for when user returns
    const handleBeforeUnload = () => {
      const storedData = localStorage.getItem(STORAGE_KEY);
      if (storedData) {
        const data: StoredCartData = JSON.parse(storedData);
        if (!data.notified && !data.pixGenerated) {
          data.savedAt = Date.now();
          localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
        }
      }
    };

    window.addEventListener('beforeunload', handleBeforeUnload);

    return () => {
      events.forEach(event => {
        document.removeEventListener(event, resetTimer);
      });
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      window.removeEventListener('beforeunload', handleBeforeUnload);
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [sendNotification]);

  const notifyCreditCardAttempt = useCallback(() => {
    sendNotification('credit_card_attempt');
  }, [sendNotification]);

  const markPixGenerated = useCallback(() => {
    const storedData = localStorage.getItem(STORAGE_KEY);
    if (storedData) {
      const data: StoredCartData = JSON.parse(storedData);
      data.pixGenerated = true;
      localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    }
    console.log('Pix generated, cart will not be marked as abandoned');
  }, []);

  const clearAbandonedCart = useCallback(() => {
    localStorage.removeItem(STORAGE_KEY);
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    console.log('Abandoned cart data cleared');
  }, []);

  return {
    notifyCreditCardAttempt,
    markPixGenerated,
    clearAbandonedCart,
    isDataComplete,
    saveCartData,
  };
};
