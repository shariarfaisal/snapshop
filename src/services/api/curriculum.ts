import { LessonPlan, Assignment } from '@/types/curriculum';


// --- Lesson Plan Functions ---

export const getLessonPlans = async (subjectId: string): Promise<LessonPlan[]> => {
  console.log(`Fetching lesson plans for subject ${subjectId}...`);
  // Mock API call
  return [
    { id: 'lp_1', subjectId, title: 'Week 1: Introduction to Algebra', week: 1, objectives: ['Understand variables', 'Solve basic equations'], materials: 'Chapter 1 PDF' },
    { id: 'lp_2', subjectId, title: 'Week 2: Polynomials', week: 2, objectives: ['Learn to add and subtract polynomials'], materials: 'Chapter 2 PDF' },
  ];
};

export const saveLessonPlan = async (plan: Omit<LessonPlan, 'id'>): Promise<{ success: boolean; message: string }> => {
  console.log('Saving lesson plan:', plan);
  // Mock API call
  return { success: true, message: 'Lesson plan saved successfully!' };
};

// --- Assignment Functions ---

export const getAssignmentsForTeacher = async (subjectId: string): Promise<Assignment[]> => {
  console.log(`Fetching assignments for subject ${subjectId}...`);
  // Mock API call
  return [
    { id: 'as_1', subjectId, title: 'Algebra Worksheet 1', description: 'Complete all odd-numbered problems.', dueDate: '2025-10-25', fileUrl: '#' },
    { id: 'as_2', subjectId, title: 'Polynomials Quiz', description: 'Online quiz covering Chapter 2.', dueDate: '2025-11-01' },
  ];
};

export const createAssignment = async (assignment: Omit<Assignment, 'id'>): Promise<{ success: boolean; message: string }> => {
  console.log('Creating assignment:', assignment);
  // Mock API call
  return { success: true, message: 'Assignment created successfully!' };
};

export const getAssignmentsForStudent = async (): Promise<Assignment[]> => {
  console.log('Fetching assignments for student...');
  // Mock API call
  return [
    { id: 'as_1', subjectId: 'sub_math', title: 'Algebra Worksheet 1', description: 'Complete all odd-numbered problems.', dueDate: '2025-10-25', fileUrl: '#' },
    { id: 'as_3', subjectId: 'sub_sci', title: 'Lab Report: Photosynthesis', description: 'Submit a 2-page report on our recent lab.', dueDate: '2025-10-28', fileUrl: '#' },
  ];
};
