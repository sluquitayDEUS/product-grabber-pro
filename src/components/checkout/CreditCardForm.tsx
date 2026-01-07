import { useState } from "react";
import { CreditCard } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface CardData {
  number: string;
  holderName: string;
  expMonth: number;
  expYear: number;
  cvv: string;
}

interface CreditCardFormProps {
  onCardDataChange: (data: CardData | null) => void;
  installments: number;
  onInstallmentsChange: (installments: number) => void;
  totalAmount: number; // in cents
}

const CreditCardForm = ({ 
  onCardDataChange, 
  installments, 
  onInstallmentsChange,
  totalAmount 
}: CreditCardFormProps) => {
  const [cardNumber, setCardNumber] = useState("");
  const [holderName, setHolderName] = useState("");
  const [expiry, setExpiry] = useState("");
  const [cvv, setCvv] = useState("");

  const formatCardNumber = (value: string) => {
    const digits = value.replace(/\D/g, "").slice(0, 16);
    return digits.replace(/(.{4})/g, "$1 ").trim();
  };

  const formatExpiry = (value: string) => {
    const digits = value.replace(/\D/g, "").slice(0, 4);
    if (digits.length >= 2) {
      return `${digits.slice(0, 2)}/${digits.slice(2)}`;
    }
    return digits;
  };

  const parseCardData = (): CardData | null => {
    const number = cardNumber.replace(/\s/g, "");
    const [monthStr, yearStr] = expiry.split("/");
    const expMonth = parseInt(monthStr, 10);
    const expYear = parseInt(`20${yearStr}`, 10);

    if (
      number.length === 16 &&
      holderName.trim().length >= 3 &&
      expMonth >= 1 && expMonth <= 12 &&
      expYear >= new Date().getFullYear() &&
      cvv.length >= 3
    ) {
      return {
        number,
        holderName: holderName.trim(),
        expMonth,
        expYear,
        cvv,
      };
    }
    return null;
  };

  const handleChange = () => {
    setTimeout(() => {
      const data = parseCardData();
      onCardDataChange(data);
    }, 0);
  };

  const formatCurrency = (value: number) => {
    return (value / 100).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
  };

  const INTEREST_RATE = 0.06; // 6% interest
  
  const installmentOptions = Array.from({ length: 12 }, (_, i) => {
    const num = i + 1;
    // 1x has no interest, 2x+ has 6% interest
    const hasInterest = num > 1;
    const totalWithInterest = hasInterest ? totalAmount * (1 + INTEREST_RATE) : totalAmount;
    const value = totalWithInterest / num;
    return {
      value: num,
      label: hasInterest 
        ? `${num}x de ${formatCurrency(value)} (com juros)`
        : `${num}x de ${formatCurrency(value)} sem juros`,
    };
  });

  return (
    <div className="bg-card mt-2">
      <div className="px-3 py-3 border-b border-border flex items-center gap-2">
        <CreditCard className="w-4 h-4 text-primary" />
        <h3 className="text-sm font-medium text-foreground">Dados do Cartão</h3>
      </div>

      <div className="p-3 space-y-3">
        {/* Card Number */}
        <div className="space-y-1">
          <Label htmlFor="cardNumber" className="text-xs text-muted-foreground">
            Número do Cartão
          </Label>
          <Input
            id="cardNumber"
            type="text"
            inputMode="numeric"
            placeholder="0000 0000 0000 0000"
            value={cardNumber}
            onChange={(e) => {
              setCardNumber(formatCardNumber(e.target.value));
              handleChange();
            }}
            className="text-sm"
          />
        </div>

        {/* Holder Name */}
        <div className="space-y-1">
          <Label htmlFor="holderName" className="text-xs text-muted-foreground">
            Nome no Cartão
          </Label>
          <Input
            id="holderName"
            type="text"
            placeholder="NOME COMO ESTÁ NO CARTÃO"
            value={holderName}
            onChange={(e) => {
              setHolderName(e.target.value.toUpperCase());
              handleChange();
            }}
            className="text-sm uppercase"
          />
        </div>

        {/* Expiry and CVV */}
        <div className="grid grid-cols-2 gap-3">
          <div className="space-y-1">
            <Label htmlFor="expiry" className="text-xs text-muted-foreground">
              Validade
            </Label>
            <Input
              id="expiry"
              type="text"
              inputMode="numeric"
              placeholder="MM/AA"
              value={expiry}
              onChange={(e) => {
                setExpiry(formatExpiry(e.target.value));
                handleChange();
              }}
              className="text-sm"
            />
          </div>
          <div className="space-y-1">
            <Label htmlFor="cvv" className="text-xs text-muted-foreground">
              CVV
            </Label>
            <Input
              id="cvv"
              type="text"
              inputMode="numeric"
              placeholder="000"
              maxLength={4}
              value={cvv}
              onChange={(e) => {
                setCvv(e.target.value.replace(/\D/g, "").slice(0, 4));
                handleChange();
              }}
              className="text-sm"
            />
          </div>
        </div>

        {/* Installments */}
        <div className="space-y-1">
          <Label htmlFor="installments" className="text-xs text-muted-foreground">
            Parcelas
          </Label>
          <Select
            value={installments.toString()}
            onValueChange={(val) => onInstallmentsChange(parseInt(val, 10))}
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {installmentOptions.map((opt) => (
                <SelectItem key={opt.value} value={opt.value.toString()}>
                  {opt.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>
    </div>
  );
};

export default CreditCardForm;
