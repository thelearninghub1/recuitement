import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Users, 
  Building, 
  Briefcase, 
  GraduationCap, 
  Search, 
  Filter,
  BarChart,
  Shield,
  Zap,
  Clock,
  DollarSign,
  MapPin,
  BookOpen,
  CheckCircle,
  ArrowRight,
  Star,
  Award,
  Target,
  Globe,
  MessageSquare,
  FileText,
  UserCheck,
  School,
  TrendingUp,
  Heart,
  Calendar,
  Phone,
  Mail,
  Sparkles,
  Rocket,
  Crown,
  ThumbsUp,
  ChevronRight,
  Eye,
  UserPlus,
  Building2,
  ExternalLink,
  Bookmark,
  Award as AwardIcon,
  Languages,
  Target as TargetIcon,
  FileCheck,
  Shield as ShieldIcon,
  Users as UsersIcon,
  Home,
  FileBadge,
  Trophy,
  Sparkles as SparklesIcon,
  Plane,
  ShieldCheck,
  Stethoscope,
  Zap as ZapIcon,
  TrendingUp as TrendingUpIcon,
  Globe as GlobeIcon,
  Users as UsersGroupIcon,
  ChevronLeft,
  ChevronRight as ChevronRightIcon,
  Pause,
  Play
} from 'lucide-react';
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import { allUserAction } from '../../../actions/userActions';
import { getJobs } from '../../../actions/jobActions';
import { getAllPlans } from '../../../actions/planActions';


