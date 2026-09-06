import Link from "next/link";
import Image from "next/image";
import Menu from "./menu";
import { APP_NAME } from "@/lib/constants";
import Search from "./Search";

const Navbar = () => {
  return (
    <nav className="w-full border-b h-auto">
      {/* top nav-bar */}
      <section className="bg-green-500 border-b border-amber-50">
        <div className="w-full mx-auto flex items-center justify-center gap-1 max-w-250 xl:px-0 py-1 px-5">
          <p className="text-[11px] sm:text-sm font-medium text-foreground">
            Thank you for shopping with us! Today{" "}
          </p>
          <p className="text-[11px] sm:text-xs underline">Exclusive Deals</p>
        </div>
      </section>

      {/* main nav-bar */}
      <section className="mx-auto flex justify-between max-w-7xl items-center gap-2 px-2 py-2 sm:px-4 md:py-0 my-2">
        <div className="flex items-center gap-2">
          <Link href="/" className="flex items-center shrink-0 ml-2 md:ml-4">
            <Image
    src="/images/store-icon.jpg"
    alt={`${APP_NAME} logo`}
    width={40}
    height={40}
    priority
    className="h-9 w-9 sm:h-10 sm:w-10 rounded-full object-cover object-center"
  />
            <span className="hidden md:block font-serif text-xl md:text-2xl font-semibold uppercase tracking-tight text-transparent bg-clip-text bg-linear-to-r from-stone-800 via-neutral-500 to-amber-700 shrink-0 ml-2">
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
