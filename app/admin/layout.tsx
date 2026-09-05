import Menu from "@/components/shared/header/menu";
import AdminSidebar from "@/components/admin/admin-sidebar";
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";

import { requireAdmin } from "@/lib/actions/auth-guard";
import { auth } from "@/auth";

export default async function AdminLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  // Single Security Check & Auth Hydration
  await requireAdmin();
  const session = await auth();

  return (
    <SidebarProvider>
      {/* Admin Sidebar Navigation */}
      <AdminSidebar
        name={session?.user?.name ?? "Admin User"}
        role={session?.user?.role ?? "Admin"}
      />

      <SidebarInset>
        {/* Header Header Navigation */}
        <header className="border-b bg-background sticky top-0 z-10">
          <div className="wrapper mx-auto flex min-h-16 items-center gap-3 px-4">
            <SidebarTrigger />

            <div className="ml-auto flex items-center gap-3">
              <Menu />
            </div>
          </div>
        </header>

        {/* Main Content Area */}
        <main className="wrapper flex-1 p-4 md:p-6">{children}</main>
      </SidebarInset>
    </SidebarProvider>
  );
}
