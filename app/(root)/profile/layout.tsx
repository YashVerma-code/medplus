"use client";
import useGlobalStore from "@/zustand/useProps";
import { UserRound } from "lucide-react";
import { useEffect, useState } from "react";

interface LayoutProps {
  children: React.ReactNode;
}

const Layout = ({ children }: LayoutProps) => {
  const {role} = useGlobalStore();
  const [isRoleLoaded, setIsRoleLoaded] = useState(false); 
  useEffect(()=>{
    if(role){
      setIsRoleLoaded(true);
    }
  },[role]);
  
  return (
    isRoleLoaded && (
      <div suppressHydrationWarning={true} className="flex flex-col min-h-screen bg-gradient-to-br from-teal-100 to-blue-200">
      <header className="hidden lg:block lg:sticky fixed top-16 sm:top-16 md:top-16 lg:top-0 z-10 w-full bg-lblue bg-opacity-20 backdrop-filter backdrop-blur-lg shadow-lg">
        <div className="container mx-auto px-4 py-2">
          <div className="flex gap-2 items-center justify-between">
            <div className="flex items-center gap-1">
              <div className="bg-lblue bg-opacity-50 rounded-lg p-2">
                <UserRound className="text-blue w-8 h-8" aria-hidden="true" />
              </div>
              <div className="flex flex-col">
                <h1 className="hidden lg:block text-2xl sm:text-3xl lg:text-3xl font-bold text-blue ml-0 sm:ml-2 leading-6 sm:leading-6">
                  My Profile
                </h1>
                <p className="hidden lg:block text-blue-700 text-sm sm:text-base ml-0 sm:ml-2">
                  {role ==="patient" ? ("View and manage your personal information, appointments, and health records")
                 :("Access your doctor's information, schedule appointments, and view patient records")}
                </p>
              </div>
            </div>
          </div>
        </div>
      </header>
      <main suppressHydrationWarning={true} className="flex-grow">{children}</main>
    </div>
  )
  );
};

export default Layout;
