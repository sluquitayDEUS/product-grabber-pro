import { useState, memo, useMemo, useCallback } from "react";
import { ThumbsUp, ChevronDown } from "lucide-react";

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
"Incrível feedback! O AquaVolt foi pensado para momentos como esse! 🎉"];


// Extended comments for more variety
const comments5Star = [
"Simplesmente INCRÍVEL! O Aquavolt superou todas as minhas expectativas. A sensação de deslizar na água é única!",
"Comprei pra usar no lago da fazenda e a família toda adorou. Silencioso e muito divertido!",
"Produto de altíssima qualidade. A bateria dura bastante e o desempenho é impressionante.",
"Melhor compra que já fiz! Meus filhos não querem sair da água. Super seguro e fácil de usar.",
"O design é lindo e a performance incrível. Chega a 52km/h tranquilamente!",
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
"Presente perfeito! Dei pro meu pai e ele ficou emocionado. Produto sensacional!",
"Muito fácil de transportar, cabe no porta-malas do carro. Perfeito para viagens!",
"A bateria realmente dura 70-80 minutos como prometido. Muito satisfeito!",
"Recomendo de olhos fechados. Produto top demais, superou expectativas!",
"Diversão garantida! Toda a família usa e todos adoram. Vale muito a pena!",
"Produto chegou antes do prazo, bem embalado e funcionando perfeitamente!",
"O motor é potente e silencioso. Não incomoda ninguém na praia!",
"Estou impressionado com a qualidade do acabamento. Parece muito mais caro!",
"Minha esposa tinha medo mas depois do primeiro passeio se apaixonou!",
"Usei no mar calmo e funcionou perfeitamente. Muito estável!",
"O melhor investimento que fiz esse ano. Diversão sem igual!",
"Chegou certinho, conforme anunciado. Vendedor muito atencioso!",
"Produto maravilhoso! Já indiquei para todos os meus amigos!",
"A sensação de acelerar na água é indescritível. Amo meu Aquavolt!",
"Super seguro, tem gaiola de proteção e é muito estável. Perfeito!",
"O carregamento é rápido, em 3 horas já está pronto pra mais diversão!",
"Não precisa de habilitação náutica! Isso foi decisivo na compra!",
"Meus filhos de 12 e 14 anos usam com facilidade. Muito intuitivo!",
"O design é moderno e chama muita atenção. Todo mundo pergunta onde comprei!",
"Já usei em 3 praias diferentes, sempre funciona perfeitamente!",
"A velocidade máxima de 52km/h é emocionante! Adrenalina pura!",
"Produto excelente, vendedor nota 10, entrega perfeita. Recomendo!",
"O Aquavolt é tudo que eu esperava e mais um pouco. Estou encantado!",
"Fácil de montar, fácil de usar, fácil de guardar. Perfeito!",
"A autonomia de 70-80 minutos é suficiente pra uma tarde inteira de diversão!",
"Comprei com receio por ser elétrico, mas funciona melhor que jet ski a combustão!",
"O acabamento é impecável, parece produto de primeira linha internacional!",
"Minha família inteira aprova! Desde as crianças até os avós querem usar!",
"Super leve, duas pessoas conseguem carregar tranquilamente!",
"O sistema de marchas funciona muito bem. Ré ajuda demais nas manobras!",
"Estou no terceiro mês de uso e continua funcionando perfeitamente!",
"Produto chegou muito bem embalado, sem nenhum risco ou dano!",
"Vendedor respondeu todas as dúvidas antes da compra. Muito profissional!",
"O colete salva-vidas que acompanha é de ótima qualidade também!",
"Usei no lago de Furnas e fez o maior sucesso entre os banhistas!"];


