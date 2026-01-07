import { MapPin, ChevronRight, AlertCircle, Loader2 } from "lucide-react";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useCart } from "@/contexts/CartContext";
import { validateCPF as validateCPFAlgorithm } from "@/lib/cpfValidator";
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
  "AC",
  "AL",
  "AP",
  "AM",
  "BA",
  "CE",
  "DF",
  "ES",
  "GO",
  "MA",
  "MT",
  "MS",
  "MG",
  "PA",
  "PB",
  "PR",
  "PE",
  "PI",
  "RJ",
  "RN",
  "RS",
  "RO",
  "RR",
  "SC",
  "SP",
  "SE",
  "TO",
];

type Draft = {
  name: string;
  email: string;
  cpf: string;
  phone: string;
  street: string;
  number: string;
  complement: string;
  neighborhood: string;
  city: string;
  state: string;
  cep: string;
};

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

const formatCEP = (value: string) => {
  const digits = value.replace(/\D/g, "").slice(0, 8);
  if (digits.length <= 5) return digits;
  return `${digits.slice(0, 5)}-${digits.slice(5)}`;
};

const validateCPFFormat = (cpf: string) => cpf.replace(/\D/g, "").length === 11;
const validateCEP = (cep: string) => cep.replace(/\D/g, "").length === 8;

