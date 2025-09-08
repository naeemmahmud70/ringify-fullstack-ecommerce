"use client";

import { createContext, useContext, useEffect, useState } from "react";

import config from "../../config/config";

type Price = {
  subTotal: number;
  total: number;
};
interface CartContextType {
  cartQuantity: number;
  setCartQuantity: (qty: number) => void;
  price: Price;
  setPrice: React.Dispatch<React.SetStateAction<Price>>;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider = ({ children }: { children: React.ReactNode }) => {
  const [cartQuantity, setCartQuantity] = useState(0);
  const [price, setPrice] = useState<Price>({
    subTotal: 0,
    total: 0,
  });

  const basePrice = Number(config.BASE_PRICE);

  useEffect(() => {
    const data = localStorage.getItem("selectedRingDetails");
    const selectedOfferLocal = localStorage.getItem("selectedOffer");

    if (data) {
      const rings = JSON.parse(data);
      const quantity = rings.reduce((acc: number, item: any) => {
        return acc + item.quantity;
      }, 0);

      if (selectedOfferLocal) {
        const selectedOffer = JSON.parse(selectedOfferLocal);
        console.log("selected offer CONTEXT: ", {
          selectedOffer,
          quantity,
          basePrice,
        });
        const offer1 = selectedOffer.PROMO_OFFER_1;
        const offer2 = selectedOffer.PROMO_OFFER_2;
        if (offer1 !== "" && offer2 === "") {
          // apply offer - Pay(less) for quantity - 1
          setPrice(prev => ({
            ...prev,
            subTotal: quantity * basePrice,
            total: (quantity - 1) * basePrice,
          }));
        } else if (offer1 === "" && offer2 !== "") {
          // apply offer - Pay(less) for quantity - 2
          setPrice(prev => ({
            ...prev,
            subTotal: quantity * basePrice,
            total: (quantity - 2) * basePrice,
          }));
        } else {
          setPrice(prev => ({
            ...prev,
            subTotal: quantity * basePrice,
            total: quantity * basePrice,
          }));
        }
      }
      setCartQuantity(quantity);
    }
  }, []);

  return (
    <CartContext.Provider
      value={{ cartQuantity, setCartQuantity, price, setPrice }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart must be used inside CartProvider");
  }
  return context;
};
