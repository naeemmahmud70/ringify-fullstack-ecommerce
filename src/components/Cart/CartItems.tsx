"use client";
import React, { useEffect, useRef, useState } from "react";
import { setSelectedRingDetails } from "../../../utils/selectedRingDetails";
import Image from "next/image";
import { formatColor, splitCartItems } from "../../../utils/cartItems";
import { useSelectedRings } from "@/store/users";
import {
  handleSelectOfferOne,
  handleSelectOfferTwo,
} from "../../../utils/selectedOffer";
import { useModals } from "@/store/modals";

export type OfferT = {
  PROMO_OFFER_1: string;
  PROMO_OFFER_2: string;
};

export type CartItemT = {
  size: string;
  color: string;
  quantity: number;
  basePrice?: number;
  img: string;
};
interface CartItemsProps {
  cartItems: CartItemT[];
  setCartItems: React.Dispatch<React.SetStateAction<CartItemT[]>>;
  handleQuantityChange: (index: number, delta: number) => void;
  paidRings: CartItemT[];
  freeRings: CartItemT[];
  setPaidRings: React.Dispatch<React.SetStateAction<CartItemT[]>>;
  setFreeRings: React.Dispatch<React.SetStateAction<CartItemT[]>>;
  selectedOffer: OfferT;
}

