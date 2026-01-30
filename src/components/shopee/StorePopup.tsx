import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Shield, Package, Star, Users, Clock, CheckCircle2, Award, TrendingUp } from "lucide-react";

interface StorePopupProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const StorePopup = ({ open, onOpenChange }: StorePopupProps) => {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-[360px] rounded-xl p-0 overflow-hidden">
        {/* Header com gradiente */}
        <div className="bg-gradient-to-r from-primary to-primary/80 p-4 text-primary-foreground">
          <div className="flex items-center gap-3">
            <img 
              src="/lovable-uploads/f6949b55-5746-4c6d-a30a-e701c014d9c9.png" 
              alt="Loja" 
              className="w-16 h-16 rounded-full border-2 border-white/30 object-cover"
            />
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-bold text-lg">Atacado Premium</h3>
                <span className="bg-white/20 text-[10px] px-2 py-0.5 rounded-full font-medium">
                  Loja Oficial
                </span>
              </div>
              <div className="flex items-center gap-1 mt-1">
                <Shield className="w-4 h-4" />
                <span className="text-sm">Vendedor Verificado</span>
              </div>
            </div>
          </div>
        </div>

        {/* Estatísticas principais */}
        <div className="p-4">
          <div className="grid grid-cols-2 gap-3">
            <div className="bg-green-50 rounded-xl p-3 text-center">
              <div className="flex items-center justify-center gap-1 text-green-600 mb-1">
                <Package className="w-5 h-5" />
              </div>
              <p className="text-xl font-bold text-green-700">127.843</p>
              <p className="text-xs text-green-600">Pedidos Entregues</p>
            </div>
            
            <div className="bg-amber-50 rounded-xl p-3 text-center">
              <div className="flex items-center justify-center gap-1 text-amber-600 mb-1">
                <Star className="w-5 h-5 fill-amber-500" />
              </div>
              <p className="text-xl font-bold text-amber-700">89.521</p>
              <p className="text-xs text-amber-600">Avaliações Positivas</p>
            </div>
            
            <div className="bg-blue-50 rounded-xl p-3 text-center">
              <div className="flex items-center justify-center gap-1 text-blue-600 mb-1">
                <Users className="w-5 h-5" />
              </div>
              <p className="text-xl font-bold text-blue-700">85.412</p>
              <p className="text-xs text-blue-600">Seguidores</p>
            </div>
            
            <div className="bg-purple-50 rounded-xl p-3 text-center">
              <div className="flex items-center justify-center gap-1 text-purple-600 mb-1">
                <Clock className="w-5 h-5" />
              </div>
              <p className="text-xl font-bold text-purple-700">3 Anos</p>
              <p className="text-xs text-purple-600">No Mercado</p>
            </div>
          </div>

          {/* Indicadores de confiança */}
          <div className="mt-4 space-y-2">
            <div className="flex items-center gap-2 p-2 bg-muted/50 rounded-lg">
              <CheckCircle2 className="w-5 h-5 text-green-500 flex-shrink-0" />
              <div className="flex-1">
                <p className="text-sm font-medium text-foreground">98% de Satisfação</p>
                <p className="text-xs text-muted-foreground">Baseado nas últimas 10.000 vendas</p>
              </div>
            </div>
            
            <div className="flex items-center gap-2 p-2 bg-muted/50 rounded-lg">
              <Award className="w-5 h-5 text-primary flex-shrink-0" />
              <div className="flex-1">
                <p className="text-sm font-medium text-foreground">Loja Preferida</p>
                <p className="text-xs text-muted-foreground">Top 1% dos vendedores da plataforma</p>
              </div>
            </div>
            
            <div className="flex items-center gap-2 p-2 bg-muted/50 rounded-lg">
              <TrendingUp className="w-5 h-5 text-blue-500 flex-shrink-0" />
              <div className="flex-1">
                <p className="text-sm font-medium text-foreground">Tempo de Resposta: 2h</p>
                <p className="text-xs text-muted-foreground">Responde rapidamente às mensagens</p>
              </div>
            </div>
          </div>

          {/* Selo de garantia */}
          <div className="mt-4 p-3 bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl border border-green-200">
            <div className="flex items-center gap-2">
              <Shield className="w-6 h-6 text-green-600" />
              <div>
                <p className="text-sm font-semibold text-green-700">Compra 100% Segura</p>
                <p className="text-xs text-green-600">Garantia de reembolso em até 7 dias</p>
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default StorePopup;
