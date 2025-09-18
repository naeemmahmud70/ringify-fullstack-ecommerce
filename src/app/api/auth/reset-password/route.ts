import bcrypt from "bcryptjs";

import connectMongo from "@/lib/connect-mongo";
import Otp from "@/models/Otp";
import User from "@/models/User";

export async function POST(req: Request) {
  try {
    await connectMongo();
    const { email, otp, password } = await req.json();

    // ✅ Validate required fields
    if (!email || !otp || !password) {
      return Response.json({
        status: 400,
        message: "Email, OTP and password are required!",
      });
    }

    // ✅ Check OTP record
    const record = await Otp.findOne({ email, otp });
    if (!record) {
      return Response.json({ status: 400, message: "Invalid OTP!" });
    }

    if (record.expiresAt < new Date()) {
      return Response.json({ status: 400, message: "OTP expired!" });
    }

    // ✅ Check user existence
    const user = await User.findOne({ email });
    if (!user) {
      return Response.json({ status: 404, message: "User not found!" });
    }

    // ✅ Hash new password
    const hashedPassword = await bcrypt.hash(password, 10);

    // ✅ Update user password
    user.password = hashedPassword;
    await user.save();

    // ✅ Delete OTP after success
    await Otp.deleteMany({ email });

    return Response.json({
      status: 200,
      message: "Password reset successful!",
    });
  } catch (error: any) {
    console.error("Error in reset password:", error);

    return Response.json({
      status: 500,
      message: "Failed to reset password!",
      details: error?.message || "Unknown error",
    });
  }
}
