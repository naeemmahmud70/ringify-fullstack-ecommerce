import User from "@/models/User";
import Otp from "@/models/Otp";
import { sendEmail } from "@/lib/sendEmail";
import connectMongo from "@/lib/connect-mongo";
import { generateOtp } from "@/utils/generateOtp";
import bcrypt from "bcryptjs";

const OTP_EXPIRY_MINUTES = Number(process.env.OTP_EXPIRY_MINUTES || 5);

export async function POST(req: Request) {
  try {
    await connectMongo();
    const { name, email, password } = await req.json();

    // Basic validation
    if (!name || !email || !password) {
      return Response.json({
        status: 400,
        message: "Name, email, and password are required",
      });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return Response.json({ status: 400, message: "User already exists!" });
    }

    const otp = generateOtp();
    const expiresAt = new Date(Date.now() + OTP_EXPIRY_MINUTES * 60 * 1000);

    await Otp.deleteMany({ email });
    await Otp.create({ email, otp, expiresAt });

    // const html = `
    //   <p>Hello ${name},</p>
    //   <p>Your OTP code is: <b>${otp}</b></p>
    //   <p>This code will expire in ${OTP_EXPIRY_MINUTES} minutes.</p>
    // `;

    // await sendEmail(
    //   email,
    //   `Your Ringify verification code (expires in ${OTP_EXPIRY_MINUTES} minutes)`,
    //   html
    // );

    // ✅ bcrypt hash the password before sending it back
    // const hashedPassword = await bcrypt.hash(password, 10);

    return Response.json({
      status: 200,
      message: "OTP sent to email",
      user: { name, email, password: password },
    });
  } catch (error: any) {
    return Response.json({
      status: 500,
      message: error?.message || "Unknown error",
    });
  }
}
