const Payment = require('../model/Payment');
const Plan = require('../model/Plan');
const Subscription = require('../model/Subscription');
const User = require('../model/userModel');
const asyncHandler = require('../middlewares/asyncHandler');
const sendEmail = require('../utils/sendEmail');
const path = require('path');
const fs = require('fs').promises;

// @desc    Submit payment proof (School only)
exports.submitPayment = asyncHandler(async (req, res) => {
  if (req.user.role !== 'school') {
    return res.status(403).json({ success: false, message: 'Only schools can submit payments' });
  } 

  const { planId, planName, amount, currency, duration, referenceNumber, paymentMethod } = req.body;

  // Validate plan exists
  const plan = await Plan.findById(planId);
  if (!plan) {
    return res.status(404).json({ success: false, message: 'Plan not found' });
  }

  // Check for screenshot upload
  if (!req.file) {
    return res.status(400).json({ success: false, message: 'Payment screenshot is required' });
  }

  const school = await User.findById(req.user._id);

  const payment = await Payment.create({
    school: req.user._id,
    schoolName: school.schoolData?.schoolName || school.schoolData?.schoolNameOther || school.email,
    schoolEmail: school.email,
    plan: planId,
    planName,
    amount: Number(amount),
    currency,
    duration,
    paymentMethod: paymentMethod || 'bank_transfer',
    referenceNumber,
    screenshotUrl: req.file.filename,
    status: 'pending'
  });

  // Notify admins
  const admins = await User.find({ role: 'system-admin' }).select('email');
  await sendEmail({
    email: admins.map(a => a.email).join(','),
    subject: `New Payment Submission - ${payment.transactionId}`,
    message: `A new payment has been submitted.\nSchool: ${payment.schoolName}\nAmount: ${currency} ${amount}\nTransaction ID: ${payment.transactionId}`
  });

  res.status(201).json({
    success: true,
    message: 'Payment proof submitted successfully',
    payment
  });
});

// @desc    Get payments (Admin sees all, School sees own)
exports.getPayments = asyncHandler(async (req, res) => {
  const { page = 1, limit = 20, status, search } = req.query;

  let query = {};
  
  if (req.user.role === 'school') {
    query.school = req.user._id;
  }

  if (status && status !== 'all') {
    query.status = status;
  }

  if (search) {
    query.$or = [
      { transactionId: { $regex: search, $options: 'i' } },
      { schoolName: { $regex: search, $options: 'i' } },
      { referenceNumber: { $regex: search, $options: 'i' } }
    ];
  }

  const payments = await Payment.find(query)
    .populate('school', 'schoolData profile email')
    .populate('plan', 'name prices')
    .populate('reviewedBy', 'profile firstName lastName email')
    .sort({ createdAt: -1 })
    .limit(parseInt(limit))
    .skip((parseInt(page) - 1) * parseInt(limit));

  const total = await Payment.countDocuments(query);

  res.status(200).json({
    success: true,
    count: payments.length,
    total,
    page: parseInt(page),
    pages: Math.ceil(total / parseInt(limit)),
    payments
  });
});

// @desc    Get payment statistics (Admin only)
exports.getPaymentStats = asyncHandler(async (req, res) => {
  if (req.user.role !== 'system-admin') {
    return res.status(403).json({ success: false, message: 'Admin only' });
  }

  const stats = await Payment.aggregate([
    {
      $group: {
        _id: '$status',
        count: { $sum: 1 },
        totalAmount: { $sum: '$amount' }
      }
    }
  ]);

  const result = { total: 0, pending: 0, approved: 0, denied: 0, totalAmount: 0 };
  stats.forEach(stat => {
    result[stat._id] = stat.count;
    result.total += stat.count;
    if (stat._id === 'approved') result.totalAmount += stat.totalAmount;
  });

  res.status(200).json({ success: true, stats: result });
});

