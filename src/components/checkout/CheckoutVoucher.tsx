import { useState } from "react";
import { Ticket, ChevronRight } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";

const CheckoutVoucher = () => {
  const [isVoucherOpen, setIsVoucherOpen] = useState(false);

  return (
    <>
      <div className="bg-card mt-2">
        {/* Platform Voucher */}
        <button 
          className="w-full px-3 py-3 flex items-center justify-between border-b border-border"
          onClick={() => setIsVoucherOpen(true)}
        >
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

      {/* Voucher Popup */}
      <Dialog open={isVoucherOpen} onOpenChange={setIsVoucherOpen}>
        <DialogContent className="max-w-[90%] rounded-lg">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-primary">
              <Ticket className="w-5 h-5" />
              Voucher da Shopee
            </DialogTitle>
            <DialogDescription className="text-left pt-3 space-y-3">
              <p className="text-foreground font-medium">
                🎉 Desconto de R$ 5,00 aplicado automaticamente!
              </p>
              <p className="text-muted-foreground text-sm">
                Este voucher é um desconto especial oferecido pela plataforma para novos clientes e compras promocionais.
              </p>
              <div className="bg-muted/50 rounded-lg p-3 space-y-2">
                <p className="text-sm font-medium text-foreground">Detalhes do voucher:</p>
                <ul className="text-sm text-muted-foreground space-y-1">
                  <li>• Valor: <span className="text-primary font-semibold">R$ 5,00</span></li>
                  <li>• Aplicação: Automática no checkout</li>
                  <li>• Validade: Apenas para esta compra</li>
                  <li>• Não acumulável com outros vouchers</li>
                </ul>
              </div>
              <p className="text-xs text-muted-foreground">
                O desconto já está refletido no valor total do seu pedido.
              </p>
            </DialogDescription>
          </DialogHeader>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default CheckoutVoucher;
