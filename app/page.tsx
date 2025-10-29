// app/page.tsx
"use client"; // <-- Try changing to double quotes

import { motion } from 'framer-motion';
import { Leaf, ShieldCheck, Cpu } from 'lucide-react'; // Corrected import based on file content
import Link from 'next/link';
import { Header } from '@/components/Header'; // Make sure this import is here

// REMOVE any old Header definition if it was still here

export default function HomePage() {
  return (
    <div className="flex flex-col min-h-screen bg-gray-50 text-gray-800">
      <Header />
      <main className="flex-grow">
        {/* Hero Section */}
        <section
          className="relative h-[70vh] flex items-center justify-center text-white bg-cover bg-center"
          style={{ backgroundImage: "url('https://images.unsplash.com/photo-1600585154340-be6161a56a0c?q=80&w=2670&auto=format&fit=crop')" }}
        >
          <div className="absolute inset-0 bg-black/50"></div>
          <div className="relative z-10 container mx-auto px-6 text-center">
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="text-4xl md:text-6xl font-extrabold"
            >
              The Future of Green Real Estate.
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="mt-4 text-lg md:text-xl max-w-3xl mx-auto"
            >
              LIVE SMARTER. Discover verified eco-friendly homes with AI-powered insights.
            </motion.p>
          </div>
        </section>

        {/* Features Section */}
        <section className="py-20 bg-white">
          <div className="container mx-auto px-6 text-center">
            <h2 className="text-3xl font-bold text-gray-800 mb-12">Why Choose EstatiX?</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
              <div className="flex flex-col items-center">
                <Leaf className="w-12 h-12 text-emerald-600" />
                <h3 className="mt-4 text-xl font-semibold">Eco-Verified Listings</h3>
                <p className="mt-2 text-gray-600">Find homes with certified "Green Tags" and sustainability scores.</p>
              </div>
              <div className="flex flex-col items-center">
                <ShieldCheck className="w-12 h-12 text-emerald-600" />
                <h3 className="mt-4 text-xl font-semibold">Secure Digital Transactions</h3>
                <p className="mt-2 text-gray-600">Utilize escrow and e-signing for safe and transparent deals.</p>
              </div>
              <div className="flex flex-col items-center">
                <Cpu className="w-12 h-12 text-emerald-600" />
                <h3 className="mt-4 text-xl font-semibold">AI-Powered Matching</h3>
                <p className="mt-2 text-gray-600">Get suggestions based on your lifestyle, not just price and location.</p>
              </div>
            </div>
          </div>
        </section>
      </main>
       {/* Simple Footer */}
       <footer className="text-center py-4 text-gray-500 text-sm border-t border-gray-200 mt-12">
         © {new Date().getFullYear()} EstatiX. All rights reserved.
       </footer>
    </div>
  );
}