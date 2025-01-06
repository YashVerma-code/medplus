import { Schema, model, models } from "mongoose";
import User from "./user.model";

const PatientSchema = new Schema({
  user: {
    type: Schema.Types.ObjectId,
    ref: User, 
    required: true,
  },
  dateOfBirth: {
    type: Date,
    required: true,
  },
  gender: {
    type: String,
    enum: ["Male", "Female", "Other"],
    required: true,
  },
  bloodGroup: {
    type: String,
    enum: ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"],
    required: true,
  },
  address:{
    type: String,
    required: true,
  },
  emergencyContact: {
    name: { type: String, required: true },
    relationship: { type: String, required: true },
    phoneNumber: { type: String, required: true },
  },
  chronicConditions: [
    {
      type: String,
    },
  ],
  allergies: [
    {
      type: String,
    },
  ],
  medications: [
    {
      name: { type: String },
      dosage: { type: String },
    },
  ],
  immunizations: [
    {  
      type: String,
    }
  ],
  appointmentHistory: [
    {
      date: { type: Date, required: true },
      time: { type: String, required: true },
      doctor: { type: String, required: true },
      type: { type: String, required: true },
    },
  ],
  records: {
    type: [
      {
        doctorName: { type: String, required: true },
        symptoms: { type: String, required: true },
        symptomDuration: { type: String, required: true },
        reason: { type: String, required: true },
        date: { type: Date, required: true },
      }
    ],
    required: false,
  },
  
  paymentHistory: [
    {
      date: { type: Date, required: true },
      amount: { type: Number, required: true },
      description: { type: String },
    },
  ],
});

const Patient = models?.Patient || model("Patient", PatientSchema);

export default Patient;
