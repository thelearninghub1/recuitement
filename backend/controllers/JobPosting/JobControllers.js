const Job = require('../../model/jobsModel');
const Application = require('../../model/applicationModel');
const User = require('../../model/userModel');
const asyncHandler = require('../../middlewares/asyncHandler');
const sendEmail = require('../../utils/sendEmail');
const path = require('path');
const fs = require('fs').promises;

// @desc    Create a job post
// @route   POST /api/jobs
// @access  Private/School
exports.createJob = asyncHandler(async (req, res) => {
  const { 
    jobId, jobTitle, jobTitleOther, gender, category, jobDescription,
    preferredNationality, preferredNationalityOther, estimatedJoiningDate,
    jobType, jobTypeOther, jobApplyType, jobApplyTypeOther, applicationEmail,
    salaryPaidBy, salaryPaidByOther, minSalary, maxSalary, experienceRequired,
    experienceRequiredOther, careerLevel, careerLevelOther, minQualification,
    minQualificationOther, degreeMajor, degreeMajorOther, location, locationOther,
    curriculumRequired, curriculumOther, englishCertRequired, englishCertOther,
    teachingLicenseRequired, teachingLicenseOther, attestedDegreeRequired,
    nonTeachingRole, nonTeachingRoleOther, applicationDeadline, residencyStatus,
    residencyStatusOther, status = 'draft'
  } = req.body;

  // Validate school user
  if (req.user.role !== 'school') {
    return res.status(403).json({
      success: false,
      message: 'Only schools can create job posts'
    });
  }

  // Check if job ID already exists
  if (jobId) {
    const existingJob = await Job.findOne({ jobId });
    if (existingJob) {
      return res.status(400).json({
        success: false,
        message: 'Job ID already exists'
      });
    }
  }

  const jobData = {
    jobId,
    jobTitle,
    jobTitleOther,
    gender,
    category,
    jobDescription,
    preferredNationality,
    preferredNationalityOther,
    estimatedJoiningDate,
    jobType,
    jobTypeOther,
    jobApplyType,
    jobApplyTypeOther,
    applicationEmail,
    salaryPaidBy,
    salaryPaidByOther,
    minSalary,
    maxSalary,
    experienceRequired,
    experienceRequiredOther,
    careerLevel,
    careerLevelOther,
    minQualification,
    minQualificationOther,
    degreeMajor,
    degreeMajorOther,
    location,
    locationOther,
    curriculumRequired: Array.isArray(curriculumRequired) ? curriculumRequired : [curriculumRequired].filter(Boolean),
    curriculumOther,
    englishCertRequired,
    englishCertOther,
    teachingLicenseRequired,
    teachingLicenseOther,
    attestedDegreeRequired,
    nonTeachingRole: Array.isArray(nonTeachingRole) ? nonTeachingRole : [nonTeachingRole].filter(Boolean),
    nonTeachingRoleOther,
    applicationDeadline,
    residencyStatus,
    residencyStatusOther,
    status,
    school: req.user._id,
    createdBy: req.user._id,
    updatedBy: req.user._id
  };

  // Create job
  const job = await Job.create(jobData);

  res.status(201).json({
    success: true,
    message: status === 'draft' ? 'Job saved as draft' : 'Job published successfully',
    job
  });
});

