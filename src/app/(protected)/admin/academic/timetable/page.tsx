"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Plus, Calendar, Users, BookOpen, Loader2 } from "lucide-react";
import { useTimetables, useTimetableByClass, useTimetableStatistics } from "@/hooks/use-timetable";
import { TimetableDialog } from "@/components/timetable/timetable-dialog";
import { CreateTimetableInput, DAY_LABELS, DAYS_OF_WEEK, Timetable } from "@/types/timetable";
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "sonner";

// Mock data - Replace with real API calls
import { schoolClassService } from "@/services/schoolClass";
import { sectionService } from "@/services/section";
import { subjectService } from "@/services/subject";
import { academicYearService } from "@/services/api/academic-year";

export default function TimetablePage() {
  const [selectedClassId, setSelectedClassId] = useState<number | null>(null);
  const [selectedSectionId, setSelectedSectionId] = useState<number | null>(null);
  const [selectedAcademicYearId, setSelectedAcademicYearId] = useState<number | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingTimetable, setEditingTimetable] = useState<Timetable | null>(null);

  // Fetch dropdown data
  const [classes, setClasses] = useState<any[]>([]);
  const [sections, setSections] = useState<any[]>([]);
  const [subjects, setSubjects] = useState<any[]>([]);
  const [teachers, setTeachers] = useState<any[]>([]);
  const [academicYears, setAcademicYears] = useState<any[]>([]);
  const [isLoadingData, setIsLoadingData] = useState(true);

  // Fetch timetable data
  const {
    timetable,
    isLoading: isTimetableLoading,
    refetch,
  } = useTimetableByClass(selectedClassId, selectedSectionId, selectedAcademicYearId ?? undefined);

  const { statistics, isLoading: isStatsLoading } = useTimetableStatistics(
    selectedAcademicYearId ?? undefined
  );

  const { createTimetable, updateTimetable, deleteTimetable, isCreating, isUpdating, isDeleting } =
    useTimetables();

  // Load initial data
  useEffect(() => {
    const loadData = async () => {
      try {
        setIsLoadingData(true);

        // Load classes, sections, subjects, teachers, academic years
        const [classesRes, sectionsRes, subjectsRes, yearsRes] = await Promise.all([
          schoolClassService.getAll({ per_page: 'all' }),
          sectionService.getAll({ per_page: 'all' }),
          subjectService.getAll({ per_page: 'all' }),
          academicYearService.getAll(),
        ]);

        setClasses(classesRes.data || []);
        setSections(sectionsRes.data || []);
        setSubjects(subjectsRes.data || []);
        setAcademicYears(yearsRes || []);

        // Set default academic year to current
        const currentYear = yearsRes?.find((y: any) => y.is_current);
        if (currentYear) {
          setSelectedAcademicYearId(currentYear.id);
        }

        // TODO: Load teachers from API
        setTeachers([]);
      } catch (error) {
        toast.error("Failed to load initial data");
      } finally {
        setIsLoadingData(false);
      }
    };

    loadData();
  }, []);

  // Filter sections based on selected class
  const filteredSections = sections.filter(
    (s) => s.schoolClassId === selectedClassId
  );

  const handleCreate = () => {
    setEditingTimetable(null);
    setIsDialogOpen(true);
  };

  const handleEdit = (entry: Timetable) => {
    setEditingTimetable(entry);
    setIsDialogOpen(true);
  };

  const handleDelete = async (id: number) => {
    if (confirm("Are you sure you want to delete this timetable entry?")) {
      try {
        await deleteTimetable(id);
        refetch();
      } catch (error) {
        // Error handled by mutation
      }
    }
  };

  const handleSubmit = async (data: CreateTimetableInput) => {
    if (editingTimetable) {
      await updateTimetable({ id: editingTimetable.id, data });
    } else {
      await createTimetable(data);
    }
  };

  const handleSuccess = () => {
    refetch();
  };

  const renderTimetableGrid = () => {
    if (!selectedClassId || !selectedSectionId) {
      return (
        <Card>
          <CardContent className="p-12 text-center text-gray-500">
            Please select a class and section to view the timetable
          </CardContent>
        </Card>
      );
    }

    if (isTimetableLoading) {
      return (
        <Card>
          <CardContent className="p-12 text-center">
            <Loader2 className="h-8 w-8 animate-spin mx-auto text-gray-400" />
            <p className="text-gray-500 mt-4">Loading timetable...</p>
          </CardContent>
        </Card>
      );
    }

    if (!timetable) {
      return (
        <Card>
          <CardContent className="p-12 text-center text-gray-500">
            No timetable data available
          </CardContent>
        </Card>
      );
    }

    // Get unique periods across all days
    const allSlots: any[] = [];
    Object.values(timetable).forEach((daySlots: any) => {
      allSlots.push(...daySlots);
    });

    const periods = Array.from(
      new Set(allSlots.map((slot) => slot.period_number))
    ).sort((a, b) => a - b);

    return (
      <Card>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr>
                  <th className="border p-3 bg-gray-50 font-medium text-left min-w-[100px]">
                    Period
                  </th>
                  {DAYS_OF_WEEK.map((day) => (
                    <th
                      key={day}
                      className="border p-3 bg-gray-50 font-medium text-center min-w-[150px]"
                    >
                      {DAY_LABELS[day]}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {periods.map((periodNum) => {
                  // Find any slot with this period to get time info
                  const sampleSlot = allSlots.find((s) => s.period_number === periodNum);
                  const timeLabel = sampleSlot
                    ? `${sampleSlot.start_time} - ${sampleSlot.end_time}`
                    : `Period ${periodNum}`;

                  return (
                    <tr key={periodNum}>
                      <td className="border p-3 font-medium bg-gray-50">
                        <div className="text-sm">Period {periodNum}</div>
                        <div className="text-xs text-gray-500">{timeLabel}</div>
                      </td>
                      {DAYS_OF_WEEK.map((day) => {
                        const daySlots = timetable[day] || [];
                        const slot = daySlots.find((s: any) => s.period_number === periodNum);

                        return (
                          <td
                            key={day}
                            className="border p-2 hover:bg-blue-50 cursor-pointer transition-colors"
                            onClick={() => slot && handleEdit(slot)}
                          >
                            {slot ? (
                              <div className="p-2 rounded bg-blue-100 text-blue-900 text-sm">
                                <div className="font-semibold">
                                  {slot.subject?.name || "Subject"}
                                </div>
                                <div className="text-xs mt-1 text-blue-700">
                                  {slot.teacher?.user
                                    ? `${slot.teacher.user.firstName} ${slot.teacher.user.lastName}`
                                    : "Teacher"}
                                </div>
                                {slot.room_number && (
                                  <div className="text-xs mt-1 text-blue-600">
                                    Room: {slot.room_number}
                                  </div>
                                )}
                              </div>
                            ) : (
                              <div className="p-2 text-center text-gray-400 text-sm">-</div>
                            )}
                          </td>
                        );
                      })}
                    </tr>
                  );
                })}
                {periods.length === 0 && (
                  <tr>
                    <td colSpan={7} className="border p-12 text-center text-gray-500">
                      No periods scheduled yet. Click "Add Period" to create one.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    );
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Timetable Management</h1>
          <p className="text-gray-500 mt-1">Manage class schedules and periods</p>
        </div>
        <Button onClick={handleCreate} disabled={!selectedClassId || !selectedSectionId}>
          <Plus className="mr-2 h-4 w-4" />
          Add Period
        </Button>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {isStatsLoading ? (
          <>
            {[1, 2, 3, 4].map((i) => (
              <Card key={i}>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <Skeleton className="h-4 w-20" />
                  <Skeleton className="h-4 w-4" />
                </CardHeader>
                <CardContent>
                  <Skeleton className="h-8 w-16" />
                </CardContent>
              </Card>
            ))}
          </>
        ) : (
          <>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Periods</CardTitle>
                <Calendar className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{statistics?.total || 0}</div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Teachers</CardTitle>
                <Users className="h-4 w-4 text-blue-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-blue-600">
                  {statistics?.total_teachers || 0}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Classes</CardTitle>
                <BookOpen className="h-4 w-4 text-green-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-green-600">
                  {statistics?.total_classes || 0}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Academic Year</CardTitle>
                <Calendar className="h-4 w-4 text-orange-600" />
              </CardHeader>
              <CardContent>
                <div className="text-sm font-bold text-orange-600">
                  {academicYears.find((y) => y.id === selectedAcademicYearId)?.name || "-"}
                </div>
              </CardContent>
            </Card>
          </>
        )}
      </div>

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle>Filters</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <Select
                value={selectedAcademicYearId?.toString()}
                onValueChange={(value) => setSelectedAcademicYearId(parseInt(value))}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select academic year" />
                </SelectTrigger>
                <SelectContent>
                  {academicYears.map((year) => (
                    <SelectItem key={year.id} value={year.id.toString()}>
                      {year.name} {year.is_current && "(Current)"}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="flex-1">
              <Select
                value={selectedClassId?.toString()}
                onValueChange={(value) => {
                  setSelectedClassId(parseInt(value));
                  setSelectedSectionId(null);
                }}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select class" />
                </SelectTrigger>
                <SelectContent>
                  {classes.map((cls) => (
                    <SelectItem key={cls.id} value={cls.id.toString()}>
                      {cls.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="flex-1">
              <Select
                value={selectedSectionId?.toString()}
                onValueChange={(value) => setSelectedSectionId(parseInt(value))}
                disabled={!selectedClassId || filteredSections.length === 0}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select section" />
                </SelectTrigger>
                <SelectContent>
                  {filteredSections.map((section) => (
                    <SelectItem key={section.id} value={section.id.toString()}>
                      {section.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Timetable Grid */}
      {renderTimetableGrid()}

      {/* Create/Edit Dialog */}
      <TimetableDialog
        open={isDialogOpen}
        onOpenChange={setIsDialogOpen}
        onSuccess={handleSuccess}
        onSubmit={handleSubmit}
        editData={editingTimetable}
        classes={classes}
        sections={sections}
        subjects={subjects}
        teachers={teachers}
        academicYears={academicYears}
        isSubmitting={isCreating || isUpdating}
      />
    </div>
  );
}
