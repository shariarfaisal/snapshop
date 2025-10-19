"use client";
import LogoComponent from "@/components/common/logo";
import { SidebarTrigger, useSidebar } from "@/components/ui/sidebar";
import { UserAvatar } from "@/components/user/user-avatar";
import { Bell } from "lucide-react";

export const LayoutHeader = () => {
  const { open } = useSidebar();

  return (
    <header className="sticky h-16 top-0 left-0 py-3 px-4 bg-white border-b ">
      <div className="flex items-center justify-between ">
        <div className="flex items-center gap-4 ">
          {!open && <SidebarTrigger className="-ml-1" />}
          <LogoComponent size="sm" />
        </div>
        <div className="flex items-center gap-4">
          <Bell size={20} />
          <UserAvatar />
        </div>
      </div>
    </header>
  );
};
