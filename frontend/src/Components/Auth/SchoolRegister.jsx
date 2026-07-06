import React, { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Mail, UploadCloud, CheckCircle, MapPin, Globe, User, Building, Phone, BookOpen, Users, Eye, EyeOff, LogIn, FileText, Search } from "lucide-react";
import Select from "react-select";
import { Country, State, City } from "country-state-city";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-hot-toast";
import { registerSchoolAction, clearErrors } from "../../actions/userActions";

// Import phone input styles and component
import PhoneInput from 'react-phone-number-input';
import 'react-phone-number-input/style.css';

// Updated School Types
const schoolTypes = [
  "Private School",
  "Public School",
  "International School",
  "Charter School",
  "Nursery / Pre-School",
  "Language Center",
  "Other"
];

// Updated Curriculum options with detailed subcategories
const curricula = [
  // British Curriculum
  { main: "British Curriculum", sub: "National Curriculum for England" },
  { main: "British Curriculum", sub: "Cambridge (IGCSE / A-Levels)" },
  { main: "British Curriculum", sub: "Edexcel" },
  { main: "British Curriculum", sub: "GCSE / A-Level Schools" },
  
  // American Curriculum
  { main: "American Curriculum", sub: "US State Standards" },
  { main: "American Curriculum", sub: "Common Core" },
  { main: "American Curriculum", sub: "High School Diploma" },
  { main: "American Curriculum", sub: "AP (Advanced Placement)" },
  
  // IB Curriculum
  { main: "IB (International Baccalaureate)", sub: "PYP (Primary Years Programme)" },
  { main: "IB (International Baccalaureate)", sub: "MYP (Middle Years Programme)" },
  { main: "IB (International Baccalaureate)", sub: "DP (Diploma Programme)" },
  { main: "IB (International Baccalaureate)", sub: "CP (Career-related Programme)" },
  
  // Other Curricula
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
  
  // Language Center Sub-categories
  { main: "Language Center", sub: "English / Multi Language" },
  { main: "Language Center", sub: "Corporate Training" },
  { main: "Language Center", sub: "Test Preparation Center" },
  
  // Other International
  { main: "Other International", sub: "Other International Curriculum" }
];

const schoolLevels = [
  "Preschool/Kindergarten",
  "Primary School",
  "Middle School",
  "High School",
  "All Levels (K-12)"
];

// School list data
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

// Positions data
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

// Facilities checklist
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

// Updated Accreditations checklist
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

// Get all countries for react-select
const countryOptions = Country.getAllCountries().map(country => ({
  value: country.isoCode,
  label: country.name,
  ...country
}));

// Phone number validation helper
const validatePhoneDigits = (value, fieldName, setErrors) => {
  if (!value) {
    setErrors(prev => ({ ...prev, [fieldName]: '' }));
    return true;
  }
  
  // Extract the number parts
  const parts = value.split(' ');
  const countryCode = parts[0];
  // Remove country code, spaces, dashes, parentheses, and plus sign
  const numberPart = value.replace(countryCode, '').replace(/[\s\-\(\)\+]/g, '');
  
  // Check if number part contains only digits
  if (!/^\d*$/.test(numberPart)) {
    setErrors(prev => ({
      ...prev,
      [fieldName]: `Please enter only digits for the phone number`
    }));
    return false;
  }
  
  // Check minimum length based on country
  const minLengths = {
    '+966': 8, // Saudi Arabia
    '+971': 8, // UAE
    '+974': 8, // Qatar
    '+973': 8, // Bahrain
    '+968': 8, // Oman
    '+965': 8, // Kuwait
    '+1': 10,  // USA/Canada
    '+44': 10, // UK
    '+91': 10, // India
    '+92': 10, // Pakistan
    '+20': 10, // Egypt
    '+962': 8, // Jordan
    '+961': 8, // Lebanon
  };
  
  const minLength = minLengths[countryCode] || 5;
  
  if (numberPart.length > 0 && numberPart.length < minLength) {
    setErrors(prev => ({
      ...prev,
      [fieldName]: `Phone number should have at least ${minLength} digits`
    }));
    return false;
  }
  
  setErrors(prev => ({ ...prev, [fieldName]: '' }));
  return true;
};

