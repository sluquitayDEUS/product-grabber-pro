import { useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

const images = [
  "https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=600&h=600&fit=crop",
  "https://images.unsplash.com/photo-1530053969600-caed2596d242?w=600&h=600&fit=crop",
  "https://images.unsplash.com/photo-1559628129-67cf63b72248?w=600&h=600&fit=crop",
  "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=600&h=600&fit=crop",
  "https://images.unsplash.com/photo-1517649763962-0c623066013b?w=600&h=600&fit=crop",
];

const ProductGallery = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [touchStart, setTouchStart] = useState(0);
  const [touchEnd, setTouchEnd] = useState(0);

  const handleTouchStart = (e: React.TouchEvent) => {
    setTouchStart(e.targetTouches[0].clientX);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    setTouchEnd(e.targetTouches[0].clientX);
  };

  const handleTouchEnd = () => {
    if (touchStart - touchEnd > 50 && currentIndex < images.length - 1) {
      setCurrentIndex(currentIndex + 1);
    }
    if (touchStart - touchEnd < -50 && currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
    }
  };

  return (
    <div className="relative w-full aspect-square bg-card overflow-hidden">
      {/* Discount Badge */}
      <div className="absolute top-3 left-0 z-10 bg-shopee-red text-primary-foreground px-2 py-1 text-xs font-bold">
        -34%
      </div>

      {/* Images Container */}
      <div
        className="flex h-full transition-transform duration-300 ease-out"
        style={{ transform: `translateX(-${currentIndex * 100}%)` }}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
        {images.map((img, index) => (
          <img
            key={index}
            src={img}
            alt={`Produto ${index + 1}`}
            className="w-full h-full object-cover flex-shrink-0"
          />
        ))}
      </div>

      {/* Navigation Arrows (Desktop) */}
      <button
        onClick={() => setCurrentIndex(Math.max(0, currentIndex - 1))}
        className="absolute left-2 top-1/2 -translate-y-1/2 w-8 h-8 bg-black/30 rounded-full hidden md:flex items-center justify-center"
        disabled={currentIndex === 0}
      >
        <ChevronLeft className="w-5 h-5 text-primary-foreground" />
      </button>
      <button
        onClick={() => setCurrentIndex(Math.min(images.length - 1, currentIndex + 1))}
        className="absolute right-2 top-1/2 -translate-y-1/2 w-8 h-8 bg-black/30 rounded-full hidden md:flex items-center justify-center"
        disabled={currentIndex === images.length - 1}
      >
        <ChevronRight className="w-5 h-5 text-primary-foreground" />
      </button>

      {/* Dots Indicator */}
      <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1.5">
        {images.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentIndex(index)}
            className={`w-2 h-2 rounded-full transition-all ${
              index === currentIndex 
                ? "bg-primary w-4" 
                : "bg-primary-foreground/50"
            }`}
          />
        ))}
      </div>

      {/* Image Counter */}
      <div className="absolute bottom-3 right-3 bg-black/50 text-primary-foreground text-xs px-2 py-1 rounded-full">
        {currentIndex + 1}/{images.length}
      </div>
    </div>
  );
};

export default ProductGallery;