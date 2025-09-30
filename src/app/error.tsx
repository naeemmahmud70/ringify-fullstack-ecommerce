"use client";

import { useRouter } from "next/navigation";
import { Home, RefreshCw } from "lucide-react";

export default function GlobalError({
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  const router = useRouter();

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-black text-white px-6">
      <div className="max-w-lg w-full text-center">
        <div className="mx-auto mb-6 flex items-center justify-center w-20 h-20 rounded-full bg-red-600/20">
          <span className="text-4xl">⚠️</span>
        </div>
        <h1 className="text-4xl font-mulish font-extrabold text-red-500 drop-shadow mb-3">
          Something went wrong
        </h1>

        <p className="text-gray-400 mb-6 font-nunito">
          We encountered an unexpected error. Please try again or return to the
          homepage.
        </p>

        <div className="flex gap-4 justify-center font-poppins">
          <button
            onClick={() => reset()}
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-green-custom text-white font-medium shadow hover:bg-green-custom transition"
          >
            <RefreshCw className="w-5 h-5" />
            Try Again
          </button>

          <button
            onClick={() => router.push("/")}
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-gray-800 text-white font-medium shadow hover:bg-gray-700 transition"
          >
            <Home className="w-5 h-5" />
            Home
          </button>
        </div>
      </div>
    </div>
  );
}
