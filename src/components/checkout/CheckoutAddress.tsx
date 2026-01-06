import { MapPin, ChevronRight, AlertCircle } from "lucide-react";
import { useState } from "react";
import { useCart } from "@/contexts/CartContext";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

const brazilianStates = [
  "Acre", "Alagoas", "Amapá", "Amazonas", "Bahia", "Ceará", "Distrito Federal",
  "Espírito Santo", "Goiás", "Maranhão", "Mato Grosso", "Mato Grosso do Sul",
  "Minas Gerais", "Pará", "Paraíba", "Paraná", "Pernambuco", "Piauí",
  "Rio de Janeiro", "Rio Grande do Norte", "Rio Grande do Sul", "Rondônia",
  "Roraima", "Santa Catarina", "São Paulo", "Sergipe", "Tocantins"
];

const CheckoutAddress = () => {
  const { location, setLocation } = useCart();
  const [sheetOpen, setSheetOpen] = useState(false);
  const [errors, setErrors] = useState<Record<string, boolean>>({});
  const [addressData, setAddressData] = useState({
    name: "",
    cpf: "",
    phone: "",
    street: "",
    number: "",
    complement: "",
    neighborhood: "",
    city: location.city,
    state: location.state,
    cep: ""
  });

  const validateCPF = (cpf: string) => {
    const cleaned = cpf.replace(/\D/g, '');
    return cleaned.length === 11;
  };

  const formatCPF = (value: string) => {
    const cleaned = value.replace(/\D/g, '');
    if (cleaned.length <= 3) return cleaned;
    if (cleaned.length <= 6) return `${cleaned.slice(0, 3)}.${cleaned.slice(3)}`;
    if (cleaned.length <= 9) return `${cleaned.slice(0, 3)}.${cleaned.slice(3, 6)}.${cleaned.slice(6)}`;
    return `${cleaned.slice(0, 3)}.${cleaned.slice(3, 6)}.${cleaned.slice(6, 9)}-${cleaned.slice(9, 11)}`;
  };

  const handleSave = () => {
    const requiredFields = ['name', 'cpf', 'phone', 'street', 'number', 'neighborhood', 'city', 'state', 'cep'];
    const newErrors: Record<string, boolean> = {};
    
    requiredFields.forEach(field => {
      if (!addressData[field as keyof typeof addressData].trim()) {
        newErrors[field] = true;
      }
    });

    if (addressData.cpf && !validateCPF(addressData.cpf)) {
      newErrors.cpf = true;
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setErrors({});
    setLocation({ city: addressData.city, state: addressData.state });
    setSheetOpen(false);
  };

  const isAddressFilled = addressData.name && addressData.street && addressData.cep;

  return (
    <div className="bg-card">
      {/* Orange top border decoration */}
      <div className="h-3 bg-gradient-to-r from-primary via-orange-300 to-primary opacity-30" 
           style={{ backgroundImage: 'repeating-linear-gradient(90deg, #EE4D2D 0px, #EE4D2D 10px, #F8B500 10px, #F8B500 20px)' }} />
      
      <Sheet open={sheetOpen} onOpenChange={setSheetOpen}>
        <SheetTrigger asChild>
          <button className="w-full p-3 flex items-start gap-3">
            <MapPin className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
            <div className="flex-1 text-left">
              {isAddressFilled ? (
                <>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-medium text-sm text-foreground">{addressData.name}</span>
                    <span className="text-muted-foreground text-sm">{addressData.phone}</span>
                  </div>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {addressData.street}, {addressData.number} {addressData.complement && `- ${addressData.complement}`}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {addressData.neighborhood}, {addressData.city} - {addressData.state}, {addressData.cep}
                  </p>
                </>
              ) : (
                <div className="flex items-center gap-2 text-primary">
                  <AlertCircle className="w-4 h-4" />
                  <span className="text-sm font-medium">Adicionar endereço de entrega</span>
                </div>
              )}
            </div>
            <ChevronRight className="w-5 h-5 text-muted-foreground flex-shrink-0 mt-2" />
          </button>
        </SheetTrigger>
        <SheetContent side="bottom" className="rounded-t-xl h-[85vh] overflow-y-auto">
          <SheetHeader>
            <SheetTitle>Endereço de Entrega</SheetTitle>
          </SheetHeader>
          <div className="mt-4 space-y-4">
            <div>
              <Label htmlFor="name">Nome Completo *</Label>
              <Input
                id="name"
                value={addressData.name}
                onChange={(e) => {
                  setAddressData({ ...addressData, name: e.target.value });
                  setErrors({ ...errors, name: false });
                }}
                placeholder="Digite seu nome completo"
                className={errors.name ? 'border-destructive' : ''}
              />
              {errors.name && <p className="text-xs text-destructive mt-1">Nome é obrigatório</p>}
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <Label htmlFor="cpf">CPF *</Label>
                <Input
                  id="cpf"
                  value={addressData.cpf}
                  onChange={(e) => {
                    setAddressData({ ...addressData, cpf: formatCPF(e.target.value) });
                    setErrors({ ...errors, cpf: false });
                  }}
                  placeholder="000.000.000-00"
                  maxLength={14}
                  className={errors.cpf ? 'border-destructive' : ''}
                />
                {errors.cpf && <p className="text-xs text-destructive mt-1">CPF inválido</p>}
              </div>
              <div>
                <Label htmlFor="phone">Telefone *</Label>
                <Input
                  id="phone"
                  value={addressData.phone}
                  onChange={(e) => {
                    setAddressData({ ...addressData, phone: e.target.value });
                    setErrors({ ...errors, phone: false });
                  }}
                  placeholder="(00) 00000-0000"
                  className={errors.phone ? 'border-destructive' : ''}
                />
                {errors.phone && <p className="text-xs text-destructive mt-1">Telefone é obrigatório</p>}
              </div>
            </div>
            <div>
              <Label htmlFor="cep">CEP *</Label>
              <Input
                id="cep"
                value={addressData.cep}
                onChange={(e) => {
                  setAddressData({ ...addressData, cep: e.target.value });
                  setErrors({ ...errors, cep: false });
                }}
                placeholder="00000-000"
                className={errors.cep ? 'border-destructive' : ''}
              />
              {errors.cep && <p className="text-xs text-destructive mt-1">CEP é obrigatório</p>}
            </div>
            <div className="grid grid-cols-3 gap-3">
              <div className="col-span-2">
                <Label htmlFor="street">Rua *</Label>
                <Input
                  id="street"
                  value={addressData.street}
                  onChange={(e) => {
                    setAddressData({ ...addressData, street: e.target.value });
                    setErrors({ ...errors, street: false });
                  }}
                  placeholder="Nome da rua"
                  className={errors.street ? 'border-destructive' : ''}
                />
                {errors.street && <p className="text-xs text-destructive mt-1">Rua é obrigatória</p>}
              </div>
              <div>
                <Label htmlFor="number">Número *</Label>
                <Input
                  id="number"
                  value={addressData.number}
                  onChange={(e) => {
                    setAddressData({ ...addressData, number: e.target.value });
                    setErrors({ ...errors, number: false });
                  }}
                  placeholder="Nº"
                  className={errors.number ? 'border-destructive' : ''}
                />
                {errors.number && <p className="text-xs text-destructive mt-1">Obrigatório</p>}
              </div>
            </div>
            <div>
              <Label htmlFor="complement">Complemento</Label>
              <Input
                id="complement"
                value={addressData.complement}
                onChange={(e) => setAddressData({ ...addressData, complement: e.target.value })}
                placeholder="Apto, bloco, etc. (opcional)"
              />
            </div>
            <div>
              <Label htmlFor="neighborhood">Bairro *</Label>
              <Input
                id="neighborhood"
                value={addressData.neighborhood}
                onChange={(e) => {
                  setAddressData({ ...addressData, neighborhood: e.target.value });
                  setErrors({ ...errors, neighborhood: false });
                }}
                placeholder="Nome do bairro"
                className={errors.neighborhood ? 'border-destructive' : ''}
              />
              {errors.neighborhood && <p className="text-xs text-destructive mt-1">Bairro é obrigatório</p>}
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <Label htmlFor="city">Cidade *</Label>
                <Input
                  id="city"
                  value={addressData.city}
                  onChange={(e) => {
                    setAddressData({ ...addressData, city: e.target.value });
                    setErrors({ ...errors, city: false });
                  }}
                  placeholder="Nome da cidade"
                  className={errors.city ? 'border-destructive' : ''}
                />
                {errors.city && <p className="text-xs text-destructive mt-1">Cidade é obrigatória</p>}
              </div>
              <div>
                <Label htmlFor="state">Estado *</Label>
                <select
                  id="state"
                  value={addressData.state}
                  onChange={(e) => {
                    setAddressData({ ...addressData, state: e.target.value });
                    setErrors({ ...errors, state: false });
                  }}
                  className={`w-full h-10 px-3 border rounded-md text-sm bg-background ${errors.state ? 'border-destructive' : 'border-input'}`}
                >
                  <option value="">Selecione</option>
                  {brazilianStates.map((state) => (
                    <option key={state} value={state}>
                      {state}
                    </option>
                  ))}
                </select>
                {errors.state && <p className="text-xs text-destructive mt-1">Estado é obrigatório</p>}
              </div>
            </div>
            <button
              onClick={handleSave}
              className="w-full bg-primary text-primary-foreground py-3 rounded-lg font-medium mt-4"
            >
              Salvar Endereço
            </button>
          </div>
        </SheetContent>
      </Sheet>

      {/* Orange bottom border decoration */}
      <div className="h-3 bg-gradient-to-r from-primary via-orange-300 to-primary opacity-30" 
           style={{ backgroundImage: 'repeating-linear-gradient(90deg, #EE4D2D 0px, #EE4D2D 10px, #F8B500 10px, #F8B500 20px)' }} />
    </div>
  );
};

export default CheckoutAddress;
