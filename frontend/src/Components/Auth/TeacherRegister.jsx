import React, { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Mail, UploadCloud, CheckCircle, MapPin, Globe, User, GraduationCap, Briefcase, FileText, Shield, Languages, Activity, Calendar, Lock, LogIn, Eye, EyeOff, AlertCircle, X, Trash2, Plus } from "lucide-react";
import Select from "react-select";
import { Country, State, City } from "country-state-city";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from 'react-redux';
import toast from 'react-hot-toast';
import { registerCandidatesAction, clearErrors } from "../../actions/userActions";

// Import phone input styles and component
import PhoneInput from 'react-phone-number-input';
import 'react-phone-number-input/style.css';

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

// Get today's date for date restrictions
const today = new Date().toISOString().split('T')[0];

// Get all countries for react-select
const countryOptions = Country.getAllCountries().map(country => ({
  value: country.isoCode,
  label: country.name,
  ...country
}));

// Generate years 0-40 for experience dropdown
const experienceYears = Array.from({ length: 41 }, (_, i) => i);

const initialData = {
  // Personal
  firstName: "",
  middleName: "",
  lastName: "",
  gender: "",
  dob: "",
  email: "",
  password: "",
  confirmPassword: "",
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
  // Uploads
  photo: null,
  photoPreview: null,
  cv: null,
  latestDegreeFiles: [],
  otherNotes: "",
};

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

