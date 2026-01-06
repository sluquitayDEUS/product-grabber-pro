import { MapPin, ChevronRight } from "lucide-react";

const CheckoutAddress = () => {
  return (
    <div className="bg-card">
      {/* Orange top border decoration */}
      <div className="h-3 bg-gradient-to-r from-primary via-orange-300 to-primary opacity-30" 
           style={{ backgroundImage: 'repeating-linear-gradient(90deg, #EE4D2D 0px, #EE4D2D 10px, #F8B500 10px, #F8B500 20px)' }} />
      
      <button className="w-full p-3 flex items-start gap-3">
        <MapPin className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
        <div className="flex-1 text-left">
          <div className="flex items-center gap-2 mb-1">
            <span className="font-medium text-sm text-foreground">João Silva</span>
            <span className="text-muted-foreground text-sm">(+55) 11 99999-9999</span>
          </div>
          <p className="text-sm text-muted-foreground leading-relaxed">
            Rua das Flores, 123 - Apto 45
          </p>
          <p className="text-sm text-muted-foreground">
            Jardim Paulista, São Paulo - SP, 01234-567
          </p>
        </div>
        <ChevronRight className="w-5 h-5 text-muted-foreground flex-shrink-0 mt-2" />
      </button>

      {/* Orange bottom border decoration */}
      <div className="h-3 bg-gradient-to-r from-primary via-orange-300 to-primary opacity-30" 
           style={{ backgroundImage: 'repeating-linear-gradient(90deg, #EE4D2D 0px, #EE4D2D 10px, #F8B500 10px, #F8B500 20px)' }} />
    </div>
  );
};

export default CheckoutAddress;
