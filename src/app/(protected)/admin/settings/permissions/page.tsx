"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { ShieldCheck, Search } from "lucide-react";
import { useRole } from "@/hooks/use-role";
import { Skeleton } from "@/components/ui/skeleton";
import { useState, useMemo } from "react";

export default function PermissionsPage() {
  const { permissions, isPermissionsLoading } = useRole();
  const [searchQuery, setSearchQuery] = useState("");

  // Group permissions by type
  const groupedPermissions = useMemo(() => {
    if (!permissions?.data) return {};

    return permissions.data.reduce((acc: any, perm: any) => {
      if (!acc[perm.type]) {
        acc[perm.type] = [];
      }
      acc[perm.type].push(perm);
      return acc;
    }, {});
  }, [permissions?.data]);

  const filteredGroups = useMemo(() => {
    if (!searchQuery) return groupedPermissions;

    const filtered: any = {};
    Object.keys(groupedPermissions).forEach(type => {
      const perms = groupedPermissions[type].filter((p: any) =>
        p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        type.toLowerCase().includes(searchQuery.toLowerCase())
      );
      if (perms.length > 0) {
        filtered[type] = perms;
      }
    });
    return filtered;
  }, [groupedPermissions, searchQuery]);

  const totalPermissions = permissions?.total || 0;
  const totalCategories = Object.keys(groupedPermissions).length;

  return (
    <div className="space-y-6 p-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Permission Management</h1>
        <p className="text-gray-500 mt-1">View all system permissions organized by category</p>
      </div>

      {/* Statistics */}
      {isPermissionsLoading ? (
        <div className="grid gap-4 md:grid-cols-2">
          <Skeleton className="h-32" />
          <Skeleton className="h-32" />
        </div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Permissions</CardTitle>
              <ShieldCheck className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{totalPermissions}</div>
              <p className="text-xs text-muted-foreground">System-wide permissions</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Permission Categories</CardTitle>
              <ShieldCheck className="h-4 w-4 text-blue-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{totalCategories}</div>
              <p className="text-xs text-muted-foreground">Grouped by module</p>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Search */}
      <div className="flex items-center gap-4">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search permissions..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
      </div>

      {/* Permissions by Category */}
      {isPermissionsLoading ? (
        <Card>
          <CardContent className="pt-6">
            <Skeleton className="h-64" />
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {Object.keys(filteredGroups).length === 0 ? (
            <Card>
              <CardContent className="pt-6">
                <div className="text-center py-8 text-muted-foreground">
                  No permissions found
                </div>
              </CardContent>
            </Card>
          ) : (
            Object.keys(filteredGroups).map((type) => (
              <Card key={type}>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Badge variant="outline" className="capitalize">
                      {type}
                    </Badge>
                    <span className="text-sm font-normal text-muted-foreground">
                      ({filteredGroups[type].length} permissions)
                    </span>
                  </CardTitle>
                  <CardDescription>
                    Permissions related to {type} module
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="rounded-md border">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Permission Name</TableHead>
                          <TableHead>Code</TableHead>
                          <TableHead className="text-right">Type</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {filteredGroups[type].map((permission: any) => (
                          <TableRow key={permission.id}>
                            <TableCell className="font-medium">
                              {permission.name}
                            </TableCell>
                            <TableCell>
                              <code className="text-xs bg-muted px-2 py-1 rounded">
                                {permission.code || permission.name}
                              </code>
                            </TableCell>
                            <TableCell className="text-right">
                              <Badge variant="secondary" className="capitalize">
                                {permission.type}
                              </Badge>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </div>
      )}
    </div>
  );
}
