import { ChevronRight, CreditCard, QrCode } from "lucide-react";
import { useCart } from "@/contexts/CartContext";

const CheckoutPayment = () => {
  const { paymentMethod, setPaymentMethod } = useCart();

  const paymentMethods = [
    { id: "pix", name: "Pix", icon: QrCode, description: "5% de desconto • Aprovação imediata" },
    { id: "credit", name: "Cartão de Crédito", icon: CreditCard, description: "Até 12x sem juros" },
  ];

  return (
    <div className="bg-card mt-2">
      <div className="px-3 py-3 border-b border-border">
        <h3 className="text-sm font-medium text-foreground">Método de Pagamento</h3>
      </div>

      <div className="divide-y divide-border">
        {paymentMethods.map((method) => (
          <button
            key={method.id}
            onClick={() => setPaymentMethod(method.id)}
            className="w-full px-3 py-3 flex items-center gap-3"
          >
            <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
              paymentMethod === method.id ? 'border-primary' : 'border-muted-foreground'
            }`}>
              {paymentMethod === method.id && (
                <div className="w-2.5 h-2.5 rounded-full bg-primary" />
              )}
            </div>
            <method.icon className={`w-5 h-5 ${
              paymentMethod === method.id ? 'text-primary' : 'text-muted-foreground'
            }`} />
            <div className="flex-1 text-left">
              <p className={`text-sm ${
                paymentMethod === method.id ? 'text-primary font-medium' : 'text-foreground'
              }`}>
                {method.name}
              </p>
              <p className="text-xs text-muted-foreground">{method.description}</p>
            </div>
            <ChevronRight className="w-4 h-4 text-muted-foreground" />
          </button>
        ))}
      </div>
    </div>
  );
};

export default CheckoutPayment;
