import React, { useState, useEffect, useCallback, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'react-toastify';
import {
  Users, MapPin, Briefcase, GraduationCap, Filter, Search,
  CheckCircle, Building, Languages, Target, BookOpen,
  Calendar, Clock, ChevronRight, X, ChevronDown, ChevronUp,
  Mail, Phone, Globe, Heart, User, Shield, Download, Eye,
  Lock, Loader2, AlertCircle, FileText, MessageSquare,
  Sparkles, BadgeCheck, TrendingUp, Zap, Crown, SlidersHorizontal,
  LayoutGrid, List, Bookmark, BookmarkCheck, ArrowUpRight,
  Plane, Wallet, HeartPulse, IdCard, BarChart3, School,
  Trophy, ScrollText, Crosshair, Activity, Award, Database,
  CircleDot
} from 'lucide-react';
import { allUserAction, getUserDetails } from '../../actions/userActions';
import { getMySubscription, decreaseCvCount } from '../../actions/subscriptionActions';
import { DECREASE_CV_COUNT_RESET } from '../../constants/subscriptionConstants';
import { Country } from 'country-state-city';

const API_BASE_URL = 'https://theteachingpath.com';

// Helper to build full image URL
const getImageUrl = (filename) => {
  if (!filename) return null;
  if (filename.startsWith('http://') || filename.startsWith('https://')) return filename;
  return `${API_BASE_URL}/uploads/images/${filename}`;
};

// ------------------------------------------------------------
// Nationality demonyms — same map as TeacherRegister.jsx
// ------------------------------------------------------------
const NATIONALITY_DEMONYMS = {
  AF: "Afghan", AL: "Albanian", DZ: "Algerian", AD: "Andorran", AO: "Angolan",
  AR: "Argentine", AM: "Armenian", AU: "Australian", AT: "Austrian", AZ: "Azerbaijani",
  BS: "Bahamian", BH: "Bahraini", BD: "Bangladeshi", BB: "Barbadian", BY: "Belarusian",
  BE: "Belgian", BZ: "Belizean", BJ: "Beninese", BT: "Bhutanese", BO: "Bolivian",
  BA: "Bosnian", BW: "Botswana", BR: "Brazilian", BN: "Burneian", BG: "Bulgarian",
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

const COUNTRY_TO_DEMONYM = Country.getAllCountries().reduce((acc, c) => {
  acc[c.name] = NATIONALITY_DEMONYMS[c.isoCode] || c.name;
  return acc;
}, {});

const ALL_DEMONYMS = Object.values(NATIONALITY_DEMONYMS).sort((a, b) => a.localeCompare(b));

const toDemonym = (raw) => {
  if (!raw) return '';
  if (COUNTRY_TO_DEMONYM[raw]) return COUNTRY_TO_DEMONYM[raw];
  return raw;
};

/* ============================================================
   Reusable UI
============================================================ */
const SectionBlock = ({ title, icon: Icon, tone = 'teal', children }) => {
  const tones = {
    teal:    'bg-teal-50/70 border-teal-100 text-teal-700',
    indigo:  'bg-indigo-50/70 border-indigo-100 text-indigo-700',
    emerald: 'bg-emerald-50/70 border-emerald-100 text-emerald-700',
    cyan:    'bg-cyan-50/70 border-cyan-100 text-cyan-700',
    violet:  'bg-violet-50/70 border-violet-100 text-violet-700',
    amber:   'bg-amber-50/70 border-amber-100 text-amber-700',
    slate:   'bg-slate-50/70 border-slate-100 text-slate-700',
    rose:    'bg-rose-50/70 border-rose-100 text-rose-700',
    sky:     'bg-sky-50/70 border-sky-100 text-sky-700',
  };
  return (
    <div className={`rounded-xl p-3 border ${tones[tone]}`}>
      <div className="flex items-center gap-1.5 mb-2">
        <Icon className="w-3.5 h-3.5" />
        <span className="text-[10px] font-bold uppercase tracking-wider">{title}</span>
      </div>
      <div className="grid grid-cols-2 gap-x-3 gap-y-2">{children}</div>
    </div>
  );
};

const DTile = ({ icon: Icon, label, value, subValue }) => {
  if (value === undefined || value === null || value === '' || value === 'Not specified') return null;
  const displayValue = typeof value === 'boolean' ? (value ? 'Yes' : 'No') : value;
  return (
    <div className="flex items-start gap-2 min-w-0">
      {Icon && <Icon className="w-3 h-3 text-slate-400 flex-shrink-0 mt-0.5" />}
      <div className="min-w-0 flex-1">
        <p className="text-[9px] uppercase tracking-wider text-slate-500 font-semibold">{label}</p>
        <p className="text-[11px] font-semibold text-slate-800 break-words">{displayValue}</p>
        {subValue && <p className="text-[10px] text-slate-500 break-words">{subValue}</p>}
      </div>
    </div>
  );
};

const FilterSelect = ({ icon: Icon, label, value, onChange, options, placeholder, renderOption }) => (
  <div>
    <label className="flex items-center gap-1.5 text-xs font-semibold text-slate-600 uppercase tracking-wider mb-1.5">
      <Icon className="w-3.5 h-3.5" /> {label}
    </label>
    <div className="relative">
      <select value={value} onChange={(e) => onChange(e.target.value)}
        className="appearance-none w-full px-3 py-2.5 pr-9 border border-slate-200 rounded-xl bg-slate-50 focus:bg-white focus:ring-2 focus:ring-teal-500/40 focus:border-teal-500 text-sm transition">
        <option value="">{placeholder}</option>
        {options.map((opt, i) => (
          <option key={i} value={opt}>{renderOption ? renderOption(opt) : opt}</option>
        ))}
      </select>
      <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
    </div>
  </div>
);

const Chip = ({ children, tone = 'slate' }) => {
  const tones = {
    slate:   'bg-slate-100 text-slate-700 border-slate-200',
    teal:    'bg-teal-50 text-teal-700 border-teal-200',
    emerald: 'bg-emerald-50 text-emerald-700 border-emerald-200',
    indigo:  'bg-indigo-50 text-indigo-700 border-indigo-200',
    violet:  'bg-violet-50 text-violet-700 border-violet-200',
    cyan:    'bg-cyan-50 text-cyan-700 border-cyan-200',
    amber:   'bg-amber-50 text-amber-700 border-amber-200',
    rose:    'bg-rose-50 text-rose-700 border-rose-200',
  };
  return (
    <span className={`inline-flex items-center gap-1 px-2.5 py-1 text-xs rounded-full border font-medium ${tones[tone]}`}>
      {children}
    </span>
  );
};

/* ============================================================
   Authenticated Avatar Component
============================================================ */
const TeacherAvatar = ({ photo, initials, size = 'md' }) => {
  const [blobUrl, setBlobUrl] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);
  const prevUrlRef = useRef(null);

  const sizeClasses = {
    sm: 'w-12 h-12 text-base rounded-lg',
    md: 'w-16 h-16 text-xl rounded-2xl',
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

      if (
        (photo.startsWith('http://') || photo.startsWith('https://')) &&
        !photo.includes('/uploads/')
      ) {
        setBlobUrl(photo);
        return;
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

  useEffect(() => {
    return () => {
      if (prevUrlRef.current) URL.revokeObjectURL(prevUrlRef.current);
    };
  }, []);

  if (loading) {
    return (
      <div className={`${sizeClasses[size]} bg-gradient-to-br from-teal-500 to-indigo-600 flex items-center justify-center text-white font-bold flex-shrink-0 shadow-md`}>
        <Loader2 className="w-5 h-5 animate-spin text-white/80" />
      </div>
    );
  }

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

  return (
    <div className={`${sizeClasses[size]} bg-gradient-to-br from-teal-500 to-indigo-600 flex items-center justify-center text-white font-bold flex-shrink-0 shadow-md`}>
      {initials}
    </div>
  );
};

/* ============================================================
   Main
============================================================ */
const TeachersDatabase = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { users = [], loading: usersLoading } = useSelector((s) => s.allUsers);
  const { usageStats } = useSelector((s) => s.getMySubscription || {});
  const { success: decreaseSuccess, loading: decreaseLoading } = useSelector((s) => s.decreaseCvCount || {});
  const { user: fullUser } = useSelector((s) => s.getSingleUser || {});

  const currentCvsRemaining = usageStats?.remainingCvs ?? 0;
  const monthlyLimit = usageStats?.totalCvsLimit ?? 0;

  const [filteredTeachers, setFilteredTeachers] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState({
    location: '', experience: '', education: '', curriculum: '',
    position: '', languages: '', gender: '', nationality: '',
    residencyStatus: '', skills: ''
  });
  const [sortBy, setSortBy] = useState('recent');
  const [currentPage, setCurrentPage] = useState(1);
  const teachersPerPage = 9;
  const [favorites, setFavorites] = useState(new Set());
  
  const [downloadingCv, setDownloadingCv] = useState({});
  
  const [unlockedTeachers, setUnlockedTeachers] = useState({});
  const [loadingTeacher, setLoadingTeacher] = useState({});
  const [confirmModal, setConfirmModal] = useState(null);

  useEffect(() => {
    dispatch(allUserAction());
    dispatch(getMySubscription());
  }, [dispatch]);

  useEffect(() => () => dispatch({ type: DECREASE_CV_COUNT_RESET }), [dispatch]);

  useEffect(() => {
    if (decreaseSuccess) {
      dispatch(getMySubscription());
      dispatch({ type: DECREASE_CV_COUNT_RESET });
    }
  }, [decreaseSuccess, dispatch]);

  useEffect(() => {
    const list = users.filter((u) => u.role === 'candidate') || [];
    let result = [...list];
    if (searchTerm) {
      const s = searchTerm.toLowerCase();
      result = result.filter((t) => {
        const fullName = `${t.profile?.firstName || ''} ${t.profile?.lastName || ''}`.toLowerCase();
        const position = (t.candidateData?.positionsInterested || []).join(' ').toLowerCase();
        const skills = (t.candidateData?.skills || []).join(' ').toLowerCase();
        const degree = (t.candidateData?.degree || '').toLowerCase();
        const university = (t.candidateData?.universityName || '').toLowerCase();
        return fullName.includes(s) || position.includes(s) || skills.includes(s) || degree.includes(s) || university.includes(s);
      });
    }
    if (filters.location) {
      result = result.filter((t) => t.candidateData?.currentCity?.toLowerCase() === filters.location.toLowerCase());
    }
    if (filters.experience) {
      const expValue = parseInt(filters.experience);
      result = result.filter((t) => (parseInt(t.candidateData?.totalExperience) || 0) >= expValue);
    }
    if (filters.education) {
      result = result.filter((t) => t.candidateData?.degree === filters.education);
    }
    if (filters.curriculum) {
      result = result.filter((t) => t.candidateData?.curriculumTaught?.includes(filters.curriculum));
    }
    if (filters.position) {
      result = result.filter((t) => t.candidateData?.positionsInterested?.includes(filters.position));
    }
    if (filters.languages) {
      result = result.filter((t) => t.candidateData?.languages?.includes(filters.languages));
    }
    if (filters.skills) {
      result = result.filter((t) => t.candidateData?.skills?.includes(filters.skills));
    }
    if (filters.gender) {
      if (filters.gender === 'Both') {
        result = result.filter((t) => {
          const g = t.profile?.gender || t.candidateData?.gender || '';
          return g === 'Male' || g === 'Female';
        });
      } else {
        result = result.filter((t) => {
          const g = t.profile?.gender || t.candidateData?.gender || '';
          return g === filters.gender;
        });
      }
    }
    if (filters.nationality) {
      result = result.filter((t) => {
        const raw = t.profile?.nationality || t.candidateData?.nationality || '';
        return toDemonym(raw) === filters.nationality;
      });
    }
    if (filters.residencyStatus) {
      result = result.filter((t) => t.candidateData?.iqama === filters.residencyStatus);
    }

    switch (sortBy) {
      case 'recent': result.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)); break;
      case 'experience_high': result.sort((a, b) =>
        parseInt(b.candidateData?.totalExperience || 0) - parseInt(a.candidateData?.totalExperience || 0)); break;
      default: break;
    }
    setFilteredTeachers(result);
  }, [users, searchTerm, filters, sortBy]);

  const teachers = users.filter((u) => u.role === 'candidate') || [];
  const unique = (a) => [...new Set(a.filter(Boolean))];
  const locations = unique(teachers.map((t) => t.candidateData?.currentCity));
  const experiences = unique(teachers.map((t) => t.candidateData?.totalExperience));
  const educations = unique(teachers.map((t) => t.candidateData?.degree));
  const curricula = unique(teachers.flatMap((t) => t.candidateData?.curriculumTaught || []));
  const positions = unique(teachers.flatMap((t) => t.candidateData?.positionsInterested || []));
  const languages = unique(teachers.flatMap((t) => t.candidateData?.languages || []));
  const skillsList = unique(teachers.flatMap((t) => t.candidateData?.skills || []));
  const residencyStatuses = unique(teachers.map((t) => t.candidateData?.iqama));

  const indexOfLast = currentPage * teachersPerPage;
  const indexOfFirst = indexOfLast - teachersPerPage;
  const currentTeachers = filteredTeachers.slice(indexOfFirst, indexOfLast);
  const totalPages = Math.ceil(filteredTeachers.length / teachersPerPage);

  const activeFilterCount = Object.values(filters).filter((v) => v && v !== 'all').length;

  const toggleFavorite = (id, e) => {
    e.stopPropagation();
    setFavorites((prev) => {
      const n = new Set(prev);
      if (n.has(id)) { n.delete(id); toast.info('Removed from favorites'); }
      else { n.add(id); toast.success('Added to favorites'); }
      return n;
    });
  };

  const handleFilterChange = (n, v) => { setFilters((p) => ({ ...p, [n]: v })); setCurrentPage(1); };
  const clearFilters = () => {
    setFilters({ location: '', experience: '', education: '', curriculum: '', position: '', languages: '', gender: '', nationality: '', residencyStatus: '', skills: '' });
    setSearchTerm(''); setCurrentPage(1); toast.info('All filters cleared');
  };
  const handlePageChange = (p) => { setCurrentPage(p); window.scrollTo({ top: 0, behavior: 'smooth' }); };

  const requestReveal = (teacher) => {
    if (currentCvsRemaining <= 0) {
      toast.error('No CV downloads remaining this month. Please upgrade your plan.');
      navigate('/membership-plans');
      return;
    }
    setConfirmModal(teacher);
  };

  const confirmReveal = async () => {
    if (!confirmModal) return;
    const teacherId = confirmModal._id || confirmModal.id;
    setConfirmModal(null);

    if (unlockedTeachers[teacherId]) return;
    if (currentCvsRemaining <= 0) {
      toast.error('No CV downloads remaining this month.'); return;
    }

    setLoadingTeacher((p) => ({ ...p, [teacherId]: true }));
    try {
      const result = await dispatch(decreaseCvCount());
      if (!result?.success) throw new Error(result?.error || 'Failed to deduct CV count');
      await dispatch(getUserDetails(teacherId));
      await dispatch(getMySubscription());
      setUnlockedTeachers((p) => ({ ...p, [teacherId]: true }));
      toast.success(`Contact & documents unlocked! ${result.remaining} CV${result.remaining === 1 ? '' : 's'} remaining.`);
    } catch (err) {
      console.error('Reveal error:', err);
      toast.error(err.message || 'Failed to unlock. Please try again.');
    } finally {
      setLoadingTeacher((p) => ({ ...p, [teacherId]: false }));
    }
  };

  const handleDownloadCv = async (teacher) => {
    const teacherId = teacher._id || teacher.id;
    if (!unlockedTeachers[teacherId]) { requestReveal(teacher); return; }
    
    const cvFile = teacher.candidateData?.cv;
    const candidateName = teacher.profile?.firstName || 'This candidate';

    if (!cvFile || cvFile.trim() === '') { 
      toast.error(`${candidateName} has not attached a resume.`); 
      return; 
    }

    // ✅ Check BOTH cv and resumes folders
    let possibleUrls = [];
    if (cvFile.startsWith('http://') || cvFile.startsWith('https://')) {
      possibleUrls = [cvFile];
    } else if (cvFile.includes('/')) {
      possibleUrls = [`${API_BASE_URL}/${cvFile.replace(/^\/+/, '')}`];
    } else {
      possibleUrls = [
        `${API_BASE_URL}/uploads/documents/cv/${cvFile}`,
        `${API_BASE_URL}/uploads/documents/resumes/${cvFile}`,
        `${API_BASE_URL}/uploads/cv/${cvFile}`
      ];
    }

    setDownloadingCv((p) => ({ ...p, [teacherId]: true }));

    try {
      let validUrl = null;
      for (const url of possibleUrls) {
        console.log('🔍 Checking URL:', url);
        try {
          const res = await fetch(url, { method: 'HEAD' });
          const contentType = res.headers.get('content-type') || '';
          if (res.ok && !contentType.includes('text/html')) {
            validUrl = url;
            break;
          }
        } catch (e) {
          console.warn('HEAD request failed for:', url);
        }
      }

      if (validUrl) {
        console.log('✅ Found file at:', validUrl);
        window.open(validUrl, '_blank', 'noopener,noreferrer');
        toast.success('Opening CV...');
      } else {
        console.log('⚠️ Could not verify via HEAD, trying direct open:', possibleUrls[0]);
        window.open(possibleUrls[0], '_blank', 'noopener,noreferrer');
        toast.info('If the CV does not open, please check your backend routing.');
      }
    } catch (err) {
      console.error('Download error:', err);
      toast.error('Failed to open CV. Please try again.');
    } finally {
      setDownloadingCv((p) => ({ ...p, [teacherId]: false }));
    }
  };

  const getFullTeacher = (teacher) => {
    const id = teacher._id || teacher.id;
    if (fullUser && fullUser._id === id) return { ...teacher, ...fullUser };
    return teacher;
  };

  const getInitials = (t) =>
    `${t.profile?.firstName?.charAt(0) || 'T'}${t.profile?.lastName?.charAt(0) || ''}`;

  const formatDate = (ds) => {
    if (!ds) return 'Not specified';
    try {
      const d = typeof ds === 'object' && ds.$date ? new Date(ds.$date) : new Date(ds);
      if (isNaN(d.getTime())) return 'Not specified';
      return d.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
    } catch { return 'Not specified'; }
  };

  if (usersLoading) {
    return (
      <div className="min-h-screen mt-30 bg-gradient-to-br from-slate-50 to-teal-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-20 h-20 border-4 border-teal-500 border-t-transparent rounded-full animate-spin mx-auto mb-6" />
          <h2 className="text-2xl font-bold text-slate-800">Loading Teachers...</h2>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen mt-30 bg-gradient-to-br from-slate-50 via-teal-50/40 to-indigo-50/60">
      {/* HERO */}
      <div className="relative overflow-hidden bg-gradient-to-r from-teal-600 via-cyan-600 to-indigo-600 text-white">
        <div className="absolute -top-20 -right-20 w-72 h-72 bg-white/10 rounded-full blur-2xl" />
        <div className="absolute -bottom-24 -left-24 w-80 h-80 bg-white/10 rounded-full blur-2xl" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-8">
            <div className="max-w-2xl">
              <div className="inline-flex items-center gap-2 bg-white/20 px-3 py-1.5 rounded-full text-xs font-semibold mb-4 border border-white/30">
                <Sparkles className="w-3.5 h-3.5" /> {filteredTeachers.length} verified educators
              </div>
              <h1 className="text-4xl md:text-5xl font-bold mb-3 tracking-tight">Teachers Database</h1>
              <p className="text-lg text-white/90">
                Browse complete teacher profiles. Only contact details & CV are locked.
              </p>
            </div>
            <div className="bg-white/15 backdrop-blur-md rounded-2xl p-5 border border-white/30 min-w-[260px] shadow-2xl">
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 bg-white/25 rounded-2xl flex items-center justify-center">
                  <Download className="w-7 h-7" />
                </div>
                <div>
                  <p className="text-xs text-white/80 uppercase tracking-wider font-semibold">CV Downloads Left</p>
                  <p className="text-4xl font-bold leading-none mt-1">{currentCvsRemaining}</p>
                  <p className="text-xs text-white/70 mt-1">Monthly limit: {monthlyLimit}</p>
                </div>
              </div>
              <div className="mt-4 h-1.5 bg-white/20 rounded-full overflow-hidden">
                <div className="h-full bg-white rounded-full transition-all"
                  style={{ width: `${monthlyLimit ? (currentCvsRemaining / monthlyLimit) * 100 : 0}%` }} />
              </div>
              {currentCvsRemaining <= 0 && (
                <button onClick={() => navigate('/membership-plans')}
                  className="mt-4 w-full text-xs bg-white text-teal-700 font-bold py-2.5 rounded-xl hover:bg-slate-100 transition flex items-center justify-center gap-1.5">
                  <Crown className="w-3.5 h-3.5" /> Upgrade Plan
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        {/* SEARCH */}
        <div className="bg-white rounded-2xl shadow-xl p-5 mb-8 border border-slate-100">
          <div className="flex flex-col lg:flex-row gap-4 items-stretch lg:items-center">
            <div className="relative flex-1">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
              <input type="text" placeholder="Search by name, position, skills, or university…"
                value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-12 pr-10 py-3.5 border border-slate-200 rounded-xl focus:ring-2 focus:ring-teal-500/50 focus:border-teal-500 bg-slate-50 focus:bg-white transition" />
            </div>
            <button onClick={() => setShowFilters(!showFilters)}
              className="flex items-center justify-center gap-2 px-5 py-3.5 bg-gradient-to-r from-teal-600 to-cyan-600 text-white rounded-xl font-semibold hover:shadow-lg transition-all">
              <SlidersHorizontal className="w-4 h-4" /> Filters
              {activeFilterCount > 0 && (
                <span className="ml-1 bg-white text-teal-700 text-[10px] font-bold rounded-full w-5 h-5 flex items-center justify-center">
                  {activeFilterCount}
                </span>
              )}
            </button>
            <div className="relative">
              <select value={sortBy} onChange={(e) => setSortBy(e.target.value)}
                className="appearance-none pl-4 pr-10 py-3.5 border border-slate-200 rounded-xl bg-white">
                <option value="recent">Most Recent</option>
                <option value="experience_high">Most Experienced</option>
              </select>
              <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
            </div>
          </div>

          <AnimatePresence>
            {showFilters && (
              <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }} className="overflow-hidden">
                <div className="mt-6 pt-6 border-t border-slate-200">
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                    <FilterSelect icon={MapPin} label="Location" value={filters.location}
                      onChange={(v) => handleFilterChange('location', v)} options={locations} placeholder="All Locations" />
                    <FilterSelect icon={Briefcase} label="Min Experience" value={filters.experience}
                      onChange={(v) => handleFilterChange('experience', v)}
                      options={experiences.sort((a, b) => a - b)} placeholder="Any"
                      renderOption={(e) => `${e} years`} />
                    <FilterSelect icon={GraduationCap} label="Education" value={filters.education}
                      onChange={(v) => handleFilterChange('education', v)} options={educations} placeholder="Any" />
                    <FilterSelect icon={User} label="Gender" value={filters.gender}
                      onChange={(v) => handleFilterChange('gender', v)} options={['Male', 'Female', 'Both']} placeholder="All" />
                    <FilterSelect icon={Globe} label="Nationality" value={filters.nationality}
                      onChange={(v) => handleFilterChange('nationality', v)} options={ALL_DEMONYMS} placeholder="All" />
                    <FilterSelect icon={Shield} label="Residency" value={filters.residencyStatus}
                      onChange={(v) => handleFilterChange('residencyStatus', v)} options={residencyStatuses} placeholder="All" />
                    <FilterSelect icon={Briefcase} label="Position" value={filters.position}
                      onChange={(v) => handleFilterChange('position', v)} options={positions} placeholder="All" />
                    <FilterSelect icon={BookOpen} label="Curriculum" value={filters.curriculum}
                      onChange={(v) => handleFilterChange('curriculum', v)} options={curricula} placeholder="All" />
                    <FilterSelect icon={Target} label="Skills" value={filters.skills}
                      onChange={(v) => handleFilterChange('skills', v)} options={skillsList} placeholder="All" />
                    <FilterSelect icon={Languages} label="Languages" value={filters.languages}
                      onChange={(v) => handleFilterChange('languages', v)} options={languages} placeholder="All" />
                  </div>
                  {activeFilterCount > 0 && (
                    <div className="mt-5 flex justify-end">
                      <button onClick={clearFilters}
                        className="flex items-center gap-2 px-4 py-2 text-rose-600 hover:bg-rose-50 rounded-lg transition font-medium">
                        <X className="w-4 h-4" /> Clear All Filters
                      </button>
                    </div>
                  )}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <div className="flex items-center justify-between mb-6">
          <p className="text-slate-600 text-sm">
            Showing <span className="font-bold text-teal-700">{currentTeachers.length}</span> of{' '}
            <span className="font-bold text-teal-700">{filteredTeachers.length}</span> teachers
          </p>
        </div>

        {currentTeachers.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-2xl shadow-lg">
            <Users className="w-16 h-16 text-teal-600 mx-auto mb-5" />
            <h3 className="text-xl font-bold text-slate-800 mb-2">No teachers found</h3>
            <button onClick={clearFilters}
              className="px-6 py-3 bg-gradient-to-r from-teal-600 to-cyan-600 text-white rounded-xl font-semibold">
              Clear All Filters
            </button>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 auto-rows-fr">
              {currentTeachers.map((teacher, index) => {
                const teacherId = teacher._id || teacher.id;
                const isUnlocked = !!unlockedTeachers[teacherId];
                const isBusy = loadingTeacher[teacherId] || decreaseLoading;
                const full = isUnlocked ? getFullTeacher(teacher) : teacher;

                const p = full.profile || {};
                const d = full.candidateData || {};

                const isVerified = p.isVerified;
                const isFav = favorites.has(teacherId);

                const photoUrl = p.photo ? getImageUrl(p.photo) : null;
                const initials = getInitials(full);

                const rawNationality = p.nationality || d.nationality || '';
                const demonymNationality = rawNationality ? toDemonym(rawNationality) : 'Not specified';

                return (
                  <motion.div key={teacherId || index}
                    initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: Math.min(index * 0.04, 0.4) }}
                    className="group bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 border border-slate-100 overflow-hidden flex flex-col h-full">

                    {/* HEADER */}
                    <div className="relative bg-gradient-to-br from-teal-50 via-cyan-50 to-indigo-50 p-5 flex-shrink-0">
                      <div className="absolute top-3 right-3 flex items-center gap-1.5">
                        {isVerified && (
                          <div className="bg-white rounded-full p-1.5 shadow-sm border border-emerald-100">
                            <BadgeCheck className="w-4 h-4 text-emerald-500" />
                          </div>
                        )}
                        <button onClick={(e) => toggleFavorite(teacherId, e)}
                          className="bg-white rounded-full p-1.5 shadow-sm border border-slate-100 hover:scale-110 transition">
                          {isFav
                            ? <BookmarkCheck className="w-4 h-4 text-teal-600" />
                            : <Bookmark className="w-4 h-4 text-slate-400" />}
                        </button>
                      </div>

                      <div className="flex items-start gap-4">
                        <div className="relative flex-shrink-0">
                          <TeacherAvatar photo={photoUrl} initials={initials} size="md" />
                          {isVerified && (
                            <div className="absolute -bottom-1 -right-1 bg-emerald-500 rounded-full p-0.5 border-2 border-white">
                              <CheckCircle className="w-3 h-3 text-white" />
                            </div>
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <h3 className="text-base font-bold text-slate-900 truncate">
                            {p.firstName} {p.middleName} {p.lastName}
                          </h3>
                          <p className="text-sm text-teal-700 font-medium truncate">
                            {d.positionsInterested?.[0] || 'Teacher'}
                          </p>
                          <div className="flex items-center gap-1 mt-1.5 text-xs text-slate-500">
                            <MapPin className="w-3 h-3" />
                            <span className="truncate">{d.currentCity}</span>
                          </div>
                        </div>
                      </div>

                      <div className="flex flex-wrap gap-1.5 mt-4">
                        <Chip tone="teal">
                          <TrendingUp className="w-3 h-3" />
                          {d.totalExperience || 0} yrs
                        </Chip>
                        <Chip tone="emerald">
                          <GraduationCap className="w-3 h-3" />
                          <span className="truncate max-w-[110px]">{d.degree}</span>
                        </Chip>
                        <Chip tone="indigo">
                          <User className="w-3 h-3" />
                          {d.gender}
                        </Chip>
                        {d.iqama && (
                          <Chip tone="violet">
                            <Shield className="w-3 h-3" />
                            <span className="truncate max-w-[110px]">{d.iqama}</span>
                          </Chip>
                        )}
                      </div>
                    </div>

                    {/* SCROLLABLE DETAILS */}
                    <div className="p-5 space-y-3 flex-1 overflow-y-auto max-h-[520px] scrollbar-thin scrollbar-thumb-slate-300 scrollbar-track-transparent">
                      <SectionBlock title="Personal" icon={User} tone="teal">
                        <DTile icon={User} label="First Name" value={p.firstName} />
                        <DTile icon={User} label="Middle Name" value={d.middleName} />
                        <DTile icon={User} label="Last Name" value={p.lastName} />
                        <DTile icon={User} label="Gender" value={d.gender} />
                        <DTile icon={Calendar} label="Date of Birth" value={formatDate(d.dob)} />
                        <DTile icon={Heart} label="Marital Status" value={d.maritalStatus} />
                        <DTile icon={Globe} label="Nationality" value={demonymNationality} />
                      </SectionBlock>

                      <SectionBlock title="Location" icon={Globe} tone="emerald">
                        <DTile icon={Globe} label="Country" value={d.countryOfResidence} />
                        <DTile icon={MapPin} label="Current City" value={d.currentCity} />
                        <DTile icon={Plane} label="Willing to Relocate" value={d.willingRelocateCity} />
                        <DTile icon={Shield} label="Iqama" value={d.iqama} />
                        <DTile icon={Calendar} label="Available From" value={formatDate(d.availableFrom)} />
                      </SectionBlock>

                      <SectionBlock title="Education" icon={GraduationCap} tone="indigo">
                        <DTile icon={GraduationCap} label="Degree" value={d.degree} />
                        <DTile icon={School} label="University" value={d.universityName} />
                        <DTile icon={MapPin} label="University Location" value={d.universityLocation} />
                      </SectionBlock>

                      <SectionBlock title="Experience" icon={Briefcase} tone="violet">
                        <DTile icon={TrendingUp} label="Total Experience" value={`${d.totalExperience || 0} years`} />
                        <DTile icon={School} label="Current Institution" value={d.currentInstitution} />
                        <DTile icon={Building} label="Previous Institution" value={d.previousInstitution} />
                        <DTile icon={Wallet} label="Expected Salary" value={d.expectedSalary ? `${d.expectedSalary} SAR` : null} />
                      </SectionBlock>

                      <SectionBlock title="Certifications" icon={Award} tone="amber">
                        <DTile icon={Award} label="English Certificate" value={d.englishCert} />
                        <DTile icon={Award} label="Teaching License" value={d.teachingLicense} />
                        <DTile icon={BookOpen} label="Teaching Diploma" value={d.teachingDiploma} />
                        <DTile icon={Zap} label="STEM Knowledge" value={d.stemKnowledge} />
                        <DTile icon={Zap} label="STEM Certified" value={d.stemCertified} />
                      </SectionBlock>

                      {d.positionsInterested?.length > 0 && (
                        <SectionBlock title="Positions Interested In" icon={Crosshair} tone="rose">
                          <div className="col-span-2 flex flex-wrap gap-1">
                            {d.positionsInterested.map((pos, i) => (
                              <span key={i} className="px-2 py-0.5 bg-teal-50 text-teal-700 text-[11px] rounded-full border border-teal-100">
                                {pos}
                              </span>
                            ))}
                          </div>
                        </SectionBlock>
                      )}

                      {d.curriculumTaught?.length > 0 && (
                        <SectionBlock title="Curriculum Taught" icon={BookOpen} tone="emerald">
                          <div className="col-span-2 flex flex-wrap gap-1">
                            {d.curriculumTaught.map((c, i) => (
                              <span key={i} className="px-2 py-0.5 bg-emerald-50 text-emerald-700 text-[11px] rounded-full border border-emerald-100">
                                {c}
                              </span>
                            ))}
                          </div>
                        </SectionBlock>
                      )}

                      {d.skills?.length > 0 && (
                        <SectionBlock title="Skills" icon={Target} tone="cyan">
                          <div className="col-span-2 flex flex-wrap gap-1">
                            {d.skills.map((s, i) => (
                              <span key={i} className="px-2 py-0.5 bg-slate-100 text-slate-700 text-[11px] rounded-full">{s}</span>
                            ))}
                          </div>
                        </SectionBlock>
                      )}

                      {d.languages?.length > 0 && (
                        <SectionBlock title="Languages" icon={Languages} tone="indigo">
                          <div className="col-span-2 flex flex-wrap gap-1">
                            {d.languages.map((l, i) => (
                              <span key={i} className="px-2 py-0.5 bg-indigo-50 text-indigo-700 text-[11px] rounded-full border border-indigo-100">
                                {l}
                              </span>
                            ))}
                          </div>
                        </SectionBlock>
                      )}

                      {d.extras?.length > 0 && (
                        <SectionBlock title="Extracurricular" icon={Activity} tone="emerald">
                          <div className="col-span-2 flex flex-wrap gap-1">
                            {d.extras.map((e, i) => (
                              <span key={i} className="px-2 py-0.5 bg-green-50 text-emerald-700 text-[11px] rounded-full border border-emerald-100">
                                {e}
                              </span>
                            ))}
                          </div>
                        </SectionBlock>
                      )}

                      <SectionBlock title="Preferences" icon={Target} tone="slate">
                        <DTile icon={CheckCircle} label="Consent to Forward CV" value={d.consentForwardCV} />
                        <DTile icon={HeartPulse} label="Medical Assistance" value={d.medicalAssistance} />
                      </SectionBlock>

                      <SectionBlock title="Meta" icon={IdCard} tone="slate">
                        <DTile icon={IdCard} label="Application ID" value={d.applicationId} />
                        <DTile icon={CircleDot} label="Status" value={d.status} />
                        <DTile icon={Clock} label="Member Since" value={formatDate(full.createdAt)} />
                        <DTile icon={BarChart3} label="Login Count" value={full.loginCount} />
                      </SectionBlock>
                    </div>

                    {/* LOCKED CONTACT + CV */}
                    <div className="p-5 pt-0 flex-shrink-0">
                      <div className="rounded-xl border-2 border-dashed border-rose-200 bg-gradient-to-br from-rose-50/60 to-pink-50/60 p-3">
                        <div className="flex items-center gap-1.5 mb-2">
                          <Lock className="w-3.5 h-3.5 text-rose-500" />
                          <span className="text-[10px] font-bold uppercase tracking-wider text-rose-700">
                            Locked · Contact & CV
                          </span>
                        </div>

                        {isUnlocked ? (
                          <div className="space-y-2.5">
                            <div className="grid grid-cols-2 gap-2">
                              <div className="bg-white rounded-lg p-2 border border-rose-100">
                                <p className="text-[9px] uppercase text-slate-500 font-semibold">Email</p>
                                <a href={`mailto:${full.email}`}
                                  className="text-[11px] font-semibold text-slate-800 break-all hover:text-teal-600">
                                  {full.email || 'N/A'}
                                </a>
                              </div>
                              <div className="bg-white rounded-lg p-2 border border-rose-100">
                                <p className="text-[9px] uppercase text-slate-500 font-semibold">Mobile</p>
                                <a href={`tel:${p.mobile}`}
                                  className="text-[11px] font-semibold text-slate-800 hover:text-teal-600">
                                  {p.mobile || 'N/A'}
                                </a>
                              </div>
                              {d.whatsapp && (
                                <div className="bg-white rounded-lg p-2 border border-rose-100 col-span-2">
                                  <p className="text-[9px] uppercase text-slate-500 font-semibold">WhatsApp</p>
                                  <a href={`https://wa.me/${d.whatsapp.replace(/\D/g, '')}`} target="_blank" rel="noreferrer"
                                    className="text-[11px] font-semibold text-emerald-700 hover:text-emerald-800">
                                    {d.whatsapp}
                                  </a>
                                </div>
                              )}
                            </div>

                            <div className="grid grid-cols-2 gap-2">
                              <button 
                                onClick={() => handleDownloadCv(full)} 
                                disabled={!d.cv || downloadingCv[teacherId]}
                                className={`flex items-center justify-center gap-1.5 px-3 py-2 rounded-lg text-[11px] font-semibold transition ${
                                  !d.cv
                                    ? 'bg-slate-200 text-slate-400 cursor-not-allowed'
                                    : downloadingCv[teacherId]
                                    ? 'bg-teal-600/70 text-white cursor-wait'
                                    : 'bg-gradient-to-r from-teal-600 to-cyan-600 text-white hover:shadow-md'
                                }`}
                              >
                                {downloadingCv[teacherId] ? (
                                  <><Loader2 className="w-3 h-3 animate-spin" /> Downloading...</>
                                ) : !d.cv ? (
                                  <><FileText className="w-3 h-3" /> No Resume</>
                                ) : (
                                  <><Download className="w-3 h-3" /> Download CV</>
                                )}
                              </button>
                            </div>
                          </div>
                        ) : (
                          <div className="space-y-2">
                            <div className="relative rounded-lg bg-white p-3 border border-rose-100">
                              <div className="flex items-center gap-2 text-sm text-slate-400">
                                <Mail className="w-4 h-4" />
                                <span className="select-none blur-[3px]">hidden@email.com</span>
                              </div>
                              <div className="flex items-center gap-2 text-sm text-slate-400 mt-2">
                                <Phone className="w-4 h-4" />
                                <span className="select-none blur-[3px]">+966 5X XXX XXXX</span>
                              </div>
                              <div className="flex items-center gap-2 text-sm text-slate-400 mt-2">
                                <FileText className="w-4 h-4" />
                                <span className="select-none blur-[3px]">resume_locked.pdf</span>
                              </div>
                              <div className="absolute inset-0 flex items-center justify-center">
                                <Lock className="w-6 h-6 text-slate-500/60" />
                              </div>
                            </div>
                            <button onClick={() => requestReveal(teacher)}
                              disabled={isBusy || currentCvsRemaining <= 0}
                              className={`w-full flex items-center justify-center gap-2 px-4 py-3 rounded-xl font-semibold text-sm transition-all ${
                                currentCvsRemaining <= 0
                                  ? 'bg-slate-200 text-slate-500 cursor-not-allowed'
                                  : isBusy
                                  ? 'bg-slate-300 text-slate-600 cursor-wait'
                                  : 'bg-gradient-to-r from-teal-600 to-cyan-600 text-white hover:shadow-lg hover:-translate-y-0.5'
                              }`}>
                              {isBusy ? (
                                <><Loader2 className="w-4 h-4 animate-spin" /> Unlocking…</>
                              ) : currentCvsRemaining <= 0 ? (
                                <><Lock className="w-4 h-4" /> No CVs Remaining</>
                              ) : (
                                <><Eye className="w-4 h-4" /> Unlock Contact & CV · 1 CV</>
                              )}
                            </button>
                            <p className="text-[10px] text-center text-slate-500">
                              {currentCvsRemaining} of {monthlyLimit} CVs remaining
                            </p>
                          </div>
                        )}
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </div>

            {totalPages > 1 && (
              <div className="mt-12 flex justify-center">
                <nav className="flex items-center gap-1.5 bg-white rounded-2xl shadow-md p-1.5 border border-slate-100">
                  <button onClick={() => handlePageChange(currentPage - 1)} disabled={currentPage === 1}
                    className={`px-4 py-2 rounded-xl text-sm font-semibold ${
                      currentPage === 1 ? 'text-slate-300 cursor-not-allowed' : 'text-slate-700 hover:bg-slate-100'
                    }`}>Prev</button>
                  {[...Array(totalPages)].map((_, idx) => {
                    const p = idx + 1;
                    if (p === 1 || p === totalPages || (p >= currentPage - 1 && p <= currentPage + 1)) {
                      return (
                        <button key={idx} onClick={() => handlePageChange(p)}
                          className={`w-10 h-10 rounded-xl font-semibold text-sm ${
                            currentPage === p
                              ? 'bg-gradient-to-r from-teal-600 to-cyan-600 text-white shadow-md'
                              : 'text-slate-700 hover:bg-slate-100'
                          }`}>{p}</button>
                      );
                    } else if (p === currentPage - 2 || p === currentPage + 2) {
                      return <span key={idx} className="px-1 text-slate-400">…</span>;
                    }
                    return null;
                  })}
                  <button onClick={() => handlePageChange(currentPage + 1)} disabled={currentPage === totalPages}
                    className={`px-4 py-2 rounded-xl text-sm font-semibold ${
                      currentPage === totalPages ? 'text-slate-300 cursor-not-allowed' : 'text-slate-700 hover:bg-slate-100'
                    }`}>Next</button>
                </nav>
              </div>
            )}
          </>
        )}
      </div>

      {/* CONFIRM MODAL */}
      <AnimatePresence>
        {confirmModal && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-[9999] flex items-center justify-center p-4"
            style={{ backgroundColor: 'rgba(15,23,42,0.65)', backdropFilter: 'blur(8px)' }}
            onClick={() => setConfirmModal(null)}>
            <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white rounded-3xl shadow-2xl max-w-md w-full overflow-hidden"
              onClick={(e) => e.stopPropagation()}>
              <div className="bg-gradient-to-r from-teal-600 to-cyan-600 p-6 text-white">
                <div className="w-14 h-14 bg-white/25 rounded-2xl flex items-center justify-center mx-auto mb-3">
                  <AlertCircle className="w-7 h-7" />
                </div>
                <h3 className="text-xl font-bold text-center">Confirm CV Download</h3>
                <p className="text-sm text-white/90 text-center mt-1">Unlock contact & CV for this teacher</p>
              </div>
              <div className="p-6">
                <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4 mb-5">
                  <div className="flex items-start gap-3">
                    <div className="w-9 h-9 bg-amber-100 rounded-xl flex items-center justify-center flex-shrink-0">
                      <Zap className="w-5 h-5 text-amber-600" />
                    </div>
                    <div className="text-sm text-amber-900">
                      <p className="font-bold mb-1">This will use 1 CV download</p>
                      <p className="text-amber-800 leading-relaxed">
                        You have <strong>{currentCvsRemaining}</strong> remaining.
                        After unlocking <strong>{confirmModal.profile?.firstName} {confirmModal.profile?.lastName}</strong>,
                        you'll have <strong>{Math.max(0, currentCvsRemaining - 1)}</strong> left.
                      </p>
                    </div>
                  </div>
                </div>
                <div className="flex gap-3">
                  <button onClick={() => setConfirmModal(null)}
                    className="flex-1 px-4 py-3 border border-slate-200 text-slate-700 rounded-xl font-semibold hover:bg-slate-50 transition">
                    Cancel
                  </button>
                  <button onClick={confirmReveal} disabled={decreaseLoading}
                    className="flex-1 px-4 py-3 bg-gradient-to-r from-teal-600 to-cyan-600 text-white rounded-xl font-semibold hover:shadow-lg transition flex items-center justify-center gap-2 disabled:opacity-70">
                    {decreaseLoading
                      ? <><Loader2 className="w-4 h-4 animate-spin" /> Processing…</>
                      : <><CheckCircle className="w-4 h-4" /> Confirm</>}
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default TeachersDatabase;