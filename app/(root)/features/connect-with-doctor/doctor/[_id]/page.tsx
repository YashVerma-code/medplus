'use client'
import { useEffect,useState } from "react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Calendar, Clock, MapPin, Phone, Star } from 'lucide-react'
import { Badge } from "@/components/ui/badge"
import Link from "next/link"

interface Doctor {
  _id: string;
  name: string;
  specialty: string;
  experience: string;
  location: string;
  rating: number;
  availability: string;
  imageUrl: string;
  phone: string;
  about: string;
  education: string[];
  specializations: string[];
}

interface DoctorDetailProps {
  params: {
    _id: string;
  };
}

const DoctorInfo = ({ params: { _id } }: DoctorDetailProps) => {
  const [doctor, setDoctor] = useState<Doctor | null>(null);
  const [isLoading, setIsLoading] = useState(true); 

  useEffect(() => {
    const fetchDoctor = async () => {
      try {
        const response = await fetch(`/api/doctors/search?id=${_id}`);
        const data = await response.json();
        console.log("Hellleoleol data",data);
        setDoctor(data);
      } catch (error) {
        console.error("Failed to fetch doctor data:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchDoctor();
  }, [_id]);

  if (isLoading) {
    return <p>Loading...</p>;
  }

  if (!doctor) {
    return <p>Doctor not found</p>;
  }


  return (
    <div className="container mx-auto px-4 py-8">
      <div className="grid gap-6 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <CardHeader className="flex flex-col sm:flex-row gap-4">
            <Avatar className="h-24 w-24">
              <AvatarImage src={doctor.imageUrl} alt={doctor.name} />
              <AvatarFallback>{doctor.name[0]}</AvatarFallback>
            </Avatar>
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <CardTitle>{doctor.name}</CardTitle>
                <Badge>{doctor.availability}</Badge>
              </div>
              <CardDescription className="flex items-center gap-1">
                <Star className="h-4 w-4 fill-primary text-primary" />
                {doctor.rating} Rating
              </CardDescription>
              <div className="flex flex-wrap gap-2">
                <Badge variant="secondary">{doctor.specialty}</Badge>
                <span className="text-sm text-muted-foreground">{doctor.experience}</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <MapPin className="h-4 w-4" />
                {doctor.location}
              </div>
            </div>
          </CardHeader>
          <CardContent className="grid gap-6">
            <div>
              <h3 className="font-semibold mb-2">About</h3>
              <p className="text-sm text-muted-foreground">{doctor.about}</p>
            </div>
            <div>
              <h3 className="font-semibold mb-2">Education</h3>
              <ul className="grid gap-2">
                {doctor.education.map((edu, index) => (
                  <li key={index} className="text-sm text-muted-foreground">
                    • {edu}
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-2">Specializations</h3>
              <div className="flex flex-wrap gap-2">
                {doctor.specializations.map((spec, index) => (
                  <Badge key={index} variant="outline">
                    {spec}
                  </Badge>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Schedule Appointment</CardTitle>
            <CardDescription>Available time slots for today</CardDescription>
          </CardHeader>
          <CardContent className="grid gap-4">
            <div className="grid gap-2">
              <div className="flex items-center gap-2 text-sm">
                <Calendar className="h-4 w-4" />
                <Clock className="h-4 w-4" />
                Next Available: Today
              </div>
              <div className="flex items-center gap-2 text-sm">
                <Phone className="h-4 w-4" />
                {doctor.phone}
              </div>
            </div>
            <div className="grid gap-2">
              <Button size="lg">
                <Phone className="mr-2 h-4 w-4" />
                Call Now
              </Button>
              <Button size="lg" variant="outline">
                Schedule for Later
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
      <div className="mt-6">
        <Link href="/features/connect-with-doctor">
          <Button variant="outline">Back to Doctors List</Button>
        </Link>
      </div>
    </div>
  )
}
export default DoctorInfo;
