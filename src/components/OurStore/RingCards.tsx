import Image from "next/image";
import Link from "next/link";
import React from "react";

interface Ring {
  name: string;
  description: string;
  price: string;
  type: string;
}

interface RingCardsProps {
  ring: Ring;
}

const RingCards: React.FC<RingCardsProps> = ({ ring }) => {
  return (
    <div className="bg-[#131313] text-white rounded-[12px] py-5 px-8 h-auto w-full lg:w-[450px] xl:w-[381px] xl:h-[465px]  ">
      <Image
        src={
          ring.type.includes("black")
            ? "/ourstore/blackRing.png"
            : ring.type.includes("rosegold")
              ? "/ourstore/Rose Gold 3.png"
              : "/ourstore/silverRing.png"
        }
        width={150}
        height={150}
        alt={ring.name}
        className="w-[150px] sm:w-[203px] h-auto mx-auto mb-4 mt-5"
      />
      <p className="text-[20px] text-wrap w-fit font-extrabold leading-[30px] tracking-[-0.462px] font-[Mulish] text-start sm:text-left">
        {ring.name}
      </p>
      <p className="text-[16px]font-normal leading-[150%] tracking-[-0.025em] font-[Poppins] text-[rgba(255,255,255,0.7)] mt-2 text-start sm:text-left">
        {ring.description}
      </p>
      <div className="mt-6 flex flex-row sm:items-center sm:justify-between gap-8 sm:gap-0">
        <div>
          <p className="font-semibold text-[16px] sm:text-[18px] leading-[22px] tracking-[-0.025em] font-[Poppins] text-start pt-2 sm:text-left">
            {ring?.price}
          </p>
          <p className="text-[12px] leading-[120%] text-[#8F8F8F] font-normal text-start sm:text-left">
            (inclusive of all taxes)
          </p>
        </div>
        <Link
          href={`/product/smart-rings/product-page?ring=${ring.type}`}
          id="cart-page-ourstore"
          className="ml-auto text-white text-center font-poppins text-[14px] flex justify-center items-center rounded-[62px] bg-[#25B021] hover:[#25B021] w-[113px] h-[36px]"
        >
          Add to cart
        </Link>
      </div>
    </div>
  );
};

export default RingCards;
