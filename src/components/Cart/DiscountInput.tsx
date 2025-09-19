import React from "react";
import { usePathname, useRouter } from "next/navigation";

import { useAuthModal } from "@/store/loginModal";
import { useLoggedInUser } from "@/store/users";
import { Button } from "../ui/button";
import Image from "next/image";
import { OfferT } from "./CartItems";

interface OrderSummaryProps {
  freeRings: number;
  selectedOffer: OfferT;
}

const DiscountInput: React.FC<OrderSummaryProps> = ({
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
    <div className="w-full">
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
              <p className="text-[16px] md:text-[18px] text-white font-poppins font-normal">
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
              <p className="text-[16px] md:text-[18px] text-white font-poppins font-normal">
                Have a discount code?
              </p>
            </div>

            <Button
              onClick={handleCheckout}
              className="text-[#FFFFFF] py-1 px-5 text-[16px] font-poppins  font-medium bg-transparent hover:bg-transparent  rounded-full border border-[#25B021] inline-block"
            >
              <span>Apply</span>
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default DiscountInput;