// @desc    Get all jobs (with filters)
// @route   GET /api/jobs
// @access  Public
exports.getJobs = asyncHandler(async (req, res) => {
  const {
    page = 1,
    limit = 10,
    search,
    location,
    jobType,
    category,
    experience,
    salaryMin,
    salaryMax,
    curriculum,
    workMode,
    sort = 'newest',
    status = 'active'
  } = req.query;

  let query = { status: 'active', applicationDeadline: { $gt: new Date() } };

  // Search filter
  if (search) {
    query.$or = [
      { jobTitle: { $regex: search, $options: 'i' } },
      { jobDescription: { $regex: search, $options: 'i' } },
      { 'school.schoolData.schoolName': { $regex: search, $options: 'i' } }
    ];
  }

  // Location filter
  if (location) {
    if (location === 'Remote') {
      query.workMode = 'Remote';
    } else if (location === 'Other') {
      query.locationOther = { $exists: true, $ne: '' };
    } else {
      query.location = location;
    }
  }

  // Job type filter
  if (jobType) {
    if (jobType === 'Other') {
      query.jobTypeOther = { $exists: true, $ne: '' };
    } else {
      query.jobType = jobType;
    }
  }

  // Category filter
  if (category) {
    query.category = category;
  }

  // Experience filter
  if (experience) {
    if (experience === 'Other') {
      query.experienceRequiredOther = { $exists: true, $ne: '' };
    } else {
      query.experienceRequired = experience;
    }
  }

  // Salary range filter
  if (salaryMin || salaryMax) {
    query.$or = [
      { minSalary: { $gte: parseInt(salaryMin) || 0 } },
      { maxSalary: { $lte: parseInt(salaryMax) || 100000 } }
    ];
  }

  // Curriculum filter
  if (curriculum) {
    query.curriculumRequired = { $in: [curriculum] };
  }

  // Work mode filter
  if (workMode) {
    query.workMode = workMode;
  }

  // Sort options
  let sortOption = {};
  switch (sort) {
    case 'newest':
      sortOption = { createdAt: -1 };
      break;
    case 'oldest':
      sortOption = { createdAt: 1 };
      break;
    case 'salary-high':
      sortOption = { maxSalary: -1 };
      break;
    case 'salary-low':
      sortOption = { minSalary: 1 };
      break;
    case 'deadline':
      sortOption = { applicationDeadline: 1 };
      break;
    default:
      sortOption = { createdAt: -1 };
  }

  const jobs = await Job.find(query)
    .populate('school', 'schoolData.schoolName schoolData.logo')
    .limit(parseInt(limit))
    .skip((parseInt(page) - 1) * parseInt(limit))
    .sort(sortOption);

  const total = await Job.countDocuments(query);

  res.status(200).json({
    success: true,
    count: jobs.length,
    total,
    page: parseInt(page),
    pages: Math.ceil(total / parseInt(limit)),
    jobs
  });
});

// Get All Jobs 
exports.getAllJobs = asyncHandler(async (req,res,next)=>{
  const jobs = await Job.find();

  res.status(200).json({
    success: true,
    jobs
  })
})

// @desc    Get single job
// @route   GET /api/jobs/:id
// @access  Public
exports.getJob = asyncHandler(async (req, res) => {
  const job = await Job.findById(req.params.id)
    .populate('school', 'schoolData.schoolName schoolData.logo schoolData.city schoolData.country schoolData.schoolDescription');

  if (!job) {
    return res.status(404).json({
      success: false,
      message: 'Job not found'
    });
  }

  // Increment view count
  await job.incrementViewCount();

  res.status(200).json({
    success: true,
    job
  });
});

// @desc    Update job
// @route   PUT /api/jobs/:id
// @access  Private/School or Admin
exports.updateJob = asyncHandler(async (req, res) => {
  let job = await Job.findById(req.params.id);

  if (!job) {
    return res.status(404).json({
      success: false,
      message: 'Job not found'
    });
  }

  // Check permissions
  if (req.user.role === 'school' && job.school.toString() !== req.user._id.toString()) {
    return res.status(403).json({
      success: false,
      message: 'Not authorized to update this job'
    });
  }
 
  // Update job
  job = await Job.findByIdAndUpdate(
    req.params.id,
    { ...req.body, updatedBy: req.user._id },
    { new: true, runValidators: true }
  );

  res.status(200).json({
    success: true,
    message: 'Job updated successfully',
    job
  });
});

// @desc    Delete job
// @route   DELETE /api/jobs/:id
// @access  Private/School or Admin
exports.deleteJob = asyncHandler(async (req, res) => {
  const job = await Job.findById(req.params.id);

  if (!job) {
    return res.status(404).json({
      success: false,
      message: 'Job not found'
    });
  }

  // Check permissions
  if (req.user.role === 'school' && job.school.toString() !== req.user._id.toString()) {
    return res.status(403).json({
      success: false,
      message: 'Not authorized to delete this job'
    });
  }

  // Delete all applications for this job
  await Application.deleteMany({ job: req.params.id });

  // Delete job
  await job.deleteOne();

  res.status(200).json({
    success: true,
    message: 'Job deleted successfully'
  });
});

