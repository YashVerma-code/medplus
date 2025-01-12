'use client';
import Image from 'next/image';
import Link from 'next/link';
import { useEffect } from "react";
import { useUser } from "@clerk/nextjs";
import useGlobalStore from "@/zustand/useProps";
import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area';

const PatientHome = () => {
  const { user, isLoaded, isSignedIn } = useUser();
  const { setPatientId, setUserId, role, setRole } = useGlobalStore();

  useEffect(() => {
    if (isLoaded && isSignedIn && user) {
      const userRole = user.publicMetadata.role as string | undefined;
      const userId = user.publicMetadata.userId as string | undefined;

      if (userRole) {
        setRole(userRole);
        localStorage.setItem("role", userRole);
      } else {
        setRole("patient");
        localStorage.setItem("role", "patient");
      }
      if(userId){
        setUserId(userId);
        localStorage.setItem("userId", userId);
      } 

      if (userId && role === "patient") {
        const storedPatientId = localStorage.getItem("patientId");

        if (storedPatientId) {
          setPatientId(storedPatientId);
        } else {
          const fetchPatientId = async () => {
            try {
              const response = await fetch(`/api/patients/user/${userId}`);
              if (!response.ok) throw new Error("Patient not found");

              const data = await response.json();
              setPatientId(data._id);
              localStorage.setItem("patientId", data._id); 
            } catch (error) {
              console.error("Error fetching patient:", error);
            }
          };
          fetchPatientId();
        }
      }
    }
  }, [isLoaded, isSignedIn, user, setRole, setUserId, setPatientId, role]);
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-12 overflow-y-auto px-6 py-10 lg:py-8">
      {[
        {
          title: "Care\u00A0Finder",
          link:'/patient/features/care-finder',
          description:
            "Your Nearby Health Companion. Discover the ultimate convenience with Care Finder, a feature designed to guide you to nearby hospitals effortlessly. With real-time maps, intuitive navigation, and location-based precision, finding the closest healthcare facilities has never been easier. Whether it's for emergencies or routine checkups, Care Finder ensures you're always just a step away from care you can count on.",
          image: "/assets/images/img1.png",
        },
        {
          title: "MedInfo",
          link:'/patient/features/medinfo',
          description:
            "Your Medicine Guide. Get detailed insights about your prescriptions with MedInfo, your trusted companion for medicine information. From uses and dosages to potential side effects and precautions, MedInfo provides all the details you need to make informed decisions about your health. Empower your health with knowledge at your fingertips!",
          image: "/assets/images/img4.png",
        },
        {
          title: "Health\u00A0Calendar",
          link:'/patient/features/health-calendar',
          description:
            "Stay organized and never miss a beat with the Health Calendar. Effortlessly view all your upcoming appointments at a glance, ensuring you're always prepared for your health checkups. Need to book a new appointment? A convenient 'Book Appointment' button is right there, making scheduling as easy as a single click.",
          image: "/assets/images/img2.png",
        },
        {
          title: "Inventory",
          link:'/patient/features/resources',
          description:
            "Your Resource Tracker. Stay on top of critical healthcare resources with Inventory. Whether it's tracking the quantity of medicines, oxygen cylinders, or other essential supplies, this feature ensures you're always informed and prepared. Maintain seamless management and make timely decisions with real-time updates on availability.",
          image: "/assets/images/img3.png",
        },
        {
          title: "Health\u00A0Chat",
          link:'/chat',
          description:
            "Connect with Your Doctor Instantly. Experience seamless communication with HealthChat, a real-time chat system designed to bridge the gap between patients and doctors. Whether it's clarifying doubts, sharing updates, or seeking quick advice, HealthChat ensures secure and direct interaction, fostering better understanding and personalized care.",
          image: "/assets/images/img5.png",
        },
        {
          title: "Community\u00A0Updates",
          link:'/patient/features/Community-update',
          description:
            "Stay Informed, Stay Ahead. Keep up with the latest breakthroughs and advancements in the medical field with Community Updates. From innovative treatments and health tips to critical news and discoveries, this feature ensures you're always in the loop with what's shaping the world of healthcare.",
          image: "/assets/images/img6.png",
        },
      ].map((section, index) => (
        <div
          key={index}
          className="flex flex-col items-center bg-emerald-400/30 rounded-2xl shadow-lg p-8 lg:p-12 backdrop-filter backdrop-blur-lg h-[600px]"
        >
          {/* Title */}
          {section.title === "MedInfo" ||
          section.title === "Inventory" ||
          section.title === "Care\u00A0Finder" ||
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

export default PatientHome;
