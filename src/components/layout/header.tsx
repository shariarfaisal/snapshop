"use client";
import { SidebarTrigger, useSidebar } from "@/components";

export const LayoutHeader = () => {
  const { open } = useSidebar();

  return (
    <header className="sticky h-16 top-0 left-0 py-3 px-4 bg-white border-b ">
      <div className="flex items-center justify-between ">
        <div className="flex items-center gap-4 ">
          {!open && <SidebarTrigger className="-ml-1" />}
        </div>
        <div className="flex items-center gap-4"></div>
      </div>
    </header>
  );
};