// @desc    Approve payment (Admin only)
// @desc    Approve payment (Admin only)
exports.approvePayment = asyncHandler(async (req, res) => {
  if (req.user.role !== 'system-admin') {
    return res.status(403).json({ success: false, message: 'Admin only' });
  }

  const payment = await Payment.findById(req.params.id);
  if (!payment) {
    return res.status(404).json({ success: false, message: 'Payment not found' });
  }

  if (payment.status !== 'pending') {
    return res.status(400).json({ success: false, message: 'Payment already processed' });
  }

  payment.status = 'approved';
  payment.reviewedBy = req.user._id;
  payment.reviewedAt = new Date();
  payment.approvedAt = new Date();
  payment.adminNotes = req.body.adminNotes;
  await payment.save();

  // Activate subscription
  let subscription = await Subscription.findOne({ school: payment.school });
  
  const startDate = new Date();
  const endDate = new Date();
  if (payment.duration === 'monthly') {
    endDate.setMonth(endDate.getMonth() + 1);
  } else {
    endDate.setFullYear(endDate.getFullYear() + 1);
  }

  const plan = await Plan.findById(payment.plan);

  if (!subscription) {
    subscription = await Subscription.create({
      school: payment.school,
      plan: payment.plan,
      planName: payment.planName,
      status: 'active',
      duration: payment.duration,
      startDate,
      endDate,
      limits: {
        maxJobs: plan.limits?.maxJobs || 10,
        maxCvsPerMonth: plan.limits?.maxCvsDownloadMonthly || 50,
        maxCvsPerYear: plan.limits?.maxCvsDownloadYearly || 600
      },
      currentPayment: payment._id,
      paymentHistory: [payment._id]
    });
  } else {
    subscription.plan = payment.plan;
    subscription.planName = payment.planName;
    subscription.status = 'active';
    subscription.duration = payment.duration;
    subscription.startDate = startDate;
    subscription.endDate = endDate;
    subscription.currentPayment = payment._id;
    subscription.paymentHistory.push(payment._id);
    await subscription.save();
  }

  // ==============================================
  // ADD THIS CODE HERE - RIGHT AFTER SUBSCRIPTION CREATION/UPDATE
  // ==============================================
  
  // Get the school user and update CV remaining count
  const school = await User.findById(payment.school);
  if (school) {
    // Set remaining CV downloads based on plan limits
    school.schoolData.cvsRemaining = plan.limits?.maxCvsDownloadMonthly || 50;
    await school.save();
    console.log(`✅ Set CV remaining for ${school.schoolData.schoolName}: ${school.schoolData.cvsRemaining}`);
  }
  
  // ==============================================

  payment.subscriptionActivated = true;
  await payment.save();

  // Send approval email
  await sendEmail({
    email: payment.schoolEmail,
    subject: 'Payment Approved - Membership Activated',
    message: `Dear ${payment.schoolName},\n\nYour payment of ${payment.currency} ${payment.amount} has been approved. Your membership is now active until ${endDate.toLocaleDateString()}.\n\nThank you for choosing us!`
  });

  res.status(200).json({ success: true, message: 'Payment approved', payment });
});

// @desc    Deny payment (Admin only)
exports.denyPayment = asyncHandler(async (req, res) => {
  if (req.user.role !== 'system-admin') {
    return res.status(403).json({ success: false, message: 'Admin only' });
  }

  const { reason, adminNotes } = req.body;
  if (!reason) {
    return res.status(400).json({ success: false, message: 'Denial reason required' });
  }

  const payment = await Payment.findById(req.params.id);
  if (!payment) {
    return res.status(404).json({ success: false, message: 'Payment not found' });
  }

  payment.status = 'denied';
  payment.denialReason = reason;
  payment.adminNotes = adminNotes;
  payment.reviewedBy = req.user._id;
  payment.reviewedAt = new Date();
  await payment.save();

  // Send denial email
  await sendEmail({
    email: payment.schoolEmail,
    subject: 'Payment Update - Action Required',
    message: `Dear ${payment.schoolName},\n\nYour payment of ${payment.currency} ${payment.amount} has been denied.\nReason: ${reason}\n\nPlease submit a new payment with correct information.`
  });

  res.status(200).json({ success: true, message: 'Payment denied', payment });
});