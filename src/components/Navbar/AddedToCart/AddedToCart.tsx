"use client";
import Image from "next/image";
import Link from "next/link";

import { useSelectedRings } from "@/store/users";

const AddedToCart: React.FC = () => {
  const { ringQuantity } = useSelectedRings();
  return (
    <Link
      href="/product/smart-rings/cart"
      className="relative cursor-pointer w-[30px] h-[30px]"
    >
      <Image
        src="/cartpage/cart-icon.svg"
        height={30}
        width={30}
        alt="cart-icon"
      />

      {ringQuantity > 0 && (
        <span className="absolute -top-2 -right-2 bg-green-600 text-white text-[10px] min-w-[16px] h-[16px] px-[4px] rounded-full flex items-center justify-center">
          {ringQuantity}
        </span>
      )}
    </Link>
  );
};

export default AddedToCart;
