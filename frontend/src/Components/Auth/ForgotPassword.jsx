import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Mail, 
  Building,
  User,
  AlertCircle,
  CheckCircle,
  Shield,
  Target,
  Users,
  Star
} from "lucide-react";
import { useNavigate, Link } from "react-router-dom";
import { forgotPasswordAction, clearErrors } from "../../actions/userActions";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-hot-toast";

export default function ForgotPassword() {
  const dispatch = useDispatch();
  const { loading, error, success, message } = useSelector((state) => state.forgotPassword);

  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [userType, setUserType] = useState("school"); // 'school' or 'candidate'
  const [errors, setErrors] = useState({});
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [networkError, setNetworkError] = useState(false);

  const validateForm = () => {
    const newErrors = {};

    if (!email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      newErrors.email = "Email is invalid";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setNetworkError(false);
    
    if (!validateForm()) {
      return;
    }

    try {
      // Dispatch forgot password action with user type
      await dispatch(forgotPasswordAction(email, userType));
    } catch (err) {
      setNetworkError(true);
      setErrors({ 
        general: "Network error. Please check your connection and try again." 
      });
    }
  };

  const clearError = (field) => {
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
    if (errors.general || networkError) {
      setErrors(prev => ({ ...prev, general: '' }));
      setNetworkError(false);
    }
  };

  useEffect(() => {
    if (error) {
      if (error.includes("Network Error") || error.includes("ECONNREFUSED")) {
        setNetworkError(true);
        setErrors({ 
          general: "Unable to connect to server. Please check your internet connection and try again." 
        });
      } else {
        toast.error(error);
      }
      dispatch(clearErrors());
    }
  }, [dispatch, error]);

  useEffect(() => {
    if (success) {
      setIsSubmitted(true);
      toast.success(message || "Password reset instructions sent to your email!");
    }
  }, [success, message]);

  const getUserTypeDisplay = () => {
    return userType === 'school' ? 'School' : 'Candidate';
  };

  const getUserTypeIcon = () => {
    return userType === 'school' ? <Building className="w-6 h-6" /> : <User className="w-6 h-6" />;
  };

  const handleResendInstructions = () => {
    setIsSubmitted(false);
    dispatch(clearErrors());
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
                  Apex Staffing
                </h1>
                <p className="text-lg text-gray-600">Network</p>
              </div>
            </div>
            
            <div className="space-y-4">
              <h2 className="text-3xl font-bold text-gray-900 leading-tight">
                Secure Your <span className="text-[#0077BB]">Account</span> Access
              </h2>
              <p className="text-lg text-gray-600 leading-relaxed">
                Regain access to your {userType === 'school' ? 'school staffing portal' : 'candidate profile'} with our secure password recovery system.
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
                <Shield className="w-6 h-6 text-white" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Secure Recovery</h3>
                <p className="text-gray-600">Encrypted password reset process with enterprise security.</p>
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
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Instant Delivery</h3>
                <p className="text-gray-600">Reset instructions sent immediately to your email.</p>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="flex items-start gap-4 p-6 bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-white/20"
            >
              <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-blue-600 rounded-xl flex items-center justify-center flex-shrink-0">
                <CheckCircle className="w-6 h-6 text-white" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">30-Minute Expiry</h3>
                <p className="text-gray-600">Security links expire quickly for your protection.</p>
              </div>
            </motion.div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-6 pt-6">
            <div className="text-center">
              <div className="text-2xl font-bold text-[#0077BB]">500+</div>
              <div className="text-sm text-gray-600">Schools</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-[#00AEEF]">5,000+</div>
              <div className="text-sm text-gray-600">Candidates</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-[#0077BB]">98%</div>
              <div className="text-sm text-gray-600">Success Rate</div>
            </div>
          </div>
        </motion.div>

        {/* Right Side - Forgot Password Form */}
        <motion.div
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6 }}
          className="w-full max-w-md mx-auto lg:mx-0"
        >
          {/* Forgot Password Card */}
          <div className="bg-white rounded-3xl shadow-2xl border border-gray-100 overflow-hidden">
            {/* Card Header */}
            <div className="bg-gradient-to-r from-[#0077BB] to-[#00AEEF] p-8 text-center">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: "spring", stiffness: 200, damping: 15 }}
                className="w-20 h-20 bg-white/20 rounded-2xl flex items-center justify-center mx-auto mb-4 backdrop-blur-sm"
              >
                <Shield className="w-10 h-10 text-white" />
              </motion.div>
              <h2 className="text-2xl font-bold text-white mb-2">Reset Password</h2>
              <p className="text-blue-100">
                {isSubmitted ? "Check your email" : `Enter your ${getUserTypeDisplay().toLowerCase()} email`}
              </p>
            </div>

            {/* Form Content */}
            <div className="p-8">
              {!isSubmitted ? (
                <form onSubmit={handleSubmit} className="space-y-6" autoComplete="on">
                  {/* User Type Selection */}
                  <div className="mb-6">
                    <label className="block text-sm font-medium text-gray-700 mb-3">
                      I am a:
                    </label>
                    <div className="grid grid-cols-2 gap-3">
                      <button
                        type="button"
                        onClick={() => setUserType('school')}
                        className={`p-4 border-2 rounded-xl transition-all duration-200 flex items-center justify-center gap-2 ${
                          userType === 'school' 
                            ? 'border-[#0077BB] bg-blue-50 text-[#0077BB]' 
                            : 'border-gray-200 text-gray-600 hover:border-gray-300'
                        }`}
                      >
                        <Building className="w-5 h-5" />
                        <span className="font-medium">School</span>
                      </button>
                      <button
                        type="button"
                        onClick={() => setUserType('candidate')}
                        className={`p-4 border-2 rounded-xl transition-all duration-200 flex items-center justify-center gap-2 ${
                          userType === 'candidate' 
                            ? 'border-[#0077BB] bg-blue-50 text-[#0077BB]' 
                            : 'border-gray-200 text-gray-600 hover:border-gray-300'
                        }`}
                      >
                        <User className="w-5 h-5" />
                        <span className="font-medium">Candidate</span>
                      </button>
                    </div>
                  </div>

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

                  {/* General Error */}
                  <AnimatePresence>
                    {errors.general && !networkError && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        className="p-4 bg-red-50 border border-red-200 rounded-xl flex items-center gap-3"
                      >
                        <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0" />
                        <p className="text-red-700 text-sm">{errors.general}</p>
                      </motion.div>
                    )}
                  </AnimatePresence>

                  {/* Email Field */}
                  <div className="mb-6">
                    <label htmlFor="forgot-password-email" className="block text-sm font-medium text-gray-700 mb-2">
                      {getUserTypeDisplay()} Email Address
                    </label>
                    <div className="relative">
                      <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
                        <Mail className="w-5 h-5" />
                      </div>
                      <input
                        id="forgot-password-email"
                        name="forgot-password-email"
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="w-full border-2 border-gray-200 rounded-xl p-4 pl-11 transition-all duration-200 focus:border-[#0077BB] focus:ring-2 focus:ring-blue-100"
                        placeholder={userType === 'school' ? "school@example.com" : "candidate@example.com"}
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

                  {/* Submit Button */}
                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full flex justify-center items-center gap-3 py-4 px-4 border border-transparent rounded-xl font-semibold bg-gradient-to-r from-[#0077BB] to-[#00AEEF] text-white hover:shadow-lg transform hover:scale-105 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none shadow-md"
                  >
                    {loading ? (
                      <>
                        <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                        Sending Instructions...
                      </>
                    ) : (
                      <>
                        <Mail className="w-5 h-5" />
                        Send Reset Instructions
                      </>
                    )}
                  </button>

                  {/* Login Links */}
                  <div className="text-center pt-6 border-t border-gray-200">
                    <p className="text-sm text-gray-600">
                      Remember your password?{" "}
                      {userType === 'school' ? (
                        <Link
                          to="/school-login"
                          className="font-semibold text-[#0077BB] hover:text-[#00AEEF] transition-colors duration-200"
                        >
                          Back to School Login
                        </Link>
                      ) : (
                        <Link
                          to="/candidate-login"
                          className="font-semibold text-[#0077BB] hover:text-[#00AEEF] transition-colors duration-200"
                        >
                          Back to Candidate Login
                        </Link>
                      )}
                    </p>
                  </div>
                </form>
              ) : (
                /* Success State */
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="text-center space-y-6"
                >
                  {/* Success Icon */}
                  <div className="flex justify-center">
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
                      className="w-20 h-20 bg-gradient-to-r from-green-500 to-emerald-600 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg"
                    >
                      <CheckCircle className="w-10 h-10 text-white" />
                    </motion.div>
                  </div>

                  {/* Success Message */}
                  <div className="space-y-4">
                    <h3 className="text-xl font-bold text-gray-800">Check Your Email!</h3>
                    <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
                      <p className="text-sm text-gray-700 leading-relaxed">
                        We've sent password reset instructions to:
                      </p>
                      <p className="font-semibold text-[#0077BB] text-sm mt-1">{email}</p>
                      <p className="text-xs text-gray-600 mt-2">
                        ({getUserTypeDisplay()} Account)
                      </p>
                    </div>
                    <p className="text-xs text-gray-500">
                      The reset link will expire in 30 minutes for security reasons.
                    </p>
                  </div>

                  {/* Action Buttons */}
                  <div className="space-y-3">
                    <button
                      onClick={handleResendInstructions}
                      className="w-full flex justify-center items-center gap-3 py-3 px-4 border border-[#0077BB] text-[#0077BB] rounded-xl font-semibold hover:bg-blue-50 transition-all duration-200"
                    >
                      <Mail className="w-5 h-5" />
                      Resend Instructions
                    </button>
                    
                    <Link to={userType === 'school' ? "/school-login" : "/candidate-login"}>
                      <button className="w-full flex justify-center items-center gap-3 py-3 px-4 border border-gray-300 text-gray-700 rounded-xl font-semibold hover:bg-gray-50 transition-all duration-200">
                        {getUserTypeIcon()}
                        Back to {getUserTypeDisplay()} Login
                      </button>
                    </Link>
                  </div>
                </motion.div>
              )}
            </div>
          </div>

          {/* Mobile Features */}
          <div className="lg:hidden mt-8 bg-white rounded-2xl shadow-lg border border-gray-100 p-6">
            <h3 className="text-sm font-semibold text-gray-900 mb-4 text-center">
              Secure Password Recovery
            </h3>
            <div className="grid grid-cols-1 gap-3">
              <div className="flex items-center gap-3 p-3 bg-blue-50 rounded-xl">
                <div className="w-8 h-8 bg-gradient-to-r from-[#0077BB] to-[#00AEEF] rounded-lg flex items-center justify-center">
                  <Shield className="w-4 h-4 text-white" />
                </div>
                <span className="text-sm text-gray-700">Encrypted Security</span>
              </div>
              <div className="flex items-center gap-3 p-3 bg-green-50 rounded-xl">
                <div className="w-8 h-8 bg-gradient-to-r from-green-500 to-emerald-600 rounded-lg flex items-center justify-center">
                  <CheckCircle className="w-4 h-4 text-white" />
                </div>
                <span className="text-sm text-gray-700">30-Minute Expiry</span>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}