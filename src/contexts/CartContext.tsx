import React, { createContext, useContext, useState, ReactNode } from "react";
import { addDays, format } from "date-fns";
import { ptBR } from "date-fns/locale";

interface LocationData {
  state: string;
  city: string;
}

interface ShippingOption {
  type: "standard" | "express";
  price: number;
  deliveryRange: string;
  minDate: Date;
  maxDate: Date;
}

interface Product {
  id: string;
  name: string;
  image: string;
  price: number;
  originalPrice: number;
  variation: string;
  quantity: number;
}

interface CartContextType {
  product: Product;
  location: LocationData;
  setLocation: (location: LocationData) => void;
  selectedShipping: ShippingOption;
  setSelectedShippingType: (type: "standard" | "express") => void;
  getShippingOptions: () => { standard: ShippingOption; express: ShippingOption };
  totalPrice: number;
}

const defaultProduct: Product = {
  id: "1",
  name: "Máquina de Barbear 3 em 1 Profissional Elétrica Recarregável USB",
  image: "https://images.unsplash.com/photo-1621607512214-68297480165e?w=400&h=400&fit=crop",
  price: 89.90,
  originalPrice: 164.90,
  variation: "Preto, 3 lâminas",
  quantity: 1
};

const calculateShippingOptions = (): { standard: ShippingOption; express: ShippingOption } => {
  const today = new Date();
  
  const standardMinDate = addDays(today, 3);
  const standardMaxDate = addDays(today, 9);
  const expressMinDate = addDays(today, 3);
  const expressMaxDate = addDays(today, 5);

  const formatDate = (date: Date) => format(date, "d 'de' MMM", { locale: ptBR });

  return {
    standard: {
      type: "standard",
      price: 0,
      deliveryRange: `${formatDate(standardMinDate)} - ${formatDate(standardMaxDate)}`,
      minDate: standardMinDate,
      maxDate: standardMaxDate
    },
    express: {
      type: "express",
      price: 17.90,
      deliveryRange: `${formatDate(expressMinDate)} - ${formatDate(expressMaxDate)}`,
      minDate: expressMinDate,
      maxDate: expressMaxDate
    }
  };
};

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider = ({ children }: { children: ReactNode }) => {
  const [location, setLocation] = useState<LocationData>({
    state: "São Paulo",
    city: "São Paulo"
  });
  const [shippingType, setShippingType] = useState<"standard" | "express">("standard");

  const shippingOptions = calculateShippingOptions();
  const selectedShipping = shippingOptions[shippingType];

  const totalPrice = defaultProduct.price * defaultProduct.quantity + selectedShipping.price;

  return (
    <CartContext.Provider
      value={{
        product: defaultProduct,
        location,
        setLocation,
        selectedShipping,
        setSelectedShippingType: setShippingType,
        getShippingOptions: () => shippingOptions,
        totalPrice
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
};
