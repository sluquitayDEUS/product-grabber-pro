import { ChevronRight } from "lucide-react";
import { useCart } from "@/contexts/CartContext";

const colors = [
  { id: 1, name: "Vermelho/Preto", color: "#dc2626" },
  { id: 2, name: "Azul/Preto", color: "#0ea5e9" },
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
          Cor: <span className="text-foreground">{colors.find(c => c.id === selectedColor)?.name}</span>
        </p>
        <div className="flex gap-2">
          {colors.map((color) => (
            <button
              key={color.id}
              onClick={() => setSelectedColor(color.id)}
              className={`w-10 h-10 rounded-lg border-2 transition-all ${
                selectedColor === color.id
                  ? "border-primary"
                  : "border-border"
              }`}
              style={{ backgroundColor: color.color }}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default ProductVariations;
