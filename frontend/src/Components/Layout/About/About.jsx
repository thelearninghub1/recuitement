import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { 
  Target, 
  Award, 
  Users, 
  Globe, 
  Shield, 
  Zap, 
  TrendingUp,
  CheckCircle,
  BookOpen,
  Heart,
  Sparkles,
  ArrowRight,
  Building,
  GraduationCap,
  Clock,
  DollarSign,
  Star,
  Users as UsersIcon,
  MapPin,
  MessageSquare,
  Phone,
  Mail,
  Linkedin,
  Twitter,
  Facebook,
  Instagram,
  Rocket,
  Crown,
  Lightbulb,
  BarChart,
  ThumbsUp
} from "lucide-react";
import { allUserAction } from "../../../actions/userActions";
import { getJobs } from "../../../actions/jobActions";
import aboutImg from "../../../assets/about.jpeg"; 

const About = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  // Redux states
  const { users = [], loading: usersLoading } = useSelector((state) => state.allUsers);
  const { loading: jobsLoading, jobs = [] } = useSelector((state) => state.allJobs);
  
  // Local state for stats
  const [stats, setStats] = useState({
    totalTeachers: 0,
    totalSchools: 0,
    activeJobs: 0,
    totalCities: 27
  });

  // Load data on component mount
  useEffect(() => {
    const loadData = async () => {
      try {
        await Promise.all([
          dispatch(allUserAction()),
          dispatch(getJobs())
        ]);
      } catch (error) {
        console.error('Error loading data:', error);
      }
    };
    
    loadData();
  }, [dispatch]);

  // Process data when loaded
  useEffect(() => {
    if (users && jobs) {
      const teachers = users.filter(user => user.role === 'candidate') || [];
      const schools = users.filter(user => user.role === 'school') || [];
      const activeJobsList = jobs.filter(job => job.status === 'active') || [];
      
      setStats({
        totalTeachers: teachers.length,
        totalSchools: schools.length,
        activeJobs: activeJobsList.length,
        totalCities: 27 // You can make this dynamic if you have city data
      });
    }
  }, [users, jobs]);

  // Format numbers with commas
  const formatNumber = (num) => {
    return num.toLocaleString();
  };

  // Team members data
  const teamMembers = [
    {
      name: "Hadia Ahsan",
      role: "Schools Relationship Manager",
      expertise: "Management",
      avatar: "https://i.ibb.co/SD6c2pW1/man.jpg",
      color: "from-blue-500 to-cyan-500"
    },
    {
      name: "Dr. Flora K. Ferdinand",
      role: "Recruitment Advisor",
      expertise: "Educational Psychologist",
      avatar: "https://i.ibb.co/7drMpD8j/Whats-App-Image-2026-07-01-at-12-44-12-PM.jpg",
      color: "from-purple-500 to-pink-500"
    },
    {
      name: "Aqib Javed",
      role: "Technical Lead",
      expertise: "Platform Development",
      avatar: "https://i.ibb.co/d4hG6mXT/abyb.jpg" ,
      color: "from-emerald-500 to-teal-500"
    },
    {
      name: "Mahira Ashrafi",
      role: "Head of Success",
      expertise: "Partnership Management",
      avatar: "https://i.ibb.co/v5H17x5/ban.jpg",
      color: "from-orange-500 to-red-500"
    }
  ];

  // Milestones data with dynamic numbers
  const milestones = [
    { year: "2022", title: "Founded", description: "TeachingPath established" },
    { year: "2023", title: `${formatNumber(Math.floor(stats.totalTeachers * 0.6))}+ Teachers`, description: "First major milestone" },
    { year: "2024", title: `${formatNumber(Math.floor(stats.totalSchools * 0.7))}+ Schools`, description: "Growing partnership network" },
    { year: "2025", title: `${formatNumber(stats.activeJobs)}+ Jobs`, description: "Active positions available" }
  ];

  // Values data
  const values = [
    {
      icon: <Heart className="w-6 h-6" />,
      title: "Passion for Education",
      description: "We believe every student deserves a great teacher",
      color: "from-red-400 to-pink-500"
    },
    {
      icon: <Shield className="w-6 h-6" />,
      title: "Integrity First",
      description: "Transparent and honest in all our dealings",
      color: "from-blue-500 to-cyan-500"
    },
    {
      icon: <Zap className="w-6 h-6" />,
      title: "Innovation Driven",
      description: "Continuously improving our platform and services",
      color: "from-yellow-500 to-orange-500"
    },
    {
      icon: <Users className="w-6 h-6" />,
      title: "Community Focus",
      description: "Building strong educator networks",
      color: "from-green-500 to-emerald-500"
    }
  ];

  // Stats data - Using real-time data
  const statsData = [
    { 
      icon: <UsersIcon className="w-6 h-6" />, 
      value: `${formatNumber(stats.totalTeachers)}+`, 
      label: "Active Teachers",
      loading: usersLoading
    },
    { 
      icon: <Building className="w-6 h-6" />, 
      value: `${formatNumber(stats.totalSchools)}+`, 
      label: "Partner Schools",
      loading: usersLoading
    },
    { 
      icon: <GraduationCap className="w-6 h-6" />, 
      value: `${formatNumber(stats.activeJobs)}+`, 
      label: "Active Jobs",
      loading: jobsLoading
    },
    { 
      icon: <MapPin className="w-6 h-6" />, 
      value: `${stats.totalCities}+`, 
      label: "Cities Across KSA",
      loading: false
    }
  ];

  // Navigation handlers
  const handleExplorePlatform = () => {
    navigate('/');
  };

  const handleMeetTeam = () => {
    navigate('/contact-us');
  };

  const handleGetStarted = () => {
    navigate('/teacher-register');
  };

  const handleScheduleDemo = () => {
    navigate('/contact-us');
  };

  // Loading skeleton for stats
  const StatSkeleton = () => (
    <div className="animate-pulse">
      <div className="w-16 h-16 bg-gray-200 rounded-xl mx-auto mb-4"></div>
      <div className="h-8 w-24 bg-gray-200 rounded mx-auto mb-2"></div>
      <div className="h-4 w-32 bg-gray-200 rounded mx-auto"></div>
    </div>
  );

  return (
    <div className="font-[Parkinsans] overflow-hidden mt-15">
      {/* Hero Section with Enhanced Background */}
      <section className="relative bg-gradient-to-br from-[#2C7EAD] via-[#1E5F8B] to-[#0D3B66] text-white py-32 px-6 md:px-20 text-center overflow-hidden">
        {/* Animated Background Elements */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-40 -left-40 w-80 h-80 bg-[#00AEEF]/20 rounded-full blur-3xl"></div>
          <div className="absolute top-1/2 right-0 w-96 h-96 bg-[#FFD700]/10 rounded-full blur-3xl"></div>
          <div className="absolute bottom-0 left-1/4 w-64 h-64 bg-white/5 rounded-full blur-2xl"></div>
        </div>

        <div className="relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="inline-flex items-center gap-2 px-4 py-2 bg-white/10 backdrop-blur-sm rounded-full mb-6"
          >
            <Sparkles className="w-4 h-4 text-yellow-300" />
            <span className="text-sm">Leading Educational Recruitment Platform</span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-5xl md:text-7xl font-bold mb-6 leading-tight"
          >
            Shaping the <span className="text-[#FFD700]">Future</span> of <br />
            Educational Recruitment
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.2 }}
            className="max-w-3xl mx-auto text-xl text-white/90 mb-10 leading-relaxed"
          >
            Empowering schools and teachers through smarter, faster, and more transparent 
            recruitment — connecting talent with opportunity across Middle East.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="flex flex-wrap justify-center gap-4"
          >
            <button 
              onClick={handleExplorePlatform}
              className="px-8 py-4 bg-gradient-to-r from-[#FFD700] to-[#FF9F43] text-gray-900 font-bold rounded-xl hover:shadow-2xl hover:scale-105 transition-all duration-300 flex items-center gap-2 cursor-pointer"
            >
              <BookOpen className="w-5 h-5" />
              Explore Platform
            </button>
            <button 
              onClick={handleMeetTeam}
              className="px-8 py-4 bg-white/10 backdrop-blur-sm border-2 border-white/30 text-white font-bold rounded-xl hover:bg-white hover:text-[#2C7EAD] transition-all duration-300 flex items-center gap-2 cursor-pointer"
            >
              <Users className="w-5 h-5" />
              Meet Our Team
            </button>
          </motion.div>
        </div>
      </section>

      {/* Quick Stats Bar */}
      <section className="bg-white py-12 border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-6 md:px-20">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {statsData.map((stat, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                viewport={{ once: true }}
                className="text-center"
              >
                {stat.loading ? (
                  <StatSkeleton />
                ) : (
                  <>
                    <div className="inline-flex p-3 bg-gradient-to-br from-blue-50 to-cyan-50 rounded-xl mb-4">
                      <div className="text-[#2C7EAD]">{stat.icon}</div>
                    </div>
                    <div className="text-3xl font-bold text-gray-900 mb-2">{stat.value}</div>
                    <div className="text-gray-600">{stat.label}</div>
                  </>
                )}
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Who We Are Section */}
      <section className="py-24 bg-gradient-to-b from-white to-gray-50">
        <div className="max-w-7xl mx-auto px-6 md:px-20">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            {/* Image Section */}
            <motion.div
              initial={{ opacity: 0, x: -40 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="relative"
            >
              <div className="relative z-10">
                <img
                  src={aboutImg}
                  alt="About TeachingPath"
                  className="w-full rounded-3xl shadow-2xl hover:shadow-3xl transition-all duration-500"
                />
              </div>
              
              {/* Floating Elements */}
              <motion.div
                animate={{ y: [0, -10, 0] }}
                transition={{ repeat: Infinity, duration: 2 }}
                className="absolute -top-6 -right-6 bg-gradient-to-r from-[#FFD700] to-[#FF9F43] p-6 rounded-2xl shadow-xl"
              >
                <Award className="w-8 h-8 text-white" />
              </motion.div>
              
              <motion.div
                animate={{ y: [0, 10, 0] }}
                transition={{ repeat: Infinity, duration: 2, delay: 0.5 }}
                className="absolute -bottom-6 -left-6 bg-gradient-to-r from-[#2C7EAD] to-[#00AEEF] p-6 rounded-2xl shadow-xl"
              >
                <Target className="w-8 h-8 text-white" />
              </motion.div>
            </motion.div>

         {/* Content Section */}
<motion.div
  initial={{ opacity: 0, x: 40 }}
  whileInView={{ opacity: 1, x: 0 }}
  viewport={{ once: true }}
>
  <div className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-100 to-cyan-100 rounded-full mb-6">
    <Sparkles className="w-4 h-4 text-blue-600" />
    <span className="text-sm font-medium text-blue-700">Welcome to TeachingPath</span>
  </div>

  <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-2 leading-tight">
    Nida Iqbal Shah
  </h2>
  <p className="text-xl text-gray-700 mb-1">Founder & CEO</p>
  <p className="text-md text-gray-500 mb-6">PGCERT Education Hertfordshire</p>

  <div className="space-y-6 text-gray-600 text-lg leading-relaxed">
    <h3 className="text-2xl font-bold text-gray-900">
      The Future of Educational Recruitment
    </h3>
    <p className="text-gray-500 italic">
      Finding the right educators shouldn't be a gamble.
    </p>

    <p>
      <strong className="text-gray-900">TeachingPath</strong> is an advanced HR platform built specifically for schools seeking highly qualified, rigorously scrutinized, and curriculum-ready teaching talent. We bridge the gap between premier international institutions and exceptional global educators through a secure, data-driven ecosystem.
    </p>

    <h4 className="text-xl font-semibold text-gray-900 mt-6">
      Key Features at a Glance
    </h4>

    <div className="space-y-4 mt-4">
      {[
        "Verified Candidate Pool: Standardize your peace of mind. Every educator in our network undergoes comprehensive credential verification, strict background screening, and thorough employment history checks.",
        "The Global Talent Advantage: Instantly tap into an elite Global Talent Network specializing in major international frameworks, including British, American, IB, and Cambridge curricula.",
        "Professional School Profiles: Showcase your institution's unique culture, leadership, and career opportunities to attract top-tier talent that aligns with your school's vision."
      ].map((feature, index) => (
        <div key={index} className="flex items-start gap-3">
          <div className="p-2 bg-green-100 rounded-lg flex-shrink-0 mt-0.5">
            <CheckCircle className="w-4 h-4 text-green-600" />
          </div>
          <span>{feature}</span>
        </div>
      ))}
    </div>

    <div className="mt-8 p-6 bg-blue-50 border-l-4 border-blue-600 rounded-r-lg">
      <p className="text-gray-700 font-medium">
        <span className="text-blue-700 font-bold">Our Promise:</span> We strip the complexity out of institutional hiring, ensuring your classrooms are led by vetted, world-class professionals who are ready to inspire from day one.
      </p>
    </div>
  </div>
</motion.div>
          </div>
        </div>
      </section>

      {/* Mission & Vision Cards */}
      <section className="py-24 bg-gradient-to-br from-blue-50 via-white to-cyan-50">
        <div className="max-w-7xl mx-auto px-6 md:px-20">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Our <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#2C7EAD] to-[#00AEEF]">Purpose</span>
            </h2>
            <p className="text-gray-600 text-lg max-w-2xl mx-auto">
              Driving excellence in education through innovative recruitment solutions
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Mission Card */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="relative group"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-cyan-600 rounded-3xl transform group-hover:scale-105 transition-transform duration-500"></div>
              <div className="relative bg-white rounded-3xl p-10 shadow-2xl hover:shadow-3xl transition-all duration-500 border border-gray-100">
                <div className="inline-flex p-4 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-2xl mb-6">
                  <Target className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-4">Our Mission</h3>
                <p className="text-gray-600 text-lg leading-relaxed mb-6">
                  To revolutionize educational recruitment in Middle East by leveraging technology to create 
                  meaningful connections between exceptional educators and schools, ensuring every student has 
                  access to quality education.
                </p>
                <div className="grid grid-cols-2 gap-4">
                  {["Transparency", "Efficiency", "Quality", "Innovation"].map((item, idx) => (
                    <div key={idx} className="flex items-center gap-2">
                      <CheckCircle className="w-4 h-4 text-green-500" />
                      <span className="text-sm font-medium text-gray-700">{item}</span>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>

            {/* Vision Card */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="relative group"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-emerald-500 to-teal-600 rounded-3xl transform group-hover:scale-105 transition-transform duration-500"></div>
              <div className="relative bg-white rounded-3xl p-10 shadow-2xl hover:shadow-3xl transition-all duration-500 border border-gray-100">
                <div className="inline-flex p-4 bg-gradient-to-br from-emerald-500 to-teal-500 rounded-2xl mb-6">
                  <Globe className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-4">Our Vision</h3>
                <p className="text-gray-600 text-lg leading-relaxed mb-6">
                  To become the definitive platform for educational recruitment in the Middle East, 
                  recognized for our commitment to excellence, innovation, and positive impact on 
                  the educational landscape.
                </p>
                <div className="grid grid-cols-2 gap-4">
                  {["Leadership", "Growth", "Impact", "Excellence"].map((item, idx) => (
                    <div key={idx} className="flex items-center gap-2">
                      <CheckCircle className="w-4 h-4 text-green-500" />
                      <span className="text-sm font-medium text-gray-700">{item}</span>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Our Values */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-6 md:px-20">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Our <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#FF6B6B] to-[#4ECDC4]">Core Values</span>
            </h2>
            <p className="text-gray-600 text-lg max-w-2xl mx-auto">
              The principles that guide everything we do
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {values.map((value, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ scale: 1.05 }}
                className="group"
              >
                <div className={`bg-gradient-to-br ${value.color} rounded-2xl p-8 text-white shadow-xl hover:shadow-2xl transition-all duration-300 h-full`}>
                  <div className="p-4 bg-white/20 rounded-xl w-fit mb-6 backdrop-blur-sm">
                    {value.icon}
                  </div>
                  <h3 className="text-xl font-bold mb-3">{value.title}</h3>
                  <p className="text-white/90">{value.description}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Timeline / Milestones */}
      <section className="py-24 bg-gradient-to-br from-gray-50 to-white">
        <div className="max-w-7xl mx-auto px-6 md:px-20">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Our <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#2C7EAD] to-[#00AEEF]">Journey</span>
            </h2>
            <p className="text-gray-600 text-lg max-w-2xl mx-auto">
              Milestones in our mission to transform educational recruitment
            </p>
          </div>

          <div className="relative">
            {/* Timeline Line */}
            <div className="absolute left-1/2 transform -translate-x-1/2 w-1 h-full bg-gradient-to-b from-[#2C7EAD] to-[#00AEEF]"></div>

            {/* Milestones */}
            <div className="space-y-12">
              {milestones.map((milestone, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: index % 2 === 0 ? -40 : 40 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  className={`relative flex items-center ${
                    index % 2 === 0 ? 'justify-start' : 'justify-end'
                  }`}
                >
                  <div className={`w-1/2 ${index % 2 === 0 ? 'pr-12 text-right' : 'pl-12'}`}>
                    <div className="bg-white rounded-2xl p-8 shadow-xl hover:shadow-2xl transition-all duration-300 border border-gray-100">
                      <div className="text-5xl font-bold text-[#2C7EAD] mb-2">{milestone.year}</div>
                      <h3 className="text-xl font-bold text-gray-900 mb-2">{milestone.title}</h3>
                      <p className="text-gray-600">{milestone.description}</p>
                    </div>
                  </div>
                  
                  {/* Timeline Dot */}
                  <div className="absolute left-1/2 transform -translate-x-1/2">
                    <div className="w-6 h-6 bg-gradient-to-r from-[#2C7EAD] to-[#00AEEF] rounded-full border-4 border-white shadow-lg"></div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>
{/* Team Section */}
<section className="py-24 bg-white">
  <div className="max-w-7xl mx-auto px-6 md:px-20">
    {/* Heading */}
    <div className="text-center mb-16">
      <h2 className="text-4xl font-bold text-gray-900 mb-4">
        Meet Our{" "}
        <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#FF6B6B] to-[#4ECDC4]">
          Leadership
        </span>
      </h2>

      <p className="text-gray-600 text-lg max-w-2xl mx-auto">
        The passionate team driving our mission forward
      </p>
    </div>

    {/* Team Cards */}
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 items-stretch">
      {teamMembers.map((member, index) => (
        <motion.div
          key={index}
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: index * 0.1 }}
          whileHover={{ y: -8, scale: 1.02 }}
          className="group h-full"
        >
          <div className="bg-white rounded-3xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden border border-gray-100 h-[500px] flex flex-col">

         {/* Top Section */}
<div
  className={`bg-gradient-to-br ${member.color} h-64 flex items-center justify-center`}
>
  <div className="w-44 h-44 rounded-full bg-white border-4 border-white shadow-xl flex items-center justify-center overflow-hidden">
    <img
      src={member.avatar}
      alt={member.name}
      className="w-full h-full object-contain"
    />
  </div>
</div>

            {/* Content */}
            <div className="flex flex-col flex-grow justify-between p-6 text-center">

              <div>
                <h3 className="text-2xl font-bold text-gray-900 h-16 flex items-center justify-center leading-tight">
                  {member.name}
                </h3>

                <p className="text-[#2C7EAD] font-semibold text-lg mt-2">
                  {member.role}
                </p>

                <p className="text-gray-600 text-sm mt-4 leading-relaxed">
                  {member.expertise}
                </p>
              </div>

            </div>

          </div>
        </motion.div>
      ))}
    </div>
  </div>
</section>

      {/* CTA Section */}
      <section className="py-24 bg-gradient-to-br from-[#2C7EAD] via-[#1E5F8B] to-[#0D3B66] text-white overflow-hidden">
        {/* Background Elements */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-full">
            {[...Array(15)].map((_, i) => (
              <motion.div
                key={i}
                className="absolute w-1 h-1 bg-white rounded-full"
                style={{
                  left: `${Math.random() * 100}%`,
                  top: `${Math.random() * 100}%`,
                }}
                animate={{
                  y: [0, -30, 0],
                  opacity: [0, 1, 0],
                }}
                transition={{
                  duration: Math.random() * 3 + 2,
                  repeat: Infinity,
                  delay: Math.random() * 2,
                }}
              />
            ))}
          </div>
        </div>

        <div className="relative max-w-4xl mx-auto px-6 md:px-20 text-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl font-bold mb-6">
              Ready to Transform Educational Recruitment?
            </h2>
            <p className="text-xl text-white/80 mb-10 max-w-2xl mx-auto">
              Join {formatNumber(stats.totalTeachers)}+ teachers and {formatNumber(stats.totalSchools)}+ schools who trust TeachingPath for their recruitment needs
            </p>
            
            <div className="flex flex-col sm:flex-row gap-6 justify-center">
              <button 
                onClick={handleGetStarted}
                className="px-10 py-5 bg-gradient-to-r from-[#FFD700] to-[#FF9F43] text-gray-900 font-bold rounded-xl hover:shadow-2xl hover:scale-105 transition-all duration-300 shadow-lg cursor-pointer"
              >
                Get Started for Free
              </button>
              <button 
                onClick={handleScheduleDemo}
                className="px-10 py-5 bg-white/10 backdrop-blur-sm border-2 border-white/30 text-white font-bold rounded-xl hover:bg-white hover:text-[#2C7EAD] hover:scale-105 transition-all duration-300 cursor-pointer"
              >
                Schedule a Demo
              </button>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default About;