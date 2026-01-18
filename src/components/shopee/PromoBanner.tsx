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
      />
      <button
        onClick={() => setIsVisible(false)}
        className="absolute top-1/2 -translate-y-1/2 right-2 w-5 h-5 bg-white/90 hover:bg-white rounded-sm flex items-center justify-center transition-colors shadow-sm"
        aria-label="Fechar banner"
      >
        <X className="w-3 h-3 text-gray-700" />
      </button>
    </div>
  );
};

export default PromoBanner;
