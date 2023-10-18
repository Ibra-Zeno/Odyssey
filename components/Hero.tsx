import Image from "next/image";
import map from "../public/images/wasHereBg.svg";
import { Button } from "./ui/button";

const Hero: React.FC = () => {
  return (
    <div className="h-full min-h-[34rem] w-full px-8 ">
      <div className="absolute inset-0 -z-10 w-full">
        <Image
          src={map}
          alt="hero"
          width={896}
          height={384}
          className="flex max-h-[40rem] w-full justify-center rounded-xl object-cover object-center"
        ></Image>
      </div>
      <div className="relative mx-auto mt-4 flex justify-center rounded-lg pt-16 ">
        <div className="mx-auto flex max-w-3xl flex-col justify-center text-center">
          <h1 className="block font-display text-3xl font-bold text-pal3 sm:text-4xl md:text-5xl">
            Leave Your Mark on the World
          </h1>
          <p className="mt-6 text-lg text-gray-400">
            Lorem ipsum dolor, sit amet consectetur adipisicing elit. Dolorum
            velit possimus temporibus ut totam
          </p>
          <div className="mt-8 sm:mt-8 sm:flex sm:justify-center lg:justify-center">
            <div className="rounded-md shadow">
              <Button
                size="lg"
                className="bg-pal2 text-base font-bold text-pal3 shadow-lg hover:bg-pal4"
              >
                Get started
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Hero;
