"use client";
import React, { useCallback, useEffect, useState } from "react";
import AppointmentForm from "@/components/shared/AppointmentForm";
import AppointmentList from "@/components/shared/AppointmentList";
import useGlobalStore from "@/zustand/useProps";
import { debounce } from "lodash";
import { DNA } from "react-loader-spinner";
import { Appointment } from "@/lib/database/models/appointment.model";
import { useToast } from "@/components/ui/use-toast";
import { ToastAction } from "@/components/ui/toast";

async function searchAppointments() {
  const response = await fetch("/api/appointments/get-patients-appointments");
  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.error || "Failed to fetch your appointments.");
  }
  return response.json();
}


const AppointmentPage: React.FC = () => {
  const { toast } = useToast();
  const [upcomingAppointments, setupcomingAppointments] = useState<Appointment[]>([]);
  const [pastAppointments, setpastAppointments] = useState<Appointment[]>([]);
  const { bookingStatus, setBookingStatus, refereshStatus, setRefereshStatus } =useGlobalStore();
  const [isLoading, setIsLoading] = useState(false);

  const getupcomingAppointments = useCallback(
    debounce(async () => {
      setIsLoading(true);
      try {
        const appointmentsResult = await searchAppointments();
        const now = new Date();
        const currentDate = new Date(now.getFullYear(), now.getMonth(), now.getDate());
        
        // Filter past and upcoming appointments
        const pastAppointmentsResult = appointmentsResult.filter(
          (appointment: Appointment) => {
            const appointmentDate = new Date(
              new Date(appointment.date).getFullYear(),
              new Date(appointment.date).getMonth(),
              new Date(appointment.date).getDate()
            );
            return appointmentDate < currentDate;
            // return new Date(appointment.date) < now;
          }
        );

        const upcomingAppointmentsResult = appointmentsResult.filter(
          (appointment: Appointment) => {
            // console.log("Appointment Date: ",new Date(appointment.date),"\ncurrent date : ", now);
            const appointmentDate = new Date(
              new Date(appointment.date).getFullYear(),
              new Date(appointment.date).getMonth(),
              new Date(appointment.date).getDate()
            );
            return appointmentDate >= currentDate;
          }
        );

        setpastAppointments(pastAppointmentsResult);
        console.log("Past Appointments : ", pastAppointmentsResult);
        setupcomingAppointments(upcomingAppointmentsResult);
      } catch (error:any) {
        console.log(
          "Error loading upcoming Appointments or Past Events",
          error
        );
        toast({
          variant: "destructive",
          title: "Uh oh! Something went wrong.",
          description: error.message||"There was a problem with your request.",
          duration: 3000,
        });
      } finally {
        setIsLoading(false);
      }
    }, 500),
    [setupcomingAppointments, bookingStatus, upcomingAppointments]
  );

  useEffect(() => {
    getupcomingAppointments();
  }, [refereshStatus, setRefereshStatus]);

  return (
    <div className="container mx-auto px-4 ">
      <div className="gap-2">
        <div className="p-6 min-h-screen justify-between w-full">
          {isLoading ? (
            <div className="mx-auto flex flex-wrap justify-center">
              <DNA
                visible={true}
                height="80"
                width="80"
                ariaLabel="dna-loading"
                wrapperStyle={{ filter: "hue-rotate(180deg)" }}
                wrapperClass="dna-wrapper"
              />
            </div>
          ) : (
            <>
              <div
                className={`flex flex-wrap ${
                  bookingStatus ? "w-full" : "border-none bg-transparent w-0"
                }`}
              >
                {bookingStatus && (
                  <AppointmentForm
                    isOpen={bookingStatus}
                    onClose={() => setBookingStatus(false)}
                  />
                )}
              </div>
              <div className="relative">
                <div className="w-full lg:p-8 md:p-8 sm:p-8 lg:mt-0 md:mt-15 sm:mt-20 mt-20">
                  <AppointmentList
                    appointments={pastAppointments}
                    text={"Past Appointments"}
                    toShowButtons={false}
                  />
                </div>

                <div className="w-full lg:p-8 md:p-8 sm:p-8">
                  <AppointmentList
                    appointments={upcomingAppointments}
                    text={"Upcoming Appointments"}
                    toShowButtons={true}
                  />
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default AppointmentPage;
