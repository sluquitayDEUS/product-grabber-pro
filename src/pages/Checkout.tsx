import { useRef } from "react";
import CheckoutHeader from "@/components/checkout/CheckoutHeader";
import CheckoutAddress, { CheckoutAddressRef } from "@/components/checkout/CheckoutAddress";
import CheckoutProducts from "@/components/checkout/CheckoutProducts";
import CheckoutVoucher from "@/components/checkout/CheckoutVoucher";
import CheckoutPayment from "@/components/checkout/CheckoutPayment";
import CheckoutSummary from "@/components/checkout/CheckoutSummary";
import CheckoutFooter from "@/components/checkout/CheckoutFooter";
import CheckoutChatButton from "@/components/checkout/CheckoutChatButton";

const Checkout = () => {
  const addressRef = useRef<CheckoutAddressRef>(null);
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
      <CheckoutFooter onAddressInvalid={handleAddressInvalid} />
      
      {/* Small Chat Button - appears when scrolled down */}
      <CheckoutChatButton />
    </div>
  );
};

export default Checkout;