const CartItems: React.FC<CartItemsProps> = ({
  cartItems,
  setCartItems,
  handleQuantityChange,
  paidRings,
  freeRings,
  setPaidRings,
  setFreeRings,
  selectedOffer,
}) => {
  const [pendingIndex, setPendingIndex] = useState<number | null>(null);
  const [showPrompt, setShowPrompt] = useState(false);
  const [showSizeSelector, setShowSizeSelector] = useState(false);
  const [selectedSize, setSelectedSize] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const { ringQuantity } = useSelectedRings();
  const { setUnlockOfferModal } = useModals();
  const prevTotalRef = useRef<number | null>(null);
  const hasSeenRealTotal = useRef(false);

  const offer1 = process.env.NEXT_PUBLIC_PROMO_OFFER_1 ?? "";
  const offer2 = process.env.NEXT_PUBLIC_PROMO_OFFER_2 ?? "";

  const [offerOneThreshold, offerOneFreeRing] = offer1
    .split(".")
    .map(num => parseInt(num, 10));

  const [offerTwoThreshold, offerTwoFreeRing] = offer2
    .split(".")
    .map(num => parseInt(num, 10));

  const OfferOneText = `Buy ${offerOneThreshold}, Pay for Just ${offerOneThreshold - offerOneFreeRing}!`;
  const offerTwoText = `Buy ${offerTwoThreshold}, Pay for Just ${offerTwoThreshold - offerTwoFreeRing}!`;

  useEffect(() => {
    if (selectedOffer.PROMO_OFFER_1 || selectedOffer.PROMO_OFFER_2) {
      const { paid, free } = splitCartItems(cartItems, selectedOffer);
      setPaidRings(paid);
      setFreeRings(free);
    } else {
      setPaidRings(cartItems);
      setFreeRings([]);
    }
    if (ringQuantity >= offerOneThreshold && ringQuantity < offerTwoThreshold) {
      handleSelectOfferOne(OfferOneText);
    }
    if (ringQuantity >= offerTwoThreshold) {
      handleSelectOfferTwo(offerTwoText);
    }
    console.log("hit");
  }, [cartItems]);

  useEffect(() => {
    if (!hasSeenRealTotal.current) {
      prevTotalRef.current = ringQuantity;
      if (ringQuantity > 0) {
        hasSeenRealTotal.current = true;
      }
      return;
    }

    const prevTotal = prevTotalRef.current ?? 0;
    if (ringQuantity > prevTotal) {
      if (ringQuantity === offerOneThreshold) {
        setUnlockOfferModal(OfferOneText);
      }
      if (ringQuantity === offerTwoThreshold) {
        setUnlockOfferModal(offerTwoText);
      }
    }

    prevTotalRef.current = ringQuantity;
  }, [ringQuantity]);

  const handlePlusClick = (index: number) => {
    const totalQuantity = cartItems.reduce(
      (sum, item) => sum + item.quantity,
      0
    );

    if (totalQuantity >= 15) {
      setError("Maximum 15 rings allowed at a time!");
      return;
    }

    setError(null);
    setPendingIndex(index);
    setShowPrompt(true);
  };

  const confirmSameSize = (index: number) => {
    handleQuantityChange(index, 1);
    setSelectedRingDetails(cartItems);
    resetPrompt();
  };

  const confirmDifferentSize = () => {
    if (pendingIndex !== null && selectedSize) {
      const item = cartItems[pendingIndex];
      const existingIndex = cartItems.findIndex(
        cartItem =>
          cartItem.color.toLowerCase() === item.color.toLowerCase() &&
          cartItem.size === selectedSize
      );

      let updatedCart: CartItemT[] = [];

      if (existingIndex !== -1) {
        updatedCart = cartItems.map((ci, idx) =>
          idx === existingIndex ? { ...ci, quantity: ci.quantity + 1 } : ci
        );
      } else {
        const newItem: CartItemT = {
          ...item,
          size: selectedSize,
          quantity: 1,
        };
        updatedCart = [...cartItems, newItem];
      }

      setCartItems(updatedCart);
      setSelectedRingDetails(updatedCart);
      resetPrompt();
    }
  };

  const resetPrompt = () => {
    setPendingIndex(null);
    setShowPrompt(false);
    setShowSizeSelector(false);
    setSelectedSize(null);
  };

  const handleRemoveItem = (index: number) => {
    const updatedCart = cartItems.filter((_, i) => i !== index);
    setCartItems(updatedCart);
    handleDeleteItem(updatedCart);
  };

  const handleDecreaseQuantity = (index: number) => {
    const item = cartItems[index];
    if (item.quantity === 1) {
      handleRemoveItem(index);
    } else {
      const updatedCart = cartItems.map((ci, i) =>
        i === index ? { ...ci, quantity: ci.quantity - 1 } : ci
      );
      setCartItems(updatedCart);
      handleDeleteItem(updatedCart);
    }
    setError(null);
  };

  const handleIncreaseQuantity = (index: number) => {
    handlePlusClick(index);
  };

  const handleDeleteItem = (items: CartItemT[]) => {
    if (typeof window !== "undefined") {
      setSelectedRingDetails(items);
    }
  };

  return (
    <div className="w-full lg:w-3/5 flex-col gap-4 items-center p-2 md:p-4 border border-white/20 rounded-[12px]">
      {cartItems.length === 0 ? (
        <p>Your cart is empty.</p>
      ) : (
        <>
          {/* free ring section */}
          {freeRings.length > 0 && (
            <div className="w-full flex flex-col items-start gap-4 mb-[24px]">
              <div className="font-mulish font-bold text-[20px] leading-[125%] tracking-[-0.025em] px-2 pt-[16px]">
                Unlocked Rewards
              </div>
              {freeRings.map((item, index) => {
                return (
                  <React.Fragment key={index}>
                    <div className="w-full justify-center m-0">
                      <div className="min-h-min-[124px] flex flex-wrap gap-4 items-center px-2 md:px-2 rounded-xl w-full">
                        <Image
                          height={124}
                          width={124}
                          src={item.img || "/fallback.svg"}
                          alt="Product"
                          className="object-contain"
                          style={{
                            borderRadius: "8.66px",
                            objectFit: "cover",
                          }}
                        />
                        <div className="flex-1">
                          <h3 className="text-[20px] font-medium font-[Poppins]">
                            BAAI Zen
                          </h3>
                          <p className="text-[14px] text-white">
                            Size: {item.size}
                          </p>
                          <p className="text-[14px] text-white mt-1 capitalize">
                            Color: {formatColor(item.color)}
                          </p>
                          <p className="text-[#25B021] font-poppins font-semibold text-[24px] leading-[100%] align-middle">
                            FREE
                          </p>
                        </div>
                      </div>
                    </div>
                  </React.Fragment>
                );
              })}
              <div className="w-full border-t border-[#FFFFFF33]"></div>
            </div>
          )}

          {/* selected ring section */}
          {paidRings.map((item, index) => {
            return (
              <React.Fragment key={index}>
                <div className=" w-full justify-center m-0">
                  <div className="min-h-min-[124px] flex flex-wrap gap-4 items-center p-2 md:p-2 rounded-xl w-full">
                    <Image
                      height={124}
                      width={124}
                      src={item.img}
                      alt="Product"
                      className="object-contain"
                    />
                    <div className="flex-1">
                      <h3 className="text-[20px] font-medium font-[Poppins]">
                        BAAI Zen
                      </h3>
                      <p className="text-[14px] text-white">
                        Size: {item.size}
                      </p>
                      <p className="text-[14px] text-white mt-1 capitalize">
                        Color: {formatColor(item.color)}
                      </p>
                      <p className="text-base-lg font-semibold text-white font-poppins">
                        {item.basePrice !== undefined && (
                          <>
                            <span>${item.basePrice.toFixed(2)}</span>
                            <span className="ml-2 mb-4 text-[12px] font-normal leading-[120%] font-poppins text-[#8F8F8F]">
                              (inclusive of all the taxes)
                            </span>
                          </>
                        )}
                      </p>
                    </div>

                    <div className="mt-auto justify-center gap-2">
                      <div className="flex items-center mb-14 justify-end gap-2 w-full">
                        <button
                          onClick={() => {
                            handleRemoveItem(index);
                          }}
                          title="Remove item"
                        >
                          <Image
                            height={11}
                            width={11}
                            src="/cartpage/cross.svg"
                            alt="Remove"
                          />
                        </button>
                      </div>
                      <div className="mt-auto flex items-center gap-2">
                        <div
                          className="flex items-center gap-[13px] rounded-full  px-1 "
                          style={{
                            width: "91px",
                            height: "32px",
                            background: "#F0F0F04D",
                          }}
                        >
                          <button
                            onClick={() => {
                              handleDecreaseQuantity(index);
                            }}
                          >
                            <Image
                              height={16}
                              width={16}
                              src="/cartpage/minus.svg"
                              alt="Minus"
                              className="w-4 h-4"
                            />
                          </button>

                          <span className="text-white">{item.quantity}</span>
                          <button
                            onClick={() => handleIncreaseQuantity(index)}
                            className="px-1"
                          >
                            <Image
                              height={16}
                              width={16}
                              src="/cartpage/plus.svg"
                              alt="Plus"
                            />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Prompt after + */}
                  {showPrompt &&
                    pendingIndex === index &&
                    !showSizeSelector && (
                      <div className="mt-4 p-4 rounded-lg text-white">
                        <p className="mb-2">
                          Do you want to purchase the ring of same size?
                        </p>
                        <div className="flex gap-4">
                          <button
                            className="bg-green-custom px-4 py-1 rounded-full"
                            onClick={() => confirmSameSize(index)}
                          >
                            Yes
                          </button>
                          <button
                            className="bg-[#484848] px-4 py-1 rounded-full"
                            onClick={() => setShowSizeSelector(true)}
                          >
                            No
                          </button>
                        </div>
                      </div>
                    )}

                  {/* Size Selector */}
                  {showPrompt && pendingIndex === index && showSizeSelector && (
                    <div className="mt-4 p-4 bg-black rounded-lg text-white">
                      <p
                        className="mb-2 font-semibold text-[20px] leading-[120%] font-poppins"
                        style={{
                          width: "107px",
                          height: "24px",
                          color: "rgba(255, 255, 255, 0.7)",
                          letterSpacing: "0%",
                          verticalAlign: "bottom",
                        }}
                      >
                        Select Size
                      </p>
                      <div className="flex gap-3 flex-wrap">
                        {["06", "08", "09", "10", "11", "12", "13"].map(
                          size => (
                            <button
                              key={size}
                              onClick={() => setSelectedSize(size)}
                              className={`flex items-center justify-center rounded-lg border px-4 py-4 gap-4
                            ${
                              selectedSize === size
                                ? " border-white"
                                : "bg-[rgba(245,245,245,0.05)] border-white/20"
                            }`}
                              style={{ width: "56px", height: "56px" }}
                            >
                              <span className="w-[15px] h-[24px] font-poppins font-normal text-[16px] leading-[100%] text-white tracking-normal flex items-center justify-center">
                                {size}
                              </span>
                            </button>
                          )
                        )}
                      </div>

                      <div className="flex gap-4 mt-4">
                        <button
                          className={`disabled:opacity-50 rounded-[62px] bg-[#25B021] 
                            w-[96px] h-[36px] flex items-center justify-center text-white`}
                          disabled={!selectedSize}
                          onClick={confirmDifferentSize}
                        >
                          Confirm
                        </button>

                        <button
                          className={`disabled:opacity-50 rounded-[62px] bg-[#484848] 
                            w-[96px] h-[36px] flex items-center justify-center text-white`}
                          onClick={resetPrompt}
                        >
                          Cancel
                        </button>
                      </div>
                    </div>
                  )}
                </div>

                {index !== cartItems.length - 1 && (
                  <hr className="border border-white/5 my-2" />
                )}
              </React.Fragment>
            );
          })}
        </>
      )}
      {error && <p className="text-red-500 mb-4 font-medium">{error}</p>}
    </div>
  );
};

export default CartItems;
