import { useRef, useEffect } from "react";
import CheckoutHeader from "@/components/checkout/CheckoutHeader";
import CheckoutAddress, { CheckoutAddressRef } from "@/components/checkout/CheckoutAddress";
import CheckoutProducts from "@/components/checkout/CheckoutProducts";
import CheckoutVoucher from "@/components/checkout/CheckoutVoucher";
import CheckoutPayment from "@/components/checkout/CheckoutPayment";
import CheckoutSummary from "@/components/checkout/CheckoutSummary";
import CheckoutFooter from "@/components/checkout/CheckoutFooter";
import CheckoutChatButton from "@/components/checkout/CheckoutChatButton";
import { useCart } from "@/contexts/CartContext";
import { useAbandonedCart } from "@/hooks/useAbandonedCart";
import { useMetaPixel } from "@/hooks/useMetaPixel";

const Checkout = () => {
  const addressRef = useRef<CheckoutAddressRef>(null);
  const { setHasVisitedCheckout, quantity, product } = useCart();
  const { notifyCreditCardAttempt, markPixGenerated } = useAbandonedCart();
  const { trackInitiateCheckout, trackAddToCart } = useMetaPixel();
  
  // Mark that user has visited checkout and track events
  useEffect(() => {
    setHasVisitedCheckout(true);
    
    // Track InitiateCheckout and AddToCart
    const productValue = (product?.price || 149700) * quantity;
    trackInitiateCheckout(
      productValue,
      "AquaVolt - Prancha Elétrica Subaquática",
      "aquavolt-001"
    );
    trackAddToCart(
      productValue,
      "AquaVolt - Prancha Elétrica Subaquática",
      "aquavolt-001"
    );
  }, [setHasVisitedCheckout, trackInitiateCheckout, trackAddToCart, quantity, product]);
  
  const handleAddressInvalid = () => {
    addressRef.current?.scrollAndHighlight();
  };
  
  return (
    <div className="min-h-screen bg-background pb-28 max-w-md mx-auto">
      <CheckoutHeader />
      <CheckoutAddress ref={addressRef} />
      <CheckoutProducts />
      <CheckoutVoucher />
      <CheckoutPayment />
      <CheckoutSummary />
      <CheckoutFooter 
        onAddressInvalid={handleAddressInvalid} 
        onCreditCardAttempt={notifyCreditCardAttempt}
        onPixGenerated={markPixGenerated}
      />
      
      {/* Small Chat Button - appears when scrolled down */}
      <CheckoutChatButton />
    </div>
  );
};

export default Checkout;