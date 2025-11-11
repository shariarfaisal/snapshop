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
import React, { useState } from "react";
import { cn } from "@/lib/utils";
import { sidebarConstant } from "./sidebar-constant";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../ui";
import { useQuery } from "@tanstack/react-query";
import { Link2, Plus, LogOut, User, Store, ChevronRight } from "lucide-react";
import { usePathname } from "next/navigation";
import { useAuth } from "@/hooks/use-auth";
import { useToast } from "@/hooks";


const NavUser = () => {
  const [open, setOpen] = useState(false);
  const { user, logout } = useAuth();

  if (!user) return null;

  return (
    <div className="px-3 py-2">
      <DropdownMenu open={open} onOpenChange={setOpen}>
        <DropdownMenuTrigger className="w-full">
          <div className="flex items-center gap-3 p-2 rounded-lg hover:bg-gray-100 cursor-pointer">
            <div className="w-9 h-9 rounded-full bg-primary text-primary-foreground flex items-center justify-center">
              <User className="w-5 h-5" />
            </div>
            <div className="flex-1 text-left">
              <p className="text-sm font-medium">{(user as any).name || (user as any).username || "User"}</p>
              <p className="text-xs text-gray-500">{user.email}</p>
            </div>
          </div>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-56" align="end">
          <DropdownMenuItem asChild>
            <Link href="/profile" className="cursor-pointer">
              <User className="w-4 h-4 mr-2" />
              Profile
            </Link>
          </DropdownMenuItem>
          <DropdownMenuItem
            className="cursor-pointer text-red-600"
            onClick={logout}
          >
            <LogOut className="w-4 h-4 mr-2" />
            Logout
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
};

const AppSidebar = ({ ...props }: React.ComponentProps<typeof Sidebar>) => {
  const { open } = useSidebar();
  const pathname = usePathname();
  const [expandedItems, setExpandedItems] = useState<Record<string, boolean>>({});

  const isItemActive = (item: any): boolean => {
    if (item.items) {
      return item.items.some((subitem: any) => pathname === subitem.url || pathname.startsWith(subitem.url + "/"));
    }
    return pathname === item.url || pathname.startsWith(item.url + "/");
  };

  React.useEffect(() => {
    const newExpandedItems: Record<string, boolean> = {};
    sidebarConstant.items.forEach((item) => {
      if (isItemActive(item)) {
        newExpandedItems[item.title] = true;
      }
    });
    setExpandedItems(newExpandedItems);
  }, [pathname]);

  const toggleExpand = (title: string) => {
    setExpandedItems((prev) => ({
      ...prev,
      [title]: !prev[title],
    }));
  };

  return (
    <Sidebar collapsible="icon" {...props} className="!p-0 flex flex-col">
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
                <Link href={"/"}>TaleemOne</Link>
              </span>
            </div>
          </SidebarMenuButton>
        </SidebarMenu>

        {open && <SidebarTrigger className="-ml-1" />}
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup className="w-full !p-0 overflow-y-auto">
          <SidebarMenu className={cn("p-3", open ? "px-3.5" : "px-2")}>
            {sidebarConstant.items.map((item, index) => {
              const isActive = isItemActive(item);
              const hasSubItems = item.items && item.items.length > 0;
              const isExpanded = expandedItems[item.title] || isActive;

              return (
                <div key={index}>
                  <SidebarMenuItem className="p-0">
                    {hasSubItems ? (
                      <button
                        onClick={() => toggleExpand(item.title)}
                        className={cn(
                          "w-full px-3 py-2 h-10 hover:bg-gray-100 flex justify-between items-center rounded-md transition-colors",
                          isActive
                            ? "bg-blue-50 border-l-4 border-blue-600 text-blue-600"
                            : ""
                        )}
                      >
                        <div className="flex items-center gap-4">
                          {item.icon && <item.icon className="size-5" />}
                          {open && <span className="text-lg">{item.title}</span>}
                        </div>
                        {open && hasSubItems && (
                          <ChevronRight
                            className={cn(
                              "size-4 transition-transform",
                              isExpanded && "rotate-90"
                            )}
                          />
                        )}
                      </button>
                    ) : (
                      <Link href={item.url} className="w-full">
                        <SidebarMenuButton
                          tooltip={item.title}
                          className={cn(
                            "px-3 py-2 h-10 hover:bg-gray-100 flex justify-between items-center w-full",
                            isActive
                              ? "bg-blue-50 border-l-4 border-blue-600 text-blue-600"
                              : ""
                          )}
                        >
                          <div className="flex items-center gap-4">
                            {item.icon && <item.icon className="size-5" />}
                            {open && <span className="text-lg">{item.title}</span>}
                          </div>
                        </SidebarMenuButton>
                      </Link>
                    )}
                  </SidebarMenuItem>

                  {/* Sub-items */}
                  {hasSubItems && isExpanded && open && (
                    <div className="mt-1 ml-6 space-y-1 border-l border-gray-200 pl-3">
                      {item.items.map((subitem: any, subindex: number) => (
                        <Link key={subindex} href={subitem.url} className="w-full block">
                          <button
                            className={cn(
                              "w-full px-3 py-2 text-sm text-left rounded-md transition-colors hover:bg-gray-100",
                              pathname === subitem.url || pathname.startsWith(subitem.url + "/")
                                ? "bg-blue-50 border-l-4 border-blue-600 text-blue-600"
                                : ""
                            )}
                          >
                            {subitem.title}
                          </button>
                        </Link>
                      ))}
                    </div>
                  )}
                </div>
              );
            })}
          </SidebarMenu>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter className="border-t">
        <NavUser />
      </SidebarFooter>
    </Sidebar>
  );
};

export { AppSidebar };
