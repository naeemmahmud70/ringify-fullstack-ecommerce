import React from "react";

import Modals from "@/components/ConditionalModal";
import Navbar from "@/components/Navbar/Navbar";

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
        <Navbar />
        {children}
        <Modals />
      </body>
    </html>
  );
}
