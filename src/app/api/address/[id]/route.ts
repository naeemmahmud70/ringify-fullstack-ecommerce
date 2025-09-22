import { NextResponse } from "next/server";

import connectMongo from "@/lib/connect-mongo";
import Address from "@/models/Address";

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

export async function DELETE(
  req: Request,
  { params }: { params: { id: string } }
) {
  console.log("req", req);
  try {
    await connectMongo();
    const { id } = params;
    console.log("id", id);
    const deletedAddress = await Address.findByIdAndDelete(id);

    if (!deletedAddress) {
      return NextResponse.json(
        { message: "Address not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { message: "Address deleted successfully" },
      { status: 200 }
    );
  } catch (error: any) {
    console.error("Error deleting address:", error);
    return NextResponse.json(
      { message: error.message || "Something went wrong!" },
      { status: 500 }
    );
  }
}
