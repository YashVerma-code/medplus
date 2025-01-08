import { NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/database/mongoose";
import Doctor from "@/lib/database/models/doctor.model";

export async function POST(req: Request) {
  await connectToDatabase();
  try {
    const { docId, day, start, end } = await req.json();
    console.log("Recieved values : ",docId,day, start,end);
    if (!docId || !day || !start || !end) {
      return NextResponse.json(
        { success: false, error: "All fields are required" },
        { status: 400 }
      );
    }

    const doc = await Doctor.findById(docId);

    if (!doc) { 
      return NextResponse.json(
        { success: false, error: "Doctor is not found" },
        { status: 404 }
      );
    }
    const dayAvailability = doc.availability.find(
      (availability: any) => availability.day === day
    );

    if (!dayAvailability) {
      return NextResponse.json(
        { success: false, error: `No availability found on ${day}` },
        { status: 404 }
      );
    }

    const initialLength = dayAvailability.slots.length;
    dayAvailability.slots = dayAvailability.slots.filter(
      (slot: any) => !(slot.start === start && slot.end === end)
    );

    if (dayAvailability.slots.length === initialLength) {
      return NextResponse.json(
        { success: false, error: "Slot not found" },
        { status: 404 }
      );
    }
    await doc.save();

    return NextResponse.json({
      success: true,
      message: `Slot successfully removed`,
      availability: doc.availability,
    });
  } catch (error: any) {
    console.log("Error occured due to : ", error);
    return NextResponse.json(
      { success: false, error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
