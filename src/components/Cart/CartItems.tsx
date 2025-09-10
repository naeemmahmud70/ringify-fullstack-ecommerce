"use client";
import React, { useEffect, useState } from "react";

import { useRingOffer } from "@/store/users";

import ringDetailsMap from "./ringDetailsMap";

type CartItem = {
  size: string;
  color: string;
  quantity: number;
  basePrice?: number;
  currencySymbol?: string;
};
interface CartItemsProps {
  cartItems: CartItem[];
  setCartItems: React.Dispatch<React.SetStateAction<CartItem[]>>;
  promoArr: CartItem[];
  setPromoArr: React.Dispatch<React.SetStateAction<CartItem[]>>;
  handleDeleteItem: (index: number) => void;
  handleQuantityChange: (index: number, delta: number) => void;
  ringDetailsMap: Record<string, { image: string; price: number }>;
}

const CartItems: React.FC<CartItemsProps> = ({
  cartItems,
  setCartItems,
  promoArr,
  handleDeleteItem,
  handleQuantityChange,
}) => {
  const [pendingIndex, setPendingIndex] = useState<number | null>(null);
  const [showPrompt, setShowPrompt] = useState(false);
  const [showSizeSelector, setShowSizeSelector] = useState(false);
  const [selectedSize, setSelectedSize] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const { selectedOffer, setSelectedOffer } = useRingOffer();

  useEffect(() => {
    const selectedOfferLocal = localStorage.getItem("selectedOffer");
    if (selectedOfferLocal) {
      setSelectedOffer(JSON.parse(selectedOfferLocal));
    }
  }, []);

  const handlePlusClick = (index: number) => {
    const totalQuantity = cartItems.reduce(
      (sum, item) => sum + item.quantity,
      0
    );

    if (totalQuantity >= 15) {
      setError("Maximum 15 rings allowed at a time!");
      return;
    }

    setError(null); // Clear previous error if any
    setPendingIndex(index);
    setShowPrompt(true);
  };

  const confirmSameSize = (index: number) => {
    handleQuantityChange(index, 1);
    updateLocalStorage(cartItems); // Ensure sync
    resetPrompt();
  };

  const confirmDifferentSize = () => {
    if (pendingIndex !== null && selectedSize) {
      const item = cartItems[pendingIndex];
      // const newItemKey = `${item.color.toLowerCase()}-${selectedSize}`;

      // Check if item with same color and selected size already exists
      const existingIndex = cartItems.findIndex(
        cartItem =>
          cartItem.color.toLowerCase() === item.color.toLowerCase() &&
          cartItem.size === selectedSize
      );

      let updatedCart: CartItem[] = [];

      if (existingIndex !== -1) {
        // Item exists, increase its quantity
        updatedCart = cartItems.map((ci, idx) =>
          idx === existingIndex ? { ...ci, quantity: ci.quantity + 1 } : ci
        );
      } else {
        // Item doesn't exist, add new item
        const newItem: CartItem = {
          ...item,
          size: selectedSize,
          quantity: 1,
        };
        updatedCart = [...cartItems, newItem];
      }

      setCartItems(updatedCart);
      updateLocalStorage(updatedCart);
      console.log(
        "Updated selectedRingDetails in localStorage:",
        JSON.parse(localStorage.getItem("selectedRingDetails") || "[]")
      );
      resetPrompt();
    }
  };

  const resetPrompt = () => {
    setPendingIndex(null);
    setShowPrompt(false);
    setShowSizeSelector(false);
    setSelectedSize(null);
  };

  const updateLocalStorage = (items: CartItem[]) => {
    if (typeof window !== "undefined") {
      localStorage.setItem("selectedRingDetails", JSON.stringify(items));
    }
  };

  const formatColor = (color: string) => {
    const colorMap: Record<string, string> = {
      black: "Black",
      silver: "Silver",
      rosegold: "Rose Gold",
    };
    return colorMap[color.toLowerCase()] || color;
  };

  return (
    <div className="w-full lg:w-3/5 flex-col gap-4 items-center p-4 border border-white/20 rounded-[12px]">
      {cartItems.length === 0 ? (
        <p>Your cart is empty.</p>
      ) : (
        <>
          {(selectedOffer.PROMO_OFFER_1 !== "" ||
            selectedOffer.PROMO_OFFER_2 !== "") && (
            <div className="w-full flex flex-col items-start gap-4 mb-[24px]">
              <div className="font-mulish font-bold text-[20px] leading-[125%] tracking-[-0.025em] px-[16px] pt-[16px]">
                Unlocked Rewards
              </div>
              {promoArr &&
                promoArr.map((item, index) => {
                  const ringDetails =
                    ringDetailsMap[item.color.toLowerCase()] || {};

                  return (
                    <React.Fragment key={index}>
                      <div className="hidden lg:block w-full justify-center ml-0">
                        <div className="w-full justify-center ml-0 -m-3">
                          <div
                            className="flex flex-wrap gap-4 items-center p-4 rounded-xl w-full"
                            style={{ minHeight: "124px" }}
                          >
                            <img
                              src={ringDetails.image || "/fallback.svg"}
                              alt="Product"
                              className="object-contain"
                              style={{
                                width: "124px",
                                height: "124px",
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
                      </div>

                      {/* Mobile View */}

                      <div className="block lg:hidden w-full rounded-xl mb-4">
                        <div className="flex justify-between items-center gap-3">
                          {/* Image + Info */}
                          <div className="flex gap-3">
                            <img
                              src={ringDetails.image || "/fallback.svg"}
                              alt="Product"
                              className="object-cover rounded-md"
                              style={{ width: "80px", height: "80px" }}
                            />
                            <div className="flex-1 text-white text-[12px] sm:text-xs leading-tight flex flex-col justify-start items-start mt-1">
                              <p className="w-[88px] h-[30px] font-poppins font-medium text-[20px] leading-[100%] tracking-[0%] align-middle whitespace-nowrap">
                                BAAI Zen
                              </p>
                              <p className="w-[52px] h-[21px] font-poppins font-normal text-[14px] leading-[100%] tracking-[0%] text-white/80 whitespace-nowrap">
                                Size: {item.size}
                              </p>
                              <p className="w-[82px] h-[21px] font-poppins font-normal text-[14px] mt-1  leading-[100%] tracking-[0%] text-white/80 whitespace-nowrap">
                                Color: {formatColor(item.color)}
                              </p>
                              <p className="w-[px] h-[36px] font-poppins font-semibold text-[24px] leading-[100%] tracking-[0%] text-white align-middle mt-2">
                                {item.basePrice !== undefined && (
                                  <span>
                                    {item.currencySymbol}
                                    {item.basePrice * item.quantity}
                                    <p className=" mt-2 text-[12px] whitespace-nowrap font-normal leading-[100%] font-poppins text-[#8F8F8F]">
                                      (inclusive of all the taxes)
                                    </p>
                                  </span>
                                )}
                              </p>
                            </div>
                          </div>

                          {/* Quantity + Delete */}
                          <div className="flex flex-col items-end gap-2 self-start">
                            <button
                              onClick={() => {
                                handleDeleteItem(index);
                                const updatedCart = cartItems.filter(
                                  (_, i) => i !== index
                                );
                                setCartItems(updatedCart);
                                updateLocalStorage(updatedCart);
                              }}
                              title="Remove item"
                            >
                              <img
                                src="/cartpage/cross.svg"
                                alt="Remove"
                                className="w-[10px] h-[10px]"
                              />
                            </button>

                            <div
                              className=" flex items-center gap-2 rounded-full px-2 py-1 mt-16 -mr-3"
                              style={{ background: "#F0F0F04D" }}
                            >
                              <button
                                onClick={() => {
                                  if (item.quantity === 1) {
                                    handleDeleteItem(index);
                                    const updatedCart = cartItems.filter(
                                      (_, i) => i !== index
                                    );
                                    setCartItems(updatedCart);
                                    updateLocalStorage(updatedCart);
                                  } else {
                                    const updatedCart = cartItems.map(
                                      (ci, i) =>
                                        i === index
                                          ? {
                                              ...ci,
                                              quantity: ci.quantity - 1,
                                            }
                                          : ci
                                    );
                                    setCartItems(updatedCart);
                                    updateLocalStorage(updatedCart);
                                  }
                                }}
                              >
                                <img
                                  src="/cartpage/minus.svg"
                                  alt="-"
                                  className="w-3 h-3"
                                />
                              </button>
                              <span>{item.quantity}</span>
                              <button onClick={() => handlePlusClick(index)}>
                                <img
                                  src="/cartpage/plus.svg"
                                  alt="+"
                                  className="w-3 h-3"
                                />
                              </button>
                            </div>
                          </div>
                        </div>

                        {/* Prompt after + */}
                        {showPrompt &&
                          pendingIndex === index &&
                          !showSizeSelector && (
                            <div className="mt-4 text-white">
                              <p className="mb-2 text-xm">
                                Do you want to purchase the ring of same size?
                              </p>
                              <div className="flex gap-4">
                                <button
                                  className="bg-green-custom px-3 py-1 rounded-full text-xm"
                                  onClick={() => confirmSameSize(index)}
                                >
                                  Yes
                                </button>
                                <button
                                  className="bg-gray-600 px-3 py-1 rounded-full text-xm"
                                  onClick={() => setShowSizeSelector(true)}
                                >
                                  No
                                </button>
                              </div>
                            </div>
                          )}

                        {/* Size Selector */}
                        {showPrompt &&
                          pendingIndex === index &&
                          showSizeSelector && (
                            <div className="mt-4 bg-black text-white p-4 rounded-lg">
                              <p className="mb-2 text-xm text-white/70 font-semibold">
                                Select Size
                              </p>
                              <div className="flex gap-2 flex-wrap">
                                {["06", "08", "09", "10", "11", "12", "13"].map(
                                  size => (
                                    <button
                                      key={size}
                                      onClick={() => setSelectedSize(size)}
                                      className={`w-12 h-12 rounded-lg flex items-center  justify-center border ${
                                        selectedSize === size
                                          ? "border-white"
                                          : "border-white/20 bg-white/5"
                                      }`}
                                    >
                                      <span className="text-white text-xm">
                                        {size}
                                      </span>
                                    </button>
                                  )
                                )}
                              </div>
                              <div className="flex gap-4 mt-4">
                                <button
                                  className="w-24 h-9 rounded-full bg-[#25B021] text-xs text-white"
                                  disabled={!selectedSize}
                                  onClick={confirmDifferentSize}
                                >
                                  Confirm
                                </button>
                                <button
                                  className="w-24 h-9 rounded-full bg-[#484848] text-white"
                                  onClick={resetPrompt}
                                >
                                  Cancel
                                </button>
                              </div>
                            </div>
                          )}
                      </div>
                    </React.Fragment>
                  );
                })}
              <div className="w-full border-t border-[#FFFFFF33]"></div>
            </div>
          )}

          {cartItems.map((item, index) => {
            const ringDetails = ringDetailsMap[item.color.toLowerCase()] || {};
            return (
              <React.Fragment key={index}>
                <div className="hidden lg:block w-full justify-center ml-0 -m-3">
                  <div className="w-full justify-center ml-0 -m-3">
                    <div
                      className="flex flex-wrap gap-4 items-center p-4 rounded-xl w-full"
                      style={{ minHeight: "124px" }}
                    >
                      <img
                        src={ringDetails.image || "/fallback.svg"}
                        alt="Product"
                        className="object-contain"
                        style={{
                          width: "124px",
                          height: "124px",
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
                        <p className="text-base-lg font-semibold text-white font-poppins">
                          {item.basePrice !== undefined && (
                            <>
                              <span>{item.basePrice}</span>
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
                              handleDeleteItem(index);
                              const updatedCart = cartItems.filter(
                                (_, i) => i !== index
                              );
                              setCartItems(updatedCart);
                              updateLocalStorage(updatedCart);
                            }}
                            title="Remove item"
                          >
                            <img
                              src="/cartpage/cross.svg"
                              alt="Remove"
                              style={{ width: "10.15px", height: "10.17px" }}
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
                                if (item.quantity === 1) {
                                  handleDeleteItem(index);
                                  const updatedCart = cartItems.filter(
                                    (_, i) => i !== index
                                  );
                                  setCartItems(updatedCart);
                                  updateLocalStorage(updatedCart);
                                } else {
                                  const updatedCart = cartItems.map((ci, i) =>
                                    i === index
                                      ? { ...ci, quantity: ci.quantity - 1 }
                                      : ci
                                  );
                                  setCartItems(updatedCart);
                                  updateLocalStorage(updatedCart);
                                }

                                setError(null); // ✅ Clear error when decreasing quantity
                              }}
                            >
                              <img
                                src="/cartpage/minus.svg"
                                alt="Minus"
                                className="w-4 h-4"
                              />
                            </button>

                            <span className="text-white">{item.quantity}</span>
                            <button
                              onClick={() => handlePlusClick(index)}
                              className="px-1"
                            >
                              <img
                                src="/cartpage/plus.svg"
                                alt="Plus"
                                className="w-4 h-4"
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
                    {showPrompt &&
                      pendingIndex === index &&
                      showSizeSelector && (
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
                  {/* {index !== cartItems.length - 1 && (
                <hr className="border border-white/10 my-2" />
              )} */}
                </div>

                {/* Mobile View */}

                <div className="block lg:hidden w-full rounded-xl mb-4">
                  <div className="flex justify-between items-center gap-3">
                    {/* Image + Info */}
                    <div className="flex gap-3">
                      <img
                        src={ringDetails.image || "/fallback.svg"}
                        alt="Product"
                        className="object-cover rounded-md"
                        style={{ width: "80px", height: "80px" }}
                      />
                      <div className="flex-1 text-white text-[12px] sm:text-xs leading-tight flex flex-col justify-start items-start mt-1">
                        <p className="w-[88px] h-[30px] font-poppins font-medium text-[20px] leading-[100%] tracking-[0%] align-middle whitespace-nowrap">
                          BAAI Zen
                        </p>
                        <p className="w-[52px] h-[21px] font-poppins font-normal text-[14px] leading-[100%] tracking-[0%] text-white/80 whitespace-nowrap">
                          Size: {item.size}
                        </p>
                        <p className="w-[82px] h-[21px] font-poppins font-normal text-[14px] mt-1  leading-[100%] tracking-[0%] text-white/80 whitespace-nowrap">
                          Color: {formatColor(item.color)}
                        </p>
                        <p className="w-[px] h-[36px] font-poppins font-semibold text-[24px] leading-[100%] tracking-[0%] text-white align-middle mt-2">
                          {item.basePrice !== undefined && (
                            <span>
                              {item.currencySymbol}
                              {item.basePrice * item.quantity}
                              <p className=" mt-2 text-[12px] whitespace-nowrap font-normal leading-[100%] font-poppins text-[#8F8F8F]">
                                (inclusive of all the taxes)
                              </p>
                            </span>
                          )}
                        </p>
                      </div>
                    </div>

                    {/* Quantity + Delete */}
                    <div className="flex flex-col items-end gap-2 self-start">
                      <button
                        onClick={() => {
                          handleDeleteItem(index);
                          const updatedCart = cartItems.filter(
                            (_, i) => i !== index
                          );
                          setCartItems(updatedCart);
                          updateLocalStorage(updatedCart);
                        }}
                        title="Remove item"
                      >
                        <img
                          src="/cartpage/cross.svg"
                          alt="Remove"
                          className="w-[10px] h-[10px]"
                        />
                      </button>

                      <div
                        className=" flex items-center gap-2 rounded-full px-2 py-1 mt-16 -mr-3"
                        style={{ background: "#F0F0F04D" }}
                      >
                        <button
                          onClick={() => {
                            if (item.quantity === 1) {
                              handleDeleteItem(index);
                              const updatedCart = cartItems.filter(
                                (_, i) => i !== index
                              );
                              setCartItems(updatedCart);
                              updateLocalStorage(updatedCart);
                            } else {
                              const updatedCart = cartItems.map((ci, i) =>
                                i === index
                                  ? { ...ci, quantity: ci.quantity - 1 }
                                  : ci
                              );
                              setCartItems(updatedCart);
                              updateLocalStorage(updatedCart);
                            }
                          }}
                        >
                          <img
                            src="/cartpage/minus.svg"
                            alt="-"
                            className="w-3 h-3"
                          />
                        </button>
                        <span>{item.quantity}</span>
                        <button onClick={() => handlePlusClick(index)}>
                          <img
                            src="/cartpage/plus.svg"
                            alt="+"
                            className="w-3 h-3"
                          />
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Prompt after + */}
                  {showPrompt &&
                    pendingIndex === index &&
                    !showSizeSelector && (
                      <div className="mt-4 text-white">
                        <p className="mb-2 text-xm">
                          Do you want to purchase the ring of same size?
                        </p>
                        <div className="flex gap-4">
                          <button
                            className="bg-green-custom px-3 py-1 rounded-full text-xm"
                            onClick={() => confirmSameSize(index)}
                          >
                            Yes
                          </button>
                          <button
                            className="bg-gray-600 px-3 py-1 rounded-full text-xm"
                            onClick={() => setShowSizeSelector(true)}
                          >
                            No
                          </button>
                        </div>
                      </div>
                    )}

                  {/* Size Selector */}
                  {showPrompt && pendingIndex === index && showSizeSelector && (
                    <div className="mt-4 bg-black text-white p-4 rounded-lg">
                      <p className="mb-2 text-xm text-white/70 font-semibold">
                        Select Size
                      </p>
                      <div className="flex gap-2 flex-wrap">
                        {["06", "08", "09", "10", "11", "12", "13"].map(
                          size => (
                            <button
                              key={size}
                              onClick={() => setSelectedSize(size)}
                              className={`w-12 h-12 rounded-lg flex items-center  justify-center border ${
                                selectedSize === size
                                  ? "border-white"
                                  : "border-white/20 bg-white/5"
                              }`}
                            >
                              <span className="text-white text-xm">{size}</span>
                            </button>
                          )
                        )}
                      </div>
                      <div className="flex gap-4 mt-4">
                        <button
                          className="w-24 h-9 rounded-full bg-[#25B021] text-xs text-white"
                          disabled={!selectedSize}
                          onClick={confirmDifferentSize}
                        >
                          Confirm
                        </button>
                        <button
                          className="w-24 h-9 rounded-full bg-[#484848] text-white"
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
