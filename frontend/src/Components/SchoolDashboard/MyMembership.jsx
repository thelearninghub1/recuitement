import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  FaCheck, 
  FaTimes, 
  FaArrowLeft,
  FaClock,
  FaCalendarAlt,
  FaDownload,
  FaEye,
  FaFileInvoice,
  FaCreditCard,
  FaUniversity,
  FaCheckCircle,
  FaExclamationTriangle,
  FaSpinner,
  FaChartLine,
  FaUsers,
  FaBriefcase,
  FaCrown,
  FaStar,
  FaInfoCircle,
  FaPrint,
  FaEnvelope
} from 'react-icons/fa';
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import { 
  getMySubscription, 
  checkCanPostJob,
  clearSubscriptionErrors 
} from '../../actions/subscriptionActions';

const MyMembership = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  
  // Redux Selectors
  const { 
    subscription, 
    usageStats: subscriptionUsage, 
    paymentHistory: subscriptionPayments, 
    loading, 
    error 
  } = useSelector((state) => state.getMySubscription);
  
  const { 
    canPost, 
    remainingJobs: canPostRemainingJobs, 
    reason: cannotPostReason,
    loading: checkLoading 
  } = useSelector((state) => state.checkCanPostJob);
  
  const [selectedReceipt, setSelectedReceipt] = useState(null);
  const [showReceiptModal, setShowReceiptModal] = useState(false);
  const [localUsageStats, setLocalUsageStats] = useState({
    jobsPosted: 0,
    cvsDownloaded: 0,
    remainingJobs: 0,
    remainingCvs: 0,
    totalJobsLimit: 0,
    totalCvsLimit: 0,
    jobsThisMonth: 0,
    cvsThisMonth: 0
  });

  // Fetch membership data on component mount
  useEffect(() => {
    fetchMembershipData();
  }, []);

  // Update local stats when Redux data changes
  useEffect(() => {
    if (subscriptionUsage) {
      setLocalUsageStats({
        jobsPosted: subscriptionUsage.jobsPosted || 0,
        cvsDownloaded: subscriptionUsage.cvsDownloaded || 0,
        remainingJobs: subscriptionUsage.remainingJobs || 0,
        remainingCvs: subscriptionUsage.remainingCvs || 0,
        totalJobsLimit: subscriptionUsage.totalJobsLimit || 0,
        totalCvsLimit: subscriptionUsage.totalCvsLimit || 0,
        jobsThisMonth: subscriptionUsage.jobsThisMonth || 0,
        cvsThisMonth: subscriptionUsage.cvsThisMonth || 0
      });
    }
  }, [subscriptionUsage]);

  // Handle errors
  useEffect(() => {
    if (error) {
      toast.error(error);
      setTimeout(() => dispatch(clearSubscriptionErrors()), 3000);
    }
  }, [error, dispatch]);

  const fetchMembershipData = async () => {
    await dispatch(getMySubscription());
    await dispatch(checkCanPostJob());
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const formatDateTime = (dateString) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getDaysRemaining = () => {
    if (!subscription || !subscription.endDate) return 0;
    const end = new Date(subscription.endDate);
    const now = new Date();
    const diffTime = end - now;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays > 0 ? diffDays : 0;
  };

  const getStatusBadge = (status) => {
    switch(status) {
      case 'active':
        return { color: 'bg-green-100 text-green-800', icon: FaCheckCircle, text: 'Active' };
      case 'expired':
        return { color: 'bg-red-100 text-red-800', icon: FaTimes, text: 'Expired' };
      case 'pending':
        return { color: 'bg-yellow-100 text-yellow-800', icon: FaClock, text: 'Pending' };
      default:
        return { color: 'bg-gray-100 text-gray-800', icon: FaInfoCircle, text: status };
    }
  };

  const handleViewReceipt = (payment) => {
    setSelectedReceipt(payment);
    setShowReceiptModal(true);
  };

  const handleDownloadReceipt = () => {
    toast.success('Receipt downloaded successfully!');
  };

  const handlePrintReceipt = () => {
    window.print();
  };

  const handleEmailReceipt = () => {
    toast.info('Receipt sent to your email!');
  };

  // Transform payment data for display
  const transformPayment = (payment) => ({
    id: payment._id,
    transactionId: payment.transactionId,
    amount: payment.amount,
    currency: payment.currency,
    status: payment.status,
    paymentMethod: payment.paymentMethod === 'bank_transfer' ? 'Bank Transfer' : 'Credit Card',
    date: payment.createdAt,
    receipt: payment.screenshotUrl,
    bankName: payment.bankName || 'BANK AL HABIB LIMITED',
    accountTitle: 'THE LEARNING HUB',
    reference: payment.referenceNumber
  });

  // Transform subscription data for display
  const transformSubscription = () => {
    if (!subscription) return null;
    
    return {
      id: subscription.id,
      planName: subscription.planName,
      status: subscription.status,
      startDate: subscription.startDate,
      endDate: subscription.endDate,
      amount: subscription.amount || 0,
      currency: subscription.currency || 'SAR',
      duration: subscription.duration,
      features: subscription.features || [],
      autoRenew: subscription.autoRenew,
      paymentMethod: 'Bank Transfer',
      lastPaymentDate: subscriptionPayments?.[0]?.createdAt || null,
      nextPaymentDate: subscription.endDate
    };
  };

  const membership = transformSubscription();
  const paymentHistory = subscriptionPayments?.map(transformPayment) || [];
  const daysRemaining = getDaysRemaining();
  const StatusBadge = membership ? getStatusBadge(membership.status) : null;

  if (loading && !subscription) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="text-center">
          <FaSpinner className="animate-spin text-4xl text-blue-600 mx-auto mb-4" />
          <p className="text-gray-600">Loading membership details...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen mt-30 bg-gradient-to-br from-gray-50 to-blue-50">
      {/* Header */}
      <div className="bg-white shadow-lg sticky top-0 z-20">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center gap-4">
            <button
              onClick={() => navigate('/school-profile')}
              className="flex items-center gap-2 px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <FaArrowLeft /> Back to Dashboard
            </button>
            <div>
              <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                My Membership
              </h1>
              <p className="text-gray-600">View and manage your subscription</p>
            </div>
            <button
              onClick={fetchMembershipData}
              className="ml-auto px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
            >
              <FaSpinner className={loading ? "animate-spin" : ""} /> Refresh
            </button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* No Subscription Message */}
        {!subscription && (
          <div className="bg-yellow-50 border border-yellow-200 rounded-2xl p-8 text-center mb-8">
            <FaExclamationTriangle className="text-yellow-500 text-5xl mx-auto mb-4" />
            <h2 className="text-xl font-bold text-yellow-800 mb-2">No Active Subscription</h2>
            <p className="text-yellow-700 mb-4">You don't have an active membership plan.</p>
            <button
              onClick={() => navigate('/membership-plans')}
              className="px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl hover:shadow-lg transition-all font-semibold"
            >
              Purchase a Plan
            </button>
          </div>
        )}

        {membership && (
          <>
            {/* Current Membership Card */}
            <div className="bg-white rounded-2xl shadow-lg overflow-hidden mb-8">
              <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-6 text-white">
                <div className="flex justify-between items-start">
                  <div>
                    <h2 className="text-2xl font-bold">Current Membership</h2>
                    <p className="text-blue-100">Your active subscription details</p>
                  </div>
                </div>
              </div>
              
              <div className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
                  <div className="bg-blue-50 rounded-xl p-4">
                    <p className="text-sm text-gray-600 mb-1">Plan Name</p>
                    <p className="text-xl font-bold text-gray-800">{membership.planName}</p>
                  </div>
                  <div className="bg-green-50 rounded-xl p-4">
                    <p className="text-sm text-gray-600 mb-1">Status</p>
                    {StatusBadge && (
                      <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-sm font-semibold ${StatusBadge.color}`}>
                        {React.createElement(StatusBadge.icon, { className: "text-sm" })} {StatusBadge.text}
                      </span>
                    )}
                  </div>
                  <div className="bg-purple-50 rounded-xl p-4">
                    <p className="text-sm text-gray-600 mb-1">Valid Until</p>
                    <p className="text-lg font-semibold text-gray-800">{formatDate(membership.endDate)}</p>
                    {daysRemaining > 0 && (
                      <p className="text-xs text-gray-500 mt-1">{daysRemaining} days remaining</p>
                    )}
                  </div>
                  <div className="bg-amber-50 rounded-xl p-4">
                    <p className="text-sm text-gray-600 mb-1">Amount Paid</p>
                    <p className="text-xl font-bold text-gray-800">{membership.currency} {membership.amount?.toLocaleString() || 'N/A'}</p>
                    <p className="text-xs text-gray-500 capitalize">{membership.duration}</p>
                  </div>
                </div>

                {/* Features List */}
                <div className="border-t pt-6">
                  <h3 className="font-semibold text-gray-800 mb-3 flex items-center gap-2">
                    <FaCrown className="text-yellow-500" /> Plan Features
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {membership.features.map((feature, index) => (
                      <div key={index} className="flex items-start gap-2">
                        <FaCheck className="text-green-500 mt-0.5 flex-shrink-0" />
                        <span className="text-sm text-gray-600">{feature}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Auto-renewal Info */}
                <div className="border-t pt-6 mt-4">
                  <div className="flex justify-between items-center">
                    <div className="flex items-center gap-2">
                      <FaClock className="text-gray-400" />
                      <span className="text-sm text-gray-600">Auto-renewal:</span>
                      <span className={`text-sm font-semibold ${membership.autoRenew ? 'text-green-600' : 'text-red-600'}`}>
                        {membership.autoRenew ? 'Enabled' : 'Disabled'}
                      </span>
                    </div>
                    <div className="text-sm text-gray-500">
                      Last payment: {membership.lastPaymentDate ? formatDate(membership.lastPaymentDate) : 'N/A'}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Usage Statistics */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
              {/* Job Posting Stats */}
              <div className="bg-white rounded-2xl shadow-lg p-6">
                <h3 className="font-semibold text-gray-800 mb-4 flex items-center gap-2">
                  <FaBriefcase className="text-blue-600" /> Job Posting Usage
                </h3>
                <div className="space-y-4">
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span className="text-gray-600">Jobs Posted</span>
                      <span className="font-semibold">
                        {checkLoading ? '...' : `${localUsageStats.jobsPosted} / ${localUsageStats.totalJobsLimit}`}
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-blue-600 rounded-full h-2 transition-all"
                        style={{ width: `${(localUsageStats.jobsPosted / (localUsageStats.totalJobsLimit || 1)) * 100}%` }}
                      ></div>
                    </div>
                    <p className="text-xs text-gray-500 mt-1">
                      {checkLoading ? 'Checking...' : `${localUsageStats.remainingJobs} jobs remaining`}
                    </p>
                  </div>
                  <div className="bg-blue-50 rounded-xl p-3">
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">Jobs Posted This Month</span>
                      <span className="font-bold text-blue-600">{localUsageStats.jobsThisMonth}</span>
                    </div>
                  </div>
                  
                  {/* Can Post Job Status */}
                  <div className={`rounded-xl p-3 ${canPost ? 'bg-green-50' : 'bg-red-50'}`}>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600">Can Post New Job?</span>
                      {checkLoading ? (
                        <FaSpinner className="animate-spin text-blue-600" />
                      ) : canPost ? (
                        <span className="text-green-600 font-semibold flex items-center gap-1">
                          <FaCheckCircle /> Yes ({localUsageStats.remainingJobs} remaining)
                        </span>
                      ) : (
                        <span className="text-red-600 font-semibold flex items-center gap-1">
                          <FaTimes /> {cannotPostReason || 'No'}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              {/* CV Download Stats */}
              <div className="bg-white rounded-2xl shadow-lg p-6">
                <h3 className="font-semibold text-gray-800 mb-4 flex items-center gap-2">
                  <FaDownload className="text-purple-600" /> CV Download Usage
                </h3>
                <div className="space-y-4">
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span className="text-gray-600">CVs Downloaded</span>
                      <span className="font-semibold">
                        {localUsageStats.cvsDownloaded} / {localUsageStats.totalCvsLimit}
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-purple-600 rounded-full h-2 transition-all"
                        style={{ width: `${(localUsageStats.cvsDownloaded / (localUsageStats.totalCvsLimit || 1)) * 100}%` }}
                      ></div>
                    </div>
                    <p className="text-xs text-gray-500 mt-1">{localUsageStats.remainingCvs} CVs remaining this month</p>
                  </div>
                  <div className="bg-purple-50 rounded-xl p-3">
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">CVs Downloaded This Month</span>
                      <span className="font-bold text-purple-600">{localUsageStats.cvsThisMonth}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Payment History */}
            <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
              <div className="px-6 py-4 bg-gradient-to-r from-gray-50 to-blue-50 border-b">
                <h3 className="font-semibold text-gray-800 flex items-center gap-2">
                  <FaFileInvoice className="text-green-600" /> Payment History
                </h3>
              </div>
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Transaction ID</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Amount</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Method</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Receipt</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {paymentHistory.map((payment) => (
                      <tr key={payment.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-mono text-gray-900">
                          {payment.transactionId}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {formatDate(payment.date)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-gray-900">
                          {payment.currency} {payment.amount.toLocaleString()}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          <div className="flex items-center gap-1">
                            {payment.paymentMethod === 'Bank Transfer' ? <FaUniversity /> : <FaCreditCard />}
                            {payment.paymentMethod}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`px-2 py-1 text-xs rounded-full ${
                            payment.status === 'approved' 
                              ? 'bg-green-100 text-green-800' 
                              : 'bg-yellow-100 text-yellow-800'
                          }`}>
                            {payment.status === 'approved' ? 'Approved' : 'Pending'}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm">
                          <button
                            onClick={() => handleViewReceipt(payment)}
                            className="text-blue-600 hover:text-blue-800 flex items-center gap-1"
                          >
                            <FaEye size={14} /> View
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              {paymentHistory.length === 0 && (
                <div className="text-center py-8">
                  <p className="text-gray-500">No payment history found</p>
                </div>
              )}
            </div>

            {/* Support Section */}
            <div className="mt-8 bg-gradient-to-r from-blue-50 to-purple-50 rounded-2xl p-6">
              <div className="flex flex-col md:flex-row justify-between items-center gap-4">
                <div>
                  <h3 className="font-semibold text-gray-800 mb-1">Need assistance with your membership?</h3>
                  <p className="text-sm text-gray-600">Contact our support team for any questions or issues</p>
                </div>
                <button
                  onClick={() => window.open('mailto:support@recruitify.com')}
                  className="px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl hover:shadow-lg transition-all font-semibold"
                >
                  Contact Support
                </button>
              </div>
            </div>
          </>
        )}
      </div>

      {/* Receipt Modal */}
      {showReceiptModal && selectedReceipt && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4" style={{ 
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(0, 0, 0, 0.6)',
          backdropFilter: 'blur(8px)',
          zIndex: 9999
        }}>
          <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto" style={{ position: 'relative', zIndex: 10000 }}>
            <div className="sticky top-0 bg-gradient-to-r from-green-600 to-teal-600 p-6 text-white rounded-t-2xl">
              <div className="flex justify-between items-start">
                <div>
                  <h2 className="text-2xl font-bold">Payment Receipt</h2>
                  <p className="text-green-100">Transaction ID: {selectedReceipt.transactionId}</p>
                </div>
                <button
                  onClick={() => setShowReceiptModal(false)}
                  className="text-white hover:text-gray-200 text-2xl"
                >
                  ×
                </button>
              </div>
            </div>

            <div className="p-6">
              {/* Receipt Content */}
              <div className="border-2 border-gray-200 rounded-xl p-6 mb-6" id="receipt-content">
                {/* Header */}
                <div className="text-center mb-6">
                  <div className="w-16 h-16 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-3">
                    <FaFileInvoice className="text-white text-2xl" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-800">Payment Receipt</h3>
                  <p className="text-gray-500">Official Payment Confirmation</p>
                </div>

                {/* Receipt Details */}
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4 pb-4 border-b">
                    <div>
                      <p className="text-xs text-gray-500">Receipt Number</p>
                      <p className="font-semibold text-gray-800">{selectedReceipt.id}</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500">Date</p>
                      <p className="font-semibold text-gray-800">{formatDateTime(selectedReceipt.date)}</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4 pb-4 border-b">
                    <div>
                      <p className="text-xs text-gray-500">Transaction ID</p>
                      <p className="font-mono text-sm text-gray-800">{selectedReceipt.transactionId}</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500">Reference Number</p>
                      <p className="font-mono text-sm text-gray-800">{selectedReceipt.reference}</p>
                    </div>
                  </div>

                  <div className="pb-4 border-b">
                    <p className="text-xs text-gray-500">Bank Details</p>
                    <p className="text-sm text-gray-800">Bank: {selectedReceipt.bankName}</p>
                    <p className="text-sm text-gray-800">Account: {selectedReceipt.accountTitle}</p>
                  </div>

                  <div className="grid grid-cols-2 gap-4 pb-4 border-b">
                    <div>
                      <p className="text-xs text-gray-500">Payment Method</p>
                      <p className="text-sm text-gray-800">{selectedReceipt.paymentMethod}</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500">Status</p>
                      <span className="inline-flex items-center gap-1 px-2 py-1 bg-green-100 text-green-800 rounded-full text-xs">
                        <FaCheckCircle /> Approved
                      </span>
                    </div>
                  </div>

                  <div className="pb-4">
                    <div className="flex justify-between items-center">
                      <p className="text-sm font-semibold text-gray-600">Total Amount Paid</p>
                      <p className="text-2xl font-bold text-green-600">
                        {selectedReceipt.currency} {selectedReceipt.amount.toLocaleString()}
                      </p>
                    </div>
                  </div>

                  <div className="bg-gray-50 rounded-lg p-4 text-center">
                    <p className="text-xs text-gray-500">Thank you for your payment!</p>
                    <p className="text-xs text-gray-500">This is an electronically generated receipt.</p>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-3 justify-end">
               
                <button
                  onClick={handlePrintReceipt}
                  className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors flex items-center gap-2"
                >
                  <FaPrint /> Print
                </button>
               
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MyMembership;