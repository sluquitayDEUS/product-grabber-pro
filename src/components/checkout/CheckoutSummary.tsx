import { ChevronDown } from "lucide-react";

const CheckoutSummary = () => {
  const summary = {
    subtotal: 89.90,
    shipping: 0,
    voucher: -5.00,
    coins: -0.50,
    total: 84.40
  };

  return (
    <div className="bg-card mt-2 mb-20">
      <div className="px-3 py-3 border-b border-border flex items-center justify-between">
        <h3 className="text-sm font-medium text-foreground">Detalhes do Pagamento</h3>
        <ChevronDown className="w-4 h-4 text-muted-foreground" />
      </div>

      <div className="px-3 py-3 space-y-2">
        <div className="flex justify-between">
          <span className="text-sm text-muted-foreground">Subtotal de Produtos</span>
          <span className="text-sm text-foreground">R$ {summary.subtotal.toFixed(2).replace('.', ',')}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-sm text-muted-foreground">Taxa de Envio</span>
          <span className="text-sm text-foreground">
            {summary.shipping === 0 ? 'Grátis' : `R$ ${summary.shipping.toFixed(2).replace('.', ',')}`}
          </span>
        </div>
        <div className="flex justify-between">
          <span className="text-sm text-muted-foreground">Voucher da Shopee</span>
          <span className="text-sm text-primary">{summary.voucher.toFixed(2).replace('.', ',')}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-sm text-muted-foreground">Moedas Shopee</span>
          <span className="text-sm text-primary">{summary.coins.toFixed(2).replace('.', ',')}</span>
        </div>
        <div className="flex justify-between pt-2 border-t border-border">
          <span className="text-sm font-medium text-foreground">Total do Pedido</span>
          <span className="text-lg font-bold text-primary">R$ {summary.total.toFixed(2).replace('.', ',')}</span>
        </div>
      </div>
    </div>
  );
};

export default CheckoutSummary;
