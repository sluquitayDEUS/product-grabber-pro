import { CheckCircle, Package, Truck, Home, ShieldCheck, Star, PartyPopper } from "lucide-react";
import { useLocation, useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import confetti from "canvas-confetti";

const OrderSuccess = () => {
  const location = useLocation();
  const navigate = useNavigate();

  // Get order data from navigation state
  const { orderId, amount, paymentMethod } = location.state || {};

  useEffect(() => {
    // Redirect if no order data
    if (!orderId) {
      navigate("/");
      return;
    }

    // Trigger confetti celebration
    const duration = 3 * 1000;
    const animationEnd = Date.now() + duration;
    const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 0 };

    function randomInRange(min: number, max: number) {
      return Math.random() * (max - min) + min;
    }

    const interval: ReturnType<typeof setInterval> = setInterval(function() {
      const timeLeft = animationEnd - Date.now();

      if (timeLeft <= 0) {
        return clearInterval(interval);
      }

      const particleCount = 50 * (timeLeft / duration);
      confetti({
        ...defaults,
        particleCount,
        origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 }
      });
      confetti({
        ...defaults,
        particleCount,
        origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 }
      });
    }, 250);

    return () => clearInterval(interval);
  }, [orderId, navigate]);

  const formatCurrency = (value: number) => {
    return (value / 100).toLocaleString("pt-BR", {
      style: "currency",
      currency: "BRL",
    });
  };

  if (!orderId) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-green-50 via-background to-background">
      {/* Header */}
      <header className="bg-gradient-to-r from-green-500 to-green-600 text-white py-6 px-4">
        <div className="max-w-md mx-auto text-center">
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-white/20 backdrop-blur-sm mb-4 animate-bounce">
            <CheckCircle className="w-12 h-12 text-white" />
          </div>
          <h1 className="text-2xl font-bold mb-1">Parabéns! 🎉</h1>
          <p className="text-green-100">Seu pedido foi confirmado com sucesso</p>
        </div>
      </header>

      <div className="max-w-md mx-auto p-4 space-y-6 -mt-4">
        {/* Success Card */}
        <div className="bg-card rounded-2xl p-6 shadow-xl border-2 border-green-200">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-12 h-12 rounded-full bg-green-100 flex items-center justify-center">
              <PartyPopper className="w-6 h-6 text-green-600" />
            </div>
            <div>
              <p className="font-semibold text-lg text-foreground">Pedido Confirmado!</p>
              <p className="text-sm text-muted-foreground">
                Pagamento via {paymentMethod === "pix" ? "Pix" : "Cartão de Crédito"}
              </p>
            </div>
          </div>

          <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl p-4 mb-4">
            <p className="text-sm text-muted-foreground">Valor pago</p>
            <p className="text-3xl font-bold text-green-600">{formatCurrency(amount)}</p>
          </div>

          <div className="flex items-center justify-between py-3 border-t border-border">
            <span className="text-sm text-muted-foreground">Número do pedido</span>
            <span className="font-mono text-sm font-medium">{orderId}</span>
          </div>
        </div>

        {/* Timeline Card */}
        <div className="bg-card rounded-2xl p-6 shadow-lg border">
          <h3 className="font-semibold text-lg mb-4">Próximos passos</h3>
          
          <div className="space-y-4">
            <div className="flex gap-4">
              <div className="flex flex-col items-center">
                <div className="w-10 h-10 rounded-full bg-green-500 flex items-center justify-center">
                  <CheckCircle className="w-5 h-5 text-white" />
                </div>
                <div className="w-0.5 h-full bg-green-300 my-2" />
              </div>
              <div className="pb-4">
                <p className="font-medium text-green-600">Pagamento Aprovado</p>
                <p className="text-sm text-muted-foreground">
                  Seu pagamento foi processado com sucesso
                </p>
              </div>
            </div>

            <div className="flex gap-4">
              <div className="flex flex-col items-center">
                <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center">
                  <Package className="w-5 h-5 text-primary" />
                </div>
                <div className="w-0.5 h-full bg-border my-2" />
              </div>
              <div className="pb-4">
                <p className="font-medium">Preparando Envio</p>
                <p className="text-sm text-muted-foreground">
                  Estamos preparando seu produto para envio
                </p>
              </div>
            </div>

            <div className="flex gap-4">
              <div className="flex flex-col items-center">
                <div className="w-10 h-10 rounded-full bg-muted flex items-center justify-center">
                  <Truck className="w-5 h-5 text-muted-foreground" />
                </div>
                <div className="w-0.5 h-full bg-border my-2" />
              </div>
              <div className="pb-4">
                <p className="font-medium text-muted-foreground">Em Transporte</p>
                <p className="text-sm text-muted-foreground">
                  Você receberá o código de rastreio por e-mail
                </p>
              </div>
            </div>

            <div className="flex gap-4">
              <div className="flex items-center">
                <div className="w-10 h-10 rounded-full bg-muted flex items-center justify-center">
                  <Home className="w-5 h-5 text-muted-foreground" />
                </div>
              </div>
              <div>
                <p className="font-medium text-muted-foreground">Entrega</p>
                <p className="text-sm text-muted-foreground">
                  Receba seu produto no endereço cadastrado
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Rating Card */}
        <div className="bg-gradient-to-r from-primary/5 to-orange-50 rounded-2xl p-6 border border-primary/20">
          <div className="flex items-center gap-3 mb-3">
            <Star className="w-6 h-6 text-primary fill-primary" />
            <h3 className="font-semibold">Obrigado pela confiança!</h3>
          </div>
          <p className="text-sm text-muted-foreground mb-4">
            Ficamos felizes em ter você como cliente. Após receber seu produto, 
            conte-nos o que achou da sua experiência!
          </p>
          <div className="flex gap-1">
            {[1, 2, 3, 4, 5].map((star) => (
              <Star 
                key={star} 
                className="w-8 h-8 text-yellow-400 fill-yellow-400 cursor-pointer hover:scale-110 transition-transform" 
              />
            ))}
          </div>
        </div>

        {/* Security Badge */}
        <div className="flex items-center justify-center gap-2 text-muted-foreground py-2">
          <ShieldCheck className="w-5 h-5 text-green-600" />
          <span className="text-sm">Compra 100% segura e garantida</span>
        </div>

        {/* Back to Home Button */}
        <Button 
          onClick={() => navigate("/")}
          className="w-full h-12 text-base font-semibold"
        >
          Continuar Comprando
        </Button>
      </div>
    </div>
  );
};

export default OrderSuccess;