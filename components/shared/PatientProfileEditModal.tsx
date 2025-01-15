'use client'
import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { ScrollArea } from "@/components/ui/scroll-area";
import useGlobalStore from "@/zustand/useProps";
import { ThreeDots } from "react-loader-spinner";

export function PatientProfileEditModal({
  patient,
  onUpdate
}: {
  patient: PatientDetails;
  onUpdate: (updatedPatient: PatientDetails) => void;
}) {
  const [formData, setFormData] = useState<PatientDetails>(patient);
  const [phoneError, setPhoneError] = useState<string | null>(null);
  const { role, patientId, setPatientDetails } = useGlobalStore();
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleNameChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const [firstName, lastName] = e.target.value.split(" ");

    setFormData((prev) => ({
      ...prev,
      user: {
        ...prev.user,
        firstName: firstName || prev.user.firstName, 
        lastName: lastName || prev.user.lastName,
      },
    }));
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

  const handleGenderChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setFormData((prev) => ({
      ...prev,
      gender: e.target.value as "Male" | "Female" | "Other",
    }));
  };
  const handleBloodGroupChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setFormData((prev) => ({
      ...prev,
      bloodGroup: e.target.value as
        | "A+"
        | "A-"
        | "B+"
        | "B-"
        | "AB+"
        | "AB-"
        | "O+"
        | "O-",
    }));
  };

  const handleEmergencyContactChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    if (name === "phoneNumber") {
      const phoneRegex = /^\+91[1-9]\d{9}$/;
      if (!phoneRegex.test(value)) {
        setPhoneError("Phone number must start with +91 followed by 10 digits");
      } else {
        setPhoneError(null);
      }
    }
    setFormData((prev) => ({
      ...prev,
      emergencyContact: {
        ...prev.emergencyContact,
        [name]: value,
      },
    }));
  };

  const handleAddressChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { value } = e.target;
    setFormData((prev) => ({
      ...prev,
      address: value,
    }));
  };

  const handleArrayChange = (
    e: React.ChangeEvent<HTMLTextAreaElement>,
    field: "chronicConditions" | "allergies"
  ) => {
    const values = e.target.value.split(",").map((item) => item.trim());
    setFormData((prev) => ({
      ...prev,
      [field]: values,
    }));
  };

  const handleMedicationsChange = (
    e: React.ChangeEvent<HTMLTextAreaElement>
  ) => {
    const medicationsText = e.target.value;
    const medicationsList = medicationsText.split("\n").map((med) => {
      const [name, dosage, _id] = med.split(",").map((item) => item.trim());
      return { name, dosage, _id };
    });
    setFormData((prev) => ({
      ...prev,
      medications: medicationsList,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (phoneError) {
      console.error("Please fix the phone number error before submitting");
      return;
    }
    let updatedData;
    if(role === 'admin'){
      updatedData = {
        id: patient._id,
        ...formData,
      };
    } else {
      updatedData = {
        id: patientId,
        ...formData,
      };
    }
    setLoading(true);
    try {
      const response = await fetch("/api/patients/", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(updatedData),
      });

      if (!response.ok) {
        throw new Error(
          `Failed to update patient details: ${response.statusText}`
        );
      }
      const result = await response.json();
      setOpen(false);
      setPatientDetails(result);
      setFormData(result);
      onUpdate(result);
      setLoading(false);
    } catch (error) {
      console.error("Error updating patient details:", error);
    }
  };
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline">
          {loading ? (
            <ThreeDots
            visible={true}
            height="50"
            width="50"
            color="#99a2a3"
            radius="9"
            ariaLabel="three-dots-loading"
          />
          ):(
            <span>Edit Profile</span> 
          )} 
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[625px] bg-black">
        <DialogHeader>
          <DialogTitle>Edit Your Profile</DialogTitle>
          <DialogDescription>
            Make changes to the profile here. Click save when you&apos;re done.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <ScrollArea className="h-[400px] pr-4">
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4 mr-2">
                <Label htmlFor="user" className="text-right">
                  Full Name
                </Label>
                <Input
                  id="user"
                  value={formData.user.firstName + " " + formData.user.lastName}
                  onChange={handleNameChange}
                  className="col-span-3 bg-black"
                  disabled={role === "patient" || role === "doctor"}
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4 mr-2">
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
              <div className="grid grid-cols-4 items-center gap-4 mr-2">
                <Label htmlFor="gender" className="text-right">
                  Gender
                </Label>
                <select
                  id="gender"
                  name="gender"
                  value={formData.gender}
                  onChange={handleGenderChange}
                  className="col-span-3 p-2 border rounded-md bg-black"
                >
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                  <option value="Other">Other</option>
                </select>
              </div>
              <div className="grid grid-cols-4 items-center gap-4 mr-2">
                <Label htmlFor="bloodGroup" className="text-right">
                  Blood Group
                </Label>
                <select
                  id="bloodGroup"
                  name="bloodGroup"
                  value={formData.bloodGroup}
                  onChange={handleBloodGroupChange}
                  className="col-span-3 p-2 border rounded-md bg-black"
                >
                  <option value="A+">A+</option>
                  <option value="A-">A-</option>
                  <option value="B+">B+</option>
                  <option value="B-">B-</option>
                  <option value="AB+">AB+</option>
                  <option value="AB-">AB-</option>
                  <option value="O+">O+</option>
                  <option value="O-">O-</option>
                </select>
              </div>
              <div className="grid grid-cols-4 items-center gap-4 mr-2">
                <Label htmlFor="emergencyContactName" className="text-right">
                  Emergency Contact Name
                </Label>
                <Input
                  id="emergencyContactName"
                  name="name"
                  value={formData.emergencyContact.name}
                  onChange={handleEmergencyContactChange}
                  className="col-span-3 bg-black"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4 mr-2">
                <Label
                  htmlFor="emergencyContactRelationship"
                  className="text-right"
                >
                  Emergency Contact Relationship
                </Label>
                <Input
                  id="emergencyContactRelationship"
                  name="relationship"
                  value={formData.emergencyContact.relationship}
                  onChange={handleEmergencyContactChange}
                  className="col-span-3 bg-black"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4 mr-2">
                <Label htmlFor="emergencyContactPhone" className="text-right">
                  Emergency Contact Phone
                </Label>
                <div className="col-span-3">
                  <Input
                    id="emergencyContactPhone"
                    name="phoneNumber"
                    type="tel"
                    placeholder="+91xxxxxxxxxx"
                    value={formData.emergencyContact.phoneNumber}
                    onChange={handleEmergencyContactChange}
                    className={`${phoneError} ? "border-red-500" : "" bg-black `}
                  />
                  {phoneError && (
                    <p className="text-red-500 text-sm mt-1">{phoneError}</p>
                  )}
                </div>
              </div>
              <div className="grid grid-cols-4 items-center gap-4 mr-2">
                <Label htmlFor="emergencyContactAddress" className="text-right">
                  Emergency Contact Address
                </Label>
                <Textarea
                  id="emergencyContactAddress"
                  name="address"
                  value={formData.address}
                  onChange={handleAddressChange}
                  className="col-span-3 bg-black"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4 mr-2">
                <Label htmlFor="chronicConditions" className="text-right">
                  Chronic Conditions
                </Label>
                <Textarea
                  id="chronicConditions"
                  name="chronicConditions"
                  value={formData.chronicConditions.join(", ")}
                  onChange={(e) => handleArrayChange(e, "chronicConditions")}
                  className="col-span-3 bg-black"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4 mr-2">
                <Label htmlFor="allergies" className="text-right">
                  Allergies
                </Label>
                <Textarea
                  id="allergies"
                  name="allergies"
                  value={formData.allergies.join(", ")}
                  onChange={(e) => handleArrayChange(e, "allergies")}
                  className="col-span-3 bg-black"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4 mr-2">
                {/* <Label htmlFor="medications" className="text-right">
                  Medications
                </Label> */}
                {/* <Textarea
                  id="medications"
                  name="medications"
                  value={formData.medications
                    .map((med) => `${med.name}, ${med.dosage}`)
                    .join("\n")}
                  onChange={handleMedicationsChange}
                  className="col-span-3 bg-black"
                  disabled={role === "patient" || role === "doctor"}
                /> */}
              </div>
            </div>
          </ScrollArea>
          <DialogFooter className="mt-2 md:mr-6">
            <Button type="submit" onSubmit={handleSubmit}>
            {loading ? (
            <ThreeDots
            visible={true}
            height="50"
            width="50"
            color="#99a2a3"
            radius="9"
            ariaLabel="three-dots-loading"
          />
          ):(
            <span>Save Changes</span> 
          )} 
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
