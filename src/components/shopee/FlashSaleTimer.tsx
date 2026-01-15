import { useState, useEffect } from "react";
import { Zap } from "lucide-react";

const FlashSaleTimer = () => {
  const [timeLeft, setTimeLeft] = useState({ hours: 0, minutes: 0, seconds: 0 });

  useEffect(() => {
    const calculateTimeLeft = () => {
      const now = new Date();
      const midnight = new Date();
      midnight.setHours(24, 0, 0, 0);
      
      const diff = midnight.getTime() - now.getTime();
      
      const hours = Math.floor(diff / (1000 * 60 * 60));
      const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((diff % (1000 * 60)) / 1000);
      
      return { hours, minutes, seconds };
    };

    setTimeLeft(calculateTimeLeft());

    const timer = setInterval(() => {
      setTimeLeft(calculateTimeLeft());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const formatNumber = (num: number) => num.toString().padStart(2, '0');

  return (
    <div className="flex items-stretch h-12 overflow-hidden">
      {/* Left side - OFERTAS RELÂMPAGO */}
      <div className="bg-gradient-to-r from-[#EE4D2D] to-[#F97316] flex items-center px-3 gap-1.5">
        <span className="text-white font-bold text-sm whitespace-nowrap">
          OFERTAS RE<Zap className="inline w-3.5 h-3.5 text-yellow-300 fill-yellow-300 -mt-0.5" />ÂMPAGO
        </span>
      </div>
      
      {/* Right side - Timer */}
      <div className="bg-[#FFF5F2] flex items-center px-3 flex-1 justify-end gap-2">
        <span className="text-[#333] text-xs font-medium">TERMINA EM</span>
        <div className="flex items-center gap-0.5">
          <span className="bg-[#333] text-white px-1.5 py-1 rounded text-sm font-bold font-mono min-w-[24px] text-center">
            {formatNumber(timeLeft.hours)}
          </span>
          <span className="text-[#EE4D2D] font-bold text-sm">:</span>
          <span className="bg-[#333] text-white px-1.5 py-1 rounded text-sm font-bold font-mono min-w-[24px] text-center">
            {formatNumber(timeLeft.minutes)}
          </span>
          <span className="text-[#EE4D2D] font-bold text-sm">:</span>
          <span className="bg-[#333] text-white px-1.5 py-1 rounded text-sm font-bold font-mono min-w-[24px] text-center">
            {formatNumber(timeLeft.seconds)}
          </span>
        </div>
      </div>
    </div>
  );
};

export default FlashSaleTimer;
