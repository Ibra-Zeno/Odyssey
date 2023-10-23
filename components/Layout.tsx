import { ReactNode } from "react";
import Header from "./Header";
import { Toaster } from "@/components/ui/toaster";
import Footer from "./Footer";

interface LayoutProps {
  children: ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  return (
    <div className="relative flex h-full min-h-screen w-screen flex-col items-center justify-center bg-gradient-to-br from-[#450920] via-[#723346] to-[#a53860] ">
      {/* dark (MAIN) red from-[#450920] to-[#a53860] */}
      {/* muted red from-[#564148]   to-[#4f4350] */}
      {/*orange from-[#8c2f39] to-[#b23a48] */}
      {/* Blue from-[#124559] to-[#598392] */}
      {/* Grey from-[#2f4550] to-[#586f7c] */}
      <div className="relative z-10 h-full w-full">
        <Header />
        <div className="container mx-auto min-h-screen p-4 md:p-8">
          {children}
        </div>
        <Toaster />
        <Footer />
      </div>
    </div>
  );
};

export default Layout;
