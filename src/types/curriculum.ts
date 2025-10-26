export interface LessonPlan {
  id: string;
  subjectId: string;
  title: string;
  objectives: string[];
  materials: string; // Could be markdown or links
  week: number;
}

export interface Assignment {
  id: string;
  subjectId: string;
  title: string;
  description: string;
  dueDate: string;
  fileUrl?: string; // Link to the assignment file
}