// @desc    Get school's jobs
// @route   GET /api/jobs/school/myjobs
// @access  Private/School
exports.getSchoolJobs = asyncHandler(async (req, res) => {
  if (req.user.role !== 'school') {
    return res.status(403).json({
      success: false,
      message: 'Only schools can access their jobs'
    });
  }

  const { page = 1, limit = 10, status } = req.query;

  let query = { school: req.user._id };
  if (status) query.status = status;

  const jobs = await Job.find(query)
    .sort({ createdAt: -1 })
    .limit(parseInt(limit))
    .skip((parseInt(page) - 1) * parseInt(limit));

  const total = await Job.countDocuments(query);

  res.status(200).json({
    success: true,
    count: jobs.length,
    total,
    page: parseInt(page),
    pages: Math.ceil(total / parseInt(limit)),
    jobs
  });
});

// @desc    Get job applications (for school)
// @route   GET /api/jobs/:id/applications
// @access  Private/School
exports.getJobApplications = asyncHandler(async (req, res) => {
  const job = await Job.findById(req.params.id);

  if (!job) {
    return res.status(404).json({
      success: false,
      message: 'Job not found'
    });
  }

  // Check if school owns this job
  if (req.user.role === 'school' && job.school.toString() !== req.user._id.toString()) {
    return res.status(403).json({
      success: false,
      message: 'Not authorized to view applications for this job'
    });
  }

  const {
    page = 1,
    limit = 20,
    status,
    search,
    nationality,
    experience,
    qualification,
    location,
    sort = 'newest'
  } = req.query;

  let query = { job: req.params.id };

  // Status filter
  if (status) {
    query.status = status;
  }

  // Search filter
  if (search) {
    query.$or = [
      { fullName: { $regex: search, $options: 'i' } },
      { email: { $regex: search, $options: 'i' } }
    ];
  }

  // Sort options
  let sortOption = {};
  switch (sort) {
    case 'newest':
      sortOption = { appliedDate: -1 };
      break;
    case 'oldest':
      sortOption = { appliedDate: 1 };
      break;
    case 'rating':
      sortOption = { rating: -1 };
      break;
    default:
      sortOption = { appliedDate: -1 };
  }

  const applications = await Application.find(query)
    .populate({
      path: 'candidate',
      select: 'profile candidateData',
      match: {
        ...(nationality && { 'candidateData.nationality': nationality }),
        ...(experience && { 'candidateData.totalExperience': experience }),
        ...(qualification && { 'candidateData.degree': qualification }),
        ...(location && { 'candidateData.currentCity': location })
      }
    })
    .sort(sortOption)
    .limit(parseInt(limit))
    .skip((parseInt(page) - 1) * parseInt(limit));

  // Filter out applications where candidate doesn't match filters
  const filteredApplications = applications.filter(app => app.candidate !== null);

  const total = await Application.countDocuments({ 
    job: req.params.id,
    ...(status && { status })
  });

  res.status(200).json({
    success: true,
    count: filteredApplications.length,
    total,
    page: parseInt(page),
    pages: Math.ceil(total / parseInt(limit)),
    applications: filteredApplications
  });
});

// @desc    Apply for a job
// @route   POST /api/jobs/:id/apply
// @access  Private/Candidate
exports.applyForJob = asyncHandler(async (req, res) => {
  if (req.user.role !== 'candidate') {
    return res.status(403).json({
      success: false,
      message: 'Only candidates can apply for jobs'
    });
  }

  const job = await Job.findById(req.params.id);

  if (!job) {
    return res.status(404).json({
      success: false,
      message: 'Job not found'
    });
  }

  if (job.status !== 'active') {
    return res.status(400).json({
      success: false,
      message: 'This job is not currently accepting applications'
    });
  }

  if (new Date(job.applicationDeadline) < new Date()) {
    return res.status(400).json({
      success: false,
      message: 'Application deadline has passed'
    });
  }

  // Check if already applied
  const existingApplication = await Application.findOne({
    job: req.params.id,
    candidate: req.user._id
  });

  if (existingApplication) {
    return res.status(400).json({
      success: false,
      message: 'You have already applied for this job'
    });
  }

  const { 
    fullName, 
    email, 
    phoneNumber, 
    currentLocation, 
    additionalInfo 
  } = req.body;

  // Handle file uploads
  if (!req.files || !req.files.resume) {
    return res.status(400).json({
      success: false,
      message: 'Resume is required'
    });
  }

  const resumeFile = req.files.resume[0];
  let coverLetterFile = null;
  
  if (req.files.coverLetter) {
    coverLetterFile = req.files.coverLetter[0];
  }

  const applicationData = {
    job: req.params.id,
    candidate: req.user._id,
    fullName: fullName || `${req.user.profile.firstName} ${req.user.profile.lastName}`,
    email: email || req.user.email,
    phoneNumber: phoneNumber || req.user.profile.mobile,
    currentLocation,
    additionalInfo,
    resume: {
      filename: resumeFile.filename,
      originalName: resumeFile.originalname,
      path: resumeFile.path,
      size: resumeFile.size
    }
  };

  if (coverLetterFile) {
    applicationData.coverLetter = {
      filename: coverLetterFile.filename,
      originalName: coverLetterFile.originalname,
      path: coverLetterFile.path,
      size: coverLetterFile.size
    };
  }

  const application = await Application.create(applicationData);

  // Send notification email to school
  try {
    const school = await User.findById(job.school);
    
    await sendEmail({
      email: school.email,
      subject: `New Application for ${job.jobTitle} - ${job.jobId}`,
      message: `Dear ${school.schoolData.schoolName},

A new candidate has applied for your job posting:

Job Details:
- Job Title: ${job.jobTitle}
- Job ID: ${job.jobId}
- Position: ${job.category}

Candidate Details:
- Name: ${application.fullName}
- Email: ${application.email}
- Phone: ${application.phoneNumber}
- Applied Date: ${new Date().toLocaleDateString()}

You can review this application in your dashboard.

Best regards,
Apex Staffing Network Team`
    });
  } catch (error) {
    console.log('Notification email sending failed:', error.message);
  }

  res.status(201).json({
    success: true,
    message: 'Application submitted successfully',
    application
  });
});

