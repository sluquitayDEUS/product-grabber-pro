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
        <div className="flex items-baseline gap-2 mb-2">
          <span className="text-2xl font-bold text-primary">R$ 390,90</span>
          <span className="text-sm text-muted-foreground line-through">R$ 647,00</span>
          <span className="bg-primary text-primary-foreground text-xs px-1.5 py-0.5 rounded font-medium">
            1.2 mil Vendido(s)
          </span>
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