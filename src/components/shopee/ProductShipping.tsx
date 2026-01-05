import { MapPin, Truck, ChevronRight } from "lucide-react";

const ProductShipping = () => {
  return (
    <div className="bg-card px-3 py-3 mt-2">
      {/* Location */}
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <MapPin className="w-4 h-4 text-muted-foreground" />
          <span className="text-sm text-foreground">Enviar para São Paulo, SP</span>
        </div>
        <ChevronRight className="w-4 h-4 text-muted-foreground" />
      </div>

      {/* Shipping Options */}
      <div className="border-t border-border pt-3">
        <div className="flex items-start gap-2">
          <Truck className="w-4 h-4 text-shopee-success mt-0.5" />
          <div className="flex-1">
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium text-shopee-success">Frete Grátis</span>
              <span className="bg-shopee-light text-primary text-[10px] px-1.5 py-0.5 rounded font-medium">
                Shopee
              </span>
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              Receba entre 10-15 Jan
            </p>
            <p className="text-xs text-muted-foreground">
              Entrega padrão: <span className="line-through">R$ 19,90</span>
            </p>
          </div>
        </div>
      </div>

      {/* Protection */}
      <div className="flex items-center gap-2 mt-3 pt-3 border-t border-border">
        <svg className="w-4 h-4 text-primary" viewBox="0 0 24 24" fill="currentColor">
          <path d="M12 1L3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5l-9-4zm0 10.99h7c-.53 4.12-3.28 7.79-7 8.94V12H5V6.3l7-3.11v8.8z"/>
        </svg>
        <span className="text-xs text-foreground">Garantia Shopee 7 dias</span>
        <ChevronRight className="w-4 h-4 text-muted-foreground ml-auto" />
      </div>
    </div>
  );
};

export default ProductShipping;