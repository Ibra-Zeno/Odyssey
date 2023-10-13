import { ReactNode } from "react";
import Header from "./Header";
import Hero from "./Hero";
import Image from "next/image";
import { useRouter } from "next/router";

interface LayoutProps {
  children: ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const router = useRouter();
  const isActive = (pathname: string) => router.pathname === pathname;
  return (
    <div className="relative flex h-full w-screen flex-col items-center justify-center bg-palBg">
      <div className="absolute inset-0 z-0">
        <Image
          src="../images/bg-layout.svg"
          alt="Hero Background"
          layout="fill"
          className="opacity-20"
          objectFit="cover"
        ></Image>
      </div>
      <div className="z-10 w-full">
        <Header />
        {isActive("/") && <Hero />}
        <div className="container mx-auto p-8">{children}</div>
      </div>
    </div>
  );
};

export default Layout;
