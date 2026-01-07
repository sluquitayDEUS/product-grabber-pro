import { useState } from "react";
import { ThumbsUp, ChevronRight, ChevronDown } from "lucide-react";

// Import review images
import review1 from "@/assets/review-product-1.jpg";
import review2 from "@/assets/review-product-2.jpg";
import review3 from "@/assets/review-product-3.jpg";

const filters = ["Todas", "Com Foto", "5★", "4★", "3★", "2★", "1★"];

// Seller replies - varied responses
const sellerReplies = [
  "Muito obrigado pela avaliação! Ficamos muito felizes que você está aproveitando o Aquavolt! 🌊⚡",
  "Agradecemos o feedback! É muito bom saber que o AquaVolt está proporcionando momentos incríveis! 🚤",
  "Obrigado pelo carinho! Desejamos muitas aventuras aquáticas com seu AquaVolt! 🌊",
  "Que alegria ler isso! O AquaVolt foi feito para proporcionar diversão sem limites! ⚡",
  "Ficamos emocionados com sua avaliação! Aproveite cada momento na água! 🏄‍♂️",
  "Muito obrigado! É gratificante saber que superamos suas expectativas! 🌟",
  "Agradecemos imensamente! Seu feedback nos motiva a continuar entregando qualidade! 💪",
  "Que feedback maravilhoso! O AquaVolt é diversão garantida para toda família! 👨‍👩‍👧‍👦",
  "Obrigado pela confiança! Estamos sempre à disposição para qualquer dúvida! 📞",
  "Ficamos felizes demais! Boas aventuras aquáticas para você! 🌊⚡",
  "Muito obrigado pelo 5 estrelas! Você merece o melhor em diversão aquática! 🏆",
  "Agradecemos a preferência! O AquaVolt é sinônimo de qualidade e diversão! ✨",
  "Que ótimo saber! Continue aproveitando seu AquaVolt ao máximo! 🚀",
  "Obrigado por compartilhar! Sua satisfação é nossa maior recompensa! 💙",
  "Incrível feedback! O AquaVolt foi pensado para momentos como esse! 🎉",
];

