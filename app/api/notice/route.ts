
import { NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/database/mongoose';
import { getAllCard } from '@/lib/actions/notice.action';
import Card from "@/lib/database/models/notice.model";
// get all card
export async function GET(req: Request) {
  await connectToDatabase();
  try {
    const cards = await getAllCard();
    console.log("after routing", cards);
    return NextResponse.json(cards);
  } catch (error) {
    console.error('Error fetching all cards:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

// add new card
export async function POST(req: Request) {
  await connectToDatabase();
  try {
    const body = await req.json();
    console.log("Request body:", body); // Log the request body
    const { username, tag, content, date, img, desc } = body;
    const newCard = new Card({ username, tag, content, date, img, desc });
    await newCard.save();
    console.log("New card saved:", newCard); // Log the new card
    return NextResponse.json(newCard);
  } catch (error) {
    console.error('Error adding new card:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}