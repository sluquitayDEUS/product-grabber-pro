import { Copy, Check, Clock, ShieldCheck, ArrowLeft, CheckCircle2 } from "lucide-react";
import { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { QRCodeSVG } from "qrcode.react";

const PixPayment = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [copied, setCopied] = useState(false);
  const [timeLeft, setTimeLeft] = useState(15 * 60); // 15 minutes in seconds

  // Get data from navigation state
  const { qrCode, amount, transactionId } = location.state || {};

  useEffect(() => {
    if (!qrCode) {
      navigate("/");
      return;
    }

    // Countdown timer
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          return 0;
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

  if (!qrCode) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted/30">
      {/* Header */}
      <header className="bg-primary text-primary-foreground py-4 px-4 flex items-center gap-3 sticky top-0 z-50">
        <button onClick={() => navigate("/")} className="p-1">
          <ArrowLeft className="w-5 h-5" />
        </button>
        <h1 className="text-lg font-semibold">Pagamento Pix</h1>
      </header>

      <div className="max-w-md mx-auto p-4 space-y-6">
        {/* Timer Card */}
        <div className={`rounded-2xl p-4 text-center ${isExpired ? "bg-destructive/10 border border-destructive/20" : "bg-primary/5 border border-primary/20"}`}>
          <div className="flex items-center justify-center gap-2 mb-1">
            <Clock className={`w-5 h-5 ${isExpired ? "text-destructive" : "text-primary"}`} />
            <span className={`text-sm font-medium ${isExpired ? "text-destructive" : "text-primary"}`}>
              {isExpired ? "Tempo expirado" : "Pague em até"}
            </span>
          </div>
          <p className={`text-3xl font-bold tabular-nums ${isExpired ? "text-destructive" : "text-primary"}`}>
            {formatTime(timeLeft)}
          </p>
        </div>

        {/* Amount Card */}
        <div className="bg-card rounded-2xl p-6 shadow-lg border">
          <p className="text-sm text-muted-foreground text-center">Valor a pagar</p>
          <p className="text-4xl font-bold text-primary text-center mt-1">
            {formatCurrency(amount)}
          </p>
        </div>

        {/* QR Code Card */}
        <div className="bg-card rounded-2xl p-6 shadow-lg border">
          <div className="flex justify-center mb-4">
            <div className="bg-white p-4 rounded-xl border-2 border-primary/20">
              <QRCodeSVG
                value={qrCode}
                size={200}
                level="H"
                includeMargin={false}
                className={isExpired ? "opacity-30" : ""}
              />
            </div>
          </div>

          {/* Copy Button */}
          <Button
            onClick={handleCopyCode}
            disabled={isExpired}
            className="w-full h-12 text-base font-semibold gap-2"
            variant={copied ? "outline" : "default"}
          >
            {copied ? (
              <>
                <Check className="w-5 h-5 text-green-500" />
                Código copiado!
              </>
            ) : (
              <>
                <Copy className="w-5 h-5" />
                Copiar código Pix
              </>
            )}
          </Button>
        </div>

        {/* Instructions Card */}
        <div className="bg-card rounded-2xl p-6 shadow-lg border">
          <h3 className="font-semibold text-lg mb-4 flex items-center gap-2">
            <span className="bg-primary/10 text-primary rounded-full p-1">
              <CheckCircle2 className="w-5 h-5" />
            </span>
            Como pagar com Pix Copia e Cola
          </h3>
          
          <div className="space-y-4">
            <div className="flex gap-3">
              <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold text-sm">
                1
              </div>
              <div>
                <p className="font-medium">Abra o app do seu banco</p>
                <p className="text-sm text-muted-foreground">
                  Acesse a área Pix no aplicativo do seu banco ou carteira digital
                </p>
              </div>
            </div>

            <div className="flex gap-3">
              <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold text-sm">
                2
              </div>
              <div>
                <p className="font-medium">Escolha "Pix Copia e Cola"</p>
                <p className="text-sm text-muted-foreground">
                  Procure a opção para pagar com código Pix ou QR Code
                </p>
              </div>
            </div>

            <div className="flex gap-3">
              <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold text-sm">
                3
              </div>
              <div>
                <p className="font-medium">Cole o código ou escaneie</p>
                <p className="text-sm text-muted-foreground">
                  Cole o código copiado acima ou escaneie o QR Code
                </p>
              </div>
            </div>

            <div className="flex gap-3">
              <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold text-sm">
                4
              </div>
              <div>
                <p className="font-medium">Confirme e pronto!</p>
                <p className="text-sm text-muted-foreground">
                  Verifique os dados e confirme o pagamento
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Security Badge */}
        <div className="flex items-center justify-center gap-2 text-muted-foreground py-4">
          <ShieldCheck className="w-5 h-5 text-green-600" />
          <span className="text-sm">Pagamento 100% seguro via Pix</span>
        </div>

        {/* Transaction ID */}
        {transactionId && (
          <p className="text-xs text-center text-muted-foreground">
            ID da transação: {transactionId}
          </p>
        )}
      </div>
    </div>
  );
};

export default PixPayment;
