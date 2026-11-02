// ViewSchoolsPage.jsx - Updated to match SchoolRegister form data structure
import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  Building, 
  MapPin, 
  Users, 
  BookOpen,
  Filter,
  Search,
  Star,
  CheckCircle,
  Calendar,
  Award,
  Globe,
  Phone,
  Mail,
  ChevronRight,
  X,
  ChevronDown,
  ChevronUp,
  Heart,
  Briefcase,
  Target,
  FileText,
  Shield
} from 'lucide-react';
import { allUserAction } from '../../../actions/userActions';
import { toast } from 'react-toastify';

const ViewSchoolsPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  
  const { users = [], loading: usersLoading } = useSelector((state) => state.allUsers);
  
  const [filteredSchools, setFilteredSchools] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState({
    location: '',
    schoolType: '',
    curriculum: '',
    established: '',
    studentCapacity: '',
    accreditation: '',
    schoolLevel: '',
    facilities: ''
  });
  
  const [sortBy, setSortBy] = useState('rating');
  const [currentPage, setCurrentPage] = useState(1);
  const schoolsPerPage = 9;
  const [favorites, setFavorites] = useState(new Set());

  useEffect(() => {
    dispatch(allUserAction());
  }, [dispatch]);

  useEffect(() => {
    const schools = users.filter(user => user.role === 'school') || [];
    let result = [...schools];
    
    // Apply search filter
    if (searchTerm) {
      result = result.filter(school => {
        const schoolName = school.schoolData?.schoolName || 
                         school.schoolData?.schoolNameOther ||
                         `${school.profile?.firstName || ''} ${school.profile?.lastName || ''}`;
        const location = school.schoolData?.city || '';
        const type = Array.isArray(school.schoolData?.schoolType) 
          ? school.schoolData.schoolType.join(' ') 
          : school.schoolData?.schoolType || '';
        const description = school.schoolData?.schoolDescription || '';
        
        return (
          schoolName.toLowerCase().includes(searchTerm.toLowerCase()) ||
          location.toLowerCase().includes(searchTerm.toLowerCase()) ||
          type.toLowerCase().includes(searchTerm.toLowerCase()) ||
          description.toLowerCase().includes(searchTerm.toLowerCase())
        );
      });
    }
    
    // Apply location filter
    if (filters.location) {
      result = result.filter(school => 
        school.schoolData?.city?.toLowerCase() === filters.location.toLowerCase() ||
        school.schoolData?.cityOther?.toLowerCase() === filters.location.toLowerCase()
      );
    }
    
    // Apply school type filter
    if (filters.schoolType) {
      result = result.filter(school => {
        const types = school.schoolData?.schoolType;
        if (Array.isArray(types)) {
          return types.includes(filters.schoolType);
        }
        return types === filters.schoolType;
      });
    }
    
    // Apply curriculum filter
    if (filters.curriculum) {
      result = result.filter(school => {
        const curricula = school.schoolData?.curriculum;
        if (Array.isArray(curricula)) {
          return curricula.includes(filters.curriculum);
        }
        return curricula === filters.curriculum;
      });
    }
    
    // Apply established year filter (minimum year)
    if (filters.established) {
      const year = parseInt(filters.established);
      result = result.filter(school => {
        const establishedYear = parseInt(school.schoolData?.establishedYear || 0);
        return establishedYear >= year;
      });
    }
    
    // Apply student capacity filter (minimum capacity)
    if (filters.studentCapacity) {
      const capacity = parseInt(filters.studentCapacity);
      result = result.filter(school => {
        const schoolCapacity = parseInt(school.schoolData?.studentCapacity || 0);
        return schoolCapacity >= capacity;
      });
    }
    
    // Apply school level filter
    if (filters.schoolLevel) {
      result = result.filter(school => {
        const levels = school.schoolData?.schoolLevel;
        if (Array.isArray(levels)) {
          return levels.includes(filters.schoolLevel);
        }
        return levels === filters.schoolLevel;
      });
    }
    
    // Apply facilities filter
    if (filters.facilities) {
      result = result.filter(school => {
        const facilities = school.schoolData?.facilities;
        if (Array.isArray(facilities)) {
          return facilities.includes(filters.facilities);
        }
        return facilities === filters.facilities;
      });
    }
    
    // Apply accreditation filter
    if (filters.accreditation) {
      result = result.filter(school => {
        const accreditations = school.schoolData?.accreditations;
        if (Array.isArray(accreditations)) {
          return accreditations.some(acc => 
            acc.toLowerCase().includes(filters.accreditation.toLowerCase())
          );
        }
        return accreditations === filters.accreditation;
      });
    }
    
    // Apply sorting
    switch (sortBy) {
      case 'rating':
        result.sort((a, b) => (b.rating || 0) - (a.rating || 0));
        break;
      case 'established':
        result.sort((a, b) => 
          parseInt(b.schoolData?.establishedYear || 0) - 
          parseInt(a.schoolData?.establishedYear || 0)
        );
        break;
      case 'capacity':
        result.sort((a, b) => 
          parseInt(b.schoolData?.studentCapacity || 0) - 
          parseInt(a.schoolData?.studentCapacity || 0)
        );
        break;
      case 'recent':
        result.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
        break;
      default:
        break;
    }
    
    setFilteredSchools(result);
  }, [users, searchTerm, filters, sortBy]);

  // Get unique values for filter dropdowns
  const schools = users.filter(user => user.role === 'school') || [];
  
  // Safe array extraction functions
  const getArrayFromField = (field) => {
    const values = schools
      .map(s => s.schoolData?.[field])
      .filter(Boolean);
    
    const allValues = values.flatMap(value => {
      if (Array.isArray(value)) {
        return value;
      } else if (typeof value === 'string') {
        // Try to parse string as array
        try {
          const parsed = JSON.parse(value);
          if (Array.isArray(parsed)) return parsed;
        } catch {
          // If not JSON, return as single item array
          return [value];
        }
        return [value];
      }
      return [];
    });
    
    return [...new Set(allValues)];
  };

  const getSingleValues = (field) => {
    const values = schools
      .map(s => s.schoolData?.[field])
      .filter(Boolean);
    
    return [...new Set(values)];
  };

  const locations = getSingleValues('city');
  const schoolTypes = getArrayFromField('schoolType');
  const curricula = getArrayFromField('curriculum');
  const schoolLevels = getArrayFromField('schoolLevel');
  const facilities = getArrayFromField('facilities');
  const accreditations = getArrayFromField('accreditations');
  
  const establishedYears = getSingleValues('establishedYear')
    .map(year => parseInt(year))
    .filter(year => !isNaN(year))
    .sort((a, b) => b - a);

  // Calculate pagination
  const indexOfLastSchool = currentPage * schoolsPerPage;
  const indexOfFirstSchool = indexOfLastSchool - schoolsPerPage;
  const currentSchools = filteredSchools.slice(indexOfFirstSchool, indexOfLastSchool);
  const totalPages = Math.ceil(filteredSchools.length / schoolsPerPage);

  const handleViewSchool = (schoolId) => {
    navigate(`/school/${schoolId}`);
  };

  const handleContactSchool = (schoolId) => {
    // Navigate to login or contact page
    navigate('/teacher-login');
  };

  const toggleFavorite = (schoolId, e) => {
    e.stopPropagation();
    setFavorites(prev => {
      const newFavorites = new Set(prev);
      if (newFavorites.has(schoolId)) {
        newFavorites.delete(schoolId);
        toast.info('Removed from favorites');
      } else {
        newFavorites.add(schoolId);
        toast.success('Added to favorites');
      }
      return newFavorites;
    });
  };

  const handleFilterChange = (filterName, value) => {
    setFilters(prev => ({
      ...prev,
      [filterName]: value
    }));
    setCurrentPage(1);
  };

  const clearFilters = () => {
    setFilters({
      location: '',
      schoolType: '',
      curriculum: '',
      established: '',
      studentCapacity: '',
      accreditation: '',
      schoolLevel: '',
      facilities: ''
    });
    setSearchTerm('');
    setCurrentPage(1);
    toast.info('All filters cleared');
  };

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Helper function to safely get array from data
  const safeGetArray = (data, field, defaultValue = []) => {
    const value = data?.[field];
    if (Array.isArray(value)) {
      return value;
    } else if (typeof value === 'string') {
      try {
        const parsed = JSON.parse(value);
        if (Array.isArray(parsed)) return parsed;
      } catch {
        if (value.includes(',')) {
          return value.split(',').map(item => item.trim()).filter(Boolean);
        }
        return [value];
      }
    }
    return defaultValue;
  };

  // Helper function to safely get value with fallback
  const safeGetValue = (data, field, defaultValue = '') => {
    const value = data?.[field];
    return value || defaultValue;
  };

  // Get the first few items from an array for display
  const getDisplayItems = (arr, max = 3) => {
    if (!arr || arr.length === 0) return [];
    return arr.slice(0, max);
  };

  if (usersLoading) {
    return (
      <div className="min-h-screen mt-30 bg-gradient-to-br from-slate-50 to-teal-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-20 h-20 border-4 border-[#4ECDC4] border-t-transparent rounded-full animate-spin mx-auto mb-6"></div>
          <h2 className="text-2xl font-bold text-gray-800">Loading Schools...</h2>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen mt-30 bg-gradient-to-br from-slate-50 to-teal-50">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-[#4ECDC4] to-[#44A08D] text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">Explore Top Schools in Saudi Arabia</h1>
            <p className="text-xl opacity-90 max-w-3xl mx-auto">
              Discover {filteredSchools.length} premier educational institutions actively hiring teachers
            </p>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Search and Filter Bar */}
        <div className="bg-white rounded-2xl shadow-xl p-6 mb-8">
          <div className="flex flex-col lg:flex-row gap-4 items-center justify-between">
            {/* Search Input */}
            <div className="relative flex-1 w-full">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search schools by name, location, type, or description..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-teal-500 focus:border-transparent"
              />
            </div>

            {/* Filter Toggle Button */}
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-[#4ECDC4] to-[#44A08D] text-white rounded-xl hover:shadow-lg transition-all duration-300"
            >
              <Filter className="w-5 h-5" />
              Filters
              {showFilters ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
            </button>

            {/* Sort Dropdown */}
            <div className="relative">
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="px-4 py-3 border border-gray-300 rounded-xl appearance-none focus:ring-2 focus:ring-teal-500 focus:border-transparent"
              >
                <option value="rating">Highest Rated</option>
                <option value="established">Newly Established</option>
                <option value="capacity">Largest Capacity</option>
                <option value="recent">Most Recent</option>
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
                {/* Location Filter */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <MapPin className="inline w-4 h-4 mr-1" />
                    Location
                  </label>
                  <select
                    value={filters.location}
                    onChange={(e) => handleFilterChange('location', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                  >
                    <option value="">All Locations</option>
                    {locations.map((loc, idx) => (
                      <option key={idx} value={loc}>{loc}</option>
                    ))}
                  </select>
                </div>

                {/* School Type Filter */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <Building className="inline w-4 h-4 mr-1" />
                    School Type
                  </label>
                  <select
                    value={filters.schoolType}
                    onChange={(e) => handleFilterChange('schoolType', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                  >
                    <option value="">All Types</option>
                    {schoolTypes.map((type, idx) => (
                      <option key={idx} value={type}>{type}</option>
                    ))}
                  </select>
                </div>

                {/* School Level Filter */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <Users className="inline w-4 h-4 mr-1" />
                    School Level
                  </label>
                  <select
                    value={filters.schoolLevel}
                    onChange={(e) => handleFilterChange('schoolLevel', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                  >
                    <option value="">All Levels</option>
                    {schoolLevels.map((level, idx) => (
                      <option key={idx} value={level}>{level}</option>
                    ))}
                  </select>
                </div>

                {/* Curriculum Filter */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <BookOpen className="inline w-4 h-4 mr-1" />
                    Curriculum
                  </label>
                  <select
                    value={filters.curriculum}
                    onChange={(e) => handleFilterChange('curriculum', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                  >
                    <option value="">All Curricula</option>
                    {curricula.map((curr, idx) => (
                      <option key={idx} value={curr}>{curr}</option>
                    ))}
                  </select>
                </div>

                {/* Facilities Filter */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <Shield className="inline w-4 h-4 mr-1" />
                    Facilities
                  </label>
                  <select
                    value={filters.facilities}
                    onChange={(e) => handleFilterChange('facilities', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                  >
                    <option value="">All Facilities</option>
                    {facilities.map((facility, idx) => (
                      <option key={idx} value={facility}>{facility}</option>
                    ))}
                  </select>
                </div>

                {/* Accreditation Filter */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <Award className="inline w-4 h-4 mr-1" />
                    Accreditation
                  </label>
                  <select
                    value={filters.accreditation}
                    onChange={(e) => handleFilterChange('accreditation', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                  >
                    <option value="">All Accreditations</option>
                    {accreditations.map((acc, idx) => (
                      <option key={idx} value={acc}>{acc}</option>
                    ))}
                  </select>
                </div>

                {/* Established Year Filter */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <Calendar className="inline w-4 h-4 mr-1" />
                    Established After
                  </label>
                  <select
                    value={filters.established}
                    onChange={(e) => handleFilterChange('established', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                  >
                    <option value="">Any Year</option>
                    {establishedYears.map((year, idx) => (
                      <option key={idx} value={year}>After {year}</option>
                    ))}
                  </select>
                </div>

                {/* Student Capacity Filter */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <Users className="inline w-4 h-4 mr-1" />
                    Min Student Capacity
                  </label>
                  <select
                    value={filters.studentCapacity}
                    onChange={(e) => handleFilterChange('studentCapacity', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                  >
                    <option value="">Any Size</option>
                    <option value="100">100+ Students</option>
                    <option value="500">500+ Students</option>
                    <option value="1000">1000+ Students</option>
                    <option value="2000">2000+ Students</option>
                  </select>
                </div>
              </div>

              {/* Clear Filters Button */}
              {Object.values(filters).some(v => v !== '' && v !== 'all') && (
                <div className="mt-6 flex justify-end">
                  <button
                    onClick={clearFilters}
                    className="flex items-center gap-2 px-4 py-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                  >
                    <X className="w-4 h-4" />
                    Clear All Filters
                  </button>
                </div>
              )}
            </motion.div>
          )}
        </div>

        {/* Results Summary */}
        <div className="mb-6">
          <p className="text-gray-600">
            Showing <span className="font-bold text-[#4ECDC4]">{currentSchools.length}</span> of{' '}
            <span className="font-bold text-[#4ECDC4]">{filteredSchools.length}</span> schools
            {searchTerm && ` for "${searchTerm}"`}
          </p>
        </div>

        {/* Schools Grid */}
        {currentSchools.length === 0 ? (
          <div className="text-center py-16 bg-white rounded-2xl shadow-lg">
            <Building className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-bold text-gray-700 mb-2">No schools found</h3>
            <p className="text-gray-600 mb-6">Try adjusting your search or filters</p>
            <button
              onClick={clearFilters}
              className="px-6 py-3 bg-gradient-to-r from-[#4ECDC4] to-[#44A08D] text-white rounded-xl hover:shadow-lg transition-all duration-300"
            >
              Clear All Filters
            </button>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {currentSchools.map((school, index) => {
                const schoolData = school.schoolData || {};
                const schoolName = schoolData.schoolName || 
                                 schoolData.schoolNameOther ||
                                 `${school.profile?.firstName || ''} ${school.profile?.lastName || ''}`.trim() || 'School';
                const schoolTypeArray = safeGetArray(schoolData, 'schoolType', ['International School']);
                const schoolType = schoolTypeArray[0] || 'International School';
                const location = schoolData.city || schoolData.cityOther || 'Saudi Arabia';
                const established = schoolData.establishedYear || '2000';
                const capacity = schoolData.studentCapacity || '500';
                const curriculum = safeGetArray(schoolData, 'curriculum', ['International']);
                const schoolLevel = safeGetArray(schoolData, 'schoolLevel', ['All Levels']);
                const facilities = safeGetArray(schoolData, 'facilities', []);
                const accreditations = safeGetArray(schoolData, 'accreditations', []);
                const description = schoolData.schoolDescription || '';
                const contactPerson = schoolData.contactPerson || '';
                const email = school.email || schoolData.email || '';
                
                // Get first few items for display
                const displayCurricula = getDisplayItems(curriculum, 3);
                const displayFacilities = getDisplayItems(facilities, 3);
                const displayAccreditations = getDisplayItems(accreditations, 2);
                const displayLevels = getDisplayItems(schoolLevel, 3);

                return (
                  <motion.div
                    key={school._id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="bg-white rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300 border border-gray-100 overflow-hidden flex flex-col h-full"
                  >
                    {/* School Header */}
                    <div className="bg-gradient-to-r from-teal-50 to-emerald-50 p-6 relative">
                      {/* Favorite Button */}
                      <button
                        onClick={(e) => toggleFavorite(school._id, e)}
                        className="absolute top-4 right-4 z-10"
                      >
                        <Heart className={`w-6 h-6 transition-all duration-300 ${
                          favorites.has(school._id) 
                            ? 'fill-[#4ECDC4] text-[#4ECDC4]' 
                            : 'text-gray-400 hover:text-[#4ECDC4]'
                        }`} />
                      </button>
                      
                      <div className="flex items-start gap-4 mb-4">
                        {/* School Logo/Initials */}
                        <div className="w-16 h-16 bg-gradient-to-br from-[#4ECDC4] to-[#44A08D] rounded-xl flex items-center justify-center text-white font-bold text-xl flex-shrink-0">
                          {schoolName.substring(0, 2).toUpperCase()}
                        </div>
                        
                        <div className="flex-1 min-w-0">
                          <h3 className="text-lg font-bold text-gray-900 mb-1 truncate">{schoolName}</h3>
                          <p className="text-[#4ECDC4] font-medium truncate">{schoolType}</p>
                          <div className="flex items-center gap-1 mt-1">
                            <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
                            <span className="text-sm font-semibold">4.9</span>
                            <span className="text-xs text-gray-500">(36 reviews)</span>
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex flex-wrap gap-2">
                        <span className="px-3 py-1 bg-white text-[#4ECDC4] text-sm font-medium rounded-full border border-[#4ECDC4]">
                          Est. {established}
                        </span>
                        <span className="px-3 py-1 bg-white text-emerald-600 text-sm font-medium rounded-full border border-emerald-200">
                          {capacity} Students
                        </span>
                        {displayLevels.length > 0 && (
                          <span className="px-3 py-1 bg-white text-purple-600 text-sm font-medium rounded-full border border-purple-200 truncate max-w-[120px]">
                            {displayLevels[0]}
                          </span>
                        )}
                      </div>
                    </div>

                    {/* School Details */}
                    <div className="p-6 flex-1 flex flex-col">
                      {/* Key Info */}
                      <div className="space-y-3 mb-6">
                        <div className="flex items-start gap-3">
                          <MapPin className="w-5 h-5 text-gray-400 flex-shrink-0 mt-0.5" />
                          <span className="text-gray-700 truncate">{location}</span>
                        </div>

                        {contactPerson && (
                          <div className="flex items-start gap-3">
                            <Users className="w-5 h-5 text-gray-400 flex-shrink-0 mt-0.5" />
                            <span className="text-gray-700 truncate">Contact: {contactPerson}</span>
                          </div>
                        )}
                        
                        {displayCurricula.length > 0 && (
                          <div className="flex items-start gap-3">
                            <BookOpen className="w-5 h-5 text-gray-400 flex-shrink-0 mt-0.5" />
                            <div className="flex-1 min-w-0">
                              <span className="text-gray-900 font-semibold text-sm block">Curriculum</span>
                              <div className="flex flex-wrap gap-1 mt-1">
                                {displayCurricula.map((curr, idx) => (
                                  <span key={idx} className="px-2 py-1 bg-purple-100 text-purple-800 text-xs rounded truncate max-w-[120px]">
                                    {curr}
                                  </span>
                                ))}
                                {curriculum.length > 3 && (
                                  <span className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded">
                                    +{curriculum.length - 3}
                                  </span>
                                )}
                              </div>
                            </div>
                          </div>
                        )}

                        {displayFacilities.length > 0 && (
                          <div className="flex items-start gap-3">
                            <Shield className="w-5 h-5 text-gray-400 flex-shrink-0 mt-0.5" />
                            <div className="flex-1 min-w-0">
                              <span className="text-gray-900 font-semibold text-sm block">Facilities</span>
                              <div className="flex flex-wrap gap-1 mt-1">
                                {displayFacilities.map((facility, idx) => (
                                  <span key={idx} className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded truncate max-w-[120px]">
                                    {facility}
                                  </span>
                                ))}
                                {facilities.length > 3 && (
                                  <span className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded">
                                    +{facilities.length - 3}
                                  </span>
                                )}
                              </div>
                            </div>
                          </div>
                        )}

                        {displayAccreditations.length > 0 && (
                          <div className="flex items-start gap-3">
                            <Award className="w-5 h-5 text-gray-400 flex-shrink-0 mt-0.5" />
                            <div className="flex-1 min-w-0">
                              <span className="text-gray-900 font-semibold text-sm block">Accreditations</span>
                              <div className="flex flex-wrap gap-1 mt-1">
                                {displayAccreditations.map((acc, idx) => (
                                  <span key={idx} className="px-2 py-1 bg-yellow-100 text-yellow-800 text-xs rounded truncate max-w-[120px]">
                                    {acc}
                                  </span>
                                ))}
                                {accreditations.length > 2 && (
                                  <span className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded">
                                    +{accreditations.length - 2}
                                  </span>
                                )}
                              </div>
                            </div>
                          </div>
                        )}
                      </div>

                      {/* Description Preview */}
                      {description && (
                        <div className="mb-4">
                          <p className="text-sm text-gray-600 line-clamp-2">
                            {description}
                          </p>
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
                        : 'text-[#4ECDC4] hover:bg-teal-50'
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
                              ? 'bg-gradient-to-r from-[#4ECDC4] to-[#44A08D] text-white'
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
                        : 'text-[#4ECDC4] hover:bg-teal-50'
                    }`}
                  >
                    Next
                  </button>
                </nav>
              </div>
            )}
          </>
        )}

        {/* Call to Action */}
        <div className="mt-16 text-center">
          <div className="bg-gradient-to-r from-teal-50 to-emerald-50 rounded-2xl p-8">
            <Users className="w-16 h-16 text-[#4ECDC4] mx-auto mb-4" />
            <h3 className="text-2xl font-bold text-gray-900 mb-4">
              Are you a teacher looking for opportunities?
            </h3>
            <p className="text-gray-600 mb-6 max-w-2xl mx-auto">
              Create your free teacher profile and get discovered by top schools in Saudi Arabia
            </p>
            <button
              onClick={() => navigate('/teacher-register')}
              className="px-8 py-4 bg-gradient-to-r from-[#4ECDC4] to-[#44A08D] text-white font-bold rounded-2xl hover:shadow-2xl transition-all duration-300 inline-flex items-center gap-3 group"
            >
              Join as Teacher - Free
              <ChevronRight className="w-5 h-5 group-hover:translate-x-2 transition-transform" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ViewSchoolsPage;