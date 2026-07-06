import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Mail, UploadCloud, CheckCircle, MapPin, Globe, User, Building, 
  Phone, BookOpen, Users, Eye, EyeOff, Save, ArrowLeft, FileText, 
  X, AlertCircle, CreditCard, Crown, School, Search
} from "lucide-react";
import Select from "react-select";
import { Country, State, City } from "country-state-city";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-hot-toast";
import { updateUserProfile, loadUser , clearErrors } from "../../actions/userActions";
import { UPDATE_USER_RESET } from "../../constants/userConstants";
import PhoneInput from 'react-phone-number-input';
import 'react-phone-number-input/style.css';

// School list data (same as register)
const SCHOOL_LIST = [
  "Manarat Al-Qassim School",
  "Al Alia International Indian School",
  "Al Barakah Modern International School",
  "Al Danah International School",
  "Al Dura (Gems) International School",
  "Al Hammad Academy",
  "Al Hussan International Schools – Riyadh",
  "Al Jazeera International School Dammam",
  "Al Manar International School",
  "Al Mawarid International School",
  "Al Rowad International School",
  "Al Shorouq International School",
  "Al Taj International School",
  "Al Wadi International School",
  "Al Waha International School – Jeddah",
  "Al Wurood International School",
  "Al Yasmin International School",
  "Al-Afaq International School",
  "Aldenham Prep Riyadh",
  "Al-Hekma International School",
  "alif International School riyadh",
  "Alkon International School",
  "Al-Majd International School",
  "Al-Rowad International School",
  "Al-Thager Model School",
  "Al-Waha International School",
  "American International School – Riyadh",
  "American International School of Jeddah",
  "American School Dhahran",
  "Asia International School",
  "Bangladesh International School Jeddah",
  "Bangladesh International School Riyadh",
  "Bangladesh International School, Dammam",
  "Bangladesh International School, English Section, Riyadh",
  "Beladi International School Jeddah",
  "British International School Al Khobar",
  "British International School of Jeddah",
  "British International School Riyadh",
  "British International School, Riyadh",
  "Dar Jana International School",
  "Delhi Public School, Riyadh",
  "Dhahran School",
  "DPS Jeddah Al-Falah International School",
  "Dunes International School, Abu Dhabi",
  "Edu World International Schools",
  "Fawaq International School",
  "Future Generation Philippine International School",
  "German International School Jeddah",
  "German International School Riyadh",
  "Ibdaa Assir International School",
  "Indian International School Riyadh",
  "Inspire International School, Al-Khobar",
  "International German School Jeddah",
  "International Indian School Buraydah",
  "International Indian School Jeddah",
  "International Indian School, Al-Jubail",
  "International Indian School, Dammam",
  "International Indian School, Riyadh",
  "International Philippine School in Al Khobar",
  "International Philippine School in Jeddah",
  "International Philippine School in Riyadh",
  "International School Jeddah",
  "International School of KSAFH-NWR Tabuk",
  "International Schools Group (ISG) – Riyadh",
  "ISG Dammam",
  "Jeddah International School",
  "Jeddah Japanese School",
  "Jeddah Knowledge International School",
  "Jeddah Prep & Grammar School",
  "Jubail Academy International School",
  "King's College Riyadh",
  "Korean School in Jeddah",
  "Korean School in Riyadh",
  "Lycée Français International d'Al Khobar",
  "Manarat Jeddah International School",
  "Millennium International School",
  "Modern Middle East International School",
  "New Middle East International School",
  "New Middle East International School, Riyadh",
  "New World International School, Al-Khobar",
  "Nobles International School",
  "Nour Al-Maaref International School",
  "One World International School",
  "Orbit International School, Al-Khobar",
  "Pakistan International School",
  "Pakistan International School Buraydah",
  "Pakistan International School Jeddah",
  "Pakistan International School Jeddah - English Section (PISJES)",
  "Pakistan International School Riyadh",
  "Pakistan International School, Al-Khobar",
  "Pakistan International School, Riyadh",
  "Palm Crest International School",
  "Pearl of the Orient International School",
  "Philippine Sunrise International School",
  "Radhwa international School",
  "Radhwa International School",
  "Reigate Grammar School",
  "Riyadh International School",
  "Riyadh Japanese School",
  "Saud International School",
  "Saudi Arabian Multinational School",
  "Saudi International School – Dhahran",
  "Scuola Italiana di Gedda (Italian International School Jeddah)",
  "Second Philippine International School",
  "SEK International School Riyadh",
  "SEVA School",
  "Sri Lankan International School Jeddah",
  "Sri Lankan International School Riyadh",
  "Swedish School Riyadh",
  "Talal International School",
  "Thamer International School",
  "The City School International",
  "The World Academy, KAEC",
  "Yara International School",
  "Zahrat Al-Sahraa International School",
];

const schoolTypes = [
  "Private School",
  "Public School",
  "International School",
  "Charter School",
  "Nursery / Pre-School",
  "Language Center",
  "Other"
];

const schoolLevels = [
  "Preschool/Kindergarten",
  "Primary School",
  "Middle School",
  "High School",
  "All Levels (K-12)"
];

const curricula = [
  { main: "British Curriculum", sub: "National Curriculum for England" },
  { main: "British Curriculum", sub: "Cambridge (IGCSE / A-Levels)" },
  { main: "British Curriculum", sub: "Edexcel" },
  { main: "British Curriculum", sub: "GCSE / A-Level Schools" },
  { main: "American Curriculum", sub: "US State Standards" },
  { main: "American Curriculum", sub: "Common Core" },
  { main: "American Curriculum", sub: "High School Diploma" },
  { main: "American Curriculum", sub: "AP (Advanced Placement)" },
  { main: "IB (International Baccalaureate)", sub: "PYP (Primary Years Programme)" },
  { main: "IB (International Baccalaureate)", sub: "MYP (Middle Years Programme)" },
  { main: "IB (International Baccalaureate)", sub: "DP (Diploma Programme)" },
  { main: "IB (International Baccalaureate)", sub: "CP (Career-related Programme)" },
  { main: "Canadian Curriculum", sub: "Canadian Curriculum" },
  { main: "Australian Curriculum", sub: "Australian Curriculum" },
  { main: "Indian Curriculum", sub: "CBSE" },
  { main: "Indian Curriculum", sub: "ICSE" },
  { main: "French Curriculum", sub: "French Curriculum" },
  { main: "German Curriculum", sub: "German Curriculum" },
  { main: "Pakistani Curriculum", sub: "FBISE" },
  { main: "Filipino Curriculum", sub: "Filipino Curriculum" },
  { main: "Singapore Curriculum", sub: "Singapore Curriculum" },
  { main: "South African Curriculum", sub: "CAPS" },
  { main: "Language Center", sub: "English / Multi Language" },
  { main: "Language Center", sub: "Corporate Training" },
  { main: "Language Center", sub: "Test Preparation Center" },
  { main: "Other International", sub: "Other International Curriculum" }
];

