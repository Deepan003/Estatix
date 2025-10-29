import { NextRequest, NextResponse } from 'next/server';
import clientPromise from '@/lib/mongodb';
import { Filter } from 'mongodb'; // Import the Filter type

export async function GET(request: NextRequest) {
  try {
    const client = await clientPromise;
    const db = client.db(process.env.MONGODB_DB);

    // Get search parameters from the request URL
    const searchParams = request.nextUrl.searchParams;
    const city = searchParams.get('city');
    const type = searchParams.get('type');
    const ecoCertified = searchParams.get('ecoCertified');

    // Build the MongoDB query object dynamically
    const query: Filter<Document> = {};

    if (city) {
      // Use a case-insensitive regex for flexible city searching
      query.city = { $regex: new RegExp(city, 'i') };
    }

    if (type) {
      query.type = type;
    }

    if (ecoCertified === 'true') {
      query.ecoCertified = true;
    }

    const properties = await db
      .collection('properties')
      .find(query)
      .toArray();

    return NextResponse.json({ properties });
  } catch (e) {
    console.error('API Error:', e);
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    );
  }
}