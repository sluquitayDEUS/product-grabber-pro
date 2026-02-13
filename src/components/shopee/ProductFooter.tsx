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
        <div className="flex items-stretch h-[46px]">
          {/* Chat Button */}
          <button 
            onClick={() => setShowChatPopup(true)}
            className="flex items-center justify-center gap-1.5 px-3 bg-[#26AA99]"
          >
            <MessageCircle className="w-[18px] h-[18px] text-white" strokeWidth={1.5} />
            <span className="text-[10px] text-white leading-none whitespace-nowrap">Conversar agora</span>
          </button>

          {/* Cart Button */}
          <button 
            onClick={goToCheckout}
            className="flex items-center justify-center gap-1.5 px-3 bg-[#26AA99] border-l border-white/20 relative"
          >
            <ShoppingCart className="w-[18px] h-[18px] text-white" strokeWidth={1.5} />
            <span className="text-[10px] text-white leading-none whitespace-nowrap">Adicionar ao carrinho</span>
            <span className="absolute top-0.5 right-1.5 w-[14px] h-[14px] bg-white text-[#EE4D2D] text-[8px] font-bold rounded-full flex items-center justify-center">
              1
            </span>
          </button>

          {/* Buy Now */}
          <button 
            onClick={goToCheckout}
            className="flex-1 h-full bg-[#EE4D2D] text-white flex items-center justify-center"
          >
            <span className="text-base font-normal">Compre agora</span>
          </button>
        </div>
      </footer>

      <ChatPopup open={showChatPopup} onOpenChange={setShowChatPopup} />
    </>
  );
};

export default ProductFooter;
