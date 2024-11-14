'use server';

import { revalidatePath } from 'next/cache';
import Doctor from '../database/models/doctor.model';
import { connectToDatabase } from '../database/mongoose';
import { handleError } from '../utils';
import { NextResponse } from 'next/server';

// CREATE
export async function createDoctor(doctor: CreateDoctorParams) {
  try {
    await connectToDatabase();
    console.log('doctor created');
    const newDoctor = await Doctor.create(doctor);

    return JSON.parse(JSON.stringify(newDoctor));
  } catch (error) {
    handleError(error);
  }
}

// READ
export async function getDoctorById(doctorId: string) {
  try {
    await connectToDatabase();
    const doctor = await Doctor.findById(doctorId);
    console.log('get doctor by id');
    if (!doctor) throw new Error('Doctor not found');

    return JSON.parse(JSON.stringify(doctor));
  } catch (error) {
    handleError(error);
  }
}

// UPDATE
export async function updateDoctor(doctorId: string, doctorData: UpdateDoctorParams) {
  try {
    await connectToDatabase();
    console.log('doctor update successful');

    const updatedDoctor = await Doctor.findByIdAndUpdate(doctorId, doctorData, {
      new: true,
    });

    if (!updatedDoctor) throw new Error('Doctor update failed');

    return JSON.parse(JSON.stringify(updatedDoctor));
  } catch (error) {
    handleError(error);
  }
}

// DELETE
export async function deleteDoctor(doctorId: string) {
  try {
    await connectToDatabase();
    console.log('doctor deleted');
    const deletedDoctor = await Doctor.findByIdAndDelete(doctorId);

    revalidatePath('/doctors');
    return deletedDoctor ? JSON.parse(JSON.stringify(deletedDoctor)) : null;
  } catch (error) {
    handleError(error);
  }
}

// SEARCH
export async function searchDoctors(query: string) {
    try {
      await connectToDatabase();
      const filter = query
        ? {
            $or: [
              { name: { $regex: query, $options: 'i' } },
              { specialty: { $regex: query, $options: 'i' } },
            ],
          }
        : {};
  
      const results = await Doctor.find(filter).limit(20).exec();
      return results;
    } catch (error) {
      console.error('Database Error:', error);
      throw new Error('Internal Server Error');
    }
  }