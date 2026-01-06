import { ChevronDown } from "lucide-react";
import { useCart } from "@/contexts/CartContext";

const CheckoutSummary = () => {
  const { product, selectedShipping, paymentMethod, pixDiscount, totalPrice } = useCart();
  
  const subtotal = product.price * product.quantity;

  return (
    <div className="bg-card mt-2 mb-20">
      <div className="px-3 py-3 border-b border-border flex items-center justify-between">
        <h3 className="text-sm font-medium text-foreground">Detalhes do Pagamento</h3>
        <ChevronDown className="w-4 h-4 text-muted-foreground" />
      </div>

      <div className="px-3 py-3 space-y-2">
        <div className="flex justify-between">
          <span className="text-sm text-muted-foreground">Subtotal de Produtos</span>
          <span className="text-sm text-foreground">R$ {subtotal.toFixed(2).replace('.', ',')}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-sm text-muted-foreground">Taxa de Envio</span>
          <span className="text-sm text-foreground">
            {selectedShipping.price === 0 ? 'Grátis' : `R$ ${selectedShipping.price.toFixed(2).replace('.', ',')}`}
          </span>
        </div>
        {paymentMethod === "pix" && pixDiscount > 0 && (
          <div className="flex justify-between">
            <span className="text-sm text-muted-foreground">Desconto Pix (5%)</span>
            <span className="text-sm text-green-600">-R$ {pixDiscount.toFixed(2).replace('.', ',')}</span>
          </div>
        )}
        <div className="flex justify-between pt-2 border-t border-border">
          <span className="text-sm font-medium text-foreground">Total do Pedido</span>
          <span className="text-lg font-bold text-primary">R$ {totalPrice.toFixed(2).replace('.', ',')}</span>
        </div>
      </div>
    </div>
  );
};

export default CheckoutSummary;
