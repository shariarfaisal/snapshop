'use client';

import Link from 'next/link';
import { BookOpen, LogIn, Menu, X } from 'lucide-react';
import { useState } from 'react';

export default function AboutPage() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const visionValues = [
    {
      title: 'Innovation',
      description:
        'Leveraging technology to create better educational experiences.',
    },
    {
      title: 'Accessibility',
      description:
        'Making quality education management available to all institutions.',
    },
    {
      title: 'Reliability',
      description:
        'Ensuring stable and secure platform for educational data.',
    },
    {
      title: 'Collaboration',
      description:
        'Fostering better communication between all stakeholders.',
    },
  ];

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

            {/* Desktop Menu */}
            <div className="hidden md:flex items-center gap-6">
              <Link href="/public/landing" className="hover:opacity-80">
                Home
              </Link>
              <Link href="/public/about" className="hover:opacity-80">
                About
              </Link>
              <Link href="/public/admission/form" className="hover:opacity-80">
                Admission
              </Link>
              <Link href="/public/contact" className="hover:opacity-80">
                Contact
              </Link>
              <Link href="/public/help" className="hover:opacity-80">
                Help
              </Link>
              <Link
                href="/login"
                className="bg-white text-blue-600 px-4 py-2 rounded-lg font-semibold hover:bg-blue-50 transition flex items-center gap-2"
              >
                <LogIn size={18} />
                Login
              </Link>
            </div>

            {/* Mobile Menu Toggle */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden"
            >
              {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>

          {/* Mobile Menu */}
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
                Admission
              </Link>
              <Link
                href="/public/contact"
                className="block px-4 py-2 hover:bg-blue-500 rounded"
              >
                Contact
              </Link>
              <Link
                href="/public/help"
                className="block px-4 py-2 hover:bg-blue-500 rounded"
              >
                Help
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
      <div className="max-w-5xl mx-auto px-4 py-16">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-800 mb-4">
            About E-Campus
          </h1>
          <p className="text-xl text-gray-600">
            Transforming Education Through Technology
          </p>
        </div>

        {/* Mission & Vision */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 mb-16">
          <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg p-8">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">Our Mission</h2>
            <p className="text-gray-700 leading-relaxed">
              To provide a comprehensive, user-friendly education management system that
              empowers schools, teachers, students, and parents to collaborate effectively,
              improve academic outcomes, and create a better learning environment for all.
            </p>
          </div>

          <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-lg p-8">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">Our Vision</h2>
            <p className="text-gray-700 leading-relaxed">
              To be the leading education management platform that digitizes and optimizes
              educational processes globally, making quality education more accessible,
              efficient, and transparent for all institutions.
            </p>
          </div>
        </div>

        {/* Core Values */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-gray-800 mb-8 text-center">
            Our Core Values
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {visionValues.map((value, idx) => (
              <div key={idx} className="bg-white rounded-lg shadow-md p-6">
                <h3 className="text-xl font-semibold text-blue-600 mb-3">
                  {value.title}
                </h3>
                <p className="text-gray-700">{value.description}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Why Choose Us */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-gray-800 mb-8 text-center">
            Why Choose E-Campus?
          </h2>
          <div className="bg-gray-50 rounded-lg p-8 space-y-4">
            <div className="flex gap-4">
              <div className="flex-shrink-0">
                <div className="flex items-center justify-center h-12 w-12 rounded-md bg-blue-600 text-white">
                  ✓
                </div>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-800">
                  Comprehensive Solution
                </h3>
                <p className="text-gray-600 mt-1">
                  All-in-one platform covering admissions, academics, attendance, exams,
                  fees, and communication.
                </p>
              </div>
            </div>

            <div className="flex gap-4">
              <div className="flex-shrink-0">
                <div className="flex items-center justify-center h-12 w-12 rounded-md bg-blue-600 text-white">
                  ✓
                </div>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-800">
                  Easy to Use
                </h3>
                <p className="text-gray-600 mt-1">
                  Intuitive interface designed for ease of use by all stakeholders.
                </p>
              </div>
            </div>

            <div className="flex gap-4">
              <div className="flex-shrink-0">
                <div className="flex items-center justify-center h-12 w-12 rounded-md bg-blue-600 text-white">
                  ✓
                </div>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-800">
                  Highly Secure
                </h3>
                <p className="text-gray-600 mt-1">
                  Enterprise-grade security to protect sensitive educational data.
                </p>
              </div>
            </div>

            <div className="flex gap-4">
              <div className="flex-shrink-0">
                <div className="flex items-center justify-center h-12 w-12 rounded-md bg-blue-600 text-white">
                  ✓
                </div>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-800">
                  24/7 Support
                </h3>
                <p className="text-gray-600 mt-1">
                  Dedicated support team available round the clock for assistance.
                </p>
              </div>
            </div>

            <div className="flex gap-4">
              <div className="flex-shrink-0">
                <div className="flex items-center justify-center h-12 w-12 rounded-md bg-blue-600 text-white">
                  ✓
                </div>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-800">
                  Scalable
                </h3>
                <p className="text-gray-600 mt-1">
                  Grows with your institution from small schools to large university
                  networks.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* CTA */}
        <div className="bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-lg p-8 text-center">
          <h2 className="text-2xl font-bold mb-4">Get Started Today</h2>
          <p className="mb-6">
            Join thousands of schools that have already transformed their operations with
            E-Campus.
          </p>
          <Link
            href="/public/admission/form"
            className="bg-white text-blue-600 px-8 py-3 rounded-lg font-semibold hover:bg-blue-50 transition inline-block"
          >
            Apply for Admission
          </Link>
        </div>
      </div>
    </div>
  );
}
