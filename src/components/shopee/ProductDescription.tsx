import { useState } from "react";
import { ChevronDown, ChevronUp } from "lucide-react";

const specs = [
  { label: "Marca", value: "Aquavolt" },
  { label: "Material", value: "Fibra de Carbono + ABS Náutico" },
  { label: "Motor", value: "100% Elétrico 5000W" },
  { label: "Bateria", value: "Lítio 48V 20Ah" },
  { label: "Velocidade", value: "Até 45 km/h" },
  { label: "Autonomia", value: "60-90 minutos" },
  { label: "Peso", value: "45kg" },
  { label: "Garantia", value: "24 meses" },
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
            🌊 AQUAVOLT - O KART AQUÁTICO DO FUTURO!
          </p>
          <p className="mb-2">
            ✅ 100% elétrico e silencioso - sem emissão de poluentes
          </p>
          <p className="mb-2">
            ✅ Motor de 5000W de alta performance para máxima adrenalina
          </p>
          <p className="mb-2">
            ✅ Atinge até 45 km/h na água com total segurança
          </p>
          <p className="mb-2">
            ✅ Bateria de lítio com autonomia de 60-90 minutos
          </p>
          <p className="mb-2">
            ✅ Design hidrodinâmico em fibra de carbono ultra leve
          </p>
          <p className="mb-2">
            ✅ Sistema de estabilização automática anti-capotamento
          </p>
          <p className="mb-2">
            ✅ Carregamento rápido em apenas 3 horas
          </p>
          <p className="mb-2">
            ✅ Ideal para lagos, represas e praias calmas
          </p>
          <p className="mb-2">
            ✅ Fácil transporte - cabe no porta-malas do carro
          </p>
          <p>
            📦 O pacote inclui: 1x Aquavolt completo, 1x Bateria 48V 20Ah, 1x Carregador inteligente, 1x Colete salva-vidas, 1x Manual completo, 1x Kit de ferramentas
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