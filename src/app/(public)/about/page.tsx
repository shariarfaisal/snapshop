'use client';

const AboutPage = () => {
  const visionValues = [
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

  const achievements = [
    { number: '500+', label: 'Schools Using E-Campus' },
    { number: '100K+', label: 'Students Managed' },
    { number: '5K+', label: 'Teachers Empowered' },
    { number: '99.9%', label: 'System Uptime' },
  ];

  return (
    <div className="bg-white">
      {/* Hero */}
      <section className="bg-gradient-to-br from-blue-600 to-blue-700 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">About E-Campus</h1>
          <p className="text-xl opacity-90">
            Transforming education through innovative technology
          </p>
        </div>
      </section>

      {/* Mission & Vision */}
      <section className="py-16 px-4">
        <div className="max-w-7xl mx-auto grid md:grid-cols-2 gap-12">
          <div>
            <h2 className="text-3xl font-bold text-gray-800 mb-4">Our Mission</h2>
            <p className="text-gray-600 text-lg leading-relaxed">
              To revolutionize educational management by providing cutting-edge tools that enhance
              learning outcomes, streamline administrative processes, and foster meaningful
              connections between students, educators, and institutions.
            </p>
          </div>
          <div>
            <h2 className="text-3xl font-bold text-gray-800 mb-4">Our Vision</h2>
            <p className="text-gray-600 text-lg leading-relaxed">
              A world where every educational institution, regardless of size or location, has access
              to world-class management systems that empower them to focus on what matters most:
              educating and inspiring the next generation.
            </p>
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="bg-gray-50 py-16 px-4">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl font-bold text-gray-800 mb-12 text-center">Our Core Values</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {visionValues.map((value, idx) => (
              <div key={idx} className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition">
                <h3 className="text-xl font-semibold text-blue-600 mb-3">{value.title}</h3>
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
                <p className="text-4xl font-bold text-blue-600 mb-2">{achievement.number}</p>
                <p className="text-gray-600 font-medium">{achievement.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="bg-gradient-to-br from-blue-50 to-indigo-50 py-16 px-4">
        <div className="max-w-7xl mx-auto text-center">
          <h2 className="text-3xl font-bold text-gray-800 mb-6">Why Choose E-Campus?</h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-white rounded-lg p-6">
              <div className="text-3xl mb-3">🎯</div>
              <h3 className="text-lg font-semibold text-gray-800 mb-2">Easy to Use</h3>
              <p className="text-gray-600">
                Intuitive interface designed for educators and administrators
              </p>
            </div>
            <div className="bg-white rounded-lg p-6">
              <div className="text-3xl mb-3">🔒</div>
              <h3 className="text-lg font-semibold text-gray-800 mb-2">Secure</h3>
              <p className="text-gray-600">
                Enterprise-grade security to protect your educational data
              </p>
            </div>
            <div className="bg-white rounded-lg p-6">
              <div className="text-3xl mb-3">📈</div>
              <h3 className="text-lg font-semibold text-gray-800 mb-2">Scalable</h3>
              <p className="text-gray-600">
                Grows with your institution from small schools to large networks
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default AboutPage;
