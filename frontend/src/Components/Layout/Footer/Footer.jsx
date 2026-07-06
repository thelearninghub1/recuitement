// src/Components/Layout/Footer/Footer.jsx
import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { useDispatch, useSelector } from 'react-redux';
import logo from "../../../assets/logo.png";

import {
  Facebook,
  Twitter,
  Linkedin,
  Instagram,
  Mail,
  Phone,
  MapPin,
  Building,
  User,
  BookOpen,
  Heart,
  ArrowRight,
  Sparkles,
  Globe,
  Shield,
  Zap,
  CheckCircle,
  MessageSquare,
  Clock,
  Users,
  Star,
  Briefcase,
  DollarSign,
  BarChart,
  Search,
  ChevronRight,
  ExternalLink,
  GraduationCap,
  Award,
  TrendingUp,
  Crown
} from "lucide-react";
import { Link } from "react-router-dom";
import { allUserAction } from "../../../actions/userActions";
import { getJobs } from "../../../actions/jobActions";

const Footer = () => {
  const dispatch = useDispatch();
  
  // Redux states
  const { users = [], loading: usersLoading } = useSelector((state) => state.allUsers || { users: [] });
  const { loading: jobsLoading, jobs = [] } = useSelector((state) => state.allJobs || { jobs: [] });
  
  const [stats, setStats] = useState({
    totalSchools: 0,
    totalTeachers: 0,
    totalMatches: 0,
    satisfactionRate: '98%'
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
        console.error('Error loading footer data:', error);
      }
    };
    
    loadData();
  }, [dispatch]);

  // Update stats when users data changes
  useEffect(() => {
    if (users && users.length > 0) {
      const teachers = users.filter(user => user.role === 'candidate');
      const schools = users.filter(user => user.role === 'school');
      
      // Calculate total matches (applications)
      const totalApplications = jobs.reduce((sum, job) => sum + (job.applicationCount || 0), 0);
      
      setStats({
        totalSchools: schools.length,
        totalTeachers: teachers.length,
        totalMatches: totalApplications,
        satisfactionRate: '98%'
      });
    }
  }, [users, jobs]);

  return (
    <footer className="relative overflow-hidden font-[Parkinsans] bg-gradient-to-b from-gray-900 via-gray-800 to-black text-white">
      {/* Animated Background Effects */}
      <div className="absolute inset-0 overflow-hidden">
        {/* Gradient Mesh */}
        <div className="absolute inset-0 bg-gradient-to-br from-[#00AEEF]/5 via-transparent to-[#FFD700]/5"></div>
        
        {/* Animated Orbs */}
        <motion.div
          className="absolute top-1/3 left-1/4 w-96 h-96 bg-gradient-to-br from-[#00AEEF]/10 to-transparent rounded-full blur-3xl"
          animate={{
            scale: [1, 1.1, 1],
            opacity: [0.3, 0.5, 0.3],
          }}
          transition={{
            duration: 6,
            repeat: Infinity,
          }}
        />
        <motion.div
          className="absolute bottom-1/3 right-1/4 w-64 h-64 bg-gradient-to-br from-[#FFD700]/10 to-transparent rounded-full blur-3xl"
          animate={{
            scale: [1.1, 1, 1.1],
            opacity: [0.2, 0.4, 0.2],
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
          }}
        />
      </div>

      {/* Main Content */}
      <div className="relative z-10 max-w-7xl mx-auto px-6 py-12">
        
        {/* TOP SECTION - Logo & Tagline */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          {/* Logo */}
          <Link to="/" className="inline-block cursor-pointer">
            <img src={logo} alt="TeachingPath" className="w-72 h-auto object-contain mx-auto" />
          </Link>
          
          {/* Decorative Line */}
          <div className="flex items-center justify-center gap-4 mt-4 mb-4">
            <div className="h-px w-16 bg-gradient-to-r from-transparent to-[#00AEEF]/50"></div>
            <div className="w-2 h-2 rounded-full bg-[#FFD700]"></div>
            <div className="h-px w-16 bg-gradient-to-l from-transparent to-[#00AEEF]/50"></div>
          </div>
          
          {/* Tagline */}
          <p className="text-gray-300 text-lg max-w-3xl mx-auto leading-relaxed font-light tracking-wide">
            Connecting exceptional talent with leading educational institutions across the Middle East
          </p>
          
          {/* Trust Indicators */}
          <div className="flex items-center justify-center gap-6 mt-4 text-sm text-gray-500">
            <span className="flex items-center gap-2">
              <Shield className="w-4 h-4 text-emerald-400" />
              Trusted Platform
            </span>
            <span className="w-px h-4 bg-white/10"></span>
            <span className="flex items-center gap-2">
              <Users className="w-4 h-4 text-blue-400" />
              {users.length}+ Users
            </span>
            <span className="w-px h-4 bg-white/10"></span>
            <span className="flex items-center gap-2">
              <Star className="w-4 h-4 text-yellow-400" />
              4.9 Rating
            </span>
          </div>
        </motion.div>

        {/* Quick Links Section */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
          {/* For Schools */}
          <div>
            <h3 className="font-bold text-white mb-6 flex items-center gap-2">
              <div className="p-2 bg-gradient-to-br from-[#00AEEF] to-cyan-500 rounded-lg">
                <Building className="w-4 h-4 text-white" />
              </div>
              <span>For Schools</span>
            </h3>
            <ul className="space-y-3">
              {[
                { name: "Post Jobs", path: "/school-login" },
                { name: "Browse Teachers", path: "/teachers" },
                { name: "Pricing", path: "/pricing" },
              ].map((item) => (
                <li key={item.name}>
                  <Link
                    to={item.path}
                    className="text-gray-400 hover:text-[#00AEEF] text-sm transition-colors duration-300 flex items-center gap-2 group"
                  >
                    <ChevronRight className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                    {item.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* For Teachers */}
          <div>
            <h3 className="font-bold text-white mb-6 flex items-center gap-2">
              <div className="p-2 bg-gradient-to-br from-[#0077BB] to-blue-600 rounded-lg">
                <User className="w-4 h-4 text-white" />
              </div>
              <span>For Teachers</span>
            </h3>
            <ul className="space-y-3">
              {[
                { name: "Find Jobs", path: "/school/post" },
                { name: "Privacy Policy", path: "/privacy-policy" },
                { name: "Contact Us", path:"/contact-us" },
              ].map((item) => (
                <li key={item.name}>
                  <Link
                    to={item.path}
                    className="text-gray-400 hover:text-[#0077BB] text-sm transition-colors duration-300 flex items-center gap-2 group"
                  >
                    <ChevronRight className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                    {item.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="font-bold text-white mb-6 flex items-center gap-2">
              <div className="p-2 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-lg">
                <MessageSquare className="w-4 h-4 text-white" />
              </div>
              <span>Contact</span>
            </h3>
            <ul className="space-y-4">
              <li className="flex items-center gap-3">
                <div className="p-2 bg-gradient-to-br from-[#00AEEF]/20 to-[#0077BB]/20 rounded-lg">
                  <Mail className="w-4 h-4 text-[#00AEEF]" />
                </div>
                <div>
                  <p className="text-xs text-gray-500">Email</p>
                  <a href="mailto:info@theteachingpath.com" className="text-sm text-white hover:text-[#00AEEF]">
                  info@theteachingpath.com
                  </a>
                </div>
              </li>
              <li className="flex items-center gap-3">
                <div className="p-2 bg-gradient-to-br from-[#00AEEF]/20 to-[#0077BB]/20 rounded-lg">
                  <Phone className="w-4 h-4 text-[#00AEEF]" />
                </div>
                <div>
                  <p className="text-xs text-gray-500">Phone</p>
                  <a href="tel:+966503865055" className="text-sm text-white hover:text-[#00AEEF]">
                    00966503865055
                  </a>
                </div>
              </li>
            </ul>
          </div>
        </div>

        {/* Stats Banner - Real Data */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="bg-gradient-to-r from-white/5 to-transparent rounded-xl p-6 mb-12 border border-white/10 backdrop-blur-sm"
        >
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {[
              { value: `${stats.totalSchools.toLocaleString()}+`, label: "Schools", gradient: "from-[#00AEEF] to-[#0077BB]" },
              { value: `${stats.totalTeachers.toLocaleString()}+`, label: "Teachers", gradient: "from-emerald-500 to-teal-600" },
              { value: `${stats.totalMatches.toLocaleString()}+`, label: "Matches", gradient: "from-green-500 to-emerald-500" },
              { value: stats.satisfactionRate, label: "Satisfaction", gradient: "from-[#FFD700] to-[#FF9F43]" },
            ].map((stat, idx) => (
              <div key={idx} className="text-center">
                <div className={`text-3xl font-bold bg-gradient-to-br ${stat.gradient} bg-clip-text text-transparent mb-2`}>
                  {usersLoading ? "..." : stat.value}
                </div>
                <div className="text-sm text-gray-300">{stat.label}</div>
              </div>
            ))}
          </div>
        </motion.div>

        {/* BOTTOM SECTION - Product of TLH */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="border-t border-white/10 pt-12"
        >
          <div className="flex flex-col items-center">
            {/* Decorative Divider */}
            <div className="flex items-center gap-4 mb-6">
              <div className="h-px w-12 bg-gradient-to-r from-transparent to-[#FFD700]/30"></div>
              <Crown className="w-4 h-4 text-[#FFD700]" />
              <div className="h-px w-12 bg-gradient-to-l from-transparent to-[#FFD700]/30"></div>
            </div>

            {/* Product Of Badge */}
            <div className="text-center mb-4">
              <span className="text-xs font-medium text-gray-500 uppercase tracking-[0.2em]">
Product of The Learning Hub              </span>
            </div>

            {/* Main Partner Card - Enhanced */}
            <a
              href="https://thelearninghubedu.com/"
              target="_blank"
              rel="noopener noreferrer"
              className="group relative w-full max-w-2xl"
            >
              <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-purple-500/10 via-pink-500/10 to-purple-500/10 border border-white/10 hover:border-purple-500/40 transition-all duration-500 backdrop-blur-sm">
                
                {/* Animated Shimmer Effect */}
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
                
                {/* Glow Effect */}
                <div className="absolute -inset-1 bg-gradient-to-r from-purple-500/0 via-purple-500/10 to-purple-500/0 group-hover:opacity-100 opacity-0 blur-xl transition-opacity duration-500"></div>
                
                <div className="relative p-6 flex items-center gap-6">
                  {/* Icon with Premium Badge */}
                  <div className="relative flex-shrink-0">
                    <div className="absolute inset-0 bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl blur-xl opacity-50 group-hover:opacity-75 transition-opacity duration-300"></div>
                    <div className="relative w-16 h-16 bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl flex items-center justify-center shadow-xl group-hover:scale-110 transition-transform duration-300">
                      <GraduationCap className="w-8 h-8 text-white" />
                      {/* Premium Badge */}
                      <div className="absolute -top-1 -right-1 w-5 h-5 bg-gradient-to-br from-[#FFD700] to-[#FF9F43] rounded-full flex items-center justify-center shadow-lg">
                        <Star className="w-3 h-3 text-white fill-white" />
                      </div>
                    </div>
                  </div>

                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-3 mb-1">
                      <h4 className="text-white font-bold text-xl group-hover:text-transparent group-hover:bg-gradient-to-r group-hover:from-purple-400 group-hover:to-pink-400 group-hover:bg-clip-text transition-all duration-300">
                        The Learning Hub
                      </h4>
                      <span className="px-3 py-1 bg-gradient-to-r from-purple-500/30 to-pink-500/30 text-white text-[10px] font-semibold rounded-full border border-purple-500/30 backdrop-blur-sm">
                        International
                      </span>
                    </div>
                    <p className="text-gray-400 text-sm group-hover:text-gray-300 transition-colors duration-300">
                      International Online School • Excellence in Education
                    </p>
                    
                    {/* Trust Metrics */}
                    <div className="flex items-center gap-4 mt-2">
                      <div className="flex items-center gap-1.5 text-xs text-gray-500">
                        <Users className="w-3.5 h-3.5 text-purple-400" />
                        <span>2500+ Students</span>
                      </div>
                      <div className="w-px h-3 bg-white/10"></div>
                      <div className="flex items-center gap-1.5 text-xs text-gray-500">
                        <Globe className="w-3.5 h-3.5 text-pink-400" />
                        <span>Global Reach</span>
                      </div>
                      <div className="w-px h-3 bg-white/10"></div>
                      <div className="flex items-center gap-1.5 text-xs text-gray-500">
                        <Award className="w-3.5 h-3.5 text-yellow-400" />
                        <span>Accredited</span>
                      </div>
                    </div>
                  </div>

                  {/* Arrow Button */}
                  <div className="flex-shrink-0 ml-2">
                    <div className="w-12 h-12 rounded-full bg-gradient-to-br from-purple-500/20 to-pink-500/20 group-hover:from-purple-500/40 group-hover:to-pink-500/40 flex items-center justify-center transition-all duration-300 group-hover:scale-110 border border-white/10 group-hover:border-purple-500/30">
                      <ExternalLink className="w-5 h-5 text-gray-400 group-hover:text-purple-400 transition-colors duration-300" />
                    </div>
                  </div>
                </div>
              </div>
            </a>

            {/* Footer Bottom */}
            <div className="w-full mt-8 pt-8 border-t border-white/10">
              <div className="flex flex-col md:flex-row justify-between items-center gap-4">
                <p className="text-sm text-gray-500 text-center md:text-left">
                  © {new Date().getFullYear()} TeachingPath. All rights reserved.
                </p>
                
                {/* Trust Badges */}
                <div className="flex flex-wrap justify-center gap-6">
                  <div className="flex items-center gap-2 text-sm text-gray-400">
                    <Shield className="w-4 h-4 text-green-500" />
                    <span>Secure Platform</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-400">
                    <Zap className="w-4 h-4 text-yellow-500" />
                    <span>Fast & Reliable</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-400">
                    <CheckCircle className="w-4 h-4 text-blue-500" />
                    <span>Verified Profiles</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Back to Top Button */}
      <motion.button
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
        className="fixed bottom-6 right-6 z-50 w-12 h-12 bg-gradient-to-br from-[#00AEEF] to-[#0077BB] text-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 flex items-center justify-center"
      >
        <ArrowRight className="w-5 h-5 -rotate-90" />
      </motion.button>
    </footer>
  );
};

export default Footer;