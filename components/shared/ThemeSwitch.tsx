"use client";

import { SunMedium, Moon } from "lucide-react";
import { useEffect, useState } from "react";
import { useTheme } from "next-themes";

export default function ThemeSwitch() {
  const [mounted, setMounted] = useState(false);
  const { setTheme, resolvedTheme } = useTheme();

  useEffect(() => setMounted(true), []);

  if (!mounted)
    return (
      <div className="w-full h-6 animate-pulse bg-gray-200 rounded-md"></div>
    );

  return (
    <div
      className={`flex hover:cursor-pointer items-center justify-start hover:bg-gray-200 rounded-md cursor-pointer lg:-translate-x-1.5 lg:pl-1.5 lg:pr-20 lg:pt-1 lg:pb-1 p-1 mt-1 mb-1 w-full transition-colors duration-200 ease-in-out ${
        resolvedTheme === "dark" ? "text-gray-800" : "text-gray-700"
      }`}
      onClick={() => setTheme(resolvedTheme === "dark" ? "light" : "dark")}
    >
      {resolvedTheme === "light" ? (
        <div className="flex gap-3">
          <SunMedium className="text-blue group-hover:brightness-125 w-7 h-7 transition-transform duration-1000 ease-in-out transform scale-100" />
          <span className="-translate-x-1 text-base font-medium hidden lg:block transition-opacity duration-1000 ease-in-out opacity-100">
            Light Mode
          </span>
        </div>
      ) : (
        <div className="flex gap-3">
          <Moon className="text-blue hover:brightness-125 w-7 h-7 transition-transform duration-1000 ease-in-out transform scale-100" />
          <span className="-translate-x-1 text-base font-medium hidden lg:block transition-opacity duration-1000 ease-in-out opacity-100">
            Dark Mode
          </span>
        </div>
      )}
    </div>
  );
}
