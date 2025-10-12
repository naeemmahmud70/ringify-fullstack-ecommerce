export function getMonthAfterTwoMonths(): string {
  const currentDate = new Date();
  const futureDate = new Date(
    currentDate.getFullYear(),
    currentDate.getMonth() + 2,
    1
  );
  const month = futureDate.toLocaleString("default", { month: "long" });
  const year = futureDate.getFullYear();
  return `${month}, ${year}`;
}
