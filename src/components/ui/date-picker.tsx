"use client";

import * as React from "react";
import { format } from "date-fns";
import { Calendar as CalendarIcon, ChevronLeft, ChevronRight } from "lucide-react";
import { DayPicker } from "react-day-picker";
import "react-day-picker/dist/style.css";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";

interface DatePickerProps {
  date?: Date;
  onSelect?: (date: Date | undefined) => void;
  placeholder?: string;
  disabled?: boolean;
  disabledDates?: (date: Date) => boolean;
}

export function DatePicker({
  date,
  onSelect,
  placeholder = "Pick a date",
  disabled = false,
  disabledDates,
}: DatePickerProps) {
  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          disabled={disabled}
          className={cn(
            "w-full justify-start text-left font-normal",
            !date && "text-muted-foreground"
          )}
        >
          <CalendarIcon className="mr-2 h-4 w-4" />
          {date ? format(date, "MMM dd, yyyy") : <span>{placeholder}</span>}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0" align="start">
        <DayPicker
          mode="single"
          selected={date}
          onSelect={onSelect}
          disabled={disabledDates}
          showOutsideDays={false}
          classNames={{
            months: "flex flex-col space-y-4 p-4",
            month: "space-y-4",
            caption: "flex justify-between items-center px-2 py-1",
            caption_label: "text-sm font-semibold",
            nav: "flex gap-1",
            nav_button: cn(
              "h-7 w-7 bg-transparent p-0 opacity-50 hover:opacity-100"
            ),
            nav_button_previous: "absolute left-1",
            nav_button_next: "absolute right-1",
            table: "w-full border-collapse space-y-1",
            head_row: "flex",
            head_cell:
              "text-muted-foreground rounded-md w-8 font-normal text-[0.8rem]",
            row: "flex w-full mt-2",
            cell: "h-8 w-8 text-center text-sm p-0 m-[2px] relative",
            day: cn(
              "h-8 w-8 p-0 font-normal aria-selected:opacity-100 rounded-md",
              "hover:bg-accent hover:text-accent-foreground",
              "focus:bg-accent focus:text-accent-foreground"
            ),
            day_selected:
              "bg-primary text-primary-foreground hover:bg-primary hover:text-primary-foreground",
            day_today: "bg-accent text-accent-foreground font-semibold",
            day_outside:
              "day-outside text-muted-foreground opacity-50 aria-selected:bg-accent/50",
            day_disabled: "text-muted-foreground opacity-50 cursor-not-allowed",
            day_hidden: "invisible",
          }}
          components={{
            IconLeft: ({ ...props }) => <ChevronLeft className="h-4 w-4" />,
            IconRight: ({ ...props }) => <ChevronRight className="h-4 w-4" />,
          }}
        />
      </PopoverContent>
    </Popover>
  );
} 