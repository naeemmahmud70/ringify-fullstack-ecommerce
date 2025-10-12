export async function sendOtp(values: {
  name: string;
  email: string;
  password: string;
}) {
  const res = await fetch("/api/auth/signup-otp", {
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

export async function Login(values: { email: string; password: string }) {
  const res = await fetch("/api/auth/login", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(values),
  });

  if (!res.ok) {
    const error = await res.json();
    throw new Error(error.error || "Login failed!");
  }

  return res.json();
}

export async function logout() {
  const res = await fetch("/api/auth/logout", { method: "POST" });

  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    throw new Error(errorData.message || "Logout failed. Please try again.");
  }

  return res.json();
}

export async function sendForgetPassOtp(values: { email: string }) {
  const res = await fetch("/api/auth/forgot-password-otp", {
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

export async function resetPassword(values: {
  otp: string;
  email: string;
  password: string;
}) {
  const res = await fetch("/api/auth/reset-password", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(values),
  });

  if (!res.ok) {
    const error = await res.json();
    throw new Error(error.error || "Reset password failed!");
  }

  return res.json();
}
