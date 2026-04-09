import { useState, memo } from "react";
import { ChevronDown, ChevronUp } from "lucide-react";

interface Props {
  specs: { label: string; value: string }[];
  description: string;
  bullets: string[];
  images: string[];
  productName: string;
}

const GenericProductDescription = memo(({ specs, description, bullets, images, productName }: Props) => {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <div className="bg-card px-3 py-4 mt-2 description-section">
      <h2 className="text-sm font-medium text-foreground mb-3">Detalhes do Produto</h2>
      <div className="space-y-2 mb-4">
        {specs.map((spec, index) => (
          <div key={index} className="flex text-xs">
            <span className="w-28 text-muted-foreground flex-shrink-0">{spec.label}</span>
            <span className="text-foreground">{spec.value}</span>
          </div>
        ))}
      </div>
      <div className="border-t border-border pt-4">
        <h3 className="text-sm font-medium text-foreground mb-2">Descrição</h3>
        <div className={`text-xs leading-relaxed space-y-4 ${!isExpanded && "max-h-[200px] overflow-hidden"}`}>
          <p className="text-foreground">{description}</p>
          {images.length > 0 && (
            <img src={images[0]} alt={productName} className="w-full rounded-lg" loading="lazy" decoding="async" />
          )}
          <div className="space-y-2">
            <h4 className="text-base font-bold text-foreground text-center">Características Principais</h4>
            <ul className="list-disc pl-4 space-y-1 text-foreground">
              {bullets.map((bullet, i) => (
                <li key={i}><strong>{bullet.split(" ").slice(0, 2).join(" ")}</strong> {bullet.split(" ").slice(2).join(" ")}</li>
              ))}
            </ul>
          </div>
          {images.length > 1 && (
            <img src={images[1]} alt={`${productName} detalhe`} className="w-full rounded-lg" loading="lazy" decoding="async" />
          )}
          <div className="space-y-2 text-center">
            <p className="text-foreground italic">
              Não perca esta oportunidade única! Produto com qualidade garantida e envio rápido. Compre agora e aproveite! 🔥
            </p>
            <p className="text-primary font-bold">
              Finalize sua compra agora e receba com Frete Grátis!
            </p>
          </div>
        </div>
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="flex items-center justify-center gap-1 w-full mt-3 py-2 text-sm text-primary"
        >
          {isExpanded ? <>Ver menos <ChevronUp className="w-4 h-4" /></> : <>Ver mais <ChevronDown className="w-4 h-4" /></>}
        </button>
      </div>
    </div>
  );
});

GenericProductDescription.displayName = "GenericProductDescription";
export default GenericProductDescription;
