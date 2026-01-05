import { useState } from "react";
import { ChevronDown, ChevronUp } from "lucide-react";

const specs = [
  { label: "Marca", value: "TechPro" },
  { label: "Material", value: "Aço Inoxidável + ABS" },
  { label: "Voltagem", value: "Bivolt (USB)" },
  { label: "Bateria", value: "600mAh Li-ion" },
  { label: "Peso", value: "180g" },
  { label: "Garantia", value: "12 meses" },
];

const ProductDescription = () => {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <div className="bg-card px-3 py-4 mt-2">
      <h2 className="text-sm font-medium text-foreground mb-3">Detalhes do Produto</h2>

      {/* Specifications */}
      <div className="space-y-2 mb-4">
        {specs.map((spec, index) => (
          <div key={index} className="flex text-xs">
            <span className="w-24 text-muted-foreground flex-shrink-0">{spec.label}</span>
            <span className="text-foreground">{spec.value}</span>
          </div>
        ))}
      </div>

      {/* Description */}
      <div className="border-t border-border pt-4">
        <h3 className="text-sm font-medium text-foreground mb-2">Descrição</h3>
        <div className={`text-xs text-muted-foreground leading-relaxed ${!isExpanded && "line-clamp-4"}`}>
          <p className="mb-2">
            🔥 MÁQUINA DE BARBEAR 3 EM 1 - O PRESENTE PERFEITO!
          </p>
          <p className="mb-2">
            ✅ Barbeador elétrico profissional com 3 funções: barbear, aparar e modelar
          </p>
          <p className="mb-2">
            ✅ Lâminas de aço inoxidável de alta qualidade para um corte preciso e suave
          </p>
          <p className="mb-2">
            ✅ Design ergonômico e portátil - perfeito para viagens
          </p>
          <p className="mb-2">
            ✅ Bateria recarregável via USB - até 90 minutos de uso contínuo
          </p>
          <p className="mb-2">
            ✅ À prova d'água IPX6 - pode ser usado no banho
          </p>
          <p className="mb-2">
            ✅ Indicador LED de bateria
          </p>
          <p className="mb-2">
            ✅ Baixo ruído - motor silencioso de alta potência
          </p>
          <p>
            📦 O pacote inclui: 1x Máquina principal, 3x Cabeças intercambiáveis, 1x Cabo USB, 1x Escova de limpeza, 1x Manual
          </p>
        </div>
        
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="flex items-center justify-center gap-1 w-full mt-3 py-2 text-sm text-primary"
        >
          {isExpanded ? (
            <>
              Ver menos <ChevronUp className="w-4 h-4" />
            </>
          ) : (
            <>
              Ver mais <ChevronDown className="w-4 h-4" />
            </>
          )}
        </button>
      </div>
    </div>
  );
};

export default ProductDescription;