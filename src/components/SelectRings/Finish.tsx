"use client";
import Image from "next/image";
import Link from "next/link";

import ringImages from "@/data/ringsdata.json";

import selectIcon from "../../../public/products/selected.svg";

interface RingProps {
  ringColor: string;
  setRingColor: (type: string) => void;
  setError: (value: string) => void;
  setSelectedRing: (id: number) => void;
}

const Finish: React.FC<RingProps> = ({
  ringColor,
  setRingColor,
  setError,
  setSelectedRing,
}) => {
  return (
    <div className="bg-[#131313] p-[20px] lg:p-[30px] lg:max-w-[564px] md:w-full rounded-xl">
      <p className="text-[#FFFFFFB2] text-base font-poppins font-semibold">
        Finish
      </p>
      <div className="border-[1px] border-solid border-[#292929] mt-6 mb-8"></div>
      <div className="flex flex-col gap-5">
        {ringImages.map(item => (
          <Link
            href="#"
            key={item.id}
            scroll={false}
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
          </Link>
        ))}
      </div>
    </div>
  );
};

export default Finish;