const HomePage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  
  // Redux states
  const { users = [], loading: usersLoading } = useSelector((state) => state.allUsers);
  const { loading: jobsLoading, jobs = [] } = useSelector((state) => state.allJobs);
  const { loading: plansLoading, plans = [] } = useSelector((state) => state.getAllPlans);
  
  // Local states
  const [stats, setStats] = useState({
    totalTeachers: 0,
    totalSchools: 0,
    activeJobs: 0,
    successfulMatches: 0,
    totalApplications: 0,
    avgResponseTime: '24'
  });
  
  const [featuredTeachers, setFeaturedTeachers] = useState([]);
  const [featuredSchools, setFeaturedSchools] = useState([]);
  const [featuredJobs, setFeaturedJobs] = useState([]);
  const [membershipPlans, setMembershipPlans] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('teachers');
  const [hoveredCard, setHoveredCard] = useState(null);
  
  // Slider states
  const [jobSliderIndex, setJobSliderIndex] = useState(0);
  const [teacherSliderIndex, setTeacherSliderIndex] = useState(0);
  const [schoolSliderIndex, setSchoolSliderIndex] = useState(0);
  const [isJobSliderPlaying, setIsJobSliderPlaying] = useState(true);
  const [isTeacherSliderPlaying, setIsTeacherSliderPlaying] = useState(true);
  const [isSchoolSliderPlaying, setIsSchoolSliderPlaying] = useState(true);
  const [billingCycle, setBillingCycle] = useState("annual");

  // Refs for sliders
  const jobSliderRef = useRef(null);
  const teacherSliderRef = useRef(null);
  const schoolSliderRef = useRef(null);

  // Helper function to get job title display
  const getJobTitleDisplay = (job) => {
    if (job.jobTitle && job.jobTitle !== 'Other') {
      return job.jobTitle;
    }
    if (job.jobTitleOther) {
      return job.jobTitleOther;
    }
    return 'Teaching Position';
  };

  // Define color palette
  const colors = {
    primary: {
      blue: '#2563eb',
      darkBlue: '#1d4ed8',
      lightBlue: '#3b82f6'
    },
    secondary: {
      gold: '#f59e0b',
      emerald: '#10b981',
      purple: '#8b5cf6',
      coral: '#ef4444',
      teal: '#0d9488'
    }
  };

  // Auto-slider for jobs
  useEffect(() => {
    if (!isJobSliderPlaying || featuredJobs.length <= 1) return;
    
    const interval = setInterval(() => {
      setJobSliderIndex((prev) => (prev + 1) % featuredJobs.length);
    }, 4000);
    
    return () => clearInterval(interval);
  }, [isJobSliderPlaying, featuredJobs.length]);

  // Auto-slider for teachers
  useEffect(() => {
    if (!isTeacherSliderPlaying || featuredTeachers.length <= 1) return;
    
    const interval = setInterval(() => {
      setTeacherSliderIndex((prev) => (prev + 1) % featuredTeachers.length);
    }, 4000);
    
    return () => clearInterval(interval);
  }, [isTeacherSliderPlaying, featuredTeachers.length]);

  // Auto-slider for schools
  useEffect(() => {
    if (!isSchoolSliderPlaying || featuredSchools.length <= 1) return;
    
    const interval = setInterval(() => {
      setSchoolSliderIndex((prev) => (prev + 1) % featuredSchools.length);
    }, 4000);
    
    return () => clearInterval(interval);
  }, [isSchoolSliderPlaying, featuredSchools.length]);

  // Slider navigation functions
  const nextJob = () => {
    setJobSliderIndex((prev) => (prev + 1) % featuredJobs.length);
    setIsJobSliderPlaying(false);
    setTimeout(() => setIsJobSliderPlaying(true), 10000);
  };

  const handleJoinAsTeacher = () => {
    console.log("Join as Teacher button clicked");
    console.log("Navigating to:", '/teacher-register');
    try {
      navigate('/teacher-register');
    } catch (error) {
      console.error("Navigation error:", error);
    }
  };

  const handleHireTeachers = () => {
    console.log("Hire Teachers button clicked");
    console.log("Navigating to:", '/teachers');
    try {
      navigate('/teachers');
    } catch (error) {
      console.error("Navigation error:", error);
    }
  };

  const prevJob = () => {
    setJobSliderIndex((prev) => (prev - 1 + featuredJobs.length) % featuredJobs.length);
    setIsJobSliderPlaying(false);
    setTimeout(() => setIsJobSliderPlaying(true), 10000);
  };

  const nextTeacher = () => {
    setTeacherSliderIndex((prev) => (prev + 1) % featuredTeachers.length);
    setIsTeacherSliderPlaying(false);
    setTimeout(() => setIsTeacherSliderPlaying(true), 10000);
  };

  const prevTeacher = () => {
    setTeacherSliderIndex((prev) => (prev - 1 + featuredTeachers.length) % featuredTeachers.length);
    setIsTeacherSliderPlaying(false);
    setTimeout(() => setIsTeacherSliderPlaying(true), 10000);
  };

  const nextSchool = () => {
    setSchoolSliderIndex((prev) => (prev + 1) % featuredSchools.length);
    setIsSchoolSliderPlaying(false);
    setTimeout(() => setIsSchoolSliderPlaying(true), 10000);
  };

  const prevSchool = () => {
    setSchoolSliderIndex((prev) => (prev - 1 + featuredSchools.length) % featuredSchools.length);
    setIsSchoolSliderPlaying(false);
    setTimeout(() => setIsSchoolSliderPlaying(true), 10000);
  };

  // Load initial data including plans
  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      try {
        await Promise.all([
          dispatch(allUserAction()),
          dispatch(getJobs()),
          dispatch(getAllPlans())
        ]);
      } catch (error) {
        console.error('Error loading data:', error);
        toast.error('Failed to load platform data');
      } finally {
        setLoading(false);
      }
    };
    
    loadData();
  }, [dispatch]);

  // Transform API plans to UI format for membership section
  const transformPlansForMembership = () => {
    if (!plans || plans.length === 0) return [];
    
    const sortedPlans = [...plans].sort((a, b) => (a.displayOrder || 0) - (b.displayOrder || 0));
    
    return sortedPlans.map((plan) => {
      let color = "from-blue-500 to-cyan-500";
      let icon = <Rocket className="w-8 h-8" />;
      
      if (plan.popular) {
        color = "from-emerald-500 to-teal-500";
        icon = <TrendingUp className="w-8 h-8" />;
      } else if (plan.name.toLowerCase().includes("premium")) {
        color = "from-purple-500 to-pink-500";
        icon = <Crown className="w-8 h-8" />;
      } else if (plan.name.toLowerCase().includes("enterprise")) {
        color = "from-orange-500 to-red-500";
        icon = <Building className="w-8 h-8" />;
      }
      
      const monthlyPrice = plan.prices?.monthly ? plan.prices.monthly : null;
      const yearlyPrice = plan.prices?.yearly ? plan.prices.yearly : null;
      
      const features = [];
      
      if (plan.limits) {
        if (plan.limits.maxJobs) {
          features.push(plan.limits.maxJobs === -1 ? "Unlimited Job Posts" : `${plan.limits.maxJobs} Active Job Posts`);
        }
        if (plan.limits.maxCvsDownloadMonthly) {
          features.push(plan.limits.maxCvsDownloadMonthly === -1 ? "Unlimited Monthly CV Downloads" : `${plan.limits.maxCvsDownloadMonthly} Monthly CV Downloads`);
        }
        if (plan.limits.maxCvsDownloadYearly) {
          features.push(plan.limits.maxCvsDownloadYearly === -1 ? "Unlimited Yearly CV Downloads" : `${plan.limits.maxCvsDownloadYearly} Yearly CV Downloads`);
        }
      }
      
      if (plan.features && plan.features.length > 0) {
        plan.features.slice(0, 7).forEach(feature => {
          if (typeof feature === 'string') {
            features.push(feature);
          } else if (feature.name) {
            features.push(feature.name);
          }
        });
      }
      
      if (features.length < 5) {
        const defaultFeatures = [
          "Verified Teacher Profiles",
          "Advanced Search Filters",
          "Email Support",
          "School Branding Available"
        ];
        defaultFeatures.forEach(f => {
          if (!features.includes(f)) features.push(f);
        });
      }
      
      return {
        id: plan._id,
        name: plan.name,
        monthlyPrice: monthlyPrice ? `${monthlyPrice.toLocaleString()} SAR` : "Custom",
        yearlyPrice: yearlyPrice ? `${yearlyPrice.toLocaleString()} SAR` : "Custom",
        period: billingCycle === "monthly" ? "month" : "year",
        features: features,
        color: color,
        popular: plan.popular || false,
        icon: icon,
        description: plan.description || `Perfect for ${plan.name.toLowerCase()} educational institutions.`,
        savings: plan.savings || 0
      };
    });
  };

  // Process data when loaded
  useEffect(() => {
    if (users && jobs) {
      const teachers = users.filter(user => user.role === 'candidate') || [];
      const schools = users.filter(user => user.role === 'school') || [];
      const activeJobsList = jobs.filter(job => job.status === 'active') || [];
      const totalApps = jobs.reduce((sum, job) => sum + (job.applicationCount || 0), 0) || 0;
      
      setStats({
        totalTeachers: teachers.length,
        totalSchools: schools.length,
        activeJobs: activeJobsList.length,
        successfulMatches: Math.floor(teachers.length * 0.7),
        totalApplications: totalApps,
        avgResponseTime: '24'
      });
      
      // Get featured teachers (first 6 for slider)
      const featuredTeachersData = teachers.map(teacher => ({
        id: teacher._id,
        name: `${teacher.profile?.firstName || ''} ${teacher.profile?.lastName || ''}`.trim() || 'Teacher',
        avatar: `${teacher.profile?.firstName?.charAt(0) || 'T'}${teacher.profile?.lastName?.charAt(0) || ''}`,
        position: teacher.candidateData?.positionsInterested?.[0] || 'Teacher',
        experience: teacher.candidateData?.totalExperience || 'Not specified',
        education: teacher.candidateData?.degree === "Other" 
          ? teacher.candidateData.degreeOther 
          : teacher.candidateData?.degree || 'Education',
        location: teacher.candidateData?.currentCity || 'Saudi Arabia',
        skills: teacher.candidateData?.skills?.slice(0, 4) || ['Teaching', 'Education', 'Classroom Management'],
        rating: 4.8,
        isVerified: true,
        languages: teacher.candidateData?.languages?.slice(0, 2) || ['English', 'Arabic'],
        curriculum: teacher.candidateData?.curriculumTaught?.slice(0, 2) || ['International', 'American'],
        certifications: teacher.candidateData?.teachingLicense || 'Certified',
        badgeColor: ['#f59e0b', '#10b981', '#8b5cf6', '#ef4444'][Math.floor(Math.random() * 4)]
      }));
      
      // Get featured schools (first 6 for slider)
      const featuredSchoolsData = schools.map(school => ({
        id: school._id,
        name: school.schoolData?.schoolName || school.profile?.firstName + ' ' + school.profile?.lastName || 'School',
        avatar: school.schoolData?.schoolName?.substring(0, 2).toUpperCase() || 'SC',
        location: `${school.schoolData?.city || 'City'}, Saudi Arabia`,
        type: school.schoolData?.schoolType?.[0] || 'International School',
        openings: school.schoolData?.immediateOpenings || '5',
        curriculum: school.schoolData?.curriculum?.slice(0, 3) || ['American', 'British', 'IB'],
        rating: 4.9,
        isVerified: true,
        established: school.schoolData?.establishedYear || '2010',
        students: school.schoolData?.studentCapacity || '500+',
        benefits: ['Housing', 'Medical', 'Flights'],
        badgeColor: ['#0d9488', '#8b5cf6', '#f59e0b', '#10b981'][Math.floor(Math.random() * 4)]
      }));
      
      // Get featured jobs (first 6 for slider) - FIXED: Use getJobTitleDisplay
      const featuredJobsData = activeJobsList
        .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
        .map(job => ({
          id: job._id,
          title: getJobTitleDisplay(job),
          company: job.school?.name || job.schoolName || 'Leading International School',
          location: `${job.city || 'Riyadh'}, Saudi Arabia`,
          type: job.jobType || 'Full Time',
          salary: `${job.minSalary?.toLocaleString() || '12,000'}${job.maxSalary ? ` - ${job.maxSalary.toLocaleString()}` : ' - 20,000'} SAR`,
          postedDate: job.createdAt ? new Date(job.createdAt).toLocaleDateString() : 'Recent',
          deadline: job.applicationDeadline ? new Date(job.applicationDeadline).toLocaleDateString() : 'Soon',
          curriculum: job.curriculumRequired || ['International Baccalaureate', 'American Curriculum'],
          isUrgent: true,
          experience: job.experienceRequired || '3-5 years',
          description: job.jobDescription?.substring(0, 150) + '...' || 'Teaching position at a prestigious international school in Saudi Arabia.',
          benefits: ['Tax-free salary', 'Housing allowance', 'Medical insurance', 'Annual flights', 'Professional development'],
          requirements: [
            job.minQualification || "Bachelor's Degree",
            job.teachingLicenseRequired || "Teaching License",
            job.englishCertRequired || "English Proficiency"
          ],
          badgeColor: ['#ef4444', '#f59e0b', '#10b981'][Math.floor(Math.random() * 3)]
        }));
      
      setFeaturedTeachers(featuredTeachersData);
      setFeaturedSchools(featuredSchoolsData);
      setFeaturedJobs(featuredJobsData);
    }
  }, [users, jobs]);

  // Transform plans for membership section
  useEffect(() => {
    if (plans && plans.length > 0) {
      const transformedPlans = transformPlansForMembership();
      setMembershipPlans(transformedPlans);
    }
  }, [plans, billingCycle]);

  // Navigation handlers
  const handleViewTeacher = (id) => {
    navigate('/teacher-login');
  };

  const handleViewSchool = (id) => {
    navigate('/school-login');
  };

  const handleApplyJob = (jobId) => {
    navigate('/teacher-login');
  };

  const handleViewJob = (jobId) => {
    navigate('/teacher-login');
  };

  const navigateToPricing = () => {
    navigate('/pricing');
  };

  const navigateToAbout = () => {
    navigate('/about');
  };

  const navigateToFeatures = () => {
    navigate('/features');
  };

  const navigateToContact = () => {
    navigate('/contact-us');
  };

  const navigateToTeacherRegister = () => {
    navigate('/teacher-register');
  };

  const navigateToSchoolRegister = () => {
    navigate('/school-register');
  };

  // Loading state
  if (loading || usersLoading || jobsLoading || plansLoading) {
    return (
      <div className="min-h-screen mt-30 bg-gradient-to-br from-slate-50 to-blue-50 flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center"
        >
          <div className="w-20 h-20 border-4 border-[#2563eb] border-t-transparent rounded-full animate-spin mx-auto mb-6"></div>
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Loading TeachingPath</h2>
          <p className="text-gray-600">Connecting educators with opportunities...</p>
        </motion.div>
      </div>
    );
  }

  // Card component for consistent sizing
  const CardWrapper = ({ children, className = '', ...props }) => (
    <div className={`w-full h-full min-h-[550px] ${className}`} {...props}>
      {children}
    </div>
  );

  return (
    <div className="font-[Parkinsans] overflow-hidden mt-30">
     <section className="relative bg-gradient-to-br from-slate-900 via-blue-900 to-indigo-900 text-white overflow-hidden">
  {/* Background divs with pointer-events-none to prevent blocking clicks */}
  <div className="absolute inset-0 overflow-hidden pointer-events-none">
    <div className="absolute top-10 left-10 w-72 h-72 bg-blue-500/20 rounded-full blur-3xl"></div>
    <div className="absolute bottom-10 right-10 w-96 h-96 bg-purple-500/20 rounded-full blur-3xl"></div>
  </div>
  
  <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 lg:py-28">
    <div className="grid lg:grid-cols-2 gap-12 items-center">
      <div className="text-center lg:text-left">
        <div className="inline-flex items-center gap-2 px-4 py-3 bg-white/10 backdrop-blur-sm rounded-full mb-6 border border-white/20">
          <Sparkles className="w-5 h-5 text-yellow-300" />
          <span className="text-sm font-medium">A trusted edu staff recruitment platform </span>
        </div>
        
        <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold leading-tight mb-6">
          Find Your Perfect <span className="text-[#FFD700]">Teaching</span> Match
        </h1>
        
        <p className="text-lg text-white/90 mb-8 max-w-2xl leading-relaxed">
          Connect with top schools across Saudi Arabia or find qualified teachers for your institution. 
          TeachingPath makes educational recruitment simple, fast, and effective.
        </p>
        
        <div className="flex flex-col sm:flex-row gap-6 justify-center lg:justify-start mb-10">
          <button
            onClick={() => navigate('/teacher-register')}
            className="px-10 py-5 bg-gradient-to-r from-yellow-400 via-orange-400 to-red-400 text-gray-900 font-bold rounded-2xl hover:shadow-2xl hover:scale-105 transition-all duration-300 shadow-xl cursor-pointer"
            type="button"
              style={{ position: 'relative', zIndex: 999 }}
          >
            Join as Teacher - Free
          </button>
          <button
            onClick={() => navigate('/school-register')}
            className="px-10 py-5 bg-gradient-to-r from-blue-500/20 to-cyan-500/20 backdrop-blur-sm border-2 border-white/30 text-white font-bold rounded-2xl hover:bg-white hover:text-blue-900 hover:scale-105 transition-all duration-300 cursor-pointer"
            type="button"
                          style={{ position: 'relative', zIndex: 999 }}
          >
            Register Your School
          </button>
        </div>
  
        <div className="flex flex-wrap gap-6 text-sm">
          <div className="flex items-center gap-2">
            <CheckCircle className="w-5 h-5 text-green-300" />
            <span>No Cost for Teachers</span>
          </div>
          <div className="flex items-center gap-2">
            <Shield className="w-5 h-5 text-blue-300" />
            <span>Verified Profiles</span>
          </div>
          <div className="flex items-center gap-2">
            <Zap className="w-5 h-5 text-yellow-300" />
            <span>Direct Hiring</span>
          </div>
        </div>
      </div>
      
      <div className="grid grid-cols-2 gap-4">
        <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 text-center">
          <div className="text-3xl font-bold text-[#FFD700] mb-2">{stats.totalTeachers.toLocaleString()}+</div>
          <div className="text-white/80">Qualified Teachers</div>
        </div>
        <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 text-center">
          <div className="text-3xl font-bold text-[#00AEEF] mb-2">{stats.totalSchools.toLocaleString()}+</div>
          <div className="text-white/80">Partner Schools</div>
        </div>
        <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 text-center">
          <div className="text-3xl font-bold text-[#00BFA6] mb-2">{stats.activeJobs.toLocaleString()}+</div>
          <div className="text-white/80">Active Jobs</div>
        </div>
        <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 text-center">
          <div className="text-3xl font-bold text-[#FF6584] mb-2">{stats.successfulMatches.toLocaleString()}+</div>
          <div className="text-white/80">Successful Matches</div>
        </div>
      </div>
    </div>
  </div>
</section>
      {/* Quick Stats */}
      <section className="bg-white py-8 border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center p-4">
              <div className="text-2xl font-bold text-gray-900">{stats.totalApplications.toLocaleString()}+</div>
              <div className="text-sm text-gray-600">Applications</div>
            </div>
            <div className="text-center p-4">
              <div className="text-2xl font-bold text-gray-900">{stats.avgResponseTime}h</div>
              <div className="text-sm text-gray-600">Avg Response Time</div>
            </div>
            <div className="text-center p-4">
              <div className="text-2xl font-bold text-gray-900">98%</div>
              <div className="text-sm text-gray-600">Success Rate</div>
            </div>
            <div className="text-center p-4">
              <div className="text-2xl font-bold text-gray-900">15+</div>
              <div className="text-sm text-gray-600">Cities across Middle East</div>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Jobs - AUTO SLIDER */}
      <section className="py-20 bg-gradient-to-br from-slate-50 to-blue-50 overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Latest <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-cyan-600">Teaching Opportunities</span>
            </h2>
            <p className="text-gray-600 text-lg max-w-2xl mx-auto">
              Discover premium teaching positions with competitive packages
            </p>
          </div>

          {/* Jobs Slider Container */}
          <div className="relative">
            {/* Slider Controls */}
            <div className="absolute top-1/2 left-0 right-0 z-20 flex justify-between transform -translate-y-1/2 px-4">
              <button
                onClick={prevJob}
                className="p-3 bg-white/90 backdrop-blur-sm rounded-full shadow-xl hover:shadow-2xl hover:scale-110 transition-all duration-300"
              >
                <ChevronLeft className="w-6 h-6 text-blue-600" />
              </button>
              <button
                onClick={nextJob}
                className="p-3 bg-white/90 backdrop-blur-sm rounded-full shadow-xl hover:shadow-2xl hover:scale-110 transition-all duration-300"
              >
                <ChevronRightIcon className="w-6 h-6 text-blue-600" />
              </button>
            </div>

            {/* Slider Track */}
            <div className="overflow-hidden">
              <AnimatePresence mode="wait">
                <motion.div
                  key={jobSliderIndex}
                  initial={{ opacity: 0, x: 100 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -100 }}
                  transition={{ duration: 0.5 }}
                  className="w-full"
                >
                  <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {featuredJobs
                      .slice(jobSliderIndex, jobSliderIndex + 3)
                      .map((job, index) => (
                        <motion.div
                          key={job.id}
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: index * 0.1 }}
                          className="h-full"
                        >
                          <CardWrapper>
                            <div className="bg-white rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300 border border-gray-100 overflow-hidden h-full flex flex-col">
                              {/* Job Header with Gradient */}
                              <div className="bg-gradient-to-r from-[#2C7EAD] to-[#00AEEF] p-6 text-white relative overflow-hidden">
                                <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -translate-y-16 translate-x-16"></div>
                                <div className="relative z-10">
                                  <div className="flex justify-between items-start mb-4">
                                    <div>
                                      <h3 className="text-xl font-bold mb-1">{job.title}</h3>
                                      <p className="text-blue-100">{job.company}</p>
                                    </div>
                                    {job.isUrgent && (
                                      <span className="px-3 py-1 bg-red-500 text-white text-xs font-bold rounded-full animate-pulse">
                                        URGENT
                                      </span>
                                    )}
                                  </div>
                                  
                                  <div className="flex flex-wrap gap-2 mb-3">
                                    <span className="px-3 py-1 bg-white/20 backdrop-blur-sm rounded-full text-sm">
                                      {job.type}
                                    </span>
                                    <span className="px-3 py-1 bg-white/20 backdrop-blur-sm rounded-full text-sm">
                                      {job.experience}
                                    </span>
                                  </div>
                                </div>
                              </div>

                              {/* Job Details */}
                              <div className="p-6 flex-1 flex flex-col">
                                {/* Location & Compensation */}
                                <div className="grid grid-cols-2 gap-4 mb-6">
                                  <div className="bg-blue-50 rounded-xl p-4">
                                    <div className="flex items-center gap-2 mb-1">
                                      <MapPin className="w-4 h-4 text-red-500" />
                                      <span className="text-sm font-medium text-gray-700">Location</span>
                                    </div>
                                    <p className="text-gray-900 font-semibold">{job.location}</p>
                                  </div>
                                  
                                  <div className="bg-green-50 rounded-xl p-4">
                                    <div className="flex items-center gap-2 mb-1">
                                      <DollarSign className="w-4 h-4 text-green-600" />
                                      <span className="text-sm font-medium text-gray-700">Compensation</span>
                                    </div>
                                    <p className="text-gray-900 font-semibold">{job.salary}</p>
                                    <p className="text-xs text-gray-500 mt-1">Tax-free monthly</p>
                                  </div>
                                </div>

                                {/* Job Description */}
                                <div className="mb-6 flex-1">
                                  <h4 className="font-semibold text-gray-900 mb-2 flex items-center gap-2">
                                    <FileText className="w-4 h-4 text-blue-500" />
                                    Position Overview
                                  </h4>
                                  <p className="text-gray-600 text-sm leading-relaxed">{job.description}</p>
                                </div>

                                {/* Benefits */}
                                <div className="mb-6">
                                  <h4 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                                    <Award className="w-4 h-4 text-yellow-500" />
                                    Benefits Package
                                  </h4>
                                  <div className="grid grid-cols-2 gap-2">
                                    {job.benefits.slice(0, 4).map((benefit, idx) => (
                                      <div key={idx} className="flex items-center gap-2">
                                        <CheckCircle className="w-4 h-4 text-green-500 flex-shrink-0" />
                                        <span className="text-sm text-gray-700">{benefit}</span>
                                      </div>
                                    ))}
                                  </div>
                                </div>

                                {/* Curriculum */}
                                <div className="mb-6">
                                  <h4 className="font-semibold text-gray-900 mb-2">Curriculum</h4>
                                  <div className="flex flex-wrap gap-2">
                                    {job.curriculum.map((curr, idx) => (
                                      <span key={idx} className="px-3 py-1 bg-blue-100 text-blue-800 text-sm rounded-full">
                                        {curr}
                                      </span>
                                    ))}
                                  </div>
                                </div>

                                {/* Timeline */}
                                <div className="flex justify-between items-center text-sm text-gray-500 mb-6">
                                  <div className="flex items-center gap-2">
                                    <Calendar className="w-4 h-4" />
                                    <span>Posted: {job.postedDate}</span>
                                  </div>
                                  <div className="flex items-center gap-2">
                                    <Clock className="w-4 h-4" />
                                    <span>Deadline: {job.deadline}</span>
                                  </div>
                                </div>

                                {/* Action Buttons */}
                                <div className="flex gap-3 mt-auto">
                                  <button
                                    onClick={() => handleApplyJob(job.id)}
                                    className="flex-1 py-3 bg-gradient-to-r from-[#2C7EAD] to-[#00AEEF] text-white rounded-xl font-semibold hover:shadow-lg hover:scale-105 transition-all duration-300 flex items-center justify-center gap-2"
                                  >
                                    <Briefcase className="w-4 h-4" />
                                    Apply Now
                                  </button>
                                  <button
                                    onClick={() => handleViewJob(job.id)}
                                    className="px-6 py-3 border-2 border-[#2C7EAD] text-[#2C7EAD] rounded-xl font-semibold hover:bg-[#2C7EAD] hover:text-white transition-all duration-300"
                                  >
                                    Details
                                  </button>
                                </div>
                              </div>
                            </div>
                          </CardWrapper>
                        </motion.div>
                      ))}
                  </div>
                </motion.div>
              </AnimatePresence>
            </div>

            {/* Slider Indicators */}
            <div className="flex justify-center items-center gap-3 mt-8">
              {featuredJobs.slice(0, Math.ceil(featuredJobs.length / 3)).map((_, idx) => (
                <button
                  key={idx}
                  onClick={() => {
                    setJobSliderIndex(idx * 3);
                    setIsJobSliderPlaying(false);
                    setTimeout(() => setIsJobSliderPlaying(true), 10000);
                  }}
                  className={`w-3 h-3 rounded-full transition-all duration-300 ${
                    Math.floor(jobSliderIndex / 3) === idx
                      ? 'bg-blue-600 w-8'
                      : 'bg-gray-300 hover:bg-gray-400'
                  }`}
                />
              ))}
            </div>
          </div>

          {/* View All Jobs Button */}
          <div className="text-center mt-16">
            <button
              onClick={() => navigate('/school/post')}
              className="px-8 py-4 bg-gradient-to-r from-[#2C7EAD] to-[#00AEEF] text-white font-bold rounded-2xl hover:shadow-2xl transition-all duration-300 inline-flex items-center gap-3 group"
            >
              View All {featuredJobs.length}+ Teaching Positions
              <ArrowRight className="w-5 h-5 group-hover:translate-x-2 transition-transform" />
            </button>
          </div>
        </div>
      </section>

      {/* Enhanced Teachers & Schools Tabs with Auto Sliders */}
    <section className="py-20 bg-gradient-to-br from-gray-50 to-white">
  <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
    {/* Tabs Header */}
    <div className="text-center mb-16">
      <h2 className="text-4xl font-bold text-gray-900 mb-4">
        Discover Our <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#FF6B6B] to-[#4ECDC4]">Talent Network</span>
      </h2>
      <p className="text-gray-600 max-w-2xl mx-auto text-lg">
        Connect with qualified educators and leading educational institutions
      </p>
    </div>

    {/* Tabs Navigation */}
    <div className="flex justify-center mb-12">
      <div className="inline-flex rounded-2xl bg-gradient-to-r from-gray-100 to-gray-200 p-1 shadow-lg">
        <button
          onClick={() => setActiveTab('teachers')}
          className={`px-8 py-4 rounded-xl font-semibold transition-all duration-300 flex items-center gap-3 ${
            activeTab === 'teachers'
              ? 'bg-white shadow-xl text-[#FF6B6B] transform scale-105'
              : 'text-gray-600 hover:text-gray-900 hover:bg-white/50'
          }`}
        >
          <div className={`p-3 rounded-lg ${
            activeTab === 'teachers' ? 'bg-gradient-to-br from-[#FF6B6B] to-[#FF8E53]' : 'bg-gray-200'
          }`}>
            <Users className="w-6 h-6 text-white" />
          </div>
          <div className="text-left">
            <div className="font-bold text-lg">Qualified Teachers</div>
            <div className="text-sm text-gray-500">{featuredTeachers.length} featured profiles</div>
          </div>
        </button>
        <button
          onClick={() => setActiveTab('schools')}
          className={`px-8 py-4 rounded-xl font-semibold transition-all duration-300 flex items-center gap-3 ${
            activeTab === 'schools'
              ? 'bg-white shadow-xl text-[#4ECDC4] transform scale-105'
              : 'text-gray-600 hover:text-gray-900 hover:bg-white/50'
          }`}
        >
          <div className={`p-3 rounded-lg ${
            activeTab === 'schools' ? 'bg-gradient-to-br from-[#4ECDC4] to-[#44A08D]' : 'bg-gray-200'
          }`}>
            <Building className="w-6 h-6 text-white" />
          </div>
          <div className="text-left">
            <div className="font-bold text-lg">Top Schools</div>
            <div className="text-sm text-gray-500">{featuredSchools.length} partner institutions</div>
          </div>
        </button>
      </div>
    </div>

    {/* Teachers Slider */}
    {activeTab === 'teachers' && (
      <div className="relative">
        {/* Slider Controls */}
        <div className="absolute top-1/2 left-0 right-0 z-20 flex justify-between transform -translate-y-1/2 px-4">
          <button
            onClick={prevTeacher}
            className="p-3 bg-white/90 backdrop-blur-sm rounded-full shadow-xl hover:shadow-2xl hover:scale-110 transition-all duration-300 border border-gray-200"
          >
            <ChevronLeft className="w-6 h-6 text-[#FF6B6B]" />
          </button>
          <button
            onClick={nextTeacher}
            className="p-3 bg-white/90 backdrop-blur-sm rounded-full shadow-xl hover:shadow-2xl hover:scale-110 transition-all duration-300 border border-gray-200"
          >
            <ChevronRightIcon className="w-6 h-6 text-[#FF6B6B]" />
          </button>
        </div>

        {/* Slider Track */}
        <div className="overflow-hidden">
          <AnimatePresence mode="wait">
            <motion.div
              key={teacherSliderIndex}
              initial={{ opacity: 0, x: 100 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -100 }}
              transition={{ duration: 0.5 }}
              className="w-full"
            >
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {featuredTeachers
                  .slice(teacherSliderIndex, teacherSliderIndex + 3)
                  .map((teacher, index) => (
                    <motion.div
                      key={teacher.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className="h-full"
                      onMouseEnter={() => setHoveredCard(`teacher-${teacher.id}`)}
                      onMouseLeave={() => setHoveredCard(null)}
                    >
                      <div className="bg-white rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300 border border-gray-100 overflow-hidden h-full flex flex-col transform hover:-translate-y-1">
                        {/* Teacher Header with Attractive Gradient */}
                        <div className="bg-gradient-to-r from-[#FF6B6B] via-[#FF8E53] to-[#FFA726] p-6 text-white relative overflow-hidden">
                          <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -translate-y-16 translate-x-16"></div>
                          <div className="relative z-10">
                            <div className="flex justify-between items-start mb-4">
                              <div>
                                <h3 className="text-xl font-bold mb-1">{teacher.name}</h3>
                                <p className="text-white/90 text-sm">{teacher.position}</p>
                              </div>
                              {teacher.isVerified && (
                                <div className="p-2 bg-white/20 backdrop-blur-sm rounded-full">
                                  <ShieldCheck className="w-4 h-4" />
                                </div>
                              )}
                            </div>
                            
                            <div className="flex flex-wrap gap-2 mb-3">
                              <span className="px-3 py-1 bg-white/20 backdrop-blur-sm rounded-full text-sm">
                                {teacher.experience}
                              </span>
                              <span className="px-3 py-1 bg-white/20 backdrop-blur-sm rounded-full text-sm">
                                {teacher.education}
                              </span>
                            </div>
                          </div>
                        </div>

                        {/* Teacher Details - Consistent with Jobs Cards */}
                        <div className="p-6 flex-1 flex flex-col">
                          {/* Location & Experience */}
                          <div className="grid grid-cols-2 gap-4 mb-6">
                            <div className="bg-red-50 rounded-xl p-4">
                              <div className="flex items-center gap-2 mb-1">
                                <MapPin className="w-4 h-4 text-red-500" />
                                <span className="text-sm font-medium text-gray-700">Location</span>
                              </div>
                              <p className="text-gray-900 font-semibold">{teacher.location}</p>
                            </div>
                            
                            <div className="bg-orange-50 rounded-xl p-4">
                              <div className="flex items-center gap-2 mb-1">
                                <Briefcase className="w-4 h-4 text-orange-600" />
                                <span className="text-sm font-medium text-gray-700">Experience</span>
                              </div>
                              <p className="text-gray-900 font-semibold">{teacher.experience}</p>
                            </div>
                          </div>

                          {/* Rating */}
                          <div className="mb-6">
                            <div className="flex items-center justify-between mb-2">
                              <h4 className="font-semibold text-gray-900 flex items-center gap-2">
                                <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
                                Teacher Rating
                              </h4>
                              <span className="text-sm font-bold text-gray-900">{teacher.rating}/5</span>
                            </div>
                            <div className="flex items-center gap-1">
                              {[...Array(5)].map((_, i) => (
                                <Star key={i} className={`w-5 h-5 ${
                                  i < Math.floor(teacher.rating) 
                                    ? 'text-yellow-500 fill-yellow-500' 
                                    : 'text-gray-300'
                                }`} />
                              ))}
                            </div>
                          </div>

                          {/* Languages */}
                          {teacher.languages && teacher.languages.length > 0 && (
                            <div className="mb-6">
                              <h4 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                                <Languages className="w-4 h-4 text-blue-500" />
                                Languages
                              </h4>
                              <div className="flex flex-wrap gap-2">
                                {teacher.languages.map((lang, idx) => (
                                  <span key={idx} className="px-3 py-1 bg-gradient-to-r from-blue-100 to-blue-50 text-blue-800 text-sm rounded-full border border-blue-200">
                                    {lang}
                                  </span>
                                ))}
                              </div>
                            </div>
                          )}

                          {/* Skills */}
                          <div className="mb-6 flex-1">
                            <h4 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                              <TargetIcon className="w-4 h-4 text-purple-500" />
                              Key Skills
                            </h4>
                            <div className="flex flex-wrap gap-2">
                              {teacher.skills.map((skill, idx) => (
                                <span key={idx} className="px-3 py-1 bg-gradient-to-r from-gray-50 to-gray-100 text-gray-700 text-sm rounded-full border border-gray-200">
                                  {skill}
                                </span>
                              ))}
                            </div>
                          </div>

                          {/* Action Button */}
                          <button
                            onClick={() => handleViewTeacher(teacher.id)}
                            className="w-full py-3 bg-gradient-to-r from-[#FF6B6B] to-[#FF8E53] text-white rounded-xl font-semibold hover:shadow-lg hover:scale-105 transition-all duration-300 group mt-auto"
                          >
                            <span className="flex items-center justify-center gap-2">
                              View Full Profile
                              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                            </span>
                          </button>
                        </div>
                      </div>
                    </motion.div>
                  ))}
              </div>
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Slider Indicators */}
        <div className="flex justify-center items-center gap-3 mt-8">
          {featuredTeachers.slice(0, Math.ceil(featuredTeachers.length / 3)).map((_, idx) => (
            <button
              key={idx}
              onClick={() => {
                setTeacherSliderIndex(idx * 3);
                setIsTeacherSliderPlaying(false);
                setTimeout(() => setIsTeacherSliderPlaying(true), 10000);
              }}
              className={`w-3 h-3 rounded-full transition-all duration-300 ${
                Math.floor(teacherSliderIndex / 3) === idx
                  ? 'bg-gradient-to-r from-[#FF6B6B] to-[#FF8E53] w-8'
                  : 'bg-gray-300 hover:bg-gray-400'
              }`}
            />
          ))}
        </div>
      </div>
    )}

    {/* Schools Slider */}
    {activeTab === 'schools' && (
      <div className="relative">
        {/* Slider Controls */}
        <div className="absolute top-1/2 left-0 right-0 z-20 flex justify-between transform -translate-y-1/2 px-4">
          <button
            onClick={prevSchool}
            className="p-3 bg-white/90 backdrop-blur-sm rounded-full shadow-xl hover:shadow-2xl hover:scale-110 transition-all duration-300 border border-gray-200"
          >
            <ChevronLeft className="w-6 h-6 text-[#4ECDC4]" />
          </button>
          <button
            onClick={nextSchool}
            className="p-3 bg-white/90 backdrop-blur-sm rounded-full shadow-xl hover:shadow-2xl hover:scale-110 transition-all duration-300 border border-gray-200"
          >
            <ChevronRightIcon className="w-6 h-6 text-[#4ECDC4]" />
          </button>
        </div>

        {/* Slider Track */}
        <div className="overflow-hidden">
          <AnimatePresence mode="wait">
            <motion.div
              key={schoolSliderIndex}
              initial={{ opacity: 0, x: 100 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -100 }}
              transition={{ duration: 0.5 }}
              className="w-full"
            >
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {featuredSchools
                  .slice(schoolSliderIndex, schoolSliderIndex + 3)
                  .map((school, index) => (
                    <motion.div
                      key={school.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className="h-full"
                      onMouseEnter={() => setHoveredCard(`school-${school.id}`)}
                      onMouseLeave={() => setHoveredCard(null)}
                    >
                      <div className="bg-white rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300 border border-gray-100 overflow-hidden h-full flex flex-col transform hover:-translate-y-1">
                        {/* School Header with Attractive Gradient */}
                        <div className="bg-gradient-to-r from-[#4ECDC4] via-[#45B7D1] to-[#96CEB4] p-6 text-white relative overflow-hidden">
                          <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -translate-y-16 translate-x-16"></div>
                          <div className="relative z-10">
                            <div className="flex justify-between items-start mb-4">
                              <div>
                                <h3 className="text-xl font-bold mb-1">{school.name}</h3>
                                <p className="text-white/90 text-sm">{school.type}</p>
                              </div>
                              {school.isVerified && (
                                <div className="p-2 bg-white/20 backdrop-blur-sm rounded-full">
                                  <ShieldCheck className="w-4 h-4" />
                                </div>
                              )}
                            </div>
                            
                            <div className="flex flex-wrap gap-2 mb-3">
                              <span className="px-3 py-1 bg-white/20 backdrop-blur-sm rounded-full text-sm">
                                Est. {school.established}
                              </span>
                              <span className="px-3 py-1 bg-white/20 backdrop-blur-sm rounded-full text-sm">
                                {school.students} Students
                              </span>
                            </div>
                          </div>
                        </div>

                        {/* School Details - Consistent with Jobs Cards */}
                        <div className="p-6 flex-1 flex flex-col">
                          {/* Location & Openings */}
                          <div className="grid grid-cols-2 gap-4 mb-6">
                            <div className="bg-teal-50 rounded-xl p-4">
                              <div className="flex items-center gap-2 mb-1">
                                <MapPin className="w-4 h-4 text-teal-500" />
                                <span className="text-sm font-medium text-gray-700">Location</span>
                              </div>
                              <p className="text-gray-900 font-semibold">{school.location}</p>
                            </div>
                            
                            <div className="bg-emerald-50 rounded-xl p-4">
                              <div className="flex items-center gap-2 mb-1">
                                <Briefcase className="w-4 h-4 text-emerald-600" />
                                <span className="text-sm font-medium text-gray-700">Open Positions</span>
                              </div>
                              <p className="text-gray-900 font-semibold">{school.openings}</p>
                            </div>
                          </div>

                          {/* Curriculum */}
                          {school.curriculum && school.curriculum.length > 0 && (
                            <div className="mb-6">
                              <h4 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                                <BookOpen className="w-4 h-4 text-purple-500" />
                                Curriculum Offered
                              </h4>
                              <div className="flex flex-wrap gap-2">
                                {school.curriculum.map((curr, idx) => (
                                  <span key={idx} className="px-3 py-1 bg-gradient-to-r from-purple-100 to-purple-50 text-purple-800 text-sm rounded-full border border-purple-200">
                                    {curr}
                                  </span>
                                ))}
                              </div>
                            </div>
                          )}

                          {/* Benefits */}
                          {school.benefits && school.benefits.length > 0 && (
                            <div className="mb-6 flex-1">
                              <h4 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                                <Award className="w-4 h-4 text-green-500" />
                                Benefits Package
                              </h4>
                              <div className="grid grid-cols-2 gap-2">
                                {school.benefits.map((benefit, idx) => (
                                  <div key={idx} className="flex items-center gap-2">
                                    <CheckCircle className="w-4 h-4 text-green-500 flex-shrink-0" />
                                    <span className="text-sm text-gray-700">{benefit}</span>
                                  </div>
                                ))}
                              </div>
                            </div>
                          )}

                          {/* Rating */}
                          <div className="mb-6">
                            <div className="flex items-center justify-between mb-2">
                              <h4 className="font-semibold text-gray-900 flex items-center gap-2">
                                <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
                                School Rating
                              </h4>
                              <span className="text-sm font-bold text-gray-900">{school.rating}/5</span>
                            </div>
                            <div className="flex items-center gap-1">
                              {[...Array(5)].map((_, i) => (
                                <Star key={i} className={`w-5 h-5 ${
                                  i < Math.floor(school.rating) 
                                    ? 'text-yellow-500 fill-yellow-500' 
                                    : 'text-gray-300'
                                }`} />
                              ))}
                            </div>
                          </div>

                          {/* Action Button */}
                          <button
                            onClick={() => handleViewSchool(school.id)}
                            className="w-full py-3 bg-gradient-to-r from-[#4ECDC4] to-[#44A08D] text-white rounded-xl font-semibold hover:shadow-lg hover:scale-105 transition-all duration-300 group mt-auto"
                          >
                            <span className="flex items-center justify-center gap-2">
                              View School Profile
                              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                            </span>
                          </button>
                        </div>
                      </div>
                    </motion.div>
                  ))}
              </div>
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Slider Indicators */}
        <div className="flex justify-center items-center gap-3 mt-8">
          {featuredSchools.slice(0, Math.ceil(featuredSchools.length / 3)).map((_, idx) => (
            <button
              key={idx}
              onClick={() => {
                setSchoolSliderIndex(idx * 3);
                setIsSchoolSliderPlaying(false);
                setTimeout(() => setIsSchoolSliderPlaying(true), 10000);
              }}
              className={`w-3 h-3 rounded-full transition-all duration-300 ${
                Math.floor(schoolSliderIndex / 3) === idx
                  ? 'bg-gradient-to-r from-[#4ECDC4] to-[#44A08D] w-8'
                  : 'bg-gray-300 hover:bg-gray-400'
              }`}
            />
          ))}
        </div>
      </div>
    )}

    {/* View All Button */}
    <div className="text-center mt-16">
      <button
        onClick={activeTab === 'teachers' ? () => navigate('/teachers') : () => navigate('/schools')}
        className="px-10 py-5 bg-gradient-to-r from-[#FF6B6B] to-[#4ECDC4] text-white font-bold rounded-2xl hover:shadow-2xl transition-all duration-300 inline-flex items-center gap-3 group hover:scale-105"
      >
        {activeTab === 'teachers' ? 'Browse All Teachers' : 'Explore All Schools'}
        <ArrowRight className="w-5 h-5 group-hover:translate-x-2 transition-transform" />
      </button>
    </div>
  </div>
