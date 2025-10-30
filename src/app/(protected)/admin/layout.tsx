"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
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
} from "lucide-react";
import { Button } from "@/components/ui/button";

const navigation = [
  { name: "Dashboard", href: "/admin/dashboard", icon: LayoutDashboard },
  {
    name: "Academic",
    icon: GraduationCap,
    children: [
      { name: "Academic Years", href: "/admin/academic/years" },
      { name: "Classes", href: "/admin/academic/classes" },
      { name: "Sections", href: "/admin/academic/sections" },
      { name: "Subjects", href: "/admin/academic/subjects" },
      { name: "Timetable", href: "/admin/academic/timetable" },
    ],
  },
  { name: "Students", href: "/admin/students", icon: Users },
  { name: "Teachers", href: "/admin/teachers", icon: UserCheck },
  { name: "Attendance", href: "/admin/attendance", icon: ClipboardCheck },
  {
    name: "Examinations",
    icon: FileText,
    children: [
      { name: "Exams", href: "/admin/exams" },
      { name: "Marks Entry", href: "/admin/exams/results" },
    ],
  },
  {
    name: "Finance",
    icon: DollarSign,
    children: [
      { name: "Fee Structure", href: "/admin/finance/fee-structure" },
      { name: "Invoices", href: "/admin/finance/invoices" },
      { name: "Payments", href: "/admin/finance/payments" },
      { name: "Reports", href: "/admin/finance/reports" },
    ],
  },
  {
    name: "Communications",
    icon: MessageSquare,
    children: [
      { name: "Notices", href: "/admin/communications/notices" },
      { name: "Messages", href: "/admin/communications/messages" },
      { name: "Notifications", href: "/admin/communications/notifications" },
    ],
  },
  { name: "Reports", href: "/admin/reports", icon: BarChart3 },
  { name: "Settings", href: "/admin/settings", icon: Settings },
];

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [expandedItems, setExpandedItems] = useState<string[]>([]);

  const toggleExpand = (name: string) => {
    setExpandedItems((prev) =>
      prev.includes(name) ? prev.filter((item) => item !== name) : [...prev, name]
    );
  };

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Mobile sidebar overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-black bg-opacity-50 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={cn(
          "fixed inset-y-0 left-0 z-50 w-64 bg-white shadow-lg transform transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static lg:inset-0",
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        <div className="flex items-center justify-between h-16 px-6 border-b">
          <h1 className="text-xl font-bold text-gray-900">EMS Admin</h1>
          <Button
            variant="ghost"
            size="icon"
            className="lg:hidden"
            onClick={() => setSidebarOpen(false)}
          >
            <X className="h-5 w-5" />
          </Button>
        </div>

        <nav className="flex-1 overflow-y-auto p-4 space-y-1">
          {navigation.map((item) => {
            if (item.children) {
              const isExpanded = expandedItems.includes(item.name);
              return (
                <div key={item.name}>
                  <button
                    onClick={() => toggleExpand(item.name)}
                    className={cn(
                      "flex items-center justify-between w-full px-3 py-2 text-sm font-medium rounded-md hover:bg-gray-100",
                      "text-gray-700"
                    )}
                  >
                    <div className="flex items-center">
                      <item.icon className="mr-3 h-5 w-5" />
                      {item.name}
                    </div>
                    <ChevronDown
                      className={cn(
                        "h-4 w-4 transition-transform",
                        isExpanded && "transform rotate-180"
                      )}
                    />
                  </button>
                  {isExpanded && (
                    <div className="ml-8 mt-1 space-y-1">
                      {item.children.map((child) => (
                        <Link
                          key={child.href}
                          href={child.href}
                          className={cn(
                            "block px-3 py-2 text-sm rounded-md hover:bg-gray-100",
                            pathname === child.href
                              ? "bg-blue-50 text-blue-700 font-medium"
                              : "text-gray-600"
                          )}
                        >
                          {child.name}
                        </Link>
                      ))}
                    </div>
                  )}
                </div>
              );
            }

            return (
              <Link
                key={item.name}
                href={item.href}
                className={cn(
                  "flex items-center px-3 py-2 text-sm font-medium rounded-md hover:bg-gray-100",
                  pathname === item.href
                    ? "bg-blue-50 text-blue-700"
                    : "text-gray-700"
                )}
              >
                <item.icon className="mr-3 h-5 w-5" />
                {item.name}
              </Link>
            );
          })}
        </nav>
      </aside>

      {/* Main content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top bar */}
        <header className="h-16 bg-white shadow-sm">
          <div className="h-full px-4 flex items-center justify-between">
            <Button
              variant="ghost"
              size="icon"
              className="lg:hidden"
              onClick={() => setSidebarOpen(true)}
            >
              <Menu className="h-5 w-5" />
            </Button>
            <div className="flex-1" />
            <div className="flex items-center space-x-4">
              <span className="text-sm text-gray-700">Admin User</span>
            </div>
          </div>
        </header>

        {/* Page content */}
        <main className="flex-1 overflow-y-auto bg-gray-50">
          {children}
        </main>
      </div>
    </div>
  );
}
