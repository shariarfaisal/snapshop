'use client';

import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import Link from 'next/link';
import { Menu, X, LogIn, BookOpen } from 'lucide-react';
import { contentService } from '@/services/content.service';

export default function PublicLayout({ children }: { children: React.ReactNode }) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Fetch site settings
  const { data: siteSettings } = useQuery({
    queryKey: ['public', 'site-settings'],
    queryFn: contentService.getSiteSettings,
  });

  // Fetch navigation settings
  const { data: navSettings } = useQuery({
    queryKey: ['public', 'navigation-settings'],
    queryFn: contentService.getNavigationSettings,
  });

  // Extract data with fallbacks
  const siteName = siteSettings?.siteName || 'E-Campus';
  const siteTagline = siteSettings?.siteTagline || 'Comprehensive Education Management System for modern institutions';
  const copyrightText = siteSettings?.copyrightText || '© 2024 E-Campus. All rights reserved.';
  const contactEmail = siteSettings?.contactEmail || 'support@ecampus.com';
  const contactPhone = siteSettings?.contactPhone || '+91 9876543210';

  const navLinks = navSettings?.mainNavLinks || [
    { href: '/', label: 'Home' },
    { href: '/about', label: 'About' },
    { href: '/notices', label: 'Notices' },
    { href: '/admission/form', label: 'Admission' },
    { href: '/contact', label: 'Contact' },
    { href: '/help', label: 'Help' },
  ];

  const footerQuickLinks = navSettings?.footerQuickLinks || [
    { href: '/about', label: 'About Us' },
    { href: '/notices', label: 'Notices' },
    { href: '/contact', label: 'Contact' },
    { href: '/help', label: 'Help & Support' },
  ];

  // Build footer support links dynamically from site settings
  const footerSupportLinks = [
    { label: `Email: ${contactEmail}` },
    { label: `Phone: ${contactPhone}` },
    { href: '/contact', label: 'Contact Us' },
  ];

  const footerLegalLinks = navSettings?.footerLegalLinks || [
    { href: '#', label: 'Privacy Policy' },
    { href: '#', label: 'Terms of Service' },
  ];

  return (
    <div className="flex flex-col min-h-screen bg-white">
      {/* Navigation */}
      <nav className="bg-gradient-to-r from-blue-600 to-blue-700 text-white sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            <Link href="/" className="flex items-center gap-2 hover:opacity-90 transition">
              <BookOpen size={32} />
              <h1 className="text-2xl font-bold">{siteName}</h1>
            </Link>

            {/* Desktop Menu */}
            <div className="hidden md:flex items-center gap-6">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="hover:opacity-80 transition"
                >
                  {link.label}
                </Link>
              ))}
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
              className="md:hidden text-white hover:opacity-80 transition"
            >
              {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>

          {/* Mobile Menu */}
          {mobileMenuOpen && (
            <div className="md:hidden pb-4 space-y-2">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="block px-4 py-2 hover:bg-blue-500 rounded transition"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  {link.label}
                </Link>
              ))}
              <Link
                href="/login"
                className="block px-4 py-2 bg-white text-blue-600 rounded font-semibold"
                onClick={() => setMobileMenuOpen(false)}
              >
                Login
              </Link>
            </div>
          )}
        </div>
      </nav>

      {/* Main Content */}
      <main className="flex-1">
        {children}
      </main>

      {/* Footer */}
      <footer className="bg-gray-800 text-white py-12">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
            {/* Brand */}
            <div>
              <h4 className="text-lg font-semibold mb-4 flex items-center gap-2">
                <BookOpen size={24} />
                {siteName}
              </h4>
              <p className="text-gray-400">
                {siteTagline}
              </p>
            </div>

            {/* Quick Links */}
            <div>
              <h4 className="text-lg font-semibold mb-4">Quick Links</h4>
              <ul className="space-y-2 text-gray-400">
                {footerQuickLinks.map((link) => (
                  <li key={link.href}>
                    <Link href={link.href} className="hover:text-white transition">
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Support */}
            <div>
              <h4 className="text-lg font-semibold mb-4">Support</h4>
              <ul className="space-y-2 text-gray-400">
                {footerSupportLinks.map((item, idx) => (
                  <li key={idx}>
                    {item.href ? (
                      <Link href={item.href} className="hover:text-white transition">
                        {item.label}
                      </Link>
                    ) : (
                      <span>{item.label}</span>
                    )}
                  </li>
                ))}
              </ul>
            </div>

            {/* Legal */}
            <div>
              <h4 className="text-lg font-semibold mb-4">Legal</h4>
              <ul className="space-y-2 text-gray-400">
                {footerLegalLinks.map((link) => (
                  <li key={link.href}>
                    <a href={link.href} className="hover:text-white transition">
                      {link.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Bottom Bar */}
          <div className="border-t border-gray-700 pt-8 text-center text-gray-400">
            <p>{copyrightText}</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
