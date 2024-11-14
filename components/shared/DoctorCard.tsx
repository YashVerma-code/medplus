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
import { Calendar, Clock, MapPin, Phone, Star } from "lucide-react";
import Link from "next/link";

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

const DoctorCard = ({ doctor }: { doctor: Doctor }) => {
  return (
    <>
      <Card key={doctor._id} className="overflow-hidden">
        <CardHeader className="p-0">
          <div className="aspect-video relative">
            <Avatar className="h-full w-full rounded-none">
              <AvatarImage
                src={doctor.imageUrl}
                alt={doctor.name}
                className="object-cover"
              />
              <AvatarFallback className="rounded-none">
                {doctor.name[0]}
              </AvatarFallback>
            </Avatar>
            <Badge className="absolute top-4 right-4">
              {doctor.availability}
            </Badge>
          </div>
        </CardHeader>
        <CardContent className="grid gap-2.5 p-4">
          <CardTitle>{doctor.name}</CardTitle>
          <CardDescription className="flex items-center gap-1">
            <Star className="h-4 w-4 fill-primary text-primary" />
            {doctor.rating} Rating
          </CardDescription>
          <div className="grid gap-2 text-sm">
            <div className="flex items-center gap-2">
              <Badge variant="secondary">{doctor.specialty}</Badge>
              <span className="text-muted-foreground">{doctor.experience}</span>
            </div>
            <div className="flex items-center gap-2 text-muted-foreground">
              <MapPin className="h-4 w-4" />
              {doctor.location}
            </div>
            <div className="flex items-center gap-2 text-muted-foreground">
              <Calendar className="h-4 w-4" />
              <Clock className="h-4 w-4" />
              Next Available: Today
            </div>
          </div>
        </CardContent>
        <CardFooter className="p-4 pt-0">
          <Link href={`/features/connect-with-doctor/doctor/${doctor._id}`} className="w-full">
            <Button className="w-full">View Profile</Button>
          </Link>
        </CardFooter>
      </Card>
    </>
  );
};

export default DoctorCard;
