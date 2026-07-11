import Menu from "@/components/shared/header/menu";
import Image from "next/image";
import Link from "next/link";
import MainNav from "./main-nav";

export default function UserLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
   <div className="w-full flex flex-col">
        <div className="h-20 border-b wrapper mx-auto">
          <div className="flex items-center h-16 px-4">
            <Link href="/" className="w-22">
              <Image
                src="/images/logo.svg"
                alt="logo"
                loading="eager"
                height={48}
                width={48}
              />
            </Link>

            <MainNav className="mx-2" />

            <div className="ml-auto items-center flex space-x-4">
              <Menu />
            </div>
          </div>
        </div>

        <div className="wrapper flex-1">{children}</div>
      </div>
  );
}
