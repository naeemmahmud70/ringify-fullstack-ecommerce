"use client";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

import { useRingOffer, useSelectedRings } from "@/store/users";

import config from "../../../config/config";
import { getSelectedOffer } from "../../../utils/selectedOffer";
import {
  getSelectedRingDetails,
  setSelectedRingDetails,
} from "../../../utils/selectedRingDetails";

import CartItems, { CartItemT } from "./CartItems";
import OrderSummary from "./OrderSummary";

const Cart = () => {
  const router = useRouter();
  const { ringQuantity } = useSelectedRings();
  const { selectedOffer, setSelectedOffer } = useRingOffer();
  const [cartItems, setCartItems] = useState<CartItemT[]>([]);

  const [paidRings, setPaidRings] = useState<CartItemT[]>([]);
  const [freeRings, setFreeRings] = useState<CartItemT[]>([]);
  const basePrice = Number(config.BASE_PRICE);

  useEffect(() => {
    const data = getSelectedRingDetails();
    if (data) {
      setCartItems(data);
    }
    const offer = getSelectedOffer();
    if (offer) {
      setSelectedOffer(offer);
    }
  }, []);

  const handleQuantityChange = (index: number, delta: number) => {
    const updatedItems = [...cartItems];
    const newQuantity = updatedItems[index].quantity + delta;
    updatedItems[index].quantity = Math.max(1, newQuantity);
    setCartItems(updatedItems);
    setSelectedRingDetails(updatedItems);
  };

  return (
    <div className="min-h-screen bg-black text-white flex flex-col items-center justify-start">
      <div className="min-h-screen bg-black text-white p-4 md:p-4 mt-28 w-full max-w-7xl">
        <h2 className="text-[20px] font-bold font-mulish mb-6 flex items-center gap-2 ">
          <span className=" cursor-pointer" onClick={() => router.back()}>
            &larr;
          </span>
          <span className="leading-[25px] w-[176px]">Rings Cart</span>
        </h2>

        <div className="w-full flex flex-col lg:flex-row gap-5">
          <CartItems
            cartItems={cartItems}
            setCartItems={setCartItems}
            handleQuantityChange={handleQuantityChange}
            paidRings={paidRings}
            freeRings={freeRings}
            setPaidRings={setPaidRings}
            setFreeRings={setFreeRings}
            selectedOffer={selectedOffer}
          />
          <OrderSummary
            ringQuantity={ringQuantity}
            basePrice={basePrice}
            freeRings={freeRings.length}
            selectedOffer={selectedOffer}
          />
        </div>
      </div>
    </div>
  );
};

export default Cart;
