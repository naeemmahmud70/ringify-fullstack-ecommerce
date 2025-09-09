import Image from "next/image";
import Link from "next/link";
import React from "react";

const HeroBanner = () => {
  return (
    <div className="md:flex h-fit  max-w-[1240px] mt-[105px] mx-auto rounded-[30px] bg-[url('/ourstore/banner.png')] bg-no-repeat bg-cover bg-center">
      <div className="w-full md:w-10/12 p-4 md:p-6 lg:p-10 flex flex-col justify-between items-start gap-3">
        <h1 className="font-extrabold font-mulish text-[20px] md:text-[30px] leading-[1.5]">
          BAAI Zen: THE STYLE YOU WANT THE INSIGHTS{" "}
          <br className="hidden xl:block" /> YOU NEED
        </h1>

        <p className=" text-[15.79px] lg:text-[15.79px] md:text-[12px] leading-[150%] font-[Poppins]">
          Crafted for all-day comfort with a sleek, & lightweight design. Made
          from durable titanium in three distinctive colors, offering timeless
          style and advanced wellness tracking enhanced with the power of BAAI!
        </p>

        <div className="">
          <Link href="/product/smart-rings/buy-now">
            <button
              id="buy-now"
              className="w-[188px] h-[48px] px-6 py-2 flex items-center gap-7 rounded-full border border-white text-white font-[Poppins] text-[1rem] uppercase"
            >
              <span className=" font-poppins font-medium text-[20px] leading-[100%] tracking-[0%] py-1 uppercase">
                Buy Now
              </span>
              <Image
                height={16}
                width={16}
                src="/ourstore/arrow.png"
                alt="Arrow"
              />
            </button>
          </Link>
        </div>
      </div>

      <div className="w-full md:w-3/12 flex justify-end">
        <Image
          src="/ourstore/Bigring.png"
          alt="ring"
          width={300}
          height={300}
          className="rounded-[30px]"
        />
      </div>
    </div>
  );
};

export default HeroBanner;
