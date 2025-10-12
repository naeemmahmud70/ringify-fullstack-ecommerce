"use client";

import { CartProvider } from "./CartContext";

export const AppProviders = ({ children }: { children: React.ReactNode }) => {
  return <CartProvider>{children}</CartProvider>;
};
