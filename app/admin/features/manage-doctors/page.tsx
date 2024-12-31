"use client";
import { useState, useCallback, useEffect } from "react";
import DoctorCard from "@/components/shared/DoctorCard";
import { debounce } from "lodash";
import { ThreeDots } from "react-loader-spinner";
import useGlobalStore from "@/zustand/useProps";
import { Alert, AlertTitle } from "@/components/ui/alert";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { toast } from "react-hot-toast";

interface Slot {
  start: string;
  end: string;
  status: 'available' | 'booked' | 'unavailable';
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
  role: 'admin' | 'doctor' | 'patient';
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
}
async function searchDoctors(query: string): Promise<Doctor[]> {
  const response = await fetch(
    `/api/doctors/search?q=${encodeURIComponent(query)}`
  );
  if (!response.ok) {
    throw new Error("Failed to fetch doctors");
  }
  return response.json();
}

const ManageDoctors: React.FC = () => {
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const { searchTerm, setSearchTerm } = useGlobalStore();

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const debouncedSearch = useCallback(
    debounce(async (query: string) => {
      setIsLoading(true);
      try {
        let results = await searchDoctors(query);
        console.log("RESULTS",results);
        setDoctors(Array.isArray(results) ? results : [results]);
      } catch (error) {
        console.error("Error searching doctors:", error);
      } finally {
        setIsLoading(false);
      }
    }, 500),
    []
  );
  const handleDelete = async (id:string) => {
    const response = await fetch(`/api/doctors/search?id=${id}`, {
      method: "DELETE",
    });
    if (response.ok) {
      toast.success(`Doctor removed successfully`);
      setDoctors(doctors.filter(doctor=>doctor._id!==id));
    } else {
      toast.error("Failed to remove doctor");
    };
  }

  useEffect(() => {
    if (searchTerm) {
      debouncedSearch(searchTerm);
    } else {
      debouncedSearch("");
    }
  }, [searchTerm, debouncedSearch]);
  return (
    <div className="bg-black">
      <div className="flex flex-col gap-6">
        <div className="sticky top-0 z-10 bg-black py-4">
          <div className="mx-auto relative w-[96%] mb-4">
            <Search className="absolute left-2 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search doctors by id or profile..."
              className="pl-8 bg-black"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>
        {isLoading ? (
          <div className="h-[calc(100vh-65px)] mx-auto flex items-center justify-center">
            <ThreeDots visible={true} height="80" width="80" color="#2fe0d8" />
          </div>
        ) : doctors.length > 0 ? (
          <div className="px-6 flex-col mb-4">
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {doctors.map((doctor) => (
                <DoctorCard key={doctor._id} doctor={doctor} handleDelete={handleDelete}/>
              ))}
            </div>
          </div>
        ) : (
          <div className="h-[calc(100vh-65px)] relative w-full flex justify-center items-center">
            <Alert className="fixed w-1/2 bg-white border-none">
              <AlertTitle className="text-center text-black">
                No doctors found
              </AlertTitle>
            </Alert>
          </div>
        )}
      </div>
    </div>
  );
};
export default ManageDoctors;
