

"use client"

import { useEffect, useState,useMemo } from "react"
import { useUser } from "@clerk/nextjs"
import useGlobalStore from "@/zustand/useProps"
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card"
import { Search,Newspaper } from 'lucide-react';
import { DNA } from "react-loader-spinner";
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Loader2 } from 'lucide-react'

interface Slot {
  start: string
  end: string
  status: "available" | "booked" | "unavailable"
}

interface Availability {
  day: string
  slots: Slot[]
}

interface ProfessionalDetails {
  licenseNumber: string
  professionalOrganizations: string[]
  publications: string[]
  awards: string[]
}

interface User {
  _id: string
  clerkId: string
  email: string
  username: string
  photo: string
  firstName?: string
  lastName?: string
  role: "admin" | "doctor" | "patient"
}

interface Doctor {
  _id: string
  user: User
  specializations: string[]
  experience: number
  education: string[]
  languages: string[]
  qualifications: string[]
  rating: number
  availability: Availability[]
  phone: string
  professionalDetails: ProfessionalDetails
}

interface PatientDetails {
  address: string
  allergies: string[]
  appointmentHistory: Array<any>
  bloodGroup: string
  chronicConditions: string[]
  dateOfBirth: Date
  emergencyContact: {
    name: string
    relationship: string
    phoneNumber: string
  }
  gender: string
  immunizations: string[]
  records: {
    date: Date
    doctorName: string
    symptoms: string
    symptomDuration: string
    reason: string
    _id: string
    medications: {
      name: string
    
      _id: string
    }[]
  }[]
 
  paymentHistory: Array<any>
  user: {
    _id: string
    clerkId: string
    email: string
    firstName: string
    lastName: string
    photo: string
    role: string
    username: string
  }
  _id: string
  streamChatId: string
}

