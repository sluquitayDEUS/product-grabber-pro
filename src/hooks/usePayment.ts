import { useState, useCallback, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

declare global {
  interface Window {
    FuriaPay?: {
      setPublicKey: (key: string) => Promise<void>;
      encrypt: (card: {
        number: string;
        holderName: string;
        expMonth: number;
        expYear: number;
        cvv: string;
      }) => Promise<string>;
    };
  }
}

interface CardData {
  number: string;
  holderName: string;
  expMonth: number;
  expYear: number;
  cvv: string;
}

interface PaymentData {
  amount: number;
  paymentMethod: 'pix' | 'credit_card';
  installments?: number;
  cardData?: CardData;
  customer: {
    name: string;
    email: string;
    document: string;
    phone?: string;
  };
  shipping?: {
    street: string;
    number: string;
    complement?: string;
    neighborhood: string;
    city: string;
    state: string;
    zipcode: string;
  };
  items: Array<{
    title: string;
    quantity: number;
    unitPrice: number;
    tangible: boolean;
  }>;
}

interface PixPaymentResult {
  success: true;
  transactionId: string;
  status: string;
  paymentMethod: 'pix';
  pix: {
    qrCode: string;
    qrCodeUrl: string;
    expiresAt: string;
  };
}

interface CardPaymentResult {
  success: true;
  transactionId: string;
  status: string;
  paymentMethod: 'credit_card';
  cardLastDigits: string;
  cardBrand: string;
}

type PaymentResult = PixPaymentResult | CardPaymentResult;

export const usePayment = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isFuriaPayReady, setIsFuriaPayReady] = useState(false);

  // Load FuriaPay SDK
  useEffect(() => {
    const loadFuriaPaySDK = async () => {
      // Check if already loaded
      if (window.FuriaPay) {
        setIsFuriaPayReady(true);
        return;
      }

      // Load the SDK script
      const script = document.createElement('script');
      script.src = 'https://api.furiapaybr.com/v1/js';
      script.async = true;
      
      script.onload = async () => {
        try {
          // Initialize with public key from env
          const publicKey = import.meta.env.VITE_FURIAPAY_PUBLIC_KEY;
          if (publicKey && window.FuriaPay) {
            await window.FuriaPay.setPublicKey(publicKey);
            setIsFuriaPayReady(true);
          }
        } catch (err) {
          console.error('Failed to initialize FuriaPay:', err);
        }
      };

      document.head.appendChild(script);
    };

    loadFuriaPaySDK();
  }, []);

  const processPayment = useCallback(async (data: PaymentData): Promise<PaymentResult> => {
    setIsLoading(true);
    setError(null);

    try {
      let cardToken: string | undefined;

      // If credit card, encrypt card data first
      if (data.paymentMethod === 'credit_card' && data.cardData) {
        if (!window.FuriaPay) {
          throw new Error('FuriaPay SDK not loaded');
        }

        cardToken = await window.FuriaPay.encrypt({
          number: data.cardData.number.replace(/\s/g, ''),
          holderName: data.cardData.holderName,
          expMonth: data.cardData.expMonth,
          expYear: data.cardData.expYear,
          cvv: data.cardData.cvv,
        });
      }

      // Call edge function
      const { data: result, error: invokeError } = await supabase.functions.invoke('create-payment', {
        body: {
          amount: data.amount,
          paymentMethod: data.paymentMethod,
          installments: data.installments,
          cardToken,
          customer: data.customer,
          shipping: data.shipping,
          items: data.items,
        },
      });

      if (invokeError) {
        throw new Error(invokeError.message);
      }

      if (!result.success) {
        throw new Error(result.error || 'Payment failed');
      }

      return result as PaymentResult;
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Payment failed';
      setError(message);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  return {
    processPayment,
    isLoading,
    error,
    isFuriaPayReady,
  };
};
