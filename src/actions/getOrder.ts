import mongoose from "mongoose";

import connectMongo from "@/database/connect-mongo";
import Order from "@/models/Order";

export async function getOrderById(orderId: string) {
  try {
    await connectMongo();

    if (!mongoose.Types.ObjectId.isValid(orderId)) {
      throw new Error("Invalid order ID format!");
    }

    const order = await Order.findById(orderId);
    if (!order) {
      throw new Error("Order not found!");
    }

    return order;
  } catch (err) {
    console.error("Error fetching order by ID:", err);
    throw new Error("Failed to fetch order data!");
  }
}
