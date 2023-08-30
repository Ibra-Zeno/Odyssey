import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/router";
import { signOut, useSession } from "next-auth/react";
import SearchBar from "./SearchBar";
import SearchResults from "./SearchResults";

const Header: React.FC = () => {
  const router = useRouter();
  const isActive = (pathname: string) => router.pathname === pathname;

  const { data: session, status } = useSession();
  const [searchResults, setSearchResults] = useState([]);
  const handleSearch = async (query: string) => {
    try {
      const response = await fetch(`/api/search?q=${query}`);
      const results = await response.json();
      setSearchResults(results);
    } catch (error) {
      console.error("Error searching:", error);
    }
  };

  const leftLinks = [
    { label: "Feed", href: "/", alwaysShow: true },
    { label: "My drafts", href: "/drafts", showWhenSessionExists: true },
  ];

  return (
    <nav className="flex p-5 items-center">
      <div className="flex space-x-4">
        {leftLinks.map((link) => {
          if (link.alwaysShow || (link.showWhenSessionExists && session)) {
            return (
              <Link key={link.href} href={link.href}>
                <span
                  className={`font-bold cursor-pointer ${
                    isActive(link.href) ? "text-gray-500" : "text-black"
                  }`}
                >
                  {link.label}
                </span>
              </Link>
            );
          }
          return null;
        })}
      </div>
      <SearchBar onSearch={handleSearch} />
      {searchResults.length > 0 && <SearchResults results={searchResults} />}
      <div className="flex ml-auto space-x-4">
        {status === "loading" && <p>Validating session ...</p>}
        {!session && (
          <Link href="/api/auth/signin">
            <span
              className={`cursor-pointer border border-gray-500 px-2 py-1 rounded ${
                isActive("/signup") ? "text-gray-500" : "text-black"
              }`}
            >
              Log in
            </span>
          </Link>
        )}
        {session && (
          <>
            <Link href={`/profile/${session.user?.email}`}>
              <span
                className={`font-bold cursor-pointer ${
                  isActive(`/profile/${session.user?.email}`)
                    ? "text-gray-500"
                    : "text-black"
                }`}
              >
                My Profile
              </span>
            </Link>
            <p className="text-sm">
              {session.user?.name} ({session.user?.email})
            </p>
            <Link href="/create">
              <button className="border-none bg-blue-500 text-white px-3 py-1 rounded">
                New post
              </button>
            </Link>
            <button
              onClick={() => signOut()}
              className="border-none bg-red-500 text-white px-3 py-1 rounded"
            >
              Log out
            </button>
          </>
        )}
      </div>
    </nav>
  );
};

export default Header;
