"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { cn } from "@/lib/utils";
import {
  LayoutDashboard,
  GraduationCap,
  Users,
  UserCheck,
  ClipboardCheck,
  FileText,
  DollarSign,
  MessageSquare,
  BarChart3,
  Settings,
  Menu,
  X,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  User,
  LogOut,
  HelpCircle,
  PanelRight,
  PanelRightOpen,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { useAuthStore } from "@/store/auth-store";
import { usePermissions } from "@/hooks/use-permissions";

interface NavigationItem {
  name: string;
  href?: string;
  icon?: any;
  children?: { name: string; href: string; permissions?: string | string[] }[];
  requiredRole?: string;
  permissions?: string | string[];
  requireAllPermissions?: boolean;
  section?: string;
  isDivider?: boolean;
  dividerLabel?: string;
}

const navigation: NavigationItem[] = [
  {
    name: "Dashboard",
    href: "/admin/dashboard",
    icon: LayoutDashboard,
    section: "admin",
    requiredRole: "admin",
    permissions: "readAll-dashboard",
  },
  {
    name: "Academic",
    icon: GraduationCap,
    section: "admin",
    requiredRole: "admin",
    children: [
      {
        name: "Academic Years",
        href: "/admin/academic/years",
        permissions: "readAll-academicYear",
      },
      { name: "Classes", href: "/admin/academic/classes", permissions: "readAll-schoolClass" },
      { name: "Sections", href: "/admin/academic/sections", permissions: "readAll-section" },
      { name: "Subjects", href: "/admin/academic/subjects", permissions: "readAll-subject" },
      { name: "Timetable", href: "/admin/academic/timetable", permissions: "readAll-timetable" },
      { name: "Rooms", href: "/admin/academic/rooms", permissions: "readAll-room" },
    ],
  },
  {
    name: "Students",
    href: "/admin/students",
    icon: Users,
    section: "admin",
    requiredRole: "admin",
    permissions: "readAll-student",
  },
  {
    name: "Teachers",
    href: "/admin/teachers",
    icon: UserCheck,
    section: "admin",
    requiredRole: "admin",
    permissions: "readAll-teacher",
  },
  {
    name: "Attendance",
    href: "/admin/attendance",
    icon: ClipboardCheck,
    section: "admin",
    requiredRole: "admin",
    permissions: "readAll-attendance",
  },
  {
    name: "Examinations",
    icon: FileText,
    section: "admin",
    requiredRole: "admin",
    children: [
      { name: "Exams", href: "/admin/exams", permissions: "readAll-exam" },
      { name: "Exam Rooms", href: "/admin/exams/rooms", permissions: "readAll-examRoom" },
      {
        name: "Participants",
        href: "/admin/exams/participants",
        permissions: "readAll-examParticipant",
      },
      { name: "Seat Plan", href: "/admin/exams/seat-plan", permissions: "readAll-seatPlan" },
      { name: "Admit Cards", href: "/admin/exams/admit-cards", permissions: "readAll-admitCard" },
      { name: "Merit List", href: "/admin/exams/merit-list", permissions: "readAll-meritList" },
      { name: "Exam Routine", href: "/admin/exams/schedule", permissions: "readAll-examSchedule" },
      {
        name: "Marks Entry",
        href: "/admin/exams/results",
        permissions: ["readAll-examResult", "readAll-marks"],
      },
    ],
  },
  {
    name: "Finance",
    icon: DollarSign,
    section: "admin",
    requiredRole: "admin",
    children: [
      {
        name: "Fee Structure",
        href: "/admin/finance/fee-structure",
        permissions: "readAll-feeStructure",
      },
      { name: "Invoices", href: "/admin/finance/invoices", permissions: "readAll-invoice" },
      { name: "Payments", href: "/admin/finance/payments", permissions: "readAll-payment" },
      { name: "Reports", href: "/admin/finance/reports", permissions: "readAll-financeReport" },
    ],
  },
  {
    name: "Communications",
    icon: MessageSquare,
    section: "admin",
    requiredRole: "admin",
    children: [
      { name: "Notices", href: "/admin/communications/notices", permissions: "readAll-notice" },
      { name: "Messages", href: "/admin/communications/messages", permissions: "readAll-message" },
      {
        name: "Notifications",
        href: "/admin/communications/notifications",
        permissions: "readAll-notification",
      },
    ],
  },
  {
    name: "Reports",
    href: "/admin/reports",
    icon: BarChart3,
    section: "admin",
    requiredRole: "admin",
    permissions: "readAll-report",
  },

  // Teacher Section Divider
  {
    isDivider: true,
    dividerLabel: "TEACHER TOOLS",
    section: "teacher",
    requiredRole: "teacher",
    name: "",
  },

  {
    name: "Teacher Dashboard",
    href: "/admin/teacher/dashboard",
    icon: LayoutDashboard,
    section: "teacher",
    requiredRole: "teacher",
    permissions: "readAll-teacherDashboard",
  },
  {
    name: "My Classes",
    href: "/admin/teacher/classes",
    icon: GraduationCap,
    section: "teacher",
    requiredRole: "teacher",
    permissions: "readAll-teacherClass",
  },
  {
    name: "My Attendance",
    href: "/admin/teacher/attendance",
    icon: ClipboardCheck,
    section: "teacher",
    requiredRole: "teacher",
    permissions: "create-attendance",
  },
  {
    name: "Marks & Grades",
    href: "/admin/teacher/marks",
    icon: FileText,
    section: "teacher",
    requiredRole: "teacher",
    permissions: ["readAll-marks", "create-marks"],
  },
  {
    name: "Assignments",
    href: "/admin/teacher/assignments",
    icon: ClipboardCheck,
    section: "teacher",
    requiredRole: "teacher",
    permissions: "readAll-assignment",
  },
  {
    name: "Lesson Plans",
    href: "/admin/teacher/lesson-plans",
    icon: FileText,
    section: "teacher",
    requiredRole: "teacher",
    permissions: "readAll-lessonPlan",
  },

  // Common Section Divider
  { isDivider: true, dividerLabel: "SETTINGS", section: "common", name: "" },

  {
    name: "Settings",
    icon: Settings,
    section: "common",
    children: [
      { name: "Institute", href: "/admin/settings/institute", permissions: "update-institute" },
      {
        name: "Organization",
        href: "/admin/settings/organization",
        permissions: "readAll-organization",
      },
      { name: "Profile", href: "/admin/settings/profile", permissions: "update-profile" },
      { name: "Branding", href: "/admin/settings/branding", permissions: "update-branding" },
      { name: "Roles", href: "/admin/settings/roles", permissions: "readAll-role" },
      {
        name: "Permissions",
        href: "/admin/settings/permissions",
        permissions: "readAll-permission",
      },
      { name: "System", href: "/admin/settings/system", permissions: "readAll-systemSetting" },
      { name: "Security", href: "/admin/settings/security", permissions: "update-security" },
      {
        name: "Departments",
        href: "/admin/settings/departments",
        permissions: "readAll-department",
      },
      {
        name: "Designations",
        href: "/admin/settings/designations",
        permissions: "readAll-designation",
      },
    ],
  },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const { user, logout, hasRole } = useAuthStore();
  const { hasPermission, hasAnyPermission } = usePermissions();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [expandedItems, setExpandedItems] = useState<string[]>([]);

  // Auto-expand parent menu items when child is active
  useEffect(() => {
    const activeParent = navigation.find((item) =>
      item.children?.some((child) => pathname === child.href)
    );
    if (activeParent && !expandedItems.includes(activeParent.name)) {
      setExpandedItems((prev) => [...prev, activeParent.name]);
    }
  }, [pathname]);

  const toggleExpand = (name: string) => {
    setExpandedItems((prev) =>
      prev.includes(name) ? prev.filter((item) => item !== name) : [...prev, name]
    );
  };

  const handleLogout = async () => {
    await logout();
    router.push("/auth/login");
  };

  // Get user initials for avatar
  const getUserInitials = () => {
    if (!user) return "U";
    if (user.firstName && user.lastName) {
      return `${user.firstName[0]}${user.lastName[0]}`.toUpperCase();
    }
    if (user.name) {
      const nameParts = user.name.split(" ");
      if (nameParts.length >= 2) {
        return `${nameParts[0][0]}${nameParts[1][0]}`.toUpperCase();
      }
      return user.name[0].toUpperCase();
    }
    return user.email[0].toUpperCase();
  };

  const getDisplayName = () => {
    if (!user) return "User";
    if (user.firstName && user.lastName) {
      return `${user.firstName} ${user.lastName}`;
    }
    return user.name || user.email;
  };

  // Helper function to check if user has permission for a navigation item
  const hasPermissionForItem = (permissions?: string | string[]): boolean => {
    if (!permissions) return true; // No permission required

    if (typeof permissions === "string") {
      return hasPermission(permissions);
    }

    if (Array.isArray(permissions)) {
      // User needs ANY of the permissions
      return hasAnyPermission(permissions);
    }

    return false;
  };

  // Helper function to check if parent menu should be shown (if ANY child has permission)
  const hasPermissionForChildren = (children?: { permissions?: string | string[] }[]): boolean => {
    if (!children || children.length === 0) return false;
    return children.some((child) => hasPermissionForItem(child.permissions));
  };

  return (
    <TooltipProvider delayDuration={300}>
      <div className="flex h-screen bg-white overflow-hidden">
        {/* Mobile sidebar overlay */}
        {sidebarOpen && (
          <div
            className="fixed inset-0 z-40 bg-black/50 lg:hidden"
            onClick={() => setSidebarOpen(false)}
          />
        )}

        {/* Sidebar */}
        <aside
          className={cn(
            "fixed inset-y-0 left-0 z-50 bg-gradient-to-b from-slate-900 via-slate-800 to-slate-900 border-r border-slate-700 transform transition-all duration-200 ease-in-out lg:translate-x-0 lg:static lg:inset-0 flex flex-col",
            sidebarOpen ? "translate-x-0" : "-translate-x-full",
            sidebarCollapsed ? "lg:w-16 w-64" : "w-64"
          )}
        >
          {/* Header */}
          <div
            className={cn(
              "flex items-center justify-between h-16 border-b border-slate-700 flex-shrink-0",
              !sidebarCollapsed ? "px-6" : "px-3"
            )}
          >
            {!sidebarCollapsed && <h1 className="text-xl font-bold text-white">E-Campus</h1>}
            <div className="flex items-center gap-1">
              <Button
                variant="ghost"
                size="icon"
                className="hidden lg:flex text-slate-400 hover:text-white hover:bg-slate-700"
                onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
                title={sidebarCollapsed ? "Expand sidebar" : "Collapse sidebar"}
              >
                {sidebarCollapsed ? (
                  <PanelRightOpen className="h-4 w-4" />
                ) : (
                  <PanelRight className="h-4 w-4" />
                )}
              </Button>
              <Button
                variant="ghost"
                size="icon"
                className="lg:hidden text-slate-400 hover:text-white hover:bg-slate-700"
                onClick={() => setSidebarOpen(false)}
              >
                <X className="h-5 w-5" />
              </Button>
            </div>
          </div>

          {/* Navigation - Scrollable */}
          <nav className="flex-1 overflow-y-auto p-3 space-y-2 sidebar-scrollbar">
            {navigation
              .filter((item) => {
                // Show dividers if the section has visible items
                if (item.isDivider) {
                  if (item.requiredRole === "teacher") {
                    return hasRole("Teacher");
                  }
                  return true; // Show common dividers
                }

                // For items with children, show if user has permission for ANY child
                if (item.children && item.children.length > 0) {
                  return hasPermissionForChildren(item.children);
                }

                // For items without children, check the item's own permissions
                return hasPermissionForItem(item.permissions);
              })
              .map((item) => {
                // Render divider
                if (item.isDivider) {
                  return (
                    <div key={item.dividerLabel} className="pt-4 pb-2">
                      {!sidebarCollapsed && (
                        <div className="px-3">
                          <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
                            {item.dividerLabel}
                          </p>
                          <div className="mt-2 border-t border-slate-700"></div>
                        </div>
                      )}
                      {sidebarCollapsed && <div className="border-t border-slate-700 mx-2"></div>}
                    </div>
                  );
                }

                if (item.children) {
                  const isExpanded = expandedItems.includes(item.name);
                  const hasActiveChild = item.children.some(
                    (child) => pathname === child.href + "/"
                  );

                  const menuButton = (
                    <button
                      onClick={() => !sidebarCollapsed && toggleExpand(item.name)}
                      className={cn(
                        "flex items-center w-full px-3 py-2.5 text-[15px] font-semibold rounded-md transition-colors",
                        hasActiveChild
                          ? "bg-slate-700 text-white"
                          : "text-slate-300 hover:bg-slate-700 hover:text-white",
                        sidebarCollapsed ? "justify-center" : "justify-between"
                      )}
                    >
                      <div className="flex items-center">
                        <item.icon
                          className={cn("h-[18px] w-[18px]", !sidebarCollapsed && "mr-3")}
                        />
                        {!sidebarCollapsed && item.name}
                      </div>
                      {!sidebarCollapsed && (
                        <ChevronDown
                          className={cn(
                            "h-4 w-4 transition-transform",
                            isExpanded && "transform rotate-180"
                          )}
                        />
                      )}
                    </button>
                  );

                  return (
                    <div key={item.name}>
                      {sidebarCollapsed ? (
                        <Tooltip>
                          <TooltipTrigger asChild>{menuButton}</TooltipTrigger>
                          <TooltipContent side="right">{item.name}</TooltipContent>
                        </Tooltip>
                      ) : (
                        menuButton
                      )}
                      {isExpanded && !sidebarCollapsed && (
                        <div className="ml-7 mt-1 space-y-0.5">
                          {item.children
                            .filter((child) => hasPermissionForItem(child.permissions))
                            .map((child) => {
                              return (
                                <Link
                                  key={child.href}
                                  href={child.href}
                                  className={cn(
                                    "block px-3 py-2 text-[15px] font-medium rounded-md transition-colors hover:bg-slate-800",
                                    pathname === child.href + "/"
                                      ? "text-blue-600 bg-slate-900"
                                      : "text-white"
                                  )}
                                >
                                  {child.name}
                                </Link>
                              );
                            })}
                        </div>
                      )}
                    </div>
                  );
                }

                const isActive = pathname === item.href || pathname === item.href + "/";

                const menuLink = (
                  <Link
                    href={item.href || ""}
                    className={cn(
                      "flex items-center px-3 py-2.5 text-[15px] font-semibold rounded-md transition-colors",
                      isActive
                        ? "bg-slate-600 text-white shadow-lg"
                        : "text-slate-300 hover:bg-slate-700 hover:text-white",
                      sidebarCollapsed && "justify-center"
                    )}
                  >
                    <item.icon className={cn("h-[18px] w-[18px]", !sidebarCollapsed && "mr-3")} />
                    {!sidebarCollapsed && item.name}
                  </Link>
                );

                return sidebarCollapsed ? (
                  <Tooltip key={item.name}>
                    <TooltipTrigger asChild>{menuLink}</TooltipTrigger>
                    <TooltipContent side="right">{item.name}</TooltipContent>
                  </Tooltip>
                ) : (
                  <div key={item.name}>{menuLink}</div>
                );
              })}
          </nav>
        </aside>

        {/* Main content */}
        <div className="flex-1 flex flex-col overflow-hidden">
          {/* Top bar */}
          <header className="h-16 bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 border-b border-slate-700">
            <div className="h-full px-6 flex items-center justify-between">
              <Button
                variant="ghost"
                size="icon"
                className="lg:hidden text-slate-300 hover:text-white hover:bg-slate-700"
                onClick={() => setSidebarOpen(true)}
              >
                <Menu className="h-5 w-5" />
              </Button>
              <div className="flex-1" />

              {/* Profile Menu */}
              <div className="flex items-center gap-3">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <button className="flex items-center gap-3 h-11 px-4 rounded-lg hover:bg-slate-700  transition-all focus:outline-none focus-visible:ring-0 focus-visible:ring-offset-0">
                      <div className="flex items-center justify-center h-9 w-9 rounded-full bg-gradient-to-br from-blue-500 to-blue-700 text-white text-sm font-bold shadow-lg shadow-blue-500/30">
                        {getUserInitials()}
                      </div>
                      <div className="hidden md:flex flex-col items-start">
                        <span className="text-sm font-semibold text-white">{getDisplayName()}</span>
                        <span className="text-xs text-slate-400">
                          {user?.roles?.[0]?.name || "Admin"}
                        </span>
                      </div>
                      <ChevronDown className="h-4 w-4 text-slate-400" />
                    </button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent
                    align="end"
                    className="w-64 bg-gradient-to-br from-slate-900 to-slate-800 border-slate-700 p-2"
                  >
                    <DropdownMenuLabel className="px-3 py-3">
                      <div className="flex items-center gap-3">
                        <div className="flex items-center justify-center h-10 w-10 rounded-full bg-gradient-to-br from-blue-500 to-blue-700 text-white text-sm font-bold shadow-lg shadow-blue-500/30">
                          {getUserInitials()}
                        </div>
                        <div className="flex flex-col">
                          <p className="text-sm font-semibold text-white">{getDisplayName()}</p>
                          <p className="text-xs text-slate-400">{user?.email}</p>
                        </div>
                      </div>
                    </DropdownMenuLabel>
                    <DropdownMenuSeparator className="bg-slate-700 my-2" />
                    <DropdownMenuItem asChild>
                      <Link
                        href="/admin/settings/profile"
                        className="cursor-pointer flex items-center px-3 py-2.5 rounded-md text-slate-300 hover:bg-slate-700 hover:text-white transition-colors"
                      >
                        <User className="mr-3 h-[18px] w-[18px]" />
                        <span className="font-medium">Profile Settings</span>
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <Link
                        href="/admin/settings"
                        className="cursor-pointer flex items-center px-3 py-2.5 rounded-md text-slate-300 hover:bg-slate-700 hover:text-white transition-colors"
                      >
                        <Settings className="mr-3 h-[18px] w-[18px]" />
                        <span className="font-medium">Account Settings</span>
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuSeparator className="bg-slate-700 my-2" />
                    <DropdownMenuItem asChild>
                      <a
                        href="#"
                        className="cursor-pointer flex items-center px-3 py-2.5 rounded-md text-slate-300 hover:bg-slate-700 hover:text-white transition-colors"
                      >
                        <HelpCircle className="mr-3 h-[18px] w-[18px]" />
                        <span className="font-medium">Help & Support</span>
                      </a>
                    </DropdownMenuItem>
                    <DropdownMenuSeparator className="bg-slate-700 my-2" />
                    <DropdownMenuItem
                      onClick={handleLogout}
                      className="cursor-pointer flex items-center px-3 py-2.5 rounded-md text-red-400 hover:text-red-300 hover:bg-red-500/10 transition-colors"
                    >
                      <LogOut className="mr-3 h-[18px] w-[18px]" />
                      <span className="font-medium">Sign Out</span>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>
          </header>

          {/* Page content */}
          <main className="flex-1 overflow-y-auto bg-gray-50">{children}</main>
        </div>
      </div>
    </TooltipProvider>
  );
}
