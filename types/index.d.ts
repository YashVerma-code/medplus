/* eslint-disable no-unused-vars */

// ====== USER PARAMS
declare type CreateUserParams = {
    clerkId: string
    email: string
    username: string
    firstName: string | null
    lastName: string
    photo: string
  }
  
  declare type UpdateUserParams = {
    firstName: string | null
    lastName: string
    username: string
    photo: string
  }

// ====== DOCTOR PARAMS
declare type CreateDoctorParams = {
  name: string;
  specialty: string;
  experience: string;
  location: string;
  rating: number;
  availability: string;
  imageUrl?: string; // Optional
  phone: string;
  about: string;
  education: string[]; 
  specializations: string[];
  streamChatId: string; 
};

declare type UpdateDoctorParams = {
  name?: string;
  specialty?: string;
  experience?: string;
  location?: string;
  rating?: number;
  availability?: string;
  imageUrl?: string;
  phone?: string;
  about?: string;
  education?: string[];
  specializations?: string[];
  streamChatId?: string;
};

interface CreatePatientParams {
  user: string; // ObjectId of the associated user
  name: string;
  email: string;
  phone: string;
  dateOfBirth: Date;
  gender: "Male" | "Female" | "Other";
  bloodGroup:
  | "A+"
  | "A-"
  | "B+"
  | "B-"
  | "AB+"
  | "AB-"
  | "O+"
  | "O-";
  emergencyContact: {
    name: string;
    relationship: string;
    phoneNumber: string;
    address: string;
  };
  chronicConditions?: string[];
  allergies?: string[];
  medications?: {
      name?: string;
      dosage?: string;
  }[];
  immunizations?: string[];
  appointmentHistory?: {
    date: Date;
    time: string;
    doctor: string;
    type: string;
  }[];
  records:{
      date: Date;
      doctorName: string;
      symptoms: string;
      symptomDuration: string;
      reason: string;
  }[];
  paymentHistory?: {
      date: Date;
      amount: number;
      description?: string;
  }[];
  streamChatId?: string;
}

interface UpdatePatientParams {
  name?: string;
  email?: string;
  phone?: string;
  emergencyContact?: {
    name?: string;
    relationship?: string;
    phoneNumber?: string;
    address?: string;
  };
  dateOfBirth?: Date;
  gender?: "Male" | "Female" | "Other";
  bloodGroup?:
  | "A+"
  | "A-"
  | "B+"
  | "B-"
  | "AB+"
  | "AB-"
  | "O+"
  | "O-";
  chronicConditions?: string[];
  allergies?: string[];
  medications?: {
      name?: string;
      dosage?: string;
  }[];
  immunizations?: string[];
  paymentHistory?: {
    date: Date;
    amount: number;
    description?: string;
}[];
records?:{
    date: Date;
    doctorName: string;
    symptoms: string;
    symptomDuration: string;
    reason: string;
} [];
streamChatId?: string;
}

interface PatientDetails {
    address: string;
    allergies: string[];
    appointmentHistory: Array<any>;
    bloodGroup: string;
    chronicConditions: string[];
    dateOfBirth: Date; 
    emergencyContact: {
      name: string;
      relationship: string;
      phoneNumber: string;
    };
    gender: string;
    immunizations: string[];
    records:{
      date: Date;
      doctorName: string;
      symptoms: string;
      symptomDuration: string;
      reason: string;
    } [];
    medications: {
      name: string;
      dosage: string;
      _id: string;
    }[];
    paymentHistory: Array<any>;
    user: {
      clerkId: string;
      email: string;
      firstName: string;
      lastName: string;
      photo: string;
      role: string;
      username: string;
    };
    _id: string;
    streamChatId: string;
}