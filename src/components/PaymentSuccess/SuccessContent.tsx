import { redirect } from "next/navigation";
import Stripe from "stripe";

import { getOrderById } from "@/actions/getOrder";
import { updateOrderAfterPayment } from "@/actions/order";
import BackHomeButton from "@/components/Home/BackToHome";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

interface SuccessContentProps {
  session_id: string;
}

export default async function SuccessContent({
  session_id,
}: SuccessContentProps) {
  const session: Stripe.Checkout.Session =
    await stripe.checkout.sessions.retrieve(session_id);

  if (session.metadata?.orderId) {
    if (session.payment_status !== "paid") {
      redirect(
        `${process.env.NEXT_PUBLIC_BASE_URL}/product/smart-rings/checkout?status=failed`
      );
    }
    await updateOrderAfterPayment(
      session.id,
      session.amount_total!,
      session.currency!
    );

    const orderData = await getOrderById(session.metadata?.orderId);

    return (
      <div className="bg-black min-h-screen flex flex-col items-center justify-center text-white p-6">
        <div className="bg-green-custom rounded-lg shadow-lg p-6 w-full max-w-xl text-center mb-6">
          <h1 className="text-3xl font-bold mb-2 font-mulish">
            Payment Successful!
          </h1>
          <p className="text-5xl font-mulish">
            You paid{" "}
            <span className="font-semibold">
              {(session?.amount_total ?? 0) / 100}{" "}
              {session?.currency?.toUpperCase() ?? ""}
            </span>
          </p>
        </div>

        <div className="bg-gray-900 rounded-lg shadow-lg p-6 w-full max-w-xl space-y-4 font-poppins">
          <h2 className="text-2xl font-bold mb-4">Order Summary</h2>

          <div className="flex justify-between">
            <span className="font-medium">User:</span>
            <span>{orderData?.user?.email}</span>
          </div>
          <div className="flex justify-between">
            <span className="font-medium">Paid Rings:</span>
            {orderData?.paid?.reduce(
              (total: number, ring: { quantity: number }) =>
                total + (ring.quantity || 0),
              0
            )}
          </div>
          <div className="flex justify-between">
            <span className="font-medium">Free Rings:</span>
            <span>{orderData?.free?.length}</span>
          </div>
          <div className="flex justify-between">
            <span className="font-medium">Total Quantity:</span>
            <span>{orderData?.quantity}</span>
          </div>
          <div className="flex justify-between ">
            <span className="font-medium">Total Price:</span>
            <span className="font-bold">${orderData?.price}</span>
          </div>

          <div>
            <h3 className="font-medium mt-4 mb-2">Shipping Address:</h3>
            <p className="bg-gray-700 p-4 rounded">{orderData?.address}</p>
          </div>
          <div className="flex justify-center">
            <BackHomeButton />
          </div>
        </div>
      </div>
    );
  }

  return null;
}
