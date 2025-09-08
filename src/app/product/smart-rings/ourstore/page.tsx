import React from "react";
import Image from "next/image";
import Link from "next/link";

const rings = [
  {
    name: "BAAI Zen Smart Ring | Black",
    description:
      "Track 10+ bio-markers with AI insights, 8 days battery life, 5 ATM waterproof, plus blockchain-secured rewards.",
    price: "29000",
    type: "black",
  },
  {
    name: "BAAI Zen Smart Ring | Rose gold",
    description:
      "Track 10+ bio-markers with AI insights, 8 days battery life, 5 ATM waterproof, plus blockchain-secured rewards.",
    price: "29000",
    type: "rosegold",
  },
  {
    name: "BAAI Zen Smart Ring | Silver",
    description:
      "Track 10+ bio-markers with AI insights, 8 days battery life, 5 ATM waterproof, plus blockchain-secured rewards.",
    price: "29000",
    type: "silver",
  },
];

const OurStore: React.FC = () => {
  return (
    <div className=" bg-black text-white flex flex-col items-center justify-start p-4  gap-3">
      <div className="relative w-full max-w-[1440px] mx-auto">
        {/* ✅ Desktop Hero Section */}
        <div className="">
          <div
            className="md:flex  max-w-[1240px] mt-[145px] mx-auto rounded-[30px]"
            style={{
              backgroundImage: "url(/ourstore/banner.png)",
              backgroundRepeat: "no-repeat",
            }}
          >
            <div className="w-full md:w-10/12 p-4 md:p-6 lg:p-10 flex flex-col justify-between items-start gap-3">
              <h1 className="font-extrabold font-mulish text-[20px] md:text-[30px] leading-[1.5]">
                BAAI Zen: THE STYLE YOU WANT THE INSIGHTS{" "}
                <br className="hidden xl:block" /> YOU NEED
              </h1>

              <p className=" text-[15.79px] lg:text-[15.79px] md:text-[12px] leading-[150%] font-[Poppins]">
                Crafted for all-day comfort with a sleek, & lightweight design.
                Made from durable titanium in three distinctive colors, offering
                timeless style and advanced wellness tracking enhanced with the
                power of BAAI!
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
        </div>
      </div>

      <section>
        <div className="flex flex-col items-start max-w-[1440px] bg-black w-full mx-auto">
          {/* Zen Smart Ring Label */}
          <div className="text-white rounded-[30px] w-[155px] h-[40px] flex items-center justify-center border border-[#25B021] mt-5">
            <p className="text-[16px] w-[121px] font-normal font-[Poppins] leading-[150%] text-[#25B021] m-0">
              Zen Smart Ring
            </p>
          </div>

          {/* Product Cards */}
          <div className="flex flex-wrap justify-between items-center gap-3 py-3 mt-1 w-full">
            {rings.map((ring, index) => (
              <div
                key={index}
                className="bg-[#131313] text-white rounded-[12px] py-5 px-8 h-auto w-full lg:w-[450px] xl:w-[381px] xl:h-[465px]  "
              >
                <Image
                  src={
                    ring.name.includes("Black")
                      ? "/ourstore/blackRing.png"
                      : ring.name.includes("Rose")
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
                      {Number(ring?.price)}
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
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default OurStore;
