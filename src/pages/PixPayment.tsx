import { Copy, Check, Clock, ShieldCheck, ArrowLeft, CheckCircle2, Store, BadgeCheck, Truck, Lock, Smartphone, Star, Package } from "lucide-react";
import { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { QRCodeSVG } from "qrcode.react";
import { useAbandonedCart } from "@/hooks/useAbandonedCart";

const PixPayment = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [copied, setCopied] = useState(false);
  const [timeLeft, setTimeLeft] = useState(15 * 60); // 15 minutes in seconds
  const [pulseTimer, setPulseTimer] = useState(false);
  const { markPixGenerated, clearAbandonedCart } = useAbandonedCart();

  // Get data from navigation state
  const { qrCode, amount, transactionId } = location.state || {};

  useEffect(() => {
    if (!qrCode) {
      navigate("/");
      return;
    }

    // Mark Pix as generated and clear abandoned cart tracking
    markPixGenerated();
    clearAbandonedCart();

    // Countdown timer
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          return 0;
        }
        // Pulse effect when time is running low (less than 5 minutes)
        if (prev <= 300) {
          setPulseTimer(true);
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [qrCode, navigate]);

  const handleCopyCode = async () => {
    try {
      await navigator.clipboard.writeText(qrCode);
      setCopied(true);
      setTimeout(() => setCopied(false), 3000);
    } catch (err) {
      console.error("Failed to copy:", err);
    }
  };

  const formatCurrency = (value: number) => {
    return (value / 100).toLocaleString("pt-BR", {
      style: "currency",
      currency: "BRL",
    });
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  const isExpired = timeLeft === 0;
  const isLowTime = timeLeft <= 300 && timeLeft > 0;

  if (!qrCode) {
    return null;
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="bg-primary text-primary-foreground py-4 px-4 flex items-center gap-3 sticky top-0 z-50 shadow-md">
        <button onClick={() => navigate("/")} className="p-1 hover:bg-white/10 rounded-full transition-colors">
          <ArrowLeft className="w-5 h-5" />
        </button>
        <div className="flex items-center gap-2 flex-1">
          <div className="bg-white rounded-lg p-1.5">
            <svg width="24" height="24" viewBox="0 0 512 512" fill="none">
              <path d="M112.57 391.19c20.056 0 38.928-7.808 53.12-22l76.693-76.692c5.385-5.404 14.765-5.384 20.15 0l76.989 76.989c14.191 14.172 33.045 21.98 53.12 21.98h15.098l-97.138 97.139c-30.326 30.344-79.505 30.344-109.85 0l-97.415-97.416h9.232z" fill="#32BCAD"/>
              <path d="M401.051 120.471h-15.098c-20.075 0-38.929 7.808-53.12 22l-76.97 76.989c-5.551 5.53-14.6 5.55-20.15 0l-76.711-76.693c-14.192-14.191-33.046-22-53.12-22h-9.214l97.397-97.397c30.344-30.345 79.523-30.345 109.867 0l97.119 97.101z" fill="#32BCAD"/>
              <path d="M498.363 206.098l-63.96-63.96c3.15 8.355 4.896 17.37 4.896 26.815 0 20.075-7.808 38.929-22 53.12l-76.97 76.99c-2.794 2.775-6.44 4.162-10.094 4.162-3.636 0-7.282-1.387-10.076-4.161l-76.712-76.693c-14.19-14.192-33.044-22.02-53.101-22.02-20.056 0-38.91 7.828-53.12 22.02l-76.97 76.989c-14.191 14.172-22 33.026-22 53.12 0 9.463 1.746 18.477 4.915 26.832l-63.977-63.977c-30.345-30.344-30.345-79.523 0-109.867l63.96-63.96c-3.15-8.355-4.896-17.37-4.896-26.815 0-20.075 7.808-38.929 22-53.12l76.97-76.99c14.191-14.172 33.045-22 53.12-22 20.056 0 38.91 7.828 53.12 22.02l76.97 76.989c5.55 5.55 14.6 5.53 20.15 0l76.97-76.99c14.192-14.172 33.046-22 53.12-22 9.463 0 18.477 1.746 26.832 4.915l-63.977-63.977c-30.344-30.345-79.523-30.345-109.867 0" fill="#32BCAD"/>
            </svg>
          </div>
          <div>
            <h1 className="text-lg font-bold">Pagamento Pix</h1>
            <p className="text-xs text-primary-foreground/80">Aprovação instantânea</p>
          </div>
        </div>
        <Lock className="w-5 h-5 text-primary-foreground/80" />
      </header>

      <div className="max-w-md mx-auto p-4 space-y-4">
        {/* Success Status Banner */}
        <div className="bg-gradient-to-r from-primary to-primary/90 rounded-2xl p-4 text-white shadow-lg">
          <div className="flex items-center gap-3">
            <div className="bg-white/20 rounded-full p-2">
              <CheckCircle2 className="w-6 h-6" />
            </div>
            <div>
              <p className="font-bold text-lg">Pix gerado com sucesso!</p>
              <p className="text-sm text-white/90">Escaneie o QR Code ou copie o código</p>
            </div>
          </div>
        </div>

        {/* Timer + Amount Card Combined */}
        <div className="bg-card rounded-2xl shadow-lg border overflow-hidden">
          <div className={`p-4 text-center border-b ${isExpired ? "bg-destructive/10" : isLowTime ? "bg-amber-50" : "bg-primary/5"}`}>
            <div className="flex items-center justify-center gap-2 mb-1">
              <Clock className={`w-5 h-5 ${isExpired ? "text-destructive" : isLowTime ? "text-amber-500" : "text-primary"} ${pulseTimer && !isExpired ? "animate-pulse" : ""}`} />
              <span className={`text-sm font-medium ${isExpired ? "text-destructive" : isLowTime ? "text-amber-600" : "text-primary"}`}>
                {isExpired ? "Tempo expirado - Gere um novo Pix" : "Pague em até"}
              </span>
            </div>
            <p className={`text-4xl font-bold tabular-nums ${isExpired ? "text-destructive" : isLowTime ? "text-amber-500" : "text-primary"}`}>
              {formatTime(timeLeft)}
            </p>
            {isLowTime && !isExpired && (
              <p className="text-xs text-amber-600 mt-1 animate-pulse">⚠️ Tempo acabando! Finalize agora</p>
            )}
          </div>
          
          <div className="p-5 text-center">
            <p className="text-sm text-muted-foreground">Valor total com desconto Pix</p>
            <p className="text-4xl font-bold text-primary mt-1">
              {formatCurrency(amount)}
            </p>
            <div className="flex items-center justify-center gap-2 mt-2">
              <span className="bg-shopee-light text-primary text-xs px-2 py-1 rounded-full font-medium">
                ✓ Desconto aplicado
              </span>
            </div>
          </div>
        </div>

        {/* QR Code Card */}
        <div className="bg-card rounded-2xl p-6 shadow-lg border">
          <div className="flex justify-center mb-4">
            <div className={`bg-white p-4 rounded-xl border-2 ${isExpired ? "border-gray-200" : "border-primary/30"} relative`}>
              <QRCodeSVG
                value={qrCode}
                size={200}
                level="H"
                includeMargin={false}
                className={isExpired ? "opacity-30" : ""}
              />
              {!isExpired && (
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                  <div className="bg-white rounded-lg p-1 shadow-sm">
                    <svg width="32" height="32" viewBox="0 0 512 512" fill="none">
                      <path d="M112.57 391.19c20.056 0 38.928-7.808 53.12-22l76.693-76.692c5.385-5.404 14.765-5.384 20.15 0l76.989 76.989c14.191 14.172 33.045 21.98 53.12 21.98h15.098l-97.138 97.139c-30.326 30.344-79.505 30.344-109.85 0l-97.415-97.416h9.232z" fill="#32BCAD"/>
                      <path d="M401.051 120.471h-15.098c-20.075 0-38.929 7.808-53.12 22l-76.97 76.989c-5.551 5.53-14.6 5.55-20.15 0l-76.711-76.693c-14.192-14.191-33.046-22-53.12-22h-9.214l97.397-97.397c30.344-30.345 79.523-30.345 109.867 0l97.119 97.101z" fill="#32BCAD"/>
                    </svg>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Copy Button */}
          <Button
            onClick={handleCopyCode}
            disabled={isExpired}
            className={`w-full h-14 text-base font-bold gap-2 rounded-xl transition-all ${
              copied 
                ? "bg-shopee-success hover:bg-shopee-success/90" 
                : "bg-primary hover:bg-primary/90"
            }`}
          >
            {copied ? (
              <>
                <Check className="w-5 h-5" />
                Código Pix copiado!
              </>
            ) : (
              <>
                <Copy className="w-5 h-5" />
                Copiar código Pix
              </>
            )}
          </Button>

          {copied && (
            <p className="text-center text-sm text-shopee-success mt-2 animate-in fade-in">
              ✓ Cole no app do seu banco para pagar
            </p>
          )}
        </div>

        {/* Instructions Card */}
        <div className="bg-card rounded-2xl p-5 shadow-lg border">
          <h3 className="font-bold text-base mb-4 flex items-center gap-2">
            <Smartphone className="w-5 h-5 text-primary" />
            Como pagar com Pix
          </h3>
          
          <div className="space-y-3">
            {[
              { step: 1, title: "Abra o app do banco", desc: "Acesse a área Pix do seu aplicativo" },
              { step: 2, title: "Escolha Pix Copia e Cola", desc: "Ou escaneie o QR Code acima" },
              { step: 3, title: "Cole o código copiado", desc: "Confirme os dados do pagamento" },
              { step: 4, title: "Pronto! Aprovação imediata", desc: "Você receberá a confirmação por email" },
            ].map((item) => (
              <div key={item.step} className="flex gap-3 items-start">
                <div className="flex-shrink-0 w-7 h-7 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold text-sm">
                  {item.step}
                </div>
                <div className="flex-1">
                  <p className="font-semibold text-sm">{item.title}</p>
                  <p className="text-xs text-muted-foreground">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Trust Badges */}
        <div className="bg-shopee-light rounded-2xl p-4 border border-primary/20">
          <div className="grid grid-cols-3 gap-3 text-center">
            <div className="flex flex-col items-center gap-1">
              <div className="bg-primary/10 rounded-full p-2">
                <ShieldCheck className="w-5 h-5 text-primary" />
              </div>
              <span className="text-xs font-medium text-foreground">Compra Segura</span>
            </div>
            <div className="flex flex-col items-center gap-1">
              <div className="bg-primary/10 rounded-full p-2">
                <Truck className="w-5 h-5 text-primary" />
              </div>
              <span className="text-xs font-medium text-foreground">Frete Grátis</span>
            </div>
            <div className="flex flex-col items-center gap-1">
              <div className="bg-primary/10 rounded-full p-2">
                <BadgeCheck className="w-5 h-5 text-primary" />
              </div>
              <span className="text-xs font-medium text-foreground">Garantia</span>
            </div>
          </div>
        </div>

        {/* Store Credibility */}
        <div className="bg-card rounded-2xl p-4 shadow-lg border">
          <div className="flex items-center gap-3 mb-3">
            <div className="bg-primary/10 rounded-full p-2">
              <Store className="w-5 h-5 text-primary" />
            </div>
            <div>
              <p className="font-bold text-sm">Atacado Premium</p>
              <div className="flex items-center gap-1">
                <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
                <span className="text-xs text-muted-foreground">4.9 • Loja Oficial</span>
              </div>
            </div>
            <div className="ml-auto">
              <span className="bg-shopee-light text-primary text-xs px-2 py-1 rounded-full font-medium">
                ✓ Verificada
              </span>
            </div>
          </div>
          
          <div className="grid grid-cols-3 gap-2 pt-3 border-t">
            <div className="text-center">
              <p className="font-bold text-primary text-lg">127k+</p>
              <p className="text-xs text-muted-foreground">Vendas</p>
            </div>
            <div className="text-center border-x">
              <p className="font-bold text-primary text-lg">98%</p>
              <p className="text-xs text-muted-foreground">Satisfação</p>
            </div>
            <div className="text-center">
              <p className="font-bold text-primary text-lg">89k+</p>
              <p className="text-xs text-muted-foreground">Avaliações</p>
            </div>
          </div>
        </div>

        {/* Payment Security Info */}
        <div className="bg-shopee-light rounded-2xl p-4 border border-primary/20">
          <div className="flex items-start gap-3">
            <Lock className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
            <div>
              <p className="font-semibold text-sm text-foreground">Pagamento 100% Seguro</p>
              <p className="text-xs text-muted-foreground mt-1">
                Seu pagamento Pix é processado pelo Banco Central do Brasil com criptografia de ponta a ponta. Nenhum dado bancário é armazenado.
              </p>
            </div>
          </div>
        </div>

        {/* Delivery Info */}
        <div className="bg-shopee-light rounded-2xl p-4 border border-primary/20">
          <div className="flex items-start gap-3">
            <Package className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
            <div>
              <p className="font-semibold text-sm text-foreground">Envio pela Shopee</p>
              <p className="text-xs text-muted-foreground mt-1">
                Assim que o pagamento for confirmado, seu pedido será separado e enviado em até 72h pela <span className="font-semibold text-primary">Shopee</span>. Você receberá o código de rastreamento por email.
              </p>
            </div>
          </div>
        </div>

        {/* Transaction ID */}
        {transactionId && (
          <div className="text-center py-2">
            <p className="text-xs text-muted-foreground">
              Código da transação: <span className="font-mono">{transactionId}</span>
            </p>
          </div>
        )}

        {/* Bottom spacing */}
        <div className="h-4" />
      </div>
    </div>
  );
};

export default PixPayment;
