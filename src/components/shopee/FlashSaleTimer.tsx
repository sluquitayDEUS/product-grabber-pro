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
    <div className="bg-gradient-to-r from-[#D0011B] to-[#EE4D2D]">
      <div className="px-3 py-2 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Zap className="w-4 h-4 text-yellow-300 fill-yellow-300" />
          <span className="text-white font-bold text-sm tracking-wide">
            OFERTAS RE<span className="text-yellow-300">⚡</span>ÂMPAGO
          </span>
        </div>
        <div className="flex items-center gap-1 text-white text-xs">
          <span>TERMINA EM</span>
          <div className="flex items-center gap-0.5 ml-1">
            <span className="bg-black/80 px-1.5 py-0.5 rounded font-mono font-bold text-sm">
              {formatNumber(timeLeft.hours)}
            </span>
            <span className="font-bold">:</span>
            <span className="bg-black/80 px-1.5 py-0.5 rounded font-mono font-bold text-sm">
              {formatNumber(timeLeft.minutes)}
            </span>
            <span className="font-bold">:</span>
            <span className="bg-black/80 px-1.5 py-0.5 rounded font-mono font-bold text-sm">
              {formatNumber(timeLeft.seconds)}
            </span>
          </div>
        </div>
      </div>
      {/* Barra de progresso - % vendido */}
      <div className="px-3 pb-2">
        <div className="flex items-center gap-2">
          <div className="flex-1 h-3 bg-white/30 rounded-full overflow-hidden">
            <div 
              className="h-full bg-gradient-to-r from-yellow-300 to-yellow-500 rounded-full transition-all duration-300"
              style={{ width: '78%' }}
            />
          </div>
          <span className="text-white text-[10px] font-medium whitespace-nowrap">
            🔥 78% vendido
          </span>
        </div>
      </div>
    </div>
  );
};

export default FlashSaleTimer;
