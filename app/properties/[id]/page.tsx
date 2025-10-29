import clientPromise from "@/lib/mongodb";
import { Property } from "@/lib/mock-data";
import { ObjectId } from "mongodb"; // Import ObjectId
import Link from "next/link";
import Image from "next/image";
import { BedDouble, Bath, LandPlot, BadgeCheck, ChevronLeft } from "lucide-react";

// This function fetches a SINGLE property from MongoDB using its unique ID
async function getPropertyById(id: string): Promise<Property | null> {
  try {
    const client = await clientPromise;
    const db = client.db(process.env.MONGODB_DB);
    
    // MongoDB uses ObjectId for its _id field, so we must convert the string ID
    const property = await db.collection('properties').findOne({ _id: new ObjectId(id) });

    if (!property) return null;

    return JSON.parse(JSON.stringify(property));
  } catch (e) {
    console.error('Failed to fetch property:', e);
    return null;
  }
}

// This is the main page component
export default async function PropertyDetailPage({ params }: { params: { id: string } }) {
  const property = await getPropertyById(params.id);

  if (!property) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen">
        <h1 className="text-2xl font-bold">Property not found.</h1>
        <Link href="/properties" className="mt-4 text-emerald-600 hover:underline">
          Back to listings
        </Link>
      </div>
    );
  }

  return (
    <div className="bg-gray-50 min-h-screen">
      <div className="container mx-auto px-4 py-8">
        <Link href="/properties" className="inline-flex items-center gap-2 text-emerald-600 hover:underline mb-6">
          <ChevronLeft size={20} />
          Back to Listings
        </Link>

        <div className="bg-white rounded-lg shadow-lg overflow-hidden">
          <Image
            src={property.imageUrl}
            alt={property.title}
            width={1200}
            height={600}
            className="w-full h-[50vh] object-cover"
            priority // Load this image first
          />
          <div className="p-8">
            <div className="flex flex-col md:flex-row justify-between items-start">
                <div>
                    <h1 className="text-4xl font-bold text-gray-800">{property.title}</h1>
                    <p className="text-gray-500 mt-2">{property.address}, {property.city}</p>
                </div>
                <div className="mt-4 md:mt-0 text-4xl font-extrabold text-emerald-700">
                    {property.type === 'sale'
                    ? `$${property.price.toLocaleString()}`
                    : `$${property.price.toLocaleString()}/mo`}
                </div>
            </div>

            {property.ecoCertified && (
                <div className="mt-4 inline-flex items-center gap-2 bg-emerald-100 text-emerald-800 font-semibold px-3 py-1 rounded-full">
                    <BadgeCheck size={18} />
                    Eco-Certified Property
                </div>
            )}
            
            <div className="flex items-center gap-8 text-lg text-gray-700 border-t border-b my-8 py-6">
                <span className="flex items-center gap-2"><BedDouble /> {property.bedrooms} Bedrooms</span>
                <span className="flex items-center gap-2"><Bath /> {property.bathrooms} Bathrooms</span>
                <span className="flex items-center gap-2"><LandPlot /> {property.area.toLocaleString()} sqft</span>
            </div>

            <div>
                <h2 className="text-2xl font-bold mb-4">Description</h2>
                <p className="text-gray-600 leading-relaxed">
                    Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vivamus lacinia odio vitae vestibulum vestibulum. Cras venenatis euismod malesuada. Nulla facilisi. Pellentesque habitant morbi tristique senectus et netus et malesuada fames ac turpis egestas.
                </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}