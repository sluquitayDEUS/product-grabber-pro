import { MapPin, ChevronRight } from "lucide-react";
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
  const [addressData, setAddressData] = useState({
    name: "João Silva",
    phone: "(11) 99999-9999",
    street: "Rua das Flores, 123",
    complement: "Apto 45",
    neighborhood: "Jardim Paulista",
    city: location.city,
    state: location.state,
    cep: "01234-567"
  });

  const handleSave = () => {
    setLocation({ city: addressData.city, state: addressData.state });
    setSheetOpen(false);
  };

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
              <div className="flex items-center gap-2 mb-1">
                <span className="font-medium text-sm text-foreground">{addressData.name}</span>
                <span className="text-muted-foreground text-sm">{addressData.phone}</span>
              </div>
              <p className="text-sm text-muted-foreground leading-relaxed">
                {addressData.street} - {addressData.complement}
              </p>
              <p className="text-sm text-muted-foreground">
                {addressData.neighborhood}, {addressData.city} - {addressData.state}, {addressData.cep}
              </p>
            </div>
            <ChevronRight className="w-5 h-5 text-muted-foreground flex-shrink-0 mt-2" />
          </button>
        </SheetTrigger>
        <SheetContent side="bottom" className="rounded-t-xl h-[85vh] overflow-y-auto">
          <SheetHeader>
            <SheetTitle>Endereço de Entrega</SheetTitle>
          </SheetHeader>
          <div className="mt-4 space-y-4">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <Label htmlFor="name">Nome</Label>
                <Input
                  id="name"
                  value={addressData.name}
                  onChange={(e) => setAddressData({ ...addressData, name: e.target.value })}
                />
              </div>
              <div>
                <Label htmlFor="phone">Telefone</Label>
                <Input
                  id="phone"
                  value={addressData.phone}
                  onChange={(e) => setAddressData({ ...addressData, phone: e.target.value })}
                />
              </div>
            </div>
            <div>
              <Label htmlFor="cep">CEP</Label>
              <Input
                id="cep"
                value={addressData.cep}
                onChange={(e) => setAddressData({ ...addressData, cep: e.target.value })}
              />
            </div>
            <div>
              <Label htmlFor="street">Rua</Label>
              <Input
                id="street"
                value={addressData.street}
                onChange={(e) => setAddressData({ ...addressData, street: e.target.value })}
              />
            </div>
            <div>
              <Label htmlFor="complement">Complemento</Label>
              <Input
                id="complement"
                value={addressData.complement}
                onChange={(e) => setAddressData({ ...addressData, complement: e.target.value })}
              />
            </div>
            <div>
              <Label htmlFor="neighborhood">Bairro</Label>
              <Input
                id="neighborhood"
                value={addressData.neighborhood}
                onChange={(e) => setAddressData({ ...addressData, neighborhood: e.target.value })}
              />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <Label htmlFor="city">Cidade</Label>
                <Input
                  id="city"
                  value={addressData.city}
                  onChange={(e) => setAddressData({ ...addressData, city: e.target.value })}
                />
              </div>
              <div>
                <Label htmlFor="state">Estado</Label>
                <select
                  id="state"
                  value={addressData.state}
                  onChange={(e) => setAddressData({ ...addressData, state: e.target.value })}
                  className="w-full h-10 px-3 border border-input rounded-md text-sm bg-background"
                >
                  {brazilianStates.map((state) => (
                    <option key={state} value={state}>
                      {state}
                    </option>
                  ))}
                </select>
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
