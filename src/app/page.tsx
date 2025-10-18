"use client";
import { useRouter } from "next/navigation";
// import PublicNavbar from "./PublicNavbar";
// import NoticeBar from "./NoticeBar";

const Home = () => {
    const router = useRouter();

    const handleApplyClick = () => {
        router.push("/registration");
    };

    return (
        <div className="bg-black">
            {/* Notice Bar */}
            {/* <NoticeBar /> */}

            {/* Hero Section */}
            <div className="min-h-screen relative overflow-hidden">
                {/* Gradient Background Effect */}
                <div className="absolute inset-0">
                    <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-bl from-purple-500 via-pink-500 to-orange-500 rounded-full opacity-20 blur-3xl"></div>
                    <div className="absolute bottom-0 left-0 w-96 h-96 bg-gradient-to-tr from-blue-500 via-cyan-500 to-teal-500 rounded-full opacity-20 blur-3xl"></div>
                    <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[600px] h-[400px] bg-gradient-to-r from-purple-600 via-pink-600 to-orange-600 rounded-full opacity-10 blur-3xl"></div>
                </div>

                {/* Navigation */}
                {/* <PublicNavbar variant="transparent" showApplyButton={true} /> */}

                {/* Hero Content */}
                <div className="relative z-10 flex items-center justify-center min-h-screen px-6 pt-24 md:pt-32">
                    <div className="max-w-6xl mx-auto">
                        <div className="grid lg:grid-cols-2 gap-12 items-center">
                            {/* Left Content */}
                            <div>
                                <h1 className="text-5xl md:text-7xl font-bold text-white mb-8 leading-tight">
                                    Hello students, we are
                                    <br />
                                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 via-pink-400 to-orange-400">
                                        Education Hub.
                                    </span>
                                </h1>

                                <div className="w-16 h-px bg-gradient-to-r from-purple-500 to-pink-500 mb-8"></div>

                                <p className="text-xl text-gray-300 leading-relaxed mb-10">
                                    We create powerful learning experiences that will help your education journey stand out. Transform your academic potential with our comprehensive management system.
                                </p>

                                {/* CTA Buttons */}
                                <div className="flex flex-col sm:flex-row gap-4 mb-12">
                                    <button
                                        onClick={handleApplyClick}
                                        className="bg-gradient-to-r from-purple-500 to-pink-500 text-white px-8 py-4 rounded-full font-semibold hover:from-purple-600 hover:to-pink-600 transition-all duration-300 transform hover:scale-105 text-lg"
                                    >
                                        Apply Now
                                    </button>
                                    <button className="border-2 border-purple-500 text-purple-400 px-8 py-4 rounded-full font-semibold hover:bg-purple-500 hover:text-white transition-all duration-300 text-lg">
                                        Watch Demo
                                    </button>
                                </div>


                            </div>

                            {/* Right Content - Feature Highlights */}
                            <div className="space-y-6">
                                <div className="bg-gray-900/40 backdrop-blur-sm p-6 rounded-2xl border border-gray-700/50 hover:border-purple-500/30 transition-all duration-300">
                                    <div className="flex items-start space-x-4">
                                        <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl flex items-center justify-center flex-shrink-0">
                                            <span className="text-white text-xl">🎓</span>
                                        </div>
                                        <div>
                                            <h3 className="text-lg font-semibold text-white mb-2">Smart Learning</h3>
                                            <p className="text-gray-300 text-sm">AI-powered personalized learning paths tailored to each student's needs and pace.</p>
                                        </div>
                                    </div>
                                </div>

                                <div className="bg-gray-900/40 backdrop-blur-sm p-6 rounded-2xl border border-gray-700/50 hover:border-purple-500/30 transition-all duration-300">
                                    <div className="flex items-start space-x-4">
                                        <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-xl flex items-center justify-center flex-shrink-0">
                                            <span className="text-white text-xl">📊</span>
                                        </div>
                                        <div>
                                            <h3 className="text-lg font-semibold text-white mb-2">Real-time Analytics</h3>
                                            <p className="text-gray-300 text-sm">Track progress, identify gaps, and optimize learning outcomes with detailed insights.</p>
                                        </div>
                                    </div>
                                </div>

                                <div className="bg-gray-900/40 backdrop-blur-sm p-6 rounded-2xl border border-gray-700/50 hover:border-purple-500/30 transition-all duration-300">
                                    <div className="flex items-start space-x-4">
                                        <div className="w-12 h-12 bg-gradient-to-r from-orange-500 to-pink-500 rounded-xl flex items-center justify-center flex-shrink-0">
                                            <span className="text-white text-xl">🌐</span>
                                        </div>
                                        <div>
                                            <h3 className="text-lg font-semibold text-white mb-2">Global Access</h3>
                                            <p className="text-gray-300 text-sm">Learn from anywhere, anytime with our cloud-based platform and mobile apps.</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* About Section */}
            <section id="about" className="py-20 px-6 bg-gray-900 relative">
                <div className="max-w-6xl mx-auto">
                    <div className="text-center mb-16">
                        <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
                            About <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-400">EduManage</span>
                        </h2>
                        <div className="w-24 h-px bg-gradient-to-r from-purple-500 to-pink-500 mx-auto mb-8"></div>
                        <p className="text-xl text-gray-300 max-w-3xl mx-auto leading-relaxed">
                            We are dedicated to transforming education through innovative technology solutions.
                            Our comprehensive platform empowers institutions to manage their educational processes
                            efficiently and effectively.
                        </p>
                    </div>

                    <div className="grid md:grid-cols-2 gap-12 items-center">
                        <div>
                            <h3 className="text-2xl font-bold text-white mb-6">Our Mission</h3>
                            <p className="text-gray-300 mb-6 leading-relaxed">
                                To revolutionize educational management by providing cutting-edge tools that
                                enhance learning outcomes, streamline administrative processes, and foster
                                meaningful connections between students, educators, and institutions.
                            </p>
                            <div className="space-y-4">
                                <div className="flex items-center space-x-3">
                                    <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                                    <span className="text-gray-300">Student-centered approach</span>
                                </div>
                                <div className="flex items-center space-x-3">
                                    <div className="w-2 h-2 bg-pink-500 rounded-full"></div>
                                    <span className="text-gray-300">Data-driven insights</span>
                                </div>
                                <div className="flex items-center space-x-3">
                                    <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
                                    <span className="text-gray-300">Seamless integration</span>
                                </div>
                            </div>
                        </div>
                        <div className="bg-gradient-to-br from-purple-900/30 to-pink-900/30 p-8 rounded-2xl border border-purple-500/20">
                            <div className="grid grid-cols-2 gap-6">
                                <div className="text-center">
                                    <div className="text-3xl font-bold text-white mb-2">50K+</div>
                                    <div className="text-gray-400">Students</div>
                                </div>
                                <div className="text-center">
                                    <div className="text-3xl font-bold text-white mb-2">1,200+</div>
                                    <div className="text-gray-400">Educators</div>
                                </div>
                                <div className="text-center">
                                    <div className="text-3xl font-bold text-white mb-2">300+</div>
                                    <div className="text-gray-400">Institutions</div>
                                </div>
                                <div className="text-center">
                                    <div className="text-3xl font-bold text-white mb-2">99%</div>
                                    <div className="text-gray-400">Satisfaction</div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Services Section */}
            <section id="services" className="py-20 px-6 bg-black relative overflow-hidden">
                <div className="absolute inset-0">
                    <div className="absolute top-20 left-0 w-72 h-72 bg-gradient-to-br from-blue-500 via-purple-500 to-pink-500 rounded-full opacity-10 blur-3xl"></div>
                    <div className="absolute bottom-20 right-0 w-72 h-72 bg-gradient-to-bl from-orange-500 via-pink-500 to-purple-500 rounded-full opacity-10 blur-3xl"></div>
                </div>

                <div className="max-w-6xl mx-auto relative z-10">
                    <div className="text-center mb-16">
                        <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
                            Our <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-400">Services</span>
                        </h2>
                        <div className="w-24 h-px bg-gradient-to-r from-purple-500 to-pink-500 mx-auto mb-8"></div>
                        <p className="text-xl text-gray-300 max-w-3xl mx-auto">
                            Comprehensive solutions designed to meet all your educational management needs
                        </p>
                    </div>

                    <div className="grid md:grid-cols-3 gap-8">
                        <div className="bg-gray-900/50 backdrop-blur-sm p-8 rounded-2xl border border-gray-700 hover:border-purple-500/50 transition-all duration-300 group">
                            <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                                <span className="text-2xl text-white">👥</span>
                            </div>
                            <h3 className="text-xl font-bold text-white mb-4">Student Management</h3>
                            <p className="text-gray-300 mb-6">
                                Comprehensive student information system with enrollment, attendance tracking,
                                grade management, and progress monitoring.
                            </p>
                            <ul className="space-y-2 text-sm text-gray-400">
                                <li>• Student enrollment & records</li>
                                <li>• Attendance tracking</li>
                                <li>• Grade & progress reports</li>
                                <li>• Parent communication</li>
                            </ul>
                        </div>

                        <div className="bg-gray-900/50 backdrop-blur-sm p-8 rounded-2xl border border-gray-700 hover:border-purple-500/50 transition-all duration-300 group">
                            <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                                <span className="text-2xl text-white">📚</span>
                            </div>
                            <h3 className="text-xl font-bold text-white mb-4">Course Management</h3>
                            <p className="text-gray-300 mb-6">
                                Complete curriculum management with course creation, scheduling,
                                resource allocation, and learning outcome tracking.
                            </p>
                            <ul className="space-y-2 text-sm text-gray-400">
                                <li>• Curriculum planning</li>
                                <li>• Class scheduling</li>
                                <li>• Resource management</li>
                                <li>• Learning outcomes</li>
                            </ul>
                        </div>

                        <div className="bg-gray-900/50 backdrop-blur-sm p-8 rounded-2xl border border-gray-700 hover:border-purple-500/50 transition-all duration-300 group">
                            <div className="w-16 h-16 bg-gradient-to-r from-orange-500 to-pink-500 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                                <span className="text-2xl text-white">📊</span>
                            </div>
                            <h3 className="text-xl font-bold text-white mb-4">Analytics & Reports</h3>
                            <p className="text-gray-300 mb-6">
                                Advanced analytics dashboard with real-time insights, performance metrics,
                                and comprehensive reporting tools.
                            </p>
                            <ul className="space-y-2 text-sm text-gray-400">
                                <li>• Performance analytics</li>
                                <li>• Custom reports</li>
                                <li>• Data visualization</li>
                                <li>• Predictive insights</li>
                            </ul>
                        </div>

                        <div className="bg-gray-900/50 backdrop-blur-sm p-8 rounded-2xl border border-gray-700 hover:border-purple-500/50 transition-all duration-300 group">
                            <div className="w-16 h-16 bg-gradient-to-r from-green-500 to-teal-500 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                                <span className="text-2xl text-white">💰</span>
                            </div>
                            <h3 className="text-xl font-bold text-white mb-4">Financial Management</h3>
                            <p className="text-gray-300 mb-6">
                                Complete financial solution with fee management, billing,
                                payment processing, and financial reporting.
                            </p>
                            <ul className="space-y-2 text-sm text-gray-400">
                                <li>• Fee management</li>
                                <li>• Online payments</li>
                                <li>• Financial reports</li>
                                <li>• Budget tracking</li>
                            </ul>
                        </div>

                        <div className="bg-gray-900/50 backdrop-blur-sm p-8 rounded-2xl border border-gray-700 hover:border-purple-500/50 transition-all duration-300 group">
                            <div className="w-16 h-16 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                                <span className="text-2xl text-white">📱</span>
                            </div>
                            <h3 className="text-xl font-bold text-white mb-4">Mobile App</h3>
                            <p className="text-gray-300 mb-6">
                                Native mobile applications for students, teachers, and parents
                                with offline capabilities and push notifications.
                            </p>
                            <ul className="space-y-2 text-sm text-gray-400">
                                <li>• Student portal</li>
                                <li>• Teacher dashboard</li>
                                <li>• Parent communication</li>
                                <li>• Offline access</li>
                            </ul>
                        </div>

                        <div className="bg-gray-900/50 backdrop-blur-sm p-8 rounded-2xl border border-gray-700 hover:border-purple-500/50 transition-all duration-300 group">
                            <div className="w-16 h-16 bg-gradient-to-r from-red-500 to-pink-500 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                                <span className="text-2xl text-white">🔒</span>
                            </div>
                            <h3 className="text-xl font-bold text-white mb-4">Security & Privacy</h3>
                            <p className="text-gray-300 mb-6">
                                Enterprise-grade security with data encryption, role-based access,
                                and compliance with educational data protection regulations.
                            </p>
                            <ul className="space-y-2 text-sm text-gray-400">
                                <li>• Data encryption</li>
                                <li>• Role-based access</li>
                                <li>• FERPA compliance</li>
                                <li>• Regular security audits</li>
                            </ul>
                        </div>
                    </div>
                </div>
            </section>

            {/* Contact Section */}
            <section id="contact" className="py-20 px-6 bg-gray-900">
                <div className="max-w-6xl mx-auto">
                    <div className="text-center mb-16">
                        <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
                            Get In <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-400">Touch</span>
                        </h2>
                        <div className="w-24 h-px bg-gradient-to-r from-purple-500 to-pink-500 mx-auto mb-8"></div>
                        <p className="text-xl text-gray-300 max-w-3xl mx-auto">
                            Ready to transform your educational institution? Contact us today for a personalized demo
                        </p>
                    </div>

                    <div className="grid md:grid-cols-2 gap-12">
                        <div>
                            <h3 className="text-2xl font-bold text-white mb-8">Contact Information</h3>
                            <div className="space-y-6">
                                <div className="flex items-start space-x-4">
                                    <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg flex items-center justify-center flex-shrink-0">
                                        <span className="text-white">📍</span>
                                    </div>
                                    <div>
                                        <h4 className="text-white font-semibold mb-1">Address</h4>
                                        <p className="text-gray-300">123 Education Street, Learning City, LC 12345</p>
                                    </div>
                                </div>
                                <div className="flex items-start space-x-4">
                                    <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-lg flex items-center justify-center flex-shrink-0">
                                        <span className="text-white">📞</span>
                                    </div>
                                    <div>
                                        <h4 className="text-white font-semibold mb-1">Phone</h4>
                                        <p className="text-gray-300">+1 (555) 123-4567</p>
                                    </div>
                                </div>
                                <div className="flex items-start space-x-4">
                                    <div className="w-12 h-12 bg-gradient-to-r from-orange-500 to-pink-500 rounded-lg flex items-center justify-center flex-shrink-0">
                                        <span className="text-white">✉️</span>
                                    </div>
                                    <div>
                                        <h4 className="text-white font-semibold mb-1">Email</h4>
                                        <p className="text-gray-300">info@edumanage.com</p>
                                    </div>
                                </div>
                                <div className="flex items-start space-x-4">
                                    <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-teal-500 rounded-lg flex items-center justify-center flex-shrink-0">
                                        <span className="text-white">⏰</span>
                                    </div>
                                    <div>
                                        <h4 className="text-white font-semibold mb-1">Office Hours</h4>
                                        <p className="text-gray-300">Monday - Friday: 9:00 AM - 6:00 PM</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="bg-gray-800/50 p-8 rounded-2xl border border-gray-700">
                            <h3 className="text-2xl font-bold text-white mb-6">Send us a Message</h3>
                            <form className="space-y-6">
                                <div className="grid md:grid-cols-2 gap-4">
                                    <div>
                                        <input
                                            type="text"
                                            placeholder="First Name"
                                            className="w-full px-4 py-3 bg-gray-700 text-white rounded-lg border border-gray-600 focus:border-purple-500 focus:outline-none transition-colors"
                                        />
                                    </div>
                                    <div>
                                        <input
                                            type="text"
                                            placeholder="Last Name"
                                            className="w-full px-4 py-3 bg-gray-700 text-white rounded-lg border border-gray-600 focus:border-purple-500 focus:outline-none transition-colors"
                                        />
                                    </div>
                                </div>
                                <div>
                                    <input
                                        type="email"
                                        placeholder="Email Address"
                                        className="w-full px-4 py-3 bg-gray-700 text-white rounded-lg border border-gray-600 focus:border-purple-500 focus:outline-none transition-colors"
                                    />
                                </div>
                                <div>
                                    <input
                                        type="tel"
                                        placeholder="Phone Number"
                                        className="w-full px-4 py-3 bg-gray-700 text-white rounded-lg border border-gray-600 focus:border-purple-500 focus:outline-none transition-colors"
                                    />
                                </div>
                                <div>
                                    <textarea
                                        placeholder="Your Message"
                                        rows={5}
                                        className="w-full px-4 py-3 bg-gray-700 text-white rounded-lg border border-gray-600 focus:border-purple-500 focus:outline-none transition-colors resize-none"
                                    />
                                </div>
                                <button
                                    type="submit"
                                    className="w-full bg-gradient-to-r from-purple-500 to-pink-500 text-white py-3 rounded-lg font-semibold hover:from-purple-600 hover:to-pink-600 transition-all duration-300 transform hover:scale-105"
                                >
                                    Send Message
                                </button>
                            </form>
                        </div>
                    </div>
                </div>
            </section>

            {/* Footer */}
            <footer className="bg-black border-t border-gray-800 py-12 px-6">
                <div className="max-w-6xl mx-auto">
                    <div className="grid md:grid-cols-4 gap-8 mb-8">
                        <div>
                            <div className="flex items-center space-x-2 mb-6">
                                <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg flex items-center justify-center">
                                    <span className="text-white font-bold text-sm">E</span>
                                </div>
                                <span className="text-white font-semibold text-xl">EduManage</span>
                            </div>
                            <p className="text-gray-400 mb-4">
                                Transforming education through innovative technology solutions.
                            </p>
                            <div className="flex space-x-4">
                                <a href="#" className="w-10 h-10 bg-gray-800 rounded-lg flex items-center justify-center text-gray-400 hover:text-white hover:bg-purple-500 transition-colors">
                                    <span>f</span>
                                </a>
                                <a href="#" className="w-10 h-10 bg-gray-800 rounded-lg flex items-center justify-center text-gray-400 hover:text-white hover:bg-purple-500 transition-colors">
                                    <span>t</span>
                                </a>
                                <a href="#" className="w-10 h-10 bg-gray-800 rounded-lg flex items-center justify-center text-gray-400 hover:text-white hover:bg-purple-500 transition-colors">
                                    <span>in</span>
                                </a>
                            </div>
                        </div>

                        <div>
                            <h4 className="text-white font-semibold mb-4">Quick Links</h4>
                            <ul className="space-y-2">
                                <li><a href="#about" className="text-gray-400 hover:text-white transition-colors">About Us</a></li>
                                <li><a href="#services" className="text-gray-400 hover:text-white transition-colors">Services</a></li>
                                <li><a href="#contact" className="text-gray-400 hover:text-white transition-colors">Contact</a></li>
                                <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Blog</a></li>
                            </ul>
                        </div>

                        <div>
                            <h4 className="text-white font-semibold mb-4">Services</h4>
                            <ul className="space-y-2">
                                <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Student Management</a></li>
                                <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Course Management</a></li>
                                <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Analytics</a></li>
                                <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Mobile App</a></li>
                            </ul>
                        </div>

                        <div>
                            <h4 className="text-white font-semibold mb-4">Support</h4>
                            <ul className="space-y-2">
                                <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Help Center</a></li>
                                <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Documentation</a></li>
                                <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Privacy Policy</a></li>
                                <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Terms of Service</a></li>
                            </ul>
                        </div>
                    </div>

                    <div className="border-t border-gray-800 pt-8 flex flex-col md:flex-row justify-between items-center">
                        <p className="text-gray-400 text-sm mb-4 md:mb-0">
                            © 2025 EduManage. All rights reserved.
                        </p>
                        <div className="flex space-x-6">
                            <a href="#" className="text-gray-400 hover:text-white text-sm transition-colors">Privacy</a>
                            <a href="#" className="text-gray-400 hover:text-white text-sm transition-colors">Terms</a>
                            <a href="#" className="text-gray-400 hover:text-white text-sm transition-colors">Cookies</a>
                        </div>
                    </div>
                </div>
            </footer>
        </div>
    );
};

export default Home;