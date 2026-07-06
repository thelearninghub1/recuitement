import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  FaCheck, FaTimes, FaEye, FaFilter, FaSearch, FaSpinner, FaArrowLeft,
  FaDollarSign, FaCreditCard, FaCalendarAlt, FaClock, FaUserCheck, FaUserTimes,
  FaReceipt, FaChartLine, FaWallet, FaMoneyBillWave, FaUniversity, FaImage,
  FaDownload, FaPrint, FaEnvelope, FaBan, FaCheckCircle, FaExclamationTriangle,
  FaFileInvoice, FaMobile, FaBuilding, FaSync, FaTimesCircle, FaCommentDots
} from 'react-icons/fa';
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import { 
  getAllPayments, approvePayment, denyPayment, getPaymentStats, clearPaymentErrors
} from '../../actions/paymentActions';
import { APPROVE_PAYMENT_RESET, DENY_PAYMENT_RESET } from '../../constants/paymentConstants';

const PaymentDashboard = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  // Redux state
  const getAllPaymentsState = useSelector((state) => state.getAllPayments);
  const { loading: paymentsLoading, payments = [], error: paymentsError } = getAllPaymentsState;
  const getPaymentStatsState = useSelector((state) => state.getPaymentStats);
  const { loading: statsLoading, stats = {}, error: statsError } = getPaymentStatsState;
  const approvePaymentState = useSelector((state) => state.approvePayment);
  const { loading: approveLoading, success: approveSuccess, error: approveError } = approvePaymentState;
  const denyPaymentState = useSelector((state) => state.denyPayment);
  const { loading: denyLoading, success: denySuccess, error: denyError } = denyPaymentState;

  // Local state
  const [filteredPayments, setFilteredPayments] = useState([]);
  const [selectedPayment, setSelectedPayment] = useState(null);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [showImageModal, setShowImageModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [processingId, setProcessingId] = useState(null);
  const [showApproveModal, setShowApproveModal] = useState(false);
  const [showDenyModal, setShowDenyModal] = useState(false);
  const [approveNotes, setApproveNotes] = useState('');
  const [denyReason, setDenyReason] = useState('');
  const [denyNotes, setDenyNotes] = useState('');
  const [pendingPayment, setPendingPayment] = useState(null);

  // Image preview states (authenticated fetch)
  const [imageBlobUrl, setImageBlobUrl] = useState(null);
  const [fullScreenBlobUrl, setFullScreenBlobUrl] = useState(null);
  const [imageLoading, setImageLoading] = useState(false);
  const [imageError, setImageError] = useState(false);

  // Helper: get full image URL
  const getFullImageUrl = (url) => {
    if (!url) return null;
    if (url.startsWith('http')) return url;
   //return `http://localhost:5000/uploads/payments/${url}`;
     return `/uploads/payments/${url}`;
  };

  // Load image with authentication (for modal preview)
  const loadImageWithAuth = async (url) => {
    if (!url) return;
    setImageLoading(true);
    setImageError(false);
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(url, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (!response.ok) throw new Error(`HTTP ${response.status}`);
      const blob = await response.blob();
      const objectUrl = URL.createObjectURL(blob);
      setImageBlobUrl(objectUrl);
    } catch (err) {
      console.error('Image load error:', err);
      setImageError(true);
    } finally {
      setImageLoading(false);
    }
  };

  // Open full-screen image modal with authentication
  const viewFullScreenImage = async (url) => {
    if (!url) return;
    setShowImageModal(true);
    setImageLoading(true);
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(url, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (!response.ok) throw new Error('Failed to load image');
      const blob = await response.blob();
      const objectUrl = URL.createObjectURL(blob);
      setFullScreenBlobUrl(objectUrl);
    } catch (error) {
      console.error('Full screen image load error:', error);
      toast.error('Could not load full-size image');
      setShowImageModal(false);
    } finally {
      setImageLoading(false);
    }
  };

  // Download image directly using blob (already fetched or fetch again)
  const downloadImage = (url, filename = 'payment-screenshot.jpg') => {
    fetch(url, {
      headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
    })
      .then(res => res.blob())
      .then(blob => {
        const link = document.createElement('a');
        const objectUrl = URL.createObjectURL(blob);
        link.href = objectUrl;
        link.download = filename;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(objectUrl);
      })
      .catch(() => toast.error('Failed to download image'));
  };

  // Open payment details modal and load screenshot
  const viewPaymentDetails = (payment) => {
    setSelectedPayment(payment);
    setShowPaymentModal(true);
    if (imageBlobUrl) URL.revokeObjectURL(imageBlobUrl);
    setImageBlobUrl(null);
    loadImageWithAuth(getFullImageUrl(payment.screenshotUrl));
  };

  // Clean up blob URLs on unmount
  useEffect(() => {
    return () => {
      if (imageBlobUrl) URL.revokeObjectURL(imageBlobUrl);
      if (fullScreenBlobUrl) URL.revokeObjectURL(fullScreenBlobUrl);
    };
  }, [imageBlobUrl, fullScreenBlobUrl]);

  // Lock body scroll when modals open
  useEffect(() => {
    if (showPaymentModal || showImageModal || showApproveModal || showDenyModal) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => { document.body.style.overflow = 'unset'; };
  }, [showPaymentModal, showImageModal, showApproveModal, showDenyModal]);

  // Initial load
  useEffect(() => {
    fetchPayments();
    fetchStats();
  }, []);

  // Handle approve/deny success/error
  useEffect(() => {
    if (approveSuccess) {
      toast.success('Payment approved successfully!');
      dispatch({ type: APPROVE_PAYMENT_RESET });
      fetchPayments();
      fetchStats();
      setShowPaymentModal(false);
      setShowApproveModal(false);
      setProcessingId(null);
      setPendingPayment(null);
      setApproveNotes('');
    }
    if (approveError) {
      toast.error(approveError);
      setTimeout(() => dispatch(clearPaymentErrors()), 3000);
      setProcessingId(null);
    }
  }, [approveSuccess, approveError, dispatch]);

  useEffect(() => {
    if (denySuccess) {
      toast.warning('Payment denied successfully!');
      dispatch({ type: DENY_PAYMENT_RESET });
      fetchPayments();
      fetchStats();
      setShowPaymentModal(false);
      setShowDenyModal(false);
      setProcessingId(null);
      setPendingPayment(null);
      setDenyReason('');
      setDenyNotes('');
    }
    if (denyError) {
      toast.error(denyError);
      setTimeout(() => dispatch(clearPaymentErrors()), 3000);
      setProcessingId(null);
    }
  }, [denySuccess, denyError, dispatch]);

  useEffect(() => {
    if (paymentsError) toast.error(paymentsError);
    if (statsError) toast.error(statsError);
    if (paymentsError || statsError) setTimeout(() => dispatch(clearPaymentErrors()), 3000);
  }, [paymentsError, statsError, dispatch]);

  // Filter payments
  useEffect(() => {
    if (payments && Array.isArray(payments)) {
      let filtered = [...payments];
      if (searchTerm) {
        filtered = filtered.filter(p => 
          p.schoolName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          p.transactionId?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          p.schoolEmail?.toLowerCase().includes(searchTerm.toLowerCase())
        );
      }
      if (statusFilter !== 'all') filtered = filtered.filter(p => p.status === statusFilter);
      setFilteredPayments(filtered);
    }
  }, [payments, searchTerm, statusFilter]);

  const fetchPayments = () => {
    const status = statusFilter !== 'all' ? statusFilter : '';
    dispatch(getAllPayments(1, 50, status, searchTerm));
  };
  const fetchStats = () => dispatch(getPaymentStats());

  const openApproveModal = (payment) => {
    setPendingPayment(payment);
    setApproveNotes('Payment verified and approved');
    setShowApproveModal(true);
    setShowPaymentModal(false);
  };
  const openDenyModal = (payment) => {
    setPendingPayment(payment);
    setDenyReason('Invalid payment proof provided');
    setDenyNotes('');
    setShowDenyModal(true);
    setShowPaymentModal(false);
  };
  const handleConfirmApprove = () => {
    if (pendingPayment) {
      setProcessingId(pendingPayment._id);
      dispatch(approvePayment(pendingPayment._id, approveNotes));
    }
  };
  const handleConfirmDeny = () => {
    if (!denyReason.trim()) {
      toast.error('Please provide a reason for denying this payment');
      return;
    }
    if (pendingPayment) {
      setProcessingId(pendingPayment._id);
      dispatch(denyPayment(pendingPayment._id, denyReason, denyNotes));
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric', month: 'short', day: 'numeric',
      hour: '2-digit', minute: '2-digit'
    });
  };

  const getStatusBadge = (status) => {
    switch(status) {
      case 'approved': return { color: 'bg-green-100 text-green-800', icon: FaCheckCircle, text: 'Approved' };
      case 'denied': return { color: 'bg-red-100 text-red-800', icon: FaTimesCircle, text: 'Denied' };
      default: return { color: 'bg-yellow-100 text-yellow-800', icon: FaClock, text: 'Pending' };
    }
  };

  const getPaymentMethodIcon = (method) => {
    switch(method) {
      case 'credit_card': return <FaCreditCard className="text-blue-600" />;
      case 'bank_transfer': return <FaUniversity className="text-green-600" />;
      case 'apple_pay': return <FaMobile className="text-gray-700" />;
      case 'google_pay': return <FaMobile className="text-blue-500" />;
      default: return <FaWallet className="text-purple-600" />;
    }
  };

  const transformPayment = (payment) => ({
    id: payment._id,
    _id: payment._id,
    transactionId: payment.transactionId,
    schoolName: payment.schoolName,
    schoolEmail: payment.schoolEmail,
    schoolCity: payment.schoolCity || 'N/A',
    schoolPhone: payment.schoolPhone || 'N/A',
    planName: payment.planName,
    amount: payment.amount,
    currency: payment.currency,
    duration: payment.duration,
    features: payment.planFeatures || 'No features listed',
    paymentMethod: payment.paymentMethod,
    status: payment.status,
    screenshotUrl: getFullImageUrl(payment.screenshotUrl),
    createdAt: payment.createdAt,
    approvedBy: payment.reviewedBy?.profile?.firstName + ' ' + payment.reviewedBy?.profile?.lastName || 
                payment.reviewedBy?.firstName || 'Admin',
    approvedAt: payment.approvedAt,
    deniedReason: payment.denialReason,
    notes: payment.adminNotes || payment.denialReason || 'Awaiting verification',
    cardLast4: payment.cardLast4,
    bankName: payment.bankName,
    bankReference: payment.bankReference
  });

  const isLoading = paymentsLoading || statsLoading || approveLoading || denyLoading;

  if (paymentsLoading && !payments?.length) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="text-center">
          <FaSpinner className="animate-spin text-4xl text-blue-600 mx-auto mb-4" />
          <p className="text-gray-600">Loading payments...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-20 md:pt-24 lg:pt-28 bg-gradient-to-br from-gray-50 to-blue-50">
      {/* Header */}
      <div className="bg-white shadow-lg sticky top-0 z-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div className="flex flex-wrap items-center gap-4">
              <button
                onClick={() => navigate('/system-admin-dashboard')}
                className="flex items-center gap-2 px-3 py-2 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors text-sm md:text-base"
              >
                <FaArrowLeft /> Back
              </button>
              <div>
                <h1 className="text-xl sm:text-2xl md:text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                  Payment Approval
                </h1>
                <p className="text-gray-600 text-xs sm:text-sm">Manage school membership payments</p>
              </div>
            </div>
            <button
              onClick={() => { fetchPayments(); fetchStats(); }}
              disabled={isLoading}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2 disabled:opacity-50 text-sm"
            >
              {isLoading ? <FaSpinner className="animate-spin" /> : <FaSync />} Refresh
            </button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 md:py-8">
        {/* Statistics Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 md:gap-6 mb-8">
          <StatCard title="Total Payments" value={stats.total || 0} icon={<FaReceipt className="text-blue-500" />} color="blue" />
          <StatCard title="Pending" value={stats.pending || 0} icon={<FaClock className="text-yellow-500" />} color="yellow" />
          <StatCard title="Approved" value={stats.approved || 0} icon={<FaCheckCircle className="text-green-500" />} color="green" />
          <StatCard title="Denied" value={stats.denied || 0} icon={<FaTimesCircle className="text-red-500" />} color="red" />
          <StatCard title="Total Amount" value={`${(stats.totalAmount || 0).toLocaleString()} SAR`} icon={<FaDollarSign className="text-purple-500" />} color="purple" />
        </div>

        {/* Search and Filters */}
        <div className="bg-white rounded-2xl shadow-lg p-4 sm:p-6 mb-8">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <FaSearch className="absolute left-3 top-3 text-gray-400" />
              <input
                type="text"
                placeholder="Search by school, transaction ID or email..."
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <div className="relative w-full sm:w-48">
              <FaFilter className="absolute left-3 top-3 text-gray-400" />
              <select
                className="w-full pl-10 pr-8 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 appearance-none bg-white"
                value={statusFilter}
                onChange={(e) => {
                  setStatusFilter(e.target.value);
                  dispatch(getAllPayments(1, 50, e.target.value !== 'all' ? e.target.value : '', searchTerm));
                }}
              >
                <option value="all">All Status</option>
                <option value="pending">Pending</option>
                <option value="approved">Approved</option>
                <option value="denied">Denied</option>
              </select>
            </div>
          </div>
        </div>

        {/* Payments List */}
        <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
          {/* Desktop Table */}
          <div className="hidden md:block overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gradient-to-r from-gray-50 to-blue-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Transaction</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase">School</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Plan</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Amount</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Date</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Status</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {filteredPayments.map((payment) => {
                  const dp = transformPayment(payment);
                  const badge = getStatusBadge(dp.status);
                  return (
                    <tr key={dp.id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">{dp.transactionId}</div>
                        <div className="text-xs text-gray-500">{dp.paymentMethod?.replace('_', ' ').toUpperCase()}</div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm font-medium text-gray-900">{dp.schoolName}</div>
                        <div className="text-xs text-gray-500">{dp.schoolCity}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">{dp.planName}</div>
                        <div className="text-xs text-gray-500">{dp.duration}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-bold text-gray-900">{dp.currency} {dp.amount}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{formatDate(dp.createdAt)}</td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold ${badge.color}`}>
                          <badge.icon className="text-xs" /> {badge.text}
                        </span>
                       </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex gap-3">
                          <button onClick={() => viewPaymentDetails(dp)} className="text-blue-600 hover:text-blue-800" title="View Details">
                            <FaEye size={18} />
                          </button>
                          {dp.status === 'pending' && (
                            <>
                              <button onClick={() => openApproveModal(dp)} disabled={processingId === dp.id && approveLoading} className="text-green-600 hover:text-green-800 disabled:opacity-50" title="Approve">
                                {(processingId === dp.id && approveLoading) ? <FaSpinner className="animate-spin" /> : <FaCheck size={18} />}
                              </button>
                              <button onClick={() => openDenyModal(dp)} disabled={processingId === dp.id && denyLoading} className="text-red-600 hover:text-red-800 disabled:opacity-50" title="Deny">
                                {(processingId === dp.id && denyLoading) ? <FaSpinner className="animate-spin" /> : <FaTimes size={18} />}
                              </button>
                            </>
                          )}
                        </div>
                       </td>
                     </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* Mobile Card View */}
          <div className="block md:hidden divide-y divide-gray-200">
            {filteredPayments.map((payment) => {
              const dp = transformPayment(payment);
              const badge = getStatusBadge(dp.status);
              return (
                <div key={dp.id} className="p-4 hover:bg-gray-50 transition-colors">
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <div className="font-bold text-gray-900">{dp.schoolName}</div>
                      <div className="text-xs text-gray-500">{dp.schoolCity}</div>
                    </div>
                    <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-semibold ${badge.color}`}>
                      <badge.icon className="text-xs" /> {badge.text}
                    </span>
                  </div>
                  <div className="grid grid-cols-2 gap-2 text-sm mt-2">
                    <div><span className="text-gray-500">Transaction:</span> {dp.transactionId}</div>
                    <div><span className="text-gray-500">Plan:</span> {dp.planName} ({dp.duration})</div>
                    <div><span className="text-gray-500">Amount:</span> {dp.currency} {dp.amount}</div>
                    <div><span className="text-gray-500">Date:</span> {formatDate(dp.createdAt)}</div>
                    <div><span className="text-gray-500">Method:</span> {dp.paymentMethod?.replace('_', ' ').toUpperCase()}</div>
                  </div>
                  <div className="flex gap-4 mt-3 pt-2 border-t border-gray-100">
                    <button onClick={() => viewPaymentDetails(dp)} className="text-blue-600 text-sm flex items-center gap-1"><FaEye /> Details</button>
                    {dp.status === 'pending' && (
                      <>
                        <button onClick={() => openApproveModal(dp)} className="text-green-600 text-sm flex items-center gap-1"><FaCheck /> Approve</button>
                        <button onClick={() => openDenyModal(dp)} className="text-red-600 text-sm flex items-center gap-1"><FaTimes /> Deny</button>
                      </>
                    )}
                  </div>
                </div>
              );
            })}
          </div>

          {filteredPayments.length === 0 && !paymentsLoading && (
            <div className="text-center py-12">
              <FaReceipt className="text-gray-300 text-6xl mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-600 mb-2">No Payments Found</h3>
              <p className="text-gray-500">No payments match your search criteria.</p>
            </div>
          )}
        </div>
      </div>

      {/* Approve Modal */}
      {showApproveModal && pendingPayment && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-black/50" onClick={(e) => e.target === e.currentTarget && setShowApproveModal(false)}>
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full">
            <div className="bg-gradient-to-r from-green-600 to-teal-600 p-5 text-white rounded-t-2xl">
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-3"><FaCheckCircle size={24} /><h2 className="text-xl font-bold">Approve Payment</h2></div>
                <button onClick={() => setShowApproveModal(false)} className="text-white text-2xl">×</button>
              </div>
            </div>
            <div className="p-5">
              <p className="text-gray-600 mb-3">Approve this payment?</p>
              <div className="bg-gray-50 rounded-xl p-3 mb-4 text-sm">
                <p><span className="text-gray-500">School:</span> {pendingPayment.schoolName}</p>
                <p><span className="text-gray-500">Amount:</span> {pendingPayment.currency} {pendingPayment.amount}</p>
                <p><span className="text-gray-500">Plan:</span> {pendingPayment.planName}</p>
              </div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Admin Notes (Optional)</label>
              <textarea value={approveNotes} onChange={(e) => setApproveNotes(e.target.value)} rows={3} className="w-full px-4 py-2 border-2 border-gray-200 rounded-xl focus:border-green-500" />
              <div className="flex gap-3 mt-5">
                <button onClick={() => setShowApproveModal(false)} className="flex-1 px-4 py-2 bg-gray-100 rounded-xl font-semibold">Cancel</button>
                <button onClick={handleConfirmApprove} disabled={approveLoading} className="flex-1 px-4 py-2 bg-green-600 text-white rounded-xl flex items-center justify-center gap-2 disabled:opacity-50">
                  {approveLoading ? <FaSpinner className="animate-spin" /> : <FaCheck />} Confirm
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Deny Modal */}
      {showDenyModal && pendingPayment && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-black/50" onClick={(e) => e.target === e.currentTarget && setShowDenyModal(false)}>
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full">
            <div className="bg-gradient-to-r from-red-600 to-rose-600 p-5 text-white rounded-t-2xl">
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-3"><FaTimesCircle size={24} /><h2 className="text-xl font-bold">Deny Payment</h2></div>
                <button onClick={() => setShowDenyModal(false)} className="text-white text-2xl">×</button>
              </div>
            </div>
            <div className="p-5">
              <p className="text-gray-600 mb-3">Deny this payment?</p>
              <div className="bg-gray-50 rounded-xl p-3 mb-4 text-sm">
                <p><span className="text-gray-500">School:</span> {pendingPayment.schoolName}</p>
                <p><span className="text-gray-500">Amount:</span> {pendingPayment.currency} {pendingPayment.amount}</p>
                <p><span className="text-gray-500">Plan:</span> {pendingPayment.planName}</p>
              </div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Denial Reason *</label>
              <input type="text" value={denyReason} onChange={(e) => setDenyReason(e.target.value)} className="w-full px-4 py-2 border-2 border-gray-200 rounded-xl mb-3" placeholder="e.g., Invalid payment proof" />
              <label className="block text-sm font-semibold text-gray-700 mb-2">Additional Notes</label>
              <textarea value={denyNotes} onChange={(e) => setDenyNotes(e.target.value)} rows={3} className="w-full px-4 py-2 border-2 border-gray-200 rounded-xl" />
              <div className="flex gap-3 mt-5">
                <button onClick={() => setShowDenyModal(false)} className="flex-1 px-4 py-2 bg-gray-100 rounded-xl font-semibold">Cancel</button>
                <button onClick={handleConfirmDeny} disabled={denyLoading} className="flex-1 px-4 py-2 bg-red-600 text-white rounded-xl flex items-center justify-center gap-2 disabled:opacity-50">
                  {denyLoading ? <FaSpinner className="animate-spin" /> : <FaTimes />} Confirm
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Payment Details Modal */}
      {showPaymentModal && selectedPayment && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-black/50" onClick={(e) => e.target === e.currentTarget && setShowPaymentModal(false)}>
          <div className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 z-20 bg-gradient-to-r from-blue-600 to-purple-600 p-4 sm:p-6 text-white rounded-t-2xl">
              <div className="flex justify-between items-start">
                <div>
                  <h2 className="text-xl sm:text-2xl font-bold">Payment Details</h2>
                  <p className="text-blue-100 text-sm">Transaction ID: {selectedPayment.transactionId}</p>
                </div>
                <button onClick={() => setShowPaymentModal(false)} className="text-white text-2xl">×</button>
              </div>
            </div>
            <div className="p-4 sm:p-6 space-y-6">
              {/* Payment Screenshot */}
              <div className="bg-gray-50 rounded-xl p-6">
                <div className="flex flex-wrap justify-between items-center mb-4">
                  <h3 className="text-lg font-semibold flex items-center gap-2">
                    <FaImage className="text-blue-600" /> Payment Screenshot
                  </h3>
                  {selectedPayment.screenshotUrl && (
                    <button
                      onClick={() => downloadImage(selectedPayment.screenshotUrl, `payment_${selectedPayment.transactionId}.jpg`)}
                      className="flex items-center gap-2 px-3 py-1.5 bg-blue-600 text-white rounded-lg text-sm hover:bg-blue-700"
                    >
                      <FaDownload /> Download
                    </button>
                  )}
                </div>
                {selectedPayment.screenshotUrl ? (
                  <div className="relative group">
                    {imageLoading && (
                      <div className="absolute inset-0 flex items-center justify-center bg-gray-100 rounded-lg z-10">
                        <FaSpinner className="animate-spin text-blue-600 text-3xl" />
                      </div>
                    )}
                    {imageBlobUrl && !imageError && (
                      <img
                        src={imageBlobUrl}
                        alt="Payment Screenshot"
                        className="w-full max-h-96 object-contain rounded-lg border-2 border-gray-200 cursor-pointer hover:border-blue-500 transition-all"
                        onClick={() => viewFullScreenImage(selectedPayment.screenshotUrl)}
                      />
                    )}
                    {imageError && (
                      <div className="text-center py-8 bg-gray-100 rounded-lg">
                        <FaImage className="text-gray-400 text-4xl mx-auto mb-2" />
                        <p className="text-gray-500">Unable to load screenshot. The file may be missing or inaccessible.</p>
                        <button
                          onClick={() => loadImageWithAuth(selectedPayment.screenshotUrl)}
                          className="mt-2 px-4 py-2 bg-blue-600 text-white rounded-lg text-sm"
                        >
                          Retry
                        </button>
                      </div>
                    )}
                    <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button
                        onClick={() => viewFullScreenImage(selectedPayment.screenshotUrl)}
                        className="bg-white rounded-lg p-2 shadow-lg hover:bg-gray-100"
                      >
                        <FaEye className="text-blue-600" />
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-8 bg-gray-100 rounded-lg">
                    <FaImage className="text-gray-400 text-4xl mx-auto mb-2" />
                    <p className="text-gray-500">No screenshot available</p>
                  </div>
                )}
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* School Info */}
                <div className="bg-gray-50 rounded-xl p-4 sm:p-6">
                  <h3 className="text-lg font-semibold mb-4 flex items-center gap-2"><FaBuilding className="text-green-600" /> School Information</h3>
                  <div className="space-y-2 text-sm">
                    <div><p className="text-gray-600">School Name</p><p className="font-semibold">{selectedPayment.schoolName}</p></div>
                    <div><p className="text-gray-600">Email</p><p>{selectedPayment.schoolEmail}</p></div>
                    <div><p className="text-gray-600">Phone</p><p>{selectedPayment.schoolPhone}</p></div>
                    <div><p className="text-gray-600">Location</p><p>{selectedPayment.schoolCity}</p></div>
                  </div>
                </div>
                {/* Payment Info */}
                <div className="bg-gray-50 rounded-xl p-4 sm:p-6">
                  <h3 className="text-lg font-semibold mb-4 flex items-center gap-2"><FaMoneyBillWave className="text-purple-600" /> Payment Information</h3>
                  <div className="space-y-2 text-sm">
                    <div><p className="text-gray-600">Plan Name</p><p className="font-semibold">{selectedPayment.planName}</p></div>
                    <div><p className="text-gray-600">Amount</p><p className="text-2xl font-bold text-green-600">{selectedPayment.currency} {selectedPayment.amount}</p></div>
                    <div><p className="text-gray-600">Duration</p><p className="capitalize">{selectedPayment.duration}</p></div>
                    <div><p className="text-gray-600">Payment Method</p><div className="flex items-center gap-2">{getPaymentMethodIcon(selectedPayment.paymentMethod)}<span className="capitalize">{selectedPayment.paymentMethod?.replace('_', ' ')}</span></div></div>
                    {selectedPayment.bankReference && <div><p className="text-gray-600">Bank Reference</p><p className="font-mono text-sm">{selectedPayment.bankReference}</p></div>}
                  </div>
                </div>
                {/* Plan Features */}
                <div className="bg-gray-50 rounded-xl p-4 sm:p-6">
                  <h3 className="text-lg font-semibold mb-4 flex items-center gap-2"><FaReceipt className="text-orange-600" /> Plan Features</h3>
                  <p className="text-gray-700 text-sm">{selectedPayment.features}</p>
                </div>
                {/* Status & Notes */}
                <div className="bg-gray-50 rounded-xl p-4 sm:p-6">
                  <h3 className="text-lg font-semibold mb-4 flex items-center gap-2"><FaClock className="text-blue-600" /> Status & Notes</h3>
                  <div className="space-y-2 text-sm">
                    <div><p className="text-gray-600">Current Status</p>
                      <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-sm font-semibold ${selectedPayment.status === 'approved' ? 'bg-green-100 text-green-800' : selectedPayment.status === 'denied' ? 'bg-red-100 text-red-800' : 'bg-yellow-100 text-yellow-800'}`}>
                        {selectedPayment.status === 'approved' ? <FaCheckCircle /> : selectedPayment.status === 'denied' ? <FaTimesCircle /> : <FaClock />}
                        {selectedPayment.status?.charAt(0).toUpperCase() + selectedPayment.status?.slice(1)}
                      </span>
                    </div>
                    <div><p className="text-gray-600">Notes</p><p className="text-gray-700">{selectedPayment.notes}</p></div>
                    {selectedPayment.approvedBy && <div><p className="text-gray-600">Approved By</p><p>{selectedPayment.approvedBy} on {formatDate(selectedPayment.approvedAt)}</p></div>}
                    {selectedPayment.deniedReason && <div><p className="text-gray-600">Denial Reason</p><p className="text-red-600">{selectedPayment.deniedReason}</p></div>}
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              {selectedPayment.status === 'pending' && (
                <div className="flex flex-col sm:flex-row justify-end gap-3 pt-4 border-t sticky bottom-0 bg-white py-4 -mb-6">
                  <button onClick={() => openApproveModal(selectedPayment)} disabled={approveLoading} className="px-6 py-3 bg-green-600 text-white rounded-xl flex items-center justify-center gap-2 disabled:opacity-50">
                    {approveLoading && processingId === selectedPayment._id ? <FaSpinner className="animate-spin" /> : <FaCheck />} Approve
                  </button>
                  <button onClick={() => openDenyModal(selectedPayment)} disabled={denyLoading} className="px-6 py-3 bg-red-600 text-white rounded-xl flex items-center justify-center gap-2 disabled:opacity-50">
                    {denyLoading && processingId === selectedPayment._id ? <FaSpinner className="animate-spin" /> : <FaTimes />} Deny
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Full Screen Image Modal with authentication */}
      {showImageModal && fullScreenBlobUrl && (
        <div 
          className="fixed inset-0 z-[10000] flex items-center justify-center p-4 bg-black/80"
          onClick={() => {
            setShowImageModal(false);
            if (fullScreenBlobUrl) URL.revokeObjectURL(fullScreenBlobUrl);
            setFullScreenBlobUrl(null);
          }}
        >
          <div className="relative max-w-6xl w-full">
            <button
              onClick={() => {
                setShowImageModal(false);
                if (fullScreenBlobUrl) URL.revokeObjectURL(fullScreenBlobUrl);
                setFullScreenBlobUrl(null);
              }}
              className="absolute -top-12 right-0 text-white hover:text-gray-300 text-2xl"
            >
              × Close
            </button>
            <img 
              src={fullScreenBlobUrl} 
              alt="Full Size Payment Screenshot"
              className="w-full h-auto rounded-lg shadow-2xl"
            />
            <div className="absolute bottom-4 right-4 flex gap-2">
              <button
                onClick={() => {
                  const link = document.createElement('a');
                  link.href = fullScreenBlobUrl;
                  link.download = 'payment-screenshot.jpg';
                  document.body.appendChild(link);
                  link.click();
                  document.body.removeChild(link);
                }}
                className="bg-white rounded-lg p-2 shadow-lg hover:bg-gray-100"
              >
                <FaDownload className="text-blue-600" />
              </button>
              <button
                onClick={() => window.print()}
                className="bg-white rounded-lg p-2 shadow-lg hover:bg-gray-100"
              >
                <FaPrint className="text-gray-600" />
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

// Stat Card Component (responsive)
const StatCard = ({ title, value, icon, color }) => {
  const colorClasses = {
    blue: 'border-blue-200 bg-blue-50',
    green: 'border-green-200 bg-green-50',
    yellow: 'border-yellow-200 bg-yellow-50',
    red: 'border-red-200 bg-red-50',
    purple: 'border-purple-200 bg-purple-50'
  };
  return (
    <div className={`bg-white rounded-2xl shadow-lg p-4 sm:p-6 border-l-4 ${colorClasses[color]} hover:shadow-xl transition-all transform hover:-translate-y-1`}>
      <div className="flex justify-between items-center">
        <div>
          <p className="text-gray-600 text-xs sm:text-sm font-medium">{title}</p>
          <p className="text-xl sm:text-2xl font-bold text-gray-800 mt-1 sm:mt-2">{value}</p>
        </div>
        <div className="text-2xl sm:text-3xl opacity-80">{icon}</div>
      </div>
    </div>
  );
};

export default PaymentDashboard;