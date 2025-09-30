"use server";
import Stripe from "stripe";
import { createPendingOrder } from "./order";
export interface ringPayloadT {
  size: string;
  quantity: number;
  color: string;
  basePrice?: number;
}
export interface OrderPayloadT {
  user: {};
  paid: ringPayloadT[];
  free: ringPayloadT[];
  quantity: number;
  price: string;
  address: string;
}

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

export async function createCheckoutSession(orderData: OrderPayloadT) {
  const pendingOrder = await createPendingOrder(orderData);
  console.log("paid", orderData.paid);

  const session = await stripe.checkout.sessions.create({
    mode: "payment",
    line_items: orderData.paid.map(item => ({
      price_data: {
        currency: "usd",
        product_data: {
          name: `Ring - ${item.color} - ${item.size}`,
        },
        unit_amount: Number(item.basePrice) * 100,
      },
      quantity: item.quantity,
    })),
    success_url: `${process.env.NEXT_PUBLIC_BASE_URL}/payment/success?session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `${process.env.NEXT_PUBLIC_BASE_URL}/product/smart-rings/checkout?status=cancel`,
    metadata: {
      orderId: pendingOrder._id.toString(),
    },
  });

  pendingOrder.stripeSessionId = session.id;
  await pendingOrder.save();

  return { id: session.id, url: session.url };
}
