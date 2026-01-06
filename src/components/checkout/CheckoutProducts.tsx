import { ChevronRight, Store, MessageCircle } from "lucide-react";

const CheckoutProducts = () => {
  const product = {
    image: "https://images.unsplash.com/photo-1621607512214-68297480165e?w=100&h=100&fit=crop",
    name: "Máquina de Barbear 3 em 1 Profissional Elétrica Recarregável USB",
    variation: "Preto, 3 lâminas",
    price: 89.90,
    quantity: 1
  };

  return (
    <div className="bg-card mt-2">
      {/* Store Header */}
      <div className="flex items-center gap-2 p-3 border-b border-border">
        <Store className="w-4 h-4 text-foreground" />
        <span className="font-medium text-sm text-foreground">Tech Store Oficial</span>
        <ChevronRight className="w-4 h-4 text-muted-foreground ml-auto" />
      </div>

      {/* Product Item */}
      <div className="p-3 flex gap-3">
        <img 
          src={product.image} 
          alt={product.name}
          className="w-20 h-20 object-cover rounded-md flex-shrink-0"
        />
        <div className="flex-1 min-w-0">
          <p className="text-sm text-foreground line-clamp-2 mb-1">
            {product.name}
          </p>
          <p className="text-xs text-muted-foreground mb-2">
            Variação: {product.variation}
          </p>
          <div className="flex items-center justify-between">
            <span className="text-sm text-primary font-medium">
              R$ {product.price.toFixed(2).replace('.', ',')}
            </span>
            <span className="text-sm text-muted-foreground">
              x{product.quantity}
            </span>
          </div>
        </div>
      </div>

      {/* Shipping Option */}
      <div className="px-3 py-2 border-t border-border flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="text-sm text-foreground">Opção de Envio:</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="text-right">
            <p className="text-sm text-foreground">Padrão</p>
            <p className="text-xs text-muted-foreground">Receba de 5 a 12 dias</p>
          </div>
          <span className="text-sm text-primary font-medium">Grátis</span>
          <ChevronRight className="w-4 h-4 text-muted-foreground" />
        </div>
      </div>

      {/* Message to Seller */}
      <div className="px-3 py-2 border-t border-border flex items-center justify-between">
        <div className="flex items-center gap-2">
          <MessageCircle className="w-4 h-4 text-muted-foreground" />
          <span className="text-sm text-foreground">Mensagem para loja</span>
        </div>
        <div className="flex items-center gap-1">
          <span className="text-sm text-muted-foreground">Deixe uma mensagem...</span>
          <ChevronRight className="w-4 h-4 text-muted-foreground" />
        </div>
      </div>

      {/* Order Total */}
      <div className="px-3 py-2 border-t border-border flex items-center justify-between">
        <span className="text-sm text-foreground">Subtotal ({product.quantity} produto)</span>
        <span className="text-sm text-foreground font-medium">
          R$ {product.price.toFixed(2).replace('.', ',')}
        </span>
      </div>
    </div>
  );
};

export default CheckoutProducts;
