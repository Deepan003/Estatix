// components/Header.tsx
'use client';

import { useSession, signIn, signOut } from 'next-auth/react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { User, LogOut, LogIn, ListPlus } from 'lucide-react'; // Import icons

export const Header = () => {
  const { data: session, status } = useSession(); // Get status too

  return (
    <motion.header /* ... existing header props ... */
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="w-full bg-white/80 backdrop-blur-md shadow-sm sticky top-0 z-50"
    >
      <nav className="container mx-auto px-6 py-4 flex justify-between items-center">
        <Link href="/" className="text-2xl font-bold text-emerald-800 hover:text-emerald-600 transition-colors">
          EstatiX
        </Link>
        {/* Main navigation */}
        <div className="hidden md:flex items-center space-x-6 text-gray-700">
          <Link href="/properties" className="hover:text-emerald-600 transition-colors">Buy</Link>
          <Link href="/sell" className="hover:text-emerald-600 transition-colors">Sell</Link>
          {/* Add My Listings link if logged in */}
          {session && (
             <Link href="/my-listings" className="hover:text-emerald-600 transition-colors">My Listings</Link>
          )}
          <Link href="/about" className="hover:text-emerald-600 transition-colors">About</Link>
        </div>

        {/* Auth section */}
        <div className="flex items-center space-x-3 sm:space-x-4">
          {status === 'loading' ? (
            <div className="w-8 h-8 rounded-full bg-gray-200 animate-pulse"></div> // Simple placeholder
          ) : session ? (
            // User is signed in
            <>
               {/* Optional: User Profile Image */}
               {session.user?.image ? (
                 <img src={session.user.image} alt="Avatar" className="w-8 h-8 rounded-full border border-gray-300"/>
               ) : (
                 <span className="inline-flex items-center justify-center h-8 w-8 rounded-full bg-gray-200 text-gray-500">
                    <User size={18}/>
                 </span>
               )}
              <span className="text-sm font-medium text-gray-600 hidden lg:block"> {/* Show on large screens */}
                {session.user?.name?.split(' ')[0]}
              </span>
              <button
                onClick={() => signOut()}
                className="flex items-center gap-1.5 bg-gray-100 text-gray-700 px-3 py-1.5 sm:px-4 sm:py-2 rounded-lg hover:bg-gray-200 transition-colors font-medium text-sm"
                title="Sign Out"
              >
                 <LogOut size={16}/>
                 <span className="hidden sm:inline">Sign Out</span>
              </button>
            </>
          ) : (
            // User is signed out
            <>
                {/* Optional: Add Sell link here too if desired */}
                {/* <Link href="/sell" className="text-gray-600 hover:text-emerald-600 transition-colors hidden sm:inline-flex items-center gap-1.5 text-sm font-medium">
                    <ListPlus size={16}/> Sell
                </Link> */}
                <button
                onClick={() => signIn('google')}
                className="flex items-center gap-1.5 bg-emerald-600 text-white px-3 py-1.5 sm:px-4 sm:py-2 rounded-lg hover:bg-emerald-700 transition-colors font-medium text-sm"
                >
                <LogIn size={16}/>
                <span className="hidden sm:inline">Sign In</span>
                <span className="sm:hidden">Sign In</span>
                </button>
            </>
          )}
        </div>
      </nav>
    </motion.header>
  );
};