'use client';

import { useState } from 'react';
import { ChevronDown } from 'lucide-react';

interface FAQItem {
  question: string;
  answer: string;
}

export default function HelpPage() {
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
  ];

  return (
    <div className="bg-white">
      {/* Hero */}
      <section className="bg-gradient-to-br from-blue-600 to-blue-700 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Help & Support</h1>
          <p className="text-xl opacity-90">Frequently Asked Questions</p>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-16 px-4">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold text-gray-800 mb-12 text-center">Common Questions</h2>
          <div className="space-y-4">
            {faqs.map((faq, idx) => (
              <div
                key={idx}
                className="border border-gray-200 rounded-lg overflow-hidden hover:shadow-md transition"
              >
                <button
                  onClick={() => setExpandedFAQ(expandedFAQ === idx ? null : idx)}
                  className="w-full px-6 py-4 bg-gray-50 hover:bg-gray-100 flex items-center justify-between transition text-left"
                >
                  <h3 className="font-semibold text-gray-800">{faq.question}</h3>
                  <ChevronDown
                    size={20}
                    className={`text-blue-600 transition-transform ${
                      expandedFAQ === idx ? 'transform rotate-180' : ''
                    }`}
                  />
                </button>
                {expandedFAQ === idx && (
                  <div className="px-6 py-4 bg-white border-t border-gray-200">
                    <p className="text-gray-600 leading-relaxed">{faq.answer}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Support */}
      <section className="bg-blue-50 py-16 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl font-bold text-gray-800 mb-4">Still Have Questions?</h2>
          <p className="text-gray-600 mb-6 text-lg">
            Our support team is here to help. Get in touch with us.
          </p>
          <a
            href="/contact"
            className="bg-blue-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-blue-700 transition inline-block"
          >
            Contact Support
          </a>
        </div>
      </section>

      {/* Resources */}
      <section className="py-16 px-4">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl font-bold text-gray-800 mb-12 text-center">Resources</h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-white border border-gray-200 rounded-lg p-6 hover:shadow-lg transition">
              <div className="text-4xl mb-4">📚</div>
              <h3 className="text-lg font-semibold text-gray-800 mb-2">Documentation</h3>
              <p className="text-gray-600">Comprehensive guides and documentation for all features</p>
            </div>
            <div className="bg-white border border-gray-200 rounded-lg p-6 hover:shadow-lg transition">
              <div className="text-4xl mb-4">🎥</div>
              <h3 className="text-lg font-semibold text-gray-800 mb-2">Video Tutorials</h3>
              <p className="text-gray-600">Step-by-step video guides for common tasks</p>
            </div>
            <div className="bg-white border border-gray-200 rounded-lg p-6 hover:shadow-lg transition">
              <div className="text-4xl mb-4">💬</div>
              <h3 className="text-lg font-semibold text-gray-800 mb-2">Community Forum</h3>
              <p className="text-gray-600">Connect with other E-Campus users and get help</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
