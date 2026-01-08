import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useState, useEffect } from "react";
import { MapPin, Loader2, AlertCircle, Truck, Zap } from "lucide-react";
import { addDays, format } from "date-fns";
import { ptBR } from "date-fns/locale";

interface AddressModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  currentCity: string;
  currentState: string;
  onSave: (city: string, state: string) => void;
}

interface CepData {
  cep: string;
  logradouro: string;
  bairro: string;
  localidade: string;
  uf: string;
  erro?: boolean;
}

const AddressModal = ({ open, onOpenChange, currentCity, currentState, onSave }: AddressModalProps) => {
  const [cep, setCep] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [cepData, setCepData] = useState<CepData | null>(null);

  // Reset state when modal opens
  useEffect(() => {
    if (open) {
      setCep("");
      setError("");
      setCepData(null);
    }
  }, [open]);

  const formatCep = (value: string) => {
    const numbers = value.replace(/\D/g, "");
    if (numbers.length <= 5) return numbers;
    return `${numbers.slice(0, 5)}-${numbers.slice(5, 8)}`;
  };

  const handleCepChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatCep(e.target.value);
    setCep(formatted);
    setError("");
    setCepData(null);
  };

  const searchCep = async () => {
    const cleanCep = cep.replace(/\D/g, "");
    
    if (cleanCep.length !== 8) {
      setError("CEP deve ter 8 dígitos");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const response = await fetch(`https://viacep.com.br/ws/${cleanCep}/json/`);
      const data: CepData = await response.json();

      if (data.erro) {
        setError("CEP não encontrado. Verifique e tente novamente.");
        setCepData(null);
      } else {
        setCepData(data);
      }
    } catch (err) {
      setError("Erro ao buscar CEP. Tente novamente.");
      setCepData(null);
    } finally {
      setLoading(false);
    }
  };

  const handleConfirm = () => {
    if (cepData) {
      onSave(cepData.localidade, cepData.uf);
      onOpenChange(false);
    }
  };

  // Calculate delivery dates
  const today = new Date();
  const standardMinDate = addDays(today, 3);
  const standardMaxDate = addDays(today, 9);
  const expressMinDate = addDays(today, 3);
  const expressMaxDate = addDays(today, 5);

  const formatDate = (date: Date) => format(date, "d 'de' MMM", { locale: ptBR });

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-[90vw] sm:max-w-md bg-card border-border">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-foreground">
            <MapPin className="w-5 h-5 text-primary" />
            Alterar Endereço de Entrega
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4 pt-2">
          {/* CEP Input */}
          <div>
            <label className="text-sm font-medium text-foreground mb-1.5 block">
              Digite seu CEP
            </label>
            <div className="flex gap-2">
              <Input
                value={cep}
                onChange={handleCepChange}
                placeholder="00000-000"
                maxLength={9}
                className="bg-background border-border flex-1"
              />
              <Button
                onClick={searchCep}
                disabled={loading || cep.replace(/\D/g, "").length !== 8}
                className="bg-primary hover:bg-primary/90"
              >
                {loading ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  "Buscar"
                )}
              </Button>
            </div>
            {error && (
              <div className="flex items-center gap-1.5 mt-2 text-destructive">
                <AlertCircle className="w-4 h-4" />
                <span className="text-xs">{error}</span>
              </div>
            )}
          </div>

          {/* CEP Result + Shipping Options */}
          {cepData && (
            <div className="space-y-4 animate-in fade-in slide-in-from-top-2 duration-200">
              {/* Address Found */}
              <div className="bg-shopee-light p-3 rounded-lg border border-primary/30">
                <p className="text-sm font-medium text-foreground">
                  {cepData.localidade}, {cepData.uf}
                </p>
                {cepData.logradouro && (
                  <p className="text-xs text-muted-foreground mt-1">
                    {cepData.logradouro}, {cepData.bairro}
                  </p>
                )}
              </div>

              {/* Delivery Options */}
              <div className="space-y-3">
                <p className="text-sm font-medium text-foreground">Opções de entrega:</p>
                
                {/* Standard Shipping */}
                <div className="flex items-start gap-3 p-3 bg-secondary rounded-lg">
                  <Truck className="w-5 h-5 text-shopee-success mt-0.5" />
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-medium text-shopee-success">Frete Grátis</span>
                      <span className="bg-shopee-light text-primary text-[10px] px-1.5 py-0.5 rounded font-medium">
                        Shopee
                      </span>
                    </div>
                    <p className="text-xs text-foreground mt-1">
                      Receba entre <span className="font-medium">{formatDate(standardMinDate)} - {formatDate(standardMaxDate)}</span>
                    </p>
                  </div>
                </div>

                {/* Express Shipping */}
                <div className="flex items-start gap-3 p-3 bg-secondary rounded-lg">
                  <Zap className="w-5 h-5 text-amber-500 mt-0.5" />
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-medium text-amber-500">Frete Expresso</span>
                      <span className="bg-amber-100 text-amber-600 text-[10px] px-1.5 py-0.5 rounded font-medium">
                        Rápido
                      </span>
                    </div>
                    <p className="text-xs text-foreground mt-1">
                      Receba entre <span className="font-medium">{formatDate(expressMinDate)} - {formatDate(expressMaxDate)}</span>
                    </p>
                    <p className="text-xs text-muted-foreground mt-0.5">R$ 17,90</p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex gap-3 pt-2">
            <Button
              variant="outline"
              className="flex-1"
              onClick={() => onOpenChange(false)}
            >
              Cancelar
            </Button>
            <Button
              className="flex-1 bg-primary hover:bg-primary/90"
              onClick={handleConfirm}
              disabled={!cepData}
            >
              Confirmar
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default AddressModal;
