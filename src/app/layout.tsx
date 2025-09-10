import React from "react";

import Modals from "@/components/ConditionalModal";
import Navbar from "@/components/Navbar/Navbar";
import { AppProviders } from "@/context/AppProviders";

import "./globals.css";

export const metadata = {
  title: "Ringify",
  description: "A Full-Stack e-Commerce website",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <AppProviders>
          <Navbar />
          {children}
        </AppProviders>
        <Modals />
      </body>
    </html>
  );
}
