"use client";

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
  SidebarTrigger,
  useSidebar,
} from "@/components/ui/sidebar";
import { cn } from "@/lib/utils";
import { ReceiptText, UserRound } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Badge } from "../ui/badge";

const userLinks = [
  {
    title: "Profile",
    href: "/user/profile",
    icon: UserRound,
  },
  {
    title: "Orders",
    href: "/user/orders",
    icon: ReceiptText,
  },
];

const UserSidebar = ({ name, role }: { name?: string; role?: string }) => {
  const pathname = usePathname();
  const { isMobile, setOpenMobile } = useSidebar();
  console.log(isMobile);

  return (
    <Sidebar
      collapsible="icon"
      className="border-r border-sidebar-border bg-sidebar"
    >
      <SidebarHeader>
        <div className="flex items-center justify-between gap-2">
          <Link
            href="/"
            className="flex items-center gap-2"
            onClick={() => setOpenMobile(false)}
          >
            <Image
              src="/images/store-icon.jpg"
              alt="Store logo"
              width={36}
              height={36}
              className="rounded-full"
            />
            <div className="leading-tight group-data-[collapsible=icon]:hidden">
              <p className="text-sm font-semibold capitalize">{name || "Guest"} Account</p>

              <div className="mt-1 flex items-center gap-4">
                <p className="text-sm text-muted-foreground truncate uppercase">
                  {name || "Guest User"}
                </p>
                <Badge
                  variant={
                    (role || "user") === "admin" ? "secondary" : "outline"
                  }
                  className="text-[10px] uppercase text-green-600"
                >
                  {role || "user"}
                </Badge>
              </div>
            </div>
          </Link>
          <SidebarTrigger
            className={cn(
              "hidden size-8 text-sidebar-foreground",
              isMobile && "block",
            )}
          />
        </div>
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Navigation</SidebarGroupLabel>
          <SidebarMenu>
            {userLinks.map((link) => {
              const Icon = link.icon;
              const isActive =
                pathname === link.href || pathname.startsWith(`${link.href}/`);

              return (
                <SidebarMenuItem key={link.href}>
                  <SidebarMenuButton
                    asChild
                    isActive={isActive}
                    className="bg-transparent hover:bg-transparent focus-visible:bg-transparent data-[active=true]:bg-gray-600 data-[active=true]:text-white data-[active=true]:hover:bg-gray-600"
                  >
                    <Link
                      href={link.href}
                      className={cn("w-full")}
                      onClick={() => {
                        if (isMobile) {
                          setOpenMobile(false);
                        }
                      }}
                    >
                      <Icon className="size-4" />
                      <span
                        className={cn("group-data-[collapsible=icon]:hidden")}
                      >
                        {link.title}
                      </span>
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

export default UserSidebar;
