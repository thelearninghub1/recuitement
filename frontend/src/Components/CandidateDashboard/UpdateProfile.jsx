import React, { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { 
  User, Mail, MapPin, Phone, Calendar, GraduationCap, 
  Briefcase, FileText, Shield, Languages, Activity, 
  CheckCircle, UploadCloud, X, Trash2, Plus, Save,
  Eye, EyeOff, Lock, Globe, AlertCircle, ArrowLeft,Camera
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-hot-toast";
import Select from "react-select";
import { Country, State, City } from "country-state-city";
import PhoneInput from 'react-phone-number-input';
import 'react-phone-number-input/style.css';

import { updateTeacherProfile, loadUser , clearErrors } from "../../actions/userActions";
import { UPDATE_USER_RESET } from "../../constants/userConstants";

// Import lists from TeacherRegister or define them
const degrees = [
  "Accounting & Finance",
  "Arabic & Quran",
  "Arts and Graphic Design",
  "Biology",
  "Business Administration",
  "Business Studies",
  "Chemistry",
  "Commerce",
  "Computer Science / ICT",
  "Economics",
  "Education",
  "English Language/Literature",
  "Engineering (BE/B.Sc)",
  "EYFS/Montessori Diploma/Childhood Diploma",
  "French",
  "Hindi",
  "History",
  "Human Resource",
  "Islamic Studies/Islamiyat",
  "Lab In charge",
  "Lab Assistant",
  "Library Information System",
  "Management",
  "Maths",
  "MBBS/BDS",
  "Nutrition",
  "Pakistan Studies",
  "Physics",
  "Physical Education (PE)",
  "Social Science",
  "Urdu",
  "Zoology",
  "Other",
];

const positions = [
  "Accounting & Finance",
  "Activity/Event Coordinator",
  "Arabic / Quran",
  "Art/Visual Arts",
  "Biology",
  "Business Studies",
  "Chemistry",
  "Computer Science / ICT",
  "Economics",
  "English / ESL",
  "French",
  "HR Executive",
  "HR Manager",
  "KG Head/KG",
  "Lab In charge",
  "Lab Assistant",
  "Librarian",
  "Management",
  "Maths",
  "Music",
  "Physics",
  "Physical Education (PE)",
  "Special Edu./Shadow Teacher",
  "Other",
];

const curricula = [
  "AdvancED (American Curriculum)",
  "A level",
  "CBSE (Indian Curriculum)",
  "FBISE (Pakistani Curriculum)",
  "IB",
  "O Level/IGCESE/EDEXCEL",
  "Preparatory (University)",
  "Saudi National Curriculum",
  "University (Masters/PhD)",
  "Other",
];

const languagesList = [
  "Arabic",
  "Bengali",
  "Chinese",
  "English",
  "French",
  "Hindi",
  "Indonesian",
  "Malayalam",
  "Spanish",
  "Turkish",
  "Urdu",
  "Other",
];

const skillsList = [
  "Communication",
  "Patience",
  "Leadership",
  "Critical thinking",
  "Classroom Management",
  "Technological skills",
  "Time management",
  "Problem Solving",
  "Creativity",
  "Adaptability",
  "Other"
];

const extracurricularList = [
  "Sports and Athletics",
  "Arts and Music",
  "Clubs and Societies",
  "Academic Competitions",
  "Leadership and Service",
  "Cultural and Language Activities",
  "Technology and STEM",
  "Outdoor and Adventure Activities",
  "Other"
];

const experienceYears = Array.from({ length: 41 }, (_, i) => i);
const today = new Date().toISOString().split('T')[0];
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
    '&:hover': {
      borderColor: '#0077BB',
    },
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

const UpdateProfile = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  
  const { loading, error, user, isAuthenticatedUser } = useSelector((state) => state.loginUser);
  const { loading: updateLoading, error: updateError, success } = useSelector((state) => state.updatePassword || { loading: false, error: null, success: false });

  const [formData, setFormData] = useState({
    // Personal
    firstName: "",
    middleName: "",
    lastName: "",
    gender: "",
    dob: "",
    mobile: "",
    whatsapp: "",
    nationality: "",
    maritalStatus: "",
    countryOfResidence: "",
    currentCity: "",
    currentCityOther: "",
    expectedSalary: "",
    // Academics & Experience
    degree: "",
    degreeOther: "",
    universityName: "",
    universityLocation: "",
    positionsInterested: [],
    positionsOther: "",
    currentInstitution: "",
    previousInstitution: "",
    totalExperience: "",
    curriculumTaught: [],
    curriculumOther: "",
    englishCert: "",
    englishCertOther: "",
    teachingLicense: "",
    teachingLicenseOther: "",
    teachingDiploma: "",
    teachingDiplomaOther: "",
    stemKnowledge: "",
    stemCertified: "",
    stemCertifiedOther: "",
    degreeAttested: "",
    otherCertificates: [],
    awards: "",
    // Residency & Skills
    iqama: "",
    iqamaOther: "",
    willingRelocateCity: "",
    skills: [],
    skillsOther: "",
    languages: [],
    languagesOther: "",
    extras: [],
    extrasOther: "",
    // Medical / Consent
    consentForwardCV: "",
    consentForwardCVOther: "",
    medicalAssistance: "",
    medicalAssistanceOther: "",
    availableFrom: "",
    otherNotes: "",
    // Files (will be handled separately)
    photo: null,
    photoPreview: null,
    cv: null,
    latestDegreeFiles: [],
    removePhoto: false,
    removeCv: false,
    removeDegreeFiles: []
  });

  const [cities, setCities] = useState([]);
  const [selectedCountryCode, setSelectedCountryCode] = useState("");
  const [otherCertificates, setOtherCertificates] = useState([]);
  const [newCertificate, setNewCertificate] = useState({ name: "", institution: "", year: "" });
  const [loadingData, setLoadingData] = useState(true);
  const fileInputRef = useRef(null);
  const cvInputRef = useRef(null);

  // Redirect if not authenticated or wrong role
  useEffect(() => {
    if (!loading && !isAuthenticatedUser) {
      toast.error('Please login to access this page');
      navigate('/teacher-login');
    }
    if (!loading && isAuthenticatedUser && user && user.role !== 'candidate') {
      toast.error('Access denied. Teacher account required.');
      navigate('/teacher-login');
    }
  }, [loading, isAuthenticatedUser, user, navigate]);

  // Load user data into form
  useEffect(() => {
    if (user && user.role === 'candidate') {
      loadUserData();
    }
  }, [user]);
const successHandled = useRef(false);

useEffect(() => {
  if (success && !successHandled.current) {
    successHandled.current = true;
    toast.success('Profile updated successfully!');
    dispatch(loadUser());
    // Reset immediately to prevent further toasts
    dispatch({ type: UPDATE_USER_RESET });
    // Navigate after a short delay to allow Redux state updates
      navigate('/teacher-profile');
  }
}, [success, dispatch, navigate]);
  // Handle errors
  useEffect(() => {
    if (updateError) {
      toast.error(updateError);
      dispatch(clearErrors());
    }
    if (error) {
      toast.error(error);
      dispatch(clearErrors());
    }
  }, [updateError, error, dispatch]);

  const loadUserData = () => {
    try {
      setLoadingData(true);
      
      // Parse candidate data
      const candidateData = user.candidateData || {};
      
      // Parse other certificates if they exist
      let certificates = [];
      if (candidateData.otherCertificates) {
        if (typeof candidateData.otherCertificates === 'string') {
          try {
            certificates = JSON.parse(candidateData.otherCertificates);
          } catch (e) {
            certificates = [];
          }
        } else if (Array.isArray(candidateData.otherCertificates)) {
          certificates = candidateData.otherCertificates;
        }
      }
      setOtherCertificates(certificates);
      
      // Load country and cities for current residence
      if (candidateData.countryOfResidence) {
        const country = countryOptions.find(c => c.label === candidateData.countryOfResidence);
        if (country) {
          setSelectedCountryCode(country.value);
          const countryCities = City.getCitiesOfCountry(country.value);
          setCities(countryCities || []);
        }
      }
      
      setFormData({
        firstName: user.profile?.firstName || "",
        middleName: user.profile?.middleName || "",
        lastName: user.profile?.lastName || "",
        gender: candidateData.gender || "",
        dob: candidateData.dob ? candidateData.dob.split('T')[0] : "",
        mobile: user.profile?.mobile || "",
        whatsapp: candidateData.whatsapp || "",
        nationality: candidateData.nationality || "",
        maritalStatus: candidateData.maritalStatus || "",
        countryOfResidence: candidateData.countryOfResidence || "",
        currentCity: candidateData.currentCity || "",
        currentCityOther: candidateData.currentCityOther || "",
        expectedSalary: candidateData.expectedSalary || "",
        degree: candidateData.degree || "",
        degreeOther: candidateData.degreeOther || "",
        universityName: candidateData.universityName || "",
        universityLocation: candidateData.universityLocation || "",
        positionsInterested: Array.isArray(candidateData.positionsInterested) ? candidateData.positionsInterested : [],
        positionsOther: candidateData.positionsOther || "",
        currentInstitution: candidateData.currentInstitution || "",
        previousInstitution: candidateData.previousInstitution || "",
        totalExperience: candidateData.totalExperience?.toString() || "",
        curriculumTaught: Array.isArray(candidateData.curriculumTaught) ? candidateData.curriculumTaught : [],
        curriculumOther: candidateData.curriculumOther || "",
        englishCert: candidateData.englishCert || "",
        englishCertOther: candidateData.englishCertOther || "",
        teachingLicense: candidateData.teachingLicense || "",
        teachingLicenseOther: candidateData.teachingLicenseOther || "",
        teachingDiploma: candidateData.teachingDiploma || "",
        teachingDiplomaOther: candidateData.teachingDiplomaOther || "",
        stemKnowledge: candidateData.stemKnowledge || "",
        stemCertified: candidateData.stemCertified || "",
        stemCertifiedOther: candidateData.stemCertifiedOther || "",
        degreeAttested: candidateData.degreeAttested || "",
        awards: candidateData.awards || "",
        iqama: candidateData.iqama || "",
        iqamaOther: candidateData.iqamaOther || "",
        willingRelocateCity: candidateData.willingRelocateCity || "",
        skills: Array.isArray(candidateData.skills) ? candidateData.skills : [],
        skillsOther: candidateData.skillsOther || "",
        languages: Array.isArray(candidateData.languages) ? candidateData.languages : [],
        languagesOther: candidateData.languagesOther || "",
        extras: Array.isArray(candidateData.extras) ? candidateData.extras : [],
        extrasOther: candidateData.extrasOther || "",
        consentForwardCV: candidateData.consentForwardCV || "",
        medicalAssistance: candidateData.medicalAssistance || "",
        medicalAssistanceOther: candidateData.medicalAssistanceOther || "",
        availableFrom: candidateData.availableFrom ? candidateData.availableFrom.split('T')[0] : "",
        otherNotes: candidateData.otherNotes || "",
        // File states
        photo: null,
        photoPreview: null,
        cv: null,
        latestDegreeFiles: [],
        removePhoto: false,
        removeCv: false,
        removeDegreeFiles: []
      });
    } catch (err) {
      console.error('Error loading user data:', err);
      toast.error('Error loading profile data');
    } finally {
      setLoadingData(false);
    }
  };

  const handleChange = (key, val) => {
    setFormData(prev => ({ ...prev, [key]: val }));
  };

  const toggleArrayValue = (key, value, maxLimit = null) => {
    setFormData(prev => {
      const arr = prev[key] || [];
      
      if (maxLimit && arr.length >= maxLimit && !arr.includes(value)) {
        toast.error(`You can select up to ${maxLimit} items only`);
        return prev;
      }
      
      if (arr.includes(value)) {
        return { ...prev, [key]: arr.filter(a => a !== value) };
      } else {
        return { ...prev, [key]: [...arr, value] };
      }
    });
  };

  const handleFileUpload = (key, file) => {
    if (!file) return;
    
    if (key === "photo") {
      const previewUrl = URL.createObjectURL(file);
      setFormData(prev => ({ 
        ...prev, 
        photo: file,
        photoPreview: previewUrl,
        removePhoto: false
      }));
    } else if (key === "cv") {
      setFormData(prev => ({ 
        ...prev, 
        cv: file,
        removeCv: false
      }));
    }
  };

  const handleMultiFiles = (files) => {
    const arr = Array.from(files);
    setFormData(prev => ({ 
      ...prev, 
      latestDegreeFiles: [...prev.latestDegreeFiles, ...arr] 
    }));
  };

  const removeFile = (key, index = null) => {
    if (key === "photo") {
      if (formData.photoPreview) {
        URL.revokeObjectURL(formData.photoPreview);
      }
      setFormData(prev => ({ 
        ...prev, 
        photo: null,
        photoPreview: null,
        removePhoto: true
      }));
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    } else if (key === "cv") {
      setFormData(prev => ({ 
        ...prev, 
        cv: null,
        removeCv: true
      }));
      if (cvInputRef.current) {
        cvInputRef.current.value = "";
      }
    } else if (key === "degreeFile" && index !== null) {
      const fileToRemove = formData.latestDegreeFiles[index];
      setFormData(prev => ({
        ...prev,
        latestDegreeFiles: prev.latestDegreeFiles.filter((_, i) => i !== index),
        removeDegreeFiles: [...prev.removeDegreeFiles, fileToRemove?.name]
      }));
    }
  };

  const addCertificate = () => {
    if (!newCertificate.name || !newCertificate.institution || !newCertificate.year) {
      toast.error("Please fill all certificate fields");
      return;
    }
    
    setOtherCertificates([...otherCertificates, newCertificate]);
    setNewCertificate({ name: "", institution: "", year: "" });
  };

  const removeCertificate = (index) => {
    setOtherCertificates(otherCertificates.filter((_, i) => i !== index));
  };

  const getCitiesForCountry = (countryCode) => {
    setSelectedCountryCode(countryCode);
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const updateData = new FormData();
    
    // Basic profile info
    updateData.append('firstName', formData.firstName);
    if (formData.middleName) updateData.append('middleName', formData.middleName);
    updateData.append('lastName', formData.lastName);
    updateData.append('mobile', formData.mobile);
    
    // Candidate data
    updateData.append('gender', formData.gender);
    if (formData.dob) updateData.append('dob', formData.dob);
    if (formData.whatsapp) updateData.append('whatsapp', formData.whatsapp);
    updateData.append('nationality', formData.nationality);
    if (formData.maritalStatus) updateData.append('maritalStatus', formData.maritalStatus);
    if (formData.countryOfResidence) updateData.append('countryOfResidence', formData.countryOfResidence);
    if (formData.currentCity) updateData.append('currentCity', formData.currentCity);
    if (formData.currentCityOther) updateData.append('currentCityOther', formData.currentCityOther);
    if (formData.expectedSalary) updateData.append('expectedSalary', formData.expectedSalary);
    
    // Positions
    formData.positionsInterested.forEach(position => {
      updateData.append('positionsInterested', position);
    });
    if (formData.positionsOther) updateData.append('positionsOther', formData.positionsOther);
    
    // Curriculum
    formData.curriculumTaught.forEach(curriculum => {
      updateData.append('curriculumTaught', curriculum);
    });
    if (formData.curriculumOther) updateData.append('curriculumOther', formData.curriculumOther);
    
    // Skills
    formData.skills.forEach(skill => {
      updateData.append('skills', skill);
    });
    if (formData.skillsOther) updateData.append('skillsOther', formData.skillsOther);
    
    // Languages
    formData.languages.forEach(language => {
      updateData.append('languages', language);
    });
    if (formData.languagesOther) updateData.append('languagesOther', formData.languagesOther);
    
    // Extras
    formData.extras.forEach(extra => {
      updateData.append('extras', extra);
    });
    if (formData.extrasOther) updateData.append('extrasOther', formData.extrasOther);
    
    // Education fields
    updateData.append('degree', formData.degree);
    if (formData.degreeOther) updateData.append('degreeOther', formData.degreeOther);
    if (formData.universityName) updateData.append('universityName', formData.universityName);
    if (formData.universityLocation) updateData.append('universityLocation', formData.universityLocation);
    if (formData.currentInstitution) updateData.append('currentInstitution', formData.currentInstitution);
    if (formData.previousInstitution) updateData.append('previousInstitution', formData.previousInstitution);
    if (formData.totalExperience) updateData.append('totalExperience', formData.totalExperience);
    
    // Certifications
    updateData.append('englishCert', formData.englishCert || 'No');
    if (formData.englishCertOther) updateData.append('englishCertOther', formData.englishCertOther);
    updateData.append('teachingLicense', formData.teachingLicense || 'No');
    if (formData.teachingLicenseOther) updateData.append('teachingLicenseOther', formData.teachingLicenseOther);
    updateData.append('teachingDiploma', formData.teachingDiploma || 'No');
    if (formData.teachingDiplomaOther) updateData.append('teachingDiplomaOther', formData.teachingDiplomaOther);
    updateData.append('stemKnowledge', formData.stemKnowledge || 'No');
    updateData.append('stemCertified', formData.stemCertified || 'No');
    if (formData.stemCertifiedOther) updateData.append('stemCertifiedOther', formData.stemCertifiedOther);
    if (formData.degreeAttested) updateData.append('degreeAttested', formData.degreeAttested);
    
    // Certificates
    if (otherCertificates.length > 0) {
      updateData.append('otherCertificates', JSON.stringify(otherCertificates));
    }
    
    if (formData.awards) updateData.append('awards', formData.awards);
    
    // Residency
    updateData.append('iqama', formData.iqama || 'No');
    if (formData.iqamaOther) updateData.append('iqamaOther', formData.iqamaOther);
    if (formData.willingRelocateCity) updateData.append('willingRelocateCity', formData.willingRelocateCity);
    
    // Consent
    updateData.append('consentForwardCV', formData.consentForwardCV || 'No');
    if (formData.consentForwardCVOther) updateData.append('consentForwardCVOther', formData.consentForwardCVOther);
    updateData.append('medicalAssistance', formData.medicalAssistance || 'No');
    if (formData.medicalAssistanceOther) updateData.append('medicalAssistanceOther', formData.medicalAssistanceOther);
    if (formData.availableFrom) updateData.append('availableFrom', formData.availableFrom);
    if (formData.otherNotes) updateData.append('otherNotes', formData.otherNotes);
    
    // File flags for removal
    if (formData.removePhoto) updateData.append('removePhoto', 'true');
    if (formData.removeCv) updateData.append('removeCv', 'true');
    if (formData.removeDegreeFiles.length > 0) {
      updateData.append('removeDegreeFiles', JSON.stringify(formData.removeDegreeFiles));
    }
    
    // New files
    if (formData.photo) {
      updateData.append('photo', formData.photo);
    }
    if (formData.cv) {
      updateData.append('cv', formData.cv);
    }
    if (formData.latestDegreeFiles.length > 0) {
      formData.latestDegreeFiles.forEach(file => {
        updateData.append('latestDegreeFiles', file);
      });
    }
    
    console.log('📤 Updating profile with data:');
    for (let [key, value] of updateData.entries()) {
      console.log(`${key}:`, value);
    }
    
    dispatch(updateTeacherProfile(updateData));
  };

  const InputLabel = ({ htmlFor, children, required, icon }) => (
    <label htmlFor={htmlFor} className="block text-sm font-medium text-gray-700 mb-2">
      <div className="flex items-center gap-2">
        {icon}
        <span>{children}</span>
        {required ? <span className="text-red-500">*</span> : null}
      </div>
    </label>
  );

  const SectionHeader = ({ icon, title, description }) => (
    <div className="flex items-center gap-3 mb-6 pb-4 border-b border-gray-200">
      <div className="p-3 bg-gradient-to-r from-[#0077BB] to-[#00AEEF] rounded-xl">
        {icon}
      </div>
      <div>
        <h2 className="text-xl font-bold text-gray-800">{title}</h2>
        <p className="text-sm text-gray-500">{description}</p>
      </div>
    </div>
  );

  if (loadingData || loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-[#0077BB] border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading profile data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 py-16 mt-26 px-4 md:px-8 font-[Parkinsans]">
      <div className="max-w-4xl mx-auto">
        {/* Header with Back Button */}
        <div className="mb-6 flex items-center gap-4">
          <button
            onClick={() => navigate('/teacher-profile')}
            className="flex items-center gap-2 px-4 py-2 bg-white rounded-xl text-gray-700 hover:bg-gray-50 transition-all duration-200 shadow-sm border border-gray-200"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Profile
          </button>
        </div>

        <div className="bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-100">
          <div className="p-6 md:p-8 border-b border-gray-100 bg-gradient-to-r from-[#0077BB]/5 to-[#00AEEF]/5">
            <div>
              <h1 className="text-2xl md:text-3xl font-bold text-gray-800">
                Update Profile
              </h1>
              <p className="text-sm text-gray-500 mt-1">
                Edit your personal and professional information
              </p>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="p-6 md:p-8">
            {/* Personal Information Section */}
            <SectionHeader 
              icon={<User className="w-5 h-5 text-white" />}
              title="Personal Information"
              description="Update your basic personal details"
            />
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* First Name */}
              <div>
                <InputLabel htmlFor="firstName" required icon={<User className="w-4 h-4" />}>
                  First Name
                </InputLabel>
                <input
                  id="firstName"
                  value={formData.firstName}
                  onChange={(e) => handleChange("firstName", e.target.value)}
                  className="w-full border-2 border-gray-200 rounded-xl p-3 transition-all duration-200 focus:border-[#0077BB] focus:ring-2 focus:ring-blue-100"
                  placeholder="First name"
                />
              </div>

              {/* Middle Name */}
              <div>
                <InputLabel htmlFor="middleName" icon={<User className="w-4 h-4" />}>
                  Middle Name
                </InputLabel>
                <input
                  id="middleName"
                  value={formData.middleName}
                  onChange={(e) => handleChange("middleName", e.target.value)}
                  className="w-full border-2 border-gray-200 rounded-xl p-3 transition-all duration-200 focus:border-[#0077BB] focus:ring-2 focus:ring-blue-100"
                  placeholder="Middle name (optional)"
                />
              </div>

              {/* Last Name */}
              <div>
                <InputLabel htmlFor="lastName" required icon={<User className="w-4 h-4" />}>
                  Last Name
                </InputLabel>
                <input
                  id="lastName"
                  value={formData.lastName}
                  onChange={(e) => handleChange("lastName", e.target.value)}
                  className="w-full border-2 border-gray-200 rounded-xl p-3 transition-all duration-200 focus:border-[#0077BB] focus:ring-2 focus:ring-blue-100"
                  placeholder="Last name"
                />
              </div>

              {/* Gender */}
              <div>
                <InputLabel htmlFor="gender" required icon={<User className="w-4 h-4" />}>
                  Gender
                </InputLabel>
                <select
                  id="gender"
                  value={formData.gender}
                  onChange={(e) => handleChange("gender", e.target.value)}
                  className="w-full border-2 border-gray-200 rounded-xl p-3 transition-all duration-200 focus:border-[#0077BB] focus:ring-2 focus:ring-blue-100"
                >
                  <option value="">Select</option>
                  <option>Male</option>
                  <option>Female</option>
                  <option>Other</option>
                </select>
              </div>

              {/* Date of Birth */}
              <div>
                <InputLabel htmlFor="dob" required icon={<Calendar className="w-4 h-4" />}>
                  Date of Birth
                </InputLabel>
                <input
                  id="dob"
                  type="date"
                  value={formData.dob}
                  max={today}
                  onChange={(e) => handleChange("dob", e.target.value)}
                  className="w-full border-2 border-gray-200 rounded-xl p-3 transition-all duration-200 focus:border-[#0077BB] focus:ring-2 focus:ring-blue-100"
                />
              </div>

              {/* Mobile */}
              <div>
                <InputLabel htmlFor="mobile" required icon={<Phone className="w-4 h-4" />}>
                  Mobile Number
                </InputLabel>
                <div className="phone-input-wrapper">
                  <PhoneInput
                    international
                    defaultCountry="SA"
                    value={formData.mobile}
                    onChange={(value) => handleChange("mobile", value)}
                    className="custom-phone-input"
                    placeholder="Enter phone number"
                  />
                </div>
              </div>

              {/* WhatsApp */}
              <div>
                <InputLabel htmlFor="whatsapp" icon={<Phone className="w-4 h-4" />}>
                  WhatsApp Number
                </InputLabel>
                <div className="phone-input-wrapper">
                  <PhoneInput
                    international
                    defaultCountry="SA"
                    value={formData.whatsapp}
                    onChange={(value) => handleChange("whatsapp", value)}
                    className="custom-phone-input"
                    placeholder="Enter WhatsApp number"
                  />
                </div>
              </div>

              {/* Nationality */}
              <div>
                <InputLabel htmlFor="nationality" required icon={<Globe className="w-4 h-4" />}>
                  Nationality
                </InputLabel>
                <Select
                  options={countryOptions}
                  value={countryOptions.find(country => country.label === formData.nationality)}
                  onChange={(selected) => handleChange("nationality", selected?.label || "")}
                  styles={customSelectStyles}
                  placeholder="Select your nationality"
                  isSearchable
                />
              </div>

              {/* Marital Status */}
              <div>
                <InputLabel htmlFor="maritalStatus" icon={<User className="w-4 h-4" />}>
                  Marital Status
                </InputLabel>
                <select
                  id="maritalStatus"
                  value={formData.maritalStatus}
                  onChange={(e) => handleChange("maritalStatus", e.target.value)}
                  className="w-full border-2 border-gray-200 rounded-xl p-3 transition-all duration-200 focus:border-[#0077BB] focus:ring-2 focus:ring-blue-100"
                >
                  <option value="">Choose</option>
                  <option>Single</option>
                  <option>Married</option>
                  <option>Other</option>
                </select>
              </div>

              {/* Country of Residence */}
              <div>
                <InputLabel htmlFor="countryOfResidence" icon={<MapPin className="w-4 h-4" />}>
                  Country of Residence
                </InputLabel>
                <Select
                  options={countryOptions}
                  value={countryOptions.find(country => country.label === formData.countryOfResidence)}
                  onChange={(selected) => {
                    handleChange("countryOfResidence", selected?.label || "");
                    getCitiesForCountry(selected?.value);
                  }}
                  styles={customSelectStyles}
                  placeholder="Select country of residence"
                  isSearchable
                />
              </div>

              {/* Current City */}
              <div>
                <InputLabel htmlFor="currentCity" icon={<MapPin className="w-4 h-4" />}>
                  Current City
                </InputLabel>
                <select
                  value={formData.currentCity}
                  onChange={(e) => handleChange("currentCity", e.target.value)}
                  className="w-full border-2 border-gray-200 rounded-xl p-3 transition-all duration-200 focus:border-[#0077BB] focus:ring-2 focus:ring-blue-100"
                  disabled={!formData.countryOfResidence}
                >
                  <option value="">Select city</option>
                  {cities.map((city) => (
                    <option key={city.name} value={city.name}>
                      {city.name}
                    </option>
                  ))}
                  <option value="Other">Other</option>
                </select>
                {formData.currentCity === "Other" && (
                  <input
                    className="mt-2 w-full border-2 border-gray-200 rounded-xl p-3 transition-all duration-200 focus:border-[#0077BB] focus:ring-2 focus:ring-blue-100"
                    placeholder="Please specify your city"
                    value={formData.currentCityOther}
                    onChange={(e) => handleChange("currentCityOther", e.target.value)}
                  />
                )}
              </div>

              {/* Expected Salary */}
              <div>
                <InputLabel htmlFor="expectedSalary" icon={<Briefcase className="w-4 h-4" />}>
                  Expected Salary (SAR)
                </InputLabel>
                <input
                  id="expectedSalary"
                  value={formData.expectedSalary}
                  onChange={(e) => handleChange("expectedSalary", e.target.value)}
                  type="number"
                  className="w-full border-2 border-gray-200 rounded-xl p-3 transition-all duration-200 focus:border-[#0077BB] focus:ring-2 focus:ring-blue-100"
                  placeholder="Enter expected salary"
                />
              </div>
            </div>

            {/* Education & Qualifications Section */}
            <SectionHeader 
              icon={<GraduationCap className="w-5 h-5 text-white" />}
              title="Education & Qualifications"
              description="Update your academic background"
            />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Degree */}
              <div>
                <InputLabel htmlFor="degree" required icon={<GraduationCap className="w-4 h-4" />}>
                  Bachelor's/Master's Degree in
                </InputLabel>
                <select
                  id="degree"
                  value={formData.degree}
                  onChange={(e) => handleChange("degree", e.target.value)}
                  className="w-full border-2 border-gray-200 rounded-xl p-3 transition-all duration-200 focus:border-[#0077BB] focus:ring-2 focus:ring-blue-100"
                >
                  <option value="">Select degree</option>
                  {degrees.map((d) => (
                    <option key={d} value={d}>{d}</option>
                  ))}
                </select>
                {formData.degree === "Other" && (
                  <input
                    className="mt-2 w-full border-2 border-gray-200 rounded-xl p-3"
                    placeholder="Please mention degree name"
                    value={formData.degreeOther}
                    onChange={(e) => handleChange("degreeOther", e.target.value)}
                  />
                )}
              </div>

              {/* University Name */}
              <div>
                <InputLabel htmlFor="universityName" required icon={<GraduationCap className="w-4 h-4" />}>
                  University/College Name
                </InputLabel>
                <input
                  id="universityName"
                  value={formData.universityName}
                  onChange={(e) => handleChange("universityName", e.target.value)}
                  className="w-full border-2 border-gray-200 rounded-xl p-3"
                  placeholder="Full name in English"
                />
              </div>

              {/* University Location */}
              <div>
                <InputLabel htmlFor="universityLocation" icon={<MapPin className="w-4 h-4" />}>
                  University Location
                </InputLabel>
                <input
                  id="universityLocation"
                  value={formData.universityLocation}
                  onChange={(e) => handleChange("universityLocation", e.target.value)}
                  className="w-full border-2 border-gray-200 rounded-xl p-3"
                  placeholder="Country, City"
                />
              </div>

              {/* Total Experience */}
              <div>
                <InputLabel htmlFor="totalExperience" icon={<Briefcase className="w-4 h-4" />}>
                  Total Experience (years)
                </InputLabel>
                <select
                  id="totalExperience"
                  value={formData.totalExperience}
                  onChange={(e) => handleChange("totalExperience", e.target.value)}
                  className="w-full border-2 border-gray-200 rounded-xl p-3"
                >
                  <option value="">Select years</option>
                  {experienceYears.map(year => (
                    <option key={year} value={year}>
                      {year} {year === 1 ? 'year' : 'years'}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Positions Interested */}
            <div className="mt-6">
              <InputLabel icon={<Briefcase className="w-4 h-4" />}>
                Which position(s) are you interested in? (select up to 3)
              </InputLabel>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3 mt-2">
                {positions.map((p) => (
                  <label key={p} className="flex items-center gap-3 p-3 rounded-xl border-2 border-gray-200 hover:border-[#0077BB] transition-all duration-200 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formData.positionsInterested.includes(p)}
                      onChange={() => toggleArrayValue("positionsInterested", p, 3)}
                      className="w-5 h-5 text-[#0077BB]"
                      disabled={formData.positionsInterested.length >= 3 && !formData.positionsInterested.includes(p)}
                    />
                    <span className="text-sm font-medium">{p}</span>
                  </label>
                ))}
              </div>
              {formData.positionsInterested.includes("Other") && (
                <div className="mt-3">
                  <input
                    className="w-full border-2 border-gray-200 rounded-xl p-3"
                    placeholder="Please specify the position"
                    value={formData.positionsOther}
                    onChange={(e) => handleChange("positionsOther", e.target.value)}
                  />
                </div>
              )}
            </div>

            {/* Current & Previous Institutions */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
              <div>
                <InputLabel htmlFor="currentInstitution" icon={<Briefcase className="w-4 h-4" />}>
                  Current Institution
                </InputLabel>
                <input
                  id="currentInstitution"
                  value={formData.currentInstitution}
                  onChange={(e) => handleChange("currentInstitution", e.target.value)}
                  className="w-full border-2 border-gray-200 rounded-xl p-3"
                  placeholder="Current working institution"
                />
              </div>
              <div>
                <InputLabel htmlFor="previousInstitution" icon={<Briefcase className="w-4 h-4" />}>
                  Previous Institution
                </InputLabel>
                <input
                  id="previousInstitution"
                  value={formData.previousInstitution}
                  onChange={(e) => handleChange("previousInstitution", e.target.value)}
                  className="w-full border-2 border-gray-200 rounded-xl p-3"
                  placeholder="Previous institution"
                />
              </div>
            </div>

            {/* Curriculum Taught */}
            <div className="mt-6">
              <InputLabel icon={<GraduationCap className="w-4 h-4" />}>
                Curriculum Teaching/Taught (select up to 3)
              </InputLabel>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3 mt-2">
                {curricula.map((c) => (
                  <label key={c} className="flex items-center gap-3 p-3 rounded-xl border-2 border-gray-200 hover:border-[#0077BB] transition-all duration-200 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formData.curriculumTaught.includes(c)}
                      onChange={() => toggleArrayValue("curriculumTaught", c, 3)}
                      className="w-5 h-5 text-[#0077BB]"
                      disabled={formData.curriculumTaught.length >= 3 && !formData.curriculumTaught.includes(c)}
                    />
                    <span className="text-sm font-medium">{c}</span>
                  </label>
                ))}
              </div>
              {formData.curriculumTaught.includes("Other") && (
                <div className="mt-3">
                  <input
                    className="w-full border-2 border-gray-200 rounded-xl p-3"
                    placeholder="Please specify the curriculum"
                    value={formData.curriculumOther}
                    onChange={(e) => handleChange("curriculumOther", e.target.value)}
                  />
                </div>
              )}
            </div>

            {/* Certifications Section */}
            <SectionHeader 
              icon={<FileText className="w-5 h-5 text-white" />}
              title="Certifications"
              description="Update your professional certifications"
            />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* English Certificate */}
              <div>
                <InputLabel icon={<FileText className="w-4 h-4" />}>
                  English Certificate (IELTS/TOEFL)
                </InputLabel>
                <select
                  value={formData.englishCert}
                  onChange={(e) => handleChange("englishCert", e.target.value)}
                  className="w-full border-2 border-gray-200 rounded-xl p-3"
                >
                  <option value="">Choose</option>
                  <option>IELTS</option>
                  <option>TOEFL</option>
                  <option>In the Process</option>
                  <option>No</option>
                  <option>Other</option>
                </select>
                {formData.englishCert === "Other" && (
                  <input
                    className="mt-2 w-full border-2 border-gray-200 rounded-xl p-3"
                    placeholder="Write details or IELTS band here"
                    value={formData.englishCertOther}
                    onChange={(e) => handleChange("englishCertOther", e.target.value)}
                  />
                )}
              </div>

              {/* Teaching License */}
              <div>
                <InputLabel icon={<FileText className="w-4 h-4" />}>
                  Teaching License
                </InputLabel>
                <select
                  value={formData.teachingLicense}
                  onChange={(e) => handleChange("teachingLicense", e.target.value)}
                  className="w-full border-2 border-gray-200 rounded-xl p-3"
                >
                  <option value="">Choose</option>
                  <option>CELTA</option>
                  <option>TESOL</option>
                  <option>TEFL</option>
                  <option>No</option>
                  <option>Other</option>
                </select>
                {formData.teachingLicense === "Other" && (
                  <input
                    className="mt-2 w-full border-2 border-gray-200 rounded-xl p-3"
                    placeholder="Specify"
                    value={formData.teachingLicenseOther}
                    onChange={(e) => handleChange("teachingLicenseOther", e.target.value)}
                  />
                )}
              </div>

              {/* Teaching Diploma */}
              <div>
                <InputLabel icon={<FileText className="w-4 h-4" />}>
                  Teaching Diploma
                </InputLabel>
                <select
                  value={formData.teachingDiploma}
                  onChange={(e) => handleChange("teachingDiploma", e.target.value)}
                  className="w-full border-2 border-gray-200 rounded-xl p-3"
                >
                  <option value="">Choose</option>
                  <option>QTS</option>
                  <option>PGCE</option>
                  <option>No</option>
                  <option>Under Process</option>
                  <option>Other</option>
                </select>
                {formData.teachingDiploma === "Other" && (
                  <input
                    className="mt-2 w-full border-2 border-gray-200 rounded-xl p-3"
                    placeholder="Specify"
                    value={formData.teachingDiplomaOther}
                    onChange={(e) => handleChange("teachingDiplomaOther", e.target.value)}
                  />
                )}
              </div>

              {/* STEM Knowledge */}
              <div>
                <InputLabel icon={<Activity className="w-4 h-4" />}>
                  STEM Knowledge
                </InputLabel>
                <select
                  value={formData.stemKnowledge}
                  onChange={(e) => handleChange("stemKnowledge", e.target.value)}
                  className="w-full border-2 border-gray-200 rounded-xl p-3"
                >
                  <option value="">Choose</option>
                  <option>Yes</option>
                  <option>No</option>
                  <option>Maybe</option>
                </select>
              </div>
            </div>

            {/* Other Certificates */}
            <div className="mt-6">
              <InputLabel icon={<FileText className="w-4 h-4" />}>
                Other Diplomas/Courses/Certificates
              </InputLabel>
              
              <div className="grid grid-cols-1 md:grid-cols-12 gap-3 mt-2 bg-blue-50 p-4 rounded-xl border border-blue-200">
                <div className="md:col-span-5">
                  <input
                    type="text"
                    placeholder="Course/Certificate Name *"
                    value={newCertificate.name}
                    onChange={(e) => setNewCertificate({...newCertificate, name: e.target.value})}
                    className="w-full border-2 border-gray-200 rounded-xl p-3 text-sm"
                  />
                </div>
                <div className="md:col-span-4">
                  <input
                    type="text"
                    placeholder="Institution *"
                    value={newCertificate.institution}
                    onChange={(e) => setNewCertificate({...newCertificate, institution: e.target.value})}
                    className="w-full border-2 border-gray-200 rounded-xl p-3 text-sm"
                  />
                </div>
                <div className="md:col-span-2">
                  <input
                    type="text"
                    placeholder="Completion Year *"
                    value={newCertificate.year}
                    onChange={(e) => setNewCertificate({...newCertificate, year: e.target.value})}
                    className="w-full border-2 border-gray-200 rounded-xl p-3 text-sm"
                  />
                </div>
                <div className="md:col-span-1">
                  <button
                    type="button"
                    onClick={addCertificate}
                    className="w-full h-full min-h-[48px] bg-gradient-to-r from-[#0077BB] to-[#00AEEF] text-white rounded-xl hover:shadow-lg transition-all duration-200 flex items-center justify-center"
                  >
                    <Plus className="w-5 h-5" />
                  </button>
                </div>
              </div>

              {otherCertificates.length > 0 && (
                <div className="mt-4 space-y-2">
                  {otherCertificates.map((cert, index) => (
                    <div key={index} className="grid grid-cols-12 gap-3 items-center bg-green-50 p-3 rounded-xl border border-green-200">
                      <div className="md:col-span-5 font-medium text-sm text-gray-800">
                        • {cert.name}
                      </div>
                      <div className="md:col-span-4 text-sm text-gray-600">
                        {cert.institution}
                      </div>
                      <div className="md:col-span-2 text-sm text-gray-600">
                        {cert.year}
                      </div>
                      <div className="md:col-span-1 text-right">
                        <button
                          type="button"
                          onClick={() => removeCertificate(index)}
                          className="p-1 bg-red-100 text-red-600 rounded-lg hover:bg-red-200 transition-colors"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Skills Section */}
            <SectionHeader 
              icon={<Activity className="w-5 h-5 text-white" />}
              title="Skills & Languages"
              description="Update your professional competencies"
            />

            {/* Skills */}
            <div>
              <InputLabel icon={<Activity className="w-4 h-4" />}>
                Skills (choose what you are confident in)
              </InputLabel>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 mt-2">
                {skillsList.map((skill) => (
                  <label key={skill} className="flex items-center gap-3 p-3 rounded-xl border-2 border-gray-200 hover:border-[#0077BB] transition-all duration-200 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formData.skills.includes(skill)}
                      onChange={() => toggleArrayValue("skills", skill)}
                      className="w-5 h-5 text-[#0077BB]"
                    />
                    <span className="text-sm font-medium">{skill}</span>
                  </label>
                ))}
              </div>
              {formData.skills.includes("Other") && (
                <div className="mt-3">
                  <input
                    className="w-full border-2 border-gray-200 rounded-xl p-3"
                    placeholder="Please specify your skills"
                    value={formData.skillsOther}
                    onChange={(e) => handleChange("skillsOther", e.target.value)}
                  />
                </div>
              )}
            </div>

            {/* Languages */}
            <div className="mt-6">
              <InputLabel icon={<Languages className="w-4 h-4" />}>
                Language Skills
              </InputLabel>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 mt-2">
                {languagesList.map((language) => (
                  <label key={language} className="flex items-center gap-3 p-3 rounded-xl border-2 border-gray-200 hover:border-[#0077BB] transition-all duration-200 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formData.languages.includes(language)}
                      onChange={() => toggleArrayValue("languages", language)}
                      className="w-5 h-5 text-[#0077BB]"
                    />
                    <span className="text-sm font-medium">{language}</span>
                  </label>
                ))}
              </div>
              {formData.languages.includes("Other") && (
                <div className="mt-3">
                  <input
                    className="w-full border-2 border-gray-200 rounded-xl p-3"
                    placeholder="Please specify other languages"
                    value={formData.languagesOther}
                    onChange={(e) => handleChange("languagesOther", e.target.value)}
                  />
                </div>
              )}
            </div>

            {/* Extracurricular */}
            <div className="mt-6">
              <InputLabel icon={<Activity className="w-4 h-4" />}>
                Extra Curricular Activities
              </InputLabel>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3 mt-2">
                {extracurricularList.map((activity) => (
                  <label key={activity} className="flex items-center gap-3 p-3 rounded-xl border-2 border-gray-200 hover:border-[#0077BB] transition-all duration-200 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formData.extras.includes(activity)}
                      onChange={() => toggleArrayValue("extras", activity)}
                      className="w-5 h-5 text-[#0077BB]"
                    />
                    <span className="text-sm font-medium">{activity}</span>
                  </label>
                ))}
              </div>
              {formData.extras.includes("Other") && (
                <div className="mt-3">
                  <input
                    className="w-full border-2 border-gray-200 rounded-xl p-3"
                    placeholder="Please specify other activities"
                    value={formData.extrasOther}
                    onChange={(e) => handleChange("extrasOther", e.target.value)}
                  />
                </div>
              )}
            </div>

            {/* Residency Section */}
            <SectionHeader 
              icon={<Shield className="w-5 h-5 text-white" />}
              title="Residency & Work Status"
              description="Update your work authorization status"
            />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <InputLabel htmlFor="iqama" required icon={<Shield className="w-4 h-4" />}>
                  Legal Work/Visa Status
                </InputLabel>
                <select
                  value={formData.iqama}
                  onChange={(e) => handleChange("iqama", e.target.value)}
                  className="w-full border-2 border-gray-200 rounded-xl p-3"
                >
                  <option value="">Choose</option>
                  <option>Employment Visa</option>
                  <option>Transferable Iqama/Ajeer</option>
                  <option>Temporary Work Visa</option>
                  <option>Work visa required</option>
                  <option>Citizen (No residency visa needed)</option>
                  <option>Business work visa</option>
                  <option>Business Visit Visa (Work not allowed)</option>
                  <option>Premium Residency</option>
                  <option>Other</option>
                </select>
                {formData.iqama === "Other" && (
                  <input
                    className="mt-2 w-full border-2 border-gray-200 rounded-xl p-3"
                    placeholder="Please specify"
                    value={formData.iqamaOther}
                    onChange={(e) => handleChange("iqamaOther", e.target.value)}
                  />
                )}
              </div>

              <div>
                <InputLabel htmlFor="willingRelocateCity" icon={<MapPin className="w-4 h-4" />}>
                  Willing to Relocate To
                </InputLabel>
                <input
                  id="willingRelocateCity"
                  value={formData.willingRelocateCity}
                  onChange={(e) => handleChange("willingRelocateCity", e.target.value)}
                  className="w-full border-2 border-gray-200 rounded-xl p-3"
                  placeholder="City name"
                />
              </div>
            </div>

            {/* Additional Info */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
              <div>
                <InputLabel icon={<FileText className="w-4 h-4" />}>
                  Forward CV to Agencies?
                </InputLabel>
                <select
                  value={formData.consentForwardCV}
                  onChange={(e) => handleChange("consentForwardCV", e.target.value)}
                  className="w-full border-2 border-gray-200 rounded-xl p-3"
                >
                  <option value="">Choose</option>
                  <option>Yes</option>
                  <option>No</option>
                </select>
              </div>

              <div>
                <InputLabel icon={<Activity className="w-4 h-4" />}>
                  Medical Assistance Needed?
                </InputLabel>
                <select
                  value={formData.medicalAssistance}
                  onChange={(e) => handleChange("medicalAssistance", e.target.value)}
                  className="w-full border-2 border-gray-200 rounded-xl p-3"
                >
                  <option value="">Choose</option>
                  <option>Yes</option>
                  <option>No</option>
                  <option>Maybe</option>
                  <option>Other</option>
                </select>
                {formData.medicalAssistance === "Other" && (
                  <input
                    className="mt-2 w-full border-2 border-gray-200 rounded-xl p-3"
                    placeholder="Please specify"
                    value={formData.medicalAssistanceOther}
                    onChange={(e) => handleChange("medicalAssistanceOther", e.target.value)}
                  />
                )}
              </div>

              <div className="md:col-span-2">
                <InputLabel icon={<Calendar className="w-4 h-4" />}>
                  Available From
                </InputLabel>
                <input
                  type="date"
                  value={formData.availableFrom}
                  min={today}
                  onChange={(e) => handleChange("availableFrom", e.target.value)}
                  className="w-full border-2 border-gray-200 rounded-xl p-3"
                />
              </div>

              <div className="md:col-span-2">
                <InputLabel icon={<FileText className="w-4 h-4" />}>
                  Awards & Achievements
                </InputLabel>
                <textarea
                  value={formData.awards}
                  onChange={(e) => handleChange("awards", e.target.value)}
                  className="w-full border-2 border-gray-200 rounded-xl p-3"
                  rows="3"
                  placeholder="Any awards or recognitions"
                />
              </div>

              <div className="md:col-span-2">
                <InputLabel icon={<FileText className="w-4 h-4" />}>
                  Additional Notes
                </InputLabel>
                <textarea
                  value={formData.otherNotes}
                  onChange={(e) => handleChange("otherNotes", e.target.value)}
                  className="w-full border-2 border-gray-200 rounded-xl p-3"
                  rows="3"
                  placeholder="Any additional information"
                />
              </div>
            </div>

            {/* File Uploads Section */}
            <SectionHeader 
              icon={<UploadCloud className="w-5 h-5 text-white" />}
              title="Documents"
              description="Update your documents and files"
            />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Photo Upload */}
              <div>
                <InputLabel htmlFor="photo" icon={<Camera className="w-4 h-4" />}>
                  Profile Photo
                </InputLabel>
                <div className="flex flex-wrap items-center gap-4">
                  <label className="cursor-pointer">
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="image/*"
                      onChange={(e) => handleFileUpload("photo", e.target.files[0])}
                      className="hidden"
                    />
                    <span className="px-4 py-2 bg-gradient-to-r from-[#0077BB] to-[#00AEEF] text-white rounded-xl text-sm font-medium hover:shadow-lg transition-all duration-200">
                      Choose Photo
                    </span>
                  </label>
                  
                  {formData.photoPreview && (
                    <div className="relative">
                      <img
                        src={formData.photoPreview}
                        alt="Preview"
                        className="w-20 h-20 rounded-xl object-cover border-2 border-gray-200"
                      />
                      <button
                        type="button"
                        onClick={() => removeFile("photo")}
                        className="absolute -top-2 -right-2 p-1 bg-red-500 text-white rounded-full hover:bg-red-600"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </div>
                  )}
                </div>
                <p className="text-xs text-gray-500 mt-2">Upload a clear photo for your profile</p>
              </div>

              {/* CV Upload */}
              <div>
                <InputLabel htmlFor="cv" icon={<FileText className="w-4 h-4" />}>
                  CV / Resume
                </InputLabel>
                <div className="flex flex-wrap items-center gap-4">
                  <label className="cursor-pointer">
                    <input
                      ref={cvInputRef}
                      type="file"
                      accept=".pdf,.doc,.docx"
                      onChange={(e) => handleFileUpload("cv", e.target.files[0])}
                      className="hidden"
                    />
                    <span className="px-4 py-2 bg-gradient-to-r from-[#0077BB] to-[#00AEEF] text-white rounded-xl text-sm font-medium hover:shadow-lg transition-all duration-200">
                      Upload New CV
                    </span>
                  </label>
                  
                  {formData.cv && (
                    <div className="flex items-center gap-2 bg-green-50 px-3 py-2 rounded-lg border border-green-200">
                      <CheckCircle className="w-4 h-4 text-green-600" />
                      <span className="text-sm truncate max-w-[200px]">{formData.cv.name}</span>
                      <button
                        type="button"
                        onClick={() => removeFile("cv")}
                        className="p-1 bg-red-100 text-red-600 rounded-lg hover:bg-red-200"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </div>
                  )}
                </div>
              </div>

              {/* Degree Files */}
              <div className="md:col-span-2">
                <InputLabel icon={<FileText className="w-4 h-4" />}>
                  Degree Certificates (Optional - up to 5 files)
                </InputLabel>
                <input
                  type="file"
                  accept="image/*,.pdf"
                  onChange={(e) => handleMultiFiles(e.target.files)}
                  multiple
                  className="w-full border-2 border-gray-200 rounded-xl p-3"
                />
                {formData.latestDegreeFiles.length > 0 && (
                  <div className="mt-3 space-y-2">
                    {formData.latestDegreeFiles.map((f, i) => (
                      <div key={i} className="flex items-center justify-between bg-green-50 p-3 rounded-xl border border-green-200">
                        <div className="flex items-center gap-2">
                          <CheckCircle className="w-4 h-4 text-green-600" />
                          <span className="text-sm truncate">{f.name}</span>
                          <span className="text-xs text-gray-500">
                            ({(f.size / 1024).toFixed(1)} KB)
                          </span>
                        </div>
                        <button
                          type="button"
                          onClick={() => removeFile("degreeFile", i)}
                          className="p-1 bg-red-100 text-red-600 rounded-lg hover:bg-red-200"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Submit Buttons */}
            <div className="mt-8 pt-6 border-t border-gray-200 flex items-center justify-end gap-4">
              <button
                type="button"
                onClick={() => navigate('/teacher-profile')}
                className="px-6 py-3 rounded-xl border-2 border-gray-300 text-gray-700 font-medium hover:bg-gray-50 transition-all duration-200"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={updateLoading}
                className={`px-8 py-3 rounded-xl font-semibold text-white transition-all duration-200 flex items-center gap-2 ${
                  updateLoading
                    ? "bg-gray-400 cursor-not-allowed"
                    : "bg-gradient-to-r from-[#0077BB] to-[#00AEEF] hover:shadow-lg hover:scale-105"
                }`}
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
      </div>

      {/* Phone Input Styles */}
      <style jsx="true">{`
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
      `}</style>
    </div>
  );
};

export default UpdateProfile;