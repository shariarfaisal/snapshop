"use client";

import { FC } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAuth } from "@/hooks/use-auth";
import { ROUTES } from "@/lib/routes";
import { cn } from "@/lib/utils";
import {
  LayoutDashboard,
  Users,
  BookOpen,
  Calendar,
  ClipboardList,
  BarChart3,
  DollarSign,
  Bell,
  Settings,
  GraduationCap,
  Award,
} from "lucide-react";

interface SidebarProps {}

const MENU_ITEMS = [
  { label: "Dashboard", icon: LayoutDashboard, href: ROUTES.ADMIN_DASHBOARD, roles: ["super_admin", "admin", "accountant", "teacher", "student", "parent"] },
  { label: "Users", icon: Users, href: ROUTES.ADMIN_USERS, roles: ["super_admin", "admin"] },
  { label: "Classes", icon: BookOpen, href: ROUTES.ADMIN_CLASSES, roles: ["super_admin", "admin"] },
  { label: "Timetable", icon: Calendar, href: ROUTES.ADMIN_TIMETABLE, roles: ["super_admin", "admin", "teacher"] },
  { label: "Attendance", icon: ClipboardList, href: ROUTES.ADMIN_ATTENDANCE, roles: ["super_admin", "admin", "teacher"] },
  { label: "Exams", icon: Award, href: ROUTES.ADMIN_EXAMS, roles: ["super_admin", "admin", "teacher"] },
  { label: "Marks", icon: BarChart3, href: ROUTES.ADMIN_MARKS, roles: ["super_admin", "admin", "teacher"] },
  { label: "Finance", icon: DollarSign, href: ROUTES.ADMIN_FINANCE, roles: ["super_admin", "admin", "accountant"] },
  { label: "Notices", icon: Bell, href: ROUTES.ADMIN_NOTICES, roles: ["super_admin", "admin"] },
  { label: "Reports", icon: BarChart3, href: ROUTES.ADMIN_REPORTS, roles: ["super_admin", "admin"] },
];

export const Sidebar: FC<SidebarProps> = () => {
  const pathname = usePathname();
  const { user, hasRole } = useAuth();

  const visibleItems = MENU_ITEMS.filter((item) =>
    item.roles.some((role) => hasRole(role))
  );

  return (
    <aside className="w-64 bg-slate-900 text-white flex flex-col overflow-hidden">
      <div className="p-6 border-b border-slate-800">
        <h2 className="text-2xl font-bold">EMS</h2>
        <p className="text-xs text-slate-400 mt-1">Education Management</p>
      </div>

      <nav className="flex-1 overflow-y-auto p-4 space-y-2">
        {visibleItems.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href || pathname.startsWith(item.href + "/");

          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center space-x-3 px-4 py-2 rounded-lg transition-colors",
                isActive
                  ? "bg-blue-600 text-white"
                  : "text-slate-300 hover:bg-slate-800 hover:text-white"
              )}
            >
              <Icon className="w-5 h-5" />
              <span className="text-sm font-medium">{item.label}</span>
            </Link>
          );
        })}
      </nav>

      <div className="border-t border-slate-800 p-4">
        <Link
          href={ROUTES.SETTINGS}
          className="flex items-center space-x-3 px-4 py-2 rounded-lg text-slate-300 hover:bg-slate-800 transition-colors"
        >
          <Settings className="w-5 h-5" />
          <span className="text-sm font-medium">Settings</span>
        </Link>
      </div>
    </aside>
  );
};
