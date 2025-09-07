"use client";
import React, { useEffect, useState } from "react";
import Demo from "./components/Demo";

export interface DataType {
  name: string;
  email: string;
}

export default function Home() {
  const [data, setData] = useState<DataType>({ name: "", email: "" });

  useEffect(() => {
    const object = {
      name: "Naeem",
      email: "naeem@braina.live",
    };
    setData(object);
  }, []);

  return (
    <div className="bg-backgroundImage">
      <p className="font-mulish bg-green-custom text-base">Hello World!</p>
      <Demo demoData={data} />
    </div>
  );
}
