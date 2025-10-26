"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
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
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Plus, Pencil, Trash2, Users } from "lucide-react";

export default function ClassesPage() {
  const [open, setOpen] = useState(false);

  const classes = [
    { id: "1", name: "Grade 10", code: "G10", students: 245, sections: 3 },
    { id: "2", name: "Grade 9", code: "G9", students: 268, sections: 3 },
    { id: "3", name: "Grade 8", code: "G8", students: 251, sections: 3 },
  ];

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Classes</h1>
          <p className="text-gray-500 mt-1">Manage class levels and grades</p>
        </div>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Add Class
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add Class</DialogTitle>
              <DialogDescription>
                Create a new class level for your institution.
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="name">Class Name</Label>
                <Input id="name" placeholder="e.g., Grade 10" />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="code">Class Code</Label>
                <Input id="code" placeholder="e.g., G10" />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="academicYear">Academic Year</Label>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Select academic year" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="2024-2025">2024-2025</SelectItem>
                    <SelectItem value="2023-2024">2023-2024</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setOpen(false)}>
                Cancel
              </Button>
              <Button>Save Class</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {classes.map((classItem) => (
          <Card key={classItem.id}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                {classItem.name}
              </CardTitle>
              <div className="flex gap-1">
                <Button variant="ghost" size="icon" className="h-8 w-8">
                  <Pencil className="h-3 w-3" />
                </Button>
                <Button variant="ghost" size="icon" className="h-8 w-8 text-red-600">
                  <Trash2 className="h-3 w-3" />
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{classItem.code}</div>
              <div className="flex items-center justify-between mt-4 pt-4 border-t">
                <div className="flex items-center text-sm text-gray-600">
                  <Users className="mr-2 h-4 w-4" />
                  {classItem.students} students
                </div>
                <div className="text-sm text-gray-600">
                  {classItem.sections} sections
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
