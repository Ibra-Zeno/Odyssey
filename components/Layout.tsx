import { ReactNode } from "react";
import Header from "./Header";

interface LayoutProps {
  children: ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  return (
    <div className="relative flex h-full min-h-screen w-screen flex-col items-center justify-center bg-gradient-to-b from-gray-900 to-gray-700 ">
      <div className="relative z-10 h-full w-full">
        <Header />
        <div className="container mx-auto min-h-screen p-8">{children}</div>
      </div>
    </div>
  );
};

export default Layout;
