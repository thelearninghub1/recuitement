const express = require('express');
const {
  submitPayment,
  getPayments,
  getPaymentStats,
  approvePayment,
  denyPayment
} = require('../controllers/paymentController');
const { protect, authorize } = require('../middlewares/auth');
const { uploadPaymentScreenshot } = require('../middlewares/upload');

const router = express.Router();

// School submits payment
router.post('/payments', protect, authorize('school'), uploadPaymentScreenshot, submitPayment);

// Get payments (admin sees all, school sees own)
router.get('/payments', protect, getPayments);

// Admin stats
router.get('/payments/stats', protect, authorize('system-admin'), getPaymentStats);

// Admin actions
router.put('/payments/:id/approve', protect, authorize('system-admin'), approvePayment);
router.put('/payments/:id/deny', protect, authorize('system-admin'), denyPayment);

module.exports = router;