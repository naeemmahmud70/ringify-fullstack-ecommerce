import User from "@/models/User";
import Otp from "@/models/Otp";
import bcrypt from "bcryptjs";
import connectMongo from "@/lib/connect-mongo";

export async function POST(req: Request) {
  try {
    await connectMongo();
    const { name, email, password, otp } = await req.json();

    if (!name || !email || !password || !otp) {
      return Response.json(
        { error: "All fields (name, email, password, otp) are required" },
        { status: 400 }
      );
    }

    // Find OTP record
    const record = await Otp.findOne({ email, otp });
    if (!record) {
      return Response.json({ error: "Invalid OTP" }, { status: 400 });
    }

    // Check expiry
    if (record.expiresAt < new Date()) {
      return Response.json({ error: "OTP expired" }, { status: 400 });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Check if user already exists (extra safeguard)
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return Response.json(
        { error: "User already registered" },
        { status: 400 }
      );
    }

    // Create user
    await User.create({
      name,
      email,
      password: hashedPassword,
      verified: true,
    });

    // Cleanup OTPs for this email
    await Otp.deleteMany({ email });

    return Response.json(
      { message: "User verified and created successfully" },
      { status: 201 }
    );
  } catch (error: any) {
    console.error("Error in signup verification:", error);

    return Response.json(
      {
        error: "Failed to verify and create user",
        details: error?.message || "Unexpected error",
      },
      { status: 500 }
    );
  }
}