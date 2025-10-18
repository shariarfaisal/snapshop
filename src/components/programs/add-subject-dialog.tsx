"use client";
import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks";
import { Program, Subject } from "@/types/program";
import { useProgramSubjects } from "@/hooks/use-program-subjects";

interface AddSubjectDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  program: Program;
  allSubjects: Subject[];
}

export function AddSubjectDialog({
  open,
  onOpenChange,
  program,
  allSubjects,
}: AddSubjectDialogProps) {
  const { toast } = useToast();
  const [selectedSubjectId, setSelectedSubjectId] = useState("");
  const [year, setYear] = useState(1);
  const [term, setTerm] = useState(1);
  const [mandatory, setMandatory] = useState(true);
  const { addSubject } = useProgramSubjects(program.id, false);

  const handleSubmit = async () => {
    if (!selectedSubjectId) {
      toast({
        title: "Error",
        description: "Please select a subject",
        variant: "destructive",
      });
      return;
    }

    if (program) {
      addSubject.mutate({ 
        program_id: program.id,
        subject_id: Number(selectedSubjectId),
        year_no: year,
        term_no: term,
        mandatory,
      }, {
        onSuccess: () => {
          toast({
            title: "Success",
            description: "Subject added successfully",
          });
  
          toast({
            title: "Success",
            description: "Subject added successfully",
          });
    
          onOpenChange(false);
        },
        onError: () => {
          toast({
            title: "Error",
            description: "Failed to add subject",
            variant: "destructive",
          });
        }
      })
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add Subject to {program.title}</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div>
            <Label htmlFor="subject">Subject</Label>
            <select
              id="subject"
              value={selectedSubjectId}
              onChange={(e) => setSelectedSubjectId(e.target.value)}
              className="w-full p-2 border rounded-md"
            >
              <option value="">Select a subject</option>
              {allSubjects.map((subject) => (
                <option key={subject.id} value={subject.id}>
                  {subject.name} ({subject.code})
                </option>
              ))}
            </select>
          </div>

          <div>
            <Label htmlFor="year">Year</Label>
            <select
              id="year"
              value={year}
              onChange={(e) => setYear(Number(e.target.value))}
              className="w-full p-2 border rounded-md"
            >
              {Array.from({ length: program.duration_year }, (_, i) => i + 1).map((y) => (
                <option key={y} value={y}>
                  Year {y}
                </option>
              ))}
            </select>
          </div>

          <div>
            <Label htmlFor="term">Term</Label>
            <select
              id="term"
              value={term}
              onChange={(e) => setTerm(Number(e.target.value))}
              className="w-full p-2 border rounded-md"
            >
              <option value={1}>Term 1</option>
              <option value={2}>Term 2</option>
              <option value={3}>Term 3</option>
            </select>
          </div>

          <div className="flex items-center space-x-2">
            <input
              type="checkbox"
              id="mandatory"
              checked={mandatory}
              onChange={(e) => setMandatory(e.target.checked)}
            />
            <Label htmlFor="mandatory">Mandatory subject</Label>
          </div>

          <div className="flex justify-end space-x-2">
            <Button variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button onClick={handleSubmit} disabled={addSubject.isPending}>
              {addSubject.isPending ? "Adding..." : "Add Subject"}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
} 