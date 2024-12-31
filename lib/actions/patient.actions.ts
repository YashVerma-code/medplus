"use server";

import { revalidatePath } from "next/cache";
import Patient from "../database/models/patient.model";
import { connectToDatabase } from "../database/mongoose";
import { handleError } from "../utils";

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
