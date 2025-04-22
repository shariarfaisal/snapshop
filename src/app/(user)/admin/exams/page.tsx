"use client";

import { ExamList } from "@/components/exams/exam-list";

export default function ExamsPage() {
  return (
    <div className="container mx-auto p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Exams & Gradebook</h1>
      </div>

      <ExamList />
    </div>
  );
} 