"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import {
  CreditCard,
  Download,
  Eye,
  FileText,
  Zap,
  CheckCircle,
  Users,
  QrCode,
  Barcode
} from "lucide-react";
import { Exam, AdmitCard, AdmitCardData } from "@/types/exam";
import { useToast } from "@/hooks/use-toast";
import {
  useExams,
  useAdmitCardsByExam,
  useExamParticipantStats,
  useBulkGenerateAdmitCards,
  useAdmitCardData,
} from "@/hooks/use-exams";

export default function AdmitCardsPage() {
  const { toast } = useToast();
  const [selectedExamId, setSelectedExamId] = useState<number | null>(null);
  const [previewParticipantId, setPreviewParticipantId] = useState<number | null>(null);
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);

  // Hooks
  const { data: examsData } = useExams();
  const { data: admitCardsData, isLoading: loading } = useAdmitCardsByExam(selectedExamId);
  const { data: participantStats } = useExamParticipantStats(selectedExamId);
  const { data: previewData } = useAdmitCardData(isPreviewOpen ? previewParticipantId : null);
  const generateMutation = useBulkGenerateAdmitCards();

  // Handle API response formats
  const exams = Array.isArray(examsData) ? examsData : (examsData as any)?.data || [];
  const admitCards = Array.isArray(admitCardsData) ? admitCardsData : [];
  const stats = {
    total: participantStats?.total || 0,
    generated: participantStats?.with_admit_card || 0,
    pending: (participantStats?.total || 0) - (participantStats?.with_admit_card || 0),
  };

  // Set default exam when data loads
  useEffect(() => {
    if (exams.length > 0 && selectedExamId === null) {
      setSelectedExamId(exams[0].id);
    }
  }, [exams, selectedExamId]);

  const handleBulkGenerate = () => {
    if (!selectedExamId) return;

    if (stats.total === 0) {
      toast({
        title: "No Participants",
        description: "Please register participants before generating admit cards",
        variant: "destructive",
      });
      return;
    }

    generateMutation.mutate(
      { exam_id: selectedExamId },
      {
        onSuccess: (result: any) => {
          toast({
            title: "Success",
            description: `${result?.length || 'Admit cards'} generated successfully`,
          });
        },
        onError: (error: any) => {
          toast({
            title: "Error",
            description: error?.message || "Failed to generate admit cards",
            variant: "destructive",
          });
        },
      }
    );
  };

  const handlePreview = (participantId: number) => {
    setPreviewParticipantId(participantId);
    setIsPreviewOpen(true);
  };

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Admit Cards</h1>
          <p className="text-gray-500 mt-1">Generate and manage exam admit cards</p>
        </div>
        <Button onClick={handleBulkGenerate} disabled={generateMutation.isPending || stats.total === 0}>
          <Zap className="mr-2 h-4 w-4" />
          {generateMutation.isPending ? "Generating..." : "Generate All"}
        </Button>
      </div>

      {/* Exam Selection */}
      <Card>
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
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card>
              <CardContent className="pt-6">
                <Users className="h-8 w-8 text-blue-600 mb-2" />
                <p className="text-sm text-gray-600">Total Participants</p>
                <p className="text-2xl font-bold">{stats.total}</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-6">
                <CheckCircle className="h-8 w-8 text-green-600 mb-2" />
                <p className="text-sm text-gray-600">Cards Generated</p>
                <p className="text-2xl font-bold">{stats.generated}</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-6">
                <CreditCard className="h-8 w-8 text-orange-600 mb-2" />
                <p className="text-sm text-gray-600">Pending</p>
                <p className="text-2xl font-bold">{stats.pending}</p>
              </CardContent>
            </Card>
          </div>

          {/* Admit Cards Table */}
          <Card>
            <CardHeader>
              <div className="flex justify-between items-center">
                <CardTitle>Generated Admit Cards</CardTitle>
                <Button variant="outline" size="sm" disabled={admitCards.length === 0}>
                  <Download className="mr-2 h-4 w-4" />
                  Download All
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              {loading ? (
                <div className="text-center py-8">Loading...</div>
              ) : admitCards.length === 0 ? (
                <div className="text-center py-12 text-gray-500">
                  <CreditCard className="mx-auto h-16 w-16 text-gray-400 mb-4" />
                  <h3 className="text-lg font-semibold mb-2">No Admit Cards Yet</h3>
                  <p className="mb-4">Click "Generate All" to create admit cards for all participants</p>
                  {stats.total === 0 && (
                    <p className="text-sm text-red-600">
                      Please register participants first
                    </p>
                  )}
                </div>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Roll Number</TableHead>
                      <TableHead>Student Name</TableHead>
                      <TableHead>Class</TableHead>
                      <TableHead>Generated At</TableHead>
                      <TableHead>Barcode</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {admitCards.map((card) => (
                      <TableRow key={card.id}>
                        <TableCell className="font-medium">
                          {card.participant?.roll_number}
                        </TableCell>
                        <TableCell>{card.participant?.student?.user?.name || "N/A"}</TableCell>
                        <TableCell>{card.participant?.school_class?.name || "N/A"}</TableCell>
                        <TableCell>
                          {card.generated_at ? formatDate(card.generated_at) : "-"}
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            {card.barcode && (
                              <Badge variant="outline" className="gap-1">
                                <Barcode className="h-3 w-3" />
                                Yes
                              </Badge>
                            )}
                            {card.qr_code && (
                              <Badge variant="outline" className="gap-1">
                                <QrCode className="h-3 w-3" />
                                Yes
                              </Badge>
                            )}
                          </div>
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex justify-end gap-2">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() =>
                                card.participant && handlePreview(card.participant.id)
                              }
                            >
                              <Eye className="h-4 w-4" />
                            </Button>
                            <Button variant="ghost" size="sm">
                              <Download className="h-4 w-4" />
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
        </>
      )}

      {/* Preview Dialog */}
      <Dialog open={isPreviewOpen} onOpenChange={setIsPreviewOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Admit Card Preview</DialogTitle>
            <DialogDescription>Preview of the exam admit card</DialogDescription>
          </DialogHeader>
          {previewData && (
            <div className="space-y-6">
              {/* Header */}
              <div className="text-center border-b pb-4">
                <h2 className="text-2xl font-bold">{previewData.exam.name}</h2>
                <p className="text-gray-600">{previewData.exam.academic_year}</p>
                <p className="text-sm text-gray-500">
                  {previewData.exam.start_date} to {previewData.exam.end_date}
                </p>
              </div>

              {/* Student Info */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <h3 className="font-semibold mb-2">Student Information</h3>
                  <div className="space-y-2 text-sm">
                    <div>
                      <span className="text-gray-600">Name:</span>{" "}
                      <span className="font-medium">{previewData.student.name}</span>
                    </div>
                    <div>
                      <span className="text-gray-600">Roll Number:</span>{" "}
                      <span className="font-medium">{previewData.student.roll_number}</span>
                    </div>
                    <div>
                      <span className="text-gray-600">Class:</span>{" "}
                      <span className="font-medium">{previewData.student.class}</span>
                    </div>
                  </div>
                </div>
                <div className="flex flex-col items-end">
                  {previewData.student.photo && (
                    <img
                      src={previewData.student.photo}
                      alt="Student"
                      className="w-32 h-32 object-cover border rounded"
                    />
                  )}
                </div>
              </div>

              {/* Exam Schedule */}
              <div>
                <h3 className="font-semibold mb-3">Examination Schedule</h3>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Subject</TableHead>
                      <TableHead>Date</TableHead>
                      <TableHead>Time</TableHead>
                      <TableHead>Duration</TableHead>
                      <TableHead>Room</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {previewData.subjects.map((subject, idx) => (
                      <TableRow key={idx}>
                        <TableCell>{subject.name}</TableCell>
                        <TableCell>{subject.date}</TableCell>
                        <TableCell>{subject.time}</TableCell>
                        <TableCell>{subject.duration}</TableCell>
                        <TableCell>{subject.room}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>

              {/* Seat Allocation */}
              {previewData.seat_allocations.length > 0 && (
                <div>
                  <h3 className="font-semibold mb-2">Seat Allocation</h3>
                  <div className="space-y-1 text-sm">
                    {previewData.seat_allocations.map((seat, idx) => (
                      <div key={idx}>
                        <span className="text-gray-600">Room:</span>{" "}
                        <span className="font-medium">{seat.room}</span>
                        {" | "}
                        <span className="text-gray-600">Seat:</span>{" "}
                        <span className="font-medium">{seat.seat_number}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Barcode/QR */}
              <div className="flex gap-4 justify-center pt-4 border-t">
                {previewData.admit_card.barcode && (
                  <div className="text-center">
                    <div className="font-mono text-sm mb-1">
                      {previewData.admit_card.barcode}
                    </div>
                    <Barcode className="mx-auto h-16 w-32" />
                    <p className="text-xs text-gray-500 mt-1">Barcode</p>
                  </div>
                )}
                {previewData.admit_card.qr_code && (
                  <div className="text-center">
                    <QrCode className="mx-auto h-24 w-24" />
                    <p className="text-xs text-gray-500 mt-1">QR Code</p>
                  </div>
                )}
              </div>

              {/* Footer */}
              <div className="text-center text-xs text-gray-500 pt-4 border-t">
                Generated on {previewData.admit_card.generated_at || "N/A"}
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
