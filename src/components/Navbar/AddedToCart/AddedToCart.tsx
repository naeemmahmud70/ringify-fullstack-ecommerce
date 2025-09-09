import { useEffect, useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";

import { useCart } from "@/context/CartContext";

const getCartItemCount = (): number => {
  try {
    const data = localStorage.getItem("selectedRingDetails");
    const items = data ? JSON.parse(data) : [];
    return Array.isArray(items) ? items.length : 0;
  } catch {
    return 0;
  }
};

const AddedToCart: React.FC = () => {
  const router = useRouter();
  const [cartNumber, setCartNumber] = useState(() => getCartItemCount());

  const { cartQuantity } = useCart();

  useEffect(() => {
    const updateCart = () => setCartNumber(getCartItemCount());

    window.addEventListener("cart-updated", updateCart);
    window.addEventListener("storage", e => {
      if (e.key === "selectedRingDetails") {
        updateCart();
      }
    });

    return () => {
      window.removeEventListener("cart-updated", updateCart);
      window.removeEventListener("storage", updateCart);
    };
  }, []);

  return (
    <div
      className="relative cursor-pointer w-[30px] h-[30px] "
      onClick={() => router.push("/product/baai-zen-smart-rings/cart-page")}
    >
      <Image
        src="/cartpage/cart-icon.svg"
        height={30}
        width={30}
        alt="cart-icon"
      />

      {cartNumber > 0 && (
        <span className="absolute -top-2 -right-2 bg-green-600 text-white text-[10px] min-w-[16px] h-[16px] px-[4px] rounded-full flex items-center justify-center">
          {cartQuantity}
        </span>
      )}
    </div>
  );
};

export default AddedToCart;
