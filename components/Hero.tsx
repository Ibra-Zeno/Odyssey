import map from "../public/images/map.svg";
import Image from "next/image";

const Hero: React.FC = () => {
  return (
    <div className="bg-palBg relative flex h-auto w-full flex-col-reverse ">
      <div className="relative w-full">
        <Image
          src={map}
          alt="Hero Image"
          className="mx-auto object-cover"
          draggable={false}
        />
      </div>
      <div className="bg-slate-500 mix-blend-multiply"></div>
      <div className="relative flex h-full w-full flex-col items-center justify-center text-center">
        <h1 className="text-4xl font-bold text-white">Welcome to the Blog</h1>
        <p className="text-white">A place to share knowledge</p>
      </div>
    </div>
  );
};

export default Hero;
