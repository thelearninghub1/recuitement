// src/pages/SchoolsDashboard.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  FaSearch, 
  FaTrash, 
  FaEye, 
  FaBuilding, 
  FaUsers,
  FaCalendar,
  FaBriefcase,
  FaEnvelope,
  FaPhone,
  FaMapMarkerAlt,
  FaFilter,
  FaCrown,
  FaStar,
  FaRocket,
  FaChartLine,
  FaList,
  FaSpinner,
  FaTimes,
  FaUserPlus,
  FaIdCard
} from 'react-icons/fa';
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import { allUserAction, clearErrors, deleteUserAction, getUserDetails } from '../../actions/userActions';
import { DELETE_USER_RESET } from '../../constants/userConstants';

const SchoolsDashboard = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  
  // Redux states
  const { user, loading: singleUserLoading, error: singleUserError } = useSelector((state) => state.getSingleUser);
  const { users, loading: allUsersLoading, error: allUsersError } = useSelector((state) => state.allUsers);
  const { message, success: deleteSuccess, loading: deleteLoading, error: deleteError } = useSelector((state) => state.updatePassword);
  
  const [activeView, setActiveView] = useState('grid');
  const [selectedSchool, setSelectedSchool] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [filteredSchools, setFilteredSchools] = useState([]);

  // Load all users on component mount
  useEffect(() => {
    console.log('📥 Loading all users...');
    dispatch(allUserAction());
  }, [dispatch]);

  // Filter schools based on role, search term, and status
  useEffect(() => {
    if (users && Array.isArray(users)) {
      // Filter only users with role 'school'
      let schools = users.filter(user => user.role === 'school');
      
      // Apply search filter
      if (searchTerm) {
        schools = schools.filter(school => {
          const searchLower = searchTerm.toLowerCase();
          return (
            (school.schoolData?.schoolName?.toLowerCase().includes(searchLower) || 
             school.email?.toLowerCase().includes(searchLower) ||
             school.schoolData?.city?.toLowerCase().includes(searchLower) ||
             school.schoolData?.schoolType?.some(type => 
              type.toLowerCase().includes(searchLower)
            ) ||
            school.schoolData?.curriculum?.some(curriculum => 
              curriculum.toLowerCase().includes(searchLower)
            ))
          );
        });
      }

      // Apply status filter
      if (statusFilter !== 'all') {
        schools = schools.filter(school => 
          school.status === statusFilter || 
          school.schoolData?.status === statusFilter
        );
      }

      // Transform data for display
      const transformedSchools = schools.map((school, index) => ({
        id: school._id || `school-${index}`,
        name: school.schoolData?.schoolName || school.profile?.firstName + ' ' + school.profile?.lastName || 'School Name',
        email: school.email || 'No email',
        phone: school.profile?.mobile || school.schoolData?.telephone || 'No phone',
        address: school.schoolData?.address || `${school.schoolData?.city || 'City'}, ${school.schoolData?.country || 'Country'}`,
        city: school.schoolData?.city || 'Not specified',
        country: school.schoolData?.country || 'Not specified',
        website: school.schoolData?.website || 'No website',
        establishedYear: school.schoolData?.establishedYear || 'Not specified',
        schoolType: school.schoolData?.schoolType || ['Not specified'],
        schoolLevel: school.schoolData?.schoolLevel || ['Not specified'],
        curriculum: school.schoolData?.curriculum || ['Not specified'],
        staffingNeeds: school.schoolData?.staffingNeeds || ['Not specified'],
        immediateOpenings: school.schoolData?.immediateOpenings || '0',
        expectedTeachers: school.schoolData?.expectedTeachers || '0',
        hiringTimeline: school.schoolData?.hiringTimeline || 'Not specified',
        salaryRange: school.schoolData?.salaryRange || 'Not specified',
        benefits: school.schoolData?.benefits || 'Not specified',
        contactPerson: school.schoolData?.contactPerson || 'Not specified',
        contactPosition: school.schoolData?.contactPosition || 'Not specified',
        principalName: school.schoolData?.principalName || 'Not specified',
        alternativeContact: school.schoolData?.alternativeContact || 'Not specified',
        schoolDescription: school.schoolData?.schoolDescription || 'No description available',
        facilities: school.schoolData?.facilities || 'Not specified',
        accreditation: school.schoolData?.accreditation || 'Not specified',
        partnershipInterest: school.schoolData?.partnershipInterest || 'No',
        additionalInfo: school.schoolData?.additionalInfo || '',
        avatar: school.schoolData?.schoolName?.substring(0, 2).toUpperCase() || 'SC',
        status: school.status || school.schoolData?.status || 'active',
        totalJobs: school.schoolData?.totalJobs || 0,
        currentStudents: school.schoolData?.currentStudents || '0',
        studentCapacity: school.schoolData?.studentCapacity || '0',
        lastActive: school.updatedAt || school.createdAt,
        joinDate: school.createdAt,
        schoolData: school // Store full school data for details
      }));

      setFilteredSchools(transformedSchools);
    }
  }, [users, searchTerm, statusFilter]);

  // Handle delete success
  useEffect(() => {
    if (deleteSuccess) {
      toast.success('School deleted successfully!');
      dispatch({ type: DELETE_USER_RESET });
      dispatch(allUserAction()); // Refresh the list
    }
  }, [deleteSuccess, dispatch]);

  // Handle errors
  useEffect(() => {
    if (allUsersError) {
      toast.error(allUsersError);
      dispatch(clearErrors());
    }
    
    if (deleteError) {
      toast.error(deleteError);
      dispatch(clearErrors());
    }
  }, [allUsersError, deleteError, dispatch]);

  const handleDeleteSchool = (schoolId) => {
    if (window.confirm('Are you sure you want to delete this school? This action cannot be undone.')) {
      console.log('🗑️ Deleting school:', schoolId);
      dispatch(deleteUserAction(schoolId));
    }
  };

  const viewSchoolDetails = (school) => {
    setSelectedSchool(school);
    // Optionally fetch detailed school data
    if (school.schoolData?._id) {
      dispatch(getUserDetails(school.schoolData._id));
    }
  };

  const closeSchoolDetails = () => {
    setSelectedSchool(null);
  };



  const handleExportSchools = () => {
        navigate('/system-admin-dashboard');

  };

  // Statistics
  const stats = {
    totalSchools: filteredSchools.length,
    activeSchools: filteredSchools.filter(s => s.status === 'active').length,
    schoolsWithOpenings: filteredSchools.filter(s => s.immediateOpenings !== '0' && s.immediateOpenings !== 'Not specified').length,
    avgOpenings: filteredSchools.length > 0 
      ? Math.round(filteredSchools.reduce((sum, s) => {
          const openings = parseInt(s.immediateOpenings) || 0;
          return sum + openings;
        }, 0) / filteredSchools.length)
      : 0
  };

  // Format date
  const formatDate = (dateString) => {
    if (!dateString) return 'Not specified';
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
      });
    } catch (error) {
      return 'Invalid date';
    }
  };

  // Show loading state
  if (allUsersLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="text-center">
          <FaSpinner className="animate-spin text-4xl text-blue-600 mx-auto mb-4" />
          <p className="text-gray-600">Loading schools...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen mt-30 bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Header */}
      <div className="bg-white shadow-lg">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold text-gray-800">Schools Dashboard</h1>
              <p className="text-gray-600">Manage all schools and their recruitment needs</p>
            </div>
            <div className="flex gap-3">
              <button 
                onClick={handleExportSchools}
                className="bg-gradient-to-r from-green-500 to-emerald-600 text-white px-6 py-3 rounded-lg flex items-center hover:from-green-600 hover:to-emerald-700 transition-all shadow-lg"
              >
                <FaRocket className="mr-2" />
                Back to Dashboard
              </button>
           
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Statistics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <StatCard 
            title="Total Schools"
            value={stats.totalSchools}
            icon={<FaBuilding className="text-blue-500" />}
            color="blue"
          />
          <StatCard 
            title="Active Schools"
            value={stats.activeSchools}
            icon={<FaChartLine className="text-green-500" />}
            color="green"
          />
          <StatCard 
            title="Schools with Openings"
            value={stats.schoolsWithOpenings}
            icon={<FaBriefcase className="text-orange-500" />}
            color="orange"
          />
          <StatCard 
            title="Avg Openings/School"
            value={stats.avgOpenings}
            icon={<FaUsers className="text-purple-500" />}
            color="purple"
          />
        </div>

        {/* Search and Controls */}
        <div className="bg-white rounded-2xl shadow-lg p-6 mb-8">
          <div className="flex flex-col lg:flex-row gap-4 items-center justify-between">
            <div className="flex flex-col sm:flex-row gap-4 flex-1 w-full">
              <div className="relative flex-1">
                <FaSearch className="absolute left-4 top-3 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search schools by name, email, city, or curriculum..."
                  className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              <div className="relative">
                <FaFilter className="absolute left-4 top-3 text-gray-400" />
                <select 
                  className="pl-12 pr-8 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none bg-white"
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                >
                  <option value="all">All Status</option>
                  <option value="active">Active</option>
                  <option value="pending">Pending</option>
                  <option value="inactive">Inactive</option>
                </select>
              </div>
            </div>
            
            <div className="flex gap-2 bg-gray-100 p-1 rounded-xl">
              <button
                onClick={() => setActiveView('grid')}
                className={`px-4 py-2 rounded-lg transition-all ${
                  activeView === 'grid' 
                    ? 'bg-white shadow-md text-blue-600' 
                    : 'text-gray-600 hover:text-blue-600'
                }`}
              >
                <FaList className="inline mr-2" />
                Grid View
              </button>
              <button
                onClick={() => setActiveView('list')}
                className={`px-4 py-2 rounded-lg transition-all ${
                  activeView === 'list' 
                    ? 'bg-white shadow-md text-blue-600' 
                    : 'text-gray-600 hover:text-blue-600'
                }`}
              >
                <FaList className="inline mr-2" />
                List View
              </button>
            </div>
          </div>
        </div>

        {/* Schools Display */}
        {allUsersError ? (
          <div className="bg-red-50 border border-red-200 rounded-2xl p-8 text-center">
            <FaTimes className="text-red-500 text-4xl mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-red-800 mb-2">Error Loading Schools</h3>
            <p className="text-red-600 mb-4">{allUsersError}</p>
            <button
              onClick={() => dispatch(allUserAction())}
              className="px-6 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
            >
              Try Again
            </button>
          </div>
        ) : activeView === 'grid' ? (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            {filteredSchools.map((school) => (
              <SchoolCard 
                key={school.id}
                school={school}
                onView={viewSchoolDetails}
                onDelete={handleDeleteSchool}
                formatDate={formatDate}
              />
            ))}
          </div>
        ) : (
          <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">School Details</th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Location</th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Openings</th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredSchools.map((school) => (
                  <SchoolRow 
                    key={school.id}
                    school={school}
                    onView={viewSchoolDetails}
                    onDelete={handleDeleteSchool}
                    formatDate={formatDate}
                  />
                ))}
              </tbody>
            </table>
          </div>
        )}

        {filteredSchools.length === 0 && !allUsersLoading && (
          <div className="text-center py-12 bg-white rounded-2xl shadow-lg">
            <div className="text-gray-400 text-6xl mb-4">🏫</div>
            <h3 className="text-xl font-semibold text-gray-700 mb-2">No Schools Found</h3>
            <p className="text-gray-500 mb-6">
              {searchTerm || statusFilter !== 'all' 
                ? 'No schools match your search criteria.' 
                : 'No schools registered yet.'}
            </p>
            {searchTerm && (
              <button
                onClick={() => {
                  setSearchTerm('');
                  setStatusFilter('all');
                }}
                className="px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
              >
                Clear Filters
              </button>
            )}
          </div>
        )}
      </div>

      {/* School Details Modal */}
      {selectedSchool && (
        <SchoolDetailsModal 
          school={selectedSchool}
          onClose={closeSchoolDetails}
          formatDate={formatDate}
        />
      )}
    </div>
  );
};

