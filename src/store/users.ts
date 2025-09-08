import { create } from "zustand";

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
