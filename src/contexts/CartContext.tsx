import React, { createContext, useContext, useState, ReactNode } from "react";
import { addDays, format } from "date-fns";
import { ptBR } from "date-fns/locale";

// Import product images
import aquavoltVermelho from "@/assets/aquavolt-vermelho.jpg";
import aquavoltAzul from "@/assets/aquavolt-azul.jpg";

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

interface CustomerData {
  name: string;
  email: string;
  document: string;
  phone: string;
}

interface ShippingAddress {
  street: string;
  number: string;
  complement: string;
  neighborhood: string;
  city: string;
  state: string;
  zipcode: string;
}

interface CardData {
  number: string;
  holderName: string;
  expMonth: number;
  expYear: number;
  cvv: string;
}

interface ColorOption {
  id: number;
  name: string;
  image: string;
}

const colorOptions: ColorOption[] = [
  { id: 1, name: "Vermelho/Preto", image: aquavoltVermelho },
  { id: 2, name: "Azul/Preto", image: aquavoltAzul },
];

interface CartContextType {
  product: Product;
  location: LocationData;
  setLocation: (location: LocationData) => void;
  selectedShipping: ShippingOption;
  setSelectedShippingType: (type: "standard" | "express") => void;
  getShippingOptions: () => { standard: ShippingOption; express: ShippingOption };
  paymentMethod: string;
  setPaymentMethod: (method: string) => void;
  pixDiscount: number;
  totalPrice: number;
  totalPriceInCents: number;
  customer: CustomerData;
  setCustomer: (customer: CustomerData) => void;
  shippingAddress: ShippingAddress;
  setShippingAddress: (address: ShippingAddress) => void;
  cardData: CardData | null;
  setCardData: (data: CardData | null) => void;
  installments: number;
  setInstallments: (installments: number) => void;
  selectedColor: number | null;
  setSelectedColor: (color: number | null) => void;
  quantity: number;
  setQuantity: (quantity: number) => void;
}

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
  const [paymentMethod, setPaymentMethod] = useState<string>("pix");
  const [customer, setCustomer] = useState<CustomerData>({
    name: "",
    email: "",
    document: "",
    phone: "",
  });
  const [shippingAddress, setShippingAddress] = useState<ShippingAddress>({
    street: "",
    number: "",
    complement: "",
    neighborhood: "",
    city: "São Paulo",
    state: "SP",
    zipcode: "",
  });
  const [cardData, setCardData] = useState<CardData | null>(null);
  const [installments, setInstallments] = useState(1);
  const [selectedColor, setSelectedColor] = useState<number | null>(null);
  const [quantity, setQuantity] = useState(1);

  const shippingOptions = calculateShippingOptions();
  const selectedShipping = shippingOptions[shippingType];

  const selectedColorOption = selectedColor ? colorOptions.find(c => c.id === selectedColor) || colorOptions[0] : colorOptions[0];

  const product: Product = {
    id: "1",
    name: "Aquavolt - Kart Aquático 100% Elétrico",
    image: selectedColorOption.image,
    price: 390.90,
    originalPrice: 590.90,
    variation: selectedColorOption.name,
    quantity: quantity
  };

  const subtotal = product.price * quantity;
  const pixDiscount = paymentMethod === "pix" ? subtotal * 0.05 : 0;
  const totalPrice = subtotal + selectedShipping.price - pixDiscount;
  const totalPriceInCents = Math.round(totalPrice * 100);

  return (
    <CartContext.Provider
      value={{
        product,
        location,
        setLocation,
        selectedShipping,
        setSelectedShippingType: setShippingType,
        getShippingOptions: () => shippingOptions,
        paymentMethod,
        setPaymentMethod,
        pixDiscount,
        totalPrice,
        totalPriceInCents,
        customer,
        setCustomer,
        shippingAddress,
        setShippingAddress,
        cardData,
        setCardData,
        installments,
        setInstallments,
        selectedColor,
        setSelectedColor,
        quantity,
        setQuantity,
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
