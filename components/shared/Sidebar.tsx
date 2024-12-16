"use client";
import { patientNavLinks } from "@/constants";
import { SignedIn, SignedOut, UserButton } from "@clerk/nextjs";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import React from "react";
import ThemeSwitch from "./ThemeSwitch";

import {
  BriefcaseMedical,
  House,
  Star,
  UserRound,
  Stethoscope,
  LogIn,
} from "lucide-react";

const iconMap = {
  "/FaHome": <House />,
  "/FaStar": <Star />,
  "/FaBriefcaseMedical": <BriefcaseMedical />,
  "/FaUser": <UserRound />,
  "/FaStethoscope": <Stethoscope />,
};

const Sidebar = () => {
  const pathname = usePathname();
  const baseRoute = "/" + pathname.split("/").slice(1, 4).join("/");
  return (
    <aside>
      <div className="sidebar">
        <div className="flex size-full flex-col gap-4">
          <Link href="/" className="sidebar-logo pl-5">
            <Image
              src="/assets/images/logo-large.png"
              alt="logo"
              width={180}
              height={30}
            />
          </Link>

          <nav className="sidebar-nav">
            <SignedIn>
              <ul className="sidebar-nav_elements">
                {patientNavLinks.slice(0, 6).map((link) => {
                  const isActive = link.route == baseRoute;
                  return (
                    <li
                      key={link.route}
                      className={`sidebar-nav_element group ${
                        isActive ? "bg-blue text-white" : "text-gray-700"
                      }`}
                    >
                      <Link className="sidebar-link" href={link.route}>
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
                {patientNavLinks.slice(6).map((link) => {
                  const isActive = link.route == pathname;
                  return (
                    <li
                      key={link.route}
                      className={`sidebar-nav_element group ${
                        isActive ? "bg-blue text-white" : "text-gray-700"
                      }`}
                    >
                      <Link className="sidebar-link" href={link.route}>
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
                <li className="flex-center hover:bg-gray-200 rounded-lg cursor-pointer pr-15 pt-1.5 pb-1.5 pl-2 mt-1 mb-1">
                  <UserButton
                    showName
                    appearance={{
                      elements: {
                        userButtonBox: {
                          paddingRight: "125px",
                          whiteSpace: "nowrap",
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
                <li className="pl-1.5 w-full">
                  <ThemeSwitch />
                </li>
              </ul>
            </SignedIn>
            <SignedOut>
              <li className={`sidebar-nav_element group bg-gray-300 hover:bg-blue hover:bg-opacity-90 hover:text-white text-gray-600`}>
                <Link className="sidebar-link" href={'/sign-in'}>
                  <span className={`sidebar-icon`}><LogIn /></span>
                  <span className="text-lg">Login</span>
                </Link>
              </li>
            </SignedOut>
          </nav>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
