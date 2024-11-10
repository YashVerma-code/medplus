"use client";
import { navLinks } from "@/constants";
import { SignedIn, SignedOut, UserButton } from "@clerk/nextjs";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import React from "react";
import { Button } from "../ui/button";
import ThemeSwitch from "./ThemeSwitch";

const Sidebar = () => {
  const pathname = usePathname();
  return (
    <aside>
      <div className="sidebar">
        <div className="flex size-full flex-col gap-4">
          <Link href="/" className="sidebar-logo">
            <Image
              src="/assets/images/logo.png"
              alt="logo"
              width={180}
              height={28}
            />
          </Link>
          <nav className="sidebar-nav">
            <SignedIn>
              <ul className="sidebar-nav_elements">
                {navLinks.slice(0, 6).map((link) => {
                  const isActive = link.route == pathname;
                  return (
                    <li
                      key={link.route}
                      className={`sidebar-nav_element group ${
                        isActive
                          ? "bg-green-gradient text-white"
                          : "text-gray-700"
                      }`}
                    >
                      <Link className="sidebar-link" href={link.route}>
                        <Image
                          src={link.icon}
                          alt="link logo"
                          width={24}
                          height={24}
                          className={`sidebar-icon ${
                            isActive && "brightness-200"
                          }`}
                        />
                        {link.label}
                      </Link>
                    </li>
                  );
                })}
              </ul>
              <ul className="sidebar-nav_elements">
                {navLinks.slice(6).map((link) => {
                  const isActive = link.route == pathname;
                  return (
                    <li
                      key={link.route}
                      className={`sidebar-nav_element group ${
                        isActive
                          ? "bg-green-gradient text-white"
                          : "text-gray-700"
                      }`}
                    >
                      <Link className="sidebar-link" href={link.route}>
                        <Image
                          src={link.icon}
                          alt="link logo"
                          width={24}
                          height={24}
                          className={`sidebar-icon ${
                            isActive && "brightness-200"
                          }`}
                        />
                        {link.label}
                      </Link>
                    </li>
                  );
                })}
                <li className="hover:cursor-pointer hover:bg-gray-200 rounded-lg pr-15 pt-1 pb-1 flex-center cursor-pointer pl-2.5 mt-1 mb-1">
                  <UserButton
                    showName
                    appearance={{
                      elements: {
                        userButtonBox:{
                          paddingRight: '125px',
                          whiteSpace: 'nowrap'
                        },
                        userButtonAvatarBox: {
                          width: "1.4rem",
                          height: "1.4rem",
                        },
                        userButtonOuterIdentifier: {
                          marginLeft: '-9px', 
                        },
                      },
                    }}
                  />
                </li>
                <li className="pl-1 pt-1">
                  <ThemeSwitch />
                </li>
              </ul>
            </SignedIn>
            <SignedOut>
              <Button asChild className="button bg-green-gradient bg-cover">
                <Link href="/sign-in">Login</Link>
              </Button>
            </SignedOut>
          </nav>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
