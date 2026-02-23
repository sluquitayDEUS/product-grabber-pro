import { useCart } from "@/contexts/CartContext";
import { forwardRef, useImperativeHandle, useRef, useState, useEffect } from "react";

// Import color images
import aquavoltVermelho from "@/assets/aquavolt-vermelho.jpg";
import aquavoltAzul from "@/assets/aquavolt-azul.jpg";
import aquavolt1 from "@/assets/aquavolt-new-1.webp";

const colors = [
  { id: 1, name: "Vermelho/Preto", color: "#dc2626", image: aquavoltVermelho },
  { id: 2, name: "Azul/Preto", color: "#0ea5e9", image: aquavoltAzul },
];

const variationThumbs = [aquavolt1, aquavoltVermelho, aquavoltAzul];

export interface ProductVariationsRef {
  scrollAndHighlight: () => void;
}

const ProductVariations = forwardRef<ProductVariationsRef>((_, ref) => {
  const { selectedColor, setSelectedColor } = useCart();
  const containerRef = useRef<HTMLDivElement>(null);
  const [isHighlighted, setIsHighlighted] = useState(false);

  useImperativeHandle(ref, () => ({
    scrollAndHighlight: () => {
      containerRef.current?.scrollIntoView({ behavior: "smooth", block: "center" });
      setIsHighlighted(true);
    }
  }));

  useEffect(() => {
    if (isHighlighted) {
      const timer = setTimeout(() => setIsHighlighted(false), 2000);
      return () => clearTimeout(timer);
    }
  }, [isHighlighted]);

  return (
    <div 
      ref={containerRef}
      className={`bg-card px-3 py-3 mt-[2px] transition-all duration-300 ${
        isHighlighted ? "ring-2 ring-red-500 ring-offset-2" : ""
      }`}
    >
      {/* Header row */}
      <div className="flex items-center gap-2 mb-3">
        <span className="text-sm text-primary font-medium">{variationThumbs.length} Variações Disponíveis</span>
      </div>

      {/* Variation thumbnails row */}
      <div className="flex gap-2 overflow-x-auto scrollbar-hide">
        {colors.map((color) => (
          <button
            key={color.id}
            onClick={() => setSelectedColor(color.id)}
            className={`w-[72px] h-[72px] rounded border-2 flex-shrink-0 overflow-hidden transition-all ${
              selectedColor === color.id
                ? "border-primary"
                : "border-border"
            }`}
          >
            <img 
              src={color.image} 
              alt={color.name} 
              className="w-full h-full object-cover"
            />
          </button>
        ))}
      </div>
    </div>
  );
});

ProductVariations.displayName = "ProductVariations";

export default ProductVariations;
