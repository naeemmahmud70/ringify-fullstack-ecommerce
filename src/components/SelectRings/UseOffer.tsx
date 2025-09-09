"use client";
import React, { useEffect, useRef, useState } from "react";
import Image from "next/image";

import { Button } from "@/components/ui/button";
import { useRingOffer } from "@/store/users";

import selected from "../../../public/products/selected.svg";
import { getSelectedOffer } from "../../../utils/selectedOffer";
interface priceProp {
  basePrice: number;
  currentDate: string;
  total: number;
  OfferOneText: string;
  offerTwoText: string;
  offerOneThreshold: number;
  offerTwoThreshold: number;
}

const UseOffer: React.FC<priceProp> = ({
  basePrice,
  currentDate,
  total,
  OfferOneText,
  offerTwoText,
  offerOneThreshold,
  offerTwoThreshold,
}) => {
  const scrollRef = useRef<HTMLDivElement>(null);
  const { selectedOffer, setSelectedOffer } = useRingOffer();
  const [hasLoadedStorage, setHasLoadedStorage] = useState(false);

  useEffect(() => {
    const offer = getSelectedOffer();
    if (offer) {
      setSelectedOffer(offer);
    }
    setHasLoadedStorage(true);
  }, []);

  useEffect(() => {
    const slider = scrollRef.current;
    if (!slider) {
      return;
    }

    let isDown = false;
    let startX: number;
    let scrollLeft: number;

    const onMouseDown = (e: MouseEvent) => {
      isDown = true;
      slider.classList.add("cursor-grabbing");
      startX = e.pageX - slider.offsetLeft;
      scrollLeft = slider.scrollLeft;
    };

    const onMouseLeave = () => {
      isDown = false;
      slider.classList.remove("cursor-grabbing");
    };

    const onMouseUp = () => {
      isDown = false;
      slider.classList.remove("cursor-grabbing");
    };

    const onMouseMove = (e: MouseEvent) => {
      if (!isDown) {
        return;
      }
      e.preventDefault();
      const x = e.pageX - slider.offsetLeft;
      const walk = (x - startX) * 1.5; // Scroll speed
      slider.scrollLeft = scrollLeft - walk;
    };

    slider.addEventListener("mousedown", onMouseDown);
    slider.addEventListener("mouseleave", onMouseLeave);
    slider.addEventListener("mouseup", onMouseUp);
    slider.addEventListener("mousemove", onMouseMove);

    return () => {
      slider.removeEventListener("mousedown", onMouseDown);
      slider.removeEventListener("mouseleave", onMouseLeave);
      slider.removeEventListener("mouseup", onMouseUp);
      slider.removeEventListener("mousemove", onMouseMove);
    };
  }, []);

  const handleSelectOne = (offer: string) => {
    const isAlreadySelected = selectedOffer.PROMO_OFFER_1 === offer;

    const newOffer = {
      PROMO_OFFER_1: isAlreadySelected ? "" : offer,
      PROMO_OFFER_2: "",
    };

    setSelectedOffer(newOffer);
    localStorage.setItem("selectedOffer", JSON.stringify(newOffer));
  };
  const handleSelectTwo = (offer: string) => {
    const isAlreadySelected = selectedOffer.PROMO_OFFER_2 === offer;

    const newOffer = {
      PROMO_OFFER_1: "",
      PROMO_OFFER_2: isAlreadySelected ? "" : offer,
    };

    setSelectedOffer(newOffer);
    localStorage.setItem("selectedOffer", JSON.stringify(newOffer));
  };

  useEffect(() => {
    if (!hasLoadedStorage) {
      return;
    }
    setSelectedOffer(prev => {
      const updated = {
        PROMO_OFFER_1: total < offerOneThreshold ? "" : prev.PROMO_OFFER_1,
        PROMO_OFFER_2: total < offerTwoThreshold ? "" : prev.PROMO_OFFER_2,
      };

      localStorage.setItem("selectedOffer", JSON.stringify(updated));

      return updated;
    });
  }, [total]);

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
      <div
        ref={scrollRef}
        className="overflow-x-auto w-full no-scrollbar cursor-grab"
      >
        <div className="flex gap-4 mt-5 min-w-[560px]">
          <Button
            disabled={total > offerTwoThreshold - 1 ? false : true}
            onClick={() => handleSelectTwo(offerTwoText)}
            className={` w-[284px] h-[60px] px-4  text-center rounded-xl text-white text-xs font-poppins font-normal tracking-tighter whitespace-nowrap overflow-hidden text-ellipsis  ${selectedOffer.PROMO_OFFER_2 === offerTwoText ? "bg-[#CFFF6533] hover:bg-[#CFFF6533] border-[1px] border-[#CFFF65]" : "bg-[#CFFF650D] hover:bg-[#CFFF650D]"}`}
          >
            Buy 11, Pay for Just 9! $
            {selectedOffer.PROMO_OFFER_2 === offerTwoText && (
              <Image src={selected} alt="selected" />
            )}
          </Button>
          <Button
            disabled={total > offerOneThreshold - 1 ? false : true}
            onClick={() => handleSelectOne(OfferOneText)}
            className={` w-[284px] h-[60px] px-4  text-center rounded-xl text-white text-xs font-poppins font-normal tracking-tighter whitespace-nowrap overflow-hidden text-ellipsis  ${selectedOffer.PROMO_OFFER_1 === OfferOneText ? "bg-[#CFFF6533] hover:bg-[#CFFF6533] border-[1px] border-[#CFFF65]" : "bg-[#CFFF650D] hover:bg-[#CFFF650D]"}`}
          >
            Buy 6, Pay for Just 5!{" "}
            {selectedOffer.PROMO_OFFER_1 === OfferOneText && (
              <Image src={selected} alt="selected" />
            )}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default UseOffer;
