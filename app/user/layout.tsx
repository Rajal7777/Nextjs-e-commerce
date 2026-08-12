import Menu from "@/components/shared/header/menu";
import Image from "next/image";
import Link from "next/link";
import MainNav from "./main-nav";


export default function UserLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
   <div className="w-full flex flex-col justify-center ">
        <div className="h-16 border-b wrapper mx-auto pt-2 ">
          <div className="flex items-center  px-4 ">
            <Link href="/" className="w-22">
              <Image
                src="/images/store-icon.jpg"
                alt="logo"
                loading="eager"
                height={48}
                width={48}
              />
            </Link>

            <MainNav className="w-full" />

            <div className="ml-auto items-center flex space-x-4">
              <Menu />
            </div>
          </div>
        </div>

        <div className="wrapper flex-1">{children}</div>
      </div>
  );
}
