import { useState } from "react";
import { FreteGratisPopup, CupomPopup, MoedasPopup } from "@/components/shopee/InfoPopups";

interface Props {
  price: number;
  originalPrice: number;
  installmentValue: string;
}

const GenericProductPrice = ({ price, originalPrice, installmentValue }: Props) => {
  const [freteOpen, setFreteOpen] = useState(false);
  const [cupomOpen, setCupomOpen] = useState(false);
  const [moedasOpen, setMoedasOpen] = useState(false);

  const discount = Math.round(((originalPrice - price) / originalPrice) * 100);

  return (
    <>
      <div className="bg-card p-3">
        <div className="flex items-center gap-2">
          <span className="text-2xl font-bold text-primary">R$ {price.toFixed(2).replace(".", ",")}</span>
          <span className="text-sm text-muted-foreground line-through">R$ {originalPrice.toFixed(2).replace(".", ",")}</span>
          <span className="bg-primary/10 text-primary text-xs font-semibold px-1.5 py-0.5 rounded">-{discount}%</span>
        </div>
        <p className="text-xs text-muted-foreground mt-1 mb-3">
          ou 12x de R$ {installmentValue}
        </p>
        <div className="flex items-center gap-2 mb-1">
          <button onClick={() => setFreteOpen(true)} className="flex items-center gap-1 border border-primary/30 rounded-sm px-2 py-1 text-[11px] text-primary">
            <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <rect x="1" y="3" width="15" height="13" /><polygon points="16 8 20 8 23 11 23 16 16 16 16 8" /><circle cx="5.5" cy="18.5" r="2.5" /><circle cx="18.5" cy="18.5" r="2.5" />
            </svg>
            Frete Grátis
          </button>
          <button onClick={() => setCupomOpen(true)} className="flex items-center gap-1 border border-primary/30 rounded-sm px-2 py-1 text-[11px] text-primary">
            <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M20 12V8H6a2 2 0 0 1-2-2c0-1.1.9-2 2-2h12v4" /><path d="M4 6v12c0 1.1.9 2 2 2h14v-4" /><path d="M18 12a2 2 0 0 0 0 4h4v-4z" />
            </svg>
            Cupom R$10
          </button>
          <button onClick={() => setMoedasOpen(true)} className="flex items-center gap-1 border border-primary/30 rounded-sm px-2 py-1 text-[11px] text-primary">
            <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="8" /><path d="M12 2v2m0 16v2M2 12h2m16 0h2" />
            </svg>
            10% Pix
          </button>
        </div>
      </div>
      <FreteGratisPopup open={freteOpen} onOpenChange={setFreteOpen} />
      <CupomPopup open={cupomOpen} onOpenChange={setCupomOpen} />
      <MoedasPopup open={moedasOpen} onOpenChange={setMoedasOpen} />
    </>
  );
};

export default GenericProductPrice;
