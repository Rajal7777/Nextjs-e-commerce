import Link from "next/link";
import Image from "next/image";
import Menu from "./menu";
import { APP_NAME } from "@/lib/constants";
import CategoryDrawer from "./category-drawer";
import Search from "./Search";
import { Mail, Phone } from "lucide-react";

const Navbar = () => {
  return (
    <nav className="w-full border-b h-auto">
      <section className="bg-green-300">
        <div className="w-full mx-auto flex items-center justify-between max-w-300 xl:px-0 py-1 px-5">
          <div className="flex items-center  gap-2">
            <a href="tel:+817090344803" className="flex items-center font-medium text-xs">
              <Phone />
              <span className="hidden sm:block">+81 070 9034 4803</span>
            </a>

            <a
              href="mailto:suwalrajal57@gmail.com"
              className="flex items-center font-medium text-xs"
            >
              <Mail />
              <span className="hidden sm:block">suwalrajal57@gmail.com</span>
            </a>
          </div>

          <div className="flex items-center">
            <p className="font-medium text-sm">Exclusive Deals</p>
          </div>
        </div>
      </section>
      <div className="wrapper flex-between">
        <div className="flex-start ">
          <CategoryDrawer />
          <Link href="/" className="flex-start ml-4">
            <Image
              src="/images/store-icon.jpg"
              alt={`${APP_NAME} logo`}
              width={48}
              height={48}
              preload={true}
              loading="eager"
            />
            <span className="hidden md:block font-serif text-2xl font-semibold uppercase tracking-wider text-transparent bg-clip-text bg-linear-to-r from-stone-800 via-neutral-500 to-amber-700">
              {APP_NAME}
            </span>
          </Link>
        </div>
        <div className="hidden md:block">
          <Search />
        </div>
        <div className="flex items-center gap-2">
          <Menu />
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
