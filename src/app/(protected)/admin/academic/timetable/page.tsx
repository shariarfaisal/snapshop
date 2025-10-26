"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Plus } from "lucide-react";

export default function TimetablePage() {
  const timeSlots = ["08:00-09:00", "09:00-10:00", "10:00-11:00", "11:00-12:00", "12:00-01:00", "01:00-02:00", "02:00-03:00"];
  const days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"];

  const timetable = {
    "Monday": ["Math", "English", "Science", "Break", "History", "Art", "Sports"],
    "Tuesday": ["English", "Math", "Computer", "Break", "Science", "Music", "Library"],
    "Wednesday": ["Science", "Math", "English", "Break", "Geography", "PE", "Study"],
    "Thursday": ["Math", "Science", "English", "Break", "Biology", "Chemistry", "Lab"],
    "Friday": ["English", "History", "Math", "Break", "Science", "Art", "Assembly"],
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Timetable</h1>
          <p className="text-gray-500 mt-1">Manage class schedules and periods</p>
        </div>
        <Button>
          <Plus className="mr-2 h-4 w-4" />
          Create Timetable
        </Button>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Weekly Schedule</CardTitle>
            <div className="flex gap-2">
              <Select defaultValue="grade-10-a">
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Select class" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="grade-10-a">Grade 10-A</SelectItem>
                  <SelectItem value="grade-10-b">Grade 10-B</SelectItem>
                  <SelectItem value="grade-9-a">Grade 9-A</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr>
                  <th className="border p-3 bg-gray-50 font-medium text-left">Time</th>
                  {days.map((day) => (
                    <th key={day} className="border p-3 bg-gray-50 font-medium text-center">{day}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {timeSlots.map((slot, index) => (
                  <tr key={slot}>
                    <td className="border p-3 font-medium bg-gray-50">{slot}</td>
                    {days.map((day) => (
                      <td key={day} className="border p-3 text-center hover:bg-blue-50 cursor-pointer">
                        <div className={`p-2 rounded ${slot.includes("12:00") ? "bg-yellow-100 text-yellow-800" : "bg-blue-100 text-blue-800"}`}>
                          {timetable[day][index]}
                        </div>
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
