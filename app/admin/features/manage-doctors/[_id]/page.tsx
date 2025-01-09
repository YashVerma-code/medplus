"use client";

import { useCallback, useEffect, useState } from 'react'
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Calendar } from "@/components/ui/calendar"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { DNA } from "react-loader-spinner"
import { SlotModal } from '@/components/shared/SlotModal';
import { debounce } from 'lodash';
import { DeleteSlotModal } from '@/components/shared/DeleteSlotModal';
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

async function searchAppointments(id:string) {
  const response = await fetch(`/api/appointments/get-doctor-appointments?id=${id}`);
  console.log("Searching id : ",id);
  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.error || "Failed to your appointments.");
  }
  return response.json();
}


export default function DoctorProfilePage({ params: { _id } }: {params: {_id: string}}) {
  const [doctor, setDoctor] = useState<Doctor | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [status, setStatus] = useState(true);
  const [date, setDate] = useState<Date | undefined>(new Date());
  const [isSlotUpdating, setSlotUpdating] = useState(false);
  const [timeSlots, setTimeSlots] = useState<Slot[]>([]);
  const [bookedSlots, setBookedSlots] = useState<Slot[]>([]);
  const [upcomingAppointments, setupcomingAppointments] = useState<Appointment[]>([]);

  const handleUpdate = () => {
    setStatus(!status);
  };

   const debouncedGetAppointments = debounce(async () => {
      setIsLoading(true);
      try {
        const appointmentsResult = await searchAppointments(_id);
        const now = new Date();
        const currentDate = new Date(now.getFullYear(), now.getMonth(), now.getDate());
        const upcomingAppointmentsResult = appointmentsResult.filter(
          (appointment: Appointment) => {
            const appointmentDate = new Date(
              new Date(appointment.date).getFullYear(),
              new Date(appointment.date).getMonth(),
              new Date(appointment.date).getDate()
            );
            return appointmentDate >= currentDate;
          }
        );
        setupcomingAppointments(upcomingAppointmentsResult);
      } catch (error: any) {
        console.log("Error loading upcoming Appointments or Past Events", error);
      } finally {
        setIsLoading(false);
      }
    }, 500);
  
     const getupcomingAppointments = useCallback(() => {
        debouncedGetAppointments();
      }, []);

  useEffect(() => {
    const fetchAvailableSlots = async () => {
      if (!date) {
        return;
      }

      try {
        setSlotUpdating(true);
        const parsedDate = new Date(date);
        const dayOfWeek = parsedDate.toLocaleDateString("en-US", {
          weekday: "long",
        });
        const response = await fetch(
          `/api/appointments/get-available-slots?id=${_id}&day=${dayOfWeek}`
        );
        // console.log("Response : ", r.error);
        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(
            errorData.error || "Failed to fetch available slots."
          );
        }
        const { availableSlots } = await response.json();
        setTimeSlots(availableSlots || []);
      } catch (error: any) {
        console.log("Error fetching slots:", error.error);
        setTimeSlots([]);
      } finally {
        setSlotUpdating(false);
      }
    };

    fetchAvailableSlots();
    
  }, [_id, date,status]);

  useEffect(() => {
    const fetchDoctor = async () => {
      try {
        const response = await fetch(`/api/doctors/search?id=${_id}`);
        const data = await response.json();
        // console.log("Doctor Data:", data);
        setDoctor(data);
        setBookedSlots(data.bookedSlots);
      } catch (error) {
        console.error("Failed to fetch doctor data:", error);
        setBookedSlots([])
      } finally {
        setIsLoading(false);
      }
    };

    fetchDoctor();
    getupcomingAppointments();
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
                      {isSlotUpdating ? (
                        <DNA
                          visible={true}
                          height="80"
                          width="80"
                          ariaLabel="dna-loading"
                          wrapperStyle={{ filter: "hue-rotate(180deg)" }}
                          wrapperClass="dna-wrapper"
                        />
                      ) : (
                        <>
                          <Card className="bg-black">
                            <CardHeader>
                              <CardTitle className="text-xl">
                                Availabile slots
                              </CardTitle>
                            </CardHeader>
                            <CardContent>
                              {timeSlots.length === 0 ? (
                                <div className="text-sm sm:text-base font-bold flex flex-wrap justify-between">
                                  No slots available on selected day.
                                </div>
                              ) : (
                                <>
                                  <div className="text-sm sm:text-base font-bold grid gap-3 grid-cols-1 sm:grid-cols-3 md:grid-cols-2 lg:grid-cols-3">
                                  {timeSlots
                                  .sort((a, b) => {
                                    const startA = a.start ? a.start.toString() : '';
                                    const startB = b.start ? b.start.toString() : '';
                                    return startA.localeCompare(startB); 
                                  })
                                  .map((obj, index) => (
                                    <div key={index} className="border rounded-lg bg-white text-black p-3">
                                      {obj.start} - {obj.end}
                                    </div>
                                  ))}
                                  </div>
                                </>
                              )}
                            </CardContent>
                          </Card>
                          <Card className="bg-black">
                            <CardHeader>
                              <CardTitle className="text-xl">
                               Booked slots
                              </CardTitle>
                            </CardHeader>
                            <CardContent>
                              {bookedSlots.length === 0 ||!bookedSlots.some((obj) => obj.date === date?.toLocaleDateString("en-CA")) ? (
                                <div className="text-sm sm:text-base font-bold">
                                  No booked slots on the selected day.
                                </div>
                              ) : (
                                <>
                                  <div className="text-sm sm:text-base font-bold grid grid-cols-2 sm:grid-cols-3">
                                    {bookedSlots.map((obj) => {
                                    const selectedDate = date
                                    ? date.toLocaleDateString("en-CA") // "en-CA" outputs date as "YYYY-MM-DD"
                                    : null;
                                      if(obj.date===selectedDate){
                                        return(
                                        <div className="border rounded-lg bg-white text-black px-3 py-2 flex flex-wrap w-auto text-base" key={`${obj.date}-${obj.start}-${obj.end}`}>
                                          <span className='w-full text-center'>Date: {" "}{obj.date}</span>
                                          <span className='w-full text-center'>{obj.start} - {obj.end}</span>
                                        </div>)
                                      }
                                    })}
                                  </div>
                                </>
                              )}
                            </CardContent>
                          </Card>
                        </>
                      )}
                      
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
                      disabled={(date) =>
                        date <= new Date() || date < new Date("1900-01-01")
                      }
                    />
                   <div className='grid grid-cols-2 gap-5 sm:grid-cols-3'>
                    <SlotModal docId={`${_id}`} onUpdate={handleUpdate}/>
                    <DeleteSlotModal docId={_id} onUpdate={handleUpdate}/>
                   </div>
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
                        {upcomingAppointments.map((appointment,index)=>
                        <TableRow key={index}>
                          <TableCell>{appointment.patient}</TableCell>
                          <TableCell> {new Date(appointment.date).toLocaleDateString("en-GB", {day: "2-digit",month: "2-digit",year: "numeric",}).split("/").join("-")}</TableCell>
                          <TableCell>{appointment.time}</TableCell>
                          <TableCell>{appointment.type}</TableCell>
                        </TableRow>
                        )}
                      </TableBody>
                    </Table>
                    {upcomingAppointments.length===0?
                        <div className='flex justify-center mx-auto w-1/2 mt-10'>
                          <Alert className="relative bg-opacity-20 border-none">
                            <AlertTitle className="text-center text-white">
                            No patients found !
                            </AlertTitle>
                            <AlertDescription className="text-center text-white">
                              See scheduled appointments with patients. 
                            </AlertDescription>
                          </Alert>
                        </div>:<></>}
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
                <Card className="bg-black">
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

