import { Appointment } from "@/lib/database/models/appointment.model";
import React, { useEffect, useState } from "react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { useToast } from "../ui/use-toast";
import useGlobalStore from "@/zustand/useProps";
import { CircularProgressbar } from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css";
import RescheduleForm from "@/components/shared/RescheduleForm";
import { useUser } from "@clerk/nextjs";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination"

interface AppointmentListProps {
  appointments: Appointment[];
  text: string;
  toShowButtons: boolean;
}

const calculateDaysLeft = (appointmentDate: Date | string): number => {
  const dateObj =
    typeof appointmentDate === "string"
      ? new Date(appointmentDate)
      : appointmentDate;

  if (isNaN(dateObj.getTime())) {
    throw new Error("Invalid date provided.");
  }

  // Normalize the appointment date to midnight
  const appointment = new Date(
    dateObj.getFullYear(),
    dateObj.getMonth(),
    dateObj.getDate()
  );

  const currDate = new Date();
  const normalizedCurrDate = new Date(
    currDate.getFullYear(),
    currDate.getMonth(),
    currDate.getDate()
  );

  const timeDiff = appointment.getTime() - normalizedCurrDate.getTime();
  const daysDiff = timeDiff / (1000 * 60 * 60 * 24);

  return Math.ceil(daysDiff);
};

const getStrokeColor = (daysLeft: number) => {
  if (daysLeft === 0) {
    return "#097969"; // deep green color when daysLeft is 0
  } else {
    return "#2A90B8"; // Blue color when daysLeft is greater than 0
  }
};

