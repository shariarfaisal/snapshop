"use client";

import { TeacherCreateForm } from "@/components/teachers/TeacherCreateForm";

export default function CreateTeacherPage() {
  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        <TeacherCreateForm />
      </div>
    </div>
  );
}
