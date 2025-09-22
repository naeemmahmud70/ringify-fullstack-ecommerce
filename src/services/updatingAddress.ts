export const updateAddress = async (id: string, payload: any) => {
  try {
    const res = await fetch(`/api/address/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    if (!res.ok) {
      const error = await res.json();
      throw new Error(error.error || "Address updating failed!");
    }

    return await res.json();
  } catch (error) {
    console.error("Error updating address:", error);
    throw error;
  }
};