// Function to check password strength
const getPasswordStrength = (password) => {
  if (!password) return null;
  
  let strength = 0;
  if (password.length >= 6) strength++;
  if (password.length >= 10) strength++;
  if (/[a-z]/.test(password) && /[A-Z]/.test(password)) strength++;
  if (/\d/.test(password)) strength++;
  if (/[^a-zA-Z0-9]/.test(password)) strength++;
  
  if (strength <= 2) return { label: 'Weak', color: 'text-red-500', bg: 'bg-red-500', width: '33%' };
  if (strength <= 3) return { label: 'Average', color: 'text-yellow-500', bg: 'bg-yellow-500', width: '66%' };
  return { label: 'Strong', color: 'text-green-500', bg: 'bg-green-500', width: '100%' };
};

const initialData = {
  // School Basic Information
  schoolName: "",
  schoolNameOther: "",
  schoolType: [],
  schoolLevel: [],
  curriculum: [],
  curriculumMain: [],
  establishedYear: "",
  studentCapacity: "",
  currentStudents: "",
  
  // Location Information
  country: "",
  city: "",
  cityOther: "",
  address: "",
  website: "",
  
  // Contact Information
  contactPerson: "",
  contactPosition: "",
  principalName: "",
  email: "",
  password: "",
  confirmPassword: "",
  mobile: "",
  telephone: "",
  alternativeContact: "",
  
  // Staffing Requirements
  expectedTeachers: "",
  
  // Facilities & Accreditations
  facilities: [],
  facilitiesOther: "",
  accreditations: [],
  accreditationsOther: "",
  
  // Additional Information
  schoolDescription: "",
  otherPartnershipInstitutions: "",
  
  // Uploads
  logo: null,
  schoolProfileCR: [],
  additionalInfo: ""
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

export default function SchoolRegister() {
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
  const [searchQuery, setSearchQuery] = useState("");
  const [showSchoolDropdown, setShowSchoolDropdown] = useState(false);
  const [expandedCurricula, setExpandedCurricula] = useState({});
  const confettiRef = useRef(null);
  const navigate = useNavigate();

  // Clear errors when component mounts
  useEffect(() => {
    dispatch(clearErrors());
  }, [dispatch]);

  // Handle click outside for school dropdown
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (showSchoolDropdown && !event.target.closest('.school-name-dropdown')) {
        setShowSchoolDropdown(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [showSchoolDropdown]);

  // Handle API success and errors
  useEffect(() => {
    if (error) {
      toast.error(error);
      setSubmitting(false);
    }

    if (success && isAuthenticatedUser) {
      setSubmitted(true);
      runConfetti();
      
      setTimeout(() => {
        navigate('/school-profile');
      }, 2000);
    }
  }, [error, success, isAuthenticatedUser, navigate]);

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
      if (arr.includes(value)) {
        return { ...prev, [key]: arr.filter((a) => a !== value) };
      } else {
        return { ...prev, [key]: [...arr, value] };
      }
    });
  };

  const toggleCurriculumExpand = (main) => {
    setExpandedCurricula(prev => ({
      ...prev,
      [main]: !prev[main]
    }));
  };

  const handleCurriculumSelect = (subValue) => {
    setData(prev => {
      const arr = prev.curriculum || [];
      if (arr.includes(subValue)) {
        return { ...prev, curriculum: arr.filter(a => a !== subValue) };
      } else {
        return { ...prev, curriculum: [...arr, subValue] };
      }
    });
  };

  const groupedCurricula = curricula.reduce((acc, curr) => {
    if (!acc[curr.main]) {
      acc[curr.main] = [];
    }
    acc[curr.main].push(curr.sub);
    return acc;
  }, {});

  const filteredSchools = SCHOOL_LIST.filter(school =>
    school.toLowerCase().includes(searchQuery.toLowerCase())
  );

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

  const validateStep = (s = step) => {
    const newErrors = {};
    if (s === 0) {
      if (!data.schoolName && !data.schoolNameOther) newErrors.schoolName = "School name is required";
      if (!data.schoolType || data.schoolType.length === 0) newErrors.schoolType = "Select at least one school type";
      if (!data.curriculum || data.curriculum.length === 0) newErrors.curriculum = "Select at least one curriculum";
      if (!data.country) newErrors.country = "Country is required";
      if (!data.city) newErrors.city = "City is required";
    } else if (s === 1) {
      if (!data.contactPerson) newErrors.contactPerson = "Contact person is required";
      if (!data.principalName) newErrors.principalName = "Principal/Director name is required";
      if (!data.email) newErrors.email = "Email is required";
      if (!data.password) newErrors.password = "Password is required";
      if (data.password.length < 6) newErrors.password = "Password must be at least 6 characters";
      if (data.password !== data.confirmPassword) newErrors.confirmPassword = "Passwords do not match";
      if (!data.mobile) newErrors.mobile = "School mobile number is required";
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

 const handlePhoneChange = (key, value) => {
  handleChange(key, value);
  
  // Simple validation - just check if it's not empty for required fields
  if (key === 'mobile' && !value) {
    setErrors(prev => ({ ...prev, mobile: 'Mobile number is required' }));
  } else {
    setErrors(prev => ({ ...prev, [key]: '' }));
  }
};

  const handleFile = (key, file) => {
    if (!file) return;
    setData((p) => ({ ...p, [key]: file }));
  };

  const handleMultiFiles = (files) => {
    const arr = Array.from(files);
    setData((p) => ({ ...p, schoolProfileCR: arr }));
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
  
  // Simple validation - just check if mobile is provided
  if (!data.mobile) {
    setErrors(prev => ({ ...prev, mobile: 'Mobile number is required' }));
    setStep(1);
    return;
  }
  
  if (!validateStep(3)) {
    setStep(3);
    return;
  }
  
  setSubmitting(true);
    try {
      const formData = new FormData();

      formData.append('email', data.email);
      formData.append('password', data.password);
      formData.append('role', 'school');
      formData.append('firstName', data.contactPerson);
      formData.append('lastName', '');
      formData.append('mobile', data.mobile);

      formData.append('schoolName', data.schoolName || data.schoolNameOther);
      formData.append('schoolNameOther', data.schoolNameOther || '');
      
      data.schoolType.forEach(type => {
        formData.append('schoolType', type);
      });
      
      data.schoolLevel.forEach(level => {
        formData.append('schoolLevel', level);
      });
      
      data.curriculum.forEach(curr => {
        formData.append('curriculum', curr);
      });
      
      data.facilities.forEach(facility => {
        formData.append('facilities', facility);
      });
      
      data.accreditations.forEach(accreditation => {
        formData.append('accreditations', accreditation);
      });
      
      formData.append('establishedYear', data.establishedYear);
      formData.append('studentCapacity', data.studentCapacity);
      formData.append('currentStudents', data.currentStudents);
      formData.append('country', data.country);
      formData.append('city', data.city);
      formData.append('cityOther', data.cityOther);
      formData.append('address', data.address);
      formData.append('website', data.website);
      formData.append('contactPerson', data.contactPerson);
      formData.append('contactPosition', data.contactPosition);
      formData.append('principalName', data.principalName);
      formData.append('telephone', data.telephone);
      formData.append('alternativeContact', data.alternativeContact);
      formData.append('expectedTeachers', data.expectedTeachers);
      formData.append('facilitiesOther', data.facilitiesOther);
      formData.append('accreditationsOther', data.accreditationsOther);
      formData.append('schoolDescription', data.schoolDescription);
      formData.append('otherPartnershipInstitutions', data.otherPartnershipInstitutions);
      formData.append('additionalInfo', data.additionalInfo);

      if (data.logo) {
        formData.append('logo', data.logo);
      }

      if (data.schoolProfileCR && data.schoolProfileCR.length > 0) {
        data.schoolProfileCR.forEach((file, index) => {
          formData.append('schoolDocuments', file);
        });
      }

      dispatch(registerSchoolAction(formData));

    } catch (error) {
      console.error('Form submission error:', error);
      toast.error('Failed to submit form. Please try again.');
      setSubmitting(false);
    }
}




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

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 py-16 mt-26 px-4 md:px-8 font-[Parkinsans] relative z-30">
      <div className="absolute top-4 right-4 z-40">
        <button
          onClick={() => navigate('/school-login')}
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
                  School Registration - The Teaching Path
                </h1>
                <p className="text-sm text-gray-500 mt-1">Partner with us to find qualified teaching staff</p>
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
                      {['School Info', 'Contact', 'Facilities', 'Uploads'][stepNum]}
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
                            value={data.schoolName === "Other" ? "" : data.schoolName}
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
                                  {data.schoolName === school && (
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
                                {data.schoolName === "" && data.schoolNameOther !== "" && (
                                  <CheckCircle className="w-4 h-4 text-green-500" />
                                )}
                              </button>
                            </div>
                          </div>
                        )}
                      </div>
                      
                      {data.schoolName === "" && data.schoolNameOther !== "" && (
                        <div className="mt-3">
                          <input
                            value={data.schoolNameOther}
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
                              checked={data.schoolType.includes(type)}
                              onChange={() => toggleArrayValue("schoolType", type)}
                              className="w-5 h-5 text-[#0077BB] focus:ring-[#0077BB]"
                            />
                            <span className="text-sm font-medium">{type}</span>
                          </label>
                        ))}
                      </div>
                      {errors.schoolType && <p className="text-red-500 text-sm mt-1">{errors.schoolType}</p>}
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
                              checked={data.schoolLevel.includes(level)}
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
                                      checked={data.curriculum.includes(sub)}
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
                      {errors.curriculum && <p className="text-red-500 text-sm mt-1">{errors.curriculum}</p>}
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
                        value={data.establishedYear}
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
                        value={data.studentCapacity}
                        onChange={(e) => handleChange("studentCapacity", e.target.value)}
                        className="mt-1 block w-full border-2 border-gray-200 rounded-xl p-3 transition-all duration-200 focus:border-[#0077BB] focus:ring-2 focus:ring-blue-100"
                        placeholder="Total capacity"
                      />
                    </div>

                    {/* Website */}
                    <div>
                      <InputLabel htmlFor="website" icon={<Globe className="w-4 h-4" />}>
                        School Website
                      </InputLabel>
                      <input
                        id="website"
                        type="url"
                        value={data.website}
                        onChange={(e) => handleChange("website", e.target.value)}
                        className="mt-1 block w-full border-2 border-gray-200 rounded-xl p-3 transition-all duration-200 focus:border-[#0077BB] focus:ring-2 focus:ring-blue-100"
                        placeholder="https://www.yourschool.edu"
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
                        value={data.currentStudents}
                        onChange={(e) => handleChange("currentStudents", e.target.value)}
                        className="mt-1 block w-full border-2 border-gray-200 rounded-xl p-3 transition-all duration-200 focus:border-[#0077BB] focus:ring-2 focus:ring-blue-100"
                        placeholder="Current enrollment"
                      />
                    </div>

                    {/* Country */}
                    <div>
                      <InputLabel htmlFor="country" required icon={<Globe className="w-4 h-4" />}>
                        Country
                      </InputLabel>
                      <Select
                        options={countryOptions}
                        value={countryOptions.find(country => country.label === data.country)}
                        onChange={(selected) => {
                          handleChange("country", selected?.label || "");
                          getCitiesForCountry(selected?.value);
                        }}
                        styles={customSelectStyles}
                        placeholder="Select country"
                        isSearchable
                      />
                      {errors.country && <p className="text-red-500 text-sm mt-1">{errors.country}</p>}
                    </div>

                    {/* City */}
                    <div>
                      <InputLabel htmlFor="city" required icon={<MapPin className="w-4 h-4" />}>
                        City
                      </InputLabel>
                      <select
                        value={data.city}
                        onChange={(e) => handleChange("city", e.target.value)}
                        className="mt-1 block w-full border-2 border-gray-200 rounded-xl p-3 transition-all duration-200 focus:border-[#0077BB] focus:ring-2 focus:ring-blue-100"
                        disabled={!data.country}
                      >
                        <option value="">Select city</option>
                        {cities.map((city) => (
                          <option key={city.name} value={city.name}>
                            {city.name}
                          </option>
                        ))}
                        <option value="Other">Other</option>
                      </select>
                      {data.city === "Other" && (
                        <input
                          className="mt-2 block w-full border-2 border-gray-200 rounded-xl p-3 transition-all duration-200 focus:border-[#0077BB] focus:ring-2 focus:ring-blue-100"
                          placeholder="Please specify your city"
                          value={data.cityOther}
                          onChange={(e) => handleChange("cityOther", e.target.value)}
                        />
                      )}
                      {errors.city && <p className="text-red-500 text-sm mt-1">{errors.city}</p>}
                    </div>

                    {/* Address */}
                    <div className="md:col-span-2">
                      <InputLabel htmlFor="address" icon={<MapPin className="w-4 h-4" />}>
                        Full Address
                      </InputLabel>
                      <textarea
                        id="address"
                        value={data.address}
                        onChange={(e) => handleChange("address", e.target.value)}
                        className="mt-1 block w-full border-2 border-gray-200 rounded-xl p-3 transition-all duration-200 focus:border-[#0077BB] focus:ring-2 focus:ring-blue-100"
                        rows="3"
                        placeholder="Complete school address"
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
                    {/* Contact Person */}
                    <div>
                      <InputLabel htmlFor="contactPerson" required icon={<User className="w-4 h-4" />}>
                        Contact Person Name
                      </InputLabel>
                      <input
                        id="contactPerson"
                        value={data.contactPerson}
                        onChange={(e) => handleChange("contactPerson", e.target.value)}
                        className="mt-1 block w-full border-2 border-gray-200 rounded-xl p-3 transition-all duration-200 focus:border-[#0077BB] focus:ring-2 focus:ring-blue-100"
                        placeholder="Full name of contact person"
                      />
                      {errors.contactPerson && <p className="text-red-500 text-sm mt-1">{errors.contactPerson}</p>}
                    </div>

                    {/* Contact Position */}
                    <div>
                      <InputLabel htmlFor="contactPosition" icon={<User className="w-4 h-4" />}>
                        Contact Person Position
                      </InputLabel>
                      <Select
                        options={POSITIONS.map(pos => ({ value: pos, label: pos }))}
                        value={data.contactPosition ? { value: data.contactPosition, label: data.contactPosition } : null}
                        onChange={(selected) => handleChange("contactPosition", selected?.value || "")}
                        styles={customSelectStyles}
                        placeholder="Select position"
                        isSearchable
                        isClearable
                      />
                    </div>

                    {/* Principal/Director Name */}
                    <div>
                      <InputLabel htmlFor="principalName" required icon={<User className="w-4 h-4" />}>
                        Director/Principal Name
                      </InputLabel>
                      <input
                        id="principalName"
                        value={data.principalName}
                        onChange={(e) => handleChange("principalName", e.target.value)}
                        className="mt-1 block w-full border-2 border-gray-200 rounded-xl p-3 transition-all duration-200 focus:border-[#0077BB] focus:ring-2 focus:ring-blue-100"
                        placeholder="Full name of principal/director"
                      />
                      {errors.principalName && <p className="text-red-500 text-sm mt-1">{errors.principalName}</p>}
                    </div>

                    {/* Email */}
                    <div>
                      <InputLabel htmlFor="email" required icon={<Mail className="w-4 h-4" />}>
                        Email Address
                      </InputLabel>
                      <input
                        id="email"
                        type="email"
                        value={data.email}
                        onChange={(e) => handleChange("email", e.target.value)}
                        className="mt-1 block w-full border-2 border-gray-200 rounded-xl p-3 transition-all duration-200 focus:border-[#0077BB] focus:ring-2 focus:ring-blue-100"
                        placeholder="contact@school.edu"
                      />
                      {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
                    </div>

                    {/* Password with Strength Indicator */}
                    <div>
                      <InputLabel htmlFor="password" required icon={<Eye className="w-4 h-4" />}>
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
                                  getPasswordStrength(data.password)?.bg || 'bg-gray-300'
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
                      <InputLabel htmlFor="confirmPassword" required icon={<Eye className="w-4 h-4" />}>
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

                    {/* School Mobile Number */}
                    <div>
                      <InputLabel htmlFor="mobile" required icon={<Phone className="w-4 h-4" />}>
                        School Mobile Number
                      </InputLabel>
                      <div className="mt-1 phone-input-wrapper">
                        <PhoneInput
                          international
                          defaultCountry="SA"
                          value={data.mobile}
                          onChange={(value) => handlePhoneChange("mobile", value)}
                          className="custom-phone-input"
                          placeholder="Enter phone number"
                          limitMaxLength={true}
                        />
                      </div>
                      {errors.mobile && <p className="text-red-500 text-sm mt-1">{errors.mobile}</p>}
                    </div>

                    {/* School Telephone Number */}
                    <div>
                      <InputLabel htmlFor="telephone" icon={<Phone className="w-4 h-4" />}>
                        School Telephone Number
                      </InputLabel>
                      <div className="mt-1 phone-input-wrapper">
                        <PhoneInput
                          international
                          defaultCountry="SA"
                          value={data.telephone}
                          onChange={(value) => handlePhoneChange("telephone", value)}
                          className="custom-phone-input"
                          placeholder="Enter phone number"
                          limitMaxLength={true}
                        />
                      </div>
                      {errors.telephone && <p className="text-red-500 text-sm mt-1">{errors.telephone}</p>}
                    </div>

                    {/* School Alternative Contact */}
                    <div>
                      <InputLabel htmlFor="alternativeContact" icon={<Phone className="w-4 h-4" />}>
                        School Alternative Contact
                      </InputLabel>
                      <div className="mt-1 phone-input-wrapper">
                        <PhoneInput
                          international
                          defaultCountry="SA"
                          value={data.alternativeContact}
                          onChange={(value) => handlePhoneChange("alternativeContact", value)}
                          className="custom-phone-input"
                          placeholder="Enter phone number"
                          limitMaxLength={true}
                        />
                      </div>
                      {errors.alternativeContact && <p className="text-red-500 text-sm mt-1">{errors.alternativeContact}</p>}
                    </div>

                    {/* Expected Teachers */}
                    <div>
                      <InputLabel htmlFor="expectedTeachers" icon={<Users className="w-4 h-4" />}>
                        Expected Number of Teachers Needed
                      </InputLabel>
                      <input
                        id="expectedTeachers"
                        type="number"
                        value={data.expectedTeachers}
                        onChange={(e) => handleChange("expectedTeachers", e.target.value)}
                        className="mt-1 block w-full border-2 border-gray-200 rounded-xl p-3 transition-all duration-200 focus:border-[#0077BB] focus:ring-2 focus:ring-blue-100"
                        placeholder="e.g., 25"
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
                    {/* School Description */}
                    <div className="md:col-span-2">
                      <InputLabel htmlFor="schoolDescription" icon={<Building className="w-4 h-4" />}>
                        School Description
                      </InputLabel>
                      <textarea
                        id="schoolDescription"
                        value={data.schoolDescription}
                        onChange={(e) => handleChange("schoolDescription", e.target.value)}
                        className="mt-1 block w-full border-2 border-gray-200 rounded-xl p-3 transition-all duration-200 focus:border-[#0077BB] focus:ring-2 focus:ring-blue-100"
                        rows="4"
                        placeholder="Brief description of your school, mission, and values..."
                      />
                    </div>

                    {/* Facilities Available */}
                    <div className="md:col-span-2">
                      <InputLabel icon={<Building className="w-4 h-4" />}>
                        Facilities Available
                      </InputLabel>
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 mt-2 max-h-80 overflow-y-auto p-2">
                        {FACILITIES_CHECKLIST.map((facility) => (
                          <label key={facility} className="flex items-center gap-3 p-3 rounded-xl border-2 border-gray-200 hover:border-[#0077BB] transition-all duration-200 cursor-pointer">
                            <input
                              type="checkbox"
                              checked={data.facilities.includes(facility)}
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
                            checked={data.facilities.includes("Other")}
                            onChange={() => toggleArrayValue("facilities", "Other")}
                            className="w-5 h-5 text-[#0077BB] focus:ring-[#0077BB]"
                          />
                          <span className="text-sm font-medium">Other Facilities</span>
                        </label>
                        {data.facilities.includes("Other") && (
                          <textarea
                            value={data.facilitiesOther}
                            onChange={(e) => handleChange("facilitiesOther", e.target.value)}
                            className="mt-2 block w-full border-2 border-gray-200 rounded-xl p-3 transition-all duration-200 focus:border-[#0077BB] focus:ring-2 focus:ring-blue-100"
                            rows="2"
                            placeholder="Please specify other facilities..."
                          />
                        )}
                      </div>
                    </div>

                    {/* Accreditations */}
                    <div className="md:col-span-2">
                      <InputLabel icon={<Building className="w-4 h-4" />}>
                        Accreditations & Affiliations
                      </InputLabel>
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 mt-2 max-h-80 overflow-y-auto p-2">
                        {ACCREDITATIONS_CHECKLIST.map((accreditation) => (
                          <label key={accreditation} className="flex items-center gap-3 p-3 rounded-xl border-2 border-gray-200 hover:border-[#0077BB] transition-all duration-200 cursor-pointer">
                            <input
                              type="checkbox"
                              checked={data.accreditations.includes(accreditation)}
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
                            checked={data.accreditations.includes("Other")}
                            onChange={() => toggleArrayValue("accreditations", "Other")}
                            className="w-5 h-5 text-[#0077BB] focus:ring-[#0077BB]"
                          />
                          <span className="text-sm font-medium">Other Accreditations</span>
                        </label>
                        {data.accreditations.includes("Other") && (
                          <textarea
                            value={data.accreditationsOther}
                            onChange={(e) => handleChange("accreditationsOther", e.target.value)}
                            className="mt-2 block w-full border-2 border-gray-200 rounded-xl p-3 transition-all duration-200 focus:border-[#0077BB] focus:ring-2 focus:ring-blue-100"
                            rows="2"
                            placeholder="Please specify other accreditations..."
                          />
                        )}
                      </div>
                    </div>

                    {/* Other Partnership Institutions */}
                    <div className="md:col-span-2">
                      <InputLabel htmlFor="otherPartnershipInstitutions" icon={<Users className="w-4 h-4" />}>
                        Other Partnership Institutions
                      </InputLabel>
                      <textarea
                        id="otherPartnershipInstitutions"
                        value={data.otherPartnershipInstitutions}
                        onChange={(e) => handleChange("otherPartnershipInstitutions", e.target.value)}
                        className="mt-1 block w-full border-2 border-gray-200 rounded-xl p-3 transition-all duration-200 focus:border-[#0077BB] focus:ring-2 focus:ring-blue-100"
                        rows="3"
                        placeholder="List any other institutions you partner with..."
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
                    {/* Logo Upload */}
                    <div>
                      <InputLabel htmlFor="logo" icon={<UploadCloud className="w-4 h-4" />}>
                        School Logo
                      </InputLabel>
                      <div className="mt-2 flex items-center gap-3">
                        <label className="flex items-center gap-2 cursor-pointer">
                          <input
                            type="file"
                            accept="image/*"
                            onChange={(e) => handleFile("logo", e.target.files[0])}
                            className="hidden"
                          />
                          <span className="px-4 py-3 bg-gradient-to-r from-[#0077BB] to-[#00AEEF] text-white rounded-xl text-sm font-medium hover:shadow-lg transition-all duration-200 flex items-center gap-2">
                            <UploadCloud className="w-4 h-4" />
                            Upload Logo
                          </span>
                        </label>
                        {data.logo && (
                          <img
                            src={URL.createObjectURL(data.logo)}
                            alt="logo preview"
                            className="w-16 h-16 rounded-xl object-cover border-2 border-gray-200"
                          />
                        )}
                      </div>
                    </div>

                    {/* School Profile/CR */}
                    <div>
                      <InputLabel icon={<FileText className="w-4 h-4" />}>
                        School Profile / Commercial Registration
                      </InputLabel>
                      <div className="mt-2">
                        <label className="flex items-center gap-2 cursor-pointer">
                          <input
                            type="file"
                            multiple
                            accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
                            onChange={(e) => handleMultiFiles(e.target.files)}
                            className="hidden"
                          />
                          <span className="px-4 py-3 bg-gradient-to-r from-gray-600 to-gray-800 text-white rounded-xl text-sm font-medium hover:shadow-lg transition-all duration-200 flex items-center gap-2">
                            <UploadCloud className="w-4 h-4" />
                            Upload Documents
                          </span>
                        </label>
                        {data.schoolProfileCR && data.schoolProfileCR.length > 0 && (
                          <div className="mt-3 space-y-2">
                            {data.schoolProfileCR.map((file, idx) => (
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

                    {/* Additional Information */}
                    <div className="md:col-span-2">
                      <InputLabel icon={<FileText className="w-4 h-4" />}>
                        Additional Information
                      </InputLabel>
                      <textarea
                        value={data.additionalInfo}
                        onChange={(e) => handleChange("additionalInfo", e.target.value)}
                        className="mt-1 block w-full border-2 border-gray-200 rounded-xl p-3 transition-all duration-200 focus:border-[#0077BB] focus:ring-2 focus:ring-blue-100"
                        rows="4"
                        placeholder="Any additional information about your school or requirements..."
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
                      "Complete Registration"
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
                    <h2 className="text-2xl font-bold text-gray-800">Registration Successful!</h2>
                    <p className="text-gray-600 mt-2">Welcome to The Apex Staffing Network! We'll connect you with qualified teachers soon.</p>
                    <p className="text-sm text-gray-500 mt-3">Redirecting to your school profile...</p>
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
              onClick={() => navigate('/school-login')}
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