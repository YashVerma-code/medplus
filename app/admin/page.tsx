"use client";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Bed, Stethoscope, Syringe, User } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";
import CountUp from 'react-countup';

export default function AdminDashboard() {
  const menuItems = [
    {
      title: "Manage Doctors",
      icon:<Stethoscope />,
      href: "/admin/features/manage-doctors",
    },
    {
      title: "Manage Resources",
      icon:<Syringe />,
      href: "/admin/features/manage-resources",
    },
    {
      title: "Manage Beds",
      icon:<Bed />,
      href: "/admin/features/manage-beds",
    },
    {
      title: "Manage Patients",
      icon:<User />,
      href: "/admin/features/manage-patients",
    },
  ];
  return (
    <div className="bg-black">
      <div className="px-4 pt-[1.75rem] pb-[1.85rem] overflow-y-auto">
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-2">
          {menuItems.map((item) => (
            <Card
              key={item.href}
              className="bg-black border-white/20 hover:border-white/50 transition-colors"
            >
              <CardHeader>
                <CardTitle className="text-2xl text-white flex items-center gap-2.5">
                  <span className="text-sm text-gray-400 rounded-md bg-zinc-900 p-2">
                    {item.icon}
                  </span>
                  <span>{item.title}</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="flex flex-col space-y-4">
                <p className="text-white">
                  {item.title === "Manage Doctors" &&
                    "Manage doctor profiles, schedules, and many more"}
                  {item.title === "Manage Resources" &&
                    "Track medical equipment, supplies, and facility resources"}
                  {item.title === "Manage Beds" &&
                    "Monitor bed availability, and department allocation"}
                  {item.title === "Manage Patients" &&
                    "Access patient records, medical history, and profile"}
                </p>
                <Button
                  asChild
                  variant="outline"
                  className="w-full border-white bg-white text-black hover:bg-white/70 transition-colors"
                >
                  <Link href={item.href} className="hover:text-black">Access Now</Link>
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
        <div className="mt-7 grid gap-6 md:grid-cols-4 grid-cols-2">
          <Card className="bg-black border-white/20">
            <CardHeader>
              <CardTitle className="text-white">Total Doctors</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold text-white">
                <CountUp start={0} end={24} duration={2.75} />
              </p>
            </CardContent>
          </Card>
          <Card className="bg-black border-white/20">
            <CardHeader>
              <CardTitle className="text-white">Patients Treated</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold text-white">
                <CountUp start={0} end={128} duration={2.75} />
              </p>
            </CardContent>
          </Card>
          <Card className="bg-black border-white/20">
            <CardHeader>
              <CardTitle className="text-white">Available Beds</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold text-white">
                <CountUp start={0} end={45} duration={2.75} />
              </p>
            </CardContent>
          </Card>
          <Card className="bg-black border-white/20">
            <CardHeader>
              <CardTitle className="text-white">Available Resources</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold text-white">
                <CountUp start={0} end={89} duration={2.75} />
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
