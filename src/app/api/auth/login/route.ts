import { cookies } from "next/headers";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

import connectMongo from "@/lib/connect-mongo";
import User from "@/models/User";

export async function POST(req: Request) {
  try {
    await connectMongo();
    const { email, password } = await req.json();

    // ✅ Basic validation
    if (!email || !password) {
      return new Response(
        JSON.stringify({ message: "Email and password are required" }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }

    // ✅ Check if user exists
    const user = await User.findOne({ email });
    if (!user) {
      return Response.json({ status: 404, message: "User not found!" });
    }

    // ✅ Validate password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return Response.json({ status: 401, message: "Invalid password!" });
    }

    // ✅ Generate JWT token
    const token = jwt.sign(
      { id: user._id, email: user.email },
      process.env.JWT_SECRET as string,
      { expiresIn: "1d" }
    );

    // ✅ Set httpOnly cookie
    cookies().set("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 24 * 60 * 60, // 1 day
    });

    return Response.json({
      status: 200,
      message: "Login successful!",
      user: { id: user._id, name: user.name, email: user.email },
    });
  } catch (error: any) {
    console.error("Login error:", error);

    return Response.json({
      status: 500,
      message: error.message || "Login failed",
    });
  }
}
