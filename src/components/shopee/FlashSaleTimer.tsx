import { useState, useEffect, memo, useCallback } from "react";
import { Zap } from "lucide-react";

const FlashSaleTimer = memo(() => {
  const [timeLeft, setTimeLeft] = useState({ hours: 0, minutes: 0, seconds: 0 });

  const calculateTimeLeft = useCallback(() => {
    const now = new Date();
    const midnight = new Date();
    midnight.setHours(24, 0, 0, 0);
    const diff = midnight.getTime() - now.getTime();
    return {
      hours: Math.floor(diff / (1000 * 60 * 60)),
      minutes: Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60)),
      seconds: Math.floor((diff % (1000 * 60)) / 1000),
    };
  }, []);

  useEffect(() => {
    setTimeLeft(calculateTimeLeft());
    const timer = setInterval(() => setTimeLeft(calculateTimeLeft()), 1000);
    return () => clearInterval(timer);
  }, [calculateTimeLeft]);

  const fmt = (n: number) => n.toString().padStart(2, '0');

  return (
    <div className="flex items-center h-9 bg-gradient-to-r from-[#EE4D2D] to-[#FF7337] px-3 gap-2">
      <span className="text-white font-bold text-[13px] whitespace-nowrap tracking-tight">
        OFERTAS RE<Zap className="inline w-3.5 h-3.5 text-yellow-300 fill-yellow-300 -mt-0.5 mx-[-1px]" />ÂMPAGO
      </span>
      <span className="text-white/90 text-xs font-normal ml-auto">TERMINA EM</span>
      <div className="flex items-center gap-[3px]">
        <span className="bg-[#111] text-white px-[5px] py-[2px] rounded-sm text-xs font-bold font-mono min-w-[20px] text-center">
          {fmt(timeLeft.hours)}
        </span>
        <span className="text-white font-bold text-xs">:</span>
        <span className="bg-[#111] text-white px-[5px] py-[2px] rounded-sm text-xs font-bold font-mono min-w-[20px] text-center">
          {fmt(timeLeft.minutes)}
        </span>
        <span className="text-white font-bold text-xs">:</span>
        <span className="bg-[#111] text-white px-[5px] py-[2px] rounded-sm text-xs font-bold font-mono min-w-[20px] text-center">
          {fmt(timeLeft.seconds)}
        </span>
      </div>
    </div>
  );
});

FlashSaleTimer.displayName = "FlashSaleTimer";
export default FlashSaleTimer;
