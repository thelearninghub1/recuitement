import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getMyApplications, clearJobErrors } from '../../actions/jobActions';
import { 
  Briefcase, Building, MapPin, Calendar, Clock, 
  Download, FileText, CheckCircle, XCircle, 
  Eye, ExternalLink, Filter, Search, ChevronRight,
  AlertCircle, Loader2, ArrowLeft, FileCheck, 
  DollarSign, Users, Award, Bookmark, Share2
} from 'lucide-react';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';

const AppliedJobs = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  
  const { applications = [], error, loading } = useSelector((state) => state.applications);
  const { user } = useSelector((state) => state.loginUser);
  
  const [filteredApplications, setFilteredApplications] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [sortBy, setSortBy] = useState('newest');

  // Fetch applications on component mount
  useEffect(() => {
    dispatch(getMyApplications());
    
    return () => {
      dispatch(clearJobErrors());
    };
  }, [dispatch]);

  // Filter and sort applications
  useEffect(() => {
    let result = [...applications];

    // Search filter
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      result = result.filter(app =>
        app.job?.jobTitle?.toLowerCase().includes(term) ||
        app.job?.company?.toLowerCase().includes(term) ||
        app.fullName?.toLowerCase().includes(term) ||
        app.status?.toLowerCase().includes(term)
      );
    }

    // Status filter
    if (statusFilter !== 'all') {
      result = result.filter(app => app.status === statusFilter);
    }

    // Sort applications
    result.sort((a, b) => {
      const dateA = new Date(a.appliedDate || a.createdAt);
      const dateB = new Date(b.appliedDate || b.createdAt);
      
      if (sortBy === 'newest') {
        return dateB - dateA;
      } else if (sortBy === 'oldest') {
        return dateA - dateB;
      }
      return 0;
    });

    setFilteredApplications(result);
  }, [applications, searchTerm, statusFilter, sortBy]);

  // Handle errors
  useEffect(() => {
    if (error) {
      toast.error(error);
    }
  }, [error]);

  const handleDownloadResume = (application) => {
    if (!application.resume) {
      toast.error('Resume not available for download');
      return;
    }

    // Create a download link for the resume
    //const resumeUrl = `${process.env.REACT_APP_API_URL || 'http://localhost:5000'}/api/download/resume/${application.resume.filename}`;
    const resumeUrl = `/api/download/resume/${application.resume.filename}`;
    
    // Create temporary anchor element for download
    const link = document.createElement('a');
    link.href = resumeUrl;
    link.download = application.resume.originalName || 'resume.pdf';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    toast.success('Resume download started');
  };

  const handleDownloadCoverLetter = (application) => {
    if (!application.coverLetter) {
      toast.error('Cover letter not available for download');
      return;
    }

    // Create a download link for the cover letter
  
   // const coverLetterUrl = `${process.env.REACT_APP_API_URL || 'http://localhost:5000'}/api/download/cover-letter/${application.coverLetter.filename}`;
   const coverLetterUrl = `/api/download/cover-letter/${application.coverLetter.filename}`;
    
    // Create temporary anchor element for download
    const link = document.createElement('a');
    link.href = coverLetterUrl;
    link.download = application.coverLetter.originalName || 'cover_letter.docx';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    toast.success('Cover letter download started');
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    try {
      let date;
      if (typeof dateString === 'object' && dateString.$date) {
        date = new Date(dateString.$date);
      } else {
        date = new Date(dateString);
      }
      
      return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
      });
    } catch (error) {
      return 'Invalid date';
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800 border-yellow-300';
      case 'reviewed':
        return 'bg-blue-100 text-blue-800 border-blue-300';
      case 'shortlisted':
        return 'bg-green-100 text-green-800 border-green-300';
      case 'rejected':
        return 'bg-red-100 text-red-800 border-red-300';
      case 'accepted':
        return 'bg-emerald-100 text-emerald-800 border-emerald-300';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-300';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'pending':
        return <Clock className="w-4 h-4" />;
      case 'reviewed':
        return <Eye className="w-4 h-4" />;
      case 'shortlisted':
        return <CheckCircle className="w-4 h-4" />;
      case 'rejected':
        return <XCircle className="w-4 h-4" />;
      case 'accepted':
        return <Award className="w-4 h-4" />;
      default:
        return <AlertCircle className="w-4 h-4" />;
    }
  };

  const handleBackToProfile = () => {
    navigate('/teacher-profile');
  };

  if (loading) {
    return (
      <div className="min-h-screen mt-30 bg-gradient-to-br from-blue-50 to-indigo-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-[#0077BB] border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading your applications...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen mt-30 bg-gradient-to-br from-blue-50 to-indigo-50 py-8 px-4 md:px-8 font-[Parkinsans]">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="bg-white rounded-2xl shadow-lg p-6 mb-8">
          <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
            <div className="flex items-start gap-4">
              <button
                onClick={handleBackToProfile}
                className="flex items-center gap-2 px-4 py-2 text-[#0077BB] hover:text-[#005588] transition-colors duration-200 mt-1"
              >
                <ArrowLeft className="w-4 h-4" />
                Back to Profile
              </button>
              <div>
                <h1 className="text-2xl md:text-3xl font-bold text-gray-800 mb-2 flex items-center gap-3">
                  <div className="w-12 h-12 bg-gradient-to-r from-[#0077BB] to-[#00AEEF] rounded-2xl flex items-center justify-center">
                    <FileCheck className="w-6 h-6 text-white" />
                  </div>
                  <span>My Applications</span>
                </h1>
                <p className="text-gray-600">
                  Track and manage all your job applications in one place
                </p>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <div className="p-3 bg-gradient-to-r from-green-500 to-emerald-600 rounded-xl text-white text-center">
                <p className="text-2xl font-bold">{filteredApplications.length}</p>
                <p className="text-sm text-green-100">Applications</p>
              </div>
            </div>
          </div>
        </div>

        {/* Filters and Stats */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Left Column - Filters */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl shadow-lg p-6 sticky top-8">
              <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
                <Filter className="w-5 h-5 text-[#0077BB]" />
                Filters & Stats
              </h3>

              {/* Search */}
              <div className="mb-6">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <input
                    type="text"
                    placeholder="Search applications..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#0077BB] focus:border-transparent transition-all duration-200"
                  />
                </div>
              </div>

              {/* Status Filter */}
              <div className="mb-6">
                <h4 className="font-medium text-gray-700 mb-3">Application Status</h4>
                <div className="space-y-2">
                  {['all', 'pending', 'reviewed', 'shortlisted', 'rejected', 'accepted'].map((status) => (
                    <button
                      key={status}
                      onClick={() => setStatusFilter(status)}
                      className={`w-full flex items-center gap-2 px-3 py-2 rounded-lg transition-all duration-200 ${
                        statusFilter === status
                          ? 'bg-[#0077BB] text-white'
                          : 'bg-gray-50 hover:bg-gray-100 text-gray-700'
                      }`}
                    >
                      {getStatusIcon(status)}
                      <span className="capitalize">{status === 'all' ? 'All Status' : status}</span>
                      <span className="ml-auto text-sm">
                        {status === 'all' 
                          ? applications.length 
                          : applications.filter(app => app.status === status).length}
                      </span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Sort By */}
              <div className="mb-6">
                <h4 className="font-medium text-gray-700 mb-3">Sort By</h4>
                <div className="space-y-2">
                  <button
                    onClick={() => setSortBy('newest')}
                    className={`w-full flex items-center justify-between px-3 py-2 rounded-lg transition-all duration-200 ${
                      sortBy === 'newest'
                        ? 'bg-[#0077BB] text-white'
                        : 'bg-gray-50 hover:bg-gray-100 text-gray-700'
                    }`}
                  >
                    <span>Newest First</span>
                    {sortBy === 'newest' && <CheckCircle className="w-4 h-4" />}
                  </button>
                  <button
                    onClick={() => setSortBy('oldest')}
                    className={`w-full flex items-center justify-between px-3 py-2 rounded-lg transition-all duration-200 ${
                      sortBy === 'oldest'
                        ? 'bg-[#0077BB] text-white'
                        : 'bg-gray-50 hover:bg-gray-100 text-gray-700'
                    }`}
                  >
                    <span>Oldest First</span>
                    {sortBy === 'oldest' && <CheckCircle className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {/* Stats Summary */}
              <div className="mt-8 p-4 bg-gradient-to-r from-[#0077BB] to-[#00AEEF] rounded-xl text-white">
                <h4 className="font-semibold mb-3">Applications Summary</h4>
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Total Applications</span>
                    <span className="font-bold">{applications.length}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Pending Review</span>
                    <span className="font-bold">{applications.filter(app => app.status === 'pending').length}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Shortlisted</span>
                    <span className="font-bold">{applications.filter(app => app.status === 'shortlisted').length}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Accepted</span>
                    <span className="font-bold">{applications.filter(app => app.status === 'accepted').length}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column - Applications List */}
          <div className="lg:col-span-3">
            {filteredApplications.length === 0 ? (
              <div className="bg-white rounded-2xl shadow-lg p-8 text-center">
                <FileCheck className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-gray-800 mb-2">No Applications Found</h3>
                <p className="text-gray-600 mb-4">
                  {applications.length === 0 
                    ? "You haven't applied for any jobs yet."
                    : "No applications match your current filters."}
                </p>
                {applications.length === 0 ? (
                  <button
                    onClick={() => navigate('/jobs-dashboard')}
                    className="px-6 py-3 bg-gradient-to-r from-[#0077BB] to-[#00AEEF] text-white rounded-xl font-semibold hover:shadow-lg transition-all duration-200"
                  >
                    Browse Jobs
                  </button>
                ) : (
                  <button
                    onClick={() => {
                      setSearchTerm('');
                      setStatusFilter('all');
                    }}
                    className="px-6 py-3 bg-gradient-to-r from-[#0077BB] to-[#00AEEF] text-white rounded-xl font-semibold hover:shadow-lg transition-all duration-200"
                  >
                    Clear All Filters
                  </button>
                )}
              </div>
            ) : (
              <div className="space-y-6">
                {filteredApplications.map((application) => (
                  <div
                    key={application._id}
                    className="bg-white rounded-2xl shadow-lg p-6 hover:shadow-xl transition-all duration-200"
                  >
                    <div className="flex flex-col lg:flex-row gap-6">
                      {/* Job Info */}
                      <div className="flex-1">
                        <div className="flex items-start justify-between mb-4">
                          <div>
                            <h3 className="text-xl font-bold text-gray-800 mb-1">
                              {application.job?.jobTitle || 'Job Title Not Available'}
                            </h3>
                            <p className="text-gray-600 mb-2">
                              {application.job?.company || application.job?.school?.name || 'Company Not Available'}
                            </p>
                            
                            <div className="flex flex-wrap gap-3 text-sm text-gray-500 mb-3">
                              {application.job?.city && (
                                <span className="flex items-center gap-1">
                                  <MapPin className="w-4 h-4" />
                                  {application.job.city}, Saudi Arabia
                                </span>
                              )}
                              {application.job?.jobType && (
                                <span className="flex items-center gap-1">
                                  <Briefcase className="w-4 h-4" />
                                  {application.job.jobType}
                                </span>
                              )}
                              {application.job?.salaryRange && (
                                <span className="flex items-center gap-1">
                                  <DollarSign className="w-4 h-4" />
                                  {application.job.salaryRange}
                                </span>
                              )}
                            </div>
                          </div>

                          {/* Status Badge */}
                          <div className={`flex items-center gap-2 px-4 py-2 rounded-xl border ${getStatusColor(application.status)}`}>
                            {getStatusIcon(application.status)}
                            <span className="font-semibold capitalize">{application.status}</span>
                          </div>
                        </div>

                        {/* Application Details */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                          <div className="p-3 bg-blue-50 rounded-xl">
                            <p className="text-sm text-gray-600">Application Date</p>
                            <p className="font-medium text-gray-800">{formatDate(application.appliedDate || application.createdAt)}</p>
                          </div>
                          <div className="p-3 bg-green-50 rounded-xl">
                            <p className="text-sm text-gray-600">Last Updated</p>
                            <p className="font-medium text-gray-800">{formatDate(application.updatedAt)}</p>
                          </div>
                        </div>

                        {/* Applicant Info */}
                        <div className="p-4 bg-gray-50 rounded-xl mb-4">
                          <h4 className="font-semibold text-gray-800 mb-2">Your Application Details</h4>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                            <div>
                              <p className="text-sm text-gray-600">Full Name</p>
                              <p className="font-medium text-gray-800">{application.fullName}</p>
                            </div>
                            <div>
                              <p className="text-sm text-gray-600">Email</p>
                              <p className="font-medium text-gray-800">{application.email}</p>
                            </div>
                            <div>
                              <p className="text-sm text-gray-600">Phone Number</p>
                              <p className="font-medium text-gray-800">{application.phoneNumber}</p>
                            </div>
                            <div>
                              <p className="text-sm text-gray-600">Current Location</p>
                              <p className="font-medium text-gray-800">{application.currentLocation}</p>
                            </div>
                          </div>
                          {application.additionalInfo && (
                            <div className="mt-3">
                              <p className="text-sm text-gray-600">Additional Information</p>
                              <p className="text-gray-700 mt-1">{application.additionalInfo}</p>
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Action Buttons */}
                      <div className="lg:w-64 space-y-4">
                        {/* Documents */}
                        <div className="bg-gray-50 rounded-xl p-4">
                          <h4 className="font-semibold text-gray-800 mb-3">Application Documents</h4>
                          <div className="space-y-3">
                            {application.resume ? (
                              <button
                                onClick={() => handleDownloadResume(application)}
                                className="w-full flex items-center justify-between gap-2 px-4 py-3 bg-white border border-gray-300 rounded-xl hover:bg-gray-50 hover:border-gray-400 transition-all duration-200"
                              >
                                <div className="flex items-center gap-2">
                                  <div className="w-10 h-10 bg-red-100 rounded-xl flex items-center justify-center">
                                    <FileText className="w-5 h-5 text-red-600" />
                                  </div>
                                  <div className="text-left">
                                    <p className="font-medium text-gray-800">Resume / CV</p>
                                    <p className="text-xs text-gray-500 truncate">
                                      {application.resume.originalName || 'resume.pdf'}
                                    </p>
                                  </div>
                                </div>
                                <Download className="w-4 h-4 text-gray-500" />
                              </button>
                            ) : (
                              <div className="px-4 py-3 bg-gray-100 rounded-xl text-center">
                                <p className="text-gray-600">Resume not uploaded</p>
                              </div>
                            )}

                            {application.coverLetter ? (
                              <button
                                onClick={() => handleDownloadCoverLetter(application)}
                                className="w-full flex items-center justify-between gap-2 px-4 py-3 bg-white border border-gray-300 rounded-xl hover:bg-gray-50 hover:border-gray-400 transition-all duration-200"
                              >
                                <div className="flex items-center gap-2">
                                  <div className="w-10 h-10 bg-blue-100 rounded-xl flex items-center justify-center">
                                    <FileText className="w-5 h-5 text-blue-600" />
                                  </div>
                                  <div className="text-left">
                                    <p className="font-medium text-gray-800">Cover Letter</p>
                                    <p className="text-xs text-gray-500 truncate">
                                      {application.coverLetter.originalName || 'cover_letter.docx'}
                                    </p>
                                  </div>
                                </div>
                                <Download className="w-4 h-4 text-gray-500" />
                              </button>
                            ) : (
                              <div className="px-4 py-3 bg-gray-100 rounded-xl text-center">
                                <p className="text-gray-600">No cover letter</p>
                              </div>
                            )}
                          </div>
                        </div>

                        {/* Action Buttons */}
                        <div className="space-y-3">
                          <button
                            onClick={() => navigate(`/job/${application.job?._id}`)}
                            className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-gradient-to-r from-[#0077BB] to-[#00AEEF] text-white rounded-xl font-semibold hover:shadow-lg transition-all duration-200"
                          >
                            <ExternalLink className="w-4 h-4" />
                            View Job Details
                          </button>

                          <button
                            onClick={() => {
                              // Save for later functionality
                              toast.info('Feature coming soon!');
                            }}
                            className="w-full flex items-center justify-center gap-2 px-4 py-3 border border-gray-300 text-gray-700 rounded-xl font-semibold hover:bg-gray-50 transition-all duration-200"
                          >
                            <Bookmark className="w-4 h-4" />
                            Save for Later
                          </button>
                        </div>
                      </div>
                    </div>

                    {/* Timeline / Progress Bar (for pending/reviewed status) */}
                    {['pending', 'reviewed', 'shortlisted'].includes(application.status) && (
                      <div className="mt-6 pt-6 border-t border-gray-200">
                        <h4 className="font-semibold text-gray-800 mb-4">Application Progress</h4>
                        <div className="flex items-center">
                          {[
                            { status: 'pending', label: 'Applied', icon: <Clock className="w-4 h-4" /> },
                            { status: 'reviewed', label: 'Under Review', icon: <Eye className="w-4 h-4" /> },
                            { status: 'shortlisted', label: 'Shortlisted', icon: <CheckCircle className="w-4 h-4" /> },
                            { status: 'accepted', label: 'Accepted', icon: <Award className="w-4 h-4" /> }
                          ].map((step, index) => {
                            const isActive = step.status === application.status;
                            const isCompleted = 
                              ['reviewed', 'shortlisted', 'accepted'].indexOf(step.status) <= 
                              ['pending', 'reviewed', 'shortlisted', 'accepted'].indexOf(application.status);
                            
                            return (
                              <div key={step.status} className="flex-1 flex flex-col items-center relative">
                                {/* Progress Line */}
                                {index > 0 && (
                                  <div className={`absolute top-4 left-0 w-1/2 h-0.5 ${
                                    isCompleted ? 'bg-green-500' : 'bg-gray-200'
                                  }`}></div>
                                )}
                                {index < 3 && (
                                  <div className={`absolute top-4 right-0 w-1/2 h-0.5 ${
                                    isCompleted && ['reviewed', 'shortlisted', 'accepted'].indexOf(step.status) < 2 
                                      ? 'bg-green-500' 
                                      : 'bg-gray-200'
                                  }`}></div>
                                )}
                                
                                {/* Step Circle */}
                                <div className={`w-8 h-8 rounded-full flex items-center justify-center mb-2 z-10 ${
                                  isActive 
                                    ? 'bg-[#0077BB] text-white' 
                                    : isCompleted 
                                    ? 'bg-green-500 text-white' 
                                    : 'bg-gray-200 text-gray-500'
                                }`}>
                                  {isCompleted && !isActive ? <CheckCircle className="w-4 h-4" /> : step.icon}
                                </div>
                                
                                {/* Step Label */}
                                <span className={`text-xs font-medium ${
                                  isActive ? 'text-[#0077BB]' : isCompleted ? 'text-green-600' : 'text-gray-500'
                                }`}>
                                  {step.label}
                                </span>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AppliedJobs;