export default function TeacherRegister() {
  const dispatch = useDispatch();
  const { loading, error, isAuthenticatedUser, success } = useSelector((state) => state.loginUser);
  
  const [data, setData] = useState(initialData);
  const [step, setStep] = useState(0);
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [cities, setCities] = useState([]);
  const [selectedCountryCode, setSelectedCountryCode] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [otherCertificates, setOtherCertificates] = useState([]);
  const [newCertificate, setNewCertificate] = useState({ name: "", institution: "", year: "" });
  const confettiRef = useRef(null);
  const fileInputRef = useRef(null);
  const navigate = useNavigate();

  // Function to check password strength
  const getPasswordStrength = (password) => {
    if (!password) return null;
    
    let strength = 0;
    if (password.length >= 6) strength++;
    if (password.length >= 10) strength++;
    if (/[a-z]/.test(password) && /[A-Z]/.test(password)) strength++;
    if (/\d/.test(password)) strength++;
    if (/[^a-zA-Z0-9]/.test(password)) strength++;
    
    if (strength <= 2) return { label: 'Weak', color: 'text-red-500', bg: 'bg-red-100', width: '33%' };
    if (strength <= 3) return { label: 'Average', color: 'text-yellow-500', bg: 'bg-yellow-100', width: '66%' };
    return { label: 'Strong', color: 'text-green-500', bg: 'bg-green-100', width: '100%' };
  };

  // Clear errors when component mounts
  useEffect(() => {
    dispatch(clearErrors());
  }, [dispatch]);

  // Handle API success and errors - NO ALERTS, only toast messages
  useEffect(() => {
    if (error) {
      // Check if error is about invalid token or authentication
      if (error.includes("Invalid token") || error.includes("login again") || error.includes("unauthorized")) {
        toast.error("Session expired. Please login again.");
        // Optionally redirect to login after 2 seconds
        setTimeout(() => {
          navigate('/teacher-login');
        }, 2000);
      } else if (error.includes("duplicate") || error.includes("already exists") || error.includes("email")) {
        toast.error("This email is already registered. Please use a different email or login.");
      } else {
        toast.error(error);
      }
      setSubmitting(false);
    }

    if (success && isAuthenticatedUser) {
      setSubmitted(true);
      runConfetti();
      
      // Redirect to teacher profile after 2 seconds
      setTimeout(() => {
        navigate('/teacher-profile');
      }, 2000);
    }
  }, [error, success, isAuthenticatedUser, navigate]);

  // Clean up photo preview URL when component unmounts
  useEffect(() => {
    return () => {
      if (data.photoPreview) {
        URL.revokeObjectURL(data.photoPreview);
      }
    };
  }, [data.photoPreview]);

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

  const toggleArrayValue = (key, value) => {
    setData((prev) => {
      const arr = prev[key] || [];
      
      // Check for max limits
      if (key === "positionsInterested" && arr.length >= 3 && !arr.includes(value)) {
        toast.error("You can select up to 3 positions only");
        return prev;
      }
      
      if (key === "curriculumTaught" && arr.length >= 3 && !arr.includes(value)) {
        toast.error("You can select up to 3 curricula only");
        return prev;
      }
      
      if (arr.includes(value)) {
        return { ...prev, [key]: arr.filter((a) => a !== value) };
      } else {
        return { ...prev, [key]: [...arr, value] };
      }
    });
  };

  const validateStep = (s = step) => {
    const newErrors = {};
    if (s === 0) {
      if (!data.firstName) newErrors.firstName = "First name is required";
      if (!data.lastName) newErrors.lastName = "Last name is required";
      if (!data.gender) newErrors.gender = "Select gender";
      if (!data.dob) newErrors.dob = "Date of birth required";
      
      // Check if DOB is not in future
      if (data.dob && new Date(data.dob) > new Date()) {
        newErrors.dob = "Date of birth cannot be in the future";
      }
      
      if (!data.email) newErrors.email = "Email required";
      if (!data.password) newErrors.password = "Password is required";
      if (data.password.length < 6) newErrors.password = "Password must be at least 6 characters";
      if (data.password !== data.confirmPassword) newErrors.confirmPassword = "Passwords do not match";
      if (!data.mobile) newErrors.mobile = "Mobile number required";
      if (!data.nationality) newErrors.nationality = "Nationality is required";
    } else if (s === 1) {
      if (!data.degree) newErrors.degree = "Select your degree";
      if (!data.universityName) newErrors.universityName = "University name is required";
      if (!data.positionsInterested || data.positionsInterested.length === 0) newErrors.positionsInterested = "Select at least 1 position";
      if (data.positionsInterested && data.positionsInterested.length > 3) newErrors.positionsInterested = "Maximum 3 positions allowed";
      if (data.curriculumTaught && data.curriculumTaught.length > 3) newErrors.curriculumTaught = "Maximum 3 curricula allowed";
    } else if (s === 2) {
      if (!data.iqama) newErrors.iqama = "Select residency / Iqama status";
      if (!data.skills || data.skills.length === 0) newErrors.skills = "Please add at least one skill";
      
      // Check if "Other" is selected without text
      if (data.positionsInterested.includes("Other") && !data.positionsOther.trim()) {
        newErrors.positionsOther = "Please specify the position";
      }
      if (data.curriculumTaught.includes("Other") && !data.curriculumOther.trim()) {
        newErrors.curriculumOther = "Please specify the curriculum";
      }
      if (data.languages.includes("Other") && !data.languagesOther.trim()) {
        newErrors.languagesOther = "Please specify the language";
      }
      if (data.extras.includes("Other") && !data.extrasOther.trim()) {
        newErrors.extrasOther = "Please specify the activity";
      }
      if (data.skills.includes("Other") && !data.skillsOther.trim()) {
        newErrors.skillsOther = "Please specify your skills";
      }
    } else if (s === 3) {
      // CV is now mandatory
      if (!data.cv) newErrors.cv = "CV is required (PDF or DOC)";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const next = () => {
    if (validateStep(step)) {
      setStep((p) => Math.min(3, p + 1));
      setErrors({});
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const prev = () => {
    setStep((p) => Math.max(0, p - 1));
    setErrors({});
  };

  const handleChange = (key, val) => {
    setData((p) => ({ ...p, [key]: val }));
  };

  const handleFile = (key, file) => {
    if (!file) return;
    
    if (key === "photo") {
      // Create preview URL for photo
      const previewUrl = URL.createObjectURL(file);
      setData((p) => ({ 
        ...p, 
        [key]: file,
        photoPreview: previewUrl 
      }));
    } else {
      setData((p) => ({ ...p, [key]: file }));
    }
  };

  const removePhoto = () => {
    if (data.photoPreview) {
      URL.revokeObjectURL(data.photoPreview);
    }
    setData((p) => ({ 
      ...p, 
      photo: null,
      photoPreview: null 
    }));
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleMultiFiles = (files) => {
    const arr = Array.from(files);
    setData((p) => ({ ...p, latestDegreeFiles: arr }));
  };

  // Add new certificate
  const addCertificate = () => {
    if (!newCertificate.name || !newCertificate.institution || !newCertificate.year) {
      toast.error("Please fill all certificate fields");
      return;
    }
    
    setOtherCertificates([...otherCertificates, newCertificate]);
    setNewCertificate({ name: "", institution: "", year: "" });
  };

  // Remove certificate
  const removeCertificate = (index) => {
    setOtherCertificates(otherCertificates.filter((_, i) => i !== index));
  };

  const runConfetti = () => {
    const parent = confettiRef.current;
    if (!parent) return;
    parent.innerHTML = "";
    const colors = ["#0077BB", "#00AEEF", "#F6B400", "#FF6B6B", "#7C3AED"];
    for (let i = 0; i < 50; i++) {
      const el = document.createElement("div");
      el.style.position = "absolute";
      el.style.width = `${6 + Math.random() * 8}px`;
      el.style.height = el.style.width;
      el.style.left = `${50 + (Math.random() - 0.5) * 60}vw`;
      el.style.top = `${10 + Math.random() * 10}vh`;
      el.style.background = colors[Math.floor(Math.random() * colors.length)];
      el.style.opacity = "0.95";
      el.style.borderRadius = "2px";
      el.style.transform = `rotate(${Math.random() * 360}deg)`;
      el.style.zIndex = "9999";
      const dur = 1500 + Math.random() * 2000;
      el.animate(
        [
          { transform: el.style.transform, opacity: 1, top: el.style.top },
          { transform: `translateY(${200 + Math.random() * 500}px) rotate(${Math.random() * 720}deg)`, opacity: 0 }
        ],
        { duration: dur, easing: "cubic-bezier(.2,.9,.2,1)" }
      );
      parent.appendChild(el);
      setTimeout(() => parent.removeChild(el), dur + 200);
    }
  };

  const handleFinalSubmit = async (e) => {
    e.preventDefault();
    if (!validateStep(3)) {
      setStep(3);
      return;
    }
    
    setSubmitting(true);

    try {
      // Prepare form data for file uploads
      const formData = new FormData();

      // Add basic registration data
      formData.append('email', data.email);
      formData.append('password', data.password);
      formData.append('role', 'candidate');
      formData.append('firstName', data.firstName);
      formData.append('lastName', data.lastName);
      if (data.middleName) formData.append('middleName', data.middleName);
      formData.append('mobile', data.mobile);

      // Add candidate-specific data
      formData.append('gender', data.gender);
      if (data.dob) formData.append('dob', data.dob);
      if (data.whatsapp) formData.append('whatsapp', data.whatsapp);
      formData.append('nationality', data.nationality);
      if (data.maritalStatus) formData.append('maritalStatus', data.maritalStatus);
      if (data.countryOfResidence) formData.append('countryOfResidence', data.countryOfResidence);
      if (data.currentCity) formData.append('currentCity', data.currentCity);
      if (data.currentCityOther) formData.append('currentCityOther', data.currentCityOther);
      if (data.expectedSalary) formData.append('expectedSalary', data.expectedSalary);
      
      // Append each array item individually
      data.positionsInterested.forEach(position => {
        formData.append('positionsInterested', position);
      });
      
      if (data.positionsOther) formData.append('positionsOther', data.positionsOther);
      
      data.curriculumTaught.forEach(curriculum => {
        formData.append('curriculumTaught', curriculum);
      });
      
      if (data.curriculumOther) formData.append('curriculumOther', data.curriculumOther);
      
      data.skills.forEach(skill => {
        formData.append('skills', skill);
      });
      
      if (data.skillsOther) formData.append('skillsOther', data.skillsOther);
      
      data.languages.forEach(language => {
        formData.append('languages', language);
      });
      
      if (data.languagesOther) formData.append('languagesOther', data.languagesOther);
      
      data.extras.forEach(extra => {
        formData.append('extras', extra);
      });
      
      if (data.extrasOther) formData.append('extrasOther', data.extrasOther);

      // Add other fields
      formData.append('degree', data.degree);
      if (data.degreeOther) formData.append('degreeOther', data.degreeOther);
      if (data.universityName) formData.append('universityName', data.universityName);
      if (data.universityLocation) formData.append('universityLocation', data.universityLocation);
      if (data.currentInstitution) formData.append('currentInstitution', data.currentInstitution);
      if (data.previousInstitution) formData.append('previousInstitution', data.previousInstitution);
      if (data.totalExperience) formData.append('totalExperience', data.totalExperience);
      formData.append('englishCert', data.englishCert || 'No');
      if (data.englishCertOther) formData.append('englishCertOther', data.englishCertOther);
      formData.append('teachingLicense', data.teachingLicense || 'No');
      if (data.teachingLicenseOther) formData.append('teachingLicenseOther', data.teachingLicenseOther);
      formData.append('teachingDiploma', data.teachingDiploma || 'No');
      if (data.teachingDiplomaOther) formData.append('teachingDiplomaOther', data.teachingDiplomaOther);
      formData.append('stemKnowledge', data.stemKnowledge || 'No');
      formData.append('stemCertified', data.stemCertified || 'No');
      if (data.stemCertifiedOther) formData.append('stemCertifiedOther', data.stemCertifiedOther);
      if (data.degreeAttested) formData.append('degreeAttested', data.degreeAttested);
      
      // Add certificates as JSON string
      if (otherCertificates.length > 0) {
        formData.append('otherCertificates', JSON.stringify(otherCertificates));
      }
      
      if (data.awards) formData.append('awards', data.awards);
      formData.append('iqama', data.iqama || 'No');
      if (data.iqamaOther) formData.append('iqamaOther', data.iqamaOther);
      if (data.willingRelocateCity) formData.append('willingRelocateCity', data.willingRelocateCity);
      formData.append('consentForwardCV', data.consentForwardCV || 'No');
      if (data.consentForwardCVOther) formData.append('consentForwardCVOther', data.consentForwardCVOther);
      formData.append('medicalAssistance', data.medicalAssistance || 'No');
      if (data.medicalAssistanceOther) formData.append('medicalAssistanceOther', data.medicalAssistanceOther);
      if (data.availableFrom) formData.append('availableFrom', data.availableFrom);
      if (data.otherNotes) formData.append('otherNotes', data.otherNotes);

      // Add files
      if (data.photo) {
        formData.append('photo', data.photo);
      }

      // CV is now mandatory
      if (data.cv) {
        formData.append('cv', data.cv);
      }

      if (data.latestDegreeFiles && data.latestDegreeFiles.length > 0) {
        data.latestDegreeFiles.forEach((file, index) => {
          formData.append('latestDegreeFiles', file);
        });
      }

      // Log the FormData to see what's being sent
      console.log('📤 Sending Teacher FormData:');
      for (let [key, value] of formData.entries()) {
        console.log(`${key}:`, value);
      }

      // Dispatch the registration action
      dispatch(registerCandidatesAction(formData));

    } catch (error) {
      console.error('Teacher form submission error:', error);
      toast.error('Failed to submit form. Please try again.');
      setSubmitting(false);
    }
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

  const StepIcon = ({ number, active, completed }) => (
    <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold ${
      completed ? 'bg-green-500 text-white' :
      active ? 'bg-gradient-to-r from-[#0077BB] to-[#00AEEF] text-white' :
      'bg-gray-200 text-gray-600'
    }`}>
      {completed ? <CheckCircle className="w-4 h-4" /> : number}
    </div>
  );

  const stepVariants = {
    enter: { opacity: 0, x: 50 },
    center: { opacity: 1, x: 0 },
    exit: { opacity: 0, x: -50 },
  };

  // Override window.alert to prevent any alerts
  useEffect(() => {
    const originalAlert = window.alert;
    window.alert = (message) => {
      // Convert alerts to toast notifications instead
      if (message && typeof message === 'string') {
        toast.error(message);
      }
      console.warn('Alert prevented:', message);
    };
    
    return () => {
      window.alert = originalAlert;
    };
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 py-16 mt-26 px-4 md:px-8 font-[Parkinsans] relative z-30">
      {/* Login Button at Top Right */}
      <div className="absolute top-4 right-4 z-40">
        <button
          onClick={() => navigate('/teacher-login')}
          className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-300 rounded-xl text-gray-700 hover:bg-gray-50 transition-all duration-200 shadow-sm"
        >
          <LogIn className="w-4 h-4" />
          Login
        </button>
      </div>

      <div className="max-w-4xl mx-auto relative z-30">
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-100 relative z-30">
          <div className="p-6 md:p-8 border-b border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-2xl md:text-3xl font-bold text-gray-800 bg-gradient-to-r from-[#0077BB] to-[#00AEEF] bg-clip-text text-transparent">
                  Teaching / Non-Teaching Job Application
                </h1>
                <p className="text-sm text-gray-500 mt-1">Complete the form — we'll reach out soon.</p>
              </div>
            </div>

            <div className="mt-8">
              <div className="flex items-center justify-between relative">
                <div className="absolute top-4 left-0 right-0 h-1 bg-gray-200 -z-10">
                  <div 
                    className="h-1 rounded-full bg-gradient-to-r from-[#0077BB] to-[#00AEEF] transition-all duration-500 ease-out"
                    style={{ width: `${((step + 1) / 4) * 100}%` }}
                  />
                </div>
                {[0, 1, 2, 3].map((stepNum) => (
                  <div key={stepNum} className="flex flex-col items-center z-10">
                    <StepIcon 
                      number={stepNum + 1} 
                      active={step === stepNum} 
                      completed={step > stepNum}
                    />
                    <span className={`text-xs mt-2 font-medium ${
                      step === stepNum ? 'text-[#0077BB]' : 
                      step > stepNum ? 'text-green-600' : 'text-gray-500'
                    }`}>
                      {['Personal', 'Academics', 'Residency', 'Uploads'][stepNum]}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <form onSubmit={handleFinalSubmit} className="p-6 md:p-8 relative z-30">
            <AnimatePresence mode="wait">
              {step === 0 && (
                <motion.div
                  key="step0"
                  variants={stepVariants}
                  initial="enter"
                  animate="center"
                  exit="exit"
                  transition={{ duration: 0.35 }}
                >
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* First Name */}
                    <div>
                      <InputLabel htmlFor="firstName" required icon={<User className="w-4 h-4" />}>
                        First Name
                      </InputLabel>
                      <input
                        id="firstName"
                        value={data.firstName}
                        onChange={(e) => handleChange("firstName", e.target.value)}
                        className="mt-1 block w-full border-2 border-gray-200 rounded-xl p-3 transition-all duration-200 focus:border-[#0077BB] focus:ring-2 focus:ring-blue-100"
                        placeholder="First name"
                      />
                      {errors.firstName && <p className="text-red-500 text-sm mt-1">{errors.firstName}</p>}
                    </div>

                    {/* Middle Name */}
                    <div>
                      <InputLabel htmlFor="middleName" icon={<User className="w-4 h-4" />}>
                        Middle Name
                      </InputLabel>
                      <input
                        id="middleName"
                        value={data.middleName}
                        onChange={(e) => handleChange("middleName", e.target.value)}
                        className="mt-1 block w-full border-2 border-gray-200 rounded-xl p-3 transition-all duration-200 focus:border-[#0077BB] focus:ring-2 focus:ring-blue-100"
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
                        value={data.lastName}
                        onChange={(e) => handleChange("lastName", e.target.value)}
                        className="mt-1 block w-full border-2 border-gray-200 rounded-xl p-3 transition-all duration-200 focus:border-[#0077BB] focus:ring-2 focus:ring-blue-100"
                        placeholder="Last name"
                      />
                      {errors.lastName && <p className="text-red-500 text-sm mt-1">{errors.lastName}</p>}
                    </div>

                    {/* Gender */}
                    <div>
                      <InputLabel htmlFor="gender" required icon={<User className="w-4 h-4" />}>
                        Gender
                      </InputLabel>
                      <select
                        id="gender"
                        value={data.gender}
                        onChange={(e) => handleChange("gender", e.target.value)}
                        className="mt-1 block w-full border-2 border-gray-200 rounded-xl p-3 transition-all duration-200 focus:border-[#0077BB] focus:ring-2 focus:ring-blue-100"
                      >
                        <option value="">Select</option>
                        <option>Male</option>
                        <option>Female</option>
                        <option>Other</option>
                      </select>
                      {errors.gender && <p className="text-red-500 text-sm mt-1">{errors.gender}</p>}
                    </div>

                    {/* Photo Upload */}
                    <div>
                      <InputLabel htmlFor="photo" icon={<User className="w-4 h-4" />}>
                        Upload Photo
                      </InputLabel>
                      <div className="mt-1 flex flex-col gap-3">
                        <div className="flex items-center gap-3">
                          <label className="flex items-center gap-2 cursor-pointer">
                            <input
                              ref={fileInputRef}
                              type="file"
                              accept="image/*"
                              onChange={(e) => handleFile("photo", e.target.files[0])}
                              className="hidden"
                            />
                            <span className="px-4 py-2 bg-gradient-to-r from-[#0077BB] to-[#00AEEF] text-white rounded-xl text-sm font-medium hover:shadow-lg transition-all duration-200">
                              Choose photo
                            </span>
                          </label>
                          {data.photo && (
                            <button
                              type="button"
                              onClick={removePhoto}
                              className="p-2 bg-red-100 text-red-600 rounded-lg hover:bg-red-200 transition-colors"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          )}
                        </div>
                        
                        {/* Photo Preview - Fixed to ensure images show properly */}
                        {data.photoPreview && (
                          <div className="relative w-32 h-32 rounded-xl overflow-hidden border-2 border-gray-200 bg-gray-50">
                            <img
                              src={data.photoPreview}
                              alt="Preview"
                              className="w-full h-full object-cover"
                              onError={(e) => {
                                console.error("Image failed to load");
                                e.target.style.display = 'none';
                                const parent = e.target.parentElement;
                                if (parent) {
                                  const fallback = document.createElement('div');
                                  fallback.className = 'w-full h-full flex items-center justify-center text-gray-400 text-xs';
                                  fallback.innerText = 'No preview';
                                  parent.appendChild(fallback);
                                }
                              }}
                            />
                          </div>
                        )}
                        
                        {!data.photoPreview && data.photo && (
                          <div className="relative w-32 h-32 rounded-xl overflow-hidden border-2 border-gray-200 bg-gray-50">
                            <img
                              src={URL.createObjectURL(data.photo)}
                              alt="Preview"
                              className="w-full h-full object-cover"
                              onLoad={(e) => {
                                console.log("Image loaded successfully");
                                URL.revokeObjectURL(e.target.src);
                              }}
                              onError={(e) => {
                                console.error("Image failed to load");
                                e.target.style.display = 'none';
                                const parent = e.target.parentElement;
                                if (parent) {
                                  const fallback = document.createElement('div');
                                  fallback.className = 'w-full h-full flex items-center justify-center text-gray-400 text-xs';
                                  fallback.innerText = 'No preview';
                                  parent.appendChild(fallback);
                                }
                              }}
                            />
                          </div>
                        )}
                        
                        <p className="text-xs text-gray-500">Upload a clear photo for your profile (optional)</p>
                      </div>
                    </div>

                    {/* Date of Birth */}
                    <div>
                      <InputLabel htmlFor="dob" required icon={<Calendar className="w-4 h-4" />}>
                        Date of Birth
                      </InputLabel>
                      <input
                        id="dob"
                        type="date"
                        value={data.dob}
                        max={today}
                        onChange={(e) => handleChange("dob", e.target.value)}
                        className="mt-1 block w-full border-2 border-gray-200 rounded-xl p-3 transition-all duration-200 focus:border-[#0077BB] focus:ring-2 focus:ring-blue-100"
                      />
                      {errors.dob && <p className="text-red-500 text-sm mt-1">{errors.dob}</p>}
                    </div>

                    {/* Email */}
                    <div>
                      <InputLabel htmlFor="email" required icon={<Mail className="w-4 h-4" />}>
                        Email
                      </InputLabel>
                      <input
                        id="email"
                        type="email"
                        value={data.email}
                        onChange={(e) => handleChange("email", e.target.value)}
                        className="mt-1 block w-full border-2 border-gray-200 rounded-xl p-3 transition-all duration-200 focus:border-[#0077BB] focus:ring-2 focus:ring-blue-100"
                        placeholder="you@example.com"
                      />
                      {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
                    </div>

                    {/* Password */}
                    <div>
                      <InputLabel htmlFor="password" required icon={<Lock className="w-4 h-4" />}>
                        Password
                      </InputLabel>
                      <div className="relative">
                        <input
                          id="password"
                          type={showPassword ? "text" : "password"}
                          value={data.password}
                          onChange={(e) => handleChange("password", e.target.value)}
                          className="mt-1 block w-full border-2 border-gray-200 rounded-xl p-3 transition-all duration-200 focus:border-[#0077BB] focus:ring-2 focus:ring-blue-100 pr-10"
                          placeholder="Create a password (min. 6 characters)"
                        />
                        <button
                          type="button"
                          className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                          onClick={() => setShowPassword(!showPassword)}
                        >
                          {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                        </button>
                      </div>
                      
                      {/* Password Strength Indicator */}
                      {data.password && (
                        <div className="mt-2">
                          <div className="flex items-center gap-2">
                            <div className="flex-1 h-2 bg-gray-200 rounded-full overflow-hidden">
                              <div 
                                className={`h-full rounded-full transition-all duration-300 ${
                                  getPasswordStrength(data.password)?.label === 'Weak' ? 'bg-red-500' :
                                  getPasswordStrength(data.password)?.label === 'Average' ? 'bg-yellow-500' :
                                  'bg-green-500'
                                }`}
                                style={{ width: getPasswordStrength(data.password)?.width || '0%' }}
                              />
                            </div>
                            <span className={`text-xs font-medium ${
                              getPasswordStrength(data.password)?.color || 'text-gray-500'
                            }`}>
                              {getPasswordStrength(data.password)?.label || ''}
                            </span>
                          </div>
                          <p className="text-xs text-gray-500 mt-1">
                            Password must be at least 6 characters with letters and numbers
                          </p>
                        </div>
                      )}
                      
                      {errors.password && <p className="text-red-500 text-sm mt-1">{errors.password}</p>}
                    </div>

                    {/* Confirm Password */}
                    <div>
                      <InputLabel htmlFor="confirmPassword" required icon={<Lock className="w-4 h-4" />}>
                        Confirm Password
                      </InputLabel>
                      <div className="relative">
                        <input
                          id="confirmPassword"
                          type={showConfirmPassword ? "text" : "password"}
                          value={data.confirmPassword}
                          onChange={(e) => handleChange("confirmPassword", e.target.value)}
                          className="mt-1 block w-full border-2 border-gray-200 rounded-xl p-3 transition-all duration-200 focus:border-[#0077BB] focus:ring-2 focus:ring-blue-100 pr-10"
                          placeholder="Confirm your password"
                        />
                        <button
                          type="button"
                          className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                          onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                        >
                          {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                        </button>
                      </div>
                      {errors.confirmPassword && <p className="text-red-500 text-sm mt-1">{errors.confirmPassword}</p>}
                    </div>

                    {/* Mobile Number - Using PhoneInput with country-specific validation */}
                    <div>
                      <InputLabel htmlFor="mobile" required icon={<User className="w-4 h-4" />}>
                        Mobile number
                      </InputLabel>
                      <div className="mt-1 phone-input-wrapper">
                        <PhoneInput
                          international
                          defaultCountry="SA"
                          value={data.mobile}
                          onChange={(value) => handleChange("mobile", value)}
                          className="custom-phone-input"
                          placeholder="Enter phone number"
                          limitMaxLength={true}
                        />
                      </div>
                      {errors.mobile && <p className="text-red-500 text-sm mt-1">{errors.mobile}</p>}
                    </div>

                    {/* WhatsApp Number - Using PhoneInput */}
                    <div>
                      <InputLabel htmlFor="whatsapp" icon={<User className="w-4 h-4" />}>
                        Number on Whatsapp
                      </InputLabel>
                      <div className="mt-1 phone-input-wrapper">
                        <PhoneInput
                          international
                          defaultCountry="SA"
                          value={data.whatsapp}
                          onChange={(value) => handleChange("whatsapp", value)}
                          className="custom-phone-input"
                          placeholder="Enter phone number"
                          limitMaxLength={true}
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
                        value={countryOptions.find(country => country.label === data.nationality)}
                        onChange={(selected) => {
                          handleChange("nationality", selected?.label || "");
                        }}
                        styles={customSelectStyles}
                        placeholder="Select your nationality"
                        isSearchable
                      />
                      {errors.nationality && <p className="text-red-500 text-sm mt-1">{errors.nationality}</p>}
                    </div>

                    {/* Marital Status - Updated with Single Parent and Divorced */}
                    <div>
                      <InputLabel htmlFor="maritalStatus" icon={<User className="w-4 h-4" />}>
                        Marital Status
                      </InputLabel>
                      <select
                        id="maritalStatus"
                        value={data.maritalStatus}
                        onChange={(e) => handleChange("maritalStatus", e.target.value)}
                        className="mt-1 block w-full border-2 border-gray-200 rounded-xl p-3 transition-all duration-200 focus:border-[#0077BB] focus:ring-2 focus:ring-blue-100"
                      >
                        <option value="">Choose</option>
                        <option>Single</option>
                        <option>Married</option>
                        <option>Single Parent</option>
                        <option>Divorced</option>
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
                        value={countryOptions.find(country => country.label === data.countryOfResidence)}
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
                        value={data.currentCity}
                        onChange={(e) => handleChange("currentCity", e.target.value)}
                        className="mt-1 block w-full border-2 border-gray-200 rounded-xl p-3 transition-all duration-200 focus:border-[#0077BB] focus:ring-2 focus:ring-blue-100"
                        disabled={!data.countryOfResidence}
                      >
                        <option value="">Select city</option>
                        {cities.map((city) => (
                          <option key={city.name} value={city.name}>
                            {city.name}
                          </option>
                        ))}
                        <option value="Other">Other</option>
                      </select>
                      {data.currentCity === "Other" && (
                        <input
                          className="mt-2 block w-full border-2 border-gray-200 rounded-xl p-3 transition-all duration-200 focus:border-[#0077BB] focus:ring-2 focus:ring-blue-100"
                          placeholder="Please specify your city"
                          value={data.currentCityOther}
                          onChange={(e) => handleChange("currentCityOther", e.target.value)}
                        />
                      )}
                    </div>

                    {/* Expected Salary */}
                    <div>
                      <InputLabel htmlFor="expectedSalary" icon={<User className="w-4 h-4" />}>
                        Your expected salary in SAR
                      </InputLabel>
                      <input
                        id="expectedSalary"
                        value={data.expectedSalary}
                        onChange={(e) => handleChange("expectedSalary", e.target.value)}
                        type="number"
                        className="mt-1 block w-full border-2 border-gray-200 rounded-xl p-3 transition-all duration-200 focus:border-[#0077BB] focus:ring-2 focus:ring-blue-100"
                        placeholder="Enter expected salary"
                      />
                    </div>
                  </div>
                </motion.div>
              )}

              {step === 1 && (
                <motion.div
                  key="step1"
                  variants={stepVariants}
                  initial="enter"
                  animate="center"
                  exit="exit"
                  transition={{ duration: 0.35 }}
                >
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <InputLabel htmlFor="degree" required icon={<GraduationCap className="w-4 h-4" />}>
                        Bachelor's/master's degree in
                      </InputLabel>
                      <select
                        id="degree"
                        value={data.degree}
                        onChange={(e) => handleChange("degree", e.target.value)}
                        className="mt-1 block w-full border-2 border-gray-200 rounded-xl p-3 transition-all duration-200 focus:border-[#0077BB] focus:ring-2 focus:ring-blue-100"
                      >
                        <option value="">Select degree</option>
                        {degrees.map((d) => (
                          <option key={d} value={d}>
                            {d}
                          </option>
                        ))}
                      </select>
                      {data.degree === "Other" && (
                        <input
                          className="mt-2 block w-full border-2 border-gray-200 rounded-xl p-3 transition-all duration-200 focus:border-[#0077BB] focus:ring-2 focus:ring-blue-100"
                          placeholder="Please mention degree name"
                          value={data.degreeOther}
                          onChange={(e) => handleChange("degreeOther", e.target.value)}
                        />
                      )}
                      {errors.degree && <p className="text-red-500 text-sm mt-1">{errors.degree}</p>}
                    </div>

                    <div>
                      <InputLabel htmlFor="universityName" required icon={<GraduationCap className="w-4 h-4" />}>
                        Name of the University/College/School
                      </InputLabel>
                      <input
                        id="universityName"
                        value={data.universityName}
                        onChange={(e) => handleChange("universityName", e.target.value)}
                        className="mt-1 block w-full border-2 border-gray-200 rounded-xl p-3 transition-all duration-200 focus:border-[#0077BB] focus:ring-2 focus:ring-blue-100"
                        placeholder="Full name in English"
                      />
                      {errors.universityName && <p className="text-red-500 text-sm mt-1">{errors.universityName}</p>}
                    </div>

                    <div>
                      <InputLabel htmlFor="universityLocation" icon={<MapPin className="w-4 h-4" />}>
                        University/College Location
                      </InputLabel>
                      <input
                        id="universityLocation"
                        value={data.universityLocation}
                        onChange={(e) => handleChange("universityLocation", e.target.value)}
                        className="mt-1 block w-full border-2 border-gray-200 rounded-xl p-3 transition-all duration-200 focus:border-[#0077BB] focus:ring-2 focus:ring-blue-100"
                        placeholder="Country, City"
                      />
                    </div>

                    {/* Total Experience */}
                    <div>
                      <InputLabel htmlFor="totalExperience" icon={<Briefcase className="w-4 h-4" />}>
                        Total experiences (approx. in years)
                      </InputLabel>
                      <select
                        id="totalExperience"
                        value={data.totalExperience}
                        onChange={(e) => handleChange("totalExperience", e.target.value)}
                        className="mt-1 block w-full border-2 border-gray-200 rounded-xl p-3 transition-all duration-200 focus:border-[#0077BB] focus:ring-2 focus:ring-blue-100"
                      >
                        <option value="">Select years</option>
                        {experienceYears.map(year => (
                          <option key={year} value={year}>
                            {year} {year === 1 ? 'year' : 'years'}
                          </option>
                        ))}
                      </select>
                    </div>

                    {/* Positions Interested */}
                    <div className="md:col-span-2">
                      <InputLabel icon={<Briefcase className="w-4 h-4" />}>
                        Which position(s) are you interested in? (select up to 3)
                      </InputLabel>
                      <div className="grid grid-cols-2 md:grid-cols-3 gap-3 mt-2">
                        {positions.map((p) => (
                          <label key={p} className="flex items-center gap-3 p-3 rounded-xl border-2 border-gray-200 hover:border-[#0077BB] transition-all duration-200 cursor-pointer">
                            <input
                              type="checkbox"
                              checked={data.positionsInterested.includes(p)}
                              onChange={() => toggleArrayValue("positionsInterested", p)}
                              className="w-5 h-5 text-[#0077BB] focus:ring-[#0077BB]"
                              disabled={data.positionsInterested.length >= 3 && !data.positionsInterested.includes(p)}
                            />
                            <span className="text-sm font-medium">{p}</span>
                          </label>
                        ))}
                      </div>
                      {errors.positionsInterested && <p className="text-red-500 text-sm mt-1">{errors.positionsInterested}</p>}
                      
                      {/* "Other" input field */}
                      {data.positionsInterested.includes("Other") && (
                        <div className="mt-3">
                          <input
                            className="block w-full border-2 border-gray-200 rounded-xl p-3 transition-all duration-200 focus:border-[#0077BB] focus:ring-2 focus:ring-blue-100"
                            placeholder="Please specify the position"
                            value={data.positionsOther}
                            onChange={(e) => handleChange("positionsOther", e.target.value)}
                          />
                          {errors.positionsOther && <p className="text-red-500 text-sm mt-1">{errors.positionsOther}</p>}
                        </div>
                      )}
                    </div>

                    <div>
                      <InputLabel htmlFor="currentInstitution" icon={<Briefcase className="w-4 h-4" />}>
                        Current working institution's name
                      </InputLabel>
                      <input
                        id="currentInstitution"
                        value={data.currentInstitution}
                        onChange={(e) => handleChange("currentInstitution", e.target.value)}
                        className="mt-1 block w-full border-2 border-gray-200 rounded-xl p-3 transition-all duration-200 focus:border-[#0077BB] focus:ring-2 focus:ring-blue-100"
                        placeholder="Optional"
                      />
                    </div>

                    <div>
                      <InputLabel htmlFor="previousInstitution" icon={<Briefcase className="w-4 h-4" />}>
                        Previous working institution's name
                      </InputLabel>
                      <input
                        id="previousInstitution"
                        value={data.previousInstitution}
                        onChange={(e) => handleChange("previousInstitution", e.target.value)}
                        className="mt-1 block w-full border-2 border-gray-200 rounded-xl p-3 transition-all duration-200 focus:border-[#0077BB] focus:ring-2 focus:ring-blue-100"
                        placeholder="Please add at least one if you taught before"
                      />
                    </div>

                    {/* Curriculum Teaching/Taught */}
                    <div className="md:col-span-2">
                      <InputLabel icon={<GraduationCap className="w-4 h-4" />}>
                        Curriculum Teaching/Taught (select up to 3)
                      </InputLabel>
                      <div className="grid grid-cols-2 md:grid-cols-3 gap-3 mt-2">
                        {curricula.map((c) => (
                          <label key={c} className="flex items-center gap-3 p-3 rounded-xl border-2 border-gray-200 hover:border-[#0077BB] transition-all duration-200 cursor-pointer">
                            <input
                              type="checkbox"
                              checked={data.curriculumTaught.includes(c)}
                              onChange={() => toggleArrayValue("curriculumTaught", c)}
                              className="w-5 h-5 text-[#0077BB] focus:ring-[#0077BB]"
                              disabled={data.curriculumTaught.length >= 3 && !data.curriculumTaught.includes(c)}
                            />
                            <span className="text-sm font-medium">{c}</span>
                          </label>
                        ))}
                      </div>
                      {errors.curriculumTaught && <p className="text-red-500 text-sm mt-1">{errors.curriculumTaught}</p>}
                      
                      {/* "Other" input field */}
                      {data.curriculumTaught.includes("Other") && (
                        <div className="mt-3">
                          <input
                            className="block w-full border-2 border-gray-200 rounded-xl p-3 transition-all duration-200 focus:border-[#0077BB] focus:ring-2 focus:ring-blue-100"
                            placeholder="Please specify the curriculum"
                            value={data.curriculumOther}
                            onChange={(e) => handleChange("curriculumOther", e.target.value)}
                          />
                          {errors.curriculumOther && <p className="text-red-500 text-sm mt-1">{errors.curriculumOther}</p>}
                        </div>
                      )}
                    </div>

                    <div>
                      <InputLabel icon={<GraduationCap className="w-4 h-4" />}>
                        Do you have any English Certificate or IELTS/TOEFL
                      </InputLabel>
                      <select
                        value={data.englishCert}
                        onChange={(e) => handleChange("englishCert", e.target.value)}
                        className="mt-1 block w-full border-2 border-gray-200 rounded-xl p-3 transition-all duration-200 focus:border-[#0077BB] focus:ring-2 focus:ring-blue-100"
                      >
                        <option value="">Choose</option>
                        <option>IELTS</option>
                        <option>TOEFL</option>
                        <option>In the Process</option>
                        <option>No</option>
                        <option>Other</option>
                      </select>
                      {data.englishCert === "Other" && (
                        <input
                          className="mt-2 block w-full border-2 border-gray-200 rounded-xl p-3 transition-all duration-200 focus:border-[#0077BB] focus:ring-2 focus:ring-blue-100"
                          placeholder="Write details or IELTS band here"
                          value={data.englishCertOther}
                          onChange={(e) => handleChange("englishCertOther", e.target.value)}
                        />
                      )}
                    </div>

                    <div>
                      <InputLabel>Do you have any English Teaching License?</InputLabel>
                      <select
                        value={data.teachingLicense}
                        onChange={(e) => handleChange("teachingLicense", e.target.value)}
                        className="mt-1 block w-full border-2 border-gray-200 rounded-xl p-3 transition-all duration-200 focus:border-[#0077BB] focus:ring-2 focus:ring-blue-100"
                      >
                        <option value="">Choose</option>
                        <option>CELTA</option>
                        <option>TESOL</option>
                        <option>TEFL</option>
                        <option>No</option>
                        <option>Other</option>
                      </select>
                      {data.teachingLicense === "Other" && (
                        <input
                          className="mt-2 block w-full border-2 border-gray-200 rounded-xl p-3 transition-all duration-200 focus:border-[#0077BB] focus:ring-2 focus:ring-blue-100"
                          placeholder="Specify"
                          value={data.teachingLicenseOther}
                          onChange={(e) => handleChange("teachingLicenseOther", e.target.value)}
                        />
                      )}
                    </div>

                    <div>
                      <InputLabel>Any Teaching Diploma/Certificates?</InputLabel>
                      <select
                        value={data.teachingDiploma}
                        onChange={(e) => handleChange("teachingDiploma", e.target.value)}
                        className="mt-1 block w-full border-2 border-gray-200 rounded-xl p-3 transition-all duration-200 focus:border-[#0077BB] focus:ring-2 focus:ring-blue-100"
                      >
                        <option value="">Choose</option>
                        <option>QTS</option>
                        <option>PGCE</option>
                        <option>No</option>
                        <option>Under Process</option>
                        <option>Other</option>
                      </select>
                      {data.teachingDiploma === "Other" && (
                        <input
                          className="mt-2 block w-full border-2 border-gray-200 rounded-xl p-3 transition-all duration-200 focus:border-[#0077BB] focus:ring-2 focus:ring-blue-100"
                          placeholder="Specify"
                          value={data.teachingDiplomaOther}
                          onChange={(e) => handleChange("teachingDiplomaOther", e.target.value)}
                        />
                      )}
                    </div>

                    <div>
                      <InputLabel>Do you have any knowledge about STEM education?</InputLabel>
                      <select
                        value={data.stemKnowledge}
                        onChange={(e) => handleChange("stemKnowledge", e.target.value)}
                        className="mt-1 block w-full border-2 border-gray-200 rounded-xl p-3 transition-all duration-200 focus:border-[#0077BB] focus:ring-2 focus:ring-blue-100"
                      >
                        <option value="">Choose</option>
                        <option>Yes</option>
                        <option>No</option>
                        <option>Maybe</option>
                      </select>
                    </div>

                    <div>
                      <InputLabel>Do you want to be a STEM Certified Teacher?</InputLabel>
                      <select
                        value={data.stemCertified}
                        onChange={(e) => handleChange("stemCertified", e.target.value)}
                        className="mt-1 block w-full border-2 border-gray-200 rounded-xl p-3 transition-all duration-200 focus:border-[#0077BB] focus:ring-2 focus:ring-blue-100"
                      >
                        <option value="">Choose</option>
                        <option>No</option>
                        <option>Yes</option>
                        <option>Other</option>
                      </select>
                      {data.stemCertified === "Other" && (
                        <input
                          className="mt-2 block w-full border-2 border-gray-200 rounded-xl p-3 transition-all duration-200 focus:border-[#0077BB] focus:ring-2 focus:ring-blue-100"
                          placeholder="Write your full name & email if interested"
                          value={data.stemCertifiedOther}
                          onChange={(e) => handleChange("stemCertifiedOther", e.target.value)}
                        />
                      )}
                    </div>

                    {/* Other Diploma/Courses/Certificates */}
                    <div className="md:col-span-2">
                      <InputLabel icon={<FileText className="w-4 h-4" />}>
                        Other Diploma/Courses/Certificates
                      </InputLabel>
                      
                      {/* Certificate Input Form */}
                      <div className="grid grid-cols-1 md:grid-cols-12 gap-3 mt-2 bg-blue-50 p-4 rounded-xl border border-blue-200">
                        <div className="md:col-span-5">
                          <input
                            type="text"
                            placeholder="Course/Certificate Name *"
                            value={newCertificate.name}
                            onChange={(e) => setNewCertificate({...newCertificate, name: e.target.value})}
                            className="w-full border-2 border-gray-200 rounded-xl p-3 text-sm focus:border-[#0077BB] focus:ring-2 focus:ring-blue-100"
                          />
                        </div>
                        <div className="md:col-span-4">
                          <input
                            type="text"
                            placeholder="Institution *"
                            value={newCertificate.institution}
                            onChange={(e) => setNewCertificate({...newCertificate, institution: e.target.value})}
                            className="w-full border-2 border-gray-200 rounded-xl p-3 text-sm focus:border-[#0077BB] focus:ring-2 focus:ring-blue-100"
                          />
                        </div>
                        <div className="md:col-span-2">
                          <input
                            type="text"
                            placeholder="Completion Year *"
                            value={newCertificate.year}
                            onChange={(e) => setNewCertificate({...newCertificate, year: e.target.value})}
                            className="w-full border-2 border-gray-200 rounded-xl p-3 text-sm focus:border-[#0077BB] focus:ring-2 focus:ring-blue-100"
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

                      {/* Certificate List */}
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
                      
                      <p className="text-xs text-gray-500 mt-2">
                        Add any additional diplomas, courses, or certificates you have completed.
                      </p>
                    </div>

                    <div className="md:col-span-2">
                      <InputLabel>Awards/Distinctions/Achievements</InputLabel>
                      <textarea
                        value={data.awards}
                        onChange={(e) => handleChange("awards", e.target.value)}
                        className="mt-1 block w-full border-2 border-gray-200 rounded-xl p-3 transition-all duration-200 focus:border-[#0077BB] focus:ring-2 focus:ring-blue-100"
                        rows="3"
                        placeholder="Any awards or recognitions"
                      />
                    </div>
                  </div>
                </motion.div>
              )}

              {step === 2 && (
                <motion.div
                  key="step2"
                  variants={stepVariants}
                  initial="enter"
                  animate="center"
                  exit="exit"
                  transition={{ duration: 0.35 }}
                >
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <InputLabel htmlFor="iqama" required icon={<Shield className="w-4 h-4" />}>
                        Legal work/ Visa status 
                      </InputLabel>
                      <select
                        value={data.iqama}
                        onChange={(e) => handleChange("iqama", e.target.value)}
                        className="mt-1 block w-full border-2 border-gray-200 rounded-xl p-3 transition-all duration-200 focus:border-[#0077BB] focus:ring-2 focus:ring-blue-100"
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
                      {data.iqama === "Other" && (
                        <input
                          className="mt-2 block w-full border-2 border-gray-200 rounded-xl p-3 transition-all duration-200 focus:border-[#0077BB] focus:ring-2 focus:ring-blue-100"
                          placeholder="Please specify your residency status"
                          value={data.iqamaOther}
                          onChange={(e) => handleChange("iqamaOther", e.target.value)}
                        />
                      )}
                      {errors.iqama && <p className="text-red-500 text-sm mt-1">{errors.iqama}</p>}
                    </div>

                    <div>
                      <InputLabel htmlFor="willingRelocateCity" icon={<MapPin className="w-4 h-4" />}>
                        City - willing to work/relocate
                      </InputLabel>
                      <input
                        value={data.willingRelocateCity}
                        onChange={(e) => handleChange("willingRelocateCity", e.target.value)}
                        className="mt-1 block w-full border-2 border-gray-200 rounded-xl p-3 transition-all duration-200 focus:border-[#0077BB] focus:ring-2 focus:ring-blue-100"
                        placeholder="Enter city if willing to relocate"
                      />
                    </div>

                    <div className="md:col-span-2">
                      <InputLabel icon={<Activity className="w-4 h-4" />}>
                        Skills (choose what you are confident in)
                      </InputLabel>
                      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 mt-2">
                        {skillsList.map((skill) => (
                          <label key={skill} className="flex items-center gap-3 p-3 rounded-xl border-2 border-gray-200 hover:border-[#0077BB] transition-all duration-200 cursor-pointer">
                            <input
                              type="checkbox"
                              checked={data.skills.includes(skill)}
                              onChange={() => toggleArrayValue("skills", skill)}
                              className="w-5 h-5 text-[#0077BB] focus:ring-[#0077BB]"
                            />
                            <span className="text-sm font-medium">{skill}</span>
                          </label>
                        ))}
                      </div>
                      
                      {/* "Other" input field for Skills */}
                      {data.skills.includes("Other") && (
                        <div className="mt-3">
                          <input
                            className="block w-full border-2 border-gray-200 rounded-xl p-3 transition-all duration-200 focus:border-[#0077BB] focus:ring-2 focus:ring-blue-100"
                            placeholder="Please specify your skills"
                            value={data.skillsOther || ""}
                            onChange={(e) => handleChange("skillsOther", e.target.value)}
                          />
                          {errors.skillsOther && <p className="text-red-500 text-sm mt-1">{errors.skillsOther}</p>}
                        </div>
                      )}
                      
                      {errors.skills && <p className="text-red-500 text-sm mt-1">{errors.skills}</p>}
                    </div>

                    {/* Language Skills */}
                    <div className="md:col-span-2">
                      <InputLabel icon={<Languages className="w-4 h-4" />}>
                        Language Skills
                      </InputLabel>
                      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 mt-2">
                        {languagesList.map((language) => (
                          <label key={language} className="flex items-center gap-3 p-3 rounded-xl border-2 border-gray-200 hover:border-[#0077BB] transition-all duration-200 cursor-pointer">
                            <input
                              type="checkbox"
                              checked={data.languages.includes(language)}
                              onChange={() => toggleArrayValue("languages", language)}
                              className="w-5 h-5 text-[#0077BB] focus:ring-[#0077BB]"
                            />
                            <span className="text-sm font-medium">{language}</span>
                          </label>
                        ))}
                      </div>
                      
                      {/* "Other" input field */}
                      {data.languages.includes("Other") && (
                        <div className="mt-3">
                          <input
                            className="block w-full border-2 border-gray-200 rounded-xl p-3 transition-all duration-200 focus:border-[#0077BB] focus:ring-2 focus:ring-blue-100"
                            placeholder="Please specify other languages"
                            value={data.languagesOther}
                            onChange={(e) => handleChange("languagesOther", e.target.value)}
                          />
                          {errors.languagesOther && <p className="text-red-500 text-sm mt-1">{errors.languagesOther}</p>}
                        </div>
                      )}
                    </div>

                    {/* Extra Curricular Activities */}
                    <div className="md:col-span-2">
                      <InputLabel icon={<Activity className="w-4 h-4" />}>
                        Extra Curricular Activities/Interests
                      </InputLabel>
                      <div className="grid grid-cols-2 md:grid-cols-3 gap-3 mt-2">
                        {extracurricularList.map((activity) => (
                          <label key={activity} className="flex items-center gap-3 p-3 rounded-xl border-2 border-gray-200 hover:border-[#0077BB] transition-all duration-200 cursor-pointer">
                            <input
                              type="checkbox"
                              checked={data.extras.includes(activity)}
                              onChange={() => toggleArrayValue("extras", activity)}
                              className="w-5 h-5 text-[#0077BB] focus:ring-[#0077BB]"
                            />
                            <span className="text-sm font-medium">{activity}</span>
                          </label>
                        ))}
                      </div>
                      
                      {/* "Other" input field */}
                      {data.extras.includes("Other") && (
                        <div className="mt-3">
                          <input
                            className="block w-full border-2 border-gray-200 rounded-xl p-3 transition-all duration-200 focus:border-[#0077BB] focus:ring-2 focus:ring-blue-100"
                            placeholder="Please specify other activities"
                            value={data.extrasOther}
                            onChange={(e) => handleChange("extrasOther", e.target.value)}
                          />
                          {errors.extrasOther && <p className="text-red-500 text-sm mt-1">{errors.extrasOther}</p>}
                        </div>
                      )}
                    </div>

                    <div>
                      <InputLabel icon={<FileText className="w-4 h-4" />}>
                        Forward your CV to schools/placement agencies?
                      </InputLabel>
                      <select
                        value={data.consentForwardCV}
                        onChange={(e) => handleChange("consentForwardCV", e.target.value)}
                        className="mt-1 block w-full border-2 border-gray-200 rounded-xl p-3 transition-all duration-200 focus:border-[#0077BB] focus:ring-2 focus:ring-blue-100"
                      >
                        <option value="">Choose</option>
                        <option>Yes</option>
                        <option>No</option>
                      </select>
                    </div>

                    <div>
                      <InputLabel icon={<Activity className="w-4 h-4" />}>
                        Do you need any medical assistance?
                      </InputLabel>
                      <select
                        value={data.medicalAssistance}
                        onChange={(e) => handleChange("medicalAssistance", e.target.value)}
                        className="mt-1 block w-full border-2 border-gray-200 rounded-xl p-3 transition-all duration-200 focus:border-[#0077BB] focus:ring-2 focus:ring-blue-100"
                      >
                        <option value="">Choose</option>
                        <option>Yes</option>
                        <option>No</option>
                        <option>Maybe</option>
                        <option>Other</option>
                      </select>
                      {data.medicalAssistance === "Other" && (
                        <input
                          className="mt-2 block w-full border-2 border-gray-200 rounded-xl p-3 transition-all duration-200 focus:border-[#0077BB] focus:ring-2 focus:ring-blue-100"
                          placeholder="Please specify medical needs"
                          value={data.medicalAssistanceOther}
                          onChange={(e) => handleChange("medicalAssistanceOther", e.target.value)}
                        />
                      )}
                    </div>

                    {/* When can you join */}
                    <div className="md:col-span-2">
                      <InputLabel icon={<Calendar className="w-4 h-4" />}>
                        When can you join once selected?
                      </InputLabel>
                      <input
                        type="date"
                        value={data.availableFrom}
                        min={today}
                        onChange={(e) => handleChange("availableFrom", e.target.value)}
                        className="mt-1 block w-full border-2 border-gray-200 rounded-xl p-3 transition-all duration-200 focus:border-[#0077BB] focus:ring-2 focus:ring-blue-100"
                      />
                    </div>
                  </div>
                </motion.div>
              )}

              {step === 3 && (
                <motion.div
                  key="step3"
                  variants={stepVariants}
                  initial="enter"
                  animate="center"
                  exit="exit"
                  transition={{ duration: 0.35 }}
                >
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* CV Upload */}
                    <div className="md:col-span-2">
                      <InputLabel htmlFor="cv" required icon={<FileText className="w-4 h-4" />}>
                        Upload your CV (Mandatory) - PDF or DOC only
                      </InputLabel>
                      <div className="mt-2 flex items-center gap-3">
                        <label className="flex items-center gap-2 cursor-pointer">
                          <input
                            type="file"
                            accept=".pdf,.doc,.docx"
                            onChange={(e) => handleFile("cv", e.target.files[0])}
                            className="hidden"
                          />
                          <span className="px-4 py-3 bg-gradient-to-r from-[#0077BB] to-[#00AEEF] text-white rounded-xl text-sm font-medium hover:shadow-lg transition-all duration-200 flex items-center gap-2">
                            <UploadCloud className="w-4 h-4" />
                            Upload CV (Mandatory)
                          </span>
                        </label>
                        {data.cv && (
                          <div className="text-sm text-gray-600 bg-green-50 px-3 py-2 rounded-lg border border-green-200 flex items-center gap-2">
                            <CheckCircle className="w-4 h-4 text-green-600" />
                            <span className="truncate max-w-[200px]">{data.cv.name}</span>
                            <span className="text-xs text-gray-500">
                              ({(data.cv.size / 1024 / 1024).toFixed(2)} MB)
                            </span>
                            <button
                              type="button"
                              onClick={() => setData({...data, cv: null})}
                              className="p-1 bg-red-100 text-red-600 rounded-lg hover:bg-red-200 ml-2"
                            >
                              <X className="w-3 h-3" />
                            </button>
                          </div>
                        )}
                      </div>
                      {errors.cv && <p className="text-red-500 text-sm mt-1">{errors.cv}</p>}
                      <p className="text-xs text-red-500 mt-2">
                        * CV upload is mandatory for application submission. Only PDF and DOC files are accepted.
                      </p>
                    </div>

                    <div className="md:col-span-2">
                      <InputLabel icon={<FileText className="w-4 h-4" />}>
                        Upload copy of your Latest degree (up to 5 files) - Optional
                      </InputLabel>
                      <div className="mt-2">
                        <input
                          type="file"
                          accept="image/*,.pdf"
                          onChange={(e) => handleMultiFiles(e.target.files)}
                          multiple
                          className="block w-full border-2 border-gray-200 rounded-xl p-3 transition-all duration-200 focus:border-[#0077BB] focus:ring-2 focus:ring-blue-100"
                        />
                        {data.latestDegreeFiles && data.latestDegreeFiles.length > 0 && (
                          <div className="mt-3 space-y-2">
                            {data.latestDegreeFiles.map((f, i) => (
                              <div key={i} className="text-sm text-gray-700 border-2 border-green-200 bg-green-50 rounded-xl p-3 flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                  <CheckCircle className="w-4 h-4 text-green-600" />
                                  <span className="truncate max-w-[300px]">{f.name}</span>
                                  <span className="text-xs text-gray-500">
                                    ({(f.size / 1024).toFixed(1)} KB)
                                  </span>
                                </div>
                                <button
                                  type="button"
                                  onClick={() => {
                                    const newFiles = [...data.latestDegreeFiles];
                                    newFiles.splice(i, 1);
                                    setData({...data, latestDegreeFiles: newFiles});
                                  }}
                                  className="p-1 bg-red-100 text-red-600 rounded-lg hover:bg-red-200"
                                >
                                  <X className="w-3 h-3" />
                                </button>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                      <p className="text-xs text-gray-500 mt-2">
                        Optional: Upload copies of your degrees, certificates, or other qualifications.
                      </p>
                    </div>

                    <div className="md:col-span-2">
                      <InputLabel icon={<FileText className="w-4 h-4" />}>
                        Anything else you want to add?
                      </InputLabel>
                      <textarea
                        value={data.otherNotes}
                        onChange={(e) => handleChange("otherNotes", e.target.value)}
                        className="mt-1 block w-full border-2 border-gray-200 rounded-xl p-3 transition-all duration-200 focus:border-[#0077BB] focus:ring-2 focus:ring-blue-100"
                        rows="4"
                        placeholder="Any additional information you'd like to share..."
                      />
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            <div className="mt-8 flex items-center justify-between gap-4 pt-6 border-t border-gray-100">
              <div>
                {step > 0 ? (
                  <button
                    type="button"
                    onClick={prev}
                    className="px-6 py-3 rounded-xl border-2 border-gray-300 text-gray-700 font-medium hover:bg-gray-50 hover:border-gray-400 transition-all duration-200"
                  >
                    Back
                  </button>
                ) : (
                  <div />
                )}
              </div>
              <div className="flex items-center gap-3">
                {step < 3 && (
                  <button
                    type="button"
                    onClick={next}
                    className="px-8 py-3 rounded-xl font-semibold bg-gradient-to-r from-[#0077BB] to-[#00AEEF] text-white hover:shadow-lg hover:scale-105 transition-all duration-200"
                  >
                    Next
                  </button>
                )}
                {step === 3 && (
                  <button
                    type="submit"
                    disabled={submitting || loading}
                    className={`px-8 py-3 rounded-xl font-semibold text-white transition-all duration-200 ${
                      submitting || loading
                        ? "bg-gray-400 cursor-not-allowed"
                        : "bg-gradient-to-r from-[#0077BB] to-[#00AEEF] hover:shadow-lg hover:scale-105"
                    }`}
                  >
                    {submitting || loading ? (
                      <div className="flex items-center gap-2">
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                        {loading ? 'Registering...' : 'Submitting...'}
                      </div>
                    ) : (
                      "Submit Application"
                    )}
                  </button>
                )}
              </div>
            </div>
          </form>

          {/* Success Screen */}
          <div aria-live="polite" className="relative z-40">
            <AnimatePresence>
              {submitted && (
                <motion.div
                  key="success"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="fixed inset-0 w-full h-full flex items-center justify-center pointer-events-auto z-50 bg-black bg-opacity-50"
                >
                  <div className="bg-white rounded-2xl shadow-2xl p-8 text-center mx-4 max-w-md w-full">
                    <div className="flex items-center justify-center mb-4">
                      <div className="p-4 rounded-full bg-gradient-to-r from-green-500 to-emerald-600">
                        <CheckCircle className="w-12 h-12 text-white" />
                      </div>
                    </div>
                    <h2 className="text-2xl font-bold text-gray-800">Application Submitted Successfully!</h2>
                    <p className="text-gray-600 mt-2">Thanks for applying! We will review your application and contact you soon.</p>
                    <p className="text-sm text-gray-500 mt-3">Redirecting to your profile...</p>
                  </div>
                  <div ref={confettiRef} className="pointer-events-none absolute inset-0 z-60" />
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>

        {/* Login Link at Bottom */}
        <div className="text-center mt-6">
          <p className="text-gray-600">
            Already have an account?{' '}
            <button
              onClick={() => navigate('/teacher-login')}
              className="text-[#0077BB] hover:underline font-medium"
            >
              Login here
            </button>
          </p>
        </div>
      </div>

      {/* Custom CSS for phone input - maintains default border style */}
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