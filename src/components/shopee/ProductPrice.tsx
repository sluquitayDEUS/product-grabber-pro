import { useState } from "react";
import { FreteGratisPopup, CupomPopup, MoedasPopup } from "./InfoPopups";

const ProductPrice = () => {
  const [freteOpen, setFreteOpen] = useState(false);
  const [cupomOpen, setCupomOpen] = useState(false);
  const [moedasOpen, setMoedasOpen] = useState(false);

  return <>
      <div className="bg-card p-3">
        {/* Price Row */}
        <div className="flex items-center gap-2">
          <span className="text-2xl font-bold text-primary">R$ 390,90</span>
          <span className="text-sm text-muted-foreground line-through">R$ 647,00</span>
          <span className="bg-primary/10 text-primary text-xs font-semibold px-1.5 py-0.5 rounded">-40%</span>
        </div>

        {/* Installments */}
        <p className="text-xs text-muted-foreground mt-1 mb-3">
          ou 12x de R$ 34,53
        </p>

        {/* Benefits row */}
        <div className="flex items-center gap-2 mb-1">
          <button
            onClick={() => setFreteOpen(true)}
            className="flex items-center gap-1 border border-primary/30 rounded px-2 py-0.5 text-[11px] text-primary"
          >
            Frete Grátis
          </button>
          <button
            onClick={() => setCupomOpen(true)}
            className="flex items-center gap-1 border border-primary/30 rounded px-2 py-0.5 text-[11px] text-primary"
          >
            Cupom R$10
          </button>
          <button
            onClick={() => setMoedasOpen(true)}
            className="flex items-center gap-1 border border-primary/30 rounded px-2 py-0.5 text-[11px] text-primary"
          >
            5% Moedas
          </button>
        </div>
      </div>

      <FreteGratisPopup open={freteOpen} onOpenChange={setFreteOpen} />
      <CupomPopup open={cupomOpen} onOpenChange={setCupomOpen} />
      <MoedasPopup open={moedasOpen} onOpenChange={setMoedasOpen} />
    </>;
};

export default ProductPrice;