import { NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/database/mongoose";
import { Appointment } from "@/lib/database/models/appointment.model";
import { currentUser } from "@clerk/nextjs/server";
import mongoose from "mongoose";

// GET request
export async function GET(req: Request) {
  const currentDate = new Date();
  currentDate.setUTCHours(0, 0, 0, 0);
  const mongoISOString = currentDate.toISOString().replace(".000Z", "");
  try {
    await connectToDatabase();

    const user=await currentUser();
    if (!user) {
      throw new Error("User is not authenticated.");
    }

    const userId=user?.publicMetadata.userId;
    if (!userId) {
      throw new Error("User ID is not found in publicMetadata.");
    }

    if (!mongoose.Types.ObjectId.isValid(userId as string)) {
      throw new Error("Invalid ObjectId format.");
    }
    
    const updatedId=new mongoose.Types.ObjectId(userId as string);
    if(!updatedId){
      return NextResponse.json(
        { error: "User not found" },
        { status: 400 }
      );
    }
    const appointments = await Appointment.find({
      patientId: userId,
    }).sort({ date: 1 });

    // console.log("Appointments fetched from database : ",appointments);
    return NextResponse.json(appointments,{ status: 200 });
  } catch (error) {
    console.error("Error fetching appointments:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
