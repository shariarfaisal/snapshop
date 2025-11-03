'use client';

import { useState, useEffect } from 'react';
import { ChevronRight, Loader2, AlertCircle, CheckCircle2, Trash2 } from 'lucide-react';

interface Institute {
  id: number;
  name: string;
  city: string;
}

interface SchoolClass {
  id: number;
  name: string;
  section: string;
}

interface FormData {
  institute_id: number;
  class_id: number;
  first_name: string;
  last_name: string;
  date_of_birth: string;
  gender: 'male' | 'female' | 'other';
  email: string;
  phone: string;
  address: string;
  previous_school: string;
  previous_class: string;
  father_name: string;
  father_phone: string;
  father_occupation: string;
  mother_name: string;
  mother_phone: string;
  mother_occupation: string;
  guardian_name: string;
  guardian_relation: string;
  guardian_phone: string;
}

const STORAGE_KEY = 'admission_form_draft';

export default function AdmissionForm() {
  const [formData, setFormData] = useState<FormData>({
    institute_id: 0,
    class_id: 0,
    first_name: '',
    last_name: '',
    date_of_birth: '',
    gender: 'male',
    email: '',
    phone: '',
    address: '',
    previous_school: '',
    previous_class: '',
    father_name: '',
    father_phone: '',
    father_occupation: '',
    mother_name: '',
    mother_phone: '',
    mother_occupation: '',
    guardian_name: '',
    guardian_relation: '',
    guardian_phone: '',
  });

  const [institutes, setInstitutes] = useState<Institute[]>([]);
  const [classes, setClasses] = useState<SchoolClass[]>([]);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string>('');
  const [success, setSuccess] = useState(false);
  const [successData, setSuccessData] = useState<any>(null);
  const [currentStep, setCurrentStep] = useState(1);
  const [hasDraft, setHasDraft] = useState(false);

  const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:8000/api';

  // Load draft on mount
  useEffect(() => {
    const savedDraft = localStorage.getItem(STORAGE_KEY);
    if (savedDraft) {
      try {
        const draft = JSON.parse(savedDraft);
        setFormData(draft);
        setHasDraft(true);
      } catch (err) {
        console.error('Failed to load draft:', err);
      }
    }
  }, []);

  // Auto-save to localStorage
  useEffect(() => {
    if (formData.first_name || formData.email || formData.phone) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(formData));
    }
  }, [formData]);

  // Load institutes
  useEffect(() => {
    fetch(`${API_URL}/public/admission/institutes`)
      .then(res => res.json())
      .then(data => data.success && setInstitutes(data.data))
      .catch(() => setError('Failed to load institutes'));
  }, [API_URL]);

  // Load classes when institute changes
  useEffect(() => {
    if (formData.institute_id) {
      fetch(`${API_URL}/public/admission/institutes/${formData.institute_id}/classes`)
        .then(res => res.json())
        .then(data => data.success && setClasses(data.data))
        .catch(() => setError('Failed to load classes'));
    } else {
      setClasses([]);
    }
  }, [formData.institute_id, API_URL]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    setError('');
  };

  const clearDraft = () => {
    localStorage.removeItem(STORAGE_KEY);
    setHasDraft(false);
    setFormData({
      institute_id: 0,
      class_id: 0,
      first_name: '',
      last_name: '',
      date_of_birth: '',
      gender: 'male',
      email: '',
      phone: '',
      address: '',
      previous_school: '',
      previous_class: '',
      father_name: '',
      father_phone: '',
      father_occupation: '',
      mother_name: '',
      mother_phone: '',
      mother_occupation: '',
      guardian_name: '',
      guardian_relation: '',
      guardian_phone: '',
    });
    setCurrentStep(1);
  };

  const validateStep = (step: number): boolean => {
    if (step === 1) return formData.institute_id > 0 && formData.class_id > 0;
    if (step === 2) return formData.first_name && formData.last_name && formData.email && formData.phone;
    if (step === 3) return formData.father_name && formData.father_phone && formData.mother_name && formData.mother_phone;
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setError('');

    try {
      const response = await fetch(`${API_URL}/public/admission/apply`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
      const data = await response.json();

      if (data.success) {
        setSuccess(true);
        setSuccessData(data.data);
        localStorage.removeItem(STORAGE_KEY);
      } else {
        setError(data.message || 'Submission failed');
      }
    } catch (err) {
      setError('An error occurred');
    } finally {
      setSubmitting(false);
    }
  };

  if (success) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 py-8 sm:py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-2xl mx-auto">
          <div className="bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-100">
            <div className="bg-gradient-to-r from-green-500 to-emerald-600 px-6 sm:px-8 py-12 text-center">
              <div className="inline-flex items-center justify-center w-20 h-20 bg-white rounded-full mb-6">
                <CheckCircle2 className="w-10 h-10 text-green-600" />
              </div>
              <h1 className="text-3xl sm:text-4xl font-bold text-white mb-2">Application Submitted!</h1>
              <p className="text-green-50">Your admission form has been successfully submitted</p>
            </div>

            <div className="p-6 sm:p-8">
              <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl p-6 mb-8 border border-blue-200">
                <h2 className="text-lg font-semibold text-gray-800 mb-4">Application Details</h2>
                <div className="space-y-4">
                  <div className="flex justify-between items-center pb-4 border-b border-blue-200">
                    <span className="text-gray-600 font-medium">Application Number:</span>
                    <span className="text-blue-600 font-bold text-lg">{successData?.application_number}</span>
                  </div>
                  <div className="flex justify-between items-center pb-4 border-b border-blue-200">
                    <span className="text-gray-600 font-medium">Email:</span>
                    <span className="text-gray-800">{successData?.email}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600 font-medium">Phone:</span>
                    <span className="text-gray-800">{successData?.phone}</span>
                  </div>
                </div>
              </div>

              <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 mb-8">
                <p className="text-sm text-amber-800">
                  <strong>Note:</strong> Please save your application number for future reference. You will be contacted soon with the next steps.
                </p>
              </div>

              <button 
                onClick={() => setSuccess(false)} 
                className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-6 py-3 rounded-lg font-semibold hover:from-blue-700 hover:to-indigo-700 transition-all duration-200"
              >
                Submit Another Application
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 py-8 sm:py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-8 sm:mb-12">
          <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-2">Online Admission Form</h1>
          <p className="text-gray-600">Complete the form below to apply for admission</p>
          {hasDraft && (
            <div className="mt-4 flex flex-col sm:flex-row gap-3">
              <div className="flex items-center gap-2 text-sm bg-blue-50 text-blue-700 px-4 py-2 rounded-lg border border-blue-200">
                <CheckCircle2 size={18} />
                <span>Your draft has been saved automatically</span>
              </div>
              <button
                onClick={clearDraft}
                type="button"
                className="flex items-center justify-center gap-2 text-sm px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
              >
                <Trash2 size={16} />
                Clear Draft
              </button>
            </div>
          )}
        </div>

        {/* Progress Steps */}
        <div className="mb-8 sm:mb-12">
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 sm:gap-0">
            {[
              { step: 1, label: 'Institution' },
              { step: 2, label: 'Student Info' },
              { step: 3, label: 'Parent Info' }
            ].map((item, idx) => (
              <div key={item.step} className="flex items-center flex-1 w-full sm:w-auto">
                <div className="flex flex-col items-center flex-1 sm:flex-row">
                  <div className={`flex items-center justify-center w-12 h-12 rounded-full font-bold text-lg transition-all duration-300 ${
                    item.step <= currentStep 
                      ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-lg' 
                      : 'bg-gray-200 text-gray-600'
                  }`}>
                    {item.step}
                  </div>
                  <span className="text-sm font-medium text-gray-700 mt-2 sm:mt-0 sm:ml-3">{item.label}</span>
                </div>
                {idx < 2 && (
                  <div className={`hidden sm:block w-full h-1 mx-3 rounded-full transition-all duration-300 ${
                    item.step < currentStep ? 'bg-gradient-to-r from-blue-600 to-indigo-600' : 'bg-gray-200'
                  }`} />
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Error Alert */}
        {error && (
          <div className="mb-8 p-4 bg-red-50 border border-red-200 rounded-lg flex gap-3">
            <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
            <div>
              <h3 className="font-semibold text-red-800">Error</h3>
              <p className="text-red-700 text-sm">{error}</p>
            </div>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
          <div className="p-6 sm:p-8">
            {/* Step 1: Institution & Class */}
            {currentStep === 1 && (
              <div className="space-y-6">
                <div>
                  <h2 className="text-2xl font-bold text-gray-900 mb-1">Institution & Class</h2>
                  <p className="text-gray-600">Select your preferred institution and class</p>
                </div>

                <div className="space-y-2">
                  <label className="block text-sm font-semibold text-gray-700">
                    Institution
                    <span className="text-red-500 ml-1">*</span>
                  </label>
                  <select 
                    name="institute_id" 
                    value={formData.institute_id} 
                    onChange={handleInputChange} 
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all text-gray-900 bg-white font-medium"
                    required
                  >
                    <option value="0">Choose an institution...</option>
                    {institutes.map(i => <option key={i.id} value={i.id}>{i.name} - {i.city}</option>)}
                  </select>
                </div>

                <div className="space-y-2">
                  <label className="block text-sm font-semibold text-gray-700">
                    Class/Program
                    <span className="text-red-500 ml-1">*</span>
                  </label>
                  <select 
                    name="class_id" 
                    value={formData.class_id} 
                    onChange={handleInputChange} 
                    disabled={!formData.institute_id} 
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all text-gray-900 bg-white font-medium disabled:bg-gray-100 disabled:text-gray-500"
                    required
                  >
                    <option value="0">Choose a class...</option>
                    {classes.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                  </select>
                </div>
              </div>
            )}

            {/* Step 2: Student Details */}
            {currentStep === 2 && (
              <div className="space-y-6">
                <div>
                  <h2 className="text-2xl font-bold text-gray-900 mb-1">Student Information</h2>
                  <p className="text-gray-600">Please provide your personal details</p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="block text-sm font-semibold text-gray-700">
                      First Name
                      <span className="text-red-500 ml-1">*</span>
                    </label>
                    <input 
                      type="text" 
                      name="first_name" 
                      value={formData.first_name} 
                      onChange={handleInputChange} 
                      placeholder="Enter your first name" 
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all text-gray-900" 
                      required 
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="block text-sm font-semibold text-gray-700">
                      Last Name
                      <span className="text-red-500 ml-1">*</span>
                    </label>
                    <input 
                      type="text" 
                      name="last_name" 
                      value={formData.last_name} 
                      onChange={handleInputChange} 
                      placeholder="Enter your last name" 
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all text-gray-900" 
                      required 
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="block text-sm font-semibold text-gray-700">
                      Date of Birth
                      <span className="text-red-500 ml-1">*</span>
                    </label>
                    <input 
                      type="date" 
                      name="date_of_birth" 
                      value={formData.date_of_birth} 
                      onChange={handleInputChange} 
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all text-gray-900" 
                      required 
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="block text-sm font-semibold text-gray-700">
                      Gender
                      <span className="text-red-500 ml-1">*</span>
                    </label>
                    <select 
                      name="gender" 
                      value={formData.gender} 
                      onChange={handleInputChange} 
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all text-gray-900 bg-white font-medium"
                    >
                      <option value="male">Male</option>
                      <option value="female">Female</option>
                      <option value="other">Other</option>
                    </select>
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="block text-sm font-semibold text-gray-700">
                    Email Address
                    <span className="text-red-500 ml-1">*</span>
                  </label>
                  <input 
                    type="email" 
                    name="email" 
                    value={formData.email} 
                    onChange={handleInputChange} 
                    placeholder="your.email@example.com" 
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all text-gray-900" 
                    required 
                  />
                  <p className="text-xs text-gray-500">We'll use this for admission updates</p>
                </div>

                <div className="space-y-2">
                  <label className="block text-sm font-semibold text-gray-700">
                    Phone Number
                    <span className="text-red-500 ml-1">*</span>
                  </label>
                  <input 
                    type="tel" 
                    name="phone" 
                    value={formData.phone} 
                    onChange={handleInputChange} 
                    placeholder="+1 (555) 000-0000" 
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all text-gray-900" 
                    required 
                  />
                  <p className="text-xs text-gray-500">Include country code if outside local region</p>
                </div>

                <div className="space-y-2">
                  <label className="block text-sm font-semibold text-gray-700">
                    Residential Address
                    <span className="text-red-500 ml-1">*</span>
                  </label>
                  <textarea 
                    name="address" 
                    value={formData.address} 
                    onChange={handleInputChange} 
                    placeholder="Street address, city, state, postal code" 
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all text-gray-900 resize-none" 
                    rows={3} 
                    required 
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="block text-sm font-semibold text-gray-700">
                      Previous School
                    </label>
                    <input 
                      type="text" 
                      name="previous_school" 
                      value={formData.previous_school} 
                      onChange={handleInputChange} 
                      placeholder="Name of previous school" 
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all text-gray-900" 
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="block text-sm font-semibold text-gray-700">
                      Previous Class
                    </label>
                    <input 
                      type="text" 
                      name="previous_class" 
                      value={formData.previous_class} 
                      onChange={handleInputChange} 
                      placeholder="e.g., Class 5 or Grade 5" 
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all text-gray-900" 
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Step 3: Parent Details */}
            {currentStep === 3 && (
              <div className="space-y-8">
                <div>
                  <h2 className="text-2xl font-bold text-gray-900 mb-1">Parent/Guardian Information</h2>
                  <p className="text-gray-600">Please provide details of both parents/guardians</p>
                </div>

                {/* Father Details */}
                <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl p-6 border-l-4 border-blue-600 space-y-4">
                  <h3 className="text-lg font-bold text-gray-900">Father's Information</h3>
                  
                  <div className="space-y-2">
                    <label className="block text-sm font-semibold text-gray-700">
                      Father's Name
                      <span className="text-red-500 ml-1">*</span>
                    </label>
                    <input 
                      type="text" 
                      name="father_name" 
                      value={formData.father_name} 
                      onChange={handleInputChange} 
                      placeholder="Full name" 
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all text-gray-900" 
                      required 
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="block text-sm font-semibold text-gray-700">
                      Father's Phone
                      <span className="text-red-500 ml-1">*</span>
                    </label>
                    <input 
                      type="tel" 
                      name="father_phone" 
                      value={formData.father_phone} 
                      onChange={handleInputChange} 
                      placeholder="Phone number" 
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all text-gray-900" 
                      required 
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="block text-sm font-semibold text-gray-700">
                      Father's Occupation
                    </label>
                    <input 
                      type="text" 
                      name="father_occupation" 
                      value={formData.father_occupation} 
                      onChange={handleInputChange} 
                      placeholder="e.g., Engineer, Teacher, Businessman" 
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all text-gray-900" 
                    />
                  </div>
                </div>

                {/* Mother Details */}
                <div className="bg-gradient-to-br from-pink-50 to-rose-100 rounded-xl p-6 border-l-4 border-pink-600 space-y-4">
                  <h3 className="text-lg font-bold text-gray-900">Mother's Information</h3>
                  
                  <div className="space-y-2">
                    <label className="block text-sm font-semibold text-gray-700">
                      Mother's Name
                      <span className="text-red-500 ml-1">*</span>
                    </label>
                    <input 
                      type="text" 
                      name="mother_name" 
                      value={formData.mother_name} 
                      onChange={handleInputChange} 
                      placeholder="Full name" 
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all text-gray-900" 
                      required 
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="block text-sm font-semibold text-gray-700">
                      Mother's Phone
                      <span className="text-red-500 ml-1">*</span>
                    </label>
                    <input 
                      type="tel" 
                      name="mother_phone" 
                      value={formData.mother_phone} 
                      onChange={handleInputChange} 
                      placeholder="Phone number" 
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all text-gray-900" 
                      required 
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="block text-sm font-semibold text-gray-700">
                      Mother's Occupation
                    </label>
                    <input 
                      type="text" 
                      name="mother_occupation" 
                      value={formData.mother_occupation} 
                      onChange={handleInputChange} 
                      placeholder="e.g., Doctor, Homemaker, Accountant" 
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all text-gray-900" 
                    />
                  </div>
                </div>

                {/* Guardian Details */}
                <div className="bg-gradient-to-br from-purple-50 to-indigo-100 rounded-xl p-6 border-l-4 border-purple-600 space-y-4">
                  <h3 className="text-lg font-bold text-gray-900">Guardian Information (if different from parents)</h3>
                  
                  <div className="space-y-2">
                    <label className="block text-sm font-semibold text-gray-700">
                      Guardian Name
                    </label>
                    <input 
                      type="text" 
                      name="guardian_name" 
                      value={formData.guardian_name} 
                      onChange={handleInputChange} 
                      placeholder="Full name" 
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all text-gray-900" 
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="block text-sm font-semibold text-gray-700">
                      Relation to Student
                    </label>
                    <input 
                      type="text" 
                      name="guardian_relation" 
                      value={formData.guardian_relation} 
                      onChange={handleInputChange} 
                      placeholder="e.g., Grandfather, Aunt, Uncle" 
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all text-gray-900" 
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="block text-sm font-semibold text-gray-700">
                      Guardian Phone
                    </label>
                    <input 
                      type="tel" 
                      name="guardian_phone" 
                      value={formData.guardian_phone} 
                      onChange={handleInputChange} 
                      placeholder="Phone number" 
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all text-gray-900" 
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Navigation Buttons */}
            <div className="mt-8 pt-8 border-t border-gray-200 flex flex-col-reverse sm:flex-row justify-between gap-4">
              <button 
                type="button" 
                onClick={() => setCurrentStep(Math.max(1, currentStep - 1))} 
                disabled={currentStep === 1} 
                className="px-6 py-3 border border-gray-300 rounded-lg font-semibold text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
              >
                ← Previous
              </button>

              {currentStep < 3 ? (
                <button 
                  type="button" 
                  onClick={() => validateStep(currentStep) && setCurrentStep(currentStep + 1)} 
                  disabled={!validateStep(currentStep)}
                  className="px-8 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-lg font-semibold hover:from-blue-700 hover:to-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 flex items-center justify-center gap-2"
                >
                  Next <ChevronRight size={20} />
                </button>
              ) : (
                <button 
                  type="submit" 
                  disabled={submitting} 
                  className="px-8 py-3 bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-lg font-semibold hover:from-green-700 hover:to-emerald-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 flex items-center justify-center gap-2"
                >
                  {submitting ? (
                    <>
                      <Loader2 size={20} className="animate-spin" /> 
                      Submitting...
                    </>
                  ) : (
                    <>
                      Submit Application
                    </>
                  )}
                </button>
              )}
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
