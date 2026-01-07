import { ShieldCheck, Loader2 } from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { useCart } from "@/contexts/CartContext";
import { usePayment } from "@/hooks/usePayment";
import PixQRCodeModal from "./PixQRCodeModal";

const CheckoutFooter = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { 
    product, 
    selectedShipping, 
    paymentMethod, 
    totalPrice, 
    totalPriceInCents,
    customer,
    shippingAddress,
    cardData,
    installments,
    pixDiscount,
  } = useCart();
  const { processPayment, isLoading } = usePayment();

  const [pixModalOpen, setPixModalOpen] = useState(false);
  const [pixData, setPixData] = useState<{
    qrCode: string;
    qrCodeUrl: string;
    expiresAt: string;
  } | null>(null);

  const subtotal = product.price * product.quantity;
  const voucher = -5.00;
  const coins = -0.50;
  const total = subtotal + selectedShipping.price + voucher + coins - pixDiscount;

  const handleConfirmOrder = async () => {
    // Validate customer data
    if (!customer.name || !customer.email || !customer.document) {
      toast({
        title: "Dados incompletos",
        description: "Preencha seus dados pessoais antes de finalizar.",
        variant: "destructive",
      });
      return;
    }

    // Validate address data (required by gateway)
    if (
      !shippingAddress.street ||
      !shippingAddress.number ||
      !shippingAddress.neighborhood ||
      !shippingAddress.city ||
      !shippingAddress.state ||
      !shippingAddress.zipcode
    ) {
      toast({
        title: "Endereço incompleto",
        description: "Preencha seu endereço de entrega antes de finalizar.",
        variant: "destructive",
      });
      return;
    }

    // Validate card data if credit card
    if (paymentMethod === "credit" && !cardData) {
      toast({
        title: "Dados do cartão incompletos",
        description: "Preencha todos os dados do cartão corretamente.",
        variant: "destructive",
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
          phone: customer.phone || undefined,
        },
        shipping: {
          street: shippingAddress.street,
          number: shippingAddress.number,
          complement: shippingAddress.complement,
          neighborhood: shippingAddress.neighborhood,
          city: shippingAddress.city,
          state: shippingAddress.state,
          zipcode: shippingAddress.zipcode,
          fee: Math.round(selectedShipping.price * 100),
        },
        items: [
          {
            title: product.name,
            quantity: product.quantity,
            unitPrice: Math.round(product.price * 100),
            tangible: true,
          },
        ],
      });


      if (result.paymentMethod === "pix" && result.pix) {
        setPixData(result.pix);
        setPixModalOpen(true);
      } else {
        toast({
          title: "Pedido realizado com sucesso!",
          description: "Seu pagamento foi aprovado.",
        });
        navigate("/");
      }
    } catch (error) {
      toast({
        title: "Erro no pagamento",
        description: error instanceof Error ? error.message : "Tente novamente.",
        variant: "destructive",
      });
    }
  };

  return (
    <>
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
          <button 
            onClick={handleConfirmOrder}
            disabled={isLoading}
            className="h-full px-8 bg-primary text-primary-foreground font-medium text-sm disabled:opacity-50 flex items-center gap-2"
          >
            {isLoading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Processando...
              </>
            ) : (
              "Fazer Pedido"
            )}
          </button>
        </div>
      </footer>

      {pixData && (
        <PixQRCodeModal
          isOpen={pixModalOpen}
          onClose={() => {
            setPixModalOpen(false);
            toast({
              title: "Pedido realizado!",
              description: "Aguardando confirmação do pagamento.",
            });
            navigate("/");
          }}
          qrCode={pixData.qrCode}
          qrCodeUrl={pixData.qrCodeUrl}
          expiresAt={pixData.expiresAt}
          amount={totalPriceInCents}
        />
      )}
    </>
  );
};

export default CheckoutFooter;
