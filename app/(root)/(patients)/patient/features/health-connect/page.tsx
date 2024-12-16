"use client";
import { useState, useCallback, useEffect } from "react";
import DoctorCard from "@/components/shared/DoctorCard";
import { debounce } from "lodash";
import { DNA } from "react-loader-spinner";
import useGlobalStore from "@/zustand/useProps";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

interface Doctor {
  _id: string;
  name: string;
  specialty: string;
  experience: string;
  location: string;
  rating: number;
  availability: string;
  imageUrl: string;
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

const HealthConnect: React.FC = () => {
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const { searchTerm } = useGlobalStore();

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const debouncedSearch = useCallback(
    debounce(async (query: string) => {
      setIsLoading(true);
      try {
        const results = await searchDoctors(query);
        setDoctors(results);
      } catch (error) {
        console.error("Error searching doctors:", error);
      } finally {
        setIsLoading(false);
      }
    }, 500),
    []
  );

  useEffect(() => {
    if (searchTerm) {
      debouncedSearch(searchTerm);
    } else {
      debouncedSearch("");
    }
  }, [searchTerm, debouncedSearch]);

  return (
    <div className="container mx-auto px-4 py-24 lg:py-6">
      <div className="flex flex-col gap-6">
        {isLoading ? (
          <div className="mx-auto">
            <DNA
              visible={true}
              height="80"
              width="80"
              ariaLabel="dna-loading"
              wrapperStyle={{ filter: "hue-rotate(180deg)" }}
              wrapperClass="dna-wrapper"
            />
          </div>
        ) : doctors.length > 0 ? (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {doctors.map((doctor) => (
              <DoctorCard key={doctor._id} doctor={doctor} />
            ))}
          </div>
        ) : (
          <div className="relative w-full flex justify-center">
            <Alert className="fixed w-1/2 bg-teal-200 bg-opacity-20 border-none">
            <AlertTitle className="text-center text-green-500">No Doctors Matching Your Search</AlertTitle>
            <AlertDescription className="text-center text-green-500">
              We couldn't find any doctors that match your search criteria. Please try a different search term.
            </AlertDescription>
          </Alert>
          </div>
        )}
      </div>
    </div>
  );
};
export default HealthConnect;
