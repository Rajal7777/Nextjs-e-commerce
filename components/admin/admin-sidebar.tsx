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
import { LayoutDashboard, Package, ReceiptText, Users } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";

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

const AdminSidebar = () => {
    const pathname = usePathname();
    const { isMobile, setOpenMobile } = useSidebar();

    return (
        <Sidebar collapsible="icon" className="border-r border-sidebar-border bg-sidebar">
            <SidebarHeader>
                <div className="flex items-center justify-between gap-2">
                    <Link href="/" className="flex items-center gap-2" onClick={() => setOpenMobile(false)}>
                        <Image
                            src="/images/store-icon.jpg"
                            alt="Store logo"
                            width={36}
                            height={36}
                            className="rounded-full"
                        />
                        <div className="leading-tight group-data-[collapsible=icon]:hidden">
                            <p className="text-sm font-semibold">Admin Panel</p>
                            <p className="text-xs text-muted-foreground">Next Store</p>
                        </div>
                    </Link>
                    <SidebarTrigger className="size-8 text-sidebar-foreground" />
                </div>
            </SidebarHeader>

            <SidebarContent>
                <SidebarGroup>
                    <SidebarGroupLabel>Navigation</SidebarGroupLabel>
                    <SidebarMenu>
                        {adminLinks.map((link) => {
                            const Icon = link.icon;
                            const isActive = pathname === link.href || pathname.startsWith(`${link.href}/`);

                            return (
                                <SidebarMenuItem key={link.href}>
                                    <SidebarMenuButton asChild isActive={isActive}>
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
                                            <span className="group-data-[collapsible=icon]:hidden">
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

export default AdminSidebar;
