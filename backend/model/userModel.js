// models/User.js
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

// Define Certificate Schema as a subdocument
const certificateSchema = new mongoose.Schema({
  name: String,
  institution: String,
  year: String
}, { _id: false }); // Don't create _id for each certificate

const userSchema = new mongoose.Schema({
  // Basic Authentication & Role
  email: {
    type: String,
    required: [true, 'Email is required'],
    unique: true,
    lowercase: true,
    trim: true,
    match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, 'Please enter a valid email']
  },
  password: {
    type: String,
    required: [true, 'Password is required'],
    minlength: 6,
    select: false
  },
  role: {
    type: String,
    enum: ['candidate', 'school', 'system-admin'],
    required: true
  },
  
  // Common Profile Fields for all roles
  profile: {
    firstName: {
      type: String,
      required: function() { return this.role === 'candidate'; }
    },
    lastName: {
      type: String,
      required: function() { return this.role === 'candidate'; }
    },
    mobile: {
      type: String,
      required: function() { return this.role !== 'system-admin'; }
    },
    photo: {
      type: String,
      default: null
    },
    isVerified: {
      type: Boolean,
      default: false
    },
    profileCompleted: {
      type: Boolean,
      default: false
    }
  },

  // Candidate Specific Data (Teachers/Job Seekers)
  candidateData: {
    // Personal Information
    middleName: String,
    gender: {
      type: String,
    },
    dob: Date,
    whatsapp: String,
    nationality: String,
    maritalStatus: {
      type: String,
    },
    countryOfResidence: String,
    currentCity: String,
    currentCityOther: String,
    expectedSalary: String,
    
    // Academics & Experience
    degree: {
      type: String,
      required: function() { return this.role === 'candidate'; }
    },
    degreeOther: String,
    universityName: {
      type: String,
      required: function() { return this.role === 'candidate'; }
    },
    universityLocation: String,
    positionsInterested: [{
      type: String
    }],
    positionsOther: String,
    currentInstitution: String,
    previousInstitution: String,
    totalExperience: String,
    curriculumTaught: [{
      type: String
    }],
    curriculumOther: String,
    englishCert: String,
    englishCertOther: String,
    teachingLicense: String,
    teachingLicenseOther: String,
    teachingDiploma: String,
    teachingDiplomaOther: String,
    stemKnowledge: {
      type: String,
    },
    stemCertified: String,
    stemCertifiedOther: String,
    degreeAttested: String,
    
    // Other Certificates - Now using the certificate schema
    otherCertificates: [certificateSchema],
    
    awards: String,
    
    // Residency & Skills
    iqama: {
      type: String,
   
    },
    iqamaOther: String,
    willingRelocateCity: String,
    skills: [{
      type: String
    }],
    skillsOther: String,
    languages: [{
      type: String
    }],
    languagesOther: String,
    extras: [{
      type: String
    }],
    extrasOther: String,
    
    // Medical / Consent
    consentForwardCV: {
      type: String,
    },
    consentForwardCVOther: String,
    medicalAssistance: {
      type: String,
    },
    medicalAssistanceOther: String,
    availableFrom: Date,
    
    // Documents
    cv: {
      type: String,
      required: function() { return this.role === 'candidate'; }
    },
    latestDegreeFiles: [String],
    
    // Additional Information
    otherNotes: String,
    
    // Application Tracking
    applicationId: {
      type: String,
      unique: true,
      sparse: true
    },
    status: {
      type: String,
      default: 'active'
    }
  },

  // School Specific Data - UPDATED to match frontend changes
  schoolData: {
    // School Basic Information
    schoolName: String,
    schoolNameOther: String,
    schoolType: [{
      type: String
    }],
    schoolTypeOther: String, // Added for "Other" school type
    schoolLevel: [{
      type: String
    }],
    curriculum: [{
      type: String
    }], // Will store the sub-values (e.g., "National Curriculum for England", "Cambridge (IGCSE / A-Levels)", etc.)
    curriculumMain: [{
      type: String
    }], // Optional: store main categories if needed
    establishedYear: {
      type: Number,
      max: new Date().getFullYear()
    }, 
    studentCapacity: Number,
    currentStudents: Number,
    cvsRemaining: { type: Number, default: 0 },
    // Location Information
    country: String,
    city: String,
    cityOther: String,
    address: String,
    website: String,
    
    // Contact Information
    contactPerson: String,
    contactPosition: String,
    principalName: String,
    email: String,
    telephone: String,
    alternativeContact: String,
    
    // Staffing Requirements - REMOVED: staffingNeeds, immediateOpenings, hiringTimeline, salaryRange
    // Only kept expectedTeachers
    expectedTeachers: Number,
    
    // Facilities
    facilities: [{
      type: String
    }],
    facilitiesOther: String,
    
    // Accreditations - UPDATED with new values
    accreditations: [{
      type: String
    }],
    accreditationsOther: String,
    
    // Additional Information
    schoolDescription: String,
    otherPartnershipInstitutions: String, // Renamed from partnershipInterest
    
    // Additional Info
    additionalInfo: String,
    
    // Documents
    logo: String,
    schoolProfileCR: [String], // Renamed from schoolDocuments
    
    // School Tracking
    schoolId: {
      type: String,
      unique: true,
      sparse: true
    },
    status: {
      type: String,
      default: 'verified'
    },
    isFeatured: {
      type: Boolean,
      default: false
    }
  },

  // System Admin Specific Data
  adminData: {
    permissions: {
      type: [String],
      default: ['full_access']
    },
    adminLevel: {
      type: String,
      enum: ['super-admin', 'admin', 'moderator'],
      default: 'admin'
    },
    lastLogin: Date,
    loginHistory: [{
      timestamp: {
        type: Date,
        default: Date.now
      },
      ipAddress: String,
      userAgent: String
    }]
  },

  // Common Fields for all users
  lastLogin: Date,
  loginCount: {
    type: Number,
    default: 0
  },
  status: {
    type: String,
    default: 'active'
  },
  emailVerificationToken: String,
  passwordResetToken: String,
  passwordResetExpires: Date,
  
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
  toObject: { virtuals: true },
  suppressReservedKeysWarning: true // Add this to suppress the isNew warning
});

