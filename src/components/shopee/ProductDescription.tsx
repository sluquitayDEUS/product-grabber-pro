import { useState, memo } from "react";
import { ChevronDown, ChevronUp } from "lucide-react";
import LazyImage from "@/components/ui/lazy-image";

// Import description images
import aquavoltBanner from "@/assets/aquavolt-banner.webp";
import aquavoltPower from "@/assets/aquavolt-power.png";
import aquavoltResistance from "@/assets/aquavolt-resistance.webp";
import aquavoltDurability from "@/assets/aquavolt-durability.webp";
import aquavoltNavigation from "@/assets/aquavolt-navigation.webp";
import aquavoltAccelerator from "@/assets/aquavolt-accelerator.png";
import aquavoltSafety from "@/assets/aquavolt-safety.webp";
import aquavoltStyle from "@/assets/aquavolt-style.webp";
import aquavoltCharging from "@/assets/aquavolt-charging.webp";
import aquavoltSupport from "@/assets/aquavolt-support.jpg";
import aquavoltNoLicense from "@/assets/aquavolt-no-license.webp";
import aquavoltTransport from "@/assets/aquavolt-transport.webp";
import aquavoltSpecs from "@/assets/aquavolt-specs.webp";

const specs = [
  { label: "Potência", value: "15 kW" },
  { label: "Velocidade Máxima", value: "52 km/h" },
  { label: "Autonomia", value: "70-80 min" },
  { label: "Peso", value: "Casco 45 kg + Bateria 23 kg" },
  { label: "Capacidade", value: "Suporta até 130 kg" },
  { label: "Material", value: "ABS + PC + EPP (casco)" },
  { label: "Bateria", value: "Lítio ternária" },
  { label: "Carregamento", value: "3-4 horas (220V/110V)" },
  { label: "Dimensões", value: "1850 x 860 x 550 mm" },
  { label: "Garantia", value: "90 dias de fábrica" },
  { label: "Certificações", value: "CE, FCC, ROHS, MSDS, UL38.3" },
];

