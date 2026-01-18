import { useState, useEffect, memo, useCallback } from "react";
import { Zap } from "lucide-react";

const FlashSaleTimer = memo(() => {
  const [timeLeft, setTimeLeft] = useState({ hours: 0, minutes: 0, seconds: 0 });

  const calculateTimeLeft = useCallback(() => {
      const now = new Date();
      const midnight = new Date();
      midnight.setHours(24, 0, 0, 0);
      
      const diff = midnight.getTime() - now.getTime();
      
      const hours = Math.floor(diff / (1000 * 60 * 60));
      const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((diff % (1000 * 60)) / 1000);
      
    return { hours, minutes, seconds };
  }, []);

  useEffect(() => {
    setTimeLeft(calculateTimeLeft());

    const timer = setInterval(() => {
      setTimeLeft(calculateTimeLeft());
    }, 1000);

    return () => clearInterval(timer);
  }, [calculateTimeLeft]);

  const formatNumber = (num: number) => num.toString().padStart(2, '0');

  return (
    <div className="flex items-center h-10 bg-gradient-to-r from-[#EE4D2D] to-[#F97316] px-3 gap-2">
      {/* OFERTAS RELÂMPAGO */}
      <span className="text-white font-bold text-sm whitespace-nowrap tracking-tight">
        OFERTAS RE<Zap className="inline w-4 h-4 text-yellow-300 fill-yellow-300 -mt-0.5 mx-[-2px]" />ÂMPAGO
      </span>
      
      {/* TERMINA EM + Timer */}
      <span className="text-white text-sm font-normal ml-1">TERMINA EM</span>
      <div className="flex items-center gap-1">
        <span className="bg-[#111] text-white px-1 py-0.5 rounded-sm text-sm font-bold font-mono min-w-[22px] text-center">
          {formatNumber(timeLeft.hours)}
        </span>
        <span className="text-white font-bold text-sm">:</span>
        <span className="bg-[#111] text-white px-1 py-0.5 rounded-sm text-sm font-bold font-mono min-w-[22px] text-center">
          {formatNumber(timeLeft.minutes)}
        </span>
        <span className="text-white font-bold text-sm">:</span>
        <span className="bg-[#111] text-white px-1 py-0.5 rounded-sm text-sm font-bold font-mono min-w-[22px] text-center">
          {formatNumber(timeLeft.seconds)}
        </span>
      </div>
    </div>
  );
});

FlashSaleTimer.displayName = "FlashSaleTimer";

export default FlashSaleTimer;
