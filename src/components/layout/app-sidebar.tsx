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
import { STORE_API } from "@/services";
import { Link2, Plus } from "lucide-react";
import { usePathname } from "next/navigation";

const AddProduct = () => {
  const { data } = useQuery({
    queryKey: ["stores"],
    queryFn: STORE_API.getStores,
  });
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  return (
    <>
      <DropdownMenu open={open} onOpenChange={setOpen}>
        <DropdownMenuTrigger asChild>
          <SidebarMenuItem className="p-0">
            <SidebarMenuButton
              key={100}
              tooltip={"Add Product"}
              className={`px-3 py-2 h-10 hover:bg-gray-100  flex justify-between  items-center ${
                pathname.startsWith("/add-product")
                  ? "bg-slate-100 text-green-600"
                  : ""
              }`}
            >
              <div className="flex items-center gap-4">
                <Plus className="size-5" />
                <span>Add Product</span>
              </div>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-56">
          {data?.map((store) => {
            return (
              <DropdownMenuItem key={store.id} onClick={() => setOpen(false)}>
                <Link href={`/add-product/${store.id}`}>
                  <div>{store.name}</div>
                  <p className=" text-lg text-gray-500 flex items-center gap-1">
                    <Link2 className="w-4" />
                    {store.domain}
                  </p>
                </Link>
              </DropdownMenuItem>
            );
          })}
        </DropdownMenuContent>
      </DropdownMenu>
    </>
  );
};

const AppSidebar = ({ ...props }: React.ComponentProps<typeof Sidebar>) => {
  const { open } = useSidebar();
  const pathname = usePathname();

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
          <SidebarMenu className={cn("p-3", open ? "px-3.5" : "px-2")}>
            <AddProduct />
            {sidebarConstant.items.map((item, index) => (
              <SidebarMenuItem key={index} className="p-0">
                <Link href={item.url}>
                  <SidebarMenuButton
                    tooltip={item.title}
                    className={`px-3 py-2 h-10 hover:bg-gray-100  flex justify-between  items-center ${
                      pathname !== "/" && item.url.startsWith(pathname)
                        ? "bg-slate-100 text-green-600"
                        : ""
                    }`}
                  >
                    <div className="flex items-center gap-4">
                      {item.icon && <item.icon className="size-5" />}
                      <span className="text-lg">{item.title}</span>
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
