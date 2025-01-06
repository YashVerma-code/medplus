import { NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/database/mongoose";
import { currentUser } from "@clerk/nextjs/server";
import Patient from "@/lib/database/models/patient.model";
import Doctor from "@/lib/database/models/doctor.model";
import { Appointment } from "@/lib/database/models/appointment.model";

interface Slot {
  start: string;
  end: string;
  status: "available" | "booked" | "unavailable";
}

export async function PUT(req: Request) {
  await connectToDatabase();

  try {
    const { date, time, type, _id, doctorId } = await req.json();

    const parsedDate = new Date(date);
    const dayOfWeek = parsedDate.toLocaleDateString("en-US", { weekday: "long" });
    const localDate = new Date(
      parsedDate.getTime() - parsedDate.getTimezoneOffset() * 60000
    );
    const mongoISOString = localDate.toISOString().split("T")[0];

    if (isNaN(parsedDate.getTime())) {
      return NextResponse.json(
        { success: false, error: "Invalid date format" },
        { status: 400 }
      );
    }

    if (parsedDate.setHours(0, 0, 0, 0) < new Date().setHours(0, 0, 0, 0)) {
      return NextResponse.json(
        { success: false, error: "The appointment date must be in the future." },
        { status: 400 }
      );
    }

    if (!time.trim() || !type.trim() || !_id) {
      return NextResponse.json(
        { success: false, error: "All fields are required" },
        { status: 400 }
      );
    }

    const user = await currentUser();
    const userId = user?.publicMetadata.userId;
    if (!userId) {
      return NextResponse.json(
        { success: false, error: "User not found" },
        { status: 400 }
      );
    }

    const existingAppointment = await Appointment.findOne({ _id });
    if (!existingAppointment) {
      return NextResponse.json(
        { success: false, error: "Appointment not found in the database" },
        { status: 404 }
      );
    }

    const doc = await Doctor.findOne({ _id: doctorId }).populate("user");
    if (!doc) {
      return NextResponse.json(
        { success: false, error: "Doctor not found" },
        { status: 404 }
      );
    }

    const availability = doc.availability.find((obj: any) => obj.day === dayOfWeek);
    if (!availability) {
      return NextResponse.json(
        { success: false, error: "Doctor is unavailable on the selected day" },
        { status: 400 }
      );
    }

    const availableSlot = availability.slots.find(
      (slot: Slot) =>
        slot.status === "available" && String(slot.start) === String(time)
    );
    if (!availableSlot) {
      return NextResponse.json(
        { success: false, error: "No available slots on the selected day" },
        { status: 400 }
      );
    }

    const bookedSlot = doc.bookedSlots.find(
      (slot: any) =>
        slot.date === mongoISOString && slot.start === availableSlot.start
    );
    if (bookedSlot) {
      return NextResponse.json(
        { success: false, error: "The slot is already booked" },
        { status: 400 }
      );
    }

    const modifiedAppointment = await Appointment.findOneAndUpdate(
      { _id },
      {
        $set: { date: mongoISOString, time, type },
      },
      { new: true }
    );

    if (!modifiedAppointment) {
      return NextResponse.json(
        { success: false, error: "Failed to update the appointment" },
        { status: 500 }
      );
    }

    // Update doctor's bookedSlots
    const parsedDate2 = new Date(existingAppointment.date);
    const localDate2 = new Date(
      parsedDate2.getTime() - parsedDate2.getTimezoneOffset() * 60000
    );
    const mongoISOString2 = localDate2.toISOString().split("T")[0];

    console.log("Recieved Value : ",doctorId,mongoISOString2,existingAppointment.time);
    
    await Doctor.updateOne(
      { _id: doctorId, "bookedSlots.date": mongoISOString2, "bookedSlots.start": existingAppointment.time },
      {
        $set: {
          "bookedSlots.$.date": mongoISOString,
          "bookedSlots.$.start": availableSlot.start,
          "bookedSlots.$.end": availableSlot.end,
          "bookedSlots.$.day": dayOfWeek,
        },
      }
    );

    return NextResponse.json(
      { success: true, message: "Appointment successfully updated" },
      { status: 200 }
    );
  } catch (err) {
    console.error("Error updating the appointment:", err);
    return NextResponse.json(
      { success: false, error: "An error occurred during the update" },
      { status: 500 }
    );
  }
}
