import blog_hero from "../public/images/blog_hero.jpg";
import Image from "next/image";

const Hero: React.FC = () => {
  return (
    <div className="relative flex h-auto min-h-[300px] w-full flex-col-reverse ">
      <div className="relative w-1/2">
        <Image src={blog_hero} alt="Hero Image" className="object-cover" />
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
