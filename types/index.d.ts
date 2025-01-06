/* eslint-disable no-unused-vars */

// ====== USER PARAMS
declare type CreateUserParams = {
  clerkId: string;
  email: string;
  username: string;
  firstName: string;
  lastName: string;
  photo: string;
  role:string;
  _id:string;
};

declare type UpdateUserParams = {
  firstName?: string | null;
  lastName?: string;
  username?: string;
  photo?: string;
};

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
};

interface CreatePatientParams {
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
  records: {
    date: Date;
    doctorName: string;
    symptoms: string;
    symptomDuration: string;
    reason: string;
  }[];
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
}

interface UpdatePatientParams {
  address?: string;
  allergies?: string[];
  appointmentHistory?: Array<any>;
  bloodGroup?: string;
  chronicConditions?: string[];
  dateOfBirth?: Date;
  emergencyContact?: {
    name?: string;
    relationship?: string;
    phoneNumber?: string;
  };
  gender?: string;
  immunizations?: string[];
  records?: {
    date?: Date;
    doctorName?: string;
    symptoms?: string;
    symptomDuration?: string;
    reason?: string;
  }[];
  medications?: {
    name?: string;
    dosage?: string;
    _id?: string;
  }[];
  paymentHistory?: Array<any>;
  user?: {
    clerkId?: string;
    email?: string;
    firstName?: string;
    lastName?: string;
    photo?: string;
    role?: string;
    username?: string;
  };
  _id: string;
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
  records: {
    date: Date;
    doctorName: string;
    symptoms: string;
    symptomDuration: string;
    reason: string;
  }[];
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
    _id:string;
  };
  _id:string
}

interface Slot {
  _id: string;
  start: string;
  end: string;
  status: "available" | "booked" | "unavailable";
}

interface Availability {
  day: string;
  slots: Slot[];
}

interface ProfessionalDetails {
  licenseNumber: string;
  professionalOrganizations: string[];
  publications: string[];
  awards: string[];
}

interface User {
  _id: string;
  clerkId: string;
  email: string;
  username: string;
  photo: string;
  firstName?: string;
  lastName?: string;
  role: "admin" | "doctor" | "patient";
}

interface BookedSlot {
  date: string;
  start: string;
  end: string;
  day: string;
  status: string;
  _id: string;
}

interface Doctor {
  _id: string;
  user: User;
  specializations: string[];
  experience: number;
  education: string[];
  languages: string[];
  qualifications: string[];
  rating: number;
  availability: Availability[];
  phone: string;
  professionalDetails: ProfessionalDetails;
  bookedSlots: BookedSlot[];
}

interface Appointment {
  _id: string;
  patientId: string;
  doctorId: string;
  doctor: string;
  patient: string;
  date: Date;
  health_record: {
    allergies: string[];
    current_medications: string[];
    description?: string;
  };
  time: string;
  type: string;
}
