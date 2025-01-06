"use client";
import { useState, useCallback, useEffect } from "react";
import PatientCard from "@/components/shared/PatientCard";
import { debounce } from "lodash";
import { ThreeDots } from "react-loader-spinner";
import useGlobalStore from "@/zustand/useProps";
import { Alert, AlertTitle } from "@/components/ui/alert";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { toast } from "react-hot-toast";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination"
import { CreatePatientModal } from "@/components/shared/CreatePatientModal";

async function searchPatients(query: string): Promise<PatientDetails[]> {
  const response = await fetch(
    `/api/patients?q=${encodeURIComponent(query)}`
  );
  if (!response.ok) {
    throw new Error("Failed to fetch patients");
  }
  const data = await response.json();
  console.log("patients",data);
  return data;
}

const ManagePatients: React.FC = () => {
  const [patients, setPatients] = useState<PatientDetails[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const { searchTerm, setSearchTerm } = useGlobalStore();
  const [currentPage, setCurrentPage] = useState(1);
  const patientsPerPage = 8;

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const debouncedSearch = useCallback(
    debounce(async (query: string) => {
      setIsLoading(true);
      try {
        let results = await searchPatients(query);
        setPatients(Array.isArray(results) ? results : [results]);
        setCurrentPage(1);
      } catch (error) {
        console.error("Error searching patients:", error);
      } finally {
        setIsLoading(false);
      }
    }, 500),
    []
  );
  const handleDelete = async (id:string) => {
    const response = await fetch(`/api/patients/`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ id }), 
    });
    if (response.ok) {
      toast.success(`Patient removed successfully`);
      setPatients(patients.filter(patient=>patient._id!==id));
    } else {
      toast.error("Failed to remove patient");
    };
  }

  useEffect(() => {
    if (searchTerm) {
      debouncedSearch(searchTerm);
    } else {
      debouncedSearch("");
    }
  }, [searchTerm, debouncedSearch]);

  const indexOfLastPatient = currentPage * patientsPerPage;
  const indexOfFirstPatient = indexOfLastPatient - patientsPerPage;
  const currentPatients = patients.slice(indexOfFirstPatient, indexOfLastPatient);
  const totalPages = Math.ceil(patients.length / patientsPerPage);

  const paginate = (pageNumber: number) => setCurrentPage(pageNumber);

  return (
    <div className="bg-black min-h-screen">
      <div className="flex flex-col gap-6">
        <div className="sticky top-0 z-10 bg-black py-4">
          <div className="flex items-center justify-between gap-3 relative mb-4 mx-6">
            <div className="w-2/3">
            <Search className="absolute left-2 top-5 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search patients by id or profile..."
              className="pl-8 bg-black"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            </div>
            <div>
            <CreatePatientModal savedPatients = {patients}/>
            </div>
          </div>
        </div>
        {isLoading ? (
          <div className="h-[calc(100vh-65px)] mx-auto flex items-center justify-center">
            <ThreeDots visible={true} height="80" width="80" color="#2fe0d8" />
          </div>
        ) : currentPatients.length > 0 ? (
          <div className="px-6 flex-col mb-4">
            <div className="grid gap-6 sm:grid-cols-3 lg:grid-cols-4">
              {currentPatients.map((patient) => (
                <PatientCard key={patient._id} patient={patient} handleDelete={handleDelete}/>
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
          <div className="h-[calc(100vh-65px)] relative w-full flex justify-center items-center">
            <Alert className="fixed w-1/2 bg-white border-none">
              <AlertTitle className="text-center text-black">
                No patients found
              </AlertTitle>
            </Alert>
          </div>
        )}
      </div>
    </div>
  );
};
export default ManagePatients;
