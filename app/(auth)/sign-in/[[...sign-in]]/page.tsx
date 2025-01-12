"use client";

import { SignIn } from "@clerk/nextjs";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

const SignInPage = () => {
  const router = useRouter();
  useEffect(() => {
    const patientDetails = localStorage.getItem('patientDetails');
    const patientId = localStorage.getItem('patientId');
    const doctorDetails = localStorage.getItem('doctorDetails');
    const doctorId = localStorage.getItem('doctorId');
    const userId = localStorage.getItem('userId');
    const role = localStorage.getItem('role');
    if(patientDetails) localStorage.removeItem('patientDetails');
    if(patientId) localStorage.removeItem('patientId');
    if(doctorDetails) localStorage.removeItem('doctorDetails');
    if(doctorId) localStorage.removeItem('doctorId');
    if(userId) localStorage.removeItem('userId');
    if(role) localStorage.removeItem('role');
  }, []);
  return (
    <div className="flex min-h-screen flex-col lg:flex-row">
      <div className="sm:flex hidden flex-1 bg-blue text-white flex-col justify-center px-8 lg:px-16 py-12 relative">
        <div className="max-w-lg mx-auto">
          <Image
            src="/assets/images/logo-large.png"
            alt="MedPlus Logo"
            width={100}
            height={100}
            className="mb-6 bg-white bg-opacity-25 p-1 rounded-lg cursor-pointer"
            onClick={() => router.push('/')}
          />
          <h1 className="text-4xl lg:text-5xl font-extrabold mb-4 lg:block hidden">
            MedPlus Sign In
          </h1>
          <p className="text-lg mb-6 sm:block hidden">
            Our goal is to continuously improve the quality and accessibility of
            healthcare services using digital tools.
          </p>
          <p className="text-sm opacity-80 sm:block hidden">
            MedPlus is a hospital management system designed to provide seamless
            patient care. Join us in building the future of healthcare.
          </p>
        </div>
      </div>
      <div className="flex-1 bg-inherit flex items-center justify-center px-6 py-8 lg:px-16">
        <div className="flex-col">
          <SignIn
            appearance={{
              variables: {
                colorPrimary: "#2a90b8",
              },
              elements: {
                formButtonPrimary: "bg-blue",
                formFieldInput: "border-gray-300 focus:ring-blue",
                headerTitle: "text-blue",
              },
            }}
            fallbackRedirectUrl={"/"}
            forceRedirectUrl={"/"}
          />
        </div>
      </div>
    </div>
  );
};

export default SignInPage;
