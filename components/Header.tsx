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
import {
  Newspaper,
  PenSquare,
  LogIn,
  FilePlus,
  LogOut,
  Orbit,
} from "lucide-react";
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
    <nav className="relative z-30 mx-auto flex w-full max-w-7xl items-center justify-between space-x-0 rounded-sm bg-transparent p-3 px-4 text-pal3 xl:px-8">
      <div>
        <Orbit className="h-10 w-10" />
      </div>
      <div className="pointer-events-none absolute inset-0 -z-0 mx-auto flex items-center justify-center">
        <SearchBar />
      </div>
      <div className="flex space-x-4">
        <TooltipProvider>
          <Tooltip delayDuration={100}>
            <TooltipTrigger>
              <Link
                href="/"
                className="flex rounded-md bg-transparent p-2 text-pal3 duration-300 ease-in-out hover:bg-pal2 hover:text-stone-50 hover:shadow-lg hover:shadow-gray-400"
              >
                <Newspaper />
              </Link>
            </TooltipTrigger>
            <TooltipContent
              side="bottom"
              align="center"
              className="font-display font-semibold tracking-wide"
            >
              Feed
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
        {session && (
          <>
            <TooltipProvider>
              <Tooltip delayDuration={100}>
                <TooltipTrigger>
                  <Link
                    href="/drafts"
                    className="flex rounded-md bg-transparent p-2 text-pal3 duration-300 ease-in-out hover:bg-pal2 hover:text-stone-50 hover:shadow-lg hover:shadow-gray-400"
                  >
                    <PenSquare />
                  </Link>
                </TooltipTrigger>

                <TooltipContent
                  side="bottom"
                  align="center"
                  className="font-display font-semibold tracking-wide"
                >
                  Drafts
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
            <TooltipProvider>
              <Tooltip delayDuration={100}>
                <TooltipTrigger>
                  <Link
                    href="/create"
                    className="flex rounded-md bg-transparent p-2 text-pal3 duration-300 ease-in-out hover:bg-pal2 hover:text-stone-50 hover:shadow-lg hover:shadow-gray-400"
                  >
                    <FilePlus />
                  </Link>
                </TooltipTrigger>

                <TooltipContent
                  side="bottom"
                  align="center"
                  className="font-display font-semibold tracking-wide"
                >
                  Create
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
            <TooltipProvider>
              <Tooltip delayDuration={100}>
                <TooltipTrigger>
                  <button
                    onClick={() => signOut()}
                    className="flex rounded-md bg-transparent p-2 text-pal3 duration-300 ease-in-out hover:bg-pal2 hover:text-stone-50 hover:shadow-lg hover:shadow-gray-400"
                  >
                    <LogOut />
                  </button>
                </TooltipTrigger>

                <TooltipContent
                  side="bottom"
                  align="center"
                  className="font-display font-semibold tracking-wide"
                >
                  Log out
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </>
        )}
        {status === "loading" && (
          <Skeleton className="h-10 w-10 rounded-full" />
        )}
        {status === "unauthenticated" && (
          <TooltipProvider>
            <Tooltip delayDuration={100}>
              <TooltipTrigger>
                <Link
                  href="/api/auth/signin"
                  className="flex rounded-md bg-transparent p-2 text-pal3 duration-300 ease-in-out hover:bg-pal2 hover:text-stone-50 hover:shadow-lg hover:shadow-gray-400"
                >
                  <LogIn />
                </Link>
              </TooltipTrigger>

              <TooltipContent
                side="bottom"
                align="center"
                className="font-display font-semibold tracking-wide"
              >
                Log in
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        )}
        {session && (
          <>
            <TooltipProvider>
              <Tooltip delayDuration={100}>
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

                <TooltipContent
                  side="bottom"
                  align="center"
                  className="font-display font-semibold tracking-wide"
                >
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
