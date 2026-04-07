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
import { useMetaPixel } from "@/hooks/useMetaPixel";
import { useGoogleAnalytics } from "@/hooks/useGoogleAnalytics";

const Checkout = () => {
  const addressRef = useRef<CheckoutAddressRef>(null);
  const { setHasVisitedCheckout, quantity, product } = useCart();
  const { trackInitiateCheckout, trackAddToCart } = useMetaPixel();
  const { trackPageView, trackBeginCheckout, trackAddToCart: gaTrackAddToCart } = useGoogleAnalytics();
  
  // Mark that user has visited checkout and track events
  useEffect(() => {
    setHasVisitedCheckout(true);
    
    const productValue = (product?.price || 0) * quantity;
    
    // Meta Pixel tracking
    trackInitiateCheckout(
      productValue,
      product.name,
      product.id
    );
    trackAddToCart(
      productValue,
      product.name,
      product.id
    );
    
    // Google Analytics tracking
    trackPageView("/checkout", `${product.name} - Checkout`);
    trackBeginCheckout(
      productValue,
      product.id,
      product.name,
      quantity
    );
    gaTrackAddToCart(
      product.id,
      product.name,
      productValue,
      quantity
    );
  }, [setHasVisitedCheckout, trackInitiateCheckout, trackAddToCart, quantity, product, trackPageView, trackBeginCheckout, gaTrackAddToCart]);
  
  const handleAddressInvalid = () => {
    addressRef.current?.scrollAndHighlight();
  };
  
  return (
    <div className="min-h-screen bg-background pb-20 max-w-md mx-auto">
      <CheckoutHeader />
      <CheckoutAddress ref={addressRef} />
      <CheckoutProducts />
      <CheckoutVoucher />
      <CheckoutPayment />
      <CheckoutSummary />
      <CheckoutFooter 
        onAddressInvalid={handleAddressInvalid} 
      />
      
      {/* Small Chat Button - appears when scrolled down */}
      <CheckoutChatButton />
    </div>
  );
};

export default Checkout;