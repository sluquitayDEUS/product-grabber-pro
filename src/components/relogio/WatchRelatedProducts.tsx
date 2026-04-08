import { memo } from "react";
import LazyImage from "@/components/ui/lazy-image";
import relogioDouradoImg from "@/assets/relogio/related-relogio-dourado.jpg";
import estojoImg from "@/assets/relogio/related-estojo.jpg";
import pulseiraImg from "@/assets/relogio/related-pulseira.jpg";
import carteiraImg from "@/assets/relogio/related-carteira.jpg";
import abotoaduraImg from "@/assets/relogio/related-abotoadura.jpg";
import suporteImg from "@/assets/relogio/related-suporte.jpg";
import braceleteImg from "@/assets/relogio/related-bracelete.jpg";
import oculosImg from "@/assets/relogio/related-oculos.jpg";

const products = [
  { id: 1, image: relogioDouradoImg, title: "Relógio Masculino Dourado Aço Inoxidável Luxo Premium", sold: "3.2mil", rating: 4.8 },
  { id: 2, image: estojoImg, title: "Estojo Porta Relógios 6 Divisórias Couro Sintético Premium", sold: "1.8mil", rating: 4.7 },
  { id: 3, image: pulseiraImg, title: "Pulseira Aço Inoxidável 316L Para Relógio 20mm 22mm", sold: "2.5mil", rating: 4.6 },
  { id: 4, image: carteiraImg, title: "Carteira Masculina Couro Legítimo Slim Porta Cartões", sold: "5.1mil", rating: 4.9 },
  { id: 5, image: abotoaduraImg, title: "Abotoadura Masculina Prata Elegante Com Estojo Premium", sold: "956", rating: 4.5 },
  { id: 6, image: suporteImg, title: "Suporte Display Para Relógio Madeira Preta Organizador", sold: "1.3mil", rating: 4.7 },
  { id: 7, image: braceleteImg, title: "Bracelete Masculino Aço Corrente Grossa Prata Premium", sold: "4.6mil", rating: 4.8 },
  { id: 8, image: oculosImg, title: "Óculos Aviador Masculino Polarizado Armação Dourada UV400", sold: "6.9mil", rating: 4.6 },
];

const WatchRelatedProducts = memo(() => {
  return (
    <div className="bg-card mt-2 py-4">
      <h2 className="text-sm font-medium text-foreground px-3 mb-3">Produtos Relacionados</h2>
      <div className="grid grid-cols-2 gap-2 px-3">
        {products.map((product) => (
          <div key={product.id} className="bg-card border border-border rounded-lg overflow-hidden">
            <div className="relative aspect-square">
              <LazyImage src={product.image} alt={product.title} className="w-full h-full object-cover" width={200} height={200} />
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

WatchRelatedProducts.displayName = "WatchRelatedProducts";
export default WatchRelatedProducts;
