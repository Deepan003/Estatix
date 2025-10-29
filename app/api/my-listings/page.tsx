// app/my-listings/page.tsx
'use client';

import { useState, useEffect } from 'react';
import { useSession, signIn } from 'next-auth/react';
import { Header } from '@/components/Header';
import { PropertyCard } from '@/components/PropertyCard'; // Reuse your PropertyCard
import { Property } from '@/lib/mock-data';
import { Loader2, AlertCircle, Home } from 'lucide-react'; // Icons
import Link from 'next/link';
import { motion } from 'framer-motion';

// Animation variants (similar to properties page)
const containerVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.1 } },
};

export default function MyListingsPage() {
  const { data: session, status } = useSession();
  const [properties, setProperties] = useState<Property[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Fetch listings only if the user is authenticated
    if (status === 'authenticated') {
      const fetchMyListings = async () => {
        setIsLoading(true);
        setError(null);
        try {
          const response = await fetch('/api/my-listings');
          if (!response.ok) {
            throw new Error(`Failed to fetch listings: ${response.statusText}`);
          }
          const data = await response.json();
          setProperties(data.properties || []); // Ensure properties is an array
        } catch (err) {
          console.error("Error fetching my listings:", err);
          setError(err instanceof Error ? err.message : 'An unknown error occurred.');
          setProperties([]); // Clear properties on error
        } finally {
          setIsLoading(false);
        }
      };
      fetchMyListings();
    } else if (status === 'unauthenticated') {
      // If user logs out while on the page, clear listings and stop loading
      setIsLoading(false);
      setProperties([]);
    }
    // No need to fetch if status is 'loading'
  }, [status]); // Re-fetch when authentication status changes

  // Loading state
  if (status === 'loading' || (status === 'authenticated' && isLoading)) {
    return (
      <div className="bg-gray-50 min-h-screen">
        <Header />
        <div className="flex justify-center items-center min-h-[calc(100vh-80px)]">
          <Loader2 className="h-10 w-10 animate-spin text-emerald-600" />
        </div>
      </div>
    );
  }

  // Unauthenticated state
  if (status === 'unauthenticated') {
    return (
      <div className="bg-gray-50 min-h-screen">
         <Header />
         <div className="container mx-auto px-6 py-20 flex flex-col items-center text-center">
            <AlertCircle className="w-12 h-12 text-yellow-500 mb-4" />
            <h1 className="text-2xl font-semibold mb-4 text-gray-800">Please Sign In</h1>
            <p className="text-gray-600 mb-6 max-w-md">You need to be logged in to view your property listings.</p>
            <button
               onClick={() => signIn('google')}
               className="bg-emerald-600 text-white px-6 py-2 rounded-lg hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500 transition-colors"
             >
               Sign In with Google
             </button>
         </div>
      </div>
    );
  }

  // --- Authenticated state ---
  return (
    <div className="bg-gray-50 min-h-screen">
      <Header />
      <main className="container mx-auto px-6 py-12">
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h1 className="text-3xl md:text-4xl font-bold text-gray-800 mb-8">My Property Listings</h1>

          {error && (
            <div className="bg-red-100 border border-red-300 text-red-800 px-4 py-3 rounded-lg mb-6 flex items-center gap-2">
              <AlertCircle className="w-5 h-5"/> Error fetching listings: {error}
            </div>
          )}

          {!isLoading && properties.length === 0 && !error && (
            <div className="text-center py-16 px-6 bg-white rounded-lg shadow-md border border-gray-200">
               <Home className="w-16 h-16 text-gray-400 mx-auto mb-4"/>
              <h2 className="text-xl font-semibold text-gray-700 mb-2">No Listings Yet</h2>
              <p className="text-gray-500 mb-6">You haven't listed any properties. Start selling or renting today!</p>
              <Link href="/sell" className="bg-emerald-600 text-white px-6 py-2 rounded-lg hover:bg-emerald-700 transition-colors font-medium">
                List a Property
              </Link>
            </div>
          )}

          {properties.length > 0 && (
            <motion.div
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
              variants={containerVariants}
              initial="hidden"
              animate="visible"
            >
              {properties.map((property) => (
                <PropertyCard key={property._id} property={property} />
                // Add Edit/Delete buttons here or inside PropertyCard later
              ))}
            </motion.div>
          )}
        </motion.div>
      </main>
      {/* Footer */}
       <footer className="text-center py-6 text-gray-500 text-sm mt-12 border-t border-gray-200">
         © {new Date().getFullYear()} EstatiX - Manage your listings.
       </footer>
    </div>
  );
}