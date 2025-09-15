"use client";

import LoginAndSignUp from "@/components/Modals/LoginAndSignUp";
import { useAuthModal } from "@/store/loginModal";

export default function SignUpModal() {
  const { isAuthModalOpen, backgroundPath, setIsAuthModalOpen } =
    useAuthModal();
  return (
    <LoginAndSignUp
      isAuthModalOpen={isAuthModalOpen}
      backgroundPath={backgroundPath}
      setIsAuthModalOpen={setIsAuthModalOpen}
    />
  );
}
