"use client"

import { Program } from "@/types/program";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Pencil, Trash2, BookOpen, ExternalLink } from "lucide-react";
import Link from "next/link";

interface ProgramListProps {
  programs: Program[];
  onEdit: (program: Program) => void;
  onDelete: (program: Program) => void;
  onManageSubjects: (program: Program) => void;
}

export function ProgramList({ programs, onEdit, onDelete, onManageSubjects }: ProgramListProps) {
  if (programs.length === 0) {
    return (
      <div className="text-center py-10">
        <p className="text-gray-500">No programs found</p>
      </div>
    );
  }

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Title</TableHead>
            <TableHead>Code</TableHead>
            <TableHead>Level</TableHead>
            <TableHead>Duration (Years)</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {programs.map((program) => (
            <TableRow key={program.id}>
              <TableCell className="font-medium">
                <Link 
                  href={`/admin/programs/${program.id}`}
                  className="hover:underline flex items-center"
                >
                  {program.title}
                  <ExternalLink className="ml-1 h-3 w-3" />
                </Link>
              </TableCell>
              <TableCell>{program.code}</TableCell>
              <TableCell>{program.level}</TableCell>
              <TableCell>{program.duration_year}</TableCell>
              <TableCell className="text-right">
                <div className="flex justify-end gap-2">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => onManageSubjects(program)}
                    title="Manage Subjects"
                  >
                    <BookOpen className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => onEdit(program)}
                    title="Edit Program"
                  >
                    <Pencil className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => onDelete(program)}
                    title="Delete Program"
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