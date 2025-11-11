"use client";

import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { ChevronDown, Loader2 } from "lucide-react";
import { contentService } from "@/services/content.service";

interface FAQItem {
  id: number;
  question: string;
  answer: string;
  category: string;
}

interface HelpResource {
  id: number;
  title: string;
  description: string;
  icon: string;
  link: string | null;
}

export default function HelpPage() {
  const [expandedFAQ, setExpandedFAQ] = useState<number | null>(null);

  // Fetch FAQs
  const { data: faqs = [], isLoading: faqsLoading } = useQuery({
    queryKey: ["public", "faqs"],
    queryFn: () => contentService.getFaqs(),
  });
  console.log(faqs);

  // Fetch Help Resources
  const { data: resources = [], isLoading: resourcesLoading } = useQuery({
    queryKey: ["public", "help-resources"],
    queryFn: contentService.getHelpResources,
  });

  const isLoading = faqsLoading || resourcesLoading;

  // Fallback FAQs
  const defaultFaqs: FAQItem[] = [
    {
      id: 1,
      question: "How do I apply for admission?",
      answer:
        'You can apply for admission through our online admission form. Click on the "Admission" link in the navigation menu and fill in the required information. Submit your application and documents online.',
      category: "general",
    },
    {
      id: 2,
      question: "What documents are required for admission?",
      answer:
        "Typically, you need to submit: Birth certificate, previous school transfer certificate, passport-sized photo, identity proof, and residence proof. Specific requirements may vary by institution.",
      category: "admission",
    },
    {
      id: 3,
      question: "How can I check my application status?",
      answer:
        "Log in to your parent/student account and navigate to the admission section. You can track your application status in real-time.",
      category: "admission",
    },
    {
      id: 4,
      question: "What are the available user roles?",
      answer:
        "E-Campus supports multiple user roles: Super Admin, Institute Admin, Accountant, Teacher, Student, and Parent/Guardian. Each role has specific access and permissions.",
      category: "general",
    },
    {
      id: 5,
      question: "How do I access my child's marks and attendance?",
      answer:
        'Parents can log in with their credentials and access the Parent Portal. Navigate to the "Monitor Children" section to view marks, attendance, and other academic details.',
      category: "parent",
    },
    {
      id: 6,
      question: "Is my data secure in E-Campus?",
      answer:
        "Yes, E-Campus uses enterprise-grade security measures including encryption, secure authentication, and regular security audits to protect all data.",
      category: "security",
    },
    {
      id: 7,
      question: "How do I pay fees online?",
      answer:
        "Log in to your account, navigate to the Fees section, and follow the payment gateway instructions. We support multiple payment methods.",
      category: "fees",
    },
  ];

  // Fallback resources
  const defaultResources: HelpResource[] = [
    {
      id: 1,
      title: "Documentation",
      description: "Comprehensive guides and documentation for all features",
      icon: "📚",
      link: null,
    },
    {
      id: 2,
      title: "Video Tutorials",
      description: "Step-by-step video guides for common tasks",
      icon: "🎥",
      link: null,
    },
    {
      id: 3,
      title: "Community Forum",
      description: "Connect with other E-Campus users and get help",
      icon: "💬",
      link: null,
    },
  ];

  const displayFaqs = faqs.length > 0 ? faqs : defaultFaqs;
  const displayResources = resources.length > 0 ? resources : defaultResources;

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-12 w-12 animate-spin text-blue-600" />
      </div>
    );
  }

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
          {displayFaqs.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-600">No FAQs available at the moment.</p>
            </div>
          ) : (
            <div className="space-y-4">
              {displayFaqs.map((faq, idx) => (
                <div
                  key={faq.id || idx}
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
                        expandedFAQ === idx ? "transform rotate-180" : ""
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
          )}
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
          {displayResources.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-600">No resources available at the moment.</p>
            </div>
          ) : (
            <div className="grid md:grid-cols-3 gap-8">
              {displayResources.map((resource) => (
                <div
                  key={resource.id}
                  className="bg-white border border-gray-200 rounded-lg p-6 hover:shadow-lg transition"
                >
                  <div className="text-4xl mb-4">{resource.icon}</div>
                  <h3 className="text-lg font-semibold text-gray-800 mb-2">{resource.title}</h3>
                  <p className="text-gray-600">{resource.description}</p>
                  {resource.link && (
                    <a
                      href={resource.link}
                      className="mt-4 inline-block text-blue-600 hover:text-blue-700 font-medium"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      Learn More →
                    </a>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
