import { NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/database/mongoose";
import Doctor from "@/lib/database/models/doctor.model";

export async function GET(
  req: Request,
  { params }: { params: { id: string; day: string } }
) {
  await connectToDatabase();
  try {
    const url = new URL(req.url);
    const doctorId = url.searchParams.get("id");
    const day = url.searchParams.get("day");
    // console.log("id and day : ",doctorId,day);
    if (!doctorId) {
      return NextResponse.json(
        {
          success: false,
          error: "Doctor Id is missing in path",
        },
        { status: 400 }
      );
    }
    if (!day) {
      return NextResponse.json(
        {
          success: false,
          error: "Day is missing in the path",
        },
        { status: 400 }
      );
    }

    const doctor = await Doctor.findOne(
      { _id: doctorId, "availability.day": day },
      { "availability.$": 1 } // Use positional operator `$` to retrieve only the matched day
    );
    
    // console.log("Doctor: ",doctor);
    if (!doctor) {
      return NextResponse.json(
        {
          success: false,
          error: "Doctor not available for the given day",
        },
        { status: 404 }
      );
    }

    const availableSlots = doctor.availability[0]?.slots.filter((slot: { status: string }) => slot.status === "available");
    // console.log(availableSlots);
    
    return NextResponse.json(
      {
        success: true,
        error: "Successfully get the available slots",
        availableSlots
      },
      { status: 200 }
    );
  } catch (error) {
    console.log("Error occured while fetching the available slots :", error);
    return NextResponse.json(
      {
        success: false,
        error: "Error in fetching the slots",
      },
      { status: 500 }
    );
  }
}
