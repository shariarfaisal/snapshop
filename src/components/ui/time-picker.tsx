"use client"

import * as React from "react"
import { Clock } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { cn } from "@/lib/utils"

interface TimePickerProps {
  time?: Date
  onSelect?: (time: Date | undefined) => void
}

export function TimePicker({ time, onSelect }: TimePickerProps) {
  const [hours, setHours] = React.useState(time?.getHours() || 0)
  const [minutes, setMinutes] = React.useState(time?.getMinutes() || 0)

  const handleHourChange = (hour: number) => {
    setHours(hour)
    if (onSelect) {
      const newTime = time ? new Date(time) : new Date()
      newTime.setHours(hour)
      newTime.setMinutes(minutes)
      onSelect(newTime)
    }
  }

  const handleMinuteChange = (minute: number) => {
    setMinutes(minute)
    if (onSelect) {
      const newTime = time ? new Date(time) : new Date()
      newTime.setHours(hours)
      newTime.setMinutes(minute)
      onSelect(newTime)
    }
  }

  const formatTime = (time: Date) => {
    return time.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
  }

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant={"outline"}
          className={cn(
            "w-[280px] justify-start text-left font-normal",
            !time && "text-muted-foreground"
          )}
        >
          <Clock className="mr-2 h-4 w-4" />
          {time ? formatTime(time) : <span>Pick a time</span>}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-4">
        <div className="flex gap-4">
          <div className="flex flex-col items-center">
            <div className="text-sm font-medium mb-2">Hours</div>
            <div className="grid grid-cols-4 gap-2">
              {Array.from({ length: 24 }, (_, i) => (
                <Button
                  key={i}
                  variant={hours === i ? "default" : "outline"}
                  size="sm"
                  onClick={() => handleHourChange(i)}
                >
                  {i.toString().padStart(2, '0')}
                </Button>
              ))}
            </div>
          </div>
          <div className="flex flex-col items-center">
            <div className="text-sm font-medium mb-2">Minutes</div>
            <div className="grid grid-cols-4 gap-2">
              {Array.from({ length: 12 }, (_, i) => (
                <Button
                  key={i}
                  variant={minutes === i * 5 ? "default" : "outline"}
                  size="sm"
                  onClick={() => handleMinuteChange(i * 5)}
                >
                  {(i * 5).toString().padStart(2, '0')}
                </Button>
              ))}
            </div>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  )
} 