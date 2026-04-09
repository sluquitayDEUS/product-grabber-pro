import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ChevronDown } from "lucide-react";
import ProductHeader from "@/components/shopee/ProductHeader";
import { newProducts } from "@/data/products";

const sortOptions = ["Mais vendidos", "Menor preço", "Maior preço", "Mais recentes"];

const Produtos = () => {
  const navigate = useNavigate();
  const [sortBy, setSortBy] = useState("Mais vendidos");
  const [showSort, setShowSort] = useState(false);

  const sorted = [...newProducts].sort((a, b) => {
    if (sortBy === "Menor preço") return a.price - b.price;
    if (sortBy === "Maior preço") return b.price - a.price;
    return 0;
  });

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-md mx-auto">
        <ProductHeader />
        <div className="px-3 pt-4 pb-2">
          <h1 className="text-xl font-bold text-foreground text-center mb-4">Produtos</h1>
          <div className="flex items-center justify-between border-b border-border pb-2 mb-1">
            <div className="flex items-center gap-1 text-xs text-muted-foreground">
              <span className="font-medium text-foreground">FILTRAR POR</span>
              <span className="ml-1 text-muted-foreground">Todos os produtos</span>
            </div>
            <div className="relative">
              <button onClick={() => setShowSort(!showSort)} className="flex items-center gap-1 text-xs">
                <span className="font-medium text-foreground">ORDENAR POR</span>
                <span className="text-muted-foreground">{sortBy}</span>
                <ChevronDown className="w-3 h-3" />
              </button>
              {showSort && (
                <div className="absolute right-0 top-6 bg-card border border-border rounded-lg shadow-lg z-10 w-40">
                  {sortOptions.map((opt) => (
                    <button key={opt} onClick={() => { setSortBy(opt); setShowSort(false); }}
                      className={`block w-full text-left px-3 py-2 text-xs hover:bg-secondary ${sortBy === opt ? "text-primary font-medium" : "text-foreground"}`}>
                      {opt}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
          <p className="text-xs text-primary mb-3">{newProducts.length} produtos</p>
        </div>

        <div className="grid grid-cols-2 gap-2 px-3 pb-8">
          {sorted.map((product) => (
            <button key={product.id} onClick={() => navigate(`/${product.slug}`)}
              className="bg-card border border-border rounded-lg overflow-hidden text-left transition-transform active:scale-95">
              <div className="aspect-square overflow-hidden">
                <img src={product.images[0]} alt={product.shortName} className="w-full h-full object-cover" loading="lazy" decoding="async" width={512} height={512} />
              </div>
              <div className="p-2">
                <h3 className="text-xs text-foreground line-clamp-2 mb-1.5 leading-tight">{product.shortName}</h3>
                <div className="flex items-baseline gap-1">
                  <span className="text-sm font-bold text-primary">R$ {product.price.toFixed(2).replace(".", ",")}</span>
                </div>
                <div className="flex items-center gap-1 mt-1">
                  <svg className="w-2.5 h-2.5 text-shopee-yellow fill-shopee-yellow" viewBox="0 0 20 20">
                    <path d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z" />
                  </svg>
                  <span className="text-[10px] text-muted-foreground">{product.rating}</span>
                  <span className="text-[10px] text-muted-foreground">| {product.soldCount} vendidos</span>
                </div>
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Produtos;
