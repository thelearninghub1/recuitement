import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { 
  FaUniversity, 
  FaCopy, 
  FaCheck, 
  FaUpload, 
  FaFileInvoice, 
  FaCreditCard,
  FaBuilding,
  FaGlobe,
  FaPhone,
  FaEnvelope,
  FaDownload,
  FaEye,
  FaTimes,
  FaSpinner,
  FaArrowLeft,
  FaShieldAlt,
  FaClock,
  FaWhatsapp,
  FaHeadset,
  FaLandmark,
  FaMoneyBillWave,
  FaHourglassHalf,
  FaInfoCircle
} from 'react-icons/fa';
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import { submitPayment, resetSubmitPayment, clearPaymentErrors } from '../../actions/paymentActions';
import { SUBMIT_PAYMENT_RESET } from '../../constants/paymentConstants';

const BillingDetails = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();
  
  // Redux states
  const submitPaymentState = useSelector((state) => state.submitPayment);
  const { loading: submitLoading, success: submitSuccess, error: submitError, payment: submittedPayment } = submitPaymentState;
  
  // Membership status state
  const [membershipStatus, setMembershipStatus] = useState(null);
  const [statusCheckLoading, setStatusCheckLoading] = useState(false);
  const [copiedField, setCopiedField] = useState(null);
  const [selectedFile, setSelectedFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [referenceNumber, setReferenceNumber] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('bank_transfer');
  const [selectedPlan, setSelectedPlan] = useState({
    planId: null,
    planName: 'Professional Plan',
    amount: 790,
    currency: 'PKR',
    duration: 'yearly'
  });

  // Check if user has pending payment or approved membership
  useEffect(() => {
    // Get selected plan from navigation state or localStorage
    const fromState = location.state?.selectedPlan;
    if (fromState) {
      setSelectedPlan(fromState);
    } else {
      const fromStorage = localStorage.getItem('selectedMembershipPlan');
      if (fromStorage) {
        const parsed = JSON.parse(fromStorage);
        setSelectedPlan(parsed);
      }
    }

    // Check membership status from localStorage
    checkUserMembershipStatus();
  }, [location]);

  const checkUserMembershipStatus = () => {
    setStatusCheckLoading(true);
    try {
      // First check localStorage for pending submission
      const pendingSubmission = localStorage.getItem('pendingPaymentSubmission');
      if (pendingSubmission) {
        const pending = JSON.parse(pendingSubmission);
        setMembershipStatus({
          status: 'pending',
          message: 'Your payment is pending approval',
          submittedAt: pending.submittedAt,
          referenceNumber: pending.referenceNumber,
          planName: pending.planName,
          amount: pending.amount
        });
        setStatusCheckLoading(false);
        return;
      }

      // Check if user has approved membership
      const approvedMembership = localStorage.getItem('membershipApproved');
      if (approvedMembership === 'true') {
        setMembershipStatus({
          status: 'approved',
          message: 'Your membership is active!',
          approvedAt: localStorage.getItem('membershipApprovedAt')
        });
        setStatusCheckLoading(false);
        return;
      }

      setStatusCheckLoading(false);
    } catch (error) {
      console.error('Error checking membership status:', error);
      setStatusCheckLoading(false);
    }
  };

  // Handle submit success
  useEffect(() => {
    if (submitSuccess) {
      // Save pending submission to localStorage
      const pendingData = {
        submittedAt: new Date().toISOString(),
        referenceNumber: referenceNumber,
        planName: selectedPlan.planName,
        amount: selectedPlan.amount
      };
      localStorage.setItem('pendingPaymentSubmission', JSON.stringify(pendingData));
      localStorage.removeItem('selectedMembershipPlan');
      
      // Update membership status
      setMembershipStatus({
        status: 'pending',
        message: 'Your payment is pending approval',
        submittedAt: new Date().toISOString(),
        referenceNumber: referenceNumber,
        planName: selectedPlan.planName,
        amount: selectedPlan.amount
      });
      
      // Reset form state after 5 seconds
      setTimeout(() => {
        dispatch({ type: SUBMIT_PAYMENT_RESET });
      }, 5000);
    }
  }, [submitSuccess, referenceNumber, selectedPlan, dispatch]);

  // Handle submit error
  useEffect(() => {
    if (submitError) {
      toast.error(submitError);
      setTimeout(() => dispatch(clearPaymentErrors()), 3000);
    }
  }, [submitError, dispatch]);

  // Bank Details
  const bankDetails = {
    accountTitle: "THE LEARNING HUB",
    bankName: "BANK AL HABIB LIMITED",
    branch: "IB Shaheed-e-Millat (JCHS)",
    accountNumber: "5040-1829001286010",
    iban: "PK91 BAHL 5040 1829 0012 86010",
    currency: "PKR",
    branchCode: "5040",
    bankAddress: "IB Shaheed-e-Millat Road, Karachi, Pakistan"
  };

  const handleCopy = (text, field) => {
    navigator.clipboard.writeText(text);
    setCopiedField(field);
    toast.success(`${field} copied to clipboard!`);
    setTimeout(() => setCopiedField(null), 2000);
  };

  const handleFileSelect = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (!file.type.match('image.*') && !file.type.match('application/pdf')) {
        toast.error('Please upload an image or PDF file');
        return;
      }
      
      if (file.size > 5 * 1024 * 1024) {
        toast.error('File size should be less than 5MB');
        return;
      }
      
      setSelectedFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewUrl(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRemoveFile = () => {
    setSelectedFile(null);
    setPreviewUrl(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!referenceNumber) {
      toast.error('Please enter your transaction reference number');
      return;
    }
    
    if (!selectedFile) {
      toast.error('Please upload payment screenshot/proof');
      return;
    }
    
    if (!selectedPlan.planId) {
      toast.error('Plan information missing. Please go back and select a plan.');
      return;
    }
    
    const formData = new FormData();
    formData.append('planId', selectedPlan.planId);
    formData.append('planName', selectedPlan.planName);
    formData.append('amount', selectedPlan.amount);
    formData.append('currency', selectedPlan.currency);
    formData.append('duration', selectedPlan.duration);
    formData.append('paymentMethod', paymentMethod);
    formData.append('referenceNumber', referenceNumber);
    formData.append('screenshot', selectedFile);
    
    dispatch(submitPayment(formData));
  };

  const openWhatsApp = () => {
    window.open('https://wa.me/923001234567?text=Hi%2C%20I%20need%20help%20with%20my%20payment%20for%20membership', '_blank');
  };

  // Clear pending submission (for testing purposes)
  const clearPendingSubmission = () => {
    localStorage.removeItem('pendingPaymentSubmission');
    setMembershipStatus(null);
    toast.info('Pending submission cleared');
  };

  // Show pending approval message (persistent until approved)
  if (membershipStatus?.status === 'pending' && !submitSuccess) {
    return (
      <div className="min-h-screen mt-30 bg-gradient-to-br from-amber-50 to-orange-100 flex items-center justify-center p-4">
        <div className="max-w-2xl w-full bg-white rounded-2xl shadow-2xl p-8 animate-in zoom-in-95 duration-300">
          <div className="w-24 h-24 bg-amber-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <FaHourglassHalf className="text-amber-600 text-5xl animate-pulse" />
          </div>
          <h2 className="text-2xl font-bold text-gray-800 text-center mb-3">Payment Pending Approval</h2>
          <p className="text-gray-600 text-center mb-6">
            Thank you for your payment submission. Our team is reviewing your payment proof.
          </p>
          
          {/* Pending Message Box */}
          <div className="bg-amber-50 border border-amber-200 rounded-xl p-6 mb-6">
            <div className="flex items-center justify-center gap-3 mb-4">
              <FaClock className="text-amber-600 text-2xl animate-spin" />
              <p className="text-amber-800 font-bold text-lg">Awaiting Admin Approval</p>
            </div>
            <p className="text-amber-700 text-sm leading-relaxed text-center">
              Your membership plan will be activated within <strong className="text-amber-900">24 hours</strong> after admin approval.
              You will receive an email confirmation once approved.
            </p>
          </div>
          
          {/* Submission Details */}
          <div className="bg-gray-50 rounded-xl p-5 mb-6">
            <h3 className="font-semibold text-gray-800 mb-3 flex items-center gap-2">
              <FaInfoCircle className="text-blue-600" />
              Submission Details:
            </h3>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-500">Plan:</span>
                <span className="font-semibold">{membershipStatus.planName || selectedPlan.planName}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Amount:</span>
                <span className="font-semibold text-green-600">{selectedPlan.currency} {membershipStatus.amount || selectedPlan.amount}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Reference Number:</span>
                <span className="font-mono text-sm">{membershipStatus.referenceNumber || referenceNumber}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Submitted:</span>
                <span>{new Date(membershipStatus.submittedAt).toLocaleString()}</span>
              </div>
            </div>
          </div>
          
          {/* Next Steps */}
          <div className="bg-blue-50 rounded-xl p-5 mb-6 text-left">
            <h3 className="font-semibold text-blue-800 mb-3 flex items-center gap-2">
              <FaClock className="text-blue-600" />
              What happens next?
            </h3>
            <ul className="text-sm text-blue-700 space-y-2">
              <li className="flex items-start gap-2">
                <span className="text-blue-500">✓</span>
                <span>Our team verifies your payment proof</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-blue-500">✓</span>
                <span>You receive email confirmation upon approval</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-blue-500">✓</span>
                <span>Membership benefits activate immediately</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-blue-500">✓</span>
                <span>Access all premium features in your dashboard</span>
              </li>
            </ul>
          </div>
          
          <div className="flex gap-3">
            <button
              onClick={() => navigate('/school-dashboard')}
              className="flex-1 px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl hover:shadow-lg transition-all font-semibold"
            >
              Go to Dashboard
            </button>
            <button
              onClick={openWhatsApp}
              className="flex-1 px-6 py-3 border-2 border-green-600 text-green-600 rounded-xl hover:bg-green-50 transition-all font-semibold flex items-center justify-center gap-2"
            >
              <FaWhatsapp /> Contact Support
            </button>
          </div>
          
          <p className="text-xs text-gray-400 text-center mt-4">
            You will be redirected to dashboard. This page will show the approval status until your membership is activated.
          </p>
        </div>
      </div>
    );
  }

  // Show approved membership message
  if (membershipStatus?.status === 'approved') {
    return (
      <div className="min-h-screen mt-30 bg-gradient-to-br from-green-50 to-emerald-100 flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-white rounded-2xl shadow-2xl p-8 text-center animate-in zoom-in-95 duration-300">
          <div className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <FaCheck className="text-green-600 text-5xl" />
          </div>
          <h2 className="text-2xl font-bold text-gray-800 mb-3">Membership Active!</h2>
          <p className="text-gray-600 mb-6">
            Your membership has been approved and is now active.
          </p>
          
          <div className="bg-green-50 border border-green-200 rounded-xl p-4 mb-6">
            <p className="text-green-700 text-sm">
              Your membership was approved on {membershipStatus.approvedAt ? new Date(membershipStatus.approvedAt).toLocaleDateString() : 'recently'}
            </p>
          </div>
          
          <button
            onClick={() => navigate('/school-dashboard')}
            className="w-full px-6 py-3 bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-xl hover:shadow-lg transition-all font-semibold"
          >
            Go to Dashboard
          </button>
        </div>
      </div>
    );
  }

  // Show thank you page after successful submission (immediate)
  if (submitSuccess) {
    return (
      <div className="min-h-screen mt-30 bg-gradient-to-br from-green-50 to-emerald-100 flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-white rounded-2xl shadow-2xl p-8 text-center animate-in zoom-in-95 duration-300">
          <div className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <FaCheck className="text-green-600 text-5xl" />
          </div>
          <h2 className="text-2xl font-bold text-gray-800 mb-3">Payment Submitted!</h2>
          <p className="text-gray-600 mb-4">
            Thank you for your payment submission.
          </p>
          
          <div className="bg-amber-50 border border-amber-200 rounded-xl p-5 mb-6">
            <div className="flex items-center justify-center gap-3 mb-3">
              <FaHourglassHalf className="text-amber-600 text-2xl animate-pulse" />
              <p className="text-amber-800 font-bold text-lg">Please Wait for Approval</p>
            </div>
            <p className="text-amber-700 text-sm leading-relaxed">
              Your membership plan will be activated within <strong className="text-amber-900">24 hours</strong> after admin approval.
            </p>
          </div>
          
          {submittedPayment && (
            <div className="bg-gray-50 rounded-xl p-3 mb-6 text-left">
              <p className="text-xs text-gray-500">Transaction Reference:</p>
              <p className="text-sm font-mono font-semibold text-gray-700">{referenceNumber}</p>
            </div>
          )}
          
          <div className="flex gap-3">
            <button
              onClick={() => navigate('/school-dashboard')}
              className="flex-1 px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl hover:shadow-lg transition-all font-semibold"
            >
              Go to Dashboard
            </button>
            <button
              onClick={() => navigate('/membership')}
              className="flex-1 px-6 py-3 border-2 border-blue-600 text-blue-600 rounded-xl hover:bg-blue-50 transition-all font-semibold"
            >
              View Plans
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Original Billing Form (shown when no pending/approved status)
  return (
    <div className="min-h-screen mt-30 bg-gradient-to-br from-gray-50 to-blue-50">
      {/* Status Banner - Show if there's any pending submission warning */}
      {membershipStatus && membershipStatus.status !== 'pending' && membershipStatus.status !== 'approved' && (
        <div className="bg-yellow-50 border-b border-yellow-200">
          <div className="max-w-7xl mx-auto px-6 py-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-sm text-yellow-800">
                <FaInfoCircle />
                <span>Your previous submission is pending review. Please wait for admin approval.</span>
              </div>
              <button 
                onClick={clearPendingSubmission}
                className="text-xs text-yellow-600 hover:text-yellow-800 underline"
              >
                Clear
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Header */}
      <div className="bg-white shadow-lg sticky top-0 z-20">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center gap-4">
            <button
              onClick={() => navigate(-1)}
              className="flex items-center gap-2 px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <FaArrowLeft /> Back
            </button>
            <div>
              <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                Billing Details
              </h1>
              <p className="text-gray-600">Complete your payment to activate your membership</p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content - Original Form */}
      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Bank Details Section */}
          <div className="space-y-6">
            <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
              <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-6 text-white">
                <div className="flex items-center gap-3">
                  <FaLandmark className="text-3xl" />
                  <div>
                    <h2 className="text-xl font-bold">Bank Transfer Details</h2>
                    <p className="text-blue-100 text-sm">Please transfer the amount using these details</p>
                  </div>
                </div>
              </div>
              
              <div className="p-6 space-y-4">
                {/* Account Title */}
                <div className="group">
                  <label className="text-sm font-semibold text-gray-600 mb-1 block">Account Title</label>
                  <div className="flex items-center justify-between p-3 bg-gray-50 rounded-xl border border-gray-200">
                    <span className="font-semibold text-gray-800">{bankDetails.accountTitle}</span>
                    <button
                      onClick={() => handleCopy(bankDetails.accountTitle, 'Account Title')}
                      className="text-blue-600 hover:text-blue-700 transition-colors"
                    >
                      {copiedField === 'Account Title' ? <FaCheck /> : <FaCopy />}
                    </button>
                  </div>
                </div>

                {/* Bank Name */}
                <div className="group">
                  <label className="text-sm font-semibold text-gray-600 mb-1 block">Bank Name</label>
                  <div className="flex items-center justify-between p-3 bg-gray-50 rounded-xl border border-gray-200">
                    <span className="font-semibold text-gray-800">{bankDetails.bankName}</span>
                    <button
                      onClick={() => handleCopy(bankDetails.bankName, 'Bank Name')}
                      className="text-blue-600 hover:text-blue-700 transition-colors"
                    >
                      {copiedField === 'Bank Name' ? <FaCheck /> : <FaCopy />}
                    </button>
                  </div>
                </div>

                {/* Branch */}
                <div className="group">
                  <label className="text-sm font-semibold text-gray-600 mb-1 block">Branch</label>
                  <div className="flex items-center justify-between p-3 bg-gray-50 rounded-xl border border-gray-200">
                    <span className="text-gray-800">{bankDetails.branch}</span>
                    <button
                      onClick={() => handleCopy(bankDetails.branch, 'Branch')}
                      className="text-blue-600 hover:text-blue-700 transition-colors"
                    >
                      {copiedField === 'Branch' ? <FaCheck /> : <FaCopy />}
                    </button>
                  </div>
                </div>

                {/* Account Number */}
                <div className="group">
                  <label className="text-sm font-semibold text-gray-600 mb-1 block">Account Number</label>
                  <div className="flex items-center justify-between p-3 bg-gray-50 rounded-xl border border-gray-200">
                    <span className="font-mono text-sm font-bold">{bankDetails.accountNumber}</span>
                    <button
                      onClick={() => handleCopy(bankDetails.accountNumber, 'Account Number')}
                      className="text-blue-600 hover:text-blue-700 transition-colors"
                    >
                      {copiedField === 'Account Number' ? <FaCheck /> : <FaCopy />}
                    </button>
                  </div>
                </div>

                {/* IBAN */}
                <div className="group">
                  <label className="text-sm font-semibold text-gray-600 mb-1 block">IBAN</label>
                  <div className="flex items-center justify-between p-3 bg-gray-50 rounded-xl border border-gray-200">
                    <span className="font-mono text-sm font-bold text-green-700">{bankDetails.iban}</span>
                    <button
                      onClick={() => handleCopy(bankDetails.iban, 'IBAN')}
                      className="text-blue-600 hover:text-blue-700 transition-colors"
                    >
                      {copiedField === 'IBAN' ? <FaCheck /> : <FaCopy />}
                    </button>
                  </div>
                </div>

                {/* Bank Address */}
                <div className="group">
                  <label className="text-sm font-semibold text-gray-600 mb-1 block">Bank Address</label>
                  <div className="flex items-center justify-between p-3 bg-gray-50 rounded-xl border border-gray-200">
                    <span className="text-sm text-gray-800">{bankDetails.bankAddress}</span>
                    <button
                      onClick={() => handleCopy(bankDetails.bankAddress, 'Bank Address')}
                      className="text-blue-600 hover:text-blue-700 transition-colors"
                    >
                      {copiedField === 'Bank Address' ? <FaCheck /> : <FaCopy />}
                    </button>
                  </div>
                </div>

                {/* Important Notes */}
                <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-4 mt-6">
                  <div className="flex items-start gap-3">
                    <div className="text-yellow-600 text-xl">⚠️</div>
                    <div>
                      <h4 className="font-semibold text-yellow-800 mb-1">Important Notes:</h4>
                      <ul className="text-sm text-yellow-700 space-y-1">
                        <li>• Please use your school name as payment reference</li>
                        <li>• Bank transfer may take 1-2 business days</li>
                        <li>• Save your transaction ID for reference</li>
                        <li>• Upload payment screenshot after transfer</li>
                        <li>• Amount should be transferred in PKR</li>
                      </ul>
                    </div>
                  </div>
                </div>

                {/* Support Contact */}
                <div className="bg-green-50 border border-green-200 rounded-xl p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <FaWhatsapp className="text-green-600 text-2xl" />
                      <div>
                        <p className="text-sm text-gray-600">Need help with payment?</p>
                        <p className="font-semibold text-gray-800">Contact our support team</p>
                      </div>
                    </div>
                    <button
                      onClick={openWhatsApp}
                      className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors flex items-center gap-2"
                    >
                      <FaHeadset /> Chat Now
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Payment Submission Section */}
          <div className="space-y-6">
            <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
              <div className="bg-gradient-to-r from-green-600 to-teal-600 p-6 text-white">
                <div className="flex items-center gap-3">
                  <FaFileInvoice className="text-3xl" />
                  <div>
                    <h2 className="text-xl font-bold">Submit Payment Proof</h2>
                    <p className="text-green-100 text-sm">Upload your payment screenshot/confirmation</p>
                  </div>
                </div>
              </div>
              
              <form onSubmit={handleSubmit} className="p-6 space-y-6">
                {/* Payment Method Selection */}
                <div>
                  <label className="text-sm font-semibold text-gray-600 mb-2 block">Payment Method</label>
                  <div className="grid grid-cols-2 gap-3">
                    <button
                      type="button"
                      onClick={() => setPaymentMethod('bank_transfer')}
                      className={`p-3 rounded-xl border-2 transition-all flex items-center justify-center gap-2 ${
                        paymentMethod === 'bank_transfer' 
                          ? 'border-blue-500 bg-blue-50 text-blue-700' 
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      <FaUniversity /> Bank Transfer
                    </button>
                    <button
                      type="button"
                      disabled
                      className="p-3 rounded-xl border-2 border-gray-200 opacity-50 cursor-not-allowed flex items-center justify-center gap-2"
                    >
                      <FaCreditCard /> Credit Card
                    </button>
                  </div>
                </div>

                {/* Transaction Reference Number */}
                <div>
                  <label className="text-sm font-semibold text-gray-600 mb-2 block">
                    Transaction Reference Number *
                  </label>
                  <input
                    type="text"
                    required
                    value={referenceNumber}
                    onChange={(e) => setReferenceNumber(e.target.value)}
                    placeholder="Enter your bank transaction reference number"
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all"
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    You can find this on your bank receipt or online banking
                  </p>
                </div>

                {/* Payment Screenshot Upload */}
                <div>
                  <label className="text-sm font-semibold text-gray-600 mb-2 block">
                    Upload Payment Screenshot/Proof *
                  </label>
                  
                  {!previewUrl ? (
                    <div className="border-2 border-dashed border-gray-300 rounded-xl p-8 text-center hover:border-blue-500 transition-all cursor-pointer"
                         onClick={() => document.getElementById('fileInput').click()}>
                      <FaUpload className="text-gray-400 text-4xl mx-auto mb-3" />
                      <p className="text-gray-600 mb-2">Click to upload or drag and drop</p>
                      <p className="text-xs text-gray-500">PNG, JPG, PDF (Max 5MB)</p>
                      <input
                        id="fileInput"
                        type="file"
                        className="hidden"
                        accept="image/*,application/pdf"
                        onChange={handleFileSelect}
                      />
                    </div>
                  ) : (
                    <div className="relative group">
                      <div className="bg-gray-50 rounded-xl p-4 border-2 border-gray-200">
                        <div className="flex items-center gap-4">
                          {previewUrl && !previewUrl.includes('pdf') ? (
                            <img 
                              src={previewUrl} 
                              alt="Payment proof preview" 
                              className="w-20 h-20 object-cover rounded-lg"
                            />
                          ) : (
                            <div className="w-20 h-20 bg-red-100 rounded-lg flex items-center justify-center">
                              <FaFileInvoice className="text-red-600 text-3xl" />
                            </div>
                          )}
                          <div className="flex-1">
                            <p className="font-semibold text-gray-800">{selectedFile?.name}</p>
                            <p className="text-xs text-gray-500">
                              {(selectedFile?.size / 1024 / 1024).toFixed(2)} MB
                            </p>
                          </div>
                          <div className="flex gap-2">
                            <button
                              type="button"
                              onClick={() => previewUrl && !previewUrl.includes('pdf') && window.open(previewUrl, '_blank')}
                              className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                              title="Preview"
                            >
                              <FaEye />
                            </button>
                            <button
                              type="button"
                              onClick={handleRemoveFile}
                              className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                              title="Remove"
                            >
                              <FaTimes />
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={submitLoading || !referenceNumber || !selectedFile}
                  className="w-full py-3 bg-gradient-to-r from-green-600 to-teal-600 text-white rounded-xl hover:shadow-lg transition-all font-semibold disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  {submitLoading ? (
                    <>
                      <FaSpinner className="animate-spin" /> Submitting...
                    </>
                  ) : (
                    <>
                      <FaCheck /> Submit Payment Proof
                    </>
                  )}
                </button>

                {/* Security Note */}
                <div className="flex items-center justify-center gap-2 text-xs text-gray-500">
                  <FaShieldAlt className="text-green-600" />
                  <span>Your payment information is secure and encrypted</span>
                </div>
              </form>
            </div>

            {/* Payment Summary */}
            <div className="bg-white rounded-2xl shadow-lg p-6">
              <h3 className="font-semibold text-gray-800 mb-4 flex items-center gap-2">
                <FaMoneyBillWave className="text-green-600" /> Payment Summary
              </h3>
              <div className="space-y-3">
                <div className="flex justify-between items-center pb-2 border-b">
                  <span className="text-gray-600">Membership Plan</span>
                  <span className="font-semibold">{selectedPlan.planName}</span>
                </div>
                <div className="flex justify-between items-center pb-2 border-b">
                  <span className="text-gray-600">Duration</span>
                  <span className="font-semibold capitalize">{selectedPlan.duration}</span>
                </div>
                <div className="flex justify-between items-center pb-2 border-b">
                  <span className="text-gray-600">Amount to Pay</span>
                  <span className="text-2xl font-bold text-green-600">
                    {selectedPlan.currency} {selectedPlan.amount.toLocaleString()}
                  </span>
                </div>
                <div className="flex justify-between items-center pt-2">
                  <span className="text-gray-600">Status</span>
                  <span className="text-yellow-600 flex items-center gap-1">
                    <FaClock /> Awaiting Payment
                  </span>
                </div>
              </div>
              
              {/* Amount in Words */}
              <div className="mt-4 p-3 bg-gray-50 rounded-lg">
                <p className="text-xs text-gray-500">Amount in Words:</p>
                <p className="text-sm font-semibold text-gray-700">
                  {selectedPlan.amount === 290 ? 'Two Hundred Ninety' : 
                   selectedPlan.amount === 790 ? 'Seven Hundred Ninety' : 
                   selectedPlan.amount === 1990 ? 'One Thousand Nine Hundred Ninety' :
                   'Amount'} {selectedPlan.currency}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BillingDetails;