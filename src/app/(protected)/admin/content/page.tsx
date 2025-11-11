'use client';

import Link from 'next/link';
import { 
  Settings, 
  Layout, 
  Info, 
  HelpCircle, 
  Navigation, 
  Search,
  FileText,
  Globe
} from 'lucide-react';

export default function ContentManagementPage() {
  const contentSections = [
    {
      title: 'Site Settings',
      description: 'Manage site name, logo, contact information, and branding',
      icon: Settings,
      href: '/admin/content/site',
      color: 'bg-blue-500',
    },
    {
      title: 'Landing Page',
      description: 'Customize hero section, stats, features, and CTAs',
      icon: Layout,
      href: '/admin/content/landing-page',
      color: 'bg-green-500',
    },
    {
      title: 'About Page',
      description: 'Edit mission, vision, values, and achievements',
      icon: Info,
      href: '/admin/content/about-page',
      color: 'bg-purple-500',
    },
    {
      title: 'FAQs',
      description: 'Manage frequently asked questions and categories',
      icon: HelpCircle,
      href: '/admin/content/faqs',
      color: 'bg-orange-500',
    },
    {
      title: 'Help Resources',
      description: 'Manage help resources and support links',
      icon: FileText,
      href: '/admin/content/help-resources',
      color: 'bg-pink-500',
    },
    {
      title: 'Navigation & Footer',
      description: 'Configure navigation menu and footer links',
      icon: Navigation,
      href: '/admin/content/navigation',
      color: 'bg-indigo-500',
    },
    {
      title: 'SEO Settings',
      description: 'Manage meta tags, titles, and SEO optimization',
      icon: Search,
      href: '/admin/content/seo',
      color: 'bg-teal-500',
    },
  ];

  return (
    <div className="p-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Public Content Management
        </h1>
        <p className="text-gray-600">
          Manage all public-facing content from this centralized dashboard
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {contentSections.map((section) => {
          const Icon = section.icon;
          return (
            <Link
              key={section.href}
              href={section.href}
              className="block bg-white rounded-lg shadow-md hover:shadow-lg transition-all duration-200 overflow-hidden border border-gray-200 hover:border-blue-300"
            >
              <div className="p-6">
                <div className={`${section.color} w-12 h-12 rounded-lg flex items-center justify-center mb-4`}>
                  <Icon className="text-white" size={24} />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  {section.title}
                </h3>
                <p className="text-gray-600 text-sm">
                  {section.description}
                </p>
              </div>
              <div className="bg-gray-50 px-6 py-3 border-t border-gray-100">
                <span className="text-blue-600 text-sm font-medium hover:text-blue-700">
                  Manage →
                </span>
              </div>
            </Link>
          );
        })}
      </div>

      <div className="mt-8 bg-blue-50 border border-blue-200 rounded-lg p-6">
        <div className="flex items-start gap-3">
          <Globe className="text-blue-600 flex-shrink-0 mt-1" size={24} />
          <div>
            <h3 className="font-semibold text-gray-900 mb-2">
              💡 Content Management Tips
            </h3>
            <ul className="text-sm text-gray-700 space-y-1">
              <li>• All changes are reflected immediately on public pages</li>
              <li>• Use the preview feature before saving major changes</li>
              <li>• Keep content concise and user-friendly</li>
              <li>• Regularly update FAQs based on user feedback</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
