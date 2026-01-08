import { ArrowLeft, Search, ShoppingCart, MoreHorizontal } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useCart } from "@/contexts/CartContext";

const ProductHeader = () => {
  const navigate = useNavigate();
  const { hasVisitedCheckout, quantity } = useCart();

  const handleCartClick = () => {
    if (hasVisitedCheckout) {
      navigate("/checkout");
    }
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-gradient-to-b from-black/40 to-transparent">
      <div className="flex items-center justify-between px-3 py-2">
        <button className="w-9 h-9 flex items-center justify-center rounded-full bg-black/30">
          <ArrowLeft className="w-5 h-5 text-primary-foreground" />
        </button>
        
        <div className="flex items-center gap-2">
          <button className="w-9 h-9 flex items-center justify-center rounded-full bg-black/30">
            <Search className="w-5 h-5 text-primary-foreground" />
          </button>
          
          <button 
            onClick={handleCartClick}
            className="w-9 h-9 flex items-center justify-center rounded-full bg-black/30 relative"
          >
            <ShoppingCart className="w-5 h-5 text-primary-foreground" />
            {hasVisitedCheckout && (
              <span className="absolute -top-1 -right-1 w-5 h-5 bg-primary text-primary-foreground text-xs rounded-full flex items-center justify-center font-medium">
                {quantity}
              </span>
            )}
          </button>
          
          <button className="w-9 h-9 flex items-center justify-center rounded-full bg-black/30">
            <MoreHorizontal className="w-5 h-5 text-primary-foreground" />
          </button>
        </div>
      </div>
    </header>
  );
};

export default ProductHeader;