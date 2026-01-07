import { ChevronRight } from "lucide-react";
import { useCart } from "@/contexts/CartContext";

// Import color images
import aquavoltVermelho from "@/assets/aquavolt-vermelho.jpg";
import aquavoltAzul from "@/assets/aquavolt-azul.jpg";

const colors = [
  { id: 1, name: "Vermelho/Preto", color: "#dc2626", image: aquavoltVermelho },
  { id: 2, name: "Azul/Preto", color: "#0ea5e9", image: aquavoltAzul },
];

const ProductVariations = () => {
  const { selectedColor, setSelectedColor } = useCart();

  return (
    <div className="bg-card px-3 py-3 mt-2">
      <div className="flex items-center justify-between mb-3">
        <span className="text-sm font-medium text-foreground">Variações</span>
        <ChevronRight className="w-4 h-4 text-muted-foreground" />
      </div>

      {/* Colors */}
      <div>
        <p className="text-xs text-muted-foreground mb-2">
          Cor: <span className="text-foreground">{selectedColor ? colors.find(c => c.id === selectedColor)?.name : "Selecione uma cor"}</span>
        </p>
        <div className="flex gap-2">
          {colors.map((color) => (
            <button
              key={color.id}
              onClick={() => setSelectedColor(color.id)}
              className={`w-12 h-12 rounded-lg border-2 transition-all overflow-hidden ${
                selectedColor === color.id
                  ? "border-primary ring-2 ring-primary ring-offset-1"
                  : "border-border opacity-70 hover:opacity-100"
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
    </div>
  );
};

export default ProductVariations;
