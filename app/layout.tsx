// app/layout.tsx
'use client'; // Required for SessionProvider context and useEffect

import { Inter } from "next/font/google";
import "./globals.css";
import AuthProvider from "@/components/SessionProvider"; // Import the provider
import { AnimatePresence } from 'framer-motion';      // For preloader
import { Preloader } from '@/components/Preloader';     // For preloader
import { useState, useEffect } from 'react';          // For preloader state

const inter = Inter({ subsets: ["latin"] });

// Remove or comment out metadata export in client components
// export const metadata: Metadata = { ... }; 

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const [isLoading, setIsLoading] = useState(true); // Preloader state

  useEffect(() => {                                // Preloader logic
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1200); // Adjust delay as needed
    return () => clearTimeout(timer);
  }, []);

  return (
    <html lang="en">
      <head>
        {/* Basic metadata can go here if needed */}
        <title>EstatiX - Live Smarter</title>
        <meta name="description" content="The Future of Green Real Estate." />
      </head>
      <body className={inter.className}>
        {/* THIS IS THE FIX: Wrap children with AuthProvider */}
        <AuthProvider> 
          <AnimatePresence>
            {isLoading && <Preloader />}
          </AnimatePresence>
          {!isLoading && children} {/* Render children only after loading */}
        </AuthProvider>
      </body>
    </html>
  );
}