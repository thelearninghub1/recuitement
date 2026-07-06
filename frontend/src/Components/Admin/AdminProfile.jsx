// src/pages/AdminProfile.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import { 
  FaUser, FaEnvelope, FaPhone, FaMapMarkerAlt, FaCalendarAlt,
  FaShieldAlt, FaKey, FaHistory, FaEdit, FaSave,
  FaTrash, FaUpload, FaCheckCircle, FaTimesCircle,
  FaBuilding, FaBriefcase, FaGraduationCap, FaLanguage,
  FaFilePdf, FaCloudDownloadAlt, FaLock, FaUnlock,
  FaArrowLeft, FaSignOutAlt, FaCog, FaBell,
  FaSpinner
} from 'react-icons/fa';
import { logoutUser, clearErrors, updatePasswordAction, updateUserProfile } from "../../actions/userActions";
import { UPDATE_PASSWORD_RESET, UPDATE_USER_RESET } from '../../constants/userConstants';

const AdminProfile = () => {
  const dispatch = useDispatch();
  const { loading, error, user, isAuthenticatedUser } = useSelector((state) => state.loginUser);
  const { 
    loading: updatePasswordLoading, 
    error: updatePasswordError, 
    success: updatePasswordSuccess 
  } = useSelector((state) => state.updatePassword);

  // Profile update states from the same reducer
  const { 
    loading: updateLoading = updatePasswordLoading, 
    error: updateError = updatePasswordError, 
    success: updateSuccess = updatePasswordSuccess 
  } = useSelector((state) => state.updatePassword || {});
  
  const navigate = useNavigate();

  // Form states
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    location: '',
    bio: ''
  });
  const [formErrors, setFormErrors] = useState({});

  // State for different sections
  const [activeTab, setActiveTab] = useState('profile');
  const [securityModal, setSecurityModal] = useState(false);
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  const [passwordErrors, setPasswordErrors] = useState({});

  // Redirect if not authenticated or not system-admin
  useEffect(() => {
    console.log('🔐 Profile auth check:', { 
      isAuthenticatedUser, 
      user: user?.role,
      loading 
    });

    if (!loading) {
      if (!isAuthenticatedUser) {
        console.log('❌ Not authenticated, redirecting to login');
        toast.error('Please login to access your profile');
        navigate('/system-admin-login');
      } else if (user && user.role !== 'system-admin') {
        console.log('❌ Not a system admin, redirecting to appropriate portal');
        switch(user.role) {
          case 'school':
            navigate('/school-profile');
            break;
          case 'candidate':
            navigate('/teacher-profile');
            break;
          default:
            navigate('/');
        }
      } else if (user) {
        // Initialize form data with user data
        setFormData({
          firstName: user.profile?.firstName || '',
          lastName: user.profile?.lastName || '',
          email: user.email || '',
          phone: user.profile?.phone || '',
          location: user.profile?.location || '',
          bio: user.profile?.bio || 'System Administrator with full platform access.'
        });
      }
    }
  }, [isAuthenticatedUser, user, loading, navigate]);

  // Handle update profile success and errors
  useEffect(() => {
    console.log('📊 Update states:', { 
      updatePasswordSuccess, 
      updatePasswordError, 
      updateSuccess, 
      updateError,
      updatePasswordLoading,
      updateLoading
    });

    if (updatePasswordSuccess) {
      toast.success('Password updated successfully!');
      dispatch({ type: UPDATE_PASSWORD_RESET });
      setSecurityModal(false);
      setPasswordData({
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
      });
      setPasswordErrors({});
    }

    if (updateSuccess) {
      toast.success('Profile updated successfully!');
      dispatch({ type: UPDATE_USER_RESET });
      setIsEditing(false);
      // Refresh user data by dispatching a get user action or reloading
      // You might want to dispatch getUserAction() here if you have one
    }

    // Handle password update errors
    if (updatePasswordError) {
      console.log('❌ Update password error:', updatePasswordError);
      
      // Handle specific error messages
      if (updatePasswordError.includes('Current password is incorrect')) {
        setPasswordErrors(prev => ({
          ...prev,
          currentPassword: 'Current password is incorrect'
        }));
        toast.error('Current password is incorrect');
      } else if (updatePasswordError.includes('New password cannot be same as old password')) {
        setPasswordErrors(prev => ({
          ...prev,
          newPassword: 'New password must be different from current password'
        }));
        toast.error('New password must be different from current password');
      } else {
        toast.error(updatePasswordError);
      }
      
      dispatch(clearErrors());
    }

    // Handle profile update errors
    if (updateError && !updatePasswordError) {
      console.log('❌ Update profile error:', updateError);
      
      if (updateError.includes('Email already exists') || updateError.includes('duplicate')) {
        setFormErrors(prev => ({
          ...prev,
          email: 'This email is already registered'
        }));
        toast.error('Email already exists');
      } else {
        toast.error(updateError);
      }
      
      dispatch(clearErrors());
    }

    // Handle login errors
    if (error) {
      console.log('❌ Profile error:', error);
      toast.error(error);
      dispatch(clearErrors());
    }
  }, [dispatch, updatePasswordSuccess, updatePasswordError, updateSuccess, updateError, error]);

  // Handle form changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Clear error when user types
    if (formErrors[name]) {
      setFormErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  // Handle password change
  const handlePasswordChange = (e) => {
    const { name, value } = e.target;
    setPasswordData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Clear error when user types
    if (passwordErrors[name]) {
      setPasswordErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  // Validate profile form
  const validateProfileForm = () => {
    const errors = {};

    if (!formData.firstName.trim()) {
      errors.firstName = 'First name is required';
    } else if (formData.firstName.length < 2) {
      errors.firstName = 'First name must be at least 2 characters';
    }

    if (!formData.lastName.trim()) {
      errors.lastName = 'Last name is required';
    } else if (formData.lastName.length < 2) {
      errors.lastName = 'Last name must be at least 2 characters';
    }

    if (!formData.email.trim()) {
      errors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      errors.email = 'Email is invalid';
    }

    if (formData.phone && !/^[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,6}$/.test(formData.phone)) {
      errors.phone = 'Phone number is invalid';
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  // Save profile changes
  const handleSaveProfile = async () => {
    // Clear previous errors
    setFormErrors({});

    if (!validateProfileForm()) {
      return;
    }

    try {
      // Prepare profile update data
      const profileData = {
        firstName: formData.firstName,
        lastName: formData.lastName,
        email: formData.email,
        phone: formData.phone,
        location: formData.location,
        bio: formData.bio
      };

      console.log('📝 Dispatching profile update action...', profileData);
      
      // Dispatch update profile action
      await dispatch(updateUserProfile(profileData));
      
    } catch (err) {
      console.error('❌ Profile update error:', err);
      toast.error('Failed to update profile. Please try again.');
    }
  };

  // Validate password change form
  const validatePasswordForm = () => {
    const errors = {};

    if (!passwordData.currentPassword.trim()) {
      errors.currentPassword = 'Current password is required';
    }

    if (!passwordData.newPassword.trim()) {
      errors.newPassword = 'New password is required';
    } else if (passwordData.newPassword.length < 8) {
      errors.newPassword = 'Password must be at least 8 characters';
    } else if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(passwordData.newPassword)) {
      errors.newPassword = 'Password must contain uppercase, lowercase, and numbers';
    }

    if (!passwordData.confirmPassword.trim()) {
      errors.confirmPassword = 'Please confirm your password';
    } else if (passwordData.newPassword !== passwordData.confirmPassword) {
      errors.confirmPassword = 'Passwords do not match';
    }

    setPasswordErrors(errors);
    return Object.keys(errors).length === 0;
  };

  // Change password
  const handleChangePassword = async () => {
    // Clear previous errors
    setPasswordErrors({});

    if (!validatePasswordForm()) {
      return;
    }

    try {
      // Dispatch update password action
      const passwordDataToSend = {
        currentPassword: passwordData.currentPassword,
        newPassword: passwordData.newPassword
      };

      console.log('🔐 Dispatching update password action...');
      await dispatch(updatePasswordAction(passwordDataToSend));
      
    } catch (err) {
      console.error('❌ Password change error:', err);
      toast.error('Failed to change password. Please try again.');
    }
  };

  // Handle logout
  const handleLogout = () => {
    dispatch(logoutUser());
    localStorage.removeItem('adminToken');
    localStorage.removeItem('adminEmail');
    toast.success('Logged out successfully');
    navigate('/system-admin-login');
  };

  // Format date
  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  // Calculate account age
  const getAccountAge = () => {
    if (!user?.createdAt) return 'N/A';
    const created = new Date(user.createdAt);
    const now = new Date();
    const diffTime = Math.abs(now - created);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays < 30) return `${diffDays} days`;
    if (diffDays < 365) return `${Math.floor(diffDays / 30)} months`;
    return `${Math.floor(diffDays / 365)} years`;
  };

  // Password strength indicator
  const passwordStrength = (password) => {
    if (!password) return { score: 0, text: "No password", color: "text-gray-400" };
    
    let score = 0;
    if (password.length >= 8) score++;
    if (/[a-z]/.test(password)) score++;
    if (/[A-Z]/.test(password)) score++;
    if (/\d/.test(password)) score++;
    if (/[^A-Za-z0-9]/.test(password)) score++;
    
    const strength = {
      0: { text: "Very weak", color: "text-red-400" },
      1: { text: "Weak", color: "text-red-400" },
      2: { text: "Fair", color: "text-yellow-400" },
      3: { text: "Good", color: "text-green-400" },
      4: { text: "Strong", color: "text-emerald-400" },
      5: { text: "Very strong", color: "text-emerald-500" }
    };
    
    return { score, ...strength[score] || strength[0] };
  };

  const strength = passwordStrength(passwordData.newPassword);

  // Determine loading state
  const isLoading = loading || updatePasswordLoading || updateLoading;

  // Show loading while checking authentication
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 mt-25">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading profile...</p>
        </div>
      </div>
    );
  }

  // If not authenticated or not admin, don't render main content
  if (!isAuthenticatedUser || !user || user.role !== 'system-admin') {
    return null;
  }

  // Admin permissions data
  const adminPermissions = user.adminData?.permissions || ['full_access'];

  return (
    <div className="min-h-screen mt-30 bg-gray-50">
      {/* Admin Header/Navbar */}
      <nav className="bg-white shadow-md fixed top-0 left-0 right-0 z-50 mt-25">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Left side */}
            <div className="flex items-center">
              <button
                onClick={() => navigate('/system-admin-dashboard')}
                className="flex items-center text-gray-600 hover:text-emerald-600"
              >
                <FaArrowLeft className="mr-2" />
                Back to Dashboard
              </button>
            </div>

            {/* Right side */}
            <div className="flex items-center space-x-4">
              <button className="text-gray-600 hover:text-emerald-600 p-2">
                <FaBell className="text-lg" />
              </button>
              
              {/* User dropdown */}
              <div className="relative group">
                <button className="flex items-center space-x-3 text-gray-700 hover:text-emerald-600">
                  <div className="w-10 h-10 bg-gradient-to-r from-emerald-500 to-teal-600 rounded-full flex items-center justify-center">
                    <span className="text-white font-semibold">
                      {user?.profile?.firstName?.charAt(0) || 'A'}
                    </span>
                  </div>
                  <div className="text-left hidden md:block">
                    <p className="font-medium">
                      {user?.profile?.firstName} {user?.profile?.lastName}
                    </p>
                    <p className="text-xs text-gray-500">Profile</p>
                  </div>
                </button>
                
                {/* Dropdown menu */}
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg py-2 hidden group-hover:block">
                  <button
                    onClick={() => navigate('/admin/dashboard')}
                    className="w-full text-left px-4 py-2 text-gray-700 hover:bg-gray-100 hover:text-emerald-600"
                  >
                    Dashboard
                  </button>
                  <button
                    onClick={() => setSecurityModal(true)}
                    className="w-full text-left px-4 py-2 text-gray-700 hover:bg-gray-100 hover:text-emerald-600"
                  >
                    Change Password
                  </button>
                  <button
                    onClick={handleLogout}
                    className="w-full text-left px-4 py-2 text-red-600 hover:bg-red-50 hover:text-red-700"
                  >
                    <FaSignOutAlt className="inline mr-2" />
                    Logout
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <div className="pt-16 p-6 max-w-7xl mx-auto">
        {/* Profile Header */}
        <div className="bg-gradient-to-r from-emerald-500 to-teal-600 rounded-2xl p-8 text-white shadow-lg mb-8">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between">
            <div className="flex items-center space-x-6">
              <div className="relative">
                <div className="w-24 h-24 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-sm border-4 border-white/30">
                  {user.profile?.avatar ? (
                    <img 
                      src={user.profile.avatar} 
                      alt={user.profile.firstName}
                      className="w-full h-full rounded-full object-cover"
                    />
                  ) : (
                    <FaUser className="text-4xl text-white" />
                  )}
                </div>
                {user.status === 'active' && (
                  <div className="absolute bottom-2 right-2 w-4 h-4 bg-green-400 rounded-full border-2 border-white"></div>
                )}
              </div>
              
              <div>
                <h1 className="text-3xl font-bold">
                  {user.profile?.firstName} {user.profile?.lastName}
                </h1>
                <p className="text-emerald-100">
                  System Administrator • {user.adminData?.adminLevel === 'super-admin' ? 'Super Admin' : 'Admin'}
                </p>
                <div className="flex flex-wrap gap-2 mt-3">
                  <span className="bg-white/20 backdrop-blur-sm px-3 py-1 rounded-full text-sm">
                    {user.email}
                  </span>
                  <span className="bg-white/20 backdrop-blur-sm px-3 py-1 rounded-full text-sm">
                    Member for {getAccountAge()}
                  </span>
                  <span className={`px-3 py-1 rounded-full text-sm ${
                    user.status === 'active' 
                      ? 'bg-green-500/20 text-green-100' 
                      : 'bg-red-500/20 text-red-100'
                  }`}>
                    {user.status || 'active'}
                  </span>
                </div>
              </div>
            </div>

            <div className="mt-6 md:mt-0">
              <button
                onClick={() => setIsEditing(!isEditing)}
                disabled={updateLoading}
                className="bg-white text-emerald-600 px-6 py-3 rounded-lg font-semibold hover:bg-emerald-50 transition-colors flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {updateLoading ? (
                  <>
                    <FaSpinner className="animate-spin" />
                    Saving...
                  </>
                ) : (
                  <>
                    <FaEdit />
                    {isEditing ? 'Cancel Editing' : 'Edit Profile'}
                  </>
                )}
              </button>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Left Sidebar - Navigation */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-md p-6 sticky top-24">
              <nav className="space-y-2">
                <button
                  onClick={() => setActiveTab('profile')}
                  className={`w-full text-left px-4 py-3 rounded-lg transition-colors ${
                    activeTab === 'profile' 
                      ? 'bg-emerald-50 text-emerald-700 border-l-4 border-emerald-500' 
                      : 'text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  <FaUser className="inline mr-3" />
                  Personal Information
                </button>
                <button
                  onClick={() => setActiveTab('permissions')}
                  className={`w-full text-left px-4 py-3 rounded-lg transition-colors ${
                    activeTab === 'permissions' 
                      ? 'bg-emerald-50 text-emerald-700 border-l-4 border-emerald-500' 
                      : 'text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  <FaShieldAlt className="inline mr-3" />
                  Permissions & Access
                </button>
                <button
                  onClick={() => setActiveTab('activity')}
                  className={`w-full text-left px-4 py-3 rounded-lg transition-colors ${
                    activeTab === 'activity' 
                      ? 'bg-emerald-50 text-emerald-700 border-l-4 border-emerald-500' 
                      : 'text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  <FaHistory className="inline mr-3" />
                  Activity Log
                </button>
                <button
                  onClick={() => setSecurityModal(true)}
                  className="w-full text-left px-4 py-3 rounded-lg transition-colors text-gray-700 hover:bg-gray-100"
                >
                  <FaKey className="inline mr-3" />
                  Change Password
                </button>
                <div className="border-t pt-4 mt-2">
                  <button
                    onClick={handleLogout}
                    className="w-full text-left px-4 py-3 rounded-lg transition-colors text-red-600 hover:bg-red-50 flex items-center"
                  >
                    <FaSignOutAlt className="mr-3" />
                    Logout
                  </button>
                </div>
              </nav>

              {/* Account Stats */}
              <div className="mt-8 pt-6 border-t">
                <h3 className="font-semibold text-gray-700 mb-3">Account Stats</h3>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Login Count</span>
                    <span className="font-semibold">{user.loginCount || 0}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Account Created</span>
                    <span className="font-semibold">{formatDate(user.createdAt)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Last Updated</span>
                    <span className="font-semibold">{formatDate(user.updatedAt)}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Main Content Area */}
          <div className="lg:col-span-3">
            {/* Profile Information Tab */}
            {activeTab === 'profile' && (
              <div className="bg-white rounded-lg shadow-md p-6">
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-2xl font-bold text-gray-800">Personal Information</h2>
                  {isEditing ? (
                    <button
                      onClick={handleSaveProfile}
                      disabled={updateLoading}
                      className="bg-emerald-500 text-white px-6 py-2 rounded-lg font-semibold hover:bg-emerald-600 transition-colors flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {updateLoading ? (
                        <>
                          <FaSpinner className="animate-spin" />
                          Saving...
                        </>
                      ) : (
                        <>
                          <FaSave />
                          Save Changes
                        </>
                      )}
                    </button>
                  ) : (
                    <button
                      onClick={() => setIsEditing(true)}
                      className="bg-gray-100 text-gray-700 px-6 py-2 rounded-lg font-semibold hover:bg-gray-200 transition-colors flex items-center gap-2"
                    >
                      <FaEdit />
                      Edit Profile
                    </button>
                  )}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* First Name */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      <FaUser className="inline mr-2" />
                      First Name
                    </label>
                    {isEditing ? (
                      <>
                        <input
                          type="text"
                          name="firstName"
                          value={formData.firstName}
                          onChange={handleInputChange}
                          disabled={updateLoading}
                          className={`w-full border ${
                            formErrors.firstName ? 'border-red-500' : 'border-gray-300'
                          } rounded-lg px-4 py-3 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 disabled:opacity-50`}
                        />
                        {formErrors.firstName && (
                          <p className="text-red-500 text-sm mt-2 flex items-center gap-2">
                            <FaTimesCircle className="w-3 h-3" />
                            {formErrors.firstName}
                          </p>
                        )}
                      </>
                    ) : (
                      <p className="text-lg font-semibold">{user.profile?.firstName}</p>
                    )}
                  </div>

                  {/* Last Name */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      <FaUser className="inline mr-2" />
                      Last Name
                    </label>
                    {isEditing ? (
                      <>
                        <input
                          type="text"
                          name="lastName"
                          value={formData.lastName}
                          onChange={handleInputChange}
                          disabled={updateLoading}
                          className={`w-full border ${
                            formErrors.lastName ? 'border-red-500' : 'border-gray-300'
                          } rounded-lg px-4 py-3 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 disabled:opacity-50`}
                        />
                        {formErrors.lastName && (
                          <p className="text-red-500 text-sm mt-2 flex items-center gap-2">
                            <FaTimesCircle className="w-3 h-3" />
                            {formErrors.lastName}
                          </p>
                        )}
                      </>
                    ) : (
                      <p className="text-lg font-semibold">{user.profile?.lastName}</p>
                    )}
                  </div>

                  {/* Email */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      <FaEnvelope className="inline mr-2" />
                      Email Address
                    </label>
                    {isEditing ? (
                      <>
                        <input
                          type="email"
                          name="email"
                          value={formData.email}
                          onChange={handleInputChange}
                          disabled={updateLoading}
                          className={`w-full border ${
                            formErrors.email ? 'border-red-500' : 'border-gray-300'
                          } rounded-lg px-4 py-3 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 disabled:opacity-50`}
                        />
                        {formErrors.email && (
                          <p className="text-red-500 text-sm mt-2 flex items-center gap-2">
                            <FaTimesCircle className="w-3 h-3" />
                            {formErrors.email}
                          </p>
                        )}
                      </>
                    ) : (
                      <div className="flex items-center">
                        <p className="text-lg font-semibold">{user.email}</p>
                        {user.profile?.isVerified && (
                          <FaCheckCircle className="text-green-500 ml-2" title="Verified" />
                        )}
                      </div>
                    )}
                  </div>

                  {/* Phone */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      <FaPhone className="inline mr-2" />
                      Phone Number
                    </label>
                    {isEditing ? (
                      <>
                        <input
                          type="tel"
                          name="phone"
                          value={formData.phone}
                          onChange={handleInputChange}
                          disabled={updateLoading}
                          className={`w-full border ${
                            formErrors.phone ? 'border-red-500' : 'border-gray-300'
                          } rounded-lg px-4 py-3 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 disabled:opacity-50`}
                          placeholder="+966 123 456 7890"
                        />
                        {formErrors.phone && (
                          <p className="text-red-500 text-sm mt-2 flex items-center gap-2">
                            <FaTimesCircle className="w-3 h-3" />
                            {formErrors.phone}
                          </p>
                        )}
                      </>
                    ) : (
                      <p className="text-lg font-semibold">{user.profile?.phone || 'Not provided'}</p>
                    )}
                  </div>

                  {/* Location */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      <FaMapMarkerAlt className="inline mr-2" />
                      Location
                    </label>
                    {isEditing ? (
                      <input
                        type="text"
                        name="location"
                        value={formData.location}
                        onChange={handleInputChange}
                        disabled={updateLoading}
                        className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 disabled:opacity-50"
                        placeholder="City, Country"
                      />
                    ) : (
                      <p className="text-lg font-semibold">{user.profile?.location || 'Not provided'}</p>
                    )}
                  </div>

                  {/* Account Created */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      <FaCalendarAlt className="inline mr-2" />
                      Member Since
                    </label>
                    <p className="text-lg font-semibold">{formatDate(user.createdAt)}</p>
                  </div>
                </div>

                {/* Bio/Description */}
                <div className="mt-6">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Bio / Description
                  </label>
                  {isEditing ? (
                    <textarea
                      name="bio"
                      value={formData.bio}
                      onChange={handleInputChange}
                      disabled={updateLoading}
                      rows="4"
                      className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 disabled:opacity-50"
                      placeholder="Tell us about yourself and your role..."
                    />
                  ) : (
                    <p className="text-gray-700 whitespace-pre-line">{formData.bio}</p>
                  )}
                </div>

                {/* Verification Status */}
                <div className="mt-8 pt-6 border-t">
                  <h3 className="font-semibold text-gray-700 mb-3">Verification Status</h3>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <FaCheckCircle className={`mr-2 ${user.profile?.isVerified ? 'text-green-500' : 'text-gray-400'}`} />
                        <span>Email Verification</span>
                      </div>
                      <span className={`font-semibold ${user.profile?.isVerified ? 'text-green-600' : 'text-gray-500'}`}>
                        {user.profile?.isVerified ? 'Verified' : 'Pending'}
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <FaCheckCircle className={`mr-2 ${user.profile?.profileCompleted ? 'text-green-500' : 'text-gray-400'}`} />
                        <span>Profile Completion</span>
                      </div>
                      <span className={`font-semibold ${user.profile?.profileCompleted ? 'text-green-600' : 'text-yellow-600'}`}>
                        {user.profile?.profileCompleted ? 'Complete' : 'Incomplete'}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Permissions & Access Tab */}
            {activeTab === 'permissions' && (
              <div className="bg-white rounded-lg shadow-md p-6">
                <h2 className="text-2xl font-bold text-gray-800 mb-6">Permissions & Access</h2>
                
                {/* Admin Level */}
                <div className="mb-8">
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <h3 className="text-lg font-semibold text-gray-800">Admin Level</h3>
                      <p className="text-gray-600">Your current administrative access level</p>
                    </div>
                    <span className={`px-4 py-2 rounded-full font-semibold ${
                      user.adminData?.adminLevel === 'super-admin' 
                        ? 'bg-purple-100 text-purple-800'
                        : 'bg-blue-100 text-blue-800'
                    }`}>
                      {user.adminData?.adminLevel === 'super-admin' ? 'Super Admin' : 'Admin'}
                    </span>
                  </div>
                </div>

                {/* Permissions */}
                <div className="mb-8">
                  <h3 className="text-lg font-semibold text-gray-800 mb-4">System Permissions</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {adminPermissions.map((permission, index) => (
                      <div key={index} className="bg-gray-50 p-4 rounded-lg border">
                        <div className="flex items-center">
                          <FaShieldAlt className="text-emerald-500 mr-3" />
                          <div>
                            <h4 className="font-semibold capitalize">
                              {permission.replace('_', ' ')}
                            </h4>
                            <p className="text-sm text-gray-600">
                              Full access to this system feature
                            </p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Access Log */}
                <div>
                  <h3 className="text-lg font-semibold text-gray-800 mb-4">Recent Access</h3>
                  <div className="bg-gray-50 rounded-lg p-4">
                    {user.adminData?.loginHistory?.length > 0 ? (
                      <div className="space-y-3">
                        {user.adminData.loginHistory.slice(0, 5).map((login, index) => (
                          <div key={index} className="flex items-center justify-between py-2 border-b last:border-0">
                            <div className="flex items-center">
                              <FaHistory className="text-gray-400 mr-3" />
                              <div>
                                <p className="font-medium">System Login</p>
                                <p className="text-sm text-gray-600">
                                  {new Date(login).toLocaleString()}
                                </p>
                              </div>
                            </div>
                            <span className="text-sm text-green-600">Successful</span>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="text-gray-500 text-center py-4">No login history available</p>
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* Activity Log Tab */}
            {activeTab === 'activity' && (
              <div className="bg-white rounded-lg shadow-md p-6">
                <h2 className="text-2xl font-bold text-gray-800 mb-6">Activity Log</h2>
                <div className="space-y-4">
                  {[1, 2, 3, 4, 5].map((item) => (
                    <div key={item} className="border-b pb-4 last:border-0">
                      <div className="flex items-start">
                        <div className="w-2 h-2 bg-emerald-500 rounded-full mt-2 mr-3"></div>
                        <div className="flex-1">
                          <p className="font-medium">System action performed</p>
                          <p className="text-gray-600 text-sm">
                            Updated school settings • {formatDate(new Date(Date.now() - item * 86400000).toISOString())}
                          </p>
                        </div>
                        <span className="text-sm text-gray-500">
                          {item === 1 ? 'Today' : `${item} days ago`}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Change Password Modal */}
      {securityModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-bold text-gray-800">Change Password</h3>
              <button
                onClick={() => {
                  setSecurityModal(false);
                  setPasswordData({
                    currentPassword: '',
                    newPassword: '',
                    confirmPassword: ''
                  });
                  setPasswordErrors({});
                }}
                className="text-gray-400 hover:text-gray-600"
              >
                <FaTimesCircle className="text-xl" />
              </button>
            </div>
            
            <div className="space-y-4">
              {/* Current Password */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Current Password
                </label>
                <div className="relative">
                  <input
                    type="password"
                    name="currentPassword"
                    value={passwordData.currentPassword}
                    onChange={handlePasswordChange}
                    className={`w-full border ${
                      passwordErrors.currentPassword ? 'border-red-500' : 'border-gray-300'
                    } rounded-lg px-4 py-3 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500`}
                    placeholder="Enter current password"
                    disabled={updatePasswordLoading}
                  />
                  {passwordErrors.currentPassword && (
                    <p className="text-red-500 text-sm mt-2 flex items-center gap-2">
                      <FaTimesCircle className="w-3 h-3" />
                      {passwordErrors.currentPassword}
                    </p>
                  )}
                </div>
              </div>
              
              {/* New Password */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  New Password
                </label>
                <div className="relative">
                  <input
                    type="password"
                    name="newPassword"
                    value={passwordData.newPassword}
                    onChange={handlePasswordChange}
                    className={`w-full border ${
                      passwordErrors.newPassword ? 'border-red-500' : 'border-gray-300'
                    } rounded-lg px-4 py-3 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500`}
                    placeholder="Enter new password"
                    disabled={updatePasswordLoading}
                  />
                  {passwordErrors.newPassword && (
                    <p className="text-red-500 text-sm mt-2 flex items-center gap-2">
                      <FaTimesCircle className="w-3 h-3" />
                      {passwordErrors.newPassword}
                    </p>
                  )}
                </div>
                
                {/* Password Strength Indicator */}
                {passwordData.newPassword && (
                  <div className="mt-2">
                    <div className="flex items-center justify-between text-xs mb-1">
                      <span className={`font-medium ${strength.color}`}>
                        Password strength: {strength.text}
                      </span>
                      <span className="text-gray-400">{strength.score}/5</span>
                    </div>
                    <div className="h-1 bg-gray-200 rounded-full overflow-hidden">
                      <div 
                        className={`h-full transition-all duration-300 ${
                          strength.score === 0 ? 'w-0' :
                          strength.score === 1 ? 'w-1/5 bg-red-500' :
                          strength.score === 2 ? 'w-2/5 bg-orange-500' :
                          strength.score === 3 ? 'w-3/5 bg-yellow-500' :
                          strength.score === 4 ? 'w-4/5 bg-green-500' :
                          'w-full bg-emerald-500'
                        }`}
                      />
                    </div>
                  </div>
                )}
              </div>
              
              {/* Confirm New Password */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Confirm New Password
                </label>
                <div className="relative">
                  <input
                    type="password"
                    name="confirmPassword"
                    value={passwordData.confirmPassword}
                    onChange={handlePasswordChange}
                    className={`w-full border ${
                      passwordErrors.confirmPassword ? 'border-red-500' : 'border-gray-300'
                    } rounded-lg px-4 py-3 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500`}
                    placeholder="Confirm new password"
                    disabled={updatePasswordLoading}
                  />
                  {passwordErrors.confirmPassword && (
                    <p className="text-red-500 text-sm mt-2 flex items-center gap-2">
                      <FaTimesCircle className="w-3 h-3" />
                      {passwordErrors.confirmPassword}
                    </p>
                  )}
                </div>
                
                {/* Password Match Indicator */}
                {passwordData.confirmPassword && passwordData.newPassword && (
                  <div className="mt-2">
                    {passwordData.newPassword === passwordData.confirmPassword ? (
                      <div className="flex items-center gap-2 text-green-600 text-sm">
                        <FaCheckCircle className="w-4 h-4" />
                        Passwords match
                      </div>
                    ) : (
                      <div className="flex items-center gap-2 text-red-600 text-sm">
                        <FaTimesCircle className="w-4 h-4" />
                        Passwords do not match
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>

            <div className="flex justify-end gap-3 mt-6">
              <button
                onClick={() => {
                  setSecurityModal(false);
                  setPasswordData({
                    currentPassword: '',
                    newPassword: '',
                    confirmPassword: ''
                  });
                  setPasswordErrors({});
                }}
                className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                disabled={updatePasswordLoading}
              >
                Cancel
              </button>
              <button
                onClick={handleChangePassword}
                disabled={updatePasswordLoading}
                className="px-6 py-2 bg-emerald-500 text-white rounded-lg hover:bg-emerald-600 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
              >
                {updatePasswordLoading ? (
                  <>
                    <FaSpinner className="animate-spin" />
                    Updating...
                  </>
                ) : (
                  <>
                    <FaKey />
                    Change Password
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminProfile;