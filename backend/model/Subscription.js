const mongoose = require('mongoose');

const subscriptionSchema = new mongoose.Schema({
  school: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    unique: true
  },
  plan: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Plan',
    required: true
  },
  planName: String,
  status: {
    type: String,
    enum: ['active', 'expired', 'cancelled', 'pending'],
    default: 'pending'
  },
  duration: {
    type: String,
    enum: ['monthly', 'yearly']
  },
  startDate: Date,
  endDate: Date,
  autoRenew: {
    type: Boolean,
    default: true
  },
  // Usage tracking
  usage: {
    jobsPosted: { type: Number, default: 0 },
    cvsDownloaded: { type: Number, default: 0 },
    jobsThisMonth: { type: Number, default: 0 },
    cvsThisMonth: { type: Number, default: 0 },
    lastResetDate: { type: Date, default: Date.now }
  },
  limits: {
    maxJobs: { type: Number, default: 10 },
    maxCvsPerMonth: { type: Number, default: 50 },
    maxCvsPerYear: { type: Number, default: 600 }
  },
  currentPayment: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Payment'
  },
  paymentHistory: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Payment'
  }]
}, {
  timestamps: true
});

// Check if subscription is active
subscriptionSchema.methods.isActive = function() {
  return this.status === 'active' && new Date() < this.endDate;
};

// Check remaining jobs
subscriptionSchema.methods.getRemainingJobs = function() {
  return Math.max(0, this.limits.maxJobs - this.usage.jobsPosted);
};

// Check remaining CVs this month
subscriptionSchema.methods.getRemainingCvsThisMonth = function() {
  const now = new Date();
  const lastReset = new Date(this.usage.lastResetDate);
  
  // Reset monthly counters if new month
  if (now.getMonth() !== lastReset.getMonth() || now.getFullYear() !== lastReset.getFullYear()) {
    this.usage.jobsThisMonth = 0;
    this.usage.cvsThisMonth = 0;
    this.usage.lastResetDate = now;
  }
  
  return Math.max(0, this.limits.maxCvsPerMonth - this.usage.cvsThisMonth);
};

// Increment job count
subscriptionSchema.methods.incrementJobsPosted = async function() {
  this.usage.jobsPosted += 1;
  this.usage.jobsThisMonth += 1;
  return await this.save();
};

// Increment CV download count
subscriptionSchema.methods.incrementCvsDownloaded = async function() {
  this.usage.cvsDownloaded += 1;
  this.usage.cvsThisMonth += 1;
  return await this.save();
};

module.exports = mongoose.model('Subscription', subscriptionSchema);