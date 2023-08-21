import { ReactNode } from "react";
import Header from "./Header";

interface LayoutProps {
  children: ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  return (
    <div className="font-sans bg-gray-100">
      <Header />
      <div className="container mx-auto p-8">{children}</div>
    </div>
  );
};

export default Layout;
