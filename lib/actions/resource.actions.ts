'use server';

import { revalidatePath } from 'next/cache';
import Resource from '@/lib/database/models/resource.model';
import { connectToDatabase } from '../database/mongoose';
import { handleError } from '../utils';
import { NextResponse } from 'next/server';

// Types
interface CreateResourceParams {
  itemName: string;
  quantity: number;
}

// Create item
export async function createItem(resource: CreateResourceParams) {
  try {
    await connectToDatabase();
    console.log("connected db");
    const newItem = await Resource.create(resource);
    // revalidatePath('/resources'); // Revalidate ISR/SSR path if applicable
    return JSON.parse(JSON.stringify(newItem));
  } catch (error) {
    handleError(error);
    throw new Error('Failed to create resource');
  }
}

// Search resources
export async function searchResources(query: string) {
  try {
    await connectToDatabase();
    const filter = query
      ? { itemName: { $regex: query, $options: 'i' } }
      : {};
    const results = await Resource.find(filter).limit(20).exec();
    return results;
  } catch (error) {
    handleError(error);
    throw new Error('Failed to search resources');
  }
}

// Update quantity
export async function updateResourceQuantity(resourceId: string, newQuantity: number) {
  try {
    await connectToDatabase();
    if (newQuantity < 0) throw new Error('Quantity cannot be negative');
    const updatedResource = await Resource.findByIdAndUpdate(
      resourceId,
      { quantity: newQuantity },
      { new: true }
    );
    if (!updatedResource) throw new Error('Resource not found');
    revalidatePath('/resources'); // Revalidate ISR/SSR path if applicable
    return JSON.parse(JSON.stringify(updatedResource));
  } catch (error) {
    handleError(error);
    throw new Error('Failed to update resource quantity');
  }
}

// Delete resource
export async function deleteResource(resourceId: string) {
  try {
    await connectToDatabase();
    const deletedResource = await Resource.findByIdAndDelete(resourceId);
    if (!deletedResource) throw new Error('Resource not found');
    revalidatePath('/resources'); // Revalidate ISR/SSR path if applicable
    return JSON.parse(JSON.stringify(deletedResource));
  } catch (error) {
    handleError(error);
    throw new Error('Failed to delete resource');
  }
}
