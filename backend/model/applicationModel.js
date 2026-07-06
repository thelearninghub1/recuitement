const mongoose = require('mongoose');

const applicationSchema = new mongoose.Schema({
  job: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Job',
    required: true
  },
  candidate: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  
  // Application Details
  fullName: {
    type: String,
    required: [true, 'Full name is required']
  },
  email: {
    type: String,
    required: [true, 'Email is required'],
    match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, 'Please enter a valid email']
  },
  phoneNumber: {
    type: String,
    required: [true, 'Phone number is required']
  },
  currentLocation: String,
  
  // Files
  resume: {
    filename: String,
    originalName: String,
    path: String,
    size: Number,
    uploadedAt: {
      type: Date,
      default: Date.now
    }
  },
  coverLetter: {
    filename: String,
    originalName: String,
    path: String,
    size: Number,
    uploadedAt: Date
  },
  
  // Additional Information
  additionalInfo: String,
  
  // Application Status
  status: {
    type: String,
    default: 'pending'
  },
  appliedDate: {
    type: Date,
    default: Date.now
  },
  
  // Review fields
  reviewedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  reviewedAt: Date,
  reviewNotes: String,
  rating: {
    type: Number,
    min: 1,
    max: 5
  },
  
  // Communication
  interviewScheduled: Date,
  interviewNotes: String,
  offerMade: Date,
  offerDetails: String,
  
  // Flags
  isNew: {
    type: Boolean,
    default: true
  },
  isArchived: {
    type: Boolean,
    default: false
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Compound index to prevent duplicate applications
applicationSchema.index({ job: 1, candidate: 1 }, { unique: true });

// Indexes for performance
applicationSchema.index({ status: 1 });
applicationSchema.index({ appliedDate: -1 });
applicationSchema.index({ job: 1, status: 1 });
applicationSchema.index({ candidate: 1 });
applicationSchema.index({ school: 1 }); // Will be populated via virtual

// Virtual to get school ID from job
applicationSchema.virtual('school', {
  ref: 'Job',
  localField: 'job',
  foreignField: '_id',
  justOne: true,
  options: { select: 'school' }
});

// Pre-save hook to update job's application count
applicationSchema.pre('save', async function(next) {
  if (this.isNew) {
    const Job = mongoose.model('Job');
    await Job.findByIdAndUpdate(this.job, { $inc: { applicationCount: 1 } });
  }
  next();
});

// Static methods
applicationSchema.statics.findByJob = function(jobId) {
  return this.find({ job: jobId })
    .populate('candidate', 'profile candidateData applicationId')
    .sort({ appliedDate: -1 });
};

applicationSchema.statics.findByCandidate = function(candidateId) {
  return this.find({ candidate: candidateId })
    .populate({
      path: 'job',
      select: 'jobId jobTitle location salaryRange applicationDeadline school'
    })
    .sort({ appliedDate: -1 });
};

applicationSchema.statics.findBySchool = function(schoolId) {
  return this.find()
    .populate({
      path: 'job',
      match: { school: schoolId },
      select: 'jobId jobTitle'
    })
    .then(applications => applications.filter(app => app.job !== null))
    .sort({ appliedDate: -1 });
};

module.exports = mongoose.model('Application', applicationSchema);