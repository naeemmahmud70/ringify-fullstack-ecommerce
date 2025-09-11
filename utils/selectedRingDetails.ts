import { ringDetailsT, useSelectedRings } from "@/store/users";

export const getSelectedRingDetails = () => {
  const selectedRings = localStorage.getItem("selectedRingDetails");
  if (selectedRings) {
    return JSON.parse(selectedRings ?? []);
  }
};
export const setSelectedRingDetails = (value: ringDetailsT[]) => {
  localStorage.setItem("selectedRingDetails", JSON.stringify(value));
  const { setSelectedRings } = useSelectedRings.getState();
  console.log("state", value);
  setSelectedRings(value);
};
