import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Shield, Truck, Ticket, Coins, Package, RotateCcw } from "lucide-react";

interface InfoPopupProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const GarantiaPopup = ({ open, onOpenChange }: InfoPopupProps) => (
  <Dialog open={open} onOpenChange={onOpenChange}>
    <DialogContent className="max-w-sm mx-auto">
      <DialogHeader>
        <DialogTitle className="flex items-center gap-2 text-primary">
          <Shield className="w-5 h-5" />
          Garantia Shopee
        </DialogTitle>
      </DialogHeader>
      <div className="space-y-4 text-sm text-foreground">
        <div className="flex items-start gap-3">
          <Package className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
          <div>
            <p className="font-medium">Proteção Total</p>
            <p className="text-muted-foreground">Seu dinheiro fica protegido até você receber o produto.</p>
          </div>
        </div>
        <div className="flex items-start gap-3">
          <RotateCcw className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
          <div>
            <p className="font-medium">7 Dias para Devolução</p>
            <p className="text-muted-foreground">Você tem 7 dias após receber para solicitar devolução grátis.</p>
          </div>
        </div>
        <div className="flex items-start gap-3">
          <Shield className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
          <div>
            <p className="font-medium">Reembolso Garantido</p>
            <p className="text-muted-foreground">Se o produto não chegar ou vier com defeito, você recebe seu dinheiro de volta.</p>
          </div>
        </div>
      </div>
    </DialogContent>
  </Dialog>
);

export const FreteGratisPopup = ({ open, onOpenChange }: InfoPopupProps) => (
  <Dialog open={open} onOpenChange={onOpenChange}>
    <DialogContent className="max-w-sm mx-auto">
      <DialogHeader>
        <DialogTitle className="flex items-center gap-2 text-shopee-success">
          <Truck className="w-5 h-5" />
          Frete Grátis
        </DialogTitle>
      </DialogHeader>
      <div className="space-y-3 text-sm text-foreground">
        <p>Este produto possui <span className="font-medium text-shopee-success">Frete Grátis</span> para todo o Brasil!</p>
        <div className="bg-shopee-light p-3 rounded-lg">
          <p className="font-medium text-primary">Como funciona:</p>
          <ul className="mt-2 space-y-1 text-muted-foreground">
            <li>• Entrega padrão gratuita</li>
            <li>• Prazo de 3 a 9 dias úteis</li>
            <li>• Rastreamento disponível</li>
          </ul>
        </div>
        <p className="text-xs text-muted-foreground">
          * Frete grátis subsidiado pela Shopee
        </p>
      </div>
    </DialogContent>
  </Dialog>
);

export const CupomPopup = ({ open, onOpenChange }: InfoPopupProps) => (
  <Dialog open={open} onOpenChange={onOpenChange}>
    <DialogContent className="max-w-sm mx-auto">
      <DialogHeader>
        <DialogTitle className="flex items-center gap-2 text-primary">
          <Ticket className="w-5 h-5" />
          Cupom de Desconto
        </DialogTitle>
      </DialogHeader>
      <div className="space-y-3 text-sm text-foreground">
        <div className="bg-gradient-to-r from-primary/10 to-primary/5 p-4 rounded-lg border-2 border-dashed border-primary">
          <div className="text-center">
            <p className="text-xs text-muted-foreground">DESCONTO</p>
            <p className="text-2xl font-bold text-primary">R$ 10,00</p>
            <p className="text-xs text-muted-foreground mt-1">em compras acima de R$ 50</p>
          </div>
        </div>
        <div className="text-center">
          <button className="bg-primary text-primary-foreground px-6 py-2 rounded-lg font-medium text-sm">
            Resgatar Cupom
          </button>
        </div>
        <p className="text-xs text-muted-foreground text-center">
          * Válido apenas para este produto. Uso único.
        </p>
      </div>
    </DialogContent>
  </Dialog>
);

export const MoedasPopup = ({ open, onOpenChange }: InfoPopupProps) => (
  <Dialog open={open} onOpenChange={onOpenChange}>
    <DialogContent className="max-w-sm mx-auto">
      <DialogHeader>
        <DialogTitle className="flex items-center gap-2 text-amber-500">
          <Coins className="w-5 h-5" />
          Moedas Shopee
        </DialogTitle>
      </DialogHeader>
      <div className="space-y-3 text-sm text-foreground">
        <p>Ganhe <span className="font-medium text-amber-500">5% de volta</span> em Moedas Shopee nesta compra!</p>
        <div className="bg-amber-50 p-4 rounded-lg">
          <div className="flex items-center justify-between mb-2">
            <span className="text-muted-foreground">Valor da compra:</span>
            <span className="font-medium">R$ 89,90</span>
          </div>
          <div className="flex items-center justify-between text-amber-600">
            <span>Moedas a receber:</span>
            <span className="font-bold">449 moedas</span>
          </div>
        </div>
        <div className="text-xs text-muted-foreground space-y-1">
          <p>• 100 moedas = R$ 1,00</p>
          <p>• Use moedas para pagar parte das próximas compras</p>
          <p>• Moedas são creditadas após confirmação de entrega</p>
        </div>
      </div>
    </DialogContent>
  </Dialog>
);