// Generate 120 reviews for the Aquavolt
const generateReviews = () => {
  const comments5Star = [
    "Simplesmente INCRÍVEL! O Aquavolt superou todas as minhas expectativas. A sensação de deslizar na água é única!",
    "Comprei pra usar no lago da fazenda e a família toda adorou. Silencioso e muito divertido!",
    "Produto de altíssima qualidade. A bateria dura bastante e o desempenho é impressionante.",
    "Melhor compra que já fiz! Meus filhos não querem sair da água. Super seguro e fácil de usar.",
    "O design é lindo e a performance incrível. Chega a 45km/h tranquilamente!",
    "Entrega super rápida e produto muito bem embalado. Montagem fácil, em 30 minutos estava na água!",
    "Vale cada centavo! A experiência é única, parece um jet ski mas muito mais acessível.",
    "Comprei pro meu marido de aniversário e ele amou! Virou a atração do condomínio.",
    "Qualidade premium! Acabamento impecável, motor silencioso, bateria duradoura. Recomendo!",
    "Finalmente um produto elétrico que funciona de verdade! Autonomia excelente e recarga rápida.",
    "Perfeito para praias calmas e lagos. Muito estável, não capota mesmo em curvas fechadas.",
    "Surpreendeu demais! Não esperava tanta qualidade por esse preço. Estou apaixonado!",
    "Uso todo final de semana. Já fiz mais de 50 passeios e funciona como no primeiro dia.",
    "O suporte técnico é excelente. Tive uma dúvida e me responderam em minutos!",
    "Comprei 2, um pra mim e outro pro meu irmão. Agora fazemos corridas no lago!",
  ];

  const comments4Star = [
    "Muito bom! Só tirei uma estrela porque a entrega demorou um pouco mais que o esperado.",
    "Produto excelente, mas poderia vir com mais acessórios. No geral, super recomendo!",
    "Ótimo custo-benefício. A bateria poderia durar um pouco mais, mas é muito divertido!",
    "Gostei bastante. O único ponto é que o carregador esquenta um pouco.",
    "Produto de qualidade. Tirando uma estrela pelo manual que poderia ser mais detalhado.",
  ];

  const comments3Star = [
    "Produto ok. Funciona bem mas esperava um pouco mais de velocidade.",
    "Bom produto, mas tive que fazer alguns ajustes na montagem. Poderia ser mais simples.",
  ];

  const avatars = [
    "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=50&h=50&fit=crop&crop=faces",
    "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=50&h=50&fit=crop&crop=faces",
    "https://images.unsplash.com/photo-1599566150163-29194dcabd36?w=50&h=50&fit=crop&crop=faces",
    "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=50&h=50&fit=crop&crop=faces",
    "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=50&h=50&fit=crop&crop=faces",
    "https://images.unsplash.com/photo-1527980965255-d3b416303d12?w=50&h=50&fit=crop&crop=faces",
    "https://images.unsplash.com/photo-1580489944761-15a19d654956?w=50&h=50&fit=crop&crop=faces",
    "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=50&h=50&fit=crop&crop=faces",
  ];

  // Only 3 review images from the site
  const reviewImages = [review1, review2, review3];

  const variations = ["Azul Oceano, 48V", "Branco Polar, 72V Pro", "Verde Água, 48V", "Laranja Sunset, 96V Ultra"];
  const names = ["A***o", "M***a", "R***o", "C***s", "J***a", "P***o", "L***a", "F***o", "B***a", "D***o", "G***a", "S***o", "T***a", "V***o", "N***a"];

  const reviews = [];
  let id = 1;
  let imageReviewsCount = 0;

  // Generate 90 five-star reviews
  for (let i = 0; i < 90; i++) {
    // Only first 3 reviews with images (one image each)
    const hasImages = imageReviewsCount < 3;
    // 85% chance of seller reply
    const hasSellerReply = Math.random() < 0.85;
    const dayOffset = Math.floor(Math.random() * 60);
    const date = new Date();
    date.setDate(date.getDate() - dayOffset);

    const reviewData: any = {
      id: id++,
      user: names[Math.floor(Math.random() * names.length)],
      avatar: avatars[Math.floor(Math.random() * avatars.length)],
      rating: 5,
      date: date.toLocaleDateString("pt-BR"),
      variation: variations[Math.floor(Math.random() * variations.length)],
      comment: comments5Star[Math.floor(Math.random() * comments5Star.length)],
      images: hasImages ? [reviewImages[imageReviewsCount]] : [],
      likes: Math.floor(Math.random() * 150) + 10,
      sellerReply: hasSellerReply ? sellerReplies[Math.floor(Math.random() * sellerReplies.length)] : null,
    };

    if (hasImages) imageReviewsCount++;
    reviews.push(reviewData);
  }

  // Generate 25 four-star reviews
  for (let i = 0; i < 25; i++) {
    const hasSellerReply = Math.random() < 0.85;
    const dayOffset = Math.floor(Math.random() * 60);
    const date = new Date();
    date.setDate(date.getDate() - dayOffset);

    reviews.push({
      id: id++,
      user: names[Math.floor(Math.random() * names.length)],
      avatar: avatars[Math.floor(Math.random() * avatars.length)],
      rating: 4,
      date: date.toLocaleDateString("pt-BR"),
      variation: variations[Math.floor(Math.random() * variations.length)],
      comment: comments4Star[Math.floor(Math.random() * comments4Star.length)],
      images: [],
      likes: Math.floor(Math.random() * 50) + 5,
      sellerReply: hasSellerReply ? sellerReplies[Math.floor(Math.random() * sellerReplies.length)] : null,
    });
  }

  // Generate 5 three-star reviews
  for (let i = 0; i < 5; i++) {
    const hasSellerReply = Math.random() < 0.85;
    const dayOffset = Math.floor(Math.random() * 60);
    const date = new Date();
    date.setDate(date.getDate() - dayOffset);

    reviews.push({
      id: id++,
      user: names[Math.floor(Math.random() * names.length)],
      avatar: avatars[Math.floor(Math.random() * avatars.length)],
      rating: 3,
      date: date.toLocaleDateString("pt-BR"),
      variation: variations[Math.floor(Math.random() * variations.length)],
      comment: comments3Star[Math.floor(Math.random() * comments3Star.length)],
      images: [],
      likes: Math.floor(Math.random() * 20) + 1,
      sellerReply: hasSellerReply ? sellerReplies[Math.floor(Math.random() * sellerReplies.length)] : null,
    });
  }

  // Shuffle reviews but keep image reviews in first positions
  const imageReviews = reviews.filter(r => r.images.length > 0);
  const textReviews = reviews.filter(r => r.images.length === 0).sort(() => Math.random() - 0.5);
  
  return [...imageReviews, ...textReviews];
};

