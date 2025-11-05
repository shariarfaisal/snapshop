import { Checkbox } from "@/components/ui/checkbox";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Pencil, Trash2 } from "lucide-react";

interface ClassSubject {
  id: number;
  subject_id: number;
  subject_name: string;
  subject_code: string | null;
  subject_type: string;
  subject_description: string | null;
  teacher_id: number | null;
  teacher_name: string | null;
  credit_hours: number;
  created_at?: string;
  updated_at?: string;
}

interface SubjectsTableProps {
  subjects: ClassSubject[];
  selectedSubjects: number[];
  onSelectSubjects: (ids: number[]) => void;
  onEdit: (subject: ClassSubject) => void;
  onRemove: (subjectId: number) => void;
  isRemoving?: boolean;
}

export function SubjectsTable({
  subjects,
  selectedSubjects,
  onSelectSubjects,
  onEdit,
  onRemove,
  isRemoving = false,
}: SubjectsTableProps) {
  const handleSelectAll = () => {
    if (selectedSubjects.length === subjects.length) {
      onSelectSubjects([]);
    } else {
      onSelectSubjects(subjects.map((s) => s.id));
    }
  };

  const handleSelectOne = (id: number) => {
    if (selectedSubjects.includes(id)) {
      onSelectSubjects(selectedSubjects.filter((s) => s !== id));
    } else {
      onSelectSubjects([...selectedSubjects, id]);
    }
  };

  const getSubjectTypeColor = (type: string) => {
    const colors: Record<string, string> = {
      core: "default",
      elective: "secondary",
      optional: "outline",
    };
    return colors[type] || "default";
  };

  return (
    <div className="border rounded-lg">
      <Table>
        <TableHeader>
          <TableRow className="bg-gray-50">
            <TableHead className="w-12">
              <Checkbox
                checked={selectedSubjects.length === subjects.length && subjects.length > 0}
                indeterminate={selectedSubjects.length > 0 && selectedSubjects.length < subjects.length}
                onCheckedChange={handleSelectAll}
              />
            </TableHead>
            <TableHead>Subject Name</TableHead>
            <TableHead>Code</TableHead>
            <TableHead>Type</TableHead>
            <TableHead>Teacher</TableHead>
            <TableHead className="text-center">Credit Hours</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {subjects.map((subject) => (
            <TableRow key={subject.id} className="hover:bg-gray-50">
              <TableCell>
                <Checkbox
                  checked={selectedSubjects.includes(subject.id)}
                  onCheckedChange={() => handleSelectOne(subject.id)}
                />
              </TableCell>
              <TableCell>
                <div>
                  <p className="font-medium">{subject.subject_name}</p>
                  {subject.subject_description && (
                    <p className="text-xs text-gray-500 mt-1">{subject.subject_description}</p>
                  )}
                </div>
              </TableCell>
              <TableCell className="text-sm text-gray-600">
                {subject.subject_code || "-"}
              </TableCell>
              <TableCell>
                <Badge variant={getSubjectTypeColor(subject.subject_type)}>
                  {subject.subject_type}
                </Badge>
              </TableCell>
              <TableCell className="text-sm">
                {subject.teacher_name || <span className="text-gray-400">Unassigned</span>}
              </TableCell>
              <TableCell className="text-center font-medium">{subject.credit_hours}</TableCell>
              <TableCell className="text-right">
                <div className="flex justify-end gap-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => onEdit(subject)}
                  >
                    <Pencil className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-red-600 hover:text-red-700 hover:bg-red-50"
                    onClick={() => onRemove(subject.id)}
                    disabled={isRemoving}
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
