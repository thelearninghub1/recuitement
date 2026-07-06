// src/pages/CandidatesDashboard.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  FaSearch, 
  FaEye, 
  FaTrash, 
  FaDownload, 
  FaFilter,
  FaUserPlus,
  FaFilePdf,
  FaEnvelope,
  FaPhone,
  FaMapMarkerAlt,
  FaGraduationCap,
  FaBriefcase,
  FaChartBar,
  FaList,
  FaIdCard,
  FaSpinner,
  FaUserCheck,
  FaTimes,
  FaStar,
  FaCalendar,
  FaLanguage,
  FaCertificate,
  FaSchool,
  FaUsers
} from 'react-icons/fa';
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import { allUserAction, clearErrors, deleteUserAction, getUserDetails } from '../../actions/userActions';
import { DELETE_USER_RESET } from '../../constants/userConstants';

const CandidatesDashboard = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  
  // Redux states
  const { user, loading: singleUserLoading, error: singleUserError } = useSelector((state) => state.getSingleUser);
  const { users, loading: allUsersLoading, error: allUsersError } = useSelector((state) => state.allUsers);
  const { message, success: deleteSuccess, loading: deleteLoading, error: deleteError } = useSelector((state) => state.updatePassword);
  
  const [activeView, setActiveView] = useState('grid'); // 'grid' or 'list'
  const [selectedCandidate, setSelectedCandidate] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [filteredCandidates, setFilteredCandidates] = useState([]);

  // Load all users on component mount
  useEffect(() => {
    console.log('📥 Loading all users...');
    dispatch(allUserAction());
  }, [dispatch]);

  // Filter candidates based on role, search term, and status
  useEffect(() => {
    if (users && Array.isArray(users)) {
      // Filter only users with role 'candidate'
      let candidates = users.filter(user => user.role === 'candidate');
      
      // Apply search filter
      if (searchTerm) {
        candidates = candidates.filter(candidate => {
          const searchLower = searchTerm.toLowerCase();
          return (
            (candidate.profile?.firstName?.toLowerCase().includes(searchLower) || 
             candidate.profile?.lastName?.toLowerCase().includes(searchLower)) ||
            candidate.email?.toLowerCase().includes(searchLower) ||
            candidate.candidateData?.skills?.some(skill => 
              skill.toLowerCase().includes(searchLower)
            ) ||
            candidate.candidateData?.positionsInterested?.some(position => 
              position.toLowerCase().includes(searchLower)
            ) ||
            candidate.candidateData?.universityName?.toLowerCase().includes(searchLower)
          );
        });
      }

      // Apply status filter - only show active candidates
      if (statusFilter !== 'all') {
        candidates = candidates.filter(candidate => 
          candidate.candidateData?.status === statusFilter
        );
      }

      // Transform data for display
      const transformedCandidates = candidates.map((candidate, index) => ({
        id: candidate._id || `candidate-${index}`,
        name: `${candidate.profile?.firstName || ''} ${candidate.profile?.lastName || ''}`.trim() || 'Anonymous',
        email: candidate.email || 'No email',
        phone: candidate.profile?.mobile || candidate.candidateData?.whatsapp || 'No phone',
        location: candidate.candidateData?.currentCity || candidate.candidateData?.countryOfResidence || 'Location not specified',
        avatar: candidate.profile?.firstName?.charAt(0) + candidate.profile?.lastName?.charAt(0) || 'U',
        education: candidate.candidateData?.degree || 'Education not specified',
        degreeOther: candidate.candidateData?.degreeOther || '',
        universityName: candidate.candidateData?.universityName || '',
        experience: candidate.candidateData?.totalExperience || 'Not specified',
        currentRole: candidate.candidateData?.positionsInterested?.[0] || 'Candidate',
        skills: candidate.candidateData?.skills || ['No skills specified'],
        languages: candidate.candidateData?.languages || [],
        languagesOther: candidate.candidateData?.languagesOther || '',
        curriculumTaught: candidate.candidateData?.curriculumTaught || [],
        positionsInterested: candidate.candidateData?.positionsInterested || [],
        status: 'active', // Force all status to active
        totalApplications: candidate.candidateData?.applications?.length || 0,
        lastActive: candidate.updatedAt || candidate.createdAt,
        joinDate: candidate.createdAt,
        profileCompletion: calculateProfileCompletion(candidate),
        candidateData: candidate // Store full candidate data for details
      }));

      setFilteredCandidates(transformedCandidates);
    }
  }, [users, searchTerm, statusFilter]);

  // Handle delete success
  useEffect(() => {
    if (deleteSuccess) {
      toast.success('Candidate deleted successfully!');
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

  // Calculate profile completion percentage
  const calculateProfileCompletion = (candidate) => {
    let score = 0;
    const totalFields = 15;

    if (candidate.profile?.firstName && candidate.profile?.lastName) score++;
    if (candidate.email) score++;
    if (candidate.profile?.mobile || candidate.candidateData?.whatsapp) score++;
    if (candidate.candidateData?.nationality) score++;
    if (candidate.candidateData?.degree) score++;
    if (candidate.candidateData?.universityName) score++;
    if (candidate.candidateData?.totalExperience) score++;
    if (candidate.candidateData?.positionsInterested?.length > 0) score++;
    if (candidate.candidateData?.skills?.length > 0) score++;
    if (candidate.candidateData?.languages?.length > 0) score++;
    if (candidate.candidateData?.curriculumTaught?.length > 0) score++;
    if (candidate.candidateData?.currentInstitution) score++;
    if (candidate.candidateData?.expectedSalary) score++;
    if (candidate.candidateData?.dob) score++;
    if (candidate.candidateData?.gender) score++;

    return Math.round((score / totalFields) * 100);
  };

  const handleDeleteCandidate = (candidateId) => {
    if (window.confirm('Are you sure you want to delete this candidate? This action cannot be undone.')) {
      console.log('🗑️ Deleting candidate:', candidateId);
      dispatch(deleteUserAction(candidateId));
    }
  };

  const viewCandidateDetails = (candidate) => {
    setSelectedCandidate(candidate);
    // Optionally fetch detailed candidate data
    if (candidate.candidateData?._id) {
      dispatch(getUserDetails(candidate.candidateData._id));
    }
  };

  const closeCandidateDetails = () => {
    setSelectedCandidate(null);
  };


  const handleExportCandidates = () => {
        navigate('/system-admin-dashboard');

  };

  // Statistics
  const stats = {
    totalCandidates: filteredCandidates.length,
    activeCandidates: filteredCandidates.length, // All are active now
    highProfileCandidates: filteredCandidates.filter(c => c.profileCompletion >= 80).length,
    avgProfileCompletion: filteredCandidates.length > 0 
      ? Math.round(filteredCandidates.reduce((sum, c) => sum + c.profileCompletion, 0) / filteredCandidates.length)
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
          <p className="text-gray-600">Loading candidates...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br mt-30 from-blue-50 to-indigo-100">
      {/* Header */}
      <div className="bg-white shadow-lg">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold text-gray-800">Candidates Dashboard</h1>
              <p className="text-gray-600">Manage all teacher candidates</p>
            </div>
            <div className="flex gap-3">
              <button 
                onClick={handleExportCandidates}
                className="bg-gradient-to-r from-green-500 to-emerald-600 text-white px-6 py-3 rounded-lg flex items-center hover:from-green-600 hover:to-emerald-700 transition-all shadow-lg"
              >
                <FaDownload className="mr-2" />
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
            title="Total Candidates"
            value={stats.totalCandidates}
            icon={<FaUsers className="text-blue-500" />}
            color="blue"
          />
          <StatCard 
            title="Active Candidates"
            value={stats.activeCandidates}
            icon={<FaUserCheck className="text-green-500" />}
            color="green"
          />
          <StatCard 
            title="High Profile"
            value={stats.highProfileCandidates}
            icon={<FaStar className="text-yellow-500" />}
            color="yellow"
          />
          <StatCard 
            title="Avg Profile Score"
            value={`${stats.avgProfileCompletion}%`}
            icon={<FaChartBar className="text-purple-500" />}
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
                  placeholder="Search by name, email, position, or university..."
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
                  <option value="all">All Candidates</option>
                  <option value="active">Active</option>
                  <option value="pending-review">Pending Review</option>
                  <option value="approved">Approved</option>
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

        {/* Candidates Display */}
        {allUsersError ? (
          <div className="bg-red-50 border border-red-200 rounded-2xl p-8 text-center">
            <FaTimes className="text-red-500 text-4xl mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-red-800 mb-2">Error Loading Candidates</h3>
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
            {filteredCandidates.map((candidate) => (
              <CandidateCard 
                key={candidate.id}
                candidate={candidate}
                onView={viewCandidateDetails}
                onDelete={handleDeleteCandidate}
                formatDate={formatDate}
              />
            ))}
          </div>
        ) : (
          <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Candidate</th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Education</th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Experience</th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Positions</th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Profile</th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredCandidates.map((candidate) => (
                  <CandidateRow 
                    key={candidate.id}
                    candidate={candidate}
                    onView={viewCandidateDetails}
                    onDelete={handleDeleteCandidate}
                    formatDate={formatDate}
                  />
                ))}
              </tbody>
            </table>
          </div>
        )}

        {filteredCandidates.length === 0 && !allUsersLoading && (
          <div className="text-center py-12 bg-white rounded-2xl shadow-lg">
            <div className="text-gray-400 text-6xl mb-4">👤</div>
            <h3 className="text-xl font-semibold text-gray-700 mb-2">No Candidates Found</h3>
            <p className="text-gray-500 mb-6">
              {searchTerm || statusFilter !== 'all' 
                ? 'No candidates match your search criteria.' 
                : 'No candidates registered yet.'}
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

      {/* Candidate Details Modal */}
      {selectedCandidate && (
        <CandidateDetailsModal 
          candidate={selectedCandidate}
          onClose={closeCandidateDetails}
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
    yellow: 'border-yellow-200 bg-yellow-50'
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

// Candidate Card Component (Grid View)
const CandidateCard = ({ candidate, onView, onDelete, formatDate }) => {
  return (
    <div className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden group">
      {/* Header with Avatar */}
      <div className="bg-gradient-to-r from-blue-500 to-purple-600 p-6 text-white">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="w-16 h-16 bg-white bg-opacity-20 rounded-full flex items-center justify-center text-xl font-bold">
              {candidate.avatar}
            </div>
            <div>
              <h3 className="text-xl font-bold">{candidate.name}</h3>
              <p className="text-blue-100">{candidate.currentRole}</p>
            </div>
          </div>
          <span className="px-3 py-1 rounded-full text-sm font-medium bg-green-500 text-white">
            Active
          </span>
        </div>
      </div>

      {/* Body */}
      <div className="p-6">
        {/* Contact Info */}
        <div className="space-y-2 mb-4">
          <div className="flex items-center text-gray-600">
            <FaEnvelope className="mr-3 text-blue-500" />
            <span className="text-sm truncate">{candidate.email}</span>
          </div>
          {candidate.phone !== 'No phone' && (
            <div className="flex items-center text-gray-600">
              <FaPhone className="mr-3 text-green-500" />
              <span className="text-sm">{candidate.phone}</span>
            </div>
          )}
          <div className="flex items-center text-gray-600">
            <FaMapMarkerAlt className="mr-3 text-red-500" />
            <span className="text-sm">{candidate.location}</span>
          </div>
        </div>

        {/* Education & Experience */}
        <div className="grid grid-cols-2 gap-4 mb-4">
          <div className="flex items-center text-gray-600">
            <FaGraduationCap className="mr-2 text-purple-500" />
            <div>
              <span className="text-xs font-medium block">{candidate.education}</span>
              <span className="text-xs text-gray-500 truncate">{candidate.universityName}</span>
            </div>
          </div>
          <div className="flex items-center text-gray-600">
            <FaBriefcase className="mr-2 text-orange-500" />
            <div>
              <span className="text-xs font-medium block">{candidate.experience}</span>
              <span className="text-xs text-gray-500">Experience</span>
            </div>
          </div>
        </div>

        {/* Positions Interested */}
        {candidate.positionsInterested.length > 0 && (
          <div className="mb-4">
            <h4 className="text-sm font-medium text-gray-700 mb-2">Positions</h4>
            <div className="flex flex-wrap gap-1">
              {candidate.positionsInterested.slice(0, 2).map((position, index) => (
                <span 
                  key={index}
                  className="px-2 py-1 bg-purple-100 text-purple-800 text-xs rounded-full"
                >
                  {position}
                </span>
              ))}
              {candidate.positionsInterested.length > 2 && (
                <span className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-full">
                  +{candidate.positionsInterested.length - 2} more
                </span>
              )}
            </div>
          </div>
        )}

        {/* Profile Completion */}
        <div className="mb-4">
          <div className="flex justify-between text-xs text-gray-600 mb-1">
            <span>Profile Score</span>
            <span>{candidate.profileCompletion}%</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div 
              className={`h-2 rounded-full transition-all duration-500 ${
                candidate.profileCompletion >= 80 ? 'bg-green-500' :
                candidate.profileCompletion >= 50 ? 'bg-yellow-500' :
                'bg-red-500'
              }`}
              style={{ width: `${candidate.profileCompletion}%` }}
            ></div>
          </div>
        </div>

        {/* Actions */}
        <div className="flex justify-between pt-4 border-t border-gray-100">
          <button 
            onClick={() => onView(candidate)}
            className="flex items-center text-blue-600 hover:text-blue-800 text-sm font-medium"
          >
            <FaEye className="mr-1" />
            View Details
          </button>
          <button 
            onClick={() => onDelete(candidate.id)}
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

// Candidate Row Component (List View)
const CandidateRow = ({ candidate, onView, onDelete, formatDate }) => {
  return (
    <tr className="hover:bg-gray-50 transition-colors">
      <td className="px-6 py-4 whitespace-nowrap">
        <div className="flex items-center">
          <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-bold mr-4">
            {candidate.avatar}
          </div>
          <div>
            <div className="text-sm font-medium text-gray-900">{candidate.name}</div>
            <div className="text-sm text-gray-500">{candidate.email}</div>
          </div>
        </div>
      </td>
      <td className="px-6 py-4 whitespace-nowrap">
        <div className="text-sm text-gray-900">{candidate.education}</div>
        <div className="text-sm text-gray-500">{candidate.universityName}</div>
      </td>
      <td className="px-6 py-4 whitespace-nowrap">
        <div className="text-sm text-gray-900">{candidate.experience}</div>
        <div className="text-sm text-gray-500">{candidate.location}</div>
      </td>
      <td className="px-6 py-4">
        <div className="flex flex-wrap gap-1 max-w-xs">
          {candidate.positionsInterested.slice(0, 2).map((position, index) => (
            <span key={index} className="px-2 py-1 bg-purple-100 text-purple-800 text-xs rounded-full">
              {position}
            </span>
          ))}
          {candidate.positionsInterested.length > 2 && (
            <span className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-full">
              +{candidate.positionsInterested.length - 2}
            </span>
          )}
        </div>
      </td>
      <td className="px-6 py-4 whitespace-nowrap">
        <div className="flex items-center">
          <div className="w-full bg-gray-200 rounded-full h-2 mr-2">
            <div 
              className={`h-2 rounded-full ${
                candidate.profileCompletion >= 80 ? 'bg-green-500' :
                candidate.profileCompletion >= 50 ? 'bg-yellow-500' :
                'bg-red-500'
              }`}
              style={{ width: `${candidate.profileCompletion}%` }}
            ></div>
          </div>
          <span className="text-sm text-gray-600">{candidate.profileCompletion}%</span>
        </div>
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
        <div className="flex space-x-3">
          <button 
            onClick={() => onView(candidate)}
            className="text-blue-600 hover:text-blue-900"
            title="View Details"
          >
            <FaEye />
          </button>
          <button 
            onClick={() => onDelete(candidate.id)}
            className="text-red-600 hover:text-red-900"
            title="Delete Candidate"
          >
            <FaTrash />
          </button>
        </div>
      </td>
    </tr>
  );
};

// Candidate Details Modal Component
const CandidateDetailsModal = ({ candidate, onClose, formatDate }) => {
  const fullCandidateData = candidate.candidateData;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-2xl shadow-2xl max-w-6xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-500 to-purple-600 p-6 text-white rounded-t-2xl">
          <div className="flex justify-between items-start">
            <div className="flex items-center space-x-4">
              <div className="w-24 h-24 bg-white bg-opacity-20 rounded-full flex items-center justify-center text-2xl font-bold">
                {candidate.avatar}
              </div>
              <div>
                <h2 className="text-2xl font-bold">{candidate.name}</h2>
                <p className="text-blue-100">
                  {candidate.currentRole} • {candidate.location}
                </p>
                <p className="text-blue-100 text-sm flex items-center gap-2 mt-1">
                  <FaEnvelope className="inline" /> {candidate.email}
                  {candidate.phone !== 'No phone' && (
                    <>
                      <span className="mx-2">•</span>
                      <FaPhone className="inline" /> {candidate.phone}
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
              <span className="px-3 py-1 rounded-full text-sm font-medium bg-green-500 text-white">
                Active
              </span>
            </div>
          </div>
        </div>

        <div className="p-6">
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
            {/* Left Column - Personal & Contact Info */}
            <div className="lg:col-span-1 space-y-6">
              {/* Personal Information Card */}
              <div className="bg-gray-50 rounded-xl p-6">
                <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                  <FaUserCheck className="text-blue-500" />
                  Personal Information
                </h3>
                <div className="space-y-3">
                  {fullCandidateData?.gender && (
                    <div>
                      <p className="text-sm text-gray-600">Gender</p>
                      <p className="font-medium">{fullCandidateData.gender}</p>
                    </div>
                  )}
                  {fullCandidateData?.dob && (
                    <div>
                      <p className="text-sm text-gray-600">Date of Birth</p>
                      <p className="font-medium">{formatDate(fullCandidateData.dob)}</p>
                    </div>
                  )}
                  {fullCandidateData?.nationality && (
                    <div>
                      <p className="text-sm text-gray-600">Nationality</p>
                      <p className="font-medium">{fullCandidateData.nationality}</p>
                    </div>
                  )}
                  {fullCandidateData?.maritalStatus && (
                    <div>
                      <p className="text-sm text-gray-600">Marital Status</p>
                      <p className="font-medium">{fullCandidateData.maritalStatus}</p>
                    </div>
                  )}
                </div>
              </div>

              {/* Contact Information Card */}
              <div className="bg-gray-50 rounded-xl p-6">
                <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                  <FaPhone className="text-green-500" />
                  Contact Information
                </h3>
                <div className="space-y-3">
                  <div>
                    <p className="text-sm text-gray-600">Email</p>
                    <p className="font-medium">{candidate.email}</p>
                  </div>
                  {candidate.phone !== 'No phone' && (
                    <div>
                      <p className="text-sm text-gray-600">Phone</p>
                      <p className="font-medium">{candidate.phone}</p>
                    </div>
                  )}
                  {fullCandidateData?.whatsapp && (
                    <div>
                      <p className="text-sm text-gray-600">WhatsApp</p>
                      <p className="font-medium">{fullCandidateData.whatsapp}</p>
                    </div>
                  )}
                </div>
              </div>

              {/* Location Card */}
              <div className="bg-gray-50 rounded-xl p-6">
                <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                  <FaMapMarkerAlt className="text-red-500" />
                  Location
                </h3>
                <div className="space-y-3">
                  {fullCandidateData?.countryOfResidence && (
                    <div>
                      <p className="text-sm text-gray-600">Country of Residence</p>
                      <p className="font-medium">{fullCandidateData.countryOfResidence}</p>
                    </div>
                  )}
                  <div>
                    <p className="text-sm text-gray-600">Current City</p>
                    <p className="font-medium">{candidate.location}</p>
                  </div>
                  {fullCandidateData?.willingRelocateCity && (
                    <div>
                      <p className="text-sm text-green-600">Willing to Relocate</p>
                      <p className="font-medium text-green-800">{fullCandidateData.willingRelocateCity}</p>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Main Content - Education, Experience, etc. */}
            <div className="lg:col-span-3 space-y-6">
              {/* Education Card */}
              <div className="bg-white border border-gray-200 rounded-xl p-6">
                <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                  <FaGraduationCap className="text-purple-500" />
                  Education & Qualifications
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <p className="text-sm text-gray-600">Highest Degree</p>
                    <p className="text-lg font-medium text-gray-800 mb-4">
                      {fullCandidateData?.degree === "Other" 
                        ? fullCandidateData.degreeOther 
                        : candidate.education}
                    </p>
                    
                    <p className="text-sm text-gray-600">University</p>
                    <p className="font-medium">{candidate.universityName}</p>
                    {fullCandidateData?.universityLocation && (
                      <p className="text-sm text-gray-500">{fullCandidateData.universityLocation}</p>
                    )}
                  </div>
                  
                  {/* Certifications */}
                  <div>
                    <h4 className="text-sm font-semibold text-gray-700 mb-3">Certifications</h4>
                    <div className="space-y-2">
                      {fullCandidateData?.englishCert && fullCandidateData.englishCert !== "No" && (
                        <div className="flex items-center gap-2">
                          <FaCertificate className="text-green-500" />
                          <span className="text-sm">
                            English: {fullCandidateData.englishCert === "Other" 
                              ? fullCandidateData.englishCertOther 
                              : fullCandidateData.englishCert}
                          </span>
                        </div>
                      )}
                      
                      {fullCandidateData?.teachingLicense && fullCandidateData.teachingLicense !== "No" && (
                        <div className="flex items-center gap-2">
                          <FaCertificate className="text-blue-500" />
                          <span className="text-sm">
                            Teaching License: {fullCandidateData.teachingLicense === "Other" 
                              ? fullCandidateData.teachingLicenseOther 
                              : fullCandidateData.teachingLicense}
                          </span>
                        </div>
                      )}
                      
                      {fullCandidateData?.teachingDiploma && fullCandidateData.teachingDiploma !== "No" && (
                        <div className="flex items-center gap-2">
                          <FaCertificate className="text-orange-500" />
                          <span className="text-sm">
                            Teaching Diploma: {fullCandidateData.teachingDiploma === "Other" 
                              ? fullCandidateData.teachingDiplomaOther 
                              : fullCandidateData.teachingDiploma}
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              {/* Experience & Positions Card */}
              <div className="bg-white border border-gray-200 rounded-xl p-6">
                <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                  <FaBriefcase className="text-orange-500" />
                  Experience & Positions
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <p className="text-sm text-gray-600">Total Experience</p>
                    <p className="text-2xl font-bold text-blue-600 mb-4">{candidate.experience}</p>
                    
                    {fullCandidateData?.currentInstitution && (
                      <div className="mb-3">
                        <p className="text-sm text-gray-600">Current Institution</p>
                        <p className="font-medium">{fullCandidateData.currentInstitution}</p>
                      </div>
                    )}
                    
                    {fullCandidateData?.previousInstitution && (
                      <div>
                        <p className="text-sm text-gray-600">Previous Institution</p>
                        <p className="font-medium">{fullCandidateData.previousInstitution}</p>
                      </div>
                    )}
                  </div>
                  
                  <div>
                    <p className="text-sm text-gray-600 mb-2">Positions Interested In</p>
                    <div className="flex flex-wrap gap-2">
                      {candidate.positionsInterested.map((position, index) => (
                        <span
                          key={index}
                          className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-medium"
                        >
                          {position}
                        </span>
                      ))}
                    </div>
                    
                    {candidate.curriculumTaught.length > 0 && (
                      <div className="mt-4">
                        <p className="text-sm text-gray-600 mb-2">Curriculum Experience</p>
                        <div className="flex flex-wrap gap-2">
                          {candidate.curriculumTaught.map((curriculum, index) => (
                            <span
                              key={index}
                              className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm font-medium"
                            >
                              {curriculum}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Skills & Languages Card */}
              <div className="bg-white border border-gray-200 rounded-xl p-6">
                <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                  <FaStar className="text-yellow-500" />
                  Skills & Languages
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Skills */}
                  <div>
                    <p className="text-sm text-gray-600 mb-2">Professional Skills</p>
                    <div className="flex flex-wrap gap-2">
                      {candidate.skills.map((skill, index) => (
                        <span
                          key={index}
                          className="px-3 py-1 bg-purple-100 text-purple-800 rounded-lg text-sm font-medium"
                        >
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>
                  
                  {/* Languages */}
                  <div>
                    <p className="text-sm text-gray-600 mb-2">Languages</p>
                    <div className="flex flex-wrap gap-2">
                      {candidate.languages && candidate.languages.length > 0 ? (
                        candidate.languages.map((language, index) => (
                          <span
                            key={index}
                            className="px-3 py-1 bg-blue-100 text-blue-800 rounded-lg text-sm font-medium"
                          >
                            {language === "Other" ? candidate.languagesOther : language}
                          </span>
                        ))
                      ) : (
                        <span className="text-gray-500">No languages specified</span>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              {/* Additional Information Card */}
              {(fullCandidateData?.expectedSalary || fullCandidateData?.otherNotes || fullCandidateData?.availableFrom) && (
                <div className="bg-white border border-gray-200 rounded-xl p-6">
                  <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                    <FaCalendar className="text-green-500" />
                    Additional Information
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {fullCandidateData?.expectedSalary && (
                      <div className="p-4 bg-green-50 rounded-xl">
                        <p className="text-sm text-gray-600">Expected Salary</p>
                        <p className="text-xl font-bold text-green-700">{fullCandidateData.expectedSalary} SAR</p>
                        <p className="text-xs text-green-600">Monthly</p>
                      </div>
                    )}
                    
                    {fullCandidateData?.availableFrom && (
                      <div className="p-4 bg-blue-50 rounded-xl">
                        <p className="text-sm text-gray-600">Available From</p>
                        <p className="text-lg font-medium text-blue-700">{formatDate(fullCandidateData.availableFrom)}</p>
                      </div>
                    )}
                    
                    {fullCandidateData?.iqama && fullCandidateData.iqama !== "Not specified" && (
                      <div className="p-4 bg-purple-50 rounded-xl">
                        <p className="text-sm text-gray-600">Residency Status</p>
                        <p className="text-lg font-medium text-purple-700">
                          {fullCandidateData.iqama === "Other" ? fullCandidateData.iqamaOther : fullCandidateData.iqama}
                        </p>
                      </div>
                    )}
                  </div>
                  
                  {fullCandidateData?.otherNotes && (
                    <div className="mt-4 p-4 bg-gray-50 rounded-xl">
                      <p className="text-sm text-gray-600">Additional Notes</p>
                      <p className="font-medium text-gray-800 whitespace-pre-line">{fullCandidateData.otherNotes}</p>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CandidatesDashboard;