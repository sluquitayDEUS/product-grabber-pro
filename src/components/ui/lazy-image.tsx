import { memo } from "react";

interface LazyImageProps {
  src: string;
  alt: string;
  className?: string;
  priority?: boolean;
}

const LazyImage = memo(({ src, alt, className = "", priority = false }: LazyImageProps) => {
  return (
    <img
      src={src}
      alt={alt}
      className={className}
      loading={priority ? "eager" : "lazy"}
      decoding="async"
    />
  );
});

LazyImage.displayName = "LazyImage";

export default LazyImage;