export default function Prescription() {
  const { user } = useUser()
  const { setPatientDetails } = useGlobalStore()
  const [patients, setPatients] = useState<PatientDetails[]>([])
  const [selectedPatient, setSelectedPatient] = useState<PatientDetails | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [newPrescription, setNewPrescription] = useState({
    symptoms: "",
    symptomDuration: "",
    reason: "",

  medications: [
    {
      name: "",
   
     
    }
  ]
  })
  const [searchTerm, setSearchTerm] = useState("")
  const fetchData = async () => {
    if (!user?.id) return;
    
    setIsLoading(true);
    try {
      // Fetch doctor's appointments
      const appointmentsResponse = await fetch(`/api/doctors/appointment/${user.id}`);
      if (!appointmentsResponse.ok) throw new Error(`HTTP error! status: ${appointmentsResponse.status}`);
      const data: { patientId: string }[] = await appointmentsResponse.json();

      // Extract patient IDs
      const patientIds = data.map(appointment => appointment.patientId);

      console.log("Fetched doctor appointments from API:", patientIds);
     

      // Fetch patients using the new API route
      const patientsResponse = await fetch(`/api/patients/`);

      
    

    
      if (!patientsResponse.ok) throw new Error(`HTTP error! status: ${patientsResponse.status}`);
      const patientsData = await patientsResponse.json();
      //i will only have the patient details of the patients that have appointments with the doctor
      console.log("Fetched patients details from API:", patientsData);
      const patientIdSet = new Set(patientIds);
      const patients = patientsData.filter((patient: PatientDetails) => patientIdSet.has(patient.user._id));
      console.log("Filtered patients:", patients);

      setPatients(patients);
      setPatientDetails(patients);
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [user?.id]);

  const handleAddPrescription = async () => {
    if (!selectedPatient || !user) return;

    try {
      setIsSubmitting(true);
      const response = await fetch(`/api/patients/add-prescription`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          patientId: selectedPatient._id,
          prescription: {
            ...newPrescription, 
            date: new Date(),
            doctorName: `${user.firstName} ${user.lastName}`,
          },
          patient: {
            firstName: selectedPatient.user.firstName,
            lastName: selectedPatient.user.lastName,
          },
        }),
      })

      if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`)
      const updatedPatient = await response.json()

      setPatients((prevPatients) =>
        prevPatients.map((patient) =>
          patient._id === selectedPatient._id ? updatedPatient : patient
        )
      )

      setPatientDetails(updatedPatient)
      
      // Refresh patient data
      await fetchData();

      // Reset form and close dialog
      setNewPrescription({ symptoms: "", symptomDuration: "", reason: "", medications: [{ name: "" }] })
      setSelectedPatient(null)
    } catch (error) {
      console.error("Error adding prescription", error)
    } finally {
      setIsSubmitting(false)
    }
  }

    
    

    const filteredPatients = useMemo(() => {
      const lowercasedSearchTerm = searchTerm.toLowerCase().trim()
      return patients.filter((patient) =>
        `${patient.user?.firstName} ${patient.user?.lastName}`
          .toLowerCase()
          .includes(lowercasedSearchTerm)
      )
    }, [patients, searchTerm])

  if (isLoading) {
    return (
      <div className="flex flex-col min-h-screen bg-gradient-to-br from-teal-100 to-blue-200">
      <header className="lg:sticky fixed top-16 sm:top-16 md:top-16 lg:top-0 z-10 w-full bg-lblue bg-opacity-20 backdrop-filter backdrop-blur-lg shadow-lg">
             <div className="container mx-auto px-4 py-2 flex flex-col sm:flex-row items-center justify-between gap-4">
               <div className="flex items-center gap-3">
                 <div className="bg-blue-200 rounded-full p-2">
                   <Newspaper className="text-blue w-8 h-8" aria-hidden="true" />
                 </div>
                 <div>
                   <h1 className="hidden lg:block text-2xl sm:text-3xl lg:text-3xl font-bold text-blue ml-0 sm:ml-2 leading-6 sm:leading-6">Health-Records</h1>
                   <p className="hidden lg:block text-blue-700 text-sm sm:text-base ml-0 sm:ml-2">Seamlessly manage your prescriptions with ease and precision</p>
                 </div>
               </div>
     
               <div className="flex flex-col sm:flex-row items-center gap-3 w-full sm:w-auto">
                 <div className="relative w-full sm:w-auto">
                   <Input
                     type="text"
                     placeholder="Search items..."
                     value={searchTerm}
                     onChange={(e) => setSearchTerm(e.target.value)}
                     className="w-full sm:w-60 md:w-96 pr-10"
                   />
                   <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 w-5 h-5" />
                 </div>
                
               </div>
             </div>
             
           </header>

           <div className="flex justify-center">
                          <DNA
                            visible={true}
                            height="80"
                            width="80"
                            ariaLabel="dna-loading"
                            wrapperStyle={{ filter: "hue-rotate(180deg)" }}
                            wrapperClass="dna-wrapper"
                          />
                        </div>
           </div>
    )
  }

  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-br from-teal-100 to-blue-200">
     <header className="lg:sticky fixed top-16 sm:top-16 md:top-16 lg:top-0 z-10 w-full bg-lblue bg-opacity-20 backdrop-filter backdrop-blur-lg shadow-lg">
        <div className="container mx-auto px-4 py-2">
          <div className="flex gap-2 items-center justify-between ">
            <div className="flex items-center gap-1">
              <div className="bg-lblue bg-opacity-50 rounded-lg p-2">
                <Newspaper className="text-blue w-8 h-8" aria-hidden="true" />
              </div>
              <div className="flex flex-col">
                <h1 className="hidden lg:block text-2xl sm:text-3xl lg:text-3xl font-bold text-blue ml-0 sm:ml-2 leading-6 sm:leading-6">
                 Health Records
                </h1>
                <p className="hidden lg:block text-blue-700 text-sm sm:text-base ml-0 sm:ml-2">
                Seamlessly manage your prescriptions with ease and precision
                </p>
              </div>
            </div>
            <div className="relative lg:w-96 w-full">
              <Search className="absolute left-2 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Search doctors by name or specialty"
                className="pl-8"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>
        </div>
      </header>
      {patients.length === 0 ? (
        <div className="text-center text-muted-foreground flex justify-center mt-10">
           <Alert className="relative w-full sm:w-1/2 md:w-1/2 lg:w-1/2 bg-teal-200 bg-opacity-20 border-none">
            <AlertTitle className="text-center text-green-500">
            No patients found with appointments!
            </AlertTitle>
            <AlertDescription className="text-center text-green-500">
              Schedule your appointment with patients. 
            </AlertDescription>
          </Alert>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3  p-6 mt-20 sm:mt-0">
          {filteredPatients.map((patient) => (
            <Card key={patient._id} className="overflow-hidden">
              <CardHeader>
                <CardTitle className="text-xl">
                  {patient?.user?.firstName} {patient?.user?.lastName}
                  <div className="text-sm font-normal">{patient.gender}</div>
                  {/* {patient?.medications?.length > 0 && (
                    <div className="mt-2 text-sm font-normal">
                      <strong>Current Medications:</strong>
                      {patient?.medications?.map((medication) => (
                        <div key={medication?._id}>
                          {medication?.name} - {medication?.dosage}
                        </div>
                      ))}
                    </div>
                  )} */}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <Dialog>
                  <DialogTrigger asChild>
                    <Button
                      className="mb-4 w-full"
                      onClick={() => setSelectedPatient(patient)}
                    >
                      Add New Prescription
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>
                        Add Prescription for {patient?.user?.firstName}{" "}
                        {patient?.user?.lastName}
                      </DialogTitle>
                    </DialogHeader>
                    <div className="grid gap-4 py-4">
                      <div className="space-y-2">
                        <label
                          htmlFor="symptoms"
                          className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                        >
                          Symptoms
                        </label>
                        <Textarea
                          id="symptoms"
                          placeholder="Enter patient symptoms"
                          value={newPrescription.symptoms}
                          onChange={(e) =>
                            setNewPrescription({
                              ...newPrescription,
                              symptoms: e.target.value,
                            })
                          }
                        />
                      </div>
                      <div className="space-y-2">
                        <label
                          htmlFor="duration"
                          className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                        >
                          Symptom Duration
                        </label>
                        <Input
                          id="duration"
                          placeholder="e.g., 3 days, 1 week"
                          value={newPrescription.symptomDuration}
                          onChange={(e) =>
                            setNewPrescription({
                              ...newPrescription,
                              symptomDuration: e.target.value,
                            })
                          }
                        />
                      </div>
                      <div className="space-y-2">
                        <label
                          htmlFor="reason"
                          className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                        >
                          Reason
                        </label>
                        <Textarea
                          id="reason"
                          placeholder="Enter reason for prescription"
                          value={newPrescription.reason}
                          onChange={(e) =>
                            setNewPrescription({
                              ...newPrescription,
                              reason: e.target.value,
                            })
                          }
                        />
                      </div>
                      {newPrescription.medications.map((medication, index) => (
                        <div key={index} className="space-y-2">
                          <label
                            htmlFor={`medication-${index}`}
                            className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                          >
                            Medication {index + 1} (Name)
                          </label>
                          <Textarea
                            id={`medication-${index}`}
                            placeholder={`Enter medication name (e.g., Paracetamol)`}
                            value={medication.name}
                            onChange={(e) => {
                              const updatedMedications = [...newPrescription.medications];
                              updatedMedications[index].name = e.target.value;
                              setNewPrescription({
                                ...newPrescription,
                                medications: updatedMedications,
                              });
                            }}
                            onKeyDown={(e) => {
                              if (e.key === 'Enter') {
                                e.preventDefault();
                                setNewPrescription((prevState) => ({
                                  ...prevState,
                                  medications: [...prevState.medications, { name: '' }],
                                }));
                              }
                            }}
                          />
                        </div>
                      ))}    <Button
                        onClick={handleAddPrescription}
                        disabled={isSubmitting}
                      >
                        {isSubmitting ? (
                          <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            Adding...
                          </>
                        ) : (
                          "Add Prescription"
                        )}
                      </Button>
                    </div>
                  </DialogContent>
                </Dialog>
                <div className="max-h-48 space-y-2 overflow-y-auto ">
                  {patient?.records?.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()).map((record) => (
                    <CardDescription
                      key={record?._id}
                      className="rounded-lg bg-muted p-3"
                    >
                      <div className="space-y-2 text-sm container"></div>
                        <div className="font-medium text-foreground">
                        <span className="font-bold">Date:</span> {new Date(record?.date).toLocaleDateString("en-Gb").split("/").join("-")}
                        </div>
                        {/* <div>Doctor: {record?.doctorName}</div> */}
                        <div><span className="font-bold"> Symptoms: </span>{record?.symptoms}</div>
                        <div><span className="font-bold"> Duration:</span> {record?.symptomDuration}</div>
                        <div><span className="font-bold">Reason:</span> {record?.reason}</div>
                        <div>
                          <span className="font-bold">Medications:</span>
                          {record?.medications?.map((medication) => (
                            <div key={medication._id}>
                              {medication.name} 
                            </div>
                             ))}

                      </div>
                    </CardDescription>
                  ))}
                  {patient?.records?.length === 0 && (
                    <div className="text-center text-sm text-muted-foreground">
                      <Alert className="relative w-full sm:w-1/2 md:w-1/2 lg:w-1/2 bg-teal-200 bg-opacity-20 border-none">
                        <AlertTitle className="text-center text-green-500">
                          No prescription records found!
                        </AlertTitle>
                        <AlertDescription className="text-center text-green-500">
                          Schedule your appointment with patients. 
                        </AlertDescription>
                      </Alert>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card> 
          ))}
        </div>
      )}
    </div>
  )
}




