import { cookies } from "next/headers";

export async function POST() {
  try {
    const cookieStore = cookies();
    cookieStore.getAll().forEach(cookie => {
      cookieStore.set(cookie.name, "", {
        expires: new Date(0),
        path: "/",
      });
    });

    return Response.json({ status: 200, message: "Logged out successfully!" });
  } catch (error: any) {
    console.error("Logout error:", error);
    return Response.json({
      status: 500,
      message: "Logout failed",
    });
  }
}