// Stat Card Component
const StatCard = ({ title, value, icon, color }) => {
  const colorClasses = {
    blue: 'border-blue-200 bg-blue-50',
    green: 'border-green-200 bg-green-50',
    purple: 'border-purple-200 bg-purple-50',
    orange: 'border-orange-200 bg-orange-50'
  };

  return (
    <div className={`bg-white rounded-2xl shadow-lg p-6 border-l-4 ${colorClasses[color]} hover:shadow-xl transition-shadow`}>
      <div className="flex justify-between items-center">
        <div>
          <p className="text-gray-600 text-sm font-medium">{title}</p>
          <p className="text-3xl font-bold text-gray-800 mt-2">{value}</p>
        </div>
        <div className="text-3xl opacity-80">
          {icon}
        </div>
      </div>
    </div>
  );
};

// School Card Component (Grid View)
const SchoolCard = ({ school, onView, onDelete, formatDate }) => {
  return (
    <div className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden group">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-500 to-purple-600 p-6 text-white">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="w-16 h-16 bg-white bg-opacity-20 rounded-full flex items-center justify-center text-xl font-bold">
              {school.avatar}
            </div>
            <div>
              <h3 className="text-xl font-bold">{school.name}</h3>
              <p className="text-blue-100">{school.city}, {school.country}</p>
            </div>
          </div>
          <span className="px-3 py-1 rounded-full text-sm font-medium bg-green-500 text-white">
            {school.status}
          </span>
        </div>
      </div>

      {/* Body */}
      <div className="p-6">
        {/* Contact Info */}
        <div className="space-y-2 mb-4">
          <div className="flex items-center text-gray-600">
            <FaEnvelope className="mr-3 text-blue-500" />
            <span className="text-sm truncate">{school.email}</span>
          </div>
          {school.phone !== 'No phone' && (
            <div className="flex items-center text-gray-600">
              <FaPhone className="mr-3 text-green-500" />
              <span className="text-sm">{school.phone}</span>
            </div>
          )}
          <div className="flex items-center text-gray-600">
            <FaMapMarkerAlt className="mr-3 text-red-500" />
            <span className="text-sm truncate">{school.address}</span>
          </div>
        </div>

        {/* School Type & Curriculum */}
        <div className="mb-4">
          <div className="flex flex-wrap gap-1 mb-2">
            {school.schoolType.slice(0, 2).map((type, index) => (
              <span 
                key={index}
                className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full"
              >
                {type}
              </span>
            ))}
            {school.schoolType.length > 2 && (
              <span className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-full">
                +{school.schoolType.length - 2} more
              </span>
            )}
          </div>
          {school.curriculum.length > 0 && (
            <div className="flex flex-wrap gap-1">
              {school.curriculum.slice(0, 2).map((curr, index) => (
                <span 
                  key={index}
                  className="px-2 py-1 bg-purple-100 text-purple-800 text-xs rounded-full"
                >
                  {curr}
                </span>
              ))}
            </div>
          )}
        </div>

        {/* Openings Info */}
        <div className="mb-4 p-3 bg-gradient-to-r from-orange-50 to-yellow-50 rounded-lg">
          <div className="flex justify-between items-center">
            <div>
              <p className="text-sm font-medium text-gray-700">Immediate Openings</p>
              <p className="text-lg font-bold text-orange-600">{school.immediateOpenings}</p>
            </div>
            {school.expectedTeachers !== '0' && (
              <div className="text-right">
                <p className="text-sm font-medium text-gray-700">Expected Teachers</p>
                <p className="text-lg font-bold text-green-600">{school.expectedTeachers}</p>
              </div>
            )}
          </div>
        </div>

        {/* Join Date */}
        <div className="mb-4 text-sm text-gray-500">
          <FaCalendar className="inline mr-1" />
          Member since {formatDate(school.joinDate)}
        </div>

        {/* Actions */}
        <div className="flex justify-between pt-4 border-t border-gray-100">
          <button 
            onClick={() => onView(school)}
            className="flex items-center text-blue-600 hover:text-blue-800 text-sm font-medium"
          >
            <FaEye className="mr-1" />
            View Details
          </button>
          <button 
            onClick={() => onDelete(school.id)}
            className="flex items-center text-red-600 hover:text-red-800 text-sm font-medium"
          >
            <FaTrash className="mr-1" />
            Delete
          </button>
        </div>
      </div>
    </div>
  );
};

