import Image from "next/image";
import map from "../public/images/map.svg";

const Hero: React.FC = () => {
  return (
    <div
      className="relative mx-12 flex h-[90vh] w-full flex-col-reverse bg-palBg"
      style={{
        backgroundImage: `url(${map.src})`, // Set the image as background
        backgroundSize: "cover", // Adjust the background size as needed
        backgroundPosition: "center", // Center the background image
      }}
    >
      <div className="absolute left-0 top-0 h-full w-full bg-slate-500 mix-blend-multiply"></div>
      <div className="relative flex h-full w-full flex-col items-center justify-center text-center">
        <h1 className="text-4xl font-bold text-white">Welcome to the Blog</h1>
        <p className="text-white">A place to share knowledge</p>
      </div>
    </div>
  );
};

export default Hero;
