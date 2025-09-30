"use client";

import { usePathname } from "next/navigation";
import { useRouter } from "next/navigation";
import { ArrowLeft, Home } from "lucide-react";

export default function NotFoundClient() {
  const pathname = usePathname();
  const router = useRouter();

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-black text-center px-6">
      <div className="max-w-lg w-full">
        <h1 className="text-8xl font-extrabold font-nunito bg-gradient-to-r from-green-custom to-purple-600 bg-clip-text text-transparent drop-shadow-lg">
          404
        </h1>
        <h2 className="text-3xl font-semibold font-mulish text-white mt-4">
          Oops! Page not found
        </h2>
        <p className="text-gray-400 mt-3 font-nunito">
          The page{" "}
          <span className="font-mono text-green-400 bg-green-950 px-2 py-1 rounded">
            {pathname}
          </span>{" "}
          does not exist.
        </p>
        <div className="mt-10 flex gap-4 justify-center font-poppins">
          <button
            onClick={() => router.back()}
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-green-custom text-white font-medium shadow hover:bg-green-custom transition font-nunito"
          >
            <ArrowLeft className="w-5 h-5" />
            Go Back
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
