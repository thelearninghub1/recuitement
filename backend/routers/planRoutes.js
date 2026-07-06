const express = require('express');
const {
  createPlan,
  getPlans,
  getPlan, 
  updatePlan,
  deletePlan,
  togglePlanActive,
  setPopularPlan
} = require('../controllers/planController');
const { protect, authorize } = require('../middlewares/auth');

const router = express.Router();

// Public routes
router.get('/plans', getPlans);
router.get('/plans/:id', getPlan);
 
// Admin only
router.post('/plans', protect, authorize('system-admin'), createPlan);
router.put('/plans/:id', protect, authorize('system-admin'), updatePlan);
router.delete('/plans/:id', protect, authorize('system-admin'), deletePlan);
router.patch('/plans/:id/toggle-active', protect, authorize('system-admin'), togglePlanActive);
router.patch('/plans/:id/set-popular', protect, authorize('system-admin'), setPopularPlan);

module.exports = router;