"use client";
import { useEffect } from "react";
import Image from "next/image";
import { useSearchParams } from "next/navigation";

import ringImages from "@/data/ringsdata.json";

import selectIcon from "../../../public/products/selected.svg";
import { getSelectedRingDetails } from "../../../utils/selectedRingDetails";

import { selectedRingPropsT } from "./SelectRings";

interface RingProps {
  ringColor: string;
  setRingColor: (type: string) => void;
  setError: (value: string) => void;
  setSelectedRing: (id: number) => void;
  setRingSizes: React.Dispatch<React.SetStateAction<selectedRingPropsT[]>>;
}

const Finish: React.FC<RingProps> = ({
  ringColor,
  setRingColor,
  setError,
  setSelectedRing,
  setRingSizes,
}) => {
  const searchParams = useSearchParams();
  const paramsColor = searchParams.get("ring");

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
      const selectedRings = getSelectedRingDetails();
      if (selectedRings) {
        const parsedValue = selectedRings || "[]";
        if (parsedValue.length) {
          setRingColor(parsedValue[0]?.color);
          setRingSizes(parsedValue);
        }
      }
    }
  }, [paramsColor]);
  return (
    <div className="bg-[#131313] p-[20px] lg:p-[30px] lg:max-w-[564px] md:w-full rounded-xl">
      <p className="text-[#FFFFFFB2] text-base font-poppins font-semibold">
        Finish
      </p>
      <div className="border-[1px] border-solid border-[#292929] mt-6 mb-8"></div>
      <div className="flex flex-col gap-5">
        {ringImages.map(item => (
          <div
            key={item.id}
            id="buy-ring-finish"
            className={`flex justify-between items-center ${ringColor === item.type ? "bg-[#FFFFFF1A] border-[1px] border-[#FFFFFF66]" : "bg-[#F5F5F50D] "}   p-3 md:p-5 rounded-xl cursor-pointer`}
            onClick={() => {
              setRingColor(item.type);
              setError("");
              setSelectedRing(item.id);
            }}
          >
            <div className="flex gap-7 items-center ">
              <Image src={item.url} height={70} width={70} alt={item.alt} />
              <p className="text-white text-base font-poppins font-normal">
                {item.title}
              </p>
            </div>
            <div>
              {ringColor === item.type && (
                <Image src={selectIcon} height={30} width={30} alt={item.alt} />
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Finish;
