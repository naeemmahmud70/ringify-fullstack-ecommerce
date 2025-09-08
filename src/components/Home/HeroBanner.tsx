import React from "react";
import Image from "next/image";
import Link from "next/link";

import ImageHero from "../../../public/products/mobile-hero.svg";
import HeroImage from "../../../public/products/Smart_Ring-Hero_Image.png";

const HeroBanner = () => {
  return (
    <div
      className="bg-black h-fit min-h-[840px] lg:min-h-[800px] sm:min-h-[800px] xs:min-h-[844px] bg-cover bg-no-repeat flex justify-center"
      style={{ backgroundImage: "url(/product/products/hero-grid-bg.svg)" }}
    >
      <div className="relative z-10 p-6 lg:p-9 sm:p-6">
        <div className="flex flex-col items-center justify-between gap-3 text-center mt-20 lg:mt-[82px] sm:mt-12 h-[330px]">
          <p className="text-white font-light sm:font-medium font-mulish text-[48px] xl:text-[72px] lg:text-[72px] sm:text-[48px] leading-[125%] sm:leading-[125%] tracking-[-0.025em] text-center">
            Empower your health with <br className="hidden xs:block" />
            <span className="sm:hidden"> </span>
            <span className="text-green-custom">BAAI Zen Ring</span>
          </p>

          <p className="font-poppins sm:w-[855px] text-[#FFFFFFCC] text-[16px] lg:text-[18px] sm:text-[18px] font-normal text-center px-2 sm:px-0 leading-[150%] sm:leading-[180%] tracking-[-0.025em]">
            Stay on top of your health goals with BAAI Zen ring! Get insights
            into your{" "}
            <span className="text-[#FFFFFF] font-semibold sm:font-bold tracking-[-0.025em] leading-[150%] sm:leading-[180%] text-[16px] sm:text-[18px]">
              sleep, SPO2, heart rate,
              <br className="hidden sm:block" />
              <span className="sm:hidden"> </span>activity, temperature,{" "}
            </span>{" "}
            and more with up to{" "}
            <span className="text-[#FFFFFF] font-bold sm:font-bold tracking-[-0.025em] leading-[150%] sm:leading-[180%] text-[16px] sm:text-[18px]">
              95%
            </span>{" "}
            accuracy.
          </p>

          <div className="my-1 z-[100] sm:w-[350px] xs:w-[350px] lg:w-[152px] h-[56px] bg-[#25b021] text-white text-[16px] pt-5 px-6 py-3 rounded-full font-poppins font-medium leading-[100%] tracking-wide text-center">
            <Link
              href="/product/baai-zen-smart-rings/buy-now"
              id="buy-now"
              className="block w-full h-full relative bottom-[3px] md:bottom-[0px]"
            >
              Buy Now
            </Link>
          </div>
        </div>

        {/* Mobile Image - Shows only on mobile (hidden on sm and up) */}
        <div className="absolute inset-0 -z-10 w-full flex justify-center pointer-events-none mt-[500px] sm:hidden">
          <Image
            src={ImageHero}
            alt="mobile hero"
            quality={100}
            priority
            className="w-full h-auto object-contain"
          />
        </div>

        {/* Desktop Image - Shows only on sm and up (hidden on mobile) */}
        <div className="absolute inset-0 -z-10 w-full justify-center pointer-events-none mt-[370px] hidden sm:flex">
          <Image
            src={HeroImage}
            alt="desktop hero"
            quality={100}
            priority
            className="w-[400px] sm:w-[400px] md:w-[600px] lg:w-[1000px] h-auto object-contain -mt-[10px] sm:-mt-8 md:-mt-16 lg:-mt-[150px] -mb-4 sm:-mb-8 md:-mb-12 lg:-mb-20 scale-[2] sm:scale-110 md:scale-115 lg:scale-[1.5]"
          />
        </div>
      </div>
    </div>
  );
};

export default HeroBanner;
