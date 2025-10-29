'use client';

import { motion } from 'framer-motion';
import { MapPin, Search, Leaf, ShieldCheck, Cpu } from 'lucide-react';
import Link from 'next/link';

// Reusable Header Component for consistent navigation
const Header = () => (
  <motion.header
    initial={{ y: -100, opacity: 0 }}
    animate={{ y: 0, opacity: 1 }}
    transition={{ duration: 0.5 }}
    className="w-full bg-white/80 backdrop-blur-sm shadow-md sticky top-0 z-50"
  >
    <nav className="container mx-auto px-6 py-4 flex justify-between items-center">
      <Link href="/" className="text-2xl font-bold text-emerald-800">EstatiX</Link>
      <div className="hidden md:flex items-center space-x-6 text-gray-700">
        <Link href="/properties" className="hover:text-emerald-600 transition-colors">Buy</Link>
        <a href="#" className="hover:text-emerald-600 transition-colors">Sell</a>
        <a href="#" className="hover:text-emerald-600 transition-colors">About</a>
      </div>
      <div className="flex items-center space-x-4">
        <a href="#" className="bg-emerald-600 text-white px-5 py-2 rounded-lg hover:bg-emerald-700 transition-all font-medium">
          Sign Up
        </a>
      </div>
    </nav>
  </motion.header>
);

export default function HomePage() {
  return (
    <div className="flex flex-col min-h-screen bg-gray-50 text-gray-800">
      <Header />
      <main className="flex-grow">
        {/* Hero Section with background image and glass effect */}
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
    </div>
  );
}