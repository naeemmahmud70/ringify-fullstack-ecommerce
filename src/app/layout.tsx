import React from "react";

import Modals from "@/components/ConditionalModal";
import Navbar from "@/components/Navbar/Navbar";

import "./globals.css";
import Toastify from "@/components/Toast/Toastify";

export const metadata = {
  title: "Ringify",
  description: "A Full-Stack e-Commerce website",
};

export default function RootLayout({
  children,
  modal,
}: Readonly<{
  children: React.ReactNode;
  modal: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <Navbar />
        {children}
        {modal}
        <Modals />
        <Toastify />
      </body>
    </html>
  );
}
