
'use server';
import Beds from '../database/models/bed.model';
import { connectToDatabase } from '../database/mongoose';
import { handleError } from '../utils';
import { NextResponse } from 'next/server';

//read
export async function getAllBeds() {
    try {
        await connectToDatabase();
        const beds = await Beds.find({});
        return JSON.parse(JSON.stringify(beds));
    } catch (error) {
        return handleError(error);
    }
}

export async function getBedById(id: string) {
    try {
        await connectToDatabase();
        const currentBed = await Beds.findById(id);
        if (!currentBed) {
            throw new Error('Bed not found');
        }
        const bed = await Beds.updateOne({_id: id}, {occupied: !currentBed.occupied});
        return JSON.parse(JSON.stringify(bed));
    } catch (error) {
        return handleError(error);
    }
}