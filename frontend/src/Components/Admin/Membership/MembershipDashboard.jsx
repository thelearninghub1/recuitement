// MembershipDashboard.jsx
import React, { useState, useEffect } from 'react';
import { 
  Plus, Edit2, Trash2, Save, X, Download, Check, AlertCircle, 
  Star, Crown, Sparkles, ArrowLeft, Calendar, RefreshCw, Search, FileText,
  Percent
} from 'lucide-react';
import PropTypes from 'prop-types';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { 
  getAllPlans, 
  createPlan, 
  updatePlan, 
  deletePlan,
  setPopularPlan,
  clearPlanErrors 
} from '../../../actions/planActions';
import { 
  CREATE_PLAN_RESET, 
  UPDATE_PLAN_RESET, 
  DELETE_PLAN_RESET 
} from '../../../constants/planConstants';
import { toast } from 'react-toastify';

// Modal component for creating/editing plans
const PlanModal = ({ isOpen, onClose, onSave, plan, isEditing, loading, error }) => {
  const [formData, setFormData] = useState({
    name: plan?.name || '',
    description: plan?.description || '',
    features: plan?.features?.length ? plan.features : [''],
    priceMonthly: plan?.prices?.monthly || '',
    priceYearly: plan?.prices?.yearly || '',
    maxCvsDownloadMonthly: plan?.limits?.maxCvsDownloadMonthly || 10,
    maxCvsDownloadYearly: plan?.limits?.maxCvsDownloadYearly || 120,
    savings: plan?.savings || 0,
  });

  const [localError, setLocalError] = useState('');

  useEffect(() => {
    if (plan) {
      setFormData({
        name: plan.name || '',
        description: plan.description || '',
        features: plan.features?.length ? plan.features : [''],
        priceMonthly: plan.prices?.monthly || '',
        priceYearly: plan.prices?.yearly || '',
        maxCvsDownloadMonthly: plan.limits?.maxCvsDownloadMonthly || 10,
        maxCvsDownloadYearly: plan.limits?.maxCvsDownloadYearly || 120,
        savings: plan.savings || 0,
      });
    } else {
      setFormData({
        name: '',
        description: '',
        features: [''],
        priceMonthly: '',
        priceYearly: '',
        maxCvsDownloadMonthly: 10,
        maxCvsDownloadYearly: 120,
        savings: 0,
      });
    }
  }, [plan]);

  useEffect(() => {
    if (isOpen) {
      setLocalError('');
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  const handleFeatureChange = (index, value) => {
    const newFeatures = [...formData.features];
    newFeatures[index] = value;
    setFormData({ ...formData, features: newFeatures });
  };

  const addFeature = () => {
    setFormData({ ...formData, features: [...formData.features, ''] });
  };

  const removeFeature = (index) => {
    const newFeatures = formData.features.filter((_, i) => i !== index);
    setFormData({ ...formData, features: newFeatures });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!formData.name.trim()) {
      setLocalError('Plan name is required');
      return;
    }
    
    const filteredFeatures = formData.features.filter(f => f.trim());
    if (filteredFeatures.length === 0) {
      setLocalError('At least one feature is required');
      return;
    }
    
    // Format data according to backend schema
    const submitData = {
      name: formData.name.trim(),
      description: formData.description,
      features: filteredFeatures,
      currency: 'SAR',
      isActive: true, // Always active
      prices: {
        monthly: formData.priceMonthly ? Number(formData.priceMonthly) : null,
        yearly: formData.priceYearly ? Number(formData.priceYearly) : null
      },
      limits: {
        maxCvsDownloadMonthly: Number(formData.maxCvsDownloadMonthly),
        maxCvsDownloadYearly: Number(formData.maxCvsDownloadYearly)
      },
      savings: Number(formData.savings)
    };
    
    onSave(submitData);
  };

  if (!isOpen) return null;

  return (
    <div 
      className="fixed inset-0 z-[9999] flex items-center justify-center p-4" 
      style={{ 
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.6)',
        backdropFilter: 'blur(8px)',
        zIndex: 9999
      }}
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div 
        className="bg-gradient-to-br from-white to-gray-50 rounded-2xl w-full max-w-2xl max-h-[85vh] overflow-y-auto shadow-2xl"
      >
        <div className="sticky top-0 bg-gradient-to-r from-blue-600 to-purple-600 rounded-t-2xl px-6 py-4 z-10">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-2">
              {isEditing ? <Edit2 className="text-white" size={24} /> : <Plus className="text-white" size={24} />}
              <h2 className="text-xl font-bold text-white">{isEditing ? 'Edit Plan' : 'Create New Plan'}</h2>
            </div>
            <button 
              onClick={onClose} 
              className="text-white/80 hover:text-white hover:bg-white/10 rounded-lg p-1 transition-all"
            >
              <X size={24} />
            </button>
          </div>
        </div>
        
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {(localError || error) && (
            <div className="bg-red-50 border border-red-200 rounded-xl p-3 flex items-center gap-2 text-red-600">
              <AlertCircle size={18} />
              <span className="text-sm">{localError || error}</span>
            </div>
          )}
          
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Plan Name *</label>
            <input
              type="text"
              required
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="w-full px-4 py-2 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all"
              placeholder="e.g., Professional"
              disabled={loading}
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Description</label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="w-full px-4 py-2 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all"
              rows={3}
              placeholder="Describe the plan benefits..."
              disabled={loading}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-blue-50 p-4 rounded-xl">
              <label className="block text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
                <Calendar size={16} className="text-blue-600" />
                Monthly Price (SAR)
              </label>
              <input
                type="number"
                value={formData.priceMonthly}
                onChange={(e) => setFormData({ ...formData, priceMonthly: e.target.value })}
                className="w-full px-4 py-2 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all"
                placeholder="e.g., 79"
                disabled={loading}
              />
            </div>
            <div className="bg-purple-50 p-4 rounded-xl">
              <label className="block text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
                <Calendar size={16} className="text-purple-600" />
                Yearly Price (SAR)
              </label>
              <input
                type="number"
                value={formData.priceYearly}
                onChange={(e) => setFormData({ ...formData, priceYearly: e.target.value })}
                className="w-full px-4 py-2 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all"
                placeholder="e.g., 790"
                disabled={loading}
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-blue-50 p-4 rounded-xl">
              <label className="block text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
                <Download size={16} className="text-blue-600" />
                Monthly CV Downloads
              </label>
              <input
                type="number"
                required
                min="0"
                value={formData.maxCvsDownloadMonthly}
                onChange={(e) => setFormData({ ...formData, maxCvsDownloadMonthly: Number(e.target.value) })}
                className="w-full px-4 py-2 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all"
                disabled={loading}
              />
            </div>
            <div className="bg-purple-50 p-4 rounded-xl">
              <label className="block text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
                <Download size={16} className="text-purple-600" />
                Yearly CV Downloads
              </label>
              <input
                type="number"
                required
                min="0"
                value={formData.maxCvsDownloadYearly}
                onChange={(e) => setFormData({ ...formData, maxCvsDownloadYearly: Number(e.target.value) })}
                className="w-full px-4 py-2 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all"
                disabled={loading}
              />
            </div>
            <div className="bg-green-50 p-4 rounded-xl">
              <label className="block text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
                <Percent size={16} className="text-green-600" />
                Savings (%)
              </label>
              <input
                type="number"
                min="0"
                max="100"
                value={formData.savings}
                onChange={(e) => setFormData({ ...formData, savings: Number(e.target.value) })}
                className="w-full px-4 py-2 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all"
                placeholder="e.g., 20"
                disabled={loading}
              />
              <p className="text-xs text-gray-500 mt-1">Discount percentage on yearly plan</p>
            </div>
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Features</label>
            {formData.features.map((feature, index) => (
              <div key={index} className="flex gap-2 mb-2">
                <input
                  type="text"
                  value={feature}
                  onChange={(e) => handleFeatureChange(index, e.target.value)}
                  className="flex-1 px-4 py-2 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all"
                  placeholder={`Feature ${index + 1}`}
                  disabled={loading}
                />
                <button
                  type="button"
                  onClick={() => removeFeature(index)}
                  className="px-4 py-2 text-red-600 hover:bg-red-50 rounded-xl transition-all"
                  disabled={loading}
                >
                  <Trash2 size={18} />
                </button>
              </div>
            ))}
            <button
              type="button"
              onClick={addFeature}
              className="mt-2 text-sm text-blue-600 hover:text-blue-700 flex items-center gap-1 font-semibold"
              disabled={loading}
            >
              <Plus size={16} /> Add Feature
            </button>
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t-2">
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-2 text-gray-700 bg-gray-100 rounded-xl hover:bg-gray-200 transition-all font-semibold"
              disabled={loading}
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-6 py-2 text-white bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl hover:shadow-lg transition-all flex items-center gap-2 font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? <RefreshCw size={18} className="animate-spin" /> : <Save size={18} />} 
              {isEditing ? 'Update Plan' : 'Create Plan'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

PlanModal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  onSave: PropTypes.func.isRequired,
  plan: PropTypes.object,
  isEditing: PropTypes.bool.isRequired,
  loading: PropTypes.bool,
  error: PropTypes.string,
};

// Delete confirmation modal
const DeleteConfirmModal = ({ isOpen, onClose, onConfirm, planName, loading }) => {
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div 
      className="fixed inset-0 z-[9999] flex items-center justify-center p-4"
      style={{ 
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.6)',
        backdropFilter: 'blur(8px)',
        zIndex: 9999
      }}
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="bg-white rounded-2xl w-full max-w-md shadow-2xl">
        <div className="p-6">
          <div className="flex items-center justify-center mb-4">
            <div className="bg-red-100 rounded-full p-3">
              <AlertCircle size={48} className="text-red-600" />
            </div>
          </div>
          <h3 className="text-xl font-bold text-center mb-2">Delete Plan</h3>
          <p className="text-gray-600 text-center mb-6">
            Are you sure you want to delete <span className="font-semibold text-gray-900">"{planName}"</span>? This action cannot be undone.
          </p>
          <div className="flex gap-3">
            <button
              onClick={onClose}
              className="flex-1 px-4 py-2 text-gray-700 bg-gray-100 rounded-xl hover:bg-gray-200 transition-all font-semibold"
              disabled={loading}
            >
              Cancel
            </button>
            <button
              onClick={onConfirm}
              disabled={loading}
              className="flex-1 px-4 py-2 text-white bg-red-600 rounded-xl hover:bg-red-700 transition-all font-semibold disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {loading && <RefreshCw size={16} className="animate-spin" />}
              Delete
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

DeleteConfirmModal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  onConfirm: PropTypes.func.isRequired,
  planName: PropTypes.string.isRequired,
  loading: PropTypes.bool,
};

// Plan card component - Fixed positioning
const PlanCard = ({ plan, onEdit, onDelete, onSetPopular, popularLoading }) => {
  const getBadgeColor = () => {
    if (plan.popular) return 'from-amber-500 to-orange-500';
    return 'from-blue-500 to-purple-600';
  };

  // Calculate savings display
  const getSavingsDisplay = () => {
    if (plan.savings && plan.savings > 0) {
      return (
        <div className="absolute top-4 right-4 z-10">
          <div className="bg-green-500 text-white px-2 py-1 rounded-full text-xs font-bold flex items-center gap-1 shadow-lg">
            <Percent size={10} />
            Save {plan.savings}%
          </div>
        </div>
      );
    }
    return null;
  };

  return (
    <div className={`group relative bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 overflow-hidden ${
      plan.popular ? 'ring-2 ring-purple-500' : ''
    }`}>
      {plan.popular && (
        <div className="absolute top-4 right-4 z-10">
          <div className="bg-gradient-to-r from-amber-500 to-orange-500 text-white px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1 shadow-lg">
            <Star size={12} fill="currentColor" /> POPULAR
          </div>
        </div>
      )}
      
      <div className={`bg-gradient-to-r ${getBadgeColor()} p-6 text-white relative`}>
        {/* Savings badge - positioned at top right but below popular badge if both exist */}
        {plan.savings > 0 && !plan.popular && getSavingsDisplay()}
        {plan.savings > 0 && plan.popular && (
          <div className="absolute top-16 right-4 z-10">
            <div className="bg-green-500 text-white px-2 py-1 rounded-full text-xs font-bold flex items-center gap-1 shadow-lg">
              <Percent size={10} />
              Save {plan.savings}%
            </div>
          </div>
        )}
        
        <div>
          <h3 className="text-2xl font-bold mb-1 pr-20">{plan.name}</h3>
          <p className="text-white/80 text-sm">{plan.description}</p>
        </div>
      </div>
      
      <div className="p-6">
        <div className="mb-4">
          <div className="flex items-baseline gap-3 flex-wrap">
            {plan.prices?.monthly && (
              <div className="bg-blue-50 rounded-xl p-3 flex-1 text-center">
                <span className="text-xs text-gray-500 block">Monthly</span>
                <span className="text-2xl font-bold text-gray-900">
                  SAR {plan.prices.monthly}
                </span>
              </div>
            )}
            {plan.prices?.yearly && (
              <div className="bg-purple-50 rounded-xl p-3 flex-1 text-center relative">
                <span className="text-xs text-gray-500 block">Yearly</span>
                <span className="text-2xl font-bold text-gray-900">
                  SAR {plan.prices.yearly}
                </span>
                {plan.savings > 0 && (
                  <div className="absolute -top-2 -right-2 bg-green-500 text-white text-xs px-2 py-0.5 rounded-full shadow-md">
                    -{plan.savings}%
                  </div>
                )}
              </div>
            )}
            {!plan.prices?.monthly && !plan.prices?.yearly && (
              <span className="text-gray-500">Contact for pricing</span>
            )}
          </div>
        </div>
        
        <div className="mb-4 space-y-2">
          <div className="flex items-center gap-2 text-sm text-gray-600 bg-blue-50 rounded-xl p-3">
            <Download size={18} className="text-blue-600" />
            <span className="font-semibold">Monthly: Up to {plan.limits?.maxCvsDownloadMonthly || 0} CVs</span>
          </div>
          <div className="flex items-center gap-2 text-sm text-gray-600 bg-purple-50 rounded-xl p-3">
            <Download size={18} className="text-purple-600" />
            <span className="font-semibold">Yearly: Up to {plan.limits?.maxCvsDownloadYearly || 0} CVs</span>
          </div>
        </div> 
        
        <div className="space-y-2 mb-6">
          <h4 className="text-sm font-bold text-gray-700 flex items-center gap-2">
            <Sparkles size={16} className="text-purple-500" />
            Features:
          </h4>
          <ul className="space-y-2">
            {plan.features?.slice(0, 4).map((feature, idx) => (
              <li key={idx} className="text-sm text-gray-600 flex items-start gap-2">
                <Check size={16} className="text-green-500 mt-0.5 flex-shrink-0" />
                <span>{feature}</span>
              </li>
            ))}
            {plan.features?.length > 4 && (
              <li className="text-sm text-blue-600">
                +{plan.features.length - 4} more features
              </li>
            )}
          </ul>
        </div>
        
        <div className="flex gap-2 pt-4 border-t-2">
          <button
            onClick={() => onSetPopular(plan._id)}
            disabled={popularLoading || plan.popular}
            className={`flex-1 px-3 py-2 rounded-xl transition-all font-semibold flex items-center justify-center gap-1 text-sm ${
              plan.popular 
                ? 'bg-amber-500 text-white cursor-default' 
                : 'border-2 border-amber-500 text-amber-600 hover:bg-amber-500 hover:text-white'
            } disabled:opacity-50 disabled:cursor-not-allowed`}
          >
            {popularLoading ? <RefreshCw size={14} className="animate-spin" /> : <Star size={14} />}
            {plan.popular ? 'Popular' : 'Set Popular'}
          </button>
          <button
            onClick={onEdit}
            className="flex-1 px-3 py-2 text-blue-600 border-2 border-blue-600 rounded-xl hover:bg-blue-600 hover:text-white transition-all font-semibold flex items-center justify-center gap-1 text-sm"
          >
            <Edit2 size={14} /> Edit
          </button>
          <button
            onClick={onDelete}
            className="flex-1 px-3 py-2 text-red-600 border-2 border-red-600 rounded-xl hover:bg-red-600 hover:text-white transition-all font-semibold flex items-center justify-center gap-1 text-sm"
          >
            <Trash2 size={14} /> Delete
          </button>
        </div>
      </div>
    </div>
  );
};

PlanCard.propTypes = {
  plan: PropTypes.object.isRequired,
  onEdit: PropTypes.func.isRequired,
  onDelete: PropTypes.func.isRequired,
  onSetPopular: PropTypes.func.isRequired,
  popularLoading: PropTypes.bool,
};

// Main Dashboard Component
const MembershipDashboard = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  
  // Redux Selectors
  const getAllPlansState = useSelector((state) => state.getAllPlans);
  const { loading: plansLoading, plans = [], error: plansError } = getAllPlansState;
  
  const createPlanState = useSelector((state) => state.createPlan);
  const { loading: createLoading, success: createSuccess, error: createError } = createPlanState;
  
  const updatePlanState = useSelector((state) => state.updatePlan);
  const { loading: updateLoading, success: updateSuccess, error: updateError } = updatePlanState;
  
  const deletePlanState = useSelector((state) => state.deletePlan);
  const { loading: deleteLoading, success: deleteSuccess, message: deleteMessage, error: deleteError } = deletePlanState;
  
  const setPopularPlanState = useSelector((state) => state.setPopularPlan);
  const { loading: popularLoading, success: popularSuccess, error: popularError } = setPopularPlanState;

  // Local state for frontend filtering
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [editingPlan, setEditingPlan] = useState(null);
  const [planToDelete, setPlanToDelete] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');

  // Load plans on component mount
  useEffect(() => {
    dispatch(getAllPlans());
  }, [dispatch]);

  // Handle create success
  useEffect(() => {
    if (createSuccess) {
      toast.success('Plan created successfully!');
      dispatch({ type: CREATE_PLAN_RESET });
      setIsModalOpen(false);
      setEditingPlan(null);
      dispatch(getAllPlans());
    }
    if (createError) {
      toast.error(createError);
      setTimeout(() => dispatch(clearPlanErrors()), 3000);
    }
  }, [dispatch, createSuccess, createError]);

  // Handle update success
  useEffect(() => {
    if (updateSuccess) {
      toast.success('Plan updated successfully!');
      dispatch({ type: UPDATE_PLAN_RESET });
      setIsModalOpen(false);
      setEditingPlan(null);
      dispatch(getAllPlans());
    }
    if (updateError) {
      toast.error(updateError);
      setTimeout(() => dispatch(clearPlanErrors()), 3000);
    }
  }, [dispatch, updateSuccess, updateError]);

  // Handle delete success
  useEffect(() => {
    if (deleteSuccess) {
      toast.success(deleteMessage || 'Plan deleted successfully!');
      dispatch({ type: DELETE_PLAN_RESET });
      setIsDeleteModalOpen(false);
      setPlanToDelete(null);
      dispatch(getAllPlans());
    }
    if (deleteError) {
      toast.error(deleteError);
      setTimeout(() => dispatch(clearPlanErrors()), 3000);
    }
  }, [dispatch, deleteSuccess, deleteMessage, deleteError]);

  // Handle set popular success
  useEffect(() => {
    if (popularSuccess) {
      toast.success('Popular plan updated successfully!');
      dispatch(getAllPlans());
    }
    if (popularError) {
      toast.error(popularError);
      setTimeout(() => dispatch(clearPlanErrors()), 3000);
    }
  }, [dispatch, popularSuccess, popularError]);

  const handleSavePlan = (planData) => {
    if (editingPlan) {
      dispatch(updatePlan(editingPlan._id, planData));
    } else {
      dispatch(createPlan(planData));
    }
  };

  const handleDeletePlan = () => {
    if (planToDelete) {
      dispatch(deletePlan(planToDelete._id));
    }
  };

  const handleSetPopular = (planId) => {
    dispatch(setPopularPlan(planId));
  };

  const openEditModal = (plan) => {
    setEditingPlan(plan);
    setIsModalOpen(true);
  };

  const openDeleteModal = (plan) => {
    setPlanToDelete(plan);
    setIsDeleteModalOpen(true);
  };

  // Frontend filtering only
  const filteredPlans = (plans || []).filter(plan => {
    const matchesSearch = searchTerm === '' || 
      plan.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      plan.description?.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesSearch;
  });

  const totalPlans = plans?.length || 0;
  const totalMonthlyCvsAllowance = (plans || []).reduce((sum, p) => sum + (p.limits?.maxCvsDownloadMonthly || 0), 0);
  const totalYearlyCvsAllowance = (plans || []).reduce((sum, p) => sum + (p.limits?.maxCvsDownloadYearly || 0), 0);
  const popularPlanCount = (plans || []).filter(p => p.popular).length;

  const isLoading = plansLoading || createLoading || updateLoading;

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-32 pb-12">
        {/* Header with Back Button */}
        <div className="mb-8">
          <button
            onClick={() => navigate('/system-admin-dashboard')}
            className="mb-6 inline-flex items-center gap-2 px-4 py-2 text-gray-700 bg-white rounded-xl hover:bg-gray-50 hover:shadow-md transition-all font-semibold border border-gray-200"
          >
            <ArrowLeft size={18} /> Back to Dashboard
          </button>
          
          <div className="flex justify-between items-center flex-wrap gap-4">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-2 rounded-xl">
                  <Crown size={28} className="text-white" />
                </div>
                <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent">
                  Membership Plans
                </h1>
              </div>
              <p className="text-gray-600 text-lg">Manage your subscription plans and pricing strategies</p>
            </div>
            <button
              onClick={() => {
                setEditingPlan(null);
                setIsModalOpen(true);
              }}
              disabled={isLoading}
              className="px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl hover:shadow-lg transition-all flex items-center gap-2 font-semibold transform hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Plus size={20} /> Create New Plan
            </button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-2xl shadow-md p-6 hover:shadow-xl transition-all">
            <div className="flex items-center justify-between mb-4">
              <div className="bg-blue-100 rounded-xl p-3">
                <Crown size={24} className="text-blue-600" />
              </div>
            </div>
            <h3 className="text-gray-600 font-medium">Total Plans</h3>
            <p className="text-2xl font-bold text-gray-900">{totalPlans}</p>
          </div>
          
          <div className="bg-white rounded-2xl shadow-md p-6 hover:shadow-xl transition-all">
            <div className="flex items-center justify-between mb-4">
              <div className="bg-amber-100 rounded-xl p-3">
                <Star size={24} className="text-amber-600" />
              </div>
            </div>
            <h3 className="text-gray-600 font-medium">Popular Plans</h3>
            <p className="text-2xl font-bold text-gray-900">{popularPlanCount}</p>
          </div>
          
          <div className="bg-white rounded-2xl shadow-md p-6 hover:shadow-xl transition-all">
            <div className="flex items-center justify-between mb-4">
              <div className="bg-blue-100 rounded-xl p-3">
                <Download size={24} className="text-blue-600" />
              </div>
            </div>
            <h3 className="text-gray-600 font-medium">Monthly CV Limit</h3>
            <p className="text-2xl font-bold text-gray-900">{totalMonthlyCvsAllowance}</p>
          </div>
          
          <div className="bg-white rounded-2xl shadow-md p-6 hover:shadow-xl transition-all">
            <div className="flex items-center justify-between mb-4">
              <div className="bg-purple-100 rounded-xl p-3">
                <Download size={24} className="text-purple-600" />
              </div>
            </div>
            <h3 className="text-gray-600 font-medium">Yearly CV Limit</h3>
            <p className="text-2xl font-bold text-gray-900">{totalYearlyCvsAllowance}</p>
          </div>
        </div>

        {/* Search Filter */}
        <div className="bg-white rounded-2xl shadow-md p-6 mb-8">
          <div className="flex flex-wrap gap-4 items-center">
            <div className="flex-1 min-w-[250px] relative">
              <Search size={18} className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search plans by name or description..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-12 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all"
              />
            </div>
            {searchTerm && (
              <button
                onClick={() => setSearchTerm('')}
                className="px-6 py-3 border-2 border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 transition-all font-semibold"
              >
                Clear Search
              </button>
            )}
          </div>
          {searchTerm && (
            <div className="mt-4 pt-4 border-t border-gray-200">
              <p className="text-sm text-gray-600">
                Showing {filteredPlans.length} of {plans?.length || 0} plans
              </p>
            </div>
          )}
        </div>

        {/* Error State */}
        {plansError && (
          <div className="bg-red-50 border border-red-200 rounded-2xl p-6 mb-8 text-center">
            <AlertCircle size={48} className="text-red-500 mx-auto mb-4" />
            <p className="text-red-600 mb-4">Error loading plans: {plansError}</p>
            <button
              onClick={() => dispatch(getAllPlans())}
              className="px-6 py-2 bg-red-600 text-white rounded-xl hover:bg-red-700 transition-all"
            >
              Retry
            </button>
          </div>
        )}

        {/* Loading State */}
        {plansLoading && !plansError && (
          <div className="bg-white rounded-2xl shadow-md p-12 text-center">
            <RefreshCw size={48} className="animate-spin text-blue-500 mx-auto mb-4" />
            <p className="text-gray-500 text-lg">Loading plans...</p>
          </div>
        )}

        {/* Plans Grid */}
        {!plansLoading && !plansError && filteredPlans.length === 0 && (
          <div className="bg-white rounded-2xl shadow-md p-12 text-center">
            <div className="text-gray-400 mb-4">
              <FileText size={64} className="mx-auto" />
            </div>
            <p className="text-gray-500 text-lg mb-4">No membership plans found.</p>
            <button
              onClick={() => {
                setEditingPlan(null);
                setIsModalOpen(true);
              }}
              className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl hover:shadow-lg transition-all font-semibold"
            >
              <Plus size={18} /> Create your first plan
            </button>
          </div>
        )}

        {!plansLoading && !plansError && filteredPlans.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredPlans.map(plan => (
              <PlanCard
                key={plan._id}
                plan={plan}
                onEdit={() => openEditModal(plan)}
                onDelete={() => openDeleteModal(plan)}
                onSetPopular={() => handleSetPopular(plan._id)}
                popularLoading={popularLoading}
              />
            ))}
          </div>
        )}
      </div>

      {/* Modals */}
      <PlanModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setEditingPlan(null);
        }}
        onSave={handleSavePlan}
        plan={editingPlan}
        isEditing={!!editingPlan}
        loading={createLoading || updateLoading}
        error={createError || updateError}
      />

      <DeleteConfirmModal
        isOpen={isDeleteModalOpen}
        onClose={() => {
          setIsDeleteModalOpen(false);
          setPlanToDelete(null);
        }}
        onConfirm={handleDeletePlan}
        planName={planToDelete?.name || ''}
        loading={deleteLoading}
      />
    </div>
  );
};

export default MembershipDashboard;