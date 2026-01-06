import { User, Mail, Phone, CreditCard } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useCart } from "@/contexts/CartContext";

const CheckoutCustomer = () => {
  const { customer, setCustomer } = useCart();

  const formatCPF = (value: string) => {
    const digits = value.replace(/\D/g, "").slice(0, 11);
    return digits
      .replace(/(\d{3})(\d)/, "$1.$2")
      .replace(/(\d{3})(\d)/, "$1.$2")
      .replace(/(\d{3})(\d{1,2})$/, "$1-$2");
  };

  const formatPhone = (value: string) => {
    const digits = value.replace(/\D/g, "").slice(0, 11);
    if (digits.length <= 10) {
      return digits
        .replace(/(\d{2})(\d)/, "($1) $2")
        .replace(/(\d{4})(\d)/, "$1-$2");
    }
    return digits
      .replace(/(\d{2})(\d)/, "($1) $2")
      .replace(/(\d{5})(\d)/, "$1-$2");
  };

  return (
    <div className="bg-card mt-2">
      <div className="px-3 py-3 border-b border-border flex items-center gap-2">
        <User className="w-4 h-4 text-primary" />
        <h3 className="text-sm font-medium text-foreground">Seus Dados</h3>
      </div>

      <div className="p-3 space-y-3">
        {/* Name */}
        <div className="space-y-1">
          <Label htmlFor="customerName" className="text-xs text-muted-foreground">
            Nome Completo *
          </Label>
          <div className="relative">
            <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              id="customerName"
              type="text"
              placeholder="Seu nome completo"
              value={customer.name}
              onChange={(e) => setCustomer({ ...customer, name: e.target.value })}
              className="pl-9 text-sm"
            />
          </div>
        </div>

        {/* Email */}
        <div className="space-y-1">
          <Label htmlFor="customerEmail" className="text-xs text-muted-foreground">
            E-mail *
          </Label>
          <div className="relative">
            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              id="customerEmail"
              type="email"
              placeholder="seu@email.com"
              value={customer.email}
              onChange={(e) => setCustomer({ ...customer, email: e.target.value })}
              className="pl-9 text-sm"
            />
          </div>
        </div>

        {/* CPF */}
        <div className="space-y-1">
          <Label htmlFor="customerDocument" className="text-xs text-muted-foreground">
            CPF *
          </Label>
          <div className="relative">
            <CreditCard className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              id="customerDocument"
              type="text"
              inputMode="numeric"
              placeholder="000.000.000-00"
              value={customer.document}
              onChange={(e) => setCustomer({ ...customer, document: formatCPF(e.target.value) })}
              className="pl-9 text-sm"
            />
          </div>
        </div>

        {/* Phone */}
        <div className="space-y-1">
          <Label htmlFor="customerPhone" className="text-xs text-muted-foreground">
            Telefone
          </Label>
          <div className="relative">
            <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              id="customerPhone"
              type="tel"
              inputMode="tel"
              placeholder="(00) 00000-0000"
              value={customer.phone}
              onChange={(e) => setCustomer({ ...customer, phone: formatPhone(e.target.value) })}
              className="pl-9 text-sm"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default CheckoutCustomer;
