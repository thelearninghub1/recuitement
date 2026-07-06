// /src/pages/register-system-admin.jsx
import React, { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  UserCog,
  Mail, 
  Lock, 
  Eye, 
  EyeOff, 
  User,
  Shield,
  CheckCircle,
  AlertCircle,
  Building,
  Users,
  Settings,
  Key,
  UserPlus,
  ArrowLeft,
  Fingerprint
} from "lucide-react";
import { useNavigate, Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import { registerSchoolAction, clearErrors } from "../../actions/userActions";

export default function AdminRegister() {
  const dispatch = useDispatch();
  const { loading, error, isAuthenticatedUser, user } = useSelector((state) => state.loginUser);
  
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    confirmPassword: "",
    firstName: "",
    lastName: "",
    adminLevel: "super-admin",
    permissions: ["full_access"]
  });
  
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [errors, setErrors] = useState({});
  const [registrationSuccess, setRegistrationSuccess] = useState(false);
  const [networkError, setNetworkError] = useState(false);
  const navigate = useNavigate();

  // Check if already logged in and is admin
  useEffect(() => {
    if (isAuthenticatedUser && user && user.role === 'system-admin') {
      console.log('✅ Already logged in as admin, redirecting to dashboard');
      navigate('/system-admin-dashboard');
    }
  }, [isAuthenticatedUser, user, navigate]);

  const validateForm = useCallback(() => {
    const newErrors = {};

    // Email validation
    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Email is invalid";
    }

    // First name validation
    if (!formData.firstName.trim()) {
      newErrors.firstName = "First name is required";
    } else if (formData.firstName.length < 2) {
      newErrors.firstName = "First name must be at least 2 characters";
    }

    // Last name validation
    if (!formData.lastName.trim()) {
      newErrors.lastName = "Last name is required";
    } else if (formData.lastName.length < 2) {
      newErrors.lastName = "Last name must be at least 2 characters";
    }

    // Password validation
    if (!formData.password.trim()) {
      newErrors.password = "Password is required";
    } else if (formData.password.length < 8) {
      newErrors.password = "Password must be at least 8 characters";
    } else if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(formData.password)) {
      newErrors.password = "Password must contain uppercase, lowercase, and numbers";
    }

    // Confirm password validation
    if (!formData.confirmPassword.trim()) {
      newErrors.confirmPassword = "Please confirm your password";
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }, [formData]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
    if (errors.general) {
      setErrors(prev => ({ ...prev, general: '' }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setNetworkError(false);
    
    if (!validateForm()) {
      return;
    }

    try {
      console.log('👑 Creating new system admin account...');
      
      // Prepare registration data based on the provided admin structure
      const registrationData = {
        email: formData.email,
        password: formData.password,
        firstName: formData.firstName,
        lastName: formData.lastName,
        role: "system-admin",
        adminLevel: formData.adminLevel,
        permissions: formData.permissions
      };

      console.log('Registration data:', registrationData);
      
      // Dispatch registration action
      await dispatch(registerSchoolAction(registrationData));
      
    } catch (err) {
      console.error('❌ Registration error:', err);
      setNetworkError(true);
      setErrors({ 
        general: "Network error. Please check your connection and try again." 
      });
    }
  };

  // Handle API errors
  useEffect(() => {
    if (error) {
      console.log('❌ Registration API error:', error);
      if (error.includes("Network Error") || error.includes("ECONNREFUSED")) {
        setNetworkError(true);
        setErrors({ 
          general: "Unable to connect to server. Please check your internet connection and try again." 
        });
      } else {
        // Show specific error message from API
        toast.error(error);
        
        // Handle specific error cases
        if (error.includes("already exists") || error.includes("duplicate")) {
          setErrors(prev => ({ 
            ...prev, 
            email: "This email is already registered" 
          }));
        }
      }
      dispatch(clearErrors());
    }
  }, [dispatch, error]);

  // Handle successful registration
  useEffect(() => {
    console.log('✅ Registration status:', { 
      isAuthenticatedUser, 
      user, 
      loading 
    });

    if (!loading && isAuthenticatedUser && user) {
      console.log('✅ Registration successful:', user.role);
      
      if (user.role === 'system-admin') {
        setRegistrationSuccess(true);
        
        // Show success message
        toast.success('System Admin account created successfully! Redirecting to admin login...');
        
        // Redirect to admin login after success animation
        setTimeout(() => {
          console.log('🔄 Redirecting to admin login');
          navigate('/system-admin-login');
        }, 2000);
      }
    }
  }, [isAuthenticatedUser, user, loading, navigate]);

  const passwordStrength = () => {
    const password = formData.password;
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

  const strength = passwordStrength();

  return (
    <div className="min-h-screen mt-25 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl w-full grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
        
        {/* Left Side - Branding & Info */}
        <motion.div
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6 }}
          className="hidden lg:block space-y-8"
        >
          {/* Brand Section */}
          <div className="space-y-6">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 bg-gradient-to-r from-emerald-500 to-teal-600 rounded-2xl flex items-center justify-center shadow-lg">
                <UserCog className="w-8 h-8 text-white" />
              </div>
              <div>
                <h1 className="text-4xl font-bold text-white bg-gradient-to-r from-emerald-400 to-teal-500 bg-clip-text text-transparent">
                  The Teaching Path
                </h1>
                <p className="text-lg text-teal-300">System Administration</p>
              </div>
            </div>
            
            <div className="space-y-4">
              <h2 className="text-3xl font-bold text-white leading-tight">
                Create <span className="text-emerald-400">Super Admin</span> Account
              </h2>
              <p className="text-lg text-gray-300 leading-relaxed">
                Create a new system administrator account with full platform access. 
                This account will have complete control over the recruitment ecosystem.
              </p>
            </div>
          </div>

          {/* Admin Privileges */}
          <div className="grid grid-cols-1 gap-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="flex items-start gap-4 p-6 bg-white/5 backdrop-blur-sm rounded-2xl shadow-lg border border-white/10"
            >
              <div className="w-12 h-12 bg-gradient-to-r from-emerald-500 to-teal-600 rounded-xl flex items-center justify-center flex-shrink-0">
                <Shield className="w-6 h-6 text-white" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-white mb-2">Full System Access</h3>
                <p className="text-gray-300">Complete control over all platform features, users, and settings.</p>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="flex items-start gap-4 p-6 bg-white/5 backdrop-blur-sm rounded-2xl shadow-lg border border-white/10"
            >
              <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-purple-600 rounded-xl flex items-center justify-center flex-shrink-0">
                <Settings className="w-6 h-6 text-white" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-white mb-2">Platform Configuration</h3>
                <p className="text-gray-300">Configure system settings, manage permissions, and control features.</p>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="flex items-start gap-4 p-6 bg-white/5 backdrop-blur-sm rounded-2xl shadow-lg border border-white/10"
            >
              <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-blue-600 rounded-xl flex items-center justify-center flex-shrink-0">
                <Users className="w-6 h-6 text-white" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-white mb-2">User Management</h3>
                <p className="text-gray-300">Manage all user accounts, permissions, and platform access.</p>
              </div>
            </motion.div>
          </div>

          {/* Security Notice */}
          <div className="bg-amber-900/20 border border-amber-500/20 rounded-2xl p-6">
            <h4 className="text-lg font-semibold text-amber-300 mb-3 flex items-center gap-2">
              <Fingerprint className="w-5 h-5" />
              Security Notice
            </h4>
            <div className="space-y-2 text-sm text-amber-200">
              <p>• System Admin accounts have complete control over the platform</p>
              <p>• Only authorized personnel should create admin accounts</p>
              <p>• Admin credentials should be kept secure and never shared</p>
              <p>• Regular password rotation is recommended</p>
            </div>
          </div>
        </motion.div>

        {/* Right Side - Registration Form */}
        <motion.div
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6 }}
          className="w-full max-w-md mx-auto lg:mx-0"
        >
          {/* Back Button */}
          <div className="mb-6">
            <Link
              to="/system-admin-login"
              className="inline-flex items-center gap-2 text-emerald-400 hover:text-emerald-300 transition-colors duration-200"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to Admin Login
            </Link>
          </div>

          {/* Registration Card */}
          <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-3xl shadow-2xl overflow-hidden">
            {/* Card Header */}
            <div className="bg-gradient-to-r from-emerald-600 to-teal-600 p-8 text-center">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: "spring", stiffness: 200, damping: 15 }}
                className="w-20 h-20 bg-white/20 rounded-2xl flex items-center justify-center mx-auto mb-4 backdrop-blur-sm"
              >
                <UserPlus className="w-10 h-10 text-white" />
              </motion.div>
              <h2 className="text-2xl font-bold text-white mb-2">Register System Admin</h2>
              <p className="text-emerald-100">Create a new administrator account</p>
            </div>

            {/* Registration Form */}
            <div className="p-8">
              <form onSubmit={handleSubmit} className="space-y-6" autoComplete="on">
                {/* Network Error */}
                <AnimatePresence>
                  {networkError && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      className="p-4 bg-red-500/10 border border-red-500/20 rounded-xl flex items-center gap-3 backdrop-blur-sm"
                    >
                      <AlertCircle className="w-5 h-5 text-red-400 flex-shrink-0" />
                      <div>
                        <p className="text-red-300 text-sm font-medium">Connection Issue</p>
                        <p className="text-red-400 text-sm mt-1">
                          {errors.general || "Unable to connect to server. Please check your internet connection."}
                        </p>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* Name Fields */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* First Name */}
                  <div>
                    <label htmlFor="firstName" className="block text-sm font-medium text-gray-300 mb-2">
                      First Name
                    </label>
                    <div className="relative">
                      <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">
                        <User className="w-5 h-5" />
                      </div>
                      <input
                        id="firstName"
                        name="firstName"
                        type="text"
                        value={formData.firstName}
                        onChange={handleChange}
                        className="w-full bg-white/5 border-2 border-gray-700 rounded-xl p-4 pl-11 text-white transition-all duration-200 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 placeholder-gray-500"
                        placeholder="First name"
                        autoComplete="given-name"
                      />
                    </div>
                    {errors.firstName && (
                      <p className="text-red-400 text-sm mt-2 flex items-center gap-2">
                        <AlertCircle className="w-4 h-4" />
                        {errors.firstName}
                      </p>
                    )}
                  </div>

                  {/* Last Name */}
                  <div>
                    <label htmlFor="lastName" className="block text-sm font-medium text-gray-300 mb-2">
                      Last Name
                    </label>
                    <div className="relative">
                      <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">
                        <User className="w-5 h-5" />
                      </div>
                      <input
                        id="lastName"
                        name="lastName"
                        type="text"
                        value={formData.lastName}
                        onChange={handleChange}
                        className="w-full bg-white/5 border-2 border-gray-700 rounded-xl p-4 pl-11 text-white transition-all duration-200 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 placeholder-gray-500"
                        placeholder="Last name"
                        autoComplete="family-name"
                      />
                    </div>
                    {errors.lastName && (
                      <p className="text-red-400 text-sm mt-2 flex items-center gap-2">
                        <AlertCircle className="w-4 h-4" />
                        {errors.lastName}
                      </p>
                    )}
                  </div>
                </div>

                {/* Email Field */}
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-300 mb-2">
                    Email Address
                  </label>
                  <div className="relative">
                    <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">
                      <Mail className="w-5 h-5" />
                    </div>
                    <input
                      id="email"
                      name="email"
                      type="email"
                      value={formData.email}
                      onChange={handleChange}
                      className="w-full bg-white/5 border-2 border-gray-700 rounded-xl p-4 pl-11 text-white transition-all duration-200 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 placeholder-gray-500"
                      placeholder="admin@apexstaffing.com"
                      autoComplete="email"
                    />
                  </div>
                  {errors.email && (
                    <p className="text-red-400 text-sm mt-2 flex items-center gap-2">
                      <AlertCircle className="w-4 h-4" />
                      {errors.email}
                    </p>
                  )}
                </div>

              

                {/* Password Field */}
                <div>
                  <label htmlFor="password" className="block text-sm font-medium text-gray-300 mb-2">
                    Password
                  </label>
                  <div className="relative">
                    <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">
                      <Lock className="w-5 h-5" />
                    </div>
                    <input
                      id="password"
                      name="password"
                      type={showPassword ? "text" : "password"}
                      value={formData.password}
                      onChange={handleChange}
                      className="w-full bg-white/5 border-2 border-gray-700 rounded-xl p-4 pl-11 pr-12 text-white transition-all duration-200 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 placeholder-gray-500"
                      placeholder="Create a strong password"
                      autoComplete="new-password"
                    />
                    <button
                      type="button"
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-300 transition-colors duration-200"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                    </button>
                  </div>
                  
                  {/* Password Strength Indicator */}
                  {formData.password && (
                    <div className="mt-2">
                      <div className="flex items-center justify-between text-xs mb-1">
                        <span className={`font-medium ${strength.color}`}>
                          Password strength: {strength.text}
                        </span>
                        <span className="text-gray-400">{strength.score}/5</span>
                      </div>
                      <div className="h-1 bg-gray-700 rounded-full overflow-hidden">
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
                  
                  {errors.password && (
                    <p className="text-red-400 text-sm mt-2 flex items-center gap-2">
                      <AlertCircle className="w-4 h-4" />
                      {errors.password}
                    </p>
                  )}
                  
                  {/* Password Requirements */}
                  <div className="mt-2 space-y-1 text-xs text-gray-400">
                    <p className="flex items-center gap-2">
                      <div className={`w-1.5 h-1.5 rounded-full ${formData.password.length >= 8 ? 'bg-emerald-500' : 'bg-gray-600'}`}></div>
                      <span>At least 8 characters</span>
                    </p>
                    <p className="flex items-center gap-2">
                      <div className={`w-1.5 h-1.5 rounded-full ${/[a-z]/.test(formData.password) ? 'bg-emerald-500' : 'bg-gray-600'}`}></div>
                      <span>Contains lowercase letter</span>
                    </p>
                    <p className="flex items-center gap-2">
                      <div className={`w-1.5 h-1.5 rounded-full ${/[A-Z]/.test(formData.password) ? 'bg-emerald-500' : 'bg-gray-600'}`}></div>
                      <span>Contains uppercase letter</span>
                    </p>
                    <p className="flex items-center gap-2">
                      <div className={`w-1.5 h-1.5 rounded-full ${/\d/.test(formData.password) ? 'bg-emerald-500' : 'bg-gray-600'}`}></div>
                      <span>Contains number</span>
                    </p>
                  </div>
                </div>

                {/* Confirm Password Field */}
                <div>
                  <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-300 mb-2">
                    Confirm Password
                  </label>
                  <div className="relative">
                    <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">
                      <Lock className="w-5 h-5" />
                    </div>
                    <input
                      id="confirmPassword"
                      name="confirmPassword"
                      type={showConfirmPassword ? "text" : "password"}
                      value={formData.confirmPassword}
                      onChange={handleChange}
                      className="w-full bg-white/5 border-2 border-gray-700 rounded-xl p-4 pl-11 pr-12 text-white transition-all duration-200 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 placeholder-gray-500"
                      placeholder="Confirm your password"
                      autoComplete="new-password"
                    />
                    <button
                      type="button"
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-300 transition-colors duration-200"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    >
                      {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                    </button>
                  </div>
                  
                  {/* Password Match Indicator */}
                  {formData.confirmPassword && formData.password && (
                    <div className="mt-2 flex items-center gap-2">
                      {formData.password === formData.confirmPassword ? (
                        <>
                          <CheckCircle className="w-4 h-4 text-emerald-500" />
                          <span className="text-xs text-emerald-400">Passwords match</span>
                        </>
                      ) : (
                        <>
                          <AlertCircle className="w-4 h-4 text-red-500" />
                          <span className="text-xs text-red-400">Passwords do not match</span>
                        </>
                      )}
                    </div>
                  )}
                  
                  {errors.confirmPassword && (
                    <p className="text-red-400 text-sm mt-2 flex items-center gap-2">
                      <AlertCircle className="w-4 h-4" />
                      {errors.confirmPassword}
                    </p>
                  )}
                </div>

                {/* Terms and Conditions */}
                <div className="flex items-start">
                  <input
                    id="terms"
                    name="terms"
                    type="checkbox"
                    required
                    className="h-4 w-4 text-emerald-500 focus:ring-emerald-500 border-gray-600 rounded bg-white/5 mt-1"
                  />
                  <label htmlFor="terms" className="ml-3 block text-sm text-gray-300">
                    I understand that creating a system admin account grants full access to the platform. 
                    I am authorized to create this account and will keep the credentials secure.
                  </label>
                </div>

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full flex justify-center items-center gap-3 py-4 px-4 border border-transparent rounded-xl font-semibold bg-gradient-to-r from-emerald-600 to-teal-600 text-white hover:shadow-lg transform hover:scale-105 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none shadow-md hover:from-emerald-700 hover:to-teal-700"
                >
                  {loading ? (
                    <>
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      Creating Admin Account...
                    </>
                  ) : (
                    <>
                      <UserCog className="w-5 h-5" />
                      Create System Admin Account
                    </>
                  )}
                </button>

                {/* Login Link */}
                <div className="text-center pt-4 border-t border-gray-700/50">
                  <p className="text-sm text-gray-500">
                    Already have an admin account?{" "}
                    <Link
                      to="/system-admin-login"
                      className="font-medium text-emerald-400 hover:text-emerald-300 transition-colors duration-200"
                    >
                      Sign in here
                    </Link>
                  </p>
                </div>
              </form>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Success Animation */}
      <AnimatePresence>
        {registrationSuccess && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50"
          >
            <motion.div
              initial={{ scale: 0, rotate: -180 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ type: "spring", stiffness: 200, damping: 15 }}
              className="bg-slate-800 border border-emerald-500/20 rounded-3xl p-8 text-center max-w-sm mx-4 shadow-2xl"
            >
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
                className="w-20 h-20 bg-gradient-to-r from-emerald-500 to-teal-600 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg"
              >
                <CheckCircle className="w-10 h-10 text-white" />
              </motion.div>
              <h3 className="text-2xl font-bold text-white mb-3">Admin Account Created!</h3>
              <p className="text-gray-300 mb-6">
                System Administrator account has been successfully created.
                Redirecting to login page...
              </p>
              <div className="flex justify-center">
                <div className="w-12 h-12 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin"></div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}