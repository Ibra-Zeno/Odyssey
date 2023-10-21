import { Orbit } from "lucide-react";
import Link from "next/link";

const Footer: React.FC = () => {
  return (
    <footer className="mt-10 flex w-full flex-col items-center justify-center gap-y-6 border-t-2 border-t-gray-200/30 py-5 ">
      <Link href="/">
        <Orbit className="h-9 w-9 animate-spin-slow cursor-pointer text-[#f0ddeb] transition-colors hover:text-[#bea5ab]" />
      </Link>
      <p className="font-noto text-sm font-extralight italic text-[#f0ddeb]">
        Made by Ibrahim Kalam{" "}
      </p>
    </footer>
  );
};

export default Footer;
