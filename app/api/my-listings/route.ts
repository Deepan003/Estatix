// app/api/my-listings/route.ts
import { NextRequest, NextResponse } from 'next/server';
import clientPromise from '@/lib/mongodb';
import { authOptions } from '@/app/api/auth/[...nextauth]/route'; // Import authOptions
import { getServerSession } from 'next-auth/next';
import { Property } from '@/lib/mock-data'; // Import your Property type
import { Filter } from 'mongodb';

export async function GET(request: NextRequest) {
  // Get the server session to identify the logged-in user
  const session = await getServerSession(authOptions);

  // Protect the route - only logged-in users can access their listings
  if (!session || !session.user?.email) {
    return NextResponse.json({ error: 'Unauthorized: You must be signed in.' }, { status: 401 });
  }

  try {
    const client = await clientPromise;
    const db = client.db(process.env.MONGODB_DB);

    // Build the query to find properties matching the user's email
    const query: Filter<Property> = {
      ownerEmail: session.user.email,
    };

    const properties = await db
      .collection('properties')
      .find(query)
      .sort({ createdAt: -1 }) // Sort by newest first
      .toArray();

    // Convert ObjectId to string for client-side usage if needed
    // const propertiesWithStringIds = properties.map(p => ({ ...p, _id: p._id.toString() }));

    return NextResponse.json({ properties });

  } catch (e) {
    console.error('API /my-listings Error:', e);
    return NextResponse.json(
      { error: 'Internal Server Error fetching your listings' },
      { status: 500 }
    );
  }
}