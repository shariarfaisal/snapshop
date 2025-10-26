"use client";

import { FC } from "react";
import { useAuth } from "@/hooks/use-auth";
import { Button } from "@/components/ui/button";
import { LogOut, Menu, User } from "lucide-react";
import Link from "next/link";

interface NavbarProps {}

export const Navbar: FC<NavbarProps> = () => {
  const { user, logout, isLoading } = useAuth();

  const handleLogout = async () => {
    await logout();
  };

  return (
    <nav className="bg-white border-b border-slate-200 h-16 flex items-center px-6 shadow-sm">
      <div className="flex-1 flex items-center justify-between">
        <h1 className="text-xl font-bold text-slate-900">EMS</h1>
        
        <div className="flex items-center space-x-4">
          {user && (
            <>
              <div className="text-right">
                <p className="text-sm font-medium text-slate-900">{user.name}</p>
                <p className="text-xs text-slate-500">
                  {user.roles?.[0]?.name || "User"}
                </p>
              </div>
              <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center text-white text-sm font-bold">
                {user.name?.charAt(0).toUpperCase()}
              </div>
            </>
          )}
          <Button
            variant="ghost"
            size="sm"
            onClick={handleLogout}
            disabled={isLoading}
            className="text-slate-600 hover:text-slate-900"
          >
            <LogOut className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </nav>
  );
};
