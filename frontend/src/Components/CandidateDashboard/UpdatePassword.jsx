import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Lock, 
  Eye, 
  EyeOff, 
  ArrowLeft,
  CheckCircle,
  X,
  Save,
  Shield,
  Key,
  UserCheck,
  RefreshCw,
  AlertCircle
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { useDispatch, useSelector } from "react-redux";
import { updatePasswordAction, clearErrors } from "../../actions/userActions";

export default function TeacherUpdatePassword() {
  const dispatch = useDispatch();
  const { loading: apiLoading, error: apiError, success: apiSuccess } = useSelector((state) => state.updatePassword);
  const { isAuthenticatedUser, user } = useSelector((state) => state.loginUser);

  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [errors, setErrors] = useState({});
  const [localSuccess, setLocalSuccess] = useState(false);
  const navigate = useNavigate();

  // Check authentication
  useEffect(() => {
    if (!isAuthenticatedUser || user?.role !== 'candidate') {
      navigate('/teacher-login');
      return;
    }
  }, [isAuthenticatedUser, user, navigate]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      dispatch(clearErrors());
    };
  }, [dispatch]);

  // Handle API success
  useEffect(() => {
    if (apiSuccess) {
      setLocalSuccess(true);
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
      
      setTimeout(() => {
        setLocalSuccess(false);
        navigate('/teacher-profile');
      }, 3000);
    }
  }, [apiSuccess, navigate]);

  // Handle API errors
  useEffect(() => {
    if (apiError) {
      toast.error(apiError);
      setErrors(prev => ({
        ...prev,
        submit: apiError
      }));
    }
  }, [apiError]);

  const validateForm = () => {
    const newErrors = {};

    if (!currentPassword.trim()) {
      newErrors.currentPassword = "Current password is required";
    }

    if (!newPassword.trim()) {
      newErrors.newPassword = "New password is required";
    } else if (newPassword.length < 8) {
      newErrors.newPassword = "Password must be at least 8 characters";
    } else if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])/.test(newPassword)) {
      newErrors.newPassword = "Must include uppercase, lowercase, number & special character";
    }

    if (!confirmPassword.trim()) {
      newErrors.confirmPassword = "Please confirm your new password";
    } else if (newPassword !== confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    dispatch(updatePasswordAction({
      currentPassword,
      newPassword
    }));
  };

  const handleCancel = () => {
    navigate('/teacher-profile');
  };

  const SecurityFeature = ({ icon, title, description, color = "blue" }) => {
    const colors = {
      blue: "bg-blue-50 border-blue-200 text-blue-600",
      green: "bg-green-50 border-green-200 text-green-600",
      purple: "bg-purple-50 border-purple-200 text-purple-600",
      orange: "bg-orange-50 border-orange-200 text-orange-600"
    };

    return (
      <div className={`flex items-start gap-3 p-4 rounded-xl border-2 ${colors[color]} transition-all duration-200 hover:scale-105`}>
        <div className="p-2 bg-white rounded-lg shadow-sm">
          {icon}
        </div>
        <div className="flex-1">
          <h4 className="font-semibold text-sm mb-1">{title}</h4>
          <p className="text-xs opacity-75">{description}</p>
        </div>
      </div>
    );
  };

  const PasswordStrength = ({ password }) => {
    const getStrength = (pwd) => {
      let score = 0;
      if (pwd.length >= 8) score++;
      if (/[a-z]/.test(pwd)) score++;
      if (/[A-Z]/.test(pwd)) score++;
      if (/\d/.test(pwd)) score++;
      if (/[@$!%*?&]/.test(pwd)) score++;
      return score;
    };

    const strength = getStrength(password);
    const strengthLabels = ["Very Weak", "Weak", "Fair", "Good", "Strong", "Very Strong"];
    const strengthColors = ["bg-red-500", "bg-orange-500", "bg-yellow-500", "bg-blue-500", "bg-green-500", "bg-emerald-600"];

    if (!password) return null;

    return (
      <div className="mb-6">
        <div className="flex justify-between items-center mb-2">
          <span className="text-sm font-medium text-gray-700">Password Strength</span>
          <span className={`text-xs font-semibold ${
            strength <= 2 ? 'text-red-600' : 
            strength <= 3 ? 'text-orange-600' : 
            strength <= 4 ? 'text-blue-600' : 'text-green-600'
          }`}>
            {strengthLabels[strength]}
          </span>
        </div>
        <div className="flex gap-1">
          {[1, 2, 3, 4, 5].map((index) => (
            <div
              key={index}
              className={`h-2 flex-1 rounded-full transition-all duration-300 ${
                index <= strength ? strengthColors[strength] : 'bg-gray-200'
              }`}
            />
          ))}
        </div>
        
        {/* Password Requirements */}
        {password && (
          <div className="mt-4 space-y-2">
            {[
              { text: "At least 8 characters", met: password.length >= 8 },
              { text: "One uppercase letter", met: /[A-Z]/.test(password) },
              { text: "One lowercase letter", met: /[a-z]/.test(password) },
              { text: "One number", met: /\d/.test(password) },
              { text: "One special character", met: /[@$!%*?&]/.test(password) }
            ].map((req, index) => (
              <div key={index} className="flex items-center gap-2 text-xs">
                {req.met ? (
                  <CheckCircle className="w-4 h-4 text-green-500" />
                ) : (
                  <AlertCircle className="w-4 h-4 text-gray-400" />
                )}
                <span className={req.met ? "text-green-600" : "text-gray-500"}>
                  {req.text}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="min-h-screen mt-30 bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 py-8 px-4 md:px-8 font-[Parkinsans]">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-2xl shadow-xl border border-gray-100 mb-8"
        >
          <div className="p-6 md:p-8 border-b border-gray-100">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <button
                  onClick={handleCancel}
                  className="flex items-center gap-2 px-4 py-2 border-2 border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 transition-all duration-200 hover:border-gray-400"
                >
                  <ArrowLeft className="w-4 h-4" />
                  Back to Profile
                </button>
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-gradient-to-r from-[#0077BB] to-[#00AEEF] rounded-2xl flex items-center justify-center shadow-lg">
                    <Lock className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h1 className="text-2xl md:text-3xl font-bold text-gray-800">
                      Update Password
                    </h1>
                    <p className="text-gray-600 mt-1">Secure your teacher account with a new password</p>
                  </div>
                </div>
              </div>
              
              <div className="hidden md:flex items-center gap-3">
                <button
                  onClick={handleCancel}
                  className="flex items-center gap-2 px-6 py-3 border-2 border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 transition-all duration-200 hover:border-gray-400"
                >
                  <X className="w-4 h-4" />
                  Cancel
                </button>
                <button
                  onClick={handleSubmit}
                  disabled={apiLoading}
                  className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-[#0077BB] to-[#00AEEF] text-white rounded-xl hover:shadow-lg transition-all duration-200 disabled:opacity-50 hover:scale-105"
                >
                  {apiLoading ? (
                    <>
                      <RefreshCw className="w-4 h-4 animate-spin" />
                      Updating...
                    </>
                  ) : (
                    <>
                      <Save className="w-4 h-4" />
                      Update Password
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Success Message */}
        <AnimatePresence>
          {localSuccess && (
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="mb-8 p-6 bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 rounded-2xl flex items-center gap-4"
            >
              <div className="w-12 h-12 bg-green-500 rounded-2xl flex items-center justify-center">
                <CheckCircle className="w-6 h-6 text-white" />
              </div>
              <div className="flex-1">
                <p className="text-green-800 font-semibold text-lg">Password Updated Successfully!</p>
                <p className="text-green-600 text-sm">Your account is now secured with the new password. Redirecting to profile...</p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Main Content Grid - Horizontal Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Password Form */}
          <div className="lg:col-span-2">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1 }}
              className="bg-white rounded-2xl shadow-xl border border-gray-100 p-6 md:p-8"
            >
              <div className="flex items-center gap-3 mb-6 pb-4 border-b border-gray-200">
                <div className="p-2 bg-gradient-to-r from-[#0077BB] to-[#00AEEF] rounded-xl text-white">
                  <Key className="w-5 h-5" />
                </div>
                <div>
                  <h2 className="text-xl font-semibold text-gray-800">Change Password</h2>
                  <p className="text-gray-600 text-sm">Update your current password</p>
                </div>
              </div>

              <form onSubmit={handleSubmit}>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Current Password */}
                  <div className="mb-6">
                    <label className="block text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2">
                      <Lock className="w-4 h-4" />
                      Current Password
                    </label>
                    <div className="relative">
                      <input
                        type={showCurrentPassword ? "text" : "password"}
                        value={currentPassword}
                        onChange={(e) => setCurrentPassword(e.target.value)}
                        className={`w-full border-2 rounded-xl p-4 pl-12 pr-12 transition-all duration-200 focus:ring-2 focus:ring-blue-100 ${
                          errors.currentPassword ? 'border-red-300 bg-red-50' : 'border-gray-200 focus:border-[#0077BB] hover:border-gray-300'
                        }`}
                        placeholder="Enter current password"
                      />
                      <div className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400">
                        <Key className="w-4 h-4" />
                      </div>
                      <button
                        type="button"
                        className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors duration-200"
                        onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                      >
                        {showCurrentPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                    {errors.currentPassword && (
                      <p className="text-red-500 text-sm mt-2 flex items-center gap-2">
                        <div className="w-1.5 h-1.5 bg-red-500 rounded-full"></div>
                        {errors.currentPassword}
                      </p>
                    )}
                  </div>

                  {/* New Password */}
                  <div className="mb-6">
                    <label className="block text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2">
                      <RefreshCw className="w-4 h-4" />
                      New Password
                    </label>
                    <div className="relative">
                      <input
                        type={showNewPassword ? "text" : "password"}
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                        className={`w-full border-2 rounded-xl p-4 pl-12 pr-12 transition-all duration-200 focus:ring-2 focus:ring-blue-100 ${
                          errors.newPassword ? 'border-red-300 bg-red-50' : 'border-gray-200 focus:border-[#0077BB] hover:border-gray-300'
                        }`}
                        placeholder="Create new password"
                      />
                      <div className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400">
                        <Key className="w-4 h-4" />
                      </div>
                      <button
                        type="button"
                        className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors duration-200"
                        onClick={() => setShowNewPassword(!showNewPassword)}
                      >
                        {showNewPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                    {errors.newPassword && (
                      <p className="text-red-500 text-sm mt-2 flex items-center gap-2">
                        <div className="w-1.5 h-1.5 bg-red-500 rounded-full"></div>
                        {errors.newPassword}
                      </p>
                    )}
                  </div>

                  {/* Confirm Password */}
                  <div className="md:col-span-2 mb-6">
                    <label className="block text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2">
                      <UserCheck className="w-4 h-4" />
                      Confirm New Password
                    </label>
                    <div className="relative">
                      <input
                        type={showConfirmPassword ? "text" : "password"}
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        className={`w-full border-2 rounded-xl p-4 pl-12 pr-12 transition-all duration-200 focus:ring-2 focus:ring-blue-100 ${
                          errors.confirmPassword ? 'border-red-300 bg-red-50' : 'border-gray-200 focus:border-[#0077BB] hover:border-gray-300'
                        }`}
                        placeholder="Confirm your new password"
                      />
                      <div className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400">
                        <Key className="w-4 h-4" />
                      </div>
                      <button
                        type="button"
                        className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors duration-200"
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      >
                        {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                    {errors.confirmPassword && (
                      <p className="text-red-500 text-sm mt-2 flex items-center gap-2">
                        <div className="w-1.5 h-1.5 bg-red-500 rounded-full"></div>
                        {errors.confirmPassword}
                      </p>
                    )}
                    
                    {/* Password Match Indicator */}
                    {confirmPassword && newPassword && (
                      <div className={`mt-2 flex items-center gap-2 text-sm p-3 rounded-xl ${
                        newPassword === confirmPassword 
                          ? 'bg-green-50 text-green-700 border border-green-200' 
                          : 'bg-red-50 text-red-700 border border-red-200'
                      }`}>
                        {newPassword === confirmPassword ? (
                          <>
                            <CheckCircle className="w-4 h-4" />
                            <span>Passwords match</span>
                          </>
                        ) : (
                          <>
                            <AlertCircle className="w-4 h-4" />
                            <span>Passwords do not match</span>
                          </>
                        )}
                      </div>
                    )}
                  </div>
                </div>

                {/* Password Strength */}
                {newPassword && <PasswordStrength password={newPassword} />}

                {/* Mobile Action Buttons */}
                <div className="flex items-center gap-3 pt-6 border-t border-gray-200 md:hidden">
                  <button
                    type="button"
                    onClick={handleCancel}
                    className="flex-1 flex items-center justify-center gap-2 px-6 py-3 border-2 border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 transition-all duration-200"
                  >
                    <X className="w-4 h-4" />
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={apiLoading}
                    className="flex-1 flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-[#0077BB] to-[#00AEEF] text-white rounded-xl hover:shadow-lg transition-all duration-200 disabled:opacity-50"
                  >
                    {apiLoading ? (
                      <>
                        <RefreshCw className="w-4 h-4 animate-spin" />
                        Updating...
                      </>
                    ) : (
                      <>
                        <Save className="w-4 h-4" />
                        Update
                      </>
                    )}
                  </button>
                </div>
              </form>
            </motion.div>
          </div>

          {/* Right Column - Security Info & Tips */}
          <div className="space-y-6">
            {/* Security Features */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 }}
              className="bg-white rounded-2xl shadow-xl border border-gray-100 p-6"
            >
              <h3 className="font-semibold text-gray-800 mb-4 flex items-center gap-2">
                <Shield className="w-4 h-4 text-[#0077BB]" />
                Security Features
              </h3>
              <div className="space-y-3">
                <SecurityFeature
                  icon={<Lock className="w-4 h-4" />}
                  title="Strong Encryption"
                  description="Your password is encrypted with industry-standard AES-256"
                  color="blue"
                />
                <SecurityFeature
                  icon={<UserCheck className="w-4 h-4" />}
                  title="Multi-Factor Ready"
                  description="Compatible with two-factor authentication"
                  color="green"
                />
                <SecurityFeature
                  icon={<RefreshCw className="w-4 h-4" />}
                  title="Regular Updates"
                  description="We recommend changing your password every 90 days"
                  color="purple"
                />
              </div>
            </motion.div>

            {/* Security Tips */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4 }}
              className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-2xl border border-blue-200 p-6"
            >
              <h3 className="font-semibold text-blue-800 mb-3 flex items-center gap-2">
                <Shield className="w-4 h-4" />
                Password Security Tips
              </h3>
              <ul className="text-sm text-blue-700 space-y-2">
                <li className="flex items-start gap-2">
                  <div className="w-2 h-2 bg-blue-500 rounded-full mt-1.5"></div>
                  <span>Use a unique password you haven't used elsewhere</span>
                </li>
                <li className="flex items-start gap-2">
                  <div className="w-2 h-2 bg-blue-500 rounded-full mt-1.5"></div>
                  <span>Avoid common words and personal information</span>
                </li>
                <li className="flex items-start gap-2">
                  <div className="w-2 h-2 bg-blue-500 rounded-full mt-1.5"></div>
                  <span>Consider using a password manager</span>
                </li>
                <li className="flex items-start gap-2">
                  <div className="w-2 h-2 bg-blue-500 rounded-full mt-1.5"></div>
                  <span>Change your password regularly (every 90 days)</span>
                </li>
                <li className="flex items-start gap-2">
                  <div className="w-2 h-2 bg-blue-500 rounded-full mt-1.5"></div>
                  <span>Never share your password with anyone</span>
                </li>
              </ul>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
}