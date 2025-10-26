"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Plus, Pencil, Trash2, BookOpen } from "lucide-react";

export default function SubjectsPage() {
  const [open, setOpen] = useState(false);

  const subjects = [
    { id: "1", name: "Mathematics", code: "MATH101", type: "Core", credits: 4 },
    { id: "2", name: "English", code: "ENG101", type: "Core", credits: 4 },
    { id: "3", name: "Science", code: "SCI101", type: "Core", credits: 5 },
    { id: "4", name: "History", code: "HIST101", type: "Elective", credits: 3 },
  ];

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Subjects</h1>
          <p className="text-gray-500 mt-1">Manage academic subjects and courses</p>
        </div>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Add Subject
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add Subject</DialogTitle>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="subjectName">Subject Name</Label>
                <Input id="subjectName" placeholder="e.g., Mathematics" />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="subjectCode">Subject Code</Label>
                <Input id="subjectCode" placeholder="e.g., MATH101" />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="credits">Credits</Label>
                <Input id="credits" type="number" placeholder="4" />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="description">Description</Label>
                <Textarea id="description" placeholder="Subject description..." />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setOpen(false)}>Cancel</Button>
              <Button>Save Subject</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {subjects.map((subject) => (
          <Card key={subject.id}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <div className="flex items-center">
                <BookOpen className="h-4 w-4 mr-2 text-blue-600" />
                <CardTitle className="text-sm font-medium">{subject.code}</CardTitle>
              </div>
              <div className="flex gap-1">
                <Button variant="ghost" size="icon" className="h-7 w-7">
                  <Pencil className="h-3 w-3" />
                </Button>
                <Button variant="ghost" size="icon" className="h-7 w-7 text-red-600">
                  <Trash2 className="h-3 w-3" />
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-lg font-bold">{subject.name}</div>
              <div className="flex items-center justify-between mt-3 pt-3 border-t text-sm">
                <span className="text-gray-600">{subject.type}</span>
                <span className="font-medium">{subject.credits} credits</span>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
