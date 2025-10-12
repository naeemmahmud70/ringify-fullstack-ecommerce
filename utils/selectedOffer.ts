export const getSelectedOffer = () => {
  const stored = localStorage.getItem("selectedOffer");
  console.log("parsed", stored);
  if (stored) {
    try {
      const parsedValue = JSON.parse(stored);
      console.log("parsed", parsedValue);
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
