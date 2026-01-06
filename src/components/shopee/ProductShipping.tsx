import { MapPin, Truck, ChevronRight, Loader2, Zap } from "lucide-react";
import { useState, useEffect } from "react";
import AddressModal from "./AddressModal";
import { GarantiaPopup } from "./InfoPopups";
import { useCart } from "@/contexts/CartContext";

const ProductShipping = () => {
  const { location, setLocation, selectedShipping, setSelectedShippingType, getShippingOptions } = useCart();
  const [addressModalOpen, setAddressModalOpen] = useState(false);
  const [garantiaOpen, setGarantiaOpen] = useState(false);
  const [loading, setLoading] = useState(true);

  const shippingOptions = getShippingOptions();

  useEffect(() => {
    const fetchLocation = async () => {
      try {
        const response = await fetch("https://ipapi.co/json/");
        const data = await response.json();
        
        setLocation({
          state: data.region || "São Paulo",
          city: data.city || "São Paulo"
        });
      } catch (error) {
        setLocation({
          state: "São Paulo",
          city: "São Paulo"
        });
      } finally {
        setLoading(false);
      }
    };

    fetchLocation();
  }, [setLocation]);

  const handleSaveAddress = (city: string, state: string) => {
    setLocation({ city, state });
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
            {loading ? (
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
            onClick={() => setSelectedShippingType("standard")}
            className={`w-full flex items-start gap-2 p-2 rounded-lg transition-colors ${
              selectedShipping.type === "standard" 
                ? "bg-shopee-light border border-primary" 
                : "border border-transparent hover:bg-muted/50"
            }`}
          >
            <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center mt-0.5 ${
              selectedShipping.type === "standard" ? "border-primary" : "border-muted-foreground"
            }`}>
              {selectedShipping.type === "standard" && (
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
                Receba entre {shippingOptions.standard.deliveryRange}
              </p>
              <p className="text-xs text-muted-foreground">
                Entrega padrão: <span className="line-through">R$ 19,90</span>
              </p>
            </div>
          </button>

          {/* Express Shipping */}
          <button
            onClick={() => setSelectedShippingType("express")}
            className={`w-full flex items-start gap-2 p-2 rounded-lg transition-colors ${
              selectedShipping.type === "express" 
                ? "bg-shopee-light border border-primary" 
                : "border border-transparent hover:bg-muted/50"
            }`}
          >
            <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center mt-0.5 ${
              selectedShipping.type === "express" ? "border-primary" : "border-muted-foreground"
            }`}>
              {selectedShipping.type === "express" && (
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
                Receba entre {shippingOptions.express.deliveryRange}
              </p>
              <p className="text-xs text-foreground font-medium">
                R$ {shippingOptions.express.price.toFixed(2).replace('.', ',')}
              </p>
            </div>
          </button>
        </div>

        {/* Protection */}
        <button 
          onClick={() => setGarantiaOpen(true)}
          className="w-full flex items-center gap-2 mt-3 pt-3 border-t border-border hover:bg-muted/50 transition-colors rounded"
        >
          <svg className="w-4 h-4 text-primary" viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 1L3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5l-9-4zm0 10.99h7c-.53 4.12-3.28 7.79-7 8.94V12H5V6.3l7-3.11v8.8z"/>
          </svg>
          <span className="text-xs text-foreground">Garantia Shopee 7 dias</span>
          <ChevronRight className="w-4 h-4 text-muted-foreground ml-auto" />
        </button>
      </div>

      <AddressModal
        open={addressModalOpen}
        onOpenChange={setAddressModalOpen}
        currentCity={location.city}
        currentState={location.state}
        onSave={handleSaveAddress}
      />

      <GarantiaPopup open={garantiaOpen} onOpenChange={setGarantiaOpen} />
    </>
  );
};

export default ProductShipping;
