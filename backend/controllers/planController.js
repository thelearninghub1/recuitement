// controllers/planController.js

const Plan = require('../model/Plan');
const asyncHandler = require('../middlewares/asyncHandler');

// @desc    Create plan (Admin only)
exports.createPlan = asyncHandler(async (req, res) => {
  if (req.user.role !== 'system-admin') {
    return res.status(403).json({ success: false, message: 'Admin only' });
  }

  // Check if plan with same name already exists (case insensitive)
  const existingPlan = await Plan.findOne({ 
    name: { $regex: new RegExp(`^${req.body.name}$`, 'i') } 
  });
  
  if (existingPlan) {
    return res.status(400).json({ 
      success: false, 
      message: 'A plan with this name already exists. Please use a different name.' 
    });
  }

  const plan = await Plan.create({
    ...req.body,
    createdBy: req.user._id,
    updatedBy: req.user._id
  });

  res.status(201).json({ success: true, plan });
});

// @desc    Get all plans (Public - always returns all plans, frontend handles filtering)
exports.getPlans = asyncHandler(async (req, res) => {
  // Always return all plans for admin, only active for non-admin
  let query = {};
  
  // If user is not admin, only show active plans
  if (!req.user || req.user.role !== 'system-admin') {
    query = { isActive: true };
  }

  const plans = await Plan.find(query).sort({ displayOrder: 1, createdAt: 1 });
  
  res.status(200).json({ success: true, count: plans.length, plans });
});

// @desc    Get single plan
exports.getPlan = asyncHandler(async (req, res) => {
  const plan = await Plan.findById(req.params.id);
  if (!plan) {
    return res.status(404).json({ success: false, message: 'Plan not found' });
  }
  res.status(200).json({ success: true, plan });
});

// @desc    Update plan (Admin only)
exports.updatePlan = asyncHandler(async (req, res) => {
  if (req.user.role !== 'system-admin') {
    return res.status(403).json({ success: false, message: 'Admin only' });
  }

  // Check if another plan with same name exists (excluding current plan)
  const existingPlan = await Plan.findOne({ 
    _id: { $ne: req.params.id },
    name: { $regex: new RegExp(`^${req.body.name}$`, 'i') } 
  });
  
  if (existingPlan) {
    return res.status(400).json({ 
      success: false, 
      message: 'Another plan with this name already exists. Please use a different name.' 
    });
  }

  const plan = await Plan.findByIdAndUpdate(
    req.params.id,
    { ...req.body, updatedBy: req.user._id },
    { new: true, runValidators: true }
  );

  if (!plan) {
    return res.status(404).json({ success: false, message: 'Plan not found' });
  }

  res.status(200).json({ success: true, plan });
});

// @desc    Delete plan (Admin only)
exports.deletePlan = asyncHandler(async (req, res) => {
  if (req.user.role !== 'system-admin') {
    return res.status(403).json({ success: false, message: 'Admin only' });
  }

  const plan = await Plan.findByIdAndDelete(req.params.id);
  if (!plan) {
    return res.status(404).json({ success: false, message: 'Plan not found' });
  }

  res.status(200).json({ success: true, message: 'Plan deleted successfully' });
});

// @desc    Toggle plan active status (Admin only)
exports.togglePlanActive = asyncHandler(async (req, res) => {
  if (req.user.role !== 'system-admin') {
    return res.status(403).json({ success: false, message: 'Admin only' });
  }

  const plan = await Plan.findById(req.params.id);
  if (!plan) {
    return res.status(404).json({ success: false, message: 'Plan not found' });
  }

  plan.isActive = !plan.isActive;
  await plan.save();

  res.status(200).json({ success: true, plan });
});

// @desc    Set popular plan (Admin only)
exports.setPopularPlan = asyncHandler(async (req, res) => {
  if (req.user.role !== 'system-admin') {
    return res.status(403).json({ success: false, message: 'Admin only' });
  }

  // First, remove popular flag from all plans
  await Plan.updateMany({}, { $set: { popular: false } });
  
  // Then set the selected plan as popular
  const plan = await Plan.findByIdAndUpdate(
    req.params.id,
    { popular: true, updatedBy: req.user._id },
    { new: true }
  );

  if (!plan) {
    return res.status(404).json({ success: false, message: 'Plan not found' });
  }

  res.status(200).json({ success: true, plan, message: 'Popular plan updated successfully' });
});