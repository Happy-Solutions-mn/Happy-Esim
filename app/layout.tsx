import type { Metadata } from "next";
import "./globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export const metadata: Metadata = {
  title: "HappySim — Дэлхийн eSIM",
  description:
    "100+ улс орноор аялахдаа хямд, хурдан eSIM аваарай. Шуурхай хүргэлт, QR кодоор идэвхжүүлэх.",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="mn">
      <body>
        <Navbar />
        <main>{children}</main>
        <Footer />
      </body>
    </html>
  );
}
