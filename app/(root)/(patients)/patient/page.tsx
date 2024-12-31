'use client';
import { useEffect } from "react";
import { useUser } from "@clerk/nextjs";
import useGlobalStore from "@/zustand/useProps";

const PatientHome = () => {
  const { user, isLoaded, isSignedIn } = useUser();
  const { setPatientId, setUserId, role, setRole } = useGlobalStore();

  useEffect(() => {
    if (isLoaded && isSignedIn && user) {
      const userRole = user.publicMetadata.role as string | undefined;
      const userId = user.publicMetadata.userId as string | undefined;

      if (userRole) {
        setRole(userRole);
        localStorage.setItem("role", userRole);
      } else {
        setRole("patient");
        localStorage.setItem("role", "patient");
      }
      if(userId){
        setUserId(userId);
        localStorage.setItem("userId", userId);
      } 

      if (userId && role === "patient") {
        const storedPatientId = localStorage.getItem("patientId");

        if (storedPatientId) {
          setPatientId(storedPatientId);
        } else {
          const fetchPatientId = async () => {
            try {
              const response = await fetch(`/api/patients/user/${userId}`);
              if (!response.ok) throw new Error("Patient not found");

              const data = await response.json();
              setPatientId(data._id);
              localStorage.setItem("patientId", data._id); 
            } catch (error) {
              console.error("Error fetching patient:", error);
            }
          };
          fetchPatientId();
        }
      }
    }
  }, [isLoaded, isSignedIn, user, setRole, setUserId, setPatientId, role]);

  return (
    <>
      <div className="grid grid-cols-12 grid-rows-12 gap-5 p-4 box-border min-h-screen rounded-lg">
        <div className="col-span-8 row-span-6 rounded-lg rounded-tl-[18px] p-4 bggrad">
          Patient 1
        </div>
        <div className="col-span-4 row-span-4 rounded-lg rounded-tr-[18px] p-4 bggrad">Box 2</div>
        <div className="col-span-4 row-span-2 rounded-lg p-4 bggrad">Box 3</div>
        <div className="col-span-5 row-span-6 rounded-lg rounded-bl-[18px] p-4 bggrad">Box 4</div>
        <div className="col-span-7 row-span-6 rounded-lg rounded-br-[18px] p-4 bggrad">Box 5</div>
      </div>
    </>
  );
};

export default PatientHome;