const comments4Star = [
"Muito bom! Só tirei uma estrela porque a entrega demorou um pouco mais que o esperado.",
"Produto excelente, mas poderia vir com mais acessórios. No geral, super recomendo!",
"Ótimo custo-benefício. A bateria poderia durar um pouco mais, mas é muito divertido!",
"Gostei bastante. O único ponto é que o carregador esquenta um pouco.",
"Produto de qualidade. Tirando uma estrela pelo manual que poderia ser mais detalhado.",
"Bom produto! A cor era um pouco diferente da foto mas gostei mesmo assim.",
"Funciona muito bem. Só achei o assento um pouco duro no início.",
"Excelente! Só tirei uma estrela pois o painel poderia ter mais informações.",
"Produto top, mas o carregador poderia ter voltagem automática.",
"Muito bom! Só senti falta de um suporte para celular."];


const comments3Star = [
"Produto ok. Funciona bem mas esperava um pouco mais de velocidade.",
"Bom produto, mas tive que fazer alguns ajustes na montagem. Poderia ser mais simples.",
"Atende as expectativas básicas. Nada de extraordinário.",
"Funciona, mas achei a bateria um pouco pesada para transportar.",
"Razoável. Esperava mais pelo preço, mas não é ruim."];


// Generate reviews (reduced count for performance)
const generateReviews = () => {
  const avatars = [
  "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=50&h=50&fit=crop&crop=faces",
  "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=50&h=50&fit=crop&crop=faces",
  "https://images.unsplash.com/photo-1599566150163-29194dcabd36?w=50&h=50&fit=crop&crop=faces",
  "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=50&h=50&fit=crop&crop=faces",
  "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=50&h=50&fit=crop&crop=faces",
  "https://images.unsplash.com/photo-1527980965255-d3b416303d12?w=50&h=50&fit=crop&crop=faces",
  "https://images.unsplash.com/photo-1580489944761-15a19d654956?w=50&h=50&fit=crop&crop=faces",
  "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=50&h=50&fit=crop&crop=faces"];


  // Only 3 review images from the site
  const reviewImages = [review1, review2, review3];

  const variations = ["Vermelho/Preto", "Azul/Preto"];
  const names = ["A***o", "M***a", "R***o", "C***s", "J***a", "P***o", "L***a", "F***o", "B***a", "D***o", "G***a", "S***o", "T***a", "V***o", "N***a", "E***a", "I***o", "U***a", "K***o", "Z***a"];

  const reviews: any[] = [];
  let id = 1;
  let imageReviewsCount = 0;

  // Generate 900 five-star reviews (75% of total)
  for (let i = 0; i < 900; i++) {
    // Only first 3 reviews with images (one image each)
    const hasImages = imageReviewsCount < 3;
    // 85% chance of seller reply
    const hasSellerReply = Math.random() < 0.85;
    const dayOffset = Math.floor(Math.random() * 180);
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
      likes: Math.floor(Math.random() * 200) + 10,
      sellerReply: hasSellerReply ? sellerReplies[Math.floor(Math.random() * sellerReplies.length)] : null
    };

    if (hasImages) imageReviewsCount++;
    reviews.push(reviewData);
  }

  // Generate 250 four-star reviews (20% of total)
  for (let i = 0; i < 250; i++) {
    const hasSellerReply = Math.random() < 0.85;
    const dayOffset = Math.floor(Math.random() * 180);
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
      likes: Math.floor(Math.random() * 80) + 5,
      sellerReply: hasSellerReply ? sellerReplies[Math.floor(Math.random() * sellerReplies.length)] : null
    });
  }

  // Generate 50 three-star reviews (5% of total)
  for (let i = 0; i < 50; i++) {
    const hasSellerReply = Math.random() < 0.85;
    const dayOffset = Math.floor(Math.random() * 180);
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
      likes: Math.floor(Math.random() * 30) + 1,
      sellerReply: hasSellerReply ? sellerReplies[Math.floor(Math.random() * sellerReplies.length)] : null
    });
  }

  // Shuffle reviews but keep image reviews in first positions
  const imageReviews = reviews.filter((r) => r.images.length > 0);
  const textReviews = reviews.filter((r) => r.images.length === 0).sort(() => Math.random() - 0.5);

  return [...imageReviews, ...textReviews];
};

const allReviews = generateReviews();

