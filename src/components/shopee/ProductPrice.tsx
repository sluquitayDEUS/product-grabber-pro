import { Truck, Ticket, Coins } from "lucide-react";
import { useState } from "react";
import { FreteGratisPopup, CupomPopup, MoedasPopup } from "./InfoPopups";
const ProductPrice = () => {
  const [freteOpen, setFreteOpen] = useState(false);
  const [cupomOpen, setCupomOpen] = useState(false);
  const [moedasOpen, setMoedasOpen] = useState(false);
  return <>
      <div className="bg-card p-3">
        {/* Price Row */}
        <div className="flex items-baseline gap-2">
          <span className="text-2xl font-bold text-primary">R$ 390,90</span>
          <span className="text-sm text-muted-foreground line-through">R$ 647,00</span>
          <div className="ml-auto flex items-center gap-1">
            <span className="text-sm text-muted-foreground">1.2 mil Vendido(s)</span>
            <svg className="w-5 h-5 text-muted-foreground" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z" /></svg>
          </div>
        </div>

        {/* Rating row */}
        <div className="flex items-center gap-1 mt-1 mb-2">
          <div className="flex">
            {[1, 2, 3, 4, 5].map((star) => (
              <svg key={star} className={`w-3 h-3 ${star <= 5 ? "text-shopee-yellow fill-shopee-yellow" : "text-muted-foreground fill-muted-foreground"}`} viewBox="0 0 20 20">
                <path d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z" />
              </svg>
            ))}
          </div>
          <span className="text-xs text-muted-foreground">4.8</span>
          <span className="text-xs text-muted-foreground">|</span>
          <span className="text-xs text-muted-foreground">1.2 mil Avaliações</span>
        </div>

        {/* Installments */}
        <p className="text-xs text-muted-foreground mb-3">
          ou 12x de R$ 34,53
        </p>

        {/* Benefits */}
        















      </div>

      <FreteGratisPopup open={freteOpen} onOpenChange={setFreteOpen} />
      <CupomPopup open={cupomOpen} onOpenChange={setCupomOpen} />
      <MoedasPopup open={moedasOpen} onOpenChange={setMoedasOpen} />
    </>;
};
export default ProductPrice;