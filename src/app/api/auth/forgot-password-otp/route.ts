import connectMongo from "@/lib/connect-mongo";
import Otp from "@/models/Otp";
import User from "@/models/User";
import { generateOtp } from "@/utils/generateOtp";

const OTP_EXPIRY_MINUTES = Number(
  process.env.FORGET_PASSWORD_OTP_EXPIRY_MINUTES || 5
);

export async function POST(req: Request) {
  try {
    await connectMongo();
    const { email } = await req.json();

    if (!email) {
      return Response.json({ status: 400, message: "Email is required" });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return Response.json({ status: 404, message: "User not found!" });
    }

    const otp = generateOtp();
    const expiresAt = new Date(Date.now() + OTP_EXPIRY_MINUTES * 60 * 1000);

    await Otp.deleteMany({ email });
    await Otp.create({ email, otp, expiresAt });

    // await sendEmail(email, `Reset Password OTP`, `<p>Your OTP is <b>${otp}</b></p>`);

    return Response.json({
      status: 200,
      message: "OTP sent for password reset",
      email,
    });
  } catch (error: any) {
    return Response.json({
      status: 500,
      message: error?.message || "Unknown error",
    });
  }
}
