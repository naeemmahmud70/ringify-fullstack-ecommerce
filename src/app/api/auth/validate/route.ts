import { cookies } from "next/headers";
import { jwtVerify } from "jose";

const secret = new TextEncoder().encode(process.env.JWT_SECRET);

export async function GET() {
  const token = cookies().get("token")?.value;

  if (!token) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    await jwtVerify(token, secret);
    return Response.json({ status: "ok" });
  } catch {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }
}
