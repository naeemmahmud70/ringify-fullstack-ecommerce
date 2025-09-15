export async function signUp(values: {
  name: string;
  email: string;
  password: string;
}) {
  const res = await fetch("/api/auth/signup", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(values),
  });

  if (!res.ok) {
    const error = await res.json();
    throw new Error(error.error || "Otp sending failed");
  }

  return res.json();
}

export async function verifyOtp(values: {
  name: string;
  email: string;
  password: string;
  otp: string;
}) {
  const res = await fetch("/api/auth/verify-otp", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(values),
  });

  if (!res.ok) {
    const error = await res.json();
    throw new Error(error.error || "OTP verification failed");
  }

  return res.json();
}
