import { NextResponse } from "next/server";

import connectMongo from "@/database/connect-mongo";
import Address from "@/models/Address";

// Create new address
export async function POST(req: Request) {
  try {
    await connectMongo();

    const body = await req.json();

    if (!body.email) {
      return NextResponse.json({
        status: 400,
        success: false,
        message: "Email is required",
      });
    }

    const newAddress = await Address.create(body);

    return NextResponse.json({
      success: true,
      status: 201,
      message: "New address added successfully!",
      data: newAddress,
    });
  } catch (error: any) {
    console.error("Error saving address:", error);
    return NextResponse.json({
      success: false,
      status: 500,
      message: error.message,
    });
  }
}

// Get addresses by email
export async function GET(req: Request) {
  try {
    await connectMongo();

    const { searchParams } = new URL(req.url);
    const email = searchParams.get("email");

    if (!email) {
      return NextResponse.json({
        status: 400,
        success: false,
        message: "Email query param is required",
      });
    }

    const addresses = await Address.find({ email });

    return NextResponse.json({ status: 200, success: true, data: addresses });
  } catch (error: any) {
    return NextResponse.json({
      status: 500,
      success: false,
      message: error.message,
    });
  }
}
