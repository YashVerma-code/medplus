import MobileNav from "@/components/shared/MobileNav";
import Sidebar from "@/components/shared/Sidebar";
import { Toaster } from "@/components/ui/toaster";
import Script from "next/script";
import { useEffect } from "react";

const Layout = ({ children }: { children: React.ReactNode }) => {
  return (
    <main
      suppressHydrationWarning={true}
      className="root bg-gradient-to-r from-gray-100 to-teal-200"
    >
      <Sidebar />
      <MobileNav />

      <div className="root-container">
        <div className="wrapper">{children}</div>
      </div>

      <Toaster />
      
      <Script
        src="https://cdn.botpress.cloud/webchat/v2.2/inject.js"
        strategy="afterInteractive"
      />
      <Script
        src="https://files.bpcontent.cloud/2025/01/15/05/20250115052520-FML6FQ6L.js"
        strategy="afterInteractive"
      />
    </main>
  );
};

export default Layout;
