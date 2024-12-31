import { NextResponse } from "next/server";
import Patient from "@/lib/database/models/patient.model";
import { connectToDatabase } from "@/lib/database/mongoose";

export async function GET(req: Request, { params }: { params: { userId: string } }) {
  try {
    await connectToDatabase();
    const { userId } = params;

    const patient = await Patient.findOne({ user: userId });
    if (!patient) {
      return NextResponse.json({ error: "Patient not found" }, { status: 404 });
    }

    return NextResponse.json(patient);
  } catch (error) {
    console.error("Error fetching patient by user ID:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
