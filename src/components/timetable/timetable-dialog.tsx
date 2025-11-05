"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { CreateTimetableInput, DAY_LABELS, DAYS_OF_WEEK, Timetable } from "@/types/timetable";
import { Loader2, AlertCircle } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useCheckConflicts } from "@/hooks/use-timetable";
import { teacherService } from "@/services/teacher";
import { roomService } from "@/services/api/room";
import type { Teacher } from "@/types/teacher";
import type { Room } from "@/types/room";

const timetableSchema = z.object({
  class_id: z.number({ required_error: "Class is required" }).min(1, "Class is required"),
  section_id: z.number({ required_error: "Section is required" }).min(1, "Section is required"),
  subject_id: z.number({ required_error: "Subject is required" }).min(1, "Subject is required"),
  teacher_id: z.number({ required_error: "Teacher is required" }).min(1, "Teacher is required"),
  academic_year_id: z
    .number({ required_error: "Academic year is required" })
    .min(1, "Academic year is required"),
  day_of_week: z.enum(["sunday", "monday", "tuesday", "wednesday", "thursday", "friday", "saturday"], {
    required_error: "Day of week is required",
  }),
  period_number: z.number({ required_error: "Period number is required" }).min(1).max(10),
  start_time: z.string().regex(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, "Invalid time format (HH:MM)"),
  end_time: z.string().regex(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, "Invalid time format (HH:MM)"),
  room_id: z.number().optional(),
});

interface TimetableDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess: () => void;
  onSubmit: (data: CreateTimetableInput) => Promise<void>;
  editData?: Timetable | null;
  selectedClassId?: number | null;
  selectedSectionId?: number | null;
  selectedAcademicYearId?: number | null;
  classes?: Array<{ id: number; name: string }>;
  sections?: Array<{ id: number; name: string; schoolClassId: number }>;
  subjects?: Array<{ id: number; subject_name: string }>;
  teachers?: Array<{ id: number; user?: { firstName: string; lastName: string } }>;
  academicYears?: Array<{ id: number; name: string; is_current: boolean }>;
  isSubmitting?: boolean;
}

