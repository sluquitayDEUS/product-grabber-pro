import { Copy, Check, X } from "lucide-react";
import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

interface PixQRCodeModalProps {
  isOpen: boolean;
  onClose: () => void;
  qrCode: string;
  qrCodeUrl: string;
  expiresAt: string;
  amount: number;
}

const PixQRCodeModal = ({ isOpen, onClose, qrCode, qrCodeUrl, expiresAt, amount }: PixQRCodeModalProps) => {
  const [copied, setCopied] = useState(false);

  const handleCopyCode = async () => {
    try {
      await navigator.clipboard.writeText(qrCode);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  const formatCurrency = (value: number) => {
    return (value / 100).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
  };

  const formatExpiration = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-sm mx-auto">
        <DialogHeader>
          <DialogTitle className="text-center flex items-center justify-center gap-2">
            <span className="text-2xl">📱</span>
            Pague com Pix
          </DialogTitle>
        </DialogHeader>

        <div className="flex flex-col items-center gap-4 py-4">
          {/* QR Code */}
          <div className="bg-white p-4 rounded-lg border-2 border-primary">
            <img 
              src={qrCodeUrl} 
              alt="QR Code Pix" 
              className="w-48 h-48"
            />
          </div>

          {/* Amount */}
          <div className="text-center">
            <p className="text-sm text-muted-foreground">Valor a pagar</p>
            <p className="text-2xl font-bold text-primary">{formatCurrency(amount)}</p>
          </div>

          {/* Expiration */}
          <p className="text-xs text-muted-foreground">
            Código válido até {formatExpiration(expiresAt)}
          </p>

          {/* Copy Button */}
          <Button
            onClick={handleCopyCode}
            variant="outline"
            className="w-full gap-2"
          >
            {copied ? (
              <>
                <Check className="w-4 h-4 text-green-500" />
                Código copiado!
              </>
            ) : (
              <>
                <Copy className="w-4 h-4" />
                Copiar código Pix
              </>
            )}
          </Button>

          {/* Instructions */}
          <div className="text-xs text-muted-foreground text-center space-y-1">
            <p>1. Abra o app do seu banco</p>
            <p>2. Escolha pagar com Pix</p>
            <p>3. Escaneie o QR Code ou cole o código</p>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default PixQRCodeModal;
