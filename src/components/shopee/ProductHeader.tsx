import { ArrowLeft, ShoppingCart, MoreHorizontal } from "lucide-react";
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
    <header className="absolute top-0 left-0 right-0 z-40">
      <div className="flex items-center justify-between px-3 py-2">
        <button className="w-10 h-10 flex items-center justify-center rounded-full bg-black/40">
          <ArrowLeft className="w-5 h-5 text-white" />
        </button>
        
        <div className="flex items-center gap-3">

          {/* Share icon */}
          <button className="w-10 h-10 flex items-center justify-center rounded-full bg-black/40">
            <svg className="w-5 h-5 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="18" cy="5" r="3"/>
              <circle cx="6" cy="12" r="3"/>
              <circle cx="18" cy="19" r="3"/>
              <line x1="8.59" y1="13.51" x2="15.42" y2="17.49"/>
              <line x1="15.41" y1="6.51" x2="8.59" y2="10.49"/>
            </svg>
          </button>
          
          {/* Cart icon */}
          <button 
            onClick={handleCartClick}
            className="w-10 h-10 flex items-center justify-center rounded-full bg-black/40 relative"
          >
            <ShoppingCart className="w-5 h-5 text-white" />
            {hasVisitedCheckout && (
              <span className="absolute -top-1 -right-1 w-5 h-5 bg-primary text-primary-foreground text-xs rounded-full flex items-center justify-center font-medium">
                {quantity}
              </span>
            )}
          </button>
          
          {/* More icon */}
          <button className="w-10 h-10 flex items-center justify-center rounded-full bg-black/40">
            <MoreHorizontal className="w-5 h-5 text-white" />
          </button>
        </div>
      </div>
    </header>
  );
};

export default ProductHeader;
