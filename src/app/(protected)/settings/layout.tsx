"use client";
import { useState } from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { cn } from "@/lib/utils";
import {
  Building,
  Users,
  Bell,
  Shield,
  User,
  Palette,
} from "lucide-react";

interface TabConfig {
  id: string;
  label: string;
  icon: React.ReactNode;
  description: string;
  href: string;
}

const TABS: TabConfig[] = [
  {
    id: "institute",
    label: "Institute",
    icon: <Building className="h-5 w-5" />,
    description: "Basic institute information",
    href: "/settings/institute",
  },
  {
    id: "organization",
    label: "Organization",
    icon: <Users className="h-5 w-5" />,
    description: "Departments & designations",
    href: "/settings/organization",
  },
  {
    id: "profile",
    label: "Profile",
    icon: <User className="h-5 w-5" />,
    description: "Your profile settings",
    href: "/settings/profile",
  },
  {
    id: "branding",
    label: "Branding",
    icon: <Palette className="h-5 w-5" />,
    description: "Visual appearance",
    href: "/settings/branding",
  },
  {
    id: "system",
    label: "System",
    icon: <Bell className="h-5 w-5" />,
    description: "System configuration",
    href: "/settings/system",
  },
  {
    id: "security",
    label: "Security",
    icon: <Shield className="h-5 w-5" />,
    description: "Security & permissions",
    href: "/settings/security",
  },
];

export default function SettingsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Settings</h1>
        <p className="text-gray-500 mt-1">Manage system configuration and preferences</p>
      </div>

      <div className="flex gap-6">
        {/* Side Navigation */}
        <div className="w-56 flex-shrink-0">
          <div className="space-y-1 sticky top-6">
            {TABS.map((tab) => (
              <Link key={tab.id} href={tab.href} className="block">
                <button
                  className={cn(
                    "w-full px-4 py-3 text-left rounded-lg transition-colors flex items-start gap-3 group",
                    pathname === tab.href
                      ? "bg-blue-50 border-l-4 border-blue-600 text-blue-600"
                      : "hover:bg-gray-50 text-gray-700"
                  )}
                >
                  <div className="mt-1">{tab.icon}</div>
                  <div className="flex-1 min-w-0">
                    <div className="font-medium text-sm">{tab.label}</div>
                    <div
                      className={cn(
                        "text-xs line-clamp-1",
                        pathname === tab.href
                          ? "text-blue-600"
                          : "text-gray-500 group-hover:text-gray-600"
                      )}
                    >
                      {tab.description}
                    </div>
                  </div>
                </button>
              </Link>
            ))}
          </div>
        </div>

        {/* Content Area */}
        <div className="flex-1 min-w-0">
          {children}
        </div>
      </div>
    </div>
  );
}
