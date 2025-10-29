// app/api/properties/route.ts
import { NextRequest, NextResponse } from 'next/server';
import clientPromise from '@/lib/mongodb';
import { Filter, ObjectId } from 'mongodb'; // Import ObjectId too
import { authOptions } from '@/app/api/auth/[...nextauth]/route'; // Import authOptions
import { getServerSession } from 'next-auth/next'; // Import getServerSession
import { Property } from '@/lib/mock-data'; // Import your Property type

// --- Your existing GET function ---
export async function GET(request: NextRequest) {
  try {
    const client = await clientPromise;
    const db = client.db(process.env.MONGODB_DB);
    const searchParams = request.nextUrl.searchParams;
    const city = searchParams.get('city');
    const type = searchParams.get('type');
    const ecoCertified = searchParams.get('ecoCertified');
    const query: Filter<Property> = {}; // Use Property type here

    if (city) {
      query.city = { $regex: new RegExp(city, 'i') };
    }
    // Correctly handle 'all' type - don't add type filter if 'all'
    if (type && type !== 'all') {
      query.type = type as 'sale' | 'rent'; // Cast to specific types
    }
    if (ecoCertified === 'true') {
      query.ecoCertified = true;
    }

    const properties = await db
      .collection('properties')
      .find(query)
      // Optional: Sort by creation date or price
      // .sort({ createdAt: -1 })
      .toArray();

    // Ensure properties match the expected structure if needed
    // const typedProperties: Property[] = properties.map(p => ({ ...p, _id: p._id.toString() })) as Property[];

    return NextResponse.json({ properties });
  } catch (e) {
    console.error('API GET Error:', e);
    return NextResponse.json( { error: 'Internal Server Error fetching properties' }, { status: 500 } );
  }
}
// --- END GET function ---


// --- NEW POST function ---
export async function POST(request: NextRequest) {
  // Get the server session to check if user is logged in
  const session = await getServerSession(authOptions);

  // Protect the route
  if (!session || !session.user) {
    return NextResponse.json({ error: 'Unauthorized: You must be signed in.' }, { status: 401 });
  }

  try {
    const client = await clientPromise;
    const db = client.db(process.env.MONGODB_DB);
    const body = await request.json();

    // --- Basic Server-Side Validation ---
    if (!body.title || !body.address || !body.city || !body.price || !body.imageUrl || !body.type || !body.description ) {
        return NextResponse.json({ error: 'Missing required fields.' }, { status: 400 });
    }
    if (typeof body.price !== 'number' || body.price <= 0) {
        body.price = Number(body.price); // Attempt conversion
        if (isNaN(body.price) || body.price <= 0) {
          return NextResponse.json({ error: 'Invalid price.' }, { status: 400 });
        }
    }
     // Ensure numeric fields are numbers (or default to 0/1 if missing/invalid)
     const price = Number(body.price) || 0;
     const bedrooms = Number(body.bedrooms) || 0;
     const bathrooms = Number(body.bathrooms) || 0;
     const area = Number(body.area) || 0;

    // Construct the new property document
    const newProperty: Omit<Property, '_id' | 'id'> & { ownerEmail: string; createdAt: Date } = {
      title: body.title,
      address: body.address,
      city: body.city,
      price: price,
      bedrooms: bedrooms,
      bathrooms: bathrooms,
      area: area,
      imageUrl: body.imageUrl, // Add validation for URL format later
      ecoCertified: !!body.ecoCertified, // Ensure boolean
      type: body.type === 'rent' ? 'rent' : 'sale', // Default to 'sale'
      description: body.description, // Added description
      ownerEmail: session.user.email as string, // Associate with logged-in user
      createdAt: new Date(), // Add a timestamp
    };

    // Insert into the database
    const result = await db.collection('properties').insertOne(newProperty);

    // Check if insertion was successful
    if (!result.insertedId) {
       throw new Error('Failed to insert property into database.');
    }

    // Return success response with the new property's ID
    return NextResponse.json({ message: 'Property created successfully!', propertyId: result.insertedId.toString() }, { status: 201 });

  } catch (e) {
    console.error('API POST Error:', e);
     // Provide a more generic error in production
    const errorMessage = e instanceof Error ? e.message : 'Internal Server Error creating property';
    return NextResponse.json( { error: errorMessage }, { status: 500 });
  }
}
// --- END POST function ---