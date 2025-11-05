"use client";

import { useState, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Badge } from "@/components/ui/badge";
import { Loader2, Search, X } from "lucide-react";
import { useAvailableUsers } from "@/hooks/use-teacher";

interface User {
  id: number;
  name: string;
  email: string;
  phone: string;
  status: string;
}

interface UserSearchSelectProps {
  value?: number;
  onSelect: (userId: number, user: User) => void;
  disabled?: boolean;
  error?: string;
}

export function UserSearchSelect({
  value,
  onSelect,
  disabled = false,
  error,
}: UserSearchSelectProps) {
  const [search, setSearch] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const { data: users = [], isLoading } = useAvailableUsers(search);

  const handleSelect = useCallback(
    (user: User) => {
      setSelectedUser(user);
      onSelect(user.id, user);
      setIsOpen(false);
      setSearch("");
    },
    [onSelect]
  );

  const handleClear = useCallback(() => {
    setSelectedUser(null);
    setSearch("");
    onSelect(0, null as any);
  }, [onSelect]);

  return (
    <div className="space-y-2">
      <Label className="text-sm font-medium">
        Select Teacher User <span className="text-red-500">*</span>
      </Label>

      {selectedUser ? (
        <div className="flex items-center justify-between p-3 border rounded-lg bg-blue-50 border-blue-200">
          <div className="flex-1">
            <p className="font-medium text-sm">{selectedUser.name}</p>
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
            >
              <X className="h-4 w-4 text-gray-500" />
            </button>
          </div>
        </div>
      ) : (
        <Popover open={isOpen} onOpenChange={setIsOpen}>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              className="w-full justify-start text-gray-500"
              disabled={disabled}
            >
              <Search className="mr-2 h-4 w-4" />
              Search and select a teacher user...
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-full p-0" align="start">
            <div className="p-4 space-y-3">
              <Input
                placeholder="Search by name, email, or phone..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="h-9"
              />

              {isLoading ? (
                <div className="flex items-center justify-center py-6">
                  <Loader2 className="h-4 w-4 animate-spin" />
                </div>
              ) : users && users.length > 0 ? (
                <div className="max-h-60 overflow-y-auto space-y-2">
                  {users.map((user) => (
                    <button
                      key={user.id}
                      onClick={() => handleSelect(user)}
                      className="w-full text-left p-3 rounded-lg hover:bg-gray-100 transition border border-transparent hover:border-gray-200"
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex-1 min-w-0">
                          <p className="font-medium text-sm truncate">
                            {user.name}
                          </p>
                          <p className="text-xs text-gray-500 truncate">
                            {user.email}
                          </p>
                          {user.phone && (
                            <p className="text-xs text-gray-500 truncate">
                              {user.phone}
                            </p>
                          )}
                        </div>
                        <Badge
                          variant="outline"
                          className="capitalize ml-2 flex-shrink-0"
                        >
                          {user.status}
                        </Badge>
                      </div>
                    </button>
                  ))}
                </div>
              ) : search ? (
                <p className="text-center py-6 text-sm text-gray-500">
                  No users found matching "{search}"
                </p>
              ) : (
                <p className="text-center py-6 text-sm text-gray-500">
                  Type to search for users...
                </p>
              )}
            </div>
          </PopoverContent>
        </Popover>
      )}

      {error && <p className="text-sm text-red-500">{error}</p>}
    </div>
  );
}
