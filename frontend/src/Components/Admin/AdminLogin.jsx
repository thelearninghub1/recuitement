// /src/pages/system-admin-login.jsx
import React, { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Mail, 
  Lock, 
  Eye, 
  EyeOff, 
  LogIn, 
  UserCog,
  AlertCircle,
  CheckCircle,
  Users,
  Shield,
  Settings,
  Key,
  Database,
  BarChart3,
  UserPlus,
  Briefcase
} from "lucide-react";
import { useNavigate, Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import { loginUserAction, clearErrors } from "../../actions/userActions";

export default function SystemAdminLogin() {
  
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

  // Check if already logged in
  useEffect(() => {
    if (isAuthenticatedUser && user) {
      console.log('✅ Already logged in as admin, redirecting to dashboard');
      navigate('/system-admin-dashboard');
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
      console.log('🔐 Attempting admin login for:', email);
      // Dispatch login action
      await dispatch(loginUserAction(email, password));
    } catch (err) {
      console.error('❌ Admin login error:', err);
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
      console.log('❌ Admin Login API error:', error);
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
    console.log('🔐 Admin auth status changed:', { 
      isAuthenticatedUser, 
      user, 
      loading 
    });

    // Only proceed if not loading and authenticated with user data
    if (!loading && isAuthenticatedUser && user) {
      console.log('✅ Login successful, checking role:', user.role);
      
      // Check user role and handle accordingly
      switch (user.role) {
        case 'system-admin':
          console.log('⚙️ System admin detected, showing success and redirecting');
          setLoginSuccess(true);
          
          // Store admin session info
          localStorage.setItem('adminToken', user.token || 'admin-authenticated');
          localStorage.setItem('adminEmail', user.email);
          
          // Show success message
          toast.success('Admin login successful! Redirecting to dashboard...');
          
          // Redirect after success animation
          setTimeout(() => {
            console.log('🔄 Redirecting to admin dashboard');
            navigate('/system-admin-dashboard');
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
          
        case 'candidate':
          console.log('👤 Candidate user detected, redirecting to teacher login');
          setWrongRoleError('candidate');
          toast.error('This account is for teachers. Please use the teacher login portal.');
          setTimeout(() => {
            navigate('/teacher-login');
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
    if (wrongRoleError === 'school') {
      return (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          exit={{ opacity: 0, height: 0 }}
          className="p-4 bg-orange-50 border border-orange-200 rounded-xl flex items-center gap-3"
        >
          <Briefcase className="w-5 h-5 text-orange-600 flex-shrink-0" />
          <div>
            <p className="text-orange-700 text-sm font-medium">School Account Detected</p>
            <p className="text-orange-600 text-sm mt-1">
              Redirecting to school login portal...
            </p>
          </div>
        </motion.div>
      );
    }
    
    if (wrongRoleError === 'candidate') {
      return (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          exit={{ opacity: 0, height: 0 }}
          className="p-4 bg-blue-50 border border-blue-200 rounded-xl flex items-center gap-3"
        >
          <Users className="w-5 h-5 text-blue-600 flex-shrink-0" />
          <div>
            <p className="text-blue-700 text-sm font-medium">Teacher Account Detected</p>
            <p className="text-blue-600 text-sm mt-1">
              Redirecting to teacher login portal...
            </p>
          </div>
        </motion.div>
      );
    }
    
    return null;
  };

  const handleRegisterClick = () => {
    navigate('/register-system-admin');
  };

  return (
    <div className="min-h-screen mt-25 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
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
                Manage Your <span className="text-emerald-400">Recruitment</span> Ecosystem
              </h2>
              <p className="text-lg text-gray-300 leading-relaxed">
                Oversee the entire platform with powerful tools for managing schools, teachers, job postings, and analytics in Saudi Arabia's leading educational staffing platform.
              </p>
            </div>
          </div>

          {/* Features Grid */}
          <div className="grid grid-cols-1 gap-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="flex items-start gap-4 p-6 bg-white/5 backdrop-blur-sm rounded-2xl shadow-lg border border-white/10"
            >
              <div className="w-12 h-12 bg-gradient-to-r from-emerald-500 to-teal-600 rounded-xl flex items-center justify-center flex-shrink-0">
                <Database className="w-6 h-6 text-white" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-white mb-2">Complete System Control</h3>
                <p className="text-gray-300">Manage all platform data, users, and configurations from a single dashboard.</p>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="flex items-start gap-4 p-6 bg-white/5 backdrop-blur-sm rounded-2xl shadow-lg border border-white/10"
            >
              <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-purple-600 rounded-xl flex items-center justify-center flex-shrink-0">
                <BarChart3 className="w-6 h-6 text-white" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-white mb-2">Advanced Analytics</h3>
                <p className="text-gray-300">Track platform performance, user engagement, and business metrics in real-time.</p>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="flex items-start gap-4 p-6 bg-white/5 backdrop-blur-sm rounded-2xl shadow-lg border border-white/10"
            >
              <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-blue-600 rounded-xl flex items-center justify-center flex-shrink-0">
                <Shield className="w-6 h-6 text-white" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-white mb-2">Enterprise Security</h3>
                <p className="text-gray-300">Full audit logs, security monitoring, and compliance management tools.</p>
              </div>
            </motion.div>
          </div>

          {/* Admin Privileges */}
          <div className="bg-emerald-900/20 border border-emerald-500/20 rounded-2xl p-6">
            <h4 className="text-lg font-semibold text-emerald-300 mb-3 flex items-center gap-2">
              <Key className="w-5 h-5" />
              Administrator Privileges
            </h4>
            <div className="space-y-2 text-sm text-emerald-200">
              <p className="flex items-center gap-2">
                <div className="w-1.5 h-1.5 bg-emerald-400 rounded-full"></div>
                <span>Full access to all user accounts and data</span>
              </p>
              <p className="flex items-center gap-2">
                <div className="w-1.5 h-1.5 bg-emerald-400 rounded-full"></div>
                <span>Platform configuration and settings management</span>
              </p>
              <p className="flex items-center gap-2">
                <div className="w-1.5 h-1.5 bg-emerald-400 rounded-full"></div>
                <span>Content moderation and dispute resolution</span>
              </p>
            </div>
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
          <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-3xl shadow-2xl overflow-hidden">
            {/* Card Header */}
            <div className="bg-gradient-to-r from-emerald-600 to-teal-600 p-8 text-center">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: "spring", stiffness: 200, damping: 15 }}
                className="w-20 h-20 bg-white/20 rounded-2xl flex items-center justify-center mx-auto mb-4 backdrop-blur-sm"
              >
                <UserCog className="w-10 h-10 text-white" />
              </motion.div>
              <h2 className="text-2xl font-bold text-white mb-2">System Admin Login</h2>
              <p className="text-emerald-100">Exclusive access for platform administrators</p>
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

                {/* Email Field */}
                <div className="mb-6">
                  <label htmlFor="admin-email" className="block text-sm font-medium text-gray-300 mb-2">
                    Email Address
                  </label>
                  <div className="relative">
                    <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">
                      <Mail className="w-5 h-5" />
                    </div>
                    <input
                      id="admin-email"
                      name="admin-email"
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full bg-white/5 border-2 border-gray-700 rounded-xl p-4 pl-11 text-white transition-all duration-200 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 placeholder-gray-500"
                      placeholder="admin@apexstaffing.com"
                      onFocus={() => clearError('email')}
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
                <div className="mb-6">
                  <label htmlFor="admin-password" className="block text-sm font-medium text-gray-300 mb-2">
                    Password
                  </label>
                  <div className="relative">
                    <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">
                      <Lock className="w-5 h-5" />
                    </div>
                    <input
                      id="admin-password"
                      name="admin-password"
                      type={showPassword ? "text" : "password"}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="w-full bg-white/5 border-2 border-gray-700 rounded-xl p-4 pl-11 pr-12 text-white transition-all duration-200 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 placeholder-gray-500"
                      placeholder="Enter your password"
                      onFocus={() => clearError('password')}
                      autoComplete="current-password"
                    />
                    <button
                      type="button"
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-300 transition-colors duration-200"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                    </button>
                  </div>
                  {errors.password && (
                    <p className="text-red-400 text-sm mt-2 flex items-center gap-2">
                      <AlertCircle className="w-4 h-4" />
                      {errors.password}
                    </p>
                  )}
                </div>


                {/* Login Button */}
                <button
                  type="submit"
                  disabled={loading || wrongRoleError}
                  className="w-full flex justify-center items-center gap-3 py-4 px-4 border border-transparent rounded-xl font-semibold bg-gradient-to-r from-emerald-600 to-teal-600 text-white hover:shadow-lg transform hover:scale-105 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none shadow-md hover:from-emerald-700 hover:to-teal-700"
                >
                  {loading ? (
                    <>
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      Signing In...
                    </>
                  ) : (
                    <>
                      <LogIn className="w-5 h-5" />
                      Access Admin Dashboard
                    </>
                  )}
                </button>

               

                {/* Back to Home Link */}
                <div className="text-center pt-4">
                  <p className="text-sm text-gray-500">
                    Need to access a different portal?{" "}
                    <Link
                      to="/"
                      className="font-medium text-emerald-400 hover:text-emerald-300 transition-colors duration-200"
                    >
                      Go back to home
                    </Link>
                  </p>
                </div>
              </form>
            </div>
          </div>

          {/* Mobile Features */}
          <div className="lg:hidden mt-8 bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl shadow-lg p-6">
            <h3 className="text-sm font-semibold text-white mb-4 text-center">
              System Admin Portal - Restricted Access
            </h3>
            <div className="grid grid-cols-1 gap-3">
              <div className="flex items-center gap-3 p-3 bg-emerald-500/10 rounded-xl">
                <div className="w-8 h-8 bg-gradient-to-r from-emerald-500 to-teal-600 rounded-lg flex items-center justify-center">
                  <Shield className="w-4 h-4 text-white" />
                </div>
                <span className="text-sm text-gray-300">Enterprise Security Level</span>
              </div>
              <div className="flex items-center gap-3 p-3 bg-purple-500/10 rounded-xl">
                <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-purple-600 rounded-lg flex items-center justify-center">
                  <Settings className="w-4 h-4 text-white" />
                </div>
                <span className="text-sm text-gray-300">Full System Control</span>
              </div>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Success Animation - Only for system admins */}
      <AnimatePresence>
        {loginSuccess && (
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
              <h3 className="text-2xl font-bold text-white mb-3">Access Granted!</h3>
              <p className="text-gray-300 mb-6">Entering system administration dashboard...</p>
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