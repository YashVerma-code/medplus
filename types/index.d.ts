/* eslint-disable no-unused-vars */

// ====== USER PARAMS
declare type CreateUserParams = {
    clerkId: string
    email: string
    username: string
    firstName: string
    lastName: string
    photo: string
  }
  
  declare type UpdateUserParams = {
    firstName: string
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
