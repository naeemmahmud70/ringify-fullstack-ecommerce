import Checkout from "@/components/Checkout/Checkout";
import React from "react";

const page = () => {
  return (
    <div className="bg-black h-auto min:h-screen flex flex-col items-center justify-start">
      <div className="p-4 md:p-4 mt-28 w-full max-w-7xl">
        <Checkout />
      </div>
    </div>
  );
};

export default page;
