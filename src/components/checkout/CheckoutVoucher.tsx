import { Ticket, ChevronRight } from "lucide-react";

const CheckoutVoucher = () => {
  return (
    <div className="bg-card mt-2">
      {/* Platform Voucher */}
      <button className="w-full px-3 py-3 flex items-center justify-between border-b border-border">
        <div className="flex items-center gap-3">
          <Ticket className="w-5 h-5 text-primary" />
          <span className="text-sm text-foreground">Voucher da Shopee</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-sm text-primary">-R$ 5</span>
          <ChevronRight className="w-4 h-4 text-muted-foreground" />
        </div>
      </button>

      {/* Coins */}
      <div className="px-3 py-3 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-5 h-5 rounded-full bg-amber-500 flex items-center justify-center">
            <span className="text-[10px] text-white font-bold">S</span>
          </div>
          <span className="text-sm text-foreground">Moedas Shopee</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-xs text-muted-foreground">Usar 500 moedas</span>
          <span className="text-sm text-primary">-R$ 0,50</span>
          <div className="w-4 h-4 rounded-sm border-2 border-primary flex items-center justify-center">
            <div className="w-2 h-2 bg-primary rounded-sm" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default CheckoutVoucher;
