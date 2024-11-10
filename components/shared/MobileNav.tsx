"use client";

import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { SignedIn, SignedOut, UserButton } from "@clerk/nextjs";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Button } from "../ui/button";
import { navLinks } from "@/constants";
import { DialogTitle } from "@radix-ui/react-dialog";
import ThemeSwitch from "./ThemeSwitch";

const MobileNav = () => {
  const pathname = usePathname();

  return (
    <header className="header flex items-center justify-between p-4">
      <Link href="/" className="flex items-center gap-2">
        <Image
          src="/assets/images/logo.png"
          alt="logo"
          width={180}
          height={28}
        />
      </Link>
      <nav className="flex items-center gap-4">
        <SignedIn>
          <UserButton />
            <ThemeSwitch/>
          <Sheet>
            <SheetTrigger asChild>
              <button>
                <Image
                  src="/assets/icons/menu.svg"
                  alt="menu"
                  width={32}
                  height={32}
                  className="cursor-pointer"
                />
              </button>
            </SheetTrigger>
            <SheetContent side="right" className="sheet-content sm:w-64 p-4">
              <DialogTitle></DialogTitle>
              <div className="flex flex-col gap-4">
                <Image
                  src="/assets/images/logo.png"
                  alt='logo'
                  width={152}
                  height={23}
                />
                <ul className="flex flex-col gap-2">
                  {navLinks.map((link) => {
                    const isActive = link.route === pathname;
                    return (
                      <li key={link.route}>
                        <Link
                          href={link.route}
                          className={`flex items-center gap-2 p-2 ${
                            isActive ? "gradient-text" : "text-dark-700"
                          } hover:text-green-700 transition`}
                        >
                          <Image
                            src={link.icon}
                            alt={link.label}
                            width={24}
                            height={24}
                          />
                          {link.label}
                        </Link>
                      </li>
                    );
                  })}
                </ul>
              </div>
            </SheetContent>
          </Sheet>
        </SignedIn>

        <SignedOut>
          <Button asChild className="bg-green-gradient">
            <Link href="/sign-in">Login</Link>
          </Button>
        </SignedOut>
      </nav>
    </header>
  );
};

export default MobileNav;
