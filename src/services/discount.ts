export async function applyDiscountCode(code: string) {
  const res = await fetch("/api/discount", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ code }),
  });

  if (!res.ok) {
    const error = await res.json();
    throw new Error(error.message || "Discount code validation failed");
  }

  return res.json(); // { status, message, discount }
}
