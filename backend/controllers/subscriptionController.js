const Subscription = require('../model/Subscription');
const Payment = require('../model/Payment');
const Plan = require('../model/Plan');
const asyncHandler = require('../middlewares/asyncHandler');

// @desc    Get current school subscription
exports.getMySubscription = asyncHandler(async (req, res) => {
  if (req.user.role !== 'school') {
    return res.status(403).json({ success: false, message: 'Only schools can access' });
  }
 
  let subscription = await Subscription.findOne({ school: req.user._id })
    .populate('plan', 'name description features prices')
    .populate('currentPayment')
    .populate('paymentHistory');

  if (!subscription) {
    return res.status(200).json({
      success: true,
      subscription: null,
      message: 'No active subscription'
    });
  }

  // Get payment history
  const payments = await Payment.find({ school: req.user._id })
    .sort({ createdAt: -1 })
    .limit(10);

  // Get usage stats
  const usageStats = {
    jobsPosted: subscription.usage.jobsPosted,
    cvsDownloaded: subscription.usage.cvsDownloaded,
    jobsThisMonth: subscription.usage.jobsThisMonth,
    cvsThisMonth: subscription.usage.cvsThisMonth,
    totalJobsLimit: subscription.limits.maxJobs,
    totalCvsLimit: subscription.limits.maxCvsPerMonth,
    remainingJobs: subscription.getRemainingJobs(),
    remainingCvs: subscription.getRemainingCvsThisMonth()
  };

  res.status(200).json({
    success: true,
    subscription: {
      id: subscription._id,
      planName: subscription.planName,
      status: subscription.status,
      startDate: subscription.startDate,
      endDate: subscription.endDate,
      duration: subscription.duration,
      autoRenew: subscription.autoRenew,
      features: subscription.plan?.features || []
    },
    usageStats,
    paymentHistory: payments
  });
});

// @desc    Check if school can post a job
exports.canPostJob = asyncHandler(async (req, res) => {
  if (req.user.role !== 'school') {
    return res.status(403).json({ success: false });
  }

  const subscription = await Subscription.findOne({ school: req.user._id });
  
  if (!subscription || !subscription.isActive()) {
    return res.status(200).json({ canPost: false, reason: 'No active subscription' });
  }

  const remainingJobs = subscription.getRemainingJobs();
  if (remainingJobs <= 0) {
    return res.status(200).json({ canPost: false, reason: 'Job limit reached' });
  }

  res.status(200).json({ canPost: true, remainingJobs });
});

// @desc    Increment job post count
exports.incrementJobPost = asyncHandler(async (req, res) => {
  if (req.user.role !== 'school') {
    return res.status(403).json({ success: false });
  }

  const subscription = await Subscription.findOne({ school: req.user._id });
  if (subscription && subscription.isActive()) {
    await subscription.incrementJobsPosted();
  }

  res.status(200).json({ success: true });
});


// Decrease CV count when downloaded (update subscription usage)
exports.decreaseCvCount = asyncHandler(async (req, res) => {
  if (req.user.role !== 'school') {
    return res.status(403).json({ success: false, message: 'Only schools can download CVs' });
  }

  // Find the active subscription for this school
  let subscription = await Subscription.findOne({ school: req.user._id });
  if (!subscription) {
    return res.status(400).json({ success: false, message: 'No subscription found' });
  }

  // Check if subscription is active
  if (!subscription.isActive()) {
    return res.status(400).json({ success: false, message: 'Subscription is not active' });
  }

  // Calculate remaining CVs for the month
  const remainingCvs = subscription.getRemainingCvsThisMonth();
  if (remainingCvs <= 0) {
    return res.status(400).json({ success: false, message: 'No CV downloads remaining this month' });
  }

  // Increment the counter (cvsThisMonth) – you may also want to track total cvsDownloaded
  subscription.usage.cvsThisMonth += 1;
  subscription.usage.cvsDownloaded += 1;   // optional: total lifetime downloads
  await subscription.save();

  // Recalculate remaining after update
  const newRemaining = subscription.getRemainingCvsThisMonth();

  res.json({ 
    success: true, 
    remaining: newRemaining,
    message: 'CV count decreased successfully'
  });
});