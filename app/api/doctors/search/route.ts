import { NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/database/mongoose';
import { getDoctorById, updateDoctor, deleteDoctor, searchDoctors } from '@/lib/actions/doctor.actions';
import Doctor from "../../../../lib/database/models/doctor.model";

// GET: Search single doctor
export async function GET(req: Request) {
  await connectToDatabase();

  const { searchParams } = new URL(req.url);
  const doctorId = searchParams.get('id');
  const query = searchParams.get('q') || '';

  try {
    if (doctorId) {
      // Get doctor by ID
      const doctor = await getDoctorById(doctorId);
      if (!doctor) {
        return NextResponse.json({ error: 'Doctor not found' }, { status: 404 });
      }
      return NextResponse.json(doctor);
    }

    // Search doctors by query(if given)
    const doctors = await searchDoctors(query);
    console.log('doctors',doctors);
    return NextResponse.json(doctors);
  } catch (error) {
    console.error('Error fetching doctor(s):', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

// POST: Create new doctor
// export async function POST(req: Request) {
//   await connectToDatabase();

//   try {
//     const doctorData = await req.json();
//     const newDoctor = await createDoctor(doctorData);
//     return NextResponse.json(newDoctor, { status: 201 });
//   } catch (error) {
//     console.error('Error creating doctor:', error);
//     return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
//   }
// }

export async function POST(req: Request) {
    try {
      await connectToDatabase();
  
      const doctors = await req.json();
      if (!Array.isArray(doctors)) {
        return NextResponse.json({ error: 'Expected an array of doctor objects' }, { status: 400 });
      }
  
      const result = await Doctor.insertMany(doctors);
      return NextResponse.json({ message: 'Doctors inserted successfully', data: result });
    } catch (error) {
      console.error('Error inserting doctors:', error);
      return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
  }

// PUT: Update existing doctor
export async function PUT(req: Request) {
  await connectToDatabase();

  try {
    const { id, ...updateData } = await req.json();
    if (!id) {
      return NextResponse.json({ error: 'Doctor ID is required' }, { status: 400 });
    }

    const updatedDoctor = await updateDoctor(id, updateData);
    if (!updatedDoctor) {
      return NextResponse.json({ error: 'Doctor not found' }, { status: 404 });
    }

    return NextResponse.json(updatedDoctor);
  } catch (error) {
    console.error('Error updating doctor:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

// DELETE: Remove doctor by ID
export async function DELETE(req: Request) {
  await connectToDatabase();
  try {
    const { searchParams } = new URL(req.url);
    const doctorId = searchParams.get('id');

    if (!doctorId) {
      return NextResponse.json({ error: 'Doctor ID is required' }, { status: 400 });
    }
    
    const deletedDoctor = await deleteDoctor(doctorId);
    if (!deletedDoctor) {
      return NextResponse.json({ error: 'Doctor not found' }, { status: 404 });
    }

    return NextResponse.json({ message: 'Doctor deleted', doctor: deletedDoctor });
  } catch (error) {
    console.error('Error deleting doctor:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
