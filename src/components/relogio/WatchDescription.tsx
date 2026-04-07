import { useState, memo } from "react";
import { ChevronDown, ChevronUp } from "lucide-react";
import LazyImage from "@/components/ui/lazy-image";

import selosImg from "@/assets/relogio/selos.webp";
import carteiraBrinde from "@/assets/relogio/carteira-brinde.jpg";
import relogio1 from "@/assets/relogio/relogio-1.webp";
import relogio2 from "@/assets/relogio/relogio-2.jpg";

const specs = [
  { label: "Material", value: "Aço 904L" },
  { label: "Vidro", value: "Cristal de safira" },
  { label: "Movimento", value: "Automático ETA2840 Suíça" },
  { label: "Diâmetro", value: "41mm" },
  { label: "Pulseira", value: "Titânio" },
  { label: "Resistência", value: "Até 30 metros" },
  { label: "Garantia", value: "2 anos contra perda e roubo" },
];

const WatchDescription = memo(() => {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <div className="bg-card px-3 py-4 mt-2 description-section">
      <h2 className="text-sm font-medium text-foreground mb-3">Detalhes do Produto</h2>

      {/* Specifications */}
      <div className="space-y-2 mb-4">
        {specs.map((spec, index) => (
          <div key={index} className="flex text-xs">
            <span className="w-28 text-muted-foreground flex-shrink-0">{spec.label}</span>
            <span className="text-foreground">{spec.value}</span>
          </div>
        ))}
      </div>

      {/* Description */}
      <div className="border-t border-border pt-4">
        <h3 className="text-sm font-medium text-foreground mb-2">Descrição</h3>
        <div className={`text-xs leading-relaxed space-y-4 ${!isExpanded && "max-h-[200px] overflow-hidden"}`}>
          
          {/* Selos */}
          <LazyImage src={selosImg} alt="Selos de qualidade" className="w-full rounded-lg" width={600} height={200} />

          {/* Conteúdo do Pacote */}
          <div className="space-y-2 text-center">
            <h4 className="text-base font-bold text-foreground">Conteúdo Exclusivo do Pacote</h4>
            <ul className="list-disc pl-4 space-y-1 text-foreground text-left">
              <li><strong>Relógio Imperium:</strong> Design elegante e sofisticado.</li>
              <li><strong>Caixa Personalizada:</strong> Elegante e Protetora - BRINDE</li>
              <li><strong>Cartão de Garantia:</strong> Garantia de 2 anos.</li>
              <li><strong>Ajustador de Pulseira:</strong> Ajuste perfeito - BRINDE</li>
              <li><strong>Certificado de Autenticidade:</strong> Comprova qualidade.</li>
            </ul>
          </div>

          <LazyImage src={relogio1} alt="Relógio Imperium" className="w-full rounded-lg" width={600} height={600} />

          {/* Linha Suíça */}
          <div className="space-y-2 text-center">
            <h5 className="text-sm font-semibold text-foreground">Relógio da Linha Suíça</h5>
            <p className="text-foreground">
              <strong>Linha Premium A+:</strong> Relógio de altíssima qualidade, feito para impressionar.
            </p>
            <p className="text-foreground">
              <strong>Design Elegante:</strong> Um design clássico e sofisticado que combina com qualquer ocasião.
            </p>
          </div>

          <LazyImage src={relogio2} alt="Relógio Imperium detalhe" className="w-full rounded-lg" width={600} height={600} />

          {/* Especificações detalhadas */}
          <div className="space-y-2 text-center">
            <h5 className="text-sm font-semibold text-foreground">Especificações Técnicas</h5>
            <ul className="list-disc pl-4 space-y-1 text-foreground text-left">
              <li><strong>Resistência à Água:</strong> Mergulho até 30 metros, perfeito para aventuras aquáticas.</li>
              <li><strong>Vidro:</strong> Cristal de safira, resistente e protetor.</li>
              <li><strong>Material:</strong> Aço 904L denso, garantindo resistência e durabilidade.</li>
              <li><strong>Movimento:</strong> Automático, Máquina Base ETA2840 suíça, precisão e confiabilidade.</li>
              <li><strong>Diâmetro:</strong> 41mm, tamanho ideal que se destaca no pulso.</li>
              <li><strong>Pulseira:</strong> Titânio, leve e resistente, conforto e durabilidade.</li>
            </ul>
          </div>

          {/* Frase motivacional */}
          <div className="space-y-2 text-center">
            <p className="text-foreground italic">
              Um relógio não é apenas um acessório, é a expressão do seu poder, sucesso e autoridade. Não deixe essa oportunidade passar, conquiste o seu agora e mostre ao mundo quem você realmente é. 💎⌚️
            </p>
            <p className="text-primary font-bold">
              Finalize sua compra agora e receba de BRINDE uma exclusiva Carteira de Couro!
            </p>
          </div>

          <LazyImage src={carteiraBrinde} alt="Carteira de brinde" className="w-full rounded-lg" width={600} height={400} />
        </div>

        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="flex items-center justify-center gap-1 w-full mt-3 py-2 text-sm text-primary"
        >
          {isExpanded ? (
            <>Ver menos <ChevronUp className="w-4 h-4" /></>
          ) : (
            <>Ver mais <ChevronDown className="w-4 h-4" /></>
          )}
        </button>
      </div>
    </div>
  );
});

WatchDescription.displayName = "WatchDescription";
export default WatchDescription;
