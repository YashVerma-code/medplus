"use client";
import React, { useEffect, useState } from "react";
import { Appointment } from "@/lib/database/models/appointment.model";
import { useToast } from "../ui/use-toast";
import useGlobalStore from "@/zustand/useProps";
import { Label } from "@radix-ui/react-label";
import { Input } from "../ui/input";
import { CircleX } from "lucide-react";
import { ThreeDots } from "react-loader-spinner";

interface Slot {
  start: string;
  end: string;
  status: "available" | "booked" | "unavailable";
}

interface AppointmentModalProps {
  isOpen: boolean;
  onClose: () => void;
  date: string;
  doctor: string;
  doctorId: string;
  patient: string;
  type: string;
  time: string;
  _id: string;
}


const AppointmentModal: React.FC<AppointmentModalProps> = ({
  isOpen,
  onClose,
  date,
  doctor,
  doctorId,
  patient,
  type,
  time,
  _id,
}) => {
  const formattedDate = new Date(date).toISOString().split("T")[0];
  const [timeSlots, setTimeSlots] = useState<Slot[]>([]);
  const [today, setToday] = useState("");
  const [updatedType, setUpdatedType] = useState(type);
  const [updatedDate, setUpdatedDate] = useState(formattedDate);
  const [updatedTime, setUpdatedTime] = useState(time);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { role } = useGlobalStore();
  const { setRefereshStatus, refereshStatus } = useGlobalStore();
  const { toast } = useToast();
  const [isSlotUpdating, setSlotUpdating] = useState(false);

  useEffect(() => {
    const closeOnEscapeKey = (e: KeyboardEvent) =>e.key === "Escape" ?onClose() : null;
    
    document.body.addEventListener("keydown", closeOnEscapeKey);
    
    return () => {
      document.body.removeEventListener("keydown", closeOnEscapeKey);
    };
  }, [onClose]);

  useEffect(() => {
    const fetchAvailableSlots = async () => {
      if (!updatedDate) return;
  
      try {
        setSlotUpdating(true);
        const parsedDate = new Date(updatedDate);
        const dayOfWeek = parsedDate.toLocaleDateString("en-US", { weekday: "long" });
  
        const response = await fetch(
          `/api/appointments/get-available-slots?id=${doctorId}&day=${dayOfWeek}`
        );
  
        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.error || "Failed to fetch available slots.");
        }
  
        const { availableSlots } = await response.json();
        setTimeSlots(availableSlots || []);
      } catch (error: any) {
        console.log("Error fetching slots:", error);
        toast({
          variant: "destructive",
          title:  error.message || "Error in loading slots",
          description: "Failed to load available slots.",
          duration: 3000,
        });
        setTimeSlots([]);
      } finally {
        setSlotUpdating(false);
      }
    };
  
    fetchAvailableSlots();
  }, [updatedDate, doctorId]);
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    const parseDate: Date = new Date(updatedDate);

    const appointment: Appointment = {
      doctor,
      doctorId,
      date: parseDate,
      time: updatedTime,
      type: updatedType,
      _id,
    } as Appointment;

    try {
      const response = await fetch("/api/appointments/reschedule-appointment", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(appointment),
      });
      const title2=await response.json();
      // console.log("Response : ", r.error);
      if (!response.ok) {
        throw new Error(title2.error);  
      }
      toast({
        variant: "success",
        title: "Appointment Rescheduled successfully!",
        description: "Be ready for your upcoming appointments.",
        duration: 2000,
      });
      setUpdatedDate("");
      setUpdatedTime("");
      onClose();
    } catch (error:any) {
      // console.error("Error booking appointment:", error);
      toast({
        variant: "destructive",
        title: error.message,
        description: "There was a problem in reschedulling the appointment.",
        duration: 2000,
      });
    } finally {
      setIsSubmitting(false);
      setRefereshStatus(!refereshStatus);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black !bg-opacity-20">
      <div className="bg-white z-50 p-6 shadow-lg rounded-xl max-w-lg w-full mx-4">
        <div className="w-full flex flex-wrap justify-end">
          <button
            onClick={onClose}
            className="text-gray-700 transition hover:scale-150 ease-in-out hover:rotate-180 duration-300 text-xl text-background"
          >
           <CircleX />
          </button>
        </div>
        <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">
          Book an Appointment
        </h2>

        <form
          onSubmit={handleSubmit}
          className="space-y-8"
        >
          {/* Doctor Name */}
          <div className="grid grid-cols-4 items-center gap-4 mr-2">
            {role === "doctor" ? (
              <>
                <Label
                  htmlFor="patient"
                  className="block text-sm font-medium text-gray-600 mb-1"
                >
                  Patient Name
                </Label>
                <Input
                  autoComplete="off"
                  id="patient"
                  type="text"
                  value={patient}
                  disabled={true}
                  placeholder="Enter patient's name"
                  className="col-span-3 p-2 border border-gray-300 rounded-lg"
                  required
                />
              </>
            ) : (
              <>
                <Label
                  htmlFor="doctor"
                  className="block text-sm font-medium text-gray-600 mb-1"
                >
                  Doctor Name
                </Label>
                <Input
                  autoComplete="off"
                  id="doctor"
                  type="text"
                  value={doctor}
                  disabled={true}
                  placeholder="Enter doctor's name"
                  className="col-span-3 p-2 border border-gray-300 rounded-lg"
                  required
                />
              </>
            )}
          </div>

          {/* Date */}
          <div className="grid grid-cols-4 items-center gap-4 mr-2">
            <Label
              htmlFor="date"
              className="block text-sm font-medium text-gray-600 "
            >
              Date
            </Label>
            <Input
              autoComplete="off"
              id="date"
              type="date"
              value={updatedDate}
              onChange={(e) => setUpdatedDate(e.target.value)}
              placeholder={formattedDate}
              min={today}
              className="col-span-3 p-2 border border-gray-300 rounded-lg"
              required
            />
          </div>

          {/* Time */}
          <div className="grid grid-cols-4 items-center gap-4 mr-2">
            <Label
              htmlFor="time"
              className="block text-sm font-medium text-gray-600 mb-1"
            >
              Time
            </Label>
            {isSlotUpdating? (
                              <ThreeDots
                              visible={true}
                              height="40"
                              width="40"
                              color="#2fe0d8"
                            />):
            <select
            id="time"
            value={updatedTime}
            onChange={(e) => setUpdatedTime(e.target.value)}
            className="col-span-3 p-2 border border-gray-300 rounded-lg"
            required
            >
              <>
                <option value="" disabled>
                  Select a Slot
                </option>
                {timeSlots.map((slot, index) => (
                  <option key={index} value={slot.start}>
                  {slot.start} - {slot.end}
                  </option>
                ))}
                </>
              </select>
              }
               
          </div>

          {/* Type  */}
          <div className="grid grid-cols-4 items-center gap-4 mr-2">
            <Label
              htmlFor="type"
              className="block text-sm font-medium text-gray-600 mb-1"
            >
              Type of check-up
            </Label>
            <Input
              autoComplete="off"
              id="type"
              type="text"
              value={updatedType}
              onChange={(e) => setUpdatedType(e.target.value)}
              placeholder={type}
              className="col-span-3 p-2 border border-gray-300 rounded-lg"
              required
            />
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isSubmitting}
            className={`w-full py-3 rounded-lg shadow-md hover:shadow-lg transition-all bg-blue text-white ${
              isSubmitting
                ? "cursor-not-allowed opacity-50"
                : "hover:text-blue hover:bg-white"
            } hover:border duration-500 ease-in-out`}
          >
            {isSubmitting ? "Rescheduling..." : "Reschedule Appointment"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default AppointmentModal;
