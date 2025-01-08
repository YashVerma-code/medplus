"use client";
import React, { useEffect, useState } from "react";
import { useToast } from "../ui/use-toast";
import useGlobalStore from "@/zustand/useProps";
import { useUser } from "@clerk/nextjs";
import { Label } from "@radix-ui/react-label";
import { Input } from "../ui/input";
import { CircleX } from "lucide-react";
import { ThreeDots } from "react-loader-spinner";

interface AppointmentModalProps {
  isOpen: boolean;
  onClose: () => void;
}

interface Slot {
  start: string;
  end: string;
  status: "available" | "booked" | "unavailable";
}

interface Availability {
  day: string;
  slots: Slot[];
}
interface BookedSlots {
  date: string;
  start: string;
  end: string;
  day: string;
  status: string;
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
  role: "admin" | "doctor" | "patient";
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
  bookedSlots: BookedSlots[],
  phone: string;
  professionalDetails: ProfessionalDetails;
}

const AppointmentModal: React.FC<AppointmentModalProps> = ({
  isOpen,
  onClose,
}) => {
  const { user } = useUser();
  const [timeSlots, setTimeSlots] = useState<Slot[]>([]);
  const [allDoctors, setAllDoctors] = useState<Doctor[]>([]);
  const [today, setToday] = useState("");
  const [doctorId, setDoctorId] = useState("");
  const [type, setType] = useState("");
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSlotUpdating, setSlotUpdating] = useState(false);
  const { setRefereshStatus, refereshStatus } = useGlobalStore();
  const { toast } = useToast();

  const clerkId = user?.id || "";
  const patientName = `${user?.firstName || ""} ${user?.lastName || ""}`.trim();

  useEffect(() => {
    const closeOnEscapeKey = (e: KeyboardEvent) =>
      e.key === "Escape" && onClose();

    document.body.addEventListener("keydown", closeOnEscapeKey);
    return () => {
      document.body.removeEventListener("keydown", closeOnEscapeKey);
    };
  }, [onClose]);

  useEffect(() => {
    const fetchDoctors = async () => {
      try {
        const response = await fetch("/api/doctors/search?q=");
        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.error || "Failed to fetch available slots.");
        }
        const doctors = await response.json();
        setAllDoctors(doctors);
      } catch (error:any) {
        console.log(error);
        toast({
          variant: "destructive",
          title: "Error",
          description:error.message || "Failed to load doctors. Please try again.",
          duration: 2000,
        });
      }
    };
    const currentDate = new Date().toISOString().split("T")[0];
    setToday(currentDate);
    fetchDoctors();
  }, []);

  useEffect(() => {
    const fetchAvailableSlots = async () => {
      if (!doctorId || !date) {
        return;
      }

      try {
        setSlotUpdating(true);
        const parsedDate = new Date(date);
        const dayOfWeek = parsedDate.toLocaleDateString("en-US", {
          weekday: "long",
        });
        const response = await fetch(
          `/api/appointments/get-available-slots?id=${doctorId}&day=${dayOfWeek}`
        );
        // console.log("Response : ", r.error);
        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.error || "Failed to fetch available slots.");
        }
        const { availableSlots } = await response.json();
        setTimeSlots(availableSlots || []);
      } catch (error: any) {
        console.log("Error fetching slots:", error.error);
        toast({
          variant: "destructive",
          title: error.message || "Error in loading slots",
          description: "Failed to load available slots. Please try again.",
          duration: 3000,
        });
        setTimeSlots([]);
      } finally {
        setSlotUpdating(false);
      }
    };

    fetchAvailableSlots();
  }, [doctorId, date]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    const appointmentPayload = {
      clerkId,
      patientName,
      appointment: {
        doctorId,
        date: new Date(date),
        time,
        type,
      },
    };

    try {
      const response = await fetch("/api/appointments/add-appointment", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(appointmentPayload),
      });
      const title2 = await response.json();
      // console.log("Response : ", r.error);
      if (!response.ok) {
        throw new Error(title2.error);
      }

      toast({
        variant: "success",
        title: "Appointment scheduled successfully!",
        description: "Be ready for your upcoming appointments.",
        duration: 3000,
      });

      setDoctorId("");
      setDate("");
      setTime("");
      onClose();
    } catch (error: any) {
      console.error("Error booking appointment:", error);
      toast({
        variant: "destructive",
        title: error.messgae,
        description: "There was a problem booking the appointment.",
        duration: 3000,
      });
    } finally {
      setIsSubmitting(false);
      setRefereshStatus(!refereshStatus);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 dark:text-white">
      <div className="bg-white p-6 shadow-lg rounded-xl max-w-lg w-full mx-4">
        <div className="w-full flex flex-wrap justify-end">
          <button
            onClick={onClose}
            className="text-gray-700 transition hover:scale-125 ease-in-out hover:rotate-180 duration-300 text-xl text-background"
          >
           <CircleX />
          </button>
        </div>
        <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">
          Book an Appointment
        </h2>

        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Doctor Name */}
          <div className="grid grid-cols-4 items-center gap-4 mr-2">
            <Label
              htmlFor="doctor"
              className="block text-sm font-medium text-gray-600"
            >
              Doctor Name :
            </Label>
            <select
              id="doctor"
              value={doctorId}
              onChange={(e) => setDoctorId(e.target.value)}
              className="col-span-3 w-full p-2 border border-gray-300 rounded-lg"
              required
            >
              <option value="" disabled>
                Select a doctor
              </option>
              {allDoctors.map((doc) => (
                <option key={doc._id} value={doc._id}>
                  {doc.user.firstName}
                  {doc.user.lastName}
                </option>
              ))}
            </select>
          </div>

          {/* Date and Time */}
         
          <div className="grid grid-cols-4 items-center gap-4 mr-2">
              <Label
                htmlFor="date"
                className="block text-sm font-medium text-gray-600"
              >
                Date :
              </Label>
              <Input
                id="date"
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                min={today}
                className="col-span-3 p-2 border border-gray-300 rounded-lg"
                required
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4 mr-2">
              <Label
                htmlFor="time"
                className="block text-sm font-medium text-gray-600"
              >
                Time :
              </Label>
              {isSlotUpdating? (
                  <ThreeDots
                  visible={true}
                  height="40"
                  width="40"
                  color="#2fe0d8"
                />
              ):(

                <select
                id="time"
                value={time}
                onChange={(e) => setTime(e.target.value)}
                className="col-span-3 w-full p-2 border border-gray-300 rounded-lg"
                required
                >
                {(doctorId && date)?<>
                  <option value="" disabled>
                      Select a Slot
                    </option>
                    {timeSlots.map((slot, index) => (
                      <option key={index} value={slot.start}>
                        {slot.start} - {slot.end}
                      </option>
                    ))}</>:<>
                  {" "}
                    <option value="" disabled>
                      Select the doctor and date 
                    </option>
                </>}
              </select>
            )
              }
          </div>

          {/* Type */}
          <div className="grid grid-cols-4 items-center gap-4 mr-2">
            <Label
              htmlFor="type"
              className="block text-sm font-medium text-gray-600"
            >
              Type of Check-up :
            </Label>
            <Input
              id="type"
              type="text"
              value={type}
              onChange={(e) => setType(e.target.value)}
              placeholder="Type of Check Up"
              className="col-span-3 w-full p-2 border border-gray-300 rounded-lg"
              autoComplete="off"
              required
            />
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isSubmitting}
            className={`w-full py-3 rounded-lg shadow-md transition-all bg-blue text-white ${
              isSubmitting
                ? "cursor-not-allowed opacity-50"
                : "hover:bg-white hover:text-blue hover:border"
            }`}
          >
            {isSubmitting ? "Submitting..." : "Book Appointment"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default AppointmentModal;
