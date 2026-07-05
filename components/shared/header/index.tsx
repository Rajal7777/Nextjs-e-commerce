import Link from "next/link";
import Image from "next/image";
import Menu from "./menu";
import { APP_NAME } from "@/lib/constants";

const Navbar = () => {
  return (
    <nav className="w-full border-b">
      <div className="wrapper flex-between">
        <div className="flex-start ">
          <Link href="/" className="flex-start">
            <Image
              src="/images/logo.svg"
              alt={`${APP_NAME} logo`}
              width={48}
              height={48}
              preload={true}
              loading="eager"
            />
            <span className="hidden lg:block font-bold text-2xl ml-3">
              {APP_NAME}
            </span>
          </Link>
        </div>

        <div className="flex items-center gap-2">
          <Menu />
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
