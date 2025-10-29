'use client';

import { useState, useEffect, useCallback } from 'react';
import { PropertyCard } from '@/components/PropertyCard';
import Link from 'next/link';
import { Property } from '@/lib/mock-data';
import { Search } from 'lucide-react';
import debounce from 'lodash.debounce';

// Header component remains the same
const Header = () => (
    <header className="w-full bg-white/80 backdrop-blur-sm shadow-md sticky top-0 z-50">
       <nav className="container mx-auto px-6 py-4 flex justify-between items-center">
        <Link href="/" className="text-2xl font-bold text-emerald-800">EstatiX</Link>
        <div className="hidden md:flex items-center space-x-6 text-gray-700">
          <Link href="/properties" className="text-emerald-600 font-semibold">Buy</Link>
          <a href="#" className="hover:text-emerald-600 transition-colors">Sell</a>
          <a href="#" className="hover:text-emerald-600 transition-colors">About</a>
        </div>
        <div className="flex items-center space-x-4">
          <a href="#" className="bg-emerald-600 text-white px-5 py-2 rounded-lg hover:bg-emerald-700 font-medium">Sign Up</a>
        </div>
      </nav>
    </header>
);

export default function PropertiesPage() {
  const [properties, setProperties] = useState<Property[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  
  // State for each filter
  const [citySearch, setCitySearch] = useState('');
  const [propertyType, setPropertyType] = useState<'sale' | 'rent' | 'all'>('all');
  const [isEcoCertified, setIsEcoCertified] = useState(false);

  // Function to fetch properties based on current filter state
  const fetchProperties = async (filters: { city: string; type: string; eco: boolean }) => {
    setIsLoading(true);
    // Construct the query string
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

  // Debounce the fetch function to avoid too many API calls while typing
  const debouncedFetch = useCallback(debounce(fetchProperties, 500), []);

  // useEffect to trigger fetch when filters change
  useEffect(() => {
    const filters = {
      city: citySearch,
      type: propertyType,
      eco: isEcoCertified,
    };
    debouncedFetch(filters);
  }, [citySearch, propertyType, isEcoCertified, debouncedFetch]);

  return (
    <div className="bg-gray-50 min-h-screen">
      <Header />
      <main className="container mx-auto px-6 py-12">
        <h1 className="text-4xl font-bold text-gray-800 mb-2">Find Your Next Home</h1>
        <p className="text-gray-600 mb-8">Use the filters below to find your perfect match.</p>
        
        {/* Functional Filter Bar */}
        <div className="bg-white p-4 rounded-lg shadow-md mb-8 flex flex-col md:flex-row gap-4 items-center">
          <div className="relative flex-grow w-full">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
            <input 
              type="text" 
              placeholder="Search by City (e.g., Metro City)"
              className="w-full border border-gray-300 rounded-lg pl-10 pr-4 py-2 focus:ring-emerald-500 focus:border-emerald-500"
              onChange={(e) => setCitySearch(e.target.value)}
            />
          </div>
          <div className='flex gap-2 w-full md:w-auto'>
             <button onClick={() => setPropertyType('sale')} className={`px-4 py-2 rounded-lg w-full ${propertyType === 'sale' ? 'bg-emerald-600 text-white' : 'bg-gray-200 text-gray-700'}`}>For Sale</button>
             <button onClick={() => setPropertyType('rent')} className={`px-4 py-2 rounded-lg w-full ${propertyType === 'rent' ? 'bg-emerald-600 text-white' : 'bg-gray-200 text-gray-700'}`}>For Rent</button>
          </div>
          <label className="flex items-center gap-2 cursor-pointer p-2 rounded-lg hover:bg-gray-100">
            <input type="checkbox" checked={isEcoCertified} onChange={(e) => setIsEcoCertified(e.target.checked)} className="h-4 w-4 rounded text-emerald-600 focus:ring-emerald-500"/>
            <span className="font-medium whitespace-nowrap">Eco-Certified Only</span>
          </label>
        </div>

        {isLoading ? (
          <p className="text-center text-gray-500 mt-16">Searching...</p>
        ) : properties.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {properties.map((property: Property) => (
              <PropertyCard key={property._id} property={property} />
            ))}
          </div>
        ) : (
          <p className="text-center text-gray-500 mt-16">No properties found matching your criteria.</p>
        )}
      </main>
    </div>
  );
}