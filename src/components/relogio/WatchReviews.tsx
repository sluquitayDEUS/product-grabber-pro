import { useState, memo, useMemo, useCallback } from "react";
import { ThumbsUp, ChevronDown } from "lucide-react";

const filters = ["Todas", "Com Foto", "5★", "4★", "3★"];

const sellerReplies = [
  "Muito obrigado pela avaliação! Ficamos felizes que você amou o Imperium! ⌚💎",
  "Agradecemos o feedback! É ótimo saber que o relógio superou suas expectativas! 🌟",
  "Obrigado pelo carinho! Use com orgulho, você merece! ✨",
  "Que alegria! O Imperium foi feito para quem valoriza qualidade e estilo! 💪",
  "Ficamos emocionados! Aproveite cada momento com seu novo relógio! 🎉",
];

const comments5Star = [
  "Relógio MARAVILHOSO! Acabamento impecável, parece muito mais caro do que paguei. Super recomendo!",
  "Chegou antes do prazo, embalagem perfeita. O relógio é lindo e pesado, transmite qualidade!",
  "Comprei pro meu marido e ele ficou encantado. O design é elegante e sofisticado demais!",
  "Melhor custo-benefício que já encontrei. Cristal de safira de verdade, incrível!",
  "Presente perfeito! A caixa personalizada dá um toque especial. Recomendo!",
  "O acabamento em aço 904L é impressionante. Parece relógio de grife!",
  "Surpreendeu demais! A pulseira de titânio é super confortável e leve.",
  "Já recebi vários elogios usando. Todo mundo pergunta onde comprei!",
  "Qualidade premium! O movimento automático funciona perfeitamente.",
  "Comprei 2, um pra mim e outro de presente. Os dois vieram perfeitos!",
  "A carteira de brinde é linda também! Pacote completo e bem embalado.",
  "Resistente à água de verdade! Usei na piscina sem problemas.",
  "O certificado de autenticidade dá segurança. Produto legítimo!",
  "Design clássico que combina com qualquer roupa. Estou apaixonado!",
  "Entrega rápida, produto conforme anunciado. Vendedor nota 10!",
  "O ajustador de pulseira incluso facilita muito. Ajustei em casa!",
  "Peso perfeito no pulso, não é nem pesado nem leve demais.",
  "A garantia de 2 anos mostra a confiança na qualidade do produto!",
  "Meu terceiro relógio da loja. Sempre surpreende!",
  "Foto não faz jus à beleza real. Ao vivo é muito mais bonito!",
];

const comments4Star = [
  "Muito bom! A entrega demorou um dia a mais que o previsto, mas o produto é excelente.",
  "Ótimo relógio, só achei a caixa um pouco menor do que esperava.",
  "Produto de qualidade. O ajuste da pulseira poderia ser mais fácil.",
  "Gostei bastante, mas o manual poderia ser em português.",
  "Bom custo-benefício. Tirando uma estrela pela demora na entrega.",
];

const comments3Star = [
  "Produto ok. Bonito mas achei o acabamento um pouco diferente da foto.",
  "Funciona bem, mas esperava um pouco mais pelo preço.",
];

