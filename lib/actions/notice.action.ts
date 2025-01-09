'use server';
import Card from '../database/models/notice.model';
import { connectToDatabase } from '../database/mongoose';
import { handleError } from '../utils';
import { NextResponse } from 'next/server';

//read
export async function getAllCard() {
    try {
        await connectToDatabase();
        const Cards = await Card.find({});
        console.log("after action",Cards);
        return JSON.parse(JSON.stringify(Cards));
    } catch (error) {
        return handleError(error);
    }
}
//add
export async function addCard(card: any) {
    try {
        await connectToDatabase();
        const newCard = new Card(card);
        await newCard.save();
        return JSON.parse(JSON.stringify(newCard));
    } catch (error) {
        return handleError(error);
    }
}