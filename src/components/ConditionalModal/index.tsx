"use client";
import { useLoginModal } from "@/store/loginModal";
import { useModals } from "@/store/modals";
import React from "react";
import UnlockOfferModal from "../Modals/UnlockOfferModal";

// import { useLoginModal } from "@/store/loginModal";
// import { useModals } from "@/store/modals";

// import AddAddress from "../modals/AddAddress";
// import EditAddress from "../modals/EditAddressForm";
// import LoginAndSignUp from "../modals/LoginAndSignUp";

const Modals = () => {
  const { isModalOpen, setIsModalOpen } = useLoginModal();
  const { addAddressForm, editAddressForm, unlockOfferModal } = useModals();
  console.log("unlockOfferModal", unlockOfferModal);
  return (
    <div>
      {/* {isModalOpen && (
        <LoginAndSignUp
          isModalOpen={isModalOpen}
          setIsModalOpen={setIsModalOpen}
        />
      )}
      {addAddressForm && <AddAddress />}
      {editAddressForm && <EditAddress />} */}
      {unlockOfferModal && <UnlockOfferModal />}
    </div>
  );
};

export default Modals;
