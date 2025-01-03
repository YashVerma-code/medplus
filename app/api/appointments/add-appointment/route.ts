import { NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/database/mongoose";
import Doctor from "@/lib/database/models/doctor.model";
import { Appointment } from "@/lib/database/models/appointment.model";
import { getUserById } from "@/lib/actions/user.actions";

interface Slot {
  start: string;
  end: string;
  status: "available" | "booked" | "unavailable";
}


// POST request
export async function POST(req: Request) {
  await connectToDatabase();
  try {
    const { appointment, clerkId, patientName } = await req.json();
    const { doctorId, date, time, type } = appointment;
    const parsedDate = new Date(date);
    const localDate = new Date(parsedDate.getTime() - parsedDate.getTimezoneOffset() * 60000);
    const mongoISOString = localDate.toISOString().split("T")[0];
    
    // console.log("Received values: ", clerkId, patientName, doctorId, mongoISOString, time, type);

    const user = await getUserById(clerkId);
    const userId = user._id;

    if (!userId) {
      console.log("User not found");
      return NextResponse.json({ error: "User not found" }, { status: 400 });
    }

    const doc = await Doctor.findOne({ _id: doctorId }).populate("user");
    // console.log("Doctor: ",doc);
    if (!doc) {
      console.log("Doctor does not exist in the database");
      return NextResponse.json({ error: "doctor not found" }, { status: 400 });
    }
    const dayOfWeek = parsedDate.toLocaleDateString("en-US", {
      weekday: "long",
    });

    if (
      !doctorId ||
      !time?.trim() ||
      !type?.trim() ||
      !mongoISOString
    ) {
      console.log("All fields are required");
      return NextResponse.json(
        { success: false, error: "All fields are required" },
        { status: 400 }
      );
    }

    if (parsedDate.setHours(0, 0, 0, 0) < new Date().setHours(0, 0, 0, 0)) {
      console.log("The appointment date must be in the future.");
      return NextResponse.json(
        {
          success: false,
          error: "The appointment date must be in the future.",
        },
        { status: 400 }
      );
    }

    const availability = doc.availability.find((obj: any)=>obj.day ===dayOfWeek
    );
    console.log("Availability : ",availability);

    if (!availability) {
      console.log("Doctor is unavailable on the selected day: ", dayOfWeek);
      return NextResponse.json(
        { error: "Doctor is unavailable on the selected day" },
        { status: 400 }
      );
    }
    
    if (!Array.isArray(availability.slots)) {
      console.log("Slots are not defined or invalid.");
      return NextResponse.json(
        { success: false, error: "Slots are not defined or invalid" },
        { status: 400 }
      );
    }
    
    const availableSlots = availability.slots.filter(
      (slot: Slot) =>
        slot.status === "available" &&
        String(slot.start).toLowerCase() === String(time).toLowerCase()
    );
    console.log("Available slots : ",availableSlots);
    
    if (availableSlots.length === 0) {
      return NextResponse.json(
        { success: false, error: "No available slots on the selected day" },
        { status: 400 }
      );
    }

    const bookedSlotsOnDate = doc.bookedSlots.filter(
      (slot: any) =>
        String(slot.date) === mongoISOString &&
        slot.day === dayOfWeek &&
        slot.status === "booked" &&
        String(slot.start) === time
    );

    if (bookedSlotsOnDate.length >= 1) {
      console.log("Booked Slots : ", bookedSlotsOnDate);
      return NextResponse.json(
        { success: false, error: "Doctor has an appointment at that time" },
        { status: 400 }
      );
    }

    const doctorName=doc.user.firstName+doc.user.lastName;

    const existingAppointment = await Appointment.findOne({
      patientId: userId,
      doctorId: doctorId,
      patient: patientName,
      date: mongoISOString,
      doctor: doctorName,
      time: time,
    });

    if (existingAppointment) {
      console.log("Appointment is already in the database");
      return NextResponse.json(
        { success: false, error: "Appointment is already in the database" },
        { status: 400 }
      );
    }

    const matchingSlot = availability.slots.find(
      (slot: any) =>
        String(slot.start).toLowerCase() === String(time).toLowerCase()
    );

    if (!matchingSlot) {
      return NextResponse.json(
        { success: false, error: "Slot not found for the selected time" },
        { status: 400 }
      );
    }

    const newAppointment = await Appointment.create({
      patientId: userId,
      doctorId:doctorId,
      doctor:doctorName,
      patient: patientName,
      date: mongoISOString,
      time,
      type,
    });
    await newAppointment.save();

    const alreadyBooked = doc.bookedSlots.some(
      (slot: any) =>
        slot.date === mongoISOString && slot.start === matchingSlot.start
    );
    if (!alreadyBooked) {
      const updatedDoctor = await Doctor.updateOne(
        {
          _id: doctorId,
        },
        {
          $push: {
            bookedSlots: {
              date: mongoISOString,
              start: String(matchingSlot.start),
              end: String(matchingSlot.end),
              day: dayOfWeek,
              status: "booked",
            },
          },
        }
      );
      // console.log("Updated Doctor ", updatedDoctor);
    }

    return NextResponse.json(
      {
        success: true,
        message: "Appointment is successfully added to the database",
      },
      { status: 200 }
    );
  } catch (err) {
    console.error("Error occurred while adding the data to the database:", err);
    return NextResponse.json(
      { success: false, error: "Error in adding the data" },
      { status: 500 }
    );
  }
}
