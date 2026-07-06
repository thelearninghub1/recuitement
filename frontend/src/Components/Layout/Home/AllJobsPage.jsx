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
  Heart
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
    teachingLicense: ''
  });
  
  const [sortBy, setSortBy] = useState('newest');
  const [currentPage, setCurrentPage] = useState(1);
  const jobsPerPage = 9;

  useEffect(() => {
    dispatch(getJobs());
  }, [dispatch]);

  useEffect(() => {
    if (jobs.length > 0) {
      let result = [...jobs];
      
      // Apply search filter
      if (searchTerm) {
        result = result.filter(job => 
          job.jobTitle?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          job.schoolName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          job.city?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          job.jobDescription?.toLowerCase().includes(searchTerm.toLowerCase())
        );
      }
      
      // Apply location filter
      if (filters.location) {
        result = result.filter(job => job.city?.toLowerCase() === filters.location.toLowerCase());
      }
      
      // Apply job type filter
      if (filters.jobType) {
        result = result.filter(job => job.jobType === filters.jobType);
      }
      
      // Apply curriculum filter
      if (filters.curriculum) {
        result = result.filter(job => 
          job.curriculumRequired?.some(curr => curr === filters.curriculum)
        );
      }
      
      // Apply min salary filter
      if (filters.minSalary) {
        result = result.filter(job => job.minSalary >= parseInt(filters.minSalary));
      }
      
      // Apply max salary filter
      if (filters.maxSalary) {
        result = result.filter(job => job.maxSalary <= parseInt(filters.maxSalary));
      }
      
      // Apply experience filter
      if (filters.experience) {
        result = result.filter(job => job.experienceRequired === filters.experience);
      }
      
      // Apply date posted filter
      if (filters.datePosted) {
        const now = new Date();
        const daysAgo = parseInt(filters.datePosted);
        const cutoffDate = new Date(now.setDate(now.getDate() - daysAgo));
        result = result.filter(job => new Date(job.createdAt) > cutoffDate);
      }
      
      // NEW: Apply gender filter
      if (filters.gender) {
        if (filters.gender === 'Both') {
          result = result.filter(job => 
            job.gender === 'Male' || job.gender === 'Female'
          );
        } else {
          result = result.filter(job => job.gender === filters.gender);
        }
      }
      
      // NEW: Apply residency status filter
      if (filters.residencyStatus) {
        result = result.filter(job => 
          job.residencyStatus === filters.residencyStatus
        );
      }
      
      // NEW: Apply nationality filter
      if (filters.nationality) {
        result = result.filter(job => 
          job.preferredNationality === filters.nationality
        );
      }
      
      // NEW: Apply career level filter
      if (filters.careerLevel) {
        result = result.filter(job => 
          job.careerLevel === filters.careerLevel
        );
      }
      
      // NEW: Apply qualification filter
      if (filters.qualification) {
        result = result.filter(job => 
          job.minQualification === filters.qualification
        );
      }
      
      // NEW: Apply English certificate filter
      if (filters.englishCert) {
        result = result.filter(job => 
          job.englishCertRequired === filters.englishCert
        );
      }
      
      // NEW: Apply teaching license filter
      if (filters.teachingLicense) {
        result = result.filter(job => 
          job.teachingLicenseRequired === filters.teachingLicense
        );
      }
      
      // Apply sorting
      switch (sortBy) {
        case 'newest':
          result.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
          break;
        case 'salary_high':
          result.sort((a, b) => (b.maxSalary || 0) - (a.maxSalary || 0));
          break;
        case 'salary_low':
          result.sort((a, b) => (a.minSalary || 0) - (b.minSalary || 0));
          break;
        case 'experience_high':
          result.sort((a, b) => {
            const expA = parseInt(a.experienceRequired) || 0;
            const expB = parseInt(b.experienceRequired) || 0;
            return expB - expA;
          });
          break;
        default:
          break;
      }
      
      setFilteredJobs(result);
    }
  }, [jobs, searchTerm, filters, sortBy]);

  // Get unique values for filter dropdowns
  const locations = [...new Set(jobs.map(job => job.city).filter(Boolean))];
  const jobTypes = [...new Set(jobs.map(job => job.jobType).filter(Boolean))];
  const curricula = [...new Set(jobs.flatMap(job => job.curriculumRequired || []).filter(Boolean))];
  const genders = ['Male', 'Female', 'Both'];
  const residencyStatuses = [...new Set(jobs.map(job => job.residencyStatus).filter(Boolean))];
  const nationalities = [...new Set(jobs.map(job => job.preferredNationality).filter(Boolean))];
  const careerLevels = [...new Set(jobs.map(job => job.careerLevel).filter(Boolean))];
  const qualifications = [...new Set(jobs.map(job => job.minQualification).filter(Boolean))];
  const englishCerts = [...new Set(jobs.map(job => job.englishCertRequired).filter(Boolean))];
  const teachingLicenses = [...new Set(jobs.map(job => job.teachingLicenseRequired).filter(Boolean))];
  
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
      teachingLicense: ''
    });
    setSearchTerm('');
    setCurrentPage(1);
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
                placeholder="Search jobs by title, school, or location..."
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

                {/* Job Type Filter */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <Briefcase className="inline w-4 h-4 mr-1" />
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
                      <option value="8000">8,000</option>
                      <option value="10000">10,000</option>
                      <option value="12000">12,000</option>
                      <option value="15000">15,000</option>
                      <option value="18000">18,000</option>
                      <option value="20000">20,000</option>
                    </select>
                    <select
                      value={filters.maxSalary}
                      onChange={(e) => handleFilterChange('maxSalary', e.target.value)}
                      className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      <option value="">Max</option>
                      <option value="15000">15,000</option>
                      <option value="20000">20,000</option>
                      <option value="25000">25,000</option>
                      <option value="30000">30,000</option>
                      <option value="35000">35,000</option>
                    </select>
                  </div>
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
                    <option value="1">1 year</option>
                    <option value="2">2 years</option>
                    <option value="3">3 years</option>
                    <option value="4">4 years</option>
                    <option value="5">5 years</option>
                    <option value="More than 5 years">5+ years</option>
                  </select>
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

                {/* NEW: Gender Filter */}
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

                {/* NEW: Residency Status Filter */}
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

                {/* NEW: Nationality Filter */}
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

                {/* NEW: Career Level Filter */}
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

                {/* NEW: Qualification Filter */}
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

                {/* NEW: English Certificate Filter */}
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

                {/* NEW: Teaching License Filter */}
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
        <div className="mb-6 flex justify-between items-center">
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
              {currentJobs.map((job, index) => (
                <motion.div
                  key={job._id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="bg-white rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300 border border-gray-100 overflow-hidden flex flex-col h-full"
                >
                  {/* Job Header */}
                  <div className="bg-gradient-to-r from-blue-50 to-cyan-50 p-6">
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <h3 className="text-lg font-bold text-gray-900 mb-1">
                          {getJobTitleDisplay(job)}
                        </h3>
                        <p className="text-blue-600 font-medium">{job.schoolName || 'International School'}</p>
                        {job.jobTitle === 'Other' && job.jobTitleOther && (
                          <p className="text-xs text-gray-500 mt-1">Previously listed as: {job.jobTitle}</p>
                        )}
                      </div>
                      {job.status === 'urgent' && (
                        <span className="px-3 py-1 bg-red-100 text-red-600 text-xs font-bold rounded-full">
                          URGENT
                        </span>
                      )}
                    </div>
                    
                    <div className="flex flex-wrap gap-2 mb-3">
                      <span className="px-3 py-1 bg-white text-blue-600 text-sm font-medium rounded-full border border-blue-200">
                        {job.jobType}
                      </span>
                      <span className="px-3 py-1 bg-white text-emerald-600 text-sm font-medium rounded-full border border-emerald-200">
                        {job.experienceRequired || 'Not specified'} exp
                      </span>
                      {job.gender && job.gender !== 'Both' && (
                        <span className="px-3 py-1 bg-white text-purple-600 text-sm font-medium rounded-full border border-purple-200">
                          {job.gender}
                        </span>
                      )}
                      {job.gender === 'Both' && (
                        <span className="px-3 py-1 bg-white text-purple-600 text-sm font-medium rounded-full border border-purple-200">
                          Male/Female
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Job Details */}
                  <div className="p-6 flex-1 flex flex-col">
                    {/* Key Info */}
                    <div className="space-y-4 mb-6">
                      <div className="flex items-center gap-3">
                        <MapPin className="w-5 h-5 text-gray-400 flex-shrink-0" />
                        <span className="text-gray-700">{job.city}, Saudi Arabia</span>
                      </div>
                      
                      <div className="flex items-center gap-3">
                        <DollarSign className="w-5 h-5 text-gray-400 flex-shrink-0" />
                        <div>
                          <span className="text-gray-900 font-semibold">
                            {job.minSalary?.toLocaleString() || '12,000'} - {job.maxSalary?.toLocaleString() || '20,000'} SAR
                          </span>
                          <p className="text-sm text-gray-500">Monthly, tax-free</p>
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-3">
                        <Shield className="w-5 h-5 text-gray-400 flex-shrink-0" />
                        <span className="text-gray-700">{job.residencyStatus || 'Not specified'}</span>
                      </div>

                      <div className="flex items-center gap-3">
                        <Calendar className="w-5 h-5 text-gray-400 flex-shrink-0" />
                        <span className="text-gray-700">
                          Posted: {new Date(job.createdAt).toLocaleDateString()}
                        </span>
                      </div>
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
                        {job.minQualification && (
                          <span className="px-3 py-1 bg-indigo-100 text-indigo-800 text-sm rounded-full">
                            {job.minQualification}
                          </span>
                        )}
                        {job.careerLevel && (
                          <span className="px-3 py-1 bg-pink-100 text-pink-800 text-sm rounded-full">
                            {job.careerLevel}
                          </span>
                        )}
                        {job.teachingLicenseRequired && job.teachingLicenseRequired !== 'Not Required' && (
                          <span className="px-3 py-1 bg-orange-100 text-orange-800 text-sm rounded-full">
                            {job.teachingLicenseRequired}
                          </span>
                        )}
                      </div>
                    </div>

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
              ))}
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