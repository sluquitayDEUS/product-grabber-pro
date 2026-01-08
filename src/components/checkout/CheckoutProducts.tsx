import { ChevronRight, Store, MessageCircle, Zap, Truck, Minus, Plus } from "lucide-react";
import { useState } from "react";
import { useCart } from "@/contexts/CartContext";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import StorePopup from "@/components/shopee/StorePopup";
import ChatPopup from "@/components/checkout/ChatPopup";

const CheckoutProducts = () => {
  const { product, selectedShipping, setSelectedShippingType, getShippingOptions, quantity, setQuantity } = useCart();
  const [shippingSheetOpen, setShippingSheetOpen] = useState(false);
  const [messageSheetOpen, setMessageSheetOpen] = useState(false);
  const [message, setMessage] = useState("");
  const [showStorePopup, setShowStorePopup] = useState(false);
  const [showChatPopup, setShowChatPopup] = useState(false);
  const [showQuantityWarning, setShowQuantityWarning] = useState(false);

  const shippingOptions = getShippingOptions();

  const handleDecreaseQuantity = () => {
    if (quantity > 1) {
      setQuantity(quantity - 1);
    }
  };

  const handleIncreaseQuantity = () => {
    if (quantity >= 2) {
      setShowQuantityWarning(true);
      setTimeout(() => setShowQuantityWarning(false), 3100);
      return;
    }
    setQuantity(quantity + 1);
  };

  return (
    <div className="bg-card mt-2">
      {/* Store Header */}
      <button 
        onClick={() => setShowStorePopup(true)}
        className="w-full flex items-center gap-2 p-3 border-b border-border hover:bg-muted/50 transition-colors"
      >
        <Store className="w-4 h-4 text-foreground" />
        <span className="font-medium text-sm text-foreground">Atacado Premium</span>
        <ChevronRight className="w-4 h-4 text-muted-foreground ml-auto" />
      </button>

      <StorePopup open={showStorePopup} onOpenChange={setShowStorePopup} />
      <ChatPopup open={showChatPopup} onOpenChange={setShowChatPopup} />

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
            
            {/* Quantity Selector */}
            <div className="flex flex-col items-end gap-1">
              <div className="flex items-center gap-2">
                <button 
                  onClick={handleDecreaseQuantity}
                  className="w-7 h-7 flex items-center justify-center border border-border rounded-md"
                  disabled={quantity <= 1}
                >
                  <Minus className="w-3 h-3 text-foreground" />
                </button>
                <span className="text-sm text-foreground w-6 text-center">{quantity}</span>
                <button 
                  onClick={handleIncreaseQuantity}
                  className="w-7 h-7 flex items-center justify-center border border-border rounded-md"
                  disabled={quantity >= 2}
                >
                  <Plus className="w-3 h-3 text-foreground" />
                </button>
              </div>
              {showQuantityWarning && (
                <span className="text-[10px] text-destructive animate-pulse">
                  Máximo 2 unidades por pessoa
                </span>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Shipping Option */}
      <Sheet open={shippingSheetOpen} onOpenChange={setShippingSheetOpen}>
        <SheetTrigger asChild>
          <button className="w-full px-3 py-2 border-t border-border flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="text-sm text-foreground">Opção de Envio:</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="text-right">
                <p className="text-sm text-foreground">
                  {selectedShipping.type === "standard" ? "Padrão" : "Expresso"}
                </p>
                <p className="text-xs text-muted-foreground">
                  Receba entre {selectedShipping.deliveryRange}
                </p>
              </div>
              <span className="text-sm text-primary font-medium">
                {selectedShipping.price === 0 ? 'Grátis' : `R$ ${selectedShipping.price.toFixed(2).replace('.', ',')}`}
              </span>
              <ChevronRight className="w-4 h-4 text-muted-foreground" />
            </div>
          </button>
        </SheetTrigger>
        <SheetContent side="bottom" className="rounded-t-xl">
          <SheetHeader>
            <SheetTitle>Opções de Envio</SheetTitle>
          </SheetHeader>
          <div className="mt-4 space-y-3">
            <button
              onClick={() => {
                setSelectedShippingType("standard");
                setShippingSheetOpen(false);
              }}
              className={`w-full flex items-start gap-3 p-3 rounded-lg border transition-colors ${
                selectedShipping.type === "standard" 
                  ? "border-primary bg-shopee-light" 
                  : "border-border"
              }`}
            >
              <Truck className="w-5 h-5 text-shopee-success mt-0.5" />
              <div className="flex-1 text-left">
                <div className="flex items-center justify-between">
                  <span className="font-medium text-shopee-success">Frete Grátis</span>
                  <span className="text-sm text-muted-foreground line-through">R$ 19,90</span>
                </div>
                <p className="text-sm text-muted-foreground mt-1">
                  Receba entre {shippingOptions.standard.deliveryRange}
                </p>
              </div>
            </button>

            <button
              onClick={() => {
                setSelectedShippingType("express");
                setShippingSheetOpen(false);
              }}
              className={`w-full flex items-start gap-3 p-3 rounded-lg border transition-colors ${
                selectedShipping.type === "express" 
                  ? "border-primary bg-shopee-light" 
                  : "border-border"
              }`}
            >
              <Zap className="w-5 h-5 text-amber-500 mt-0.5" />
              <div className="flex-1 text-left">
                <div className="flex items-center justify-between">
                  <span className="font-medium text-amber-500">Frete Expresso</span>
                  <span className="text-sm font-medium">R$ {shippingOptions.express.price.toFixed(2).replace('.', ',')}</span>
                </div>
                <p className="text-sm text-muted-foreground mt-1">
                  Receba entre {shippingOptions.express.deliveryRange}
                </p>
              </div>
            </button>
          </div>
        </SheetContent>
      </Sheet>

      {/* Message to Seller */}
      <Sheet open={messageSheetOpen} onOpenChange={setMessageSheetOpen}>
        <SheetTrigger asChild>
          <button className="w-full px-3 py-2 border-t border-border flex items-center justify-between">
            <div className="flex items-center gap-2">
              <MessageCircle className="w-4 h-4 text-muted-foreground" />
              <span className="text-sm text-foreground">Mensagem para loja</span>
            </div>
            <div className="flex items-center gap-1">
              <span className="text-sm text-muted-foreground truncate max-w-[120px]">
                {message || "Deixe uma mensagem..."}
              </span>
              <ChevronRight className="w-4 h-4 text-muted-foreground" />
            </div>
          </button>
        </SheetTrigger>
        <SheetContent side="bottom" className="rounded-t-xl">
          <SheetHeader>
            <SheetTitle>Mensagem para o Vendedor</SheetTitle>
          </SheetHeader>
          <div className="mt-4">
            <textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Deixe uma mensagem para o vendedor..."
              className="w-full h-32 p-3 border border-border rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-primary text-sm"
            />
            <button
              onClick={() => setMessageSheetOpen(false)}
              className="w-full mt-3 bg-primary text-primary-foreground py-3 rounded-lg font-medium"
            >
              Confirmar
            </button>
          </div>
        </SheetContent>
      </Sheet>

      {/* Order Total */}
      <div className="px-3 py-2 border-t border-border flex items-center justify-between">
        <span className="text-sm text-foreground">Subtotal ({quantity} {quantity === 1 ? 'produto' : 'produtos'})</span>
        <span className="text-sm text-foreground font-medium">
          R$ {(product.price * quantity).toFixed(2).replace('.', ',')}
        </span>
      </div>
    </div>
  );
};

export default CheckoutProducts;
