import { ChevronRight, CreditCard, QrCode, Zap } from "lucide-react";
import { useCart } from "@/contexts/CartContext";
import CreditCardForm from "./CreditCardForm";

const CheckoutPayment = () => {
  const { 
    paymentMethod, 
    setPaymentMethod, 
    pixDiscount, 
    setCardData, 
    installments, 
    setInstallments,
    totalPriceInCents,
    quantity 
  } = useCart();

  // PIX discount percentage: 5% for 1 unit, 12% for 2 units
  const pixDiscountPercentage = quantity >= 2 ? 12 : 5;

  const paymentMethods = [
    { id: "pix", name: "Pix", icon: QrCode, description: "Aprovação imediata", hasDiscount: true },
    { id: "credit", name: "Cartão de Crédito", icon: CreditCard, description: "Até 12x sem juros", hasDiscount: false },
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
            className={`w-full px-3 py-3 flex items-center gap-3 transition-colors ${
              method.id === "pix" && paymentMethod === "pix" ? "bg-green-50" : ""
            }`}
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
              <div className="flex items-center gap-2">
                <p className={`text-sm ${
                  paymentMethod === method.id ? 'text-primary font-medium' : 'text-foreground'
                }`}>
                  {method.name}
                </p>
                {method.hasDiscount && (
                  <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-green-500 text-white text-xs font-bold rounded-full animate-pulse">
                    <Zap className="w-3 h-3" />
                    {pixDiscountPercentage}% OFF
                  </span>
                )}
              </div>
              <p className="text-xs text-muted-foreground">{method.description}</p>
            </div>
            {method.hasDiscount && paymentMethod === "pix" && (
              <span className="text-sm font-bold text-green-600">
                -R$ {pixDiscount.toFixed(2).replace('.', ',')}
              </span>
            )}
            <ChevronRight className="w-4 h-4 text-muted-foreground" />
          </button>
        ))}
      </div>

      {paymentMethod === "pix" && (
        <div className="mx-3 mb-3 p-3 bg-gradient-to-r from-green-500 to-green-600 rounded-lg">
          <div className="flex items-center gap-2 text-white">
            <Zap className="w-5 h-5" />
            <div>
              <p className="font-bold text-sm">Você está economizando R$ {pixDiscount.toFixed(2).replace('.', ',')}!</p>
              <p className="text-xs opacity-90">Desconto exclusivo para pagamento via Pix</p>
            </div>
          </div>
        </div>
      )}

      {paymentMethod === "credit" && (
        <CreditCardForm
          onCardDataChange={setCardData}
          installments={installments}
          onInstallmentsChange={setInstallments}
          totalAmount={totalPriceInCents}
        />
      )}
    </div>
  );
};

export default CheckoutPayment;
