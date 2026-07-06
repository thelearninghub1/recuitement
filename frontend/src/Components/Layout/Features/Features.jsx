import React from "react";
import { motion } from "framer-motion";
import {
  CheckCircle,
  Zap,
  Shield,
  Users,
  BarChart,
  Cloud,
  Sparkles,
  Globe,
  Bell,
  Search,
  Upload,
  Download,
  Eye,
  Clock,
  DollarSign,
  MapPin,
  MessageSquare,
  Phone,
  Mail,
  TrendingUp,
  Award,
  Rocket,
  Crown,
  Star,
  Heart,
  ShieldCheck,
  Building,
  GraduationCap,
  PlayCircle // Added missing import
} from "lucide-react";
const Features = () => {
  // Main Features with enhanced data
  const mainFeatures = [
    {
      icon: <Zap className="w-8 h-8" />,
      title: "AI-Powered Matching",
      desc: "Smart algorithms connect teachers with ideal schools based on qualifications, preferences, and requirements.",
      color: "from-[#FF6B6B] to-[#FF8E53]",
      features: ["Instant matching", "Smart recommendations", "Real-time updates"]
    },
    {
      icon: <ShieldCheck className="w-8 h-8" />,
      title: "Verified Profiles",
      desc: "All teachers and schools undergo thorough verification for credentials and authenticity.",
      color: "from-[#4ECDC4] to-[#44A08D]",
      features: ["Background checks", "Credential verification", "Rating system"]
    },
    {
      icon: <BarChart className="w-8 h-8" />,
      title: "Advanced Analytics",
      desc: "Comprehensive dashboards and insights for schools to track applications and hiring metrics.",
      color: "from-[#2C7EAD] to-[#00AEEF]",
      features: ["Real-time analytics", "Custom reports", "Performance tracking"]
    },
    {
      icon: <Users className="w-8 h-8" />,
      title: "Collaborative Hiring",
      desc: "Multiple team members can review, rate, and collaborate on candidate selection.",
      color: "from-[#FFD700] to-[#FF9F43]",
      features: ["Team collaboration", "Shared notes", "Voting system"]
    },
    {
      icon: <Cloud className="w-8 h-8" />,
      title: "Cloud Platform",
      desc: "Access your recruitment dashboard from anywhere, on any device, securely in the cloud.",
      color: "from-[#8B5CF6] to-[#A78BFA]",
      features: ["Multi-device access", "Automatic backups", "Scalable storage"]
    },

  ];

  // Platform Features
  const platformFeatures = [
    {
      category: "For Schools",
      features: [
        "Unlimited job postings",
        "Advanced search filters",
        "Candidate tracking",
        "Interview scheduling",
        "Branded career pages",
        "Analytics dashboard"
      ]
    },
    {
      category: "For Teachers",
      features: [
        "Free profile creation",
        "Job recommendations",
        "Application tracking",
        "Portfolio showcase",
        "Salary insights",
        "Career guidance"
      ]
    }
  ];

  // Stats for features
  const featureStats = [
    { value: "95%", label: "Faster Hiring", description: "Average reduction in time-to-hire" },
    { value: "3x", label: "More Qualified", description: "Increase in qualified candidates" },
    { value: "40%", label: "Cost Saving", description: "Average reduction in hiring costs" },
    { value: "99.9%", label: "Uptime", description: "Platform reliability" }
  ];

  return (
    <div className="font-[Parkinsans] overflow-hidden">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-[#2C7EAD] via-[#1E5F8B] to-[#0D3B66] text-white py-32 px-6 md:px-20 text-center overflow-hidden">
        {/* Animated Background */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-40 -left-40 w-80 h-80 bg-[#00AEEF]/20 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute top-1/2 right-0 w-96 h-96 bg-[#FFD700]/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
          <div className="absolute bottom-0 left-1/4 w-64 h-64 bg-white/5 rounded-full blur-2xl animate-pulse delay-500"></div>
          
          {/* Floating Icons */}
          {[...Array(8)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
              }}
              animate={{
                y: [0, -30, 0],
                rotate: [0, 360, 0],
              }}
              transition={{
                duration: Math.random() * 10 + 10,
                repeat: Infinity,
                delay: Math.random() * 5,
              }}
            >
              {[Zap, Shield, Users, BarChart][i % 4] && 
                React.createElement([Zap, Shield, Users, BarChart][i % 4], {
                  className: "w-8 h-8 text-white/20"
                })
              }
            </motion.div>
          ))}
        </div>

        <div className="relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="inline-flex items-center gap-2 px-4 py-2 bg-white/10 backdrop-blur-sm rounded-full mb-6 border border-white/20"
          >
            <Sparkles className="w-4 h-4 text-yellow-300" />
            <span className="text-sm font-medium">Powerful Features for Modern Recruitment</span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-5xl md:text-7xl font-bold mb-6 leading-tight"
          >
            <span className="text-white">Everything You Need to </span>
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-[#FFD700] via-[#FF9F43] to-[#FF6B6B]">
              Hire & Get Hired
            </span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.2 }}
            className="max-w-3xl mx-auto text-xl text-white/90 mb-10 leading-relaxed"
          >
            Discover the comprehensive suite of tools designed to revolutionize educational recruitment 
            for schools and teachers across Middle East.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="flex flex-wrap justify-center gap-6"
          >
            
          </motion.div>
        </div>
      </section>

      {/* Feature Stats */}
      <section className="bg-white py-16 border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-6 md:px-20">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {featureStats.map((stat, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                viewport={{ once: true }}
                className="text-center group"
                whileHover={{ scale: 1.05 }}
              >
                <div className="text-5xl font-bold text-gray-900 mb-2 bg-gradient-to-r from-[#2C7EAD] to-[#00AEEF] bg-clip-text text-transparent">
                  {stat.value}
                </div>
                <div className="font-semibold text-gray-800 mb-2">{stat.label}</div>
                <div className="text-sm text-gray-600">{stat.description}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Main Features Grid */}
      <section className="py-24 bg-gradient-to-b from-white to-gray-50 relative overflow-hidden">
        {/* Background pattern */}
        <div className="absolute inset-0 opacity-5">
          <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-blue-500/20 to-cyan-500/20"></div>
        </div>

        <div className="max-w-7xl mx-auto px-6 md:px-20 relative z-10">
          <div className="text-center mb-16">
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-4xl md:text-5xl font-bold text-gray-900 mb-6 leading-tight"
            >
              <span className="text-gray-900">Powerful Features for </span>
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-[#2C7EAD] via-[#00AEEF] to-[#4ECDC4]">
                Modern Recruitment
              </span>
            </motion.h2>
            
            <motion.p
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="text-gray-600 text-lg max-w-3xl mx-auto"
            >
              Designed specifically for the education sector, our features streamline the entire 
              recruitment process from discovery to hiring.
            </motion.p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {mainFeatures.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ y: -10 }}
                className="group"
              >
                <div className="bg-white rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300 overflow-hidden h-full border border-gray-100">
                  {/* Feature Header */}
                  <div className={`bg-gradient-to-r ${feature.color} p-8 text-white relative overflow-hidden`}>
                    <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -translate-y-16 translate-x-16"></div>
                    <div className="relative z-10 flex items-center justify-between">
                      <div className="p-4 bg-white/20 backdrop-blur-sm rounded-2xl">
                        {feature.icon}
                      </div>
                      <div className="text-right">
                        <div className="text-2xl font-bold">{index + 1}</div>
                        <div className="text-sm opacity-80">Feature</div>
                      </div>
                    </div>
                  </div>

                  {/* Feature Content */}
                  <div className="p-8">
                    <h3 className="text-xl font-bold text-gray-900 mb-4">{feature.title}</h3>
                    <p className="text-gray-600 mb-6 leading-relaxed">{feature.desc}</p>
                    
                    <div className="space-y-3">
                      {feature.features.map((item, idx) => (
                        <div key={idx} className="flex items-center gap-3">
                          <CheckCircle className="w-4 h-4 text-green-500 flex-shrink-0" />
                          <span className="text-sm text-gray-700">{item}</span>
                        </div>
                      ))}
                    </div>

                
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Platform Features Comparison */}
      <section className="py-24 bg-gradient-to-br from-blue-50/50 via-white/50 to-cyan-50/50">
        <div className="max-w-7xl mx-auto px-6 md:px-20">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Features <span className="bg-clip-text text-transparent bg-gradient-to-r from-[#FF6B6B] to-[#4ECDC4]">
                For Everyone
              </span>
            </h2>
            <p className="text-gray-600 text-lg max-w-2xl mx-auto">
              Tailored solutions for both schools and teachers
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* For Schools */}
            <motion.div
              initial={{ opacity: 0, x: -40 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="relative group"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-[#2C7EAD] to-[#00AEEF] rounded-3xl transform group-hover:scale-105 transition-transform duration-500 opacity-10 group-hover:opacity-20"></div>
              <div className="relative bg-white/80 backdrop-blur-sm rounded-3xl p-10 shadow-2xl hover:shadow-3xl transition-all duration-500 border border-white/50">
                <div className="inline-flex items-center gap-3 mb-8">
                  <div className="p-4 bg-gradient-to-br from-[#2C7EAD] to-[#00AEEF] rounded-2xl">
                    <Building className="w-8 h-8 text-white" />
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold text-gray-900">For Member Schools</h3>
                    <p className="text-gray-600">Comprehensive hiring tools</p>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  {platformFeatures[0].features.map((item, idx) => (
                    <div key={idx} className="flex items-center gap-3 p-4 bg-blue-50 rounded-xl hover:bg-blue-100 transition-colors">
                      <CheckCircle className="w-4 h-4 text-blue-600 flex-shrink-0" />
                      <span className="text-sm font-medium text-gray-700">{item}</span>
                    </div>
                  ))}
                </div>

               
              </div>
            </motion.div>

            {/* For Teachers */}
            <motion.div
              initial={{ opacity: 0, x: 40 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="relative group"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-[#FF6B6B] to-[#FF8E53] rounded-3xl transform group-hover:scale-105 transition-transform duration-500 opacity-10 group-hover:opacity-20"></div>
              <div className="relative bg-white/80 backdrop-blur-sm rounded-3xl p-10 shadow-2xl hover:shadow-3xl transition-all duration-500 border border-white/50">
                <div className="inline-flex items-center gap-3 mb-8">
                  <div className="p-4 bg-gradient-to-br from-[#FF6B6B] to-[#FF8E53] rounded-2xl">
                    <GraduationCap className="w-8 h-8 text-white" />
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold text-gray-900">For Teachers</h3>
                    <p className="text-gray-600">Complete career toolkit</p>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  {platformFeatures[1].features.map((item, idx) => (
                    <div key={idx} className="flex items-center gap-3 p-4 bg-red-50 rounded-xl hover:bg-red-100 transition-colors">
                      <CheckCircle className="w-4 h-4 text-red-600 flex-shrink-0" />
                      <span className="text-sm font-medium text-gray-700">{item}</span>
                    </div>
                  ))}
                </div>

             
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Additional Features */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-6 md:px-20">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Plus <span className="bg-clip-text text-transparent bg-gradient-to-r from-[#FFD700] to-[#FF9F43]">
                So Much More
              </span>
            </h2>
            <p className="text-gray-600 text-lg max-w-2xl mx-auto">
              Additional tools and features that make recruitment effortless
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {[
              {
                icon: <MessageSquare className="w-6 h-6" />,
                title: "Direct Messaging",
                color: "from-blue-500 to-cyan-500"
              },
              {
                icon: <Bell className="w-6 h-6" />,
                title: "Smart Notifications",
                color: "from-purple-500 to-pink-500"
              },
              {
                icon: <Search className="w-6 h-6" />,
                title: "Advanced Search",
                color: "from-emerald-500 to-teal-500"
              },
              {
                icon: <Upload className="w-6 h-6" />,
                title: "Easy Import",
                color: "from-orange-500 to-red-500"
              },
              {
                icon: <Eye className="w-6 h-6" />,
                title: "Profile Views",
                color: "from-blue-500 to-indigo-500"
              },
              {
                icon: <Clock className="w-6 h-6" />,
                title: "Time Tracking",
                color: "from-green-500 to-emerald-500"
              },
              {
                icon: <DollarSign className="w-6 h-6" />,
                title: "Salary Insights",
                color: "from-yellow-500 to-orange-500"
              },
              {
                icon: <MapPin className="w-6 h-6" />,
                title: "Location Based",
                color: "from-red-500 to-pink-500"
              }
            ].map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.05 }}
                whileHover={{ scale: 1.1, rotate: 5 }}
                className="text-center"
              >
                <div className={`inline-flex p-6 bg-gradient-to-br ${feature.color} rounded-2xl mb-4 shadow-lg`}>
                  <div className="text-white">{feature.icon}</div>
                </div>
                <div className="font-semibold text-gray-900">{feature.title}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 bg-gradient-to-br from-[#2C7EAD] via-[#1E5F8B] to-[#0D3B66] text-white overflow-hidden relative">
        {/* Background Elements */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-full">
            {[...Array(20)].map((_, i) => (
              <motion.div
                key={i}
                className="absolute w-1 h-1 bg-white rounded-full"
                style={{
                  left: `${Math.random() * 100}%`,
                  top: `${Math.random() * 100}%`,
                }}
                animate={{
                  y: [0, -40, 0],
                  opacity: [0, 1, 0],
                }}
                transition={{
                  duration: Math.random() * 4 + 3,
                  repeat: Infinity,
                  delay: Math.random() * 2,
                }}
              />
            ))}
          </div>
        </div>

        <div className="relative max-w-4xl mx-auto px-6 md:px-20 text-center z-10">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/10 backdrop-blur-sm rounded-full mb-6 border border-white/20">
              <Sparkles className="w-4 h-4 text-yellow-300" />
              <span className="text-sm font-medium">Ready to Transform Your Recruitment?</span>
            </div>

            <h2 className="text-4xl font-bold mb-6">
              Start Using Our Powerful Features Today
            </h2>
            <p className="text-xl text-white/80 mb-10 max-w-2xl mx-auto">
              Join thousands of schools and teachers who are already benefiting from our platform
            </p>
            

            {/* Feature Highlights */}
            <div className="mt-16 grid grid-cols-1 sm:grid-cols-3 gap-8 text-left">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-white/10 rounded-xl">
                  <Shield className="w-6 h-6" />
                </div>
                <div>
                  <div className="font-bold">Secure Platform</div>
                  <div className="text-sm text-white/80">Bank-level security</div>
                </div>
              </div>
              
              <div className="flex items-center gap-4">
                <div className="p-3 bg-white/10 rounded-xl">
                  <Zap className="w-6 h-6" />
                </div>
                <div>
                  <div className="font-bold">Fast Setup</div>
                  <div className="text-sm text-white/80">Get started in minutes</div>
                </div>
              </div>
              
              <div className="flex items-center gap-4">
                <div className="p-3 bg-white/10 rounded-xl">
                  <Users className="w-6 h-6" />
                </div>
                <div>
                  <div className="font-bold">Dedicated </div>
                  <div className="text-sm text-white/80">Relationship Manager</div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default Features;