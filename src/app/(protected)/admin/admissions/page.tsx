'use client';

import { useState } from 'react';
import { Eye, Trash2, CheckCircle, XCircle, Clock, Search } from 'lucide-react';
import { useRouter } from 'next/navigation';
import {
  useAdmissionApplications,
  useAdmissionStats,
  useDeleteAdmission,
} from '@/hooks/useAdmissions';
import { DeleteConfirmationDialog } from '@/components/admissions/delete-confirmation-dialog';

interface AdmissionApplication {
  id: number;
  application_number: string;
  first_name: string;
  last_name: string;
  student_name: string;
  email: string;
  phone: string;
  status: 'pending' | 'approved' | 'admitted' | 'rejected';
  schoolClass: { id: number; name: string };
  created_at: string;
  remarks?: string;
}

export default function AdminAdmissionsPage() {
  const router = useRouter();
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [page, setPage] = useState(1);
  const [deleteConfirm, setDeleteConfirm] = useState<{ isOpen: boolean; appId: number | null }>({
    isOpen: false,
    appId: null,
  });

  const { data: applicationsData, isLoading: isLoadingApplications, refetch } = useAdmissionApplications({
    page,
    per_page: 10,
    search,
    status: statusFilter,
  });

  const { data: statsData } = useAdmissionStats();
  const deleteAdmissionMutation = useDeleteAdmission({
    onSuccess: () => {
      refetch();
      setDeleteConfirm({ isOpen: false, appId: null });
    },
  });

  const handleDelete = (id: number) => {
    setDeleteConfirm({ isOpen: true, appId: id });
  };

  const confirmDelete = () => {
    if (deleteConfirm.appId) {
      deleteAdmissionMutation.mutate(deleteConfirm.appId);
    }
  };

  const getStatusBadge = (status: string) => {
    const badges = {
      pending: { bg: 'bg-yellow-100', text: 'text-yellow-800', icon: Clock },
      approved: { bg: 'bg-green-100', text: 'text-green-800', icon: CheckCircle },
      admitted: { bg: 'bg-blue-100', text: 'text-blue-800', icon: CheckCircle },
      rejected: { bg: 'bg-red-100', text: 'text-red-800', icon: XCircle },
    };
    const badge = badges[status as keyof typeof badges] || badges.pending;
    const Icon = badge.icon;
    return (
      <span className={`${badge.bg} ${badge.text} px-3 py-1 rounded-full text-sm font-semibold flex items-center gap-1 w-fit`}>
        <Icon size={16} /> {status.charAt(0).toUpperCase() + status.slice(1)}
      </span>
    );
  };

  const applications = applicationsData?.data || [];
  const totalPages = applicationsData?.pagination?.last_page || 1;
  const stats = statsData?.data || { total: 0, pending: 0, approved: 0, rejected: 0 };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">Admission Applications</h1>
          <p className="text-gray-600">Manage and review all admission applications</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-white rounded-lg shadow p-6">
            <div className="text-gray-600 text-sm font-medium">Total Applications</div>
            <div className="text-3xl font-bold text-blue-600 mt-2">{stats.total}</div>
          </div>
          <div className="bg-white rounded-lg shadow p-6">
            <div className="text-gray-600 text-sm font-medium">Pending</div>
            <div className="text-3xl font-bold text-yellow-600 mt-2">{stats.pending}</div>
          </div>
          <div className="bg-white rounded-lg shadow p-6">
            <div className="text-gray-600 text-sm font-medium">Approved</div>
            <div className="text-3xl font-bold text-green-600 mt-2">{stats.approved}</div>
          </div>
          <div className="bg-white rounded-lg shadow p-6">
            <div className="text-gray-600 text-sm font-medium">Rejected</div>
            <div className="text-3xl font-bold text-red-600 mt-2">{stats.rejected}</div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="relative">
              <Search size={20} className="absolute left-3 top-3 text-gray-400" />
              <input
                type="text"
                placeholder="Search by name, email, or phone..."
                value={search}
                onChange={(e) => {
                  setSearch(e.target.value);
                  setPage(1);
                }}
                className="w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <select
              value={statusFilter}
              onChange={(e) => {
                setStatusFilter(e.target.value);
                setPage(1);
              }}
              className="px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
            >
              <option value="">All Status</option>
              <option value="pending">Pending</option>
              <option value="approved">Approved</option>
              <option value="admitted">Admitted</option>
              <option value="rejected">Rejected</option>
            </select>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow overflow-hidden">
          {isLoadingApplications ? (
            <div className="p-8 text-center">
              <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
              <p className="mt-2 text-gray-600">Loading applications...</p>
            </div>
          ) : applications.length > 0 ? (
            <>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-100 border-b">
                    <tr>
                      <th className="px-6 py-3 text-left text-sm font-semibold text-gray-800">App #</th>
                      <th className="px-6 py-3 text-left text-sm font-semibold text-gray-800">Name</th>
                      <th className="px-6 py-3 text-left text-sm font-semibold text-gray-800">Email</th>
                      <th className="px-6 py-3 text-left text-sm font-semibold text-gray-800">Phone</th>
                      <th className="px-6 py-3 text-left text-sm font-semibold text-gray-800">Class</th>
                      <th className="px-6 py-3 text-left text-sm font-semibold text-gray-800">Status</th>
                      <th className="px-6 py-3 text-left text-sm font-semibold text-gray-800">Applied</th>
                      <th className="px-6 py-3 text-left text-sm font-semibold text-gray-800">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {applications.map((app: AdmissionApplication, idx: number) => (
                      <tr key={app.id} className={idx % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                        <td className="px-6 py-3 text-sm text-gray-900 font-mono">{app.application_number}</td>
                        <td className="px-6 py-3 text-sm text-gray-900">{app.first_name} {app.last_name}</td>
                        <td className="px-6 py-3 text-sm text-gray-900">{app.email}</td>
                        <td className="px-6 py-3 text-sm text-gray-900">{app.phone}</td>
                        <td className="px-6 py-3 text-sm text-gray-900">{app.schoolClass?.name || '-'}</td>
                        <td className="px-6 py-3 text-sm">{getStatusBadge(app.status)}</td>
                        <td className="px-6 py-3 text-sm text-gray-500">{new Date(app.created_at).toLocaleDateString()}</td>
                        <td className="px-6 py-3 text-sm space-x-2 flex">
                          <button
                            onClick={() => router.push(`/admin/admissions/${app.id}`)}
                            className="text-blue-600 hover:text-blue-800 transition"
                          >
                            <Eye size={18} />
                          </button>
                          <button
                            onClick={() => handleDelete(app.id)}
                            disabled={deleteAdmissionMutation.isPending}
                            className="text-red-600 hover:text-red-800 transition disabled:opacity-50"
                          >
                            <Trash2 size={18} />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <div className="bg-gray-50 px-6 py-3 flex items-center justify-between border-t">
                <div className="text-sm text-gray-600">
                  Page {page} of {totalPages}
                </div>
                <div className="space-x-2">
                  <button
                    onClick={() => setPage(Math.max(1, page - 1))}
                    disabled={page === 1}
                    className="px-4 py-2 border rounded-lg disabled:opacity-50 hover:bg-gray-100"
                  >
                    Previous
                  </button>
                  <button
                    onClick={() => setPage(Math.min(totalPages, page + 1))}
                    disabled={page === totalPages}
                    className="px-4 py-2 border rounded-lg disabled:opacity-50 hover:bg-gray-100"
                  >
                    Next
                  </button>
                </div>
              </div>
            </>
          ) : (
            <div className="p-8 text-center text-gray-600">
              No admission applications found.
            </div>
          )}
        </div>
      </div>

      <DeleteConfirmationDialog
        isOpen={deleteConfirm.isOpen}
        title="Delete Application"
        description="Are you sure you want to delete this admission application? This action cannot be undone."
        onConfirm={confirmDelete}
        onCancel={() => setDeleteConfirm({ isOpen: false, appId: null })}
        isLoading={deleteAdmissionMutation.isPending}
      />
    </div>
  );
}
