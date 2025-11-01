"use client";

import { useState, useEffect, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
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
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Plus, Pencil, Trash2, Loader2, AlertCircle, Search, ChevronLeft, ChevronRight } from "lucide-react";
import { CreateRoomRequest } from "@/services/api/room";
import type { Room } from "@/types/room";
import { useToast } from "@/hooks/use-toast";
import { useRooms, useCreateRoom, useUpdateRoom, useDeleteRoom } from "@/hooks/use-rooms";

const ROOM_TYPES = [
  { value: "classroom", label: "Classroom" },
  { value: "lab", label: "Laboratory" },
  { value: "seminar", label: "Seminar Hall" },
  { value: "library", label: "Library" },
  { value: "auditorium", label: "Auditorium" },
];

export default function RoomsPage() {
  const { toast } = useToast();
  const [open, setOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [roomToDelete, setRoomToDelete] = useState<Room | null>(null);
  const [editMode, setEditMode] = useState(false);
  const [selectedRoom, setSelectedRoom] = useState<Room | null>(null);
  const [filteredRooms, setFilteredRooms] = useState<Room[]>([]);

  // Pagination & Search & Filter
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [filterRoomType, setFilterRoomType] = useState<string>("");
  const [filterStatus, setFilterStatus] = useState<string>("");

  const [formData, setFormData] = useState<CreateRoomRequest>({
    room_number: "",
    room_name: "",
    floor: undefined,
    capacity: 30,
    room_type: "classroom",
    description: "",
    status: true,
  });

  // Hooks
  const { data: roomsData, isLoading, error: roomsError } = useRooms();
  const createRoomMutation = useCreateRoom();
  const updateRoomMutation = useUpdateRoom();
  const deleteRoomMutation = useDeleteRoom();

  // Handle API response format - memoized to prevent infinite loop
  const rooms = useMemo(() => {
    return Array.isArray(roomsData) ? roomsData : (roomsData?.data || []);
  }, [roomsData]);

  const error = roomsError ? String(roomsError) : "";

  useEffect(() => {
    let filtered = rooms;

    if (searchQuery) {
      filtered = filtered.filter((room) =>
        room.room_number.toLowerCase().includes(searchQuery.toLowerCase()) ||
        room.room_name.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    if (filterRoomType) {
      filtered = filtered.filter((room) => room.room_type === filterRoomType);
    }

    if (filterStatus) {
      const statusBool = filterStatus === "active";
      filtered = filtered.filter((room) => room.status === statusBool);
    }

    setFilteredRooms(filtered);
    setCurrentPage(1);
  }, [searchQuery, rooms, filterRoomType, filterStatus]);

  const handleOpenDialog = (room?: Room) => {
    if (room) {
      setEditMode(true);
      setSelectedRoom(room);
      setFormData({
        room_number: room.room_number,
        room_name: room.room_name,
        floor: room.floor,
        capacity: room.capacity,
        room_type: room.room_type,
        description: room.description,
        status: room.status,
      });
    } else {
      setEditMode(false);
      setSelectedRoom(null);
      setFormData({
        room_number: "",
        room_name: "",
        floor: undefined,
        capacity: 30,
        room_type: "classroom",
        description: "",
        status: true,
      });
    }
    setOpen(true);
  };

  const handleCloseDialog = () => {
    setOpen(false);
  };

  const resetForm = () => {
    setEditMode(false);
    setSelectedRoom(null);
    setFormData({
      room_number: "",
      room_name: "",
      floor: undefined,
      capacity: 30,
      room_type: "classroom",
      description: "",
      status: true,
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.room_number || !formData.room_name || !formData.capacity) {
      toast({
        title: "Validation Error",
        description: "Please fill in all required fields",
        variant: "destructive",
      });
      return;
    }

    if (editMode && selectedRoom) {
      updateRoomMutation.mutate(
        { id: selectedRoom.id, data: formData },
        {
          onSuccess: () => {
            toast({
              title: "Success",
              description: "Room updated successfully",
            });
            handleCloseDialog();
          },
          onError: (err: any) => {
            const errorMsg = err?.response?.data?.message || "Failed to update room";
            toast({
              title: "Error",
              description: errorMsg,
              variant: "destructive",
            });
          },
        }
      );
    } else {
      createRoomMutation.mutate(formData, {
        onSuccess: () => {
          toast({
            title: "Success",
            description: "Room created successfully",
          });
          handleCloseDialog();
        },
        onError: (err: any) => {
          const errorMsg = err?.response?.data?.message || "Failed to create room";
          toast({
            title: "Error",
            description: errorMsg,
            variant: "destructive",
          });
        },
      });
    }
  };

  const handleOpenDeleteDialog = (room: Room) => {
    setRoomToDelete(room);
    setDeleteDialogOpen(true);
  };

  const handleDelete = () => {
    if (!roomToDelete) return;

    deleteRoomMutation.mutate(roomToDelete.id, {
      onSuccess: () => {
        toast({
          title: "Success",
          description: "Room deleted successfully",
        });
        setDeleteDialogOpen(false);
        setRoomToDelete(null);
      },
      onError: (err: any) => {
        const errorMsg = err?.response?.data?.message || "Failed to delete room";
        toast({
          title: "Error",
          description: errorMsg,
          variant: "destructive",
        });
      },
    });
  };

  // Pagination calculations
  const totalPages = Math.ceil(filteredRooms.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentRooms = filteredRooms.slice(startIndex, endIndex);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Rooms</h1>
          <p className="text-gray-500 mt-1">Manage classroom and facility rooms</p>
        </div>
        <Button onClick={() => handleOpenDialog()}>
          <Plus className="mr-2 h-4 w-4" />
          Add Room
        </Button>
      </div>

      {error && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {/* Search and Filters */}
      <Card>
        <CardContent className="pt-6">
          <div className="space-y-4">
            <div className="flex items-center gap-4">
              <div className="relative flex-1 max-w-sm">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                <Input
                  placeholder="Search by room number or name..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
              <Select value={itemsPerPage.toString()} onValueChange={(val) => setItemsPerPage(parseInt(val))}>
                <SelectTrigger className="w-32">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="5">5 per page</SelectItem>
                  <SelectItem value="10">10 per page</SelectItem>
                  <SelectItem value="20">20 per page</SelectItem>
                  <SelectItem value="50">50 per page</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="flex gap-4">
              <Select value={filterRoomType || "all-types"} onValueChange={(value) => setFilterRoomType(value === "all-types" ? "" : value)}>
                <SelectTrigger className="w-40">
                  <SelectValue placeholder="Filter by type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all-types">All Types</SelectItem>
                  {ROOM_TYPES.map((type) => (
                    <SelectItem key={type.value} value={type.value}>
                      {type.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Select value={filterStatus || "all-status"} onValueChange={(value) => setFilterStatus(value === "all-status" ? "" : value)}>
                <SelectTrigger className="w-40">
                  <SelectValue placeholder="Filter by status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all-status">All Status</SelectItem>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="inactive">Inactive</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Dialog */}
      <Dialog open={open} onOpenChange={(isOpen) => {
        if (!isOpen) {
          handleCloseDialog();
          resetForm();
        }
      }}>
        <DialogContent className="max-w-md">
          <form onSubmit={handleSubmit}>
            <DialogHeader>
              <DialogTitle>{editMode ? 'Edit' : 'Add'} Room</DialogTitle>
              <DialogDescription>
                {editMode ? 'Update the' : 'Create a new'} room for your institution.
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="room_number">Room Number *</Label>
                  <Input 
                    id="room_number" 
                    placeholder="e.g., A101"
                    value={formData.room_number}
                    onChange={(e) => setFormData({ ...formData, room_number: e.target.value })}
                    required
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="capacity">Capacity *</Label>
                  <Input 
                    id="capacity" 
                    type="number"
                    min="1"
                    value={formData.capacity}
                    onChange={(e) => setFormData({ ...formData, capacity: parseInt(e.target.value) })}
                    required
                  />
                </div>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="room_name">Room Name *</Label>
                <Input 
                  id="room_name" 
                  placeholder="e.g., Mathematics Lab"
                  value={formData.room_name}
                  onChange={(e) => setFormData({ ...formData, room_name: e.target.value })}
                  required
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="room_type">Room Type *</Label>
                  <Select value={formData.room_type} onValueChange={(val) => setFormData({ ...formData, room_type: val })}>
                    <SelectTrigger id="room_type">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {ROOM_TYPES.map((type) => (
                        <SelectItem key={type.value} value={type.value}>
                          {type.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="floor">Floor</Label>
                  <Input 
                    id="floor" 
                    type="number"
                    value={formData.floor || ""}
                    onChange={(e) => setFormData({ ...formData, floor: e.target.value ? parseInt(e.target.value) : undefined })}
                  />
                </div>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="description">Description</Label>
                <Input 
                  id="description" 
                  placeholder="Add any additional notes..."
                  value={formData.description || ""}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                />
              </div>
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="status"
                  checked={formData.status || false}
                  onChange={(e) => setFormData({ ...formData, status: e.target.checked })}
                  className="h-4 w-4 rounded border-gray-300"
                />
                <Label htmlFor="status" className="cursor-pointer">Room is active</Label>
              </div>
            </div>
            <DialogFooter>
              <Button
                variant="outline"
                type="button"
                onClick={() => {
                  handleCloseDialog();
                  resetForm();
                }}
                disabled={createRoomMutation.isPending || updateRoomMutation.isPending}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={createRoomMutation.isPending || updateRoomMutation.isPending}
              >
                {createRoomMutation.isPending || updateRoomMutation.isPending ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Saving...
                  </>
                ) : (
                  `${editMode ? 'Update' : 'Save'} Room`
                )}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Table */}
      {isLoading ? (
        <div className="flex justify-center items-center py-16">
          <Loader2 className="h-8 w-8 animate-spin text-gray-400" />
        </div>
      ) : filteredRooms.length === 0 ? (
        <Card>
          <CardContent className="text-center py-16">
            <p className="text-gray-500">
              {searchQuery ? "No rooms found matching your search." : "No rooms found. Create one to get started."}
            </p>
          </CardContent>
        </Card>
      ) : (
        <>
          <Card>
            <CardHeader className="pb-4">
              <CardTitle className="text-lg">Rooms List</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="rounded-lg border overflow-hidden bg-white">
                <Table>
                  <TableHeader>
                    <TableRow className="bg-gray-50 hover:bg-gray-50">
                      <TableHead>Room Number</TableHead>
                      <TableHead>Room Name</TableHead>
                      <TableHead>Type</TableHead>
                      <TableHead className="text-right">Capacity</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {currentRooms.map((room) => (
                      <TableRow key={room.id} className="hover:bg-gray-50">
                        <TableCell className="font-medium">{room.room_number}</TableCell>
                        <TableCell>{room.room_name}</TableCell>
                        <TableCell className="capitalize">{room.room_type}</TableCell>
                        <TableCell className="text-right">{room.capacity}</TableCell>
                        <TableCell>
                          <Badge
                            className={
                              room.status
                                ? "bg-green-100 text-green-800 hover:bg-green-100"
                                : "bg-gray-100 text-gray-800 hover:bg-gray-100"
                            }
                          >
                            {room.status ? "Active" : "Inactive"}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex justify-end gap-2">
                            <Button 
                              variant="ghost" 
                              size="icon"
                              onClick={() => handleOpenDialog(room)}
                            >
                              <Pencil className="h-4 w-4" />
                            </Button>
                            <Button 
                              variant="ghost" 
                              size="icon" 
                              className="text-red-600 hover:text-red-700 hover:bg-red-50"
                              onClick={() => handleOpenDeleteDialog(room)}
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
            </CardContent>
          </Card>

          {/* Pagination */}
          {totalPages > 1 && (
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <p className="text-sm text-gray-600">
                    Showing <span className="font-medium">{startIndex + 1}</span> to <span className="font-medium">{Math.min(endIndex, filteredRooms.length)}</span> of <span className="font-medium">{filteredRooms.length}</span> results
                  </p>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handlePageChange(currentPage - 1)}
                      disabled={currentPage === 1}
                    >
                      <ChevronLeft className="h-4 w-4" />
                    </Button>
                    {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                      <Button
                        key={page}
                        variant={currentPage === page ? "default" : "outline"}
                        size="sm"
                        onClick={() => handlePageChange(page)}
                      >
                        {page}
                      </Button>
                    ))}
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handlePageChange(currentPage + 1)}
                      disabled={currentPage === totalPages}
                    >
                      <ChevronRight className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </>
      )}

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete the room <strong>{roomToDelete?.room_name}</strong>.
              This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setRoomToDelete(null)}>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              className="bg-red-600 hover:bg-red-700 focus:ring-red-600"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
