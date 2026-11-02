import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  Briefcase, 
  MapPin, 
  DollarSign, 
  Calendar,
  Clock,
  Filter,
  Search,
  ChevronRight,
  Star,
  CheckCircle,
  BookOpen,
  Award,
  Users,
  Building,
  GraduationCap,
  ArrowRight,
  X,
  ChevronDown,
  ChevronUp,
  User,
  Shield,
  Globe,
  Mail,
  Phone,
  Heart,
  FileText,
  AlertCircle
} from 'lucide-react';
import { getJobs } from '../../../actions/jobActions';
import { toast } from 'react-toastify';

const AllJobsPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  
  const { loading: jobsLoading, jobs = [] } = useSelector((state) => state.allJobs);
  
  const [filteredJobs, setFilteredJobs] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState({
    location: '',
    jobType: '',
    curriculum: '',
    minSalary: '',
    maxSalary: '',
    experience: '',
    datePosted: '',
    gender: '',
    residencyStatus: '',
    nationality: '',
    careerLevel: '',
    qualification: '',
    englishCert: '',
    teachingLicense: '',
    category: '',
    jobTitle: ''
  });
  
  const [sortBy, setSortBy] = useState('newest');
  const [currentPage, setCurrentPage] = useState(1);
  const jobsPerPage = 9;
  const [favorites, setFavorites] = useState(new Set());

  useEffect(() => {
    dispatch(getJobs());
  }, [dispatch]);

  useEffect(() => {
    if (jobs.length > 0) {
      let result = [...jobs];
      
      // Apply search filter
      if (searchTerm) {
        const searchLower = searchTerm.toLowerCase();
        result = result.filter(job => {
          const jobTitle = job.jobTitle === 'Other' ? job.jobTitleOther || '' : job.jobTitle || '';
          const schoolName = job.schoolName || '';
          const city = job.city || '';
          const description = job.jobDescription || '';
          const category = job.category || '';
          const degreeMajor = job.degreeMajor || '';
          
          return (
            jobTitle.toLowerCase().includes(searchLower) ||
            schoolName.toLowerCase().includes(searchLower) ||
            city.toLowerCase().includes(searchLower) ||
            description.toLowerCase().includes(searchLower) ||
            category.toLowerCase().includes(searchLower) ||
            degreeMajor.toLowerCase().includes(searchLower)
          );
        });
      }
      
      // Apply location filter
      if (filters.location) {
        result = result.filter(job => 
          job.city?.toLowerCase() === filters.location.toLowerCase() ||
          job.location?.toLowerCase() === filters.location.toLowerCase()
        );
      }
      
      // Apply job type filter
      if (filters.jobType) {
        result = result.filter(job => 
          job.jobType === filters.jobType ||
          job.jobTypeOther === filters.jobType
        );
      }
      
      // Apply category filter
      if (filters.category) {
        result = result.filter(job => job.category === filters.category);
      }
      
      // Apply job title filter
      if (filters.jobTitle) {
        result = result.filter(job => {
          const title = job.jobTitle === 'Other' ? job.jobTitleOther : job.jobTitle;
          return title === filters.jobTitle;
        });
      }
      
      // Apply curriculum filter
      if (filters.curriculum) {
        result = result.filter(job => {
          const curricula = job.curriculumRequired || [];
          return curricula.some(curr => curr === filters.curriculum);
        });
      }
      
      // Apply min salary filter
      if (filters.minSalary) {
        const minVal = parseInt(filters.minSalary);
        result = result.filter(job => {
          const minSalary = parseInt(job.minSalary) || 0;
          return minSalary >= minVal;
        });
      }
      
      // Apply max salary filter
      if (filters.maxSalary) {
        const maxVal = parseInt(filters.maxSalary);
        result = result.filter(job => {
          const maxSalary = parseInt(job.maxSalary) || Infinity;
          return maxSalary <= maxVal;
        });
      }
      
      // Apply experience filter
      if (filters.experience) {
        result = result.filter(job => {
          if (filters.experience === 'More than 5 years') {
            const exp = parseInt(job.experienceRequired) || 0;
            return exp > 5;
          }
          return job.experienceRequired === filters.experience;
        });
      }
      
      // Apply date posted filter
      if (filters.datePosted) {
        const now = new Date();
        const daysAgo = parseInt(filters.datePosted);
        const cutoffDate = new Date(now.setDate(now.getDate() - daysAgo));
        result = result.filter(job => new Date(job.createdAt) > cutoffDate);
      }
      
      // Apply gender filter
      if (filters.gender) {
        if (filters.gender === 'Both') {
          result = result.filter(job => 
            job.gender === 'Male' || job.gender === 'Female' || job.gender === 'both'
          );
        } else {
          result = result.filter(job => {
            const jobGender = job.gender || '';
            return jobGender.toLowerCase() === filters.gender.toLowerCase();
          });
        }
      }
      
      // Apply residency status filter
      if (filters.residencyStatus) {
        result = result.filter(job => 
          job.residencyStatus === filters.residencyStatus ||
          job.residencyStatusOther === filters.residencyStatus
        );
      }
      
      // Apply nationality filter
      if (filters.nationality) {
        result = result.filter(job => 
          job.preferredNationality === filters.nationality ||
          job.preferredNationalityOther === filters.nationality
        );
      }
      
      // Apply career level filter
      if (filters.careerLevel) {
        result = result.filter(job => 
          job.careerLevel === filters.careerLevel ||
          job.careerLevelOther === filters.careerLevel
        );
      }
      
      // Apply qualification filter
      if (filters.qualification) {
        result = result.filter(job => 
          job.minQualification === filters.qualification ||
          job.minQualificationOther === filters.qualification
        );
      }
      
      // Apply English certificate filter
      if (filters.englishCert) {
        result = result.filter(job => 
          job.englishCertRequired === filters.englishCert ||
          job.englishCertOther === filters.englishCert
        );
      }
      
      // Apply teaching license filter
      if (filters.teachingLicense) {
        result = result.filter(job => 
          job.teachingLicenseRequired === filters.teachingLicense ||
          job.teachingLicenseOther === filters.teachingLicense
        );
      }
      
      // Apply sorting
      switch (sortBy) {
        case 'newest':
          result.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
          break;
        case 'salary_high':
          result.sort((a, b) => (parseInt(b.maxSalary) || 0) - (parseInt(a.maxSalary) || 0));
          break;
        case 'salary_low':
          result.sort((a, b) => (parseInt(a.minSalary) || 0) - (parseInt(b.minSalary) || 0));
          break;
        case 'experience_high':
          result.sort((a, b) => {
            const expA = parseInt(a.experienceRequired) || 0;
            const expB = parseInt(b.experienceRequired) || 0;
            return expB - expA;
          });
          break;
        case 'deadline':
          result.sort((a, b) => {
            const dateA = new Date(a.applicationDeadline) || new Date('2099-12-31');
            const dateB = new Date(b.applicationDeadline) || new Date('2099-12-31');
            return dateA - dateB;
          });
          break;
        default:
          break;
      }
      
      setFilteredJobs(result);
    }
  }, [jobs, searchTerm, filters, sortBy]);

  // Get unique values for filter dropdowns
  const getUniqueValues = (field) => {
    const values = jobs
      .map(job => job[field])
      .filter(Boolean);
    return [...new Set(values)];
  };

  const getUniqueArrayValues = (field) => {
    const values = jobs
      .flatMap(job => job[field] || [])
      .filter(Boolean);
    return [...new Set(values)];
  };

  const locations = [...new Set([
    ...getUniqueValues('city'),
    ...getUniqueValues('location')
  ])];
  
  const jobTypes = getUniqueValues('jobType');
  const categories = getUniqueValues('category');
  const jobTitles = getUniqueValues('jobTitle');
  const curricula = getUniqueArrayValues('curriculumRequired');
  const genders = ['Male', 'Female', 'Both'];
  const residencyStatuses = [...new Set([
    ...getUniqueValues('residencyStatus'),
    ...getUniqueValues('residencyStatusOther')
  ])];
  const nationalities = [...new Set([
    ...getUniqueValues('preferredNationality'),
    ...getUniqueValues('preferredNationalityOther')
  ])];
  const careerLevels = [...new Set([
    ...getUniqueValues('careerLevel'),
    ...getUniqueValues('careerLevelOther')
  ])];
  const qualifications = [...new Set([
    ...getUniqueValues('minQualification'),
    ...getUniqueValues('minQualificationOther')
  ])];
  const englishCerts = [...new Set([
    ...getUniqueValues('englishCertRequired'),
    ...getUniqueValues('englishCertOther')
  ])];
  const teachingLicenses = [...new Set([
    ...getUniqueValues('teachingLicenseRequired'),
    ...getUniqueValues('teachingLicenseOther')
  ])];
  
  // Calculate pagination
  const indexOfLastJob = currentPage * jobsPerPage;
  const indexOfFirstJob = indexOfLastJob - jobsPerPage;
  const currentJobs = filteredJobs.slice(indexOfFirstJob, indexOfLastJob);
  const totalPages = Math.ceil(filteredJobs.length / jobsPerPage);

  const handleApplyJob = (jobId) => {
    navigate('/teacher-login');
  };

  const handleViewJob = (jobId) => {
    navigate(`/job/${jobId}`);
  };

  const toggleFavorite = (jobId, e) => {
    e.stopPropagation();
    setFavorites(prev => {
      const newFavorites = new Set(prev);
      if (newFavorites.has(jobId)) {
        newFavorites.delete(jobId);
        toast.info('Removed from favorites');
      } else {
        newFavorites.add(jobId);
        toast.success('Added to favorites');
      }
      return newFavorites;
    });
  };

  const handleFilterChange = (filterName, value) => {
    setFilters(prev => ({
      ...prev,
      [filterName]: value
    }));
    setCurrentPage(1);
  };

  const clearFilters = () => {
    setFilters({
      location: '',
      jobType: '',
      curriculum: '',
      minSalary: '',
      maxSalary: '',
      experience: '',
      datePosted: '',
      gender: '',
      residencyStatus: '',
      nationality: '',
      careerLevel: '',
      qualification: '',
      englishCert: '',
      teachingLicense: '',
      category: '',
      jobTitle: ''
    });
    setSearchTerm('');
    setCurrentPage(1);
    toast.info('All filters cleared');
  };

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Helper function to display job title with fallback
  const getJobTitleDisplay = (job) => {
    if (job.jobTitle && job.jobTitle !== 'Other') {
      return job.jobTitle;
    }
    if (job.jobTitleOther) {
      return job.jobTitleOther;
    }
    return 'Teaching Position';
  };

  // Helper to check if any filters are active
  const hasActiveFilters = () => {
    return Object.values(filters).some(value => value !== '');
  };

  // Format salary with commas
  const formatSalary = (value) => {
    if (!value) return '0';
    return Number(value).toLocaleString();
  };

  // Get days since posted
  const getDaysSincePosted = (dateString) => {
    if (!dateString) return '';
    const posted = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now - posted);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    if (diffDays === 0) return 'Today';
    if (diffDays === 1) return 'Yesterday';
    return `${diffDays} days ago`;
  };

  if (jobsLoading) {
    return (
      <div className="min-h-screen mt-30 bg-gradient-to-br from-slate-50 to-blue-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-20 h-20 border-4 border-[#2563eb] border-t-transparent rounded-full animate-spin mx-auto mb-6"></div>
          <h2 className="text-2xl font-bold text-gray-800">Loading Jobs...</h2>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen mt-30 bg-gradient-to-br from-slate-50 to-blue-50">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-[#2C7EAD] to-[#00AEEF] text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">Find Teaching Jobs in Middle East</h1>
            <p className="text-xl opacity-90 max-w-3xl mx-auto">
              Browse {filteredJobs.length} teaching positions across international schools in Middle East
            </p>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Search and Filter Bar */}
        <div className="bg-white rounded-2xl shadow-xl p-6 mb-8">
          <div className="flex flex-col lg:flex-row gap-4 items-center justify-between">
            {/* Search Input */}
            <div className="relative flex-1 w-full">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search jobs by title, school, location, or category..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            {/* Filter Toggle Button */}
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-500 to-cyan-500 text-white rounded-xl hover:shadow-lg transition-all duration-300"
            >
              <Filter className="w-5 h-5" />
              Filters
              {showFilters ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
              {hasActiveFilters() && (
                <span className="ml-1 px-2 py-0.5 bg-white text-blue-600 text-xs rounded-full">
                  {Object.values(filters).filter(v => v !== '').length}
                </span>
              )}
            </button>

            {/* Sort Dropdown */}
            <div className="relative">
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="px-4 py-3 border border-gray-300 rounded-xl appearance-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="newest">Newest First</option>
                <option value="salary_high">Highest Salary</option>
                <option value="salary_low">Lowest Salary</option>
                <option value="experience_high">Most Experience Required</option>
                <option value="deadline">Earliest Deadline</option>
              </select>
              <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" />
            </div>
          </div>

          {/* Filters Panel */}
          {showFilters && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="mt-6 pt-6 border-t border-gray-200"
            >
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {/* Location Filter */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <MapPin className="inline w-4 h-4 mr-1" />
                    Location
                  </label>
                  <select
                    value={filters.location}
                    onChange={(e) => handleFilterChange('location', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="">All Locations</option>
                    {locations.map((loc, idx) => (
                      <option key={idx} value={loc}>{loc}</option>
                    ))}
                  </select>
                </div>

                {/* Category Filter */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <Briefcase className="inline w-4 h-4 mr-1" />
                    Category
                  </label>
                  <select
                    value={filters.category}
                    onChange={(e) => handleFilterChange('category', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="">All Categories</option>
                    {categories.map((cat, idx) => (
                      <option key={idx} value={cat}>{cat}</option>
                    ))}
                  </select>
                </div>

                {/* Job Title Filter */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <FileText className="inline w-4 h-4 mr-1" />
                    Job Title
                  </label>
                  <select
                    value={filters.jobTitle}
                    onChange={(e) => handleFilterChange('jobTitle', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="">All Titles</option>
                    {jobTitles.map((title, idx) => (
                      <option key={idx} value={title}>{title}</option>
                    ))}
                  </select>
                </div>

                {/* Job Type Filter */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <Clock className="inline w-4 h-4 mr-1" />
                    Job Type
                  </label>
                  <select
                    value={filters.jobType}
                    onChange={(e) => handleFilterChange('jobType', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="">All Types</option>
                    {jobTypes.map((type, idx) => (
                      <option key={idx} value={type}>{type}</option>
                    ))}
                  </select>
                </div>

                {/* Curriculum Filter */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <BookOpen className="inline w-4 h-4 mr-1" />
                    Curriculum
                  </label>
                  <select
                    value={filters.curriculum}
                    onChange={(e) => handleFilterChange('curriculum', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="">All Curricula</option>
                    {curricula.map((curr, idx) => (
                      <option key={idx} value={curr}>{curr}</option>
                    ))}
                  </select>
                </div>

                {/* Gender Filter */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <User className="inline w-4 h-4 mr-1" />
                    Gender Preference
                  </label>
                  <select
                    value={filters.gender}
                    onChange={(e) => handleFilterChange('gender', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="">All Genders</option>
                    {genders.map((gender, idx) => (
                      <option key={idx} value={gender}>{gender}</option>
                    ))}
                  </select>
                  {filters.gender === 'Both' && (
                    <p className="text-xs text-blue-500 mt-1">Shows jobs accepting both Male and Female</p>
                  )}
                </div>

                {/* Residency Status Filter */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <Shield className="inline w-4 h-4 mr-1" />
                    Residency Status
                  </label>
                  <select
                    value={filters.residencyStatus}
                    onChange={(e) => handleFilterChange('residencyStatus', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="">All Status</option>
                    {residencyStatuses.map((status, idx) => (
                      <option key={idx} value={status}>{status}</option>
                    ))}
                  </select>
                </div>

                {/* Nationality Filter */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <Globe className="inline w-4 h-4 mr-1" />
                    Preferred Nationality
                  </label>
                  <select
                    value={filters.nationality}
                    onChange={(e) => handleFilterChange('nationality', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="">All Nationalities</option>
                    {nationalities.map((nat, idx) => (
                      <option key={idx} value={nat}>{nat}</option>
                    ))}
                  </select>
                </div>

                {/* Career Level Filter */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <Users className="inline w-4 h-4 mr-1" />
                    Career Level
                  </label>
                  <select
                    value={filters.careerLevel}
                    onChange={(e) => handleFilterChange('careerLevel', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="">All Levels</option>
                    {careerLevels.map((level, idx) => (
                      <option key={idx} value={level}>{level}</option>
                    ))}
                  </select>
                </div>

                {/* Qualification Filter */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <GraduationCap className="inline w-4 h-4 mr-1" />
                    Minimum Qualification
                  </label>
                  <select
                    value={filters.qualification}
                    onChange={(e) => handleFilterChange('qualification', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="">All Qualifications</option>
                    {qualifications.map((qual, idx) => (
                      <option key={idx} value={qual}>{qual}</option>
                    ))}
                  </select>
                </div>

                {/* English Certificate Filter */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <Star className="inline w-4 h-4 mr-1" />
                    English Certificate
                  </label>
                  <select
                    value={filters.englishCert}
                    onChange={(e) => handleFilterChange('englishCert', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="">All Certificates</option>
                    {englishCerts.map((cert, idx) => (
                      <option key={idx} value={cert}>{cert}</option>
                    ))}
                  </select>
                </div>

                {/* Teaching License Filter */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <CheckCircle className="inline w-4 h-4 mr-1" />
                    Teaching License
                  </label>
                  <select
                    value={filters.teachingLicense}
                    onChange={(e) => handleFilterChange('teachingLicense', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="">All Licenses</option>
                    {teachingLicenses.map((license, idx) => (
                      <option key={idx} value={license}>{license}</option>
                    ))}
                  </select>
                </div>

                {/* Experience Filter */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <Award className="inline w-4 h-4 mr-1" />
                    Experience Required
                  </label>
                  <select
                    value={filters.experience}
                    onChange={(e) => handleFilterChange('experience', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="">Any Experience</option>
                    <option value="0">No experience</option>
                    <option value="1">1 year</option>
                    <option value="2">2 years</option>
                    <option value="3">3 years</option>
                    <option value="4">4 years</option>
                    <option value="5">5 years</option>
                    <option value="More than 5 years">5+ years</option>
                  </select>
                </div>

                {/* Salary Range */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <DollarSign className="inline w-4 h-4 mr-1" />
                    Salary Range (SAR)
                  </label>
                  <div className="flex gap-2">
                    <select
                      value={filters.minSalary}
                      onChange={(e) => handleFilterChange('minSalary', e.target.value)}
                      className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      <option value="">Min</option>
                      <option value="5000">5,000</option>
                      <option value="8000">8,000</option>
                      <option value="10000">10,000</option>
                      <option value="12000">12,000</option>
                      <option value="15000">15,000</option>
                      <option value="18000">18,000</option>
                      <option value="20000">20,000</option>
                      <option value="25000">25,000</option>
                    </select>
                    <select
                      value={filters.maxSalary}
                      onChange={(e) => handleFilterChange('maxSalary', e.target.value)}
                      className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      <option value="">Max</option>
                      <option value="10000">10,000</option>
                      <option value="15000">15,000</option>
                      <option value="20000">20,000</option>
                      <option value="25000">25,000</option>
                      <option value="30000">30,000</option>
                      <option value="35000">35,000</option>
                      <option value="40000">40,000</option>
                    </select>
                  </div>
                </div>

                {/* Date Posted Filter */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <Calendar className="inline w-4 h-4 mr-1" />
                    Date Posted
                  </label>
                  <select
                    value={filters.datePosted}
                    onChange={(e) => handleFilterChange('datePosted', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="">Any Time</option>
                    <option value="1">Last 24 hours</option>
                    <option value="3">Last 3 days</option>
                    <option value="7">Last 7 days</option>
                    <option value="14">Last 14 days</option>
                    <option value="30">Last 30 days</option>
                  </select>
                </div>
              </div>

              {/* Clear Filters Button */}
              {hasActiveFilters() && (
                <div className="mt-6 flex justify-end">
                  <button
                    onClick={clearFilters}
                    className="flex items-center gap-2 px-4 py-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                  >
                    <X className="w-4 h-4" />
                    Clear All Filters ({Object.values(filters).filter(v => v !== '').length} active)
                  </button>
                </div>
              )}
            </motion.div>
          )}
        </div>

        {/* Results Summary */}
        <div className="mb-6 flex justify-between items-center flex-wrap gap-4">
          <p className="text-gray-600">
            Showing <span className="font-bold text-blue-600">{currentJobs.length}</span> of{' '}
            <span className="font-bold text-blue-600">{filteredJobs.length}</span> jobs
            {searchTerm && ` for "${searchTerm}"`}
          </p>
          {hasActiveFilters() && (
            <button
              onClick={clearFilters}
              className="text-sm text-blue-600 hover:text-blue-800 font-medium"
            >
              Clear all filters
            </button>
          )}
        </div>

        {/* Jobs Grid */}
        {currentJobs.length === 0 ? (
          <div className="text-center py-16 bg-white rounded-2xl shadow-lg">
            <Briefcase className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-bold text-gray-700 mb-2">No jobs found</h3>
            <p className="text-gray-600 mb-6">Try adjusting your search or filters</p>
            <button
              onClick={clearFilters}
              className="px-6 py-3 bg-gradient-to-r from-blue-500 to-cyan-500 text-white rounded-xl hover:shadow-lg transition-all duration-300"
            >
              Clear All Filters
            </button>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {currentJobs.map((job, index) => {
                const jobTitle = getJobTitleDisplay(job);
                const daysPosted = getDaysSincePosted(job.createdAt);
                const minSalary = formatSalary(job.minSalary);
                const maxSalary = formatSalary(job.maxSalary);
                const isDeadlineSoon = job.applicationDeadline && new Date(job.applicationDeadline) < new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);
                
                return (
                  <motion.div
                    key={job._id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="bg-white rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300 border border-gray-100 overflow-hidden flex flex-col h-full"
                  >
                    {/* Job Header */}
                    <div className="bg-gradient-to-r from-blue-50 to-cyan-50 p-6 relative">
                      {/* Favorite Button */}
                      <button
                        onClick={(e) => toggleFavorite(job._id, e)}
                        className="absolute top-4 right-4 z-10"
                      >
                        <Heart className={`w-6 h-6 transition-all duration-300 ${
                          favorites.has(job._id) 
                            ? 'fill-red-500 text-red-500' 
                            : 'text-gray-400 hover:text-red-500'
                        }`} />
                      </button>
                      
                      <div className="flex justify-between items-start mb-3">
                        <div>
                          <h3 className="text-lg font-bold text-gray-900 mb-1 line-clamp-2">{jobTitle}</h3>
                          <p className="text-blue-600 font-medium">{job.schoolName || 'International School'}</p>
                          {job.jobTitle === 'Other' && job.jobTitleOther && (
                            <p className="text-xs text-gray-500 mt-1">Previously: {job.jobTitle}</p>
                          )}
                        </div>
                        {isDeadlineSoon && (
                          <span className="px-3 py-1 bg-red-100 text-red-600 text-xs font-bold rounded-full ml-2">
                            Soon!
                          </span>
                        )}
                      </div>
                      
                      <div className="flex flex-wrap gap-2">
                        <span className="px-3 py-1 bg-white text-blue-600 text-sm font-medium rounded-full border border-blue-200">
                          {job.jobType || 'Full Time'}
                        </span>
                        <span className="px-3 py-1 bg-white text-emerald-600 text-sm font-medium rounded-full border border-emerald-200">
                          {job.experienceRequired || 'Not specified'} exp
                        </span>
                        {job.category && (
                          <span className="px-3 py-1 bg-white text-purple-600 text-sm font-medium rounded-full border border-purple-200">
                            {job.category}
                          </span>
                        )}
                        {job.gender && job.gender !== 'Both' && job.gender !== 'both' && (
                          <span className="px-3 py-1 bg-white text-pink-600 text-sm font-medium rounded-full border border-pink-200">
                            {job.gender}
                          </span>
                        )}
                        {job.gender === 'Both' && (
                          <span className="px-3 py-1 bg-white text-pink-600 text-sm font-medium rounded-full border border-pink-200">
                            Male/Female
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Job Details */}
                    <div className="p-6 flex-1 flex flex-col">
                      {/* Key Info */}
                      <div className="space-y-3 mb-6">
                        <div className="flex items-center gap-3">
                          <MapPin className="w-5 h-5 text-gray-400 flex-shrink-0" />
                          <span className="text-gray-700">{job.city || job.location || 'Saudi Arabia'}</span>
                        </div>
                        
                        <div className="flex items-center gap-3">
                          <DollarSign className="w-5 h-5 text-gray-400 flex-shrink-0" />
                          <div>
                            <span className="text-gray-900 font-semibold">
                              {minSalary || 'Negotiable'} - {maxSalary || 'Negotiable'} SAR
                            </span>
                            <p className="text-xs text-gray-500">Monthly, tax-free</p>
                          </div>
                        </div>
                        
                        <div className="flex items-center gap-3">
                          <Shield className="w-5 h-5 text-gray-400 flex-shrink-0" />
                          <span className="text-gray-700">{job.residencyStatus || job.residencyStatusOther || 'Not specified'}</span>
                        </div>

                        <div className="flex items-center gap-3">
                          <Calendar className="w-5 h-5 text-gray-400 flex-shrink-0" />
                          <span className="text-gray-700">
                            {daysPosted}
                            {job.applicationDeadline && (
                              <span className="text-gray-400 ml-2">
                                Deadline: {new Date(job.applicationDeadline).toLocaleDateString()}
                              </span>
                            )}
                          </span>
                        </div>

                        {job.preferredNationality && job.preferredNationality !== 'Any' && (
                          <div className="flex items-center gap-3">
                            <Globe className="w-5 h-5 text-gray-400 flex-shrink-0" />
                            <span className="text-gray-700">Nationality: {job.preferredNationality}</span>
                          </div>
                        )}
                      </div>

                      {/* Curriculum Tags */}
                      {job.curriculumRequired && job.curriculumRequired.length > 0 && (
                        <div className="mb-6">
                          <h4 className="font-semibold text-gray-900 mb-2">Curriculum</h4>
                          <div className="flex flex-wrap gap-2">
                            {job.curriculumRequired.slice(0, 3).map((curr, idx) => (
                              <span key={idx} className="px-3 py-1 bg-blue-100 text-blue-800 text-sm rounded-full">
                                {curr}
                              </span>
                            ))}
                            {job.curriculumRequired.length > 3 && (
                              <span className="px-3 py-1 bg-gray-100 text-gray-600 text-sm rounded-full">
                                +{job.curriculumRequired.length - 3} more
                              </span>
                            )}
                          </div>
                        </div>
                      )}

                      {/* Requirements Summary */}
                      <div className="mb-6">
                        <h4 className="font-semibold text-gray-900 mb-2">Requirements</h4>
                        <div className="flex flex-wrap gap-2">
                          {job.minQualification && job.minQualification !== 'Other' && (
                            <span className="px-3 py-1 bg-indigo-100 text-indigo-800 text-sm rounded-full">
                              {job.minQualification}
                            </span>
                          )}
                          {job.careerLevel && job.careerLevel !== 'Other' && (
                            <span className="px-3 py-1 bg-pink-100 text-pink-800 text-sm rounded-full">
                              {job.careerLevel}
                            </span>
                          )}
                          {job.englishCertRequired && job.englishCertRequired !== 'Not Required' && job.englishCertRequired !== 'Other' && (
                            <span className="px-3 py-1 bg-orange-100 text-orange-800 text-sm rounded-full">
                              {job.englishCertRequired}
                            </span>
                          )}
                          {job.teachingLicenseRequired && job.teachingLicenseRequired !== 'Not Required' && job.teachingLicenseRequired !== 'Other' && (
                            <span className="px-3 py-1 bg-emerald-100 text-emerald-800 text-sm rounded-full">
                              {job.teachingLicenseRequired}
                            </span>
                          )}
                          {job.attestedDegreeRequired && job.attestedDegreeRequired !== 'No' && (
                            <span className="px-3 py-1 bg-yellow-100 text-yellow-800 text-sm rounded-full">
                              Attested Degree Required
                            </span>
                          )}
                        </div>
                      </div>

                      {/* Non-Teaching Role */}
                      {job.nonTeachingRole && job.nonTeachingRole.length > 0 && (
                        <div className="mb-6">
                          <h4 className="font-semibold text-gray-900 mb-2">Non-Teaching Role</h4>
                          <div className="flex flex-wrap gap-2">
                            {job.nonTeachingRole.slice(0, 2).map((role, idx) => (
                              <span key={idx} className="px-3 py-1 bg-cyan-100 text-cyan-800 text-sm rounded-full">
                                {role}
                              </span>
                            ))}
                            {job.nonTeachingRole.length > 2 && (
                              <span className="px-3 py-1 bg-gray-100 text-gray-600 text-sm rounded-full">
                                +{job.nonTeachingRole.length - 2} more
                              </span>
                            )}
                          </div>
                        </div>
                      )}

                      {/* Action Buttons */}
                      <div className="mt-auto pt-6 border-t border-gray-100">
                        <div className="flex gap-3">
                          <button
                            onClick={() => handleApplyJob(job._id)}
                            className="flex-1 py-3 bg-gradient-to-r from-[#2C7EAD] to-[#00AEEF] text-white rounded-xl font-semibold hover:shadow-lg transition-all duration-300"
                          >
                            Apply Now
                          </button>
                          <button
                            onClick={() => handleViewJob(job._id)}
                            className="px-6 py-3 border-2 border-blue-600 text-blue-600 rounded-xl font-semibold hover:bg-blue-50 transition-all duration-300"
                          >
                            Details
                          </button>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="mt-12 flex justify-center">
                <nav className="flex items-center gap-2">
                  <button
                    onClick={() => handlePageChange(currentPage - 1)}
                    disabled={currentPage === 1}
                    className={`px-4 py-2 rounded-lg ${
                      currentPage === 1
                        ? 'text-gray-400 cursor-not-allowed'
                        : 'text-blue-600 hover:bg-blue-50'
                    }`}
                  >
                    Previous
                  </button>
                  
                  {[...Array(totalPages)].map((_, idx) => {
                    const pageNumber = idx + 1;
                    if (
                      pageNumber === 1 ||
                      pageNumber === totalPages ||
                      (pageNumber >= currentPage - 1 && pageNumber <= currentPage + 1)
                    ) {
                      return (
                        <button
                          key={idx}
                          onClick={() => handlePageChange(pageNumber)}
                          className={`w-10 h-10 rounded-lg font-medium ${
                            currentPage === pageNumber
                              ? 'bg-gradient-to-r from-[#2C7EAD] to-[#00AEEF] text-white'
                              : 'text-gray-700 hover:bg-gray-100'
                          }`}
                        >
                          {pageNumber}
                        </button>
                      );
                    } else if (
                      pageNumber === currentPage - 2 ||
                      pageNumber === currentPage + 2
                    ) {
                      return <span key={idx} className="px-2">...</span>;
                    }
                    return null;
                  })}
                  
                  <button
                    onClick={() => handlePageChange(currentPage + 1)}
                    disabled={currentPage === totalPages}
                    className={`px-4 py-2 rounded-lg ${
                      currentPage === totalPages
                        ? 'text-gray-400 cursor-not-allowed'
                        : 'text-blue-600 hover:bg-blue-50'
                    }`}
                  >
                    Next
                  </button>
                </nav>
              </div>
            )}
          </>
        )}

        {/* Call to Action */}
        <div className="mt-16 text-center">
          <div className="bg-gradient-to-r from-blue-50 to-cyan-50 rounded-2xl p-8">
            <GraduationCap className="w-16 h-16 text-blue-600 mx-auto mb-4" />
            <h3 className="text-2xl font-bold text-gray-900 mb-4">
              Ready to find your perfect teaching position?
            </h3>
            <p className="text-gray-600 mb-6 max-w-2xl mx-auto">
              Create a free teacher profile to get matched with schools and receive job alerts
            </p>
            <button
              onClick={() => navigate('/teacher-register')}
              className="px-8 py-4 bg-gradient-to-r from-[#2C7EAD] to-[#00AEEF] text-white font-bold rounded-2xl hover:shadow-2xl transition-all duration-300 inline-flex items-center gap-3 group"
            >
              Join as Teacher - Free
              <ArrowRight className="w-5 h-5 group-hover:translate-x-2 transition-transform" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AllJobsPage;