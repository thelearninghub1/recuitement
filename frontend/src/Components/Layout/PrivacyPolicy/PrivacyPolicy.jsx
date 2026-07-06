// src/pages/PrivacyPolicy.jsx
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Shield,
  Lock,
  Eye,
  Target,
  FileText,
  CheckCircle,
  AlertCircle,
  Mail,
  Phone,
  Globe,
  BookOpen,
  ArrowRight,
  ChevronRight,
  ShieldCheck,
  Cookie,
  Server,
  Users,
  Briefcase,
  Scale,
  Gavel,
  HardDrive,
  Key,
  Bell,
  FileCheck,
  UserCheck,
  Database,
  Fingerprint,
  Clock,
  RefreshCw,
  Download,
  Trash2,
  HelpCircle,
  MessageSquare,
  Award,
  Sparkles
} from 'lucide-react';

const PrivacyPolicy = () => {
  const navigate = useNavigate();
  const [activeSection, setActiveSection] = useState('privacy');

  // Navigation handlers
  const navigateToContact = () => {
    navigate('/contact-us');
  };

  const navigateToHome = () => {
    navigate('/');
  };

  // Sections data
  const sections = [
    {
      id: 'privacy',
      title: 'Privacy Policy',
      icon: <Shield className="w-6 h-6" />,
      color: 'from-blue-500 to-cyan-500',
      content: {
        intro: 'We take your privacy seriously. Your personal data stays protected under the Kingdom of Saudi Arabia\'s Personal Data Protection Law (PDPL) and all related rules.',
        principles: [
          {
            icon: <Scale className="w-5 h-5" />,
            title: 'Fair and Legal Processing',
            desc: 'We process your data fairly, legally, and clearly.'
          },
          {
            icon: <Target className="w-5 h-5" />,
            title: 'Purpose Limitation',
            desc: 'We collect your info only for real recruitment needs.'
          },
          {
            icon: <Users className="w-5 h-5" />,
            title: 'Controlled Sharing',
            desc: 'We share your data with employers only when necessary, and if the law says so, we\'ll ask for your consent first.'
          },
          {
            icon: <Lock className="w-5 h-5" />,
            title: 'Security Measures',
            desc: 'We use solid security measures—both technical and organizational—to keep your details safe from unauthorized access, loss, misuse, or changes.'
          },
          {
            icon: <Clock className="w-5 h-5" />,
            title: 'Data Retention',
            desc: 'We keep your data only as long as we need it for recruitment or to meet legal requirements.'
          }
        ],
        rights: {
          title: 'Your Rights',
          description: 'You have rights, too. You can:',
          items: [
            'Ask how we use your data',
            'See the personal data we hold about you',
            'Request changes if anything\'s wrong or incomplete',
            'Ask us to delete your data, if the law allows it'
          ]
        },
        contact: 'If you want to make a request or have questions, email us at info@theteachingpath.com'
      }
    },
    {
      id: 'terms',
      title: 'Terms of Use',
      icon: <Gavel className="w-6 h-6" />,
      color: 'from-emerald-500 to-teal-500',
      content: {
        intro: 'When you use this website, you agree to the following:',
        terms: [
          {
            icon: <FileCheck className="w-5 h-5" />,
            title: 'Accuracy of Information',
            desc: 'Everything you submit must be accurate, honest, and current.'
          },
          {
            icon: <UserCheck className="w-5 h-5" />,
            title: 'Candidate Responsibilities',
            desc: 'Candidates need to provide real qualifications and documents, following Saudi rules and what employers need.'
          },
          {
            icon: <Briefcase className="w-5 h-5" />,
            title: 'Employer Responsibilities',
            desc: 'Employers must follow Saudi labor laws and other regulations.'
          },
          {
            icon: <Users className="w-5 h-5" />,
            title: 'Our Role',
            desc: 'We\'re here as a recruitment middleman; we don\'t promise anyone a job.'
          },
          {
            icon: <AlertCircle className="w-5 h-5" />,
            title: 'Account Termination',
            desc: 'If you misuse the site or send false info, we can suspend or end your access.'
          }
        ],
        updates: 'We may update these terms if Saudi laws or regulations change.'
      }
    },
    {
      id: 'cookies',
      title: 'Cookies Policy',
      icon: <Cookie className="w-6 h-6" />,
      color: 'from-purple-500 to-pink-500',
      content: {
        intro: 'We use cookies to make your experience better and the site work smoother.',
        purposes: [
          {
            icon: <Key className="w-5 h-5" />,
            title: 'Authentication',
            desc: 'Remember your login and preferences.'
          },
          {
            icon: <Server className="w-5 h-5" />,
            title: 'Analytics',
            desc: 'Track how the site\'s doing and see who visits.'
          },
          {
            icon: <Search className="w-5 h-5" />,
            title: 'Personalization',
            desc: 'Give you better job searches and recommendations.'
          }
        ],
        control: 'You can control cookies in your browser settings. If you keep using the site, we\'ll take that as your okay to use cookies.'
      }
    },
    {
      id: 'security',
      title: 'Information Security',
      icon: <ShieldCheck className="w-6 h-6" />,
      color: 'from-orange-500 to-red-500',
      content: {
        intro: 'We work hard to keep your personal data safe and always follow Saudi regulations.',
        measures: [
          {
            icon: <Database className="w-5 h-5" />,
            title: 'Secure Storage',
            desc: 'Secure places to store your data.'
          },
          {
            icon: <Fingerprint className="w-5 h-5" />,
            title: 'Access Control',
            desc: 'Limited access, so only the right people can see your info.'
          },
          {
            icon: <RefreshCw className="w-5 h-5" />,
            title: 'Regular Updates',
            desc: 'Regular checks and updates on our systems.'
          },
          {
            icon: <Lock className="w-5 h-5" />,
            title: 'Cyber Protection',
            desc: 'Protection from unauthorized access and cyber threats.'
          }
        ],
        responsibility: 'But remember, you\'re responsible for keeping your own login details private.'
      }
    },
    {
      id: 'careers',
      title: 'Careers',
      icon: <Award className="w-6 h-6" />,
      color: 'from-yellow-500 to-orange-500',
      content: {
        intro: 'We\'re dedicated to helping education grow by connecting great teachers with top schools in Saudi Arabia and beyond.',
        opportunity: 'Interested in joining our recruitment team? Send your CV to jobs@theteachingpath.com',
        commitment: 'We\'re an equal opportunity employer and stick to ethical recruitment practices and Saudi labor laws.'
      }
    }
  ];

  return (
    <div className="font-[Parkinsans] overflow-hidden mt-30">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-slate-900 via-blue-900 to-indigo-900 text-white overflow-hidden">
        {/* Background Elements */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-10 left-10 w-72 h-72 bg-blue-500/20 rounded-full blur-3xl"></div>
          <div className="absolute bottom-10 right-10 w-96 h-96 bg-purple-500/20 rounded-full blur-3xl"></div>
          <div className="absolute top-1/3 right-1/3 w-64 h-64 bg-cyan-500/10 rounded-full blur-2xl"></div>
        </div>
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 lg:py-28">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center"
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2 }}
              className="inline-flex items-center gap-2 px-4 py-3 bg-white/10 backdrop-blur-sm rounded-full mb-6 border border-white/20"
            >
              <Shield className="w-5 h-5 text-yellow-300" />
              <span className="text-sm font-medium">Your Privacy & Security Matter to Us</span>
            </motion.div>
            
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold leading-tight mb-6">
              Privacy Policy & <span className="text-[#FFD700]">Terms of Use</span>
            </h1>
            
            <p className="text-lg text-white/90 mb-8 max-w-2xl mx-auto leading-relaxed">
              Learn how we protect your data and the terms that govern your use of TeachingPath platform.
              We're committed to transparency and compliance with Saudi regulations.
            </p>
            
            <button
              onClick={navigateToHome}
              className="px-8 py-4 bg-white/10 backdrop-blur-sm border-2 border-white/30 text-white font-bold rounded-2xl hover:bg-white hover:text-blue-900 transition-all duration-300 inline-flex items-center gap-2"
            >
              <ArrowRight className="w-5 h-5 rotate-180" />
              Back to Home
            </button>
          </motion.div>
        </div>
      </section>

  

      {/* Main Content */}
      <section className="py-20 bg-gradient-to-br from-slate-50 to-blue-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Section Navigation Tabs */}
          <div className="flex flex-wrap justify-center gap-4 mb-16">
            {sections.map((section) => (
              <button
                key={section.id}
                onClick={() => setActiveSection(section.id)}
                className={`group relative overflow-hidden rounded-2xl transition-all duration-300 ${
                  activeSection === section.id
                    ? 'shadow-xl scale-105'
                    : 'hover:shadow-lg hover:scale-102'
                }`}
              >
                <div className={`absolute inset-0 bg-gradient-to-r ${section.color} opacity-0 group-hover:opacity-10 transition-opacity duration-300`}></div>
                <div className={`relative px-6 py-4 flex items-center gap-3 ${
                  activeSection === section.id
                    ? `bg-gradient-to-r ${section.color} text-white`
                    : 'bg-white text-gray-700'
                } rounded-2xl border border-gray-200`}>
                  <div className={`p-2 rounded-lg ${
                    activeSection === section.id
                      ? 'bg-white/20'
                      : `bg-gradient-to-r ${section.color} bg-opacity-10`
                  }`}>
                    <div className={activeSection === section.id ? 'text-white' : `text-transparent bg-clip-text bg-gradient-to-r ${section.color}`}>
                      {section.icon}
                    </div>
                  </div>
                  <span className="font-semibold">{section.title}</span>
                </div>
              </button>
            ))}
          </div>

          {/* Active Section Content */}
          <AnimatePresence mode="wait">
            {sections.map((section) => (
              section.id === activeSection && (
                <motion.div
                  key={section.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.5 }}
                  className="bg-white rounded-3xl shadow-xl p-8 md:p-12"
                >
                  {/* Section Header */}
                  <div className={`inline-flex p-4 bg-gradient-to-r ${section.color} rounded-2xl mb-8`}>
                    <div className="text-white">{section.icon}</div>
                  </div>
                  
                  <h2 className="text-3xl font-bold text-gray-900 mb-6">{section.title}</h2>
                  
                  {/* Intro Text */}
                  <p className="text-lg text-gray-600 mb-8 leading-relaxed">
                    {section.content.intro}
                  </p>

                  {/* Dynamic Content Based on Section */}
                  {section.id === 'privacy' && (
                    <>
                      {/* Privacy Principles */}
                      <div className="grid md:grid-cols-2 gap-6 mb-10">
                        {section.content.principles.map((principle, idx) => (
                          <motion.div
                            key={idx}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: idx * 0.1 }}
                            className="p-6 bg-gradient-to-br from-gray-50 to-white rounded-2xl border border-gray-100 hover:shadow-lg transition-all duration-300"
                          >
                            <div className={`inline-flex p-3 bg-gradient-to-r ${section.color} bg-opacity-10 rounded-xl mb-4`}>
                              <div className={`text-transparent bg-clip-text bg-gradient-to-r ${section.color}`}>
                                {principle.icon}
                              </div>
                            </div>
                            <h4 className="font-bold text-gray-900 mb-2">{principle.title}</h4>
                            <p className="text-gray-600">{principle.desc}</p>
                          </motion.div>
                        ))}
                      </div>

                      {/* Your Rights Section */}
                      <div className="bg-gradient-to-br from-blue-50 to-cyan-50 rounded-2xl p-8 mb-8">
                        <h3 className="text-2xl font-bold text-gray-900 mb-4">{section.content.rights.title}</h3>
                        <p className="text-gray-700 mb-4">{section.content.rights.description}</p>
                        <ul className="space-y-3">
                          {section.content.rights.items.map((item, idx) => (
                            <li key={idx} className="flex items-start gap-3">
                              <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                              <span className="text-gray-700">{item}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </>
                  )}

                  {section.id === 'terms' && (
                    <>
                      {/* Terms List */}
                      <div className="space-y-4 mb-8">
                        {section.content.terms.map((term, idx) => (
                          <motion.div
                            key={idx}
                            initial={{ opacity: 0, x: -10 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: idx * 0.1 }}
                            className="p-6 bg-gradient-to-br from-gray-50 to-white rounded-2xl border border-gray-100 hover:shadow-lg transition-all duration-300"
                          >
                            <div className="flex items-start gap-4">
                              <div className={`inline-flex p-3 bg-gradient-to-r ${section.color} bg-opacity-10 rounded-xl`}>
                                <div className={`text-transparent bg-clip-text bg-gradient-to-r ${section.color}`}>
                                  {term.icon}
                                </div>
                              </div>
                              <div>
                                <h4 className="font-bold text-gray-900 mb-2">{term.title}</h4>
                                <p className="text-gray-600">{term.desc}</p>
                              </div>
                            </div>
                          </motion.div>
                        ))}
                      </div>

                      {/* Updates Note */}
                      <div className="bg-amber-50 border border-amber-200 rounded-2xl p-6">
                        <div className="flex items-start gap-3">
                          <RefreshCw className="w-5 h-5 text-amber-600 flex-shrink-0 mt-1" />
                          <p className="text-amber-800">{section.content.updates}</p>
                        </div>
                      </div>
                    </>
                  )}

                  {section.id === 'cookies' && (
                    <>
                      {/* Cookie Purposes */}
                      <div className="grid md:grid-cols-3 gap-6 mb-8">
                        {section.content.purposes.map((purpose, idx) => (
                          <motion.div
                            key={idx}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: idx * 0.1 }}
                            className="p-6 bg-gradient-to-br from-gray-50 to-white rounded-2xl border border-gray-100 hover:shadow-lg transition-all duration-300 text-center"
                          >
                            <div className={`inline-flex p-4 bg-gradient-to-r ${section.color} bg-opacity-10 rounded-xl mb-4`}>
                              <div className={`text-transparent bg-clip-text bg-gradient-to-r ${section.color}`}>
                                {purpose.icon}
                              </div>
                            </div>
                            <h4 className="font-bold text-gray-900 mb-2">{purpose.title}</h4>
                            <p className="text-gray-600 text-sm">{purpose.desc}</p>
                          </motion.div>
                        ))}
                      </div>

                      {/* Cookie Control */}
                      <div className="bg-purple-50 border border-purple-200 rounded-2xl p-6">
                        <div className="flex items-start gap-3">
                          <Settings className="w-5 h-5 text-purple-600 flex-shrink-0 mt-1" />
                          <p className="text-purple-800">{section.content.control}</p>
                        </div>
                      </div>
                    </>
                  )}

                  {section.id === 'security' && (
                    <>
                      {/* Security Measures */}
                      <div className="grid md:grid-cols-2 gap-6 mb-8">
                        {section.content.measures.map((measure, idx) => (
                          <motion.div
                            key={idx}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: idx * 0.1 }}
                            className="p-6 bg-gradient-to-br from-gray-50 to-white rounded-2xl border border-gray-100 hover:shadow-lg transition-all duration-300"
                          >
                            <div className={`inline-flex p-3 bg-gradient-to-r ${section.color} bg-opacity-10 rounded-xl mb-4`}>
                              <div className={`text-transparent bg-clip-text bg-gradient-to-r ${section.color}`}>
                                {measure.icon}
                              </div>
                            </div>
                            <h4 className="font-bold text-gray-900 mb-2">{measure.title}</h4>
                            <p className="text-gray-600">{measure.desc}</p>
                          </motion.div>
                        ))}
                      </div>

                      {/* User Responsibility */}
                      <div className="bg-orange-50 border border-orange-200 rounded-2xl p-6">
                        <div className="flex items-start gap-3">
                          <AlertCircle className="w-5 h-5 text-orange-600 flex-shrink-0 mt-1" />
                          <p className="text-orange-800">{section.content.responsibility}</p>
                        </div>
                      </div>
                    </>
                  )}

                  {section.id === 'careers' && (
                    <div className="space-y-6">
                      <p className="text-lg text-gray-700 mb-6">{section.content.opportunity}</p>
                      
                      {/* Commitment Box */}
                      <div className="bg-gradient-to-br from-yellow-50 to-orange-50 rounded-2xl p-8">
                        <div className="flex items-start gap-4">
                          <div className={`inline-flex p-4 bg-gradient-to-r ${section.color} rounded-xl`}>
                            <Award className="w-6 h-6 text-white" />
                          </div>
                          <div>
                            <h4 className="text-xl font-bold text-gray-900 mb-3">Equal Opportunity Employer</h4>
                            <p className="text-gray-700">{section.content.commitment}</p>
                          </div>
                        </div>
                      </div>

                      {/* CTA Button */}
                      <div className="text-center mt-8">
                        <button
                          onClick={() => window.location.href = 'mailto:jobs@theteachingpath.com'}
                          className="px-8 py-4 bg-gradient-to-r from-yellow-500 to-orange-500 text-white font-bold rounded-2xl hover:shadow-xl hover:scale-105 transition-all duration-300 inline-flex items-center gap-3"
                        >
                          <Mail className="w-5 h-5" />
                          Send Your CV
                          <ArrowRight className="w-5 h-5" />
                        </button>
                      </div>
                    </div>
                  )}

                  {/* Contact Info - Shown for all sections except careers */}
                  {section.id !== 'careers' && (
                    <div className="mt-10 pt-8 border-t border-gray-200">
                      <div className="flex flex-col md:flex-row items-center justify-between gap-6">
                        <div className="flex items-center gap-4">
                          <div className="p-3 bg-blue-100 rounded-full">
                            <Mail className="w-6 h-6 text-blue-600" />
                          </div>
                          <div>
                            <p className="text-sm text-gray-500">Questions about {section.title.toLowerCase()}?</p>
                            <p className="text-lg font-semibold text-gray-900">info@theteachingpath.com</p>
                          </div>
                        </div>
                        <button
                          onClick={navigateToContact}
                          className="px-6 py-3 bg-gradient-to-r from-blue-600 to-cyan-600 text-white rounded-xl font-semibold hover:shadow-lg transition-all duration-300 flex items-center gap-2"
                        >
                          <MessageSquare className="w-4 h-4" />
                          Contact Us
                        </button>
                      </div>
                    </div>
                  )}
                </motion.div>
              )
            ))}
          </AnimatePresence>
        </div>
      </section>

      {/* Additional Resources */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h3 className="text-2xl font-bold text-gray-900 text-center mb-12">
            Additional Resources
          </h3>
          
          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                icon: <Download className="w-8 h-8" />,
                title: "Download Privacy Policy",
                desc: "Get a PDF copy of our complete privacy policy",
                action: "#",
                color: "from-blue-500 to-cyan-500"
              },
              {
                icon: <HelpCircle className="w-8 h-8" />,
                title: "FAQ",
                desc: "Find answers to common questions about data privacy",
                action: "/faq",
                color: "from-emerald-500 to-teal-500"
              },
              {
                icon: <FileText className="w-8 h-8" />,
                title: "Data Processing Agreement",
                desc: "For schools: Review our DPA",
                action: "#",
                color: "from-purple-500 to-pink-500"
              }
            ].map((resource, idx) => (
              <motion.a
                key={idx}
                href={resource.action}
                whileHover={{ y: -5 }}
                className="group p-8 bg-gradient-to-br from-gray-50 to-white rounded-2xl border border-gray-200 hover:shadow-xl transition-all duration-300 text-center"
              >
                <div className={`inline-flex p-4 bg-gradient-to-r ${resource.color} rounded-xl mb-6 group-hover:scale-110 transition-transform duration-300`}>
                  <div className="text-white">{resource.icon}</div>
                </div>
                <h4 className="text-xl font-bold text-gray-900 mb-2">{resource.title}</h4>
                <p className="text-gray-600 mb-4">{resource.desc}</p>
            
              </motion.a>
            ))}
          </div>
        </div>
      </section>

      {/* Last Updated */}
      <section className="py-8 bg-gray-50 border-t border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <p className="text-center text-gray-600">
            Last Updated: March 2024 | Compliant with Saudi Arabia's Personal Data Protection Law (PDPL)
          </p>
        </div>
      </section>
    </div>
  );
};

// Helper component for AnimatePresence
import { AnimatePresence } from 'framer-motion';

// Missing icon import
const Search = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <circle cx="11" cy="11" r="8"></circle>
    <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
  </svg>
);

const Settings = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <circle cx="12" cy="12" r="3"></circle>
    <path d="M19.4 15a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H5.78a1.65 1.65 0 0 0-1.51 1 1.65 1.65 0 0 0 .33 1.82l.03.03A10 10 0 0 0 12 17.66a10 10 0 0 0 6.37-2.63z"></path>
    <path d="M4.6 9a1.65 1.65 0 0 0-.33 1.82c.26.62.84 1.01 1.51 1h11.84a1.65 1.65 0 0 0 1.51-1 1.65 1.65 0 0 0-.33-1.82l-4.34-4.34a2 2 0 0 0-2.83 0L8.94 4.66a2 2 0 0 0 0 2.83z"></path>
  </svg>
);

export default PrivacyPolicy;