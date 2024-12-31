'use client'
import { Button } from '@/components/ui/button'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu'
import { UserButton } from '@clerk/nextjs'
import { Bed, Menu, Stethoscope, Syringe, User } from 'lucide-react'
import Link from 'next/link'
import React, { useEffect, useState } from 'react'
import { ThreeDots } from 'react-loader-spinner'
import { redirect, usePathname } from 'next/navigation'
import { useTheme } from 'next-themes'
import useGlobalStore from '@/zustand/useProps'

const Layout = ({ children }: { children: React.ReactNode }) => {
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
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    setLoading(false);
  }, []);
  const pathname = usePathname();
  const baseRoute = "/" + pathname.split("/").slice(1, 4).join("/");
  const {setTheme} = useTheme();
  const {setRole} = useGlobalStore();
  useEffect(() => {
    setTheme("dark");
    setRole('admin');
  },[])

  return (
    <div className='min-h-screen bg-black'>
      <nav className="z-10 sticky top-0 w-full border-b border-white bg-black bg-opacity-10 backdrop-blur supports-[backdrop-filter]:bg-black/60">
        <div>
          <div className="flex h-16 items-center justify-between px-4">
            <div className="flex items-center space-x-4">
              {loading ? (
                <ThreeDots
                  visible={true}
                  height="40"
                  width="40"
                  color="#2fe0d8"
                  radius="2"
                  ariaLabel="three-dots-loading"
                />
              ) : (
                <UserButton
                  afterSignOutUrl="/"
                  appearance={{
                    elements: {
                      userButtonAvatarBox: {
                        width: "2rem",
                        height: "2rem",
                      },
                      userButtonOuterIdentifier: {
                        marginLeft: "-9px",
                      },
                    },
                  }}
                />
              )}
              <Link  href='/admin' className="text-2xl font-bold text-white cursor-pointer " >Admin</Link>
            </div>
            <div className="md:hidden">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon" className="text-white">
                    <Menu className="h-6 w-6" />
                    <span className="sr-only">Open menu</span>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent
                  align="end"
                  className="w-56 bg-black border-white/20"
                >
                  {menuItems.map((item) => (
                    <DropdownMenuItem key={item.href} asChild>
                      <Link
                        href={item.href}
                        className={`${baseRoute===item.href?'text-blue':'text-white'} hover:text-blue cursor-pointer transition-colors`}
                      >
                        {item.title}
                      </Link>
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
            <div className="hidden md:flex md:items-center md:space-x-4">
              {menuItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                    className={`text-base ${baseRoute===item.href?'text-blue':'text-white'} hover:text-blue px-3 py-2 rounded-md font-medium`}
                >
                  {item.title}
                </Link>
              ))}
            </div>
          </div>
        </div>
      </nav>
      {children}
    </div>
  )
}

export default Layout
