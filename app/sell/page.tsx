// app/sell/page.tsx
'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useSession, signIn } from 'next-auth/react';
import { Header } from '@/components/Header'; // Use the reusable Header
import { Property } from '@/lib/mock-data';    // Use your Property type
import { motion } from 'framer-motion';      // For animations
import { UploadCloud, Loader2 } from 'lucide-react'; // Icons

export default function SellPage() {
  // Get session status and router
  const { data: session, status } = useSession();
  const router = useRouter();

  // Form state
  const [formData, setFormData] = useState<Partial<Property>>({
    title: '',
    address: '', // Added address
    city: '',
    price: 100000,
    bedrooms: 2,
    bathrooms: 1,
    area: 1000,
    type: 'sale',
    ecoCertified: false,
    imageUrl: '',
    description: '', // Added description
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Handle form input changes
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;

    if (type === 'checkbox') {
      const { checked } = e.target as HTMLInputElement;
      setFormData((prev) => ({ ...prev, [name]: checked }));
    } else {
      // Basic sanitization for text inputs (optional but good practice)
      const sanitizedValue = value.replace(/<[^>]*>?/gm, ''); // Remove potential HTML tags
      setFormData((prev) => ({ ...prev, [name]: sanitizedValue }));
    }
  };

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (status !== 'authenticated') {
      setError('You must be signed in to list a property.');
      signIn('google'); // Prompt sign-in
      return;
    }
    setIsSubmitting(true);
    setError(null);

    try {
      // Send data to the API endpoint
      const response = await fetch('/api/properties', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        // Add owner info (example using email, adapt if using user ID)
        body: JSON.stringify({ ...formData, ownerEmail: session?.user?.email }),
      });

      if (response.ok) {
        const data = await response.json();
        // Redirect to the newly created property's page
        router.push(`/properties/${data.propertyId}`);
      } else {
        const errorData = await response.json();
        setError(errorData.error || 'Failed to create property. Please try again.');
      }
    } catch (err) {
      console.error(err);
      setError('An unexpected error occurred. Please check your connection and try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Show loading state while session is being checked
  if (status === 'loading') {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin text-emerald-600" />
      </div>
    );
  }

  // Redirect unauthenticated users
  if (status === 'unauthenticated') {
     // Optionally show a message before redirecting
     return (
        <div className="flex flex-col justify-center items-center min-h-screen text-center p-4">
             <h2 className="text-2xl font-semibold mb-4">Authentication Required</h2>
             <p className="text-gray-600 mb-6">Please sign in to list your property.</p>
             <button
               onClick={() => signIn('google')}
               className="bg-emerald-600 text-white px-6 py-2 rounded-lg hover:bg-emerald-700 transition-colors"
             >
               Sign In with Google
             </button>
        </div>
     );
  }

  // Render the form for authenticated users
  return (
    <div className="bg-gradient-to-br from-emerald-50 via-white to-teal-50 min-h-screen"> {/* Nice background */}
      <Header />
      <main className="container mx-auto px-4 sm:px-6 py-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h1 className="text-3xl sm:text-4xl font-bold text-gray-800 mb-8 text-center">List Your Property</h1>

          {/* Glassmorphic Form Container with animations */}
          <motion.form
            onSubmit={handleSubmit}
            className="bg-white/60 backdrop-blur-lg p-6 sm:p-8 rounded-xl shadow-lg space-y-6 max-w-3xl mx-auto border border-gray-200/50"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2, duration: 0.4 }}
          >
            {/* Title */}
            <div>
              <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">Property Title</label>
              <input type="text" id="title" name="title" onChange={handleChange} value={formData.title} className="input-style" required placeholder="e.g., Cozy Downtown Apartment"/>
            </div>

            {/* Address */}
            <div>
              <label htmlFor="address" className="block text-sm font-medium text-gray-700 mb-1">Full Address</label>
              <input type="text" id="address" name="address" onChange={handleChange} value={formData.address} className="input-style" required placeholder="e.g., 123 Main St, Apt 4B"/>
            </div>

            {/* City & Price */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label htmlFor="city" className="block text-sm font-medium text-gray-700 mb-1">City</label>
                <input type="text" id="city" name="city" onChange={handleChange} value={formData.city} className="input-style" required placeholder="e.g., Metro City"/>
              </div>
              <div>
                <label htmlFor="price" className="block text-sm font-medium text-gray-700 mb-1">Price ($)</label>
                <input type="number" id="price" name="price" min="0" onChange={handleChange} value={formData.price} className="input-style" required />
              </div>
            </div>

            {/* Beds, Baths, Area */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <label htmlFor="bedrooms" className="block text-sm font-medium text-gray-700 mb-1">Bedrooms</label>
                <input type="number" id="bedrooms" name="bedrooms" min="0" onChange={handleChange} value={formData.bedrooms} className="input-style" />
              </div>
              <div>
                <label htmlFor="bathrooms" className="block text-sm font-medium text-gray-700 mb-1">Bathrooms</label>
                <input type="number" id="bathrooms" min="0" step="0.5" onChange={handleChange} value={formData.bathrooms} className="input-style" />
              </div>
              <div>
                <label htmlFor="area" className="block text-sm font-medium text-gray-700 mb-1">Area (sqft)</label>
                <input type="number" id="area" name="area" min="0" onChange={handleChange} value={formData.area} className="input-style" />
              </div>
            </div>

             {/* Description */}
            <div>
              <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">Description</label>
              <textarea id="description" name="description" rows={4} onChange={handleChange} value={formData.description} className="input-style" placeholder="Tell us about the property..."></textarea>
            </div>

            {/* Image URL */}
            <div>
              <label htmlFor="imageUrl" className="block text-sm font-medium text-gray-700 mb-1">Image URL</label>
              <input type="url" id="imageUrl" name="imageUrl" onChange={handleChange} value={formData.imageUrl} className="input-style" required placeholder="https://images.unsplash.com/..."/>
              <p className="mt-1 text-xs text-gray-500">Please provide a direct link to an image (e.g., from Unsplash).</p>
            </div>

             {/* Type & Eco-Certified */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <div>
                <label htmlFor="type" className="block text-sm font-medium text-gray-700 mb-1">Listing Type</label>
                <select id="type" name="type" onChange={handleChange} value={formData.type} className="mt-1 block rounded-lg border-gray-300 shadow-sm focus:border-emerald-500 focus:ring-emerald-500 py-2 px-3 transition duration-150 ease-in-out">
                  <option value="sale">For Sale</option>
                  <option value="rent">For Rent</option>
                </select>
              </div>
              {/* Checkbox with label */}
              <label className="flex items-center gap-2 cursor-pointer mt-2 sm:mt-0 p-2 rounded-lg hover:bg-emerald-50/50 transition-colors">
                <input
                    type="checkbox"
                    name="ecoCertified"
                    checked={!!formData.ecoCertified}
                    onChange={handleChange}
                    className="h-4 w-4 rounded border-gray-300 text-emerald-600 focus:ring-emerald-500 transition duration-150 ease-in-out"
                />
                <span className="font-medium text-gray-700 text-sm">Eco-Certified Property</span>
              </label>
            </div>

            {/* Error Message */}
            {error && (
              <p className="text-sm text-red-600 bg-red-100 p-3 rounded-md">{error}</p>
            )}

            {/* Submit Button */}
            <motion.button
              type="submit"
              disabled={isSubmitting}
              className="w-full flex justify-center items-center gap-2 bg-emerald-600 text-white py-3 px-4 rounded-lg font-semibold hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500 transition duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="h-5 w-5 animate-spin" /> Submitting...
                </>
              ) : (
                <>
                  <UploadCloud className="h-5 w-5" /> List Property
                </>
              )}
            </motion.button>
          </motion.form>
        </motion.div>
      </main>
      {/* Add a simple footer */}
      <footer className="text-center py-4 text-gray-500 text-sm">
        © {new Date().getFullYear()} EstatiX. All rights reserved.
      </footer>
      {/* Helper class for input styling */}
      <style jsx global>{`
        .input-style {
          display: block;
          width: 100%;
          margin-top: 0.25rem;
          border-radius: 0.5rem; /* lg */
          border-width: 1px;
          border-color: #D1D5DB; /* gray-300 */
          box-shadow: 0 1px 2px 0 rgb(0 0 0 / 0.05); /* sm */
          padding: 0.5rem 0.75rem; /* py-2 px-3 */
          transition: border-color 0.15s ease-in-out, box-shadow 0.15s ease-in-out;
        }
        .input-style:focus {
          border-color: #059669; /* emerald-600 */
          outline: none;
          box-shadow: 0 0 0 3px rgba(16, 185, 129, 0.3); /* ring-emerald-500 with opacity */
        }
      `}</style>
    </div>
  );
}