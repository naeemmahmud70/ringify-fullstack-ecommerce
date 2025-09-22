import { NextResponse } from "next/server";
import Address from "@/models/Address";
import connectMongo from "@/lib/connect-mongo";

// ✅ Update an address by ID
export async function PUT(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    await connectMongo();
    const body = await req.json();
    const { id } = params;

    const updatedAddress = await Address.findByIdAndUpdate(
      id,
      { $set: body },
      { new: true, runValidators: true }
    );

    if (!updatedAddress) {
      return NextResponse.json({ status: 404, message: "Address not found!" });
    }

    return NextResponse.json({
      status: 200,
      message: "Address updated successfully!",
      address: updatedAddress,
    });
  } catch (error) {
    console.error("Error updating address:", error);
    return NextResponse.json({
      status: 500,
      message: "Error updating address",
      error,
    });
  }
}
