import { ReactNode } from "react";
import Header from "./Header";
import Hero from "./Hero";
import { useRouter } from "next/router";

interface LayoutProps {
  children: ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const router = useRouter();
  const isActive = (pathname: string) => router.pathname === pathname;
  return (
    <div className="relative flex h-full w-screen flex-col items-center justify-center bg-palBg">
      <Header />
      {isActive("/") && <Hero />}
      <div className="container mx-auto p-8">{children}</div>
    </div>
  );
};

export default Layout;
