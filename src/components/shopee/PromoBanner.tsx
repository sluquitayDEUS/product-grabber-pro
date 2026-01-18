import { useState } from "react";
import { X } from "lucide-react";
import promoBanner from "@/assets/promo-banner.webp";

const PromoBanner = () => {
  const [isVisible, setIsVisible] = useState(true);

  if (!isVisible) return null;

  return (
    <div className="relative w-full">
      <img
        src={promoBanner}
        alt="2.2 1ª Liquida do Ano - R$16 Milhões em cupons, Frete Grátis, 40% Cashback"
        className="w-full h-auto"
      />
      <button
        onClick={() => setIsVisible(false)}
        className="absolute top-1 right-1 w-6 h-6 bg-white/80 hover:bg-white rounded-sm flex items-center justify-center transition-colors"
        aria-label="Fechar banner"
      >
        <X className="w-4 h-4 text-gray-600" />
      </button>
    </div>
  );
};

export default PromoBanner;
