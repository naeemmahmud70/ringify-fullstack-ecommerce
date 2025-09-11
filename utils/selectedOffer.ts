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
