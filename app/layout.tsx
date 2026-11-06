import type { Metadata, Viewport } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "DineFlow — Unified Restaurant Operations & Ordering",
  description:
    "Production-grade multi-tenant SaaS platform for modern restaurant operations and table ordering.",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#FAF8F5",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased selection:bg-[#F4EFE6] selection:text-[#1C1917]">
        {children}
      </body>
    </html>
  );
}
