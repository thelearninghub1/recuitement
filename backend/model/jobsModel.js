const mongoose = require('mongoose');

const jobSchema = new mongoose.Schema({
  // Job Basic Information
  jobId: {
    type: String,
    required: [true, 'Job ID is required'],
    unique: true,
    trim: true,
    uppercase: true
  },
  jobTitle: {
    type: String,
    required: [true, 'Job title is required'],
    trim: true
  },
  jobTitleOther: String,
  gender: {
    type: String,
    enum: ['Male', 'Female', ''],
    default: ''
  },
  category: {
    type: String,
    required: [true, 'Category is required'],
  },
  jobDescription: {
    type: String,
    required: [true, 'Job description is required']
  },
  
  // Nationality & Location
  preferredNationality: {
    type: String,
    default: ''
  },
  preferredNationalityOther: String,
  estimatedJoiningDate: {
    type: Date,
    required: [true, 'Estimated joining date is required']
  },
  location: {
    type: String,
    required: [true, 'Location is required']
  },
  locationOther: String,
  
  // Job Type & Application
  jobType: {
    type: String,
    required: [true, 'Job type is required'],
  },
  jobTypeOther: String,
  jobApplyType: {
    type: String,
    required: [true, 'Job apply type is required'],
  },
  jobApplyTypeOther: String,
  applicationEmail: {
    type: String,
    required: [true, 'Application email is required'],
    match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, 'Please enter a valid email']
  },
  
  // Salary Information
  salaryPaidBy: {
    type: String,
    required: [true, 'Salary payment type is required'],
  },
  salaryPaidByOther: String,
  minSalary: {
    type: Number,
    min: 0
  },
  maxSalary: {
    type: Number,
    min: 0
  },
  
  // Experience & Qualifications
  experienceRequired: {
    type: String,
    required: [true, 'Experience is required'],
  },
  experienceRequiredOther: String,
  careerLevel: {
    type: String,
    required: [true, 'Career level is required'],
  },
  careerLevelOther: String,
  minQualification: {
    type: String,
    required: [true, 'Minimum qualification is required'],
  },
  minQualificationOther: String,
  degreeMajor: {
    type: String,
    required: [true, 'Degree major is required']
  },
  degreeMajorOther: String,
  
  // Teaching Requirements
  curriculumRequired: [{
    type: String
  }],
  curriculumOther: String,
  englishCertRequired: {
    type: String,
    default: ''
  },
  englishCertOther: String,
  teachingLicenseRequired: {
    type: String,
    required: [true, 'Teaching license requirement is required'],
  },
  teachingLicenseOther: String,
  attestedDegreeRequired: {
    type: String,
    required: [true, 'Attested degree requirement is required'],
  },
  nonTeachingRole: [{
    type: String
  }],
  nonTeachingRoleOther: String,
  
  // Application & Residency
  applicationDeadline: {
    type: Date,
    required: [true, 'Application deadline is required']
  },
  residencyStatus: {
    type: String,
    required: [true, 'Residency status is required'],

  },
  residencyStatusOther: String,
  
  // School Reference
  school: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    validate: {
      validator: async function(v) {
        const user = await mongoose.model('User').findById(v);
        return user && user.role === 'school';
      },
      message: 'Only schools can post jobs'
    }
  },
  
  // Job Status & Applications
  status: {
    type: String,
    default: ''
  },
  isFeatured: {
    type: Boolean,
    default: false
  },
  viewCount: {
    type: Number,
    default: 0
  },
  applicationCount: {
    type: Number,
    default: 0
  },
  
  // Saudi Arabia specific fields
  country: {
    type: String,
    default: 'Saudi Arabia',
    immutable: true
  },
  city: String,
  workMode: String,
  
  // Audit Fields
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  updatedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Indexes for performance
jobSchema.index({ school: 1, status: 1 });
jobSchema.index({ jobId: 1 });
jobSchema.index({ status: 1 });
jobSchema.index({ location: 1 });
jobSchema.index({ createdAt: -1 });
jobSchema.index({ isFeatured: 1, status: 1 });

// Virtual for salary range
jobSchema.virtual('salaryRange').get(function() {
  if (this.minSalary && this.maxSalary) {
    return `${this.minSalary.toLocaleString()} - ${this.maxSalary.toLocaleString()} SAR`;
  } else if (this.minSalary) {
    return `From ${this.minSalary.toLocaleString()} SAR`;
  } else if (this.maxSalary) {
    return `Up to ${this.maxSalary.toLocaleString()} SAR`;
  }
  return 'Salary negotiable';
});

// Virtual for application deadline status
jobSchema.virtual('deadlineStatus').get(function() {
  const now = new Date();
  const deadline = new Date(this.applicationDeadline);
  const diffDays = Math.ceil((deadline - now) / (1000 * 60 * 60 * 24));
  
  if (diffDays < 0) return 'expired';
  if (diffDays <= 7) return 'urgent';
  if (diffDays <= 30) return 'soon';
  return 'normal';
});

// Pre-save hook to generate job ID if not provided
jobSchema.pre('save', async function(next) {
  if (!this.jobId) {
    const timestamp = Date.now().toString().slice(-6);
    const random = Math.floor(Math.random() * 1000).toString().padStart(3, '0');
    this.jobId = `JOB-${timestamp}-${random}`;
  }
  
  // Set city from location if not explicitly set
  if (!this.city && this.location && this.location !== 'Other') {
    this.city = this.location;
  }
  
  // Set work mode based on location
  if (this.location === 'Remote') {
    this.workMode = 'Remote';
  } else if (this.location && this.location !== 'Remote' && this.location !== 'Other') {
    this.workMode = 'On-site';
  }
  
  next();
});

// Static methods
jobSchema.statics.findActiveJobs = function() {
  return this.find({ 
    status: 'active',
    applicationDeadline: { $gt: new Date() }
  });
};

jobSchema.statics.findBySchool = function(schoolId) {
  return this.find({ school: schoolId });
};

jobSchema.statics.findFeaturedJobs = function() {
  return this.find({ 
    isFeatured: true,
    status: 'active',
    applicationDeadline: { $gt: new Date() }
  }).limit(10);
};

// Instance methods
jobSchema.methods.incrementViewCount = async function() {
  this.viewCount += 1;
  return await this.save();
};

jobSchema.methods.incrementApplicationCount = async function() {
  this.applicationCount += 1;
  return await this.save();
};

module.exports = mongoose.model('Job', jobSchema);