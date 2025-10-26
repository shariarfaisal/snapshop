import { Invoice, Payment } from '@/types/finance';


export interface StudentFinanceDetails {
  invoices: Invoice[];
  payments: Payment[];
  summary: {
    totalBilled: number;
    totalPaid: number;
    dueAmount: number;
  };
}

/**
 * Fetches the complete financial details for the currently logged-in student.
 */
export const getStudentFinanceDetails = async (): Promise<StudentFinanceDetails> => {
  console.log('Fetching student finance details...');
  // Mock API call

  const mockPayments: Payment[] = [
    { id: 'pay_1', invoiceId: 'inv_1001', amount: 1500, method: 'Online', paymentDate: '2025-10-10', createdAt: '', updatedAt: '' },
    { id: 'pay_2', invoiceId: 'inv_1001', amount: 500, method: 'Cash', paymentDate: '2025-10-15', createdAt: '', updatedAt: '' },
  ];

  const mockInvoices: Invoice[] = [
    {
      id: 'inv_1001',
      studentId: 'std_123',
      studentName: 'A. Rahman',
      rollNumber: '2025-9-001',
      programId: 'p_1',
      programName: 'Computer Science',
      campusId: 'camp_1',
      campusName: 'Main Campus',
      termId: 't_1',
      termName: 'Fall 2025',
      feePlanId: 'fp_1',
      feePlanName: 'Standard Fees',
      items: [{ id: 'item_1', label: 'Tuition', amount: 2000, type: 'Term' }],
      totalAmount: 2000,
      paidAmount: 2000,
      dueAmount: 0,
      dueDate: '2025-10-20',
      status: 'Paid',
      payments: mockPayments,
      createdAt: '',
      updatedAt: '',
    },
    {
      id: 'inv_1002',
      studentId: 'std_123',
      studentName: 'A. Rahman',
      rollNumber: '2025-9-001',
      programId: 'p_1',
      programName: 'Computer Science',
      campusId: 'camp_1',
      campusName: 'Main Campus',
      termId: 't_2',
      termName: 'Spring 2026',
      feePlanId: 'fp_1',
      feePlanName: 'Standard Fees',
      items: [{ id: 'item_1', label: 'Tuition', amount: 2000, type: 'Term' }],
      totalAmount: 2000,
      paidAmount: 0,
      dueAmount: 2000,
      dueDate: '2026-02-20',
      status: 'Unpaid',
      payments: [],
      createdAt: '',
      updatedAt: '',
    }
  ];

  return {
    invoices: mockInvoices,
    payments: mockPayments,
    summary: {
      totalBilled: 4000,
      totalPaid: 2000,
      dueAmount: 2000,
    },
  };
};
