import { NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/database/mongoose';
import Resource from '@/lib/database/models/resource.model'

import { createItem, searchResources, updateResourceQuantity, deleteResource } from '@/lib/actions/resource.actions';

// GET: Search resources or get resource by ID
export async function GET(req: Request) {
  await connectToDatabase();

  const { searchParams } = new URL(req.url);
  const resourceId = searchParams.get('id');
  const query = searchParams.get('q') || '';

  try {
    if (resourceId) {
      // Get resource by ID
      const resource = await searchResources(resourceId);
      if (!resource) {
        return NextResponse.json({ error: 'Resource not found' }, { status: 404 });
      }
      return NextResponse.json(resource);
    }

    // Search resources by query (if given)
    const resources = await searchResources(query);
    return NextResponse.json(resources);
  } catch (error) {
    console.error('Error fetching resource(s):', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

// POST: Create a new resource or multiple resources
export async function POST(req: Request) {
  try {
    await connectToDatabase();
    console.log("connected db");

    const resources = await req.json();
     // Expecting an array of resource objects
     console.log("resources",resources)
    // if (!Array.isArray(resources)) {
    //   return NextResponse.json({ error: 'Expected an array of resource objects' }, { status: 400 });
    // }

    const result = await createItem(resources);
    console.log("resources",result)
    return NextResponse.json({ message: 'Resources created successfully'}, { status: 201 });
  } catch (error) {
    console.error('Error creating resources:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

// PUT: Update resource quantity
export async function PUT(req: Request) {
  await connectToDatabase();

  try {
    const { id, newQuantity } = await req.json();
    if (!id) {
      return NextResponse.json({ error: 'Resource ID is required' }, { status: 400 });
    }
    if (newQuantity == null || typeof newQuantity !== 'number') {
      return NextResponse.json({ error: 'Valid quantity is required' }, { status: 400 });
    }

    const updatedResource = await updateResourceQuantity(id, newQuantity);
    if (!updatedResource) {
      return NextResponse.json({ error: 'Resource not found' }, { status: 404 });
    }

    return NextResponse.json(updatedResource);
  } catch (error) {
    console.error('Error updating resource quantity:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

// DELETE: Remove resource by ID
export async function DELETE(req: Request) {
  await connectToDatabase();

  try {
    const { searchParams } = new URL(req.url);
    const resourceId = searchParams.get('id');

    if (!resourceId) {
      return NextResponse.json({ error: 'Resource ID is required' }, { status: 400 });
    }

    const deletedResource = await deleteResource(resourceId);
    if (!deletedResource) {
      return NextResponse.json({ error: 'Resource not found' }, { status: 404 });
    }

    return NextResponse.json({ message: 'Resource deleted', resource: deletedResource });
  } catch (error) {
    console.error('Error deleting resource:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
