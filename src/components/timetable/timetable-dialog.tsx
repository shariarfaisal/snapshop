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

const timetableSchema = z.object({
  class_id: z.number({ required_error: "Class is required" }).min(1, "Class is required"),
  section_id: z.number({ required_error: "Section is required" }).min(1, "Section is required"),
  subject_id: z.number({ required_error: "Subject is required" }).min(1, "Subject is required"),
  teacher_id: z.number({ required_error: "Teacher is required" }).min(1, "Teacher is required"),
  academic_year_id: z.number({ required_error: "Academic year is required" }).min(1, "Academic year is required"),
  day_of_week: z.enum(["monday", "tuesday", "wednesday", "thursday", "friday", "saturday"], {
    required_error: "Day of week is required",
  }),
  period_number: z.number({ required_error: "Period number is required" }).min(1).max(10),
  start_time: z.string().regex(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, "Invalid time format (HH:MM)"),
  end_time: z.string().regex(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, "Invalid time format (HH:MM)"),
  room_number: z.string().optional(),
});

interface TimetableDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess: () => void;
  onSubmit: (data: CreateTimetableInput) => Promise<void>;
  editData?: Timetable | null;
  classes?: Array<{ id: number; name: string }>;
  sections?: Array<{ id: number; name: string; schoolClassId: number }>;
  subjects?: Array<{ id: number; name: string }>;
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
  classes = [],
  sections = [],
  subjects = [],
  teachers = [],
  academicYears = [],
  isSubmitting = false,
}: TimetableDialogProps) {
  const [conflictWarnings, setConflictWarnings] = useState<string[]>([]);
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
          room_number: editData.room_number || "",
        }
      : {
          period_number: 1,
          start_time: "09:00",
          end_time: "10:00",
          room_number: "",
        },
  });

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
          room_number: editData.room_number || "",
        });
      } else {
        // Set default academic year to current one
        const currentYear = academicYears.find((y) => y.is_current);
        form.reset({
          academic_year_id: currentYear?.id,
          period_number: 1,
          start_time: "09:00",
          end_time: "10:00",
          room_number: "",
        });
      }
      setConflictWarnings([]);
    }
  }, [open, editData, academicYears, form]);

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
        value.start_time &&
        value.end_time
      ) {
        try {
          const result = await checkConflicts({
            ...value as CreateTimetableInput,
            exclude_id: editData?.id,
          });
          setConflictWarnings(result.data.conflicts || []);
        } catch (error) {
          // Silently fail conflict check
        }
      }
    });

    return () => subscription.unsubscribe();
  }, [form, checkConflicts, editData]);

  const handleSubmit = async (data: CreateTimetableInput) => {
    try {
      await onSubmit(data);
      onSuccess();
      onOpenChange(false);
    } catch (error) {
      // Error is handled by the mutation
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{editData ? "Edit Timetable Entry" : "Add Timetable Entry"}</DialogTitle>
          <DialogDescription>
            {editData
              ? "Update the timetable entry details below."
              : "Fill in the details to create a new timetable entry."}
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
            {/* Academic Year */}
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

            {/* Class and Section */}
            <div className="grid grid-cols-2 gap-4">
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
                        form.setValue("section_id", 0 as any); // Reset section
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
            </div>

            {/* Subject and Teacher */}
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
                            {subject.name}
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
                          <SelectValue placeholder="Select teacher" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {teachers.map((teacher) => (
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

            {/* Time and Room */}
            <div className="grid grid-cols-3 gap-4">
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

              <FormField
                control={form.control}
                name="room_number"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Room</FormLabel>
                    <FormControl>
                      <Input placeholder="101" {...field} />
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
