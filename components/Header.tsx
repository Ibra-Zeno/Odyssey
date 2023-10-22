import Link from "next/link";
import { useRouter } from "next/router";
import { useState } from "react";
import { Button } from "@/components/ui/button";
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
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

import SearchBar from "./Search";

const Header: React.FC = () => {
  const [isNavOpen, setIsNavOpen] = useState(false); // Add state for navigation open/close

  const toggleNav = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault(); // Prevent default link behavior
    setIsNavOpen((prevState) => !prevState); // Toggle navigation state
  };
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
    <>
      {/*Larger Navbar */}
      <nav className="relative z-30 mx-auto hidden w-full max-w-7xl items-center justify-between space-x-0 rounded-sm bg-transparent p-3 px-4 text-pal3 md:flex xl:px-8">
        <Link href="/" about="Home">
          <Orbit
            className="h-14 w-14 animate-spin-slow cursor-pointer text-[#f0ddeb] transition-colors hover:text-[#bea5ab]"
            strokeWidth={1.5}
          />
        </Link>
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
                  <AlertDialog>
                    <TooltipTrigger>
                      {/* Add the AlertDialogTrigger around the "Log out" button */}
                      <AlertDialogTrigger asChild>
                        <button className="flex rounded-md bg-transparent p-2 text-pal3 duration-300 ease-in-out hover:bg-pal2 hover:text-stone-50 hover:shadow-lg hover:shadow-gray-400">
                          <LogOut />
                        </button>
                      </AlertDialogTrigger>
                    </TooltipTrigger>
                    <TooltipContent
                      side="bottom"
                      align="center"
                      className="font-display font-semibold tracking-wide"
                    >
                      Log Out
                    </TooltipContent>

                    {/* Add the AlertDialogContent */}
                    <AlertDialogContent className="border-none bg-pal5 text-white shadow-none">
                      <AlertDialogHeader>
                        <AlertDialogTitle>
                          Are you sure you want to log out?
                        </AlertDialogTitle>
                        <AlertDialogDescription className="text-stone-200">
                          This action will log you out of your account.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel className="border-none bg-pal1 font-display text-stone-800 hover:bg-pal3 hover:text-stone-800">
                          Cancel
                        </AlertDialogCancel>
                        <AlertDialogAction
                          onClick={() => signOut()}
                          className="bg-red-500 font-display hover:bg-red-600 hover:text-stone-50"
                        >
                          Log Out
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </Tooltip>
              </TooltipProvider>
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
        </div>
      </nav>
      {/* Mobile Nav */}
      <nav>
        <div className="md:hidden">
          {/* Circular button */}
          <div className="aboslute left-0 top-0 flex justify-center pt-2">
            <SearchBar />
          </div>
          <div className="fixed bottom-5 right-5 z-50 cursor-pointer">
            <Button
              onClick={(e) => toggleNav(e)}
              size="sm"
              className={`font-logo text-lightText h-14 w-14 rounded-full border-2 border-[#7b3b4f] bg-[#50142a] p-3 text-3xl font-medium text-stone-50 shadow-2xl hover:bg-[#7b3b4f] ${
                isNavOpen
                  ? "border-[#17839b]/60 bg-pal5 hover:bg-[#17839b] "
                  : ""
              } transition-all duration-300`}
            >
              <Orbit className="animate-spin-slow" />
            </Button>
          </div>
          {/* Navigation */}
          <nav
            className={`text-lightText fixed bottom-10 right-5 z-40 flex w-14 transform flex-col items-center gap-y-6 rounded-lg border border-[#17839b]/60 bg-pal5 px-2 pb-14 pt-4  transition-all duration-300 ease-in-out ${
              isNavOpen
                ? "translate-y-0 scale-100 opacity-100"
                : "translate-y-1/2 scale-y-0 opacity-0"
            }`}
          >
            {session && (
              <Link
                href={`/profile/${session.user?.email}`}
                className="rounded-full transition-shadow duration-200 ease-in-out hover:bg-none hover:shadow-lg hover:shadow-stone-50/20"
              >
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
            )}
            <Link href="/">
              <Button size="sm" className="text-stone-50" variant={"ghost"}>
                <Newspaper />
              </Button>
            </Link>
            {session && (
              <>
                <Link href="/drafts">
                  <Button size="sm" className="text-stone-50" variant={"ghost"}>
                    <PenSquare />
                  </Button>
                </Link>
                <Link href="/create">
                  <Button size="sm" className="text-stone-50" variant={"ghost"}>
                    <FilePlus />
                  </Button>
                </Link>
                <AlertDialog>
                  {/* Add the AlertDialogTrigger around the "Log out" button */}
                  <AlertDialogTrigger asChild>
                    <Button
                      size="sm"
                      className="text-stone-50"
                      variant={"ghost"}
                    >
                      <LogOut />
                    </Button>
                  </AlertDialogTrigger>
                  {/* Add the AlertDialogContent */}
                  <AlertDialogContent className="border-none bg-pal5 text-white shadow-none">
                    <AlertDialogHeader>
                      <AlertDialogTitle>
                        Are you sure you want to log out?
                      </AlertDialogTitle>
                      <AlertDialogDescription className="text-stone-200">
                        This action will log you out of your account.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel className="border-none bg-pal1 font-display text-stone-800 hover:bg-pal3 hover:text-stone-800">
                        Cancel
                      </AlertDialogCancel>
                      <AlertDialogAction
                        onClick={() => signOut()}
                        className="bg-red-500 font-display hover:bg-red-600 hover:text-stone-50"
                      >
                        Log Out
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </>
            )}
            {status === "unauthenticated" && (
              <Link href="/api/auth/signin">
                <Button size="sm" className="text-stone-50" variant={"ghost"}>
                  <LogIn />
                </Button>
              </Link>
            )}
          </nav>
        </div>
      </nav>
    </>
  );
};

export default Header;
