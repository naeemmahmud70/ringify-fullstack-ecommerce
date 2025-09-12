import { useRingOffer, useSelectedRings } from "@/store/users";

export const getSelectedOffer = () => {
  const stored = localStorage.getItem("selectedOffer");
  if (stored) {
    try {
      const parsedValue = JSON.parse(stored);
      if (
        (parsedValue &&
          typeof parsedValue === "object" &&
          "PROMO_OFFER_1" in parsedValue) ||
        "PROMO_OFFER_2" in parsedValue
      ) {
        return parsedValue;
      }
    } catch (err) {
      console.error("Failed to parse selectedOffer:", err);
    }
  }
};

const { selectedOffer, setSelectedOffer } = useRingOffer.getState();

export const handleSelectOfferOne = (offer: string) => {
  const isAlreadySelected = selectedOffer.PROMO_OFFER_1 === offer;

  const newOffer = {
    PROMO_OFFER_1: isAlreadySelected ? "" : offer,
    PROMO_OFFER_2: "",
  };

  setSelectedOffer(newOffer);
  localStorage.setItem("selectedOffer", JSON.stringify(newOffer));
};
export const handleSelectOfferTwo = (offer: string) => {
  const isAlreadySelected = selectedOffer.PROMO_OFFER_2 === offer;

  const newOffer = {
    PROMO_OFFER_1: "",
    PROMO_OFFER_2: isAlreadySelected ? "" : offer,
  };

  setSelectedOffer(newOffer);
  localStorage.setItem("selectedOffer", JSON.stringify(newOffer));
};
