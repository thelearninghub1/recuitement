import React, { useState, useEffect, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  Users, MapPin, Briefcase, GraduationCap, Filter, Search, Star,
  CheckCircle, Building, Languages, Target, Award, BookOpen,
  Calendar, Clock, ChevronRight, X, ChevronDown, ChevronUp,
  Mail, Phone, Globe, Heart, User, Shield, FileText, Loader2
} from 'lucide-react';
import { allUserAction } from '../../../actions/userActions';
import { toast } from 'react-toastify';
import { Country } from 'country-state-city';

const API_BASE_URL = '';

// Helper to build full image URL (same as TeacherProfile)
const getImageUrl = (filename) => {
  if (!filename) return null;
  if (filename.startsWith('http://') || filename.startsWith('https://')) return filename;
  return `https://theteachingpath.com/uploads/images/${filename}`;
};

// ------------------------------------------------------------
// Nationality demonyms — same map as TeacherRegister.jsx
// ------------------------------------------------------------
const NATIONALITY_DEMONYMS = {
  AF: "Afghan", AL: "Albanian", DZ: "Algerian", AD: "Andorran", AO: "Angolan",
  AR: "Argentine", AM: "Armenian", AU: "Australian", AT: "Austrian", AZ: "Azerbaijani",
  BS: "Bahamian", BH: "Bahraini", BD: "Bangladeshi", BB: "Barbadian", BY: "Belarusian",
  BE: "Belgian", BZ: "Belizean", BJ: "Beninese", BT: "Bhutanese", BO: "Bolivian",
  BA: "Bosnian", BW: "Botswana", BR: "Brazilian", BN: "Bruneian", BG: "Bulgarian",
  BF: "Burkinabé", BI: "Burundian", KH: "Cambodian", CM: "Cameroonian", CA: "Canadian",
  CV: "Cape Verdean", CF: "Central African", TD: "Chadian", CL: "Chilean", CN: "Chinese",
  CO: "Colombian", KM: "Comorian", CG: "Congolese", CD: "Congolese (DRC)", CR: "Costa Rican",
  HR: "Croatian", CU: "Cuban", CY: "Cypriot", CZ: "Czech", DK: "Danish", DJ: "Djiboutian",
  DM: "Dominican", DO: "Dominican", EC: "Ecuadorian", EG: "Egyptian", SV: "Salvadoran",
  GQ: "Equatorial Guinean", ER: "Eritrean", EE: "Estonian", SZ: "Swazi", ET: "Ethiopian",
  FJ: "Fijian", FI: "Finnish", FR: "French", GA: "Gabonese", GM: "Gambian", GE: "Georgian",
  DE: "German", GH: "Ghanaian", GR: "Greek", GD: "Grenadian", GT: "Guatemalan",
  GN: "Guinean", GW: "Bissau-Guinean", GY: "Guyanese", HT: "Haitian", HN: "Honduran",
  HU: "Hungarian", IS: "Icelandic", IN: "Indian", ID: "Indonesian", IR: "Iranian",
  IQ: "Iraqi", IE: "Irish", IL: "Israeli", IT: "Italian", CI: "Ivorian", JM: "Jamaican",
  JP: "Japanese", JO: "Jordanian", KZ: "Kazakh", KE: "Kenyan", KI: "I-Kiribati",
  KP: "North Korean", KR: "South Korean", KW: "Kuwaiti", KG: "Kyrgyz", LA: "Laotian",
  LV: "Latvian", LB: "Lebanese", LS: "Basotho", LR: "Liberian", LY: "Libyan",
  LI: "Liechtensteiner", LT: "Lithuanian", LU: "Luxembourger", MG: "Malagasy",
  MW: "Malawian", MY: "Malaysian", MV: "Maldivian", ML: "Malian", MT: "Maltese",
  MH: "Marshallese", MR: "Mauritanian", MU: "Mauritian", MX: "Mexican", FM: "Micronesian",
  MD: "Moldovan", MC: "Monégasque", MN: "Mongolian", ME: "Montenegrin", MA: "Moroccan",
  MZ: "Mozambican", MM: "Burmese", NA: "Namibian", NR: "Nauruan", NP: "Nepalese",
  NL: "Dutch", NZ: "New Zealander", NI: "Nicaraguan", NE: "Nigerien", NG: "Nigerian",
  MK: "Macedonian", NO: "Norwegian", OM: "Omani", PK: "Pakistani", PW: "Palauan",
  PS: "Palestinian", PA: "Panamanian", PG: "Papua New Guinean", PY: "Paraguayan",
  PE: "Peruvian", PH: "Filipino", PL: "Polish", PT: "Portuguese", QA: "Qatari",
  RO: "Romanian", RU: "Russian", RW: "Rwandan", KN: "Kittitian", LC: "Saint Lucian",
  VC: "Vincentian", WS: "Samoan", SM: "Sammarinese", ST: "São Toméan", SA: "Saudi",
  SN: "Senegalese", RS: "Serbian", SC: "Seychellois", SL: "Sierra Leonean",
  SG: "Singaporean", SK: "Slovak", SI: "Slovenian", SB: "Solomon Islander",
  SO: "Somali", ZA: "South African", SS: "South Sudanese", ES: "Spanish",
  LK: "Sri Lankan", SD: "Sudanese", SR: "Surinamese", SE: "Swedish", CH: "Swiss",
  SY: "Syrian", TW: "Taiwanese", TJ: "Tajik", TZ: "Tanzanian", TH: "Thai",
  TL: "Timorese", TG: "Togolese", TO: "Tongan", TT: "Trinidadian", TN: "Tunisian",
  TR: "Turkish", TM: "Turkmen", TV: "Tuvaluan", UG: "Ugandan", UA: "Ukrainian",
  AE: "Emirati", GB: "British", US: "American", UY: "Uruguayan", UZ: "Uzbek",
  VU: "Vanuatuan", VA: "Vatican", VE: "Venezuelan", VN: "Vietnamese", YE: "Yemeni",
  ZM: "Zambian", ZW: "Zimbabwean"
};

