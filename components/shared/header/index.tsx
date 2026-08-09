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
      {/* top nav-bar */}
      <section className="bg-green-300">
        <div className="w-full mx-auto flex items-center justify-between max-w-250 xl:px-0 py-1 px-5">
          <div className="flex items-center  gap-2">
            <a
              href="tel:+817090344803"
              className="flex items-center font-medium text-xs"
            >
              <Phone className="h-4 w-4" />
              <span className="hidden sm:block">+81 070 9034 4803</span>
            </a>

            <a
              href="mailto:suwalrajal57@gmail.com"
              className="flex items-center font-medium text-xs"
            >
              <Mail className="h-4 w-4" />
              <span className="hidden sm:block">suwalrajal57@gmail.com</span>
            </a>
          </div>

          <div className="flex items-center">
            <p className="font-medium text-sm">Exclusive Deals</p>
          </div>
        </div>
      </section>

      {/* main nav-bar */}
      <section className="mx-auto flex justify-between max-w-7xl items-center gap-2 px-2 py-2 sm:px-4 md:py-0">
        <div className="flex-start">
          <CategoryDrawer />
          <Link href="/" className="flex-start ml-1 md:ml-4">
            <Image
              src="/images/store-icon.jpg"
              alt={`${APP_NAME} logo`}
              width={40}
              height={40}
              preload={true}
              loading="eager"
            />
            <span className="hidden md:block font-serif text-xl md:text-2xl font-semibold uppercase tracking-tight text-transparent bg-clip-text bg-linear-to-r from-stone-800 via-neutral-500 to-amber-700 shrink-0">
              {APP_NAME}
            </span>
          </Link>
        </div>

        <div>
          <Search />
        </div>

        <div className="flex items-center gap-2">
          <Menu />
        </div>
      </section>
    </nav>
  );
};

export default Navbar;
