import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ScrollArea } from "@/components/ui/scroll-area";
import { PlusCircle, X } from "lucide-react";
import { ThreeDots } from "react-loader-spinner";

interface MedicalRecord {
  date: Date;
  doctorName: string;
  symptoms: string;
  symptomDuration: string;
  reason: string;
}

export function CreatePatientModal({
  savedPatients,
}: {
  savedPatients: PatientDetails[];
}) {
  const [isLoading, setIsLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const [users, setUsers] = useState<CreateUserParams[]>();
  const [selectedUser, setSelectedUser] = useState<CreateUserParams>();

  const [formData, setFormData] = useState<PatientDetails>({
    address: "123 Main St, Anytown, USA 12345",
    allergies: ["Peanuts", "Penicillin"],
    appointmentHistory: [],
    bloodGroup: "A+",
    chronicConditions: ["Asthma", "Hypertension"],
    dateOfBirth: new Date(),
    emergencyContact: {
      name: "Kendra Spades",
      relationship: "Step Sister",
      phoneNumber: "+918657351224",
    },
    gender: "Male",
    immunizations: ["Flu shot", "COVID-19"],
    medications: [
      {
        name: "Aspirin",
        dosage: "81mg daily",
        _id: "67616e13f3536637b61e088d",
      },
      {
        name: "Lisinopril",
        dosage: "10mg daily",
        _id: "67616e13f3536637b61e088d",
      },
    ],
    paymentHistory: [],
    user: {
      _id: "",
      clerkId: "",
      email: "chadwhite@example.com",
      firstName: "Chad",
      lastName: "White",
      photo: "",
      role: "patient",
      username: "chad_white",
    },
    records: [] as MedicalRecord[],
    _id: "",
  });
  const [medicalRecords, setMedicalRecords] = useState<MedicalRecord[]>(
    formData.records
  );

  const addMedicalRecord = () => {
    const newRecord = {
      date: new Date(),
      doctorName: "",
      symptoms: "",
      symptomDuration: "",
      reason: "",
    };

    const updatedRecords = [...medicalRecords, newRecord];
    setMedicalRecords(updatedRecords);

    setFormData((prevData) => ({
      ...prevData,
      records: updatedRecords,
    }));
  };

  const removeMedicalRecord = (index: number) => {
    const updatedRecords = [...medicalRecords];
    updatedRecords.splice(index, 1);
    setMedicalRecords(updatedRecords);

    setFormData((prevData) => ({
      ...prevData,
      records: updatedRecords,
    }));
  };

  const updateMedicalRecord = (
    index: number,
    field: keyof MedicalRecord,
    value: any
  ) => {
    const updatedRecords = [...medicalRecords];
    updatedRecords[index] = {
      ...updatedRecords[index],
      [field]: value,
    };
    setMedicalRecords(updatedRecords);

    setFormData((prevData) => ({
      ...prevData,
      records: updatedRecords,
    }));
  };

  useEffect(() => {
    setFormData((prevData) => ({
      ...prevData,
      records: medicalRecords,
    }));
  }, [medicalRecords]);

  const fetchUsers = async () => {
    if (!selectedUser) {
      setIsLoading(true);
      try {
        const response = await fetch(`/api/users?role=patient`);
        if (!response.ok)
          throw new Error(`HTTP error! status: ${response.status}`);

        const data: CreateUserParams[] = await response.json();
        const filteredData = data.filter(
          (user) =>
            !savedPatients.some((patient) => patient.user._id == user._id)
        );

        setUsers(filteredData);
      } catch (error) {
        console.error("Error fetching users:", error);
      } finally {
        setIsLoading(false);
      }
    }
  };
  const handleUserSelect = (userId: string) => {
    const selected = users?.find((u) => u._id === userId);
    console.log("user select", userId);
    if (selected) {
      setSelectedUser(selected);

      setFormData((prevFormData) => ({
        ...prevFormData,
        user: {
          ...prevFormData.user,
          _id: selected._id,
          clerkId: selected.clerkId,
          email: selected.email,
          firstName: selected.firstName,
          lastName: selected.lastName,
          photo: selected.photo,
          role: selected.role,
          username: selected.username,
        },
      }));
    }
  };

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >,
    field: keyof PatientDetails,
    nestedField?: string
  ) => {
    const { value } = e.target;

    setFormData((prevFormData) => {
      if (
        nestedField &&
        typeof prevFormData[field] === "object" &&
        prevFormData[field] !== null
      ) {
        return {
          ...prevFormData,
          [field]: {
            ...(prevFormData[field] as Record<string, any>),
            [nestedField]: value,
          },
        };
      }

      return {
        ...prevFormData,
        [field]: value,
      };
    });
  };

  const handleDateChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value, type } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: type === "date" ? new Date(value) : value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const { _id, ...patientData } = formData;
    const userId = selectedUser?._id;
    const patientDataSend = { ...patientData, user: userId };
    console.log("Form submitted", patientDataSend);

    try {
        setIsLoading(true);
      const response = await fetch("/api/patients", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(patientData),
      });

      if (!response.ok) {
        throw new Error("Failed to create new patient");
      }

      const result = await response.json();
      console.log("Patient created successfully:", result);
      setOpen(false);
    } catch (error) {
      console.error("Error submitting form:", error);
    }finally{
        setIsLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button
          variant="outline"
          className="bg-green-400 hover:bg-green-600"
          onClick={fetchUsers}
          disabled={savedPatients.length === 0}
        >
          {isLoading ? (
            <ThreeDots
              visible={true}
              height="50"
              width="50"
              color="#99a2a3"
              radius="9"
              ariaLabel="three-dots-loading"
            />
          ) : (
            <span>+ Add New</span>
          )}
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[600px] bg-black">
        <DialogHeader>
          <DialogTitle>Create New Patient</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <ScrollArea className="h-[400px] pr-4">
            <div className="space-y-4 pb-4">
              <div className="grid gap-4 p-1">
                <div className="space-y-2 p-1">
                  <Label htmlFor="users">Select User</Label>
                  <Select onValueChange={handleUserSelect}>
                    <SelectTrigger>
                      <SelectValue
                        placeholder="Select a user"
                        defaultValue={
                          selectedUser?.firstName + " " + selectedUser?.lastName
                        }
                      />
                    </SelectTrigger>
                    <SelectContent>
                      {isLoading ? (
                        <div>loading...</div>
                      ) : (
                        users?.map((user) => (
                          <SelectItem key={user._id} value={user._id}>
                            {user.firstName} {user.lastName}
                          </SelectItem>
                        ))
                      )}
                    </SelectContent>
                  </Select>
                </div>
                {selectedUser && (
                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4 p-1">
                      <div className="space-y-2 p-1">
                        <Label htmlFor="firstName">First Name</Label>
                        <Input
                          disabled={true}
                          id="firstName"
                          value={selectedUser.firstName}
                        />
                      </div>
                      <div className="space-y-2 p-1">
                        <Label htmlFor="lastName">Last Name</Label>
                        <Input
                          disabled={true}
                          id="lastName"
                          value={selectedUser.lastName}
                        />
                      </div>
                    </div>
                    <div className="space-y-2 p-1">
                      <Label htmlFor="email">Email</Label>
                      <Input
                        disabled={true}
                        id="email"
                        type="email"
                        value={selectedUser.email}
                      />
                    </div>
                  </div>
                )}
              </div>
              <div className="space-y-2 p-1">
                <Label htmlFor="address">Address</Label>
                <Textarea
                  id="address"
                  value={formData.address}
                  onChange={(e) => handleChange(e, "address")}
                />
              </div>
              <div className="grid grid-cols-2 gap-4 p-1">
                <div className="space-y-2">
                  <Label htmlFor="dateOfBirth" className="text-right">
                    Date of Birth
                  </Label>
                  <Input
                    id="dateOfBirth"
                    name="dateOfBirth"
                    type="date"
                    value={
                      formData.dateOfBirth
                        ? new Date(formData.dateOfBirth)
                            .toISOString()
                            .split("T")[0]
                        : ""
                    }
                    onChange={handleDateChange}
                    className="col-span-3 bg-black"
                  />
                </div>
                <div className="space-y-2 p-1">
                  <Label htmlFor="gender">Gender</Label>
                  <Select
                    defaultValue={formData.gender}
                    onValueChange={(value) =>
                      setFormData((prevFormData) => ({
                        ...prevFormData,
                        gender: value,
                      }))
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Male">Male</SelectItem>
                      <SelectItem value="Female">Female</SelectItem>
                      <SelectItem value="Other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="space-y-2 p-1">
                <Label htmlFor="bloodGroup">Blood Group</Label>
                <Select
                  defaultValue={formData.bloodGroup}
                  onValueChange={(value) =>
                    setFormData((prevFormData) => ({
                      ...prevFormData,
                      bloodGroup: value,
                    }))
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="A+">A+</SelectItem>
                    <SelectItem value="A-">A-</SelectItem>
                    <SelectItem value="B+">B+</SelectItem>
                    <SelectItem value="B-">B-</SelectItem>
                    <SelectItem value="AB+">AB+</SelectItem>
                    <SelectItem value="AB-">AB-</SelectItem>
                    <SelectItem value="O+">O+</SelectItem>
                    <SelectItem value="O-">O-</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2 p-1">
                <Label htmlFor="allergies">Allergies</Label>
                <Input
                  id="allergies"
                  placeholder={formData.allergies.join(",")}
                  onChange={(e) =>
                    setFormData((prevData) => ({
                      ...prevData,
                      allergies: e.target.value
                        .split(",")
                        .map((item) => item.trim()),
                    }))
                  }
                />
              </div>
              <div className="space-y-2 p-1">
                <Label htmlFor="chronicConditions">Chronic Conditions</Label>
                <Input
                  id="chronicConditions"
                  placeholder={formData.chronicConditions.join(", ")}
                  onChange={(e) =>
                    setFormData((prevData) => ({
                      ...prevData,
                      chronicConditions: e.target.value
                        .split(",")
                        .map((item) => item.trim()),
                    }))
                  }
                />
              </div>
              <div className="space-y-2 p-1">
                <Label htmlFor="immunizations">Immunizations</Label>
                <Input
                  id="immunizations"
                  placeholder={formData.immunizations.join(", ")}
                  onChange={(e) =>
                    setFormData((prevData) => ({
                      ...prevData,
                      immunizations: e.target.value
                        .split(",")
                        .map((item) => item.trim()),
                    }))
                  }
                />
              </div>
              <div className="space-y-2 p-1">
                <Label>Emergency Contact</Label>
                <div className="grid grid-cols-2 gap-4">
                  <Input
                    placeholder={formData.emergencyContact.name}
                    onChange={(e) => {
                      handleChange(e, "emergencyContact", "name");
                    }}
                  />
                  <Input
                    placeholder={formData.emergencyContact.relationship}
                    onChange={(e) => {
                      handleChange(e, "emergencyContact", "relationship");
                    }}
                  />
                </div>
                <Input
                  placeholder={formData.emergencyContact.phoneNumber}
                  onChange={(e) => {
                    handleChange(e, "emergencyContact", "phoneNumber");
                  }}
                />
              </div>
              <div className="space-y-2 p-1">
                <Label>Medications</Label>
                {formData.medications.map((med, index) => (
                  <div key={index} className="grid grid-cols-2 gap-4">
                    <Input
                      placeholder={`Medication Name ${med.name}`}
                      value={med.name}
                      onChange={(e) => {
                        const updatedMedications = [...formData.medications];
                        updatedMedications[index] = {
                          ...updatedMedications[index],
                          name: e.target.value,
                        };
                        setFormData((prevFormData) => ({
                          ...prevFormData,
                          medications: updatedMedications,
                        }));
                      }}
                    />
                    <Input
                      placeholder={`Dosage ${med.dosage}`}
                      value={med.dosage}
                      onChange={(e) => {
                        const updatedMedications = [...formData.medications];
                        updatedMedications[index] = {
                          ...updatedMedications[index],
                          dosage: e.target.value,
                        };
                        setFormData((prevFormData) => ({
                          ...prevFormData,
                          medications: updatedMedications,
                        }));
                      }}
                    />
                  </div>
                ))}
              </div>
              <div className="space-y-2 p-1">
                <div className="flex items-center justify-between">
                  <Label>Medical Records</Label>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={addMedicalRecord}
                  >
                    <PlusCircle className="mr-2 h-4 w-4" />
                    Add Record
                  </Button>
                </div>
                {medicalRecords.map((record, index) => (
                  <div
                    key={index}
                    className="space-y-2 border p-2 rounded relative"
                  >
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="absolute top-2 right-2"
                      onClick={() => removeMedicalRecord(index)}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                    <div className="space-y-2">
                      <Label>Date</Label>
                      <Input
                        id="date"
                        name="date"
                        type="date"
                        value={
                          record.date
                            ? new Date(record.date).toISOString().split("T")[0]
                            : ""
                        }
                        onChange={(e) =>
                          updateMedicalRecord(index, "date", e.target.value)
                        }
                        className="col-span-3 bg-black"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Doctor Name</Label>
                      <Input
                        value={record.doctorName}
                        onChange={(e) =>
                          updateMedicalRecord(
                            index,
                            "doctorName",
                            e.target.value
                          )
                        }
                        placeholder="Doctor Name"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Symptoms</Label>
                      <Input
                        value={record.symptoms}
                        onChange={(e) =>
                          updateMedicalRecord(index, "symptoms", e.target.value)
                        }
                        placeholder="Symptoms"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Symptom Duration</Label>
                      <Input
                        value={record.symptomDuration}
                        onChange={(e) =>
                          updateMedicalRecord(
                            index,
                            "symptomDuration",
                            e.target.value
                          )
                        }
                        placeholder="Symptom Duration"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Reason</Label>
                      <Input
                        value={record.reason}
                        onChange={(e) =>
                          updateMedicalRecord(index, "reason", e.target.value)
                        }
                        placeholder="Reason"
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </ScrollArea>
          <DialogFooter className="mt-4">
            <Button
              type="submit"
              className="text-white bg-green-400 hover:bg-green-600"
            >
              Add Patient
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
