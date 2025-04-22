"use client";
import { AppSidebar } from "@/components/layout/app-sidebar";
import { LayoutHeader } from "@/components/layout/header";
import { SidebarProvider } from "@/components/ui/sidebar";
import { useAuth } from "@/hooks/use-auth";
import { useEffect } from "react";


const UserLayout = ({ children }: { children: React.ReactNode }) => {
  const { getProfile } = useAuth();
  
  useEffect(() => {
    getProfile();
  }, []);

  return (
    <SidebarProvider>
      <AppSidebar></AppSidebar>
      <main className="relative max-w-full max-h-[100vh] overflow-auto scroll-smooth flex-1 ">
        <LayoutHeader />
        {children}
      </main>
    </SidebarProvider>
  );
};

export default UserLayout;
