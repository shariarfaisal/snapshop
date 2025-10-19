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
import { ChevronsUpDown, LogOut, User as UserIcon } from "lucide-react";

export const UserAvatar = () => {
  const { user, logout } = useAuth();

  if (!user) {
    return null;
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger className="flex items-center gap-2">
        <Avatar className="h-8 w-8">
          <AvatarImage src={user.avatarUrl} />
          <AvatarFallback>
            {user.firstName?.[0]}
            {user.lastName?.[0]}
          </AvatarFallback>
        </Avatar>
        <div className="flex flex-col items-start">
          <span className="font-medium text-sm">{user.firstName} {user.lastName}</span>
        </div>
        <ChevronsUpDown size={16} className="text-gray-500" />
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuLabel>My Account</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem asChild>
          <Link href="/profile">
            <UserIcon className="mr-2 h-4 w-4" />
            <span>Profile</span>
          </Link>
        </DropdownMenuItem>
        <DropdownMenuItem onClick={logout}>
          <LogOut className="mr-2 h-4 w-4" />
          <span>Log out</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
