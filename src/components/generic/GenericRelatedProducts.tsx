import { memo } from "react";

interface RelatedProduct {
  title: string;
  sold: string;
  rating: number;
}

interface Props {
  products: RelatedProduct[];
  productImage: string;
}

const GenericRelatedProducts = memo(({ products, productImage }: Props) => {
  return (
    <div className="bg-card mt-2 py-4">
      <h2 className="text-sm font-medium text-foreground px-3 mb-3">Produtos Relacionados</h2>
      <div className="grid grid-cols-2 gap-2 px-3">
        {products.map((product, index) => (
          <div key={index} className="bg-card border border-border rounded-lg overflow-hidden">
            <div className="relative aspect-square bg-secondary">
              <div className="w-full h-full flex items-center justify-center p-4">
                <img src={productImage} alt={product.title} className="w-full h-full object-contain opacity-40" loading="lazy" decoding="async" />
              </div>
              <span className="absolute top-1 left-1 bg-red-600 text-white text-[10px] px-1.5 py-0.5 rounded font-bold">ESGOTADO</span>
            </div>
            <div className="p-2">
              <h3 className="text-xs text-foreground line-clamp-2 mb-1.5 leading-tight">{product.title}</h3>
              <div className="flex items-baseline gap-1 mb-1">
                <span className="text-sm font-bold text-red-600">Esgotado</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-0.5">
                  <svg className="w-2.5 h-2.5 text-shopee-yellow fill-shopee-yellow" viewBox="0 0 20 20">
                    <path d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z" />
                  </svg>
                  <span className="text-[10px] text-muted-foreground">{product.rating}</span>
                </div>
                <span className="text-[10px] text-muted-foreground">{product.sold} vendidos</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
});

GenericRelatedProducts.displayName = "GenericRelatedProducts";
export default GenericRelatedProducts;
