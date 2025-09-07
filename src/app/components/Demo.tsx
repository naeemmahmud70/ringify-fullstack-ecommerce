import React from "react";
import { DataType } from "../page";

type DemoProps = {
  demoData: DataType; // 👈 now Demo expects a prop `demoData` of type DataType
};

const Demo: React.FC<DemoProps> = ({ demoData }) => {
  console.log("data", demoData);
  return (
    <div className="flex min-h-screen items-center justify-center bg-green-custom text-white">
      <h1 className="text-4xl font-bold">Hello Tailwind v4 in Next.js 🎉</h1>
    </div>
  );
};

export default Demo;
