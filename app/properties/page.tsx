// app/properties/page.tsx
'use client';

import { useState, useEffect, useCallback } from 'react';
import { PropertyCard } from '@/components/PropertyCard';
import Link from 'next/link';
import { Property } from '@/lib/mock-data';
import { Search } from 'lucide-react';
import debounce from 'lodash.debounce';
import { Header } from '@/components/Header'; // <-- IMPORT THE NEW HEADER
import { motion } from 'framer-motion';      // <-- Import motion for animations

// REMOVE the old const Header = () => ( ... ) definition that was here

// Animation Variants
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1, // Stagger effect
    },
  },
};

export default function PropertiesPage() {
  const [properties, setProperties] = useState<Property[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // State for each filter
  const [citySearch, setCitySearch] = useState('');
  const [propertyType, setPropertyType] = useState<'sale' | 'rent' | 'all'>('all');
  const [isEcoCertified, setIsEcoCertified] = useState(false);

  const fetchProperties = async (filters: { city: string; type: string; eco: boolean }) => {
    // ... (fetchProperties function remains the same)
      setIsLoading(true);
      const params = new URLSearchParams();
      if (filters.city) params.append('city', filters.city);
      if (filters.type !== 'all') params.append('type', filters.type);
      if (filters.eco) params.append('ecoCertified', 'true');

      try {
        const response = await fetch(`/api/properties?${params.toString()}`);
        const data = await response.json();
        setProperties(data.properties);
      } catch (error) {
        console.error("Failed to fetch properties:", error);
      }
      setIsLoading(false);
  };

  const debouncedFetch = useCallback(debounce(fetchProperties, 500), []);

  useEffect(() => {
    const filters = { city: citySearch, type: propertyType, eco: isEcoCertified };
    debouncedFetch(filters);
  }, [citySearch, propertyType, isEcoCertified, debouncedFetch]);

  return (
    <div className="bg-gray-50 min-h-screen">
      <Header /> {/* <-- Use the imported Header */}
      <main className="container mx-auto px-6 py-12">
        <h1 className="text-4xl font-bold text-gray-800 mb-2">Find Your Next Home</h1>
        <p className="text-gray-600 mb-8">Use the filters below to find your perfect match.</p>

        {/* Functional Filter Bar */}
        <div className="bg-white/70 backdrop-blur-md p-4 rounded-lg shadow-md mb-8 flex flex-col md:flex-row gap-4 items-center sticky top-[75px] z-40"> {/* Added sticky and blur */}
          {/* ... (filter inputs remain the same) ... */}
           <div className="relative flex-grow w-full">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
            <input
              type="text"
              placeholder="Search by City (e.g., Metro City)"
              className="w-full border border-gray-300 rounded-lg pl-10 pr-4 py-2 focus:ring-emerald-500 focus:border-emerald-500 transition duration-200"
              value={citySearch} // Control the input value
              onChange={(e) => setCitySearch(e.target.value)}
            />
          </div>
          <div className='flex gap-2 w-full md:w-auto'>
             <button
                onClick={() => setPropertyType(propertyType === 'sale' ? 'all' : 'sale')} // Toggle 'all'
                className={`px-4 py-2 rounded-lg w-full transition-colors duration-200 ${propertyType === 'sale' ? 'bg-emerald-600 text-white shadow-sm' : 'bg-gray-100 hover:bg-gray-200 text-gray-700'}`}>
                    For Sale
             </button>
             <button
                onClick={() => setPropertyType(propertyType === 'rent' ? 'all' : 'rent')} // Toggle 'all'
                className={`px-4 py-2 rounded-lg w-full transition-colors duration-200 ${propertyType === 'rent' ? 'bg-emerald-600 text-white shadow-sm' : 'bg-gray-100 hover:bg-gray-200 text-gray-700'}`}>
                    For Rent
              </button>
          </div>
          <label className="flex items-center gap-2 cursor-pointer p-2 rounded-lg hover:bg-gray-100 transition-colors">
            <input
              type="checkbox"
              checked={isEcoCertified}
              onChange={(e) => setIsEcoCertified(e.target.checked)}
              // Apply Tailwind styles for a nicer checkbox
              className="h-4 w-4 rounded border-gray-300 text-emerald-600 focus:ring-emerald-500 transition duration-150 ease-in-out"
            />
            <span className="font-medium whitespace-nowrap text-gray-700">Eco-Certified Only</span>
          </label>
        </div>

        {isLoading ? (
          <div className="flex justify-center items-center mt-16">
             {/* Simple spinner */}
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600"></div>
            <p className="ml-3 text-gray-500">Searching...</p>
          </div>
        ) : properties.length > 0 ? (
          // Use motion.div for animation container
          <motion.div
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
            variants={containerVariants}
            initial="hidden"
            animate="visible" // Animate on initial load
          >
            {properties.map((property: Property) => (
              <PropertyCard key={property._id} property={property} />
            ))}
          </motion.div>
        ) : (
          <p className="text-center text-gray-500 mt-16">No properties found matching your criteria.</p>
        )}
      </main>
    </div>
  );
}