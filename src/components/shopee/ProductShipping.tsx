import { useState, useEffect } from "react";
import { Truck, ChevronRight, MapPin } from "lucide-react";
import { addDays, format } from "date-fns";
import { ptBR } from "date-fns/locale";
import AddressModal from "./AddressModal";
import InstallmentPopup from "./InstallmentPopup";

const ProductShipping = () => {
  const [city, setCity] = useState("São Paulo");
  const [state, setState] = useState("SP");
  const [addressModalOpen, setAddressModalOpen] = useState(false);
  const [installmentOpen, setInstallmentOpen] = useState(false);

  useEffect(() => {
    const fetchLocation = async () => {
      try {
        const res = await fetch("http://ip-api.com/json/?fields=city,regionName,region");
        const data = await res.json();
        if (data.city && data.region) {
          setCity(data.city);
          setState(data.region);
        }
      } catch {
        // fallback: try alternative API
        try {
          const res2 = await fetch("https://freeipapi.com/api/json");
          const data2 = await res2.json();
          if (data2.cityName && data2.regionName) {
            setCity(data2.cityName);
            setState(data2.regionName);
          }
        } catch {
          // keep defaults
        }
      }
    };
    fetchLocation();
  }, []);

  const today = new Date();
  const minDate = addDays(today, 3);
  const maxDate = addDays(today, 9);
  const formatDate = (d: Date) => format(d, "d 'de' MMM", { locale: ptBR });

  const handleSaveAddress = (newCity: string, newState: string) => {
    setCity(newCity);
    setState(newState);
  };

  return (
    <>
      <div className="bg-card mt-2">
        {/* Frete grátis */}
        <button
          onClick={() => setAddressModalOpen(true)}
          className="w-full px-3 py-3 border-b border-border text-left"
        >
          <div className="flex items-center gap-2">
            <Truck className="w-4 h-4 text-muted-foreground" />
            <span className="text-sm text-shopee-success font-medium">Frete grátis</span>
            <span className="text-sm text-muted-foreground line-through">R$12,04</span>
            <span className="text-sm text-foreground">R$0,00 com cupom</span>
            <ChevronRight className="w-4 h-4 text-muted-foreground ml-auto" />
          </div>
          <div className="flex items-center gap-1 mt-1 ml-6">
            <MapPin className="w-3 h-3 text-muted-foreground" />
            <span className="text-[11px] text-muted-foreground">
              {city}, {state} · Receba entre {formatDate(minDate)} - {formatDate(maxDate)}
            </span>
          </div>
        </button>

        {/* Parcelamento */}
        <button
          onClick={() => setInstallmentOpen(true)}
          className="w-full flex items-center gap-2 px-3 py-3"
        >
          <svg className="w-4 h-4 text-muted-foreground" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <rect x="1" y="4" width="22" height="16" rx="2" ry="2"/>
            <line x1="1" y1="10" x2="23" y2="10"/>
          </svg>
          <span className="text-sm text-foreground">SParcelado: Parcele em até 12x</span>
          <ChevronRight className="w-4 h-4 text-muted-foreground ml-auto" />
        </button>
      </div>

      <AddressModal
        open={addressModalOpen}
        onOpenChange={setAddressModalOpen}
        currentCity={city}
        currentState={state}
        onSave={handleSaveAddress}
      />

      <InstallmentPopup
        open={installmentOpen}
        onOpenChange={setInstallmentOpen}
      />
    </>
  );
};

export default ProductShipping;
