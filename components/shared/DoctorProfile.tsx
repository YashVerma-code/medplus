'use client'

import { useState } from 'react'
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Calendar } from "@/components/ui/calendar"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"

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

export default function DoctorProfilePage() {
  const [date, setDate] = useState<Date | undefined>(new Date())
  
  const doctor = {
    name: "Dr. Jane Smith",
    image: "/placeholder.svg",
    specializations: ["Cardiology", "Internal Medicine"],
    experience: 15,
    qualifications: ["MD", "FACC"],
    languages: ["English", "Spanish"],
    location: "Central Hospital, New York",
    license: "NY12345",
    organizations: ["American Medical Association", "American College of Cardiology"],
    publications: ["Recent Advances in Cardiovascular Health", "Hypertension Management in the 21st Century"],
    awards: ["Best Cardiologist 2022", "Research Excellence Award 2020"],
    consultationModes: ["In-Person", "Telehealth", "Chat"],
    schedule: {
      Monday: "9:00 AM - 5:00 PM",
      Tuesday: "9:00 AM - 5:00 PM",
      Wednesday: "9:00 AM - 1:00 PM",
      Thursday: "9:00 AM - 5:00 PM",
      Friday: "9:00 AM - 5:00 PM",
    },
    nextAvailable: "2023-06-15T10:00:00",
    timeZone: "EST",
    fees: {
      inPerson: 200,
      telehealth: 150,
      chat: 100,
    },
    paymentMethods: ["Credit Card"],
    ratings: 4.8,
    totalReviews: 256,
  }

  return (
    <div className="container py-6">
      <Card className="w-full">
        <CardHeader className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
          <Avatar className="w-24 h-24">
            <AvatarImage src={doctor.image} alt={doctor.name} />
            <AvatarFallback>{doctor.name[0]}</AvatarFallback>
          </Avatar>
          <div className="flex-1">
            <CardTitle className="text-2xl sm:text-3xl">{doctor.name}</CardTitle>
            <CardDescription className="text-sm sm:text-base">
              {doctor.specializations.join(", ")} | {doctor.experience} years of experience
            </CardDescription>
            <div className="flex flex-wrap gap-2 mt-2">
              {doctor.qualifications.map((qual, index) => (
                <Badge key={index} variant="secondary">{qual}</Badge>
              ))}
            </div>
          </div>
          <Button className="mt-4 sm:mt-0">Edit Profile</Button>
        </CardHeader>
        <CardContent >
          <Tabs defaultValue="info" className="w-full">
            <TabsList className="grid w-full grid-cols-2 sm:grid-cols-5 mb-4">
              <TabsTrigger value="info">Info</TabsTrigger>
              <TabsTrigger value="schedule">Schedule</TabsTrigger>
              <TabsTrigger value="patients">Patients</TabsTrigger>
              <TabsTrigger value="reviews">Reviews</TabsTrigger>
              <TabsTrigger value="analytics">Analytics</TabsTrigger>
            </TabsList>
            <TabsContent value="info">
              <div className="grid gap-4 md:grid-cols-2">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-xl">Professional Details</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <dl className="space-y-2 text-sm">
                      <div>
                        <dt className="font-semibold">License Number:</dt>
                        <dd>{doctor.license}</dd>
                      </div>
                      <div>
                        <dt className="font-semibold">Professional Organizations:</dt>
                        <dd>{doctor.organizations.join(", ")}</dd>
                      </div>
                      <div>
                        <dt className="font-semibold">Publications:</dt>
                        <dd>{doctor.publications.join(", ")}</dd>
                      </div>
                      <div>
                        <dt className="font-semibold">Awards:</dt>
                        <dd>{doctor.awards.join(", ")}</dd>
                      </div>
                    </dl>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader>
                    <CardTitle className="text-xl">Consultation Details</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <dl className="space-y-2 text-sm">
                      <div>
                        <dt className="font-semibold">Consultation Modes:</dt>
                        <dd>{doctor.consultationModes.join(", ")}</dd>
                      </div>
                      <div>
                        <dt className="font-semibold">Languages:</dt>
                        <dd>{doctor.languages.join(", ")}</dd>
                      </div>
                      <div>
                        <dt className="font-semibold">Location:</dt>
                        <dd>{doctor.location}</dd>
                      </div>
                      <div>
                        <dt className="font-semibold">Time Zone:</dt>
                        <dd>{doctor.timeZone}</dd>
                      </div>
                    </dl>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader>
                    <CardTitle className="text-xl">Fees</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <dl className="space-y-2 text-sm">
                      <div>
                        <dt className="font-semibold">In-Person:</dt>
                        <dd>${doctor.fees.inPerson}</dd>
                      </div>
                      <div>
                        <dt className="font-semibold">Telehealth:</dt>
                        <dd>${doctor.fees.telehealth}</dd>
                      </div>
                      <div>
                        <dt className="font-semibold">Chat:</dt>
                        <dd>${doctor.fees.chat}</dd>
                      </div>
                      <div>
                        <dt className="font-semibold">Payment Methods:</dt>
                        <dd>{doctor.paymentMethods.join(", ")}</dd>
                      </div>
                    </dl>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
            <TabsContent value="schedule">
              <div className="grid gap-4 md:grid-cols-2">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-xl">Weekly Schedule</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <dl className="space-y-2 text-sm">
                      {Object.entries(doctor.schedule).map(([day, hours]) => (
                        <div key={day}>
                          <dt className="font-semibold">{day}:</dt>
                          <dd>{hours}</dd>
                        </div>
                      ))}
                    </dl>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader>
                    <CardTitle className="text-xl">Availability</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <Calendar
                      mode="single"
                      selected={date}
                      onSelect={setDate}
                      className="rounded-md border w-full"
                    />
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
            <TabsContent value="patients">
              <Card>
                <CardHeader>
                  <CardTitle className="text-xl">Upcoming Appointments</CardTitle>
                </CardHeader>
                <CardContent>
                  <ScrollArea className="h-[300px]">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Patient</TableHead>
                          <TableHead>Date</TableHead>
                          <TableHead>Time</TableHead>
                          <TableHead>Type</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        <TableRow>
                          <TableCell>John Doe</TableCell>
                          <TableCell>June 15, 2023</TableCell>
                          <TableCell>10:00 AM</TableCell>
                          <TableCell>In-Person</TableCell>
                        </TableRow>
                        <TableRow>
                          <TableCell>Jane Smith</TableCell>
                          <TableCell>June 15, 2023</TableCell>
                          <TableCell>11:00 AM</TableCell>
                          <TableCell>Telehealth</TableCell>
                        </TableRow>
                      </TableBody>
                    </Table>
                  </ScrollArea>
                </CardContent>
              </Card>
            </TabsContent>
            <TabsContent value="reviews">
              <Card>
                <CardHeader>
                  <CardTitle className="text-xl">Patient Reviews</CardTitle>
                  <CardDescription>
                    Overall Rating: {doctor.ratings} ({doctor.totalReviews} reviews)
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <ScrollArea className="h-[300px]">
                    {/* Mock reviews */}
                    {[...Array(5)].map((_, index) => (
                      <div key={index} className="mb-4 pb-4 border-b last:border-b-0">
                        <div className="flex items-center mb-2">
                          <span className="font-bold mr-2">Patient {index + 1}</span>
                          <span className="text-yellow-500">{'★'.repeat(5)}</span>
                        </div>
                        <p className="text-sm">
                          Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.
                        </p>
                      </div>
                    ))}
                  </ScrollArea>
                </CardContent>
              </Card>
            </TabsContent>
            <TabsContent value="analytics">
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-xl">Patients Treated</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-3xl sm:text-4xl font-bold">1,234</div>
                    <p className="text-sm text-muted-foreground">+5% from last month</p>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader>
                    <CardTitle className="text-xl">Average Rating</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-3xl sm:text-4xl font-bold">{doctor.ratings}</div>
                    <p className="text-sm text-muted-foreground">Based on {doctor.totalReviews} reviews</p>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader>
                    <CardTitle className="text-xl">Appointments This Week</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-3xl sm:text-4xl font-bold">42</div>
                    <p className="text-sm text-muted-foreground">+10% from last week</p>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  )
}

