"use client";

import { SignIn } from "@clerk/nextjs";
import Image from "next/image";

const SignInPage = () => {
  return (
    <div className="flex min-h-screen flex-col lg:flex-row">
      <div className="flex-1 bg-blue text-white flex flex-col justify-center px-8 lg:px-16 py-12 relative">
        <div className="max-w-lg mx-auto">
          <Image
            src="/assets/images/logo-large.png"
            alt="MedPlus Logo"
            width={100}
            height={100}
            className="mb-6 bg-white bg-opacity-25 p-1 rounded-lg"
          />
          <h1 className="text-4xl lg:text-5xl font-extrabold mb-4">MedPlus Sign In</h1>
          <p className="text-lg mb-6">
            Our goal is to continuously improve the quality and accessibility of
            healthcare services using digital tools.
          </p>
          <p className="text-sm opacity-80">
            MedPlus is a hospital management system designed to
            provide seamless patient care. Join us in building the future of
            healthcare.
          </p>
        </div>
      </div>
      <div className="flex-1 bg-white flex items-center justify-center px-6 py-8 lg:px-16">
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