const POSITIONS = [
  "Principal / Head of School",
  "Vice Principal / Deputy Principal",
  "Assistant Principal",
  "School Director",
  "Academic Director / Head of Academics",
  "Curriculum Coordinator",
  "Head of Department (HOD)",
  "Subject Coordinator",
  "Assessment / Exams Coordinator",
  "IB / IGCSE / American Curriculum Coordinator",
  "School Administrator",
  "Operations Manager",
  "HR Manager / HR Officer",
  "Admissions Officer / Registrar",
  "Finance Manager / Accountant",
  "PRO / Government Relations Officer",
  "School Counselor / Student Counselor",
  "Career & University Counselor",
  "School Psychologist",
  "Learning Support Coordinator",
];

const FACILITIES_CHECKLIST = [
  "Classrooms (Smart / Traditional)",
  "Science Laboratories",
  "Computer / IT Labs",
  "Library / Learning Resource Center",
  "STEAM / STEM Lab",
  "Art & Design Room",
  "Music Rooms",
  "Examination Halls",
  "Indoor Sports Hall / Gymnasium",
  "Outdoor Playground",
  "Swimming Pool (if available)",
  "Auditorium / Assembly Hall",
  "Special Education / Inclusion Rooms",
  "Medical Room / School Clinic",
  "Prayer Room / Mosque",
  "School Cafeteria / Canteen",
  "Drinking Water Stations",
  "Smart Boards / Projectors",
  "CCTV & Security Systems",
  "PA / Announcement System",
  "School Buses / Transport Area",
  "Security Gate & Reception",
  "Gardens / Green Areas",
];

const ACCREDITATIONS_CHECKLIST = [
  "Council of International Schools (CIS)",
  "New England Association of Schools and Colleges (NEASC)",
  "British Schools Overseas (BSO)",
  "International Baccalaureate (IB)",
  "Ministry of Education (MoE)",
  "Education and Training Evaluation Commission (ETEC)",
  "Knowledge and Human Development Authority (KHDA)",
  "Abu Dhabi Department of Education and Knowledge (ADEK)",
  "Cambridge Assessment International Education (CAIE)",
  "Pearson Edexcel",
  "Council of British International Schools (COBIS)",
  "Association of American Schools in the Middle East (AASME)",
  "Federal Board of Pakistan (FBISE)",
  "Central Board of Secondary Education (CBSE)",
  "ISO 21001 – Educational Organizations Management",
  "ISO 9001 – Quality Management",
  "ISO 45001 – Health & Safety Management",
  "Other"
];

const countryOptions = Country.getAllCountries().map(country => ({
  value: country.isoCode,
  label: country.name,
  ...country
}));

const customSelectStyles = {
  control: (base, state) => ({
    ...base,
    borderRadius: '12px',
    border: '2px solid #e5e7eb',
    padding: '4px 8px',
    boxShadow: 'none',
    '&:hover': { borderColor: '#0077BB' },
    backgroundColor: state.isFocused ? '#f8fafc' : '#ffffff',
  }),
  option: (base, state) => ({
    ...base,
    backgroundColor: state.isSelected ? '#0077BB' : state.isFocused ? '#f0f9ff' : '#ffffff',
    color: state.isSelected ? '#ffffff' : '#1f2937',
    padding: '12px 16px',
    borderRadius: '8px',
    margin: '4px',
  }),
  menu: (base) => ({
    ...base,
    borderRadius: '12px',
    boxShadow: '0 10px 25px rgba(0,0,0,0.1)',
  }),
};

// Update the getImageUrl function:
const getImageUrl = (filename) => {
  if (!filename) return null;
  if (filename.startsWith('http://') || filename.startsWith('https://')) {
    return filename;
  }
  // Make sure the path matches your backend static file serving
  // const baseUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000';
 const baseUrl = import.meta.env.VITE_API_URL || 'https://theteachingpath.com';
  return `${baseUrl}/uploads/images/${filename}`;
};



export default function SchoolEditProfile() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  
  const { loading, error, user, isAuthenticatedUser } = useSelector((state) => state.loginUser);
  const { loading: updateLoading, error: updateError, success } = useSelector((state) => state.updatePassword || { loading: false, error: null, success: false });
  
  const [formData, setFormData] = useState({
    schoolName: "",
    schoolNameOther: "",
    schoolType: [],
    schoolLevel: [],
    curriculum: [],
    establishedYear: "",
    studentCapacity: "",
    currentStudents: "",
    country: "",
    city: "",
    cityOther: "",
    address: "",
    website: "",
    contactPerson: "",
    contactPosition: "",
    principalName: "",
    email: "",
    mobile: "",
    telephone: "",
    alternativeContact: "",
    expectedTeachers: "",
    facilities: [],
    facilitiesOther: "",
    accreditations: [],
    accreditationsOther: "",
    schoolDescription: "",
    otherPartnershipInstitutions: "",
    additionalInfo: ""
  });
  
  const [logo, setLogo] = useState(null);
  const [logoPreview, setLogoPreview] = useState(null);
  const [existingLogo, setExistingLogo] = useState(null);
  const [schoolDocuments, setSchoolDocuments] = useState([]);
  const [cities, setCities] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [showSchoolDropdown, setShowSchoolDropdown] = useState(false);
  const [expandedCurricula, setExpandedCurricula] = useState({});
  const [errors, setErrors] = useState({});
  const [loadingData, setLoadingData] = useState(true);
  
 // In your useEffect where you load school data, add this after setting formData:
