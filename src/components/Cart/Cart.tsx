"use client";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

import { useCart } from "@/context/CartContext";
import { useLoginModal } from "@/store/loginModal";
import { useModals } from "@/store/modals";
import { useRingOffer } from "@/store/users";

import config from "../../../config/config";

import CartItems from "./CartItems";
import OrderSummary from "./OrderSummary";
import ringDetailsMap from "./ringDetailsMap";

type CartItem = {
  size: string;
  color: string;
  quantity: number;
  basePrice?: number;
  currencySymbol?: string;
};

const Cart = () => {
  const router = useRouter();
  const { isModalOpen } = useLoginModal();
  const [loggedIn, setLoggedIn] = useState("");

  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [discount, setDiscount] = useState<number>(0);
  const [discountApplied, setDiscountApplied] = useState(false);
  const [discountCode, setDiscountCode] = useState("");
  // const [finalPrice, setFinalPrice] = useState(0); // total price
  // const [totalPrice, setTotalPrice] = useState(0); // subtotal price
  const [promoArr, setPromoArr] = useState<CartItem[]>([]);
  const [hasLoadedStorage, setHasLoadedStorage] = useState(false);

  const { cartQuantity, setCartQuantity, price, setPrice } = useCart();
  const { setUnlockOfferModal } = useModals();
  const { setSelectedOffer } = useRingOffer();
  // console.log("selectedOffer", selectedOffer);

  const basePrice = Number(config.BASE_PRICE);

  useEffect(() => {
    const loggedInUser = localStorage.getItem("loggedInUser");
    if (loggedInUser) {
      const parsedValue = JSON.parse(loggedInUser);
      setLoggedIn(parsedValue?.email);
    }
  }, [loggedIn, isModalOpen]);

  useEffect(() => {
    const data = localStorage.getItem("selectedRingDetails");
    if (data) {
      setCartItems(JSON.parse(data));
      setHasLoadedStorage(true);
      // const totalPr = JSON.parse(data).reduce((acc: any, item: any) => {
      //   return acc + (item.basePrice ?? 0) * item.quantity;
      // }, 0);

      // setFinalPrice(totalPr);
      // setTotalPrice(totalPr);
    }
  }, []);

  useEffect(() => {
    if (!hasLoadedStorage) {
      return;
    }

    const total = cartItems.reduce((acc, item) => {
      return acc + (item.basePrice ?? 0) * item.quantity;
    }, 0);

    const quantity = cartItems.reduce((acc, item) => {
      return acc + item.quantity;
    }, 0);

    let flatCart = [];

    flatCart = cartItems.flatMap(item =>
      Array.from({ length: item.quantity }, () => ({
        ...item,
        quantity: 1,
      }))
    );

    console.log("product cart: ", {
      cartItems,
      prev: cartQuantity,
      curr: quantity,
    });

    // changing quantity - show/trigger offers
    if (quantity >= 6 && quantity < 11) {
      console.log("promo1");
      if (cartQuantity <= 5 && quantity === 6) {
        // show promo 1 and apply promo 1 - apply promo 1 means show promo1 UNLOCKED REWARDS SECTION and apply discount wiht promo1
        setUnlockOfferModal("Buy 6, Pay for Just 5!");
      }
      setSelectedOffer(prev => {
        return {
          ...prev,
          PROMO_OFFER_1: "Buy 6, Pay for Just 5!",
          PROMO_OFFER_2: "",
        };
      });
      setDiscount(0);
      setDiscountApplied(false);
      setDiscountCode("");
      setPromoArr(flatCart.slice(flatCart.length - 1));
      localStorage.setItem(
        "selectedOffer",
        JSON.stringify({
          PROMO_OFFER_1: "Buy 6, Pay for Just 5!",
          PROMO_OFFER_2: "",
        })
      );
      setPrice({
        subTotal: total,
        total: (quantity - 1) * basePrice,
      });
    } else if (quantity >= 11) {
      console.log("promo2");
      if (cartQuantity <= 10 && quantity === 11) {
        // show promo 2 and apply promo 2 - show promo2 UNLOCKED REWARDS SECTION and apply discount with promo2
        setUnlockOfferModal("Buy 11, Pay for Just 9!");
      }
      setSelectedOffer(prev => {
        return {
          ...prev,
          PROMO_OFFER_1: "",
          PROMO_OFFER_2: "Buy 11, Pay for Just 9!",
        };
      });
      setDiscount(0);
      setDiscountApplied(false);
      setDiscountCode("");
      setPromoArr(flatCart.slice(flatCart.length - 2));
      localStorage.setItem(
        "selectedOffer",
        JSON.stringify({
          PROMO_OFFER_1: "",
          PROMO_OFFER_2: "Buy 11, Pay for Just 9!",
        })
      );
      setPrice({
        subTotal: total,
        total: (quantity - 2) * basePrice,
      });
    } else {
      setSelectedOffer(prev => {
        return {
          ...prev,
          PROMO_OFFER_1: "",
          PROMO_OFFER_2: "",
        };
      });
      setDiscount(0);
      setDiscountApplied(false);
      setDiscountCode("");
      setPromoArr([]);
      localStorage.setItem(
        "selectedOffer",
        JSON.stringify({
          PROMO_OFFER_1: "",
          PROMO_OFFER_2: "",
        })
      );
      setPrice({
        subTotal: total,
        total: total,
      });
    }

    setCartQuantity(quantity);
  }, [cartItems, hasLoadedStorage]);

  useEffect(() => {
    if (!discount) {
      return;
    }
    const discountAmt = (price.subTotal * discount) / 100;
    setPrice(prev => {
      return {
        ...prev,
        total: prev.subTotal - discountAmt,
      };
    });
  }, [discount]);

  const handleQuantityChange = (index: number, delta: number) => {
    const updatedItems = [...cartItems];
    const newQuantity = updatedItems[index].quantity + delta;
    updatedItems[index].quantity = Math.max(1, newQuantity);
    setCartItems(updatedItems);
    localStorage.setItem("selectedRingDetails", JSON.stringify(updatedItems));
  };

  const handleDeleteItem = (index: number): void => {
    setCartItems(prevItems => {
      const updated = prevItems.filter((_, i) => i !== index);
      localStorage.setItem("selectedRingDetails", JSON.stringify(updated));
      return updated;
    });
  };

  console.log("Price Cart Page: ", price);
  // console.log("selected Offer: ", selectedOffer);

  return (
    <div className="min-h-screen bg-black text-white flex flex-col items-center justify-start">
      <div className="min-h-screen bg-black text-white p-4 md:p-4 mt-28 w-full max-w-7xl">
        <h2 className="text-[20px] font-bold font-mulish mb-6 flex items-center gap-2 ">
          <span className=" cursor-pointer" onClick={() => router.back()}>
            &larr;
          </span>
          <span className="leading-[25px] w-[176px]"> Shopping Cart</span>
        </h2>

        <div className="w-full flex flex-col lg:flex-row gap-5">
          <CartItems
            cartItems={cartItems}
            setCartItems={setCartItems}
            promoArr={promoArr}
            setPromoArr={setPromoArr}
            handleDeleteItem={handleDeleteItem}
            handleQuantityChange={handleQuantityChange}
            ringDetailsMap={ringDetailsMap}
          />
          <OrderSummary
            discount={discount}
            setDiscount={setDiscount}
            discountApplied={discountApplied}
            setDiscountApplied={setDiscountApplied}
            discountCode={discountCode}
            setDiscountCode={setDiscountCode}
            price={price}
            loggedIn={loggedIn}
            cartIsEmpty={cartItems.length === 0} // ✅ Add this
          />
        </div>
      </div>
    </div>
  );
};

export default Cart;
