import { ReactNode } from "react";
import Header from "./Header";

interface LayoutProps {
  children: ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  return (
    <div className="relative flex h-full w-screen flex-col items-center justify-center  bg-palBg">
      <div className="z-10 w-full">
        <Header />
        <div className="container mx-auto p-8">{children}</div>
      </div>
    </div>
  );
};

export default Layout;
