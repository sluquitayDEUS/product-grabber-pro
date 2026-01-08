import { useCallback, useRef, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useCart } from '@/contexts/CartContext';

export const useAbandonedCart = () => {
  const { customer, shippingAddress, product, totalPriceInCents } = useCart();
  const hasNotifiedRef = useRef(false);

  const isDataComplete = useCallback(() => {
    return (
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

  const sendAbandonedCartNotification = useCallback(async (type: 'credit_card_attempt' | 'checkout_abandoned') => {
    if (!isDataComplete() || hasNotifiedRef.current) return;

    try {
      await supabase.functions.invoke('abandoned-cart', {
        body: {
          type,
          customer: {
            name: customer.name,
            email: customer.email,
            document: customer.document,
            phone: customer.phone,
          },
          shipping: {
            street: shippingAddress.street,
            number: shippingAddress.number,
            complement: shippingAddress.complement,
            neighborhood: shippingAddress.neighborhood,
            city: shippingAddress.city,
            state: shippingAddress.state,
            zipcode: shippingAddress.zipcode,
          },
          product: {
            name: product.name,
            quantity: product.quantity,
            price: product.price,
          },
          totalAmount: totalPriceInCents,
        },
      });
      hasNotifiedRef.current = true;
      console.log('Abandoned cart notification sent');
    } catch (error) {
      console.error('Failed to send abandoned cart notification:', error);
    }
  }, [customer, shippingAddress, product, totalPriceInCents, isDataComplete]);

  const notifyCreditCardAttempt = useCallback(() => {
    sendAbandonedCartNotification('credit_card_attempt');
  }, [sendAbandonedCartNotification]);

  const markPixGenerated = useCallback(() => {
    // Mark that Pix was generated, so we don't send abandoned cart notification
    hasNotifiedRef.current = true;
  }, []);

  const resetNotification = useCallback(() => {
    hasNotifiedRef.current = false;
  }, []);

  // Handle page unload - send notification if data is complete and leaving checkout
  useEffect(() => {
    const handleBeforeUnload = () => {
      if (isDataComplete() && !hasNotifiedRef.current) {
        // Use sendBeacon for reliability during page unload
        const payload = JSON.stringify({
          type: 'checkout_abandoned',
          customer: {
            name: customer.name,
            email: customer.email,
            document: customer.document,
            phone: customer.phone,
          },
          shipping: {
            street: shippingAddress.street,
            number: shippingAddress.number,
            complement: shippingAddress.complement,
            neighborhood: shippingAddress.neighborhood,
            city: shippingAddress.city,
            state: shippingAddress.state,
            zipcode: shippingAddress.zipcode,
          },
          product: {
            name: product.name,
            quantity: product.quantity,
            price: product.price,
          },
          totalAmount: totalPriceInCents,
        });

        const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
        navigator.sendBeacon(
          `${supabaseUrl}/functions/v1/abandoned-cart`,
          new Blob([payload], { type: 'application/json' })
        );
      }
    };

    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => window.removeEventListener('beforeunload', handleBeforeUnload);
  }, [customer, shippingAddress, product, totalPriceInCents, isDataComplete]);

  return {
    notifyCreditCardAttempt,
    markPixGenerated,
    resetNotification,
    isDataComplete,
  };
};
