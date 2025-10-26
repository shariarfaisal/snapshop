import { Exam, MarkEntry, MarksSubmission, StudentResult } from '@/types/marks';


/**
 * Fetches the list of exams for the currently logged-in teacher.
 */
export const getExamsForTeacher = async (): Promise<Exam[]> => {
  console.log('Fetching exams for teacher...');
  // Mock API call
  return [
    { id: 'ex_mid_9a', name: 'Midterm Exam', classId: 'c_9', subject: 'Mathematics' },
    { id: 'ex_fin_9a', name: 'Final Exam', classId: 'c_9', subject: 'Mathematics' },
    { id: 'ex_mid_10a', name: 'Midterm Exam', classId: 'c_10', subject: 'Science' },
  ];
};

/**
 * Fetches the list of students for a given exam to allow mark entry.
 */
export const getStudentsForExam = async (examId: string): Promise<MarkEntry[]> => {
  console.log(`Fetching students for exam ${examId}...`);
  // Mock API call based on examId
  return [
    { studentId: 'std_101', studentName: 'Alice Smith', score: null },
    { studentId: 'std_102', studentName: 'Bob Johnson', score: null },
    { studentId: 'std_103', studentName: 'Charlie Brown', score: null },
  ];
};

/**
 * Submits the marks for a given exam.
 */
export const submitMarks = async (submission: MarksSubmission): Promise<{ success: boolean; message: string }> => {
  console.log('Submitting marks:', submission);
  // Mock API call
  return { success: true, message: 'Marks submitted successfully!' };
};

/**
 * Fetches the results for the currently logged-in student.
 */
export const getStudentResults = async (): Promise<StudentResult[]> => {
  console.log('Fetching student results...');
  // Mock API call
  return [
    { subject: 'Mathematics', score: 85, grade: 'A', totalMarks: 100 },
    { subject: 'Science', score: 92, grade: 'A+', totalMarks: 100 },
    { subject: 'English', score: 78, grade: 'B+', totalMarks: 100 },
  ];
};
