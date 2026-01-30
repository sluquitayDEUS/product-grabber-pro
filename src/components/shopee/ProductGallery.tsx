import { useState, memo, useCallback } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

// Import product images
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
    <div className="relative w-full aspect-square bg-card overflow-hidden">
      {/* Discount Badge */}
      <div className="absolute top-3 left-0 z-10 bg-shopee-red text-primary-foreground px-2 py-1 text-xs font-bold">
        -40%
      </div>

      {/* Images Container */}
      <div
        className="flex h-full transition-transform duration-300 ease-out will-change-transform"
        style={{ transform: `translateX(-${currentIndex * 100}%)` }}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
        {images.map((img, index) => (
          <img
            key={index}
            src={img}
            alt={`AquaVolt - Kart Aquático Elétrico ${index + 1}`}
            className="w-full h-full object-cover flex-shrink-0"
            loading={index === 0 ? "eager" : "lazy"}
            decoding="async"
            fetchPriority={index === 0 ? "high" : "low"}
          />
        ))}
      </div>

      {/* Navigation Arrows (Desktop) */}
      <button
        onClick={() => onIndexChange(Math.max(0, currentIndex - 1))}
        className="absolute left-2 top-1/2 -translate-y-1/2 w-8 h-8 bg-black/30 rounded-full hidden md:flex items-center justify-center"
        disabled={currentIndex === 0}
      >
        <ChevronLeft className="w-5 h-5 text-primary-foreground" />
      </button>
      <button
        onClick={() => onIndexChange(Math.min(images.length - 1, currentIndex + 1))}
        className="absolute right-2 top-1/2 -translate-y-1/2 w-8 h-8 bg-black/30 rounded-full hidden md:flex items-center justify-center"
        disabled={currentIndex === images.length - 1}
      >
        <ChevronRight className="w-5 h-5 text-primary-foreground" />
      </button>

      {/* Image Counter */}
      <div className="absolute bottom-3 right-3 bg-black/50 text-primary-foreground text-xs px-2 py-1 rounded-full">
        {currentIndex + 1}/{images.length}
      </div>
    </div>
  );
});

ProductGallery.displayName = "ProductGallery";

export default ProductGallery;
