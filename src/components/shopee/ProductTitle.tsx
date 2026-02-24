const ProductTitle = () => {
  return (
    <div className="bg-card px-3 pb-3">
      {/* Escolha badge */}
      <div className="flex items-center gap-1.5 mb-1.5">
        <span className="bg-green-600 text-white text-[10px] font-bold px-1.5 py-0.5 rounded">Escolha</span>
        <span className="text-[11px] text-muted-foreground">Produto indicado</span>
      </div>

      <h1 className="text-base text-foreground leading-snug">
        Brinquedo Elétrico AquaVolt - Potência, Estilo e Durabilidade em um Design Compacto | Ultimo dia de promoção 🔥
      </h1>

      {/* Vendidos + Rating row */}
      <div className="flex items-center gap-2 mt-2">
        <span className="text-xs text-muted-foreground">6.3mil vendidos</span>
        <div className="flex items-center gap-1">
          <div className="flex">
            {[1, 2, 3, 4, 5].map((star) => (
              <svg key={star} className="w-3 h-3 text-shopee-yellow fill-shopee-yellow" viewBox="0 0 20 20">
                <path d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z" />
              </svg>
            ))}
          </div>
          <span className="text-xs text-muted-foreground">4.8 (1.2 mil)</span>
        </div>
      </div>
    </div>
  );
};

export default ProductTitle;
