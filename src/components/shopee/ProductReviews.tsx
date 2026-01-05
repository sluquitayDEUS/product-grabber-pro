import { useState } from "react";
import { ThumbsUp, ChevronRight } from "lucide-react";

const filters = ["Todas", "Com Foto", "5★", "4★", "3★", "2★", "1★"];

const reviews = [
  {
    id: 1,
    user: "M***a",
    avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=50&h=50&fit=crop&crop=faces",
    rating: 5,
    date: "03/01/2026",
    variation: "Preto, 3 em 1",
    comment: "Produto excelente! Chegou antes do prazo e veio muito bem embalado. A qualidade do acabamento é incrível, parece muito mais caro do que realmente é. Recomendo demais!",
    images: [
      "https://images.unsplash.com/photo-1621607512022-6aecc4fed814?w=100&h=100&fit=crop",
      "https://images.unsplash.com/photo-1503951914875-452162b0f3f1?w=100&h=100&fit=crop",
    ],
    likes: 45,
    sellerReply: "Muito obrigado pela avaliação! Ficamos felizes que tenha gostado do produto. Qualquer dúvida, estamos à disposição! 😊",
  },
  {
    id: 2,
    user: "R***o",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=50&h=50&fit=crop&crop=faces",
    rating: 4,
    date: "02/01/2026",
    variation: "Prata, 5 em 1",
    comment: "Bom produto pelo preço. Faz tudo que promete. A bateria dura bastante. Tirando uma estrela porque o barulho é um pouco alto.",
    images: [],
    likes: 23,
    sellerReply: null,
  },
  {
    id: 3,
    user: "C***s",
    avatar: "https://images.unsplash.com/photo-1599566150163-29194dcabd36?w=50&h=50&fit=crop&crop=faces",
    rating: 5,
    date: "01/01/2026",
    variation: "Preto, 7 em 1 Pro",
    comment: "Sensacional! Comprei pra dar de presente pro meu pai e ele adorou. Produto de qualidade, bem acabado. Entrega super rápida!",
    images: [
      "https://images.unsplash.com/photo-1599351431202-1e0f0137899a?w=100&h=100&fit=crop",
    ],
    likes: 67,
    sellerReply: null,
  },
];

const ProductReviews = () => {
  const [activeFilter, setActiveFilter] = useState("Todas");

  const renderStars = (rating: number) => {
    return (
      <div className="flex">
        {[1, 2, 3, 4, 5].map((star) => (
          <svg
            key={star}
            className={`w-3 h-3 ${star <= rating ? "text-shopee-yellow fill-shopee-yellow" : "text-shopee-gray fill-shopee-gray"}`}
            viewBox="0 0 20 20"
          >
            <path d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z" />
          </svg>
        ))}
      </div>
    );
  };

  return (
    <div className="bg-card mt-2">
      {/* Header */}
      <div className="flex items-center justify-between px-3 py-3 border-b border-border">
        <div className="flex items-center gap-2">
          <h2 className="text-sm font-medium text-foreground">Avaliações do Produto</h2>
          <span className="text-xs text-muted-foreground">(1.248)</span>
        </div>
        <div className="flex items-center gap-1 text-primary">
          <span className="text-sm">Ver Todas</span>
          <ChevronRight className="w-4 h-4" />
        </div>
      </div>

      {/* Rating Summary */}
      <div className="flex items-center gap-3 px-3 py-3 border-b border-border">
        <div className="flex items-baseline gap-1">
          <span className="text-2xl font-bold text-primary">4.8</span>
          <span className="text-xs text-muted-foreground">/5</span>
        </div>
        <div>
          {renderStars(5)}
          <p className="text-xs text-muted-foreground mt-0.5">1.248 avaliações</p>
        </div>
      </div>

      {/* Filters */}
      <div className="flex gap-2 px-3 py-3 overflow-x-auto scrollbar-hide">
        {filters.map((filter) => (
          <button
            key={filter}
            onClick={() => setActiveFilter(filter)}
            className={`flex-shrink-0 px-3 py-1.5 rounded-full text-xs transition-all ${
              activeFilter === filter
                ? "bg-shopee-light text-primary border border-primary"
                : "bg-secondary text-foreground border border-transparent"
            }`}
          >
            {filter}
          </button>
        ))}
      </div>

      {/* Reviews List */}
      <div className="divide-y divide-border">
        {reviews.map((review) => (
          <div key={review.id} className="px-3 py-4">
            {/* User Info */}
            <div className="flex items-center gap-2 mb-2">
              <img
                src={review.avatar}
                alt={review.user}
                className="w-8 h-8 rounded-full object-cover"
              />
              <div>
                <p className="text-xs font-medium text-foreground">{review.user}</p>
                <div className="flex items-center gap-2">
                  {renderStars(review.rating)}
                  <span className="text-[10px] text-muted-foreground">{review.date}</span>
                </div>
              </div>
            </div>

            {/* Variation */}
            <p className="text-[10px] text-muted-foreground mb-2">
              Variação: {review.variation}
            </p>

            {/* Comment */}
            <p className="text-xs text-foreground leading-relaxed mb-2">
              {review.comment}
            </p>

            {/* Images */}
            {review.images.length > 0 && (
              <div className="flex gap-2 mb-3">
                {review.images.map((img, index) => (
                  <img
                    key={index}
                    src={img}
                    alt={`Review ${index + 1}`}
                    className="w-16 h-16 rounded-lg object-cover"
                  />
                ))}
              </div>
            )}

            {/* Like Button */}
            <button className="flex items-center gap-1 text-xs text-muted-foreground">
              <ThumbsUp className="w-3.5 h-3.5" />
              <span>Útil ({review.likes})</span>
            </button>

            {/* Seller Reply */}
            {review.sellerReply && (
              <div className="mt-3 p-3 bg-secondary rounded-lg">
                <p className="text-[10px] text-primary font-medium mb-1">Resposta do Vendedor:</p>
                <p className="text-xs text-muted-foreground">{review.sellerReply}</p>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default ProductReviews;