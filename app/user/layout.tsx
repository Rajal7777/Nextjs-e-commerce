import Menu from "@/components/shared/header/menu";
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
