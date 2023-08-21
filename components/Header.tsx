import Link from "next/link";
import { useRouter } from "next/router";
import { classicNameResolver } from "typescript";

const Header: React.FC = () => {
  const router = useRouter();
  const isActive = (pathname: string) => router.pathname === pathname;

  return (
    <nav className="flex p-8 items-center">
      <div className="flex space-x-4">
        <Link
          href="/"
          data-active={isActive("/")}
          className={`font-bold ${
            isActive("/") ? "text-gray-500" : "text-black"
          }`}
        >
          Feed
        </Link>
      </div>
    </nav>
  );
};

export default Header;

/*           <a
            className={`font-bold ${
              isActive("/") ? "text-gray-500" : "text-black"
            }`}
          > */
