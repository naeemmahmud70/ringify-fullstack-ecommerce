"use client";
import React, { useEffect } from "react";
import { toast, ToastContainer } from "react-toastify";

import { useToastStore } from "@/store/toast";

import "react-toastify/dist/ReactToastify.css";

const Toastify = () => {
  const toastStates = useToastStore(state => state.toastStates);

  useEffect(() => {
    if (toastStates?.message && toastStates?.variant) {
      const toastFunc = toast[toastStates.variant] || toast;
      toastFunc(toastStates.message, { autoClose: 4000 });
    }
  }, [toastStates.triggerId]);

  return (
    <div className="">
      <ToastContainer className="text-[14px] font-poppins" />
    </div>
  );
};

export default Toastify;
