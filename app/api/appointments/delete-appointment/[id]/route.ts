import { NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/database/mongoose";
import { Appointment } from "@/lib/database/models/appointment.model";
import Doctor from "@/lib/database/models/doctor.model";

export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  await connectToDatabase();

  try {
    const id = params.id;

    const deletedAppointment = await Appointment.findOneAndDelete({ _id: id });

    if (!deletedAppointment) {
      console.log("Appointment not found in the database");
      return NextResponse.json(
        {
          success: false,
          error: "Appointment is not present in the database",
        },
        { status: 400 }
      );
    }

    const { doctorId, date, time } = deletedAppointment;
    const parsedDate = new Date(date);
    const localDate = new Date(
      parsedDate.getTime() - parsedDate.getTimezoneOffset() * 60000
    );
    const mongoISOString = localDate.toISOString().split("T")[0];
    // Ensure doctorId is valid
    if (!doctorId) {
      console.log("Invalid doctorId in the deleted appointment");
      return NextResponse.json(
        {
          success: false,
          error: "DoctorId is missing or invalid in the appointment data",
        },
        { status: 400 }
      );
    }

    const updatedDoctor = await Doctor.updateOne(
      { _id: doctorId },
      {
        $pull: {
          bookedSlots: {
            date: mongoISOString, // Ensure the date matches the format in `bookedSlots`
            start: time, // Ensure the start time matches exactly
          },
        },
      }
    );

    if (updatedDoctor.modifiedCount === 0) {
      console.log("Failed to update the doctor's booked slots");
      return NextResponse.json(
        {
          success: false,
          error: "No matching slot found in the doctor's booked slots",
        },
        { status: 400 }
      );
    }

    return NextResponse.json(
      {
        success: true,
        message: "Appointment successfully deleted from the database",
      },
      { status: 200 }
    );
  } catch (err) {
    console.error("Error while deleting the appointment:", err);
    return NextResponse.json(
      {
        success: false,
        error: "Error in deleting the data",
      },
      { status: 500 }
    );
  }
}
