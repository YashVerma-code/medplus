"use client";
import PatientProfilePage from "@/components/shared/PatientProfile";
import useGlobalStore from "@/zustand/useProps";
import React, { useEffect, useState } from "react";

export default function PatientProfile({
  params: { _id },
}: {
  params: { _id: string };
}) {
  const [patient, setPatient] = useState<PatientDetails | null>(null);
  const { setPatientDetails } = useGlobalStore();
  useEffect(() => {
    const fetchPatientDetails = async () => {
      try {
        const response = await fetch(`/api/patients?id=${_id}`);
        if (!response.ok)
          throw new Error(`HTTP error! status: ${response.status}`);
        const data = await response.json();

        setPatient(data);
        setPatientDetails(data);
      } catch (error) {
        console.error("Error fetching patient details:", error);
      }
    };

    fetchPatientDetails();
  }, [setPatientDetails]);

  return <>{patient && <PatientProfilePage patientss={patient} />}</>;
}
