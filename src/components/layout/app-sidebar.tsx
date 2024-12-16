"use client";

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarTrigger,
  useSidebar,
} from "@/components/ui/sidebar";
import Link from "next/link";
import React from "react";
import { cn } from "@/lib/utils";
import { sidebarConstant } from "./sidebar-constant";

const AppSidebar = ({ ...props }: React.ComponentProps<typeof Sidebar>) => {
  const { open } = useSidebar();

  return (
    <Sidebar collapsible="icon" {...props} className="!p-0">
      <SidebarHeader
        className={cn(
          "h-16 flex !flex-row items-center justify-between  border-b",
          open ? "py-1.5" : "!py-3.5"
        )}
      >
        <SidebarMenu>
          <SidebarMenuButton
            size="lg"
            className="data-[state=open]:bg-sidebar-accent "
          >
            <div
              className={cn(
                "flex aspect-square size-8 items-center justify-center  rounded-lg bg-primary text-primary-foreground "
              )}
            >
              S
            </div>
            <div
              className={cn(
                "grid flex-1 text-left text-sm leading-tight ",
                !open && "hidden"
              )}
            >
              <span className="truncate text-primaryBlack font-semibold text-xl">
                <Link href={"/"}>SnapShop</Link>
              </span>
            </div>
          </SidebarMenuButton>
        </SidebarMenu>

        {open && <SidebarTrigger className="-ml-1" />}
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup className="w-full !p-0 overflow-hidden">
          <SidebarMenu className={cn("border-b p-3", open ? "px-3.5" : "px-2")}>
            {sidebarConstant.items.map((item, index) => (
              <SidebarMenuItem key={index} className="p-0">
                <Link href={item.url}>
                  <SidebarMenuButton
                    tooltip={item.title}
                    className="px-3 py-2 hover:bg-gray-100  flex justify-between  items-center"
                  >
                    <div className="flex items-center gap-2">
                      {item.icon && <item.icon className="size-4" />}
                      <span className="text-sm">{item.title}</span>
                    </div>
                  </SidebarMenuButton>
                </Link>
              </SidebarMenuItem>
            ))}
          </SidebarMenu>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter>{/* <NavUser /> */}</SidebarFooter>
    </Sidebar>
  );
};

export { AppSidebar };
