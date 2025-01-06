"use server";

import { revalidatePath } from "next/cache";
import Patient from "../database/models/patient.model";
import { connectToDatabase } from "../database/mongoose";
import { handleError } from "../utils";
import mongoose from "mongoose";

// CREATE
export async function createPatient(patient: CreatePatientParams) {
  try {
    await connectToDatabase();
    console.log("Patient profile created");

    const newPatient = await Patient.create(patient);
    return JSON.parse(JSON.stringify(newPatient));
  } catch (error) {
    handleError(error);
  }
}

// READ
export async function getAllPatients() {
    try {
      await connectToDatabase();
      console.log("Fetching all patient profiles");
      const patients = await Patient.find().populate("user");
      if (!patients) throw new Error("No patient profiles found");
      return JSON.parse(JSON.stringify(patients));
      } catch (error) {
        handleError(error);
      }
}

export async function getPatientById(patientId: string) {
  try {
    await connectToDatabase();
    console.log("Fetching patient by patient ID");

    const patient = await Patient.findById(patientId).populate("user");
    if (!patient) throw new Error("Patient profile not found");

    return JSON.parse(JSON.stringify(patient));
  } catch (error) {
    handleError(error);
  }
}

export async function getPatientByUserId(userId: string) { 
  try {
    await connectToDatabase();
    const patient = await Patient.findOne({ user : userId });
    console.log("get patient by user id");
    if(!patient) throw new Error('Patient Not Found');

    return JSON.parse(JSON.stringify(patient));
  } catch(error) {
    handleError(error)
  }

}

// SEARCH
export async function searchPatients(query: string) {
  try {
    await connectToDatabase();
    console.log(query);

    const filter = query
      ? {
          $or: [
            { 'user.firstName': { $regex: query, $options: 'i' } },
            { 'user.lastName': { $regex: query, $options: 'i' } },
            { 'user.username': { $regex: query, $options: 'i' } },
            { bloodGroup: { $regex: query, $options: 'i' } },
            ...(mongoose.Types.ObjectId.isValid(query) ? [{ _id: query }] : []),
          ].filter(Boolean),
        }
      : {};

    const results = await Patient.aggregate([
      {
        $lookup: {
          from: 'users',
          localField: 'user',
          foreignField: '_id',
          as: 'user',
        },
      },
      { $unwind: '$user' },
      { $match: filter },
      { $limit: 20 },
    ]);

    return results;
  } catch (error) {
    console.error('Database Error:', error);
    throw new Error('Internal Server Error');
  }
}

// UPDATE
export async function updatePatient(
  patientId: string,
  updateData: UpdatePatientParams
) {
  try {
    await connectToDatabase();
    console.log("Updating patient profile");

    const updatedPatient = await Patient.findByIdAndUpdate(
      patientId,
      updateData,
      {
        new: true,
      }
    ).populate("user");

    if (!updatedPatient) throw new Error("Patient update failed");

    return JSON.parse(JSON.stringify(updatedPatient));
  } catch (error) {
    handleError(error);
  }
}

// DELETE
export async function deletePatient(patientId: string) {
  try {
    await connectToDatabase();
    console.log("Deleting patient profile");

    const deletedPatient = await Patient.findByIdAndDelete(patientId);
    if (!deletedPatient) throw new Error("Patient profile not found");

    revalidatePath("/");

    return JSON.parse(JSON.stringify(deletedPatient));
  } catch (error) {
    handleError(error);
  }
}
