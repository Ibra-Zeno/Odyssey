import { ReactNode } from "react";
import Header from "./Header";

interface LayoutProps {
  children: ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  return (
    <div className="min-h-screen flex flex-col justify-center items-center bg-gradient-to-b from-yellow-100 via-yellow-50 to-gray-100">
      <Header />
      <div className="container mx-auto p-8">{children}</div>
    </div>
  );
};

export default Layout;
