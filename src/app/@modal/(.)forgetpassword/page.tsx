"use client";

import LoginAndSignUp from "@/components/Modals/LoginAndSignUp";
import { useAuthModal } from "@/store/loginModal";

export default function ForgetPasswordModal() {
  const { isAuthModalOpen, setIsAuthModalOpen, backgroundPath } =
    useAuthModal();
  return (
    <LoginAndSignUp
      isAuthModalOpen={isAuthModalOpen}
      setIsAuthModalOpen={setIsAuthModalOpen}
      backgroundPath={backgroundPath}
    />
  );
}
