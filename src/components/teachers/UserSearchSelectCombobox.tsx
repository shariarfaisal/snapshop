"use client";

import { useState, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Check, ChevronsUpDown, Loader2, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { useUser } from "@/hooks/use-user";

interface User {
  id: string;
  username: string;
  email: string;
  firstName?: string;
  lastName?: string;
  phone?: string;
  status: string;
}

interface UserSearchSelectComboboxProps {
  value?: string;
  onSelect: (userId: string, user: User) => void;
  disabled?: boolean;
  error?: string;
}

export function UserSearchSelectCombobox({
  value,
  onSelect,
  disabled = false,
  error,
}: UserSearchSelectComboboxProps) {
  const [open, setOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [search, setSearch] = useState("");
  
  // Fetch users with high limit to get all users initially, then filter client-side
  const { users, isLoading } = useUser(1, 100, search ? { name: search } : {});

  const handleSelect = useCallback(
    (userId: string) => {
      const selectedUserData = users?.data?.find((u: any) => u.id === userId);
      if (selectedUserData) {
        const fullUser: User = {
          id: selectedUserData.id,
          username: selectedUserData.username,
          email: selectedUserData.email,
          firstName: selectedUserData.firstName,
          lastName: selectedUserData.lastName,
          phone: selectedUserData.phone || "",
          status: selectedUserData.status,
        };
        setSelectedUser(fullUser);
        onSelect(userId, fullUser);
        setOpen(false);
        setSearch("");
      }
    },
    [users?.data, onSelect]
  );

  const handleClear = useCallback(() => {
    setSelectedUser(null);
    setSearch("");
    onSelect("", null as any);
  }, [onSelect]);

  return (
    <div className="space-y-2">
      <Label className="text-sm font-medium">
        Select Teacher User <span className="text-red-500">*</span>
      </Label>

      {selectedUser ? (
        <div className="flex items-center justify-between p-3 border rounded-lg bg-blue-50 border-blue-200">
          <div className="flex-1">
            <p className="font-medium text-sm">
              {selectedUser.firstName} {selectedUser.lastName}
            </p>
            <p className="text-xs text-gray-500">{selectedUser.email}</p>
            {selectedUser.phone && (
              <p className="text-xs text-gray-500">{selectedUser.phone}</p>
            )}
          </div>
          <div className="flex items-center gap-2">
            <Badge variant="outline" className="capitalize">
              {selectedUser.status}
            </Badge>
            <button
              onClick={handleClear}
              disabled={disabled}
              className="p-1 hover:bg-white rounded transition"
              aria-label="Clear selection"
              type="button"
            >
              <X className="h-4 w-4 text-gray-500" />
            </button>
          </div>
        </div>
      ) : (
        <Popover open={open} onOpenChange={setOpen}>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              role="combobox"
              aria-expanded={open}
              className="w-full justify-between"
              disabled={disabled || isLoading}
            >
              <span className="truncate">
                {isLoading
                  ? "Loading users..."
                  : "Search and select a teacher user..."}
              </span>
              <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-full p-0" align="start">
            <Command shouldFilter={false}>
              <CommandInput
                placeholder="Search by name, email, or phone..."
                value={search}
                onValueChange={setSearch}
                className="h-9"
              />
      <CommandList>
                {isLoading ? (
                  <div className="flex items-center justify-center py-6">
                    <Loader2 className="h-4 w-4 animate-spin text-gray-400" />
                  </div>
                ) : !users?.data || users.data.length === 0 ? (
                  <CommandEmpty>
                    {search
                      ? `No users found matching "${search}"`
                      : "No users available"}
                  </CommandEmpty>
                ) : (
                  <CommandGroup>
                    {users.data.slice(0, 20).map((user: any) => (
                      <CommandItem
                        key={user.id}
                        value={user.id.toString()}
                        onSelect={() => handleSelect(user.id)}
                        className="flex items-center justify-between cursor-pointer"
                      >
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2">
                            <Check
                              className={cn(
                                "h-4 w-4 shrink-0",
                                value === user.id
                                  ? "opacity-100"
                                  : "opacity-0"
                              )}
                            />
                            <div className="flex-1 min-w-0">
                              <p className="font-medium text-sm truncate">
                                {user.firstName} {user.lastName}
                              </p>
                              <p className="text-xs text-gray-500 truncate">
                                {user.email}
                              </p>
                            </div>
                          </div>
                        </div>
                        <Badge
                          variant="outline"
                          className="capitalize ml-2 flex-shrink-0"
                        >
                          {user.status}
                        </Badge>
                      </CommandItem>
                    ))}
                  </CommandGroup>
                )}
              </CommandList>
            </Command>
          </PopoverContent>
        </Popover>
      )}

      {error && <p className="text-sm text-red-500">{error}</p>}
      {users?.data && users.data.length > 0 && !selectedUser && (
        <p className="text-xs text-gray-500">
          Showing {Math.min(users.data.length, 20)} users. Type to filter.
        </p>
      )}
    </div>
  );
}
