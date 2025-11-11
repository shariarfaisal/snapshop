'use client';

import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Mail, Phone, MapPin, Send, Loader2 } from 'lucide-react';
import { contentService } from '@/services/content.service';

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: '',
  });

  // Fetch site settings for contact information
  const { data: siteSettings, isLoading } = useQuery({
    queryKey: ['public', 'site-settings'],
    queryFn: contentService.getSiteSettings,
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    alert('Thank you for contacting us. We will get back to you soon!');
    setFormData({ name: '', email: '', phone: '', subject: '', message: '' });
  };

  // Extract data with fallbacks
  const contactEmail = siteSettings?.contactEmail || 'support@ecampus.com';
  const contactPhone = siteSettings?.contactPhone || '+91 9876543210';
  const physicalAddress = siteSettings?.physicalAddress || '123 Education Street, Learning City, LC 12345';
  const officeHours = siteSettings?.officeHours || {
    weekdays: 'Monday - Friday: 9:00 AM - 6:00 PM',
    saturday: 'Saturday: 10:00 AM - 2:00 PM',
    sunday: 'Sunday: Closed',
  };
  const googleMapsUrl = siteSettings?.googleMapsUrl;
  const primaryColor = siteSettings?.primaryColor || '#2563eb';
  const secondaryColor = siteSettings?.secondaryColor || '#1e40af';

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-12 w-12 animate-spin" style={{ color: primaryColor }} />
      </div>
    );
  }

  return (
    <div className="bg-white">
      {/* Hero */}
      <section
        className="text-white py-16"
        style={{ background: `linear-gradient(to bottom right, ${primaryColor}, ${secondaryColor})` }}
      >
        <div className="max-w-7xl mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Contact Us</h1>
          <p className="text-xl opacity-90">We'd love to hear from you</p>
        </div>
      </section>

      {/* Contact Content */}
      <section className="py-16 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-2 gap-12">
            {/* Contact Info */}
            <div>
              <h2 className="text-3xl font-bold text-gray-800 mb-8">Get In Touch</h2>
              <div className="space-y-6">
                <div className="flex items-start gap-4">
                  <Mail className="flex-shrink-0 mt-1" size={24} style={{ color: primaryColor }} />
                  <div>
                    <h3 className="font-semibold text-gray-800">Email</h3>
                    <p className="text-gray-600">{contactEmail}</p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <Phone className="flex-shrink-0 mt-1" size={24} style={{ color: primaryColor }} />
                  <div>
                    <h3 className="font-semibold text-gray-800">Phone</h3>
                    <p className="text-gray-600">{contactPhone}</p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <MapPin className="flex-shrink-0 mt-1" size={24} style={{ color: primaryColor }} />
                  <div>
                    <h3 className="font-semibold text-gray-800">Address</h3>
                    <p className="text-gray-600">{physicalAddress}</p>
                  </div>
                </div>
              </div>

              <div className="mt-8 p-6 rounded-lg" style={{ backgroundColor: `${primaryColor}10` }}>
                <h3 className="font-semibold text-gray-800 mb-3">Office Hours</h3>
                {Object.entries(officeHours).map(([key, value]) => (
                  <p key={key} className="text-gray-600">{value}</p>
                ))}
              </div>
            </div>

            {/* Contact Form */}
            <div>
              <h2 className="text-3xl font-bold text-gray-800 mb-8">Send us a Message</h2>
              <form onSubmit={handleSubmit} className="space-y-4">
                <style jsx>{`
                  input:focus, textarea:focus {
                    outline: none;
                    ring: 2px solid ${primaryColor};
                    border-color: transparent;
                  }
                `}</style>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  placeholder="Your Name"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:border-transparent"
                  style={{ '--tw-ring-color': primaryColor } as React.CSSProperties}
                  required
                />
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  placeholder="Your Email"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:border-transparent"
                  style={{ '--tw-ring-color': primaryColor } as React.CSSProperties}
                  required
                />
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleInputChange}
                  placeholder="Phone Number"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:border-transparent"
                  style={{ '--tw-ring-color': primaryColor } as React.CSSProperties}
                />
                <input
                  type="text"
                  name="subject"
                  value={formData.subject}
                  onChange={handleInputChange}
                  placeholder="Subject"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:border-transparent"
                  style={{ '--tw-ring-color': primaryColor } as React.CSSProperties}
                  required
                />
                <textarea
                  name="message"
                  value={formData.message}
                  onChange={handleInputChange}
                  placeholder="Your Message"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:border-transparent"
                  style={{ '--tw-ring-color': primaryColor } as React.CSSProperties}
                  rows={5}
                  required
                />
                <button
                  type="submit"
                  className="w-full text-white px-6 py-3 rounded-lg font-semibold transition flex items-center justify-center gap-2"
                  style={{ backgroundColor: primaryColor }}
                  onMouseEnter={(e) => e.currentTarget.style.backgroundColor = secondaryColor}
                  onMouseLeave={(e) => e.currentTarget.style.backgroundColor = primaryColor}
                >
                  <Send size={20} />
                  Send Message
                </button>
              </form>
            </div>
          </div>
        </div>
      </section>

      {/* Map Section */}
      <section className="bg-gray-100 py-16 px-4">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl font-bold text-gray-800 mb-8 text-center">Reach Us</h2>
          {googleMapsUrl ? (
            <div className="h-96 rounded-lg overflow-hidden">
              <iframe
                src={googleMapsUrl}
                width="100%"
                height="100%"
                style={{ border: 0 }}
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                title="Location Map"
              />
            </div>
          ) : (
            <div className="h-96 bg-gray-300 rounded-lg flex items-center justify-center">
              <p className="text-gray-600">Map location not configured</p>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
