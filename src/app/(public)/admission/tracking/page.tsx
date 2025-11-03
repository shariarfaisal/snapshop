'use client';

import { useState } from 'react';
import { Search, CheckCircle, Clock, AlertCircle, Loader2 } from 'lucide-react';

export default function AdmissionTracking() {
  const [applicationNumber, setApplicationNumber] = useState('');
  const [email, setEmail] = useState('');
  const [tracking, setTracking] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:8000/api';

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pending':
        return <Clock className="text-yellow-500" size={24} />;
      case 'approved':
        return <CheckCircle className="text-green-500" size={24} />;
      case 'rejected':
        return <AlertCircle className="text-red-500" size={24} />;
      default:
        return <Clock className="text-gray-500" size={24} />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-50 border-yellow-200';
      case 'approved':
        return 'bg-green-50 border-green-200';
      case 'rejected':
        return 'bg-red-50 border-red-200';
      default:
        return 'bg-gray-50 border-gray-200';
    }
  };

  const handleTrack = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setTracking(null);

    try {
      const response = await fetch(`${API_URL}/public/admission/track`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ application_number: applicationNumber, email }),
      });
      const data = await response.json();

      if (data.success) {
        setTracking(data.data);
      } else {
        setError(data.message || 'Application not found');
      }
    } catch (err) {
      setError('Error tracking application');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white py-12 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-800 mb-2">Track Your Application</h1>
          <p className="text-gray-600">Enter your application number and email to track the status</p>
        </div>

        <form onSubmit={handleTrack} className="bg-white rounded-lg shadow-lg p-8 mb-8">
          <div className="grid md:grid-cols-2 gap-6 mb-6">
            <div>
              <label className="block text-gray-700 font-semibold mb-2">Application Number *</label>
              <input
                type="text"
                value={applicationNumber}
                onChange={(e) => setApplicationNumber(e.target.value)}
                placeholder="e.g., ADM2024-00001"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
              />
            </div>
            <div>
              <label className="block text-gray-700 font-semibold mb-2">Email Address *</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="your@email.com"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
              />
            </div>
          </div>

          {error && <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700">{error}</div>}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-blue-700 disabled:opacity-50 transition flex items-center justify-center gap-2"
          >
            {loading ? (
              <>
                <Loader2 size={20} className="animate-spin" />
                Tracking...
              </>
            ) : (
              <>
                <Search size={20} />
                Track Application
              </>
            )}
          </button>
        </form>

        {tracking && (
          <div className={`bg-white rounded-lg shadow-lg p-8 border-l-4 ${getStatusColor(tracking.status)}`}>
            <div className="flex items-start gap-6">
              <div className="flex-shrink-0">
                {getStatusIcon(tracking.status)}
              </div>
              <div className="flex-1">
                <h2 className="text-2xl font-bold text-gray-800 mb-4">Application Status</h2>

                <div className="grid md:grid-cols-2 gap-6 mb-6">
                  <div>
                    <p className="text-gray-600 text-sm">Applicant Name</p>
                    <p className="text-lg font-semibold text-gray-800">{tracking.full_name}</p>
                  </div>
                  <div>
                    <p className="text-gray-600 text-sm">Application Number</p>
                    <p className="text-lg font-semibold text-blue-600">{tracking.application_number}</p>
                  </div>
                  <div>
                    <p className="text-gray-600 text-sm">Status</p>
                    <p className={`text-lg font-semibold ${
                      tracking.status === 'approved' ? 'text-green-600' :
                      tracking.status === 'rejected' ? 'text-red-600' :
                      'text-yellow-600'
                    }`}>
                      {tracking.status.charAt(0).toUpperCase() + tracking.status.slice(1)}
                    </p>
                  </div>
                  <div>
                    <p className="text-gray-600 text-sm">Applied On</p>
                    <p className="text-lg font-semibold text-gray-800">{new Date(tracking.applied_at).toLocaleDateString()}</p>
                  </div>
                </div>

                {tracking.reviewed_at && (
                  <div className="mb-6">
                    <p className="text-gray-600 text-sm">Reviewed On</p>
                    <p className="text-lg font-semibold text-gray-800">{new Date(tracking.reviewed_at).toLocaleDateString()}</p>
                  </div>
                )}

                {tracking.remarks && (
                  <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                    <p className="text-gray-600 text-sm">Remarks</p>
                    <p className="text-gray-800">{tracking.remarks}</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {!tracking && !error && (
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
            <p className="text-blue-800">Enter your details above to check your application status</p>
          </div>
        )}
      </div>
    </div>
  );
}
