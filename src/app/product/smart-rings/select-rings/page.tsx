"use client";

import { useEffect, useRef, useState } from "react";
import { useSearchParams } from "next/navigation";

import ringImages from "@/data/ringsdata.json";
import { useModals } from "@/store/modals";
import { getMonthAfterTwoMonths } from "../../../../../utils/getCurrentDate";
import ProductsCarousel from "@/components/SelectRings/ProductsCarousel";
import UseOffer from "@/components/SelectRings/UseOffer";
import Finish from "@/components/SelectRings/Finish";
import Sizes from "@/components/SelectRings/Sizes";
import Continue from "@/components/SelectRings/Continue";

// import BaaiGen from "./BaaiGen";
// import Continue from "./Continue";
// import Finish from "./Finish";
// import ProductsCarousel from "./ProductsCarousel";
// import Sizes from "./Sizes";

interface selectedRingProps {
  size: string;
  quantity: number;
  color: string;
}
const SelectRing = () => {
  const basePrice = Number(process.env.NEXT_PUBLIC_BASE_PRICE);
  const [selectedRing, setSelectedRing] = useState<number | null>(null);
  const [ringColor, setRingColor] = useState("");
  const [ringSizes, setRingSizes] = useState<selectedRingProps[]>([]);
  const [error, setError] = useState<string>("");
  const searchParams = useSearchParams();
  const paramsColor = searchParams.get("ring");
  const currentDate = getMonthAfterTwoMonths();
  const { setUnlockOfferModal } = useModals();
  const [totalSelected, setTotalSelected] = useState(0);
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

  // console.log("offers", OfferOneText, offerTwoText);
  useEffect(() => {
    const selectedRings = localStorage.getItem("selectedRingDetails");
    if (selectedRings) {
      const parsedValue = JSON.parse(selectedRings ? selectedRings : "");
      if (parsedValue.length) {
        setRingColor(parsedValue[0]?.color);
        setRingSizes(parsedValue);
      }
    }
  }, []);

  useEffect(() => {
    if (paramsColor) {
      setRingColor(paramsColor);

      if (paramsColor === "black") {
        setSelectedRing(1);
      } else if (paramsColor === "silver") {
        setSelectedRing(2);
      } else if (paramsColor === "rosegold") {
        setSelectedRing(3);
      }
    } else {
      const selectedRings = localStorage.getItem("selectedRingDetails");
      if (selectedRings) {
        const parsedValue = JSON.parse(selectedRings || "[]");
        if (parsedValue.length) {
          setRingColor(parsedValue[0]?.color);
          setRingSizes(parsedValue);
        }
      }
    }
  }, [paramsColor]);

  const getTotalQuantity = () => {
    return ringSizes.reduce((sum, item) => sum + item.quantity, 0);
  };

  useEffect(() => {
    const total = getTotalQuantity();
    setTotalSelected(total);

    if (!hasSeenRealTotal.current) {
      prevTotalRef.current = total;
      if (total > 0) {
        hasSeenRealTotal.current = true;
      }
      return;
    }

    const prevTotal = prevTotalRef.current ?? 0;

    if (total > prevTotal) {
      if (total === offerOneThreshold) {
        setUnlockOfferModal(OfferOneText);
      }
      if (total === offerTwoThreshold) {
        setUnlockOfferModal(offerTwoText);
      }
    }

    prevTotalRef.current = total;
  }, [ringSizes]);

  return (
    <div>
      <div className="bg-black flex justify-center">
        <div className="max-w-7xl p-4 md:p-6 lg:p-9 w-full">
          <div className="text-white lg:flex justify-between mt-24">
            <div>
              <div className="lg:sticky lg:top-24 h-fit ml-0 lg:ml-10">
                <ProductsCarousel
                  images={ringImages}
                  selectedRing={selectedRing}
                />
              </div>
            </div>
            <div className="flex flex-col gap-5">
              <UseOffer
                total={totalSelected}
                basePrice={Number(basePrice)}
                currentDate={currentDate}
                OfferOneText={OfferOneText}
                offerTwoText={offerTwoText}
                offerOneThreshold={offerOneThreshold}
                offerTwoThreshold={offerTwoThreshold}
              />
              <Finish
                ringColor={ringColor}
                setRingColor={setRingColor}
                setError={setError}
                setSelectedRing={setSelectedRing}
              />
              <Sizes
                ringSizes={ringSizes}
                setRingSizes={setRingSizes}
                ringColor={ringColor}
                error={error}
                setError={setError}
              />
            </div>
          </div>
        </div>
      </div>

      <div className="bg-black md:bg-[#131313] flex justify-center">
        <div className="max-w-7xl p-4 md:p-6 lg:p-9 w-full mb-16 md:mb-0">
          <Continue
            basePrice={Number(basePrice)}
            ringColor={ringColor}
            ringSizes={ringSizes}
            currentDate={currentDate}
          />
        </div>
      </div>
    </div>
  );
};

export default SelectRing;
