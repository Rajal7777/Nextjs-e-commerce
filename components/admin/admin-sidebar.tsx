"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";

import { LayoutDashboard, Package, ReceiptText, Users } from "lucide-react";

import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
  useSidebar,
} from "@/components/ui/sidebar";

import { Badge } from "@/components/ui/badge";

const adminLinks = [
  {
    title: "Overview",
    href: "/admin/overview",
    icon: LayoutDashboard,
  },
  {
    title: "Products",
    href: "/admin/products",
    icon: Package,
  },
  {
    title: "Orders",
    href: "/admin/orders",
    icon: ReceiptText,
  },
  {
    title: "Users",
    href: "/admin/users",
    icon: Users,
  },
];

type AdminSidebarProps = {
  name?: string;
  role?: string;
};

const AdminSidebar = ({ name, role }: AdminSidebarProps) => {
  const pathname = usePathname();
  const { isMobile, setOpenMobile } = useSidebar();

  const handleLinkClick = () => {
    if (isMobile) {
      setOpenMobile(false);
    }
  };

  return (
    <Sidebar collapsible="icon">
      {/* Header */}
      <SidebarHeader>
        <Link
          href="/"
          onClick={handleLinkClick}
          className="flex items-center gap-2"
        >
          <Image
            src="/images/store-icon.jpg"
            alt="Store logo"
            width={36}
            height={36}
            className="rounded-full"
          />

          {/* Hidden when sidebar is collapsed */}
          <div className="leading-tight group-data-[collapsible=icon]:hidden">
            <p className="text-sm font-semibold  uppercase">{name || "User"} Panel</p>

            <div className="mt-1 flex items-center gap-2">
              <span className="max-w-24 truncate text-xs text-muted-foreground uppercase">
                {name || "Admin User"}
              </span>

              <Badge
                variant={role === "admin" ? "default" : "secondary"}
                className="text-[10px] capitalize"
              >
                {role || "user"}
              </Badge>
            </div>
          </div>
        </Link>
      </SidebarHeader>

      {/* Navigation */}
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Navigation</SidebarGroupLabel>

          <SidebarMenu>
            {adminLinks.map((link) => {
              const Icon = link.icon;

              const isActive =
                pathname === link.href || pathname.startsWith(`${link.href}/`);

              return (
                <SidebarMenuItem key={link.href}>
                  <SidebarMenuButton
                    asChild
                    isActive={isActive}
                    tooltip={link.title}
                    className="bg-transparent hover:bg-transparent focus-visible:bg-transparent data-[active=true]:bg-gray-600 data-[active=true]:text-white data-[active=true]:hover:bg-gray-600"
                  >
                    <Link href={link.href} onClick={handleLinkClick}>
                      <Icon />
                      <span>{link.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              );
            })}
          </SidebarMenu>
        </SidebarGroup>
      </SidebarContent>

      <SidebarRail />
    </Sidebar>
  );
};

export default AdminSidebar;
