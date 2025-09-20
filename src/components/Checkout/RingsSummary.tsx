import React from "react";
import { CartItemT } from "../Cart/CartItems";
import Image from "next/image";
import config from "../../../config/config";
import editIcon from "../../../public/products/editDiscountCode.svg";
import blackRing from "../../../public/products/summaryRings/black.png";
import GoldRing from "../../../public/products/summaryRings/gold.png";
import silverRing from "../../../public/products/summaryRings/silver.png";

interface RingsSummaryProps {
  selectedRings: CartItemT[];
  paidRings: CartItemT[];
  freeRings: CartItemT[];
}
const RingsSummary: React.FC<RingsSummaryProps> = ({
  paidRings,
  freeRings,
}) => {
  const basePrice = Number(config.BASE_PRICE);
  console.log("paid", paidRings)
  return (
    <div className="w-full flex flex-col gap-4">
      {paidRings.length === 0 ? (
        <p className="text-[14px] font-poppins text-gray-300">
          Summary data is loading...
        </p>
      ) : (
        <>
          <div className="flex flex-col gap-4">
            {freeRings?.length &&
              freeRings?.map((item, index) => {
                const ringImage =
                  item.color === "black"
                    ? blackRing
                    : item.color === "silver"
                      ? silverRing
                      : item.color === "rosegold"
                        ? GoldRing
                        : "/fallback.svg";

                return (
                  <React.Fragment key={index}>
                    <div className="hidden lg:block w-full bg-[#1F1F1F] rounded-[13px]">
                      <div className="flex items-center gap-4 p-5 rounded-xl w-full">
                        <Image
                          src={ringImage}
                          alt="Product"
                          className="w-[70px] h-[70px] object-cover rounded-lg"
                        />
                        <div className="w-full">
                          <div className="w-full flex justify-between items-center">
                            <div>
                              <h3 className="text-xs text-white font-poppins font-medium">
                                BAAI Zen
                              </h3>

                              <p className="text-[14px] font-poppins text-white font-normal capitalize">
                                Color:{" "}
                                {item.color === "rosegold"
                                  ? "Rose Gold"
                                  : item.color}
                              </p>
                            </div>
                            <div>
                              <p className="text-[14px] font-poppins text-white">
                                Size: {item.size}
                              </p>
                              <p className="text-[14px] font-poppins text-white">
                                Quantity: {item.quantity}
                              </p>
                            </div>
                            <p className="text-sm-xs text-green-custom font-bold font-poppins">
                              Free
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </React.Fragment>
                );
              })}
            <hr className="border-[1px] border-[#FFFFFF1A]" />
          </div>

          {paidRings?.length &&
            paidRings?.map((item, index) => {
              const ringImage =
                item.color === "black"
                  ? blackRing
                  : item.color === "silver"
                    ? silverRing
                    : item.color === "rosegold"
                      ? GoldRing
                      : "/fallback.svg";

              return (
                <React.Fragment key={index}>
                  <div className="hidden lg:block w-full bg-[#1F1F1F] rounded-[13px]">
                    <div className="flex items-center gap-4 p-5 rounded-xl w-full">
                      <Image
                        src={ringImage}
                        alt="Product"
                        className="w-[70px] h-[70px] object-cover rounded-lg"
                      />
                      <div className="w-full">
                        <div className="w-full flex justify-between items-center">
                          <div>
                            <h3 className="text-xs text-white font-poppins font-medium">
                              BAAI Zen
                            </h3>

                            <p className="text-[14px] font-poppins text-white font-normal capitalize">
                              Color:{" "}
                              {item.color === "rosegold"
                                ? "Rose Gold"
                                : item.color}
                            </p>
                          </div>
                          <div>
                            <p className="text-[14px] font-poppins text-white">
                              Size: {item.size}
                            </p>
                            <p className="text-[14px] font-poppins text-white">
                              Quantity: {item.quantity}
                            </p>
                          </div>
                          <p className="text-sm-xs text-white font-bold font-poppins">
                            ${(item.quantity * basePrice).toFixed(2)}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* <hr className="border-[1px] border-[#FFFFFF1A]" /> */}
                </React.Fragment>
              );
            })}
          <hr className="border-[1px] border-[#FFFFFF1A]" />
        </>
      )}
    </div>
  );
};

export default RingsSummary;
