import { Heart, Share2 } from "lucide-react";
import { useState } from "react";
const ProductTitle = () => {
  const [isFavorite, setIsFavorite] = useState(false);
  return <div className="bg-card px-3 py-3 border-t border-border">
      <div className="flex gap-3">
        {/* Title */}
        <div className="flex-1">
          <h1 className="text-sm font-medium text-foreground leading-tight mb-2">Brinquedo Elétrico AquaVolt - Potência, Estilo e Durabilidade em um Design Compacto | Ultimo dia de promoção 🔥</h1>
          
          {/* Stats */}
          <div className="flex items-center gap-3 text-xs text-muted-foreground">
            <span>6.3mil vendidos</span>
            <span>•</span>
            <div className="flex items-center gap-1">
              <div className="flex">
                {[1, 2, 3, 4, 5].map(star => <svg key={star} className={`w-3 h-3 ${star <= 4 ? "text-shopee-yellow fill-shopee-yellow" : "text-shopee-gray fill-shopee-gray"}`} viewBox="0 0 20 20">
                    <path d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z" />
                  </svg>)}
              </div>
              <span>4.8 (1.2mil)</span>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="flex flex-col items-center gap-3">
          <button onClick={() => setIsFavorite(!isFavorite)} className="flex flex-col items-center gap-0.5">
            <Heart className={`w-5 h-5 ${isFavorite ? "fill-primary text-primary" : "text-muted-foreground"}`} />
            <span className="text-[10px] text-muted-foreground">8.5mil</span>
          </button>
          
          <button className="flex flex-col items-center gap-0.5">
            <Share2 className="w-5 h-5 text-muted-foreground" />
            <span className="text-[10px] text-muted-foreground">Enviar</span>
          </button>
        </div>
      </div>
    </div>;
};
export default ProductTitle;