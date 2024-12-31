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
      className={`clerk-userButtonBox ${
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
