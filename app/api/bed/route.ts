import { NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/database/mongoose';
import {  getAllBeds, getBedById } from '@/lib/actions/bed.action';

import Beds from "@/lib/database/models/bed.model";
import { get } from 'lodash';


// get all beds
export async function GET(req: Request) {
  await connectToDatabase();
  try {
    const beds = await getAllBeds();
    return NextResponse.json(beds);
  } catch (error) {
    console.error('Error fetching all beds:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}


export async function PUT(req: Request) {
  await connectToDatabase();
  try {
    const { id } = await req.json();
    const bed = await getBedById(id);
    if (!bed) {
      return NextResponse.json({ error: 'Bed not found' }, { status: 404 });
    }
    await bed;
    return NextResponse.json(bed);
  } catch (error) {
    console.error('Error updating bed:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}