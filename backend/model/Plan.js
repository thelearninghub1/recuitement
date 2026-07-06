// models/Plan.js

const mongoose = require('mongoose');

const planSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Plan name is required'],
    unique: true,
    trim: true
  },
  description: {
    type: String,
    required: false
  },
  prices: {
    monthly: {
      type: Number,
      default: null
    },
    yearly: {
      type: Number,
      default: null
    }
  },
  currency: {
    type: String,
    default: 'SAR',
    enum: ['SAR']
  },
  features: [{
    type: String,
    required: true
  }],
  limits: {
    maxJobs: {
      type: Number,
      default: 10
    },
    maxCvsDownloadMonthly: {
      type: Number,
      default: 10
    },
    maxCvsDownloadYearly: {
      type: Number,
      default: 120
    }
  },
  isActive: {
    type: Boolean,
    default: true
  },
  popular: {
    type: Boolean,
    default: false
  },
  displayOrder: {
    type: Number,
    default: 0
  },
  savings: {
    type: Number,
    default: 0
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  updatedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  }
}, {
  timestamps: true
});

// Add index for better performance
planSchema.index({ name: 1 });

module.exports = mongoose.model('Plan', planSchema);