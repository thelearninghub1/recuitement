import React, { useState, useEffect, useCallback } from "react";
import { 
  User, Mail, MapPin, Phone, Calendar, GraduationCap, 
  Briefcase, FileText, Shield, Languages, Activity, 
  CheckCircle, Share2, Edit, Clock, LogOut,
  Camera, Key, Award, BookOpen, Globe, Users,
  Star, Trophy, School, Building, Heart, Target,
  Crosshair, BookMarked, Crown, Sparkles,
  Search, AlertCircle, Eye, EyeOff, Loader2,
  Sparkles as SparklesIcon,
  FileCheck, ScrollText
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-hot-toast";
import { logoutUser, clearErrors } from "../../actions/userActions";

// Backend base URL
//const API_BASE_URL = 'http://localhost:5000';
const API_BASE_URL = '';

// Helper to build full image URL
const getImageUrl = (filename) => {
  if (!filename) return null;
  if (filename.startsWith('http://') || filename.startsWith('https://')) return filename;
  // Images are stored in uploads/images/ folder
  return `${API_BASE_URL}/uploads/images/${filename}`;
};

const TeacherProfile = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  
  const { loading, error, user, isAuthenticatedUser } = useSelector((state) => state.loginUser);
  
  const [profileData, setProfileData] = useState(null);
  const [isReady, setIsReady] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  
  // Image preview states (same as payment dashboard)
  const [photoBlobUrl, setPhotoBlobUrl] = useState(null);
  const [photoLoading, setPhotoLoading] = useState(false);
  const [photoError, setPhotoError] = useState(false);

  // Function to load photo with authentication
  const loadPhotoWithAuth = async (url) => {
    if (!url) return;
    setPhotoLoading(true);
    setPhotoError(false);
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(url, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (!response.ok) throw new Error(`HTTP ${response.status}`);
      const blob = await response.blob();
      const objectUrl = URL.createObjectURL(blob);
      setPhotoBlobUrl(objectUrl);
    } catch (err) {
      console.error('Photo load error:', err);
      setPhotoError(true);
    } finally {
      setPhotoLoading(false);
    }
  };

  // Load photo whenever profileData.photo changes
  useEffect(() => {
    if (profileData?.photo) {
      if (photoBlobUrl) URL.revokeObjectURL(photoBlobUrl);
      setPhotoBlobUrl(null);
      loadPhotoWithAuth(profileData.photo);
    }
    return () => {
      if (photoBlobUrl) URL.revokeObjectURL(photoBlobUrl);
    };
  }, [profileData?.photo]);

  // Authentication and data loading
  useEffect(() => {
    if (!loading && !isAuthenticatedUser) {
      toast.error('Please login to access teacher profile');
      navigate('/teacher-login');
      return;
    }
    if (!loading && isAuthenticatedUser && user && user.role !== 'candidate') {
      toast.error('Access denied. Teacher account required.');
      navigate('/teacher-login');
      return;
    }
    if (!loading && isAuthenticatedUser && user && user.role === 'candidate' && !profileData) {
      loadTeacherData();
    }
  }, [loading, isAuthenticatedUser, user, profileData, navigate]);

  useEffect(() => {
    if (error) {
      toast.error(error);
      dispatch(clearErrors());
    }
  }, [error, dispatch]);

  useEffect(() => {
    if (isAuthenticatedUser && profileData && !loading) {
      setIsReady(true);
    } else {
      setIsReady(false);
    }
  }, [isAuthenticatedUser, profileData, loading]);

  const loadTeacherData = useCallback(() => {
    try {
      if (user) {
        const teacherInfo = {
          firstName: user.profile?.firstName || '',
          lastName: user.profile?.lastName || '',
          email: user.email || 'No email provided',
          mobile: user.profile?.mobile || '',
          gender: user.candidateData?.gender || 'Not specified',
          dob: user.candidateData?.dob || null,
          whatsapp: user.candidateData?.whatsapp || '',
          nationality: user.candidateData?.nationality || 'Not specified',
          maritalStatus: user.candidateData?.maritalStatus || 'Not specified',
          countryOfResidence: user.candidateData?.countryOfResidence || 'Saudi Arabia',
          currentCity: user.candidateData?.currentCity || 'Riyadh',
          currentCityOther: user.candidateData?.currentCity === "Other" ? user.candidateData.currentCityOther : '',
          expectedSalary: user.candidateData?.expectedSalary || '',
          degree: user.candidateData?.degree || 'Not specified',
          degreeOther: user.candidateData?.degree === "Other" ? user.candidateData.degreeOther : '',
          universityName: user.candidateData?.universityName || '',
          universityLocation: user.candidateData?.universityLocation || '',
          positionsInterested: Array.isArray(user.candidateData?.positionsInterested) 
            ? user.candidateData.positionsInterested 
            : ['Not specified'],
          currentInstitution: user.candidateData?.currentInstitution || '',
          previousInstitution: user.candidateData?.previousInstitution || '',
          totalExperience: user.candidateData?.totalExperience || '',
          curriculumTaught: Array.isArray(user.candidateData?.curriculumTaught)
            ? user.candidateData.curriculumTaught
            : ['Not specified'],
          englishCert: user.candidateData?.englishCert || 'No',
          englishCertOther: user.candidateData?.englishCert === "Other" ? user.candidateData.englishCertOther : '',
          teachingLicense: user.candidateData?.teachingLicense || 'No',
          teachingLicenseOther: user.candidateData?.teachingLicense === "Other" ? user.candidateData.teachingLicenseOther : '',
          teachingDiploma: user.candidateData?.teachingDiploma || 'No',
          teachingDiplomaOther: user.candidateData?.teachingDiploma === "Other" ? user.candidateData.teachingDiplomaOther : '',
          stemKnowledge: user.candidateData?.stemKnowledge || 'No',
          stemCertified: user.candidateData?.stemCertified || 'No',
          stemCertifiedOther: user.candidateData?.stemCertified === "Other" ? user.candidateData.stemCertifiedOther : '',
          otherCertificates: Array.isArray(user.candidateData?.otherCertificates) 
            ? user.candidateData.otherCertificates 
            : [],
          skills: Array.isArray(user.candidateData?.skills)
            ? user.candidateData.skills
            : ['Not specified'],
          languages: Array.isArray(user.candidateData?.languages)
            ? user.candidateData.languages
            : ['Not specified'],
          languagesOther: user.candidateData?.languages?.includes("Other") ? user.candidateData.languagesOther : '',
          extras: Array.isArray(user.candidateData?.extras)
            ? user.candidateData.extras
            : ['Not specified'],
          extrasOther: user.candidateData?.extras?.includes("Other") ? user.candidateData.extrasOther : '',
          awards: user.candidateData?.awards || '',
          iqama: user.candidateData?.iqama || 'Not specified',
          iqamaOther: user.candidateData?.iqama === "Other" ? user.candidateData.iqamaOther : '',
          willingRelocateCity: user.candidateData?.willingRelocateCity || '',
          consentForwardCV: user.candidateData?.consentForwardCV || 'No',
          medicalAssistance: user.candidateData?.medicalAssistance || 'No',
          availableFrom: user.candidateData?.availableFrom || null,
          otherNotes: user.candidateData?.otherNotes || '',
          applicationId: user.candidateData?.applicationId || 'APP-' + Date.now(),
          status: user.candidateData?.status || 'pending-review',
          createdAt: user.createdAt || new Date(),
          updatedAt: user.updatedAt || new Date(),
          lastLogin: user.lastLogin || new Date(),
          isVerified: user.profile?.isVerified || false,
          profileCompleted: user.profile?.profileCompleted || false,
          // Build full photo URL using the helper
          photo: user.profile?.photo ? getImageUrl(user.profile.photo) : null
        };
        setProfileData(teacherInfo);
      }
    } catch (error) {
      console.error('❌ Error loading teacher data:', error);
      toast.error('Failed to load teacher profile');
    }
  }, [user]);

const handleLogout = () => {
  console.log('🚪 Logging out...');
  setIsLoggingOut(true);
  dispatch(logoutUser());
  navigate('/teacher-login');
};

  const handleApplyForJobs = useCallback(() => navigate('/jobs-dashboard'), [navigate]);
  const handleAppliedJobs = useCallback(() => navigate('/applied-jobs'), [navigate]);
  const handleEditProfile = useCallback(() => navigate('/teacher-edit-profile'), [navigate]);
  const handleUpdatePassword = useCallback(() => navigate('/teacher-password-update'), [navigate]);

  const formatDate = useCallback((dateString) => {
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
  }, []);

  // Loading states
  if (isLoggingOut) {
    return (
      <div className="min-h-screen mt-30 bg-gradient-to-br from-blue-50 to-indigo-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-500 mx-auto mb-4"></div>
          <p className="text-gray-600">Logging out...</p>
        </div>
      </div>
    );
  }

  if (loading || !isReady) {
    return (
      <div className="min-h-screen mt-30 bg-gradient-to-br from-blue-50 to-indigo-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-[#0077BB] border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading your profile...</p>
        </div>
      </div>
    );
  }

  if (isAuthenticatedUser && !profileData && !loading) {
    return (
      <div className="min-h-screen mt-30 bg-gradient-to-br from-blue-50 to-indigo-50 flex items-center justify-center">
        <div className="text-center bg-white p-8 rounded-2xl shadow-lg max-w-md">
          <AlertCircle className="w-16 h-16 text-red-400 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Profile Not Found</h2>
          <p className="text-gray-600 mb-6">Unable to load teacher profile data.</p>
          <div className="flex gap-3 justify-center">
            <button onClick={loadTeacherData} className="px-6 py-3 bg-gradient-to-r from-[#0077BB] to-[#00AEEF] text-white rounded-xl font-semibold">Try Again</button>
            <button onClick={handleLogout} className="px-6 py-3 border border-gray-300 text-gray-700 rounded-xl font-semibold">Logout</button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br mt-30 from-blue-50 to-indigo-50 py-8 px-4 md:px-8 font-[Parkinsans] relative">
      <div className="max-w-7xl mx-auto">
        {/* Enhanced Header */}
        <div className="bg-gradient-to-r from-[#0077BB] to-[#00AEEF] rounded-2xl shadow-2xl p-8 mb-8 text-white relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -translate-y-32 translate-x-32"></div>
          <div className="absolute bottom-0 left-0 w-48 h-48 bg-white/10 rounded-full translate-y-24 -translate-x-24"></div>
          
          <div className="relative z-10">
            <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
              <div className="flex items-start gap-6">
                <div className="relative">
                  {/* Photo using blob URL (authenticated) */}
                  {photoLoading ? (
                    <div className="w-24 h-24 rounded-2xl bg-white/20 border-4 border-white shadow-lg flex items-center justify-center">
                      <Loader2 className="w-8 h-8 text-white/70 animate-spin" />
                    </div>
                  ) : photoBlobUrl && !photoError ? (
                    <img
                      src={photoBlobUrl}
                      alt="Profile"
                      className="w-24 h-24 rounded-2xl object-cover border-4 border-white shadow-lg"
                    />
                  ) : (
                    <div className="w-24 h-24 rounded-2xl bg-white/20 border-4 border-white shadow-lg flex items-center justify-center">
                      <User className="w-8 h-8 text-white/70" />
                    </div>
                  )}
                  {profileData.isVerified && (
                    <div className="absolute -bottom-2 -right-2 bg-green-500 rounded-full p-1 border-2 border-white">
                      <CheckCircle className="w-4 h-4 text-white" />
                    </div>
                  )}
                </div>
                
                <div>
                  <h1 className="text-3xl md:text-4xl font-bold mb-2">
                    {profileData.firstName} {profileData.lastName}
                  </h1>
                  <p className="text-blue-100 text-lg mb-3">Professional Educator</p>
                  <div className="flex flex-wrap gap-2">
                    {profileData.positionsInterested.slice(0, 4).map((position, index) => (
                      <span key={index} className="px-3 py-1 bg-white/20 backdrop-blur-sm rounded-full text-sm font-medium border border-white/30">
                        {position}
                      </span>
                    ))}
                    {profileData.positionsInterested.length > 4 && (
                      <span className="px-3 py-1 bg-white/20 backdrop-blur-sm rounded-full text-sm font-medium border border-white/30">
                        +{profileData.positionsInterested.length - 4} more
                      </span>
                    )}
                  </div>
                </div>
              </div>

              <div className="flex flex-wrap gap-3">
                <button onClick={handleApplyForJobs} className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-xl font-semibold hover:shadow-lg hover:scale-105 transition-all duration-200 shadow-md">
                  <Search className="w-4 h-4" /> Apply for Jobs
                </button>
                <button onClick={handleAppliedJobs} className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-purple-500 to-pink-600 text-white rounded-xl font-semibold hover:shadow-lg hover:scale-105 transition-all duration-200 shadow-md">
                  <FileCheck className="w-4 h-4" /> Applied Jobs
                </button>
                <button onClick={handleEditProfile} className="flex items-center gap-2 px-6 py-3 bg-white/20 backdrop-blur-sm text-white rounded-xl font-semibold hover:bg-white/30 transition-all duration-200 border border-white/30">
                  <Edit className="w-4 h-4" /> Update Profile
                </button>
                <button onClick={handleUpdatePassword} className="flex items-center gap-2 px-6 py-3 bg-white/20 backdrop-blur-sm text-white rounded-xl font-semibold hover:bg-white/30 transition-all duration-200 border border-white/30">
                  <Key className="w-4 h-4" /> Change Password
                </button>
              </div>
            </div>

            {/* Status Bar */}
            <div className="flex flex-wrap items-center gap-4 mt-6 p-4 bg-white/10 backdrop-blur-sm rounded-xl border border-white/20">
              <div className="flex items-center gap-2">
                {profileData.profileCompleted ? (
                  <><CheckCircle className="w-5 h-5 text-green-300" /><span className="font-medium">Profile Complete</span></>
                ) : (
                  <><AlertCircle className="w-5 h-5 text-yellow-300" /><span className="font-medium">Profile Incomplete</span></>
                )}
              </div>
              <div className="h-4 w-px bg-white/30"></div>
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-blue-200" />
                <span className="text-blue-100">Member since {formatDate(profileData.createdAt)}</span>
              </div>
              <div className="h-4 w-px bg-white/30"></div>
              <div className="flex items-center gap-2">
                <Award className="w-4 h-4 text-yellow-300" />
                <span className="text-blue-100">ID: {profileData.applicationId}</span>
              </div>
              <div className="h-4 w-px bg-white/30"></div>
              
              <button onClick={handleLogout} className="ml-auto flex items-center gap-2 px-4 py-2 bg-white/20 hover:bg-white/30 rounded-lg transition-all duration-200">
                <LogOut className="w-4 h-4" /> Logout
              </button>
            </div>
          </div>
        </div>

        {/* Rest of the UI (unchanged, but with email overflow fix) */}
        <div className="grid grid-cols-1 xl:grid-cols-4 gap-8">
          {/* Sidebar */}
          <div className="xl:col-span-1 space-y-6">
            <div className="bg-white rounded-2xl shadow-lg p-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
                <User className="w-5 h-5 text-[#0077BB]" /> Personal Information
              </h3>
              <div className="space-y-3">
                <div className="flex items-center gap-3 p-3 bg-blue-50 rounded-xl break-all">
                  <Mail className="w-4 h-4 text-[#0077BB] flex-shrink-0" />
                  <div className="min-w-0 flex-1">
                    <p className="text-sm text-gray-600">Email</p>
                    <p className="text-sm font-medium text-gray-800 break-all">{profileData.email}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 p-3 bg-green-50 rounded-xl">
                  <Phone className="w-4 h-4 text-green-600 flex-shrink-0" />
                  <div><p className="text-sm text-gray-600">Mobile</p><p className="text-sm font-medium text-gray-800">{profileData.mobile}</p></div>
                </div>
                {profileData.whatsapp && (
                  <div className="flex items-center gap-3 p-3 bg-green-50 rounded-xl">
                    <Phone className="w-4 h-4 text-green-500 flex-shrink-0" />
                    <div><p className="text-sm text-gray-600">WhatsApp</p><p className="text-sm font-medium text-gray-800">{profileData.whatsapp}</p></div>
                  </div>
                )}
                <div className="p-3 bg-purple-50 rounded-xl"><p className="text-sm text-gray-600">Gender</p><p className="text-sm font-medium text-gray-800">{profileData.gender}</p></div>
                <div className="p-3 bg-orange-50 rounded-xl"><p className="text-sm text-gray-600">Date of Birth</p><p className="text-sm font-medium text-gray-800">{formatDate(profileData.dob)}</p></div>
                <div className="p-3 bg-pink-50 rounded-xl"><p className="text-sm text-gray-600">Marital Status</p><p className="text-sm font-medium text-gray-800">{profileData.maritalStatus}</p></div>
              </div>
            </div>

            {/* Location & Availability */}
            <div className="bg-white rounded-2xl shadow-lg p-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
                <Globe className="w-5 h-5 text-[#0077BB]" /> Location & Availability
              </h3>
              <div className="space-y-3">
                <div className="p-3 bg-gray-50 rounded-xl"><p className="text-sm text-gray-600">Nationality</p><p className="font-medium text-gray-800">{profileData.nationality}</p></div>
                <div className="p-3 bg-gray-50 rounded-xl"><p className="text-sm text-gray-600">Country of Residence</p><p className="font-medium text-gray-800">{profileData.countryOfResidence}</p></div>
                <div className="p-3 bg-gray-50 rounded-xl"><p className="text-sm text-gray-600">Current City</p><p className="font-medium text-gray-800">{profileData.currentCity === "Other" ? profileData.currentCityOther : profileData.currentCity}</p></div>
                {profileData.willingRelocateCity && (
                  <div className="p-3 bg-blue-50 rounded-xl"><p className="text-sm text-blue-600">Willing to Relocate</p><p className="font-medium text-blue-800">{profileData.willingRelocateCity}</p></div>
                )}
                <div className="p-3 bg-green-50 rounded-xl"><p className="text-sm text-gray-600">Available From</p><p className="font-medium text-gray-800">{formatDate(profileData.availableFrom)}</p></div>
                <div className="p-3 bg-purple-50 rounded-xl"><p className="text-sm text-gray-600">Residency Status</p><p className="font-medium text-gray-800">{profileData.iqama === "Other" ? profileData.iqamaOther : profileData.iqama}</p></div>
              </div>
            </div>

            {/* Salary & Preferences */}
            <div className="bg-white rounded-2xl shadow-lg p-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
                <Target className="w-5 h-5 text-[#0077BB]" /> Preferences
              </h3>
              {profileData.expectedSalary && (
                <div className="mb-4 p-4 bg-gradient-to-br from-green-500 to-emerald-600 rounded-xl text-white text-center">
                  <p className="text-sm">Expected Salary</p>
                  <p className="text-2xl font-bold">{profileData.expectedSalary} SAR</p>
                  <p className="text-green-100 text-xs">Per month</p>
                </div>
              )}
              <div className="space-y-3">
                <div className="p-3 bg-blue-50 rounded-xl"><p className="text-sm text-gray-600">Consent to Forward CV</p><p className="font-medium text-gray-800">{profileData.consentForwardCV === "Yes" ? 'Yes' : 'No'}</p></div>
                <div className="p-3 bg-orange-50 rounded-xl"><p className="text-sm text-gray-600">Medical Assistance</p><p className="font-medium text-gray-800">{profileData.medicalAssistance === "Yes" ? 'Required' : 'Not Required'}</p></div>
              </div>
            </div>
          </div>

          {/* Main Content (unchanged – keep as before) */}
          <div className="xl:col-span-3 space-y-8">
            {/* Education & Qualifications */}
            <div className="bg-white rounded-2xl shadow-lg p-8">
              <div className="flex items-center gap-3 mb-6">
                <div className="p-3 bg-blue-100 rounded-xl"><GraduationCap className="w-6 h-6 text-[#0077BB]" /></div>
                <div><h2 className="text-2xl font-bold text-gray-800">Education & Qualifications</h2><p className="text-gray-600">Academic background and certifications</p></div>
              </div>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div className="space-y-6">
                  <div className="p-4 bg-blue-50 rounded-xl border-l-4 border-[#0077BB]"><h3 className="font-semibold text-gray-800 mb-2">Highest Degree</h3><p className="text-gray-700">{profileData.degree === "Other" ? profileData.degreeOther : profileData.degree}</p></div>
                  <div className="p-4 bg-green-50 rounded-xl border-l-4 border-green-500"><h3 className="font-semibold text-gray-800 mb-2">University</h3><p className="text-gray-700 font-medium">{profileData.universityName}</p>{profileData.universityLocation && <p className="text-gray-600 text-sm mt-1">{profileData.universityLocation}</p>}</div>
                  {profileData.degreeAttested && <div className="p-4 bg-yellow-50 rounded-xl border-l-4 border-yellow-500"><h3 className="font-semibold text-gray-800 mb-2">Degree Attestation</h3><p className="text-gray-700">{profileData.degreeAttested}</p></div>}
                </div>
                <div className="space-y-4">
                  <h3 className="font-semibold text-gray-800 mb-4 flex items-center gap-2"><Award className="w-5 h-5 text-purple-600" /> Professional Certifications</h3>
                  {profileData.englishCert && profileData.englishCert !== "No" && <div className="flex items-center gap-3 p-3 bg-purple-50 rounded-xl"><Award className="w-5 h-5 text-purple-600" /><div><p className="text-sm text-gray-600">English Certificate</p><p className="font-medium text-gray-800">{profileData.englishCert === "Other" ? profileData.englishCertOther : profileData.englishCert}</p></div></div>}
                  {profileData.teachingLicense && profileData.teachingLicense !== "No" && <div className="flex items-center gap-3 p-3 bg-orange-50 rounded-xl"><Award className="w-5 h-5 text-orange-600" /><div><p className="text-sm text-gray-600">Teaching License</p><p className="font-medium text-gray-800">{profileData.teachingLicense === "Other" ? profileData.teachingLicenseOther : profileData.teachingLicense}</p></div></div>}
                  {profileData.teachingDiploma && profileData.teachingDiploma !== "No" && <div className="flex items-center gap-3 p-3 bg-pink-50 rounded-xl"><BookOpen className="w-5 h-5 text-pink-600" /><div><p className="text-sm text-gray-600">Teaching Diploma</p><p className="font-medium text-gray-800">{profileData.teachingDiploma === "Other" ? profileData.teachingDiplomaOther : profileData.teachingDiploma}</p></div></div>}
                  {profileData.stemKnowledge === "Yes" && <div className="flex items-center gap-3 p-3 bg-teal-50 rounded-xl"><SparklesIcon className="w-5 h-5 text-teal-600" /><div><p className="text-sm text-gray-600">STEM Knowledge</p><p className="font-medium text-gray-800">{profileData.stemCertified === "Yes" ? 'Certified' : 'Knowledgeable'}{profileData.stemCertified === "Other" && ` - ${profileData.stemCertifiedOther}`}</p></div></div>}
                  {profileData.otherCertificates && profileData.otherCertificates.length > 0 && (
                    <div className="mt-6">
                      <h3 className="font-semibold text-gray-800 mb-4 flex items-center gap-2"><ScrollText className="w-5 h-5 text-green-600" /> Other Diplomas & Certificates</h3>
                      <div className="space-y-3">
                        {profileData.otherCertificates.map((cert, index) => (
                          <div key={index} className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl p-4 border-l-4 border-green-500">
                            <div className="flex flex-col md:flex-row md:items-center justify-between gap-2">
                              <div><h4 className="font-semibold text-gray-800">{cert.name}</h4><p className="text-sm text-gray-600">{cert.institution}</p></div>
                              <div className="flex items-center gap-2"><Calendar className="w-4 h-4 text-green-600" /><span className="text-sm font-medium text-green-700">{cert.year}</span></div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Experience & Positions */}
            <div className="bg-white rounded-2xl shadow-lg p-8">
              <div className="flex items-center gap-3 mb-6">
                <div className="p-3 bg-green-100 rounded-xl"><Briefcase className="w-6 h-6 text-green-600" /></div>
                <div><h2 className="text-2xl font-bold text-gray-800">Experience & Positions</h2><p className="text-gray-600">Professional background and interests</p></div>
              </div>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div className="space-y-6">
                  <div className="grid grid-cols-2 gap-4">
                    {profileData.totalExperience && <div className="p-4 bg-blue-50 rounded-xl text-center"><p className="text-2xl font-bold text-[#0077BB]">{profileData.totalExperience}</p><p className="text-sm text-gray-600">Years Experience</p></div>}
                    {profileData.availableFrom && <div className="p-4 bg-green-50 rounded-xl text-center"><p className="text-lg font-bold text-green-600">Available</p><p className="text-sm text-gray-600">{formatDate(profileData.availableFrom)}</p></div>}
                  </div>
                  {profileData.currentInstitution && <div className="p-4 bg-gray-50 rounded-xl"><h3 className="font-semibold text-gray-800 mb-2 flex items-center gap-2"><School className="w-4 h-4" /> Current Institution</h3><p className="text-gray-700">{profileData.currentInstitution}</p></div>}
                  {profileData.previousInstitution && <div className="p-4 bg-gray-50 rounded-xl"><h3 className="font-semibold text-gray-800 mb-2 flex items-center gap-2"><Building className="w-4 h-4" /> Previous Institution</h3><p className="text-gray-700">{profileData.previousInstitution}</p></div>}
                </div>
                <div className="space-y-6">
                  <div><h3 className="font-semibold text-gray-800 mb-3 flex items-center gap-2"><Crosshair className="w-5 h-5 text-purple-600" /> Positions Interested In</h3><div className="flex flex-wrap gap-2">{profileData.positionsInterested.map((pos, idx) => (<span key={idx} className="px-3 py-2 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-xl text-sm font-medium shadow-sm">{pos}</span>))}</div></div>
                  <div><h3 className="font-semibold text-gray-800 mb-3">Curriculum Experience</h3><div className="flex flex-wrap gap-2">{profileData.curriculumTaught.map((cur, idx) => (<span key={idx} className="px-3 py-2 bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-xl text-sm font-medium shadow-sm">{cur}</span>))}</div></div>
                </div>
              </div>
            </div>

            {/* Skills & Languages */}
            <div className="bg-white rounded-2xl shadow-lg p-8">
              <div className="flex items-center gap-3 mb-6">
                <div className="p-3 bg-purple-100 rounded-xl"><Activity className="w-6 h-6 text-purple-600" /></div>
                <div><h2 className="text-2xl font-bold text-gray-800">Skills & Languages</h2><p className="text-gray-600">Professional competencies</p></div>
              </div>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div><h3 className="font-semibold text-gray-800 mb-4 flex items-center gap-2"><Star className="w-5 h-5 text-yellow-500" /> Professional Skills</h3><div className="flex flex-wrap gap-3">{profileData.skills.map((skill, idx) => (<span key={idx} className="px-4 py-2 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-xl font-medium shadow-sm">{skill}</span>))}</div></div>
                <div><h3 className="font-semibold text-gray-800 mb-4 flex items-center gap-2"><Languages className="w-5 h-5 text-blue-500" /> Language Proficiency</h3><div className="flex flex-wrap gap-3">{profileData.languages && profileData.languages.length > 0 ? profileData.languages.map((lang, idx) => (<span key={idx} className="px-4 py-2 bg-gradient-to-r from-blue-500 to-cyan-500 text-white rounded-xl font-medium shadow-sm">{lang === "Other" ? profileData.languagesOther : lang}</span>)) : <p className="text-gray-500">No languages specified</p>}</div></div>
              </div>
              {profileData.extras && profileData.extras.length > 0 && (
                <div className="mt-8"><h3 className="font-semibold text-gray-800 mb-4 flex items-center gap-2"><Users className="w-5 h-5 text-green-500" /> Extracurricular Activities</h3><div className="flex flex-wrap gap-3">{profileData.extras.map((act, idx) => (<span key={idx} className="px-4 py-2 bg-gradient-to-r from-green-500 to-emerald-500 text-white rounded-xl font-medium shadow-sm">{act === "Other" ? profileData.extrasOther : act}</span>))}</div></div>
              )}
            </div>

            {/* Awards & Additional Information */}
            {(profileData.awards || profileData.otherNotes) && (
              <div className="bg-white rounded-2xl shadow-lg p-8">
                <div className="flex items-center gap-3 mb-6">
                  <div className="p-3 bg-yellow-100 rounded-xl"><Trophy className="w-6 h-6 text-yellow-600" /></div>
                  <div><h2 className="text-2xl font-bold text-gray-800">Additional Information</h2><p className="text-gray-600">Awards, achievements, and notes</p></div>
                </div>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                  {profileData.awards && <div><h3 className="font-semibold text-gray-800 mb-4 flex items-center gap-2"><Crown className="w-5 h-5 text-yellow-500" /> Awards & Achievements</h3><div className="p-4 bg-yellow-50 rounded-xl"><p className="text-gray-700 whitespace-pre-line">{profileData.awards}</p></div></div>}
                  {profileData.otherNotes && <div><h3 className="font-semibold text-gray-800 mb-4 flex items-center gap-2"><BookMarked className="w-5 h-5 text-blue-500" /> Additional Notes</h3><div className="p-4 bg-blue-50 rounded-xl"><p className="text-gray-700 whitespace-pre-line">{profileData.otherNotes}</p></div></div>}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default TeacherProfile;