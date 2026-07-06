// src/pages/PostedJobsDashboard.jsx
import React, { useState, useEffect, useCallback } from 'react';
import { 
  FaSearch, 
  FaTrash, 
  FaEye, 
  FaBuilding, 
  FaUsers,
  FaCalendar,
  FaMoneyBillWave,
  FaMapMarkerAlt,
  FaFilter,
  FaFileAlt,
  FaChartBar,
  FaArrowLeft,
  FaList,
  FaBriefcase,
  FaUserGraduate,
  FaSpinner,
  FaEdit,
  FaEnvelope,
  FaPhone,
  FaDownload,
  FaTimes,
  FaSync,
  FaCheckCircle,
  FaClock,
  FaUserCircle,
  FaFilePdf,
  FaFileWord
} from 'react-icons/fa';
import { 
  getJobs, 
  getJobDetails, 
  deleteJob, 
  getJobApplications
} from '../../actions/jobActions';
import { DELETE_JOB_RESET } from '../../constants/jobConstants';
import { useSelector, useDispatch } from 'react-redux';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import { allUserAction } from '../../actions/userActions';

// Helper: get backend base URL
//const API_BASE_URL =  'http://localhost:5000';
const API_BASE_URL =  '';

const PostedJobsDashboard = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  
  // Redux selectors with safe defaults
  const allJobsState = useSelector((state) => state.allJobs) || {};
  const { 
    loading: jobsLoading, 
    error: jobsError, 
    jobs = []
  } = allJobsState;
  
  const jobDetailsState = useSelector((state) => state.jobDetails) || {};
  const { 
    loading: jobDetailsLoading, 
    error: jobDetailsError, 
    job: currentJob 
  } = jobDetailsState;
  
  const allUsersState = useSelector((state) => state.allUsers) || {};
  const { 
    loading: allUsersLoading, 
    error: allUsersError, 
    users: allUsers = []
  } = allUsersState;
  
  const jobActionState = useSelector((state) => state.jobAction) || {};
  const { 
    loading: deleteLoading, 
    error: deleteError, 
    success: deleteSuccess, 
    message: deleteMessage
  } = jobActionState;
  
  const applicationsState = useSelector((state) => state.applications) || {};
  const { 
    loading: applicationsLoading, 
    error: applicationsError, 
    applications 
  } = applicationsState;

  const [activeView, setActiveView] = useState('grid');
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [typeFilter, setTypeFilter] = useState('all');
  const [selectedJob, setSelectedJob] = useState(null);
  const [jobApplications, setJobApplications] = useState([]);
  const [localStats, setLocalStats] = useState({
    totalJobs: 0,
    activeJobs: 0,
    totalApplications: 0,
    avgApplications: 0
  });
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [allSchools, setAllSchools] = useState([]);
  const [jobsWithSchools, setJobsWithSchools] = useState([]);
  const [hasAppliedFilters, setHasAppliedFilters] = useState(false);
  const [tempSearchTerm, setTempSearchTerm] = useState('');
  const [tempStatusFilter, setTempStatusFilter] = useState('all');
  const [tempTypeFilter, setTempTypeFilter] = useState('all');
  const [shouldRefreshPage, setShouldRefreshPage] = useState(false);

  // Load all jobs and users on component mount
  useEffect(() => {
    const loadData = async () => {
      setIsLoading(true);
      try {
        await dispatch(getJobs());
        await dispatch(allUserAction());
      } catch (error) {
        console.error('Error loading data:', error);
      } finally {
        setIsLoading(false);
      }
    };
    
    loadData();
  }, [dispatch]);

  // Extract schools from users and match with jobs
  useEffect(() => {
    if (allUsers && allUsers.length > 0) {
      // Filter only school users
      const schools = allUsers.filter(user => user.role === 'school');
      setAllSchools(schools);
      
      // Create a map of school IDs to school data
      const schoolMap = {};
      schools.forEach(school => {
        if (school._id) {
          schoolMap[school._id] = {
            id: school._id,
            name: school.schoolData?.schoolName || 
                  school.profile?.firstName + ' ' + school.profile?.lastName || 
                  'School Name',
            email: school.email || 'No email',
            phone: school.profile?.mobile || school.schoolData?.telephone || 'No phone',
            city: school.schoolData?.city || 'Not specified',
            country: school.schoolData?.country || 'Not specified',
            schoolData: school.schoolData || {}
          };
        }
      });
      
      // Match jobs with their schools
      if (jobs && jobs.length > 0) {
        const jobsWithSchoolInfo = jobs.map(job => {
          let schoolInfo = {
            name: 'Unknown School',
            email: '',
            phone: '',
            city: 'Unknown',
            country: 'Unknown',
            id: null
          };
          
          // Try to find school by ID
          if (job.school) {
            let schoolId;
            
            // Handle different school ID formats
            if (typeof job.school === 'object') {
              if (job.school.$oid) schoolId = job.school.$oid;
              else if (job.school._id) schoolId = job.school._id;
              else if (job.school.id) schoolId = job.school.id;
            } else {
              schoolId = job.school;
            }
            
            if (schoolId && schoolMap[schoolId]) {
              schoolInfo = schoolMap[schoolId];
            } else if (job.schoolName) {
              // If no school found in map but job has schoolName, use that
              schoolInfo.name = job.schoolName;
            } else if (job.applicationEmail) {
              // Try to extract school name from email
              const domain = job.applicationEmail.split('@')[1];
              if (domain) {
                schoolInfo.name = domain.split('.')[0].replace(/(^\w|\s\w)/g, m => m.toUpperCase()) + ' School';
              }
            }
          }
          
          return {
            ...job,
            schoolInfo: schoolInfo
          };
        });
        
        setJobsWithSchools(jobsWithSchoolInfo);
      }
    }
  }, [allUsers, jobs]);

  // Calculate stats from jobsWithSchools
  useEffect(() => {
    if (jobsWithSchools && jobsWithSchools.length > 0) {
      const activeJobs = jobsWithSchools.filter(job => job.status === 'active');
      const totalApplications = jobsWithSchools.reduce((sum, job) => sum + (job.applicationCount || 0), 0);
      
      setLocalStats({
        totalJobs: jobsWithSchools.length,
        activeJobs: activeJobs.length,
        totalApplications: totalApplications,
        avgApplications: jobsWithSchools.length > 0 ? (totalApplications / jobsWithSchools.length).toFixed(1) : 0
      });
    } else {
      setLocalStats({
        totalJobs: 0,
        activeJobs: 0,
        totalApplications: 0,
        avgApplications: 0
      });
    }
  }, [jobsWithSchools]);

  // Reset delete states on success and refresh jobs
  useEffect(() => {
    if (deleteSuccess) {
      toast.success(deleteMessage || 'Job deleted successfully!');
      
      // Reset delete state
      dispatch({ type: DELETE_JOB_RESET });
      
      // Refresh the jobs list
      dispatch(getJobs());
      
      // Close the modal if open
      if (isModalOpen) {
        handleCloseJobDetails();
      }
      
      // Set flag to refresh page after a short delay
      setShouldRefreshPage(true);
    }

    if (deleteError) {
      toast.error(deleteError);
      dispatch({ type: DELETE_JOB_RESET });
    }

    if (jobsError) {
      toast.error(jobsError);
    }

    if (jobDetailsError) {
      toast.error(jobDetailsError);
    }

    if (applicationsError) {
      toast.error('Error loading applications: ' + applicationsError);
    }
  }, [
    deleteSuccess, 
    deleteError, 
    jobsError,
    jobDetailsError,
    applicationsError,
    dispatch, 
    deleteMessage,
    isModalOpen
  ]);

  // Handle page refresh after delete
  useEffect(() => {
    if (shouldRefreshPage) {
      const timer = setTimeout(() => {
        window.location.reload();
      }, 1500); // 1.5 second delay to show success message
      
      return () => clearTimeout(timer);
    }
  }, [shouldRefreshPage]);

  // Fetch job details and applications when a job is selected
  useEffect(() => {
    if (selectedJob && selectedJob._id) {
      dispatch(getJobDetails(selectedJob._id));
      dispatch(getJobApplications(selectedJob._id));
      setIsModalOpen(true);
    }
  }, [selectedJob, dispatch]);

  // Update jobApplications state when Redux applications change
  useEffect(() => {
    if (applications) {
      setJobApplications(applications);
    }
  }, [applications]);

  // Apply filters function - MANUAL FILTERING
  const applyFilters = () => {
    setSearchTerm(tempSearchTerm);
    setStatusFilter(tempStatusFilter);
    setTypeFilter(tempTypeFilter);
    setHasAppliedFilters(true);
  };

  // Clear all filters
  const clearFilters = () => {
    setTempSearchTerm('');
    setTempStatusFilter('all');
    setTempTypeFilter('all');
    setSearchTerm('');
    setStatusFilter('all');
    setTypeFilter('all');
    setHasAppliedFilters(false);
  };

  // Handle manual refresh
  const handleRefresh = () => {
    setIsLoading(true);
    dispatch(getJobs())
      .then(() => {
        toast.success('Jobs refreshed successfully!');
      })
      .catch((error) => {
        toast.error('Error refreshing jobs: ' + error);
      })
      .finally(() => {
        setIsLoading(false);
      });
  };

  // Filter jobs based on applied filters
  const filteredJobs = (jobsWithSchools || []).filter(job => {
    // No filters applied - show all
    if (!hasAppliedFilters) return true;
    
    const matchesSearch = searchTerm === '' || 
                         (job.jobTitle?.toLowerCase().includes(searchTerm.toLowerCase())) ||
                         (job.schoolInfo?.name?.toLowerCase().includes(searchTerm.toLowerCase())) ||
                         ((job.category || '').toLowerCase().includes(searchTerm.toLowerCase())) ||
                         ((job.city || '').toLowerCase().includes(searchTerm.toLowerCase()));
    
    const matchesStatus = statusFilter === 'all' || job.status === statusFilter;
    const matchesType = typeFilter === 'all' || job.jobType === typeFilter;
    
    return matchesSearch && matchesStatus && matchesType;
  });

  const handleDeleteJob = (jobId) => {
    if (window.confirm('Are you sure you want to delete this job posting? This action cannot be undone.')) {
      dispatch(deleteJob(jobId));
      
      // If we're deleting the currently selected job, close the modal
      if (selectedJob && selectedJob._id === jobId) {
        setSelectedJob(null);
        setIsModalOpen(false);
      }
    }
  };

  const handleViewJobDetails = (job) => {
    setSelectedJob(job);
  };

  const handleCloseJobDetails = () => {
    setSelectedJob(null);
    setJobApplications([]);
    setIsModalOpen(false);
  };

  // Handle Edit - redirect to edit page
  const handleEditJob = (jobId) => {
    navigate(`/jobs/${jobId}/edit`);
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
      });
    } catch (error) {
      return 'Invalid date';
    }
  };

  const formatDateTime = (dateString) => {
    if (!dateString) return 'N/A';
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    } catch (error) {
      return 'Invalid date';
    }
  };

  const formatSalary = (minSalary, maxSalary, currency = 'SAR') => {
    if (!minSalary && !maxSalary) return 'Negotiable';
    if (!maxSalary) return `${currency} ${minSalary}`;
    return `${currency} ${minSalary} - ${maxSalary}`;
  };

  // --- FIXED DOWNLOAD FUNCTIONS ---
  const downloadFile = async (fileUrl, fileName) => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(fileUrl, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (!response.ok) throw new Error('Download failed');
      const blob = await response.blob();
      const blobUrl = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = blobUrl;
      link.download = fileName;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(blobUrl);
    } catch (error) {
      console.error('Download error:', error);
      toast.error('Failed to download file');
    }
  };

  const handleDownloadResume = (resume) => {
    if (resume && resume.path) {
      // Construct full URL using backend base
      const cleanPath = resume.path.replace(/\\/g, '/');
      const fileUrl = `${API_BASE_URL}/${cleanPath}`;
      const fileName = resume.originalName || resume.filename || 'resume.pdf';
      downloadFile(fileUrl, fileName);
    } else {
      toast.error('Resume not available');
    }
  };

  const handleDownloadCoverLetter = (coverLetter) => {
    if (coverLetter && coverLetter.path) {
      const cleanPath = coverLetter.path.replace(/\\/g, '/');
      const fileUrl = `${API_BASE_URL}/${cleanPath}`;
      const fileName = coverLetter.originalName || coverLetter.filename || 'cover_letter.docx';
      downloadFile(fileUrl, fileName);
    } else {
      toast.error('Cover letter not available');
    }
  };
  // --- END OF FIXED DOWNLOAD FUNCTIONS ---

  // Get status badge color
  const getStatusBadgeColor = (status) => {
    switch (status) {
      case 'reviewed':
        return 'bg-blue-100 text-blue-800';
      case 'shortlisted':
        return 'bg-green-100 text-green-800';
      case 'rejected':
        return 'bg-red-100 text-red-800';
      case 'new':
        return 'bg-yellow-100 text-yellow-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  // Get status icon
  const getStatusIcon = (status) => {
    switch (status) {
      case 'reviewed':
        return <FaCheckCircle className="text-blue-500" />;
      case 'shortlisted':
        return <FaCheckCircle className="text-green-500" />;
      case 'rejected':
        return <FaTimes className="text-red-500" />;
      case 'new':
        return <FaClock className="text-yellow-500" />;
      default:
        return <FaClock className="text-gray-500" />;
    }
  };

  // Loading state
  if (isLoading && !jobs) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 mt-30 flex items-center justify-center">
        <div className="text-center">
          <FaSpinner className="animate-spin text-4xl text-blue-500 mx-auto mb-4" />
          <p className="text-gray-600">Loading jobs...</p>
        </div>
      </div>
    );
  }

  // Determine which jobs to display
  const displayJobs = hasAppliedFilters ? filteredJobs : jobsWithSchools;

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 mt-16 sm:mt-20 md:mt-30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 sm:py-8">
        {/* Back to Admin Dashboard Button */}
        <div className="mb-4">
          <button
            onClick={() => navigate('/system-admin-dashboard')}
            className="flex items-center gap-2 text-[#0077BB] hover:text-[#005588] font-medium transition-colors text-sm sm:text-base"
          >
            <FaArrowLeft className="text-lg" />
            Back to Admin Dashboard
          </button>
        </div>

        {/* Header */}
        <div className="mb-6 sm:mb-8">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold text-gray-800">Posted Jobs Dashboard</h1>
              <p className="text-gray-600 text-sm sm:text-base">Manage and monitor all job postings across all schools</p>
            </div>
            <button
              onClick={handleRefresh}
              disabled={isLoading}
              className={`px-4 py-2 rounded-lg flex items-center text-sm ${
                isLoading ? 'bg-gray-300 cursor-not-allowed' : 'bg-green-500 hover:bg-green-600 text-white'
              }`}
            >
              <FaSync className={`mr-2 ${isLoading ? 'animate-spin' : ''}`} />
              {isLoading ? 'Refreshing...' : 'Refresh'}
            </button>
          </div>
        </div>

        {/* Statistics Cards - Responsive Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-6 sm:mb-8">
          <StatCard 
            title="Total Jobs"
            value={localStats.totalJobs}
            icon={<FaBriefcase className="text-blue-500" />}
            color="blue"
            loading={jobsLoading}
          />
          <StatCard 
            title="Active Jobs"
            value={localStats.activeJobs}
            icon={<FaFileAlt className="text-green-500" />}
            color="green"
            loading={jobsLoading}
          />
          <StatCard 
            title="Total Applications"
            value={localStats.totalApplications}
            icon={<FaUserGraduate className="text-purple-500" />}
            color="purple"
            loading={jobsLoading}
          />
          <StatCard 
            title="Avg Applications/Job"
            value={localStats.avgApplications}
            icon={<FaChartBar className="text-orange-500" />}
            color="orange"
            loading={jobsLoading}
          />
        </div>

        {/* Search and Controls */}
        <div className="bg-white rounded-2xl shadow-lg p-4 sm:p-6 mb-6 sm:mb-8">
          <div className="flex flex-col lg:flex-row gap-4 items-center justify-between">
            <div className="flex flex-col sm:flex-row gap-4 flex-1 w-full">
              <div className="relative flex-1">
                <FaSearch className="absolute left-4 top-3 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search jobs by title, school, or category..."
                  className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                  value={tempSearchTerm}
                  onChange={(e) => setTempSearchTerm(e.target.value)}
                  disabled={isLoading}
                />
              </div>
              <div className="flex flex-col sm:flex-row gap-4">
                <div className="relative">
                  <FaFilter className="absolute left-4 top-3 text-gray-400" />
                  <select 
                    className="pl-12 pr-8 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none bg-white text-sm"
                    value={tempStatusFilter}
                    onChange={(e) => setTempStatusFilter(e.target.value)}
                    disabled={isLoading}
                  >
                    <option value="all">All Status</option>
                    <option value="active">Active</option>
                    <option value="closed">Closed</option>
                    <option value="draft">Draft</option>
                  </select>
                </div>
                <select 
                  className="px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white text-sm"
                  value={tempTypeFilter}
                  onChange={(e) => setTempTypeFilter(e.target.value)}
                  disabled={isLoading}
                >
                  <option value="all">All Types</option>
                  <option value="Full Time">Full Time</option>
                  <option value="Part Time">Part Time</option>
                  <option value="Contract">Contract</option>
                </select>
              </div>
            </div>
            
            <div className="flex flex-wrap gap-4 w-full lg:w-auto">
              <button
                onClick={applyFilters}
                disabled={isLoading}
                className={`flex-1 sm:flex-initial px-6 py-3 rounded-lg transition-all flex items-center justify-center ${
                  isLoading ? 'opacity-50 cursor-not-allowed bg-gray-300' : 'bg-blue-500 hover:bg-blue-600 text-white'
                }`}
              >
                <FaFilter className="mr-2" />
                Apply Filters
              </button>
              
              {(hasAppliedFilters || tempSearchTerm || tempStatusFilter !== 'all' || tempTypeFilter !== 'all') && (
                <button
                  onClick={clearFilters}
                  disabled={isLoading}
                  className="flex-1 sm:flex-initial px-6 py-3 border border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 transition-colors flex items-center justify-center"
                >
                  <FaTimes className="mr-2" />
                  Clear
                </button>
              )}
              
              <div className="flex gap-2 bg-gray-100 p-1 rounded-xl">
                <button
                  onClick={() => setActiveView('grid')}
                  disabled={isLoading}
                  className={`px-4 py-2 rounded-lg transition-all text-sm ${
                    activeView === 'grid' 
                      ? 'bg-white shadow-md text-blue-600' 
                      : 'text-gray-600 hover:text-blue-600'
                  } ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
                >
                  Grid
                </button>
                <button
                  onClick={() => setActiveView('list')}
                  disabled={isLoading}
                  className={`px-4 py-2 rounded-lg transition-all text-sm ${
                    activeView === 'list' 
                      ? 'bg-white shadow-md text-blue-600' 
                      : 'text-gray-600 hover:text-blue-600'
                  } ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
                >
                  List
                </button>
              </div>
            </div>
          </div>
          
          {/* Show applied filters */}
          {hasAppliedFilters && (
            <div className="mt-4 pt-4 border-t border-gray-200">
              <p className="text-sm text-gray-600 mb-2">Applied Filters:</p>
              <div className="flex flex-wrap gap-2">
                {searchTerm && (
                  <span className="px-3 py-1 bg-blue-100 text-blue-800 text-xs rounded-full flex items-center">
                    Search: {searchTerm}
                  </span>
                )}
                {statusFilter !== 'all' && (
                  <span className="px-3 py-1 bg-green-100 text-green-800 text-xs rounded-full flex items-center">
                    Status: {statusFilter}
                  </span>
                )}
                {typeFilter !== 'all' && (
                  <span className="px-3 py-1 bg-purple-100 text-purple-800 text-xs rounded-full flex items-center">
                    Type: {typeFilter}
                  </span>
                )}
                <span className="px-3 py-1 bg-gray-100 text-gray-800 text-xs rounded-full">
                  Showing {displayJobs.length} of {jobsWithSchools.length} jobs
                </span>
              </div>
            </div>
          )}
        </div>

        {/* Loading State */}
        {isLoading && (
          <div className="text-center py-12 bg-white rounded-2xl shadow-lg mb-8">
            <FaSpinner className="animate-spin text-4xl text-blue-500 mx-auto mb-4" />
            <p className="text-gray-600">Loading jobs...</p>
          </div>
        )}

        {/* Error State */}
        {jobsError && !isLoading && (
          <div className="bg-red-50 border border-red-200 rounded-2xl p-6 mb-8">
            <FaTimes className="text-red-500 mx-auto mb-4" />
            <p className="text-red-600">Error loading jobs: {jobsError}</p>
            <button 
              onClick={() => {
                setIsLoading(true);
                dispatch(getJobs()).finally(() => setIsLoading(false));
              }}
              className="mt-4 px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600"
            >
              Retry
            </button>
          </div>
        )}

        {/* Jobs Display */}
        {!isLoading && !jobsError && (
          <>
            {activeView === 'grid' ? (
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 sm:gap-6">
                {displayJobs.map((job) => (
                  <JobCard 
                    key={job._id}
                    job={job}
                    schoolInfo={job.schoolInfo}
                    onView={handleViewJobDetails}
                    onEdit={handleEditJob}
                    onDelete={handleDeleteJob}
                    formatDate={formatDate}
                    formatSalary={formatSalary}
                  />
                ))}
              </div>
            ) : (
              <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Job Details</th>
                        <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">School</th>
                        <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Applications</th>
                        <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                        <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {displayJobs.map((job) => (
                        <JobRow 
                          key={job._id}
                          job={job}
                          schoolInfo={job.schoolInfo}
                          onView={handleViewJobDetails}
                          onEdit={handleEditJob}
                          onDelete={handleDeleteJob}
                          formatDate={formatDate}
                        />
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {displayJobs.length === 0 && !isLoading && (
              <div className="text-center py-12 bg-white rounded-2xl shadow-lg">
                <div className="text-gray-400 text-6xl mb-4">💼</div>
                {hasAppliedFilters ? (
                  <>
                    <p className="text-gray-500 text-lg">No jobs found matching your filters.</p>
                    <p className="text-gray-400 text-sm mt-2">Try adjusting your search criteria</p>
                    <button
                      onClick={clearFilters}
                      className="mt-4 px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
                    >
                      Clear All Filters
                    </button>
                  </>
                ) : (
                  <>
                    <p className="text-gray-500 text-lg">No jobs posted yet.</p>
                    <p className="text-gray-400 text-sm mt-2">Jobs will appear here when posted</p>
                  </>
                )}
              </div>
            )}
          </>
        )}
      </div>

      {/* Job Details Modal */}
      {isModalOpen && (
        <JobDetailsModal 
          job={currentJob || selectedJob}
          schoolInfo={(currentJob || selectedJob)?.schoolInfo}
          applications={jobApplications}
          onClose={handleCloseJobDetails}
          onEdit={handleEditJob}
          onDelete={handleDeleteJob}
          formatDate={formatDate}
          formatDateTime={formatDateTime}
          formatSalary={formatSalary}
          loading={jobDetailsLoading || applicationsLoading}
          deleteLoading={deleteLoading}
          onDownloadResume={handleDownloadResume}
          onDownloadCoverLetter={handleDownloadCoverLetter}
          getStatusBadgeColor={getStatusBadgeColor}
          getStatusIcon={getStatusIcon}
        />
      )}
    </div>
  );
};

// Stat Card Component (responsive)
const StatCard = ({ title, value, icon, color, loading }) => {
  const colorClasses = {
    blue: 'border-blue-200 bg-blue-50',
    green: 'border-green-200 bg-green-50',
    purple: 'border-purple-200 bg-purple-50',
    orange: 'border-orange-200 bg-orange-50'
  };

  return (
    <div className={`bg-white rounded-2xl shadow-lg p-4 sm:p-6 border-l-4 ${colorClasses[color]} hover:shadow-xl transition-shadow`}>
      <div className="flex justify-between items-center">
        <div>
          <p className="text-gray-600 text-xs sm:text-sm font-medium">{title}</p>
          {loading ? (
            <FaSpinner className="animate-spin text-xl sm:text-2xl text-gray-400 mt-1 sm:mt-2" />
          ) : (
            <p className="text-xl sm:text-3xl font-bold text-gray-800 mt-1 sm:mt-2">{value}</p>
          )}
        </div>
        <div className="text-2xl sm:text-3xl opacity-80">
          {icon}
        </div>
      </div>
    </div>
  );
};

// Job Card Component (Grid View) - responsive
const JobCard = ({ job, schoolInfo, onView, onEdit, onDelete, formatDate, formatSalary }) => (
  <div className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden group">
    <div className="bg-gradient-to-r from-blue-500 to-purple-600 p-4 sm:p-6 text-white">
      <div className="flex justify-between items-start gap-2 mb-2">
        <h3 className="text-lg sm:text-xl font-bold leading-tight break-words">{job.jobTitle || 'Untitled Job'}</h3>
        <span className={`px-2 sm:px-3 py-1 rounded-full text-xs sm:text-sm font-medium whitespace-nowrap ${
          job.status === 'active' 
            ? 'bg-green-500 text-white' 
            : job.status === 'closed'
            ? 'bg-red-500 text-white'
            : 'bg-gray-500 text-white'
        }`}>
          {job.status || 'draft'}
        </span>
      </div>
      <p className="text-blue-100 text-xs sm:text-sm">{job.category || 'General'}</p>
    </div>

    <div className="p-4 sm:p-6">
      <div className="flex items-center mb-4 p-2 sm:p-3 bg-gray-50 rounded-lg">
        <FaBuilding className="text-blue-500 mr-2 sm:mr-3 flex-shrink-0" />
        <div className="min-w-0 flex-1">
          <p className="font-semibold text-gray-800 truncate text-sm sm:text-base">{schoolInfo?.name || 'Unknown School'}</p>
          <p className="text-xs sm:text-sm text-gray-600 truncate">
            {schoolInfo?.city || job.city || 'N/A'}, {schoolInfo?.country || job.country || 'N/A'}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-2 sm:gap-3 mb-4">
        <div className="flex items-center text-gray-600 text-xs sm:text-sm">
          <FaMoneyBillWave className="mr-1 sm:mr-2 text-green-500 flex-shrink-0" />
          <span className="truncate">{formatSalary(job.minSalary, job.maxSalary)}</span>
        </div>
        <div className="flex items-center text-gray-600 text-xs sm:text-sm">
          <FaMapMarkerAlt className="mr-1 sm:mr-2 text-red-500 flex-shrink-0" />
          <span className="truncate">{job.city || job.location || 'N/A'}</span>
        </div>
        <div className="flex items-center text-gray-600 text-xs sm:text-sm">
          <FaCalendar className="mr-1 sm:mr-2 text-purple-500 flex-shrink-0" />
          <span className="truncate">{job.jobType || 'Full Time'}</span>
        </div>
        <div className="flex items-center text-gray-600 text-xs sm:text-sm">
          <FaUsers className="mr-1 sm:mr-2 text-orange-500 flex-shrink-0" />
          <span>{job.applicationCount || 0} apps</span>
        </div>
      </div>

      <div className="mb-4">
        <p className="text-gray-600 text-xs sm:text-sm line-clamp-2">{job.jobDescription || 'No description available'}</p>
      </div>

      <div className="flex justify-between text-xs text-gray-500 mb-4">
        <span>Posted: {formatDate(job.createdAt)}</span>
        <span>Deadline: {formatDate(job.applicationDeadline)}</span>
      </div>

      <div className="flex flex-wrap justify-between gap-2 pt-4 border-t border-gray-100">
        <div className="flex gap-2">
          <button 
            onClick={() => onView(job)}
            className="flex items-center text-blue-600 hover:text-blue-800 text-xs sm:text-sm font-medium px-2 sm:px-3 py-1 hover:bg-blue-50 rounded-lg"
          >
            <FaEye className="mr-1" />
            View
          </button>
          <button 
            onClick={() => onEdit(job._id)}
            className="flex items-center text-green-600 hover:text-green-800 text-xs sm:text-sm font-medium px-2 sm:px-3 py-1 hover:bg-green-50 rounded-lg"
          >
            <FaEdit className="mr-1" />
            Edit
          </button>
        </div>
        <button 
          onClick={() => onDelete(job._id)}
          className="flex items-center text-red-600 hover:text-red-800 text-xs sm:text-sm font-medium px-2 sm:px-3 py-1 hover:bg-red-50 rounded-lg"
        >
          <FaTrash className="mr-1" />
          Delete
        </button>
      </div>
    </div>
  </div>
);

// Job Row Component (List View) - responsive
const JobRow = ({ job, schoolInfo, onView, onEdit, onDelete, formatDate }) => (
  <tr className="hover:bg-gray-50 transition-colors">
    <td className="px-4 sm:px-6 py-4">
      <div>
        <div className="text-sm font-medium text-gray-900">{job.jobTitle || 'Untitled Job'}</div>
        <div className="text-xs sm:text-sm text-gray-500">{job.category || 'General'}</div>
        <div className="text-xs text-gray-400 mt-1">
          {job.jobType || 'Full Time'} • {job.city || job.location || 'N/A'}
        </div>
      </div>
    </td>
    <td className="px-4 sm:px-6 py-4">
      <div className="text-sm text-gray-900 truncate max-w-[150px] sm:max-w-xs">{schoolInfo?.name || 'Unknown School'}</div>
      <div className="text-xs sm:text-sm text-gray-500 truncate">
        {schoolInfo?.city || job.city || 'N/A'}
      </div>
    </td>
    <td className="px-4 sm:px-6 py-4">
      <div className="text-sm text-gray-900">{job.applicationCount || 0} applications</div>
      <div className="text-xs sm:text-sm text-gray-500">{job.viewCount || 0} views</div>
    </td>
    <td className="px-4 sm:px-6 py-4">
      <span className={`px-2 sm:px-3 py-1 text-xs rounded-full font-medium ${
        job.status === 'active' 
          ? 'bg-green-100 text-green-800' 
          : job.status === 'closed'
          ? 'bg-red-100 text-red-800'
          : 'bg-gray-100 text-gray-800'
      }`}>
        {job.status || 'draft'}
      </span>
    </td>
    <td className="px-4 sm:px-6 py-4 text-sm font-medium">
      <div className="flex space-x-3">
        <button onClick={() => onView(job)} className="text-blue-600 hover:text-blue-900" title="View Details">
          <FaEye />
        </button>
        <button onClick={() => onEdit(job._id)} className="text-green-600 hover:text-green-900" title="Edit Job">
          <FaEdit />
        </button>
        <button onClick={() => onDelete(job._id)} className="text-red-600 hover:text-red-900" title="Delete Job">
          <FaTrash />
        </button>
      </div>
    </td>
  </tr>
);

// Job Details Modal Component (responsive)
const JobDetailsModal = ({ 
  job, 
  schoolInfo,
  applications, 
  onClose, 
  onEdit,
  onDelete, 
  formatDate, 
  formatDateTime,
  formatSalary,
  loading,
  deleteLoading,
  onDownloadResume,
  onDownloadCoverLetter,
  getStatusBadgeColor,
  getStatusIcon
}) => (
  <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-2 sm:p-4 z-50 mt-16 sm:mt-20 overflow-y-auto">
    <div className="bg-white rounded-2xl shadow-2xl max-w-6xl w-full max-h-[75vh] overflow-y-auto">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-500 to-purple-600 p-4 sm:p-6 text-white rounded-t-2xl sticky top-0 z-10">
        <div className="flex justify-between items-start">
          <div>
            <h2 className="text-xl sm:text-2xl font-bold">{job?.jobTitle || 'Job Details'}</h2>
            <p className="text-blue-100 text-sm">
              {job?.category || 'General'} • {schoolInfo?.name || 'Unknown School'}
            </p>
          </div>
          <button 
            onClick={onClose}
            className="text-white hover:text-gray-200 text-2xl"
            disabled={deleteLoading}
          >
            ×
          </button>
        </div>
      </div>

      {loading ? (
        <div className="p-12 text-center">
          <FaSpinner className="animate-spin text-4xl text-blue-500 mx-auto mb-4" />
          <p className="text-gray-600">Loading job details...</p>
        </div>
      ) : (
        <div className="p-4 sm:p-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6">
            {/* Left Column - Job Details */}
            <div className="lg:col-span-2 space-y-4 sm:space-y-6">
              {/* Basic Info */}
              <div className="bg-white border border-gray-200 rounded-xl p-4 sm:p-6">
                <h3 className="text-base sm:text-lg font-semibold mb-3 sm:mb-4">Job Information</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                  <div className="flex items-center text-gray-700">
                    <FaBuilding className="mr-2 sm:mr-3 text-blue-500 flex-shrink-0" />
                    <div>
                      <p className="font-medium text-sm sm:text-base">School</p>
                      <p className="text-xs sm:text-sm">{schoolInfo?.name || 'Unknown School'}</p>
                      {schoolInfo?.email && (
                        <p className="text-xs text-gray-500 truncate">{schoolInfo.email}</p>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center text-gray-700">
                    <FaMoneyBillWave className="mr-2 sm:mr-3 text-green-500 flex-shrink-0" />
                    <div>
                      <p className="font-medium text-sm sm:text-base">Salary</p>
                      <p className="text-xs sm:text-sm">{formatSalary(job?.minSalary, job?.maxSalary)}</p>
                    </div>
                  </div>
                  <div className="flex items-center text-gray-700">
                    <FaMapMarkerAlt className="mr-2 sm:mr-3 text-red-500 flex-shrink-0" />
                    <div>
                      <p className="font-medium text-sm sm:text-base">Location</p>
                      <p className="text-xs sm:text-sm">{job?.city || job?.location || 'N/A'}</p>
                    </div>
                  </div>
                  <div className="flex items-center text-gray-700">
                    <FaCalendar className="mr-2 sm:mr-3 text-purple-500 flex-shrink-0" />
                    <div>
                      <p className="font-medium text-sm sm:text-base">Job Type</p>
                      <p className="text-xs sm:text-sm">{job?.jobType || 'N/A'}</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* School Contact Info */}
              {(schoolInfo?.email || schoolInfo?.phone) && (
                <div className="bg-white border border-gray-200 rounded-xl p-4 sm:p-6">
                  <h3 className="text-base sm:text-lg font-semibold mb-3 sm:mb-4">School Contact Information</h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                    {schoolInfo?.email && schoolInfo.email !== 'No email' && (
                      <div className="flex items-center text-gray-700">
                        <FaEnvelope className="mr-2 sm:mr-3 text-blue-500 flex-shrink-0" />
                        <div>
                          <p className="font-medium text-sm sm:text-base">Email</p>
                          <p className="text-xs sm:text-sm break-all">{schoolInfo.email}</p>
                        </div>
                      </div>
                    )}
                    {schoolInfo?.phone && schoolInfo.phone !== 'No phone' && (
                      <div className="flex items-center text-gray-700">
                        <FaPhone className="mr-2 sm:mr-3 text-green-500 flex-shrink-0" />
                        <div>
                          <p className="font-medium text-sm sm:text-base">Phone</p>
                          <p className="text-xs sm:text-sm">{schoolInfo.phone}</p>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Additional Information */}
              <div className="bg-white border border-gray-200 rounded-xl p-4 sm:p-6">
                <h3 className="text-base sm:text-lg font-semibold mb-3 sm:mb-4">Additional Information</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                  <div>
                    <p className="text-xs sm:text-sm text-gray-600">Experience Required</p>
                    <p className="text-sm sm:text-base font-medium">{job?.experienceRequired || 'N/A'}</p>
                  </div>
                  <div>
                    <p className="text-xs sm:text-sm text-gray-600">Career Level</p>
                    <p className="text-sm sm:text-base font-medium">{job?.careerLevel || 'N/A'}</p>
                  </div>
                  <div>
                    <p className="text-xs sm:text-sm text-gray-600">Minimum Qualification</p>
                    <p className="text-sm sm:text-base font-medium">{job?.minQualification || 'N/A'}</p>
                  </div>
                  <div>
                    <p className="text-xs sm:text-sm text-gray-600">Preferred Nationality</p>
                    <p className="text-sm sm:text-base font-medium">{job?.preferredNationality || 'N/A'}</p>
                  </div>
                </div>
              </div>

              {/* Description */}
              <div className="bg-white border border-gray-200 rounded-xl p-4 sm:p-6">
                <h3 className="text-base sm:text-lg font-semibold mb-3 sm:mb-4">Job Description</h3>
                <p className="text-gray-700 text-sm sm:text-base leading-relaxed">{job?.jobDescription || 'No description available'}</p>
              </div>
            </div>

            {/* Right Column - Applications */}
            <div className="lg:col-span-1">
              <div className="bg-white border border-gray-200 rounded-xl p-4 sm:p-6 sticky top-4">
                <h3 className="text-base sm:text-lg font-semibold mb-3 sm:mb-4 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <span>Applications ({applications?.length || 0})</span>
                  {applications?.length > 0 && (
                    <span className="text-xs sm:text-sm font-normal text-gray-500">
                      {applications.filter(app => app.status === 'shortlisted').length} shortlisted
                    </span>
                  )}
                </h3>
                <div className="space-y-3 max-h-[50vh] overflow-y-auto pr-1">
                  {applications && applications.length > 0 ? (
                    applications.map((application) => (
                      <div key={application._id} className="border border-gray-200 rounded-lg p-3 sm:p-4 hover:border-blue-300 transition-colors bg-white">
                        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-2 mb-2">
                          <div className="flex items-center">
                            <FaUserCircle className="text-gray-400 mr-2 sm:mr-3 text-lg sm:text-xl flex-shrink-0" />
                            <div className="min-w-0">
                              <p className="font-medium text-gray-800 text-sm sm:text-base break-words">{application.fullName || 'Unknown Candidate'}</p>
                              <p className="text-xs sm:text-sm text-gray-600 break-all">{application.email}</p>
                            </div>
                          </div>
                          <span className={`px-2 py-1 text-xs rounded-full flex items-center self-start ${getStatusBadgeColor(application.status)}`}>
                            {getStatusIcon(application.status)}
                            <span className="ml-1 capitalize">{application.status}</span>
                          </span>
                        </div>
                        
                        <div className="mt-2 text-xs sm:text-sm text-gray-600 space-y-1">
                          <p><strong>Phone:</strong> {application.phoneNumber || 'N/A'}</p>
                          <p><strong>Location:</strong> {application.currentLocation || 'N/A'}</p>
                          <p><strong>Applied:</strong> {formatDate(application.appliedDate)}</p>
                          {application.reviewedAt && (
                            <p><strong>Reviewed:</strong> {formatDateTime(application.reviewedAt)}</p>
                          )}
                        </div>
                        
                        {application.additionalInfo && (
                          <div className="mt-2 p-2 bg-gray-50 rounded text-xs sm:text-sm">
                            <p className="font-medium text-gray-700">Additional Info:</p>
                            <p className="text-gray-600 mt-1 break-words">{application.additionalInfo}</p>
                          </div>
                        )}
                        
                        <div className="mt-3 flex flex-wrap gap-2">
                          {application.resume && (
                            <button 
                              onClick={() => onDownloadResume(application.resume)}
                              className="flex items-center text-xs sm:text-sm text-blue-600 hover:text-blue-800 px-2 sm:px-3 py-1 hover:bg-blue-50 rounded border border-blue-200"
                              title="Download Resume"
                            >
                              <FaFilePdf className="mr-1" />
                              Resume
                            </button>
                          )}
                          {application.coverLetter && (
                            <button 
                              onClick={() => onDownloadCoverLetter(application.coverLetter)}
                              className="flex items-center text-xs sm:text-sm text-green-600 hover:text-green-800 px-2 sm:px-3 py-1 hover:bg-green-50 rounded border border-green-200"
                              title="Download Cover Letter"
                            >
                              <FaFileWord className="mr-1" />
                              Cover Letter
                            </button>
                          )}
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="text-center py-6">
                      <div className="text-gray-400 text-3xl sm:text-4xl mb-2">📄</div>
                      <p className="text-gray-500 text-xs sm:text-sm">No applications yet</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  </div>
);

export default PostedJobsDashboard;