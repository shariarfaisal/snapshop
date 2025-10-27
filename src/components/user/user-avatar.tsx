"use client";

import { useAuth } from "@/hooks/use-auth";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import Link from "next/link";
import { ChevronsUpDown, LogOut, User as UserIcon, Settings } from "lucide-react";
import { useAuthStore } from "@/store/auth-store";

export const UserAvatar = () => {
  const { user, logout } = useAuth();
  const { getDisplayName } = useAuthStore();

  if (!user) {
    return null;
  }

  const displayName = getDisplayName();
  const initials = displayName
    .split(" ")
    .map((word) => word[0])
    .join("")
    .toUpperCase();

  const handleLogout = async () => {
    await logout();
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger className="flex items-center gap-2 outline-none hover:bg-gray-100 px-2 py-1 rounded-lg transition-colors">
        <Avatar className="h-8 w-8">
          <AvatarImage src={(user as any).avatar} />
          <AvatarFallback className="bg-blue-600 text-white font-semibold">
            {initials}
          </AvatarFallback>
        </Avatar>
        <div className="flex flex-col items-start hidden sm:flex">
          <span className="font-medium text-sm text-gray-900">{displayName}</span>
          <span className="text-xs text-gray-500">{user.email}</span>
        </div>
        <ChevronsUpDown size={16} className="text-gray-500" />
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56">
        <DropdownMenuLabel className="flex flex-col">
          <span>{displayName}</span>
          <span className="text-xs text-gray-500 font-normal">{user.email}</span>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        
        <DropdownMenuItem asChild className="cursor-pointer">
          <Link href="/admin/settings/profile">
            <UserIcon className="mr-2 h-4 w-4" />
            <span>My Profile</span>
          </Link>
        </DropdownMenuItem>

        <DropdownMenuItem asChild className="cursor-pointer">
          <Link href="/admin/settings">
            <Settings className="mr-2 h-4 w-4" />
            <span>Settings</span>
          </Link>
        </DropdownMenuItem>

        <DropdownMenuSeparator />

        <DropdownMenuItem 
          onClick={handleLogout}
          className="cursor-pointer text-red-600 focus:text-red-600 focus:bg-red-50"
        >
          <LogOut className="mr-2 h-4 w-4" />
          <span>Log out</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
