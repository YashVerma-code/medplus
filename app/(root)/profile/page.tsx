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
  const { patientId, setPatientDetails } = useGlobalStore();

  const [patient, setPatient] = useState<PatientDetails | null>(null);

  useEffect(() => {
    const getPatientDetails = async () => {
      try {
        const storedDetails = localStorage.getItem("patientDetails");
        if (storedDetails) {
          const parsedDetails = JSON.parse(storedDetails);

          if (user?.imageUrl && parsedDetails.user.photo !== user.imageUrl) {
            parsedDetails.user.photo = user.imageUrl;
            localStorage.setItem("patientDetails", JSON.stringify(parsedDetails));
          }
  
          setPatient({ ...parsedDetails });
          setPatientDetails(parsedDetails);
          return;
        }
  
        const response = await fetch(`/api/patients/${patientId}`);
        if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
        const data = await response.json();
  
        setPatient({ ...data });
        setPatientDetails(data);
  
        console.log("Fetched patient details from API:", data);
      } catch (error) {
        console.error("Error fetching patient details", error);
      }
    };
  
    if (patientId) {
      getPatientDetails();
    }
  }, [patientId, setPatientDetails, user?.imageUrl]);
  
  useEffect(() => {
    if (isLoaded && isSignedIn && user) {
      const userRole = user.publicMetadata.role as string | undefined;
      if (userRole) {
        setRole(userRole);
      } else {
        setRole("patient");
      }
    }
  }, [isLoaded, isSignedIn, user, setRole]);

  if (!isLoaded && !patient) {
    return <PatientProfileSkeleton />;
  }

  if (!isSignedIn) {
    return <PatientProfileSkeleton />;
  }

  return (
    <>
      {/* dont do this way, it will take time to shift */}
      {role === "doctor" && <DoctorProfilePage />}
      {role === "patient" && patient && <PatientProfilePage key={patient.user + patient.user.photo} patientss={patient} />}
    </>
  );  
}
