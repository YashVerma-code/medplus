import { create } from 'zustand';

const EmptyPatient: PatientDetails = {
  address: '',
  allergies: [],
  appointmentHistory: [],
  bloodGroup: '',
  chronicConditions: [],
  dateOfBirth: new Date(0), 
  emergencyContact: {
    name: '',
    relationship: '',
    phoneNumber: '',
  },
  gender: '',
  immunizations: [],
  records: [],
  medications: [],  
  paymentHistory: [],
  user: {
    clerkId: '',
    email: '',
    firstName: '',
    lastName: '',
    photo: '',
    role: '',
    username: '',
  },
  _id: '',
  streamChatId: '',
};


interface GlobalState {
  searchTerm: string;
  setSearchTerm: (term: string) => void;
  role: string;
  setRole: (role: string) => void;
  patientId: string;
  setPatientId: (patientId: string) => void;
  userId: string;
  setUserId: (userId: string) => void;
  patientDetails:PatientDetails;
  setPatientDetails: (patientDetails: PatientDetails) => void;
  searchCity:string;
  setSearchCity:(term:string)=>void;
  bookingStatus: boolean;
  setBookingStatus: (status: boolean) => void;
  refereshStatus: boolean;
  setRefereshStatus: (status: boolean) => void;
  longitude:number | null;
  latitude:number | null;
  setLongitude:(longitude:number | null)=>void;
  setLatitude:(latitude:number | null)=>void;
  checkedIndex: number | null;
  setCheckedIndex: (index: number | null) => void;
  reschedulingStatus:boolean;
  setReschedulingStatus:(status:boolean)=>void;
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
  searchCity:'',
  setSearchCity:(term:string)=>set({searchCity:term}),
  bookingStatus: false,
  setBookingStatus: (status) => set({ bookingStatus: status }),
  refereshStatus: false,
  setRefereshStatus: (status) => set({refereshStatus:status}),
  latitude:null,
  setLatitude:(latitude)=>set({latitude:latitude}),
  longitude:null,
  setLongitude:(longitude)=>set({longitude:longitude}),
  checkedIndex: null,
  setCheckedIndex: (index) => set({ checkedIndex: index }),
  reschedulingStatus:false,
  setReschedulingStatus:(status)=>set({reschedulingStatus:status}),

}));

export default useGlobalStore;
