// app/api/properties/[id]/route.ts
import { NextRequest, NextResponse } from 'next/server';
import clientPromise from '@/lib/mongodb';
import { ObjectId } from 'mongodb';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import { getServerSession } from 'next-auth/next';

// --- DELETE Function ---
export async function DELETE(
    request: NextRequest,
    { params }: { params: { id: string } } // Get ID from URL segment
) {
  const session = await getServerSession(authOptions);
  const propertyId = params.id;

  // 1. Check Authentication
  if (!session || !session.user?.email) {
    return NextResponse.json({ error: 'Unauthorized: You must be signed in.' }, { status: 401 });
  }

  // 2. Validate Property ID format
  if (!ObjectId.isValid(propertyId)) {
    return NextResponse.json({ error: 'Invalid Property ID format.' }, { status: 400 });
  }

  try {
    const client = await clientPromise;
    const db = client.db(process.env.MONGODB_DB);
    const propertiesCollection = db.collection('properties');

    const objectId = new ObjectId(propertyId);

    // 3. Find the property to verify ownership
    const propertyToDelete = await propertiesCollection.findOne({ _id: objectId });

    if (!propertyToDelete) {
      return NextResponse.json({ error: 'Property not found.' }, { status: 404 });
    }

    // 4. Verify Ownership
    if (propertyToDelete.ownerEmail !== session.user.email) {
      return NextResponse.json({ error: 'Forbidden: You do not own this property.' }, { status: 403 });
    }

    // 5. Delete the property
    const deleteResult = await propertiesCollection.deleteOne({ _id: objectId });

    if (deleteResult.deletedCount === 0) {
      // Should not happen if findOne succeeded, but good to check
      throw new Error('Property found but could not be deleted.');
    }

    // 6. Return Success Response
    return NextResponse.json({ message: 'Property deleted successfully!' }, { status: 200 });

  } catch (e) {
    console.error('API DELETE Error:', e);
    const errorMessage = e instanceof Error ? e.message : 'Internal Server Error deleting property';
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}

// --- Optional: Add GET/PUT/PATCH here later for editing/fetching single item ---
// export async function GET(request: NextRequest, { params }: { params: { id: string } }) { ... }
// export async function PUT(request: NextRequest, { params }: { params: { id: string } }) { ... }