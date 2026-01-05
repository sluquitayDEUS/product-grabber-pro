const products = [
  {
    id: 1,
    image: "https://images.unsplash.com/photo-1585751119414-ef2636f8aede?w=200&h=200&fit=crop",
    title: "Máquina de Cortar Cabelo Profissional",
    price: 79.90,
    originalPrice: 129.90,
    sold: "1.2mil",
    rating: 4.7,
  },
  {
    id: 2,
    image: "https://images.unsplash.com/photo-1621607512022-6aecc4fed814?w=200&h=200&fit=crop",
    title: "Kit Barba Completo com Óleo",
    price: 49.90,
    originalPrice: 89.90,
    sold: "856",
    rating: 4.9,
  },
  {
    id: 3,
    image: "https://images.unsplash.com/photo-1503951914875-452162b0f3f1?w=200&h=200&fit=crop",
    title: "Aparador de Pelos Nasal e Orelha",
    price: 29.90,
    originalPrice: 59.90,
    sold: "2.1mil",
    rating: 4.6,
  },
  {
    id: 4,
    image: "https://images.unsplash.com/photo-1599351431202-1e0f0137899a?w=200&h=200&fit=crop",
    title: "Lâminas de Reposição 5 unidades",
    price: 19.90,
    originalPrice: 39.90,
    sold: "3.4mil",
    rating: 4.8,
  },
];

const RelatedProducts = () => {
  return (
    <div className="bg-card mt-2 py-4">
      <h2 className="text-sm font-medium text-foreground px-3 mb-3">Produtos Relacionados</h2>

      <div className="grid grid-cols-2 gap-2 px-3">
        {products.map((product) => (
          <div key={product.id} className="bg-card border border-border rounded-lg overflow-hidden">
            {/* Image */}
            <div className="relative aspect-square">
              <img
                src={product.image}
                alt={product.title}
                className="w-full h-full object-cover"
              />
              <span className="absolute top-1 left-1 bg-primary text-primary-foreground text-[10px] px-1.5 py-0.5 rounded font-medium">
                -{Math.round((1 - product.price / product.originalPrice) * 100)}%
              </span>
            </div>

            {/* Info */}
            <div className="p-2">
              <h3 className="text-xs text-foreground line-clamp-2 mb-1.5 leading-tight">
                {product.title}
              </h3>
              
              <div className="flex items-baseline gap-1 mb-1">
                <span className="text-sm font-bold text-primary">
                  R$ {product.price.toFixed(2).replace('.', ',')}
                </span>
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
};

export default RelatedProducts;