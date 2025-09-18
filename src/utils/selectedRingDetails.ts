import { selectedRingPropsT } from "@/components/SelectRings/SelectRings";
import { useSelectedRings } from "@/store/users";

export const getSelectedRingDetails = () => {
  try {
    if (typeof window !== "undefined") {
      const selectedRings = localStorage.getItem("selectedRingDetails");
      return selectedRings ? JSON.parse(selectedRings) : null;
    }
    return null;
  } catch {
    return null;
  }
};
export const setSelectedRingDetails = (value: selectedRingPropsT[]) => {
  localStorage.setItem("selectedRingDetails", JSON.stringify(value));
  const { setSelectedRings } = useSelectedRings.getState();
  setSelectedRings(value);
};

export const getTotalQuantity = (ringSizes: selectedRingPropsT[]) => {
  return ringSizes.reduce((sum, item) => sum + item.quantity, 0);
};
