import { ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";

const CheckoutHeader = () => {
  const navigate = useNavigate();

  return (
    <header className="sticky top-0 bg-primary z-50">
      <div className="flex items-center h-12 px-3">
        <button 
          onClick={() => navigate(-1)}
          className="w-8 h-8 flex items-center justify-center"
        >
          <ArrowLeft className="w-5 h-5 text-primary-foreground" />
        </button>
        <h1 className="flex-1 text-center text-primary-foreground font-medium text-base">
          Checkout
        </h1>
        <div className="w-8" />
      </div>
    </header>
  );
};

export default CheckoutHeader;
