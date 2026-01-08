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

      <footer className="fixed bottom-0 left-0 right-0 bg-card border-t border-border z-50">
        <div className="flex items-center h-14">
          {/* Chat Button */}
          <button 
            onClick={() => setShowChatPopup(true)}
            className="flex flex-col items-center justify-center w-16 h-full border-r border-border"
          >
            <MessageCircle className="w-5 h-5 text-primary" />
            <span className="text-[10px] text-foreground">Chat</span>
          </button>

          {/* Cart Button - goes to checkout */}
          <button 
            onClick={goToCheckout}
            className="flex flex-col items-center justify-center w-16 h-full border-r border-border relative"
          >
            <ShoppingCart className="w-5 h-5 text-primary" />
            <span className="text-[10px] text-foreground">Carrinho</span>
            <span className="absolute top-1 right-3 w-4 h-4 bg-primary text-primary-foreground text-[10px] rounded-full flex items-center justify-center">
              1
            </span>
          </button>

          {/* Add to Cart - goes to checkout */}
          <button 
            onClick={goToCheckout}
            className="flex-1 h-full bg-shopee-dark text-primary-foreground font-medium text-sm"
          >
            Adicionar ao Carrinho
          </button>

          {/* Buy Now */}
          <button 
            onClick={goToCheckout}
            className="flex-1 h-full bg-primary text-primary-foreground font-medium text-sm"
          >
            Comprar Agora
          </button>
        </div>
      </footer>

      <ChatPopup open={showChatPopup} onOpenChange={setShowChatPopup} />
    </>
  );
};

export default ProductFooter;
