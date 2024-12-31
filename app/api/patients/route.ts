import { NextRequest, NextResponse } from "next/server";
import {
  createPatient,
  getAllPatients,
  updatePatient,
  deletePatient,
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

// CREATE 
export async function POST(req: NextRequest) {
  await ensureDBConnection();

  try {
    const patientData = await req.json();

    const newPatient = await createPatient(patientData);
    return NextResponse.json(newPatient, { status: 201 });
  } catch (error) {
    console.error("Error creating patient:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

// READ 
export async function GET(req: NextRequest) {
  await ensureDBConnection();

  try {
    const patients = await getAllPatients();
    return NextResponse.json(patients, { status: 200 });
  } catch (error) {
    console.error("Error fetching patients:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

// UPDATE
export async function PUT(req: NextRequest) {
  await ensureDBConnection();

  try {
    const { id, ...updateData } = await req.json();

    if (!id) {
      return NextResponse.json(
        { error: "Patient ID is required" },
        { status: 400 }
      );
    }

    const updatedPatient = await updatePatient(id, updateData);
    if (!updatedPatient) {
      return NextResponse.json(
        { error: "Patient not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(updatedPatient, { status: 200 });
  } catch (error) {
    console.error("Error updating patient:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

// DELETE 
export async function DELETE(req: NextRequest) {
  await ensureDBConnection();

  try {
    const { id } = await req.json();

    if (!id) {
      return NextResponse.json(
        { error: "Patient ID is required" },
        { status: 400 }
      );
    }

    const deletedPatient = await deletePatient(id);
    if (!deletedPatient) {
      return NextResponse.json(
        { error: "Patient not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({ message: "Patient deleted successfully" }, { status: 200 });
  } catch (error) {
    console.error("Error deleting patient:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