const AppointmentList: React.FC<AppointmentListProps> = ({
  appointments,
  text,
  toShowButtons,
}) => {
  const [loadingIdsCancel, setLoadingIdsCancel] = useState<string[]>([]);
  const [loadingIdsUpdate, setLoadingIdsUpdate] = useState<string[]>([]);
  const [selectedAppointment, setSelectedAppointment] =
    useState<Appointment | null>(null);
  const [currDate, setCurrDate] = useState(new Date());
  const { role, setRole } = useGlobalStore();
  const { user, isLoaded, isSignedIn } = useUser();
  const {
    setRefereshStatus,
    refereshStatus,
    setReschedulingStatus,
    reschedulingStatus,
  } = useGlobalStore();
  const { toast } = useToast();

  const [currentPage, setCurrentPage] = useState(1);
  const AppointmentsPerPage = 2;

  useEffect(() => {
    setCurrDate(new Date());
    setCurrentPage(1);
  }, []);

  useEffect(() => {
    if (isLoaded && isSignedIn && user) {
      const userRole = user.publicMetadata.role as string | undefined;
      if (userRole) {
        setRole(userRole);
      } else {
        setRole("patient");
      }
    }
  }, [isLoaded, isSignedIn, user, setRole]);

  async function handleCancel(id: string) {
    setLoadingIdsCancel((prev) => [...prev, id]);
    try {
      const response = await fetch(
        `/api/appointments/delete-appointment/${id}`,
        {
          method: "DELETE",
        }
      );
      const data = await response.json();
      toast({
        variant: "success",
        title: "Appoinment is cancelled successfully!",
        description: data.error,
        duration: 2000,
      });
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Something went wrong!",
        description: "Try Cancelling again.",
        duration: 2000,
      });
    } finally {
      setLoadingIdsCancel((prev) =>
        prev.filter((loadingId) => loadingId !== id)
      ); // Remove appointment ID from loading list
      setRefereshStatus(!refereshStatus);
    }
  }

  const handleReschedule = (appointment: Appointment) => {
    setSelectedAppointment(appointment); // Set the selected appointment data
    setReschedulingStatus(true); // Open the Reschedule Form
  };
  const indexOfLastAppointment= currentPage * AppointmentsPerPage;
  const indexOfFirstAppointment = indexOfLastAppointment - AppointmentsPerPage;
  const currentAppointments = appointments.slice(indexOfFirstAppointment, indexOfLastAppointment);
  const totalPages = Math.ceil(appointments.length / AppointmentsPerPage);

  const paginate = (pageNumber: number) => setCurrentPage(pageNumber);

  return (
    <div className="mx-auto w-full ">
      <h2 className="text-lg font-semibold mb-4 tracking-tight">{text}</h2>
      {appointments.length === 0 ? (
        <div className="relative w-full flex justify-center">
          <Alert className="relative w-full sm:w-1/2 md:w-1/2 lg:w-1/2 bg-teal-200 bg-opacity-20 border-none">
            <AlertTitle className="text-center text-green-500">
              No {text}
            </AlertTitle>
            <AlertDescription className="text-center text-green-500">
              Schedule Your Appointment Today!
            </AlertDescription>
          </Alert>
        </div>
      ) : (
        <>
          <div
            className={`flex flex-wrap ${
              reschedulingStatus ? "w-full " : "border-none bg-transparent w-0"
            }`}
          >
            {reschedulingStatus && selectedAppointment ? (
              <RescheduleForm
                isOpen={reschedulingStatus}
                onClose={() => setReschedulingStatus(false)}
                doctor={selectedAppointment.doctor}
                doctorId={selectedAppointment.doctorId}
                patient={selectedAppointment.patient}
                date={String(selectedAppointment.date)}
                type={selectedAppointment.type}
                time={selectedAppointment.time}
                _id={selectedAppointment._id}
              />
            ) : null}
          </div>
          <ul className="space-y-5 px-0 md:px-24 lg:px-24 sm:px-24 ">
            {currentAppointments.map((appointment, index) => {
              const daysLeft = calculateDaysLeft(appointment.date);
              const progress = 100 - (100 * daysLeft) / (daysLeft + 1);
              const isCancelling = loadingIdsCancel.includes(
                appointment._id as string
              );
              const isUpdating = loadingIdsUpdate.includes(
                appointment._id as string
              );
              return (
                  <li
                    key={appointment._id}
                    className={`h-full transition ease-in hover:scale-105 rounded-3xl shadow-lg flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0 md:space-x-4 p-5 ${
                      toShowButtons
                        ? "!bg-lblue text-gray-800  dark:!bg-white dark:!text-black "
                        : "text-black !bg-mintGreen  dark:!bg-black dark:!text-white dark:border-gray-800 "
                    }`}
                  >
                    {/* Left Section */}
                    <div className="flex space-y-5 px-2 h-full p-2 flex-wrap">
                      <p className="text-lg font-semibold w-full ">
                        📅 Date :{" "}
                        <span className="font-extrabold text-xl">
                          {new Date(appointment.date)
                            .toLocaleDateString("en-Gb")
                            .split("/")
                            .join("-")}
                        </span>
                      </p>
                      {role === "doctor" && (
                        <>
                          <p className="text-sm mt-1 w-full">
                            🩺 Patient :{" "}
                            <span className="font-semibold ">
                              {appointment.patient}
                            </span>
                          </p>
                        </>
                      )}
                      {role === "patient" && (
                        <>
                          <p className="text-sm mt-1 w-full">
                            🩺 Doctor :{" "}
                            <span className="font-semibold ">
                              {appointment.doctor}
                            </span>
                          </p>
                        </>
                      )}
                      <p className="text-sm mt-1 xl:w-1/2 w-full">
                        ⏰ Time :{" "}
                        <span className="font-semibold ">
                          {appointment.time}
                        </span>
                      </p>
                      <p className="text-sm mt-1 xl:w-1/2 w-full">
                        🧪 Type :{" "}
                        <span className="font-semibold ">
                          {appointment.type}
                        </span>
                      </p>
                    </div>

                    {/* Right Section */}
                    {toShowButtons && (
                      <div className="flex flex-col items-center space-y-8">
                        <div className="flex space-x-2 w-20 h-20 ">
                          <CircularProgressbar
                            value={progress}
                            text={`${daysLeft} days`}
                            minValue={0}
                            maxValue={100}
                            strokeWidth={10}
                            className="w-full h-full font-semibold shadow-md drop-shadow-lg shadow-stone-400 rounded-full "
                            styles={{
                              path: {
                                stroke: getStrokeColor(daysLeft),
                              },
                              text: {
                                fill: "#023020",
                                fontSize: "18px",
                              },
                            }}
                          />
                        </div>
                        {/* Action Buttons */}
                        <div className="flex space-x-2">
                          <button
                            className={`py-2 px-4  ${
                              isCancelling || isUpdating
                                ? "cursor-not-allowed opacity-50"
                                : "hover:text-blue hover:border hover:bg-lblue"
                            } bg-blue text-white font-semibold shadow-md transition-colors duration-300 ease-in rounded-3xl`}
                            onClick={() => {
                              handleReschedule(appointment);
                            }}
                            disabled={isUpdating}
                          >
                            {isCancelling
                              ? "Cancelling..."
                              : isUpdating
                              ? "Updating..."
                              : "Reschedule"}
                          </button>
                          <AlertDialog>
                            <AlertDialogTrigger
                              className={`py-2 px-4 bg-red-500 ${
                                isCancelling || isUpdating
                                  ? "cursor-not-allowed opacity-50"
                                  : "hover:bg-lblue hover:text-red-500"
                              } hover:border text-white font-semibold rounded-3xl shadow-md transition-colors duration-300 ease-in`}
                              disabled={isCancelling}
                            >
                              {isCancelling
                                ? "Cancelling..."
                                : isUpdating
                                ? "Updating..."
                                : "Cancel"}
                            </AlertDialogTrigger>
                            <AlertDialogContent>
                              <AlertDialogHeader>
                                <AlertDialogTitle>
                                  Are you absolutely sure to cancel your
                                  appointment?
                                </AlertDialogTitle>
                                <AlertDialogDescription>
                                  This action cannot be undone. This will
                                  permanently delete your scheduled appointment.
                                </AlertDialogDescription>
                              </AlertDialogHeader>
                              <AlertDialogFooter>
                                <AlertDialogCancel>Cancel</AlertDialogCancel>
                                <AlertDialogAction
                                  onClick={() => handleCancel(appointment._id)}
                                >
                                  Yes, Cancel Appointment
                                </AlertDialogAction>
                              </AlertDialogFooter>
                            </AlertDialogContent>
                          </AlertDialog>
                        </div>
                      </div>
                    )}
                  </li>
              );
            })}
          </ul>
          <div className="mt-8">
            <Pagination>
              <PaginationContent>
                <PaginationItem>
                  <PaginationPrevious 
                    onClick={() => paginate(Math.max(1, currentPage - 1))}
                    className={currentPage === 1 ? 'pointer-events-none opacity-50' : ''}
                  />
                </PaginationItem>
                {[...Array(totalPages)].map((_, index) => (
                  <PaginationItem key={index}>
                    <PaginationLink 
                      onClick={() => paginate(index + 1)}
                      isActive={currentPage === index + 1}
                    >
                      {index + 1}
                    </PaginationLink>
                  </PaginationItem>
                ))}
                <PaginationItem>
                  <PaginationNext 
                    onClick={() => paginate(Math.min(totalPages, currentPage + 1))}
                    className={currentPage === totalPages ? 'pointer-events-none opacity-50' : ''}
                  />
                </PaginationItem>
              </PaginationContent>
            </Pagination>
          </div>
        </>
      )}
    </div>
  );
};

export default AppointmentList;
