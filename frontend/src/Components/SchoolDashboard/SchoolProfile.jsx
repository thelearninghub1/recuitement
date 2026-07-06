import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Building, 
  MapPin, 
  Mail, 
  BookOpen, 
  Edit3,
  LogOut,
  FileText,
  CheckCircle,
  User,
  Lock,
  AlertCircle,
  Crown,
  Users,
  CreditCard,
  Award,
  Wifi,
  Home,
  Car,
  Briefcase,
  Heart,
  Plane,
  GraduationCap,
  Shield,
  Globe,
  School,
  FileCheck,
  BadgeCheck,
  Star
} from "lucide-react";
import { useNavigate } from "react-router-dom"; 
import { useDispatch, useSelector } from 'react-redux';
import { toast } from "react-toastify";
import { logoutUser, clearErrors } from "../../actions/userActions";

// Backend base URL
//const API_BASE_URL =  'http://localhost:5000';
const API_BASE_URL =  '';

// Helper function to get full image URL
const getImageUrl = (filename) => {
  if (!filename) return null;
  if (filename.startsWith('http://') || filename.startsWith('https://')) {
    return filename;
  }
  return `${API_BASE_URL}/uploads/images/${filename}`;
};

export default function SchoolProfile() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  
  const { loading, error, user, isAuthenticatedUser } = useSelector((state) => state.loginUser);
  
  const [schoolData, setSchoolData] = useState(null);
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const [isReady, setIsReady] = useState(false);

  // Logo states (authenticated fetch)
  const [logoBlobUrl, setLogoBlobUrl] = useState(null);
  const [logoLoading, setLogoLoading] = useState(false);
  const [logoError, setLogoError] = useState(false);

  // Function to load logo with authentication (same as payment dashboard)
  const loadLogoWithAuth = async (url) => {
    if (!url) return;
    setLogoLoading(true);
    setLogoError(false);
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(url, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (!response.ok) throw new Error(`HTTP ${response.status}`);
      const blob = await response.blob();
      const objectUrl = URL.createObjectURL(blob);
      setLogoBlobUrl(objectUrl);
    } catch (err) {
      console.error('Logo load error:', err);
      setLogoError(true);
    } finally {
      setLogoLoading(false);
    }
  };

  // Cleanup blob URL on unmount and when logo changes
  useEffect(() => {
    if (schoolData?.logo) {
      if (logoBlobUrl) URL.revokeObjectURL(logoBlobUrl);
      setLogoBlobUrl(null);
      loadLogoWithAuth(schoolData.logo);
    }
    return () => {
      if (logoBlobUrl) URL.revokeObjectURL(logoBlobUrl);
    };
  }, [schoolData?.logo]);

  // Authentication check
  useEffect(() => {
    if (!loading && !isAuthenticatedUser) {
      toast.error('Please login to access school profile');
      navigate('/school-login');
      return;
    }
    if (!loading && isAuthenticatedUser && user && user.role !== 'school') {
      toast.error('Access denied. School account required.');
      navigate('/school-login');
      return;
    }
    if (!loading && isAuthenticatedUser && user && user.role === 'school' && !schoolData) {
      loadSchoolData();
    }
  }, [loading, isAuthenticatedUser, user, schoolData, navigate]);

  useEffect(() => {
    if (error) {
      toast.error(error);
      dispatch(clearErrors());
    }
  }, [error, dispatch]);

  useEffect(() => {
    if (isAuthenticatedUser && schoolData && !loading) {
      setIsReady(true);
    }
  }, [isAuthenticatedUser, schoolData, loading]);

  const loadSchoolData = async () => {
    try {
      if (user) {
        const schoolInfo = {
          email: user.email || 'No email provided',
          schoolName: user.schoolData?.schoolName || user.profile?.firstName || 'Your School',
          schoolId: user.schoolData?.schoolId || user._id?.substring(0, 8) || 'SCH-' + Date.now(),
          country: user.schoolData?.country || 'Saudi Arabia',
          city: user.schoolData?.city || 'Riyadh',
          address: user.schoolData?.address || 'Address not provided',
          establishedYear: user.schoolData?.establishedYear || '2020',
          studentCapacity: user.schoolData?.studentCapacity || '500',
          currentStudents: user.schoolData?.currentStudents || '350',
          website: user.schoolData?.website || 'www.yourschool.edu.sa',
          contactPerson: user.schoolData?.contactPerson || user.profile?.firstName + ' ' + user.profile?.lastName || 'Contact Person',
          contactPosition: user.schoolData?.contactPosition || 'School Administrator',
          principalName: user.schoolData?.principalName || 'Principal Name',
          mobile: user.profile?.mobile || '+966 500 000 000',
          telephone: user.schoolData?.telephone || '+966 11 000 0000',
          alternativeContact: user.schoolData?.alternativeContact || 'Not provided',
          schoolType: Array.isArray(user.schoolData?.schoolType) ? user.schoolData.schoolType : ['International School'],
          schoolLevel: Array.isArray(user.schoolData?.schoolLevel) ? user.schoolData.schoolLevel : ['All Levels'],
          curriculum: Array.isArray(user.schoolData?.curriculum) ? user.schoolData.curriculum : ['International Baccalaureate'],
          expectedTeachers: user.schoolData?.expectedTeachers || '0',
          facilities: Array.isArray(user.schoolData?.facilities) ? user.schoolData.facilities : 
                     (typeof user.schoolData?.facilities === 'string' && user.schoolData.facilities ? [user.schoolData.facilities] : []),
          accreditations: Array.isArray(user.schoolData?.accreditations) ? user.schoolData.accreditations : 
                         (typeof user.schoolData?.accreditations === 'string' && user.schoolData.accreditations ? [user.schoolData.accreditations] : []),
          schoolDescription: user.schoolData?.schoolDescription || 'A leading educational institution committed to excellence.',
          otherPartnershipInstitutions: user.schoolData?.otherPartnershipInstitutions || 'None specified',
          additionalInfo: user.schoolData?.additionalInfo || 'No additional information',
          logo: user.schoolData?.logo ? getImageUrl(user.schoolData.logo) : null,
          membershipStatus: user.schoolData?.membershipStatus || 'Active',
          membershipExpiry: user.schoolData?.membershipExpiry || '30 days remaining'
        };
        setSchoolData(schoolInfo);
      }
    } catch (error) {
      console.error('Error loading school data:', error);
      toast.error('Failed to load school profile');
    }
  };

  const handleEditProfile = () => navigate('/school-edit-profile');
  const handleUpdatePassword = () => navigate('/school-password-update');
  const handleDashboard = () => navigate('/school-dashboard');
  const handleMembershipPlan = () => navigate('/membership-plans');
  const handleMyMembershipPlan = () => navigate('/my-membership-plans');

  const handleLogout = () => {
    setIsLoggingOut(true);
    dispatch(logoutUser());
    navigate('/school-login');
  };

  const getFacilityIcon = (facility) => {
    const lowerFacility = facility.toLowerCase();
    if (lowerFacility.includes('lab') || lowerFacility.includes('science') || lowerFacility.includes('stem')) return <FileText className="w-3 h-3" />;
    if (lowerFacility.includes('library') || lowerFacility.includes('resource')) return <BookOpen className="w-3 h-3" />;
    if (lowerFacility.includes('sport') || lowerFacility.includes('gym') || lowerFacility.includes('pool')) return <Users className="w-3 h-3" />;
    if (lowerFacility.includes('art') || lowerFacility.includes('music') || lowerFacility.includes('drama')) return <Award className="w-3 h-3" />;
    if (lowerFacility.includes('smart') || lowerFacility.includes('tech') || lowerFacility.includes('computer')) return <Wifi className="w-3 h-3" />;
    if (lowerFacility.includes('auditorium') || lowerFacility.includes('hall')) return <Building className="w-3 h-3" />;
    if (lowerFacility.includes('cafeteria') || lowerFacility.includes('canteen') || lowerFacility.includes('food')) return <Home className="w-3 h-3" />;
    if (lowerFacility.includes('medical') || lowerFacility.includes('clinic') || lowerFacility.includes('health')) return <Heart className="w-3 h-3" />;
    if (lowerFacility.includes('prayer') || lowerFacility.includes('mosque')) return <Award className="w-3 h-3" />;
    if (lowerFacility.includes('bus') || lowerFacility.includes('transport')) return <Car className="w-3 h-3" />;
    return <CheckCircle className="w-3 h-3" />;
  };

  const getAccreditationIcon = (accreditation) => {
    const lowerAccreditation = accreditation.toLowerCase();
    if (lowerAccreditation.includes('ministry') || lowerAccreditation.includes('moe')) return <Shield className="w-3 h-3" />;
    if (lowerAccreditation.includes('ib') || lowerAccreditation.includes('baccalaureate')) return <Globe className="w-3 h-3" />;
    if (lowerAccreditation.includes('cambridge') || lowerAccreditation.includes('british')) return <School className="w-3 h-3" />;
    if (lowerAccreditation.includes('american') || lowerAccreditation.includes('cognia')) return <Award className="w-3 h-3" />;
    if (lowerAccreditation.includes('iso')) return <Mail className="w-3 h-3" />;
    if (lowerAccreditation.includes('cis') || lowerAccreditation.includes('council')) return <BadgeCheck className="w-3 h-3" />;
    if (lowerAccreditation.includes('neasc') || lowerAccreditation.includes('accreditation')) return <FileCheck className="w-3 h-3" />;
    if (lowerAccreditation.includes('pearson') || lowerAccreditation.includes('edexcel')) return <Star className="w-3 h-3" />;
    return <Award className="w-3 h-3" />;
  };

  if (isLoggingOut) {
    return (
      <div className="min-h-screen mt-30 bg-gradient-to-br from-blue-50 to-indigo-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-500 mx-auto"></div>
          <p className="mt-4 text-gray-600">Logging out...</p>
        </div>
      </div>
    );
  }

  if (loading || !isReady) {
    return (
      <div className="min-h-screen mt-30 bg-gradient-to-br from-blue-50 to-indigo-50 flex items-center justify-center">
        <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.3 }} className="text-center">
          <motion.div animate={{ rotate: 360 }} transition={{ duration: 1, repeat: Infinity, ease: "linear" }} className="rounded-full h-16 w-16 border-4 border-[#0077BB] border-t-transparent mx-auto mb-6" />
          <motion.h2 initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="text-2xl font-bold text-gray-800 mb-2">Loading School Profile</motion.h2>
          <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.4 }} className="text-gray-600">Preparing your school information...</motion.p>
        </motion.div>
      </div>
    );
  }

  if (isAuthenticatedUser && !schoolData && !loading) {
    return (
      <div className="min-h-screen mt-30 bg-gradient-to-br from-blue-50 to-indigo-50 flex items-center justify-center">
        <div className="text-center bg-white p-8 rounded-2xl shadow-lg max-w-md">
          <AlertCircle className="w-16 h-16 text-red-400 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Profile Not Found</h2>
          <p className="text-gray-600 mb-6">Unable to load school profile data.</p>
          <div className="flex gap-3 justify-center">
            <button onClick={loadSchoolData} className="px-6 py-3 bg-gradient-to-r from-[#0077BB] to-[#00AEEF] text-white rounded-xl font-semibold hover:shadow-lg transition-all duration-200">Try Again</button>
            <button onClick={handleLogout} className="px-6 py-3 border border-gray-300 text-gray-700 rounded-xl font-semibold hover:bg-gray-50 transition-all duration-200">Logout</button>
          </div>
        </div>
      </div>
    );
  }

  const InfoCard = ({ title, icon, children, className = "" }) => (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }} className={`bg-white rounded-2xl shadow-lg border border-gray-100 p-6 ${className}`}>
      <div className="flex items-center gap-3 mb-4">
        <div className="p-2 bg-gradient-to-r from-[#0077BB] to-[#00AEEF] rounded-xl text-white">{icon}</div>
        <h3 className="text-lg font-semibold text-gray-800">{title}</h3>
      </div>
      {children}
    </motion.div>
  );

  const InfoField = ({ label, value }) => (
    <div className="mb-4 last:mb-0">
      <label className="block text-sm font-medium text-gray-700 mb-2">{label}</label>
      <div className="text-gray-800 bg-gray-50 rounded-xl p-3 min-h-[48px]">{value || <span className="text-gray-400">Not provided</span>}</div>
    </div>
  );

  const ArrayField = ({ label, values = [], type = "default" }) => {
    let displayValues = [];
    if (Array.isArray(values)) displayValues = values;
    else if (typeof values === 'string' && values.startsWith('[') && values.endsWith(']')) {
      try { displayValues = JSON.parse(values); } catch { displayValues = []; }
    } else if (typeof values === 'string' && values) displayValues = [values];
    let bgColor, textColor;
    switch(type) {
      case "facilities": bgColor = "bg-gradient-to-r from-blue-100 to-blue-50 border-blue-200"; textColor = "text-blue-800"; break;
      case "accreditations": bgColor = "bg-gradient-to-r from-purple-100 to-purple-50 border-purple-200"; textColor = "text-purple-800"; break;
      default: bgColor = "bg-gradient-to-r from-[#0077BB]/10 to-[#00AEEF]/10 border-[#0077BB]/20"; textColor = "text-[#0077BB]";
    }
    return (
      <div className="mb-6 last:mb-0">
        <label className="block text-sm font-medium text-gray-700 mb-3">{label}</label>
        <div className="flex flex-wrap gap-3">
          {displayValues.length > 0 ? displayValues.map((value, idx) => (
            <motion.div key={idx} initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: idx * 0.05 }} className={`flex items-center gap-2 px-4 py-3 rounded-xl border ${bgColor} ${textColor} font-medium`}>
              {type === "facilities" && getFacilityIcon(value)}
              {type === "accreditations" && getAccreditationIcon(value)}
              <span className="text-sm">{value}</span>
            </motion.div>
          )) : <span className="text-gray-400">Not provided</span>}
        </div>
      </div>
    );
  };

  return (
    <AnimatePresence>
      {isReady && schoolData && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5 }} className="min-h-screen mt-30 bg-gradient-to-br from-blue-50 to-indigo-50 py-8 px-4 md:px-8 font-[Parkinsans]">
          <div className="max-w-7xl mx-auto">
            {/* Header */}
            <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }} className="bg-white rounded-2xl shadow-xl border border-gray-100 mb-8 overflow-hidden">
              <div className="p-6 md:p-8 bg-gradient-to-r from-blue-50 to-indigo-50 border-b border-blue-100">
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
                  <div className="flex items-center gap-4">
                    {schoolData.logo ? (
                      <motion.div initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.2 }} className="relative">
                        {logoLoading ? (
                          <div className="w-20 h-20 rounded-2xl bg-white/20 border-4 border-white shadow-lg flex items-center justify-center">
                            <div className="w-8 h-8 border-2 border-[#0077BB] border-t-transparent rounded-full animate-spin" />
                          </div>
                        ) : logoBlobUrl && !logoError ? (
                          <img src={logoBlobUrl} alt="School Logo" className="w-20 h-20 rounded-2xl object-cover border-4 border-white shadow-lg" />
                        ) : (
                          <div className="w-20 h-20 rounded-2xl bg-gradient-to-r from-[#0077BB] to-[#00AEEF] flex items-center justify-center shadow-lg">
                            <Building className="w-10 h-10 text-white" />
                          </div>
                        )}
                        <div className="absolute -bottom-1 -right-1 w-8 h-8 bg-gradient-to-r from-green-500 to-green-600 rounded-full border-2 border-white flex items-center justify-center">
                          <CheckCircle className="w-4 h-4 text-white" />
                        </div>
                      </motion.div>
                    ) : (
                      <motion.div initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.2 }} className="relative">
                        <div className="w-20 h-20 rounded-2xl bg-gradient-to-r from-[#0077BB] to-[#00AEEF] flex items-center justify-center shadow-lg">
                          <Building className="w-10 h-10 text-white" />
                        </div>
                        <div className="absolute -bottom-1 -right-1 w-8 h-8 bg-gradient-to-r from-green-500 to-green-600 rounded-full border-2 border-white flex items-center justify-center">
                          <CheckCircle className="w-4 h-4 text-white" />
                        </div>
                      </motion.div>
                    )}
                    <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.3 }} className="flex-1">
                      <div className="flex flex-col md:flex-row md:items-center md:gap-4">
                        <div>
                          <h1 className="text-2xl md:text-3xl font-bold text-gray-900">{schoolData.schoolName}</h1>
                          <div className="flex flex-wrap items-center gap-2 mt-2">
                            <span className="inline-flex items-center gap-1 px-3 py-1 bg-blue-100 text-blue-800 text-sm font-medium rounded-full"><MapPin className="w-3 h-3" />{schoolData.city}, {schoolData.country}</span>
                            <span className="inline-flex items-center gap-1 px-3 py-1 bg-green-100 text-green-800 text-sm font-medium rounded-full"><CheckCircle className="w-3 h-3" />Verified School</span>
                            <span className="inline-flex items-center gap-1 px-3 py-1 bg-purple-100 text-purple-800 text-sm font-medium rounded-full"><Crown className="w-3 h-3" />{schoolData.membershipPlan}</span>
                          </div>
                        </div>
                        <div className="hidden md:flex items-center gap-4 mt-3 md:mt-0">
                          <div className="text-center"><div className="text-lg font-bold text-gray-900">{schoolData.currentStudents || 0}</div><div className="text-xs text-gray-600">Students</div></div>
                          <div className="w-px h-8 bg-gray-200"></div>
                          <div className="text-center"><div className="text-lg font-bold text-gray-900">{schoolData.establishedYear || '2020'}</div><div className="text-xs text-gray-600">Established</div></div>
                          <div className="w-px h-8 bg-gray-200"></div>
                          <div className="text-center"><div className="text-lg font-bold text-gray-900">{schoolData.schoolId}</div><div className="text-xs text-gray-600">School ID</div></div>
                        </div>
                      </div>
                      <div className="mt-3 flex flex-wrap items-center gap-3">
                        <span className="text-sm text-gray-600"><span className="font-medium">Status:</span> <span className="ml-1 px-2 py-1 bg-gradient-to-r from-green-500 to-green-600 text-white text-xs font-medium rounded-full">Active</span></span>
                        <span className="text-sm text-gray-600"><span className="font-medium">Member Since:</span> <span className="ml-1 font-medium">{new Date(user?.createdAt || Date.now()).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}</span></span>
                      </div>
                    </motion.div>
                  </div>
                </div>
              </div>
              <div className="p-6 md:p-8">
                <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
                  <div><h3 className="text-sm font-semibold text-gray-700 uppercase tracking-wider mb-4">Quick Actions</h3>
                    <div className="flex flex-wrap gap-3">
                      <button onClick={handleDashboard} className="flex items-center gap-2 px-4 py-3 bg-gradient-to-r from-green-500 to-green-600 text-white rounded-xl hover:shadow-lg hover:scale-105 transition-all group"><BookOpen className="w-4 h-4" /><span>Dashboard</span></button>
                      <button onClick={handleMyMembershipPlan} className="flex items-center gap-2 px-4 py-3 bg-gradient-to-r from-pink-500 to-pink-600 text-white rounded-xl hover:shadow-lg hover:scale-105 transition-all group"><CreditCard className="w-4 h-4" /><span>My Membership</span></button>
                      <button onClick={handleMembershipPlan} className="flex items-center gap-2 px-4 py-3 bg-gradient-to-r from-purple-500 to-purple-600 text-white rounded-xl hover:shadow-lg hover:scale-105 transition-all group"><Crown className="w-4 h-4" /><span>Upgrade Plan</span></button>
                    </div>
                  </div>
                  <div><h3 className="text-sm font-semibold text-gray-700 uppercase tracking-wider mb-4">Settings</h3>
                    <div className="flex flex-wrap gap-3">
                      <button onClick={handleEditProfile} className="flex items-center gap-2 px-4 py-3 bg-gradient-to-r from-[#0077BB] to-[#00AEEF] text-white rounded-xl hover:shadow-lg hover:scale-105 transition-all group"><Edit3 className="w-4 h-4" /><span>Edit Profile</span></button>
                      <button onClick={handleUpdatePassword} className="flex items-center gap-2 px-4 py-3 border-2 border-blue-300 bg-white text-blue-600 rounded-xl hover:bg-blue-50 hover:scale-105 transition-all group"><Lock className="w-4 h-4" /><span>Update Password</span></button>
                      <button onClick={handleLogout} className="flex items-center gap-2 px-4 py-3 border-2 border-red-300 bg-white text-red-600 rounded-xl hover:bg-red-50 hover:scale-105 transition-all group"><LogOut className="w-4 h-4" /><span>Logout</span></button>
                    </div>
                  </div>
                </div>
                <div className="md:hidden mt-6 pt-6 border-t border-gray-200">
                  <div className="grid grid-cols-3 gap-4">
                    <div className="text-center p-3 bg-blue-50 rounded-xl"><div className="text-lg font-bold text-gray-900">{schoolData.currentStudents || 0}</div><div className="text-xs text-gray-600">Students</div></div>
                    <div className="text-center p-3 bg-green-50 rounded-xl"><div className="text-lg font-bold text-gray-900">{schoolData.establishedYear || '2020'}</div><div className="text-xs text-gray-600">Established</div></div>
                    <div className="text-center p-3 bg-purple-50 rounded-xl"><div className="text-lg font-bold text-gray-900">{schoolData.schoolId}</div><div className="text-xs text-gray-600">School ID</div></div>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Main Content Grid */}
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }} className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <div className="lg:col-span-2 space-y-8">
                <InfoCard title="School Information" icon={<Building className="w-5 h-5" />}>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <InfoField label="School Name" value={schoolData.schoolName} />
                    <InfoField label="Established Year" value={schoolData.establishedYear} />
                    <InfoField label="Student Capacity" value={schoolData.studentCapacity} />
                    <InfoField label="Current Students" value={schoolData.currentStudents} />
                  </div>
                  <ArrayField label="School Type" values={schoolData.schoolType} />
                  <ArrayField label="School Level" values={schoolData.schoolLevel} />
                  <ArrayField label="Curriculum" values={schoolData.curriculum} />
                </InfoCard>
                <InfoCard title="Location Information" icon={<MapPin className="w-5 h-5" />}>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <InfoField label="Country" value={schoolData.country} />
                    <InfoField label="City" value={schoolData.city} />
                  </div>
                  <InfoField label="Address" value={schoolData.address} />
                  <InfoField label="Website" value={schoolData.website} />
                </InfoCard>
                <InfoCard title="Staffing Requirements" icon={<Users className="w-5 h-5" />}>
                  <InfoField label="Expected Teachers Needed" value={schoolData.expectedTeachers} />
                </InfoCard>
                <InfoCard title="Facilities Available" icon={<Wifi className="w-5 h-5" />}>
                  <ArrayField label="School Facilities" values={schoolData.facilities} type="facilities" />
                </InfoCard>
                <InfoCard title="Accreditations & Affiliations" icon={<Shield className="w-5 h-5" />}>
                  <ArrayField label="Accreditations & Affiliations" values={schoolData.accreditations} type="accreditations" />
                </InfoCard>
                <InfoCard title="Additional Information" icon={<FileText className="w-5 h-5" />}>
                  <InfoField label="School Description" value={schoolData.schoolDescription} />
                  <InfoField label="Other Partnership Institutions" value={schoolData.otherPartnershipInstitutions} />
                  <InfoField label="Additional Info" value={schoolData.additionalInfo} />
                </InfoCard>
              </div>
              <div className="space-y-8">
                <InfoCard title="Contact Information" icon={<User className="w-5 h-5" />}>
                  <InfoField label="Contact Person" value={schoolData.contactPerson} />
                  <InfoField label="Contact Position" value={schoolData.contactPosition} />
                  <InfoField label="Principal/Director" value={schoolData.principalName} />
                  <InfoField label="Email" value={schoolData.email} />
                  <InfoField label="Mobile" value={schoolData.mobile} />
                  <InfoField label="Telephone" value={schoolData.telephone} />
                  <InfoField label="Alternative Contact" value={schoolData.alternativeContact} />
                </InfoCard>
                <InfoCard title="School Overview" icon={<BookOpen className="w-5 h-5" />}>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center p-3 bg-blue-50 rounded-xl"><span className="text-sm font-medium text-gray-700">School Type</span><span className="text-sm font-semibold text-[#0077BB]">{Array.isArray(schoolData.schoolType) ? schoolData.schoolType.length : 0} types</span></div>
                    <div className="flex justify-between items-center p-3 bg-green-50 rounded-xl"><span className="text-sm font-medium text-gray-700">Curriculum</span><span className="text-sm font-semibold text-green-600">{Array.isArray(schoolData.curriculum) ? schoolData.curriculum.length : 0} curricula</span></div>
                    <div className="flex justify-between items-center p-3 bg-orange-50 rounded-xl"><span className="text-sm font-medium text-gray-700">Enrollment</span><span className="text-sm font-semibold text-orange-600">{schoolData.currentStudents || 0}/{schoolData.studentCapacity || 0}</span></div>
                    <div className="flex justify-between items-center p-3 bg-indigo-50 rounded-xl"><span className="text-sm font-medium text-gray-700">Accreditations</span><span className="text-sm font-semibold text-indigo-600">{Array.isArray(schoolData.accreditations) ? schoolData.accreditations.length : 0} accreditations</span></div>
                  </div>
                </InfoCard>
              </div>
            </motion.div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}