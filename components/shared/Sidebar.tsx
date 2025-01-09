
"use client";
import { doctorNavLinks, nullNavLinks, patientNavLinks } from "@/constants";
import { SignedIn, SignedOut, UserButton, useUser } from "@clerk/nextjs";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import React, { useEffect, useState } from "react";
import ThemeSwitch from "./ThemeSwitch";

import {
  BriefcaseMedical,
  House,
  Star,
  UserRound,
  Stethoscope,
  LogIn,
  MessageSquareMore,
  HousePlus,
  CalendarPlus2,
  PlusIcon,
  Pill,
  Newspaper,
  MessageSquarePlus,
  Bed,
  
} from "lucide-react";
import useGlobalStore from "@/zustand/useProps";

const iconMap = {
  "/FaHome": <House />,
  "/FaStar": <Star />,
  "/FaBriefcaseMedical": <BriefcaseMedical />,
  "/FaUser": <UserRound />,
  "/FaStethoscope": <Stethoscope />,
  "/FaChat": <MessageSquareMore />,
  "/FaHousePlus": <HousePlus />,
  "/FaCalendarPlus2": <CalendarPlus2 />,
  "/FaPlus": <PlusIcon />,
  "/FaPill": <Pill />,
  "/FaNewspaper": <Newspaper />,
  "/FaMessage": <MessageSquarePlus />,
  "/FaBed": <Bed />,
};

const Sidebar = () => {
  const pathname = usePathname();
  const baseRoute = "/" + pathname.split("/").slice(1, 4).join("/");
  const { role } = useGlobalStore();
  const [isRoleLoaded, setIsRoleLoaded] = useState(false);
  const { isSignedIn } = useUser();

  useEffect(() => {
    if (role) {
      setIsRoleLoaded(true);
    }
  }, [role]);

  const reloadPage = (route: string) => {
    if (route === "/chat") {
      window.location.href = route;
    }
  };

  if (!isRoleLoaded && isSignedIn) {
    return null;
  }
  const navLinks = role === "patient" ? patientNavLinks : doctorNavLinks;

  return (
    <>
      {isRoleLoaded && isSignedIn && (
        <aside className="overflow-auto">
          <div className="sidebar">
            <div className="flex size-full flex-col gap-4">
              <Link href="/" className="sidebar-logo pl-5 w-full h-auto">
            <Image
              src="/assets/images/logo-large.png"
              alt="logo"
              width={150}
             height={150}
              className="object-cover aspect-square"
            />
          </Link>
              <nav className="sidebar-nav">
              <SignedIn>
            <ul className="sidebar-nav_elements h-[300px] overflow-auto">
              {navLinks.slice(0, navLinks.length - 1).map((link) => {
                const isActive = link.route == baseRoute;
                return (
                  <li
                    key={link.route}
                    className={`sidebar-nav_element group ${
                      isActive ? "bg-blue text-white" : "text-gray-700"
                    }`}
                  >
                    <Link
                      className="sidebar-link"
                      href={link.route}
                      onClick={() => reloadPage(link.route)}
                    >
                      <span
                        className={`sidebar-icon ${
                          isActive && "brightness-200"
                        }`}
                      >
                        {iconMap[link.icon]}
                      </span>
                      <span>{link.label}</span>
                    </Link>
                  </li>
                );
              })}
            </ul>
            <ul className="sidebar-nav_elements">
              {navLinks.slice(navLinks.length - 1).map((link) => {
                const isActive = link.route == pathname;
                return (
                  <li
                    key={link.route}
                    className={`sidebar-nav_element group ${
                      isActive ? "bg-blue text-white" : "text-gray-700"
                    }`}
                  >
                    <Link
                      className="sidebar-link"
                      href={link.route}
                      onClick={() => reloadPage(link.route)}
                    >
                      <span
                        className={`sidebar-icon ${
                          isActive && "brightness-200"
                        }`}
                      >
                        {iconMap[link.icon]}
                      </span>
                      <span>{link.label}</span>
                    </Link>
                  </li>
                );
              })}
              <li className="flex hover:bg-gray-200 rounded-lg cursor-pointer w-full p-2 mt-1 mb-1">
                <UserButton
                  afterSignOutUrl="/"
                  showName
                  appearance={{
                    elements: {
                      userButtonBox: {
                        whiteSpace: "nowrap",
                        width: "18em",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "start",
                      },
                      userButtonAvatarBox: {
                        width: "1.4rem",
                        height: "1.4rem",
                      },
                      userButtonOuterIdentifier: {
                        marginLeft: "-9px",
                      },
                    },
                  }}
                />
              </li>
              <li className="pl-1 p-1.5 mt-1 mb-1 w-full hover:bg-gray-200 rounded-lg cursor-pointer">
                <ThemeSwitch />
              </li>
            </ul>
          </SignedIn>
              </nav>
            </div>
          </div>
        </aside>
      )}
    </>
  );
};

export default Sidebar;