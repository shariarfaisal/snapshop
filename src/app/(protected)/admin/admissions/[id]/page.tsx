'use client';

import { useParams, useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';
import {
  ArrowLeft,
  Edit,
  Download,
  Plus,
  AlertCircle,
  CheckCircle,
  Clock,
  XCircle,
} from 'lucide-react';
import { admissionService } from '@/services/admissionService';

interface AdmissionDetail {
  id: number;
  application_number: string;
  first_name: string;
  last_name: string;
  student_name: string;
  email: string;
  phone: string;
  date_of_birth: string;
  gender: string;
  address: string;
  status: 'pending' | 'approved' | 'rejected' | 'admitted';
  remarks?: string;
  schoolClass: { id: number; name: string };
  applyingForClass?: { id: number; name: string };
  fatherName?: string;
  fatherPhone?: string;
  fatherOccupation?: string;
  motherName?: string;
  motherPhone?: string;
  motherOccupation?: string;
  guardianName?: string;
  guardianRelation?: string;
  guardianPhone?: string;
  previousSchool?: string;
  previousClass?: string;
  documents?: any;
  reviewedAt?: string;
  appliedAt: string;
  createdAt: string;
}

export default function AdmissionDetailPage() {
  const params = useParams();
  const router = useRouter();
  const id = params.id as string;

  const [application, setApplication] = useState<AdmissionDetail | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showEditStatus, setShowEditStatus] = useState(false);
  const [newStatus, setNewStatus] = useState('');
  const [remarks, setRemarks] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    fetchApplicationDetail();
  }, [id]);

  const fetchApplicationDetail = async () => {
    try {
      setIsLoading(true);
      const response = await admissionService.getApplicationDetail(parseInt(id));
      if (response.success) {
        setApplication(response.data);
        setNewStatus(response.data.status);
        setRemarks(response.data.remarks || '');
      } else {
        setError('Failed to load application details');
      }
    } catch (err: any) {
      setError(err.response?.data?.message || 'Error loading application');
    } finally {
      setIsLoading(false);
    }
  };

  const handleStatusUpdate = async () => {
    try {
      setIsSubmitting(true);
      const response = await admissionService.updateApplicationStatus(parseInt(id), {
        status: newStatus,
        remarks,
      });
      if (response.success) {
        setApplication(response.data);
        setShowEditStatus(false);
      }
    } catch (err: any) {
      setError(err.response?.data?.message || 'Error updating status');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCreateUser = () => {
    if (!application) return;
    sessionStorage.setItem(
      'prefill_student_data',
      JSON.stringify({
        firstName: application.first_name,
        lastName: application.last_name,
        email: application.email,
        phone: application.phone,
        dateOfBirth: application.date_of_birth,
        gender: application.gender,
        classId: application.schoolClass?.id,
        address: application.address,
        fatherName: application.fatherName,
        motherName: application.motherName,
        guardianName: application.guardianName,
        admissionApplicationId: application.id,
      })
    );
    router.push('/admin/users/create');
  };

  const getStatusColor = (status: string) => {
    const colors = {
      pending: { bg: 'bg-yellow-50', text: 'text-yellow-800', icon: Clock },
      approved: { bg: 'bg-green-50', text: 'text-green-800', icon: CheckCircle },
      admitted: { bg: 'bg-blue-50', text: 'text-blue-800', icon: CheckCircle },
      rejected: { bg: 'bg-red-50', text: 'text-red-800', icon: XCircle },
    };
    return colors[status as keyof typeof colors] || colors.pending;
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 p-6 flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          <p className="mt-2 text-gray-600">Loading application details...</p>
        </div>
      </div>
    );
  }

  if (error || !application) {
    return (
      <div className="min-h-screen bg-gray-50 p-6">
        <div className="max-w-4xl mx-auto">
          <button
            onClick={() => router.back()}
            className="mb-6 flex items-center gap-2 text-blue-600 hover:text-blue-800"
          >
            <ArrowLeft size={20} /> Back
          </button>
          <div className="bg-red-50 border border-red-200 rounded-lg p-6">
            <div className="flex gap-3">
              <AlertCircle className="text-red-600 flex-shrink-0" size={24} />
              <div>
                <h3 className="font-semibold text-red-900">Error</h3>
                <p className="text-red-700 mt-1">{error || 'Application not found'}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const statusColor = getStatusColor(application.status);
  const StatusIcon = statusColor.icon;

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-4xl mx-auto">
        <button
          onClick={() => router.back()}
          className="mb-6 flex items-center gap-2 text-blue-600 hover:text-blue-800"
        >
          <ArrowLeft size={20} /> Back
        </button>

        <div className="bg-white rounded-lg shadow-lg p-8">
          <div className="flex justify-between items-start mb-8">
            <div>
              <h1 className="text-3xl font-bold text-gray-800 mb-2">
                {application.first_name} {application.last_name}
              </h1>
              <p className="text-gray-500 font-mono">{application.application_number}</p>
            </div>
            <div className={`${statusColor.bg} ${statusColor.text} px-4 py-2 rounded-lg flex items-center gap-2`}>
              <StatusIcon size={20} />
              <span className="font-semibold capitalize">{application.status}</span>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
            {/* Personal Information */}
            <div>
              <h2 className="text-lg font-semibold text-gray-800 mb-4 pb-2 border-b">
                Personal Information
              </h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-600">Email</label>
                  <p className="text-gray-900">{application.email}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-600">Phone</label>
                  <p className="text-gray-900">{application.phone}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-600">Date of Birth</label>
                  <p className="text-gray-900">
                    {new Date(application.date_of_birth).toLocaleDateString()}
                  </p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-600">Gender</label>
                  <p className="text-gray-900 capitalize">{application.gender}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-600">Address</label>
                  <p className="text-gray-900">{application.address}</p>
                </div>
              </div>
            </div>

            {/* Academic Information */}
            <div>
              <h2 className="text-lg font-semibold text-gray-800 mb-4 pb-2 border-b">
                Academic Information
              </h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-600">Institute</label>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-600">Class Applied For</label>
                  <p className="text-gray-900">{application.applyingForClass?.name || '-'}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-600">Assigned Class</label>
                  <p className="text-gray-900">{application.schoolClass?.name || '-'}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-600">Previous School</label>
                  <p className="text-gray-900">{application.previousSchool || '-'}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-600">Previous Class</label>
                  <p className="text-gray-900">{application.previousClass || '-'}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Parent/Guardian Information */}
          <div className="mb-8">
            <h2 className="text-lg font-semibold text-gray-800 mb-4 pb-2 border-b">
              Parent/Guardian Information
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {application.fatherName && (
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h3 className="font-semibold text-gray-800 mb-2">Father</h3>
                  <p className="text-sm text-gray-600">
                    <span className="font-medium">Name:</span> {application.fatherName}
                  </p>
                  {application.fatherPhone && (
                    <p className="text-sm text-gray-600">
                      <span className="font-medium">Phone:</span> {application.fatherPhone}
                    </p>
                  )}
                  {application.fatherOccupation && (
                    <p className="text-sm text-gray-600">
                      <span className="font-medium">Occupation:</span> {application.fatherOccupation}
                    </p>
                  )}
                </div>
              )}
              {application.motherName && (
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h3 className="font-semibold text-gray-800 mb-2">Mother</h3>
                  <p className="text-sm text-gray-600">
                    <span className="font-medium">Name:</span> {application.motherName}
                  </p>
                  {application.motherPhone && (
                    <p className="text-sm text-gray-600">
                      <span className="font-medium">Phone:</span> {application.motherPhone}
                    </p>
                  )}
                  {application.motherOccupation && (
                    <p className="text-sm text-gray-600">
                      <span className="font-medium">Occupation:</span> {application.motherOccupation}
                    </p>
                  )}
                </div>
              )}
              {application.guardianName && (
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h3 className="font-semibold text-gray-800 mb-2">Guardian</h3>
                  <p className="text-sm text-gray-600">
                    <span className="font-medium">Name:</span> {application.guardianName}
                  </p>
                  {application.guardianRelation && (
                    <p className="text-sm text-gray-600">
                      <span className="font-medium">Relation:</span> {application.guardianRelation}
                    </p>
                  )}
                  {application.guardianPhone && (
                    <p className="text-sm text-gray-600">
                      <span className="font-medium">Phone:</span> {application.guardianPhone}
                    </p>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* Remarks */}
          {application.remarks && (
            <div className="mb-8">
              <h2 className="text-lg font-semibold text-gray-800 mb-4 pb-2 border-b">Remarks</h2>
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <p className="text-gray-900">{application.remarks}</p>
              </div>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex gap-4">
            <button
              onClick={() => setShowEditStatus(true)}
              className="flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
            >
              <Edit size={20} />
              Update Status
            </button>
            <button
              onClick={handleCreateUser}
              className="flex items-center gap-2 px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition"
            >
              <Plus size={20} />
              Create User
            </button>
          </div>
        </div>
      </div>

      {/* Edit Status Modal */}
      {showEditStatus && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg shadow-lg max-w-md w-full p-6">
            <h2 className="text-xl font-bold mb-4">Update Application Status</h2>

            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
              <select
                value={newStatus}
                onChange={(e) => setNewStatus(e.target.value)}
                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
              >
                <option value="pending">Pending</option>
                <option value="approved">Approved</option>
                <option value="admitted">Admitted</option>
                <option value="rejected">Rejected</option>
              </select>
            </div>

            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">Remarks</label>
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
                onClick={() => setShowEditStatus(false)}
                className="flex-1 px-4 py-2 border rounded-lg text-gray-700 hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={handleStatusUpdate}
                disabled={isSubmitting}
                className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
              >
                {isSubmitting ? 'Updating...' : 'Update'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
