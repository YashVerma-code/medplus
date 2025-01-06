import { create } from 'zustand';

const EmptyPatient: PatientDetails = {
  address: "",
  allergies: [],
  appointmentHistory: [],
  bloodGroup: "",
  chronicConditions: [],
  dateOfBirth: new Date(0),
  emergencyContact: {
    name: "",
    relationship: "",
    phoneNumber: "",
  },
  gender: "",
  immunizations: [],
  records: [],
  medications: [],
  paymentHistory: [],
  user: {
    clerkId: "",
    email: "",
    firstName: "",
    lastName: "",
    photo: "",
    role: "patient",
    username: "",
  },
  _id: "",
};

const EmptyDoctor: Doctor = {
  _id: "",
  user: {
    _id: "",
    clerkId: "",
    email: "",
    username: "",
    photo: "",
    firstName: "",
    lastName: "",
    role: "doctor",
  },
  specializations: [],
  experience: 0,
  education: [],
  languages: [],
  qualifications: [],
  rating: 0,
  availability: [],
  phone: "",
  professionalDetails: {
    licenseNumber: "",
    professionalOrganizations: [],
    publications: [],
    awards: [],
  },
  bookedSlots: [],
};


interface GlobalState {
  searchTerm: string;
  setSearchTerm: (term: string) => void;
  role: string;
  setRole: (role: string) => void;
  patientId: string;
  setPatientId: (patientId: string) => void;
  doctorId: string;
  setDoctorId: (doctorId: string) => void;
  userId: string;
  setUserId: (userId: string) => void;
  patientDetails:PatientDetails;
  setPatientDetails: (patientDetails: PatientDetails) => void;
  doctorDetails: Doctor;
  setDoctorDetails: (doctorDetails: Doctor) =>void;
}

const getInitialValue = <T>(key: string, defaultValue: T): T  => {
  if (typeof window !== "undefined") {
    const storedValue = localStorage.getItem(key);
    return storedValue ? JSON.parse(storedValue) : defaultValue;
  }
  return defaultValue;
};
const getInitValue = (key: string, defaultValue: string) => {
  if (typeof window !== "undefined") {
    const storedValue = localStorage.getItem(key);
    return storedValue ? storedValue : defaultValue;
  }
  return defaultValue;
};

const useGlobalStore = create<GlobalState>((set) => ({
  searchTerm: '',
  setSearchTerm: (term: string) => set({ searchTerm: term }),

  role: getInitValue('role', ''),
  setRole: (role: string) => {
    set({ role });
    localStorage.setItem('role', role);
  },

  patientId: getInitValue('patientId', ''),
  setPatientId: (patientId: string) => {
    set({ patientId });
    localStorage.setItem('patientId', patientId); 
  },
  doctorId: getInitValue('doctorId',''),
  setDoctorId: (doctorId: string) => {
    set ({doctorId});
    localStorage.setItem('doctorId',doctorId);
  },

  userId: getInitValue('userId', ''),
  setUserId: (userId: string) => {
    set({ userId });
    localStorage.setItem('userId', userId);
  },

  patientDetails: getInitialValue<PatientDetails>('patientDetails', EmptyPatient),
  setPatientDetails: (details: PatientDetails) => {
    set({ patientDetails: details });
    localStorage.setItem('patientDetails', JSON.stringify(details));
  },
  doctorDetails: getInitialValue<Doctor>('doctorDetails', EmptyDoctor),
  setDoctorDetails: (details: Doctor) => {
    set({ doctorDetails: details });
    localStorage.setItem('doctorDetails', JSON.stringify(details));
  },

}));

export default useGlobalStore;
