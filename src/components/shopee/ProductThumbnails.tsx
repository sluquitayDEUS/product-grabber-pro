import aquavolt1 from "@/assets/aquavolt-1-custom.png";
import aquavolt2 from "@/assets/aquavolt-2.webp";
import aquavolt3 from "@/assets/aquavolt-3.webp";
import aquavolt4 from "@/assets/aquavolt-4.webp";
import aquavolt5 from "@/assets/aquavolt-5.webp";

interface ProductThumbnailsProps {
  selectedIndex: number;
  onSelect: (index: number) => void;
}

const images = [aquavolt1, aquavolt2, aquavolt3, aquavolt4, aquavolt5];

const ProductThumbnails = ({ selectedIndex, onSelect }: ProductThumbnailsProps) => {
  return (
    <div className="bg-card px-3 py-2">
      <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-hide">
        {images.map((img, index) => (
          <button
            key={index}
            onClick={() => onSelect(index)}
            className={`flex-shrink-0 w-16 h-16 rounded-md overflow-hidden border-2 transition-all ${
              index === selectedIndex 
                ? "border-primary" 
                : "border-transparent hover:border-primary/50"
            }`}
          >
            <img
              src={img}
              alt={`Produto ${index + 1}`}
              className="w-full h-full object-cover"
            />
          </button>
        ))}
      </div>
    </div>
  );
};

export default ProductThumbnails;
