export async function applyDiscountCode(value: { code: string }) {
  console.log("util", value);
  const res = await fetch("/api/discount", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ value }),
  });

  if (!res.ok) {
    const error = await res.json();
    throw new Error(error.message || "Discount code validation failed");
  }

  return res.json(); // { status, message, discount }
}
