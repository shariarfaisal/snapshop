'use client';

import Link from 'next/link';
import { BookOpen, LogIn, Menu, X, Search } from 'lucide-react';
import { useState } from 'react';

interface Application {
  referenceNumber: string;
  studentName: string;
  applyingFor: string;
  submittedDate: string;
  status: 'submitted' | 'under_review' | 'shortlisted' | 'rejected' | 'admitted';
  remarks?: string;
}

export default function ApplicationTrackingPage() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [referenceNumber, setReferenceNumber] = useState('');
  const [searchResults, setSearchResults] = useState<Application | null>(null);
  const [searched, setSearched] = useState(false);

  const mockApplications: { [key: string]: Application } = {
    'APP-2024-001234': {
      referenceNumber: 'APP-2024-001234',
      studentName: 'Arjun Kumar',
      applyingFor: 'Grade 6',
      submittedDate: '2024-10-26',
      status: 'under_review',
      remarks: 'Documents under verification',
    },
    'APP-2024-001235': {
      referenceNumber: 'APP-2024-001235',
      studentName: 'Priya Singh',
      applyingFor: 'Grade 9',
      submittedDate: '2024-10-25',
      status: 'shortlisted',
      remarks: 'Selected for interview on November 5th',
    },
    'APP-2024-001236': {
      referenceNumber: 'APP-2024-001236',
      studentName: 'Rahul Patel',
      applyingFor: 'Grade 11',
      submittedDate: '2024-10-24',
      status: 'admitted',
      remarks: 'Admission letter sent via email',
    },
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const result = mockApplications[referenceNumber.toUpperCase()];
    setSearchResults(result || null);
    setSearched(true);
  };

  const getStatusBadge = (status: string) => {
    const statusMap: { [key: string]: { bg: string; text: string; label: string } } = {
      submitted: {
        bg: 'bg-blue-100',
        text: 'text-blue-800',
        label: 'Submitted',
      },
      under_review: {
        bg: 'bg-yellow-100',
        text: 'text-yellow-800',
        label: 'Under Review',
      },
      shortlisted: {
        bg: 'bg-green-100',
        text: 'text-green-800',
        label: 'Shortlisted',
      },
      rejected: {
        bg: 'bg-red-100',
        text: 'text-red-800',
        label: 'Rejected',
      },
      admitted: {
        bg: 'bg-purple-100',
        text: 'text-purple-800',
        label: 'Admitted',
      },
    };
    const info = statusMap[status];
    return { ...info };
  };

  return (
    <div className="bg-white">
      {/* Navigation */}
      <nav className="bg-gradient-to-r from-blue-600 to-blue-700 text-white sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            <Link href="/public/landing" className="flex items-center gap-2">
              <BookOpen size={32} />
              <h1 className="text-2xl font-bold">E-Campus</h1>
            </Link>

            <div className="hidden md:flex items-center gap-6">
              <Link href="/public/landing" className="hover:opacity-80">
                Home
              </Link>
              <Link href="/public/about" className="hover:opacity-80">
                About
              </Link>
              <Link href="/public/admission/form" className="hover:opacity-80">
                Apply
              </Link>
              <Link href="/public/contact" className="hover:opacity-80">
                Contact
              </Link>
              <Link
                href="/login"
                className="bg-white text-blue-600 px-4 py-2 rounded-lg font-semibold hover:bg-blue-50 transition flex items-center gap-2"
              >
                <LogIn size={18} />
                Login
              </Link>
            </div>

            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden"
            >
              {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>

          {mobileMenuOpen && (
            <div className="md:hidden pb-4 space-y-2">
              <Link
                href="/public/landing"
                className="block px-4 py-2 hover:bg-blue-500 rounded"
              >
                Home
              </Link>
              <Link
                href="/public/about"
                className="block px-4 py-2 hover:bg-blue-500 rounded"
              >
                About
              </Link>
              <Link
                href="/public/admission/form"
                className="block px-4 py-2 hover:bg-blue-500 rounded"
              >
                Apply
              </Link>
              <Link
                href="/public/contact"
                className="block px-4 py-2 hover:bg-blue-500 rounded"
              >
                Contact
              </Link>
              <Link
                href="/login"
                className="block px-4 py-2 bg-white text-blue-600 rounded font-semibold"
              >
                Login
              </Link>
            </div>
          )}
        </div>
      </nav>

      {/* Main Content */}
      <div className="max-w-4xl mx-auto px-4 py-16">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-800 mb-4">
            Track Your Application
          </h1>
          <p className="text-xl text-gray-600">
            Enter your application reference number to check the status
          </p>
        </div>

        {/* Search Form */}
        <div className="bg-white rounded-lg shadow-md p-8 mb-12">
          <form onSubmit={handleSearch} className="space-y-4">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Application Reference Number
              </label>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={referenceNumber}
                  onChange={(e) => setReferenceNumber(e.target.value)}
                  placeholder="e.g., APP-2024-001234"
                  className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
                  required
                />
                <button
                  type="submit"
                  className="bg-blue-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-blue-700 transition flex items-center gap-2"
                >
                  <Search size={20} />
                  Search
                </button>
              </div>
            </div>
          </form>

          {/* Help Text */}
          <div className="mt-6 bg-blue-50 rounded-lg p-4">
            <p className="text-sm text-gray-700">
              <strong>Sample Reference Numbers:</strong> APP-2024-001234, APP-2024-001235, APP-2024-001236
            </p>
          </div>
        </div>

        {/* Search Results */}
        {searched && (
          <>
            {searchResults ? (
              <div className="bg-white rounded-lg shadow-md p-8">
                <h2 className="text-2xl font-bold text-gray-800 mb-6">Application Status</h2>

                <div className="space-y-6">
                  {/* Applicant Information */}
                  <div className="bg-gray-50 rounded-lg p-6">
                    <h3 className="text-lg font-semibold text-gray-800 mb-4">
                      Applicant Information
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <p className="text-sm text-gray-600">Student Name</p>
                        <p className="text-lg font-semibold text-gray-800">
                          {searchResults.studentName}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600">Reference Number</p>
                        <p className="text-lg font-semibold text-gray-800">
                          {searchResults.referenceNumber}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600">Applying For</p>
                        <p className="text-lg font-semibold text-gray-800">
                          {searchResults.applyingFor}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600">Submitted Date</p>
                        <p className="text-lg font-semibold text-gray-800">
                          {new Date(searchResults.submittedDate).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Status Timeline */}
                  <div>
                    <h3 className="text-lg font-semibold text-gray-800 mb-4">
                      Application Status
                    </h3>
                    <div className="bg-gray-50 rounded-lg p-6">
                      <div className="flex items-center gap-4">
                        <div className="flex-1">
                          <p className="text-sm text-gray-600">Current Status</p>
                          <p className="text-lg font-semibold text-gray-800 mt-1">
                            {getStatusBadge(searchResults.status).label}
                          </p>
                        </div>
                        <span
                          className={`px-4 py-2 rounded-full text-sm font-semibold whitespace-nowrap ${getStatusBadge(searchResults.status).bg} ${getStatusBadge(searchResults.status).text}`}
                        >
                          {getStatusBadge(searchResults.status).label}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Remarks */}
                  {searchResults.remarks && (
                    <div className="bg-blue-50 border-l-4 border-blue-600 rounded-lg p-6">
                      <h3 className="text-lg font-semibold text-gray-800 mb-2">
                        Remarks
                      </h3>
                      <p className="text-gray-700">{searchResults.remarks}</p>
                    </div>
                  )}

                  {/* Timeline Steps */}
                  <div>
                    <h3 className="text-lg font-semibold text-gray-800 mb-4">
                      Application Timeline
                    </h3>
                    <div className="space-y-4">
                      {[
                        {
                          step: 'Application Submitted',
                          date: searchResults.submittedDate,
                          completed: true,
                        },
                        {
                          step: 'Documents Verified',
                          completed: ['under_review', 'shortlisted', 'admitted', 'rejected'].includes(
                            searchResults.status
                          ),
                        },
                        {
                          step: 'Interview Scheduled',
                          completed: ['shortlisted', 'admitted', 'rejected'].includes(
                            searchResults.status
                          ),
                        },
                        {
                          step: 'Final Decision',
                          completed:
                            searchResults.status === 'admitted' ||
                            searchResults.status === 'rejected',
                        },
                      ].map((item, idx) => (
                        <div key={idx} className="flex gap-4">
                          <div className="flex flex-col items-center">
                            <div
                              className={`w-8 h-8 rounded-full flex items-center justify-center font-semibold text-sm ${
                                item.completed
                                  ? 'bg-green-600 text-white'
                                  : 'bg-gray-300 text-gray-600'
                              }`}
                            >
                              {item.completed ? '✓' : '○'}
                            </div>
                            {idx !== 3 && (
                              <div
                                className={`w-1 h-12 mt-1 ${
                                  item.completed ? 'bg-green-600' : 'bg-gray-300'
                                }`}
                              ></div>
                            )}
                          </div>
                          <div className="pt-2">
                            <p
                              className={`font-semibold ${
                                item.completed ? 'text-gray-800' : 'text-gray-600'
                              }`}
                            >
                              {item.step}
                            </p>
                            {item.date && (
                              <p className="text-sm text-gray-500">
                                {new Date(item.date).toLocaleDateString()}
                              </p>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex gap-4">
                    <button
                      onClick={() => {
                        setReferenceNumber('');
                        setSearchResults(null);
                        setSearched(false);
                      }}
                      className="flex-1 bg-gray-300 text-gray-800 px-6 py-2 rounded-lg font-semibold hover:bg-gray-400 transition"
                    >
                      New Search
                    </button>
                    <Link
                      href="/public/contact"
                      className="flex-1 bg-blue-600 text-white px-6 py-2 rounded-lg font-semibold hover:bg-blue-700 transition text-center"
                    >
                      Contact Support
                    </Link>
                  </div>
                </div>
              </div>
            ) : (
              <div className="bg-red-50 border-2 border-red-500 rounded-lg p-8 text-center">
                <div className="text-4xl mb-4">✕</div>
                <h2 className="text-2xl font-bold text-red-800 mb-2">
                  Application Not Found
                </h2>
                <p className="text-red-700 mb-4">
                  Please check your reference number and try again.
                </p>
                <button
                  onClick={() => {
                    setReferenceNumber('');
                    setSearchResults(null);
                    setSearched(false);
                  }}
                  className="bg-red-600 text-white px-6 py-2 rounded-lg font-semibold hover:bg-red-700 transition"
                >
                  Try Again
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
