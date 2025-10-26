'use client';

import Link from 'next/link';
import { BookOpen, LogIn, Menu, X, ChevronDown } from 'lucide-react';
import { useState } from 'react';

interface FAQItem {
  question: string;
  answer: string;
}

export default function HelpPage() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [expandedFAQ, setExpandedFAQ] = useState<number | null>(null);

  const faqs: FAQItem[] = [
    {
      question: 'How do I apply for admission?',
      answer:
        'You can apply for admission through our online admission form. Click on the "Admission" link in the navigation menu and fill in the required information. Submit your application and documents online.',
    },
    {
      question: 'What documents are required for admission?',
      answer:
        'Typically, you need to submit: Birth certificate, previous school transfer certificate, passport-sized photo, identity proof, and residence proof. Specific requirements may vary by institution.',
    },
    {
      question: 'How can I check my application status?',
      answer:
        'Log in to your parent/student account and navigate to the admission section. You can track your application status in real-time.',
    },
    {
      question: 'What are the available user roles?',
      answer:
        'E-Campus supports multiple user roles: Super Admin, Institute Admin, Accountant, Teacher, Student, and Parent/Guardian. Each role has specific access and permissions.',
    },
    {
      question: 'How do I access my child\'s marks and attendance?',
      answer:
        'Parents can log in with their credentials and access the Parent Portal. Navigate to the "Monitor Children" section to view marks, attendance, and other academic details.',
    },
    {
      question: 'Is my data secure in E-Campus?',
      answer:
        'Yes, E-Campus uses enterprise-grade security measures including encryption, secure authentication, and regular security audits to protect all data.',
    },
    {
      question: 'How do I pay fees online?',
      answer:
        'Log in to your account, navigate to the Fees section, and follow the payment gateway instructions. We support multiple payment methods.',
    },
    {
      question: 'Can teachers communicate with parents?',
      answer:
        'Yes, the system has a built-in messaging feature that allows teachers and parents to communicate directly for academic discussions.',
    },
    {
      question: 'How can I generate reports?',
      answer:
        'Admins and teachers can generate various reports like attendance, marks, fee, and admission reports from the Reports section in their dashboards.',
    },
    {
      question: 'Is there a mobile app?',
      answer:
        'E-Campus is fully responsive and works on all devices including mobile phones, tablets, and desktops through your web browser.',
    },
  ];

  const toggleFAQ = (index: number) => {
    setExpandedFAQ(expandedFAQ === index ? null : index);
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
      <div className="max-w-4xl mx-auto px-4 py-16">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-800 mb-4">
            Help & Support
          </h1>
          <p className="text-xl text-gray-600">
            Find answers to common questions and get support
          </p>
        </div>

        {/* Help Categories */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
          <Link href="#admission" className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg p-6 hover:shadow-lg transition">
            <h3 className="text-lg font-semibold text-gray-800 mb-2">
              Admission Help
            </h3>
            <p className="text-gray-600">
              Get guidance on the admission process and required documents.
            </p>
          </Link>

          <Link href="#academics" className="bg-gradient-to-br from-green-50 to-green-100 rounded-lg p-6 hover:shadow-lg transition">
            <h3 className="text-lg font-semibold text-gray-800 mb-2">
              Academic Features
            </h3>
            <p className="text-gray-600">
              Learn how to use academic features like marks and attendance.
            </p>
          </Link>

          <Link href="#parents" className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-lg p-6 hover:shadow-lg transition">
            <h3 className="text-lg font-semibold text-gray-800 mb-2">
              Parent Portal
            </h3>
            <p className="text-gray-600">
              Guide for parents to monitor their children's progress.
            </p>
          </Link>

          <Link href="#technical" className="bg-gradient-to-br from-orange-50 to-orange-100 rounded-lg p-6 hover:shadow-lg transition">
            <h3 className="text-lg font-semibold text-gray-800 mb-2">
              Technical Support
            </h3>
            <p className="text-gray-600">
              Troubleshoot technical issues and get system requirements.
            </p>
          </Link>
        </div>

        {/* FAQs */}
        <div className="bg-white rounded-lg shadow-md p-8">
          <h2 className="text-2xl font-bold text-gray-800 mb-6">
            Frequently Asked Questions
          </h2>
          <div className="space-y-4">
            {faqs.map((faq, index) => (
              <div key={index} className="border border-gray-200 rounded-lg">
                <button
                  onClick={() => toggleFAQ(index)}
                  className="w-full px-6 py-4 flex items-center justify-between hover:bg-gray-50 transition"
                >
                  <span className="text-lg font-semibold text-gray-800 text-left">
                    {faq.question}
                  </span>
                  <ChevronDown
                    size={20}
                    className={`text-gray-600 transition-transform ${
                      expandedFAQ === index ? 'transform rotate-180' : ''
                    }`}
                  />
                </button>
                {expandedFAQ === index && (
                  <div className="px-6 py-4 bg-gray-50 border-t border-gray-200">
                    <p className="text-gray-700">{faq.answer}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Support Channels */}
        <div className="mt-12 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-lg p-8">
          <h2 className="text-2xl font-bold mb-6">Need More Help?</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <h3 className="text-lg font-semibold mb-2">Email Support</h3>
              <p className="opacity-90">support@ecampus.com</p>
              <p className="text-sm opacity-75">Response within 24 hours</p>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-2">Phone Support</h3>
              <p className="opacity-90">+91 9876543210</p>
              <p className="text-sm opacity-75">Monday - Friday, 9AM - 6PM IST</p>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-2">Chat Support</h3>
              <p className="opacity-90">Live chat available</p>
              <p className="text-sm opacity-75">Available during business hours</p>
            </div>
          </div>
        </div>

        {/* Knowledge Base */}
        <div className="mt-12 bg-gray-50 rounded-lg p-8">
          <h2 className="text-2xl font-bold text-gray-800 mb-6">Knowledge Base</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {[
              {
                title: 'Getting Started Guide',
                description: 'Learn the basics of using E-Campus',
              },
              {
                title: 'User Manual',
                description: 'Comprehensive guide for all features',
              },
              {
                title: 'Video Tutorials',
                description: 'Step-by-step video guides',
              },
              {
                title: 'API Documentation',
                description: 'For developers integrating with E-Campus',
              },
            ].map((item, idx) => (
              <Link
                key={idx}
                href="#"
                className="bg-white rounded-lg p-6 hover:shadow-md transition"
              >
                <h3 className="text-lg font-semibold text-gray-800 mb-2">
                  {item.title}
                </h3>
                <p className="text-gray-600">{item.description}</p>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
