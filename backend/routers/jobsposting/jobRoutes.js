const express = require('express');
const {
  createJob,
  getJobs,
  getJob,
  updateJob,
  deleteJob,
  getSchoolJobs,
  getJobApplications,
  applyForJob,
  updateApplicationStatus,
  getMyApplications,
  getJobStats,
  exportApplications,
  getAllJobs
} = require('../../controllers/JobPosting/JobControllers');

const { protect, authorize } = require('../../middlewares/auth');
const { uploadJobApplication } = require('../../middlewares/upload');

const router = express.Router();


// Public routes
router.get('/jobs', getJobs);
router.get('/all/jobs', getAllJobs);
router.get('/jobs/:id', getJob);



// Protected routes - Candidate
router.post('/jobs/:id/apply', protect, authorize('candidate'), uploadJobApplication, applyForJob);
router.get('/applications/myapplications', protect, authorize('candidate'), getMyApplications);

// Protected routes - School
router.post('/create/job', protect, authorize('school'), createJob);
router.get('/jobs/school/myjobs', protect, authorize('school'), getSchoolJobs);
router.get('/jobs/:id/applications', protect, authorize('school' , 'system-admin'), getJobApplications);
router.put('/applications/:id/status', protect, authorize('school'), updateApplicationStatus);
router.get('/jobs/:id/applications/export', protect, authorize('school'), exportApplications);
 
// Admin routes 

router.get('/jobs/stats/overview', protect, authorize('system-admin'), getJobStats);
router.put('/admin/jobs/:id', protect, authorize('system-admin'), updateJob);
router.delete('/admin/jobs/:id', protect, authorize('system-admin'), deleteJob);


module.exports = router;