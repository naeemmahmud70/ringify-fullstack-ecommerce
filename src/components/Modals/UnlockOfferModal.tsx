import React from "react";
import { X } from "lucide-react";

import { Dialog, DialogContent } from "../ui/dialog";
import { useModals } from "@/store/modals";

const UnlockOfferModal = () => {
  const { unlockOfferModal, setUnlockOfferModal } = useModals();
  const handleClose = () => {
    setUnlockOfferModal("");
  };
  return (
    <Dialog open={unlockOfferModal ? true : false}>
      <DialogContent className="bg-[url('/products/mobile-offer-bg.png')]  lg:bg-[url('/products/desktop-offer-bg.png')] bg-cover  bg-no-repeat w-[320px] max-w-[320px]    lg:w-[922px] lg:max-w-[922px] h-[287px] lg:h-[559px] max-h-[80vh] sm:max-h-[90vh]  p-5 md:p-5 border-0  outline-none shadow-none rounded-[30px] md:rounded-[30px] lg:rounded-[40px] flex justify-center items-center ">
        <X
          onClick={handleClose}
          className="bg-transparent hover:bg-transparent text-white absolute right-6 top-6 lg:right-8 lg:top-8 h-[14px] w-[14px] lg:h-[26px] lg:w-[26px] cursor-pointer border-[1px] border-white rounded-full"
        />

        <div className="">
          <div className="flex justify-center">
            <h1
              style={{
                textShadow: "0px 0px 10px rgba(255, 255, 255, 0.4)",
              }}
              className="text-white w-[238px] lg:w-fit text-[22px] lg:text-[56px] font-poppins font-bold uppercase leading-[33px] lg:leading-[64px]"
            >
              Congratulations!!
            </h1>
          </div>
          <div className="flex justify-center">
            <p className="text-white w-fit text-center text-[18px] lg:text-[42px] font-poppins font-normal leading-[24px] lg:leading-[60px] mt-0 lg:mt-3 tracking-[0px]">
              Offer Unlocked <br />{" "}
              <span className="font-semibold">{unlockOfferModal}</span>
            </p>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default UnlockOfferModal;
