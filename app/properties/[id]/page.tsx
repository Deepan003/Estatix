// app/properties/[id]/page.tsx
import clientPromise from "@/lib/mongodb";
import { Property } from "@/lib/mock-data";
import { ObjectId } from "mongodb";
import Link from "next/link";
import Image from "next/image";
import { BedDouble, Bath, LandPlot, BadgeCheck, ChevronLeft, MapPin, AlertTriangle } from "lucide-react"; // Added AlertTriangle
import { Header } from "@/components/Header";

// --- Function to fetch property with better error handling ---
async function getPropertyById(id: string): Promise<Property | null> {
  console.log(`Attempting to fetch property with ID: ${id}`); // Log the ID being used

  // 1. Validate the ID format BEFORE querying the database
  if (!ObjectId.isValid(id)) {
    console.error(`Invalid ObjectId format: "${id}"`);
    return null; // Return null if the ID format is wrong
  }

  try {
    const client = await clientPromise;
    const db = client.db(process.env.MONGODB_DB);
    console.log(`Connected to DB: ${process.env.MONGODB_DB}, attempting findOne...`);

    // 2. Query using a valid ObjectId
    const propertyDocument = await db.collection('properties').findOne({ _id: new ObjectId(id) });

    if (!propertyDocument) {
      console.log(`Property with ID ${id} not found in database.`);
      return null;
    }

    console.log(`Property found: ${propertyDocument.title}`);

    // 3. Safely convert BSON ObjectId to string for the client component
    // Make sure all fields match your Property interface
    const property: Property = {
        _id: propertyDocument._id.toString(), // Convert ObjectId to string
        id: propertyDocument.id || 0, // Assuming 'id' might not always exist from mock data
        title: propertyDocument.title,
        price: propertyDocument.price,
        address: propertyDocument.address,
        city: propertyDocument.city,
        bedrooms: propertyDocument.bedrooms,
        bathrooms: propertyDocument.bathrooms,
        area: propertyDocument.area,
        imageUrl: propertyDocument.imageUrl,
        ecoCertified: propertyDocument.ecoCertified,
        type: propertyDocument.type,
        description: propertyDocument.description || "No description available.", // Added description handling
    };


    // JSON.parse(JSON.stringify()) is often used to ensure plain objects for Next.js,
    // but manually constructing the object is safer here after converting _id.
    // return JSON.parse(JSON.stringify(propertyDocument)); // Less safe method

    return property;

  } catch (e) {
    console.error('Database Error in getPropertyById:', e); // Log the actual error
    return null; // Return null on any database error
  }
}

// --- Main Page Component ---
export default async function PropertyDetailPage({ params }: { params: { id: string } }) {
  const property = await getPropertyById(params.id);

  // --- Improved Error/Not Found Handling ---
  if (!property) {
    return (
      <>
        <Header />
        <div className="flex flex-col items-center justify-center min-h-[calc(100vh-80px)] text-center p-4">
          <AlertTriangle className="w-12 h-12 text-red-500 mb-4" /> {/* Error Icon */}
          <h1 className="text-2xl font-bold text-gray-700">Property Not Found</h1>
          <p className="text-gray-500 mt-2 mb-6">
            Sorry, we couldn't find the property you requested (ID: {params.id}). It might have been removed or the link might be incorrect.
          </p>
          <Link href="/properties" className="bg-emerald-600 text-white px-5 py-2 rounded-lg hover:bg-emerald-700 transition-colors">
            Back to Listings
          </Link>
        </div>
      </>
    );
  }

  // --- Render Property Details (remains the same as previous step) ---
  return (
    <div className="bg-gray-50 min-h-screen">
      <Header />
      <div className="container mx-auto px-4 py-12">
        {/* ... (rest of the component: Back Link, Image, Details, Description, Footer) ... */}
         <Link href="/properties" className="inline-flex items-center gap-1 text-emerald-700 hover:text-emerald-800 transition-colors mb-6 group">
           <ChevronLeft size={20} className="group-hover:-translate-x-1 transition-transform"/>
           <span className="font-medium">Back to Listings</span>
         </Link>

         {/* Property Details Card */}
         <div className="bg-white rounded-lg shadow-lg overflow-hidden">
           {/* Image */}
           <div className="relative w-full h-[40vh] md:h-[55vh]">
             <Image
               src={property.imageUrl}
               alt={`Image of ${property.title}`}
               fill // Use fill for responsive covering
               style={{ objectFit: 'cover' }} // Ensure image covers the area
               className="w-full h-full"
               priority // Load this image faster
               sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw" // Optimize image loading
             />
              {/* Eco-Certified Badge */}
             {property.ecoCertified && (
                 <div className="absolute top-4 right-4 inline-flex items-center gap-2 bg-emerald-100 text-emerald-800 font-semibold px-3 py-1 rounded-full shadow-sm">
                     <BadgeCheck size={18} />
                     Eco-Certified
                 </div>
             )}
           </div>

           {/* Content */}
           <div className="p-6 md:p-8">
             {/* Title, Address, Price */}
             <div className="flex flex-col md:flex-row justify-between items-start mb-6 gap-4">
                 <div className="flex-grow">
                     <h1 className="text-3xl md:text-4xl font-bold text-gray-800 leading-tight">{property.title}</h1>
                     <p className="text-gray-500 mt-2 flex items-center gap-1">
                        <MapPin size={16} /> {property.address}, {property.city}
                     </p>
                 </div>
                 <div className="mt-2 md:mt-0 text-3xl md:text-4xl font-extrabold text-emerald-700 flex-shrink-0">
                     {property.type === 'sale'
                     ? `$${property.price.toLocaleString()}`
                     : `$${property.price.toLocaleString()}/mo`}
                 </div>
             </div>

             {/* Key Features */}
             <div className="flex flex-wrap items-center gap-x-6 gap-y-3 text-lg text-gray-700 border-t border-b my-6 py-5">
                 <span className="flex items-center gap-2"><BedDouble size={20}/> {property.bedrooms} Bed</span>
                 <span className="flex items-center gap-2"><Bath size={20}/> {property.bathrooms} Bath</span>
                 <span className="flex items-center gap-2"><LandPlot size={20}/> {property.area.toLocaleString()} sqft</span>
             </div>

             {/* Description */}
             <div>
                 <h2 className="text-2xl font-semibold text-gray-800 mb-3">About this property</h2>
                 <p className="text-gray-600 leading-relaxed whitespace-pre-line">
                     {property.description || "No description provided."}
                 </p>
             </div>

              <div className="mt-8 pt-6 border-t">
                 <button className="bg-emerald-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-emerald-700 transition duration-300 w-full sm:w-auto">
                     Contact Agent / Seller
                 </button>
              </div>
           </div>
         </div>
       </div>
        <footer className="text-center py-6 text-gray-500 text-sm mt-8 border-t border-gray-200">
          © {new Date().getFullYear()} EstatiX. All details subject to verification.
        </footer>
    </div>
  );
}