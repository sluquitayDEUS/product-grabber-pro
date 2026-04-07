import { useState, memo, useCallback } from "react";

import relogio1 from "@/assets/relogio/relogio-1.webp";
import relogio2 from "@/assets/relogio/relogio-2.jpg";
import relogio3 from "@/assets/relogio/relogio-3.jpg";
import relogio4 from "@/assets/relogio/relogio-4.jpg";

const images = [relogio1, relogio2, relogio3, relogio4];

const WatchGallery = memo(() => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [touchStart, setTouchStart] = useState(0);
  const [touchEnd, setTouchEnd] = useState(0);

  const handleTouchStart = useCallback((e: React.TouchEvent) => {
    setTouchStart(e.targetTouches[0].clientX);
  }, []);

  const handleTouchMove = useCallback((e: React.TouchEvent) => {
    setTouchEnd(e.targetTouches[0].clientX);
  }, []);

  const handleTouchEnd = useCallback(() => {
    if (touchStart - touchEnd > 50 && currentIndex < images.length - 1) {
      setCurrentIndex(currentIndex + 1);
    }
    if (touchStart - touchEnd < -50 && currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
    }
  }, [touchStart, touchEnd, currentIndex]);

  return (
    <div className="relative w-full bg-card overflow-hidden aspect-square">
      <div
        className="flex transition-transform duration-300 ease-out will-change-transform"
        style={{ transform: `translateX(-${currentIndex * 100}%)` }}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
        {images.map((img, index) => (
          <img
            key={index}
            src={img}
            alt={`Relógio Imperium ${index + 1}`}
            className="w-full h-full flex-shrink-0 object-cover"
            width={1024}
            height={1024}
            loading={index === 0 ? "eager" : "lazy"}
            decoding="async"
            fetchPriority={index === 0 ? "high" : "low"}
          />
        ))}
      </div>

      {/* Image Counter */}
      <div className="absolute bottom-2 right-3 bg-black/50 text-white text-xs px-2 py-1 rounded-full">
        {currentIndex + 1}/{images.length}
      </div>

      {/* Thumbnails */}
      <div className="absolute bottom-0 left-0 right-0" />
    </div>
  );
});

WatchGallery.displayName = "WatchGallery";
export default WatchGallery;
