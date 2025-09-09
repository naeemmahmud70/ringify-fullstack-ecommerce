"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { useCart } from "@/context/CartContext";
interface selectedRingProps {
  size: string;
  quantity: number;
  color: string;
}
interface priceProp {
  basePrice: number;
  ringColor: string;
  ringSizes: selectedRingProps[];
  currentDate: string;
}

const Continue: React.FC<priceProp> = ({
  ringColor,
  ringSizes,
  currentDate,
  basePrice,
}) => {
  const router = useRouter();
  const [totalPrice, setTotalPrice] = useState("0.00");
  const { setCartQuantity } = useCart();

  const getTotalQuantity = () => {
    return ringSizes.reduce((sum, item) => sum + item.quantity, 0);
  };

  useEffect(() => {
    const totalRing = getTotalQuantity();
    const total = totalRing * basePrice;
    setTotalPrice(total.toFixed(2));
  }, [ringSizes]);

  const handleSubmit = () => {
    const ringSizesWithPrice = ringSizes.map(item => {
      return {
        ...item,
        basePrice: basePrice,
      };
    });

    if (ringSizes.length) {
      localStorage.setItem(
        "selectedRingDetails",
        JSON.stringify(ringSizesWithPrice)
      );
      router.push("/product/smart-rings/cart-page");
    }
  };

  const updateCart = () => {
    const data = localStorage.getItem("selectedRingDetails");
    if (data) {
      const rings = JSON.parse(data);
      const quantity = rings.reduce((acc: number, item: any) => {
        return acc + item.quantity;
      }, 0);
      setCartQuantity(quantity);
    }
  };

  return (
    <div className="lg:flex justify-between items-center">
      <div className="hidden md:block">
        <p className="text-[#8F8F8F] text-xs font-poppins font-normal tracking-tight leading-[24px] w-[511px]">
          Dispatch by : <span className="text-white">{currentDate}</span> (2
          months from today - tentative)
        </p>
      </div>
      <div className="md:flex justify-between items-center w-full lg:w-[45%] mt-0 md:mt-10 lg:mt-0">
        <div className="text-center md:text-start">
          <p className="text-xs text-[#D9D9D9] font-poppins font-normal">
            Final Price
          </p>
          <span className="text-white text-base-lg font-poppins font-semibold">
            {"$"}
            {ringColor && ringSizes ? totalPrice : 0}
            {/* <span className="ml-2 mt-1 font-poppins font-normal text-[12px] leading-[120%] text-[#8F8F8F]">
          (inclusive of all taxes)
        </span> */}
          </span>
          <span className="block md:inline ml-0 md:ml-2 mt-1 font-poppins font-normal text-[12px] leading-[120%] text-[#8F8F8F] text-center md:text-start">
            (inclusive of all taxes)
          </span>
        </div>
        <div>
          <Button
            disabled={!(ringColor && ringSizes.length)}
            className={`bg-[#25B021] hover:bg-[#25B021] hover:opacity-90  px-24 py-6 md:py-6 rounded-full text-white text-xs font-poppins font-medium w-full md:w-[257px] h-[52px] mt-5 md:mt-0 `}
            id="cart-page"
            onClick={() => {
              handleSubmit();
              updateCart();
            }}
          >
            Add to Cart
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Continue;
