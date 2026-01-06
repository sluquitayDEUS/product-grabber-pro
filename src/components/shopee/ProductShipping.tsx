import { MapPin, Truck, ChevronRight, Loader2, Zap } from "lucide-react";
import { useState, useEffect } from "react";
import { format, addDays } from "date-fns";
import { ptBR } from "date-fns/locale";
import AddressModal from "./AddressModal";

interface LocationData {
  state: string;
  city: string;
  loading: boolean;
}

type ShippingType = "standard" | "express";

const ProductShipping = () => {
  const [location, setLocation] = useState<LocationData>({
    state: "",
    city: "",
    loading: true
  });
  const [addressModalOpen, setAddressModalOpen] = useState(false);
  const [selectedShipping, setSelectedShipping] = useState<ShippingType>("standard");

  // Calculate delivery dates
  const today = new Date();
  
  // Standard: 3-9 days
  const standardMinDate = addDays(today, 3);
  const standardMaxDate = addDays(today, 9);
  
  // Express: 3-5 days
  const expressMinDate = addDays(today, 3);
  const expressMaxDate = addDays(today, 5);

  const formatDeliveryDate = (date: Date) => {
    return format(date, "d 'de' MMM", { locale: ptBR });
  };

  const standardDeliveryRange = `${formatDeliveryDate(standardMinDate)} - ${formatDeliveryDate(standardMaxDate)}`;
  const expressDeliveryRange = `${formatDeliveryDate(expressMinDate)} - ${formatDeliveryDate(expressMaxDate)}`;

  useEffect(() => {
    const fetchLocation = async () => {
      try {
        const response = await fetch("https://ipapi.co/json/");
        const data = await response.json();
        
        setLocation({
          state: data.region || "São Paulo",
          city: data.city || "São Paulo",
          loading: false
        });
      } catch (error) {
        setLocation({
          state: "São Paulo",
          city: "São Paulo",
          loading: false
        });
      }
    };

    fetchLocation();
  }, []);

  const handleSaveAddress = (city: string, state: string) => {
    setLocation({
      city,
      state,
      loading: false
    });
  };

  return (
    <>
      <div className="bg-card px-3 py-3 mt-2">
        {/* Location */}
        <button 
          onClick={() => setAddressModalOpen(true)}
          className="w-full flex items-center justify-between mb-3"
        >
          <div className="flex items-center gap-2">
            <MapPin className="w-4 h-4 text-muted-foreground" />
            {location.loading ? (
              <div className="flex items-center gap-2">
                <Loader2 className="w-4 h-4 animate-spin text-primary" />
                <span className="text-sm text-muted-foreground">Detectando localização...</span>
              </div>
            ) : (
              <span className="text-sm text-foreground">
                Enviar para {location.city}, {location.state}
              </span>
            )}
          </div>
          <ChevronRight className="w-4 h-4 text-muted-foreground" />
        </button>

        {/* Shipping Options */}
        <div className="border-t border-border pt-3 space-y-3">
          {/* Standard Shipping */}
          <button
            onClick={() => setSelectedShipping("standard")}
            className={`w-full flex items-start gap-2 p-2 rounded-lg transition-colors ${
              selectedShipping === "standard" 
                ? "bg-shopee-light border border-primary" 
                : "border border-transparent hover:bg-muted/50"
            }`}
          >
            <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center mt-0.5 ${
              selectedShipping === "standard" ? "border-primary" : "border-muted-foreground"
            }`}>
              {selectedShipping === "standard" && (
                <div className="w-2 h-2 rounded-full bg-primary" />
              )}
            </div>
            <Truck className="w-4 h-4 text-shopee-success mt-0.5" />
            <div className="flex-1 text-left">
              <div className="flex items-center gap-2">
                <span className="text-sm font-medium text-shopee-success">Frete Grátis</span>
                <span className="bg-shopee-light text-primary text-[10px] px-1.5 py-0.5 rounded font-medium">
                  Shopee
                </span>
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                Receba entre {standardDeliveryRange}
              </p>
              <p className="text-xs text-muted-foreground">
                Entrega padrão: <span className="line-through">R$ 19,90</span>
              </p>
            </div>
          </button>

          {/* Express Shipping */}
          <button
            onClick={() => setSelectedShipping("express")}
            className={`w-full flex items-start gap-2 p-2 rounded-lg transition-colors ${
              selectedShipping === "express" 
                ? "bg-shopee-light border border-primary" 
                : "border border-transparent hover:bg-muted/50"
            }`}
          >
            <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center mt-0.5 ${
              selectedShipping === "express" ? "border-primary" : "border-muted-foreground"
            }`}>
              {selectedShipping === "express" && (
                <div className="w-2 h-2 rounded-full bg-primary" />
              )}
            </div>
            <Zap className="w-4 h-4 text-amber-500 mt-0.5" />
            <div className="flex-1 text-left">
              <div className="flex items-center gap-2">
                <span className="text-sm font-medium text-amber-500">Frete Expresso</span>
                <span className="bg-amber-100 text-amber-600 text-[10px] px-1.5 py-0.5 rounded font-medium">
                  Rápido
                </span>
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                Receba entre {expressDeliveryRange}
              </p>
              <p className="text-xs text-foreground font-medium">
                R$ 12,90
              </p>
            </div>
          </button>
        </div>

        {/* Protection */}
        <div className="flex items-center gap-2 mt-3 pt-3 border-t border-border">
          <svg className="w-4 h-4 text-primary" viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 1L3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5l-9-4zm0 10.99h7c-.53 4.12-3.28 7.79-7 8.94V12H5V6.3l7-3.11v8.8z"/>
          </svg>
          <span className="text-xs text-foreground">Garantia Shopee 7 dias</span>
          <ChevronRight className="w-4 h-4 text-muted-foreground ml-auto" />
        </div>
      </div>

      <AddressModal
        open={addressModalOpen}
        onOpenChange={setAddressModalOpen}
        currentCity={location.city}
        currentState={location.state}
        onSave={handleSaveAddress}
      />
    </>
  );
};

export default ProductShipping;