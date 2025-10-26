'use client';

import { useState } from 'react';
import Link from 'next/link';
import {
  BookOpen,
  LogIn,
  Menu,
  X,
  ChevronRight,
  FileText,
} from 'lucide-react';

interface FormStep {
  id: number;
  title: string;
  fields: string[];
}

const FORM_STEPS: FormStep[] = [
  {
    id: 1,
    title: 'Personal Information',
    fields: [
      'firstName',
      'lastName',
      'email',
      'phone',
      'dateOfBirth',
      'gender',
    ],
  },
  {
    id: 2,
    title: 'Academic Details',
    fields: ['applyingFor', 'previousSchool', 'previousClass', 'totalMarks'],
  },
  {
    id: 3,
    title: 'Parent/Guardian Details',
    fields: ['parentName', 'parentPhone', 'parentEmail', 'parentOccupation'],
  },
  {
    id: 4,
    title: 'Document Upload',
    fields: ['birthCertificate', 'transferCertificate', 'photograph'],
  },
];

export default function AdmissionFormPage() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    dateOfBirth: '',
    gender: '',
    applyingFor: '',
    previousSchool: '',
    previousClass: '',
    totalMarks: '',
    parentName: '',
    parentPhone: '',
    parentEmail: '',
    parentOccupation: '',
  });

  const handleInputChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);

    // Simulate submission
    setTimeout(() => {
      setSubmitting(false);
      setSubmitted(true);
    }, 1500);
  };

  const goToStep = (step: number) => {
    if (step >= 1 && step <= FORM_STEPS.length) {
      setCurrentStep(step);
    }
  };

  if (submitted) {
    return (
      <div className="bg-white min-h-screen">
        {/* Navigation */}
        <nav className="bg-gradient-to-r from-blue-600 to-blue-700 text-white">
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
          </div>
        </nav>

        {/* Success Message */}
        <div className="max-w-4xl mx-auto px-4 py-16">
          <div className="bg-green-50 border-2 border-green-500 rounded-lg p-12 text-center">
            <div className="text-6xl mb-4">✓</div>
            <h1 className="text-3xl font-bold text-green-800 mb-4">
              Application Submitted Successfully!
            </h1>
            <p className="text-lg text-green-700 mb-8">
              Thank you for submitting your admission application. We have received your
              submission and will review it shortly.
            </p>
            <div className="bg-green-100 rounded-lg p-6 mb-8">
              <p className="text-green-800">
                <strong>Application Reference Number:</strong> APP-2024-001234
              </p>
              <p className="text-green-800 mt-2">
                You can track your application status using this reference number.
              </p>
            </div>
            <div className="flex gap-4 justify-center">
              <Link
                href="/public/landing"
                className="bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 transition"
              >
                Back to Home
              </Link>
              <Link
                href="/public/admission/form"
                className="border-2 border-blue-600 text-blue-600 px-6 py-3 rounded-lg font-semibold hover:bg-blue-50 transition"
              >
                New Application
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const currentStepData = FORM_STEPS[currentStep - 1];

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

      <div className="max-w-4xl mx-auto px-4 py-12">
        {/* Header */}
        <div className="mb-12">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-800 mb-2 flex items-center gap-3">
            <FileText size={32} className="text-blue-600" />
            Online Admission Form
          </h1>
          <p className="text-gray-600">
            Complete all steps to submit your admission application
          </p>
        </div>

        {/* Progress Steps */}
        <div className="mb-12">
          <div className="flex gap-2 md:gap-4">
            {FORM_STEPS.map((step) => (
              <div key={step.id} className="flex-1">
                <button
                  onClick={() => goToStep(step.id)}
                  className={`w-full px-2 md:px-4 py-3 rounded-lg font-semibold transition text-sm md:text-base ${
                    currentStep >= step.id
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-200 text-gray-600'
                  }`}
                >
                  Step {step.id}
                </button>
              </div>
            ))}
          </div>
          <p className="mt-4 text-gray-600 text-center">
            Step {currentStep} of {FORM_STEPS.length}: {currentStepData.title}
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow-md p-8">
          <h2 className="text-2xl font-bold text-gray-800 mb-6">
            {currentStepData.title}
          </h2>

          <div className="space-y-6 mb-8">
            {currentStep === 1 && (
              <>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      First Name *
                    </label>
                    <input
                      type="text"
                      name="firstName"
                      value={formData.firstName}
                      onChange={handleInputChange}
                      required
                      placeholder="First name"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Last Name *
                    </label>
                    <input
                      type="text"
                      name="lastName"
                      value={formData.lastName}
                      onChange={handleInputChange}
                      required
                      placeholder="Last name"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Email *
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    required
                    placeholder="your@email.com"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
                  />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Phone *
                    </label>
                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleInputChange}
                      required
                      placeholder="+91 98765 43210"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Date of Birth *
                    </label>
                    <input
                      type="date"
                      name="dateOfBirth"
                      value={formData.dateOfBirth}
                      onChange={handleInputChange}
                      required
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Gender *
                  </label>
                  <select
                    name="gender"
                    value={formData.gender}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
                  >
                    <option value="">Select Gender</option>
                    <option value="male">Male</option>
                    <option value="female">Female</option>
                    <option value="other">Other</option>
                  </select>
                </div>
              </>
            )}

            {currentStep === 2 && (
              <>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Applying For Class *
                  </label>
                  <select
                    name="applyingFor"
                    value={formData.applyingFor}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
                  >
                    <option value="">Select Class</option>
                    <option value="grade1">Grade 1</option>
                    <option value="grade6">Grade 6</option>
                    <option value="grade9">Grade 9</option>
                    <option value="grade11">Grade 11</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Previous School
                  </label>
                  <input
                    type="text"
                    name="previousSchool"
                    value={formData.previousSchool}
                    onChange={handleInputChange}
                    placeholder="School name"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
                  />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Previous Class
                    </label>
                    <input
                      type="text"
                      name="previousClass"
                      value={formData.previousClass}
                      onChange={handleInputChange}
                      placeholder="e.g., Class 5"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Total Marks
                    </label>
                    <input
                      type="number"
                      name="totalMarks"
                      value={formData.totalMarks}
                      onChange={handleInputChange}
                      placeholder="e.g., 450"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
                    />
                  </div>
                </div>
              </>
            )}

            {currentStep === 3 && (
              <>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Parent/Guardian Name *
                  </label>
                  <input
                    type="text"
                    name="parentName"
                    value={formData.parentName}
                    onChange={handleInputChange}
                    required
                    placeholder="Full name"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
                  />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Phone *
                    </label>
                    <input
                      type="tel"
                      name="parentPhone"
                      value={formData.parentPhone}
                      onChange={handleInputChange}
                      required
                      placeholder="+91 98765 43210"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Email *
                    </label>
                    <input
                      type="email"
                      name="parentEmail"
                      value={formData.parentEmail}
                      onChange={handleInputChange}
                      required
                      placeholder="your@email.com"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Occupation
                  </label>
                  <input
                    type="text"
                    name="parentOccupation"
                    value={formData.parentOccupation}
                    onChange={handleInputChange}
                    placeholder="Job/Business"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
                  />
                </div>
              </>
            )}

            {currentStep === 4 && (
              <>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Birth Certificate *
                  </label>
                  <input
                    type="file"
                    accept=".pdf,.jpg,.jpeg,.png"
                    required
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Transfer Certificate
                  </label>
                  <input
                    type="file"
                    accept=".pdf,.jpg,.jpeg,.png"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Photograph *
                  </label>
                  <input
                    type="file"
                    accept=".jpg,.jpeg,.png"
                    required
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
                  />
                </div>
              </>
            )}
          </div>

          {/* Navigation Buttons */}
          <div className="flex gap-4 justify-between">
            <button
              type="button"
              onClick={() => goToStep(currentStep - 1)}
              disabled={currentStep === 1}
              className={`px-6 py-2 rounded-lg font-semibold transition ${
                currentStep === 1
                  ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                  : 'bg-gray-300 text-gray-800 hover:bg-gray-400'
              }`}
            >
              Previous
            </button>

            {currentStep === FORM_STEPS.length ? (
              <button
                type="submit"
                disabled={submitting}
                className={`px-8 py-2 rounded-lg font-semibold transition flex items-center gap-2 ${
                  submitting
                    ? 'bg-gray-400 text-gray-600 cursor-not-allowed'
                    : 'bg-green-600 text-white hover:bg-green-700'
                }`}
              >
                {submitting ? 'Submitting...' : 'Submit Application'}
                {!submitting && <ChevronRight size={20} />}
              </button>
            ) : (
              <button
                type="button"
                onClick={() => goToStep(currentStep + 1)}
                className="px-8 py-2 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition flex items-center gap-2"
              >
                Next
                <ChevronRight size={20} />
              </button>
            )}
          </div>
        </form>
      </div>
    </div>
  );
}
