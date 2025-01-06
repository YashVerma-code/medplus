"use client";

import { useEffect, useState } from "react";
import { useUser } from "@clerk/nextjs";
import DoctorProfilePage from "@/components/shared/DoctorProfile";
import PatientProfilePage from "@/components/shared/PatientProfile";
import useGlobalStore from "@/zustand/useProps";
import { PatientProfileSkeleton } from "@/components/shared/PatientProfileSkeleton";

export default function ProfilePage() {
  const { user, isLoaded, isSignedIn } = useUser();
  const { role, setRole } = useGlobalStore();
  const { patientId, setPatientDetails, doctorId, setDoctorDetails } = useGlobalStore();

  const [patient, setPatient] = useState<PatientDetails | null>(null);
  const [doctor, setDoctor] = useState<Doctor | null>(null);

  // Fetch patient details
  useEffect(() => {
    const fetchPatientDetails = async () => {
      if (role !== "patient" || !patientId) return;

      try {
        const storedDetails = localStorage.getItem("patientDetails");
        if (storedDetails) {
          const parsedDetails = JSON.parse(storedDetails);

          if (user?.imageUrl && parsedDetails.user.photo !== user.imageUrl) {
            parsedDetails.user.photo = user.imageUrl;
            localStorage.setItem("patientDetails", JSON.stringify(parsedDetails));
          }

          setPatient(parsedDetails);
          setPatientDetails(parsedDetails);
          return;
        }

        const response = await fetch(`/api/patients?id=${patientId}`);
        if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
        const data = await response.json();

        setPatient(data);
        setPatientDetails(data);
      } catch (error) {
        console.error("Error fetching patient details:", error);
      }
    };

    fetchPatientDetails();
  }, [role, patientId, setPatientDetails, user?.imageUrl]);

  // Fetch doctor details
  useEffect(()=>{
    const fetchDoctorDetails = async () =>{
      if (role !== 'doctor' || !doctorId) return;
      try {
        const storedDetails = localStorage.getItem("doctorDetails");
        if ( storedDetails ){
          const parsedDetails = JSON.parse(storedDetails);

          if (user?.imageUrl && parsedDetails.user.photo !== user.imageUrl) {
            parsedDetails.user.photo = user.imageUrl;
            localStorage.setItem("doctorDetails", JSON.stringify(parsedDetails));
          }

          setDoctor(parsedDetails);
          setDoctorDetails(parsedDetails);
          return;
        }

        const response = await fetch(`/api/doctors/search?id=${doctorId}`);
        if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
        const data = await response.json();

        setDoctor(data);
        setDoctorDetails(data);

      }catch (error) {
        console.error("Error fetching doctor details:", error);
      }
    }
    fetchDoctorDetails();
  },[role, doctorId, setDoctorDetails, user?.imageUrl]);

  useEffect(() => {
    if (isLoaded && isSignedIn && user) {
      const userRole = user.publicMetadata.role as string;
      setRole(userRole);
    }
  }, [isLoaded, isSignedIn, user, setRole]);

  if (!isLoaded || (role === "patient" && !patient) || (role === "doctor" && !doctor)) {
    return <PatientProfileSkeleton />;
  }

  return (
    <>
      {role === "doctor" && doctor && <DoctorProfilePage doctor={doctor} />}
      {role === "patient" && patient && <PatientProfilePage patientss={patient} />}
    </>
  );
}
