'use client'

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { ScrollArea } from "@/components/ui/scroll-area"

export default function PatientProfilePage() {

  const patient = {
    name: "Alice Johnson",
    image: "/placeholder.svg",
    dateOfBirth: "1990-05-15",
    gender: "Female",
    bloodGroup: "A+",
    emergencyContact: "Bob Johnson (Husband) - +1 234 567 8901",
    chronicConditions: ["Type 2 Diabetes", "Hypertension"],
    allergies: ["Penicillin", "Peanuts"],
    medications: ["Metformin 500mg twice daily", "Lisinopril 10mg once daily"],
    immunizations: ["Flu shot (2022)", "COVID-19 vaccine (2021)"],
    familyHistory: ["Father: Heart Disease", "Mother: Breast Cancer"],
    upcomingAppointments: [
      { date: "2023-06-20", time: "10:00 AM", doctor: "Dr. Smith", type: "Follow-up" },
      { date: "2023-07-05", time: "2:00 PM", doctor: "Dr. Johnson", type: "Annual Check-up" },
    ],
    appointmentHistory: [
      { date: "2023-05-10", doctor: "Dr. Brown", notes: "Blood pressure stable. Continue current medication." },
      { date: "2023-04-15", doctor: "Dr. Davis", notes: "Adjusted insulin dosage. Schedule follow-up in 1 month." },
    ],
    insuranceProvider: "HealthCare Plus",
    policyNumber: "HCP123456789",
    coverageDetails: "Full coverage for primary care, 80% for specialists",
    expiryDate: "2023-12-31",
    paymentHistory: [
      { date: "2023-05-10", amount: 50, description: "Co-pay for Dr. Brown visit" },
      { date: "2023-04-15", amount: 100, description: "Co-pay for Dr. Davis visit" },
    ],
  }

  return (
    // collapse the container to height-width full screen for mobile devices also in doctor's page
    <div className="container mx-auto py-6 sm:px-6 lg:px-8">
      <Card className="w-full">
        <CardHeader className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
          <Avatar className="w-24 h-24">
            <AvatarImage src={patient.image} alt={patient.name} />
            <AvatarFallback>{patient.name[0]}</AvatarFallback>
          </Avatar>
          <div className="flex-1">
            <CardTitle className="text-2xl sm:text-3xl">{patient.name}</CardTitle>
            <CardDescription className="text-sm sm:text-base">
              Born: {patient.dateOfBirth} | {patient.gender} | Blood Type: {patient.bloodGroup}
            </CardDescription>
          </div>
          <Button className="mt-4 sm:mt-0">Edit Profile</Button>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="health" className="w-full">
            <TabsList className="grid w-full grid-cols-2 sm:grid-cols-5 mb-4">
              <TabsTrigger value="health">Health Info</TabsTrigger>
              <TabsTrigger value="appointments">Appointments</TabsTrigger>
              <TabsTrigger value="records">Medical Records</TabsTrigger>
              <TabsTrigger value="insurance">Insurance</TabsTrigger>
              <TabsTrigger value="payments">Payments</TabsTrigger>
            </TabsList>
            <TabsContent value="health">
              <div className="grid gap-4 md:grid-cols-2">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-xl">Chronic Conditions</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ul className="list-disc pl-5 text-sm">
                      {patient.chronicConditions.map((condition, index) => (
                        <li key={index}>{condition}</li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader>
                    <CardTitle className="text-xl">Allergies</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ul className="list-disc pl-5 text-sm">
                      {patient.allergies.map((allergy, index) => (
                        <li key={index}>{allergy}</li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader>
                    <CardTitle className="text-xl">Current Medications</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ul className="list-disc pl-5 text-sm">
                      {patient.medications.map((medication, index) => (
                        <li key={index}>{medication}</li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader>
                    <CardTitle className="text-xl">Immunizations</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ul className="list-disc pl-5 text-sm">
                      {patient.immunizations.map((immunization, index) => (
                        <li key={index}>{immunization}</li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader>
                    <CardTitle className="text-xl">Family Medical History</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ul className="list-disc pl-5 text-sm">
                      {patient.familyHistory.map((history, index) => (
                        <li key={index}>{history}</li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader>
                    <CardTitle className="text-xl">Emergency Contact</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm">{patient.emergencyContact}</p>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
            <TabsContent value="appointments">
              <div className="grid gap-4">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-xl">Upcoming Appointments</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ScrollArea className="h-[200px] sm:h-auto">
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>Date</TableHead>
                            <TableHead>Time</TableHead>
                            <TableHead>Doctor</TableHead>
                            <TableHead>Type</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {patient.upcomingAppointments.map((appointment, index) => (
                            <TableRow key={index}>
                              <TableCell>{appointment.date}</TableCell>
                              <TableCell>{appointment.time}</TableCell>
                              <TableCell>{appointment.doctor}</TableCell>
                              <TableCell>{appointment.type}</TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </ScrollArea>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader>
                    <CardTitle className="text-xl">Appointment History</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ScrollArea className="h-[200px] sm:h-auto">
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>Date</TableHead>
                            <TableHead>Doctor</TableHead>
                            <TableHead>Notes</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {patient.appointmentHistory.map((appointment, index) => (
                            <TableRow key={index}>
                              <TableCell>{appointment.date}</TableCell>
                              <TableCell>{appointment.doctor}</TableCell>
                              <TableCell>{appointment.notes}</TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </ScrollArea>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
            <TabsContent value="records">
              <Card>
                <CardHeader>
                  <CardTitle className="text-xl">Medical Records</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground mb-4 text-sm">Your medical records will be displayed here. You can upload new records or download existing ones.</p>
                  <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-4">
                    <Button>Upload New Record</Button>
                    <Button variant="outline">Download Records</Button>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            <TabsContent value="insurance">
              <Card>
                <CardHeader>
                  <CardTitle className="text-xl">Insurance Information</CardTitle>
                </CardHeader>
                <CardContent>
                  <dl className="space-y-2 text-sm">
                    <div>
                      <dt className="font-semibold">Provider:</dt>
                      <dd>{patient.insuranceProvider}</dd>
                    </div>
                    <div>
                      <dt className="font-semibold">Policy Number:</dt>
                      <dd>{patient.policyNumber}</dd>
                    </div>
                    <div>
                      <dt className="font-semibold">Coverage Details:</dt>
                      <dd>{patient.coverageDetails}</dd>
                    </div>
                    <div>
                      <dt className="font-semibold">Expiry Date:</dt>
                      <dd>{patient.expiryDate}</dd>
                    </div>
                  </dl>
                </CardContent>
              </Card>
            </TabsContent>
            <TabsContent value="payments">
              <Card>
                <CardHeader>
                  <CardTitle className="text-xl">Payment History</CardTitle>
                </CardHeader>
                <CardContent>
                  <ScrollArea className="h-[200px] sm:h-auto">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Date</TableHead>
                          <TableHead>Amount</TableHead>
                          <TableHead>Description</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {patient.paymentHistory.map((payment, index) => (
                          <TableRow key={index}>
                            <TableCell>{payment.date}</TableCell>
                            <TableCell>${payment.amount}</TableCell>
                            <TableCell>{payment.description}</TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </ScrollArea>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  )
}

