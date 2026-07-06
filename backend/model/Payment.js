// models/Payment.js - COMPLETE WORKING VERSION
const mongoose = require('mongoose');

const paymentSchema = new mongoose.Schema({
  transactionId: {
    type: String,
    unique: true,
    sparse: true
  },
  school: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'School is required']
  },
  schoolName: {
    type: String,
    required: [true, 'School name is required']
  },
  schoolEmail: {
    type: String,
    required: [true, 'School email is required']
  },
  plan: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Plan',
    required: [true, 'Plan is required']
  },
  planName: {
    type: String,
    required: [true, 'Plan name is required']
  },
  amount: {
    type: Number,
    required: [true, 'Amount is required'],
    min: 0
  },
  currency: {
    type: String,
    default: 'SAR',
    uppercase: true
  },
  duration: {
    type: String,
    required: [true, 'Duration is required']
  },
  paymentMethod: {
    type: String,
    default: 'bank_transfer'
  },
  referenceNumber: {
    type: String,
    required: [true, 'Transaction reference number is required'],
    trim: true
  },
  screenshotUrl: {
    type: String,
    required: [true, 'Payment screenshot is required']
  },
  screenshotPublicId: String,
  status: {
    type: String,
    enum: ['pending', 'approved', 'denied', 'refunded'],
    default: 'pending'
  },
  reviewedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  reviewedAt: Date,
  denialReason: String,
  adminNotes: String,
  approvedAt: Date,
  subscriptionActivated: {
    type: Boolean,
    default: false
  }
}, {
  timestamps: true
});

// Generate transaction ID before saving
paymentSchema.pre('save', async function(next) {
  // Only generate if transactionId is not already set
  if (!this.transactionId) {
    const timestamp = Date.now().toString().slice(-8);
    const random = Math.floor(Math.random() * 10000).toString().padStart(4, '0');
    this.transactionId = `TXN${timestamp}${random}`;
  }
  next();
});

module.exports = mongoose.model('Payment', paymentSchema);