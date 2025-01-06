import { NextRequest, NextResponse } from "next/server";
import {
  createPatient,
  updatePatient,
  deletePatient,
  getPatientById,
  getPatientByUserId,
  searchPatients,
} from "@/lib/actions/patient.actions";
import { connectToDatabase } from "@/lib/database/mongoose";
import { updateUser } from "@/lib/actions/user.actions";

// CREATE 
export async function POST(req: NextRequest) {
  await connectToDatabase();

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
// export async function GET(req: NextRequest) {
//   await connectToDatabase();

//   try {
//     const patients = await getAllPatients();
//     return NextResponse.json(patients, { status: 200 });
//   } catch (error) {
//     console.error("Error fetching patients:", error);
//     return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
//   }
// }

export async function GET(req: NextRequest) {
  await connectToDatabase();

  const { searchParams } = new URL(req.url);
  const patientId = searchParams.get('id');
  const userId = searchParams.get('userId');
  const query = searchParams.get('q') || '';

  try {
    if(userId){
      // Get patient by user ID
      const patient = await getPatientByUserId(userId);
      if(!patient){
        return NextResponse.json({ error: 'patient not found' }, { status: 404 });
      }
      return NextResponse.json(patient);
    }

    if (patientId) {
      // Get patient by ID
      const patient = await getPatientById(patientId);
      if (!patient) {
        return NextResponse.json({ error: 'patient not found' }, { status: 404 });
      }
      return NextResponse.json(patient);
    }

    // Search patient by query(if given)
    const patients = await searchPatients(query);
    console.log('patients',patients);
    return NextResponse.json(patients);
  } catch (error) {
    console.error('Error fetching patients(s):', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

// UPDATE
export async function PUT(req: NextRequest) {
  await connectToDatabase();

  try {
    const { id, user: userData, ...patientData } = await req.json();
    console.log('userData:',userData);
    if (!id) {
      return NextResponse.json(
        { error: "Patient ID is required" },
        { status: 400 }
      );
    }

    const updatedPatient = await updatePatient(id, patientData);

    if (!updatedPatient) {
      return NextResponse.json(
        { error: "Patient not found" },
        { status: 404 }
      );
    }

    if (userData) {
      const { _id: userId, username, firstName, lastName } = userData;

      if (!userId) {
        return NextResponse.json(
          { error: "User ID is required for updating user details" },
          { status: 400 }
        );
      }

      const userUpdateData: UpdateUserParams = {
        username,
        firstName,
        lastName
      };

      const updatedUser = await updateUser(userData.clerkId, userUpdateData);
      if (!updatedUser) {
        return NextResponse.json(
          { error: "User not found" },
          { status: 404 }
        );
      }

      updatedPatient.user = updatedUser;
    }

    return NextResponse.json(updatedPatient, { status: 200 });
  } catch (error) {
    console.error("Error updating patient or user:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

// DELETE 
export async function DELETE(req: NextRequest) {
  await connectToDatabase();

  try {
    const { id } = await req.json();
    console.log(id);
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