const allReviews = generateReviews();

const ProductReviews = () => {
  const [activeFilter, setActiveFilter] = useState("Todas");
  const [showAll, setShowAll] = useState(false);

  const getFilteredReviews = () => {
    let filtered = allReviews;
    
    if (activeFilter === "Com Foto") {
      filtered = allReviews.filter(r => r.images.length > 0);
    } else if (activeFilter.includes("★")) {
      const rating = parseInt(activeFilter);
      filtered = allReviews.filter(r => r.rating === rating);
    }

    return filtered;
  };

  const filteredReviews = getFilteredReviews();
  const displayedReviews = showAll ? filteredReviews : filteredReviews.slice(0, 20);
  const remainingCount = filteredReviews.length - 20;

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

  // Calculate average rating
  const avgRating = (allReviews.reduce((sum, r) => sum + r.rating, 0) / allReviews.length).toFixed(1);

  return (
    <div className="bg-card mt-2">
      {/* Header */}
      <div className="flex items-center justify-between px-3 py-3 border-b border-border">
        <div className="flex items-center gap-2">
          <h2 className="text-sm font-medium text-foreground">Avaliações do Produto</h2>
          <span className="text-xs text-muted-foreground">({allReviews.length})</span>
        </div>
        <button 
          onClick={() => setShowAll(!showAll)}
          className="flex items-center gap-1 text-primary"
        >
          <span className="text-sm">{showAll ? "Ver menos" : "Ver Todas"}</span>
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>

      {/* Rating Summary */}
      <div className="flex items-center gap-3 px-3 py-3 border-b border-border">
        <div className="flex items-baseline gap-1">
          <span className="text-2xl font-bold text-primary">{avgRating}</span>
          <span className="text-xs text-muted-foreground">/5</span>
        </div>
        <div>
          {renderStars(5)}
          <p className="text-xs text-muted-foreground mt-0.5">{allReviews.length} avaliações</p>
        </div>
      </div>

      {/* Filters */}
      <div className="flex gap-2 px-3 py-3 overflow-x-auto scrollbar-hide">
        {filters.map((filter) => (
          <button
            key={filter}
            onClick={() => {
              setActiveFilter(filter);
              setShowAll(false);
            }}
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
        {displayedReviews.map((review) => (
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
                {review.images.map((img: string, index: number) => (
                  <img
                    key={index}
                    src={img}
                    alt={`Review ${index + 1}`}
                    className="w-20 h-20 rounded-lg object-cover"
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

      {/* Load More Button */}
      {!showAll && remainingCount > 0 && (
        <button
          onClick={() => setShowAll(true)}
          className="w-full py-4 border-t border-border flex items-center justify-center gap-2 text-primary text-sm font-medium"
        >
          <span>Ver mais {remainingCount} avaliações</span>
          <ChevronDown className="w-4 h-4" />
        </button>
      )}
    </div>
  );
};

export default ProductReviews;
