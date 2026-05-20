import type { Metadata } from "next";
import { Toaster } from "@/components/ui/sonner";
import "./globals.css";

export const metadata: Metadata = {
  title: "BANDEJA - Padel Booking",
  description:
    "Book lapangan, temukan pelatih terbaik, dan tantang lawan baru dalam satu platform padel premium.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="id" className="h-full scroll-smooth antialiased">
      <body className="min-h-full bg-[#0a0a08] text-neutral-100">
        {children}
        <Toaster />
      </body>
    </html>
  );
}
