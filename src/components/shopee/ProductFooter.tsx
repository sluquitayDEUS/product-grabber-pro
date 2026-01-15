import { useState, useEffect } from "react";
import { MessageCircle, ShoppingCart } from "lucide-react";
import { useNavigate } from "react-router-dom";
import ChatPopup from "./ChatPopup";
import { useCart } from "@/contexts/CartContext";

interface ProductFooterProps {
  onNoColorSelected?: () => void;
}

const ProductFooter = ({ onNoColorSelected }: ProductFooterProps) => {
  const navigate = useNavigate();
  const [showChatPopup, setShowChatPopup] = useState(false);
  const [showColorWarning, setShowColorWarning] = useState(false);
  const { selectedColor } = useCart();

  useEffect(() => {
    if (showColorWarning) {
      const timer = setTimeout(() => {
        setShowColorWarning(false);
      }, 3100);
      return () => clearTimeout(timer);
    }
  }, [showColorWarning]);

  const goToCheckout = () => {
    if (!selectedColor) {
      setShowColorWarning(true);
      onNoColorSelected?.();
      return;
    }
    navigate("/checkout");
  };

  return (
    <>
      {/* Color Warning Toast */}
      {showColorWarning && (
        <div className="fixed bottom-16 left-1/2 -translate-x-1/2 z-[60] animate-in fade-in slide-in-from-bottom-2 duration-200">
          <div className="bg-foreground text-background px-4 py-2 rounded-lg shadow-lg text-sm font-medium">
            Selecione uma cor para continuar
          </div>
        </div>
      )}

      <footer className="fixed bottom-0 left-0 right-0 z-50">
        <div className="flex items-center h-14">
          {/* Chat Button - Shopee style teal */}
          <button 
            onClick={() => setShowChatPopup(true)}
            className="flex items-center justify-center w-14 h-full bg-[#26AA99]"
          >
            <MessageCircle className="w-6 h-6 text-white" />
          </button>

          {/* Cart Button - Shopee style teal with divider */}
          <button 
            onClick={goToCheckout}
            className="flex items-center justify-center w-14 h-full bg-[#26AA99] border-l border-white/30 relative"
          >
            <ShoppingCart className="w-6 h-6 text-white" />
            <span className="absolute top-2 right-2 w-4 h-4 bg-white text-[#26AA99] text-[10px] font-bold rounded-full flex items-center justify-center">
              1
            </span>
          </button>

          {/* Buy Now - Shopee style orange with discount text */}
          <button 
            onClick={goToCheckout}
            className="flex-1 h-full bg-[#EE4D2D] text-white flex flex-col items-center justify-center"
          >
            <span className="text-sm font-medium italic">Comprar com desconto</span>
            <span className="text-base font-bold">R$390,90</span>
          </button>
        </div>
      </footer>

      <ChatPopup open={showChatPopup} onOpenChange={setShowChatPopup} />
    </>
  );
};

export default ProductFooter;
