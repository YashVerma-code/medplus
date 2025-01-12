"use client";
import { useEffect } from "react";
import { useUser } from "@clerk/nextjs";
import useGlobalStore from "@/zustand/useProps";
import Image from "next/image";
import Link from "next/link";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";

const DoctorHome = () => {
  const { user, isLoaded, isSignedIn } = useUser();
  const { setDoctorId, setUserId, role, setRole } = useGlobalStore();

  useEffect(() => {
    if (isLoaded && isSignedIn && user) {
      const userRole = user.publicMetadata.role as string | undefined;
      const userId = user.publicMetadata.userId as string | undefined;

      if (userRole) {
        setRole(userRole);
        localStorage.setItem("role", userRole);
      } else {
        setRole("doctor");
        localStorage.setItem("role", "doctor");
      }
      if (userId) {
        setUserId(userId);
        localStorage.setItem("userId", userId);
      }

      if (userId && role === "doctor") {
        const storedDoctorId = localStorage.getItem("doctorId");

        if (storedDoctorId) {
          setDoctorId(storedDoctorId);
        } else {
          const fetchDoctorId = async () => {
            try {
              const response = await fetch(
                `/api/doctors/search?userId=${userId}`
              );
              if (!response.ok) throw new Error("Doctor not found");

              const data = await response.json();
              setDoctorId(data._id);
              localStorage.setItem("doctorId", data._id);
            } catch (error) {
              console.error("Error fetching doctor:", error);
            }
          };
          fetchDoctorId();
        }
      }
    }
  }, [isLoaded, isSignedIn, user, setRole, setUserId, setDoctorId, role]);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-12 overflow-y-auto px-6 py-10 lg:py-8">
      {[
        {
          title: "Doctor's\u00A0Planner",
          link:'/doctor/features/appointment-calendar',
          description:
            "Take control of your time with Doctor's Planner. Easily manage appointments, customize your availability, and set reminders to ensure your practice runs smoothly. A flexible, user-friendly tool designed to streamline your daily schedule and improve patient management.",
          image: "/assets/images/img4.png",
        },
        {
          title: "Inventory",
          link:'/doctor/features/resources',
          description:
            "Your Resource Tracker. Stay on top of critical healthcare resources with Inventory. Whether it's tracking the quantity of medicines, oxygen cylinders, or other essential supplies, this feature ensures you're always informed and prepared.",
          image: "/assets/images/img3.png",
        },
        {
          title: "Health\u00A0Chat",
          link:'/chat',
          description:
            "Connect with Your Doctor Instantly. Experience seamless communication with HealthChat, a real-time chat system designed to bridge the gap between patients and doctors. Whether it's clarifying doubts, sharing updates, or seeking quick advice, HealthChat ensures secure and direct interaction.",
          image: "/assets/images/img5.png",
        },
        {
          title: "Community\u00A0Updates",
          link:'/doctor/features/Community-update',
          description:
            "Stay Informed, Stay Ahead. Keep up with the latest breakthroughs and advancements in the medical field with Community Updates. From innovative treatments and health tips to critical news and discoveries, this feature ensures you're always in the loop.",
          image: "/assets/images/img6.png",
        },
      ].map((section, index) => (
        <div
          key={index}
          className="flex flex-col items-center bg-emerald-400/30 rounded-2xl shadow-lg p-8 lg:p-12 backdrop-filter backdrop-blur-lg h-[600px]"
        >
          {/* Title */}
          {section.title === "Inventory" ||
          section.title === "Health\u00A0Chat" ? (
            <>
              <h1 className="text-4xl lg:text-6xl font-bold text-black tracking-wider mb-4 w-72 md:w-96 text-center max-h-fit">
                {section.title}
              </h1>
            </>
          ) : (
            <ScrollArea>
              <h1 className="text-4xl lg:text-6xl font-bold text-black tracking-wider mb-4 w-72 md:w-96 text-center max-h-fit">
                {section.title}
              </h1>
              <ScrollBar orientation="horizontal" className="hidden" />
            </ScrollArea>
          )}

          <ScrollArea>
            <p className="text-sm lg:text-base text-gray-700 text-center flex-grow mb-4 max-h-[140px]">
              {section.description}
            </p>
          </ScrollArea>

          <div className="mb-4">
            <Image
              src={section.image}
              alt={section.title}
              width={250}
              height={250}
              className="mx-auto max-w-sm"
            />
          </div>

          <Link
            href={section.link}
            className="bg-black text-white font-semibold rounded-lg text-lg lg:text-2xl px-6 py-3 text-center"
          >
            Visit Now
          </Link>
        </div>
      ))}
    </div>
  );
};

export default DoctorHome;
