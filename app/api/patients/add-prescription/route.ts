import { NextResponse } from 'next/server';
import { connectToDatabase } from "@/lib/database/mongoose";
import Patient from '@/lib/database/models/patient.model';

export async function POST(req: Request) {
  try {
    await connectToDatabase();

    const { patientId, prescription } = await req.json();

    const updatedPatient = await Patient.findByIdAndUpdate(
      patientId,
      { $push: { records: prescription } },
      { new: true }
    );

    if (!updatedPatient) {
      return NextResponse.json({ message: 'Patient not found' }, { status: 404 });
    }

    return NextResponse.json({ message: 'Prescription added successfully', patient: updatedPatient });
  } catch (error) {
    console.error('Error adding prescription:', error);
    return NextResponse.json({ message: 'Error adding prescription' }, { status: 500 });
  }
}

