"use client";

import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import CreateExamForm from "./create-exam-form";

export default function SetupPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="sm" asChild>
          <Link href="/admin/exams">
            <ArrowLeft className="h-4 w-4" />
          </Link>
        </Button>
        <div>
          <h1 className="text-3xl font-bold">Create Exam</h1>
          <p className="text-muted-foreground mt-1">Set up a new examination</p>
        </div>
      </div>

      <CreateExamForm />
    </div>
  );
}
