import { NextRequest, NextResponse } from "next/server";
import {
  getPatientById,
} from "@/lib/actions/patient.actions";
import { connectToDatabase } from "@/lib/database/mongoose";

async function ensureDBConnection() {
  try {
    await connectToDatabase();
  } catch (error) {
    console.error("Database connection failed", error);
    return NextResponse.json(
      { error: "Database connection failed" },
      { status: 500 }
    );
  }
}
export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
    await ensureDBConnection();
  
    try {
      const { id } = params;
  
      const patient = await getPatientById(id);
      if (!patient) {
        return NextResponse.json(
          { error: "Patient not found" },
          { status: 404 }
        );
      }
  
      return NextResponse.json(patient, { status: 200 });
    } catch (error) {
      console.error("Error fetching patient:", error);
      return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
  }