const CheckoutAddress = () => {
  const {
    location,
    setLocation,
    customer,
    setCustomer,
    shippingAddress,
    setShippingAddress,
  } = useCart();

  const [sheetOpen, setSheetOpen] = useState(false);
  const [errors, setErrors] = useState<Record<string, boolean>>({});
  const [loadingCep, setLoadingCep] = useState(false);
  const sheetContentRef = useRef<HTMLDivElement>(null);

  const initialDraft: Draft = useMemo(
    () => ({
      name: customer.name ?? "",
      email: customer.email ?? "",
      cpf: customer.document ?? "",
      phone: customer.phone ?? "",
      street: shippingAddress.street ?? "",
      number: shippingAddress.number ?? "",
      complement: shippingAddress.complement ?? "",
      neighborhood: shippingAddress.neighborhood ?? "",
      city: shippingAddress.city || location.city,
      state: shippingAddress.state || location.state,
      cep: shippingAddress.zipcode ?? "",
    }),
    [customer, shippingAddress, location]
  );

  const [draft, setDraft] = useState<Draft>(initialDraft);

  // Reset draft and scroll to top when sheet opens
  useEffect(() => {
    if (sheetOpen) {
      setDraft(initialDraft);
      // Scroll to top after a small delay to ensure content is rendered
      setTimeout(() => {
        sheetContentRef.current?.scrollTo({ top: 0 });
      }, 50);
    }
  }, [sheetOpen, initialDraft]);

  const [cepNotFound, setCepNotFound] = useState(false);

  // Fetch address from ViaCEP when CEP is complete
  const fetchAddressFromCep = useCallback(async (cep: string) => {
    const digits = cep.replace(/\D/g, "");
    if (digits.length !== 8) return;

    setLoadingCep(true);
    setCepNotFound(false);
    try {
      const response = await fetch(`https://viacep.com.br/ws/${digits}/json/`);
      const data = await response.json();

      if (data.erro) {
        // CEP not found
        setCepNotFound(true);
        setErrors((prev) => ({ ...prev, cep: true }));
      } else {
        setCepNotFound(false);
        setDraft((prev) => ({
          ...prev,
          street: data.logradouro || prev.street,
          neighborhood: data.bairro || prev.neighborhood,
          city: data.localidade || prev.city,
          state: data.uf || prev.state,
        }));
        setErrors((prev) => ({
          ...prev,
          cep: false,
          street: false,
          neighborhood: false,
          city: false,
          state: false,
        }));
      }
    } catch (err) {
      console.error("ViaCEP error:", err);
    } finally {
      setLoadingCep(false);
    }
  }, []);

  const handleCepChange = (value: string) => {
    const formatted = formatCEP(value);
    setDraft({ ...draft, cep: formatted });
    setErrors({ ...errors, cep: false });
    setCepNotFound(false);

    // Auto-fetch when CEP is complete
    if (formatted.replace(/\D/g, "").length === 8) {
      fetchAddressFromCep(formatted);
    }
  };

  const validateEmail = (email: string) =>
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

  const handleSave = () => {
    const requiredFields: Array<keyof Draft> = [
      "name",
      "email",
      "cpf",
      "phone",
      "street",
      "number",
      "neighborhood",
      "city",
      "state",
      "cep",
    ];

    const newErrors: Record<string, boolean> = {};

    requiredFields.forEach((field) => {
      if (!draft[field].trim()) newErrors[field] = true;
    });

    if (draft.cpf && !validateCPFAlgorithm(draft.cpf)) newErrors.cpf = true;
    if (draft.email && !validateEmail(draft.email)) newErrors.email = true;
    if (draft.cep && !validateCEP(draft.cep)) newErrors.cep = true;

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setErrors({});

    setCustomer({
      name: draft.name,
      email: draft.email,
      document: draft.cpf,
      phone: draft.phone,
    });

    setShippingAddress({
      street: draft.street,
      number: draft.number,
      complement: draft.complement,
      neighborhood: draft.neighborhood,
      city: draft.city,
      state: draft.state,
      zipcode: draft.cep,
    });

    setLocation({ city: draft.city, state: draft.state });
    setSheetOpen(false);
  };

  const isAddressFilled =
    draft.name &&
    draft.email &&
    validateCPFAlgorithm(draft.cpf) &&
    draft.street &&
    validateCEP(draft.cep) &&
    draft.city &&
    draft.state;

  return (
    <div className="bg-card">
      <div
        className="h-3 bg-gradient-to-r from-primary via-orange-300 to-primary opacity-30"
        style={{
          backgroundImage:
            "repeating-linear-gradient(90deg, #EE4D2D 0px, #EE4D2D 10px, #F8B500 10px, #F8B500 20px)",
        }}
      />

      <Sheet open={sheetOpen} onOpenChange={setSheetOpen}>
        <SheetTrigger asChild>
          <button className="w-full p-3 flex items-start gap-3">
            <MapPin className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
            <div className="flex-1 text-left">
              {isAddressFilled ? (
                <>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-medium text-sm text-foreground">
                      {draft.name}
                    </span>
                    <span className="text-muted-foreground text-sm">
                      {draft.phone}
                    </span>
                  </div>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {draft.street}, {draft.number}{" "}
                    {draft.complement && `- ${draft.complement}`}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {draft.neighborhood}, {draft.city} - {draft.state}, {draft.cep}
                  </p>
                </>
              ) : (
                <div className="flex items-center gap-2 text-primary">
                  <AlertCircle className="w-4 h-4" />
                  <span className="text-sm font-medium">
                    Adicionar endereço de entrega
                  </span>
                </div>
              )}
            </div>
            <ChevronRight className="w-5 h-5 text-muted-foreground flex-shrink-0 mt-2" />
          </button>
        </SheetTrigger>

        <SheetContent ref={sheetContentRef} side="bottom" className="rounded-t-xl h-[85vh] overflow-y-auto">
          <SheetHeader>
            <SheetTitle>Dados + Endereço</SheetTitle>
          </SheetHeader>

          <div className="mt-4 space-y-4">
            <div>
              <Label htmlFor="name">Nome Completo *</Label>
              <Input
                id="name"
                value={draft.name}
                onChange={(e) => {
                  setDraft({ ...draft, name: e.target.value });
                  setErrors({ ...errors, name: false });
                }}
                placeholder="Digite seu nome completo"
                className={errors.name ? "border-destructive" : ""}
              />
              {errors.name && (
                <p className="text-xs text-destructive mt-1">Nome é obrigatório</p>
              )}
            </div>

            <div>
              <Label htmlFor="email">E-mail *</Label>
              <Input
                id="email"
                type="email"
                value={draft.email}
                onChange={(e) => {
                  setDraft({ ...draft, email: e.target.value });
                  setErrors({ ...errors, email: false });
                }}
                placeholder="seu@email.com"
                className={errors.email ? "border-destructive" : ""}
              />
              {errors.email && (
                <p className="text-xs text-destructive mt-1">E-mail inválido</p>
              )}
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <Label htmlFor="cpf">CPF *</Label>
                <Input
                  id="cpf"
                  value={draft.cpf}
                  onChange={(e) => {
                    const formatted = formatCPF(e.target.value);
                    setDraft({ ...draft, cpf: formatted });
                    // Validate in real-time when CPF is complete
                    const digits = formatted.replace(/\D/g, "");
                    if (digits.length === 11) {
                      setErrors((prev) => ({
                        ...prev,
                        cpf: !validateCPFAlgorithm(formatted),
                      }));
                    } else {
                      setErrors((prev) => ({ ...prev, cpf: false }));
                    }
                  }}
                  placeholder="000.000.000-00"
                  maxLength={14}
                  className={errors.cpf ? "border-destructive" : ""}
                />
                {errors.cpf && (
                  <p className="text-xs text-destructive mt-1">
                    CPF inválido. Verifique os números digitados.
                  </p>
                )}
              </div>

              <div>
                <Label htmlFor="phone">Telefone *</Label>
                <Input
                  id="phone"
                  value={draft.phone}
                  onChange={(e) => {
                    setDraft({ ...draft, phone: formatPhone(e.target.value) });
                    setErrors({ ...errors, phone: false });
                  }}
                  placeholder="(00) 00000-0000"
                  className={errors.phone ? "border-destructive" : ""}
                />
                {errors.phone && (
                  <p className="text-xs text-destructive mt-1">
                    Telefone é obrigatório
                  </p>
                )}
              </div>
            </div>

            <div>
              <Label htmlFor="cep">CEP *</Label>
              <div className="relative">
                <Input
                  id="cep"
                  value={draft.cep}
                  onChange={(e) => handleCepChange(e.target.value)}
                  placeholder="00000-000"
                  className={errors.cep ? "border-destructive" : ""}
                />
                {loadingCep && (
                  <Loader2 className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 animate-spin text-muted-foreground" />
                )}
              </div>
              {errors.cep && (
                <p className="text-xs text-destructive mt-1">
                  {cepNotFound ? "CEP não encontrado. Verifique o número digitado." : "CEP inválido"}
                </p>
              )}
            </div>

            <div className="grid grid-cols-3 gap-3">
              <div className="col-span-2">
                <Label htmlFor="street">Rua *</Label>
                <Input
                  id="street"
                  value={draft.street}
                  onChange={(e) => {
                    setDraft({ ...draft, street: e.target.value });
                    setErrors({ ...errors, street: false });
                  }}
                  placeholder="Nome da rua"
                  className={errors.street ? "border-destructive" : ""}
                />
                {errors.street && (
                  <p className="text-xs text-destructive mt-1">Rua é obrigatória</p>
                )}
              </div>
              <div>
                <Label htmlFor="number">Número *</Label>
                <Input
                  id="number"
                  value={draft.number}
                  onChange={(e) => {
                    setDraft({ ...draft, number: e.target.value });
                    setErrors({ ...errors, number: false });
                  }}
                  placeholder="Nº"
                  className={errors.number ? "border-destructive" : ""}
                />
                {errors.number && (
                  <p className="text-xs text-destructive mt-1">Obrigatório</p>
                )}
              </div>
            </div>

            <div>
              <Label htmlFor="complement">Complemento</Label>
              <Input
                id="complement"
                value={draft.complement}
                onChange={(e) => setDraft({ ...draft, complement: e.target.value })}
                placeholder="Apto, bloco, etc. (opcional)"
              />
            </div>

            <div>
              <Label htmlFor="neighborhood">Bairro *</Label>
              <Input
                id="neighborhood"
                value={draft.neighborhood}
                onChange={(e) => {
                  setDraft({ ...draft, neighborhood: e.target.value });
                  setErrors({ ...errors, neighborhood: false });
                }}
                placeholder="Nome do bairro"
                className={errors.neighborhood ? "border-destructive" : ""}
              />
              {errors.neighborhood && (
                <p className="text-xs text-destructive mt-1">Bairro é obrigatório</p>
              )}
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <Label htmlFor="city">Cidade *</Label>
                <Input
                  id="city"
                  value={draft.city}
                  onChange={(e) => {
                    setDraft({ ...draft, city: e.target.value });
                    setErrors({ ...errors, city: false });
                  }}
                  placeholder="Nome da cidade"
                  className={errors.city ? "border-destructive" : ""}
                />
                {errors.city && (
                  <p className="text-xs text-destructive mt-1">Cidade é obrigatória</p>
                )}
              </div>
              <div>
                <Label htmlFor="state">Estado *</Label>
                <select
                  id="state"
                  value={draft.state}
                  onChange={(e) => {
                    setDraft({ ...draft, state: e.target.value });
                    setErrors({ ...errors, state: false });
                  }}
                  className={`w-full h-10 px-3 border rounded-md text-sm bg-background ${
                    errors.state ? "border-destructive" : "border-input"
                  }`}
                >
                  <option value="">Selecione</option>
                  {brazilianStates.map((uf) => (
                    <option key={uf} value={uf}>
                      {uf}
                    </option>
                  ))}
                </select>
                {errors.state && (
                  <p className="text-xs text-destructive mt-1">Estado é obrigatório</p>
                )}
              </div>
            </div>

            <button
              onClick={handleSave}
              className="w-full bg-primary text-primary-foreground py-3 rounded-lg font-medium mt-4"
            >
              Salvar
            </button>
          </div>
        </SheetContent>
      </Sheet>

      <div
        className="h-3 bg-gradient-to-r from-primary via-orange-300 to-primary opacity-30"
        style={{
          backgroundImage:
            "repeating-linear-gradient(90deg, #EE4D2D 0px, #EE4D2D 10px, #F8B500 10px, #F8B500 20px)",
        }}
      />
    </div>
  );
};

export default CheckoutAddress;
