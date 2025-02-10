"use client";
import { SidebarProvider } from "@/components";
import { AppSidebar } from "@/components/layout/app-sidebar";
import { LayoutHeader } from "@/components/layout/header";
import { STORE_API } from "@/services";
import { AUTH_API } from "@/services/auth";
import { useAppStore } from "@/store/useAppStore";
import { useQuery } from "@tanstack/react-query";
import { useEffect } from "react";

const UserLayout = ({ children }: { children: React.ReactNode }) => {
  const { data: stores } = useQuery({
    queryKey: ["stores"],
    queryFn: STORE_API.getStores,
  });
  const { setStores, setUser } = useAppStore();

  const { data: user } = useQuery({
    queryKey: ["user"],
    queryFn: AUTH_API.getMe,
  });

  useEffect(() => {
    if (stores) {
      setStores(stores);
    }
    if (user) {
      setUser(user);
    }
  }, [stores, setStores, user, setUser]);

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
