import { useState } from "react";
import { X } from "lucide-react";
import promoBanner from "@/assets/promo-banner.webp";

const PromoBanner = () => {
  const [isVisible, setIsVisible] = useState(true);

  if (!isVisible) return null;

  return (
    <div className="relative w-full z-50">
      <img
        src={promoBanner}
        alt="2.2 1ª Liquida do Ano - R$16 Milhões em cupons, Frete Grátis, 40% Cashback"
        className="w-full h-auto"
        width={800}
        height={200}
        loading="eager"
        fetchPriority="high"
      />
      <button
        onClick={() => setIsVisible(false)}
        className="absolute top-1/2 -translate-y-1/2 right-1 w-4 h-4 bg-black/40 hover:bg-black/60 rounded-full flex items-center justify-center transition-colors"
        aria-label="Fechar banner"
      >
        <X className="w-2.5 h-2.5 text-white" />
      </button>
    </div>
  );
};

export default PromoBanner;