// Country name → demonym (for backward compatibility with old data)
const COUNTRY_TO_DEMONYM = Country.getAllCountries().reduce((acc, c) => {
  acc[c.name] = NATIONALITY_DEMONYMS[c.isoCode] || c.name;
  return acc;
}, {});

// All demonyms sorted alphabetically for the filter dropdown
const ALL_DEMONYMS = Object.values(NATIONALITY_DEMONYMS).sort((a, b) => a.localeCompare(b));

// Convert stored nationality (may be country name OR demonym) into a demonym
const toDemonym = (raw) => {
  if (!raw) return '';
  if (COUNTRY_TO_DEMONYM[raw]) return COUNTRY_TO_DEMONYM[raw];
  return raw;
};

/* ------------------------------------------------------------
   Authenticated Avatar Component
   Fetches the image with Bearer token, converts to blob URL
------------------------------------------------------------ */
const TeacherAvatar = ({ photo, initials, size = 'md' }) => {
  const [blobUrl, setBlobUrl] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);
  const prevUrlRef = useRef(null);

  const sizeClasses = {
    sm: 'w-12 h-12 text-base rounded-lg',
    md: 'w-16 h-16 text-xl rounded-xl',
    lg: 'w-24 h-24 text-2xl rounded-2xl',
  };

  useEffect(() => {
    let cancelled = false;

    const fetchPhoto = async () => {
      if (!photo) {
        setBlobUrl(null);
        setError(false);
        return;
      }

      // If photo is a full URL (already complete), just use it directly
      if (photo.startsWith('http://') || photo.startsWith('https://')) {
        // still may need auth — check if it's our uploads path
        const isOurUploads = photo.includes('/uploads/');
        if (!isOurUploads) {
          setBlobUrl(photo);
          return;
        }
      }

      setLoading(true);
      setError(false);

      try {
        const token = localStorage.getItem('token');
        const response = await fetch(photo, {
          headers: token ? { Authorization: `Bearer ${token}` } : {},
        });
        if (!response.ok) throw new Error(`HTTP ${response.status}`);
        const blob = await response.blob();
        if (cancelled) return;
        const objectUrl = URL.createObjectURL(blob);

        // Revoke the previous blob URL
        if (prevUrlRef.current) URL.revokeObjectURL(prevUrlRef.current);
        prevUrlRef.current = objectUrl;
        setBlobUrl(objectUrl);
      } catch (err) {
        console.error('Avatar load error:', err);
        if (!cancelled) setError(true);
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    fetchPhoto();

    return () => {
      cancelled = true;
    };
  }, [photo]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (prevUrlRef.current) URL.revokeObjectURL(prevUrlRef.current);
    };
  }, []);

  // Loading spinner
  if (loading) {
    return (
      <div className={`${sizeClasses[size]} bg-gradient-to-br from-[#FF6B6B] to-[#FF8E53] flex items-center justify-center text-white font-bold flex-shrink-0 shadow-md`}>
        <Loader2 className="w-5 h-5 animate-spin text-white/80" />
      </div>
    );
  }

  // Successfully loaded photo
  if (blobUrl && !error) {
    return (
      <img
        src={blobUrl}
        alt="Teacher"
        className={`${sizeClasses[size]} object-cover flex-shrink-0 shadow-md border-2 border-white`}
        onError={() => setError(true)}
      />
    );
  }

  // Fallback: initials
  return (
    <div className={`${sizeClasses[size]} bg-gradient-to-br from-[#FF6B6B] to-[#FF8E53] flex items-center justify-center text-white font-bold flex-shrink-0 shadow-md`}>
      {initials}
    </div>
  );
};

const BrowseTeachersPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  
  const { users = [], loading: usersLoading } = useSelector((state) => state.allUsers);
  
  const [filteredTeachers, setFilteredTeachers] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState({
    location: '',
    experience: '',
    education: '',
    curriculum: '',
    position: '',
    languages: '',
    gender: '',
    nationality: '',
    residencyStatus: '',
    iqama: '',
    skills: ''
  });
  
  const [sortBy, setSortBy] = useState('recent');
  const [currentPage, setCurrentPage] = useState(1);
  const teachersPerPage = 9;
  const [favorites, setFavorites] = useState(new Set());

  useEffect(() => {
    dispatch(allUserAction());
  }, [dispatch]);

  useEffect(() => {
    const teachers = users.filter(user => user.role === 'candidate') || [];
    let result = [...teachers];
    
    // Apply search filter
    if (searchTerm) {
      result = result.filter(teacher => {
        const fullName = `${teacher.profile?.firstName || ''} ${teacher.profile?.lastName || ''}`.toLowerCase();
        const position = teacher.candidateData?.positionsInterested?.join(' ') || '';
        const skills = teacher.candidateData?.skills?.join(' ') || '';
        const degree = teacher.candidateData?.degree || '';
        const university = teacher.candidateData?.universityName || '';
        
        return (
          fullName.includes(searchTerm.toLowerCase()) ||
          position.toLowerCase().includes(searchTerm.toLowerCase()) ||
          skills.toLowerCase().includes(searchTerm.toLowerCase()) ||
          degree.toLowerCase().includes(searchTerm.toLowerCase()) ||
          university.toLowerCase().includes(searchTerm.toLowerCase())
        );
      });
    }
    
    // Apply location filter
    if (filters.location) {
      result = result.filter(teacher => 
        teacher.candidateData?.currentCity?.toLowerCase() === filters.location.toLowerCase() ||
        teacher.candidateData?.currentCityOther?.toLowerCase() === filters.location.toLowerCase()
      );
    }
    
    // Apply experience filter
    if (filters.experience) {
      const expValue = parseInt(filters.experience);
      result = result.filter(teacher => {
        const teacherExp = parseInt(teacher.candidateData?.totalExperience) || 0;
        return teacherExp >= expValue;
      });
    }
    
    // Apply education filter
    if (filters.education) {
      result = result.filter(teacher => 
        teacher.candidateData?.degree === filters.education ||
        teacher.candidateData?.degreeOther === filters.education
      );
    }
    
    // Apply curriculum filter
    if (filters.curriculum) {
      result = result.filter(teacher => 
        teacher.candidateData?.curriculumTaught?.includes(filters.curriculum)
      );
    }
    
    // Apply position filter
    if (filters.position) {
      result = result.filter(teacher => 
        teacher.candidateData?.positionsInterested?.includes(filters.position)
      );
    }
    
    // Apply languages filter
    if (filters.languages) {
      result = result.filter(teacher => 
        teacher.candidateData?.languages?.includes(filters.languages)
      );
    }
    
    // Apply skills filter
    if (filters.skills) {
      result = result.filter(teacher => 
        teacher.candidateData?.skills?.includes(filters.skills)
      );
    }
    
    // Apply gender filter
    if (filters.gender) {
      if (filters.gender === 'Both') {
        result = result.filter(teacher => {
          const gender = teacher.profile?.gender || teacher.candidateData?.gender || '';
          return gender === 'Male' || gender === 'Female';
        });
      } else {
        result = result.filter(teacher => {
          const gender = teacher.profile?.gender || teacher.candidateData?.gender || '';
          return gender === filters.gender;
        });
      }
    }
    
    // ✅ Apply nationality filter (demonym-to-demonym comparison)
    if (filters.nationality) {
      result = result.filter(teacher => {
        const raw = teacher.profile?.nationality || teacher.candidateData?.nationality || '';
        return toDemonym(raw) === filters.nationality;
      });
    }
    
    // Apply residency status filter
    if (filters.residencyStatus || filters.iqama) {
      const statusFilter = filters.residencyStatus || filters.iqama;
      result = result.filter(teacher => 
        teacher.candidateData?.iqama === statusFilter ||
        teacher.candidateData?.iqamaOther === statusFilter
      );
    }
    
    // Apply sorting
    switch (sortBy) {
      case 'recent':
        result.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
        break;
      case 'experience_high':
        result.sort((a, b) => 
          parseInt(b.candidateData?.totalExperience || 0) - 
          parseInt(a.candidateData?.totalExperience || 0)
        );
        break;
      case 'rating_high':
        result.sort((a, b) => (b.rating || 0) - (a.rating || 0));
        break;
      default:
        break;
    }
    
    setFilteredTeachers(result);
  }, [users, searchTerm, filters, sortBy]);

  // Get unique values for filter dropdowns
  const teachers = users.filter(user => user.role === 'candidate') || [];
  const locations = [...new Set(teachers.map(t => t.candidateData?.currentCity).filter(Boolean))];
  const experiences = [...new Set(teachers.map(t => t.candidateData?.totalExperience).filter(Boolean))];
  const educations = [...new Set(teachers.flatMap(t => [
    t.candidateData?.degree,
    t.candidateData?.degreeOther
  ]).filter(Boolean))];
  const curricula = [...new Set(teachers.flatMap(t => t.candidateData?.curriculumTaught || []).filter(Boolean))];
  const positions = [...new Set(teachers.flatMap(t => t.candidateData?.positionsInterested || []).filter(Boolean))];
  const languages = [...new Set(teachers.flatMap(t => t.candidateData?.languages || []).filter(Boolean))];
  const skillsList = [...new Set(teachers.flatMap(t => t.candidateData?.skills || []).filter(Boolean))];
  
  const genderOptions = ['Male', 'Female', 'Both'];
  
  const residencyStatuses = [...new Set(teachers.flatMap(t => [
    t.candidateData?.iqama,
    t.candidateData?.iqamaOther
  ]).filter(Boolean))];

  // Pagination
  const indexOfLastTeacher = currentPage * teachersPerPage;
  const indexOfFirstTeacher = indexOfLastTeacher - teachersPerPage;
  const currentTeachers = filteredTeachers.slice(indexOfFirstTeacher, indexOfLastTeacher);
  const totalPages = Math.ceil(filteredTeachers.length / teachersPerPage);

  const toggleFavorite = (teacherId, e) => {
    e.stopPropagation();
    setFavorites(prev => {
      const newFavorites = new Set(prev);
      if (newFavorites.has(teacherId)) {
        newFavorites.delete(teacherId);
        toast.info('Removed from favorites');
      } else {
        newFavorites.add(teacherId);
        toast.success('Added to favorites');
      }
      return newFavorites;
    });
  };

  const handleFilterChange = (filterName, value) => {
    setFilters(prev => ({ ...prev, [filterName]: value }));
    setCurrentPage(1);
  };

  const clearFilters = () => {
    setFilters({
      location: '', experience: '', education: '', curriculum: '',
      position: '', languages: '', gender: '', nationality: '',
      residencyStatus: '', iqama: '', skills: ''
    });
    setSearchTerm('');
    setCurrentPage(1);
    toast.info('All filters cleared');
  };

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  if (usersLoading) {
    return (
      <div className="min-h-screen mt-30 bg-gradient-to-br from-slate-50 to-pink-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-20 h-20 border-4 border-[#FF6B6B] border-t-transparent rounded-full animate-spin mx-auto mb-6"></div>
          <h2 className="text-2xl font-bold text-gray-800">Loading Teachers...</h2>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen mt-30 bg-gradient-to-br from-slate-50 to-pink-50">
      {/* Hero */}
      <div className="bg-gradient-to-r from-[#FF6B6B] to-[#FF8E53] text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">Browse Qualified Teachers</h1>
            <p className="text-xl opacity-90 max-w-3xl mx-auto">
              Connect with {filteredTeachers.length} verified educators ready for new opportunities in Saudi Arabia
            </p>
          </div>
        </div>
      </div>

      {/* Main */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Search + Filter Bar */}
        <div className="bg-white rounded-2xl shadow-xl p-6 mb-8">
          <div className="flex flex-col lg:flex-row gap-4 items-center justify-between">
            <div className="relative flex-1 w-full">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search teachers by name, position, skills, or university..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-pink-500 focus:border-transparent"
              />
            </div>

            <button
              onClick={() => setShowFilters(!showFilters)}
              className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-[#FF6B6B] to-[#FF8E53] text-white rounded-xl hover:shadow-lg transition-all duration-300"
            >
              <Filter className="w-5 h-5" />
              Filters
              {showFilters ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
            </button>

            <div className="relative">
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="px-4 py-3 border border-gray-300 rounded-xl appearance-none focus:ring-2 focus:ring-pink-500 focus:border-transparent"
              >
                <option value="recent">Most Recent</option>
                <option value="experience_high">Most Experienced</option>
                <option value="rating_high">Highest Rated</option>
              </select>
              <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" />
            </div>
          </div>

          {/* Filters Panel */}
          {showFilters && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="mt-6 pt-6 border-t border-gray-200"
            >
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {/* Location */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <MapPin className="inline w-4 h-4 mr-1" /> Location
                  </label>
                  <select
                    value={filters.location}
                    onChange={(e) => handleFilterChange('location', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500"
                  >
                    <option value="">All Locations</option>
                    {locations.map((loc, idx) => <option key={idx} value={loc}>{loc}</option>)}
                  </select>
                </div>

                {/* Experience */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <Briefcase className="inline w-4 h-4 mr-1" /> Min Experience (Years)
                  </label>
                  <select
                    value={filters.experience}
                    onChange={(e) => handleFilterChange('experience', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500"
                  >
                    <option value="">Any Experience</option>
                    {experiences.sort((a, b) => a - b).map((exp, idx) => (
                      <option key={idx} value={exp}>{exp} years</option>
                    ))}
                  </select>
                </div>

                {/* Education */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <GraduationCap className="inline w-4 h-4 mr-1" /> Education
                  </label>
                  <select
                    value={filters.education}
                    onChange={(e) => handleFilterChange('education', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500"
                  >
                    <option value="">Any Education</option>
                    {educations.map((edu, idx) => <option key={idx} value={edu}>{edu}</option>)}
                  </select>
                </div>

                {/* Gender */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <User className="inline w-4 h-4 mr-1" /> Gender
                  </label>
                  <select
                    value={filters.gender}
                    onChange={(e) => handleFilterChange('gender', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500"
                  >
                    <option value="">All Genders</option>
                    {genderOptions.map((g, idx) => <option key={idx} value={g}>{g}</option>)}
                  </select>
                </div>

                {/* ✅ Nationality — now DEMONYMS */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <Globe className="inline w-4 h-4 mr-1" /> Nationality
                  </label>
                  <select
                    value={filters.nationality}
                    onChange={(e) => handleFilterChange('nationality', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500"
                  >
                    <option value="">All Nationalities</option>
                    {ALL_DEMONYMS.map((nat, idx) => (
                      <option key={idx} value={nat}>{nat}</option>
                    ))}
                  </select>
                </div>

                {/* Residency Status */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <Shield className="inline w-4 h-4 mr-1" /> Residency Status
                  </label>
                  <select
                    value={filters.residencyStatus}
                    onChange={(e) => handleFilterChange('residencyStatus', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500"
                  >
                    <option value="">All Status</option>
                    {residencyStatuses.map((status, idx) => (
                      <option key={idx} value={status}>{status}</option>
                    ))}
                  </select>
                </div>

                {/* Position */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <Briefcase className="inline w-4 h-4 mr-1" /> Position Interested
                  </label>
                  <select
                    value={filters.position}
                    onChange={(e) => handleFilterChange('position', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500"
                  >
                    <option value="">All Positions</option>
                    {positions.map((pos, idx) => <option key={idx} value={pos}>{pos}</option>)}
                  </select>
                </div>

                {/* Curriculum */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <BookOpen className="inline w-4 h-4 mr-1" /> Curriculum
                  </label>
                  <select
                    value={filters.curriculum}
                    onChange={(e) => handleFilterChange('curriculum', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500"
                  >
                    <option value="">All Curricula</option>
                    {curricula.map((curr, idx) => <option key={idx} value={curr}>{curr}</option>)}
                  </select>
                </div>

                {/* Skills */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <Target className="inline w-4 h-4 mr-1" /> Skills
                  </label>
                  <select
                    value={filters.skills}
                    onChange={(e) => handleFilterChange('skills', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500"
                  >
                    <option value="">All Skills</option>
                    {skillsList.map((skill, idx) => <option key={idx} value={skill}>{skill}</option>)}
                  </select>
                </div>

                {/* Languages */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <Languages className="inline w-4 h-4 mr-1" /> Languages
                  </label>
                  <select
                    value={filters.languages}
                    onChange={(e) => handleFilterChange('languages', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500"
                  >
                    <option value="">All Languages</option>
                    {languages.map((lang, idx) => <option key={idx} value={lang}>{lang}</option>)}
                  </select>
                </div>
              </div>

              {Object.values(filters).some(v => v !== '' && v !== 'all') && (
                <div className="mt-6 flex justify-end">
                  <button
                    onClick={clearFilters}
                    className="flex items-center gap-2 px-4 py-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                  >
                    <X className="w-4 h-4" /> Clear All Filters
                  </button>
                </div>
              )}
            </motion.div>
          )}
        </div>

        {/* Results summary */}
        <div className="mb-6">
          <p className="text-gray-600">
            Showing <span className="font-bold text-[#FF6B6B]">{currentTeachers.length}</span> of{' '}
            <span className="font-bold text-[#FF6B6B]">{filteredTeachers.length}</span> teachers
            {searchTerm && ` for "${searchTerm}"`}
          </p>
        </div>

        {/* Grid */}
        {currentTeachers.length === 0 ? (
          <div className="text-center py-16 bg-white rounded-2xl shadow-lg">
            <Users className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-bold text-gray-700 mb-2">No teachers found</h3>
            <p className="text-gray-600 mb-6">Try adjusting your search or filters</p>
            <button
              onClick={clearFilters}
              className="px-6 py-3 bg-gradient-to-r from-[#FF6B6B] to-[#FF8E53] text-white rounded-xl hover:shadow-lg transition-all duration-300"
            >
              Clear All Filters
            </button>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {currentTeachers.map((teacher, index) => {
                const teacherData = teacher.candidateData || {};
                const fullName = `${teacher.profile?.firstName || ''} ${teacher.profile?.lastName || ''}`.trim() || 'Teacher';
                const position = teacherData.positionsInterested?.[0] || 'Teacher';
                const experience = teacherData.totalExperience || '0';
                const location = teacherData.currentCity || teacherData.currentCityOther || 'Saudi Arabia';
                const education = teacherData.degree === "Other"
                  ? teacherData.degreeOther
                  : teacherData.degree || 'Education';
                const skills = teacherData.skills?.slice(0, 4) || ['Teaching', 'Education'];
                const languages = teacherData.languages?.slice(0, 2) || ['English'];
                const curriculum = teacherData.curriculumTaught?.slice(0, 2) || ['International'];
                const gender = teacher.profile?.gender || teacherData.gender || 'Not specified';
                // ✅ Nationality shown as demonym
                const rawNationality = teacher.profile?.nationality || teacherData.nationality || '';
                const nationality = rawNationality ? toDemonym(rawNationality) : 'Not specified';
                const residencyStatus = teacherData.iqama || teacherData.iqamaOther || 'Not specified';
                const allPositions = teacherData.positionsInterested || [];
                const university = teacherData.universityName || '';
                const teacherId = teacher._id || teacher.id;

                // ✅ Build photo URL for authenticated fetch
                const photoUrl = teacher.profile?.photo
                  ? getImageUrl(teacher.profile.photo)
                  : null;
                const initials = `${teacher.profile?.firstName?.charAt(0) || 'T'}${teacher.profile?.lastName?.charAt(0) || ''}`;

                return (
                  <motion.div
                    key={teacherId || index}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="bg-white rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300 border border-gray-100 overflow-hidden flex flex-col h-full cursor-pointer"
                  >
                    {/* Header */}
                    <div className="bg-gradient-to-r from-pink-50 to-orange-50 p-6 relative">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          if (teacherId) toggleFavorite(teacherId, e);
                        }}
                        className="absolute top-4 right-4 z-10"
                      >
                        <Heart className={`w-6 h-6 transition-all duration-300 ${
                          favorites.has(teacherId)
                            ? 'fill-[#FF6B6B] text-[#FF6B6B]'
                            : 'text-gray-400 hover:text-[#FF6B6B]'
                        }`} />
                      </button>

                      <div className="flex items-start gap-4 mb-4">
                        {/* ✅ Real authenticated photo with initials fallback */}
                        <div className="relative">
                          <TeacherAvatar
                            photo={photoUrl}
                            initials={initials}
                            size="md"
                          />
                          {teacher.profile?.isVerified && (
                            <div className="absolute -bottom-1 -right-1 bg-emerald-500 rounded-full p-0.5 border-2 border-white">
                              <CheckCircle className="w-3 h-3 text-white" />
                            </div>
                          )}
                        </div>

                        <div className="flex-1 min-w-0">
                          <h3 className="text-lg font-bold text-gray-900 mb-1 truncate">{fullName}</h3>
                          <p className="text-[#FF6B6B] font-medium truncate">{position}</p>
                        </div>
                      </div>

                      <div className="flex flex-wrap gap-2">
                        <span className="px-3 py-1 bg-white text-[#FF6B6B] text-sm font-medium rounded-full border border-[#FF6B6B]">
                          {experience} {parseInt(experience) === 1 ? 'year' : 'years'} exp
                        </span>
                        <span className="px-3 py-1 bg-white text-emerald-600 text-sm font-medium rounded-full border border-emerald-200 truncate max-w-[150px]">
                          {education}
                        </span>
                        <span className="px-3 py-1 bg-white text-blue-600 text-sm font-medium rounded-full border border-blue-200">
                          {gender}
                        </span>
                      </div>
                    </div>

                    {/* Body */}
                    <div className="p-6 flex-1 flex flex-col">
                      <div className="space-y-3 mb-6">
                        <div className="flex items-start gap-3">
                          <MapPin className="w-5 h-5 text-gray-400 flex-shrink-0 mt-0.5" />
                          <span className="text-gray-700 truncate">{location}</span>
                        </div>

                        <div className="flex items-start gap-3">
                          <Globe className="w-5 h-5 text-gray-400 flex-shrink-0 mt-0.5" />
                          {/* ✅ Nationality shown as demonym */}
                          <span className="text-gray-700 truncate">{nationality}</span>
                        </div>

                        <div className="flex items-start gap-3">
                          <Shield className="w-5 h-5 text-gray-400 flex-shrink-0 mt-0.5" />
                          <span className="text-gray-700 truncate">{residencyStatus}</span>
                        </div>

                        {university && (
                          <div className="flex items-start gap-3">
                            <GraduationCap className="w-5 h-5 text-gray-400 flex-shrink-0 mt-0.5" />
                            <span className="text-gray-700 truncate">{university}</span>
                          </div>
                        )}

                        {allPositions.length > 0 && (
                          <div className="flex items-start gap-3">
                            <Briefcase className="w-5 h-5 text-gray-400 flex-shrink-0 mt-0.5" />
                            <div className="flex-1 min-w-0">
                              <span className="text-gray-900 font-semibold text-sm block">Positions</span>
                              <div className="flex flex-wrap gap-1 mt-1">
                                {allPositions.slice(0, 3).map((pos, idx) => (
                                  <span key={idx} className="px-2 py-1 bg-pink-100 text-pink-800 text-xs rounded truncate max-w-[100px]">
                                    {pos}
                                  </span>
                                ))}
                                {allPositions.length > 3 && (
                                  <span className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded">
                                    +{allPositions.length - 3}
                                  </span>
                                )}
                              </div>
                            </div>
                          </div>
                        )}

                        <div className="flex items-start gap-3">
                          <Languages className="w-5 h-5 text-gray-400 flex-shrink-0 mt-0.5" />
                          <div className="flex-1 min-w-0">
                            <span className="text-gray-900 font-semibold text-sm block">Languages</span>
                            <div className="flex flex-wrap gap-1 mt-1">
                              {languages.map((lang, idx) => (
                                <span key={idx} className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded">
                                  {lang}
                                </span>
                              ))}
                            </div>
                          </div>
                        </div>

                        {curriculum.length > 0 && curriculum[0] !== 'International' && (
                          <div className="flex items-start gap-3">
                            <BookOpen className="w-5 h-5 text-gray-400 flex-shrink-0 mt-0.5" />
                            <div className="flex-1 min-w-0">
                              <span className="text-gray-900 font-semibold text-sm block">Curriculum</span>
                              <div className="flex flex-wrap gap-1 mt-1">
                                {curriculum.map((curr, idx) => (
                                  <span key={idx} className="px-2 py-1 bg-purple-100 text-purple-800 text-xs rounded truncate max-w-[120px]">
                                    {curr}
                                  </span>
                                ))}
                              </div>
                            </div>
                          </div>
                        )}
                      </div>

                      {skills.length > 0 && skills[0] !== 'Teaching' && (
                        <div className="mt-auto">
                          <h4 className="font-semibold text-gray-900 mb-2 flex items-center gap-2">
                            <Target className="w-4 h-4 text-[#FF6B6B]" />
                            Key Skills
                          </h4>
                          <div className="flex flex-wrap gap-2">
                            {skills.map((skill, idx) => (
                              <span key={idx} className="px-3 py-1 bg-gray-100 text-gray-700 text-sm rounded-full truncate max-w-[120px]">
                                {skill}
                              </span>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  </motion.div>
                );
              })}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="mt-12 flex justify-center">
                <nav className="flex items-center gap-2">
                  <button
                    onClick={() => handlePageChange(currentPage - 1)}
                    disabled={currentPage === 1}
                    className={`px-4 py-2 rounded-lg ${
                      currentPage === 1
                        ? 'text-gray-400 cursor-not-allowed'
                        : 'text-[#FF6B6B] hover:bg-pink-50'
                    }`}
                  >
                    Previous
                  </button>

                  {[...Array(totalPages)].map((_, idx) => {
                    const pageNumber = idx + 1;
                    if (
                      pageNumber === 1 ||
                      pageNumber === totalPages ||
                      (pageNumber >= currentPage - 1 && pageNumber <= currentPage + 1)
                    ) {
                      return (
                        <button
                          key={idx}
                          onClick={() => handlePageChange(pageNumber)}
                          className={`w-10 h-10 rounded-lg font-medium ${
                            currentPage === pageNumber
                              ? 'bg-gradient-to-r from-[#FF6B6B] to-[#FF8E53] text-white'
                              : 'text-gray-700 hover:bg-gray-100'
                          }`}
                        >
                          {pageNumber}
                        </button>
                      );
                    } else if (
                      pageNumber === currentPage - 2 ||
                      pageNumber === currentPage + 2
                    ) {
                      return <span key={idx} className="px-2">...</span>;
                    }
                    return null;
                  })}

                  <button
                    onClick={() => handlePageChange(currentPage + 1)}
                    disabled={currentPage === totalPages}
                    className={`px-4 py-2 rounded-lg ${
                      currentPage === totalPages
                        ? 'text-gray-400 cursor-not-allowed'
                        : 'text-[#FF6B6B] hover:bg-pink-50'
                    }`}
                  >
                    Next
                  </button>
                </nav>
              </div>
            )}
          </>
        )}

        {/* CTA */}
        <div className="mt-16 text-center">
          <div className="bg-gradient-to-r from-pink-50 to-orange-50 rounded-2xl p-8">
            <Building className="w-16 h-16 text-[#FF6B6B] mx-auto mb-4" />
            <h3 className="text-2xl font-bold text-gray-900 mb-4">
              Looking to hire teachers for your school?
            </h3>
            <p className="text-gray-600 mb-6 max-w-2xl mx-auto">
              Join as a school to access our full database of qualified teachers and advanced hiring tools
            </p>
            <button
              onClick={() => navigate('/school-register')}
              className="px-8 py-4 bg-gradient-to-r from-[#FF6B6B] to-[#FF8E53] text-white font-bold rounded-2xl hover:shadow-2xl transition-all duration-300 inline-flex items-center gap-3 group"
            >
              Register Your School
              <ChevronRight className="w-5 h-5 group-hover:translate-x-2 transition-transform" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BrowseTeachersPage;