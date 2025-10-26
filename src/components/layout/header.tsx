"use client";
import LogoComponent from "@/components/common/logo";
import { SidebarTrigger, useSidebar } from "@/components/ui/sidebar";
import { UserAvatar } from "@/components/user/user-avatar";
import { ThemeToggle } from "@/components/theme-toggle";
import { Bell } from "lucide-react";
import { usePathname } from "next/navigation";
import {
  Breadcrumb,
  BreadcrumbList,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbSeparator,
  BreadcrumbPage,
} from "@/components/ui/breadcrumb";

const generateBreadcrumbs = (pathname: string) => {
  const parts = pathname.split("/").filter(Boolean);
  return parts.map((part, index) => ({
    label: part.charAt(0).toUpperCase() + part.slice(1).replace("-", " "),
    href: "/" + parts.slice(0, index + 1).join("/"),
    isLast: index === parts.length - 1,
  }));
};

export const LayoutHeader = () => {
  const { open } = useSidebar();
  const pathname = usePathname();
  const breadcrumbs = generateBreadcrumbs(pathname);

  return (
    <header className="sticky top-0 left-0 z-40 bg-white border-b">
      <div className="flex items-center justify-between px-4 py-3">
        <div className="flex items-center gap-4">
          {!open && <SidebarTrigger className="-ml-1" />}
          <LogoComponent size="sm" />
        </div>
        <div className="flex items-center gap-4">
          <Bell size={20} className="cursor-pointer hover:text-gray-600" />
          <ThemeToggle />
          <UserAvatar />
        </div>
      </div>
      {breadcrumbs.length > 0 && (
        <div className="px-4 py-2 border-t bg-gray-50">
          <Breadcrumb>
            <BreadcrumbList>
              <BreadcrumbItem>
                <BreadcrumbLink href="/admin">Dashboard</BreadcrumbLink>
              </BreadcrumbItem>
              {breadcrumbs.map((crumb, index) => (
                <div key={index} className="flex items-center gap-1.5">
                  <BreadcrumbSeparator />
                  {crumb.isLast ? (
                    <BreadcrumbPage>{crumb.label}</BreadcrumbPage>
                  ) : (
                    <BreadcrumbItem>
                      <BreadcrumbLink href={crumb.href}>
                        {crumb.label}
                      </BreadcrumbLink>
                    </BreadcrumbItem>
                  )}
                </div>
              ))}
            </BreadcrumbList>
          </Breadcrumb>
        </div>
      )}
    </header>
  );
};
