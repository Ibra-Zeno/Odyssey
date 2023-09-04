import { ReactNode } from "react";
import Header from "./Header";

interface LayoutProps {
  children: ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  return (
    <div className="relative flex min-h-screen w-screen flex-col items-center justify-center bg-gradient-to-b from-yellow-100 via-yellow-50 to-gray-100">
      <Header />
      <div className="container mx-auto p-8">{children}</div>
    </div>
  );
};

export default Layout;
