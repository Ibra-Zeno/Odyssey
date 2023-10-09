import Link from "next/link";
import { useRouter } from "next/router";
import { useSession, signOut } from "next-auth/react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Newspaper, PenSquare, LogIn, FilePlus, LogOut } from "lucide-react";
import SearchBar from "./Search";

const Header: React.FC = () => {
  const router = useRouter();
  const isActive = (pathname: string) => router.pathname === pathname;

  const { data: session, status } = useSession();

  // Get the initials of user from session
  function getInitials(name: string): string {
    const words = name.split(" ");
    const initials = words.map((word) => word.charAt(0).toUpperCase()).join("");
    return initials;
  }

  const nameInitials = getInitials(session?.user?.name || "");
  const userName = session?.user?.name || undefined;
  const avatarImage = session?.user?.image || undefined;

  return (
    <nav className="relative flex w-full items-center justify-between space-x-0 rounded-sm bg-slate-800 p-3 px-4 text-gray-300">
      <div className="flex space-x-4">
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger>
              <Link
                href="/"
                className="pointer animate flex rounded-md border-gray-400 border-opacity-30 bg-transparent p-2 duration-300 ease-in-out hover:bg-slate-900 hover:shadow-2xl hover:shadow-gray-400"
              >
                <Newspaper />
              </Link>
            </TooltipTrigger>
            <TooltipContent className="-translate-x-2">Feed</TooltipContent>
          </Tooltip>
        </TooltipProvider>
        {session && (
          <>
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger>
                  <Link
                    href="/drafts"
                    className="pointer animate flex rounded-md border-gray-400 border-opacity-30 bg-transparent p-2 duration-300 ease-in-out hover:bg-slate-900 hover:shadow-2xl hover:shadow-gray-400"
                  >
                    <PenSquare />
                  </Link>
                </TooltipTrigger>

                <TooltipContent className="-translate-x-4">
                  Drafts
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger>
                  <Link
                    href="/create"
                    className="pointer animate flex rounded-md border-gray-400 border-opacity-30 bg-transparent p-2 duration-300 ease-in-out hover:bg-slate-900 hover:shadow-2xl hover:shadow-gray-400"
                  >
                    <FilePlus />
                  </Link>
                </TooltipTrigger>

                <TooltipContent className="-translate-x-4">
                  Create
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </>
        )}
      </div>
      <div className="flex items-center space-x-4">
        <SearchBar />
      </div>
      <div className="ml-auto flex space-x-4">
        {status === "loading" && (
          <Skeleton className="h-10 w-10 rounded-full" />
        )}
        {status === "unauthenticated" && (
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger>
                <Link
                  href="/api/auth/signin"
                  className="pointer animate flex rounded-md border-gray-400 border-opacity-30 bg-transparent p-2 duration-300 ease-in-out hover:bg-slate-900 hover:shadow-2xl hover:shadow-gray-400"
                >
                  <LogIn />
                </Link>
              </TooltipTrigger>

              <TooltipContent className="-translate-x-6">Log in</TooltipContent>
            </Tooltip>
          </TooltipProvider>
        )}
        {session && (
          <>
            <LogOut onClick={() => signOut()} />
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger>
                  <Link href={`/profile/${session.user?.email}`}>
                    <Avatar>
                      <AvatarImage
                        src={avatarImage}
                        alt={userName}
                        className="h-10 w-10"
                      />
                      <AvatarFallback className="h-10 w-10">
                        {nameInitials}
                      </AvatarFallback>
                    </Avatar>
                  </Link>
                </TooltipTrigger>

                <TooltipContent className="-translate-x-6">
                  Profile
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </>
        )}
      </div>
    </nav>
  );
};

export default Header;
