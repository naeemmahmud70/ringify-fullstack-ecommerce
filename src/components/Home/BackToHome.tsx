"use client";

import { useLoggedInUser, useSelectedRings } from "@/store/users";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function BackHomeButton() {
  const router = useRouter();
  const { setSelectedRings } = useSelectedRings();
  const { loggedInUser } = useLoggedInUser();
  if (!loggedInUser.email) {
    router.push("/");
  }
  useEffect(() => {
    setSelectedRings([]);
    localStorage.removeItem("selectedRingDetails");
  }, []);
  return (
    <Link
      href="/product/smart-rings/select-rings"
      className="inline-block text-[14px] font-poppins bg-green-custom hover:bg-green-custom text-white font-semibold py-2 px-6 rounded-lg transition-transform transform hover:scale-105"
    >
      Buy more
    </Link>
  );
}