// @desc    Update application status
// @route   PUT /api/applications/:id/status
// @access  Private/School or Admin
exports.updateApplicationStatus = asyncHandler(async (req, res) => {
  const { status, reviewNotes, rating } = req.body;

  const application = await Application.findById(req.params.id)
    .populate('job');

  if (!application) {
    return res.status(404).json({
      success: false,
      message: 'Application not found'
    });
  }

  // Check permissions
  const job = await Job.findById(application.job);
  if (req.user.role === 'school' && job.school.toString() !== req.user._id.toString()) {
    return res.status(403).json({
      success: false,
      message: 'Not authorized to update this application'
    });
  }

  application.status = status;
  application.reviewedBy = req.user._id;
  application.reviewedAt = new Date();
  application.isNew = false;
  
  if (reviewNotes) application.reviewNotes = reviewNotes;
  if (rating) application.rating = rating;

  await application.save();

  // Send notification email to candidate
  if (status === 'shortlisted' || status === 'selected' || status === 'rejected') {
    try {
      const candidate = await User.findById(application.candidate);
      const job = await Job.findById(application.job);
      
      let subject = '';
      let message = '';
      
      switch (status) {
        case 'shortlisted':
          subject = `Congratulations! You've been shortlisted for ${job.jobTitle}`;
          message = `Dear ${candidate.profile.firstName},

Congratulations! Your application for the position of ${job.jobTitle} at ${job.school.schoolData.schoolName} has been shortlisted.

The school will contact you soon for the next steps.

Job Details:
- Position: ${job.jobTitle}
- School: ${job.school.schoolData.schoolName}
- Location: ${job.location}

Best regards,
Apex Staffing Network Team`;
          break;
        
        case 'selected':
          subject = `Offer! You've been selected for ${job.jobTitle}`;
          message = `Dear ${candidate.profile.firstName},

Great news! You have been selected for the position of ${job.jobTitle} at ${job.school.schoolData.schoolName}.

The school will contact you shortly with the offer details.

Job Details:
- Position: ${job.jobTitle}
- School: ${job.school.schoolData.schoolName}
- Location: ${job.location}

Best regards,
Apex Staffing Network Team`;
          break;
        
        case 'rejected':
          subject = `Update on your application for ${job.jobTitle}`;
          message = `Dear ${candidate.profile.firstName},

Thank you for your interest in the ${job.jobTitle} position at ${job.school.schoolData.schoolName}.

After careful consideration, we regret to inform you that your application has not been successful for this position.

We appreciate your time and effort in applying and encourage you to apply for future opportunities that match your profile.

Best regards,
Apex Staffing Network Team`;
          break;
      }

      if (subject && message) {
        await sendEmail({
          email: candidate.email,
          subject,
          message
        });
      }
    } catch (error) {
      console.log('Status update email sending failed:', error.message);
    }
  }

  res.status(200).json({
    success: true,
    message: 'Application status updated successfully',
    application
  });
});

