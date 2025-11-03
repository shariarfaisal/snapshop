'use client';

import { useState } from 'react';
import { Eye, Trash2, Download, CheckCircle, XCircle, Clock, Search } from 'lucide-react';
import {
  useAdmissionApplications,
  useAdmissionStats,
  useUpdateAdmissionStatus,
  useDeleteAdmission,
  useExportAdmissions,
} from '@/hooks/useAdmissions';

interface AdmissionApplication {
  id: number;
  application_number: string;
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
  status: 'pending' | 'approved' | 'rejected';
  institute: { id: number; name: string };
  schoolClass: { id: number; name: string };
  created_at: string;
  remarks?: string;
}

export default function AdminAdmissionsPage() {
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [selectedApp, setSelectedApp] = useState<AdmissionApplication | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [newStatus, setNewStatus] = useState('');
  const [remarks, setRemarks] = useState('');
  const [page, setPage] = useState(1);

  const { data: applicationsData, isLoading: isLoadingApplications } = useAdmissionApplications({
    page,
    per_page: 10,
    search,
    status: statusFilter,
  });

  const { data: statsData } = useAdmissionStats();
  const updateStatusMutation = useUpdateAdmissionStatus();
  const deleteAdmissionMutation = useDeleteAdmission();
  const exportAdmissionsMutation = useExportAdmissions();

  const handleStatusUpdate = () => {
    if (!selectedApp || !newStatus) return;
    updateStatusMutation.mutate(
      { id: selectedApp.id, data: { status: newStatus, remarks } },
      {
        onSuccess: () => {
          setShowModal(false);
          setNewStatus('');
          setRemarks('');
          setSelectedApp(null);
        },
      }
    );
  };

  const handleDelete = (id: number) => {
    if (!confirm('Are you sure you want to delete this application?')) return;
    deleteAdmissionMutation.mutate(id);
  };

  const handleExport = () => {
    exportAdmissionsMutation.mutate();
  };

  const getStatusBadge = (status: string) => {
    const badges = {
      pending: { bg: 'bg-yellow-100', text: 'text-yellow-800', icon: Clock },
      approved: { bg: 'bg-green-100', text: 'text-green-800', icon: CheckCircle },
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
                placeholder="Search by name, email, phone..."
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
              <option value="rejected">Rejected</option>
            </select>
            <button
              onClick={handleExport}
              disabled={exportAdmissionsMutation.isPending}
              className="flex items-center justify-center gap-2 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition disabled:opacity-50"
            >
              <Download size={20} /> {exportAdmissionsMutation.isPending ? 'Exporting...' : 'Export CSV'}
            </button>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow overflow-hidden">
          {isLoadingApplications ? (
            <div className="p-6 text-center text-gray-600">Loading applications...</div>
          ) : applications.length === 0 ? (
            <div className="p-6 text-center text-gray-600">No applications found</div>
          ) : (
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
                            onClick={() => {
                              setSelectedApp(app);
                              setNewStatus(app.status);
                              setRemarks(app.remarks || '');
                              setShowModal(true);
                            }}
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
          )}
        </div>
      </div>

      {showModal && selectedApp && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg shadow-lg max-w-md w-full p-6">
            <h2 className="text-xl font-bold mb-4">Update Application Status</h2>
            
            <div className="mb-4">
              <p className="text-sm text-gray-600 mb-2">Application: {selectedApp.application_number}</p>
              <p className="text-sm text-gray-600 mb-2">Applicant: {selectedApp.first_name} {selectedApp.last_name}</p>
            </div>

            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
              <select
                value={newStatus}
                onChange={(e) => setNewStatus(e.target.value)}
                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
              >
                <option value="pending">Pending</option>
                <option value="approved">Approved</option>
                <option value="rejected">Rejected</option>
              </select>
            </div>

            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">Remarks (Optional)</label>
              <textarea
                value={remarks}
                onChange={(e) => setRemarks(e.target.value)}
                placeholder="Add remarks..."
                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 resize-none"
                rows={3}
              />
            </div>

            <div className="flex gap-2">
              <button
                onClick={() => setShowModal(false)}
                className="flex-1 px-4 py-2 border rounded-lg text-gray-700 hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={handleStatusUpdate}
                disabled={updateStatusMutation.isPending}
                className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
              >
                {updateStatusMutation.isPending ? 'Updating...' : 'Update'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}