import { Heart } from "lucide-react";
import { useState } from "react";
import { ChevronRight } from "lucide-react";

const ProductPrice = () => {
  const [isFavorite, setIsFavorite] = useState(false);

  return (
    <div className="bg-card px-3 py-3">
      {/* Price Row */}
      <div className="flex items-center justify-between">
        <span className="text-2xl font-bold text-primary">R$390,90</span>
        <div className="flex items-center gap-1">
          <span className="text-sm text-muted-foreground">135 Vendido(s)</span>
          <button onClick={() => setIsFavorite(!isFavorite)}>
            <Heart className={`w-5 h-5 ${isFavorite ? "fill-primary text-primary" : "text-muted-foreground"}`} />
          </button>
        </div>
      </div>

      {/* Installments */}
      <div className="flex items-center gap-1 mt-1">
        <span className="text-sm text-muted-foreground">Em até</span>
        <span className="text-sm font-medium text-foreground">12x R$34,53</span>
        <ChevronRight className="w-4 h-4 text-muted-foreground" />
      </div>
    </div>
  );
};

export default ProductPrice;