// School Row Component (List View)
const SchoolRow = ({ school, onView, onDelete, formatDate }) => {
  return (
    <tr className="hover:bg-gray-50 transition-colors">
      <td className="px-6 py-4 whitespace-nowrap">
        <div className="flex items-center">
          <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-bold mr-4">
            {school.avatar}
          </div>
          <div>
            <div className="text-sm font-medium text-gray-900">{school.name}</div>
            <div className="text-sm text-gray-500">{school.email}</div>
          </div>
        </div>
      </td>
      <td className="px-6 py-4 whitespace-nowrap">
        <div className="text-sm text-gray-900">{school.city}</div>
        <div className="text-sm text-gray-500">{school.country}</div>
      </td>
      <td className="px-6 py-4 whitespace-nowrap">
        <div className="text-sm font-bold text-gray-900">{school.immediateOpenings}</div>
        <div className="text-sm text-gray-500">positions</div>
      </td>
      <td className="px-6 py-4 whitespace-nowrap">
        <span className={`px-3 py-1 text-xs rounded-full font-medium ${
          school.status === 'active' 
            ? 'bg-green-100 text-green-800' 
            : school.status === 'pending'
            ? 'bg-yellow-100 text-yellow-800'
            : 'bg-red-100 text-red-800'
        }`}>
          {school.status}
        </span>
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
        <div className="flex space-x-3">
          <button 
            onClick={() => onView(school)}
            className="text-blue-600 hover:text-blue-900"
            title="View Details"
          >
            <FaEye />
          </button>
          <button 
            onClick={() => onDelete(school.id)}
            className="text-red-600 hover:text-red-900"
            title="Delete School"
          >
            <FaTrash />
          </button>
        </div>
      </td>
    </tr>
  );
};