const ProductDescription = memo(() => {
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
          
          {/* Banner */}
          <LazyImage src={aquavoltBanner} alt="AquaVolt Banner" className="w-full rounded-lg" />
          
          {/* Intro */}
          <div className="space-y-2 text-center">
            <h4 className="text-base font-bold text-foreground">AquaVolt Explicação</h4>
            
            {/* Wistia Video - 16:9 aspect ratio */}
            <div className="w-full my-3">
              <div className="relative w-full" style={{ paddingBottom: "56.25%" }}>
                <iframe 
                  src="https://fast.wistia.net/embed/iframe/x00b5mokfv?web_component=true&seo=true" 
                  title="AquaVolt Video" 
                  allow="autoplay; fullscreen" 
                  frameBorder="0" 
                  scrolling="no" 
                  className="absolute top-0 left-0 w-full h-full rounded-lg" 
                  name="wistia_embed"
                />
              </div>
            </div>
            
            <h5 className="text-sm font-semibold text-foreground">Experimente uma diversão sem precedentes no karting aquático</h5>
            <p className="text-foreground">
              <strong>Conheça o revolucionário AquaVolt</strong>, um híbrido impressionante de kart e jet ski, também conhecido como "boat kart". Este inovador jet boat incorpora uma mistura perfeita de potência, agilidade e a pura adrenalina de cruzar a água a uma velocidade incrível e com melhor custo benefício.
            </p>
            <p className="text-primary font-bold">ULTIMO DIA DE PROMOÇÃO!</p>
          </div>

          <LazyImage src={aquavoltPower} alt="AquaVolt Power" className="w-full rounded-lg" />

          {/* Power Section */}
          <div className="space-y-2 text-center">
            <h5 className="text-sm font-semibold text-foreground">AquaVolt: O Poder Interior</h5>
            <p className="text-foreground">
              O AquaVolt, um impressionante <strong>barco de kart</strong>, vem com uma potência nominal de 15 kW que pode acelerar a uma velocidade máxima emocionante de 52 km/h. Essa velocidade notável corresponde muito à velocidade de um jet ski tradicional, prometendo uma experiência cativante de kart jet ski.
            </p>
          </div>

          <LazyImage src={aquavoltResistance} alt="AquaVolt Resistance" className="w-full rounded-lg" />

          {/* Resistance Section */}
          <div className="space-y-2 text-center">
            <h5 className="text-sm font-semibold text-foreground">Resistência do AquaVolt</h5>
            <p className="text-foreground">
              O AquaVolt, um <strong>excelente kart aquático</strong>, oferece um impressionante tempo de pico de energia de 70-80 minutos. Além disso, o sistema de resfriamento ativo por imersão em água prolonga a diversão de alta octanagem sob o sol.
            </p>
          </div>

          <LazyImage src={aquavoltDurability} alt="AquaVolt Durability" className="w-full rounded-lg" />

          {/* Durability Section */}
          <div className="space-y-2 text-center">
            <h5 className="text-sm font-semibold text-foreground">AquaVolt: Projetado para Durabilidade e Desempenho</h5>
            <p className="text-foreground">
              O AquaVolt é fabricado com uma combinação robusta de ABS, PC e EPP, assegurando <strong>resistência e leveza</strong>. Com um casco pesando apenas 45 kg e uma bateria de 23 kg, o AquaVolt oferece a emoção de um jet ski no universo dos karts de barco, combinando facilidade de uso e estilo impressionante.
            </p>
          </div>

          <LazyImage src={aquavoltNavigation} alt="AquaVolt Navigation" className="w-full rounded-lg" />

          {/* Navigation Section */}
          <div className="space-y-2 text-center">
            <h5 className="text-sm font-semibold text-foreground">Navegação Tranquila com o AquaVolt</h5>
            <p className="text-foreground">
              O AquaVolt é equipado com sistema de <strong>troca de marchas alta e baixa</strong>, além de marcha ré, proporcionando uma manobrabilidade excepcional em águas abertas. Caso as hélices fiquem presas em algas aquáticas, uma simples mudança para marcha ré resolverá rapidamente o problema, garantindo uma navegação tranquila e sem interrupções.
            </p>
          </div>

          <LazyImage src={aquavoltAccelerator} alt="AquaVolt Accelerator" className="w-full rounded-lg" />

          {/* Safety Section */}
          <div className="space-y-2 text-center">
            <h5 className="text-sm font-semibold text-foreground">AquaVolt: Seguro e Estável</h5>
            <p className="text-foreground">
              O AquaVolt conta com uma <strong>gaiola de proteção</strong> que assegura a estabilidade do barco e mantém um centro de gravidade baixo, tornando praticamente impossível a sua capotagem. Este recurso, inspirado no design de jatos americanos, adiciona uma camada extra de segurança.
            </p>
          </div>

          <LazyImage src={aquavoltSafety} alt="AquaVolt Safety" className="w-full rounded-lg" />

          {/* Style Section */}
          <div className="space-y-2 text-center">
            <h5 className="text-sm font-semibold text-foreground">Estética Única de Jet Kart</h5>
            <p className="text-foreground">
              Do assento tipo concha ao volante estilizado disponível em três cores distintas, cada detalhe do AquaVolt reflete <strong>estilo e conforto</strong>. A cabine apresenta um piso com acabamento que imita madeira, enquanto o exterior exibe um elegante acabamento com pintura efeito piano-baked.
            </p>
          </div>

          <LazyImage src={aquavoltStyle} alt="AquaVolt Style" className="w-full rounded-lg" />

          {/* Charging Section */}
          <div className="space-y-2 text-center">
            <h5 className="text-sm font-semibold text-foreground">Carregamento Facilitado</h5>
            <p className="text-foreground">
              O AquaVolt é compatível com várias especificações de carregador, oferecendo opções de 220 V e 110 V para atender às necessidades de regiões europeias e americanas. Sua bateria de lítio ternária carrega completamente em 3-4 horas e possui uma vida útil de até 800 ciclos de carga e descarga, garantindo <strong>eficiência e durabilidade a longo prazo.</strong>
            </p>
          </div>

          <LazyImage src={aquavoltCharging} alt="AquaVolt Charging" className="w-full rounded-lg" />

          {/* Support Section */}
          <div className="space-y-2 text-center">
            <h5 className="text-sm font-semibold text-foreground">Onde faço reparos caso precise?</h5>
            <p className="text-foreground">
              <strong>Se precisar de reparos devido ao mau uso</strong>, por favor, entre em contato com nossa equipe de suporte através da página de contato. Eles irão conectá-lo a um mecânico náutico especializado próximo a você. Este profissional, recomendado pela Atacado Premium, é de total confiança e está preparado para ajudar com qualquer necessidade relacionada ao seu AquaVolt.
            </p>
          </div>

          <LazyImage src={aquavoltSupport} alt="AquaVolt Support" className="w-full rounded-lg" />

          {/* No License Section */}
          <div className="space-y-2 text-center">
            <h5 className="text-sm font-semibold text-foreground">Sem necessidade de habilitação náutica</h5>
            <p className="text-foreground">
              Viva a emoção de pilotar o <strong>AquaVolt</strong>, o kart aquático 100% elétrico que <strong>não exige habilitação náutica!</strong> Para conduzir, é necessário <strong>ter mais de 17 anos e utilizar o colete salva-vidas</strong>. O AquaVolt acompanha um <strong>certificado de licença e autorização da Marinha do Brasil</strong>, que <strong>deve ser lido atentamente antes da navegação</strong> e pode ser apresentado em caso de fiscalização.
            </p>
          </div>

          <LazyImage src={aquavoltNoLicense} alt="Sem habilitação náutica" className="w-full rounded-lg" />

          {/* Transport Section */}
          <div className="space-y-2 text-center">
            <h5 className="text-sm font-semibold text-foreground">Fácil de ser Transportado</h5>
          </div>

          <LazyImage src={aquavoltTransport} alt="AquaVolt Transport" className="w-full rounded-lg" />

          {/* Specs Summary */}
          <div className="space-y-2 text-center">
            <h5 className="text-sm font-semibold text-foreground">Especificações do AquaVolt - Kart Aquático</h5>
            <ul className="list-disc pl-4 space-y-1 text-foreground text-left">
              <li><strong>Potência:</strong> 15 kW</li>
              <li><strong>Velocidade Máxima:</strong> 52 km/h</li>
              <li><strong>Autonomia:</strong> 70-80 min</li>
              <li><strong>Peso:</strong> Casco 45 kg + Bateria 23 kg</li>
              <li><strong>Capacidade:</strong> Suporta até 130 kg</li>
              <li><strong>Material:</strong> ABS + PC + EPP (casco), Bateria de lítio ternária</li>
              <li><strong>Recursos:</strong> Resfriamento ativo, troca de marchas e ré</li>
              <li><strong>Carregamento:</strong> 3-4 horas (220V/110V)</li>
              <li><strong>Dimensões:</strong> 1850 x 860 x 550 mm</li>
              <li><strong>Acessórios:</strong> Airbag anticolisão, Colete salva-vidas, Piso sintético</li>
              <li><strong>Garantia de fábrica:</strong> 90 dias</li>
              <li><strong>Certificações:</strong> CE, FCC, ROHS, MSDS, UL38.3</li>
            </ul>
          </div>

          <LazyImage src={aquavoltSpecs} alt="AquaVolt Specs" className="w-full rounded-lg" />

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
});

ProductDescription.displayName = "ProductDescription";

export default ProductDescription;
