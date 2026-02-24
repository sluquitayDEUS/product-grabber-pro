import { useState, memo, useCallback } from "react";

import aquavolt1 from "@/assets/aquavolt-new-1.webp";
import aquavolt2 from "@/assets/aquavolt-new-2.webp";
import aquavolt3 from "@/assets/aquavolt-new-3.webp";
import aquavolt4 from "@/assets/aquavolt-new-4.webp";
import aquavolt5 from "@/assets/aquavolt-new-5.webp";

const images = [aquavolt1, aquavolt2, aquavolt3, aquavolt4, aquavolt5];

interface ProductGalleryProps {
  currentIndex: number;
  onIndexChange: (index: number) => void;
}

const ProductGallery = memo(({ currentIndex, onIndexChange }: ProductGalleryProps) => {
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
      onIndexChange(currentIndex + 1);
    }
    if (touchStart - touchEnd < -50 && currentIndex > 0) {
      onIndexChange(currentIndex - 1);
    }
  }, [touchStart, touchEnd, currentIndex, onIndexChange]);

  return (
    <div className="relative w-full bg-card overflow-hidden">
      {/* Images Container */}
      <div
        className="flex transition-transform duration-300 ease-out will-change-transform"
        style={{ transform: `translateX(-${currentIndex * 100}%)` }}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}>

        {images.map((img, index) =>
        <img
          key={index}
          src={img}
          alt={`AquaVolt - Kart Aquático Elétrico ${index + 1}`}
          className="w-full h-auto flex-shrink-0"
          width={600}
          height={600}
          loading={index === 0 ? "eager" : "lazy"}
          decoding="async"
          fetchPriority={index === 0 ? "high" : "low"} />

        )}
      </div>

      {/* Frete Grátis banner at bottom of image */}
      <div className="absolute bottom-0 left-0 right-0 flex items-center justify-between">
        



        {/* Image Counter */}
        <div className="bg-black/50 text-white text-xs px-2 py-1 rounded-full mr-3 mb-1">
          {currentIndex + 1}/{images.length}
        </div>
      </div>
    </div>);

});

ProductGallery.displayName = "ProductGallery";

export default ProductGallery;