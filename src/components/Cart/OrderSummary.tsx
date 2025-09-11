"use client";
import React, { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useRouter } from "next/navigation";

import { useLoginModal } from "@/store/loginModal";
import { useToastStore } from "@/store/toast";
import { useRingOffer } from "@/store/users";

import editIcon from "../../../public/products/editDiscountCode.svg";
import { getSelectedOffer } from "../../../utils/selectedOffer";
import { Button } from "../ui/button";
import CircularLoader from "../ui/CircularLoader";

type CartItem = {
  size: string;
  color: string;
  quantity: number;
  basePrice: number;
  currencySymbol: string;
};

type Price = {
  subTotal: number;
  total: number;
};
interface OrderSummaryProps {
  discount: number;
  setDiscount: (value: number) => void;
  loggedIn: string;
  cartIsEmpty: boolean; // ✅ Add this line
  price: Price;
  discountApplied: boolean;
  setDiscountApplied: (value: boolean) => void;
  discountCode: string;
  setDiscountCode: (value: string) => void;
}

const OrderSummary: React.FC<OrderSummaryProps> = ({
  discount,
  loggedIn,
  setDiscount,
  discountApplied,
  setDiscountApplied,
  discountCode,
  setDiscountCode,
  cartIsEmpty,
  price,
}) => {
  const { isModalOpen, setIsModalOpen } = useLoginModal();
  const pathname = usePathname();
  const router = useRouter();
  const { SetToastStates } = useToastStore.getState();
  const [loading, setLoading] = useState(false);
  const [loggedInUser, setLoggedInUser] = useState(null);
  const [, setCartItems] = useState<CartItem[]>([]); // Skip the unused variable
  const { selectedOffer, setSelectedOffer } = useRingOffer();

  useEffect(() => {
    const offer = getSelectedOffer();
    if (offer) {
      setSelectedOffer(offer);
    }
  }, []);
  useEffect(() => {
    const data = localStorage.getItem("selectedRingDetails");
    if (data) {
      setCartItems(JSON.parse(data));
    }

    const loggedInUser = localStorage.getItem("loggedInUser");
    if (loggedInUser) {
      const parsedValue = JSON.parse(loggedInUser);
      setLoggedInUser(parsedValue);
    }
    const discount = localStorage.getItem("discountDetails");
    if (discount) {
      const parsedValue = JSON.parse(discount);
      setDiscount(parsedValue?.discountPercentage);
      setDiscountCode(parsedValue?.discountCode);
      setDiscountApplied(true);
    }
  }, [isModalOpen]);

  const handleDiscount = (code: string) => {
    setDiscountCode(code);
    setDiscountApplied(false);
    setDiscount(0);
    localStorage.removeItem("discountDetails");
  };

  const handleDiscountVerify = async () => {
    if (cartIsEmpty) {
      SetToastStates({
        message:
          "Please add items to your cart before applying a discount code.",
        variant: "error",
        triggerId: Date.now(),
      });
    } else {
      if (!loggedInUser) {
        setIsModalOpen(true);
        return;
      }

      // try {
      //   setLoading(true);
      //   const data = await verifyDiscountCode(discountCode);

      //   if (data?.isValidDiscountCode) {
      //     handleDiscountDetails(discountCode);
      //   } else {
      //     setDiscount(0);
      //     SetToastStates({
      //       message: "Invalid discount code!",
      //       variant: "error",
      //       triggerId: Date.now(),
      //     });
      //   }
      //   setLoading(false);
      // } catch (err) {
      //   setLoading(false);

      // }
    }
  };

  const handleDiscountDetails = async (discountCode: string) => {
    // try {
    //   const data = await discountCodeDetails(discountCode);
    //   if (data?.discountPercentage) {
    //     setDiscount(data.discountPercentage);
    //     setDiscountApplied(true);
    //     localStorage.setItem("discountDetails", JSON.stringify(data));
    //   }
    // } catch (error: any) {
    //   console.log("err", error.message);
    // }
  };

  const handleAddPramas = () => {
    const currentPath = pathname;
    const searchParams = new URLSearchParams(window.location.search);
    searchParams.set("checkout", "true");
    router.push(`${currentPath}?${searchParams.toString()}`);
  };

  useEffect(() => {
    if (cartIsEmpty) {
      setDiscount(0);
      setDiscountCode("");
      setDiscountApplied(false);
      localStorage.removeItem("discountDetails"); // Optional: clear persisted coupon
    }
  }, [cartIsEmpty]);

  // console.log("slectedoffer : ", { selectedOffer, totalPrice });

  return (
    <div className="w-full lg:w-2/5 space-y-6">
      <div className="w-full ">
        <div className="flex justify-between mb-5 border border-[#FFFFFF33] h-[74px] md:h-[88px] rounded-xl  ">
          {selectedOffer.PROMO_OFFER_1.length ||
          selectedOffer.PROMO_OFFER_2.length ? (
            <div className="flex justify-between items-center w-full max-w-[90%]  mx-auto mb-4  py-1 rounded-xl mt-4 origin-top">
              <div className="flex items-center gap-2">
                <Image
                  width={24}
                  height={24}
                  src="/cartpage/Discount Arrow.svg"
                  alt="Discount Icon"
                  className="w-[24px] h-[24px] justify-self-start"
                />
                <p className="text-[18px] text-white font-poppins font-normal">
                  {selectedOffer.PROMO_OFFER_1
                    ? selectedOffer.PROMO_OFFER_1
                    : selectedOffer.PROMO_OFFER_2}
                </p>
              </div>

              <Button
                disabled={loading || discountApplied || discountCode.length < 4}
                style={{ width: "119px", height: "42px" }}
                className="text-[#FFFFFF] text-[16px] font-poppins  font-medium bg-transparent hover:bg-transparent  rounded-full border border-green-custom inline-block"
              >
                Applied
              </Button>
            </div>
          ) : (
            <div className="flex justify-between items-center w-full max-w-[90%]  mx-auto mb-4  py-1 rounded-xl mt-4 origin-top">
              <Image
                width={21}
                height={21}
                src="/cartpage/Discount Arrow.svg"
                alt="Discount Icon"
                className="w-[21px] h-[21px] justify-self-start"
              />
              <input
                type="text"
                name="discountCode"
                readOnly={discountApplied}
                value={discountCode}
                maxLength={6}
                placeholder="Discount Code"
                className="w-[65%] bg-transparent text-[#FFFFFFB2] text-sm-xs font-poppins gap-8  px-1   outline-none border-0 hover:border-0"
                onChange={e => handleDiscount(e.target.value)}
              />

              {discountApplied && (
                <Button
                  onClick={() => {
                    setDiscountApplied(false);
                    setDiscount(0); // reset discount
                    setDiscountCode(""); // clear input
                    localStorage.removeItem("discountDetails"); // clear stored code
                  }}
                  className="bg-transparent hover:bg-transparent mt-1 py-4 border-0 pr-5 border-red-500 scale-[1.15]"
                >
                  <Image src={editIcon} alt="edit" />
                </Button>
              )}

              {loading ? (
                <CircularLoader />
              ) : (
                <Button
                  disabled={
                    loading || discountApplied || discountCode.length < 4
                  }
                  onClick={handleDiscountVerify}
                  style={{ width: "119px", height: "42px" }}
                  className="text-[#FFFFFF] text-[16px] font-poppins  font-medium bg-transparent hover:bg-transparent  rounded-full border border-green-custom inline-block"
                >
                  {discountApplied ? <span>Applied</span> : <span>Apply</span>}
                </Button>
              )}
            </div>
          )}
        </div>

        <div className="space-y-5 mt-3 border border-white/20 rounded-xl p-4">
          <p
            className="text-[16px] font-medium mb-4 mt-5 font-poppins text-white leading-[30px] whitespace-nowrap"
            style={{
              width: "162px",
              verticalAlign: "middle",
              letterSpacing: "0",
            }}
          >
            Order Summary
          </p>
          <div className="flex justify-between text-sm-xs text-white font-medium font-poppins">
            <p className="font-poppins font-normal text-[18px] leading-[100%] tracking-[0%] align-middle text-[#FFFFFFB2]">
              Subtotal
            </p>
            {/* <p className="font-semibold">{formatPrice(totalPrice)}</p> */}
            <p className="font-semibold">{price.subTotal}</p>
          </div>

          <div className="flex justify-between">
            <p className="text-sm-xs text-[#FFFFFFB2] font-normal font-poppins">
              Discount ({`${discount === 0 ? 0 : -discount}%`})
            </p>
            <p
              className={`text-sm-xs ${discount ? "text-[#25B021]" : "text-white"} font-bold font-poppins`}
            >
              {/* {currencySymbol} {convertedDiscount.toFixed(2)} */}
              {/* {formatPrice((totalPrice * discount) / 100)} */}
              {(price.subTotal * discount) / 100}
            </p>
          </div>

          <hr className="border-[#FFFFFF33] my-2" />

          <div className="flex justify-between items-start text-[20px] text-white font-medium font-poppins ">
            {/* Left section: Total + taxes */}
            <div className="flex flex-col xs:flex-row sm:items-center gap-1 flex-wrap">
              <span className="font-poppins font-normal text-[20px] leading-[100%] tracking-[0%]">
                Total
              </span>
              <span className="text-[12px] leading-[120%] text-[#8F8F8F] font-normal text-center sm:text-start mt-1 sm:mt-0">
                (inclusive of all taxes)
              </span>
            </div>
            {/* Price */}
            <span className="text-[20px] font-bold font-poppins leading-[100%]">
              {/* {formatPrice(finalPrice)} */}
              {price.total}
            </span>
          </div>

          <div className="flex flex-col justify-center overflow-x-hidden">
            {loggedIn ? (
              <Link
                href="/product/baai-zen-smart-rings/checkout-page"
                className={`mx-auto mt-6 w-full md:w-[457px] h-[60px] rounded-full px-6 py-3 transition flex justify-center items-center gap-3 
                  ${cartIsEmpty ? "bg-[#25B021]/50 cursor-not-allowed" : "bg-[#25B021] text-white"}`}
                onClick={e => {
                  if (cartIsEmpty) {
                    e.preventDefault();
                  }
                }}
              >
                <span
                  id="checkout-page-without-loggedIn"
                  className="font-medium mt-2 text-[18px] leading-[100%] tracking-normal font-poppins whitespace-nowrap"
                  style={{ width: "141px", height: "27px" }}
                >
                  Go to Checkout
                </span>
                <Image
                  width={18}
                  height={18}
                  src="/cartpage/arrows.svg"
                  alt="arrow"
                  className="w-[18px] h-[18px]"
                />
              </Link>
            ) : (
              <Button
                onClick={() => {
                  if (cartIsEmpty) {
                    return;
                  }
                  handleAddPramas();
                  setIsModalOpen(true);
                }}
                disabled={cartIsEmpty}
                className={`mx-auto mt-6 w-full max-w-xs sm:max-w-sm md:max-w-md lg:max-w-[457px]
                rounded-full px-6 p-7 flex justify-center items-center gap-3
                ${
                  cartIsEmpty
                    ? "bg-[#25B021]/50  text-white cursor-not-allowed"
                    : "bg-[#25B021] text-white cursor-pointer"
                }
              `}
                style={{
                  backgroundColor: cartIsEmpty
                    ? "rgba(37, 176, 33, 0.5)"
                    : "#25B021",
                  cursor: cartIsEmpty ? "not-allowed" : "pointer",
                }}
              >
                <span
                  id="checkout-page"
                  className="py-1 font-medium text-[18px] leading-[100%] tracking-normal font-poppins whitespace-nowrap"
                  style={{ width: "141px", height: "27px" }}
                >
                  Go to Checkout
                </span>
                <Image
                  width={18}
                  height={18}
                  src="/cartpage/arrows.svg"
                  alt="arrow"
                  className="w-[18px] h-[18px]"
                />
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderSummary;
