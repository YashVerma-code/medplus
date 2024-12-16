"use client";
import { useEffect, useState } from "react";
import DoctorProfilePage from "@/components/shared/DoctorProfile";
import PatientProfilePage from "@/components/shared/PatientProfile";
import { DNA } from "react-loader-spinner";

export default function ProfilePage() {
  const [role, setRole] = useState("");
  useEffect(() => {
    //     // Simulate fetching role data from an API or session
    //     const fetchUserRole = async () => {
    //       // Example: Replace with your actual auth or session logic
    //       const userRole = await getRoleFromSession();
    //     //   setRole(userRole);
    //     };
    setRole("patient");
    //     fetchUserRole();
  }, [setRole]);

  if (!role) {
    return (
      <div className="mx-auto flex-center">
        <DNA
          visible={true}
          height="80"
          width="80"
          ariaLabel="dna-loading"
          wrapperStyle={{ filter: "hue-rotate(180deg)" }}
          wrapperClass="dna-wrapper"
        />
      </div>
    );
  }

  return (
    <div>
      {role === "doctor" && <DoctorProfilePage />}
      {role === "patient" && <PatientProfilePage />}
      {role !== "doctor" && role !== "patient" && (
        <div className="text-center text-red-500">
          Unauthorized Access - Please check your role.
        </div>
      )}
    </div>
  );
}
