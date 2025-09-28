// app/actions/order.ts
"use server";

import connectMongo from "@/lib/connect-mongo";
import Order from "@/models/Order";
import { Resend } from "resend";

export interface OrderPayloadT {
  user: { email: string; name?: string };
  paidRings: number;
  freeRings: number;
  ringQuantity: number;
  price: string;
  fullAddress: string;
}

const resend = new Resend(process.env.RESEND_API_KEY);

export async function saveOrderToDB(
  payload: OrderPayloadT,
  stripeSessionId: string,
  amount: number,
  currency: string
) {
  await connectMongo();

  // prevent duplicate insertion
  const existing = await Order.findOne({ stripeSessionId });
  if (existing) return existing;

  const newOrder = await Order.create({
    ...payload,
    stripeSessionId,
    amount,
    currency,
    status: "paid",
  });

  // --- Send Email to User ---
  await resend.emails.send({
    from: "onboarding@resend.dev", // replace with your domain if verified
    to: "naeemmahmud370@gmail.com",
    subject: "Order Confirmation - Smart Ring",
    html: `
      <h2>Hi ${payload.user.name || ""},</h2>
      <p>Your order was successful 🎉</p>
      <p><b>Total Paid:</b> $${payload.price}</p>
      <p>Thank you for shopping with us!</p>
    `,
  });

  // --- Send Email to Admin ---
  await resend.emails.send({
    from: "onboarding@resend.dev",
    to: "naeemmahmud370@gmail.com",
    subject: "New Order Received - Smart Ring",
    html: `
      <h2>New Order Received</h2>
      <pre>${JSON.stringify(payload, null, 2)}</pre>
    `,
  });

  return newOrder;
}
