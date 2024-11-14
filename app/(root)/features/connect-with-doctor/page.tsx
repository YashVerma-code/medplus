'use client'
import { useState,useCallback, useEffect } from "react"
import DoctorCard from "@/components/shared/DoctorCard"
import { debounce } from 'lodash'
import { Search } from "lucide-react"
import { Input } from "@/components/ui/input"

interface Doctor {
  _id: string
  name: string
  specialty: string
  experience: string
  location: string
  rating: number
  availability: string
  imageUrl: string
};

async function searchDoctors(query: string): Promise<Doctor[]> {
  const response = await fetch(`/api/doctors/search?q=${encodeURIComponent(query)}`)
  if (!response.ok) {
    throw new Error('Failed to fetch doctors')
  }
  return response.json()
}

const ConnectWithDoctor:React.FC = () =>{
  const [searchTerm, setSearchTerm] = useState('')
  const [doctors, setDoctors] = useState<Doctor[]>([])
  const [isLoading, setIsLoading] = useState(false)

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const debouncedSearch = useCallback(
    debounce(async (query: string) => {
      setIsLoading(true)
      try {
        const results = await searchDoctors(query)
        setDoctors(results)
      } catch (error) {
        console.error('Error searching doctors:', error)
      } finally {
        setIsLoading(false)
      }
    }, 500),
    []
  )

  useEffect(() => {
    if (searchTerm) {
      debouncedSearch(searchTerm)
    } else {
      debouncedSearch('')
    }
  }, [searchTerm, debouncedSearch])

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col gap-6">
        <div className="flex flex-col gap-2">
          <h1 className="text-3xl font-bold tracking-tight">Connect with Doctor</h1>
          <p className="text-muted-foreground">Find and connect with top healthcare professionals</p>
        </div>
        <div className="relative">
          <Search className="absolute left-2 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Search doctors by name or specialty"
            className="pl-8"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        {isLoading ? (
          <div className="text-center">Loading...</div>
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {doctors.map((doctor) => (
            <DoctorCard key={doctor._id} doctor={doctor}/>
          ))}
        </div>
        )}
      </div>
    </div>
  )
}
export default ConnectWithDoctor;