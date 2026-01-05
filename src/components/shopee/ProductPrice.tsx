import { Truck, Ticket, Coins } from "lucide-react";

const ProductPrice = () => {
  return (
    <div className="bg-card p-3">
      {/* Price Row */}
      <div className="flex items-baseline gap-2 mb-2">
        <span className="text-2xl font-bold text-primary">R$ 89,90</span>
        <span className="text-sm text-muted-foreground line-through">R$ 164,90</span>
        <span className="bg-primary text-primary-foreground text-xs px-1.5 py-0.5 rounded font-medium">
          -45%
        </span>
      </div>

      {/* Installments */}
      <p className="text-xs text-muted-foreground mb-3">
        ou 12x de R$ 8,49
      </p>

      {/* Benefits */}
      <div className="flex flex-wrap gap-2">
        <div className="flex items-center gap-1 bg-shopee-light px-2 py-1 rounded">
          <Truck className="w-3.5 h-3.5 text-primary" />
          <span className="text-xs text-primary font-medium">Frete Grátis</span>
        </div>
        
        <div className="flex items-center gap-1 bg-shopee-light px-2 py-1 rounded">
          <Ticket className="w-3.5 h-3.5 text-primary" />
          <span className="text-xs text-primary font-medium">Cupom R$10</span>
        </div>
        
        <div className="flex items-center gap-1 bg-shopee-light px-2 py-1 rounded">
          <Coins className="w-3.5 h-3.5 text-primary" />
          <span className="text-xs text-primary font-medium">5% Moedas</span>
        </div>
      </div>
    </div>
  );
};

export default ProductPrice;