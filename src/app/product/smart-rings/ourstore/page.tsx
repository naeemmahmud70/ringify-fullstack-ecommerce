import React from "react";
import HeroBanner from "@/components/OurStore/HeroBanner";
import RingCards from "@/components/OurStore/RingCards";

const rings = [
  {
    name: "BAAI Zen Smart Ring | Black",
    description:
      "Track 10+ bio-markers with AI insights, 8 days battery life, 5 ATM waterproof, plus blockchain-secured rewards.",
    price: "$145",
    type: "black",
  },
  {
    name: "BAAI Zen Smart Ring | Rose gold",
    description:
      "Track 10+ bio-markers with AI insights, 8 days battery life, 5 ATM waterproof, plus blockchain-secured rewards.",
    price: "$145",
    type: "rosegold",
  },
  {
    name: "BAAI Zen Smart Ring | Silver",
    description:
      "Track 10+ bio-markers with AI insights, 8 days battery life, 5 ATM waterproof, plus blockchain-secured rewards.",
    price: "$145",
    type: "silver",
  },
];

const OurStore: React.FC = () => {
  return (
    <div className=" bg-black text-white flex flex-col items-center justify-start p-4 md:p-9  gap-3">
      <div className="relative w-full max-w-[1440px] mx-auto">
        <HeroBanner />
      </div>

      <section>
        <div className="max-w-[1440px] bg-black mx-auto">
          <div className="text-white rounded-[30px] w-[155px] h-[40px] flex items-center justify-center border border-[#25B021] mt-10">
            <p className="text-[16px] w-[121px] font-normal font-[Poppins] leading-[150%] text-[#25B021] m-0">
              Zen Smart Ring
            </p>
          </div>

          <div className="flex flex-wrap justify-center items-center gap-10 py-3 mt-3 w-full">
            {rings?.map((ring, index) => (
              <RingCards ring={ring} key={index} />
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default OurStore;
