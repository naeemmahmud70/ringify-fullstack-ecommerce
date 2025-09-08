import { create } from "zustand";

interface LoaderState {
  isModalOpen: boolean;
  setIsModalOpen: (isModalOpen: boolean) => void;
}

export const useLoginModal = create<LoaderState>(set => ({
  isModalOpen: false,
  setIsModalOpen: isModalOpen => set({ isModalOpen }),
}));
