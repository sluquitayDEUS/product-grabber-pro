import { useState, memo } from "react";
import { MessageCircle, Store, UserPlus, Check } from "lucide-react";
import StorePopup from "./StorePopup";
import ChatPopup from "./ChatPopup";
import shopeeLogo from "@/assets/shopee-logo.webp";
import VerifiedBadge from "@/components/ui/verified-badge";

const StoreCard = memo(() => {
  const [showStorePopup, setShowStorePopup] = useState(false);
  const [isFollowing, setIsFollowing] = useState(false);
  const [showChatPopup, setShowChatPopup] = useState(false);
  return <>
      <div className="bg-card px-3 py-4 mt-2">
        <div className="flex items-center gap-3">
          {/* Store Avatar */}
          <div className="relative">
            <img alt="Shopee Oficial" className="w-14 h-14 rounded-full object-cover border-2 border-primary bg-white p-1" src={shopeeLogo} />
            <span className="absolute -bottom-1 left-1/2 -translate-x-1/2 bg-primary text-primary-foreground text-[8px] px-1.5 py-0.5 rounded font-medium">
              Oficial
            </span>
          </div>

          {/* Store Info */}
          <div className="flex-1">
            <h3 className="text-sm font-medium text-foreground flex items-center gap-1">
              Shopee Oficial
              <VerifiedBadge size="sm" />
            </h3>
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
            <p className="text-sm font-medium text-primary">+ 2.5M </p>
            <p className="text-xs text-muted-foreground">Produtos</p>
          </div>
          <div className="w-px h-8 bg-border" />
          <div className="text-center">
            <p className="text-sm font-medium text-primary">​+ 15.7M </p>
            <p className="text-xs text-muted-foreground">Seguidores</p>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-2 mt-4">
          <button onClick={() => setShowChatPopup(true)} className="flex-1 flex items-center justify-center gap-2 py-2 border border-primary text-primary rounded-lg text-sm">
            <MessageCircle className="w-4 h-4" />
            Chat
          </button>
          <button onClick={() => setShowStorePopup(true)} className="flex-1 flex items-center justify-center gap-2 py-2 border border-border text-foreground rounded-lg text-sm">
            <Store className="w-4 h-4" />
            Ver Loja
          </button>
          <button onClick={() => setIsFollowing(!isFollowing)} className={`flex-1 flex items-center justify-center gap-1.5 py-2 rounded-lg text-sm transition-colors ${isFollowing ? 'bg-gray-100 text-muted-foreground border border-border' : 'bg-primary text-primary-foreground'}`}>
            {isFollowing ? <>
                <Check className="w-4 h-4" />
                Seguindo
              </> : <>
                <UserPlus className="w-4 h-4" />
                Seguir
              </>}
          </button>
        </div>
      </div>

      <StorePopup open={showStorePopup} onOpenChange={setShowStorePopup} />
      <ChatPopup open={showChatPopup} onOpenChange={setShowChatPopup} />
    </>;
});
StoreCard.displayName = "StoreCard";
export default StoreCard;