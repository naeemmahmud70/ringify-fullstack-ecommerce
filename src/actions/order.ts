// app/actions/order.ts
"use server";

import connectMongo from "@/lib/connect-mongo";
import Order from "@/models/Order";
import { Resend } from "resend";
import { ringPayloadT } from "./payment";
import { sendOrderConfirmation } from "@/lib/sendOrderConfirmation";
import { sendAdminNotification } from "@/lib/sendAdminNotification";

export interface OrderPayloadT {
  user: { email: string; name?: string };
  paid: ringPayloadT[];
  free: ringPayloadT[];
  quantity: number;
  price: string;
  address: string;
}

const resend = new Resend(process.env.RESEND_API_KEY);

export async function saveOrderToDB(
  payload: OrderPayloadT,
  stripeSessionId: string,
  amount: number,
  currency: string
) {
  await connectMongo();
  const { user, paid, free, quantity, price, address } = payload;

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
  await sendOrderConfirmation(payload);
  await sendAdminNotification(payload);

  // --- Send Email to Admin ---
  // await resend.emails.send({
  //   from: "onboarding@resend.dev",
  //   to: "naeemmahmud370@gmail.com",
  //   subject: "New Order Received - Smart Ring",
  //   html: `
  //     <h2>New Order Received</h2>
  //     <pre>${JSON.stringify(payload, null, 2)}</pre>
  //   `,
  // });

  return newOrder;
}
