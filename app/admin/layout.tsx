import Menu from "@/components/shared/header/menu";
import Image from "next/image";
import Link from "next/link";
import MainNav from "./main-nav";
import AdminSearch from "@/components/admin/admin-search-form";

import { requireAdmin } from "@/lib/actions/auth-guard";

export default async function AdminLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  await requireAdmin();

  return (
    <div className="w-full flex flex-col">
      <div className="h-20 border-b sm:wrapper mx-auto ">
        <div className="flex items-center h-16 ">
          <Link href="/" className="w-22 hidden sm:block">
            <Image
              src="/images/store-icon.jpg"
              alt="logo"
              loading="eager"
              height={48}
              width={48}
            />
          </Link>

          <MainNav className="mx-2" />

          <div className="ml-auto items-center flex space-x-4">
            <AdminSearch />
            <Menu />
          </div>
        </div>
      </div>

      <div className="wrapper flex-1">{children}</div>
    </div>
  );
}
