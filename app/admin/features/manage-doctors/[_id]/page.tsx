'use client'

import { useEffect, useState } from 'react'
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Calendar } from "@/components/ui/calendar"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { DNA } from "react-loader-spinner"

export default function DoctorProfilePage({ params: { _id } }: {params: {_id: string}}) {
  const [doctor, setDoctor] = useState<Doctor | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [date, setDate] = useState<Date | undefined>(new Date());

  useEffect(() => {
    const fetchDoctor = async () => {
      try {
        const response = await fetch(`/api/doctors/search?id=${_id}`);
        const data = await response.json();
        console.log("Doctor Data:", data);
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
    return (
      <div className="mx-auto flex-center">
        <DNA
          visible={true}
          height="80"
          width="80"
          ariaLabel="dna-loading"
          wrapperStyle={{ filter: "hue-rotate(180deg)" }}
          wrapperClass="dna-wrapper"
        />
      </div>
    );
  }

  if (!doctor) {
    return <p className="mx-auto flex-center">Doctor not found</p>;
  }

  return (
    <div className="container mx-auto py-6 px-4 sm:px-6 lg:px-8 bg-black">
      <Card className="w-full bg-black">
        <CardHeader className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
          <Avatar className="w-24 h-24">
            <AvatarImage src={doctor.user.photo} alt={doctor.user.username} />
            <AvatarFallback>{doctor.user.username[0]}</AvatarFallback>
          </Avatar>
          <div className="flex-1">
            <CardTitle className="text-2xl sm:text-3xl">{doctor.user.firstName + " " + doctor.user.lastName}</CardTitle>
            <CardDescription className="text-sm sm:text-base">
              {doctor.specializations?.join(", ")} | {doctor.experience} years of experience
            </CardDescription>
            <div className="flex flex-wrap gap-2 mt-2">
              {doctor.qualifications.map((qual, index) => (
                <Badge key={index} variant="secondary">{qual}</Badge>
              ))}
            </div>
          </div>
          <Button className="mt-4 sm:mt-0">Edit Profile</Button>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="info" className="w-full">
            <TabsList className="grid w-full grid-cols-2 sm:grid-cols-5 mb-4">
              <TabsTrigger value="info">Info</TabsTrigger>
              <TabsTrigger value="schedule">Schedule</TabsTrigger>
              <TabsTrigger value="patients">Patients</TabsTrigger>
              <TabsTrigger value="analytics">Analytics</TabsTrigger>
            </TabsList>
            <TabsContent value="info">
              <div className="grid gap-4 md:grid-cols-2">
                <Card className='bg-black'>
                  <CardHeader>
                    <CardTitle className="text-xl">Professional Details</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <dl className="space-y-2 text-sm">
                      <div>
                        <dt className="font-semibold">License Number:</dt>
                        <dd>{doctor.professionalDetails.licenseNumber}</dd>
                      </div>
                      <div>
                        <dt className="font-semibold">Professional Organizations:</dt>
                        <dd>{doctor.professionalDetails.professionalOrganizations.join(", ")}</dd>
                      </div>
                      <div>
                        <dt className="font-semibold">Publications:</dt>
                        <dd>{doctor.professionalDetails.publications.join(", ")}</dd>
                      </div>
                      <div>
                        <dt className="font-semibold">Awards:</dt>
                        <dd>{doctor.professionalDetails.awards.join(", ")}</dd>
                      </div>
                    </dl>
                  </CardContent>
                </Card>
                <Card className='bg-black'>
                  <CardHeader>
                    <CardTitle className="text-xl">Fees</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <dl className="space-y-2 text-sm">
                      <div>
                        <dt className="font-semibold">In-Person:</dt>
                        {/* <dd>${doctor.fees.inPerson}</dd> */}
                      </div>
                      <div>
                        <dt className="font-semibold">Telehealth:</dt>
                        {/* <dd>${doctor.fees.telehealth}</dd> */}
                      </div>
                      <div>
                        <dt className="font-semibold">Chat:</dt>
                        {/* <dd>${doctor.fees.chat}</dd> */}
                      </div>
                      <div>
                        <dt className="font-semibold">Payment Methods:</dt>
                        {/* <dd>{doctor.paymentMethods.join(", ")}</dd> */}
                      </div>
                    </dl>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
            <TabsContent value="schedule">
              <div className="grid gap-4 md:grid-cols-2">
                <Card className='bg-black'>
                  <CardHeader>
                    <CardTitle className="text-xl">Weekly Schedule</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <dl className="space-y-2 text-sm">
                      {/* {Object.entries(doctor.schedule).map(([day, hours]) => (
                        <div key={day}>
                          <dt className="font-semibold">{day}:</dt>
                          <dd>{hours}</dd>
                        </div>
                      ))} */}
                    </dl>
                  </CardContent>
                </Card>
                <Card className='bg-black'>
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
              <Card className='bg-black'>
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
            <TabsContent value="analytics">
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                <Card className='bg-black'>
                  <CardHeader>
                    <CardTitle className="text-xl">Patients Treated</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-3xl sm:text-4xl font-bold">1,234</div>
                    <p className="text-sm text-muted-foreground">+5% from last month</p>
                  </CardContent>
                </Card>
                <Card className='bg-black'>
                  <CardHeader>
                    <CardTitle className="text-xl">Average Rating</CardTitle>
                  </CardHeader>
                  <CardContent>
                    {/* <div className="text-3xl sm:text-4xl font-bold">{doctor.ratings}</div> */}
                    {/* <p className="text-sm text-muted-foreground">Based on {doctor.totalReviews} reviews</p> */}
                  </CardContent>
                </Card>
                <Card className='bg-black'>
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

