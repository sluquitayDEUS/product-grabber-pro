import { ShieldCheck, Loader2 } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { useCart } from "@/contexts/CartContext";
import { usePayment } from "@/hooks/usePayment";
import { validateCPF } from "@/lib/cpfValidator";
import { useState } from "react";
interface CheckoutFooterProps {
  onAddressInvalid?: () => void;
  onCreditCardAttempt?: () => void;
  onPixGenerated?: () => void;
}
const CheckoutFooter = ({
  onAddressInvalid,
  onCreditCardAttempt,
  onPixGenerated
}: CheckoutFooterProps) => {
  const navigate = useNavigate();
  const {
    toast
  } = useToast();
  const {
    product,
    selectedShipping,
    paymentMethod,
    totalPriceInCents,
    customer,
    shippingAddress,
    cardData,
    installments,
    pixDiscount,
    quantity
  } = useCart();
  const {
    processPayment,
    isLoading
  } = usePayment();
  const [showAddressWarning, setShowAddressWarning] = useState(false);
  const subtotal = product.price * product.quantity;
  const voucher = -5.00;
  const coins = -0.50;
  const total = subtotal + selectedShipping.price + voucher + coins - pixDiscount;
  const isAddressValid = () => {
    return customer.name && customer.email && customer.document && validateCPF(customer.document) && shippingAddress.street && shippingAddress.number && shippingAddress.neighborhood && shippingAddress.city && shippingAddress.state && shippingAddress.zipcode;
  };
  const handleConfirmOrder = async () => {
    // Validate address first
    if (!isAddressValid()) {
      setShowAddressWarning(true);
      setTimeout(() => setShowAddressWarning(false), 3100);
      onAddressInvalid?.();
      return;
    }

    // Notify credit card attempt before processing
    if (paymentMethod === "credit") {
      onCreditCardAttempt?.();
    }

    // Validate card data if credit card
    if (paymentMethod === "credit" && !cardData) {
      toast({
        title: "Dados do cartão incompletos",
        description: "Preencha todos os dados do cartão corretamente.",
        variant: "destructive"
      });
      return;
    }
    try {
      const result = await processPayment({
        amount: totalPriceInCents,
        paymentMethod: paymentMethod === "pix" ? "pix" : "credit_card",
        installments: paymentMethod === "credit" ? installments : undefined,
        cardData: paymentMethod === "credit" ? cardData ?? undefined : undefined,
        customer: {
          name: customer.name,
          email: customer.email,
          document: customer.document,
          phone: customer.phone || undefined
        },
        shipping: {
          street: shippingAddress.street,
          number: shippingAddress.number,
          complement: shippingAddress.complement,
          neighborhood: shippingAddress.neighborhood,
          city: shippingAddress.city,
          state: shippingAddress.state,
          zipcode: shippingAddress.zipcode,
          fee: Math.round(selectedShipping.price * 100)
        },
        items: [{
          title: product.name,
          quantity: product.quantity,
          unitPrice: Math.round(product.price * 100),
          tangible: true
        }]
      });
      if (result.paymentMethod === "pix" && result.pix) {
        // Mark that Pix was successfully generated
        onPixGenerated?.();
        navigate("/pix-payment", {
          state: {
            qrCode: result.pix.qrCode,
            amount: totalPriceInCents,
            transactionId: result.transactionId
          }
        });
      } else if (result.paymentMethod === "credit_card" && result.status === "paid") {
        navigate("/order-success", {
          state: {
            orderId: result.transactionId,
            amount: totalPriceInCents,
            paymentMethod: "credit"
          }
        });
      } else {
        toast({
          title: "Pedido realizado!",
          description: "Aguardando confirmação do pagamento."
        });
      }
    } catch (error) {
      toast({
        title: "Erro no pagamento",
        description: error instanceof Error ? error.message : "Tente novamente.",
        variant: "destructive"
      });
    }
  };
  return <>
      {/* Warning message for address - positioned above footer */}
      {showAddressWarning && <div className="fixed bottom-32 left-1/2 -translate-x-1/2 z-[60] bg-destructive text-destructive-foreground px-4 py-2 rounded-lg shadow-lg text-sm font-medium animate-pulse">
          Preencha o endereço de entrega
        </div>}
      
      <footer className="fixed bottom-0 left-0 right-0 bg-card border-t border-border z-50">
        {/* Terms */}
        <div className="px-3 py-2 border-b border-border flex items-center gap-2">
          <ShieldCheck className="w-4 h-4 text-primary" />
          <span className="text-[10px] text-muted-foreground">
            Ao fazer o pedido, você concorda com os Termos de Serviço e Política de Privacidade
          </span>
        </div>

        {/* Action Bar */}
        <div className="flex items-center h-14">
          <div className="flex-1 px-3">
            <p className="text-xs text-muted-foreground">Total do Pedido</p>
            <p className="text-lg font-bold text-primary">R$ {total.toFixed(2).replace('.', ',')}</p>
          </div>
          <button onClick={handleConfirmOrder} disabled={isLoading} className="h-full px-8 bg-primary text-primary-foreground font-medium text-sm disabled:opacity-50 flex items-center gap-2">
            {isLoading ? <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Processando...
              </> : "Fazer Pedido"}
          </button>
        </div>
      </footer>
    </>;
};
export default CheckoutFooter;