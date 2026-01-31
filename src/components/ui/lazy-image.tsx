import { memo } from "react";

interface LazyImageProps {
  src: string;
  alt: string;
  className?: string;
  priority?: boolean;
  width?: number;
  height?: number;
}

const LazyImage = memo(({ src, alt, className = "", priority = false, width, height }: LazyImageProps) => {
  return (
    <img
      src={src}
      alt={alt}
      className={className}
      loading={priority ? "eager" : "lazy"}
      decoding="async"
      width={width}
      height={height}
    />
  );
});

LazyImage.displayName = "LazyImage";

export default LazyImage;
