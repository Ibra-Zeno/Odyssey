import Image from "next/image";
import map from "../public/images/wasHereBg.svg";
import { Button } from "./ui/button";
import Link from "next/link";
import { useSession } from "next-auth/react";

const Hero: React.FC = () => {
  const { data: session, status } = useSession();

  return (
    <div className="h-full min-h-[34rem] w-full px-8 ">
      <div className="absolute inset-0 -z-10 w-full">
        <Image
          src={map}
          alt="hero"
          width={100}
          height={50}
          className="hidden w-full justify-center rounded-xl object-cover object-center md:flex md:max-h-[40rem]"
        ></Image>
        <Image
          src="/images/MobMoon.svg"
          alt="hero"
          width={100}
          height={50}
          className="flex w-full max-w-[100vw] justify-center rounded-xl object-cover object-center md:hidden"
        ></Image>
      </div>
      <div className="relative mx-auto mt-4 flex justify-center rounded-lg sm:pt-6 md:pt-16 ">
        <div className="mx-auto flex max-w-3xl flex-col justify-center text-center">
          <h1 className="block font-display text-3xl font-bold text-pal3 sm:text-4xl md:text-5xl">
            Oracles of the Odyssey
          </h1>
          <p className="mt-6 text-lg font-semibold text-gray-400">
            Whispers of the Earth: A Global Vault Teeming with a Rich Tapestry
            of Experiences, Emotions, and Imagination
          </p>
          {!session ? (
            <div className="mt-8 sm:mt-8 sm:flex sm:justify-center lg:mt-9">
              <Link href="/api/auth/signin">
                <Button
                  size="lg"
                  className="w-fit bg-pal4 px-6 font-display text-base font-bold tracking-wide text-stone-50 shadow-lg shadow-palBg/25 hover:bg-pal6"
                >
                  Get started
                </Button>
              </Link>
            </div>
          ) : (
            <div className="mt-8 flex flex-col justify-center gap-x-6 gap-y-4 sm:mt-8 sm:flex md:flex-row">
              <Link href="/create">
                <Button
                  size="lg"
                  className="w-full bg-pal4 font-display text-base font-bold tracking-wide text-stone-50 shadow-lg hover:bg-pal6 md:w-fit md:px-6"
                >
                  New Post
                </Button>
              </Link>
              <Link href="/drafts">
                <Button
                  size="lg"
                  variant={"outline"}
                  className="w-full bg-transparent font-display text-base font-bold tracking-wide text-pal3 shadow-lg backdrop-blur-sm hover:border-pal5 hover:bg-pal5 hover:text-pal3 md:w-fit"
                >
                  View Drafts
                </Button>
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Hero;
