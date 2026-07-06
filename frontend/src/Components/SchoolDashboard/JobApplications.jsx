// src/components/JobPosting/JobApplications.jsx
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  ArrowLeft, Mail, Calendar, FileText, Phone, MapPin,
  Eye, Download, CheckCircle, XCircle, Clock, User,
  Search, Filter, MoreVertical, Send, Archive, Trash2,
  ChevronDown, ChevronUp, Star, StarHalf, AlertCircle,
  Briefcase, Building, Users, ExternalLink, MessageSquare,
  FileCheck, Award, Bookmark, Share2, Loader2,
  Check, X, ChevronRight, Plus, Minus, RefreshCw,
  GraduationCap, Globe, Award as Trophy, Briefcase as Portfolio,
  Heart, Shield, EyeOff, Mail as MailIcon, Phone as PhoneIcon,
  Download as DownloadIcon, Edit, UserCheck, GraduationCap as Degree,
  MapPin as Location, Languages, Award as Certificate,
  Users as Group, Target, Brain, Globe as World,
  Calendar as DateIcon, BookOpen, School, Trophy as AwardIcon,
  FileCheck as DocumentCheck, CheckSquare, Star as StarIcon,
  CreditCard, Home, Crosshair, BookMarked, Crown, Sparkles,
  Activity, LogOut, Camera, Key, Sparkles as SparklesIcon,
  FileText as File, Book, Target as Bullseye, Lock, Menu
} from 'lucide-react';
import { toast } from 'react-toastify';
import { 
  getJobApplications, 
  clearJobErrors, 
  updateApplicationStatus
} from '../../actions/jobActions';
import { getUserDetails } from '../../actions/userActions';
import { UPDATE_STATUS_RESET } from '../../constants/jobConstants';
import { decreaseCvCount, getMySubscription } from '../../actions/subscriptionActions';
import { DECREASE_CV_COUNT_RESET } from '../../constants/subscriptionConstants';

// API base URL (same as in PostedJobsDashboard)
//const API_BASE_URL = 'http://localhost:5000';
const API_BASE_URL = '';

const JobApplications = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  // State management
  const [expandedApplication, setExpandedApplication] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [sortBy, setSortBy] = useState('newest');
  const [selectedApplications, setSelectedApplications] = useState([]);
  const [showBulkActions, setShowBulkActions] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  const [candidateDetails, setCandidateDetails] = useState({});
  const [loadingCandidates, setLoadingCandidates] = useState({});
  const [downloadLoading, setDownloadLoading] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Redux state
  const applicationsState = useSelector((state) => state.applications || {});
  const { 
    loading: applicationsLoading, 
    error: applicationsError, 
    applications = [], 
    total,
    statusLoading,
    statusError,
    message: statusMessage,
    success: statusSuccess
  } = applicationsState;

  const { jobs = [] } = useSelector((state) => state.allJobs || {});
  
  const candidateDetailsState = useSelector((state) => state.getSingleUser || {});
  const { loading: candidateLoading, user: candidateUser, error: candidateError } = candidateDetailsState;

  const { subscription, usageStats, loading: subscriptionLoading } = useSelector((state) => state.getMySubscription || {});
  const { success: decreaseSuccess, remaining: cvsRemaining, loading: decreaseLoading } = useSelector((state) => state.decreaseCvCount || {});

  const job = jobs.find(j => j._id === id);

  const currentCvsRemaining = usageStats?.remainingCvs ?? 0;
  const monthlyLimit = usageStats?.totalCvsLimit ?? 0;

  // ---------- FIXED DOWNLOAD FUNCTIONS (same as PostedJobsDashboard) ----------
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

  // Wrapper that respects CV download limit
