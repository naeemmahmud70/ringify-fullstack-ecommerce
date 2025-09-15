"use client";
import React from "react";

// import { useAuthModal } from "@/store/loginModal";
import { useModals } from "@/store/modals";

import UnlockOfferModal from "../Modals/UnlockOfferModal";

// import { useAuthModal } from "@/store/loginModal";
// import { useModals } from "@/store/modals";

// import AddAddress from "../modals/AddAddress";
// import EditAddress from "../modals/EditAddressForm";
// import LoginAndSignUp from "../modals/LoginAndSignUp";

const Modals = () => {
  // const { isAuthModalOpen, setIsAuthModalOpen } = useAuthModal();
  const { unlockOfferModal } = useModals();
  return (
    <div>
      {/* {isAuthModalOpen && (
        <LoginAndSignUp
          isAuthModalOpen={isAuthModalOpen}
          setIsAuthModalOpen={setIsAuthModalOpen}
        />
      )}
      {addAddressForm && <AddAddress />}
      {editAddressForm && <EditAddress />} */}
      {unlockOfferModal && <UnlockOfferModal />}
    </div>
  );
};

export default Modals;
