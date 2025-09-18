import React, { useEffect, useState } from "react";
import Image from "next/image";
import { X } from "lucide-react";

import { DialogContent, DialogHeader } from "@/components/ui/dialog";

import verified from "../../../public/products/verified.svg";

const Congrats: React.FC<{
  openCongrats: boolean;
  setIsAuthModalOpen: (value: boolean) => void;
}> = ({ openCongrats, setIsAuthModalOpen }) => {
  const [timeLeft, setTimeLeft] = useState(5);
  useEffect(() => {
    let timer: NodeJS.Timeout;

    if (openCongrats) {
      setTimeLeft(5); // Reset timer every time modal opens
      timer = setInterval(() => {
        setTimeLeft(prev => {
          if (prev <= 1) {
            clearInterval(timer);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }

    return () => clearInterval(timer);
  }, [openCongrats]);

  const handleClose = () => {
    setIsAuthModalOpen(false);
  };
  useEffect(() => {
    if (timeLeft < 1) {
      handleClose();
    }
  }, [timeLeft]);
  return (
    <DialogContent className="bg-[#030D0D] max-w-[456px]  p-5 md:p-10 border-none rounded-3xl md:rounded-3xl max-h-[80vh] sm:max-h-[90vh]">
      <DialogHeader>
        <X
          onClick={handleClose}
          className="bg-transparent hover:bg-transparent text-white absolute right-7 top-7 h-6 w-6 cursor-pointer"
        />
      </DialogHeader>

      <div className="flex justify-center -mt-4">
        <Image src={verified} alt="verified-icon" />
      </div>
      <div className="text-center mt-3">
        <h4 className="text-white text-base font-poppins font-normal leading-6">
          Sign Up Successful !
        </h4>
        <p className="text-white text-[12px] font-poppins font-normal leading-6 my-5 tracking-[0px]">
          Welcome to the Zen family! <br /> Finish your order and get ready to
          experience next-level <br /> wellness.
        </p>
        <p className="text-[#FFFF00] text-[14px] font-poppins font-normal leading-6">
          Redirecting in{" "}
          <span className="text-[#FFFF00] px-1"> 0{timeLeft}</span> seconds...
        </p>
      </div>
    </DialogContent>
  );
};

export default Congrats;
