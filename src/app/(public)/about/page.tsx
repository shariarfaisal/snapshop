'use client';

import { useQuery } from '@tanstack/react-query';
import { Loader2 } from 'lucide-react';
import { contentService } from '@/services/content.service';

const AboutPage = () => {
  // Fetch site settings for colors
  const { data: siteSettings } = useQuery({
    queryKey: ['public', 'site-settings'],
    queryFn: contentService.getSiteSettings,
  });

  // Fetch about page content
  const { data: content, isLoading } = useQuery({
    queryKey: ['public', 'about-page-content'],
    queryFn: contentService.getAboutPageContent,
  });

  // Extract colors
  const primaryColor = siteSettings?.primaryColor || '#2563eb';
  const secondaryColor = siteSettings?.secondaryColor || '#1e40af';

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-12 w-12 animate-spin" style={{ color: primaryColor }} />
      </div>
    );
  }

  // Fallback data in case API fails
  const heroTitle = content?.heroTitle || 'About E-Campus';
  const heroDescription = content?.heroDescription || 'Transforming education through innovative technology';
  const missionStatement = content?.missionStatement || 'To revolutionize educational management by providing cutting-edge tools that enhance learning outcomes, streamline administrative processes, and foster meaningful connections between students, educators, and institutions.';
  const visionStatement = content?.visionStatement || 'A world where every educational institution, regardless of size or location, has access to world-class management systems that empower them to focus on what matters most: educating and inspiring the next generation.';
  const coreValues = content?.coreValues || [
    {
      title: 'Innovation',
      description: 'Leveraging technology to create better educational experiences.',
    },
    {
      title: 'Accessibility',
      description: 'Making quality education management available to all institutions.',
    },
    {
      title: 'Reliability',
      description: 'Ensuring stable and secure platform for educational data.',
    },
    {
      title: 'Collaboration',
      description: 'Fostering better communication between all stakeholders.',
    },
  ];
  const achievements = content?.achievements || [
    { number: '500+', label: 'Schools Using E-Campus' },
    { number: '100K+', label: 'Students Managed' },
    { number: '5K+', label: 'Teachers Empowered' },
    { number: '99.9%', label: 'System Uptime' },
  ];
  const whyChooseItems = content?.whyChooseItems || [
    {
      icon: '🎯',
      title: 'Easy to Use',
      description: 'Intuitive interface designed for educators and administrators',
    },
    {
      icon: '🔒',
      title: 'Secure',
      description: 'Enterprise-grade security to protect your educational data',
    },
    {
      icon: '📈',
      title: 'Scalable',
      description: 'Grows with your institution from small schools to large networks',
    },
  ];

  return (
    <div className="bg-white">
      {/* Hero */}
      <section
        className="text-white py-16"
        style={{ background: `linear-gradient(to bottom right, ${primaryColor}, ${secondaryColor})` }}
      >
        <div className="max-w-7xl mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">{heroTitle}</h1>
          <p className="text-xl opacity-90">
            {heroDescription}
          </p>
        </div>
      </section>

      {/* Mission & Vision */}
      <section className="py-16 px-4">
        <div className="max-w-7xl mx-auto grid md:grid-cols-2 gap-12">
          <div>
            <h2 className="text-3xl font-bold text-gray-800 mb-4">Our Mission</h2>
            <p className="text-gray-600 text-lg leading-relaxed">
              {missionStatement}
            </p>
          </div>
          <div>
            <h2 className="text-3xl font-bold text-gray-800 mb-4">Our Vision</h2>
            <p className="text-gray-600 text-lg leading-relaxed">
              {visionStatement}
            </p>
          </div>
        </div>
      </section>

      {/* Core Values */}
      <section className="bg-gray-50 py-16 px-4">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl font-bold text-gray-800 mb-12 text-center">Our Core Values</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {coreValues.map((value, idx) => (
              <div key={idx} className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition">
                <h3 className="text-xl font-semibold mb-3" style={{ color: primaryColor }}>{value.title}</h3>
                <p className="text-gray-600">{value.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Achievements */}
      <section className="py-16 px-4">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl font-bold text-gray-800 mb-12 text-center">Our Achievements</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {achievements.map((achievement, idx) => (
              <div key={idx} className="text-center">
                <p className="text-4xl font-bold mb-2" style={{ color: primaryColor }}>{achievement.number}</p>
                <p className="text-gray-600 font-medium">{achievement.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="py-16 px-4" style={{ background: `linear-gradient(to bottom right, ${primaryColor}08, ${secondaryColor}08)` }}>
        <div className="max-w-7xl mx-auto text-center">
          <h2 className="text-3xl font-bold text-gray-800 mb-6">Why Choose {heroTitle.replace('About ', '')}?</h2>
          <div className="grid md:grid-cols-3 gap-8">
            {whyChooseItems.map((item, idx) => (
              <div key={idx} className="bg-white rounded-lg p-6">
                <div className="text-3xl mb-3">{item.icon}</div>
                <h3 className="text-lg font-semibold text-gray-800 mb-2">{item.title}</h3>
                <p className="text-gray-600">{item.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default AboutPage;
