// /src/pages/school-login.jsx - FIXED VERSION
import React, { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Mail, 
  Lock, 
  Eye, 
  EyeOff, 
  LogIn, 
  Building,
  AlertCircle,
  CheckCircle,
  Users,
  Star,
  Shield,
  Target,
  User,
  Settings
} from "lucide-react";
import { useNavigate, Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-hot-toast";
import { loginUserAction, clearErrors } from "../../actions/userActions";

export default function SchoolLogin() {
  
  const dispatch = useDispatch();
  const { loading, error, isAuthenticatedUser, user } = useSelector((state) => state.loginUser);
  
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState({});
  const [loginSuccess, setLoginSuccess] = useState(false);
  const [networkError, setNetworkError] = useState(false);
  const [wrongRoleError, setWrongRoleError] = useState("");
  const navigate = useNavigate();

  // Check if already logged in - FIXED: Only use Redux state
  useEffect(() => {
    if (isAuthenticatedUser && user) {
      console.log('✅ Already logged in, redirecting to profile');
      navigate('/school-profile');
    }
  }, [isAuthenticatedUser, user, navigate]);

  const validateForm = useCallback(() => {
    const newErrors = {};

    if (!email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      newErrors.email = "Email is invalid";
    }

    if (!password.trim()) {
      newErrors.password = "Password is required";
    } else if (password.length < 6) {
      newErrors.password = "Password must be at least 6 characters";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }, [email, password]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setNetworkError(false);
    setWrongRoleError("");
    
    if (!validateForm()) {
      return;
    }

    try {
      console.log('🔐 Attempting login for:', email);
      // Dispatch login action
      await dispatch(loginUserAction(email, password));
    } catch (err) {
      console.error('❌ Login error:', err);
      setNetworkError(true);
      setErrors({ 
        general: "Network error. Please check your connection and try again." 
      });
    }
  };

  const clearError = useCallback((field) => {
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
    if (errors.general || networkError || wrongRoleError) {
      setErrors(prev => ({ ...prev, general: '' }));
      setNetworkError(false);
      setWrongRoleError("");
    }
  }, [errors, networkError, wrongRoleError]);

  // Handle API errors
  useEffect(() => {
    if (error) {
      console.log('❌ Login API error:', error);
      if (error.includes("Network Error") || error.includes("ECONNREFUSED")) {
        setNetworkError(true);
        setErrors({ 
          general: "Unable to connect to server. Please check your internet connection and try again." 
        });
      } else {
        // Show specific error message from API
        toast.error(error);
      }
      dispatch(clearErrors());
    }
  }, [dispatch, error]);

  // Handle successful authentication - FIXED: This is the main fix
  useEffect(() => {
    console.log('🔐 Auth status changed:', { 
      isAuthenticatedUser, 
      user, 
      loading 
    });

    // Only proceed if not loading and authenticated with user data
    if (!loading && isAuthenticatedUser && user) {
      console.log('✅ Login successful, checking role:', user.role);
      
      // Check user role and handle accordingly
      switch (user.role) {
        case 'school':
          console.log('🎯 School user detected, showing success and redirecting');
          setLoginSuccess(true);
          
          // Show success message
          
          // Redirect after success animation
          setTimeout(() => {
            console.log('🔄 Redirecting to school-profile');
            navigate('/school-profile');
          }, 1500);
          break;
          
        case 'candidate':
          console.log('👤 Candidate user detected, redirecting to teacher login');
          setWrongRoleError('candidate');
          toast.error('This account is for teachers. Please use the teacher login portal.');
          setTimeout(() => {
            navigate('/teacher-login');
          }, 2000);
          break;
          
        case 'system-admin':
          console.log('⚙️ Admin user detected, redirecting to admin login');
          setWrongRoleError('admin');
          toast.error('This account is for administrators. Please use the admin login portal.');
          setTimeout(() => {
            navigate('/system-admin-login');
          }, 2000);
          break;
          
        default:
          console.log('❓ Unknown role:', user.role);
          toast.error('Unknown user role. Please contact support.');
      }
    }
  }, [isAuthenticatedUser, user, loading, navigate]);

  // Render different error messages based on role
  const renderRoleError = () => {
    if (wrongRoleError === 'candidate') {
      return (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          exit={{ opacity: 0, height: 0 }}
          className="p-4 bg-orange-50 border border-orange-200 rounded-xl flex items-center gap-3"
        >
          <User className="w-5 h-5 text-orange-600 flex-shrink-0" />
          <div>
            <p className="text-orange-700 text-sm font-medium">Teacher Account Detected</p>
            <p className="text-orange-600 text-sm mt-1">
              Redirecting to teacher login portal...
            </p>
          </div>
        </motion.div>
      );
    }
    
    if (wrongRoleError === 'admin') {
      return (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          exit={{ opacity: 0, height: 0 }}
          className="p-4 bg-purple-50 border border-purple-200 rounded-xl flex items-center gap-3"
        >
          <Settings className="w-5 h-5 text-purple-600 flex-shrink-0" />
          <div>
            <p className="text-purple-700 text-sm font-medium">Admin Account Detected</p>
            <p className="text-purple-600 text-sm mt-1">
              Redirecting to admin login portal...
            </p>
          </div>
        </motion.div>
      );
    }
    
    return null;
  };

  return (
    <div className="min-h-screen mt-25 bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 font-[Parkinsans]">
      <div className="max-w-6xl w-full grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
        
        {/* Left Side - Branding & Features */}
        <motion.div
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6 }}
          className="hidden lg:block space-y-8"
        >
          {/* Brand Section */}
          <div className="space-y-6">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 bg-gradient-to-r from-[#0077BB] to-[#00AEEF] rounded-2xl flex items-center justify-center shadow-lg">
                <Building className="w-8 h-8 text-white" />
              </div>
              <div>
                <h1 className="text-4xl font-bold text-gray-900 bg-gradient-to-r from-[#0077BB] to-[#00AEEF] bg-clip-text text-transparent">
                  The Teaching
                </h1>
                <p className="text-lg text-gray-600">Path</p>
              </div>
            </div>
            
            <div className="space-y-4">
              <h2 className="text-3xl font-bold text-gray-900 leading-tight">
                Find Your Perfect <span className="text-[#0077BB]">Teaching</span> Team
              </h2>
              <p className="text-lg text-gray-600 leading-relaxed">
                Connect with verified educators and build your dream teaching staff with Saudi Arabia's leading educational staffing platform.
              </p>
            </div>
          </div>

          {/* Features Grid */}
          <div className="grid grid-cols-1 gap-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="flex items-start gap-4 p-6 bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-white/20"
            >
              <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-emerald-600 rounded-xl flex items-center justify-center flex-shrink-0">
                <CheckCircle className="w-6 h-6 text-white" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">For Schools Only</h3>
                <p className="text-gray-600">This portal is exclusively for educational institutions and schools.</p>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="flex items-start gap-4 p-6 bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-white/20"
            >
              <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-purple-600 rounded-xl flex items-center justify-center flex-shrink-0">
                <Target className="w-6 h-6 text-white" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Precise Matching</h3>
                <p className="text-gray-600">Smart algorithms match your school's needs with ideal candidates.</p>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="flex items-start gap-4 p-6 bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-white/20"
            >
              <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-blue-600 rounded-xl flex items-center justify-center flex-shrink-0">
                <Shield className="w-6 h-6 text-white" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Secure & Reliable</h3>
                <p className="text-gray-600">Your data is protected with enterprise-grade security measures.</p>
              </div>
            </motion.div>
          </div>

        </motion.div>

        {/* Right Side - Login Form */}
        <motion.div
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6 }}
          className="w-full max-w-md mx-auto lg:mx-0"
        >
          {/* Login Card */}
          <div className="bg-white rounded-3xl shadow-2xl border border-gray-100 overflow-hidden">
            {/* Card Header */}
            <div className="bg-gradient-to-r from-[#0077BB] to-[#00AEEF] p-8 text-center">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: "spring", stiffness: 200, damping: 15 }}
                className="w-20 h-20 bg-white/20 rounded-2xl flex items-center justify-center mx-auto mb-4 backdrop-blur-sm"
              >
                <Building className="w-10 h-10 text-white" />
              </motion.div>
              <h2 className="text-2xl font-bold text-white mb-2">School Login</h2>
              <p className="text-blue-100">For educational institutions only</p>
            </div>

            {/* Login Form */}
            <div className="p-8">
              <form onSubmit={handleSubmit} className="space-y-6" autoComplete="on">
                {/* Role-based Error Messages */}
                <AnimatePresence>
                  {renderRoleError()}
                </AnimatePresence>

                {/* Network Error */}
                <AnimatePresence>
                  {networkError && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      className="p-4 bg-red-50 border border-red-200 rounded-xl flex items-center gap-3"
                    >
                      <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0" />
                      <div>
                        <p className="text-red-700 text-sm font-medium">Connection Issue</p>
                        <p className="text-red-600 text-sm mt-1">
                          {errors.general || "Unable to connect to server. Please check your internet connection."}
                        </p>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* Email Field */}
                <div className="mb-6">
                  <label htmlFor="school-email" className="block text-sm font-medium text-gray-700 mb-2">
                    Email Address
                  </label>
                  <div className="relative">
                    <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
                      <Mail className="w-5 h-5" />
                    </div>
                    <input
                      id="school-email"
                      name="school-email"
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full border-2 border-gray-200 rounded-xl p-4 pl-11 transition-all duration-200 focus:border-[#0077BB] focus:ring-2 focus:ring-blue-100"
                      placeholder="school@example.com"
                      onFocus={() => clearError('email')}
                      autoComplete="email"
                    />
                  </div>
                  {errors.email && (
                    <p className="text-red-500 text-sm mt-2 flex items-center gap-2">
                      <AlertCircle className="w-4 h-4" />
                      {errors.email}
                    </p>
                  )}
                </div>

                {/* Password Field */}
                <div className="mb-6">
                  <label htmlFor="school-password" className="block text-sm font-medium text-gray-700 mb-2">
                    Password
                  </label>
                  <div className="relative">
                    <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
                      <Lock className="w-5 h-5" />
                    </div>
                    <input
                      id="school-password"
                      name="school-password"
                      type={showPassword ? "text" : "password"}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="w-full border-2 border-gray-200 rounded-xl p-4 pl-11 pr-12 transition-all duration-200 focus:border-[#0077BB] focus:ring-2 focus:ring-blue-100"
                      placeholder="Enter your password"
                      onFocus={() => clearError('password')}
                      autoComplete="current-password"
                    />
                    <button
                      type="button"
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors duration-200"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                    </button>
                  </div>
                  {errors.password && (
                    <p className="text-red-500 text-sm mt-2 flex items-center gap-2">
                      <AlertCircle className="w-4 h-4" />
                      {errors.password}
                    </p>
                  )}
                </div>

                {/* Forgot Password Link */}
                <div className="text-right">
                  <Link
                    to="/forgot-password"
                    className="text-sm text-[#0077BB] hover:text-[#00AEEF] font-medium transition-colors duration-200"
                  >
                    Forgot your password?
                  </Link>
                </div>

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={loading || wrongRoleError}
                  className="w-full flex justify-center items-center gap-3 py-4 px-4 border border-transparent rounded-xl font-semibold bg-gradient-to-r from-[#0077BB] to-[#00AEEF] text-white hover:shadow-lg transform hover:scale-105 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none shadow-md"
                >
                  {loading ? (
                    <>
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      Signing In...
                    </>
                  ) : (
                    <>
                      <LogIn className="w-5 h-5" />
                      Sign In to School Portal
                    </>
                  )}
                </button>

                {/* Register Link */}
                <div className="text-center pt-6 border-t border-gray-200">
                  <p className="text-sm text-gray-600">
                    New to Apex Staffing?{" "}
                    <Link
                      to="/school-register"
                      className="font-semibold text-[#0077BB] hover:text-[#00AEEF] transition-colors duration-200"
                    >
                      Register your school
                    </Link>
                  </p>
                </div>
              </form>
            </div>
          </div>

          {/* Mobile Features */}
          <div className="lg:hidden mt-8 bg-white rounded-2xl shadow-lg border border-gray-100 p-6">
            <h3 className="text-sm font-semibold text-gray-900 mb-4 text-center">
              School Portal - Exclusive Access
            </h3>
            <div className="grid grid-cols-1 gap-3">
              <div className="flex items-center gap-3 p-3 bg-blue-50 rounded-xl">
                <div className="w-8 h-8 bg-gradient-to-r from-[#0077BB] to-[#00AEEF] rounded-lg flex items-center justify-center">
                  <Building className="w-4 h-4 text-white" />
                </div>
                <span className="text-sm text-gray-700">For Educational Institutions</span>
              </div>
              <div className="flex items-center gap-3 p-3 bg-green-50 rounded-xl">
                <div className="w-8 h-8 bg-gradient-to-r from-green-500 to-emerald-600 rounded-lg flex items-center justify-center">
                  <User className="w-4 h-4 text-white" />
                </div>
                <span className="text-sm text-gray-700">Teachers use separate portal</span>
              </div>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Success Animation - Only for schools */}
      <AnimatePresence>
        {loginSuccess && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50"
          >
            <motion.div
              initial={{ scale: 0, rotate: -180 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ type: "spring", stiffness: 200, damping: 15 }}
              className="bg-white rounded-3xl p-8 text-center max-w-sm mx-4 shadow-2xl"
            >
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
                className="w-20 h-20 bg-gradient-to-r from-green-500 to-emerald-600 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg"
              >
                <CheckCircle className="w-10 h-10 text-white" />
              </motion.div>
              <h3 className="text-2xl font-bold text-gray-800 mb-3">Welcome Back, School!</h3>
              <p className="text-gray-600 mb-6">Accessing your school dashboard...</p>
              <div className="flex justify-center">
                <div className="w-12 h-12 border-4 border-[#0077BB] border-t-transparent rounded-full animate-spin"></div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}