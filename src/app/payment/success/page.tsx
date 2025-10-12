import { Suspense } from "react";
import { redirect } from "next/navigation";

import SuccessContent from "@/components/PaymentSuccess/SuccessContent";

export const metadata = {
  title: "Ringify | Order Success",
};

interface SuccessProps {
  searchParams: {
    session_id?: string;
  };
}

export default async function SuccessPage({ searchParams }: SuccessProps) {
  const session_id = searchParams.session_id;

  if (!session_id) {
    redirect(
      `${process.env.NEXT_PUBLIC_BASE_URL}/product/smart-rings/checkout?status=failed`
    );
  }

  return (
    <div className="bg-black min-h-screen flex flex-col items-center justify-center text-white">
      <Suspense
        fallback={
          <div className="flex flex-col items-center justify-center text-gray-300 p-10">
            <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-green-custom border-solid mb-4"></div>
            <p className="text-xs font-mulish font-semibold">
              Retrieving your order details...
            </p>
          </div>
        }
      >
        <SuccessContent session_id={session_id!} />
      </Suspense>
    </div>
  );
}
