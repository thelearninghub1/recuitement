import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';
import { getJobDetails, clearJobErrors } from "../../actions/jobActions";
import { 
  Briefcase, Building, MapPin, Calendar, Clock, 
  DollarSign, Users, GraduationCap, Award, BookOpen,
  CheckCircle, XCircle, Share2, Heart, HeartOff,
  ArrowLeft, ExternalLink, Phone, Mail, Globe,
  FileText, Bookmark, Users as People, Target,
  Clock as TimeIcon, Shield, Star, ChevronRight,
  AlertCircle, Loader2, Award as Certificate,
  Building as School, Briefcase as WorkBag
} from 'lucide-react';
import { toast } from 'react-toastify';

const JobDetails = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { id } = useParams();
  
  const { loading, error, job } = useSelector((state) => state.allJobs);
  const { user } = useSelector((state) => state.loginUser);
  
  const [savedJobs, setSavedJobs] = useState(new Set());
  const [showContactInfo, setShowContactInfo] = useState(false);

  // Fetch job details on component mount
  useEffect(() => {
    if (id) {
      dispatch(getJobDetails(id));
    }
    
    return () => {
      dispatch(clearJobErrors());
    };
  }, [dispatch, id]);

  // Handle errors
  useEffect(() => {
    if (error) {
      toast.error(error);
    }
  }, [error]);

  const toggleSaveJob = () => {
    if (!job?._id) return;
    
    setSavedJobs(prev => {
      const newSaved = new Set(prev);
      if (newSaved.has(job._id)) {
        newSaved.delete(job._id);
        toast.info('Job removed from saved');
      } else {
        newSaved.add(job._id);
        toast.success('Job saved successfully!');
      }
      return newSaved;
    });
  };

  const handleApplyNow = () => {
    if (!user) {
      toast.error('Please login to apply for this job');
      navigate('/teacher-login');
      return;
    }
    
    // Navigate to apply page or open application modal
    navigate(`/apply/${job._id}`);
  };

  const handleShareJob = () => {
    const jobUrl = window.location.href;
    navigator.clipboard.writeText(jobUrl)
      .then(() => toast.success('Job link copied to clipboard!'))
      .catch(() => toast.error('Failed to copy link'));
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'Not specified';
    try {
      let date;
      if (typeof dateString === 'object' && dateString.$date) {
        date = new Date(dateString.$date);
      } else {
        date = new Date(dateString);
      }
      
      return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      });
    } catch (error) {
      return 'Invalid date';
    }
  };

  const calculateDaysUntil = (dateString) => {
    if (!dateString) return 0;
    const deadline = new Date(dateString);
    const now = new Date();
    const diffTime = deadline - now;
    return Math.max(0, Math.ceil(diffTime / (1000 * 60 * 60 * 24)));
  };

  if (loading) {
    return (
      <div className="min-h-screen mt-30 bg-gradient-to-br from-blue-50 to-indigo-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-[#0077BB] border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading job details...</p>
        </div>
      </div>
    );
  }

  if (error || !job) {
    return (
      <div className="min-h-screen mt-30 bg-gradient-to-br from-blue-50 to-indigo-50 flex items-center justify-center">
        <div className="text-center bg-white p-8 rounded-2xl shadow-lg max-w-md">
          <AlertCircle className="w-16 h-16 text-red-400 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Job Not Found</h2>
          <p className="text-gray-600 mb-6">The job you're looking for doesn't exist or has been removed.</p>
          <button
            onClick={() => navigate('/jobs-dashboard')}
            className="px-6 py-3 bg-gradient-to-r from-[#0077BB] to-[#00AEEF] text-white rounded-xl font-semibold hover:shadow-lg transition-all duration-200"
          >
            Browse All Jobs
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen mt-30 bg-gradient-to-br from-blue-50 to-indigo-50 py-8 px-4 md:px-8 font-[Parkinsans]">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="bg-white rounded-2xl shadow-lg p-6 mb-8">
          <div className="flex flex-col lg:flex-row items-start justify-between gap-6">
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-4">
                <button
                  onClick={() => navigate(-1)}
                  className="flex items-center gap-2 px-4 py-2 text-[#0077BB] hover:text-[#005588] transition-colors duration-200"
                >
                  <ArrowLeft className="w-4 h-4" />
                  Back to Jobs
                </button>
              </div>
              
              <div className="flex items-start gap-4">
                <div className="w-16 h-16 bg-gradient-to-r from-[#0077BB] to-[#00AEEF] rounded-2xl flex items-center justify-center">
                  <Briefcase className="w-8 h-8 text-white" />
                </div>
                <div className="flex-1">
                  <h1 className="text-2xl md:text-3xl font-bold text-gray-800 mb-2">
                    {job.jobTitle}
                    {job.jobTitleOther && ` - ${job.jobTitleOther}`}
                  </h1>
                  <p className="text-xl text-gray-600 mb-4">
                    {job.school?.name || job.company || 'Educational Institution'}
                  </p>
                  
                  <div className="flex flex-wrap gap-4 text-sm text-gray-600">
                    <div className="flex items-center gap-1">
                      <MapPin className="w-4 h-4" />
                      {job.city}, {job.country || 'Saudi Arabia'}
                    </div>
                    <div className="flex items-center gap-1">
                      <Building className="w-4 h-4" />
                      {job.jobType}
                    </div>
                    <div className="flex items-center gap-1">
                      <Clock className="w-4 h-4" />
                      {job.workMode || 'On-site'}
                    </div>
                    <div className="flex items-center gap-1">
                      <DollarSign className="w-4 h-4" />
                      {job.minSalary && job.maxSalary 
                        ? `${job.minSalary.toLocaleString()} - ${job.maxSalary.toLocaleString()} SAR` 
                        : 'Negotiable'}
                    </div>
                    <div className="flex items-center gap-1">
                      <Calendar className="w-4 h-4" />
                      Posted {formatDate(job.createdAt)}
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="flex flex-col gap-3">
              <div className="flex items-center gap-2">
                <button
                  onClick={toggleSaveJob}
                  className="p-3 text-gray-400 hover:text-red-500 transition-colors duration-200"
                >
                  {savedJobs.has(job._id) ? (
                    <Heart className="w-5 h-5 text-red-500" />
                  ) : (
                    <HeartOff className="w-5 h-5" />
                  )}
                </button>
                <button
                  onClick={handleShareJob}
                  className="p-3 text-gray-400 hover:text-blue-500 transition-colors duration-200"
                >
                  <Share2 className="w-5 h-5" />
                </button>
              </div>
              
              {/* Application Deadline */}
              <div className="p-4 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-xl text-white text-center">
                <p className="text-sm mb-1">Application Deadline</p>
                <p className="font-bold text-lg">
                  {job.applicationDeadline ? formatDate(job.applicationDeadline) : 'Open until filled'}
                </p>
                {job.applicationDeadline && (
                  <p className="text-xs opacity-90">
                    {calculateDaysUntil(job.applicationDeadline)} days remaining
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Left Column - Job Details */}
          <div className="lg:col-span-3 space-y-8">
            {/* Job Description */}
            <div className="bg-white rounded-2xl shadow-lg p-8">
              <div className="flex items-center gap-3 mb-6">
                <div className="p-3 bg-blue-100 rounded-xl">
                  <FileText className="w-6 h-6 text-[#0077BB]" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-gray-800">Job Description</h2>
                  <p className="text-gray-600">About this teaching position</p>
                </div>
              </div>
              
              <div className="prose max-w-none">
                <p className="text-gray-700 leading-relaxed whitespace-pre-line">
                  {job.jobDescription || 'No description provided.'}
                </p>
              </div>
            </div>

            {/* Requirements & Qualifications */}
            <div className="bg-white rounded-2xl shadow-lg p-8">
              <div className="flex items-center gap-3 mb-6">
                <div className="p-3 bg-green-100 rounded-xl">
                  <Target className="w-6 h-6 text-green-600" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-gray-800">Requirements & Qualifications</h2>
                  <p className="text-gray-600">What we're looking for</p>
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Left Column */}
                <div className="space-y-6">
                  {/* Experience */}
                  <div className="p-4 bg-blue-50 rounded-xl border-l-4 border-[#0077BB]">
                    <h3 className="font-semibold text-gray-800 mb-2 flex items-center gap-2">
                      <WorkBag className="w-5 h-5" />
                      Experience Required
                    </h3>
                    <p className="text-gray-700">{job.experienceRequired || 'Not specified'}</p>
                  </div>

                  {/* Qualifications */}
                  <div className="p-4 bg-green-50 rounded-xl border-l-4 border-green-500">
                    <h3 className="font-semibold text-gray-800 mb-2 flex items-center gap-2">
                      <GraduationCap className="w-5 h-5" />
                      Minimum Qualification
                    </h3>
                    <p className="text-gray-700">{job.minQualification || 'Not specified'}</p>
                    {job.degreeMajor && (
                      <p className="text-gray-600 text-sm mt-1">Major: {job.degreeMajor}</p>
                    )}
                  </div>

                  {/* Curriculum */}
                  {job.curriculumRequired && job.curriculumRequired.length > 0 && (
                    <div className="p-4 bg-purple-50 rounded-xl border-l-4 border-purple-500">
                      <h3 className="font-semibold text-gray-800 mb-2 flex items-center gap-2">
                        <BookOpen className="w-5 h-5" />
                        Curriculum Experience
                      </h3>
                      <div className="flex flex-wrap gap-2 mt-2">
                        {Array.isArray(job.curriculumRequired) ? (
                          job.curriculumRequired.map((curriculum, index) => (
                            <span
                              key={index}
                              className="px-3 py-1 bg-purple-100 text-purple-700 rounded-lg text-sm font-medium"
                            >
                              {curriculum}
                            </span>
                          ))
                        ) : (
                          <span className="px-3 py-1 bg-purple-100 text-purple-700 rounded-lg text-sm font-medium">
                            {job.curriculumRequired}
                          </span>
                        )}
                      </div>
                    </div>
                  )}
                </div>

                {/* Right Column */}
                <div className="space-y-6">
                  {/* Certifications */}
                  <div className="space-y-4">
                    {job.englishCertRequired && (
                      <div className="p-3 bg-yellow-50 rounded-xl">
                        <h4 className="font-semibold text-gray-800 mb-1 flex items-center gap-2">
                          <Certificate className="w-4 h-4" />
                          English Certification
                        </h4>
                        <p className="text-gray-700">{job.englishCertRequired}</p>
                      </div>
                    )}

                    {job.teachingLicenseRequired && (
                      <div className="p-3 bg-orange-50 rounded-xl">
                        <h4 className="font-semibold text-gray-800 mb-1 flex items-center gap-2">
                          <Shield className="w-4 h-4" />
                          Teaching License
                        </h4>
                        <p className="text-gray-700">{job.teachingLicenseRequired}</p>
                      </div>
                    )}

                    {job.attestedDegreeRequired && (
                      <div className="p-3 bg-teal-50 rounded-xl">
                        <h4 className="font-semibold text-gray-800 mb-1 flex items-center gap-2">
                          <Award className="w-4 h-4" />
                          Degree Attestation
                        </h4>
                        <p className="text-gray-700">{job.attestedDegreeRequired === "Yes" ? 'Required' : 'Not Required'}</p>
                      </div>
                    )}
                  </div>

                  {/* Category & Level */}
                  <div className="grid grid-cols-2 gap-4">
                    {job.category && (
                      <div className="p-3 bg-gray-50 rounded-xl">
                        <p className="text-sm text-gray-600">Category</p>
                        <p className="font-medium text-gray-800">{job.category}</p>
                      </div>
                    )}
                    
                    {job.careerLevel && (
                      <div className="p-3 bg-gray-50 rounded-xl">
                        <p className="text-sm text-gray-600">Career Level</p>
                        <p className="font-medium text-gray-800">{job.careerLevel}</p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* School/Company Information */}
            <div className="bg-white rounded-2xl shadow-lg p-8">
              <div className="flex items-center gap-3 mb-6">
                <div className="p-3 bg-purple-100 rounded-xl">
                  <School className="w-6 h-6 text-purple-600" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-gray-800">About the School</h2>
                  <p className="text-gray-600">Learn more about the institution</p>
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="p-4 bg-gray-50 rounded-xl">
                  <p className="text-sm text-gray-600">Institution Type</p>
                  <p className="font-medium text-gray-800">
                    {job.school?.type || 'International School'}
                  </p>
                </div>
                
                <div className="p-4 bg-gray-50 rounded-xl">
                  <p className="text-sm text-gray-600">Location</p>
                  <p className="font-medium text-gray-800">{job.city}, {job.country || 'Saudi Arabia'}</p>
                </div>
                
                <div className="p-4 bg-gray-50 rounded-xl">
                  <p className="text-sm text-gray-600">Curriculum</p>
                  <p className="font-medium text-gray-800">
                    {Array.isArray(job.curriculumRequired) 
                      ? job.curriculumRequired.join(', ') 
                      : job.curriculumRequired || 'International Curriculum'}
                  </p>
                </div>
              </div>
              
              {job.school?.description && (
                <div className="mt-6 p-4 bg-blue-50 rounded-xl">
                  <h3 className="font-semibold text-gray-800 mb-2">Institution Description</h3>
                  <p className="text-gray-700">{job.school.description}</p>
                </div>
              )}
            </div>
          </div>

          {/* Right Column - Quick Info & Actions */}
          <div className="space-y-6">
            {/* Quick Stats */}
            <div className="bg-white rounded-2xl shadow-lg p-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">Job Overview</h3>
              
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-blue-100 rounded-xl flex items-center justify-center">
                    <MapPin className="w-5 h-5 text-blue-600" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Location</p>
                    <p className="font-semibold text-gray-800">{job.city}, KSA</p>
                  </div>
                </div>
                
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-green-100 rounded-xl flex items-center justify-center">
                    <DollarSign className="w-5 h-5 text-green-600" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Salary</p>
                    <p className="font-semibold text-gray-800">
                      {job.minSalary && job.maxSalary 
                        ? `${job.minSalary.toLocaleString()} - ${job.maxSalary.toLocaleString()} SAR` 
                        : 'Negotiable'}
                    </p>
                    <p className="text-xs text-gray-500">Monthly</p>
                  </div>
                </div>
                
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-purple-100 rounded-xl flex items-center justify-center">
                    <Briefcase className="w-5 h-5 text-purple-600" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Job Type</p>
                    <p className="font-semibold text-gray-800">{job.jobType}</p>
                  </div>
                </div>
                
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-orange-100 rounded-xl flex items-center justify-center">
                    <TimeIcon className="w-5 h-5 text-orange-600" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Experience</p>
                    <p className="font-semibold text-gray-800">{job.experienceRequired || 'Not specified'}</p>
                  </div>
                </div>
                
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-pink-100 rounded-xl flex items-center justify-center">
                    <GraduationCap className="w-5 h-5 text-pink-600" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Qualification</p>
                    <p className="font-semibold text-gray-800">{job.minQualification || 'Not specified'}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Application Info */}
            <div className="bg-white rounded-2xl shadow-lg p-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">Application Details</h3>
              
              <div className="space-y-4">
                <div className="p-4 bg-gradient-to-r from-blue-50 to-cyan-50 rounded-xl">
                  <div className="flex items-center justify-between mb-2">
                    <p className="text-sm text-gray-600">Deadline</p>
                    <span className="px-2 py-1 bg-blue-100 text-blue-700 rounded-lg text-xs font-medium">
                      {calculateDaysUntil(job.applicationDeadline)} days left
                    </span>
                  </div>
                  <p className="font-semibold text-gray-800">
                    {job.applicationDeadline ? formatDate(job.applicationDeadline) : 'Open until filled'}
                  </p>
                </div>
                
                <div className="p-4 bg-gray-50 rounded-xl">
                  <p className="text-sm text-gray-600">Application Method</p>
                  <p className="font-semibold text-gray-800">
                    {job.jobApplyType === 'By Email' ? 'Apply via Email' : 'Online Application'}
                  </p>
                </div>
                
             
              </div>
            </div>

          

            {/* Job ID & Status */}
            <div className="bg-white rounded-2xl shadow-lg p-6">
              <div className="flex items-center justify-between mb-3">
                <span className="text-sm text-gray-600">Job ID</span>
                <span className="font-mono font-bold text-gray-800">{job.jobId}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Status</span>
                <span className={`px-3 py-1 rounded-lg text-sm font-medium ${
                  job.status === 'active' 
                    ? 'bg-green-100 text-green-700' 
                    : job.status === 'closed'
                    ? 'bg-red-100 text-red-700'
                    : 'bg-yellow-100 text-yellow-700'
                }`}>
                  {job.status?.toUpperCase() || 'ACTIVE'}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default JobDetails;