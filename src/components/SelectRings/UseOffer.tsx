"use client";
import React, { useEffect } from "react";
import Image from "next/image";

import { Button } from "@/components/ui/button";
import { useRingOffer } from "@/store/users";

import selected from "../../../public/products/selected.svg";
import {
  getSelectedOffer,
  handleSelectOfferOne,
  handleSelectOfferTwo,
} from "../../utils/selectedOffer";
interface priceProp {
  basePrice: number;
  currentDate: string;
  OfferOneText: string;
  offerTwoText: string;
  offerOneThreshold: number;
  offerTwoThreshold: number;
  localSelectedRings: number;
}

const UseOffer: React.FC<priceProp> = ({
  basePrice,
  currentDate,
  OfferOneText,
  offerTwoText,
  offerOneThreshold,
  offerTwoThreshold,
  localSelectedRings,
}) => {
  const { selectedOffer, setSelectedOffer } = useRingOffer();

  useEffect(() => {
    const offer = getSelectedOffer();
    if (offer) {
      setSelectedOffer(offer);
    }
  }, []);

  useEffect(() => {
    if (
      localSelectedRings >= offerOneThreshold &&
      localSelectedRings < offerTwoThreshold
    ) {
      handleSelectOfferOne(OfferOneText);
    }
    if (localSelectedRings >= offerTwoThreshold) {
      handleSelectOfferTwo(offerTwoText);
    }
  }, [localSelectedRings]);

  return (
    <div className="bg-[#131313] p-[20px] lg:p-[30px] lg:max-w-[564px] md:w-full rounded-xl mt-5 md:mt-0">
      <h1 className="text-white text-[48px] font-mulish font-bold leading-[120%] h-[58px] tracking-[-0.025em] w-[208px]">
        BAAI Zen
      </h1>
      <div className="flex items-center text-white text-base-lg font-poppins font-normal leading-[29px] tracking-tight mt-2">
        {"$" + basePrice}
        <span className="ml-2 mt-2 font-poppins font-normal text-[12px] leading-[120%] text-[#8F8F8F]">
          (inclusive of all taxes)
        </span>
      </div>
      {/* <span className="font-poppins font-normal text-[16px] leading-[120%] text-[#8F8F8F]"><p>(incl. of all taxes)</p></span> */}
      <div className="border-[1px] border-solid border-[#292929] mt-3"></div>
      <p className="text-[#8F8F8F] text-xs font-poppins font-normal tracking-tight mt-8 leading-[24px] w-[511px]">
        Dispatch by :{" "}
        <span className="text-white">
          {currentDate} <br className="blcok lg:hidden" />
        </span>
        (2 months from today - tentative)
      </p>

      <div className="flex gap-4 flex-col md:flex-row mt-5 ">
        <Button
          className={`w-full md:w-[50%] h-[60px] px-4  text-center rounded-xl text-white text-xs font-poppins font-normal tracking-tighter whitespace-nowrap overflow-hidden text-ellipsis cursor-auto ${localSelectedRings > 10 && selectedOffer.PROMO_OFFER_2 === offerTwoText ? "bg-[#CFFF6533] hover:bg-[#CFFF6533] border-[1px] border-[#CFFF65]" : "bg-[#CFFF650D] hover:bg-[#CFFF650D]"}`}
        >
          Buy 11, Pay for Just 9!
          {localSelectedRings > 10 &&
            selectedOffer.PROMO_OFFER_2 === offerTwoText && (
              <Image src={selected} alt="selected" />
            )}
        </Button>
        <Button
          className={`w-full md:w-[50%]  h-[60px] px-4  text-center rounded-xl text-white text-xs font-poppins font-normal tracking-tighter whitespace-nowrap overflow-hidden text-ellipsis cursor-auto ${localSelectedRings >= offerOneThreshold && localSelectedRings < offerTwoThreshold && selectedOffer.PROMO_OFFER_1 === OfferOneText ? "bg-[#CFFF6533] hover:bg-[#CFFF6533] border-[1px] border-[#CFFF65]" : "bg-[#CFFF650D] hover:bg-[#CFFF650D]"}`}
        >
          Buy 6, Pay for Just 5!{" "}
          {localSelectedRings >= offerOneThreshold &&
            localSelectedRings < offerTwoThreshold &&
            selectedOffer.PROMO_OFFER_1 === OfferOneText && (
              <Image src={selected} alt="selected" />
            )}
        </Button>
      </div>
    </div>
  );
};

export default UseOffer;
