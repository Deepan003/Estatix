import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "EstatiX - Live Smarter",
  description: "The Future of Green Real Estate.",
};

export default function RootLayout({
  children,
}: Readonly<{
  // This is the corrected line:
  children: React.ReactNode; 
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>{children}</body>
    </html>
  );
}