const handleDownloadDocument = async (document, type = 'resume') => {
  if (!document) {
    toast.error(`${type === 'resume' ? 'Resume' : 'Cover letter'} not available`);
    return;
  }

  if (type === 'resume') {
    if (currentCvsRemaining <= 0) {
      toast.error('No CV downloads remaining for this month. Please upgrade your plan or wait for next month!');
      return;
    }

    setDownloadLoading(true);
    try {
      // 1. Download file (with authentication)
      if (!document.path) throw new Error('No file path available');
      const cleanPath = document.path.replace(/\\/g, '/');
      const fileUrl = `${API_BASE_URL}/${cleanPath}`;
      const fileName = document.originalName || document.filename || 'resume.pdf';
      await downloadFile(fileUrl, fileName);   // defined above

      // 2. Decrease CV count on backend
      const result = await dispatch(decreaseCvCount());
      console.log('Decrease CV result:', result); // ← check browser console

      if (result?.success) {
        toast.success(`CV downloaded! ${result.remaining} downloads remaining this month`);
        // Manually refresh subscription data to be sure
        await dispatch(getMySubscription());
      } else {
        // Show specific error from the action
        const errorMsg = result?.error || 'Unknown error';
        toast.error(`CV downloaded but failed to update count: ${errorMsg}`);
      }
    } catch (error) {
      console.error('Download or decrease error:', error);
      toast.error('Download failed: ' + (error.message || 'Please try again'));
    } finally {
      setDownloadLoading(false);
    }
  } else {
    // Cover letter – no limit
    if (!document.path) {
      toast.error('Cover letter path not available');
      return;
    }
    const cleanPath = document.path.replace(/\\/g, '/');
    const fileUrl = `${API_BASE_URL}/${cleanPath}`;
    const fileName = document.originalName || document.filename || 'cover_letter.docx';
    await downloadFile(fileUrl, fileName);
    toast.success('Cover letter downloaded');
  }
};
  // -------------------------------------------------------------------------

  // Load applications on component mount
  useEffect(() => {
    if (id) {
      dispatch(getJobApplications(id));
      dispatch(getMySubscription());
    }
  }, [dispatch, id]);

  useEffect(() => {
    return () => {
      dispatch({ type: DECREASE_CV_COUNT_RESET });
    };
  }, [dispatch]);

  useEffect(() => {
    if (decreaseSuccess) {
      dispatch(getMySubscription());
    }
  }, [decreaseSuccess, dispatch]);

  useEffect(() => {
    if (applications.length > 0) {
      applications.forEach(application => {
        const candidateId = application.candidate?._id || application.candidate;
        if (candidateId && !candidateDetails[candidateId] && !loadingCandidates[candidateId]) {
          fetchCandidateDetails(candidateId);
        }
      });
    }
  }, [applications]);

  const fetchCandidateDetails = (candidateId) => {
    if (!candidateId) return;
    setLoadingCandidates(prev => ({ ...prev, [candidateId]: true }));
    dispatch(getUserDetails(candidateId));
  };

  useEffect(() => {
    if (candidateUser && candidateUser._id) {
      setCandidateDetails(prev => ({
        ...prev,
        [candidateUser._id]: candidateUser
      }));
      setLoadingCandidates(prev => ({ ...prev, [candidateUser._id]: false }));
    }
  }, [candidateUser]);

  useEffect(() => {
    if (candidateError) {
      toast.error('Failed to load candidate details');
    }
  }, [candidateError]);

  useEffect(() => {
    if (statusSuccess && statusMessage) {
      toast.success(statusMessage);
      dispatch({ type: UPDATE_STATUS_RESET });
      dispatch(getJobApplications(id));
    }
  }, [statusSuccess, statusMessage, dispatch, id]);

  useEffect(() => {
    if (applicationsError) {
      toast.error(applicationsError);
      dispatch(clearJobErrors());
    }
    if (statusError) {
      toast.error(statusError);
      dispatch(clearJobErrors());
    }
  }, [applicationsError, statusError, dispatch]);

  // Helper function to get candidate data from nested structure
  const getCandidateInfo = (candidate) => {
    if (!candidate) return null;
    const profile = candidate.profile || {};
    const candidateData = candidate.candidateData || {};
    return {
      firstName: profile.firstName || '',
      lastName: profile.lastName || '',
      fullName: `${profile.firstName || ''} ${profile.lastName || ''}`.trim() || 'N/A',
      isVerified: profile.isVerified || false,
      profileCompleted: profile.profileCompleted || false,
      gender: candidateData.gender,
      middleName: candidateData.middleName,
      nationality: candidateData.nationality,
      maritalStatus: candidateData.maritalStatus,
      dateOfBirth: candidateData.dob,
      countryOfResidence: candidateData.countryOfResidence,
      currentCity: candidateData.currentCity,
      currentCityOther: candidateData.currentCityOther,
      willingRelocateCity: candidateData.willingRelocateCity,
      degree: candidateData.degree,
      degreeOther: candidateData.degreeOther,
      universityName: candidateData.universityName,
      universityLocation: candidateData.universityLocation,
      totalExperience: candidateData.totalExperience,
      currentInstitution: candidateData.currentInstitution,
      previousInstitution: candidateData.previousInstitution,
      positionsInterested: candidateData.positionsInterested || [],
      curriculumTaught: candidateData.curriculumTaught || [],
      englishCert: candidateData.englishCert,
      englishCertOther: candidateData.englishCertOther,
      teachingLicense: candidateData.teachingLicense,
      teachingLicenseOther: candidateData.teachingLicenseOther,
      teachingDiploma: candidateData.teachingDiploma,
      teachingDiplomaOther: candidateData.teachingDiplomaOther,
      stemKnowledge: candidateData.stemKnowledge,
      stemCertified: candidateData.stemCertified,
      stemCertifiedOther: candidateData.stemCertifiedOther,
      otherCertificates: candidateData.otherCertificates || [],      
      skills: candidateData.skills || [],
      languages: candidateData.languages || [],
      languagesOther: candidateData.languagesOther,
      extras: candidateData.extras || [],
      extrasOther: candidateData.extrasOther,
      expectedSalary: candidateData.expectedSalary,
      awards: candidateData.awards,
      iqama: candidateData.iqama,
      iqamaOther: candidateData.iqamaOther,
      consentForwardCV: candidateData.consentForwardCV,
      medicalAssistance: candidateData.medicalAssistance,
      availableFrom: candidateData.availableFrom,
      otherNotes: candidateData.otherNotes,
      applicationId: candidateData.applicationId,
      status: candidate.status || candidateData.status,
      degreeAttested: candidateData.degreeAttested,
      degreeAttestedOther: candidateData.degreeAttestedOther,
      englishCertLevel: candidateData.englishCertLevel,
      teachingLicenseNumber: candidateData.teachingLicenseNumber,
      teachingDiplomaInstitution: candidateData.teachingDiplomaInstitution,
      stemExperience: candidateData.stemExperience,
      createdAt: candidate.createdAt,
      updatedAt: candidate.updatedAt,
      lastLogin: candidate.lastLogin,
      loginCount: candidate.loginCount
    };
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
      case 'pending': return 'bg-yellow-100 text-yellow-800 border-yellow-300';
      case 'reviewed': return 'bg-blue-100 text-blue-800 border-blue-300';
      case 'shortlisted': return 'bg-green-100 text-green-800 border-green-300';
      case 'rejected': return 'bg-red-100 text-red-800 border-red-300';
      case 'accepted': return 'bg-emerald-100 text-emerald-800 border-emerald-300';
      case 'archived': return 'bg-gray-100 text-gray-800 border-gray-300';
      default: return 'bg-gray-100 text-gray-800 border-gray-300';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'pending': return <Clock className="w-4 h-4" />;
      case 'reviewed': return <Eye className="w-4 h-4" />;
      case 'shortlisted': return <CheckCircle className="w-4 h-4" />;
      case 'rejected': return <XCircle className="w-4 h-4" />;
      case 'accepted': return <Award className="w-4 h-4" />;
      case 'archived': return <Archive className="w-4 h-4" />;
      default: return <AlertCircle className="w-4 h-4" />;
    }
  };

  // Filter and sort applications
  const filteredApplications = applications
    .filter(app => {
      const candidate = candidateDetails[app.candidate?._id || app.candidate];
      const candidateInfo = getCandidateInfo(candidate);
      const matchesSearch = searchTerm === '' || 
        app.fullName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        candidateInfo?.fullName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        candidateInfo?.positionsInterested?.some(p => p?.toLowerCase().includes(searchTerm.toLowerCase())) ||
        candidateInfo?.skills?.some(s => s?.toLowerCase().includes(searchTerm.toLowerCase())) ||
        candidateInfo?.degree?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        candidateInfo?.universityName?.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesStatus = statusFilter === 'all' || app.status === statusFilter;
      return matchesSearch && matchesStatus;
    })
    .sort((a, b) => {
      const dateA = new Date(a.appliedDate || a.createdAt);
      const dateB = new Date(b.appliedDate || b.createdAt);
      switch (sortBy) {
        case 'newest': return dateB - dateA;
        case 'oldest': return dateA - dateB;
        case 'name': return (a.fullName || '').localeCompare(b.fullName || '');
        case 'status': return (a.status || '').localeCompare(b.status || '');
        case 'experience':
          const candA = getCandidateInfo(candidateDetails[a.candidate?._id || a.candidate]);
          const candB = getCandidateInfo(candidateDetails[b.candidate?._id || b.candidate]);
          return (parseInt(candB?.totalExperience) || 0) - (parseInt(candA?.totalExperience) || 0);
        default: return 0;
      }
    });

  const handleStatusUpdate = async (applicationId, newStatus) => {
    try {
      await dispatch(updateApplicationStatus(applicationId, { status: newStatus }));
    } catch (error) {
      toast.error('Failed to update status');
    }
  };

  const handleBulkStatusUpdate = (newStatus) => {
    if (selectedApplications.length === 0) {
      toast.error('Please select applications first');
      return;
    }
    if (window.confirm(`Update ${selectedApplications.length} applications to ${newStatus}?`)) {
      selectedApplications.forEach(appId => {
        dispatch(updateApplicationStatus(appId, { status: newStatus }));
      });
      setSelectedApplications([]);
      setShowBulkActions(false);
    }
  };

  const toggleSelectAll = () => {
    if (selectedApplications.length === filteredApplications.length) {
      setSelectedApplications([]);
    } else {
      setSelectedApplications(filteredApplications.map(app => app._id));
    }
  };

  const toggleSelectApplication = (applicationId) => {
    if (selectedApplications.includes(applicationId)) {
      setSelectedApplications(selectedApplications.filter(id => id !== applicationId));
    } else {
      setSelectedApplications([...selectedApplications, applicationId]);
    }
  };

  // Loading state
  if (applicationsLoading) {
    return (
      <div className="min-h-screen mt-16 sm:mt-20 md:mt-30 bg-gradient-to-br from-blue-50 to-indigo-50 flex items-center justify-center px-4">
        <div className="text-center">
          <div className="w-12 h-12 sm:w-16 sm:h-16 border-4 border-[#0077BB] border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading applications...</p>
        </div>
      </div>
    );
  }

  // Helper to render candidate details section (keep your original – too long to repeat, but unchanged)
  const renderCandidateDetails = (candidateInfo) => (
    <div className="space-y-4 sm:space-y-6">
      {/* Personal Information */}
      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-3 sm:p-4">
        <h4 className="font-semibold text-gray-800 mb-2 sm:mb-3 flex items-center gap-2 text-sm sm:text-base">
          <UserCheck className="w-4 h-4 sm:w-5 sm:h-5" />
          Personal Information
        </h4>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
          {candidateInfo.gender && (<div><p className="text-xs sm:text-sm text-gray-600">Gender</p><p className="text-sm sm:text-base font-medium text-gray-800">{candidateInfo.gender}</p></div>)}
          {candidateInfo.middleName && (<div><p className="text-xs sm:text-sm text-gray-600">Middle Name</p><p className="text-sm sm:text-base font-medium text-gray-800">{candidateInfo.middleName}</p></div>)}
          {candidateInfo.dateOfBirth && (<div><p className="text-xs sm:text-sm text-gray-600">Date of Birth</p><p className="text-sm sm:text-base font-medium text-gray-800">{formatDate(candidateInfo.dateOfBirth)}</p></div>)}
          {candidateInfo.nationality && (<div><p className="text-xs sm:text-sm text-gray-600">Nationality</p><p className="text-sm sm:text-base font-medium text-gray-800">{candidateInfo.nationality}</p></div>)}
          {candidateInfo.maritalStatus && (<div><p className="text-xs sm:text-sm text-gray-600">Marital Status</p><p className="text-sm sm:text-base font-medium text-gray-800">{candidateInfo.maritalStatus}</p></div>)}
        </div>
      </div>
      {/* Location Information */}
      <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl p-3 sm:p-4">
        <h4 className="font-semibold text-gray-800 mb-2 sm:mb-3 flex items-center gap-2 text-sm sm:text-base">
          <Location className="w-4 h-4 sm:w-5 sm:h-5" />
          Location Information
        </h4>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
          {candidateInfo.countryOfResidence && (<div><p className="text-xs sm:text-sm text-gray-600">Country of Residence</p><p className="text-sm sm:text-base font-medium text-gray-800">{candidateInfo.countryOfResidence}</p></div>)}
          {candidateInfo.currentCity && (<div><p className="text-xs sm:text-sm text-gray-600">Current City</p><p className="text-sm sm:text-base font-medium text-gray-800">{candidateInfo.currentCity === "Other" ? candidateInfo.currentCityOther : candidateInfo.currentCity}</p></div>)}
          {candidateInfo.willingRelocateCity && (<div><p className="text-xs sm:text-sm text-gray-600">Willing to Relocate to</p><p className="text-sm sm:text-base font-medium text-gray-800">{candidateInfo.willingRelocateCity}</p></div>)}
          {candidateInfo.iqama && (<div><p className="text-xs sm:text-sm text-gray-600">Residency Status</p><p className="text-sm sm:text-base font-medium text-gray-800">{candidateInfo.iqama === "Other" ? candidateInfo.iqamaOther : candidateInfo.iqama}</p></div>)}
        </div>
      </div>
      {/* Education & Qualifications */}
      <div className="bg-white border border-gray-200 rounded-xl p-3 sm:p-4">
        <h5 className="font-semibold text-gray-700 mb-2 sm:mb-3 flex items-center gap-2 text-sm sm:text-base">
          <GraduationCap className="w-4 h-4 sm:w-5 sm:h-5" />
          Education & Qualifications
        </h5>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
          {candidateInfo.degree && (<div><p className="text-xs sm:text-sm text-gray-600">Highest Degree</p><p className="text-sm sm:text-base font-medium text-gray-800">{candidateInfo.degree === "Other" ? candidateInfo.degreeOther : candidateInfo.degree}</p></div>)}
          {candidateInfo.universityName && (<div><p className="text-xs sm:text-sm text-gray-600">University</p><p className="text-sm sm:text-base font-medium text-gray-800">{candidateInfo.universityName}{candidateInfo.universityLocation && `, ${candidateInfo.universityLocation}`}</p></div>)}
          {candidateInfo.degreeAttested && (<div><p className="text-xs sm:text-sm text-gray-600">Degree Attestation</p><p className="text-sm sm:text-base font-medium text-gray-800">{candidateInfo.degreeAttested}</p></div>)}
        </div>
      </div>
      {/* Experience */}
      <div className="bg-white border border-gray-200 rounded-xl p-3 sm:p-4">
        <h5 className="font-semibold text-gray-700 mb-2 sm:mb-3 flex items-center gap-2 text-sm sm:text-base">
          <Briefcase className="w-4 h-4 sm:w-5 sm:h-5" />
          Professional Experience
        </h5>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
          {candidateInfo.totalExperience && (<div><p className="text-xs sm:text-sm text-gray-600">Total Experience</p><p className="text-sm sm:text-base font-medium text-gray-800">{candidateInfo.totalExperience} years</p></div>)}
          {candidateInfo.currentInstitution && (<div><p className="text-xs sm:text-sm text-gray-600">Current Institution</p><p className="text-sm sm:text-base font-medium text-gray-800">{candidateInfo.currentInstitution}</p></div>)}
          {candidateInfo.previousInstitution && (<div><p className="text-xs sm:text-sm text-gray-600">Previous Institution</p><p className="text-sm sm:text-base font-medium text-gray-800">{candidateInfo.previousInstitution}</p></div>)}
          {candidateInfo.expectedSalary && (<div><p className="text-xs sm:text-sm text-gray-600">Expected Salary</p><p className="text-sm sm:text-base font-medium text-gray-800">SAR {candidateInfo.expectedSalary}</p></div>)}
          {candidateInfo.availableFrom && (<div><p className="text-xs sm:text-sm text-gray-600">Available From</p><p className="text-sm sm:text-base font-medium text-gray-800">{formatDate(candidateInfo.availableFrom)}</p></div>)}
        </div>
      </div>
      {/* Certifications */}
      <div className="bg-white border border-gray-200 rounded-xl p-3 sm:p-4">
        <h5 className="font-semibold text-gray-700 mb-2 sm:mb-3 flex items-center gap-2 text-sm sm:text-base">
          <Certificate className="w-4 h-4 sm:w-5 sm:h-5" />
          Certifications
        </h5>
        <div className="space-y-2">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
            {candidateInfo.englishCert && candidateInfo.englishCert !== "No" && (<div><p className="text-xs sm:text-sm text-gray-600">English Certificate</p><p className="text-sm sm:text-base font-medium text-gray-800">{candidateInfo.englishCert === "Other" ? candidateInfo.englishCertOther : candidateInfo.englishCert}</p></div>)}
            {candidateInfo.teachingLicense && candidateInfo.teachingLicense !== "No" && (<div><p className="text-xs sm:text-sm text-gray-600">Teaching License</p><p className="text-sm sm:text-base font-medium text-gray-800">{candidateInfo.teachingLicense === "Other" ? candidateInfo.teachingLicenseOther : candidateInfo.teachingLicense}</p></div>)}
            {candidateInfo.teachingDiploma && candidateInfo.teachingDiploma !== "No" && (<div><p className="text-xs sm:text-sm text-gray-600">Teaching Diploma</p><p className="text-sm sm:text-base font-medium text-gray-800">{candidateInfo.teachingDiploma === "Other" ? candidateInfo.teachingDiplomaOther : candidateInfo.teachingDiploma}</p></div>)}
            {candidateInfo.stemKnowledge === "Yes" && (<div><p className="text-xs sm:text-sm text-gray-600">STEM Knowledge</p><p className="text-sm sm:text-base font-medium text-gray-800">{candidateInfo.stemCertified === "Yes" ? 'Certified' : 'Knowledgeable'}{candidateInfo.stemCertified === "Other" && ` - ${candidateInfo.stemCertifiedOther}`}</p></div>)}
          </div>
          {candidateInfo.otherCertificates && candidateInfo.otherCertificates.length > 0 && (
            <div>
              <p className="text-xs sm:text-sm text-gray-600">Other Certificates</p>
              <div className="space-y-2 mt-2">
                {candidateInfo.otherCertificates.map((cert, idx) => (
                  <div key={idx} className="bg-white rounded-lg p-2 border border-gray-200">
                    <p className="font-medium text-gray-800 text-sm sm:text-base">{cert.name}</p>
                    <p className="text-xs sm:text-sm text-gray-600">{cert.institution}</p>
                    <p className="text-xs text-gray-500">Year: {cert.year}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
      {/* Positions & Curriculum */}
      <div className="space-y-3 sm:space-y-4">
        {candidateInfo.positionsInterested && candidateInfo.positionsInterested.length > 0 && (
          <div>
            <h5 className="font-semibold text-gray-700 mb-2 flex items-center gap-2 text-sm sm:text-base">
              <Target className="w-4 h-4 sm:w-5 sm:h-5" />
              Positions Interested In
            </h5>
            <div className="flex flex-wrap gap-2">
              {candidateInfo.positionsInterested.map((position, index) => (
                <span key={index} className="bg-blue-100 text-blue-700 px-2 py-1 sm:px-3 rounded-lg text-xs sm:text-sm">{position}</span>
              ))}
            </div>
          </div>
        )}
        {candidateInfo.curriculumTaught && candidateInfo.curriculumTaught.length > 0 && (
          <div>
            <h5 className="font-semibold text-gray-700 mb-2 flex items-center gap-2 text-sm sm:text-base">
              <BookOpen className="w-4 h-4 sm:w-5 sm:h-5" />
              Curriculum Experience
            </h5>
            <div className="flex flex-wrap gap-2">
              {candidateInfo.curriculumTaught.map((curriculum, index) => (
                <span key={index} className="bg-green-100 text-green-700 px-2 py-1 sm:px-3 rounded-lg text-xs sm:text-sm">{curriculum}</span>
              ))}
            </div>
          </div>
        )}
      </div>
      {/* Skills & Languages */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
        {candidateInfo.skills && candidateInfo.skills.length > 0 && (
          <div className="bg-white border border-gray-200 rounded-xl p-3 sm:p-4">
            <h5 className="font-semibold text-gray-700 mb-2 flex items-center gap-2 text-sm sm:text-base">
              <Brain className="w-4 h-4 sm:w-5 sm:h-5" />
              Skills
            </h5>
            <div className="flex flex-wrap gap-2">
              {candidateInfo.skills.slice(0, 10).map((skill, index) => (
                <span key={index} className="bg-gray-100 text-gray-700 px-2 py-1 sm:px-3 rounded-lg text-xs sm:text-sm">{skill}</span>
              ))}
              {candidateInfo.skills.length > 10 && (<span className="text-gray-500 text-xs sm:text-sm">+{candidateInfo.skills.length - 10} more</span>)}
            </div>
          </div>
        )}
        {candidateInfo.languages && candidateInfo.languages.length > 0 && (
          <div className="bg-white border border-gray-200 rounded-xl p-3 sm:p-4">
            <h5 className="font-semibold text-gray-700 mb-2 flex items-center gap-2 text-sm sm:text-base">
              <Languages className="w-4 h-4 sm:w-5 sm:h-5" />
              Languages
            </h5>
            <div className="flex flex-wrap gap-2">
              {candidateInfo.languages.map((language, index) => (
                <span key={index} className="bg-blue-100 text-blue-700 px-2 py-1 sm:px-3 rounded-lg text-xs sm:text-sm">{language === "Other" ? candidateInfo.languagesOther : language}</span>
              ))}
            </div>
          </div>
        )}
      </div>
      {/* Extracurricular Activities */}
      {candidateInfo.extras && candidateInfo.extras.length > 0 && (
        <div className="bg-white border border-gray-200 rounded-xl p-3 sm:p-4">
          <h5 className="font-semibold text-gray-700 mb-2 flex items-center gap-2 text-sm sm:text-base">
            <Group className="w-4 h-4 sm:w-5 sm:h-5" />
            Extracurricular Activities
          </h5>
          <div className="flex flex-wrap gap-2">
            {candidateInfo.extras.map((extra, index) => (
              <span key={index} className="bg-purple-100 text-purple-700 px-2 py-1 sm:px-3 rounded-lg text-xs sm:text-sm">{extra === "Other" ? candidateInfo.extrasOther : extra}</span>
            ))}
          </div>
        </div>
      )}
      {/* Additional Information */}
      <div className="space-y-3 sm:space-y-4">
        {candidateInfo.awards && (
          <div className="bg-gradient-to-r from-yellow-50 to-amber-50 rounded-xl p-3 sm:p-4">
            <h5 className="font-semibold text-gray-700 mb-2 flex items-center gap-2 text-sm sm:text-base">
              <AwardIcon className="w-4 h-4 sm:w-5 sm:h-5" />
              Awards & Recognition
            </h5>
            <p className="text-gray-800 text-sm sm:text-base whitespace-pre-line">{candidateInfo.awards}</p>
          </div>
        )}
        <div className="bg-white border border-gray-200 rounded-xl p-3 sm:p-4">
          <h5 className="font-semibold text-gray-700 mb-2 sm:mb-3 text-sm sm:text-base">Other Details</h5>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
            <div><p className="text-xs sm:text-sm text-gray-600">Consent to Forward CV</p><p className="text-sm sm:text-base font-medium text-gray-800">{candidateInfo.consentForwardCV === "Yes" ? 'Yes' : 'No'}</p></div>
            <div><p className="text-xs sm:text-sm text-gray-600">Medical Assistance Required</p><p className="text-sm sm:text-base font-medium text-gray-800">{candidateInfo.medicalAssistance === "Yes" ? 'Yes' : 'No'}</p></div>
          </div>
          {candidateInfo.otherNotes && (
            <div className="mt-3 sm:mt-4">
              <p className="text-xs sm:text-sm text-gray-600">Additional Notes</p>
              <p className="text-sm sm:text-base font-medium text-gray-800 mt-1 whitespace-pre-line">{candidateInfo.otherNotes}</p>
            </div>
          )}
        </div>
        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-3 sm:p-4">
          <h5 className="font-semibold text-gray-700 mb-2 sm:mb-3 text-sm sm:text-base">Application Information</h5>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
            {candidateInfo.applicationId && (<div><p className="text-xs sm:text-sm text-gray-600">Application ID</p><p className="text-sm sm:text-base font-medium text-gray-800 font-mono">{candidateInfo.applicationId}</p></div>)}
            {candidateInfo.status && (<div><p className="text-xs sm:text-sm text-gray-600">Profile Status</p><p className="text-sm sm:text-base font-medium text-gray-800 capitalize">{candidateInfo.status}</p></div>)}
            {candidateInfo.profileCompleted !== undefined && (<div><p className="text-xs sm:text-sm text-gray-600">Profile Complete</p><p className="text-sm sm:text-base font-medium text-gray-800">{candidateInfo.profileCompleted ? 'Yes' : 'No'}</p></div>)}
          </div>
        </div>
      </div>
    </div>
  );

  // Main JSX (the UI part) – unchanged except download buttons now use handleDownloadDocument
  return (
    <div className="min-h-screen mt-16 sm:mt-20 md:mt-30 bg-gradient-to-br from-blue-50 to-indigo-50 py-4 sm:py-6 md:py-8 px-3 sm:px-4 md:px-6 lg:px-8 font-[Parkinsans]">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="bg-white rounded-xl sm:rounded-2xl shadow-lg p-4 sm:p-6 mb-4 sm:mb-6 md:mb-8">
          <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4 sm:gap-6">
            <div className="flex items-start gap-3 sm:gap-4 w-full lg:w-auto">
              <button onClick={() => navigate('/school-dashboard')} className="flex items-center gap-2 px-3 py-1.5 sm:px-4 sm:py-2 text-[#0077BB] hover:text-[#005588] transition-colors duration-200 mt-1 hover:bg-blue-50 rounded-xl text-sm sm:text-base"><ArrowLeft className="w-3 h-3 sm:w-4 sm:h-4" />Back</button>
              <div className="flex-1">
                <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-800 mb-2 flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-3">
                  <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-r from-[#0077BB] to-[#00AEEF] rounded-xl sm:rounded-2xl flex items-center justify-center flex-shrink-0"><Users className="w-5 h-5 sm:w-6 sm:h-6 text-white" /></div>
                  <div className="flex-1"><span className="text-base sm:text-xl md:text-2xl">{job?.jobTitle ? `Applications for ${job.jobTitle}` : 'Job Applications'}</span><p className="text-xs sm:text-sm font-normal text-gray-600 mt-1">Manage and review candidate applications</p></div>
                </h1>
              </div>
            </div>
            <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)} className="lg:hidden w-full flex items-center justify-between px-4 py-2 bg-gray-50 rounded-xl"><span className="text-sm font-medium text-gray-700">Stats & Actions</span><ChevronDown className={`w-4 h-4 transition-transform ${mobileMenuOpen ? 'rotate-180' : ''}`} /></button>
            <div className={`${mobileMenuOpen ? 'flex' : 'hidden'} lg:flex flex-col sm:flex-row items-stretch sm:items-center gap-3 sm:gap-4 w-full lg:w-auto transition-all duration-300`}>
              <div className="flex items-center justify-between sm:justify-start gap-4 bg-blue-50 rounded-xl px-3 py-2 sm:px-4">
                <div><p className="text-xs text-gray-600">CV Downloads Left</p><div className="flex items-center gap-2">{subscriptionLoading || decreaseLoading ? <Loader2 className="w-4 h-4 sm:w-5 sm:h-5 animate-spin text-[#0077BB]" /> : <><p className="text-lg sm:text-2xl font-bold text-[#0077BB]">{currentCvsRemaining}</p>{currentCvsRemaining <= 0 && <Lock className="w-3 h-3 sm:w-4 sm:h-4 text-red-500" />}</>}</div><p className="text-xs text-gray-500">Monthly limit: {monthlyLimit}</p>{currentCvsRemaining <= 0 && <p className="text-xs text-red-500 hidden sm:block">Upgrade or wait for next month</p>}</div>
              </div>
              <div className="flex items-center justify-between sm:justify-start gap-4"><div><p className="text-xs text-gray-600">Total</p><p className="text-xl sm:text-3xl font-bold text-gray-900">{applications.length}</p></div><div className="h-8 w-px bg-gray-300 hidden sm:block"></div><div><p className="text-xs text-gray-600">New</p><p className="text-xl sm:text-3xl font-bold text-emerald-600">{applications.filter(app => app.status === 'pending' || app.isNew).length}</p></div></div>
            </div>
          </div>
        </div>

        {/* Bulk Actions Bar */}
        {selectedApplications.length > 0 && (
          <div className="bg-gradient-to-r from-[#0077BB] to-[#00AEEF] rounded-xl sm:rounded-2xl shadow-lg p-3 sm:p-4 mb-4 sm:mb-6 text-white">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-3 sm:gap-4">
              <div className="flex items-center gap-2 sm:gap-3"><CheckCircle className="w-4 h-4 sm:w-5 sm:h-5" /><span className="text-sm sm:text-base font-semibold">{selectedApplications.length} selected</span></div>
              <div className="flex flex-wrap gap-2 w-full sm:w-auto">
                <button onClick={() => handleBulkStatusUpdate('reviewed')} className="flex-1 sm:flex-initial px-3 py-1.5 sm:px-4 sm:py-2 bg-white text-[#0077BB] rounded-lg font-medium hover:bg-gray-100 transition-colors flex items-center justify-center gap-1 sm:gap-2 text-sm"><Eye className="w-3 h-3 sm:w-4 sm:h-4" /><span className="hidden sm:inline">Review</span></button>
                <button onClick={() => handleBulkStatusUpdate('shortlisted')} className="flex-1 sm:flex-initial px-3 py-1.5 sm:px-4 sm:py-2 bg-emerald-600 text-white rounded-lg font-medium hover:bg-emerald-700 transition-colors flex items-center justify-center gap-1 sm:gap-2 text-sm"><CheckCircle className="w-3 h-3 sm:w-4 sm:h-4" /><span className="hidden sm:inline">Shortlist</span></button>
                <button onClick={() => handleBulkStatusUpdate('rejected')} className="flex-1 sm:flex-initial px-3 py-1.5 sm:px-4 sm:py-2 bg-rose-600 text-white rounded-lg font-medium hover:bg-rose-700 transition-colors flex items-center justify-center gap-1 sm:gap-2 text-sm"><XCircle className="w-3 h-3 sm:w-4 sm:h-4" /><span className="hidden sm:inline">Reject</span></button>
                <button onClick={() => setSelectedApplications([])} className="flex-1 sm:flex-initial px-3 py-1.5 sm:px-4 sm:py-2 border-2 border-white text-white rounded-lg font-medium hover:bg-white/10 transition-colors text-sm">Cancel</button>
              </div>
            </div>
          </div>
        )}

        {/* Filters and Controls */}
        <div className="bg-white rounded-xl sm:rounded-2xl shadow-lg p-4 sm:p-6 mb-4 sm:mb-6">
          <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4">
            <div className="w-full lg:w-96"><div className="relative"><Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4 sm:w-5 sm:h-5" /><input type="text" placeholder="Search by name, skills, position, or degree..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="w-full pl-9 sm:pl-10 pr-3 sm:pr-4 py-2 sm:py-3 text-sm sm:text-base border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#0077BB] focus:border-transparent transition-all duration-200" /></div></div>
            <div className="flex flex-wrap gap-2 sm:gap-3 w-full lg:w-auto">
              <button onClick={() => setShowFilters(!showFilters)} className="flex items-center gap-1 sm:gap-2 px-3 py-2 sm:px-4 sm:py-3 border border-gray-300 rounded-xl hover:bg-gray-50 transition-colors text-sm sm:text-base"><Filter className="w-3 h-3 sm:w-4 sm:h-4" />Filters{showFilters ? <ChevronUp className="w-3 h-3 sm:w-4 sm:h-4" /> : <ChevronDown className="w-3 h-3 sm:w-4 sm:h-4" />}</button>
              <select value={sortBy} onChange={(e) => setSortBy(e.target.value)} className="px-3 py-2 sm:px-4 sm:py-3 text-sm sm:text-base border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#0077BB] focus:border-transparent bg-white"><option value="newest">Newest First</option><option value="oldest">Oldest First</option><option value="name">Name A-Z</option><option value="status">Status</option><option value="experience">Experience</option></select>
              <button onClick={() => { dispatch(getJobApplications(id)); dispatch(getMySubscription()); }} className="flex items-center gap-1 sm:gap-2 px-3 py-2 sm:px-4 sm:py-3 border border-gray-300 rounded-xl hover:bg-gray-50 transition-colors" disabled={applicationsLoading}><RefreshCw className={`w-3 h-3 sm:w-4 sm:h-4 ${applicationsLoading ? 'animate-spin' : ''}`} /><span className="hidden sm:inline">Refresh</span></button>
            </div>
          </div>
          {showFilters && (
            <div className="mt-4 sm:mt-6 pt-4 sm:pt-6 border-t border-gray-200">
              <div className="flex flex-wrap gap-2 sm:gap-4"><div className="w-full"><label className="block text-xs sm:text-sm font-medium text-gray-700 mb-2">Status</label><div className="flex flex-wrap gap-2">{['all', 'pending', 'reviewed', 'shortlisted', 'rejected', 'accepted', 'archived'].map((status) => (<button key={status} onClick={() => setStatusFilter(status)} className={`px-2 py-1 sm:px-3 sm:py-1.5 rounded-lg text-xs sm:text-sm font-medium transition-colors ${statusFilter === status ? (status === 'all' ? 'bg-[#0077BB] text-white' : getStatusColor(status)) : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}>{status === 'all' ? 'All Status' : status.charAt(0).toUpperCase() + status.slice(1)}</button>))}</div></div></div>
            </div>
          )}
        </div>

        {/* Applications Stats */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-2 sm:gap-3 md:gap-4 mb-4 sm:mb-6">
          {['pending', 'reviewed', 'shortlisted', 'rejected', 'accepted', 'archived'].map((status) => {
            const count = applications.filter(app => app.status === status).length;
            return (<div key={status} className="bg-white rounded-lg sm:rounded-xl shadow p-2 sm:p-4 text-center hover:shadow-md transition-shadow"><div className={`inline-flex items-center justify-center w-8 h-8 sm:w-10 sm:h-10 rounded-lg mb-1 sm:mb-2 ${getStatusColor(status)}`}>{getStatusIcon(status)}</div><p className="text-lg sm:text-2xl font-bold text-gray-800">{count}</p><p className="text-xs sm:text-sm text-gray-600 capitalize">{status}</p></div>);
          })}
        </div>

        {/* Applications List */}
        <div className="space-y-3 sm:space-y-4">
          {filteredApplications.length === 0 ? (
            <div className="bg-white rounded-xl sm:rounded-2xl shadow-lg p-6 sm:p-8 text-center"><FileCheck className="w-12 h-12 sm:w-16 sm:h-16 text-gray-400 mx-auto mb-3 sm:mb-4" /><h3 className="text-lg sm:text-xl font-semibold text-gray-800 mb-2">No Applications Found</h3><p className="text-sm sm:text-base text-gray-600 mb-4">{applications.length === 0 ? "No applications received for this job yet." : "No applications match your current filters."}</p>{applications.length > 0 && (<button onClick={() => { setSearchTerm(''); setStatusFilter('all'); }} className="px-4 sm:px-6 py-2 sm:py-3 bg-gradient-to-r from-[#0077BB] to-[#00AEEF] text-white rounded-xl font-semibold hover:shadow-lg transition-all duration-200 text-sm sm:text-base">Clear All Filters</button>)}</div>
          ) : (
            <>
              <div className="bg-white rounded-lg sm:rounded-xl shadow p-3 sm:p-4"><label className="flex items-center gap-2 sm:gap-3 cursor-pointer"><input type="checkbox" checked={selectedApplications.length === filteredApplications.length && filteredApplications.length > 0} onChange={toggleSelectAll} className="w-4 h-4 sm:w-5 sm:h-5 text-[#0077BB] rounded focus:ring-[#0077BB]" /><span className="text-sm sm:text-base font-medium text-gray-700">Select all {filteredApplications.length}</span></label></div>
              {filteredApplications.map((application) => {
                const candidateId = application.candidate?._id || application.candidate;
                const candidate = candidateDetails[candidateId];
                const candidateInfo = getCandidateInfo(candidate);
                const isLoadingCandidate = loadingCandidates[candidateId] || candidateLoading;
                return (
                  <div key={application._id} className="bg-white rounded-xl sm:rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-200">
                    <div className="p-3 sm:p-4 md:p-6">
                      <div className="flex flex-col gap-4 sm:gap-6">
                        <div className="flex gap-3 sm:gap-6">
                          <div className="flex-shrink-0"><input type="checkbox" checked={selectedApplications.includes(application._id)} onChange={() => toggleSelectApplication(application._id)} className="w-4 h-4 sm:w-5 sm:h-5 text-[#0077BB] rounded focus:ring-[#0077BB] mt-1" /></div>
                          <div className="flex-1">
                            <div className="flex flex-col gap-3 sm:gap-4 mb-3 sm:mb-4">
                              <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3 sm:gap-4">
                                <div className="flex items-start gap-3 sm:gap-4"><div className="w-12 h-12 sm:w-16 sm:h-16 bg-gradient-to-r from-[#0077BB] to-[#00AEEF] rounded-xl sm:rounded-2xl flex items-center justify-center flex-shrink-0"><User className="w-6 h-6 sm:w-8 sm:h-8 text-white" /></div><div className="flex-1 min-w-0"><div className="flex flex-wrap items-center gap-1 sm:gap-2 mb-1 sm:mb-2"><h3 className="text-base sm:text-xl font-bold text-gray-800 truncate">{candidateInfo?.fullName || application.fullName || 'Candidate'}</h3>{application.status === 'pending' && (<span className="px-1.5 py-0.5 sm:px-2 sm:py-1 bg-rose-100 text-rose-800 text-xs font-semibold rounded-full">NEW</span>)}</div><div className="flex flex-wrap gap-2 sm:gap-4 text-xs sm:text-sm text-gray-600 mb-2 sm:mb-3">{candidateInfo?.nationality && (<span className="flex items-center gap-1"><Globe className="w-3 h-3 sm:w-4 sm:h-4" />{candidateInfo.nationality}</span>)}{candidateInfo?.totalExperience && (<span className="flex items-center gap-1"><Briefcase className="w-3 h-3 sm:w-4 sm:h-4" />{candidateInfo.totalExperience}y</span>)}</div><div className={`inline-flex items-center gap-1 sm:gap-2 px-2 py-1 sm:px-4 sm:py-2 rounded-lg sm:rounded-xl border text-xs sm:text-sm ${getStatusColor(application.status)}`}>{getStatusIcon(application.status)}<span className="font-semibold capitalize">{application.status}</span></div></div></div>
                                <div className="hidden sm:flex flex-col sm:flex-row items-start sm:items-center gap-3"><div className={`flex items-center gap-2 px-3 py-1.5 sm:px-4 sm:py-2 rounded-xl border ${getStatusColor(application.status)}`}>{getStatusIcon(application.status)}<span className="font-semibold capitalize">{application.status}</span></div><button onClick={() => { if (!candidate && candidateId) fetchCandidateDetails(candidateId); setExpandedApplication(expandedApplication === application._id ? null : application._id); }} className="px-3 py-1.5 sm:px-4 sm:py-2 border border-gray-300 rounded-xl hover:bg-gray-50 transition-colors flex items-center gap-1 sm:gap-2 text-sm">{expandedApplication === application._id ? 'Show Less' : 'View Details'}{expandedApplication === application._id ? <ChevronUp className="w-3 h-3 sm:w-4 sm:h-4" /> : <ChevronDown className="w-3 h-3 sm:w-4 sm:h-4" />}</button></div>
                              </div>
                              <div className="sm:hidden"><button onClick={() => { if (!candidate && candidateId) fetchCandidateDetails(candidateId); setExpandedApplication(expandedApplication === application._id ? null : application._id); }} className="w-full flex items-center justify-center gap-2 px-3 py-2 border border-gray-300 rounded-xl hover:bg-gray-50 transition-colors text-sm">{expandedApplication === application._id ? 'Show Less' : 'View Details'}{expandedApplication === application._id ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}</button></div>
                              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 sm:gap-4 mt-2 sm:mt-3"><div className="p-2 sm:p-3 bg-blue-50 rounded-lg sm:rounded-xl"><p className="text-xs sm:text-sm text-gray-600">Applied Date</p><p className="text-sm sm:text-base font-medium text-gray-800">{formatDate(application.appliedDate || application.createdAt)}</p></div><div className="p-2 sm:p-3 bg-green-50 rounded-lg sm:rounded-xl"><p className="text-xs sm:text-sm text-gray-600">App. ID</p><p className="text-sm sm:text-base font-medium text-gray-800 font-mono">{application._id?.slice(-8)}</p></div><div className="p-2 sm:p-3 bg-purple-50 rounded-lg sm:rounded-xl"><p className="text-xs sm:text-sm text-gray-600">Candidate ID</p><p className="text-sm sm:text-base font-medium text-gray-800 font-mono">{candidateId?.slice(-8) || 'N/A'}</p></div></div>
                            </div>
                          </div>
                        </div>
                        {expandedApplication === application._id && (
                          <div className="mt-4 sm:mt-6 pt-4 sm:pt-6 border-t border-gray-200">
                            <div className="flex flex-col lg:flex-row gap-4 sm:gap-6">
                              <div className="lg:col-span-2 space-y-4 sm:space-y-6 order-2 lg:order-1">
                                {application.additionalInfo && (<div className="bg-gray-50 rounded-xl p-3 sm:p-4"><h4 className="font-semibold text-gray-800 mb-2 flex items-center gap-2 text-sm sm:text-base"><MessageSquare className="w-4 h-4 sm:w-5 sm:h-5" />Additional Information</h4><p className="text-sm sm:text-base text-gray-700">{application.additionalInfo}</p></div>)}
                                {isLoadingCandidate ? (<div className="flex items-center justify-center p-6 sm:p-8"><Loader2 className="w-6 h-6 sm:w-8 sm:h-8 animate-spin text-[#0077BB]" /><span className="ml-2 sm:ml-3 text-sm sm:text-base text-gray-600">Loading candidate profile...</span></div>) : candidateInfo ? (<>{renderCandidateDetails(candidateInfo)}<div className="bg-white border border-gray-200 rounded-xl p-3 sm:p-4"><h4 className="font-semibold text-gray-800 mb-2 sm:mb-3 text-sm sm:text-base">Update Application Status</h4><div className="flex flex-wrap gap-1.5 sm:gap-2">{['pending', 'reviewed', 'shortlisted', 'rejected', 'accepted', 'archived'].map((status) => (<button key={status} onClick={() => handleStatusUpdate(application._id, status)} disabled={statusLoading || application.status === status} className={`px-2 py-1 sm:px-4 sm:py-2 rounded-lg font-medium transition-colors text-xs sm:text-sm ${application.status === status ? 'bg-[#0077BB] text-white cursor-default' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'} ${statusLoading ? 'opacity-50 cursor-not-allowed' : ''}`}>{status.charAt(0).toUpperCase() + status.slice(1)}</button>))}</div></div></>) : (<div className="text-center p-6 sm:p-8 border border-dashed border-gray-300 rounded-xl"><User className="w-10 h-10 sm:w-12 sm:h-12 text-gray-400 mx-auto mb-2 sm:mb-3" /><p className="text-sm sm:text-base text-gray-600 mb-2 sm:mb-3">Candidate profile not loaded</p><button onClick={() => fetchCandidateDetails(candidateId)} className="px-3 py-1.5 sm:px-4 sm:py-2 bg-[#0077BB] text-white rounded-lg hover:bg-[#005588] transition-colors text-sm">Load Profile</button></div>)}
                              </div>
                              <div className="space-y-3 sm:space-y-4 order-1 lg:order-2">
                                <div className="bg-gray-50 rounded-xl p-3 sm:p-4"><h4 className="font-semibold text-gray-800 mb-2 sm:mb-3 text-sm sm:text-base">Application Documents</h4><div className="space-y-2 sm:space-y-3"><button onClick={() => handleDownloadDocument(application.resume, 'resume')} disabled={currentCvsRemaining <= 0 || downloadLoading} className={`w-full flex items-center justify-between gap-2 px-3 py-2 sm:px-4 sm:py-3 rounded-xl transition-all duration-200 ${currentCvsRemaining <= 0 ? 'bg-gray-100 border border-gray-200 cursor-not-allowed opacity-60' : 'bg-white border border-gray-300 hover:bg-gray-50 hover:border-gray-400'}`}><div className="flex items-center gap-2 sm:gap-3"><div className="w-8 h-8 sm:w-10 sm:h-10 bg-red-100 rounded-lg sm:rounded-xl flex items-center justify-center">{downloadLoading ? <Loader2 className="w-4 h-4 sm:w-5 sm:h-5 text-red-600 animate-spin" /> : <FileText className="w-4 h-4 sm:w-5 sm:h-5 text-red-600" />}</div><div className="text-left"><p className="text-sm sm:text-base font-medium text-gray-800">Resume / CV</p><p className="text-xs text-gray-500 truncate max-w-[100px] sm:max-w-[150px]">{application.resume?.originalName || 'resume.pdf'}</p></div></div>{currentCvsRemaining <= 0 ? <Lock className="w-3 h-3 sm:w-4 sm:h-4 text-red-500" /> : <DownloadIcon className="w-3 h-3 sm:w-4 sm:h-4 text-gray-500" />}</button><button onClick={() => handleDownloadDocument(application.coverLetter, 'cover-letter')} className="w-full flex items-center justify-between gap-2 px-3 py-2 sm:px-4 sm:py-3 bg-white border border-gray-300 rounded-xl hover:bg-gray-50 hover:border-gray-400 transition-all duration-200"><div className="flex items-center gap-2 sm:gap-3"><div className="w-8 h-8 sm:w-10 sm:h-10 bg-blue-100 rounded-lg sm:rounded-xl flex items-center justify-center"><FileText className="w-4 h-4 sm:w-5 sm:h-5 text-blue-600" /></div><div className="text-left"><p className="text-sm sm:text-base font-medium text-gray-800">Cover Letter</p><p className="text-xs text-gray-500 truncate max-w-[100px] sm:max-w-[150px]">{application.coverLetter?.originalName || 'cover_letter.docx'}</p></div></div><DownloadIcon className="w-3 h-3 sm:w-4 sm:h-4 text-gray-500" /></button></div></div>
                                <div className="bg-blue-50 rounded-xl p-2 sm:p-3"><div className="flex items-center justify-between"><span className="text-xs sm:text-sm text-gray-600">CV Downloads Left</span><span className={`text-sm sm:text-base font-bold ${currentCvsRemaining <= 0 ? 'text-red-600' : 'text-[#0077BB]'}`}>{currentCvsRemaining}</span></div>{currentCvsRemaining <= 0 && (<button onClick={() => navigate('/school-membership')} className="mt-1 sm:mt-2 w-full text-xs text-center text-[#0077BB] hover:underline">Upgrade Plan →</button>)}</div>
                                <div className="space-y-2 sm:space-y-3"><button onClick={() => { if (application.email) window.location.href = `mailto:${application.email}`; else toast.error('Email not available'); }} className="w-full flex items-center justify-center gap-1 sm:gap-2 px-3 py-2 sm:px-4 sm:py-3 bg-gradient-to-r from-[#0077BB] to-[#00AEEF] text-white rounded-xl font-semibold hover:shadow-lg transition-all duration-200 text-sm sm:text-base"><Send className="w-3 h-3 sm:w-4 sm:h-4" />Contact Candidate</button><button onClick={() => handleStatusUpdate(application._id, 'archived')} className="w-full flex items-center justify-center gap-1 sm:gap-2 px-3 py-2 sm:px-4 sm:py-3 border border-gray-300 text-gray-700 rounded-xl font-semibold hover:bg-gray-50 transition-all duration-200 text-sm sm:text-base"><Archive className="w-3 h-3 sm:w-4 sm:h-4" />Archive</button></div>
                              </div>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default JobApplications;