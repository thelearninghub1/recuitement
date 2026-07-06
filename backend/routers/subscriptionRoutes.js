const express = require('express');
const {
  getMySubscription,
  canPostJob,
  incrementJobPost,
  decreaseCvCount
} = require('../controllers/subscriptionController');
const { protect, authorize } = require('../middlewares/auth');

const router = express.Router();

router.get('/subscriptions/me', protect, authorize('school'), getMySubscription);
router.get('/subscriptions/can-post-job', protect, authorize('school'), canPostJob);
router.post('/subscriptions/increment-job', protect, authorize('school'), incrementJobPost);
router.post('/subscriptions/decrease-cv', protect, authorize('school'), decreaseCvCount);

module.exports = router;