"use client";
import React, { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";

import { useLoggedInUser, useRingOffer, useSelectedRings } from "@/store/users";
import { splitCartItems } from "@/utils/cartItems";
import { getSelectedOffer } from "@/utils/selectedOffer";

import config from "../../../config/config";
import { CartItemT } from "../Cart/CartItems";

import CheckoutSummary from "./CheckoutSummary";
import Discount from "./Discount";
import RingsSummary from "./RingsSummary";
import AddressSelection from "./SelectAddress";
import { loadStripe } from "@stripe/stripe-js";
import { createCheckoutSession } from "@/actions/payment";
import { useToastStore } from "@/store/toast";
const stripePromise = loadStripe(
  process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!
);

const Checkout = () => {
  const { SetToastStates } = useToastStore();
  const { ringQuantity, selectedRings } = useSelectedRings();
  const { selectedOffer, setSelectedOffer } = useRingOffer();
  const [paidRings, setPaidRings] = useState<CartItemT[]>([]);
  const [freeRings, setFreeRings] = useState<CartItemT[]>([]);
  const [discount, setDiscount] = useState(0);
  const basePrice = Number(config.BASE_PRICE);
  const [selectedAddress, setSelectedAddress] = useState<string>("");
  const { loggedInUser } = useLoggedInUser();
  const [totalRingPrice, setTotalRingPrice] = useState(0);

  useEffect(() => {
    const offer = getSelectedOffer();
    if (offer) {
      setDiscount(0);
      setSelectedOffer(offer);
    }
  }, []);

  useEffect(() => {
    if (selectedOffer.PROMO_OFFER_1 || selectedOffer.PROMO_OFFER_2) {
      const { paid, free } = splitCartItems(selectedRings);
      console.log("free", free);
      setPaidRings(paid);
      setFreeRings(free);
    } else {
      setPaidRings(selectedRings);
      setFreeRings([]);
    }
  }, []);

  const searchParams = useSearchParams();
  const status = searchParams.get("status");

  useEffect(() => {
    if (status === "failed") {
      SetToastStates({
        message: "Payment was failed. Please try again.",
        variant: "error",
        triggerId: Date.now(),
      });
    }
  }, [status]);

  console.log("paid", paidRings);
  console.log("freee", freeRings);
  const handleCheckout = async () => {
    const { id, ...userData } = loggedInUser;
    const cleanPaidRings = paidRings.map(({ size, quantity, color }) => ({
      size,
      quantity,
      color,
      basePrice,
    }));

    const cleanFreeRings = freeRings.map(({ size, quantity, color }) => ({
      size,
      quantity,
      color,
    }));

    console.log("cleanFreeRings", cleanFreeRings);

    const orderPayload = {
      user: userData,
      paid: cleanPaidRings,
      free: cleanFreeRings,
      quantity: ringQuantity,
      price: totalRingPrice.toFixed(2),
      address: selectedAddress,
    };

    try {
      const session = await createCheckoutSession(orderPayload);

      const stripe = await stripePromise;
      if (!stripe) {
        SetToastStates({
          message: "Stripe failed to load!",
          variant: "error",
          triggerId: Date.now(),
        });
        return;
      }

      const { error } = await stripe.redirectToCheckout({
        sessionId: session.id,
      });

      if (error) {
        SetToastStates({
          message: "Failed to redirect to checkout.",
          variant: "error",
          triggerId: Date.now(),
        });
      }
    } catch (err) {
      SetToastStates({
        message: "Something went wrong!",
        variant: "error",
        triggerId: Date.now(),
      });
    }
  };
  return (
    <div className="text-white lg:flex justify-between">
      <div className="border-[1px] border-[#FFFFFF33] rounded-xl p-[23px] w-full lg:w-[49%]">
        <h1 className="text-[20px] text-white font-poppins font-semibold leading-[16px]">
          Select Address
        </h1>
        <AddressSelection setSelectedAddress={setSelectedAddress} />
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
        <Discount
          setDiscount={setDiscount}
          freeRings={freeRings.length}
          selectedOffer={selectedOffer}
        />
        <CheckoutSummary
          ringQuantity={ringQuantity}
          basePrice={basePrice}
          freeRings={freeRings.length}
          selectedRings={selectedRings}
          selectedOffer={selectedOffer}
          discount={discount}
          selectedAddress={selectedAddress}
          handleCheckout={handleCheckout}
          setTotalRingPrice={setTotalRingPrice}
        />
      </div>
    </div>
  );
};

export default Checkout;
