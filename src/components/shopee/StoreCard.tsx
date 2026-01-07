import { MessageCircle, Store } from "lucide-react";
const StoreCard = () => {
  return <div className="bg-card px-3 py-4 mt-2">
      <div className="flex items-center gap-3">
        {/* Store Avatar */}
        <div className="relative">
          <img src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=faces" alt="Loja" className="w-14 h-14 rounded-full object-cover border-2 border-primary" />
          <span className="absolute -bottom-1 left-1/2 -translate-x-1/2 bg-primary text-primary-foreground text-[8px] px-1.5 py-0.5 rounded font-medium">
            Oficial
          </span>
        </div>

        {/* Store Info */}
        <div className="flex-1">
          <h3 className="text-sm font-medium text-foreground">Atacado Premium</h3>
          <p className="text-xs text-muted-foreground">Online há 3 minutos</p>
          
          <div className="flex items-center gap-4 mt-1">
            <div className="text-xs">
              <span className="text-primary font-medium">98%</span>
              <span className="text-muted-foreground ml-1">Resposta</span>
            </div>
            <div className="text-xs">
              <span className="text-primary font-medium">2h</span>
              <span className="text-muted-foreground ml-1">Tempo</span>
            </div>
          </div>
        </div>
      </div>

      {/* Store Stats */}
      <div className="flex items-center justify-around mt-4 pt-4 border-t border-border">
        <div className="text-center">
          <p className="text-sm font-medium text-primary">4.8</p>
          <p className="text-xs text-muted-foreground">Avaliações</p>
        </div>
        <div className="w-px h-8 bg-border" />
        <div className="text-center">
          <p className="text-sm font-medium text-primary">2.5mil</p>
          <p className="text-xs text-muted-foreground">Produtos</p>
        </div>
        <div className="w-px h-8 bg-border" />
        <div className="text-center">
          <p className="text-sm font-medium text-primary">85mil</p>
          <p className="text-xs text-muted-foreground">Seguidores</p>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex gap-2 mt-4">
        <button className="flex-1 flex items-center justify-center gap-2 py-2 border border-primary text-primary rounded-lg text-sm">
          <MessageCircle className="w-4 h-4" />
          Chat
        </button>
        <button className="flex-1 flex items-center justify-center gap-2 py-2 border border-border text-foreground rounded-lg text-sm">
          <Store className="w-4 h-4" />
          Ver Loja
        </button>
      </div>
    </div>;
};
export default StoreCard;