export const getSelectedRingDetails = () => {
  const selectedRings = localStorage.getItem("selectedRingDetails");
  return selectedRings;
};
