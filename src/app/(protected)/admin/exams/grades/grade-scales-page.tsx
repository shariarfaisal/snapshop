"use client";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Plus, Edit, Trash2, Save, X } from "lucide-react";
import { gradeScaleService } from "@/services/exam";
import { GradeScale, CreateGradeScaleInput } from "@/types/exam";

export default function GradeScalesPage() {
  const [grades, setGrades] = useState<GradeScale[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [formData, setFormData] = useState<CreateGradeScaleInput>({
    name: "",
    grade: "",
    min_percentage: 0,
    max_percentage: 100,
    grade_point: 0,
    description: "",
  });

  useEffect(() => {
    fetchGrades();
  }, []);

  const fetchGrades = async () => {
    try {
      setLoading(true);
      const response = await gradeScaleService.getAll();
      setGrades(response.data);
    } catch (error) {
      console.error("Failed to fetch grade scales:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingId) {
        await gradeScaleService.update(editingId, formData);
        setEditingId(null);
      } else {
        await gradeScaleService.create(formData);
        setShowAddForm(false);
      }
      fetchGrades();
      resetForm();
    } catch (error) {
      console.error("Failed to save grade scale:", error);
      alert("Failed to save grade scale");
    }
  };

  const handleEdit = (grade: GradeScale) => {
    setEditingId(grade.id);
    setFormData({
      name: grade.name,
      grade: grade.grade,
      min_percentage: grade.min_percentage,
      max_percentage: grade.max_percentage,
      grade_point: grade.grade_point || 0,
      description: grade.description || "",
    });
    setShowAddForm(true);
  };

  const handleDelete = async (id: number) => {
    if (!confirm("Are you sure you want to delete this grade scale?")) return;
    
    try {
      await gradeScaleService.delete(id);
      fetchGrades();
    } catch (error) {
      console.error("Failed to delete grade scale:", error);
    }
  };

  const resetForm = () => {
    setFormData({
      name: "",
      grade: "",
      min_percentage: 0,
      max_percentage: 100,
      grade_point: 0,
      description: "",
    });
    setEditingId(null);
  };

  const handleCancel = () => {
    setShowAddForm(false);
    resetForm();
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Grade Scales</h1>
          <p className="text-gray-500 mt-1">Manage grading criteria</p>
        </div>
        <Button onClick={() => setShowAddForm(!showAddForm)}>
          <Plus className="mr-2 h-4 w-4" />
          Add Grade Scale
        </Button>
      </div>

      {showAddForm && (
        <Card>
          <CardHeader>
            <CardTitle>{editingId ? "Edit" : "Add"} Grade Scale</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Name *</Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="e.g., Excellent"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="grade">Grade *</Label>
                  <Input
                    id="grade"
                    value={formData.grade}
                    onChange={(e) => setFormData({ ...formData, grade: e.target.value })}
                    placeholder="e.g., A+"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="min_percentage">Min Percentage *</Label>
                  <Input
                    id="min_percentage"
                    type="number"
                    step="0.01"
                    value={formData.min_percentage}
                    onChange={(e) => setFormData({ ...formData, min_percentage: parseFloat(e.target.value) })}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="max_percentage">Max Percentage *</Label>
                  <Input
                    id="max_percentage"
                    type="number"
                    step="0.01"
                    value={formData.max_percentage}
                    onChange={(e) => setFormData({ ...formData, max_percentage: parseFloat(e.target.value) })}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="grade_point">Grade Point</Label>
                  <Input
                    id="grade_point"
                    type="number"
                    step="0.01"
                    value={formData.grade_point}
                    onChange={(e) => setFormData({ ...formData, grade_point: parseFloat(e.target.value) })}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="description">Description</Label>
                  <Input
                    id="description"
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    placeholder="Optional description"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-2">
                <Button type="button" variant="outline" onClick={handleCancel}>
                  <X className="mr-2 h-4 w-4" />
                  Cancel
                </Button>
                <Button type="submit">
                  <Save className="mr-2 h-4 w-4" />
                  {editingId ? "Update" : "Add"} Grade Scale
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}

      <Card>
        <CardHeader>
          <CardTitle>Grade Scales</CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="text-center py-8">Loading...</div>
          ) : grades.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              No grade scales found. Add your first grade scale to get started.
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Grade</TableHead>
                  <TableHead>Percentage Range</TableHead>
                  <TableHead>Grade Point</TableHead>
                  <TableHead>Description</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {grades.map((grade) => (
                  <TableRow key={grade.id}>
                    <TableCell className="font-medium">{grade.name}</TableCell>
                    <TableCell>
                      <span className="font-bold text-lg">{grade.grade}</span>
                    </TableCell>
                    <TableCell>
                      {grade.min_percentage}% - {grade.max_percentage}%
                    </TableCell>
                    <TableCell>
                      {grade.grade_point ? grade.grade_point.toFixed(2) : "N/A"}
                    </TableCell>
                    <TableCell className="text-sm text-gray-600">
                      {grade.description || "—"}
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleEdit(grade)}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDelete(grade.id)}
                        >
                          <Trash2 className="h-4 w-4 text-red-600" />
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
    </div>
  );
}
