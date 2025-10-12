import mongoose from "mongoose";

const otpRequestSchema = new mongoose.Schema({
  email: { type: String, required: true, index: true },
  name: { type: String },
  passwordHash: { type: String },
  otp: { type: String, required: true },
  expiresAt: { type: Date, required: true },
  createdAt: { type: Date, default: Date.now },
});

export default mongoose.models.OtpRequest ||
  mongoose.model("OtpRequest", otpRequestSchema);
