"use client";
import React from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Button } from "../ui/button";
import { OfferT } from "./CartItems";

interface OrderSummaryProps {
  ringQuantity: number;
  basePrice: number;
  freeRings: number;
  selectedOffer: OfferT;
}

const OrderSummary: React.FC<OrderSummaryProps> = ({
  ringQuantity,
  basePrice,
  freeRings,
  selectedOffer,
}) => {
  const router = useRouter();

  const handleCheckout = () => {
    router.push("/product/baai-zen-smart-rings/checkout-page");
  };

  console.log("selectedOffer", selectedOffer);
  return (
    <div className="w-full lg:w-2/5 space-y-6">
      <div className="w-full ">
        <div className="flex justify-between mb-5 border border-[#FFFFFF33] h-[74px] md:h-[88px] rounded-xl  ">
          {(freeRings > 0 && selectedOffer.PROMO_OFFER_1) ||
          selectedOffer.PROMO_OFFER_2 ? (
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
                disabled={
                  selectedOffer.PROMO_OFFER_1 || selectedOffer.PROMO_OFFER_2
                    ? true
                    : false
                }
                style={{ width: "119px", height: "42px" }}
                className="text-[#FFFFFF] text-[16px] font-poppins  font-medium bg-transparent hover:bg-transparent  rounded-full border border-green-custom inline-block"
              >
                Applied
              </Button>
            </div>
          ) : (
            <div className="flex justify-between items-center w-full max-w-[90%]  mx-auto mb-4  py-1 rounded-xl mt-4 origin-top">
              <div className="flex gap-3">
                <Image
                  width={21}
                  height={21}
                  src="/cartpage/Discount Arrow.svg"
                  alt="Discount Icon"
                  className="w-[21px] h-[21px] justify-self-start"
                />
                <span>Have a discount code?</span>
              </div>

              <Link
                href="/product/smart-rings/checkout"
                className="text-[#FFFFFF] py-1 px-5 text-[16px] font-poppins  font-medium bg-transparent hover:bg-transparent  rounded-full border border-[#25B021] inline-block"
              >
                <span>Apply</span>
              </Link>
            </div>
          )}
        </div>

        <div className="space-y-5 mt-3 border border-white/20 rounded-xl p-4">
          <p className="w-[161px] text-[16px] font-medium align-middle tracking-normal mb-4 mt-5 font-poppins text-white leading-[30px] whitespace-nowrap">
            Order Summary
          </p>
          <div className="flex justify-between text-sm-xs text-white font-medium font-poppins">
            <p className="font-poppins font-normal text-[18px] leading-[100%] tracking-[0%] align-middle text-[#FFFFFFB2]">
              Subtotal
            </p>
            <p className="font-semibold">${ringQuantity * basePrice}</p>
          </div>

          <div className="flex justify-between">
            <p className="text-sm-xs text-[#FFFFFFB2] font-normal font-poppins">
              Discount
            </p>
            <p
              className={`text-sm-xs ${
                (freeRings > 0 && selectedOffer.PROMO_OFFER_1.length) ||
                selectedOffer.PROMO_OFFER_2.length
                  ? "text-[#25B021]"
                  : "text-white"
              } font-bold font-poppins`}
            >
              {(freeRings > 0 && selectedOffer.PROMO_OFFER_1.length) ||
              selectedOffer.PROMO_OFFER_2.length ? (
                <>{freeRings} rings free</>
              ) : (
                "$0"
              )}{" "}
            </p>
          </div>

          <hr className="border-[#FFFFFF33] my-2" />

          <div className="flex justify-between items-start text-[20px] text-white font-medium font-poppins ">
            <div className="flex flex-col xs:flex-row sm:items-center gap-1 flex-wrap">
              <span className="font-poppins font-normal text-[20px] leading-[100%] tracking-[0%]">
                Total
              </span>
              <span className="text-[12px] leading-[120%] text-[#8F8F8F] font-normal text-center sm:text-start mt-1 sm:mt-0">
                (inclusive of all taxes)
              </span>
            </div>

            <span className="text-[20px] font-bold font-poppins leading-[100%]">
              $
              {selectedOffer.PROMO_OFFER_1.length ||
              selectedOffer.PROMO_OFFER_2.length
                ? (ringQuantity - freeRings) * basePrice
                : ringQuantity * basePrice}
            </span>
          </div>

          <div className="flex flex-col justify-center overflow-x-hidden">
            <Button
              onClick={handleCheckout}
              disabled={ringQuantity < 1}
              className={`mx-auto mt-6 w-full md:w-[457px] h-[60px] rounded-full px-6 py-3 transition flex justify-center items-center gap-3 
                  ${ringQuantity < 0 ? "bg-[#25B021]/50 cursor-not-allowed" : "bg-[#25B021] hover:bg-[#25B021] text-white"}`}
            >
              <span
                id="checkout-page-without-loggedIn"
                className="w-[141px] h-[27px] font-medium mt-2 text-[18px] leading-[100%] tracking-normal font-poppins whitespace-nowrap"
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
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderSummary;
