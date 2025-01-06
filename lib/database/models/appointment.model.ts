import mongoose, { Schema, Document, model,models } from "mongoose";

export interface Appointment extends Document {
  patientId: string;
  doctorId: string;
  date: Date;
  doctor: string;
  patient: string;
  time: string;
  type:string;
  _id:string;
  health_record:{

  }
  
}

export const AppointmentSchema: Schema<Appointment> = new Schema({
  patientId: {
    type: String,
    ref: "Patient",  
    required: true,
  },
  doctorId: {
    type: String,
    ref: "Doctor",   
    required: true,
  },
  doctor: {
    type: String,
    required: true,
    trim: true,
  },
  patient: {
    type: String,
    required: true,
    trim: true,
  },  
  date: {
    type: Date,
    required: true,
    validate: {
      validator: (value: Date) => {
        const today = new Date();
        today.setHours(0, 0, 0, 0); // Normalize to start of the day
        return value >= today;
      },
      message: "The appointment date must be in the future.",
    },
  },
  health_record: {
    allergies: [{
      type:String,
    }],
    current_medications: [{
      type:String,
    }],
    description:String,
  },
  time: {
    type: String,
    required: true,
    match: /^\d{2}:\d{2}$/,
  },
  type:{
    type: String,
    required: true,
  }
});

export const Appointment =
  models?.Appointment || model<Appointment>("Appointment", AppointmentSchema);