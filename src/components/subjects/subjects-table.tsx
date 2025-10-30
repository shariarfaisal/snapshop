"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { 
  Pencil, 
  Trash2, 
  ChevronLeft, 
  ChevronRight,
  ArrowUpDown,
  MoreHorizontal,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Subject } from "@/types/subject";
import { EditSubjectDialog } from "./edit-subject-dialog";
import { DeleteSubjectDialog } from "./delete-subject-dialog";
import { Skeleton } from "@/components/ui/skeleton";
import { useSubjects } from "@/hooks/use-subjects";

interface SubjectsTableProps {
  subjects: Subject[];
  isLoading: boolean;
  meta?: {
    current_page: number;
    per_page: number;
    total: number;
    last_page: number;
  };
  total: number;
  onPageChange: (page: number) => void;
  onPerPageChange: (perPage: number) => void;
  onSort: (sortBy: string) => void;
  sortBy?: string;
  sortOrder?: string;
  onRefetch: () => void;
}

export const SubjectsTable = ({
  subjects,
  isLoading,
  meta,
  total,
  onPageChange,
  onPerPageChange,
  onSort,
  sortBy,
  sortOrder,
  onRefetch,
}: SubjectsTableProps) => {
  const [selectedSubjects, setSelectedSubjects] = useState<number[]>([]);
  const [editingSubject, setEditingSubject] = useState<Subject | null>(null);
  const [deletingSubject, setDeletingSubject] = useState<Subject | null>(null);
  const { bulkDelete, isBulkDeleting } = useSubjects();

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedSubjects(subjects.map((s) => s.id));
    } else {
      setSelectedSubjects([]);
    }
  };

  const handleSelectSubject = (id: number, checked: boolean) => {
    if (checked) {
      setSelectedSubjects((prev) => [...prev, id]);
    } else {
      setSelectedSubjects((prev) => prev.filter((i) => i !== id));
    }
  };

  const handleBulkDelete = async () => {
    if (selectedSubjects.length === 0) return;
    
    if (confirm(`Are you sure you want to delete ${selectedSubjects.length} subject(s)?`)) {
      try {
        await bulkDelete(selectedSubjects);
        setSelectedSubjects([]);
        onRefetch();
      } catch (error) {
        console.error("Error bulk deleting subjects:", error);
      }
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case "core":
        return "bg-blue-100 text-blue-800 hover:bg-blue-200";
      case "elective":
        return "bg-green-100 text-green-800 hover:bg-green-200";
      case "optional":
        return "bg-orange-100 text-orange-800 hover:bg-orange-200";
      default:
        return "bg-gray-100 text-gray-800 hover:bg-gray-200";
    }
  };

  const renderSortIcon = (column: string) => {
    if (sortBy !== column) return <ArrowUpDown className="ml-2 h-4 w-4" />;
    return sortOrder === "asc" ? "↑" : "↓";
  };

  if (isLoading) {
    return (
      <div className="p-6 space-y-4">
        {[1, 2, 3, 4, 5].map((i) => (
          <Skeleton key={i} className="h-16 w-full" />
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {selectedSubjects.length > 0 && (
        <div className="p-4 bg-muted flex items-center justify-between">
          <span className="text-sm font-medium">
            {selectedSubjects.length} subject(s) selected
          </span>
          <Button
            variant="destructive"
            size="sm"
            onClick={handleBulkDelete}
            disabled={isBulkDeleting}
          >
            {isBulkDeleting ? "Deleting..." : "Delete Selected"}
          </Button>
        </div>
      )}

      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-12">
                <Checkbox
                  checked={
                    subjects.length > 0 &&
                    selectedSubjects.length === subjects.length
                  }
                  onCheckedChange={handleSelectAll}
                />
              </TableHead>
              <TableHead 
                className="cursor-pointer"
                onClick={() => onSort("name")}
              >
                <div className="flex items-center">
                  Name {renderSortIcon("name")}
                </div>
              </TableHead>
              <TableHead 
                className="cursor-pointer"
                onClick={() => onSort("code")}
              >
                <div className="flex items-center">
                  Code {renderSortIcon("code")}
                </div>
              </TableHead>
              <TableHead 
                className="cursor-pointer"
                onClick={() => onSort("type")}
              >
                <div className="flex items-center">
                  Type {renderSortIcon("type")}
                </div>
              </TableHead>
              <TableHead 
                className="cursor-pointer"
                onClick={() => onSort("credit_hours")}
              >
                <div className="flex items-center">
                  Credit Hours {renderSortIcon("credit_hours")}
                </div>
              </TableHead>
              <TableHead>Description</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {subjects.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} className="text-center py-8">
                  <p className="text-muted-foreground">
                    No subjects found. Create your first subject to get started.
                  </p>
                </TableCell>
              </TableRow>
            ) : (
              subjects.map((subject) => (
                <TableRow key={subject.id}>
                  <TableCell>
                    <Checkbox
                      checked={selectedSubjects.includes(subject.id)}
                      onCheckedChange={(checked) =>
                        handleSelectSubject(subject.id, checked as boolean)
                      }
                    />
                  </TableCell>
                  <TableCell className="font-medium">{subject.name}</TableCell>
                  <TableCell>
                    {subject.code ? (
                      <code className="text-xs bg-muted px-2 py-1 rounded">
                        {subject.code}
                      </code>
                    ) : (
                      <span className="text-muted-foreground">-</span>
                    )}
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline" className={getTypeColor(subject.type)}>
                      {subject.type}
                    </Badge>
                  </TableCell>
                  <TableCell>{subject.credit_hours}</TableCell>
                  <TableCell className="max-w-xs truncate">
                    {subject.description || (
                      <span className="text-muted-foreground">-</span>
                    )}
                  </TableCell>
                  <TableCell className="text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => setEditingSubject(subject)}>
                          <Pencil className="mr-2 h-4 w-4" />
                          Edit
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={() => setDeletingSubject(subject)}
                          className="text-red-600"
                        >
                          <Trash2 className="mr-2 h-4 w-4" />
                          Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {/* Pagination */}
      {meta && meta.last_page > 1 && (
        <div className="flex items-center justify-between px-6 py-4">
          <div className="flex items-center gap-2">
            <span className="text-sm text-muted-foreground">
              Showing {((meta.current_page - 1) * meta.per_page) + 1} to{" "}
              {Math.min(meta.current_page * meta.per_page, meta.total)} of{" "}
              {meta.total} results
            </span>
          </div>

          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <span className="text-sm text-muted-foreground">Rows per page:</span>
              <Select
                value={meta.per_page.toString()}
                onValueChange={(value) => onPerPageChange(Number(value))}
              >
                <SelectTrigger className="w-20">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="10">10</SelectItem>
                  <SelectItem value="15">15</SelectItem>
                  <SelectItem value="25">25</SelectItem>
                  <SelectItem value="50">50</SelectItem>
                  <SelectItem value="100">100</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="icon"
                onClick={() => onPageChange(meta.current_page - 1)}
                disabled={meta.current_page === 1}
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <span className="text-sm">
                Page {meta.current_page} of {meta.last_page}
              </span>
              <Button
                variant="outline"
                size="icon"
                onClick={() => onPageChange(meta.current_page + 1)}
                disabled={meta.current_page === meta.last_page}
              >
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Edit Dialog */}
      <EditSubjectDialog
        subject={editingSubject}
        open={!!editingSubject}
        onOpenChange={(open) => !open && setEditingSubject(null)}
        onSuccess={onRefetch}
      />

      {/* Delete Dialog */}
      <DeleteSubjectDialog
        subject={deletingSubject}
        open={!!deletingSubject}
        onOpenChange={(open) => !open && setDeletingSubject(null)}
        onSuccess={onRefetch}
      />
    </div>
  );
}
