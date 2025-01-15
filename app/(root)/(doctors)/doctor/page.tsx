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
    <div className="w-full min-h-screen  flex justify-center flex-wrap">
      <div className="w-3/4 h-fit grid grid-cols-1 sm:grid-cols-2 mt-24">
        <div className="flex flex-col justify-center items-center gap-16 mt-10 lg:mt-0">
          <h1 className="text-6xl font-bold text-black tracking-wider">
            Doctor&apos;s Planner
          </h1>
          <p className="text-sm text-gray-700">
            Stay organized and never miss a beat with the Health Calendar.
            Effortlessly view all your upcoming appointments at a glance,
            ensuring you&apos;re always prepared for your health checkups. Need
            to book a new appointment? A convenient &quot;Book Appointment&quot;
            button is right there, making scheduling as easy as a single click.
          </p>
          <Link
            href="/patient/features/health-calendar"
            className="bg-black text-white font-semibold rounded-lg text-3xl px-7 py-4 self-start tracking-wider text-center lg:ml-10"
          >
            Open Now
          </Link>
        </div>
        <Image
          src="/assets/images/img2.png"
          alt="Logo"
          className="img-fluid"
          id="logo"
          width={450}
          height={450}
        />
      </div>

      <div className="w-3/4 h-fit grid grid-cols-1 sm:grid-cols-2 mt-24">
        <Image
          src="/assets/images/img3.png"
          alt="Logo"
          className="img-fluid"
          id="logo"
          width={450}
          height={450}
        />
        <div className="flex flex-col justify-center items-center gap-16 mt-10 lg:mt-0">
          <h1 className="text-6xl font-bold text-black tracking-wider">
            Inventory
          </h1>
          <p className="text-sm text-gray-700">
            {" "}
            Your Resource Tracker. Stay on top of critical healthcare resources
            with Inventory. Whether it&apos;s tracking the quantity of
            medicines, oxygen cylinders, or other essential supplies, this
            feature ensures you&apos;re always informed and prepared. Maintain
            seamless management and make timely decisions with real-time updates
            on availability. Efficient resource management, anytime, anywhere!
          </p>
          <Link
            href="/patient/features/resources"
            className="bg-black text-white font-semibold rounded-lg text-3xl px-7 py-4 self-start tracking-wider text-center lg:ml-10"
          >
            Open Now
          </Link>
        </div>
      </div>

      <div className="w-3/4 h-fit grid grid-cols-1 sm:grid-cols-2 mt-24">
        <div className="flex flex-col justify-center items-center gap-16 mt-10 lg:mt-0">
          <h1 className="text-6xl font-bold text-black tracking-wider">
            HealthChat
          </h1>
          <p className="text-sm text-gray-700">
            {" "}
            Connect with Your Patients Instantly Experience seamless communication
            with HealthChat, a real-time chat system designed to bridge the gap
            between patients and doctors. Whether it&apos;s clarifying doubts,
            sharing updates, or seeking quick advice, HealthChat ensures secure
            and direct interaction, fostering better understanding and
            personalized care. Your health questions,
            answered—anytime, anywhere!
          </p>
          <Link
            href="/chat"
            className="bg-black text-white font-semibold rounded-lg text-4xl px-7 py-4 self-start tracking-wider text-center lg:ml-10"
          >
            Open Now
          </Link>
        </div>
        <Image
          src="/assets/images/img5.png"
          alt="Logo"
          className="img-fluid"
          id="logo"
          width={450}
          height={450}
        />
      </div>

      <div className="w-3/4 h-fit grid grid-cols-1 sm:grid-cols-2 mt-24">
        <Image
          src="/assets/images/img6.png"
          alt="Logo"
          className="img-fluid"
          id="logo"
          width={450}
          height={450}
        />
        <div className="flex flex-col justify-center items-center gap-16 mt-10 lg:mt-0">
          <h1 className="text-6xl font-bold text-black tracking-wider">
            Community Updates
          </h1>
          <p className="text-sm text-gray-700">
            Stay Informed, Stay Ahead. Keep up with the latest breakthroughs and
            advancements in the medical field with Community Updates. From
            innovative treatments and health tips to critical news and
            discoveries, this feature ensures you&apos;re always in the loop
            with what&apos;s shaping the world of healthcare. Knowledge that
            empowers, updates that inspire!
          </p>
          <Link
            href="/patient/features/Community-update"
            className="bg-black text-white font-semibold rounded-lg text-3xl px-7 py-4 self-start tracking-wider text-center lg:ml-10"
          >
           Open Now
          </Link>
        </div>
      </div>

      <div className="w-3/4 h-fit grid grid-cols-1 sm:grid-cols-2 mt-32 mb-10">
        <div className="flex flex-col justify-center items-center gap-16 mt-10 lg:mt-0">
          <h1 className="text-6xl font-bold text-black tracking-wider">
            Health Record
          </h1>
          <p className="text-sm text-gray-700">
            {" "}
            As a healthcare professional, having access to your patient&apos;s complete health record is essential for making informed decisions. Our Health Record offers a detailed view of your patient&apos;s past medical journey—tracking medications, treatments, and diseases they&apos;ve encountered. With this comprehensive history at your fingertips, you can provide better, more personalized care, anticipate potential health risks, and streamline the treatment process. All the information you need, in one place, to ensure the best outcomes for your patients
          </p>
          <Link
            href="/chat"
            className="bg-black text-white font-semibold rounded-lg text-4xl px-7 py-4 self-start tracking-wider text-center lg:ml-10"
          >
            Open Now
          </Link>
        </div>
        <Image
          src="/assets/images/img7.png"
          alt="Logo"
          className="img-fluid bg-none"
          id="logo"
          width={450}
          height={450}
        />
      </div>

    </div> 
  );
};

export default DoctorHome;
