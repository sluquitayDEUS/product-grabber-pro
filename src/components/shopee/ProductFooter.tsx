import { MessageCircle, ShoppingCart } from "lucide-react";
import { useNavigate } from "react-router-dom";

const ProductFooter = () => {
  const navigate = useNavigate();

  const goToCheckout = () => {
    navigate("/checkout");
  };

  return (
    <footer className="fixed bottom-0 left-0 right-0 bg-card border-t border-border z-50">
      <div className="flex items-center h-14">
        {/* Chat Button */}
        <button className="flex flex-col items-center justify-center w-16 h-full border-r border-border">
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
  );
};

export default ProductFooter;
