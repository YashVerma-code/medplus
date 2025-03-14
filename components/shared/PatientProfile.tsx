"use client";
import { jsPDF } from "jspdf";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { PatientProfileEditModal } from "@/components/shared/PatientProfileEditModal";
import { useState } from "react";

export default function PatientProfilePage({
  patientss,
}: {
  patientss: PatientDetails;
}) {
  const [patient, setPatient] = useState(patientss);
  const handleUpdate = (updatedPatient: PatientDetails) => {
    setPatient(updatedPatient);
    console.log("Patient updated:", updatedPatient);
  };

    const handleDownloadPDF = ({ patient }: { patient: PatientDetails }) => {
      const doc = new jsPDF();
  
      // Title of the document
      const latestRecord = patient.records[0];

      doc.setFont("helvetica", "bold");
      doc.setFontSize(18);
      doc.text("Patient Record", 105, 20, { align: "center" });

      // Doctor Name
      doc.setFontSize(14);
      doc.text(`Doctor: ${latestRecord.doctorName}`, 20, 40);

      // Symptoms
      doc.setFont("helvetica", "normal");
      doc.setFontSize(12);
      doc.text("Symptoms:", 20, 50);
      doc.text(latestRecord.symptoms, 20, 60);

      // Duration
      doc.text("Duration:", 20, 70);
      doc.text(latestRecord.symptomDuration, 20, 80);

      // Reason
      doc.text("Reason:", 20, 90);
      doc.text(latestRecord.reason, 20, 100);

      // Medications
      doc.text("Medications:", 20, 110);
      let yOffset = 120;
      latestRecord.medications?.forEach((medication: { name: string }) => {
        doc.text(`- ${medication.name}`, 20, yOffset);
        yOffset += 10;
      });
  
      // Save the PDF
      doc.save("patient_record.pdf");
    };
  
  
  return (
    <div className="md:container md:mx-auto md:py-6 md:px-4 lg:px-8 dark:bg-black">
      <Card className="w-full rounded-b-none bg-transparent border-none">
        <CardHeader className="flex flex-col sm:flex-row items-start sm:items-center gap-4 px-6 pb-4 pt-0 justify-between">
          <div className="flex items-center gap-4 w-ful">
            <div className="relative">
              <Avatar className="w-24 h-24">
                <AvatarImage
                  src={patient.user.photo || "/placeholder.svg"}
                  alt={patient?.user.firstName}
                />
                <AvatarFallback>{patient?.user.username}</AvatarFallback>
              </Avatar>
            </div>
            <div className="flex-1">
              <CardTitle className="text-2xl sm:text-3xl dark:text-white text-gray-800">
                {patient?.user.firstName + " " + patient?.user.lastName}
              </CardTitle>
              <CardDescription className="text-sm sm:text-base">
                <Badge className="bg-teal-400 mr-2">
                  Born:{" "}
                  {patient.dateOfBirth
                    ? new Date(patient.dateOfBirth).toISOString().split("T")[0]
                    : ""}
                </Badge>
                <Badge className="bg-teal-400 mr-2 text">
                  {patient?.gender}
                </Badge>
                <Badge className="bg-teal-400 mt-1">
                  Blood Type: {patient?.bloodGroup}
                </Badge>
              </CardDescription>
            </div>
          </div>
          <PatientProfileEditModal patient={patient} onUpdate={handleUpdate} />
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="health" className="w-full">
            <TabsList className="grid w-full grid-cols-2 sm:grid-cols-4 mb-10 h-full p-1">
              <TabsTrigger value="health" >Health Info</TabsTrigger>
              <TabsTrigger value="records">Records</TabsTrigger>
              <TabsTrigger value="payments">Payments</TabsTrigger>
            </TabsList>
            <TabsContent value="health">
              <div className="grid gap-4 md:grid-cols-2">
                <Card className="dark:bg-black">
                  <CardHeader>
                    <CardTitle className="text-xl">
                      Chronic Conditions
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ul className="list-disc pl-5 text-sm">
                      {patient.chronicConditions.map((condition, index) => (
                        <li key={index}>{condition}</li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
                <Card className="dark:bg-black">
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
                <Card className="dark:bg-black">
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
                <Card className="dark:bg-black">
                  <CardHeader>
                    <CardTitle className="text-xl">Emergency Contact</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <dl className="space-y-2 text-sm">
                      <div>
                        <dt className="font-semibold">Emergency Contact:</dt>
                        <dd>
                          {patient.emergencyContact.name} (
                          {patient.emergencyContact.relationship})
                        </dd>
                      </div>
                      <div>
                        <dt className="font-semibold">Phone:</dt>
                        <dd>{patient.emergencyContact.phoneNumber}</dd>
                      </div>
                      <div>
                        <dt className="font-semibold">Address:</dt>
                        <dd>{patient.address}</dd>
                      </div>
                    </dl>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
            {patient.records?.length > 0 ? (
              <TabsContent value="records" className="border border-l-0 border-r-0 border-gray-800 rounded-md" >
                <ScrollArea className="h-[calc(100vh-350px)]">
                  <div className="grid gap-2">
                    {patient.records.map((record, index) => (
                      <div key={index} className=" bg-white dark:bg-black rounded-md items-center border border-gray-800">
                        <CardHeader>
                          <CardTitle className="text-xl">
                            {record.doctorName}
                          </CardTitle>
                          <CardDescription>
                            {record.date
                              ? new Date(record.date)
                                  .toISOString()
                                  .split("T")[0]
                              : ""}
                          </CardDescription>
                        </CardHeader>
                        <CardContent>
                          <dl className="space-y-2 text-sm">
                            <div>
                              <dt className="font-semibold">Symptoms:</dt>
                              <dd>{record.symptoms}</dd>
                            </div>
                            <div>
                              <dt className="font-semibold">Duration:</dt>
                              <dd>{record.symptomDuration}</dd>
                            </div>
                            <div>
                              <dt className="font-semibold">Reason:</dt>
                              <dd>{record.reason}</dd>
                            </div>
                            <div>
                          <span className="font-bold">Medications:</span>
                          {record?.medications?.map((medication) => (
                            <div key={medication.id}>
                              {medication.name} 
                            </div>
                             ))}

                      </div>
                      <div>
                        <button
                          onClick={() => handleDownloadPDF({ patient })}
                          className="bg-black text-white rounded-md px-4 py-2 mt-5"
                        >
                          Download PDF
                        </button>
                      </div>
                          </dl>
                        </CardContent>                         
                      </div>
                    ))}
                  </div>
                </ScrollArea>
              </TabsContent>
            ) : ( 
              <TabsContent value="records">
                <div className="flex justify-center items-center h-[200px] sm:h-auto">
                  <p className="text-gray-600">No records information found.</p>
                </div>
              </TabsContent>
            )}
            <TabsContent value="payments">
              {patient.paymentHistory.length > 0 ? (
                <Card>
                  <CardHeader>
                    <CardTitle className="text-xl">Payment History</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ScrollArea className="h-[200px]">
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
                              <TableCell>
                                {payment.date.toISOString()}
                              </TableCell>
                              <TableCell>${payment.amount}</TableCell>
                              <TableCell>{payment.description}</TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </ScrollArea>
                  </CardContent>
                </Card>
              ) : (
                <TabsContent value="payments">
                  <div className="flex justify-center items-center h-[200px] sm:h-auto">
                    <p className="text-gray-600">No payment history found.</p>
                  </div>
                </TabsContent>
              )}
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
}