</section>


      {/* About Summary */}
     <section className="py-20 bg-gradient-to-br from-slate-50 to-blue-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="grid lg:grid-cols-2 gap-16 items-center">
                {/* Left Content */}
                <motion.div
                  initial={{ opacity: 0, x: -30 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                >
                  <h2 className="text-4xl font-bold text-gray-900 mb-6">
                    About <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-cyan-600">TeachingPath</span>
                  </h2>
                  <p className="text-lg text-gray-600 mb-8 leading-relaxed">
                    TeachingPath is Saudi Arabia's premier educational recruitment platform, 
                    dedicated to connecting qualified teachers with top schools across the Kingdom.
                  </p>
                  
                  <div className="space-y-6 mb-10">
                    {[
                      {
                        icon: <TargetIcon className="w-6 h-6" />,
                        title: "Our Mission",
                        desc: "To revolutionize educational recruitment through technology, making it faster, more efficient, and more transparent for both teachers and schools.",
                        color: "from-blue-500 to-cyan-500"
                      },
                      {
                        icon: <AwardIcon className="w-6 h-6" />,
                        title: "Our Vision",
                        desc: "To become the leading educational recruitment platform in the Middle East, connecting every qualified teacher with their ideal teaching position.",
                        color: "from-emerald-500 to-teal-500"
                      }
                    ].map((item, index) => (
                      <div key={index} className="flex items-start gap-4 p-6 bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300">
                        <div className={`p-4 bg-gradient-to-br ${item.color} rounded-xl`}>
                          <div className="text-white">{item.icon}</div>
                        </div>
                        <div>
                          <h4 className="font-bold text-gray-900 mb-2">{item.title}</h4>
                          <p className="text-gray-600">{item.desc}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                  
                  <div className="flex gap-4">
                    <button
                      onClick={navigateToAbout}
                      className="px-8 py-4 bg-gradient-to-r from-blue-600 to-cyan-600 text-white font-bold rounded-xl hover:shadow-xl hover:scale-105 transition-all duration-300 shadow-lg"
                    >
                      Learn More
                    </button>
                    <button
                      onClick={navigateToContact}
                      className="px-8 py-4 border-2 border-blue-200 text-blue-600 font-bold rounded-xl hover:bg-blue-50 hover:border-blue-300 transition-all duration-300"
                    >
                      Contact Us
                    </button>
                  </div>
                </motion.div>
                
                {/* Right Content - Features Grid */}
                <motion.div
                  initial={{ opacity: 0, x: 30 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  className="grid grid-cols-2 gap-6"
                >
                  {[
                    {
                      icon: <ShieldIcon className="w-8 h-8" />,
                      title: "Secure Platform",
                      desc: "Bank-level security for all your data",
                      color: "from-blue-500 to-cyan-500"
                    },
                    {
                      icon: <Zap className="w-8 h-8" />,
                      title: "Fast Matching",
                      desc: "AI-powered teacher-school matching",
                      color: "from-emerald-500 to-teal-500"
                    },
                    {
                      icon: <UsersIcon className="w-8 h-8" />,
                      title: "Large Network",
                      desc: "Thousands of teachers and schools",
                      color: "from-purple-500 to-pink-500"
                    },
                    {
                      icon: <FileCheck className="w-8 h-8" />,
                      title: "Verified Profiles",
                      desc: "All profiles thoroughly verified",
                      color: "from-orange-500 to-red-500"
                    }
                  ].map((feature, index) => (
                    <motion.div
                      key={index}
                      whileHover={{ scale: 1.05 }}
                      className={`bg-gradient-to-br ${feature.color} rounded-2xl p-6 text-white shadow-xl hover:shadow-2xl transition-all duration-300`}
                    >
                      <div className="p-3 bg-white/20 rounded-xl w-fit mb-4 backdrop-blur-sm">
                        {feature.icon}
                      </div>
                      <h4 className="font-bold text-lg mb-2">{feature.title}</h4>
                      <p className="text-white/80 text-sm">{feature.desc}</p>
                    </motion.div>
                  ))}
                </motion.div>
              </div>
            </div>
          </section>

{/* Membership Plans Preview - Dynamic from API */}
<section className="py-20 bg-white">
  <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className="text-center mb-8"
    >
      <h2 className="text-4xl font-bold text-gray-900 mb-4">
        School <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-cyan-600">Membership Plans</span>
      </h2>
      <p className="text-gray-600 text-lg max-w-2xl mx-auto mb-8">
        Choose the perfect plan for your school's hiring needs. All plans include access to our verified teacher database.
      </p>
    </motion.div>

    {/* Billing Toggle */}
    <div className="flex justify-center items-center gap-4 mb-12">
      <button
        onClick={() => setBillingCycle("monthly")}
        className={`px-6 py-2 rounded-full font-semibold transition-all ${
          billingCycle === "monthly"
            ? "bg-[#2C7EAD] text-white shadow-md"
            : "bg-gray-100 text-gray-600 hover:bg-gray-200"
        }`}
      >
        Monthly
      </button>
      <button
        onClick={() => setBillingCycle("annual")}
        className={`px-6 py-2 rounded-full font-semibold transition-all flex items-center gap-2 ${
          billingCycle === "annual"
            ? "bg-[#2C7EAD] text-white shadow-md"
            : "bg-gray-100 text-gray-600 hover:bg-gray-200"
        }`}
      >
        Annual
        <span className="text-xs bg-green-500 text-white px-2 py-0.5 rounded-full">Save up to 20%</span>
      </button>
    </div>

    <div className="flex flex-col md:flex-row gap-8 items-stretch justify-center">
      {membershipPlans.length > 0 ? (
        membershipPlans.map((plan, index) => (
          <motion.div
            key={plan.id || index}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            viewport={{ once: true }}
            whileHover={{ y: -5 }}
            className={`relative group flex-1 max-w-md mx-auto w-full ${plan.popular ? 'scale-105 z-10' : ''}`}
          >
            {plan.popular && (
              <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 z-10">
                <div className="bg-gradient-to-r from-yellow-400 to-orange-500 text-white px-6 py-2 rounded-full font-bold shadow-lg">
                  MOST POPULAR
                </div>
              </div>
            )}
            
            {/* Savings Badge for Annual */}
            {billingCycle === "annual" && plan.savings > 0 && !plan.popular && (
              <div className="absolute -top-4 right-4 z-10">
                <div className="bg-green-500 text-white px-3 py-1 rounded-full text-xs font-bold shadow-lg">
                  Save {plan.savings}%
                </div>
              </div>
            )}
            
            <div className={`bg-gradient-to-b ${plan.color} rounded-3xl p-8 shadow-xl hover:shadow-2xl transition-all duration-500 h-full`}>
              <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 h-full flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between mb-6">
                    <div>
                      <h3 className="text-2xl font-bold text-white mb-2">{plan.name}</h3>
                      <div className="flex items-baseline">
                        <span className="text-5xl font-bold text-white">
                          {billingCycle === "monthly" ? plan.monthlyPrice : plan.yearlyPrice}
                        </span>
                        {plan.monthlyPrice !== "Custom" && plan.yearlyPrice !== "Custom" && (
                          <span className="text-white/80 ml-2">/{plan.period}</span>
                        )}
                      </div>
                      {billingCycle === "annual" && plan.savings > 0 && plan.monthlyPrice !== "Custom" && (
                        <p className="text-white/70 text-sm mt-1">
                          Save {plan.savings}% vs monthly billing
                        </p>
                      )}
                    </div>
                    <div className="p-4 bg-white/20 rounded-xl">
                      <div className="text-white">{plan.icon}</div>
                    </div>
                  </div>
                  
                  <div className="space-y-4 mb-8">
                    {plan.features.slice(0, 7).map((feature, idx) => (
                      <div key={idx} className="flex items-start gap-3">
                        <CheckCircle className="w-5 h-5 text-green-300 flex-shrink-0 mt-0.5" />
                        <span className="text-white/90 text-sm">{feature}</span>
                      </div>
                    ))}
                    {plan.features.length > 7 && (
                      <div className="text-white/70 text-sm pl-8">
                        +{plan.features.length - 7} more features
                      </div>
                    )}
                  </div>
                </div>
                
                <button
                  onClick={navigateToPricing}
                  className={`w-full py-4 bg-white text-gray-900 font-bold rounded-xl hover:shadow-xl transition-all duration-300 hover:scale-105 ${
                    plan.popular ? 'shadow-lg' : ''
                  }`}
                >
                  {plan.popular ? 'Get Started Now' : 'Choose Plan'}
                </button>
              </div>
            </div>
          </motion.div>
        ))
      ) : (
        // Fallback default plans if API returns empty
        [
          {
            name: "Starter",
            monthlyPrice: "950 SAR",
            yearlyPrice: "9,120 SAR",
            period: "month",
            features: [
              "5 Active Job Posts",
              "10 Teacher Views/Month",
              "Basic Search Filters",
              "Email Support",
              "Up to 2 Hiring Team Users"
            ],
            color: "from-blue-500 to-cyan-500",
            popular: false,
            icon: <Rocket className="w-8 h-8" />,
            savings: 0
          },
          {
            name: "Growing",
            monthlyPrice: "2,250 SAR",
            yearlyPrice: "21,600 SAR",
            period: "month",
            features: [
              "15 Active Job Posts",
              "30 Teacher Views/Month",
              "Advanced Search Filters",
              "Priority Support",
              "School Branding",
              "Up to 5 Hiring Team Users",
              "Advanced Analytics"
            ],
            color: "from-emerald-500 to-teal-500",
            popular: true,
            icon: <TrendingUp className="w-8 h-8" />,
            savings: 20
          },
          {
            name: "Premium",
            monthlyPrice: "4,500 SAR",
            yearlyPrice: "43,200 SAR",
            period: "month",
            features: [
              "25 Active Job Posts",
              "100+ Teacher Views/Month",
              "Full Database Access",
              "Dedicated Account Manager",
              "Unlimited Hiring Team",
              "Custom Reports",
              "ERP/ATS Integration"
            ],
            color: "from-purple-500 to-pink-500",
            popular: false,
            icon: <Crown className="w-8 h-8" />,
            savings: 20
          }
        ].map((plan, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            viewport={{ once: true }}
            whileHover={{ y: -5 }}
            className={`relative group flex-1 max-w-md mx-auto w-full ${plan.popular ? 'scale-105 z-10' : ''}`}
          >
            {plan.popular && (
              <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 z-10">
                <div className="bg-gradient-to-r from-yellow-400 to-orange-500 text-white px-6 py-2 rounded-full font-bold shadow-lg">
                  MOST POPULAR
                </div>
              </div>
            )}
            
            <div className={`bg-gradient-to-b ${plan.color} rounded-3xl p-8 shadow-xl hover:shadow-2xl transition-all duration-500 h-full`}>
              <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 h-full flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between mb-6">
                    <div>
                      <h3 className="text-2xl font-bold text-white mb-2">{plan.name}</h3>
                      <div className="flex items-baseline">
                        <span className="text-5xl font-bold text-white">
                          {billingCycle === "monthly" ? plan.monthlyPrice : plan.yearlyPrice}
                        </span>
                        <span className="text-white/80 ml-2">/{plan.period}</span>
                      </div>
                    </div>
                    <div className="p-4 bg-white/20 rounded-xl">
                      <div className="text-white">{plan.icon}</div>
                    </div>
                  </div>
                  
                  <div className="space-y-4 mb-8">
                    {plan.features.map((feature, idx) => (
                      <div key={idx} className="flex items-start gap-3">
                        <CheckCircle className="w-5 h-5 text-green-300 flex-shrink-0 mt-0.5" />
                        <span className="text-white/90 text-sm">{feature}</span>
                      </div>
                    ))}
                  </div>
                </div>
                
                <button
                  onClick={navigateToPricing}
                  className={`w-full py-4 bg-white text-gray-900 font-bold rounded-xl hover:shadow-xl transition-all duration-300 hover:scale-105 ${
                    plan.popular ? 'shadow-lg' : ''
                  }`}
                >
                  {plan.popular ? 'Get Started Now' : 'Choose Plan'}
                </button>
              </div>
            </div>
          </motion.div>
        ))
      )}
    </div>
    
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className="text-center mt-16"
    >
      <button
        onClick={navigateToPricing}
        className="px-10 py-5 border-2 border-blue-200 text-blue-600 font-bold rounded-xl hover:bg-blue-50 hover:border-blue-300 hover:shadow-xl transition-all duration-300"
      >
        View All Plans & Details
      </button>
    </motion.div>
  </div>
</section>

      {/* Final CTA */}
      <section className="py-20 bg-gradient-to-br from-slate-900 via-blue-900 to-indigo-900 text-white overflow-hidden">
           {/* Animated Background */}
           <div className="absolute inset-0">
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
                     y: [0, -20, 0],
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
           
           <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
             <motion.div
               initial={{ opacity: 0, scale: 0.9 }}
               whileInView={{ opacity: 1, scale: 1 }}
               viewport={{ once: true }}
             >
               <h2 className="text-4xl font-bold mb-6 bg-gradient-to-r from-white via-blue-100 to-cyan-100 bg-clip-text text-transparent">
                 Ready to Start Your Educational Journey?
               </h2>
               <p className="text-xl text-white/80 mb-10 max-w-2xl mx-auto">
                 Join thousands of teachers and schools who have found their perfect match
               </p>
               
               <div className="flex flex-col sm:flex-row gap-6 justify-center mb-10">
                 <button
                   onClick={navigateToTeacherRegister}
                   className="px-10 py-5 bg-gradient-to-r from-yellow-400 via-orange-400 to-red-400 text-gray-900 font-bold rounded-2xl hover:shadow-2xl hover:scale-105 transition-all duration-300 shadow-xl"
                 >
                   Join as Teacher - Free
                 </button>
                 <button
                   onClick={navigateToSchoolRegister}
                   className="px-10 py-5 bg-gradient-to-r from-blue-500/20 to-cyan-500/20 backdrop-blur-sm border-2 border-white/30 text-white font-bold rounded-2xl hover:bg-white hover:text-blue-900 hover:scale-105 transition-all duration-300"
                 >
                   Register Your School
                 </button>
               </div>
               
               <div className="mt-12">
                 <p className="text-white/70 mb-6">Already have an account?</p>
                 <div className="flex flex-col sm:flex-row gap-4 justify-center">
                   <button
                     onClick={() => navigate('/teacher-login')}
                     className="px-8 py-4 border-2 border-white/30 text-white rounded-xl hover:bg-white/10 hover:border-white/50 transition-all duration-300 backdrop-blur-sm"
                   >
                     Teacher Login
                   </button>
                   <button
                     onClick={() => navigate('/school-login')}
                     className="px-8 py-4 border-2 border-white/30 text-white rounded-xl hover:bg-white/10 hover:border-white/50 transition-all duration-300 backdrop-blur-sm"
                   >
                     School Login
                   </button>
                 </div>
               </div>
             </motion.div>
           </div>
         </section>

      {/* Quick Links Bar */}
       <section className="bg-gradient-to-r from-gray-900 to-slate-900 text-white py-12">
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                  {[
                    {
                      to: "/about",
                      icon: <Award className="w-6 h-6" />,
                      title: "About Us",
                      desc: "Learn about our mission",
                      color: "from-blue-500 to-cyan-500"
                    },
                    {
                      to: "/features",
                      icon: <Zap className="w-6 h-6" />,
                      title: "Features",
                      desc: "Explore platform features",
                      color: "from-emerald-500 to-teal-500"
                    },
                    {
                      to: "/pricing",
                      icon: <Crown className="w-6 h-6" />,
                      title: "Pricing",
                      desc: "View school plans",
                      color: "from-purple-500 to-pink-500"
                    },
                    {
                      to: "/contact-us",
                      icon: <MessageSquare className="w-6 h-6" />,
                      title: "Contact",
                      desc: "Get in touch with us",
                      color: "from-orange-500 to-red-500"
                    }
                  ].map((link, index) => (
                    <Link
                      key={index}
                      to={link.to}
                      className="group relative overflow-hidden rounded-2xl p-8 hover:shadow-2xl transition-all duration-500"
                    >
                      {/* Gradient Background */}
                      <div className={`absolute inset-0 bg-gradient-to-br ${link.color} opacity-0 group-hover:opacity-100 transition-opacity duration-500`}></div>
                      <div className="absolute inset-0 bg-gray-800 group-hover:bg-transparent transition-colors duration-500"></div>
                      
                      <div className="relative z-10">
                        <div className={`inline-flex p-4 bg-gradient-to-br ${link.color} rounded-xl mb-6 group-hover:scale-110 transition-transform duration-300`}>
                          <div className="text-white">{link.icon}</div>
                        </div>
                        <div className="font-bold text-xl mb-2 group-hover:text-white transition-colors">{link.title}</div>
                        <div className="text-gray-400 group-hover:text-white/80 transition-colors">{link.desc}</div>
                        <div className="mt-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                          <ArrowRight className="w-5 h-5 text-white transform group-hover:translate-x-2 transition-transform" />
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            </section>
    </div>
  );
};

export default HomePage;