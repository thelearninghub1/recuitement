import React, { useState, useEffect, useCallback } from "react";
import { useNavigate, Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Mail, 
  Lock, 
  LogIn, 
  UserPlus, 
  Eye, 
  EyeOff, 
  User,
  AlertCircle,
  CheckCircle,
  Shield,
  Target,
  Users,
  Star,
  BookOpen,
  Building,
  Settings
} from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-hot-toast";
import { loginUserAction, clearErrors } from "../../actions/userActions";

const TeacherLogin = () => {
  const dispatch = useDispatch();
  const { loading, error, isAuthenticatedUser, user } = useSelector((state) => state.loginUser);
  
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState({});
  const [loginSuccess, setLoginSuccess] = useState(false);
  const [networkError, setNetworkError] = useState(false);
  const [wrongRoleError, setWrongRoleError] = useState("");
  const [redirecting, setRedirecting] = useState(false);
  
  const navigate = useNavigate();

  // Check if already logged in - Only use Redux state
  

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
    setRedirecting(false);
    
    if (!validateForm()) {
      return;
    }

    try {
      console.log('🔐 Attempting teacher login for:', email);
      // Dispatch login action
      await dispatch(loginUserAction(email, password));
    } catch (err) {
      console.error('❌ Teacher login error:', err);
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

  const handleUserRedirect = useCallback((userData) => {
    if (redirecting) return;
    
    setRedirecting(true);
    console.log('🔄 Handling user redirect for role:', userData.role);
    
    // Check user role and handle accordingly
    switch (userData.role) {
      case 'candidate':
        console.log('👤 Teacher user detected, showing success and redirecting');
        setLoginSuccess(true);
        
        // Show success message
        
        // Redirect after success animation
        setTimeout(() => {
          console.log('🔄 Redirecting to teacher-profile');
          navigate('/teacher-profile');
        }, 1500);
        break;
        
      case 'school':
        console.log('🎯 School user detected, redirecting to school login');
        setWrongRoleError('school');
        toast.error('This account is for schools. Please use the school login portal.');
        setTimeout(() => {
          navigate('/school-login');
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
        console.log('❓ Unknown role:', userData.role);
        toast.error('Unknown user role. Please contact support.');
    }
  }, [navigate, redirecting]);

  // Handle API errors
  useEffect(() => {
    if (error) {
      console.log('❌ Teacher login API error:', error);
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

  // Handle successful authentication
  useEffect(() => {
    console.log('🔐 Auth status changed:', { 
      isAuthenticatedUser, 
      user, 
      loading,
      redirecting
    });

    // Only proceed if not loading and authenticated with user data
    if (!loading && isAuthenticatedUser && user && !redirecting) {
      setNetworkError(false);
      setErrors({});
      handleUserRedirect(user);
    }
  }, [isAuthenticatedUser, user, loading, navigate, handleUserRedirect, redirecting]);

  // Reset redirecting state on component unmount
  useEffect(() => {
    return () => {
      setRedirecting(false);
    };
  }, []);

  // Render different error messages based on role
  const renderRoleError = () => {
    if (wrongRoleError === 'school') {
      return (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          exit={{ opacity: 0, height: 0 }}
          className="p-4 bg-orange-50 border border-orange-200 rounded-xl flex items-center gap-3"
        >
          <Building className="w-5 h-5 text-orange-600 flex-shrink-0" />
          <div>
            <p className="text-orange-700 text-sm font-medium">School Account Detected</p>
            <p className="text-orange-600 text-sm mt-1">
              Redirecting to school login portal...
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
                <BookOpen className="w-8 h-8 text-white" />
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
                Find Your Perfect <span className="text-[#0077BB]">Teaching</span> Position
              </h2>
              <p className="text-lg text-gray-600 leading-relaxed">
                Connect with top schools in Saudi Arabia and discover opportunities that match your expertise and career goals.
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
                <h3 className="text-lg font-semibold text-gray-900 mb-2">For Teachers Only</h3>
                <p className="text-gray-600">This portal is exclusively for teaching professionals and candidates.</p>
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
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Smart Matching</h3>
                <p className="text-gray-600">AI-powered job matching based on your skills, preferences, and experience.</p>
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
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Secure & Private</h3>
                <p className="text-gray-600">Your personal information is protected with enterprise-grade security.</p>
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
                <User className="w-10 h-10 text-white" />
              </motion.div>
              <h2 className="text-2xl font-bold text-white mb-2">Teacher Login</h2>
              <p className="text-blue-100">For teaching professionals only</p>
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
                  <label htmlFor="teacher-email" className="block text-sm font-medium text-gray-700 mb-2">
                    Email Address
                  </label>
                  <div className="relative">
                    <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
                      <Mail className="w-5 h-5" />
                    </div>
                    <input
                      id="teacher-email"
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full border-2 border-gray-200 rounded-xl p-4 pl-11 transition-all duration-200 focus:border-[#0077BB] focus:ring-2 focus:ring-blue-100"
                      placeholder="you@example.com"
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
                  <label htmlFor="teacher-password" className="block text-sm font-medium text-gray-700 mb-2">
                    Password
                  </label>
                  <div className="relative">
                    <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
                      <Lock className="w-5 h-5" />
                    </div>
                    <input
                      id="teacher-password"
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
                      Sign In to Teacher Portal
                    </>
                  )}
                </button>

                {/* Register Link */}
                <div className="text-center pt-6 border-t border-gray-200">
                  <p className="text-sm text-gray-600">
                    New to Apex Staffing?{" "}
                    <Link
                      to="/teacher-register"
                      className="font-semibold text-[#0077BB] hover:text-[#00AEEF] transition-colors duration-200"
                    >
                      Create a teacher account
                    </Link>
                  </p>
                </div>
              </form>
            </div>
          </div>

          {/* Mobile Features */}
          <div className="lg:hidden mt-8 bg-white rounded-2xl shadow-lg border border-gray-100 p-6">
            <h3 className="text-sm font-semibold text-gray-900 mb-4 text-center">
              Teacher Portal - Exclusive Access
            </h3>
            <div className="grid grid-cols-1 gap-3">
              <div className="flex items-center gap-3 p-3 bg-blue-50 rounded-xl">
                <div className="w-8 h-8 bg-gradient-to-r from-[#0077BB] to-[#00AEEF] rounded-lg flex items-center justify-center">
                  <User className="w-4 h-4 text-white" />
                </div>
                <span className="text-sm text-gray-700">For Teaching Professionals</span>
              </div>
              <div className="flex items-center gap-3 p-3 bg-green-50 rounded-xl">
                <div className="w-8 h-8 bg-gradient-to-r from-green-500 to-emerald-600 rounded-lg flex items-center justify-center">
                  <Building className="w-4 h-4 text-white" />
                </div>
                <span className="text-sm text-gray-700">Schools use separate portal</span>
              </div>
            </div>
          </div>
        </motion.div>
      </div>

      

    </div>
  );
};

export default TeacherLogin;