import { ShieldCheck } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";

const CheckoutFooter = () => {
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleConfirmOrder = () => {
    toast({
      title: "Pedido realizado com sucesso!",
      description: "Você receberá atualizações sobre o envio.",
    });
    navigate("/");
  };

  return (
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
          <p className="text-lg font-bold text-primary">R$ 84,40</p>
        </div>
        <button 
          onClick={handleConfirmOrder}
          className="h-full px-8 bg-primary text-primary-foreground font-medium text-sm"
        >
          Fazer Pedido
        </button>
      </div>
    </footer>
  );
};

export default CheckoutFooter;
