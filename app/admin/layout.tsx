import Menu from "@/components/shared/header/menu";
import Image from "next/image";
import Link from "next/link";
import AdminSearch from "@/components/admin/admin-search-form";
import AdminSidebar from "@/components/admin/admin-sidebar";
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";

import { requireAdmin } from "@/lib/actions/auth-guard";
import { auth } from "@/auth";
import { Home } from "lucide-react";

export default async function AdminLayout({
  children,
}: Readonly<{ children: React.ReactNode; }>) {
  await requireAdmin();
  const session = await auth();

  return (
    <SidebarProvider>
      <AdminSidebar
        name={session?.user?.name ?? "Admin User"}
        role={session?.user?.role ?? "user"}
      />

      <SidebarInset>
        <div className="border-b">
          <div className="wrapper mx-auto flex min-h-16 items-center gap-3">
            <SidebarTrigger />

            <Link href="/" className="hidden w-22 sm:block" aria-label="Home">
              <Image
                src="/images/store-icon.jpg"
                alt="logo"
                loading="eager"
                height={40}
                width={40}
                className="rounded-full"
              />
            </Link>

            <div className="ml-auto flex items-center gap-3">
              <div className="hidden sm:block">
                <AdminSearch />
              </div>
              <Menu />
            </div>
          </div>

          <div className="wrapper mx-auto pb-3 sm:hidden">
            <AdminSearch />
          </div>
        </div>

        <div className="wrapper py-4">{children}</div>
      </SidebarInset>
    </SidebarProvider>
  );
}
