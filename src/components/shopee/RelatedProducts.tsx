import { memo } from "react";
import LazyImage from "@/components/ui/lazy-image";
import boiaImg from "@/assets/related-boia.webp";
import oculosImg from "@/assets/related-oculos.webp";
import neopreneImg from "@/assets/related-neoprene.jpg";
import pranchaImg from "@/assets/related-prancha.jpg";
import remosImg from "@/assets/related-remos.webp";
import piscinaImg from "@/assets/related-piscina.jpg";
import nadeiraImg from "@/assets/related-nadadeira.jpg";
import flamingoImg from "@/assets/related-flamingo.jpg";
import shortsImg from "@/assets/related-shorts.webp";
import baldinhoImg from "@/assets/related-baldinho.jpg";

const products = [
  {
    id: 1,
    image: boiaImg,
    title: "Boia Infantil Colete Salva Vidas Peitoral Flutuador",
    sold: "1.2mil",
    rating: 4.7,
  },
  {
    id: 2,
    image: oculosImg,
    title: "Óculos de Natação Infantil Poseidon",
    sold: "856",
    rating: 4.9,
  },
  {
    id: 3,
    image: neopreneImg,
    title: "Roupa Neoprene Masculino Natação 1.5mm Neoprene Roupa Mergulho",
    sold: "2.1mil",
    rating: 4.6,
  },
  {
    id: 4,
    image: pranchaImg,
    title: "Prancha De Bodyboard Mirim Pequena Para Praia E Piscina Onda Radical",
    sold: "3.4mil",
    rating: 4.8,
  },
  {
    id: 5,
    image: remosImg,
    title: "Kit 2 Remos Cabo Alumínio P/ Bote Barco Pesca Canoa 1,4 M",
    sold: "947",
    rating: 4.5,
  },
  {
    id: 6,
    image: piscinaImg,
    title: "Piscina Inflável 3 Anéis 118 Litros 23x99 Cm Summer Fun",
    sold: "5.8mil",
    rating: 4.7,
  },
  {
    id: 7,
    image: nadeiraImg,
    title: "Pé de Pato Nadadeira Speedo Power Fin Natação",
    sold: "1.5mil",
    rating: 4.8,
  },
  {
    id: 8,
    image: flamingoImg,
    title: "Boia Flamingo Gigante Piscina",
    sold: "4.2mil",
    rating: 4.6,
  },
  {
    id: 9,
    image: shortsImg,
    title: "Kit 3 Shorts de Praia Masculino Neon",
    sold: "7.1mil",
    rating: 4.4,
  },
  {
    id: 10,
    image: baldinhoImg,
    title: "Baldinho de Praia e Jardim Kit Monte Líbano",
    sold: "2.3mil",
    rating: 4.9,
  },
];

const RelatedProducts = memo(() => {
  return (
    <div className="bg-card mt-2 py-4">
      <h2 className="text-sm font-medium text-foreground px-3 mb-3">Produtos Relacionados</h2>

      <div className="grid grid-cols-2 gap-2 px-3">
        {products.map((product) => (
          <div key={product.id} className="bg-card border border-border rounded-lg overflow-hidden">
            {/* Image */}
            <div className="relative aspect-square">
              <LazyImage
                src={product.image}
                alt={product.title}
                className="w-full h-full object-cover"
                width={200}
                height={200}
              />
              <span className="absolute top-1 left-1 bg-red-600 text-white text-[10px] px-1.5 py-0.5 rounded font-bold">
                ESGOTADO
              </span>
            </div>

            {/* Info */}
            <div className="p-2">
              <h3 className="text-xs text-foreground line-clamp-2 mb-1.5 leading-tight">
                {product.title}
              </h3>
              
              <div className="flex items-baseline gap-1 mb-1">
                <span className="text-sm font-bold text-red-600">
                  Esgotado
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
});

RelatedProducts.displayName = "RelatedProducts";

export default RelatedProducts;