// School Details Modal Component (Actions Removed)
const SchoolDetailsModal = ({ school, onClose, formatDate }) => {
  const fullSchoolData = school.schoolData;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 mt-20 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-2xl shadow-2xl max-w-6xl w-full max-h-[75vh] overflow-y-auto">
        {/* Header */}
        <div className="bg-gradient-to-r  from-blue-500 to-purple-600 p-6 text-white rounded-t-2xl">
          <div className="flex justify-between items-start">
            <div className="flex items-center space-x-4">
              <div className="w-24 h-24 bg-white bg-opacity-20 rounded-full flex items-center justify-center text-2xl font-bold">
                {school.avatar}
              </div>
              <div>
                <h2 className="text-2xl font-bold">{school.name}</h2>
                <p className="text-blue-100">
                  {school.city}, {school.country} • Established: {school.establishedYear}
                </p>
                <p className="text-blue-100 text-sm flex items-center gap-2 mt-1">
                  <FaEnvelope className="inline" /> {school.email}
                  {school.phone !== 'No phone' && (
                    <>
                      <span className="mx-2">•</span>
                      <FaPhone className="inline" /> {school.phone}
                    </>
                  )}
                </p>
              </div>
            </div>
            <div className="flex flex-col items-end gap-2">
              <button 
                onClick={onClose}
                className="text-white hover:text-gray-200 text-2xl"
              >
                ×
              </button>
              <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                school.status === 'active' 
                  ? 'bg-green-500 text-white' 
                  : school.status === 'pending'
                  ? 'bg-yellow-500 text-white'
                  : 'bg-red-500 text-white'
              }`}>
                {school.status}
              </span>
            </div>
          </div>
        </div>

        <div className="p-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Left Column - School Info */}
            <div className="lg:col-span-2 space-y-6">
              {/* School Information */}
              <div className="bg-white border border-gray-200 rounded-xl p-6">
                <h3 className="text-lg font-semibold mb-4">School Information</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-gray-600">School Type</p>
                    <div className="flex flex-wrap gap-2 mt-1">
                      {school.schoolType.map((type, index) => (
                        <span key={index} className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm">
                          {type}
                        </span>
                      ))}
                    </div>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">School Level</p>
                    <div className="flex flex-wrap gap-2 mt-1">
                      {school.schoolLevel.map((level, index) => (
                        <span key={index} className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm">
                          {level}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                {school.schoolDescription && (
                  <div className="mt-4">
                    <p className="text-sm text-gray-600 mb-2">Description</p>
                    <p className="text-gray-700 leading-relaxed">{school.schoolDescription}</p>
                  </div>
                )}

                {school.website && school.website !== 'No website' && (
                  <div className="mt-4">
                    <p className="text-sm text-gray-600">Website</p>
                    <a href={`https://${school.website}`} target="_blank" rel="noopener noreferrer" 
                       className="text-blue-600 hover:underline">
                      {school.website}
                    </a>
                  </div>
                )}
              </div>

              {/* Staffing Requirements */}
              <div className="bg-white border border-gray-200 rounded-xl p-6">
                <h3 className="text-lg font-semibold mb-4">Staffing Requirements</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <p className="text-sm text-gray-600">Staffing Needs</p>
                    <div className="flex flex-wrap gap-2 mt-2">
                      {school.staffingNeeds.map((need, index) => (
                        <span key={index} className="px-3 py-1 bg-purple-100 text-purple-800 rounded-full text-sm">
                          {need}
                        </span>
                      ))}
                    </div>
                  </div>
                  
                  <div>
                    <p className="text-sm text-gray-600">Curriculum</p>
                    <div className="flex flex-wrap gap-2 mt-2">
                      {school.curriculum.map((curr, index) => (
                        <span key={index} className="px-3 py-1 bg-orange-100 text-orange-800 rounded-full text-sm">
                          {curr}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
                  <div className="p-4 bg-blue-50 rounded-xl text-center">
                    <p className="text-2xl font-bold text-blue-600">{school.immediateOpenings}</p>
                    <p className="text-sm text-gray-600">Immediate Openings</p>
                  </div>
                  
                  {school.expectedTeachers !== '0' && (
                    <div className="p-4 bg-green-50 rounded-xl text-center">
                      <p className="text-2xl font-bold text-green-600">{school.expectedTeachers}</p>
                      <p className="text-sm text-gray-600">Expected Teachers</p>
                    </div>
                  )}
                  
                  {school.studentCapacity !== '0' && (
                    <div className="p-4 bg-purple-50 rounded-xl text-center">
                      <p className="text-lg font-bold text-purple-600">
                        {school.currentStudents}/{school.studentCapacity}
                      </p>
                      <p className="text-sm text-gray-600">Students Capacity</p>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Right Column - Contact & Additional Info */}
            <div className="lg:col-span-1 space-y-6">
              {/* Contact Information */}
              <div className="bg-white border border-gray-200 rounded-xl p-6">
                <h3 className="text-lg font-semibold mb-4">Contact Information</h3>
                <div className="space-y-4">
                  {school.contactPerson !== 'Not specified' && (
                    <div>
                      <p className="text-sm text-gray-600">Contact Person</p>
                      <p className="font-medium">{school.contactPerson}</p>
                      {school.contactPosition !== 'Not specified' && (
                        <p className="text-sm text-gray-500">{school.contactPosition}</p>
                      )}
                    </div>
                  )}
                  
                  {school.principalName !== 'Not specified' && (
                    <div>
                      <p className="text-sm text-gray-600">Principal/Director</p>
                      <p className="font-medium">{school.principalName}</p>
                    </div>
                  )}

                  <div className="pt-4 border-t border-gray-200">
                    <div className="space-y-3">
                      <div className="flex items-center gap-3">
                        <FaEnvelope className="text-blue-500" />
                        <div>
                          <p className="text-sm font-medium">{school.email}</p>
                          <p className="text-xs text-gray-500">Email</p>
                        </div>
                      </div>
                      
                      {school.phone !== 'No phone' && (
                        <div className="flex items-center gap-3">
                          <FaPhone className="text-green-500" />
                          <div>
                            <p className="text-sm font-medium">{school.phone}</p>
                            <p className="text-xs text-gray-500">Phone</p>
                          </div>
                        </div>
                      )}
                      
                      {school.alternativeContact !== 'Not specified' && (
                        <div className="flex items-center gap-3">
                          <FaPhone className="text-orange-500" />
                          <div>
                            <p className="text-sm font-medium">{school.alternativeContact}</p>
                            <p className="text-xs text-gray-500">Alternative Contact</p>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              {/* Additional Information */}
              <div className="bg-white border border-gray-200 rounded-xl p-6">
                <h3 className="text-lg font-semibold mb-4">Additional Information</h3>
                <div className="space-y-4">
                  {school.salaryRange !== 'Not specified' && (
                    <div>
                      <p className="text-sm text-gray-600">Salary Range</p>
                      <p className="font-medium text-green-600">{school.salaryRange}</p>
                    </div>
                  )}
                  
                  {school.hiringTimeline !== 'Not specified' && (
                    <div>
                      <p className="text-sm text-gray-600">Hiring Timeline</p>
                      <p className="font-medium">{school.hiringTimeline}</p>
                    </div>
                  )}
                  
                  {school.benefits !== 'Not specified' && (
                    <div>
                      <p className="text-sm text-gray-600">Benefits</p>
                      <p className="font-medium">{school.benefits}</p>
                    </div>
                  )}
                  
                  {school.facilities !== 'Not specified' && (
                    <div>
                      <p className="text-sm text-gray-600">Facilities</p>
                      <p className="font-medium">{school.facilities}</p>
                    </div>
                  )}
                  
                  {school.accreditation !== 'Not specified' && (
                    <div>
                      <p className="text-sm text-gray-600">Accreditation</p>
                      <p className="font-medium">{school.accreditation}</p>
                    </div>
                  )}
                  
                  {school.partnershipInterest !== 'No' && (
                    <div>
                      <p className="text-sm text-green-600">Partnership Interest</p>
                      <p className="font-medium text-green-800">{school.partnershipInterest}</p>
                    </div>
                  )}
                </div>
              </div>

              {/* Member Information */}
              <div className="bg-white border border-gray-200 rounded-xl p-6">
                <h3 className="text-lg font-semibold mb-4">Member Information</h3>
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Member Since</span>
                    <span className="font-medium">{formatDate(school.joinDate)}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Last Active</span>
                    <span className="font-medium">{formatDate(school.lastActive)}</span>
                  </div>
                  <div className="pt-3 border-t border-gray-200 text-center">
                    <span className="text-xs text-gray-500">ID: {school.id}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SchoolsDashboard;