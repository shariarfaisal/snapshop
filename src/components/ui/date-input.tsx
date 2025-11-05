"use client";

import * as React from "react";
import { format, parse } from "date-fns";
import { Calendar as CalendarIcon } from "lucide-react";
import { DayPicker } from "react-day-picker";
import "react-day-picker/dist/style.css";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";

interface DateInputProps {
  value?: string;
  onChange: (value: string) => void;
  placeholder?: string;
  disabled?: boolean;
  className?: string;
}

export function DateInput({
  value,
  onChange,
  placeholder = "Pick date",
  disabled = false,
  className,
}: DateInputProps) {
  const dateObj = value ? parse(value, "yyyy-MM-dd", new Date()) : undefined;

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          disabled={disabled}
          size="sm"
          className={cn(
            "justify-start text-left font-normal h-8 px-2",
            !value && "text-muted-foreground",
            className
          )}
        >
          <CalendarIcon className="mr-1 h-3 w-3" />
          {value ? format(parse(value, "yyyy-MM-dd", new Date()), "MMM dd") : <span className="text-xs">{placeholder}</span>}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0" align="start">
        <DayPicker
          mode="single"
          selected={dateObj}
          onSelect={(date) => {
            if (date) {
              onChange(format(date, "yyyy-MM-dd"));
            }
          }}
          showOutsideDays={false}
          classNames={{
            months: "flex flex-col space-y-2 p-2",
            month: "space-y-2",
            caption: "flex justify-between items-center px-1 py-1",
            caption_label: "text-xs font-semibold",
            nav: "flex gap-1",
            nav_button: cn("h-6 w-6 bg-transparent p-0 opacity-50 hover:opacity-100"),
            nav_button_previous: "absolute left-1",
            nav_button_next: "absolute right-1",
            table: "w-full border-collapse space-y-1",
            head_row: "flex",
            head_cell: "text-muted-foreground rounded-md w-6 font-normal text-[0.65rem]",
            row: "flex w-full mt-1",
            cell: "h-6 w-6 text-center text-xs p-0 m-[1px] relative",
            day: cn(
              "h-6 w-6 p-0 font-normal aria-selected:opacity-100 rounded-sm text-xs",
              "hover:bg-accent hover:text-accent-foreground",
              "focus:bg-accent focus:text-accent-foreground"
            ),
            day_selected: "bg-primary text-primary-foreground hover:bg-primary hover:text-primary-foreground",
            day_today: "bg-accent text-accent-foreground font-semibold",
            day_outside: "day-outside text-muted-foreground opacity-50 aria-selected:bg-accent/50",
            day_disabled: "text-muted-foreground opacity-50 cursor-not-allowed",
            day_hidden: "invisible",
          }}
        />
      </PopoverContent>
    </Popover>
  );
}
