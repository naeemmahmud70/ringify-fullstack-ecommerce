import React from "react";
import "./globals.css";
import Navbar from "@/components/Navbar/Navbar";
import { AppProviders } from "@/context/AppProviders";

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
      </body>
    </html>
  );
}
