import { SidebarProvider } from "@/components";
import { AppSidebar } from "@/components/layout/app-sidebar";
import { LayoutHeader } from "@/components/layout/header";

const UserLayout = ({ children }: { children: React.ReactNode }) => {
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
