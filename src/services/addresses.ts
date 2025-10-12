export async function addNewAddress(values: {
  email: string;
  firstName: string;
  lastName: string;
  addressLine1: string;
  addressLine2?: string;
  pincode: string;
  country: string;
  state: string;
  city: string;
  contactNumber: string;
  saveAs: string;
}) {
  const res = await fetch("/api/address", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(values),
  });

  if (!res.ok) {
    const error = await res.json();
    throw new Error(error.message || "Adding new address failed!");
  }

  return res.json();
}

export async function getAddresses(email: string) {
  const res = await fetch(`/api/address?email=${email}`);

  if (!res.ok) {
    const error = await res.json();
    throw new Error(error.message || "Fetching address failed!");
  }

  return res.json();
}

export const deleteAddress = async (id: string) => {
  try {
    const res = await fetch(`/api/address/${id}`, {
      method: "DELETE",
    });
    if (!res.ok) {
      const error = await res.json();
      throw new Error(error.message || "Deleting address failed!");
    }
    const data = await res.json();
    return { status: res.status, ...data };
  } catch (error) {
    console.error("Error deleting address:", error);
    throw error;
  }
};