export function TimetableDialog({
  open,
  onOpenChange,
  onSuccess,
  onSubmit,
  editData,
  selectedClassId: propClassId,
  selectedSectionId: propSectionId,
  selectedAcademicYearId: propAcademicYearId,
  classes = [],
  sections = [],
  subjects = [],
  teachers: initialTeachers = [],
  academicYears = [],
  isSubmitting = false,
}: TimetableDialogProps) {
  const [conflictWarnings, setConflictWarnings] = useState<string[]>([]);
  const [loadingTeachers, setLoadingTeachers] = useState(false);
  const [loadingRooms, setLoadingRooms] = useState(false);
  const [allTeachers, setAllTeachers] = useState<Teacher[]>([]);
  const [allRooms, setAllRooms] = useState<Room[]>([]);
  const { checkConflicts, isChecking } = useCheckConflicts();

  const form = useForm<CreateTimetableInput>({
    resolver: zodResolver(timetableSchema),
    defaultValues: editData
      ? {
          class_id: editData.class_id,
          section_id: editData.section_id,
          subject_id: editData.subject_id,
          teacher_id: editData.teacher_id,
          academic_year_id: editData.academic_year_id,
          day_of_week: editData.day_of_week,
          period_number: editData.period_number,
          start_time: editData.start_time,
          end_time: editData.end_time,
          room_id: editData.room_id || undefined,
        }
      : {
          class_id: propClassId || undefined,
          section_id: propSectionId || undefined,
          academic_year_id: propAcademicYearId || undefined,
          period_number: 1,
          start_time: "09:00",
          end_time: "10:00",
        },
  });

  // Fetch teachers and rooms on dialog open
  useEffect(() => {
    if (open) {
      loadTeachers();
      loadRooms();
    }
  }, [open]);

  const loadTeachers = async () => {
    try {
      setLoadingTeachers(true);
      const data = await teacherService.getTeachers({ per_page: 100 });
      setAllTeachers(data.data || []);
    } catch (error) {
      console.error("Failed to load teachers", error);
    } finally {
      setLoadingTeachers(false);
    }
  };

  const loadRooms = async () => {
    try {
      setLoadingRooms(true);
      const data = await roomService.getAllActive();
      setAllRooms(data || []);
    } catch (error) {
      console.error("Failed to load rooms", error);
    } finally {
      setLoadingRooms(false);
    }
  };

  // Reset form when dialog opens/closes or editData changes
  useEffect(() => {
    if (open) {
      if (editData) {
        form.reset({
          class_id: editData.class_id,
          section_id: editData.section_id,
          subject_id: editData.subject_id,
          teacher_id: editData.teacher_id,
          academic_year_id: editData.academic_year_id,
          day_of_week: editData.day_of_week,
          period_number: editData.period_number,
          start_time: editData.start_time,
          end_time: editData.end_time,
          room_id: editData.room_id || undefined,
        });
      } else {
        // Set default values from filter selection
        const currentYear = propAcademicYearId || academicYears.find((y) => y.is_current)?.id;
        form.reset({
          class_id: propClassId || undefined,
          section_id: propSectionId || undefined,
          academic_year_id: currentYear,
          period_number: 1,
          start_time: "09:00",
          end_time: "10:00",
        });
      }
      setConflictWarnings([]);
    }
  }, [open, editData, academicYears, form, propClassId, propSectionId, propAcademicYearId]);

  // Filter sections based on selected class
  const selectedClassId = form.watch("class_id");
  const filteredSections = sections.filter((s) => s.schoolClassId === selectedClassId);

  // Check for conflicts when key fields change
  useEffect(() => {
    const subscription = form.watch(async (value) => {
      if (
        value.class_id &&
        value.section_id &&
        value.subject_id &&
        value.teacher_id &&
        value.academic_year_id &&
        value.day_of_week &&
        value.period_number &&
        value.start_time &&
        value.end_time
      ) {
        try {
          const response = await checkConflicts({
            class_id: value.class_id,
            section_id: value.section_id,
            subject_id: value.subject_id,
            teacher_id: value.teacher_id,
            academic_year_id: value.academic_year_id,
            day_of_week: value.day_of_week,
            period_number: value.period_number,
            start_time: value.start_time,
            end_time: value.end_time,
            room_id: value.room_id,
            exclude_id: editData?.id,
          });
          setConflictWarnings(response?.data?.conflicts || []);
        } catch (error) {
          console.error("Error checking conflicts:", error);
        }
      }
    });

    return () => subscription.unsubscribe();
  }, [form, checkConflicts, editData?.id]);

  async function handleSubmit(data: CreateTimetableInput) {
    try {
      await onSubmit(data);
      onOpenChange(false);
      onSuccess();
    } catch (error) {
      console.error("Error submitting timetable:", error);
    }
  }

  const teachersToDisplay = initialTeachers.length > 0 ? initialTeachers : allTeachers;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
            <DialogHeader>
              <DialogTitle>{editData ? "Edit" : "Add"} Timetable Entry</DialogTitle>
              <DialogDescription>
                {editData
                  ? "Update the timetable entry for this class."
                  : "Create a new timetable entry for your class."}
              </DialogDescription>
            </DialogHeader>

            {/* Subject and Academic Year */}
            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="subject_id"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Subject *</FormLabel>
                    <Select
                      value={field.value?.toString()}
                      onValueChange={(value) => field.onChange(parseInt(value))}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select subject" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {subjects.map((subject) => (
                          <SelectItem key={subject.id} value={subject.id.toString()}>
                            {subject.subject_name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {!propAcademicYearId && (
                <FormField
                  control={form.control}
                  name="academic_year_id"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Academic Year *</FormLabel>
                      <Select
                        value={field.value?.toString()}
                        onValueChange={(value) => field.onChange(parseInt(value))}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select academic year" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {academicYears.map((year) => (
                            <SelectItem key={year.id} value={year.id.toString()}>
                              {year.name} {year.is_current && "(Current)"}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              )}
            </div>

            {/* Class and Section */}
            {(!propClassId || !propSectionId) && (
              <div className="grid grid-cols-2 gap-4">
                {!propClassId && (
                  <FormField
                    control={form.control}
                    name="class_id"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Class *</FormLabel>
                        <Select
                          value={field.value?.toString()}
                          onValueChange={(value) => {
                            field.onChange(parseInt(value));
                            form.setValue("section_id", 0 as any);
                          }}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select class" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {classes.map((cls) => (
                              <SelectItem key={cls.id} value={cls.id.toString()}>
                                {cls.name}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                )}

                {!propSectionId && (
                  <FormField
                    control={form.control}
                    name="section_id"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Section *</FormLabel>
                        <Select
                          value={field.value?.toString()}
                          onValueChange={(value) => field.onChange(parseInt(value))}
                          disabled={!selectedClassId || filteredSections.length === 0}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select section" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {filteredSections.map((section) => (
                              <SelectItem key={section.id} value={section.id.toString()}>
                                {section.name}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                )}
              </div>
            )}

            {/* Teacher and Room */}
            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="teacher_id"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Teacher *</FormLabel>
                    <Select
                      value={field.value?.toString()}
                      onValueChange={(value) => field.onChange(parseInt(value))}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue
                            placeholder={loadingTeachers ? "Loading..." : "Select teacher"}
                          />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {teachersToDisplay.map((teacher) => (
                          <SelectItem key={teacher.id} value={teacher.id.toString()}>
                            {teacher.user
                              ? `${teacher.user.firstName} ${teacher.user.lastName}`
                              : `Teacher #${teacher.id}`}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="room_id"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Room</FormLabel>
                    <Select
                      value={field.value?.toString() || "none"}
                      onValueChange={(value) =>
                        field.onChange(value === "none" ? undefined : parseInt(value))
                      }
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue
                            placeholder={loadingRooms ? "Loading..." : "Select room (optional)"}
                          />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="none">None</SelectItem>
                        {allRooms.map((room) => (
                          <SelectItem key={room.id} value={room.id.toString()}>
                            {room.room_number} - {room.room_name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* Day and Period */}
            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="day_of_week"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Day of Week *</FormLabel>
                    <Select value={field.value} onValueChange={field.onChange}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select day" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {DAYS_OF_WEEK.map((day) => (
                          <SelectItem key={day} value={day}>
                            {DAY_LABELS[day]}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="period_number"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Period Number *</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        min={1}
                        max={10}
                        placeholder="1"
                        {...field}
                        onChange={(e) => field.onChange(parseInt(e.target.value))}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* Time */}
            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="start_time"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Start Time *</FormLabel>
                    <FormControl>
                      <Input type="time" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="end_time"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>End Time *</FormLabel>
                    <FormControl>
                      <Input type="time" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* Conflict Warnings */}
            {conflictWarnings.length > 0 && (
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>
                  <strong>Conflicts detected:</strong>
                  <ul className="list-disc list-inside mt-2">
                    {conflictWarnings.map((warning, index) => (
                      <li key={index}>{warning}</li>
                    ))}
                  </ul>
                </AlertDescription>
              </Alert>
            )}

            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={isSubmitting || isChecking || conflictWarnings.length > 0}
              >
                {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                {editData ? "Update" : "Create"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
