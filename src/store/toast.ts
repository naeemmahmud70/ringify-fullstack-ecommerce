import { create } from "zustand";

type toastT = {
  message: string;
  variant?: "error" | "success" | "warning";
  triggerId: number;
};

interface toastI {
  showToastState: boolean;
  toastStates: toastT;
  SetToastStates: (toast: toastT) => void;
}

export const useToastStore = create<toastI>(set => ({
  showToastState: false,
  toastStates: {
    message: "",
    variant: "success",
    triggerId: 0,
  },
  SetToastStates: toast =>
    set((state: toastI) => ({
      toastStates: toast,
      showToastState: !state.showToastState,
      triggerId: Date.now(),
    })),
}));
