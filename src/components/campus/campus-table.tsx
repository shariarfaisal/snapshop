"use client"

import { useQuery } from "@tanstack/react-query";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Pencil, Trash2 } from "lucide-react";
import { campusService } from "@/services/campus";
import { Skeleton } from "@/components/ui/skeleton";
import { Campus } from "@/types/campus";
import { EditCampusDialog } from "./edit-campus-dialog";
import { DeleteCampusDialog } from "./delete-campus-dialog";
import { useCampus } from "@/hooks";

export function CampusTable() {
  const { campuses, isLoading, error } = useCampus()

  if (isLoading) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-10 w-full" />
        <Skeleton className="h-10 w-full" />
        <Skeleton className="h-10 w-full" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-10">
        <p className="text-red-500">Error loading campuses</p>
      </div>
    );
  }

  if (!campuses?.data?.length) {
    return (
      <div className="text-center py-10">
        <p className="text-muted-foreground">No campuses found</p>
      </div>
    );
  }

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead>Code</TableHead>
            <TableHead>Address</TableHead>
            <TableHead>City</TableHead>
            <TableHead>Country</TableHead>
            <TableHead>Main Campus</TableHead>
            <TableHead className="w-[100px]">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {campuses.data.map((campus) => (
            <TableRow key={campus.id}>
              <TableCell>{campus.name}</TableCell>
              <TableCell>{campus.code}</TableCell>
              <TableCell>{campus.address_line1}</TableCell>
              <TableCell>{campus.city}</TableCell>
              <TableCell>{campus.country}</TableCell>
              <TableCell>{campus.is_main ? "Yes" : "No"}</TableCell>
              <TableCell>
                <div className="flex gap-2">
                  <EditCampusDialog campus={campus}>
                    <Button variant="ghost" size="icon">
                      <Pencil className="h-4 w-4" />
                    </Button>
                  </EditCampusDialog>
                  <DeleteCampusDialog campus={campus}>
                    <Button variant="ghost" size="icon">
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </DeleteCampusDialog>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
} 