const ProductReviews = memo(() => {
  const [activeFilter, setActiveFilter] = useState("Todas");
  const [visibleCount, setVisibleCount] = useState(50);

  const filteredReviews = useMemo(() => {
    if (activeFilter === "Com Foto") {
      return allReviews.filter((r) => r.images.length > 0);
    } else if (activeFilter.includes("★")) {
      const rating = parseInt(activeFilter);
      return allReviews.filter((r) => r.rating === rating);
    }
    return allReviews;
  }, [activeFilter]);

  const displayedReviews = useMemo(() =>
  filteredReviews.slice(0, visibleCount),
  [filteredReviews, visibleCount]
  );

  const remainingCount = filteredReviews.length - visibleCount;
  const nextLoadCount = Math.min(5, remainingCount);

  const handleLoadMore = useCallback(() => {
    setVisibleCount((prev) => prev + 5);
  }, []);

  const handleFilterChange = useCallback((filter: string) => {
    setActiveFilter(filter);
    setVisibleCount(10);
  }, []);

  const renderStars = (rating: number) => {
    return (
      <div className="flex">
        {[1, 2, 3, 4, 5].map((star) =>
        <svg
          key={star}
          className={`w-3 h-3 ${star <= rating ? "text-shopee-yellow fill-shopee-yellow" : "text-shopee-gray fill-shopee-gray"}`}
          viewBox="0 0 20 20">

            <path d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z" />
          </svg>
        )}
      </div>);

  };

  return (
    <div className="bg-card mt-2">
      {/* Header */}
      











      {/* Rating Summary */}
      <div className="flex items-center gap-3 px-3 py-3 border-b border-border">
        <div className="flex items-baseline gap-1">
          <span className="text-2xl font-bold text-primary">4.8</span>
          <span className="text-xs text-muted-foreground">/5</span>
        </div>
        <div>
          {renderStars(5)}
          <p className="text-xs text-muted-foreground mt-0.5">1.2 mil avaliações</p>
        </div>
      </div>

      <div className="flex gap-2 px-3 py-3 overflow-x-auto scrollbar-hide">
        {filters.map((filter) =>
        <button
          key={filter}
          onClick={() => handleFilterChange(filter)}
          className={`flex-shrink-0 px-3 py-1.5 rounded-full text-xs transition-all ${
          activeFilter === filter ?
          "bg-shopee-light text-primary border border-primary" :
          "bg-secondary text-foreground border border-transparent"}`
          }>

            {filter}
          </button>
        )}
      </div>

      {/* Reviews List */}
      <div className="divide-y divide-border">
        {displayedReviews.map((review) =>
        <div key={review.id} className="px-3 py-4">
            {/* User Info */}
            <div className="flex items-center gap-2 mb-2">
              <img
              src={review.avatar}
              alt={review.user}
              className="w-8 h-8 rounded-full object-cover"
              loading="lazy"
              decoding="async" />

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

            {review.images.length > 0 &&
          <div className="flex gap-2 mb-3">
                {review.images.map((img: string, index: number) =>
            <img
              key={index}
              src={img}
              alt={`Review ${index + 1}`}
              className="w-20 h-20 rounded-lg object-cover"
              loading="lazy"
              decoding="async" />

            )}
              </div>
          }

            {/* Like Button */}
            <button className="flex items-center gap-1 text-xs text-muted-foreground">
              <ThumbsUp className="w-3.5 h-3.5" />
              <span>Útil ({review.likes})</span>
            </button>

            {/* Seller Reply */}
            {review.sellerReply &&
          <div className="mt-3 p-3 bg-secondary rounded-lg">
                <p className="text-[10px] text-primary font-medium mb-1">Resposta do Vendedor:</p>
                <p className="text-xs text-muted-foreground">{review.sellerReply}</p>
              </div>
          }
          </div>
        )}
      </div>

      {remainingCount > 0 &&
      <button
        onClick={handleLoadMore}
        className="w-full py-4 border-t border-border flex items-center justify-center gap-2 text-primary text-sm font-medium">

          <span>Ver mais {nextLoadCount} avaliações</span>
          <ChevronDown className="w-4 h-4" />
        </button>
      }
    </div>);

});

ProductReviews.displayName = "ProductReviews";

export default ProductReviews;