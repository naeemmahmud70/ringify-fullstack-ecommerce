import React, { Suspense } from "react";

import Checkout from "@/components/Checkout/Checkout";

const page = () => {
  return (
    <div className="bg-black h-auto min-h-screen flex flex-col items-center justify-start">
      <div className="p-4 md:p-4 mt-28 w-full max-w-7xl">
        <Suspense>
          <Checkout />
        </Suspense>
      </div>
    </div>
  );
};

export default page;
