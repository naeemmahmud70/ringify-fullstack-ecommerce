import { selectedRingPropsT } from "@/components/SelectRings/SelectRings";
import { useSelectedRings } from "@/store/users";

export const getSelectedRingDetails = () => {
  const selectedRings = localStorage.getItem("selectedRingDetails");
  if (selectedRings) {
    return JSON.parse(selectedRings ?? []);
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
