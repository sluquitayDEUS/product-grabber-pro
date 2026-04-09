import { useState } from "react";
import { MessageCircle, ShoppingCart } from "lucide-react";
import { useNavigate } from "react-router-dom";
import WatchChatPopup from "@/components/relogio/WatchChatPopup";
import { useCart } from "@/contexts/CartContext";
import type { ProductType } from "@/contexts/CartContext";

interface Props {
  productType: ProductType;
  price: number;
}

const GenericProductFooter = ({ productType, price }: Props) => {
  const navigate = useNavigate();
  const [showChatPopup, setShowChatPopup] = useState(false);
  const { setProductType, setSelectedColor } = useCart();

  const goToCheckout = () => {
    setProductType(productType);
    setSelectedColor(1);
    navigate("/checkout");
  };

  return (
    <>
      <footer className="fixed bottom-0 left-0 right-0 z-50">
        <div className="flex items-center h-14">
          <button onClick={() => setShowChatPopup(true)} className="flex items-center justify-center w-14 h-full bg-[#26AA99]">
            <MessageCircle className="w-6 h-6 text-white" />
          </button>
          <button onClick={goToCheckout} className="flex items-center justify-center w-14 h-full bg-[#26AA99] border-l border-white/30 relative">
            <ShoppingCart className="w-6 h-6 text-white" />
            <span className="absolute top-2 right-2 w-4 h-4 bg-white text-[#26AA99] text-[10px] font-bold rounded-full flex items-center justify-center">1</span>
          </button>
          <button onClick={goToCheckout} className="flex-1 h-full bg-[#EE4D2D] text-white flex flex-col items-center justify-center">
            <span className="text-sm font-medium italic">Comprar com desconto</span>
            <span className="text-base font-bold">R${price.toFixed(2).replace(".", ",")}</span>
          </button>
        </div>
      </footer>
      <WatchChatPopup open={showChatPopup} onOpenChange={setShowChatPopup} />
    </>
  );
};

export default GenericProductFooter;
