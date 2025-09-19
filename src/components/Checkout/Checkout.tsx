"use client";
import { useRingOffer, useSelectedRings } from "@/store/users";
import React, { useEffect, useState } from "react";
import config from "../../../config/config";
import { splitCartItems } from "@/utils/cartItems";
import { CartItemT } from "../Cart/CartItems";
import CheckoutSummary from "./CheckoutSummary";
import Discount from "./Discount";
import { getSelectedOffer } from "@/utils/selectedOffer";
import RingsSummary from "./RingsSummary";

const Checkout = () => {
  const { ringQuantity, selectedRings } = useSelectedRings();
  const { selectedOffer, setSelectedOffer } = useRingOffer();
  const [paidRings, setPaidRings] = useState<CartItemT[]>([]);
  const [freeRings, setFreeRings] = useState<CartItemT[]>([]);
  const basePrice = Number(config.BASE_PRICE);

  useEffect(() => {
    const offer = getSelectedOffer();
    if (offer) {
      setSelectedOffer(offer);
    }
  }, []);

  useEffect(() => {
    if (selectedOffer.PROMO_OFFER_1 || selectedOffer.PROMO_OFFER_2) {
      const { paid, free } = splitCartItems(selectedRings);
      setPaidRings(paid);
      setFreeRings(free);
    } else {
      setFreeRings([]);
    }
  }, [selectedOffer]);
  return (
    <div className="text-white lg:flex justify-between">
      <div className="border-[1px] border-[#FFFFFF33] rounded-xl p-[23px] w-full lg:w-[49%]">
        <h1 className="text-[20px] text-white font-poppins font-semibold leading-[16px]">
          Select Address
        </h1>
        {/* <AddressSelection setSelectedAddress={setSelectedAddress} /> */}
      </div>
      <div className="flex flex-col gap-7 border-[1px] border-[#FFFFFF33] rounded-xl p-5 w-full lg:w-[49%] h-fit mt-5 lg:mt-0">
        <h1 className="text-[20px] text-white font-poppins font-semibold leading-[16px]">
          Order Summary
        </h1>
        <RingsSummary
          selectedRings={selectedRings}
          paidRings={paidRings}
          freeRings={freeRings}
        />
        <Discount freeRings={freeRings.length} selectedOffer={selectedOffer} />
        <CheckoutSummary
          ringQuantity={ringQuantity}
          basePrice={basePrice}
          freeRings={freeRings.length}
          selectedOffer={selectedOffer}
        />
      </div>
    </div>
  );
};

export default Checkout;
