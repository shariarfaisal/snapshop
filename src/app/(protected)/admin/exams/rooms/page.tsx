"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Plus, Pencil, Trash2, Search, Building2, Users, AlertCircle, CheckCircle } from "lucide-react";
import { ExamRoom, CreateExamRoomInput, UpdateExamRoomInput, ExamRoomStatus } from "@/types/exam";
import { useToast } from "@/hooks/use-toast";
import {
  useExamRooms,
  useCreateExamRoom,
  useUpdateExamRoom,
  useDeleteExamRoom,
} from "@/hooks/use-exams";

export default function ExamRoomsPage() {
  const { toast } = useToast();
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingRoom, setEditingRoom] = useState<ExamRoom | null>(null);
  const [deleteConfirmId, setDeleteConfirmId] = useState<number | null>(null);

  const [formData, setFormData] = useState<CreateExamRoomInput>({
    name: "",
    code: "",
    capacity: 0,
    building: "",
    floor: "",
    status: "active",
    remarks: "",
  });

  // Build filters
  const filters = statusFilter !== "all" ? { status: statusFilter } : undefined;

  // Hooks
  const { data: roomsData, isLoading: loading } = useExamRooms(filters);
  const createExamRoomMutation = useCreateExamRoom();
  const updateExamRoomMutation = useUpdateExamRoom();
  const deleteExamRoomMutation = useDeleteExamRoom();

  // Derived data - handle both array and paginated response formats
  const rooms = Array.isArray(roomsData) ? roomsData : (roomsData?.data || []);

  const handleOpenDialog = (room?: ExamRoom) => {
    if (room) {
      setEditingRoom(room);
      setFormData({
        name: room.name,
        code: room.code || "",
        capacity: room.capacity,
        building: room.building || "",
        floor: room.floor || "",
        status: room.status,
        remarks: room.remarks || "",
      });
    } else {
      setEditingRoom(null);
      setFormData({
        name: "",
        code: "",
        capacity: 0,
        building: "",
        floor: "",
        status: "active",
        remarks: "",
      });
    }
    setIsDialogOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (editingRoom) {
      updateExamRoomMutation.mutate(
        { id: editingRoom.id, data: formData as UpdateExamRoomInput },
        {
          onSuccess: () => {
            toast({
              title: "Success",
              description: "Exam room updated successfully",
            });
            setIsDialogOpen(false);
          },
          onError: () => {
            toast({
              title: "Error",
              description: "Failed to update exam room",
              variant: "destructive",
            });
          },
        }
      );
    } else {
      createExamRoomMutation.mutate(formData, {
        onSuccess: () => {
          toast({
            title: "Success",
            description: "Exam room created successfully",
          });
          setIsDialogOpen(false);
        },
        onError: () => {
          toast({
            title: "Error",
            description: "Failed to create exam room",
            variant: "destructive",
          });
        },
      });
    }
  };

  const handleDelete = (id: number) => {
    deleteExamRoomMutation.mutate(id, {
      onSuccess: () => {
        toast({
          title: "Success",
          description: "Exam room deleted successfully",
        });
        setDeleteConfirmId(null);
      },
      onError: () => {
        toast({
          title: "Error",
          description: "Failed to delete exam room",
          variant: "destructive",
        });
      },
    });
  };

  const getStatusColor = (status: ExamRoomStatus) => {
    switch (status) {
      case "active":
        return "bg-green-100 text-green-800";
      case "inactive":
        return "bg-gray-100 text-gray-800";
      case "maintenance":
        return "bg-yellow-100 text-yellow-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getStatusIcon = (status: ExamRoomStatus) => {
    switch (status) {
      case "active":
        return <CheckCircle className="h-4 w-4" />;
      case "maintenance":
        return <AlertCircle className="h-4 w-4" />;
      default:
        return null;
    }
  };

  const filteredRooms = rooms.filter((room) => {
    const matchesSearch =
      room.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      room.code?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      room.building?.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesSearch;
  });

  const stats = {
    total: rooms.length,
    active: rooms.filter((r) => r.status === "active").length,
    totalCapacity: rooms.reduce((sum, r) => sum + r.capacity, 0),
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Exam Rooms</h1>
          <p className="text-gray-500 mt-1">Manage examination rooms and their capacities</p>
        </div>
        <Button onClick={() => handleOpenDialog()}>
          <Plus className="mr-2 h-4 w-4" />
          Add Room
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardContent className="pt-6">
            <Building2 className="h-8 w-8 text-blue-600 mb-2" />
            <p className="text-sm text-gray-600">Total Rooms</p>
            <p className="text-2xl font-bold">{stats.total}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <CheckCircle className="h-8 w-8 text-green-600 mb-2" />
            <p className="text-sm text-gray-600">Active Rooms</p>
            <p className="text-2xl font-bold">{stats.active}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <Users className="h-8 w-8 text-purple-600 mb-2" />
            <p className="text-sm text-gray-600">Total Capacity</p>
            <p className="text-2xl font-bold">{stats.totalCapacity}</p>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Search by name, code, or building..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <div className="w-full md:w-48">
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="Filter by status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="inactive">Inactive</SelectItem>
                  <SelectItem value="maintenance">Maintenance</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Rooms Table */}
      <Card>
        <CardHeader>
          <CardTitle>All Exam Rooms</CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="text-center py-8">Loading...</div>
          ) : filteredRooms.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              {searchQuery || statusFilter !== "all"
                ? "No rooms found matching your filters"
                : "No exam rooms found. Create your first room to get started."}
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Room Name</TableHead>
                  <TableHead>Code</TableHead>
                  <TableHead>Building / Floor</TableHead>
                  <TableHead>Capacity</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredRooms.map((room) => (
                  <TableRow key={room.id}>
                    <TableCell className="font-medium">{room.name}</TableCell>
                    <TableCell>{room.code || "-"}</TableCell>
                    <TableCell>
                      {room.building && room.floor
                        ? `${room.building} - ${room.floor}`
                        : room.building || room.floor || "-"}
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Users className="h-4 w-4 text-gray-400" />
                        <span>{room.capacity}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge className={getStatusColor(room.status)}>
                        <div className="flex items-center gap-1">
                          {getStatusIcon(room.status)}
                          <span className="capitalize">{room.status}</span>
                        </div>
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleOpenDialog(room)}
                        >
                          <Pencil className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => setDeleteConfirmId(room.id)}
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

      {/* Add/Edit Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>{editingRoom ? "Edit Room" : "Add New Room"}</DialogTitle>
            <DialogDescription>
              {editingRoom ? "Update the exam room details" : "Create a new exam room"}
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleSubmit}>
            <div className="grid grid-cols-2 gap-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="name">Room Name *</Label>
                <Input
                  id="name"
                  placeholder="e.g., Room 101"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="code">Room Code</Label>
                <Input
                  id="code"
                  placeholder="e.g., R101"
                  value={formData.code}
                  onChange={(e) => setFormData({ ...formData, code: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="capacity">Capacity *</Label>
                <Input
                  id="capacity"
                  type="number"
                  min="1"
                  placeholder="e.g., 40"
                  value={formData.capacity || ""}
                  onChange={(e) =>
                    setFormData({ ...formData, capacity: parseInt(e.target.value) || 0 })
                  }
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="status">Status *</Label>
                <Select
                  value={formData.status}
                  onValueChange={(value: ExamRoomStatus) =>
                    setFormData({ ...formData, status: value })
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="active">Active</SelectItem>
                    <SelectItem value="inactive">Inactive</SelectItem>
                    <SelectItem value="maintenance">Maintenance</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="building">Building</Label>
                <Input
                  id="building"
                  placeholder="e.g., Main Block"
                  value={formData.building}
                  onChange={(e) => setFormData({ ...formData, building: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="floor">Floor</Label>
                <Input
                  id="floor"
                  placeholder="e.g., Ground Floor"
                  value={formData.floor}
                  onChange={(e) => setFormData({ ...formData, floor: e.target.value })}
                />
              </div>
              <div className="col-span-2 space-y-2">
                <Label htmlFor="remarks">Remarks</Label>
                <Input
                  id="remarks"
                  placeholder="Optional remarks"
                  value={formData.remarks}
                  onChange={(e) => setFormData({ ...formData, remarks: e.target.value })}
                />
              </div>
            </div>
            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => setIsDialogOpen(false)}
                disabled={createExamRoomMutation.isPending || updateExamRoomMutation.isPending}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={createExamRoomMutation.isPending || updateExamRoomMutation.isPending}
              >
                {(createExamRoomMutation.isPending || updateExamRoomMutation.isPending) ? "Saving..." : "Save"}
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
              Are you sure you want to delete this exam room? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setDeleteConfirmId(null)}
              disabled={deleteExamRoomMutation.isPending}
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={() => deleteConfirmId && handleDelete(deleteConfirmId)}
              disabled={deleteExamRoomMutation.isPending}
            >
              {deleteExamRoomMutation.isPending ? "Deleting..." : "Delete"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
