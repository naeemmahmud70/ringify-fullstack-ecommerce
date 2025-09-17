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
    console.log("record", record);
    if (!record) {
      return Response.json({ status: 400, message: "Invalid OTP!" });
    }

    if (record.expiresAt < new Date()) {
      return Response.json({ status: 400, message: "OTP expired!" });
    }

    // ✅ Check existing user
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return Response.json({ status: 400, message: "User already exists!" });
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
    console.log("below");
    // ✅ Remove OTP after success
    await Otp.deleteMany({ email });

    // ✅ Create JWT token
    const token = jwt.sign(
      { id: newUser._id, email: newUser.email },
      process.env.JWT_SECRET as string,
      { expiresIn: "1d" }
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
      status: 201,
      message: "User verified and created!",
      user: {
        id: newUser._id,
        name: newUser.name,
        email: newUser.email,
      },
    });
  } catch (error: any) {
    console.error("Error in OTP verification:", error);

    return Response.json({
      status: 500,
      message: "Failed to verify OTP!",
      details: error?.message || "Unknown error",
    });
  }
}