const generateReviews = () => {
  const names = ["A***o", "M***a", "R***o", "C***s", "J***a", "P***o", "L***a", "F***o", "B***a", "D***o", "G***a", "S***o", "T***a", "V***o", "N***a"];
  const reviews: any[] = [];
  let id = 1;

  for (let i = 0; i < 60; i++) {
    const hasSellerReply = Math.random() < 0.8;
    const dayOffset = Math.floor(Math.random() * 120);
    const date = new Date();
    date.setDate(date.getDate() - dayOffset);
    reviews.push({
      id: id++, user: names[i % names.length], rating: 5,
      date: date.toLocaleDateString("pt-BR"),
      comment: comments5Star[i % comments5Star.length],
      likes: Math.floor(Math.random() * 150) + 10,
      sellerReply: hasSellerReply ? sellerReplies[i % sellerReplies.length] : null,
    });
  }

  for (let i = 0; i < 15; i++) {
    const dayOffset = Math.floor(Math.random() * 120);
    const date = new Date();
    date.setDate(date.getDate() - dayOffset);
    reviews.push({
      id: id++, user: names[i % names.length], rating: 4,
      date: date.toLocaleDateString("pt-BR"),
      comment: comments4Star[i % comments4Star.length],
      likes: Math.floor(Math.random() * 60) + 5,
      sellerReply: Math.random() < 0.7 ? sellerReplies[i % sellerReplies.length] : null,
    });
  }

  for (let i = 0; i < 3; i++) {
    const dayOffset = Math.floor(Math.random() * 120);
    const date = new Date();
    date.setDate(date.getDate() - dayOffset);
    reviews.push({
      id: id++, user: names[i % names.length], rating: 3,
      date: date.toLocaleDateString("pt-BR"),
      comment: comments3Star[i % comments3Star.length],
      likes: Math.floor(Math.random() * 20) + 1,
      sellerReply: sellerReplies[i % sellerReplies.length],
    });
  }

  return reviews;
};

const allReviews = generateReviews();

const WatchReviews = memo(() => {
  const [activeFilter, setActiveFilter] = useState("Todas");
  const [visibleCount, setVisibleCount] = useState(10);

  const filteredReviews = useMemo(() => {
    if (activeFilter.includes("★")) {
      const rating = parseInt(activeFilter);
      return allReviews.filter((r) => r.rating === rating);
    }
    return allReviews;
  }, [activeFilter]);

  const displayedReviews = useMemo(() => filteredReviews.slice(0, visibleCount), [filteredReviews, visibleCount]);
  const remainingCount = filteredReviews.length - visibleCount;

  const renderStars = (rating: number) => (
    <div className="flex">
      {[1, 2, 3, 4, 5].map((star) => (
        <svg key={star} className={`w-3 h-3 ${star <= rating ? "text-shopee-yellow fill-shopee-yellow" : "text-shopee-gray fill-shopee-gray"}`} viewBox="0 0 20 20">
          <path d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z" />
        </svg>
      ))}
    </div>
  );

  return (
    <div className="bg-card mt-2">
      {/* Rating Summary */}
      <div className="flex items-center gap-3 px-3 py-3 border-b border-border">
        <div className="flex items-baseline gap-1">
          <span className="text-2xl font-bold text-primary">4.9</span>
          <span className="text-xs text-muted-foreground">/5</span>
        </div>
        <div>
          {renderStars(5)}
          <p className="text-xs text-muted-foreground mt-0.5">856 avaliações</p>
        </div>
      </div>

      <div className="flex gap-2 px-3 py-3 overflow-x-auto scrollbar-hide">
        {filters.map((filter) => (
          <button key={filter} onClick={() => { setActiveFilter(filter); setVisibleCount(10); }}
            className={`flex-shrink-0 px-3 py-1.5 rounded-full text-xs transition-all ${activeFilter === filter ? "bg-shopee-light text-primary border border-primary" : "bg-secondary text-foreground border border-transparent"}`}>
            {filter}
          </button>
        ))}
      </div>

      {/* Reviews List */}
      <div className="divide-y divide-border">
        {displayedReviews.map((review) => (
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
              <ThumbsUp className="w-3.5 h-3.5" />
              <span>Útil ({review.likes})</span>
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

      {remainingCount > 0 && (
        <button onClick={() => setVisibleCount((p) => p + 5)}
          className="w-full py-4 border-t border-border flex items-center justify-center gap-2 text-primary text-sm font-medium">
          <span>Ver mais avaliações</span>
          <ChevronDown className="w-4 h-4" />
        </button>
      )}
    </div>
  );
});

WatchReviews.displayName = "WatchReviews";
export default WatchReviews;
