import Menu from "@/components/shared/header/menu";
import Image from "next/image";
import Link from "next/link";
import UserSidebar from "@/components/user/user-sidebar";
import { SidebarInset, SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { auth } from "@/auth";



export default async function UserLayout({
  children,
}: Readonly<{ children: React.ReactNode; }>) {
  const session = await auth();

  const userName = session?.user?.name ?? 'Guest';
  const userRole = session?.user?.role ?? 'user';

  return (
    <SidebarProvider>
      <UserSidebar name={userName} role={userRole} />

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
              <Menu />
            </div>
          </div>
        </div>

        <div className="wrapper py-4">{children}</div>
      </SidebarInset>
    </SidebarProvider>
  );
}
