import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { 
  FaCheck, 
  FaArrowLeft,
  FaClock,
  FaShieldAlt,
  FaBuilding,
  FaStar,
  FaRocket,
  FaGem,
  FaCalendarAlt,
  FaMoneyBillWave,
  FaPercent,
  FaDownload,
  FaStarOfLife,
  FaRegGem
} from 'react-icons/fa';
import { toast } from 'react-toastify';
import { getAllPlans } from '../../actions/planActions';

const SchoolMembership = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  
  // Redux state
  const { loading: plansLoading, plans = [] } = useSelector((state) => state.getAllPlans);
  
  const [selectedPlan, setSelectedPlan] = useState(null);
  const [selectedDuration, setSelectedDuration] = useState('yearly');
  const [processing, setProcessing] = useState(false);
  const [showAllFeatures, setShowAllFeatures] = useState({});

  // Load plans on component mount
  useEffect(() => {
    dispatch(getAllPlans());
  }, [dispatch]);

  // Toggle features visibility
  const toggleFeatures = (planId) => {
    setShowAllFeatures(prev => ({
      ...prev,
      [planId]: !prev[planId]
    }));
  };

  // Transform API plans to UI format
  const transformPlansToUI = () => {
    if (!plans || plans.length === 0) return [];
    
    const sortedPlans = [...plans].sort((a, b) => (a.displayOrder || 0) - (b.displayOrder || 0));
    
    return sortedPlans.map((plan) => {
      // Determine icon and color based on plan name/popular
      let icon = <FaBuilding className="text-blue-500" />;
      let color = 'from-blue-500 to-blue-600';
      let popular = plan.popular || false;
      
      if (plan.popular) {
        icon = <FaStar className="text-yellow-500" />;
        color = 'from-purple-500 to-purple-600';
      } else if (plan.name.toLowerCase().includes('premium')) {
        icon = <FaGem className="text-amber-500" />;
        color = 'from-amber-500 to-amber-600';
      } else if (plan.name.toLowerCase().includes('enterprise')) {
        icon = <FaRegGem className="text-purple-500" />;
        color = 'from-purple-600 to-purple-700';
      }
      
      // Calculate savings percentage
      let savings = 0;
      if (plan.prices?.monthly && plan.prices?.yearly) {
        const monthlyTotal = plan.prices.monthly * 12;
        const yearlyPrice = plan.prices.yearly;
        savings = Math.round(((monthlyTotal - yearlyPrice) / monthlyTotal) * 100);
      }
      
      // Build features array from API
      const features = [...(plan.features || [])];
      
      // Add limit-based features
      if (plan.limits) {
        if (plan.limits.maxJobs && plan.limits.maxJobs !== -1) {
          features.push(`Post up to ${plan.limits.maxJobs} job openings`);
        } else if (plan.limits.maxJobs === -1) {
          features.push('Unlimited job openings');
        }
        if (plan.limits.maxCvsDownloadMonthly && plan.limits.maxCvsDownloadMonthly !== -1) {
          features.push(`Download up to ${plan.limits.maxCvsDownloadMonthly} CVs per month`);
        } else if (plan.limits.maxCvsDownloadMonthly === -1) {
          features.push('Unlimited CV downloads per month');
        }
        if (plan.limits.maxCvsDownloadYearly && plan.limits.maxCvsDownloadYearly !== -1) {
          features.push(`Download up to ${plan.limits.maxCvsDownloadYearly} CVs per year`);
        } else if (plan.limits.maxCvsDownloadYearly === -1) {
          features.push('Unlimited CV downloads per year');
        }
      }
      
      return {
        id: plan._id,
        name: plan.name,
        description: plan.description || `Perfect for ${plan.name.toLowerCase()} educational institutions`,
        prices: {
          monthly: plan.prices?.monthly || null,
          yearly: plan.prices?.yearly || null
        },
        currency: 'SAR',
        features: features,
        popular: popular,
        icon: icon,
        color: color,
        savings: savings,
        limits: plan.limits
      };
    });
  };

  const membershipPlans = transformPlansToUI();

  const handleSelectPlan = (plan) => {
    setSelectedPlan(plan);
    // Smooth scroll to summary on mobile
    if (window.innerWidth < 768) {
      setTimeout(() => {
        document.getElementById('selected-plan-summary')?.scrollIntoView({ 
          behavior: 'smooth', 
          block: 'nearest' 
        });
      }, 100);
    }
  };

  const handleDurationChange = (duration) => {
    setSelectedDuration(duration);
  };

  const getCurrentPrice = () => {
    if (!selectedPlan) return 0;
    return selectedDuration === 'monthly' 
      ? selectedPlan.prices.monthly 
      : selectedPlan.prices.yearly;
  };

  const getMonthlyEquivalent = () => {
    if (!selectedPlan || selectedDuration === 'monthly') return null;
    const yearlyPrice = selectedPlan.prices.yearly;
    const monthlyEquivalent = (yearlyPrice / 12).toFixed(2);
    const monthlyPrice = selectedPlan.prices.monthly;
    const savings = ((monthlyPrice * 12 - yearlyPrice) / (monthlyPrice * 12) * 100).toFixed(0);
    return { monthlyEquivalent, savings };
  };

  const handleContinueToPayment = () => {
    if (!selectedPlan) {
      toast.error('Please select a membership plan first');
      return;
    }
    
    setProcessing(true);
    
    const planData = {
      planId: selectedPlan.id,
      planName: selectedPlan.name,
      amount: getCurrentPrice(),
      currency: selectedPlan.currency,
      duration: selectedDuration,
      originalPrice: selectedDuration === 'yearly' ? selectedPlan.prices.monthly * 12 : null,
      savings: selectedDuration === 'yearly' ? selectedPlan.savings : null
    };
    
    localStorage.setItem('selectedMembershipPlan', JSON.stringify(planData));
    
    setTimeout(() => {
      setProcessing(false);
      navigate('/billing-details', { 
        state: { 
          selectedPlan: planData
        }
      });
    }, 500);
  };

  const monthlyEquivalent = selectedPlan && selectedDuration === 'yearly' 
    ? getMonthlyEquivalent() 
    : null;

  // Loading state
  if (plansLoading) {
    return (
      <div className="min-h-screen pt-20 md:pt-30 bg-gradient-to-br from-gray-50 to-blue-50 flex items-center justify-center px-4">
        <div className="text-center">
          <div className="w-12 h-12 md:w-16 md:h-16 border-4 border-[#2C7EAD] border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600 text-sm md:text-base">Loading membership plans...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen mt-15 bg-gradient-to-br pt-16 md:pt-30 from-gray-50 to-blue-50">
      {/* Header - Mobile Optimized */}
      <div className="bg-white shadow-lg sticky top-0 z-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3 md:py-4">
          <div className="flex items-center gap-2 md:gap-4 flex-wrap">
            <button
              onClick={() => navigate('/school-profile')}
              className="flex items-center gap-1 md:gap-2 px-3 md:px-4 py-1.5 md:py-2 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors text-sm md:text-base"
            >
              <FaArrowLeft size={14} className="md:text-base" /> Back
            </button>
            <div className="flex-1 min-w-0">
              <h1 className="text-lg sm:text-xl md:text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent truncate">
                Choose Your Plan
              </h1>
              <p className="text-xs md:text-sm text-gray-600 hidden sm:block">
                Select the perfect plan for your school
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4 md:py-8">
        {/* Duration Toggle - Mobile Optimized */}
        <div className="flex justify-center mb-6 md:mb-10">
          <div className="bg-white rounded-2xl shadow-lg p-1 inline-flex gap-1 md:gap-2 w-full max-w-md">
            <button
              onClick={() => handleDurationChange('monthly')}
              className={`flex-1 px-3 md:px-8 py-2 md:py-3 rounded-xl font-semibold transition-all flex items-center justify-center gap-1 md:gap-2 text-xs md:text-base ${
                selectedDuration === 'monthly'
                  ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-md'
                  : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              <FaCalendarAlt size={12} className="md:text-base" /> 
              <span className="hidden xs:inline">Monthly</span>
              <span className="xs:hidden">Monthly</span>
            </button>
            <button
              onClick={() => handleDurationChange('yearly')}
              className={`flex-1 px-3 md:px-8 py-2 md:py-3 rounded-xl font-semibold transition-all flex items-center justify-center gap-1 md:gap-2 text-xs md:text-base relative ${
                selectedDuration === 'yearly'
                  ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-md'
                  : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              <FaMoneyBillWave size={12} className="md:text-base" />
              <span className="hidden xs:inline">Yearly</span>
              <span className="xs:hidden">Yearly</span>
              {selectedPlan?.savings > 0 && (
                <span className="absolute -top-2 -right-1 bg-green-500 text-white text-[10px] md:text-xs px-1.5 md:px-2 py-0.5 rounded-full">
                  Save
                </span>
              )}
            </button>
          </div>
        </div>

        {/* Plans Grid - Responsive */}
        {membershipPlans.length === 0 ? (
          <div className="text-center py-8 md:py-12 bg-white rounded-2xl shadow-lg px-4">
            <p className="text-gray-500 text-sm md:text-base">No membership plans available at the moment.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-8 mb-8 md:mb-12">
            {membershipPlans.map((plan) => {
              const price = selectedDuration === 'monthly' ? plan.prices.monthly : plan.prices.yearly;
              const isSelected = selectedPlan?.id === plan.id;
              const hasPrice = price !== null && price !== undefined;
              const showFeatures = showAllFeatures[plan.id];
              const featuresToShow = showFeatures ? plan.features : plan.features.slice(0, 4);
              
              return (
                <div
                  key={plan.id}
                  className={`relative bg-white rounded-2xl shadow-lg transition-all duration-300 transform hover:-translate-y-1 md:hover:-translate-y-2 cursor-pointer ${
                    isSelected 
                      ? 'ring-2 md:ring-4 ring-blue-500 shadow-2xl scale-[0.98] md:scale-105' 
                      : 'hover:shadow-xl'
                  } ${plan.popular ? 'ring-2 ring-purple-500' : ''}`}
                  onClick={() => hasPrice && handleSelectPlan(plan)}
                >
                  {plan.popular && (
                    <div className="absolute -top-3 left-1/2 transform -translate-x-1/2 z-10">
                      <div className="bg-gradient-to-r from-amber-500 to-orange-500 text-white px-2 md:px-4 py-0.5 md:py-1 rounded-full text-[10px] md:text-sm font-bold flex items-center gap-1 shadow-lg whitespace-nowrap">
                        <FaStar className="text-yellow-300 text-xs md:text-sm" /> POPULAR
                      </div>
                    </div>
                  )}
                  
                  <div className={`bg-gradient-to-r ${plan.color} p-4 md:p-6 rounded-t-2xl text-white`}>
                    <div className="flex justify-between items-start">
                      <div className="flex-1 min-w-0">
                        <div className="text-2xl md:text-3xl mb-1 md:mb-2">{plan.icon}</div>
                        <h3 className="text-lg md:text-2xl font-bold truncate">{plan.name}</h3>
                        <p className="text-white/80 text-xs md:text-sm mt-1 line-clamp-2">{plan.description}</p>
                      </div>
                      {isSelected && (
                        <div className="bg-white rounded-full p-1 flex-shrink-0">
                          <FaCheck className="text-green-500 text-xs md:text-sm" />
                        </div>
                      )}
                    </div>
                  </div>
                  
                  <div className="p-4 md:p-6">
                    {/* Pricing */}
                    <div className="mb-4 md:mb-6">
                      {hasPrice ? (
                        <>
                          <div className="flex items-baseline gap-1 flex-wrap">
                            <span className="text-2xl md:text-3xl font-bold text-gray-900">{plan.currency} {price.toLocaleString()}</span>
                            <span className="text-xs md:text-sm text-gray-500">/{selectedDuration === 'monthly' ? 'mo' : 'yr'}</span>
                          </div>
                          {selectedDuration === 'yearly' && plan.prices.monthly && (
                            <div className="mt-2">
                              <span className="inline-block bg-green-100 text-green-700 text-[10px] md:text-xs px-1.5 md:px-2 py-0.5 md:py-1 rounded-full">
                                Save {plan.savings}%
                              </span>
                              <p className="text-xs text-gray-500 mt-1">
                                ~{plan.currency} {(plan.prices.yearly / 12).toFixed(0)}/mo
                              </p>
                            </div>
                          )}
                        </>
                      ) : (
                        <div className="text-center">
                          <span className="text-lg md:text-xl font-bold text-gray-900">Custom Pricing</span>
                          <p className="text-xs text-gray-500 mt-1">Contact us</p>
                        </div>
                      )}
                    </div>
                    
                    {/* CV Limits - Mobile Optimized */}
                    {plan.limits && (plan.limits.maxCvsDownloadMonthly || plan.limits.maxCvsDownloadYearly) && (
                      <div className="mb-4 space-y-2">
                        {plan.limits.maxCvsDownloadMonthly && (
                          <div className="flex items-center gap-2 text-xs md:text-sm text-gray-600 bg-blue-50 rounded-xl p-2 md:p-3">
                            <FaDownload className="text-blue-600 text-sm md:text-base flex-shrink-0" />
                            <span className="font-semibold truncate">
                              Monthly: {plan.limits.maxCvsDownloadMonthly === -1 ? "Unlimited" : `${plan.limits.maxCvsDownloadMonthly} CVs`}
                            </span>
                          </div>
                        )}
                        {plan.limits.maxCvsDownloadYearly && (
                          <div className="flex items-center gap-2 text-xs md:text-sm text-gray-600 bg-purple-50 rounded-xl p-2 md:p-3">
                            <FaDownload className="text-purple-600 text-sm md:text-base flex-shrink-0" />
                            <span className="font-semibold truncate">
                              Yearly: {plan.limits.maxCvsDownloadYearly === -1 ? "Unlimited" : `${plan.limits.maxCvsDownloadYearly} CVs`}
                            </span>
                          </div>
                        )}
                      </div>
                    )}
                    
                    {/* Features with Show More/Less */}
                    <div className="space-y-2 md:space-y-3 mb-4 md:mb-6">
                      <h4 className="text-xs md:text-sm font-semibold text-gray-700 flex items-center gap-2">
                        <FaStarOfLife className="text-purple-500 text-[10px] md:text-xs" />
                        Features:
                      </h4>
                      <ul className="space-y-1.5 md:space-y-2">
                        {featuresToShow.map((feature, idx) => (
                          <li key={idx} className="text-xs md:text-sm text-gray-600 flex items-start gap-2">
                            <FaCheck className="text-green-500 mt-0.5 flex-shrink-0" size={12} />
                            <span className="break-words">{feature}</span>
                          </li>
                        ))}
                      </ul>
                      {plan.features.length > 4 && (
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            toggleFeatures(plan.id);
                          }}
                          className="text-xs md:text-sm text-blue-600 font-semibold mt-1"
                        >
                          {showFeatures ? 'Show less' : `+${plan.features.length - 4} more features`}
                        </button>
                      )}
                    </div>
                    
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        hasPrice && handleSelectPlan(plan);
                      }}
                      disabled={!hasPrice}
                      className={`w-full py-2 md:py-3 rounded-xl font-semibold transition-all text-sm md:text-base ${
                        isSelected
                          ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg'
                          : !hasPrice
                          ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                      }`}
                    >
                      {!hasPrice ? 'Contact Sales' : (isSelected ? '✓ Selected' : 'Select Plan')}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Selected Plan Summary - Mobile Optimized */}
        {selectedPlan && selectedPlan.prices && getCurrentPrice() > 0 && (
          <div 
            id="selected-plan-summary"
            className="bg-white rounded-2xl shadow-lg p-4 md:p-6 mb-6 md:mb-8 animate-in fade-in duration-300 sticky bottom-0 md:relative z-10"
          >
            <div className="flex flex-col gap-3 md:gap-4">
              <div className="flex-1">
                <h3 className="text-sm md:text-lg font-semibold text-gray-800 mb-2">Your Selected Plan</h3>
                <div className="flex flex-col gap-1.5 md:gap-2">
                  <div className="flex flex-wrap items-center gap-2 text-xs md:text-sm">
                    <span className="text-gray-600">Plan:</span>
                    <span className="font-semibold text-blue-600 truncate">{selectedPlan.name}</span>
                  </div>
                  <div className="flex flex-wrap items-center gap-2 text-xs md:text-sm">
                    <span className="text-gray-600">Billing:</span>
                    <span className="font-semibold capitalize">{selectedDuration}</span>
                  </div>
                  <div className="flex flex-wrap items-center gap-2 text-xs md:text-sm">
                    <span className="text-gray-600">Amount:</span>
                    <span className="font-bold text-green-600">
                      {selectedPlan.currency} {getCurrentPrice().toLocaleString()}
                    </span>
                  </div>
                </div>
              </div>
              <button
                onClick={handleContinueToPayment}
                disabled={processing}
                className="w-full px-4 md:px-8 py-2.5 md:py-3 bg-gradient-to-r from-green-600 to-teal-600 text-white rounded-xl hover:shadow-lg transition-all font-semibold flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed text-sm md:text-base"
              >
                {processing ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 md:h-5 md:w-5 border-b-2 border-white"></div>
                    Processing...
                  </>
                ) : (
                  <>
                    <FaMoneyBillWave /> Continue to Payment
                  </>
                )}
              </button>
            </div>
          </div>
        )}

        {/* Why Choose Us Section */}
        <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-2xl p-4 md:p-8">
          <h3 className="text-lg md:text-xl font-bold text-gray-800 text-center mb-4 md:mb-6">Why Choose Us?</h3>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 md:gap-6">
            <div className="text-center">
              <div className="w-10 h-10 md:w-12 md:h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-2 md:mb-3">
                <FaShieldAlt className="text-blue-600 text-base md:text-xl" />
              </div>
              <h4 className="font-semibold text-gray-800 mb-1 text-sm md:text-base">Secure Payments</h4>
              <p className="text-xs md:text-sm text-gray-600">Bank transfer with encrypted verification</p>
            </div>
            <div className="text-center">
              <div className="w-10 h-10 md:w-12 md:h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-2 md:mb-3">
                <FaClock className="text-green-600 text-base md:text-xl" />
              </div>
              <h4 className="font-semibold text-gray-800 mb-1 text-sm md:text-base">Quick Activation</h4>
              <p className="text-xs md:text-sm text-gray-600">Plan activated within 24 hours</p>
            </div>
            <div className="text-center">
              <div className="w-10 h-10 md:w-12 md:h-12 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-2 md:mb-3">
                <FaRocket className="text-purple-600 text-base md:text-xl" />
              </div>
              <h4 className="font-semibold text-gray-800 mb-1 text-sm md:text-base">Flexible Options</h4>
              <p className="text-xs md:text-sm text-gray-600">Choose monthly or yearly billing</p>
            </div>
          </div>
        </div>

        {/* Savings Breakdown - Mobile Optimized */}
        {selectedPlan && selectedDuration === 'yearly' && monthlyEquivalent && selectedPlan.prices?.monthly && (
          <div className="mt-6 md:mt-8 bg-white rounded-2xl shadow-lg p-4 md:p-6">
            <h3 className="text-base md:text-lg font-semibold text-gray-800 mb-3 md:mb-4 flex items-center gap-2">
              <FaPercent className="text-green-600" /> Savings Breakdown
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 md:gap-4">
              <div className="text-center p-3 md:p-4 bg-blue-50 rounded-xl">
                <p className="text-xs md:text-sm text-gray-600">Monthly Price</p>
                <p className="text-xl md:text-2xl font-bold text-gray-800">
                  {selectedPlan.currency} {selectedPlan.prices.monthly.toLocaleString()}
                </p>
                <p className="text-[10px] md:text-xs text-gray-500">per month</p>
              </div>
              <div className="text-center p-3 md:p-4 bg-purple-50 rounded-xl">
                <p className="text-xs md:text-sm text-gray-600">Yearly with Monthly</p>
                <p className="text-xl md:text-2xl font-bold text-gray-800">
                  {selectedPlan.currency} {(selectedPlan.prices.monthly * 12).toLocaleString()}
                </p>
                <p className="text-[10px] md:text-xs text-gray-500">12 × monthly price</p>
              </div>
              <div className="text-center p-3 md:p-4 bg-green-50 rounded-xl">
                <p className="text-xs md:text-sm text-gray-600">Yearly Plan (You Pay)</p>
                <p className="text-xl md:text-2xl font-bold text-green-600">
                  {selectedPlan.currency} {selectedPlan.prices.yearly.toLocaleString()}
                </p>
                <p className="text-[10px] md:text-xs text-green-600">
                  Save {selectedPlan.savings}%
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default SchoolMembership;