"use client";

import { useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { Pencil, Trash2 } from "lucide-react";

interface Section {
  id: number;
  name: string;
  schoolClassId: number;
  maxCapacity: number;
  status: boolean;
  createdAt?: string;
}

interface SectionsTableProps {
  sections: Section[];
  selectedSections: number[];
  onSelectSections: (ids: number[]) => void;
  onEdit: (section: Section) => void;
  onRemove: (sectionId: number) => void;
  isRemoving?: boolean;
}

export function SectionsTable({
  sections,
  selectedSections,
  onSelectSections,
  onEdit,
  onRemove,
  isRemoving = false,
}: SectionsTableProps) {
  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      onSelectSections(sections.map((s) => s.id));
    } else {
      onSelectSections([]);
    }
  };

  const handleSelectOne = (id: number, checked: boolean) => {
    if (checked) {
      onSelectSections([...selectedSections, id]);
    } else {
      onSelectSections(selectedSections.filter((sid) => sid !== id));
    }
  };

  return (
    <div className="overflow-x-auto">
      <Table>
        <TableHeader>
          <TableRow className="bg-gray-50">
            <TableHead className="w-12">
              <Checkbox
                checked={selectedSections.length === sections.length && sections.length > 0}
                onCheckedChange={handleSelectAll}
              />
            </TableHead>
            <TableHead>Name</TableHead>
            <TableHead>Capacity</TableHead>
            <TableHead>Status</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {sections.map((section) => (
            <TableRow key={section.id}>
              <TableCell>
                <Checkbox
                  checked={selectedSections.includes(section.id)}
                  onCheckedChange={(checked) => handleSelectOne(section.id, checked as boolean)}
                />
              </TableCell>
              <TableCell className="font-medium">{section.name}</TableCell>
              <TableCell>{section.maxCapacity || "-"}</TableCell>
              <TableCell>
                <Badge variant={section.status ? "default" : "secondary"}>
                  {section.status ? "Active" : "Inactive"}
                </Badge>
              </TableCell>
              <TableCell className="text-right">
                <div className="flex justify-end gap-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => onEdit(section)}
                  >
                    <Pencil className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => onRemove(section.id)}
                    disabled={isRemoving}
                    className="text-red-600 hover:text-red-700"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
