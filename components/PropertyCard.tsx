'use client';

import { motion } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link'; // Import Link
import { BedDouble, Bath, LandPlot, BadgeCheck } from 'lucide-react';
import { Property } from '@/lib/mock-data';

const cardVariants = {
  hidden: { y: 20, opacity: 0 },
  visible: { y: 0, opacity: 1, transition: { duration: 0.5 } },
};

export function PropertyCard({ property }: { property: Property }) {
  // Make sure property._id exists before creating a link
  if (!property._id) return null;

  return (
    <Link href={`/properties/${property._id}`}>
      <motion.div
        variants={cardVariants}
        className="bg-white rounded-lg shadow-md overflow-hidden group transition-all duration-300 hover:shadow-xl hover:-translate-y-1 h-full"
      >
        <div className="relative">
          <Image
            src={property.imageUrl}
            alt={property.title}
            width={400}
            height={250}
            className="w-full h-56 object-cover group-hover:scale-105 transition-transform duration-300"
          />
          {property.ecoCertified && (
            <div className="absolute top-3 right-3 bg-emerald-600 text-white text-xs font-bold px-2 py-1 rounded-full flex items-center gap-1">
              <BadgeCheck size={14} />
              Eco-Certified
            </div>
          )}
        </div>
        <div className="p-4 space-y-3">
          <h3 className="text-lg font-bold text-gray-800 truncate">{property.title}</h3>
          <p className="text-2xl font-extrabold text-emerald-700">
            {property.type === 'sale'
              ? `$${property.price.toLocaleString()}`
              : `$${property.price.toLocaleString()}/mo`}
          </p>
          <div className="flex justify-between text-gray-600 border-t pt-3">
            <span className="flex items-center gap-2"><BedDouble size={18} /> {property.bedrooms}</span>
            <span className="flex items-center gap-2"><Bath size={18} /> {property.bathrooms}</span>
            <span className="flex items-center gap-2"><LandPlot size={18} /> {property.area.toLocaleString()} sqft</span>
          </div>
        </div>
      </motion.div>
    </Link>
  );
}