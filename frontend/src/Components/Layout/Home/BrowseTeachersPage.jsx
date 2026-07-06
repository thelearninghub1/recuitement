import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  Users, 
  MapPin, 
  Briefcase, 
  GraduationCap,
  Filter,
  Search,
  Star,
  CheckCircle,
  Building,
  Languages,
  Target,
  Award,
  BookOpen,
  Calendar,
  Clock,
  ChevronRight,
  X,
  ChevronDown,
  ChevronUp,
  Mail,
  Phone,
  Globe,
  Heart,
  User,
  Shield
} from 'lucide-react';
import { allUserAction } from '../../../actions/userActions';
import { toast } from 'react-toastify';
import { Country } from 'country-state-city';

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
    subjects: '',
    languages: '',
    availability: '',
    gender: '',
    nationality: '',
    residencyStatus: ''
  });
  
  const [sortBy, setSortBy] = useState('recent');
  const [currentPage, setCurrentPage] = useState(1);
  const teachersPerPage = 9;
  const [favorites, setFavorites] = useState(new Set());

  // Get all countries from country-state-city
  const allCountries = Country.getAllCountries().map(country => country.name);

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
        const position = teacher.candidateData?.positionsInterested?.[0] || '';
        const skills = teacher.candidateData?.skills?.join(' ') || '';
        
        return (
          fullName.includes(searchTerm.toLowerCase()) ||
          position.toLowerCase().includes(searchTerm.toLowerCase()) ||
          skills.toLowerCase().includes(searchTerm.toLowerCase())
        );
      });
    }
    
    // Apply location filter
    if (filters.location) {
      result = result.filter(teacher => 
        teacher.candidateData?.currentCity?.toLowerCase() === filters.location.toLowerCase()
      );
    }
    
    // Apply experience filter
    if (filters.experience) {
      result = result.filter(teacher => 
        teacher.candidateData?.totalExperience === filters.experience
      );
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
    
    // Apply subjects filter
    if (filters.subjects) {
      result = result.filter(teacher => 
        teacher.candidateData?.subjectsTaught?.includes(filters.subjects)
      );
    }
    
    // Apply languages filter
    if (filters.languages) {
      result = result.filter(teacher => 
        teacher.candidateData?.languages?.includes(filters.languages)
      );
    }
    
    // Apply availability filter
    if (filters.availability) {
      result = result.filter(teacher => 
        teacher.candidateData?.availability === filters.availability
      );
    }
    
    // Apply gender filter - Now supports Male, Female, Both
    if (filters.gender) {
      if (filters.gender === 'Both') {
        // Show both Male and Female teachers
        result = result.filter(teacher => 
          teacher.profile?.gender === 'Male' || teacher.profile?.gender === 'Female'
        );
      } else {
        // Filter by specific gender
        result = result.filter(teacher => 
          teacher.profile?.gender === filters.gender
        );
      }
    }
    
    // Apply nationality filter - Uses all world countries
    if (filters.nationality) {
      result = result.filter(teacher => 
        teacher.profile?.nationality === filters.nationality
      );
    }
    
    // Apply residency status filter
    if (filters.residencyStatus) {
      result = result.filter(teacher => 
        teacher.candidateData?.iqama === filters.residencyStatus ||
        teacher.candidateData?.iqamaOther === filters.residencyStatus
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
  const subjects = [...new Set(teachers.flatMap(t => t.candidateData?.subjectsTaught || []).filter(Boolean))];
  const languages = [...new Set(teachers.flatMap(t => t.candidateData?.languages || []).filter(Boolean))];
  
  // Gender options for filter
  const genderOptions = ['Male', 'Female', 'Both'];
  
  // Residency status options
  const residencyStatuses = [...new Set(teachers.flatMap(t => [
    t.candidateData?.iqama,
    t.candidateData?.iqamaOther
  ]).filter(Boolean))];

  // Calculate pagination
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
      } else {
        newFavorites.add(teacherId);
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
      experience: '',
      education: '',
      curriculum: '',
      subjects: '',
      languages: '',
      availability: '',
      gender: '',
      nationality: '',
      residencyStatus: ''
    });
    setSearchTerm('');
    setCurrentPage(1);
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
      {/* Hero Section */}
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
                placeholder="Search teachers by name, position, or skills..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-pink-500 focus:border-transparent"
              />
            </div>

            {/* Filter Toggle Button */}
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-[#FF6B6B] to-[#FF8E53] text-white rounded-xl hover:shadow-lg transition-all duration-300"
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
                {/* Location Filter */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <MapPin className="inline w-4 h-4 mr-1" />
                    Location
                  </label>
                  <select
                    value={filters.location}
                    onChange={(e) => handleFilterChange('location', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                  >
                    <option value="">All Locations</option>
                    {locations.map((loc, idx) => (
                      <option key={idx} value={loc}>{loc}</option>
                    ))}
                  </select>
                </div>

                {/* Experience Filter */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <Briefcase className="inline w-4 h-4 mr-1" />
                    Experience
                  </label>
                  <select
                    value={filters.experience}
                    onChange={(e) => handleFilterChange('experience', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                  >
                    <option value="">Any Experience</option>
                    {experiences.map((exp, idx) => (
                      <option key={idx} value={exp}>{exp} years</option>
                    ))}
                  </select>
                </div>

                {/* Education Filter */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <GraduationCap className="inline w-4 h-4 mr-1" />
                    Education
                  </label>
                  <select
                    value={filters.education}
                    onChange={(e) => handleFilterChange('education', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                  >
                    <option value="">Any Education</option>
                    {educations.map((edu, idx) => (
                      <option key={idx} value={edu}>{edu}</option>
                    ))}
                  </select>
                </div>

                {/* Gender Filter - Now with Male, Female, Both */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <User className="inline w-4 h-4 mr-1" />
                    Gender
                  </label>
                  <select
                    value={filters.gender}
                    onChange={(e) => handleFilterChange('gender', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                  >
                    <option value="">All Genders</option>
                    {genderOptions.map((gender, idx) => (
                      <option key={idx} value={gender}>{gender}</option>
                    ))}
                  </select>
                  {filters.gender === 'Both' && (
                    <p className="text-xs text-gray-500 mt-1">Showing both Male and Female teachers</p>
                  )}
                </div>

                {/* Nationality Filter - Uses all world countries */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <Globe className="inline w-4 h-4 mr-1" />
                    Nationality
                  </label>
                  <select
                    value={filters.nationality}
                    onChange={(e) => handleFilterChange('nationality', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                  >
                    <option value="">All Nationalities</option>
                    {allCountries.map((country, idx) => (
                      <option key={idx} value={country}>{country}</option>
                    ))}
                  </select>
                </div>

                {/* Residency Status Filter */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <Shield className="inline w-4 h-4 mr-1" />
                    Residency Status
                  </label>
                  <select
                    value={filters.residencyStatus}
                    onChange={(e) => handleFilterChange('residencyStatus', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                  >
                    <option value="">All Status</option>
                    {residencyStatuses.map((status, idx) => (
                      <option key={idx} value={status}>{status}</option>
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
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                  >
                    <option value="">All Curricula</option>
                    {curricula.map((curr, idx) => (
                      <option key={idx} value={curr}>{curr}</option>
                    ))}
                  </select>
                </div>

                {/* Subjects Filter */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <Target className="inline w-4 h-4 mr-1" />
                    Subjects
                  </label>
                  <select
                    value={filters.subjects}
                    onChange={(e) => handleFilterChange('subjects', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                  >
                    <option value="">All Subjects</option>
                    {subjects.map((sub, idx) => (
                      <option key={idx} value={sub}>{sub}</option>
                    ))}
                  </select>
                </div>

                {/* Languages Filter */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <Languages className="inline w-4 h-4 mr-1" />
                    Languages
                  </label>
                  <select
                    value={filters.languages}
                    onChange={(e) => handleFilterChange('languages', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                  >
                    <option value="">All Languages</option>
                    {languages.map((lang, idx) => (
                      <option key={idx} value={lang}>{lang}</option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Clear Filters Button */}
              {(filters.location || filters.experience || filters.education || 
                filters.curriculum || filters.subjects || filters.languages || filters.availability ||
                filters.gender || filters.nationality || filters.residencyStatus) && (
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
            Showing <span className="font-bold text-[#FF6B6B]">{currentTeachers.length}</span> of{' '}
            <span className="font-bold text-[#FF6B6B]">{filteredTeachers.length}</span> teachers
            {searchTerm && ` for "${searchTerm}"`}
          </p>
        </div>

        {/* Teachers Grid */}
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
                const experience = teacherData.totalExperience || 'Not specified';
                const location = teacherData.currentCity || 'Saudi Arabia';
                const education = teacherData.degree === "Other" 
                  ? teacherData.degreeOther 
                  : teacherData.degree || 'Education';
                const skills = teacherData.skills?.slice(0, 4) || ['Teaching', 'Education'];
                const languages = teacherData.languages?.slice(0, 2) || ['English'];
                const curriculum = teacherData.curriculumTaught?.slice(0, 2) || ['International'];
                const gender = teacher.profile?.gender || 'Not specified';
                const nationality = teacher.profile?.nationality || 'Not specified';
                const residencyStatus = teacherData.iqama || 'Not specified';

                return (
                  <motion.div
                    key={teacher._id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="bg-white rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300 border border-gray-100 overflow-hidden flex flex-col h-full cursor-pointer"
                    onClick={() => navigate(`/teacher/${teacher._id}`)}
                  >
                    {/* Teacher Header */}
                    <div className="bg-gradient-to-r from-pink-50 to-orange-50 p-6 relative">
                      {/* Favorite Button */}
                      <button
                        onClick={(e) => toggleFavorite(teacher._id, e)}
                        className="absolute top-4 right-4 z-10"
                      >
                        <Heart className={`w-6 h-6 transition-all duration-300 ${
                          favorites.has(teacher._id) 
                            ? 'fill-[#FF6B6B] text-[#FF6B6B]' 
                            : 'text-gray-400 hover:text-[#FF6B6B]'
                        }`} />
                      </button>
                      
                      <div className="flex items-start gap-4 mb-4">
                        {/* Avatar */}
                        <div className="w-16 h-16 bg-gradient-to-br from-[#FF6B6B] to-[#FF8E53] rounded-xl flex items-center justify-center text-white font-bold text-xl">
                          {teacher.profile?.firstName?.charAt(0) || 'T'}
                          {teacher.profile?.lastName?.charAt(0) || ''}
                        </div>
                        
                        <div className="flex-1">
                          <h3 className="text-lg font-bold text-gray-900 mb-1">{fullName}</h3>
                          <p className="text-[#FF6B6B] font-medium">{position}</p>
                          <div className="flex items-center gap-1 mt-1">
                            <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
                            <span className="text-sm font-semibold">4.8</span>
                            <span className="text-xs text-gray-500">(24 reviews)</span>
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex flex-wrap gap-2">
                        <span className="px-3 py-1 bg-white text-[#FF6B6B] text-sm font-medium rounded-full border border-[#FF6B6B]">
                          {experience} years exp
                        </span>
                        <span className="px-3 py-1 bg-white text-emerald-600 text-sm font-medium rounded-full border border-emerald-200">
                          {education}
                        </span>
                        <span className="px-3 py-1 bg-white text-blue-600 text-sm font-medium rounded-full border border-blue-200">
                          {gender}
                        </span>
                      </div>
                    </div>

                    {/* Teacher Details */}
                    <div className="p-6 flex-1 flex flex-col">
                      {/* Key Info */}
                      <div className="space-y-4 mb-6">
                        <div className="flex items-center gap-3">
                          <MapPin className="w-5 h-5 text-gray-400 flex-shrink-0" />
                          <span className="text-gray-700">{location}</span>
                        </div>
                        
                        <div className="flex items-center gap-3">
                          <Globe className="w-5 h-5 text-gray-400 flex-shrink-0" />
                          <span className="text-gray-700">{nationality}</span>
                        </div>
                        
                        <div className="flex items-center gap-3">
                          <Shield className="w-5 h-5 text-gray-400 flex-shrink-0" />
                          <span className="text-gray-700">{residencyStatus}</span>
                        </div>
                        
                        <div className="flex items-center gap-3">
                          <Languages className="w-5 h-5 text-gray-400 flex-shrink-0" />
                          <div>
                            <span className="text-gray-900 font-semibold">Languages</span>
                            <div className="flex flex-wrap gap-1 mt-1">
                              {languages.map((lang, idx) => (
                                <span key={idx} className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded">
                                  {lang}
                                </span>
                              ))}
                            </div>
                          </div>
                        </div>
                        
                        <div className="flex items-center gap-3">
                          <BookOpen className="w-5 h-5 text-gray-400 flex-shrink-0" />
                          <div>
                            <span className="text-gray-900 font-semibold">Curriculum</span>
                            <div className="flex flex-wrap gap-1 mt-1">
                              {curriculum.map((curr, idx) => (
                                <span key={idx} className="px-2 py-1 bg-purple-100 text-purple-800 text-xs rounded">
                                  {curr}
                                </span>
                              ))}
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Skills */}
                      {skills.length > 0 && (
                        <div className="mb-6">
                          <h4 className="font-semibold text-gray-900 mb-2 flex items-center gap-2">
                            <Target className="w-4 h-4 text-[#FF6B6B]" />
                            Key Skills
                          </h4>
                          <div className="flex flex-wrap gap-2">
                            {skills.map((skill, idx) => (
                              <span key={idx} className="px-3 py-1 bg-gray-100 text-gray-700 text-sm rounded-full">
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

        {/* Call to Action */}
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