import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { CreditCard, QrCode, Zap } from "lucide-react";

interface InstallmentPopupProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const PRODUCT_PRICE = 390.90;
const INTEREST_RATE = 0.06;

const InstallmentPopup = ({ open, onOpenChange }: InstallmentPopupProps) => {
  const pixPrice = PRODUCT_PRICE * 0.95;

  const getInstallmentValue = (n: number) => {
    if (n === 1) return PRODUCT_PRICE;
    const totalWithInterest = PRODUCT_PRICE * (1 + INTEREST_RATE);
    return totalWithInterest / n;
  };

  const installments = Array.from({ length: 12 }, (_, i) => i + 1);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-sm mx-auto max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-foreground">
            <CreditCard className="w-5 h-5 text-primary" />
            Opções de Parcelamento
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          {/* PIX option */}
          <div className="bg-green-50 border border-green-200 rounded-lg p-3">
            <div className="flex items-center gap-2 mb-1">
              <QrCode className="w-5 h-5 text-green-600" />
              <span className="font-medium text-green-700">Pix</span>
              <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-green-500 text-white text-[10px] font-bold rounded-full">
                <Zap className="w-3 h-3" />
                5% OFF
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-green-700">À vista no Pix</span>
              <div className="text-right">
                <span className="text-sm line-through text-muted-foreground mr-2">
                  R$ {PRODUCT_PRICE.toFixed(2).replace('.', ',')}
                </span>
                <span className="text-lg font-bold text-green-600">
                  R$ {pixPrice.toFixed(2).replace('.', ',')}
                </span>
              </div>
            </div>
          </div>

          {/* Credit card options */}
          <div className="space-y-1">
            <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-2">Cartão de crédito</p>
            {installments.map((n) => {
              const value = getInstallmentValue(n);
              const isNoInterest = n === 1;
              return (
                <div key={n} className="flex items-center justify-between py-2 px-3 rounded-lg hover:bg-secondary/50">
                  <span className="text-sm text-foreground">
                    {n}x de <span className="font-medium">R$ {value.toFixed(2).replace('.', ',')}</span>
                  </span>
                  {isNoInterest ? (
                    <span className="text-[10px] font-medium text-green-600 bg-green-100 px-1.5 py-0.5 rounded">sem juros</span>
                  ) : (
                    <span className="text-[10px] text-muted-foreground">com juros</span>
                  )}
                </div>
              );
            })}
          </div>

          <p className="text-[10px] text-muted-foreground text-center">
            * Juros de 6% aplicados a partir de 2x. Parcelas calculadas sobre R$ {PRODUCT_PRICE.toFixed(2).replace('.', ',')}
          </p>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default InstallmentPopup;
