import React, { Suspense } from "react";

import SelectRing from "@/components/SelectRings/SelectRings";

const page = () => {
  return (
    <div>
      <Suspense fallback={<></>}>
        <SelectRing />
      </Suspense>
    </div>
  );
};

export default page;
