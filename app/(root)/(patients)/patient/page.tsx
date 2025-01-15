"use client";
import Image from "next/image";
import Link from "next/link";
import { useEffect } from "react";
import { useUser } from "@clerk/nextjs";
import useGlobalStore from "@/zustand/useProps";

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
      if (userId) {
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
    <div className="w-full min-h-screen border flex justify-center flex-wrap p-2">
      <div className="w-3/4 h-fit grid grid-cols-1 sm:grid-cols-2 mt-10 gap-3 p-2">
        <div className="flex flex-col justify-center items-start gap-16 mt-10 lg:mt-0  ">
          <h1 className="text-5xl sm:text-6xl font-bold text-black tracking-wider space-y-3 text-centerw-full">
            Care Finder
          </h1>
          <p className="text-sm text-gray-700 p-2">
            Your Nearby Health Companion Discover the ultimate convenience with
            Care Finder, a feature designed to guide you to nearby hospitals
            effortlessly. With real-time maps, intuitive navigation, and
            location-based precision, finding the closest healthcare facilities
            has never been easier. Whether its for emergencies or routine
            checkups, Care Finder ensures youre always just a step away from
            care you can count on.
          </p>
          <div className="w-full">
            <Link
              href="/patient/features/care-finder"
              className="bg-black text-white font-semibold rounded-lg text-xl sm:text-3xl px-8 py-4 self-start tracking-wider text-center lg:ml-10 hover:bg-gray-900"
            >
              Find Hospitals
            </Link>
          </div>
        </div>
        <Image
          src="/assets/images/img1.png"
          alt="Logo"
          className="img-fluid"
          id="logo"
          width={450}
          height={450}
        />
      </div>

      <div className="w-3/4 h-fit grid grid-cols-1 sm:grid-cols-2 mt-24 p-2">
        <Image
          src="/assets/images/img4.png"
          alt="Logo"
          className="img-fluid"
          id="logo"
          width={450}
          height={450}
        />

        <div className="flex flex-col justify-center items-center gap-16 mt-10 lg:mt-0">
          <h1 className="text-5xl sm:text-6xl font-bold text-black tracking-wider w-full text-center">
            MedInfo
          </h1>
          <p className="text-sm text-gray-700">
            {" "}
            Your Medicine Guide. Get detailed insights about your prescriptions
            with MedInfo, your trusted companion for medicine information. From
            uses and dosages to potential side effects and precautions, MedInfo
            provides all the details you need to make informed decisions about
            your health. Empower your health with knowledge at your fingertips!
          </p>
          <Link
            href="/patient/features/medinfo"
            className="bg-black text-white font-semibold rounded-lg  text-xl sm:text-3xl px-8 py-4 self-start tracking-wider text-center lg:ml-10 hover:bg-gray-900"
          >
            MedInfo
          </Link>
        </div>
      </div>

      <div className="w-3/4 h-fit grid grid-cols-1 sm:grid-cols-2 mt-24 p-2">
        <div className="flex flex-col justify-center items-center gap-16 mt-10 lg:mt-0">
          <h1 className="text-5xl sm:text-6xl font-bold text-black tracking-wider w-full text-center">
            Health Calendar
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
            className="bg-black text-white font-semibold rounded-lg text-xl sm:text-3xl px-7 py-4 self-start tracking-wider text-center lg:ml-10 hover:bg-gray-900"
          >
            Health Calendar
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

      <div className="w-3/4 h-fit grid grid-cols-1 sm:grid-cols-2 mt-24 p-2">
        <Image
          src="/assets/images/img3.png"
          alt="Logo"
          className="img-fluid"
          id="logo"
          width={450}
          height={450}
        />
        <div className="flex flex-col justify-center items-center gap-16 mt-10 lg:mt-0">
          <h1 className="text-5xl sm:text-6xl font-bold text-black tracking-wider w-full text-center">
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
            className="bg-black text-white font-semibold rounded-lg text-xl sm:text-3xl px-7 py-4 self-start tracking-wider text-center lg:ml-10 hover:bg-gray-900"
          >
            Inventory
          </Link>
        </div>
      </div>

      <div className="w-3/4 h-fit grid grid-cols-1 sm:grid-cols-2 mt-24 p-2">
        <div className="flex flex-col justify-center items-center gap-16 mt-10 lg:mt-0">
          <h1 className="text-4xl sm:text-6xl font-bold text-black tracking-wider w-full text-center">
            Health Chat
          </h1>
          <p className="text-sm text-gray-700">
            {" "}
            Connect with Your Doctor Instantly Experience seamless communication
            with HealthChat, a real-time chat system designed to bridge the gap
            between patients and doctors. Whether it&apos;s clarifying doubts,
            sharing updates, or seeking quick advice, HealthChat ensures secure
            and direct interaction, fostering better understanding and
            personalized care. Your health questions,
            answered—anytime, anywhere!
          </p>
          <Link
            href="/chat"
            className="bg-black text-white font-semibold rounded-lg text-xl sm:text-3xl px-7 py-4 self-start tracking-wider text-center lg:ml-10 hover:bg-gray-900"
          >
            Health Chat
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

      <div className="w-3/4 h-fit grid grid-cols-1 sm:grid-cols-2 mt-24 p-2">
        <Image
          src="/assets/images/img6.png"
          alt="Logo"
          className="img-fluid"
          id="logo"
          width={450}
          height={450}
        />
        <div className="flex flex-col justify-center items-center gap-16 mt-10 lg:mt-0">
          <h1 className="text-4xl sm:text-6xl font-bold text-black tracking-wider w-full text-center">
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
            className="bg-black text-white font-semibold rounded-lg text-xl sm:text-3xl px-7 sm:py-4 py-2 self-start tracking-wider text-center lg:ml-10 hover:bg-gray-900"
          >
            Community Updates
          </Link>
        </div>
      </div>
    </div>
  );
};

export default PatientHome;
