"use client";

import { FC, useState } from "react";
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
  ChevronDown,
  ChevronRight,
  MapPin,
  UserCheck,
  Grid3x3,
  CreditCard,
  Trophy,
  CalendarDays,
  FileText,
} from "lucide-react";

interface SidebarProps {}

interface SubMenuItem {
  label: string;
  icon: any;
  href: string;
  roles: string[];
}

interface MenuItem {
  label: string;
  icon: any;
  href?: string;
  roles: string[];
  subItems?: SubMenuItem[];
}

const MENU_ITEMS: MenuItem[] = [
  { label: "Dashboard", icon: LayoutDashboard, href: ROUTES.ADMIN_DASHBOARD, roles: ["super_admin", "admin", "accountant", "teacher", "student", "parent"] },
  { label: "Classes", icon: BookOpen, href: ROUTES.ADMIN_CLASSES, roles: ["super_admin", "admin"] },
  { label: "Sections", icon: BookOpen, href: ROUTES.ADMIN_SECTIONS, roles: ["super_admin", "admin"] },
  { label: "Subjects", icon: BookOpen, href: ROUTES.ADMIN_SUBJECTS, roles: ["super_admin", "admin"] },
  { label: "Timetable", icon: Calendar, href: ROUTES.ADMIN_TIMETABLE, roles: ["super_admin", "admin", "teacher"] },
  { label: "Rooms", icon: MapPin, href: "/admin/rooms", roles: ["super_admin", "admin"] },
  { label: "Students", icon: Users, href: "/admin/students", roles: ["super_admin", "admin", "teacher"] },
  { label: "Teachers", icon: GraduationCap, href: "/admin/teachers", roles: ["super_admin", "admin"] },
  { label: "Attendance", icon: ClipboardList, href: ROUTES.ADMIN_ATTENDANCE, roles: ["super_admin", "admin", "teacher"] },
  {
    label: "Examinations",
    icon: Award,
    href: ROUTES.ADMIN_EXAMS,
    roles: ["super_admin", "admin", "teacher"],
    subItems: [
      { label: "Exams", icon: FileText, href: ROUTES.ADMIN_EXAMS, roles: ["super_admin", "admin", "teacher"] },
      { label: "Exam Rooms", icon: MapPin, href: ROUTES.ADMIN_EXAMS_ROOMS, roles: ["super_admin", "admin"] },
      { label: "Participants", icon: UserCheck, href: ROUTES.ADMIN_EXAMS_PARTICIPANTS, roles: ["super_admin", "admin"] },
      { label: "Seat Plan", icon: Grid3x3, href: ROUTES.ADMIN_EXAMS_SEAT_PLAN, roles: ["super_admin", "admin"] },
      { label: "Admit Cards", icon: CreditCard, href: ROUTES.ADMIN_EXAMS_ADMIT_CARDS, roles: ["super_admin", "admin"] },
      { label: "Merit List", icon: Trophy, href: ROUTES.ADMIN_EXAMS_MERIT_LIST, roles: ["super_admin", "admin", "teacher"] },
      { label: "Exam Routine", icon: CalendarDays, href: ROUTES.ADMIN_EXAMS_SCHEDULE, roles: ["super_admin", "admin", "teacher"] },
      { label: "Marks Entry", icon: BarChart3, href: ROUTES.ADMIN_EXAMS_RESULTS, roles: ["super_admin", "admin", "teacher"] },
      { label: "Results", icon: BarChart3, href: ROUTES.ADMIN_MARKS, roles: ["super_admin", "admin", "teacher"] },
    ]
  },
  { label: "Finance", icon: DollarSign, href: ROUTES.ADMIN_FINANCE, roles: ["super_admin", "admin", "accountant"] },
  { label: "Communications", icon: Bell, href: ROUTES.ADMIN_COMMUNICATION, roles: ["super_admin", "admin"] },
  { label: "Reports", icon: BarChart3, href: ROUTES.ADMIN_REPORTS, roles: ["super_admin", "admin"] },
];

export const Sidebar: FC<SidebarProps> = () => {
  const pathname = usePathname();
  const { user, hasRole } = useAuth();
  const [expandedItems, setExpandedItems] = useState<string[]>([]);

  const visibleItems = MENU_ITEMS.filter((item) =>
    item.roles.some((role) => hasRole(role))
  );

  const toggleExpanded = (label: string) => {
    setExpandedItems((prev) =>
      prev.includes(label) ? prev.filter((item) => item !== label) : [...prev, label]
    );
  };

  const renderMenuItem = (item: MenuItem) => {
    const Icon = item.icon;
    const hasSubItems = item.subItems && item.subItems.length > 0;
    const isExpanded = expandedItems.includes(item.label);
    const isActive = item.href && (pathname === item.href || pathname.startsWith(item.href + "/"));
    const isParentActive = hasSubItems && item.subItems?.some((sub) => pathname === sub.href);

    // Filter sub-items based on roles
    const visibleSubItems = item.subItems?.filter((subItem) =>
      subItem.roles.some((role) => hasRole(role))
    );

    if (hasSubItems) {
      return (
        <div key={item.label}>
          <button
            onClick={() => toggleExpanded(item.label)}
            className={cn(
              "w-full flex items-center justify-between px-4 py-2 rounded-lg transition-colors",
              isParentActive
                ? "bg-blue-600 text-white"
                : "text-slate-300 hover:bg-slate-800 hover:text-white"
            )}
          >
            <div className="flex items-center space-x-3">
              <Icon className="w-5 h-5" />
              <span className="text-sm font-medium">{item.label}</span>
            </div>
            {isExpanded ? (
              <ChevronDown className="w-4 h-4" />
            ) : (
              <ChevronRight className="w-4 h-4" />
            )}
          </button>

          {isExpanded && visibleSubItems && (
            <div className="ml-4 mt-1 space-y-1">
              {visibleSubItems.map((subItem) => {
                const SubIcon = subItem.icon;
                const isSubActive = pathname === subItem.href;

                return (
                  <Link
                    key={subItem.href}
                    href={subItem.href}
                    className={cn(
                      "flex items-center space-x-3 px-4 py-2 rounded-lg transition-colors text-sm",
                      isSubActive
                        ? "bg-blue-500 text-white"
                        : "text-slate-400 hover:bg-slate-800 hover:text-white"
                    )}
                  >
                    <SubIcon className="w-4 h-4" />
                    <span>{subItem.label}</span>
                  </Link>
                );
              })}
            </div>
          )}
        </div>
      );
    }

    return (
      <Link
        key={item.href}
        href={item.href!}
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
  };

  return (
    <aside className="w-64 bg-slate-900 text-white flex flex-col overflow-hidden">
      <div className="p-6 border-b border-slate-800">
        <h2 className="text-2xl font-bold">EMS</h2>
        <p className="text-xs text-slate-400 mt-1">Education Management</p>
      </div>

      <nav className="flex-1 overflow-y-auto p-4 space-y-2">
        {visibleItems.map((item) => renderMenuItem(item))}
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
