const WatchTitle = () => {
  return (
    <div className="bg-card px-3 pb-3">
      {/* Escolha badge */}
      <div className="flex items-center gap-1.5 mb-1.5">
        <span className="bg-primary text-white text-[10px] font-bold px-1.5 py-0.5 rounded-sm flex items-center gap-1">
          <svg className="w-3 h-3" viewBox="0 0 24 24" fill="none">
            <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z" fill="white" />
          </svg>
          Escolha
        </span>
        <span className="text-[11px] text-muted-foreground">Produto indicado</span>
      </div>

      <h1 className="text-base text-foreground leading-snug">
        Relógio Imperium - Linha Suíça Premium A+ | Aço 904L + Cristal de Safira | Últimas unidades 🔥
      </h1>

      {/* Vendidos + Rating row */}
      <div className="flex items-center gap-2 mt-2">
        <span className="text-xs text-muted-foreground">1.168 vendidos</span>
        <div className="flex items-center gap-1">
          <div className="flex">
            {[1, 2, 3, 4, 5].map((star) => (
              <svg key={star} className="w-3 h-3 text-shopee-yellow fill-shopee-yellow" viewBox="0 0 20 20">
                <path d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z" />
              </svg>
            ))}
          </div>
          <span className="text-xs text-muted-foreground">4.9 (856)</span>
        </div>
      </div>
    </div>
  );
};

export default WatchTitle;
