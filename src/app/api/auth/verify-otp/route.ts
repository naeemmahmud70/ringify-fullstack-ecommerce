
import User from "@/models/User";
import Otp from "@/models/Otp";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { cookies } from "next/headers";
import connectMongo from "@/lib/connect-mongo";

export async function POST(req: Request) {
  try {
    await connectMongo();
    const { name, email, password, otp } = await req.json();

    // ✅ Check OTP
    const record = await Otp.findOne({ email, otp });
    if (!record) {
      return new Response(JSON.stringify({ error: "Invalid OTP" }), { status: 400 });
    }

    if (record.expiresAt < new Date()) {
      return new Response(JSON.stringify({ error: "OTP expired" }), { status: 400 });
    }

    // ✅ Check existing user
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return new Response(JSON.stringify({ error: "User already exists" }), { status: 400 });
    }

    // ✅ Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // ✅ Create user
    const newUser = await User.create({
      name,
      email,
      password: hashedPassword,
      verified: true,
    });

    // ✅ Remove OTP after success
    await Otp.deleteMany({ email });

    // ✅ Create JWT token
    const token = jwt.sign(
      { id: newUser._id, email: newUser.email },
      process.env.JWT_SECRET as string,
      { expiresIn: "7d" }
    );

    // ✅ Set token in cookie
    cookies().set("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production", // only secure in production
      maxAge: 60 * 60 * 24 * 7, // 7 days
      path: "/",
    });

    // ✅ Send response
    return Response.json({
      message: "User verified, created, and logged in",
      user: {
        id: newUser._id,
        name: newUser.name,
        email: newUser.email,
      },
    });
  } catch (error: any) {
    console.error("Error in OTP verification:", error);

    return new Response(
      JSON.stringify({
        error: "Failed to verify OTP",
        details: error?.message || "Unknown error",
      }),
      { status: 500 }
    );
  }
}
