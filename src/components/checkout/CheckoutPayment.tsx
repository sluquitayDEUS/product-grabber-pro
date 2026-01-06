import { ChevronRight, CreditCard, Wallet, Building2, QrCode } from "lucide-react";
import { useState } from "react";

const CheckoutPayment = () => {
  const [selectedMethod, setSelectedMethod] = useState<string>("pix");

  const paymentMethods = [
    { id: "pix", name: "Pix", icon: QrCode, description: "Aprovação imediata" },
    { id: "credit", name: "Cartão de Crédito", icon: CreditCard, description: "Até 12x sem juros" },
    { id: "wallet", name: "Carteira Shopee", icon: Wallet, description: "Saldo: R$ 0,00" },
    { id: "boleto", name: "Boleto Bancário", icon: Building2, description: "Vencimento em 3 dias" },
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
            onClick={() => setSelectedMethod(method.id)}
            className="w-full px-3 py-3 flex items-center gap-3"
          >
            <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
              selectedMethod === method.id ? 'border-primary' : 'border-muted-foreground'
            }`}>
              {selectedMethod === method.id && (
                <div className="w-2.5 h-2.5 rounded-full bg-primary" />
              )}
            </div>
            <method.icon className={`w-5 h-5 ${
              selectedMethod === method.id ? 'text-primary' : 'text-muted-foreground'
            }`} />
            <div className="flex-1 text-left">
              <p className={`text-sm ${
                selectedMethod === method.id ? 'text-primary font-medium' : 'text-foreground'
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
