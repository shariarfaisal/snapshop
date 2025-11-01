"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  Users,
  MapPin,
  Grid3x3,
  Download,
  Shuffle,
  Trash2,
  AlertCircle,
  CheckCircle,
  Printer
} from "lucide-react";
import { Exam, SeatPlan } from "@/types/exam";
import { useToast } from "@/hooks/use-toast";
import {
  useExams,
  useSeatPlan,
  useAllocateSeatsAuto,
  useClearSeatAllocations,
  useExamParticipantStats,
} from "@/hooks/use-exams";

export default function SeatPlanPage() {
  const { toast } = useToast();
  const [selectedExamId, setSelectedExamId] = useState<number | null>(null);

  // Hooks
  const { data: examsData } = useExams();
  const { data: seatPlanData, isLoading: loading } = useSeatPlan(selectedExamId);
  const { data: participantStats } = useExamParticipantStats(selectedExamId);
  const allocateMutation = useAllocateSeatsAuto();
  const clearMutation = useClearSeatAllocations();

  // Handle API response formats
  const exams = Array.isArray(examsData) ? examsData : (examsData as any)?.data || [];
  const seatPlan = Array.isArray(seatPlanData) ? seatPlanData : [];
  const participantCount = participantStats?.registered || 0;

  // Set default exam when data loads
  useEffect(() => {
    if (exams.length > 0 && selectedExamId === null) {
      setSelectedExamId(exams[0].id);
    }
  }, [exams, selectedExamId]);

  const handleAutoAllocate = () => {
    if (!selectedExamId) return;

    if (participantCount === 0) {
      toast({
        title: "No Participants",
        description: "Please register participants before allocating seats",
        variant: "destructive",
      });
      return;
    }

    allocateMutation.mutate(
      { exam_id: selectedExamId },
      {
        onSuccess: () => {
          toast({
            title: "Success",
            description: "Seats allocated successfully",
          });
        },
        onError: (error: any) => {
          toast({
            title: "Error",
            description: error?.message || "Failed to allocate seats",
            variant: "destructive",
          });
        },
      }
    );
  };

  const handleClearAllocations = () => {
    if (!selectedExamId) return;

    if (!confirm("Are you sure you want to clear all seat allocations?")) return;

    clearMutation.mutate(
      { examId: selectedExamId },
      {
        onSuccess: () => {
          toast({
            title: "Success",
            description: "Seat allocations cleared",
          });
        },
        onError: () => {
          toast({
            title: "Error",
            description: "Failed to clear allocations",
            variant: "destructive",
          });
        },
      }
    );
  };

  const handlePrint = () => {
    window.print();
  };

  const totalSeatsAllocated = seatPlan.reduce((sum, room) => sum + room.seats.length, 0);
  const totalRooms = seatPlan.length;

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center print:hidden">
        <div>
          <h1 className="text-3xl font-bold">Seat Plan</h1>
          <p className="text-gray-500 mt-1">Manage and visualize exam seat allocations</p>
        </div>
        <div className="flex gap-2">
          {seatPlan.length > 0 && (
            <>
              <Button variant="outline" onClick={handlePrint}>
                <Printer className="mr-2 h-4 w-4" />
                Print
              </Button>
              <Button variant="outline" onClick={handleClearAllocations}>
                <Trash2 className="mr-2 h-4 w-4" />
                Clear
              </Button>
            </>
          )}
          <Button onClick={handleAutoAllocate} disabled={allocateMutation.isPending}>
            <Shuffle className="mr-2 h-4 w-4" />
            {allocateMutation.isPending ? "Allocating..." : "Auto Allocate"}
          </Button>
        </div>
      </div>

      {/* Exam Selection */}
      <Card className="print:hidden">
        <CardHeader>
          <CardTitle>Select Exam</CardTitle>
        </CardHeader>
        <CardContent>
          <Select
            value={selectedExamId?.toString()}
            onValueChange={(value) => setSelectedExamId(parseInt(value))}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select an exam" />
            </SelectTrigger>
            <SelectContent>
              {exams.map((exam) => (
                <SelectItem key={exam.id} value={exam.id.toString()}>
                  {exam.name} - {exam.academic_year?.name || "N/A"}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </CardContent>
      </Card>

      {selectedExamId && (
        <>
          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 print:hidden">
            <Card>
              <CardContent className="pt-6">
                <Users className="h-8 w-8 text-blue-600 mb-2" />
                <p className="text-sm text-gray-600">Total Participants</p>
                <p className="text-2xl font-bold">{participantCount}</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-6">
                <Grid3x3 className="h-8 w-8 text-green-600 mb-2" />
                <p className="text-sm text-gray-600">Seats Allocated</p>
                <p className="text-2xl font-bold">{totalSeatsAllocated}</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-6">
                <MapPin className="h-8 w-8 text-purple-600 mb-2" />
                <p className="text-sm text-gray-600">Rooms Used</p>
                <p className="text-2xl font-bold">{totalRooms}</p>
              </CardContent>
            </Card>
          </div>

          {/* Seat Plan */}
          {loading ? (
            <Card>
              <CardContent className="py-12 text-center">
                <div>Loading seat plan...</div>
              </CardContent>
            </Card>
          ) : seatPlan.length === 0 ? (
            <Card className="print:hidden">
              <CardContent className="py-12 text-center">
                <Grid3x3 className="mx-auto h-16 w-16 text-gray-400 mb-4" />
                <h3 className="text-lg font-semibold mb-2">No Seat Plan Yet</h3>
                <p className="text-gray-600 mb-4">
                  Click "Auto Allocate" to generate seat allocations automatically
                </p>
                {participantCount === 0 && (
                  <Alert className="max-w-md mx-auto">
                    <AlertCircle className="h-4 w-4" />
                    <AlertDescription>
                      Please register participants first before allocating seats
                    </AlertDescription>
                  </Alert>
                )}
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-6">
              {seatPlan.map((room) => (
                <Card key={room.room.id}>
                  <CardHeader>
                    <div className="flex justify-between items-center">
                      <div>
                        <CardTitle className="flex items-center gap-2">
                          <MapPin className="h-5 w-5" />
                          {room.room.name}
                        </CardTitle>
                        <p className="text-sm text-gray-600 mt-1">
                          {room.room.building && `${room.room.building} - `}
                          {room.room.floor && room.room.floor}
                          {room.room.building || room.room.floor ? " | " : ""}
                          Capacity: {room.room.capacity} | Occupied: {room.seats.length}
                        </p>
                      </div>
                      <Badge className="bg-blue-100 text-blue-800">
                        {room.seats.length} Seats
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-5 md:grid-cols-10 gap-2">
                      {room.seats.map((seat) => (
                        <div
                          key={seat.allocation_id}
                          className="border rounded-lg p-3 hover:shadow-md transition-shadow bg-white"
                          title={`${seat.participant.student_name} (${seat.participant.roll_number})`}
                        >
                          <div className="text-center">
                            <div className="text-xs font-semibold text-gray-600 mb-1">
                              {seat.seat_number}
                            </div>
                            <div className="text-xs font-medium truncate">
                              {seat.participant.student_name.split(" ")[0]}
                            </div>
                            <div className="text-xs text-gray-500 mt-1">
                              {seat.participant.roll_number}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}

          {/* Print View */}
          <div className="hidden print:block">
            <div className="text-center mb-8">
              <h1 className="text-3xl font-bold mb-2">Examination Seat Plan</h1>
              <p className="text-lg">
                {exams.find((e) => e.id === selectedExamId)?.name}
              </p>
            </div>

            {seatPlan.map((room) => (
              <div key={room.room.id} className="mb-8 page-break-inside-avoid">
                <h2 className="text-xl font-bold mb-4 border-b pb-2">
                  {room.room.name} ({room.seats.length} students)
                </h2>
                <div className="grid grid-cols-10 gap-2">
                  {room.seats.map((seat) => (
                    <div
                      key={seat.allocation_id}
                      className="border p-2 text-center text-xs"
                    >
                      <div className="font-semibold">{seat.seat_number}</div>
                      <div className="truncate">{seat.participant.student_name}</div>
                      <div className="text-gray-600">{seat.participant.roll_number}</div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
