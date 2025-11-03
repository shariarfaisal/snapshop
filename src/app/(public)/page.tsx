"use client";

import { useState } from "react";
import Link from "next/link";
import {
  Menu,
  X,
  LogIn,
  BookOpen,
  Users,
  Award,
  MessageSquare,
  FileText,
  ChevronRight,
} from "lucide-react";

export default function LandingPage() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const features = [
    {
      icon: BookOpen,
      title: "Academic Management",
      description: "Complete management of classes, subjects, timetables, and academic planning.",
    },
    {
      icon: Users,
      title: "User Management",
      description: "Comprehensive user management with role-based access for all stakeholders.",
    },
    {
      icon: Award,
      title: "Attendance & Marks",
      description: "Track student attendance and manage marks with comprehensive reporting.",
    },
    {
      icon: MessageSquare,
      title: "Communication",
      description: "Direct communication channel between teachers, students, and parents.",
    },
    {
      icon: FileText,
      title: "Reports & Analytics",
      description: "Generate detailed reports and analytics for better decision making.",
    },
    {
      icon: Menu,
      title: "Fee Management",
      description: "Complete fee management with online payment gateway integration.",
    },
  ];

  const stats = [
    { label: "Active Users", value: "2,500+" },
    { label: "Institutions", value: "50+" },
    { label: "Students", value: "50,000+" },
    { label: "Teachers", value: "2,500+" },
  ];

  return (
    <div className="bg-white">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-blue-600 to-blue-700 text-white py-20">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <h1 className="text-5xl md:text-6xl font-bold mb-6 leading-tight">
                Transform Your Institution With E-Campus
              </h1>
              <p className="text-xl opacity-90 mb-8 leading-relaxed">
                The complete education management system for modern schools and colleges. Manage
                admissions, academics, attendance, and communications from one powerful platform.
              </p>
              <div className="flex gap-4">
                <Link
                  href="/admission/form"
                  className="bg-white text-blue-600 px-8 py-3 rounded-lg font-semibold hover:bg-blue-50 transition flex items-center gap-2"
                >
                  Apply Now
                  <ChevronRight size={20} />
                </Link>
                <Link
                  href="/about"
                  className="border-2 border-white text-white px-8 py-3 rounded-lg font-semibold hover:bg-blue-600 transition"
                >
                  Learn More
                </Link>
              </div>
            </div>
            <div className="bg-white bg-opacity-10 rounded-lg p-8 text-center">
              <div className="text-6xl mb-4">🎓</div>
              <p className="text-lg">Transforming Education Through Technology</p>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, idx) => (
              <div key={idx} className="text-center">
                <p className="text-4xl font-bold text-blue-600">{stat.value}</p>
                <p className="text-gray-600 mt-2">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4">
          <h2 className="text-4xl font-bold text-center text-gray-800 mb-16">Key Features</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, idx) => {
              const Icon = feature.icon;
              return (
                <div
                  key={idx}
                  className="bg-white rounded-lg shadow-md p-8 hover:shadow-lg transition"
                >
                  <Icon size={40} className="text-blue-600 mb-4" />
                  <h3 className="text-xl font-semibold text-gray-800 mb-3">{feature.title}</h3>
                  <p className="text-gray-600">{feature.description}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-gradient-to-r from-blue-600 to-blue-700 text-white py-16">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">Ready to Transform Your School?</h2>
          <p className="text-xl opacity-90 mb-8">
            Join hundreds of schools that have already moved to digital management with E-Campus.
          </p>
          <Link
            href="/admission/form"
            className="bg-white text-blue-600 px-8 py-3 rounded-lg font-semibold hover:bg-blue-50 transition inline-flex items-center gap-2"
          >
            Start Your Journey
            <ChevronRight size={20} />
          </Link>
        </div>
      </section>
    </div>
  );
}
