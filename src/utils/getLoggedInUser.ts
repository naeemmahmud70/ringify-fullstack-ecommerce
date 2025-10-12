export const getLoggedInUser = () => {
  try {
    if (typeof window !== "undefined") {
      const userdetails = localStorage.getItem("loggedInUser");
      return userdetails ? JSON.parse(userdetails) : null;
    }
    return null;
  } catch {
    return null;
  }
};
