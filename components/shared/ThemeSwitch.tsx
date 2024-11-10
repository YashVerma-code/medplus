'use client'

import { IoSunny,IoMoon} from "react-icons/io5";
import { useState, useEffect } from 'react'
import { useTheme } from 'next-themes'
import Image from "next/image"
import { useMediaQuery } from 'react-responsive'

export default function ThemeSwitch() {
  const [mounted, setMounted] = useState(false)
  const { setTheme, resolvedTheme } = useTheme()
  const isMobile = useMediaQuery({ query: '(max-width: 1024px)' })

  useEffect(() =>  setMounted(true), [])

  if (!mounted) return (
    <Image
      src="data:image/svg+xml;base64,PHN2ZyBzdHJva2U9IiNGRkZGRkYiIGZpbGw9IiNGRkZGRkYiIHN0cm9rZS13aWR0aD0iMCIgdmlld0JveD0iMCAwIDI0IDI0IiBoZWlnaHQ9IjIwMHB4IiB3aWR0aD0iMjAwcHgiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PHJlY3Qgd2lkdGg9IjIwIiBoZWlnaHQ9IjIwIiB4PSIyIiB5PSIyIiBmaWxsPSJub25lIiBzdHJva2Utd2lkdGg9IjIiIHJ4PSIyIj48L3JlY3Q+PC9zdmc+Cg=="
      width={80}
      height={80}
      sizes="80x80"
      alt="Loading Light/Dark Toggle"
      priority={false}
      title="Loading Light/Dark Toggle"
    />
  )

  if (resolvedTheme === 'dark') {
    return (
        <div className="rounded-lg flex gap-3 items-center pl-1 pb-1 lg:pr-32 md:pr-10 whitespace-nowrap hover:cursor-pointer hover:bg-gray-200" onClick={() => setTheme('light')} >
            <IoSunny color="#384262" style={{width:'1.5em',height:'1.5em'}} cursor='pointer'/>
            {!isMobile && (<p style={{color:'#384262'}} className="text-base font-semibold ">Light Mode</p>)}
        </div>
    )
  }

  if (resolvedTheme === 'light') {
    return (
    <div className="rounded-lg flex gap-2.5 items-center pl-2 pb-1 lg:pr-32 md:pr-10 whitespace-nowrap hover:cursor-pointer hover:bg-gray-200" onClick={() => setTheme('dark')}>
        <IoMoon color="#384262" style={{width:'1.4em',height:'1.4em',}}  cursor='pointer'/>
        {!isMobile && (<p style={{color:'#384262'}} className="text-base font-semibold ">Dark Mode</p>)}
    </div>
    )
  }
}