"use client";

import { useState, useEffect } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Calendar } from "@/components/ui/calendar";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

export default function DoctorProfilePage({ doctor }: { doctor: Doctor }) {
  const [date, setDate] = useState<Date | undefined>(new Date());
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAppointments = async () => {
      try {
        const response = await fetch(
          "/api/appointments/get-doctor-appointments"
        );
        if (!response.ok) {
          throw new Error("Failed to fetch appointments");
        }
        const data = await response.json();
        setAppointments(data);
      } catch (err) {
        console.log("Error", err);
      } finally {
        setLoading(false);
      }
    };

    fetchAppointments();
  }, []);

  return (
    <div className="container py-6">
      <Card className="w-full">
        <CardHeader className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
          <Avatar className="w-24 h-24">
            <AvatarImage src={doctor.user.photo} alt={doctor.user.username} />
            <AvatarFallback>{doctor.user.username}</AvatarFallback>
          </Avatar>
          <div className="flex-1">
            <CardTitle className="text-2xl sm:text-3xl">
              {doctor.user.firstName + " " + doctor.user.lastName}
            </CardTitle>
            <CardDescription className="text-sm sm:text-base">
              {doctor.specializations.join(", ")} | {doctor.experience} years of
              experience
            </CardDescription>
            <div className="flex flex-wrap gap-2 mt-2">
              {doctor.qualifications.map((qual, index) => (
                <Badge key={index} variant="secondary">
                  {qual}
                </Badge>
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
                <Card>
                  <CardHeader>
                    <CardTitle className="text-xl">
                      Professional Details
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <dl className="space-y-2 text-sm">
                      <div>
                        <dt className="font-semibold">License Number:</dt>
                        <dd>{doctor.professionalDetails.licenseNumber}</dd>
                      </div>
                      <div>
                        <dt className="font-semibold">
                          Professional Organizations:
                        </dt>
                        <dd>{doctor.education.join(", ")}</dd>
                      </div>
                      <div>
                        <dt className="font-semibold">Publications:</dt>
                        <dd>
                          {doctor.professionalDetails.publications.join(", ")}
                        </dd>
                      </div>
                      <div>
                        <dt className="font-semibold">Awards:</dt>
                        <dd>{doctor.professionalDetails.awards.join(", ")}</dd>
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
                      {doctor.availability.map(({ day, slots }) => (
                        <div key={day}>
                          <dt className="font-semibold">{day}:</dt>
                          <dd>
                            <ul className="space-y-1">
                              {slots.map((slot) => (
                                <li
                                  key={slot._id}
                                  className="flex justify-between items-center"
                                >
                                  <span>
                                    {slot.start} - {slot.end}
                                  </span>
                                  <span
                                    className={`px-2 py-1 text-xs font-semibold rounded ${
                                      slot.status === "available"
                                        ? "bg-green-200 text-white"
                                        : slot.status === "booked"
                                        ? "bg-yellow-200 text-white"
                                        : "bg-red-200 text-white"
                                    }`}
                                  >
                                    {slot.status}
                                  </span>
                                </li>
                              ))}
                            </ul>
                          </dd>
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
                  <CardTitle className="text-xl">
                    Upcoming Appointments
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {loading ? (
                    <div>Loading...</div>
                  ) : (
                    <ScrollArea className="h-[300px]">
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>Patient</TableHead>
                            <TableHead>Doctor</TableHead>
                            <TableHead>Date</TableHead>
                            <TableHead>Time</TableHead>
                            <TableHead>Type</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {appointments.length > 0 ? (
                            appointments.map((appointment) => (
                              <TableRow key={appointment._id}>
                                <TableCell>
                                  {appointment.patient || "Unknown"}
                                </TableCell>
                                <TableCell>
                                  {appointment.doctor || "Unknown"}
                                </TableCell>
                                <TableCell>
                                  {new Date(
                                    appointment.date
                                  ).toLocaleDateString("en-US", {
                                    year: "numeric",
                                    month: "numeric",
                                    day: "numeric",
                                  })}
                                </TableCell>
                                <TableCell>
                                  {appointment.time || "N/A"}
                                </TableCell>
                                <TableCell>
                                  {appointment.type || "N/A"}
                                </TableCell>
                              </TableRow>
                            ))
                          ) : (
                            <TableRow>
                              <TableCell colSpan={5} className="text-center">
                                No upcoming appointments
                              </TableCell>
                            </TableRow>
                          )}
                        </TableBody>
                      </Table>
                    </ScrollArea>
                  )}
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
                    <p className="text-sm text-muted-foreground">
                      +5% from last month
                    </p>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader>
                    <CardTitle className="text-xl">Average Rating</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-3xl sm:text-4xl font-bold">
                      {doctor.rating || "N/A"}
                    </div>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader>
                    <CardTitle className="text-xl">
                      Appointments This Week
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-3xl sm:text-4xl font-bold">42</div>
                    <p className="text-sm text-muted-foreground">
                      +10% from last week
                    </p>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
}
