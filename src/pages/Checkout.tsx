import { useState, useRef } from "react";
import { MessageCircle } from "lucide-react";
import CheckoutHeader from "@/components/checkout/CheckoutHeader";
import CheckoutAddress, { CheckoutAddressRef } from "@/components/checkout/CheckoutAddress";
import CheckoutProducts from "@/components/checkout/CheckoutProducts";
import CheckoutVoucher from "@/components/checkout/CheckoutVoucher";
import CheckoutPayment from "@/components/checkout/CheckoutPayment";
import CheckoutSummary from "@/components/checkout/CheckoutSummary";
import CheckoutFooter from "@/components/checkout/CheckoutFooter";
import ChatPopup from "@/components/checkout/ChatPopup";
const Checkout = () => {
  const [showChatPopup, setShowChatPopup] = useState(false);
  const addressRef = useRef<CheckoutAddressRef>(null);
  const handleAddressInvalid = () => {
    addressRef.current?.scrollAndHighlight();
  };
  return <div className="min-h-screen bg-background pb-28 max-w-md mx-auto">
      <CheckoutHeader />
      <CheckoutAddress ref={addressRef} />
      <CheckoutProducts />
      <CheckoutVoucher />
      <CheckoutPayment />
      <CheckoutSummary />
      <CheckoutFooter onAddressInvalid={handleAddressInvalid} />
      
      {/* Floating Chat Button */}
      <button onClick={() => setShowChatPopup(true)} aria-label="Abrir chat de ajuda" className="fixed bottom-20 right-4 w-14 h-14 bg-primary text-primary-foreground rounded-full flex items-center justify-center hover:scale-105 transition-transform z-40 px-0 py-0 my-[30px] mx-[270px] shadow-sm">
        <MessageCircle className="w-6 h-6" />
      </button>
      
      <ChatPopup open={showChatPopup} onOpenChange={setShowChatPopup} />
    </div>;
};
export default Checkout;