// Indexes
userSchema.index({ role: 1 });
userSchema.index({ 'candidateData.applicationId': 1 });
userSchema.index({ email: 1 });

// Virtual for full name
userSchema.virtual('profile.fullName').get(function() {
  return `${this.profile.firstName || ''} ${this.profile.lastName || ''}`.trim();
});

// Virtual for display name
userSchema.virtual('displayName').get(function() {
  if (this.role === 'school') {
    return this.schoolData.schoolName || this.schoolData.schoolNameOther;
  }
  return this.profile.fullName || this.email;
});

// Hash password before saving
userSchema.pre('save', async function(next) {
  // Only hash the password if it has been modified
  if (!this.isModified('password')) {
    return next();
  }
  
  try {
    // Generate salt and hash password
    const salt = await bcrypt.genSalt(12);
    this.password = await bcrypt.hash(this.password, salt);
    
    // Generate application ID for candidates
    if (this.role === 'candidate' && !this.candidateData.applicationId) {
      const date = new Date();
      const year = date.getFullYear().toString().slice(-2);
      const month = (date.getMonth() + 1).toString().padStart(2, '0');
      const day = date.getDate().toString().padStart(2, '0');
      const random = Math.floor(Math.random() * 10000).toString().padStart(4, '0');
      this.candidateData.applicationId = `TH-${year}${month}${day}-${random}`;
    }
    
    // Generate school ID for schools
    if (this.role === 'school' && !this.schoolData.schoolId) {
      const date = new Date();
      const year = date.getFullYear().toString().slice(-2);
      const month = (date.getMonth() + 1).toString().padStart(2, '0');
      const random = Math.floor(Math.random() * 10000).toString().padStart(4, '0');
      this.schoolData.schoolId = `SCH-${year}${month}-${random}`;
    }
    
    next();
  } catch (error) {
    next(error);
  }
});

// Update profileCompleted based on role-specific data
userSchema.pre('save', function(next) {
  if (this.role === 'candidate') {
    this.profile.profileCompleted = !!(
      this.candidateData.degree &&
      this.candidateData.universityName &&
      this.candidateData.positionsInterested?.length > 0 &&
      this.candidateData.cv
    );
  } else if (this.role === 'school') {
    this.profile.profileCompleted = !!(
      (this.schoolData.schoolName || this.schoolData.schoolNameOther) &&
      this.schoolData.schoolType?.length > 0 &&
      this.schoolData.curriculum?.length > 0 &&
      this.schoolData.country &&
      this.schoolData.city
    );
  } else if (this.role === 'system-admin') {
    this.profile.profileCompleted = true;
  }
  next();
});

// Compare password method
userSchema.methods.comparePassword = async function(candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

// Update last login
userSchema.methods.updateLastLogin = async function(ipAddress = '', userAgent = '') {
  this.lastLogin = new Date();
  this.loginCount += 1;
  
  if (this.role === 'system-admin') {
    if (!this.adminData.loginHistory) {
      this.adminData.loginHistory = [];
    }
    this.adminData.loginHistory.unshift({
      timestamp: new Date(),
      ipAddress,
      userAgent
    });
    
    // Keep only last 10 login records
    if (this.adminData.loginHistory.length > 10) {
      this.adminData.loginHistory = this.adminData.loginHistory.slice(0, 10);
    }
  }
  
  return await this.save();
};

// Get user profile based on role (exclude sensitive data)
userSchema.methods.getProfile = function() {
  const userObject = this.toObject();
  
  // Remove sensitive data
  delete userObject.password;
  delete userObject.emailVerificationToken;
  delete userObject.passwordResetToken;
  delete userObject.passwordResetExpires;
  
  return {
    ...userObject,
    displayName: this.displayName
  };
};

// Check if user has specific permission (for admins)
userSchema.methods.hasPermission = function(permission) {
  if (this.role !== 'system-admin') return false;
  return this.adminData.permissions.includes('full_access') || 
         this.adminData.permissions.includes(permission);
};

// Static method to find by application ID
userSchema.statics.findByApplicationId = function(applicationId) {
  return this.findOne({ 'candidateData.applicationId': applicationId });
};

// Static method to find by school ID
userSchema.statics.findBySchoolId = function(schoolId) {
  return this.findOne({ 'schoolData.schoolId': schoolId });
};

// Static method to get candidates
userSchema.statics.getCandidates = function() {
  return this.find({ role: 'candidate' });
};

// Static method to get schools
userSchema.statics.getSchools = function() {
  return this.find({ role: 'school' });
};

// Static method to get admins
userSchema.statics.getAdmins = function() {
  return this.find({ role: 'system-admin' });
};

module.exports = mongoose.model('User', userSchema);