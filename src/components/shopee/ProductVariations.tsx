import { useState } from "react";
import { ChevronRight } from "lucide-react";

const colors = [
  { id: 1, name: "Preto", color: "#1a1a1a" },
  { id: 2, name: "Prata", color: "#C0C0C0" },
  { id: 3, name: "Dourado", color: "#FFD700" },
];

const models = [
  { id: 1, name: "3 em 1" },
  { id: 2, name: "5 em 1" },
  { id: 3, name: "7 em 1 Pro" },
];

const ProductVariations = () => {
  const [selectedColor, setSelectedColor] = useState(1);
  const [selectedModel, setSelectedModel] = useState(1);

  return (
    <div className="bg-card px-3 py-3 mt-2">
      <div className="flex items-center justify-between mb-3">
        <span className="text-sm font-medium text-foreground">Variações</span>
        <ChevronRight className="w-4 h-4 text-muted-foreground" />
      </div>

      {/* Colors */}
      <div className="mb-4">
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

      {/* Models */}
      <div>
        <p className="text-xs text-muted-foreground mb-2">
          Modelo: <span className="text-foreground">{models.find(m => m.id === selectedModel)?.name}</span>
        </p>
        <div className="flex flex-wrap gap-2">
          {models.map((model) => (
            <button
              key={model.id}
              onClick={() => setSelectedModel(model.id)}
              className={`px-3 py-2 text-xs rounded-lg border transition-all ${
                selectedModel === model.id
                  ? "border-primary bg-shopee-light text-primary"
                  : "border-border text-foreground"
              }`}
            >
              {model.name}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ProductVariations;