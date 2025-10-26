import { StudentWithGuardian, Message } from '@/types/communication';


/**
 * Fetches the list of students and their linked guardians for a given class.
 */
export const getGuardiansForClass = async (classId: string): Promise<StudentWithGuardian[]> => {
  console.log(`Fetching guardians for class ${classId}...`);
  // Mock API call
  return [
    {
      studentId: 'std_101',
      studentName: 'Alice Smith',
      guardians: [{ id: 'g_1', name: 'John Smith', relation: 'Father' }],
    },
    {
      studentId: 'std_102',
      studentName: 'Bob Johnson',
      guardians: [
        { id: 'g_2', name: 'Jane Johnson', relation: 'Mother' },
        { id: 'g_3', name: 'Robert Johnson', relation: 'Father' },
      ],
    },
    {
      studentId: 'std_103',
      studentName: 'Charlie Brown',
      guardians: [{ id: 'g_4', name: 'Sally Brown', relation: 'Mother' }],
    },
  ];
};

/**
 * Sends a message to a list of guardian recipients.
 */
export const sendMessage = async (message: Omit<Message, 'id' | 'sentAt' | 'status'>): Promise<{ success: boolean; message: string }> => {
  console.log('Sending message:', message);
  // Mock API call
  return { success: true, message: 'Message sent successfully!' };
};

/**
 * Fetches the history of sent messages for the logged-in teacher.
 */
export const getSentMessages = async (): Promise<Message[]> => {
  console.log('Fetching sent messages...');
  // Mock API call
  return [
    { id: 'msg_1', recipientIds: ['g_1', 'g_2'], subject: 'Parent-Teacher Meeting', body: 'A reminder about the upcoming meeting...', sentAt: '2025-10-20T10:00:00Z', status: 'sent' },
    { id: 'msg_2', recipientIds: ['g_4'], subject: 'Field Trip Update', body: 'The field trip has been rescheduled...', sentAt: '2025-10-18T15:30:00Z', status: 'sent' },
  ];
};
