"use server";

import { CartItemT } from "@/components/Cart/CartItems";
import Stripe from "stripe";

export interface ringPayloadT {
  size: string;
  quantity: number;
  color: string;
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

export async function createCheckoutSession(data: OrderPayloadT) {
  const payloadData = {
    user: data?.user,
    paid: data?.paid,
    free: data?.free,
    quantity: data?.quantity,
    price: data?.price,
    address: data?.address,
  };
  console.log("stripe payloadData", payloadData);
  try {
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      mode: "payment",
      line_items: [
        {
          price_data: {
            currency: "usd",
            product_data: {
              name: "Smart Ring",
            },
            unit_amount: Math.round(parseFloat(data.price) * 100),
          },
          quantity: 1,
        },
      ],
      success_url: `${process.env.NEXT_PUBLIC_BASE_URL}/payment/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.NEXT_PUBLIC_BASE_URL}/product/smart-rings/checkout?status=cancel`,
      metadata: {
        order: JSON.stringify(payloadData ?? {}),
      },
    });

    return { id: session.id, url: session.url };
  } catch (err: any) {
    console.error(err);
    throw new Error("Failed to create checkout session");
  }
}
