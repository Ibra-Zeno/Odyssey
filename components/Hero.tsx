import Image from "next/image";
import map from "../public/images/heroDemo.jpg";
import { Button } from "./ui/button";

const Hero: React.FC = () => {
  return (
    <div className="relative h-full w-full px-8 ">
      <div className="bg-moon relative mx-auto mt-4 flex aspect-[16/8] max-w-7xl justify-center rounded-lg bg-stone-400/40  pt-16 ">
        <div className="mx-auto max-w-3xl text-center">
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
                className="bg-pal1 text-base font-bold text-stone-50 shadow-lg hover:bg-pal4"
              >
                Get started
              </Button>
            </div>
          </div>
        </div>

        <div className="absolute -bottom-32 z-30 mx-auto mt-20 flex h-auto max-w-4xl justify-center">
          <Image
            src={map}
            alt="hero"
            width={896}
            height={384}
            className="mx-auto flex min-h-[24rem] w-auto justify-center rounded-xl object-cover object-center"
          ></Image>
        </div>
      </div>
    </div>
  );
};

export default Hero;
