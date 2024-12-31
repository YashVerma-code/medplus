'use client'
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Calendar, Clock, Phone, Star } from "lucide-react";
import Link from "next/link";
import useGlobalStore from "@/zustand/useProps";

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

const DoctorCard = ({ doctor,handleDelete }: { doctor: Doctor, handleDelete:(id:string)=>void }) => {
  const { role } = useGlobalStore();
  return (
    <Card key={doctor._id} className={`overflow-hidden ${role === 'admin' && 'bg-black'}`}>
      <CardHeader className="p-0">
        <div className="aspect-video relative">
          <Avatar className="h-52 w-full rounded-none">
            <AvatarImage
              src={doctor.user.photo}
              alt={doctor.user.username}
              className="object-cover"
            />
            <AvatarFallback className="rounded-none">
              {doctor.user.username}
            </AvatarFallback>
          </Avatar>
          <Badge className="absolute top-4 right-4">
            {doctor.availability[0]?.day}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="grid gap-2.5 p-4">
        <CardTitle>{doctor.user.firstName + " " +doctor.user.lastName}</CardTitle>
        <CardDescription className="flex items-center gap-1">
          <Star className="h-4 w-4 fill-primary text-primary" />
          {doctor.rating} Rating
        </CardDescription>
        <div className="grid gap-2 text-sm">
          <div className="flex items-center gap-2">
            <Badge variant="secondary">{doctor.specializations.join(', ')}</Badge>
            <span className="text-muted-foreground">{doctor.experience} years</span>
          </div>
          <div className="flex items-center gap-2 text-muted-foreground">
            <Phone className="h-4 w-4" />
            {doctor.phone}
          </div>
          <div className="flex items-center gap-2 text-muted-foreground">
            <Calendar className="h-4 w-4" />
            <Clock className="h-4 w-4" />
            Next Available: {doctor.availability[0]?.slots[0]?.start} - {doctor.availability[0]?.slots[0]?.end}
          </div>
        </div>
      </CardContent>
      <CardFooter className="p-4 pt-0 flex gap-3">
        <Link href={role==='admin'?`/admin/features/manage-doctors/${doctor._id}`:`/patient/features/health-connect/doctor/${doctor._id}`} className="w-full">
          <Button className="w-full">View Profile</Button>
        </Link>
        {role === 'admin' && <Button className="w-full hover:bg-red-500 bg-red-700 transition-colors" onClick={()=>handleDelete(doctor._id)}>Remove Doctor</Button>}
      </CardFooter>
    </Card>
  );
};

export default DoctorCard;