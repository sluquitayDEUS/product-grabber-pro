import { useState } from "react";
import { MessageCircle, ShoppingCart } from "lucide-react";
import ChatPopup from "@/components/shopee/ChatPopup";

const WatchFooter = () => {
  const [showChatPopup, setShowChatPopup] = useState(false);

  const goToCheckout = () => {
    // For now, show a message or navigate
    window.open("https://invictusrelogios.com/products/relogio-imperium", "_blank");
  };

  return (
    <>
      <footer className="fixed bottom-0 left-0 right-0 z-50">
        <div className="flex items-center h-14">
          {/* Chat Button */}
          <button
            onClick={() => setShowChatPopup(true)}
            className="flex items-center justify-center w-14 h-full bg-[#26AA99]"
          >
            <MessageCircle className="w-6 h-6 text-white" />
          </button>

          {/* Cart Button */}
          <button
            onClick={goToCheckout}
            className="flex items-center justify-center w-14 h-full bg-[#26AA99] border-l border-white/30 relative"
          >
            <ShoppingCart className="w-6 h-6 text-white" />
            <span className="absolute top-2 right-2 w-4 h-4 bg-white text-[#26AA99] text-[10px] font-bold rounded-full flex items-center justify-center">
              1
            </span>
          </button>

          {/* Buy Now */}
          <button
            onClick={goToCheckout}
            className="flex-1 h-full bg-[#EE4D2D] text-white flex flex-col items-center justify-center"
          >
            <span className="text-sm font-medium italic">Comprar com desconto</span>
            <span className="text-base font-bold">R$187,90</span>
          </button>
        </div>
      </footer>

      <ChatPopup open={showChatPopup} onOpenChange={setShowChatPopup} />
    </>
  );
};

export default WatchFooter;
