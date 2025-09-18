import { create } from "zustand";

interface LoaderState {
  isAuthModalOpen: boolean;
  backgroundPath: string;
  setIsAuthModalOpen: (isAuthModalOpen: boolean) => void;
  setBackgroundPath: (path: string) => void;
}

export const useAuthModal = create<LoaderState>(set => ({
  isAuthModalOpen: false,
  backgroundPath: "/",
  setIsAuthModalOpen: isAuthModalOpen => set({ isAuthModalOpen }),
  setBackgroundPath: (path: string) => set({ backgroundPath: path }),
}));
