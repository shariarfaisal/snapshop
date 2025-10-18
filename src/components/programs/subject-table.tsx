"use client"

import { Subject, Program, CurriculumMapEntry } from "@/types/program";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Trash2 } from "lucide-react";
import { Checkbox } from "@/components/ui/checkbox";
import { useProgramSubjects } from "@/hooks/use-program-subjects";
import { Popconfirm } from "../ui/popconfirm";

interface SubjectTableProps {
  subjects: CurriculumMapEntry[];
  program?: Program; // Optional if used in contexts without direct access to program
}

export function SubjectTable({ subjects, program }: SubjectTableProps) {
  const { removeSubject } = useProgramSubjects(program?.id || 0, false)

  // Group subjects by year and term
  const groupedSubjects = subjects.reduce((acc, subject) => {
    const key = `Year ${subject.year_no} - Term ${subject.term_no}`;
    if (!acc[key]) {
      acc[key] = [];
    }
    acc[key].push(subject);
    return acc;
  }, {} as Record<string, CurriculumMapEntry[]>);

  // Sort years and terms
  const sortedGroups = Object.entries(groupedSubjects).sort(([a], [b]) => {
    const [yearA, termA] = a.split(" - ").map((s) => parseInt(s.split(" ")[1]));
    const [yearB, termB] = b.split(" - ").map((s) => parseInt(s.split(" ")[1]));
    return yearA === yearB ? termA - termB : yearA - yearB;
  });

  const handleRemoveSubject = (subject: Subject) => {
    if (program) {
      removeSubject.mutate({ program_id: program.id, subject_id: subject.id });
    }
  };

  if (subjects.length === 0) {
    return (
      <div className="text-center py-10">
        <p className="text-gray-500">No subjects found</p>
      </div>
    );
  }

  return (
    <>
      <div className="space-y-6">
        {sortedGroups.map(([group, groupSubjects]) => (
          <div key={group} className="space-y-2">
            <h3 className="text-lg font-semibold">{group}</h3>
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Subject Name</TableHead>
                    <TableHead>Code</TableHead>
                    <TableHead>Credit Hours</TableHead>
                    <TableHead>Mandatory</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {groupSubjects.map((subject) => (
                    <TableRow key={subject.id}>
                      <TableCell className="font-medium">{subject.name}</TableCell>
                      <TableCell>{subject.code}</TableCell>
                      <TableCell>{subject.credit}</TableCell>
                      <TableCell>
                        <Checkbox checked={subject.mandatory} disabled />
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <Popconfirm
                            title="Are you sure you want to remove this subject?"
                            onConfirm={() => handleRemoveSubject(subject)}
                          >
                            <Button
                              variant="ghost"
                              size="icon"
                              title="Remove Subject"
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </Popconfirm>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </div>
        ))}
      </div>

    </>
  );
} 