import { create } from "zustand";

interface LoaderState {
  loading: boolean;
  setLoading: (loading: boolean) => void;
}

export const useLoading = create<LoaderState>(set => ({
  loading: false,
  setLoading: loading => set({ loading }),
}));
