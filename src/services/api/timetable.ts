import { ClassTimetable } from '@/types/timetable';


/**
 * Fetches the timetable for a specific class and section.
 */
export const getTimetable = async (classId: string, sectionId: string): Promise<ClassTimetable | null> => {
  console.log(`Fetching timetable for class ${classId}, section ${sectionId}...`);
  // Mock API call
  // In a real app: return fetch(`${API_BASE_URL}/timetables?classId=${classId}&sectionId=${sectionId}`).then(res => res.json());

  // Returning hardcoded data for now
  return {
    classId,
    sectionId,
    slots: [
      { day: 'Monday', period: { startTime: '09:00', endTime: '10:00' }, subjectId: 'sub_math', teacherId: 't_101' },
      { day: 'Tuesday', period: { startTime: '10:00', endTime: '11:00' }, subjectId: 'sub_sci', teacherId: 't_102' },
    ],
  };
};

/**
 * Saves (creates or updates) a timetable for a class.
 */
export const saveTimetable = async (timetable: ClassTimetable): Promise<{ success: boolean; message: string }> => {
  console.log('Saving timetable:', timetable);
  // Mock API call
  // In a real app: return fetch(`${API_BASE_URL}/timetables`, { method: 'POST', body: JSON.stringify(timetable) }).then(res => res.json());

  return { success: true, message: 'Timetable saved successfully!' };
};

/**
 * Fetches a list of all available subjects.
 */
export const getSubjects = async () => {
  console.log('Fetching subjects...');
  return [
    { id: 'sub_math', name: 'Mathematics' },
    { id: 'sub_sci', name: 'Science' },
    { id: 'sub_eng', name: 'English' },
  ];
};

/**
 * Fetches a list of all available teachers.
 */
export const getTeachers = async () => {
  console.log('Fetching teachers...');
  return [
    { id: 't_101', name: 'Mr. John Doe' },
    { id: 't_102', name: 'Ms. Jane Smith' },
  ];
};

/**
 * Fetches the timetable for the currently logged-in teacher.
 */
export const getTeacherTimetable = async (): Promise<ClassTimetable | null> => {
  console.log('Fetching timetable for teacher...');
  // Mock API call for a specific teacher
  return getTimetable('c_9', 'A'); // Reusing the function for mock data
};

/**
 * Fetches the timetable for the currently logged-in student.
 */
export const getStudentTimetable = async (): Promise<ClassTimetable | null> => {
  console.log('Fetching timetable for student...');
  // Mock API call for a specific student's class
  return getTimetable('c_9', 'A'); // Reusing the function for mock data
};

