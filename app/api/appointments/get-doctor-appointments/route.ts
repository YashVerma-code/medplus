import { NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/database/mongoose";
import { Appointment } from "@/lib/database/models/appointment.model";
import { currentUser } from "@clerk/nextjs/server";
import mongoose from "mongoose";
import Doctor from "@/lib/database/models/doctor.model";

export async function GET(req: Request) {
  try {
    // Connect to the database
    await connectToDatabase();
    console.log("Database connected successfully.");

    const { searchParams } = new URL(req.url);
    const doctorId = searchParams.get("id");
    let doctor;

    if (doctorId) {
      console.log("Doctor ID from query params:", doctorId);

      // Validate and convert doctorId to ObjectId
      if (!mongoose.isValidObjectId(doctorId)) {
        return NextResponse.json(
          { error: "Invalid doctor ID provided." },
          { status: 400 }
        );
      }
      const docId = new mongoose.Types.ObjectId(doctorId);
      doctor = await Doctor.findOne({ _id: docId });
    } else {
      console.log("Fetching authenticated user...");
      const user = await currentUser();

      if (!user) {
        return NextResponse.json(
          { error: "User is not authenticated." },
          { status: 401 }
        );
      }

      const userId = user?.publicMetadata.userId;
      if (!userId || !mongoose.isValidObjectId(userId)) {
        return NextResponse.json(
          { error: "Invalid or missing user ID in publicMetadata." },
          { status: 400 }
        );
      }

      const docId = new mongoose.Types.ObjectId(userId as string);
      doctor = await Doctor.findOne({ user: docId });
    }

    if (!doctor) {
      console.log("Doctor not found in database.");
      return NextResponse.json({ error: "Doctor not found" }, { status: 404 });
    }

    console.log("Doctor found:", doctor);

    // Fetch appointments for the doctor
    const appointments = await Appointment.find({
      doctorId: doctor._id,
    }).sort({ date: 1 });

    console.log("Appointments fetched:", appointments);
    return NextResponse.json(appointments, { status: 200 });
  } catch (error) {
    console.error("Error fetching appointments:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
