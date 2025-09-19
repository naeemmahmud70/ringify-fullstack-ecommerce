"use client";
import React from "react";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";

import { useAuthModal } from "@/store/loginModal";
import { useLoggedInUser } from "@/store/users";

import { Button } from "../ui/button";
import { OfferT } from "../Cart/CartItems";

interface OrderSummaryProps {
  ringQuantity: number;
  basePrice: number;
  freeRings: number;
  selectedOffer: OfferT;
}

const CheckoutSummary: React.FC<OrderSummaryProps> = ({
  ringQuantity,
  basePrice,
  freeRings,
  selectedOffer,
}) => {
  const router = useRouter();
  const { loggedInUser } = useLoggedInUser();
  const { setIsAuthModalOpen, setBackgroundPath } = useAuthModal();
  const routePathname = usePathname();

  const handleCheckout = () => {
    if (loggedInUser?.id) {
      router.push("/product/smart-rings/checkout");
    } else {
      setIsAuthModalOpen(true);
      setBackgroundPath(routePathname);
      router.push("/login");
    }
  };

  return (
    <div className="w-full ">
      <div className="space-y-5 border border-white/20 rounded-xl p-4">
        <div className="flex justify-between text-sm-xs text-white font-medium font-poppins">
          <p className="font-poppins font-normal text-[18px] leading-[100%] tracking-[0%] align-middle text-[#FFFFFFB2]">
            Subtotal
          </p>
          <p className="font-semibold">
            ${(ringQuantity * basePrice).toFixed(2)}
          </p>
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
              ? ((ringQuantity - freeRings) * basePrice).toFixed(2)
              : (ringQuantity * basePrice).toFixed(2)}
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
              Proceed to Pay
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
  );
};

export default CheckoutSummary;
