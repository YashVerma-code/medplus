"use client";
import { useState, useCallback, useEffect } from "react";
import DoctorCard from "@/components/shared/DoctorCard";
import { debounce } from "lodash";
import { DNA } from "react-loader-spinner";
import useGlobalStore from "@/zustand/useProps";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination"

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
  const [currentPage, setCurrentPage] = useState(1);
  const doctorsPerPage = 9;

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const debouncedSearch = useCallback(
    debounce(async (query: string) => {
      setIsLoading(true);
      try {
        let results = await searchDoctors(query);
        setDoctors(Array.isArray(results) ? results : [results])
        setCurrentPage(1);
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
  
  const indexOfLastDoctor = currentPage * doctorsPerPage;
  const indexOfFirstDoctor = indexOfLastDoctor - doctorsPerPage;
  const currentDoctors = doctors.slice(indexOfFirstDoctor, indexOfLastDoctor);
  const totalPages = Math.ceil(doctors.length / doctorsPerPage);

  const paginate = (pageNumber: number) => setCurrentPage(pageNumber);

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
        ) : currentDoctors.length > 0 ? (
          <div className="px-6 flex-col mb-4">
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {currentDoctors.map((doctor) => (
              <DoctorCard key={doctor._id} doctor={doctor} handleDelete={()=>console.log("health-connect-prop")}/>
            ))}
          </div>
          <div className="mt-8">
            <Pagination>
              <PaginationContent>
                <PaginationItem>
                  <PaginationPrevious 
                    onClick={() => paginate(Math.max(1, currentPage - 1))}
                    className={currentPage === 1 ? 'pointer-events-none opacity-50' : ''}
                  />
                </PaginationItem>
                {[...Array(totalPages)].map((_, index) => (
                  <PaginationItem key={index}>
                    <PaginationLink 
                      onClick={() => paginate(index + 1)}
                      isActive={currentPage === index + 1}
                    >
                      {index + 1}
                    </PaginationLink>
                  </PaginationItem>
                ))}
                <PaginationItem>
                  <PaginationNext 
                    onClick={() => paginate(Math.min(totalPages, currentPage + 1))}
                    className={currentPage === totalPages ? 'pointer-events-none opacity-50' : ''}
                  />
                </PaginationItem>
              </PaginationContent>
            </Pagination>
          </div>
        </div>
      ) : (
          <div className="relative w-full flex justify-center">
            <Alert className="fixed w-1/2 bg-teal-200 bg-opacity-20 border-none">
            <AlertTitle className="text-center text-green-500">No Doctors Matching Your Search</AlertTitle>
            <AlertDescription className="text-center text-green-500">
              We couldn&apos;t find any doctors that match your search criteria. Please try a different search term.
            </AlertDescription>
          </Alert>
          </div>
        )}
      </div>
    </div>
  );
};
export default HealthConnect;
