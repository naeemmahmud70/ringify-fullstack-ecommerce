import { create } from "zustand";

import { selectedRingPropsT } from "@/components/SelectRings/SelectRings";

import { getSelectedRingDetails } from "../utils/selectedRingDetails";

interface userState {
  loggedInUser: boolean;
  setLoggedInUser: (loading: boolean) => void;
}

export const useLoggedInUser = create<userState>(set => ({
  loggedInUser: false,
  setLoggedInUser: loggedInUser => set({ loggedInUser }),
}));

export interface promoOfferT {
  PROMO_OFFER_1: string;
  PROMO_OFFER_2: string;
}

interface offerState {
  selectedOffer: promoOfferT;
  setSelectedOffer: (
    updater: promoOfferT | ((prev: promoOfferT) => promoOfferT)
  ) => void;
}

export const useRingOffer = create<offerState>(set => ({
  selectedOffer: {
    PROMO_OFFER_1: "",
    PROMO_OFFER_2: "",
  },
  setSelectedOffer: updater =>
    set(state => ({
      selectedOffer:
        typeof updater === "function" ? updater(state.selectedOffer) : updater,
    })),
}));

interface SelectedRingState {
  ringQuantity: number;
  selectedRings: selectedRingPropsT[];
  setSelectedRings: (loading: selectedRingPropsT[]) => void;
}

const alreadySelected: selectedRingPropsT[] = getSelectedRingDetails();

export const useSelectedRings = create<SelectedRingState>(set => ({
  ringQuantity: alreadySelected
    ? alreadySelected.reduce((acc, curr) => acc + curr.quantity, 0)
    : 0,
  selectedRings: alreadySelected ?? [
    { size: "", quantity: 0, color: "", basePrice: 0 },
  ],

  setSelectedRings: value => {
    const totalQuantity = value.reduce((acc, curr) => acc + curr.quantity, 0);

    set({
      selectedRings: value,
      ringQuantity: totalQuantity,
    });
  },
}));
