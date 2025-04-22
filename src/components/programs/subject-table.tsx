import { Subject } from "@/types/program";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Trash2 } from "lucide-react";
import { Checkbox } from "@/components/ui/checkbox";

interface SubjectTableProps {
  subjects: Subject[];
  onRemove: (subject: Subject) => void;
}

export function SubjectTable({ subjects, onRemove }: SubjectTableProps) {
  // Group subjects by year and term
  const groupedSubjects = subjects.reduce((acc, subject) => {
    const key = `Year ${subject.year} - Term ${subject.term}`;
    if (!acc[key]) {
      acc[key] = [];
    }
    acc[key].push(subject);
    return acc;
  }, {} as Record<string, Subject[]>);

  // Sort years and terms
  const sortedGroups = Object.entries(groupedSubjects).sort(([a], [b]) => {
    const [yearA, termA] = a.split(" - ").map((s) => parseInt(s.split(" ")[1]));
    const [yearB, termB] = b.split(" - ").map((s) => parseInt(s.split(" ")[1]));
    return yearA === yearB ? termA - termB : yearA - yearB;
  });

  if (subjects.length === 0) {
    return (
      <div className="text-center py-10">
        <p className="text-gray-500">No subjects found</p>
      </div>
    );
  }

  return (
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
                    <TableCell>{subject.creditHours}</TableCell>
                    <TableCell>
                      <Checkbox checked={subject.mandatory} disabled />
                    </TableCell>
                    <TableCell className="text-right">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => onRemove(subject)}
                        title="Remove Subject"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </div>
      ))}
    </div>
  );
} 