// @desc    Get candidate's applications
// @route   GET /api/applications/myapplications
// @access  Private/Candidate
exports.getMyApplications = asyncHandler(async (req, res) => {
  if (req.user.role !== 'candidate') {
    return res.status(403).json({
      success: false,
      message: 'Only candidates can view their applications'
    });
  }

  const { page = 1, limit = 10, status } = req.query;

  let query = { candidate: req.user._id };
  if (status) query.status = status;

  const applications = await Application.find(query)
    .populate({
      path: 'job',
      select: 'jobId jobTitle location applicationDeadline status school',
      populate: {
        path: 'school',
        select: 'schoolData.schoolName'
      }
    })
    .sort({ appliedDate: -1 })
    .limit(parseInt(limit))
    .skip((parseInt(page) - 1) * parseInt(limit));

  const total = await Application.countDocuments(query);

  res.status(200).json({
    success: true,
    count: applications.length,
    total,
    page: parseInt(page),
    pages: Math.ceil(total / parseInt(limit)),
    applications
  });
});

// @desc    Get job statistics
// @route   GET /api/jobs/stats/overview
// @access  Private/Admin
exports.getJobStats = asyncHandler(async (req, res) => {
  if (req.user.role !== 'system-admin') {
    return res.status(403).json({
      success: false,
      message: 'Only system admins can access job statistics'
    });
  }

  const [
    totalJobs,
    activeJobs,
    draftJobs,
    closedJobs,
    totalApplications,
    pendingApplications,
    schoolsWithJobs,
    featuredJobs,
    jobsByCategory,
    jobsByLocation
  ] = await Promise.all([
    Job.countDocuments(),
    Job.countDocuments({ status: 'active', applicationDeadline: { $gt: new Date() } }),
    Job.countDocuments({ status: 'draft' }),
    Job.countDocuments({ status: 'closed' }),
    Application.countDocuments(),
    Application.countDocuments({ status: 'pending' }),
    Job.distinct('school').then(schools => schools.length),
    Job.countDocuments({ isFeatured: true, status: 'active' }),
    Job.aggregate([
      { $group: { _id: '$category', count: { $sum: 1 } } },
      { $sort: { count: -1 } }
    ]),
    Job.aggregate([
      { $group: { _id: '$location', count: { $sum: 1 } } },
      { $sort: { count: -1 } },
      { $limit: 10 }
    ])
  ]);

  res.status(200).json({
    success: true,
    stats: {
      totalJobs,
      activeJobs,
      draftJobs,
      closedJobs,
      totalApplications,
      pendingApplications,
      schoolsWithJobs,
      featuredJobs,
      jobsByCategory,
      jobsByLocation
    }
  });
});

// @desc    Download applications as CSV
// @route   GET /api/jobs/:id/applications/export
// @access  Private/School
exports.exportApplications = asyncHandler(async (req, res) => {
  const job = await Job.findById(req.params.id);

  if (!job) {
    return res.status(404).json({
      success: false,
      message: 'Job not found'
    });
  }

  // Check permissions
  if (req.user.role === 'school' && job.school.toString() !== req.user._id.toString()) {
    return res.status(403).json({
      success: false,
      message: 'Not authorized to export applications for this job'
    });
  }

  const applications = await Application.find({ job: req.params.id })
    .populate('candidate', 'profile candidateData')
    .sort({ appliedDate: -1 });

  // Create CSV content
  let csvContent = 'Name,Email,Phone,Location,Nationality,Experience,Qualification,Applied Date,Status,Rating,Notes\n';
  
  applications.forEach(app => {
    const candidate = app.candidate;
    const row = [
      `"${app.fullName}"`,
      `"${app.email}"`,
      `"${app.phoneNumber}"`,
      `"${app.currentLocation || ''}"`,
      `"${candidate?.candidateData?.nationality || ''}"`,
      `"${candidate?.candidateData?.totalExperience || ''}"`,
      `"${candidate?.candidateData?.degree || ''}"`,
      `"${new Date(app.appliedDate).toLocaleDateString()}"`,
      `"${app.status}"`,
      `"${app.rating || ''}"`,
      `"${app.reviewNotes || ''}"`
    ].join(',');
    
    csvContent += row + '\n';
  });

  res.setHeader('Content-Type', 'text/csv');
  res.setHeader('Content-Disposition', `attachment; filename=applications-${job.jobId}-${Date.now()}.csv`);
  
  res.status(200).send(csvContent);
});