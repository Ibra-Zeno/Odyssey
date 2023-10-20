import { Orbit } from "lucide-react";

const Footer: React.FC = () => {
  return (
    <footer className="flex w-full flex-col items-center justify-center gap-y-3 border-t border-gray-200/30 py-5">
      <Orbit className="animate-spin-slow text-stone-50" />
      <p className="text-gray-200">Made by Ibrahim Kalam </p>
    </footer>
  );
};

export default Footer;
