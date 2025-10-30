"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Plus, Pencil, Trash2, ArrowLeft } from "lucide-react";
import Link from "next/link";
import { gradeScaleService } from "@/services/exam";
import { GradeScale, CreateGradeScaleInput } from "@/types/exam";
import { useToast } from "@/hooks/use-toast";

export default function GradesPage() {
  const { toast } = useToast();
  const [gradeScales, setGradeScales] = useState<GradeScale[]>([]);
  const [loading, setLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingGrade, setEditingGrade] = useState<GradeScale | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [deleteConfirmId, setDeleteConfirmId] = useState<number | null>(null);

  const [formData, setFormData] = useState<CreateGradeScaleInput>({
    name: "",
    grade: "",
    min_percentage: 0,
    max_percentage: 0,
    grade_point: 0,
    description: "",
  });

  useEffect(() => {
    fetchGradeScales();
  }, []);

  const fetchGradeScales = async () => {
    try {
      setLoading(true);
      const grades = await gradeScaleService.getAll();
      setGradeScales(grades);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to fetch grade scales",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleOpenDialog = (grade?: GradeScale) => {
    if (grade) {
      setEditingGrade(grade);
      setFormData({
        name: grade.name,
        grade: grade.grade,
        min_percentage: grade.min_percentage,
        max_percentage: grade.max_percentage,
        grade_point: grade.grade_point || 0,
        description: grade.description || "",
      });
    } else {
      setEditingGrade(null);
      setFormData({
        name: "",
        grade: "",
        min_percentage: 0,
        max_percentage: 0,
        grade_point: 0,
        description: "",
      });
    }
    setIsDialogOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      if (editingGrade) {
        await gradeScaleService.update(editingGrade.id, formData);
        toast({
          title: "Success",
          description: "Grade scale updated successfully",
        });
      } else {
        await gradeScaleService.create(formData);
        toast({
          title: "Success",
          description: "Grade scale created successfully",
        });
      }
      setIsDialogOpen(false);
      fetchGradeScales();
    } catch (error) {
      toast({
        title: "Error",
        description: `Failed to ${editingGrade ? "update" : "create"} grade scale`,
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (id: number) => {
    try {
      await gradeScaleService.delete(id);
      toast({
        title: "Success",
        description: "Grade scale deleted successfully",
      });
      fetchGradeScales();
      setDeleteConfirmId(null);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete grade scale",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="sm" asChild>
            <Link href="/admin/exams">
              <ArrowLeft className="h-4 w-4" />
            </Link>
          </Button>
          <div>
            <h1 className="text-3xl font-bold">Grade Scale Configuration</h1>
            <p className="text-gray-500 mt-1">Manage grading scales and grade points</p>
          </div>
        </div>
        <Button onClick={() => handleOpenDialog()}>
          <Plus className="mr-2 h-4 w-4" />
          Add Grade Scale
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Grade Scales</CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="text-center py-8">Loading...</div>
          ) : gradeScales.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              No grade scales configured. Click "Add Grade Scale" to create one.
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Grade</TableHead>
                  <TableHead>Min %</TableHead>
                  <TableHead>Max %</TableHead>
                  <TableHead>Grade Point</TableHead>
                  <TableHead>Description</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {gradeScales.map((grade) => (
                  <TableRow key={grade.id}>
                    <TableCell className="font-medium">{grade.name}</TableCell>
                    <TableCell>{grade.grade}</TableCell>
                    <TableCell>{grade.min_percentage}%</TableCell>
                    <TableCell>{grade.max_percentage}%</TableCell>
                    <TableCell>{grade.grade_point || "-"}</TableCell>
                    <TableCell>{grade.description || "-"}</TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleOpenDialog(grade)}
                        >
                          <Pencil className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => setDeleteConfirmId(grade.id)}
                        >
                          <Trash2 className="h-4 w-4 text-red-500" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      {/* Add/Edit Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {editingGrade ? "Edit Grade Scale" : "Add Grade Scale"}
            </DialogTitle>
            <DialogDescription>
              Configure the grading scale details
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleSubmit}>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="name">Name *</Label>
                <Input
                  id="name"
                  placeholder="e.g., Excellent"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="grade">Grade *</Label>
                <Input
                  id="grade"
                  placeholder="e.g., A+"
                  value={formData.grade}
                  onChange={(e) => setFormData({ ...formData, grade: e.target.value })}
                  required
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="min_percentage">Min Percentage *</Label>
                  <Input
                    id="min_percentage"
                    type="number"
                    step="0.01"
                    min="0"
                    max="100"
                    value={formData.min_percentage}
                    onChange={(e) =>
                      setFormData({ ...formData, min_percentage: parseFloat(e.target.value) })
                    }
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="max_percentage">Max Percentage *</Label>
                  <Input
                    id="max_percentage"
                    type="number"
                    step="0.01"
                    min="0"
                    max="100"
                    value={formData.max_percentage}
                    onChange={(e) =>
                      setFormData({ ...formData, max_percentage: parseFloat(e.target.value) })
                    }
                    required
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="grade_point">Grade Point</Label>
                <Input
                  id="grade_point"
                  type="number"
                  step="0.01"
                  min="0"
                  max="10"
                  value={formData.grade_point}
                  onChange={(e) =>
                    setFormData({ ...formData, grade_point: parseFloat(e.target.value) })
                  }
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Input
                  id="description"
                  placeholder="Optional description"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                />
              </div>
            </div>
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
                Cancel
              </Button>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? "Saving..." : "Save"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={deleteConfirmId !== null} onOpenChange={() => setDeleteConfirmId(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirm Deletion</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this grade scale? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeleteConfirmId(null)}>
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={() => deleteConfirmId && handleDelete(deleteConfirmId)}
            >
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
