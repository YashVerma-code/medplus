import MobileNav from "@/components/shared/MobileNav"
import Sidebar from "@/components/shared/Sidebar"
import { Toaster } from "@/components/ui/toaster"

const Layout = ({ children }: { children: React.ReactNode }) => {
  return (
    <main suppressHydrationWarning={true} className="root bg-gradient-to-r from-gray-100 to-teal-200">
        <Sidebar/>
        <MobileNav/>
      <div className="root-container">
        <div className="wrapper">
          {children}
        </div>  
      </div>
      <Toaster/>
    </main>
  )
}

export default Layout