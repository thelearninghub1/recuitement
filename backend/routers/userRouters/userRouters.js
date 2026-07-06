const express = require('express');
const {
  register,
  login,
  getMe,
  updateProfile,
  updatePassword,
  forgotPassword,
  resetPassword,
  logout,
  getAllUsers,
  getUser,
  deleteUser,
  getUserStats
} = require('../../controllers/userControllers/UserControllers');

const { protect, authorize } = require('../../middlewares/auth');
const { uploadCandidate, uploadSchool } = require('../../middlewares/upload');

const router = express.Router();

// Public routes
router.post('/auth/register/candidate', uploadCandidate, register);
router.post('/auth/register/school', uploadSchool, register);
router.post('/auth/login', login);
router.post('/auth/forgotpassword', forgotPassword);
router.put('/auth/resetpassword/:resettoken', resetPassword);

// Protected routes (all users)
router.get('/auth/me', protect, getMe);
router.put('/auth/profile', protect,uploadSchool, updateProfile);
router.put('/auth/teacher/profile', protect,uploadCandidate, updateProfile);
router.put('/auth/updatepassword', protect, updatePassword);
router.get('/auth/logout', protect, logout);
 
// Admin only routes 
router.get('/users',  getAllUsers);
router.get('/users/:id', protect, authorize('school'), getUser);

// UnUsed
router.get('/users/stats/dashboard', protect, authorize('system-admin'), getUserStats);
//-----
router.get('/users/:id', protect, authorize('system-admin'), getUser);
router.delete('/users/:id', protect, authorize('system-admin'), deleteUser);

module.exports = router;