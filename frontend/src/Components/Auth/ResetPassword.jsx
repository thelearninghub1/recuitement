import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Lock, 
  Eye, 
  EyeOff, 
  Building,
  AlertCircle,
  CheckCircle,
  Shield,
  Check
} from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";
import { resetPasswordAction, clearErrors } from "../../actions/userActions";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-hot-toast";

export default function ResetPassword() {
  const dispatch = useDispatch();
  
  // Use resetPassword state for reset password functionality
  const resetPasswordState = useSelector((state) => state.forgotPassword || {});
  const { loading = false, error = null, success = false } = resetPasswordState;
  
  const navigate = useNavigate();
  const {token} = useParams();
  
  const [formData, setFormData] = useState({
    password: '',
    confirmPassword: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [errors, setErrors] = useState({});
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [networkError, setNetworkError] = useState(false);

  // Calculate requirements based on current password
  const getPasswordRequirements = (password) => {
    return [
      { id: 1, text: 'At least 8 characters', met: password.length >= 8 },
      { id: 2, text: 'One uppercase letter', met: /[A-Z]/.test(password) },
      { id: 3, text: 'One lowercase letter', met: /[a-z]/.test(password) },
      { id: 4, text: 'One number', met: /[0-9]/.test(password) },
      { id: 5, text: 'One special character', met: /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password) }
    ];
  };

  const [requirements, setRequirements] = useState(getPasswordRequirements(''));

  const validateForm = () => {
    const newErrors = {};
    const allRequirementsMet = requirements.every(req => req.met);
    const passwordsMatch = formData.password === formData.confirmPassword;

    if (!formData.password) {
      newErrors.password = "Password is required";
    } else if (!allRequirementsMet) {
      newErrors.password = "Password does not meet all requirements";
    }

    if (!formData.confirmPassword) {
      newErrors.confirmPassword = "Please confirm your password";
    } else if (!passwordsMatch) {
      newErrors.confirmPassword = "Passwords do not match";
    }

    // Check if token exists
    if (!token) {
      newErrors.general = "Reset link is invalid. Please request a new password reset link.";
      return false; // Don't proceed with submission
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    if (name === 'password') {
      // Update requirements whenever password changes
      setRequirements(getPasswordRequirements(value));
    }
    
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
    if (errors.general || networkError) {
      setErrors(prev => ({ ...prev, general: '' }));
      setNetworkError(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setNetworkError(false);
    
    if (!validateForm()) {
      return;
    }

    try {
      console.log('Dispatching reset password action with token:', token);
      // Dispatch reset password action
      await dispatch(resetPasswordAction(token, formData.password));
    } catch (err) {
      console.error('Reset password error:', err);
      setNetworkError(true);
      setErrors({ 
        general: "Network error. Please check your connection and try again." 
      });
    }
  };

  useEffect(() => {
    if (error) {
      console.log('Redux error:', error);
      if (error.includes("Network Error") || error.includes("ECONNREFUSED")) {
        setNetworkError(true);
        setErrors({ 
          general: "Unable to connect to server. Please check your internet connection and try again." 
        });
      } else {
        toast.error(error);
        setErrors({ general: error });
      }
      dispatch(clearErrors());
    }
  }, [dispatch, error]);

  useEffect(() => {
    if (success) {
      setIsSubmitted(true);
      toast.success("Password reset successfully!");
      
      // Redirect to home page after success
      setTimeout(() => {
        navigate('/');
      }, 3000);
    }
  }, [success, navigate]);

  // Calculate these values directly
  const allRequirementsMet = requirements.every(req => req.met);
  const passwordsMatch = formData.password === formData.confirmPassword;

  // Enable button only when form is valid AND token exists
  const isButtonDisabled = loading || !allRequirementsMet || !passwordsMatch || !token;

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
                Secure Your <span className="text-[#0077BB]">Account</span>
              </h2>
              <p className="text-lg text-gray-600 leading-relaxed">
                Create a strong password to protect your account and access all features.
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
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Strong Encryption</h3>
                <p className="text-gray-600">Military-grade security for your account protection.</p>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="flex items-start gap-4 p-6 bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-white/20"
            >
              <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-purple-600 rounded-xl flex items-center justify-center flex-shrink-0">
                <CheckCircle className="w-6 h-6 text-white" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Real-time Validation</h3>
                <p className="text-gray-600">Instant feedback on password strength and requirements.</p>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="flex items-start gap-4 p-6 bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-white/20"
            >
              <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-blue-600 rounded-xl flex items-center justify-center flex-shrink-0">
                <Lock className="w-6 h-6 text-white" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Instant Activation</h3>
                <p className="text-gray-600">Your new password takes effect immediately.</p>
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
              <div className="text-sm text-gray-600">Teachers</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-[#0077BB]">98%</div>
              <div className="text-sm text-gray-600">Success Rate</div>
            </div>
          </div>
        </motion.div>

        {/* Right Side - Reset Password Form */}
        <motion.div
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6 }}
          className="w-full max-w-md mx-auto lg:mx-0"
        >
          {/* Reset Password Card */}
          <div className="bg-white rounded-3xl shadow-2xl border border-gray-100 overflow-hidden">
            {/* Card Header */}
            <div className="bg-gradient-to-r from-[#0077BB] to-[#00AEEF] p-8 text-center">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: "spring", stiffness: 200, damping: 15 }}
                className="w-20 h-20 bg-white/20 rounded-2xl flex items-center justify-center mx-auto mb-4 backdrop-blur-sm"
              >
                <Lock className="w-10 h-10 text-white" />
              </motion.div>
              <h2 className="text-2xl font-bold text-white mb-2">
                {isSubmitted ? 'Password Reset!' : 'Create New Password'}
              </h2>
              <p className="text-blue-100">
                Account Recovery
              </p>
            </div>

            {/* Form Content */}
            <div className="p-8">
              {!isSubmitted ? (
                <form onSubmit={handleSubmit} className="space-y-6" autoComplete="on">
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

                  {/* Token Error - Show specific message for missing token */}
                  <AnimatePresence>
                    {!token && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        className="p-4 bg-yellow-50 border border-yellow-200 rounded-xl flex items-center gap-3"
                      >
                        <AlertCircle className="w-5 h-5 text-yellow-600 flex-shrink-0" />
                        <div>
                          <p className="text-yellow-700 text-sm font-medium">Invalid Reset Link</p>
                          <p className="text-yellow-600 text-sm mt-1">
                            This reset link is missing the required token. Please request a new password reset link from the login page.
                          </p>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>

                  {/* New Password Field */}
                  <div className="mb-4">
                    <label htmlFor="new-password" className="block text-sm font-medium text-gray-700 mb-2">
                      New Password
                    </label>
                    <div className="relative">
                      <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
                        <Lock className="w-5 h-5" />
                      </div>
                      <input
                        id="new-password"
                        name="password"
                        type={showPassword ? "text" : "password"}
                        value={formData.password}
                        onChange={handleChange}
                        className="w-full border-2 border-gray-200 rounded-xl p-4 pl-11 pr-12 transition-all duration-200 focus:border-[#0077BB] focus:ring-2 focus:ring-blue-100"
                        placeholder="Enter new password"
                        autoComplete="new-password"
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

                  {/* Confirm Password Field */}
                  <div className="mb-6">
                    <label htmlFor="confirm-password" className="block text-sm font-medium text-gray-700 mb-2">
                      Confirm New Password
                    </label>
                    <div className="relative">
                      <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
                        <Lock className="w-5 h-5" />
                      </div>
                      <input
                        id="confirm-password"
                        name="confirmPassword"
                        type={showConfirmPassword ? "text" : "password"}
                        value={formData.confirmPassword}
                        onChange={handleChange}
                        className={`w-full border-2 rounded-xl p-4 pl-11 pr-12 transition-all duration-200 focus:ring-2 focus:ring-blue-100 ${
                          formData.confirmPassword && !passwordsMatch 
                            ? 'border-red-300 focus:border-red-300' 
                            : formData.confirmPassword && passwordsMatch 
                            ? 'border-green-300 focus:border-green-300'
                            : 'border-gray-200 focus:border-[#0077BB]'
                        }`}
                        placeholder="Confirm new password"
                        autoComplete="new-password"
                      />
                      <button
                        type="button"
                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors duration-200"
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      >
                        {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                      </button>
                    </div>
                    {formData.confirmPassword && (
                      <p className={`text-xs mt-2 flex items-center ${
                        passwordsMatch ? 'text-green-600' : 'text-red-600'
                      }`}>
                        {passwordsMatch ? (
                          <>
                            <Check className="w-3 h-3 mr-1" />
                            Passwords match
                          </>
                        ) : (
                          <>
                            <AlertCircle className="w-3 h-3 mr-1" />
                            Passwords do not match
                          </>
                        )}
                      </p>
                    )}
                    {errors.confirmPassword && (
                      <p className="text-red-500 text-sm mt-2 flex items-center gap-2">
                        <AlertCircle className="w-4 h-4" />
                        {errors.confirmPassword}
                      </p>
                    )}
                  </div>

                  {/* Password Requirements */}
                  <div className="bg-gray-50 border border-gray-200 rounded-xl p-4 mb-6">
                    <h4 className="text-sm font-medium text-gray-700 mb-3 flex items-center gap-2">
                      <Shield className="w-4 h-4 text-[#0077BB]" />
                      Password Requirements
                    </h4>
                    <div className="space-y-2">
                      {requirements.map((req) => (
                        <div key={req.id} className="flex items-center gap-3">
                          <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center ${
                            req.met 
                              ? 'bg-green-500 border-green-500' 
                              : 'border-gray-300'
                          }`}>
                            {req.met && <Check className="w-2 h-2 text-white" />}
                          </div>
                          <span className={`text-xs ${req.met ? 'text-green-600' : 'text-gray-500'}`}>
                            {req.text}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Submit Button - Re-enabled with proper validation */}
                  <button
                    type="submit"
                    disabled={isButtonDisabled}
                    className="w-full flex justify-center items-center gap-3 py-4 px-4 border border-transparent rounded-xl font-semibold bg-gradient-to-r from-[#0077BB] to-[#00AEEF] text-white hover:shadow-lg transform hover:scale-105 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none shadow-md"
                  >
                    {loading ? (
                      <>
                        <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                        Updating Password...
                      </>
                    ) : (
                      <>
                        <Lock className="w-5 h-5" />
                        Reset Password
                      </>
                    )}
                  </button>

                  {/* Forgot Password Link */}
                  <div className="text-center pt-4">
                    <p className="text-sm text-gray-600">
                      Need a new reset link?{" "}
                      <button
                        type="button"
                        onClick={() => navigate('/forgot-password')}
                        className="font-semibold text-[#0077BB] hover:text-[#00AEEF] transition-colors duration-200"
                      >
                        Request a new one
                      </button>
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
                    <h3 className="text-xl font-bold text-gray-800">Password Updated!</h3>
                    <div className="bg-green-50 border border-green-200 rounded-xl p-4">
                      <p className="text-sm text-gray-700 leading-relaxed">
                        Your account password has been successfully reset.
                      </p>
                      <p className="text-xs text-gray-600 mt-2">
                        Redirecting to home page...
                      </p>
                    </div>
                  </div>

                  {/* Loading Spinner */}
                  <div className="flex justify-center">
                    <div className="w-8 h-8 border-2 border-[#0077BB] border-t-transparent rounded-full animate-spin"></div>
                  </div>
                </motion.div>
              )}
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}