useEffect(() => {
  if (user && user.schoolData) {
    const schoolData = user.schoolData;
    setFormData({
      schoolName: schoolData.schoolName || "",
      schoolNameOther: "",
      schoolType: Array.isArray(schoolData.schoolType) ? schoolData.schoolType : [],
      schoolLevel: Array.isArray(schoolData.schoolLevel) ? schoolData.schoolLevel : [],
      curriculum: Array.isArray(schoolData.curriculum) ? schoolData.curriculum : [],
      establishedYear: schoolData.establishedYear || "",
      studentCapacity: schoolData.studentCapacity || "",
      currentStudents: schoolData.currentStudents || "",
      country: schoolData.country || "",
      city: schoolData.city || "",
      cityOther: "",
      address: schoolData.address || "",
      website: schoolData.website || "",
      contactPerson: schoolData.contactPerson || user.profile?.firstName || "",
      contactPosition: schoolData.contactPosition || "",
      principalName: schoolData.principalName || "",
      email: user.email || "",
      mobile: user.profile?.mobile || "",
      telephone: schoolData.telephone || "",
      alternativeContact: schoolData.alternativeContact || "",
      expectedTeachers: schoolData.expectedTeachers || "",
      facilities: Array.isArray(schoolData.facilities) ? schoolData.facilities : [],
      facilitiesOther: "",
      accreditations: Array.isArray(schoolData.accreditations) ? schoolData.accreditations : [],
      accreditationsOther: "",
      schoolDescription: schoolData.schoolDescription || "",
      otherPartnershipInstitutions: schoolData.otherPartnershipInstitutions || "",
      additionalInfo: schoolData.additionalInfo || ""
    });
    
    // ADD THIS: Load cities for the existing country
    if (schoolData.country) {
      const selectedCountry = countryOptions.find(c => c.label === schoolData.country);
      if (selectedCountry) {
        const countryCities = City.getCitiesOfCountry(selectedCountry.value);
        setCities(countryCities || []);
      }
    }
  
    if (schoolData.logo) {
      setExistingLogo(getImageUrl(schoolData.logo));
    }setLoadingData(false);

    if (schoolData.logo) {
  const logoUrl = getImageUrl(schoolData.logo);
  console.log('Logo URL:', logoUrl); // Debug log
  setExistingLogo(logoUrl);
}     

  }

  
}, [user]);
  
  // Handle authentication
  useEffect(() => {
    if (!loading && !isAuthenticatedUser) {
      toast.error('Please login to access this page');
      navigate('/school-login');
    }
    if (!loading && isAuthenticatedUser && user && user.role !== 'school') {
      toast.error('Access denied. School account required.');
      navigate('/school-login');
    }
  }, [loading, isAuthenticatedUser, user, navigate]);
  
  // Handle errors and success
  useEffect(() => {
    if (error) {
      toast.error(error);
      dispatch(clearErrors());
    }
    if (updateError) {
      toast.error(updateError);
      dispatch({ type: UPDATE_USER_RESET });
    }
    if (success) {
      toast.success('Profile updated successfully!');
      dispatch({ type: UPDATE_USER_RESET });
        navigate('/school-profile');
      dispatch(loadUser());                 // 👈 This refreshes the user data

    }
  }, [error, updateError, success, dispatch, navigate]);
  
  const handleChange = (key, value) => {
    setFormData(prev => ({ ...prev, [key]: value }));
    if (errors[key]) {
      setErrors(prev => ({ ...prev, [key]: "" }));
    }
  };
  
  const toggleArrayValue = (key, value) => {
    setFormData(prev => {
      const arr = prev[key] || [];
      if (arr.includes(value)) {
        return { ...prev, [key]: arr.filter(a => a !== value) };
      } else {
        return { ...prev, [key]: [...arr, value] };
      }
    });
  };
  
  const handleCurriculumSelect = (subValue) => {
    setFormData(prev => {
      const arr = prev.curriculum || [];
      if (arr.includes(subValue)) {
        return { ...prev, curriculum: arr.filter(a => a !== subValue) };
      } else {
        return { ...prev, curriculum: [...arr, subValue] };
      }
    });
  };
  
  const toggleCurriculumExpand = (main) => {
    setExpandedCurricula(prev => ({
      ...prev,
      [main]: !prev[main]
    }));
  };
  
  const groupedCurricula = curricula.reduce((acc, curr) => {
    if (!acc[curr.main]) acc[curr.main] = [];
    acc[curr.main].push(curr.sub);
    return acc;
  }, {});
  
  const getCitiesForCountry = (countryCode) => {
    if (!countryCode) {
      setCities([]);
      return;
    }
    try {
      const countryCities = City.getCitiesOfCountry(countryCode);
      setCities(countryCities || []);
    } catch (error) {
      console.error("Error loading cities:", error);
      setCities([]);
    }
  };
  
  const handleLogoChange = (file) => {
    if (file) {
      setLogo(file);
      setLogoPreview(URL.createObjectURL(file));
    }
  };
  
  const handleDocumentsChange = (files) => {
    setSchoolDocuments(Array.from(files));
  };
  
  const handleSchoolNameSelect = (schoolName) => {
    if (schoolName === "Other") {
      handleChange("schoolName", "");
      handleChange("schoolNameOther", "");
    } else {
      handleChange("schoolName", schoolName);
      handleChange("schoolNameOther", "");
    }
    setShowSchoolDropdown(false);
    setSearchQuery("");
  };
  
  const filteredSchools = SCHOOL_LIST.filter(school =>
    school.toLowerCase().includes(searchQuery.toLowerCase())
  );
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validate required fields
    const newErrors = {};
    if (!formData.schoolName && !formData.schoolNameOther) newErrors.schoolName = "School name is required";
    if (!formData.email) newErrors.email = "Email is required";
    if (!formData.contactPerson) newErrors.contactPerson = "Contact person is required";
    if (!formData.principalName) newErrors.principalName = "Principal name is required";
    if (!formData.mobile) newErrors.mobile = "Mobile number is required";
    
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      toast.error("Please fill in all required fields");
      return;
    }
    
    const submitData = new FormData();
    
    // Basic info
    submitData.append('email', formData.email);
    submitData.append('firstName', formData.contactPerson);
    submitData.append('lastName', '');
    submitData.append('mobile', formData.mobile);
    submitData.append('role', 'school');
    
    // School data
    submitData.append('schoolName', formData.schoolName || formData.schoolNameOther);
    if (formData.schoolNameOther) submitData.append('schoolNameOther', formData.schoolNameOther);
    
    formData.schoolType.forEach(type => submitData.append('schoolType', type));
    formData.schoolLevel.forEach(level => submitData.append('schoolLevel', level));
    formData.curriculum.forEach(curr => submitData.append('curriculum', curr));
    formData.facilities.forEach(facility => submitData.append('facilities', facility));
    formData.accreditations.forEach(acc => submitData.append('accreditations', acc));
    
    submitData.append('establishedYear', formData.establishedYear);
    submitData.append('studentCapacity', formData.studentCapacity);
    submitData.append('currentStudents', formData.currentStudents);
    submitData.append('country', formData.country);
    submitData.append('city', formData.city);
    submitData.append('cityOther', formData.cityOther);
    submitData.append('address', formData.address);
    submitData.append('website', formData.website);
    submitData.append('contactPerson', formData.contactPerson);
    submitData.append('contactPosition', formData.contactPosition);
    submitData.append('principalName', formData.principalName);
    submitData.append('telephone', formData.telephone);
    submitData.append('alternativeContact', formData.alternativeContact);
    submitData.append('expectedTeachers', formData.expectedTeachers);
    submitData.append('facilitiesOther', formData.facilitiesOther);
    submitData.append('accreditationsOther', formData.accreditationsOther);
    submitData.append('schoolDescription', formData.schoolDescription);
    submitData.append('otherPartnershipInstitutions', formData.otherPartnershipInstitutions);
    submitData.append('additionalInfo', formData.additionalInfo);
    
    if (logo) {
      submitData.append('logo', logo);
    }
    
    schoolDocuments.forEach((file, index) => {
      submitData.append('schoolDocuments', file);
    });
    
    dispatch(updateUserProfile(submitData));
  };
  

  if (loading || loadingData) {
    return (
      <div className="min-h-screen mt-30 bg-gradient-to-br from-blue-50 to-indigo-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#0077BB] mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading profile data...</p>
        </div>
      </div>
    );
  }
  
  const InputLabel = ({ htmlFor, children, required, icon }) => (
    <label htmlFor={htmlFor} className="block text-sm font-medium text-gray-700 mb-2">
      <div className="flex items-center gap-2">
        {icon}
        <span>{children}</span>
        {required && <span className="text-red-500">*</span>}
      </div>
    </label>
  );
  
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 py-16 mt-26 px-4 md:px-8 font-[Parkinsans]">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-100 mb-6">
          <div className="p-6 md:p-8 border-b border-gray-100">
            <div className="flex items-center justify-between flex-wrap gap-4">
              <div>
                <h1 className="text-2xl md:text-3xl font-bold text-gray-800 bg-gradient-to-r from-[#0077BB] to-[#00AEEF] bg-clip-text text-transparent">
                  Edit School Profile
                </h1>
                <p className="text-sm text-gray-500 mt-1">Update your school information</p>
              </div>
              <div className="flex gap-3">
                <button
                  onClick={() => navigate('/school-profile')}
                  className="flex items-center gap-2 px-4 py-2 border-2 border-gray-300 rounded-xl text-gray-700 hover:bg-gray-50 transition-all"
                >
                  <ArrowLeft className="w-4 h-4" />
                  Cancel
                </button>
             
              </div>
            </div>
          </div>
        </div>
        
        <form onSubmit={handleSubmit} className="bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-100">
          <div className="p-6 md:p-8 space-y-8">
            {/* School Basic Information */}
            <div>
              <h2 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
                <School className="w-5 h-5 text-[#0077BB]" />
                School Basic Information
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* School Name with Search Dropdown */}
                <div className="md:col-span-2 relative school-name-dropdown">
                  <InputLabel htmlFor="schoolName" required icon={<Building className="w-4 h-4" />}>
                    School Name
                  </InputLabel>
                  <div className="relative">
                    <div className="flex items-center">
                      <Search className="absolute left-3 w-5 h-5 text-gray-400" />
                      <input
                        id="schoolName"
                        value={formData.schoolName === "Other" ? "" : formData.schoolName}
                        onChange={(e) => {
                          handleChange("schoolName", e.target.value);
                          setSearchQuery(e.target.value);
                          setShowSchoolDropdown(true);
                        }}
                        onFocus={() => setShowSchoolDropdown(true)}
                        className="mt-1 block w-full border-2 border-gray-200 rounded-xl p-3 pl-10 transition-all duration-200 focus:border-[#0077BB] focus:ring-2 focus:ring-blue-100"
                        placeholder="Search or type school name..."
                      />
                    </div>
                    
                    {showSchoolDropdown && (
                      <div className="absolute z-50 mt-1 w-full bg-white border-2 border-gray-200 rounded-xl shadow-lg max-h-60 overflow-y-auto">
                        <div className="p-2">
                          {filteredSchools.map((school) => (
                            <button
                              key={school}
                              type="button"
                              onClick={() => handleSchoolNameSelect(school)}
                              className="w-full text-left px-4 py-3 hover:bg-blue-50 rounded-lg transition-colors duration-200 flex items-center justify-between"
                            >
                              <span className="text-sm font-medium">{school}</span>
                              {formData.schoolName === school && (
                                <CheckCircle className="w-4 h-4 text-green-500" />
                              )}
                            </button>
                          ))}
                          <button
                            type="button"
                            onClick={() => handleSchoolNameSelect("Other")}
                            className="w-full text-left px-4 py-3 hover:bg-blue-50 rounded-lg transition-colors duration-200 flex items-center justify-between border-t border-gray-100 mt-2 pt-2"
                          >
                            <span className="text-sm font-medium text-gray-600">Other (Not listed)</span>
                            {formData.schoolName === "" && formData.schoolNameOther !== "" && (
                              <CheckCircle className="w-4 h-4 text-green-500" />
                            )}
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                  
                  {formData.schoolName === "" && formData.schoolNameOther !== "" && (
                    <div className="mt-3">
                      <input
                        value={formData.schoolNameOther}
                        onChange={(e) => handleChange("schoolNameOther", e.target.value)}
                        className="block w-full border-2 border-gray-200 rounded-xl p-3 transition-all duration-200 focus:border-[#0077BB] focus:ring-2 focus:ring-blue-100"
                        placeholder="Enter your school name"
                      />
                    </div>
                  )}
                  {errors.schoolName && <p className="text-red-500 text-sm mt-1">{errors.schoolName}</p>}
                </div>
                
                {/* School Type */}
                <div className="md:col-span-2">
                  <InputLabel required icon={<Building className="w-4 h-4" />}>
                    School Type
                  </InputLabel>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-3 mt-2">
                    {schoolTypes.map((type) => (
                      <label key={type} className="flex items-center gap-3 p-3 rounded-xl border-2 border-gray-200 hover:border-[#0077BB] transition-all duration-200 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={formData.schoolType.includes(type)}
                          onChange={() => toggleArrayValue("schoolType", type)}
                          className="w-5 h-5 text-[#0077BB] focus:ring-[#0077BB]"
                        />
                        <span className="text-sm font-medium">{type}</span>
                      </label>
                    ))}
                  </div>
                </div>
                
                {/* School Level */}
                <div>
                  <InputLabel icon={<Users className="w-4 h-4" />}>
                    School Level/Grades
                  </InputLabel>
                  <div className="grid grid-cols-1 gap-2 mt-2">
                    {schoolLevels.map((level) => (
                      <label key={level} className="flex items-center gap-3 p-3 rounded-xl border-2 border-gray-200 hover:border-[#0077BB] transition-all duration-200 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={formData.schoolLevel.includes(level)}
                          onChange={() => toggleArrayValue("schoolLevel", level)}
                          className="w-5 h-5 text-[#0077BB] focus:ring-[#0077BB]"
                        />
                        <span className="text-sm font-medium">{level}</span>
                      </label>
                    ))}
                  </div>
                </div>
                
                {/* Curriculum */}
                <div>
                  <InputLabel required icon={<BookOpen className="w-4 h-4" />}>
                    Curriculum
                  </InputLabel>
                  <div className="mt-2 max-h-67 overflow-y-auto border-2 border-gray-200 rounded-xl p-3">
                    {Object.entries(groupedCurricula).map(([main, subs]) => (
                      <div key={main} className="mb-4">
                        <button
                          type="button"
                          onClick={() => toggleCurriculumExpand(main)}
                          className="w-full text-left font-semibold text-gray-800 p-2 hover:bg-gray-100 rounded-lg flex items-center justify-between"
                        >
                          <span>{main}</span>
                          <span className="text-xs text-gray-500">
                            {expandedCurricula[main] ? '▼' : '▶'}
                          </span>
                        </button>
                        
                        {expandedCurricula[main] && (
                          <div className="ml-4 mt-2 space-y-2">
                            {subs.map((sub) => (
                              <label key={sub} className="flex items-center gap-3 p-2 rounded-lg hover:bg-blue-50 cursor-pointer">
                                <input
                                  type="checkbox"
                                  checked={formData.curriculum.includes(sub)}
                                  onChange={() => handleCurriculumSelect(sub)}
                                  className="w-4 h-4 text-[#0077BB] focus:ring-[#0077BB]"
                                />
                                <span className="text-sm">{sub}</span>
                              </label>
                            ))}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
                
                {/* Established Year */}
                <div>
                  <InputLabel htmlFor="establishedYear" icon={<Building className="w-4 h-4" />}>
                    Year Established
                  </InputLabel>
                  <input
                    id="establishedYear"
                    type="number"
                    min="1900"
                    max={new Date().getFullYear()}
                    value={formData.establishedYear}
                    onChange={(e) => handleChange("establishedYear", e.target.value)}
                    className="mt-1 block w-full border-2 border-gray-200 rounded-xl p-3 transition-all duration-200 focus:border-[#0077BB] focus:ring-2 focus:ring-blue-100"
                    placeholder="e.g., 1995"
                  />
                </div>
                
                {/* Student Capacity */}
                <div>
                  <InputLabel htmlFor="studentCapacity" icon={<Users className="w-4 h-4" />}>
                    Student Capacity
                  </InputLabel>
                  <input
                    id="studentCapacity"
                    type="number"
                    value={formData.studentCapacity}
                    onChange={(e) => handleChange("studentCapacity", e.target.value)}
                    className="mt-1 block w-full border-2 border-gray-200 rounded-xl p-3 transition-all duration-200 focus:border-[#0077BB] focus:ring-2 focus:ring-blue-100"
                    placeholder="Total capacity"
                  />
                </div>
                
                {/* Current Students */}
                <div>
                  <InputLabel htmlFor="currentStudents" icon={<Users className="w-4 h-4" />}>
                    Current Number of Students
                  </InputLabel>
                  <input
                    id="currentStudents"
                    type="number"
                    value={formData.currentStudents}
                    onChange={(e) => handleChange("currentStudents", e.target.value)}
                    className="mt-1 block w-full border-2 border-gray-200 rounded-xl p-3 transition-all duration-200 focus:border-[#0077BB] focus:ring-2 focus:ring-blue-100"
                    placeholder="Current enrollment"
                  />
                </div>
                
                {/* Website */}
                <div>
                  <InputLabel htmlFor="website" icon={<Globe className="w-4 h-4" />}>
                    School Website
                  </InputLabel>
                  <input
                    id="website"
                    value={formData.website}
                    onChange={(e) => handleChange("website", e.target.value)}
                    className="mt-1 block w-full border-2 border-gray-200 rounded-xl p-3 transition-all duration-200 focus:border-[#0077BB] focus:ring-2 focus:ring-blue-100"
                    placeholder="https://www.yourschool.edu"
                  />
                </div>
              </div>
            </div>
            
            {/* Location Information */}
            <div>
              <h2 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
                <MapPin className="w-5 h-5 text-[#0077BB]" />
                Location Information
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <InputLabel htmlFor="country" required icon={<Globe className="w-4 h-4" />}>
                    Country
                  </InputLabel>
<Select
  options={countryOptions}
  value={countryOptions.find(country => country.label === formData.country) || null}
  onChange={(selected) => {
    handleChange("country", selected?.label || "");
    getCitiesForCountry(selected?.value);
  }}
  styles={customSelectStyles}
  placeholder="Select country"
  isSearchable
/>
                </div>
                
                <div>
                  <InputLabel htmlFor="city" required icon={<MapPin className="w-4 h-4" />}>
                    City
                  </InputLabel>
                  <select
                    value={formData.city}
                    onChange={(e) => handleChange("city", e.target.value)}
                    className="mt-1 block w-full border-2 border-gray-200 rounded-xl p-3 transition-all duration-200 focus:border-[#0077BB] focus:ring-2 focus:ring-blue-100"
                    disabled={!formData.country}
                  >
                    <option value="">Select city</option>
                    {cities.map((city) => (
                      <option key={city.name} value={city.name}>
                        {city.name}
                      </option>
                    ))}
                    <option value="Other">Other</option>
                  </select>
                  {formData.city === "Other" && (
                    <input
                      className="mt-2 block w-full border-2 border-gray-200 rounded-xl p-3 transition-all duration-200 focus:border-[#0077BB] focus:ring-2 focus:ring-blue-100"
                      placeholder="Please specify your city"
                      value={formData.cityOther}
                      onChange={(e) => handleChange("cityOther", e.target.value)}
                    />
                  )}
                </div>
                
                <div className="md:col-span-2">
                  <InputLabel htmlFor="address" icon={<MapPin className="w-4 h-4" />}>
                    Full Address
                  </InputLabel>
                  <textarea
                    id="address"
                    value={formData.address}
                    onChange={(e) => handleChange("address", e.target.value)}
                    className="mt-1 block w-full border-2 border-gray-200 rounded-xl p-3 transition-all duration-200 focus:border-[#0077BB] focus:ring-2 focus:ring-blue-100"
                    rows="3"
                    placeholder="Complete school address"
                  />
                </div>
              </div>
            </div>
            
            {/* Contact Information */}
            <div>
              <h2 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
                <User className="w-5 h-5 text-[#0077BB]" />
                Contact Information
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <InputLabel htmlFor="contactPerson" required icon={<User className="w-4 h-4" />}>
                    Contact Person Name
                  </InputLabel>
                  <input
                    id="contactPerson"
                    value={formData.contactPerson}
                    onChange={(e) => handleChange("contactPerson", e.target.value)}
                    className="mt-1 block w-full border-2 border-gray-200 rounded-xl p-3 transition-all duration-200 focus:border-[#0077BB] focus:ring-2 focus:ring-blue-100"
                    placeholder="Full name of contact person"
                  />
                  {errors.contactPerson && <p className="text-red-500 text-sm mt-1">{errors.contactPerson}</p>}
                </div>
                
                <div>
                  <InputLabel htmlFor="contactPosition" icon={<User className="w-4 h-4" />}>
                    Contact Person Position
                  </InputLabel>
                  <Select
                    options={POSITIONS.map(pos => ({ value: pos, label: pos }))}
                    value={formData.contactPosition ? { value: formData.contactPosition, label: formData.contactPosition } : null}
                    onChange={(selected) => handleChange("contactPosition", selected?.value || "")}
                    styles={customSelectStyles}
                    placeholder="Select position"
                    isSearchable
                    isClearable
                  />
                </div>
                
                <div>
                  <InputLabel htmlFor="principalName" required icon={<User className="w-4 h-4" />}>
                    Director/Principal Name
                  </InputLabel>
                  <input
                    id="principalName"
                    value={formData.principalName}
                    onChange={(e) => handleChange("principalName", e.target.value)}
                    className="mt-1 block w-full border-2 border-gray-200 rounded-xl p-3 transition-all duration-200 focus:border-[#0077BB] focus:ring-2 focus:ring-blue-100"
                    placeholder="Full name of principal/director"
                  />
                  {errors.principalName && <p className="text-red-500 text-sm mt-1">{errors.principalName}</p>}
                </div>
                
                <div>
                  <InputLabel htmlFor="email" required icon={<Mail className="w-4 h-4" />}>
                    Email Address
                  </InputLabel>
                  <input
                    id="email"
                    type="email"
                    value={formData.email}
                    onChange={(e) => handleChange("email", e.target.value)}
                    className="mt-1 block w-full border-2 border-gray-200 rounded-xl p-3 transition-all duration-200 focus:border-[#0077BB] focus:ring-2 focus:ring-blue-100"
                    placeholder="contact@school.edu"
                  />
                  {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
                </div>
                
                {/* Mobile Number */}
                <div>
                  <InputLabel htmlFor="mobile" required icon={<Phone className="w-4 h-4" />}>
                    School Mobile Number
                  </InputLabel>
                  <div className="mt-1 phone-input-wrapper">
                    <PhoneInput
                      international
                      defaultCountry="SA"
                      value={formData.mobile}
                      onChange={(value) => handleChange("mobile", value)}
                      className="custom-phone-input"
                      placeholder="Enter phone number"
                      limitMaxLength={true}
                    />
                  </div>
                  {errors.mobile && <p className="text-red-500 text-sm mt-1">{errors.mobile}</p>}
                </div>
                
                {/* Telephone */}
                <div>
                  <InputLabel htmlFor="telephone" icon={<Phone className="w-4 h-4" />}>
                    School Telephone Number
                  </InputLabel>
                  <div className="mt-1 phone-input-wrapper">
                    <PhoneInput
                      international
                      defaultCountry="SA"
                      value={formData.telephone}
                      onChange={(value) => handleChange("telephone", value)}
                      className="custom-phone-input"
                      placeholder="Enter phone number"
                      limitMaxLength={true}
                    />
                  </div>
                </div>
                
                {/* Alternative Contact */}
                <div>
                  <InputLabel htmlFor="alternativeContact" icon={<Phone className="w-4 h-4" />}>
                    School Alternative Contact
                  </InputLabel>
                  <div className="mt-1 phone-input-wrapper">
                    <PhoneInput
                      international
                      defaultCountry="SA"
                      value={formData.alternativeContact}
                      onChange={(value) => handleChange("alternativeContact", value)}
                      className="custom-phone-input"
                      placeholder="Enter phone number"
                      limitMaxLength={true}
                    />
                  </div>
                </div>
                
                {/* Expected Teachers */}
                <div>
                  <InputLabel htmlFor="expectedTeachers" icon={<Users className="w-4 h-4" />}>
                    Expected Number of Teachers Needed
                  </InputLabel>
                  <input
                    id="expectedTeachers"
                    type="number"
                    value={formData.expectedTeachers}
                    onChange={(e) => handleChange("expectedTeachers", e.target.value)}
                    className="mt-1 block w-full border-2 border-gray-200 rounded-xl p-3 transition-all duration-200 focus:border-[#0077BB] focus:ring-2 focus:ring-blue-100"
                    placeholder="e.g., 25"
                  />
                </div>
              </div>
            </div>
            
            {/* Facilities & Accreditations */}
            <div>
              <h2 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
                <Building className="w-5 h-5 text-[#0077BB]" />
                Facilities & Accreditations
              </h2>
              <div className="grid grid-cols-1 gap-6">
                <div>
                  <InputLabel icon={<Building className="w-4 h-4" />}>
                    Facilities Available
                  </InputLabel>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 mt-2 max-h-80 overflow-y-auto p-2 border-2 border-gray-200 rounded-xl">
                    {FACILITIES_CHECKLIST.map((facility) => (
                      <label key={facility} className="flex items-center gap-3 p-3 rounded-xl border-2 border-gray-200 hover:border-[#0077BB] transition-all duration-200 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={formData.facilities.includes(facility)}
                          onChange={() => toggleArrayValue("facilities", facility)}
                          className="w-5 h-5 text-[#0077BB] focus:ring-[#0077BB]"
                        />
                        <span className="text-sm font-medium">{facility}</span>
                      </label>
                    ))}
                  </div>
                  <div className="mt-4">
                    <label className="flex items-center gap-3 p-3 rounded-xl border-2 border-gray-200 hover:border-[#0077BB] transition-all duration-200 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={formData.facilities.includes("Other")}
                        onChange={() => toggleArrayValue("facilities", "Other")}
                        className="w-5 h-5 text-[#0077BB] focus:ring-[#0077BB]"
                      />
                      <span className="text-sm font-medium">Other Facilities</span>
                    </label>
                    {formData.facilities.includes("Other") && (
                      <textarea
                        value={formData.facilitiesOther}
                        onChange={(e) => handleChange("facilitiesOther", e.target.value)}
                        className="mt-2 block w-full border-2 border-gray-200 rounded-xl p-3 transition-all duration-200 focus:border-[#0077BB] focus:ring-2 focus:ring-blue-100"
                        rows="2"
                        placeholder="Please specify other facilities..."
                      />
                    )}
                  </div>
                </div>
                
                <div>
                  <InputLabel icon={<Building className="w-4 h-4" />}>
                    Accreditations & Affiliations
                  </InputLabel>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 mt-2 max-h-80 overflow-y-auto p-2 border-2 border-gray-200 rounded-xl">
                    {ACCREDITATIONS_CHECKLIST.map((accreditation) => (
                      <label key={accreditation} className="flex items-center gap-3 p-3 rounded-xl border-2 border-gray-200 hover:border-[#0077BB] transition-all duration-200 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={formData.accreditations.includes(accreditation)}
                          onChange={() => toggleArrayValue("accreditations", accreditation)}
                          className="w-5 h-5 text-[#0077BB] focus:ring-[#0077BB]"
                        />
                        <span className="text-sm font-medium">{accreditation}</span>
                      </label>
                    ))}
                  </div>
                  <div className="mt-4">
                    <label className="flex items-center gap-3 p-3 rounded-xl border-2 border-gray-200 hover:border-[#0077BB] transition-all duration-200 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={formData.accreditations.includes("Other")}
                        onChange={() => toggleArrayValue("accreditations", "Other")}
                        className="w-5 h-5 text-[#0077BB] focus:ring-[#0077BB]"
                      />
                      <span className="text-sm font-medium">Other Accreditations</span>
                    </label>
                    {formData.accreditations.includes("Other") && (
                      <textarea
                        value={formData.accreditationsOther}
                        onChange={(e) => handleChange("accreditationsOther", e.target.value)}
                        className="mt-2 block w-full border-2 border-gray-200 rounded-xl p-3 transition-all duration-200 focus:border-[#0077BB] focus:ring-2 focus:ring-blue-100"
                        rows="2"
                        placeholder="Please specify other accreditations..."
                      />
                    )}
                  </div>
                </div>
              </div>
            </div>
            
            {/* Additional Information */}
            <div>
              <h2 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
                <FileText className="w-5 h-5 text-[#0077BB]" />
                Additional Information
              </h2>
              <div className="grid grid-cols-1 gap-6">
                <div>
                  <InputLabel htmlFor="schoolDescription" icon={<Building className="w-4 h-4" />}>
                    School Description
                  </InputLabel>
                  <textarea
                    id="schoolDescription"
                    value={formData.schoolDescription}
                    onChange={(e) => handleChange("schoolDescription", e.target.value)}
                    className="mt-1 block w-full border-2 border-gray-200 rounded-xl p-3 transition-all duration-200 focus:border-[#0077BB] focus:ring-2 focus:ring-blue-100"
                    rows="4"
                    placeholder="Brief description of your school, mission, and values..."
                  />
                </div>
                
                <div>
                  <InputLabel htmlFor="otherPartnershipInstitutions" icon={<Users className="w-4 h-4" />}>
                    Other Partnership Institutions
                  </InputLabel>
                  <textarea
                    id="otherPartnershipInstitutions"
                    value={formData.otherPartnershipInstitutions}
                    onChange={(e) => handleChange("otherPartnershipInstitutions", e.target.value)}
                    className="mt-1 block w-full border-2 border-gray-200 rounded-xl p-3 transition-all duration-200 focus:border-[#0077BB] focus:ring-2 focus:ring-blue-100"
                    rows="3"
                    placeholder="List any other institutions you partner with..."
                  />
                </div>
                
                <div>
                  <InputLabel htmlFor="additionalInfo" icon={<FileText className="w-4 h-4" />}>
                    Additional Information
                  </InputLabel>
                  <textarea
                    id="additionalInfo"
                    value={formData.additionalInfo}
                    onChange={(e) => handleChange("additionalInfo", e.target.value)}
                    className="mt-1 block w-full border-2 border-gray-200 rounded-xl p-3 transition-all duration-200 focus:border-[#0077BB] focus:ring-2 focus:ring-blue-100"
                    rows="3"
                    placeholder="Any additional information about your school or requirements..."
                  />
                </div>
              </div>
            </div>
            
            {/* File Uploads */}
            <div>
              <h2 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
                <UploadCloud className="w-5 h-5 text-[#0077BB]" />
                Documents & Logo
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <InputLabel htmlFor="logo" icon={<UploadCloud className="w-4 h-4" />}>
                    School Logo
                  </InputLabel>
                  <div className="mt-2 flex items-center gap-3">
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => handleLogoChange(e.target.files[0])}
                        className="hidden"
                      />
                      <span className="px-4 py-3 bg-gradient-to-r from-[#0077BB] to-[#00AEEF] text-white rounded-xl text-sm font-medium hover:shadow-lg transition-all duration-200 flex items-center gap-2">
                        <UploadCloud className="w-4 h-4" />
                        Upload New Logo
                      </span>
                    </label>
                    {(logoPreview ) && (
                      <img
                        src={logoPreview}
                        alt="logo preview"
                        className="w-16 h-16 rounded-xl object-cover border-2 border-gray-200"
                      />
                    )}
                  </div>
                </div>
                
                <div>
                  <InputLabel icon={<FileText className="w-4 h-4" />}>
                    School Documents (CR, Profile, etc.)
                  </InputLabel>
                  <div className="mt-2">
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="file"
                        multiple
                        accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
                        onChange={(e) => handleDocumentsChange(e.target.files)}
                        className="hidden"
                      />
                      <span className="px-4 py-3 bg-gradient-to-r from-gray-600 to-gray-800 text-white rounded-xl text-sm font-medium hover:shadow-lg transition-all duration-200 flex items-center gap-2">
                        <UploadCloud className="w-4 h-4" />
                        Upload Documents
                      </span>
                    </label>
                    {schoolDocuments.length > 0 && (
                      <div className="mt-3 space-y-2">
                        {schoolDocuments.map((file, idx) => (
                          <div key={idx} className="flex items-center justify-between p-2 bg-gray-50 rounded-lg">
                            <span className="text-sm truncate">{file.name}</span>
                            <span className="text-xs text-gray-500">
                              {(file.size / 1024).toFixed(1)} KB
                            </span>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                  <p className="text-xs text-gray-500 mt-2">
                    Upload your school profile, commercial registration, or other official documents
                  </p>
                </div>
              </div>
            </div>
          </div>
          
          {/* Form Actions */}
          <div className="p-6 md:p-8 bg-gray-50 border-t border-gray-100 flex items-center justify-end gap-4">
            <button
              type="button"
              onClick={() => navigate('/school-profile')}
              className="px-6 py-3 rounded-xl border-2 border-gray-300 text-gray-700 font-medium hover:bg-gray-100 transition-all duration-200"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={updateLoading}
              className="px-8 py-3 rounded-xl font-semibold bg-gradient-to-r from-[#0077BB] to-[#00AEEF] text-white hover:shadow-lg hover:scale-105 transition-all duration-200 flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {updateLoading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Saving...
                </>
              ) : (
                <>
                  <Save className="w-4 h-4" />
                  Save Changes
                </>
              )}
            </button>
          </div>
        </form>
      </div>
      
      <style jsx="true">{`
        .phone-input-wrapper .custom-phone-input {
          width: 100%;
        }
        
        .phone-input-wrapper .PhoneInput {
          display: flex;
          align-items: center;
          gap: 8px;
          border: 2px solid #e5e7eb;
          border-radius: 12px;
          padding: 8px 12px;
          transition: all 0.2s ease;
          background-color: white;
        }
        
        .phone-input-wrapper .PhoneInput:focus-within {
          border-color: #0077BB;
          outline: none;
          box-shadow: 0 0 0 2px rgba(0, 119, 187, 0.1);
        }
        
        .phone-input-wrapper .PhoneInputCountry {
          margin-right: 4px;
        }
        
        .phone-input-wrapper .PhoneInputCountrySelect {
          padding: 4px;
          border-radius: 8px;
          border: 1px solid #e5e7eb;
          background: white;
        }
        
        .phone-input-wrapper .PhoneInputInput {
          border: none;
          outline: none;
          background: transparent;
          font-size: 16px;
          padding: 4px 0;
          flex: 1;
        }
        
        .phone-input-wrapper .PhoneInputInput:focus {
          outline: none;
          box-shadow: none;
        }
        
        .phone-input-wrapper .PhoneInputCountryIcon {
          width: 24px;
          height: 16px;
          border-radius: 4px;
          overflow: hidden;
        }
      `}</style>
    </div>
  );
}