import { NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/database/mongoose";
import { Appointment } from "@/lib/database/models/appointment.model";
import { currentUser } from "@clerk/nextjs/server";
import mongoose from "mongoose";
import Doctor from "@/lib/database/models/doctor.model";

// GET request
export async function GET(req: Request) {
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
    const updatedId=new mongoose.Types.ObjectId(userId as string);

    if(!updatedId){
      return NextResponse.json(
        { error: "User not found" },
        { status: 400 }
      );
    }
    const doctor=await Doctor.findOne({user:updatedId,})
    
    if(!doctor){
      console.log("Doctor is not found in database ");
      return NextResponse.json(
        { error: "Doctor not found" },
        { status: 400 }
      )
    }

    const appointments = await Appointment.find({
      doctorId: doctor._id,
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
