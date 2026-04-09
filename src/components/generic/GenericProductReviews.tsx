import { useState, memo, useMemo } from "react";
import { ThumbsUp, ChevronDown } from "lucide-react";

const filters = ["Todas", "Com Foto", "5★", "4★", "3★"];

const sellerReplies = [
  "Muito obrigado pela avaliação! Ficamos felizes com sua satisfação! 🌟",
  "Agradecemos o feedback! É ótimo saber que superou suas expectativas! ✨",
  "Obrigado pelo carinho! Aproveite bastante seu produto! 💪",
  "Que alegria! Nosso produto foi feito para quem valoriza qualidade! 🎉",
  "Ficamos emocionados! Conte sempre conosco! 💎",
];

interface Props {
  rating: number;
  reviewCount: string;
  reviews5Star: string[];
  reviews4Star: string[];
  reviews3Star: string[];
}

const generateReviews = (r5: string[], r4: string[], r3: string[]) => {
  const names = ["A***o", "M***a", "R***o", "C***s", "J***a", "P***o", "L***a", "F***o", "B***a", "D***o", "G***a", "S***o", "T***a", "V***o", "N***a"];
  const reviews: any[] = [];
  let id = 1;

  for (let i = 0; i < 80; i++) {
    const hasReply = Math.random() < 0.85;
    const dayOffset = Math.floor(Math.random() * 120);
    const date = new Date(); date.setDate(date.getDate() - dayOffset);
    reviews.push({
      id: id++, user: names[i % names.length], rating: 5,
      date: date.toLocaleDateString("pt-BR"),
      comment: r5[i % r5.length],
      likes: Math.floor(Math.random() * 150) + 10,
      sellerReply: hasReply ? sellerReplies[i % sellerReplies.length] : null,
    });
  }
  for (let i = 0; i < 15; i++) {
    const dayOffset = Math.floor(Math.random() * 120);
    const date = new Date(); date.setDate(date.getDate() - dayOffset);
    reviews.push({
      id: id++, user: names[i % names.length], rating: 4,
      date: date.toLocaleDateString("pt-BR"),
      comment: r4[i % r4.length],
      likes: Math.floor(Math.random() * 60) + 5,
      sellerReply: Math.random() < 0.7 ? sellerReplies[i % sellerReplies.length] : null,
    });
  }
  for (let i = 0; i < 5; i++) {
    const dayOffset = Math.floor(Math.random() * 120);
    const date = new Date(); date.setDate(date.getDate() - dayOffset);
    reviews.push({
      id: id++, user: names[i % names.length], rating: 3,
      date: date.toLocaleDateString("pt-BR"),
      comment: r3[i % r3.length],
      likes: Math.floor(Math.random() * 20) + 1,
      sellerReply: sellerReplies[i % sellerReplies.length],
    });
  }
  return reviews;
};

const GenericProductReviews = memo(({ rating, reviewCount, reviews5Star, reviews4Star, reviews3Star }: Props) => {
  const [activeFilter, setActiveFilter] = useState("Todas");
  const [visibleCount, setVisibleCount] = useState(50);

  const allReviews = useMemo(() => generateReviews(reviews5Star, reviews4Star, reviews3Star), [reviews5Star, reviews4Star, reviews3Star]);

  const filteredReviews = useMemo(() => {
    if (activeFilter.includes("★")) {
      const r = parseInt(activeFilter);
      return allReviews.filter((rev) => rev.rating === r);
    }
    return allReviews;
  }, [activeFilter, allReviews]);

  const displayed = useMemo(() => filteredReviews.slice(0, visibleCount), [filteredReviews, visibleCount]);
  const remaining = filteredReviews.length - visibleCount;

  const renderStars = (r: number) => (
    <div className="flex">
      {[1, 2, 3, 4, 5].map((s) => (
        <svg key={s} className={`w-3 h-3 ${s <= r ? "text-shopee-yellow fill-shopee-yellow" : "text-shopee-gray fill-shopee-gray"}`} viewBox="0 0 20 20">
          <path d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z" />
        </svg>
      ))}
    </div>
  );

  return (
    <div className="bg-card mt-2">
      <div className="flex items-center gap-3 px-3 py-3 border-b border-border">
        <div className="flex items-baseline gap-1">
          <span className="text-2xl font-bold text-primary">{rating}</span>
          <span className="text-xs text-muted-foreground">/5</span>
        </div>
        <div>
          {renderStars(Math.round(rating))}
          <p className="text-xs text-muted-foreground mt-0.5">{reviewCount} avaliações</p>
        </div>
      </div>
      <div className="flex gap-2 px-3 py-3 overflow-x-auto scrollbar-hide">
        {filters.map((f) => (
          <button key={f} onClick={() => { setActiveFilter(f); setVisibleCount(50); }}
            className={`flex-shrink-0 px-3 py-1.5 rounded-full text-xs transition-all ${activeFilter === f ? "bg-shopee-light text-primary border border-primary" : "bg-secondary text-foreground border border-transparent"}`}>
            {f}
          </button>
        ))}
      </div>
      <div className="divide-y divide-border">
        {displayed.map((review) => (
          <div key={review.id} className="px-3 py-4">
            <div className="flex items-center gap-2 mb-2">
              <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-xs font-bold text-primary flex-shrink-0">
                {review.user.charAt(0)}
              </div>
              <div>
                <p className="text-xs font-medium text-foreground">{review.user}</p>
                <div className="flex items-center gap-2">
                  {renderStars(review.rating)}
                  <span className="text-[10px] text-muted-foreground">{review.date}</span>
                </div>
              </div>
            </div>
            <p className="text-xs text-foreground leading-relaxed mb-2">{review.comment}</p>
            <button className="flex items-center gap-1 text-xs text-muted-foreground">
              <ThumbsUp className="w-3.5 h-3.5" /><span>Útil ({review.likes})</span>
            </button>
            {review.sellerReply && (
              <div className="mt-3 p-3 bg-secondary rounded-lg">
                <p className="text-[10px] text-primary font-medium mb-1">Resposta do Vendedor:</p>
                <p className="text-xs text-muted-foreground">{review.sellerReply}</p>
              </div>
            )}
          </div>
        ))}
      </div>
      {remaining > 0 && (
        <button onClick={() => setVisibleCount((p) => p + 5)}
          className="w-full py-4 border-t border-border flex items-center justify-center gap-2 text-primary text-sm font-medium">
          <span>Ver mais avaliações</span><ChevronDown className="w-4 h-4" />
        </button>
      )}
    </div>
  );
});

GenericProductReviews.displayName = "GenericProductReviews";
export default GenericProductReviews;
