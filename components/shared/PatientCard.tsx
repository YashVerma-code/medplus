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
import { Calendar, Clock, Phone } from "lucide-react";
import Link from "next/link";
import useGlobalStore from "@/zustand/useProps";
import { ScrollArea, ScrollBar } from "../ui/scroll-area";

const calculateAge= (dateOfBirth:string):number=>{
    const birthDate = new Date(dateOfBirth);
    const today = new Date();
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    const dayDiff = today.getDate() - birthDate.getDate();

    if (monthDiff < 0 || (monthDiff === 0 && dayDiff < 0)) {
        age--;
    }
    return age;
}

const PatientCard = ({ patient,handleDelete }: { patient: PatientDetails, handleDelete:(id:string)=>void }) => {
  const { role } = useGlobalStore();
  const age = calculateAge(patient.dateOfBirth.toString());
  return (
    <Card key={patient._id} className={`overflow-hidden ${role === 'admin' && 'bg-black'}`}>
      <CardHeader className="p-0">
        <div className="aspect-video relative">
          <Avatar className="h-52 w-full rounded-none">
            <AvatarImage
              src={patient.user.photo}
              alt={patient.user.username}
              className="object-cover"
            />
            <AvatarFallback className="rounded-none">
              {patient.user.username}
            </AvatarFallback>
          </Avatar>
        </div>
      </CardHeader>
      <CardContent className="grid gap-2.5 p-4">
        <CardTitle>{patient.user.firstName + " " +patient.user.lastName}</CardTitle>
        <CardDescription className="flex items-center gap-1">
          <Calendar className="h-4 w-4 fill-primary text-primary" />
          {age} years
        </CardDescription>
        <div className="grid gap-2 text-sm">
          <div className="flex items-center gap-2">
            <Badge variant="secondary">Gender : {patient.gender}</Badge>
            <Badge variant="secondary">Blood Group : {patient.bloodGroup}</Badge>
          </div>
          <div className="flex items-center gap-2 text-muted-foreground">
            <Phone className="h-4 w-4" />
            {patient.emergencyContact.phoneNumber}
          </div>
          <div className="flex items-center gap-2 text-muted-foreground">
            {patient.address}
          </div>
        </div>
      </CardContent>
      <ScrollArea>
      <CardFooter className="p-4 pt-0 flex gap-3">
        <Link href={`/admin/features/manage-patients/${patient._id}`} className="w-full">
          <Button className="w-full">View Profile</Button>
        </Link>
        <Button className="w-full hover:bg-red-500 bg-red-700 transition-colors" onClick={()=>handleDelete(patient._id)}>Remove Patient</Button>
      </CardFooter>
      <ScrollBar orientation="horizontal" className="hidden"/>
      </ScrollArea>
    </Card>
  );
};

export default PatientCard;