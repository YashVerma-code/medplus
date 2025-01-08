import { NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/database/mongoose";
import Doctor from "@/lib/database/models/doctor.model";

export async function POST(req: Request) {
  try {
    await connectToDatabase();
    const { day, start, end, status,docId } = await req.json();
    console.log("Received slot:", { day, start, end, status ,docId});

    if (!day || !start || !end || !status ||!docId ||!status) {
      return NextResponse.json(
        { error: "All fields are required." },
        { status: 400 }
      );
    }

    const doctor = await Doctor.findById(docId);
    if (!doctor) {
      return NextResponse.json(
        { error: "Doctor not found." },
        { status: 404 }
      );
    }

    const dayAvailability = doctor.availability.find((item:any) => item.day === day);
    if (dayAvailability) {
      const slotExists = dayAvailability.slots.some((slot:any) =>  (start >= slot.start && start < slot.end) ||
      (end > slot.start && end <= slot.end));

      if (slotExists) {
        return NextResponse.json(
          { error: "Slot overlaps with an existing slot" },
          { status: 400 }
        );
      }
    }

    if (dayAvailability) {
      dayAvailability.slots.push({ start, end, status });
    } else {
      doctor.availability.push({day,slots: [{ start, end, status }],});
    }

    await doctor.save();
    return NextResponse.json({ message: "Slot added successfully." }, { status: 200 });

  } catch (error) {
    console.error("Error adding slot:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
