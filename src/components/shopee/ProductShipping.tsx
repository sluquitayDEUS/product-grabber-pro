import { Truck, ChevronRight } from "lucide-react";

const ProductShipping = () => {
  return (
    <div className="bg-card mt-2">
      {/* Frete grátis */}
      <button className="w-full flex items-center gap-2 px-3 py-3 border-b border-border">
        <Truck className="w-4 h-4 text-muted-foreground" />
        <span className="text-sm text-shopee-success font-medium">Frete grátis</span>
        <span className="text-sm text-muted-foreground line-through">R$12,04</span>
        <span className="text-sm text-foreground">R$0,00 com cupom</span>
        <ChevronRight className="w-4 h-4 text-muted-foreground ml-auto" />
      </button>

      {/* Parcelamento */}
      <button className="w-full flex items-center gap-2 px-3 py-3">
        <svg className="w-4 h-4 text-muted-foreground" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <rect x="1" y="4" width="22" height="16" rx="2" ry="2"/>
          <line x1="1" y1="10" x2="23" y2="10"/>
        </svg>
        <span className="text-sm text-foreground">SParcelado: Parcele em até 12x</span>
        <ChevronRight className="w-4 h-4 text-muted-foreground ml-auto" />
      </button>
    </div>
  );
};

export default ProductShipping;
