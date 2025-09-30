"use server";

import connectMongo from "@/lib/connect-mongo";
import { sendAdminNotification } from "@/lib/sendAdminNotification";
import { sendOrderConfirmation } from "@/lib/sendOrderConfirmation";
import Order from "@/models/Order";

import { OrderPayloadT } from "./payment";

export async function createPendingOrder(payload: OrderPayloadT) {
  try {
    await connectMongo();

    const order = await Order.create({
      ...payload,
      status: "pending",
    });

    return order;
  } catch (error) {
    console.error("Failed to create pending order:", error);
    throw new Error("Could not create pending order");
  }
}

export async function updateOrderAfterPayment(
  stripeSessionId: string,
  amount: number,
  currency: string
) {
  try {
    await connectMongo();

    const order = await Order.findOneAndUpdate(
      { stripeSessionId },
      {
        $set: { status: "paid", amount, currency },
      },
      { new: true }
    );

    if (!order) {
      throw new Error("Order not found to update after payment");
    }

    try {
      await sendOrderConfirmation(order);
      await sendAdminNotification(order);
    } catch (emailError) {
      console.error("Failed to send emails:", emailError);
    }

    return order;
  } catch (error) {
    console.error("Failed to update order after payment:", error);
    throw new Error("Could not update order after payment");
  }
}
