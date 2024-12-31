"use client";

import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { SignedIn, SignedOut, UserButton } from "@clerk/nextjs";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Button } from "../ui/button";
import { doctorNavLinks, patientNavLinks } from "@/constants";
import { DialogTitle } from "@radix-ui/react-dialog";
import ThemeSwitch from "./ThemeSwitch";
import { BriefcaseMedical, House, Menu, Star, UserRound,Stethoscope, MessageSquareMore } from "lucide-react";
import useGlobalStore from "@/zustand/useProps";
const iconMap = {
  "/FaHome": <House />,
  "/FaStar": <Star />,
  "/FaBriefcaseMedical": <BriefcaseMedical />,
  "/FaUser": <UserRound />,
  "/FaStethoscope": <Stethoscope />,
  "/FaChat": <MessageSquareMore />,
};
const extractFeatureFromPath = (path: string): string =>{
  let pageName = '';
  const segments = path.replace(/^\//, '').split('/');
  if(segments.length>1) pageName = segments[2].replace(/-/g, ' ');
  else if(path==='/profile') pageName = "My Profile";
  else if(path==='/chat') pageName = "Chat";
  else pageName = "Home";
  return pageName
    .split(' ')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
}

const MobileNav = () => {
  const pathname = usePathname();
  const pageTitle = extractFeatureFromPath(pathname);
  const baseRoute = "/" + pathname.split("/").slice(1, 4).join("/");
  const { role } = useGlobalStore();
  const navLinks = role === "patient" ? patientNavLinks : doctorNavLinks;
  return (
    <header className="header flex items-center z-10">
      <Link href="/" className="flex items-center gap-2">
        <Image
          src="/assets/images/logo-small.png"
          alt="logo"
          width={60}
          height={51}
        />
      </Link>
      <div className="text-2xl sm:text-3xl lg:text-4xl font-bold text-blue ml-0 sm:ml-2 leading-5 sm:leading-6">
        {pageTitle}
      </div>
      <nav className="flex items-center gap-2">
        <SignedIn>
          <UserButton afterSignOutUrl="/" />
          <ThemeSwitch />
          <Sheet>
            <SheetTrigger asChild>
              <Button title="Menu" className="p-0">
              <Menu />
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="sheet-content sm:w-64 p-4 flex flex-col justify-between">
              <div>
                <DialogTitle></DialogTitle>
                <div className="flex flex-col gap-4">
                  <Image
                    src="/assets/images/logo-large.png"
                    alt="logo"
                    width={152}
                    height={23}
                  />
                  <ul className="flex flex-col gap-2">
                    {navLinks
                      .filter(link => link.label !== "Profile")
                      .map((link) => {
                        const isActive = link.route === baseRoute;
                        return (
                          <li key={link.route} className={`bg-gray-100 ${isActive && 'bg-gray-300'} rounded-lg p-1`}>
                            <Link
                              href={link.route}
                              className={`flex items-center gap-2 p-2 text-lg font-bold ${
                                isActive ? "text-green-100" : "text-dark-700"
                              }`}
                            >
                              <span>
                                {iconMap[link.icon]}
                              </span>
                              <span>{link.label}</span>
                            </Link>
                          </li>
                        );
                      })}
                  </ul>
                </div>
              </div>
              <div className="bg-gray-400 rounded-lg p-1 mt-4">
                <Link
                  href="/profile"
                  className="flex items-center gap-2 p-2 text-lg font-bold text-dark-700"
                >
                  <span>{iconMap["/FaUser"]}</span>
                  <span>Profile</span>
                </Link>
              </div>
            </SheetContent>
          </Sheet>
        </SignedIn>

        <SignedOut>
          <Button asChild className="bg-blue">
            <Link href="/sign-in">Login</Link>
          </Button>
        </SignedOut>
      </nav>
    </header>
  );
};

export default MobileNav;
