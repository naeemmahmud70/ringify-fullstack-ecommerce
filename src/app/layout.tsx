import React, { Suspense } from "react";

import Modals from "@/components/ConditionalModal";
import Navbar from "@/components/Navbar/Navbar";
import Toastify from "@/components/Toast/Toastify";

import "./globals.css";

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
        <Suspense>
          <Navbar />
          {children}
          {modal}
          <Modals />
          <Toastify />
        </Suspense>
      </body>
    </html>
  );
}
