import { create } from "zustand";

export type addressEditT = {
  id: number;
  firstName: string;
  lastName: string;
  addressLine1: string;
  addressLine2: string;
  country: string;
  pincode: string;
  state: string;
  city: string;
  contactNumber: string;
  saveAs: string;
  isSelectedAddress?: boolean; // Optional to prevent errors
};

interface modalStates {
  isAuthModalOpen: boolean;
  addAddressForm: boolean;
  editAddressForm: boolean;
  editFormValue: addressEditT;
  unlockOfferModal: string;
  setIsAuthModalOpen: (isAuthModalOpen: boolean) => void;
  setAddAddress: (show: boolean) => void;
  setEditAdressForm: (show: boolean) => void;
  setEditFormValue: (value: addressEditT) => void;
  setUnlockOfferModal: (value: string) => void;
}

export const useModals = create<modalStates>(set => ({
  isAuthModalOpen: false,
  addAddressForm: false,
  editAddressForm: false,
  editFormValue: {
    id: 0,
    firstName: "",
    lastName: "",
    addressLine1: "",
    addressLine2: "",
    country: "",
    state: "",
    city: "",
    pincode: "",
    contactNumber: "",
    saveAs: "",
    isSelectedAddress: false, // Optional, but setting a default value
  },
  unlockOfferModal: "",
  setIsAuthModalOpen: isAuthModalOpen => set({ isAuthModalOpen }),
  setAddAddress: show =>
    set({
      addAddressForm: show,
    }),
  setEditAdressForm: show =>
    set({
      editAddressForm: show,
    }),
  setEditFormValue: value =>
    set({
      editFormValue: value,
    }),
  setUnlockOfferModal: value =>
    set({
      unlockOfferModal: value,
    }),
}));
