// src/pages/Pricing.jsx
import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from 'react-redux';
import { 
  Check, Zap, Users, Star, Sparkles, Rocket, Building, Crown, 
  Clock, DollarSign, Phone, Mail, CheckCircle, Download, Percent,
  TrendingUp, Shield, Award, Target
} from "lucide-react";
import { allUserAction } from '../../../actions/userActions';
import { getJobs } from '../../../actions/jobActions';
import { getAllPlans } from '../../../actions/planActions';

const Pricing = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  
  // Redux states
  const { users = [], loading: usersLoading } = useSelector((state) => state.allUsers);
  const { loading: jobsLoading, jobs = [] } = useSelector((state) => state.allJobs);
  const { loading: plansLoading, plans = [] } = useSelector((state) => state.getAllPlans);
  
  const [stats, setStats] = useState({
    totalTeachers: 0,
    totalSchools: 0,
    costSaving: '40%',
    satisfactionRate: '95%'
  });

  const [billingCycle, setBillingCycle] = useState("annual");

  // Load data on component mount
  useEffect(() => {
    const loadData = async () => {
      try {
        await Promise.all([
          dispatch(allUserAction()),
          dispatch(getJobs()),
          dispatch(getAllPlans())
        ]);
      } catch (error) {
        console.error('Error loading data:', error);
      }
    };
    
    loadData();
  }, [dispatch]);

  // Update stats when users data changes
  useEffect(() => {
    if (users && users.length > 0) {
      const teachers = users.filter(user => user.role === 'candidate');
      const schools = users.filter(user => user.role === 'school');
      
      setStats({
        totalTeachers: teachers.length,
        totalSchools: schools.length,
        costSaving: '40%',
        satisfactionRate: '95%'
      });
    }
  }, [users]);

  // Get all unique feature names from all plans
  const getAllUniqueFeatures = (plansUI) => {
    const allFeatures = new Set();
    plansUI.forEach(plan => {
      plan.features.forEach(feature => {
        allFeatures.add(feature.name);
      });
    });
    return Array.from(allFeatures).sort();
  };

  // Transform API plans to UI format with Pricing page colors
  const transformPlansToUI = () => {
    if (!plans || plans.length === 0) return [];
    
    const sortedPlans = [...plans].sort((a, b) => (a.displayOrder || 0) - (b.displayOrder || 0));
    
    return sortedPlans.map((plan) => {
      let badge = "";
      let icon = <Zap className="text-white" size={24} />;
      let color = "from-[#0077BB] to-[#00AEEF]";
      
      if (plan.popular) {
        badge = "Most Popular";
        icon = <Users className="text-white" size={24} />;
        color = "from-[#00AEEF] to-[#F6B400]";
      } else if (plan.name.toLowerCase().includes("premium")) {
        badge = "Recommended";
        icon = <Star className="text-white" size={24} />;
        color = "from-[#F6B400] to-[#0077BB]";
      } else if (plan.name.toLowerCase().includes("enterprise") || plan.prices?.monthly === null) {
        badge = "Enterprise";
        icon = <Crown className="text-white" size={24} />;
        color = "from-[#8A2BE2] to-[#FF69B4]";
      } else if (plan.name.toLowerCase().includes("starter")) {
        icon = <Rocket className="text-white" size={24} />;
        color = "from-[#0077BB] to-[#00AEEF]";
      } else if (plan.name.toLowerCase().includes("growing")) {
        icon = <TrendingUp className="text-white" size={24} />;
        color = "from-[#00AEEF] to-[#F6B400]";
      }
      
      const monthlyPrice = plan.prices?.monthly ? `${plan.prices.monthly.toLocaleString()} SAR` : "Custom";
      const yearlyPrice = plan.prices?.yearly ? `${plan.prices.yearly.toLocaleString()} SAR` : "Custom";
      
      // Convert features from API
      const features = plan.features?.map(feature => ({
        name: feature,
        value: true,
        icon: "✓"
      })) || [];
      
      // Add limit features
      if (plan.limits) {
        if (plan.limits.maxJobs) {
          features.push({
            name: "Active Job Posts",
            value: plan.limits.maxJobs === -1 ? "Unlimited" : plan.limits.maxJobs.toString(),
            icon: "📝"
          });
        }
        if (plan.limits.maxCvsDownloadMonthly) {
          features.push({
            name: "Monthly CV Downloads",
            value: plan.limits.maxCvsDownloadMonthly === -1 ? "Unlimited" : `${plan.limits.maxCvsDownloadMonthly} CVs`,
            icon: "📄"
          });
        }
        if (plan.limits.maxCvsDownloadYearly) {
          features.push({
            name: "Yearly CV Downloads",
            value: plan.limits.maxCvsDownloadYearly === -1 ? "Unlimited" : `${plan.limits.maxCvsDownloadYearly} CVs`,
            icon: "📥"
          });
        }
      }
      
      return {
        id: plan._id,
        name: plan.name,
        monthlyPrice,
        yearlyPrice,
        description: plan.description || `Perfect for ${plan.name.toLowerCase()} educational institutions.`,
        features: features,
        color,
        badge,
        icon,
        popular: plan.popular,
        savings: plan.savings || 0,
        limits: plan.limits
      };
    });
  };

  const handleGetStarted = () => {
    navigate('/school-login');
  };

  const handleContactSales = () => {
    navigate('/contact-us', { 
      state: { 
        subject: 'Enterprise Plan Inquiry',
        from: 'pricing'
      } 
    });
  };

  const renderFeatureValue = (value) => {
    if (value === true) {
      return <CheckCircle className="text-green-500 flex-shrink-0" size={16} />;
    }
    if (typeof value === "string") {
      if (value.toLowerCase().includes("unlimited") || value.toLowerCase().includes("custom")) {
        return <span className="text-[#2C7EAD] font-semibold text-xs bg-blue-50 px-2 py-1 rounded-full">{value}</span>;
      }
      return <span className="text-gray-700 text-xs font-medium bg-gray-50 px-2 py-1 rounded-full">{value}</span>;
    }
    return value;
  };

  const plansUI = transformPlansToUI();
  const allFeatures = getAllUniqueFeatures(plansUI);

  const displayStats = [
    { value: `${stats.totalTeachers.toLocaleString()}+`, label: "Active Teachers" },
    { value: `${stats.totalSchools.toLocaleString()}+`, label: "Partner Schools" },
    { value: stats.costSaving, label: "Cost Saving" },
    { value: stats.satisfactionRate, label: "Satisfaction Rate" }
  ];

  if (usersLoading || jobsLoading || plansLoading) {
    return (
      <div className="min-h-screen mt-30 bg-gradient-to-br from-slate-50 to-blue-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-[#2C7EAD] border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading pricing information...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 mt-16">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-[#2C7EAD] via-[#1E5F8B] to-[#0D3B66] text-white py-24 px-6 md:px-20 text-center overflow-hidden">
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-40 -left-40 w-80 h-80 bg-[#00AEEF]/20 rounded-full blur-3xl"></div>
          <div className="absolute top-1/2 right-0 w-96 h-96 bg-[#FFD700]/10 rounded-full blur-3xl"></div>
          <div className="absolute bottom-0 left-1/4 w-64 h-64 bg-white/5 rounded-full blur-2xl"></div>
        </div>

        <div className="relative z-10 max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="inline-flex items-center gap-2 px-4 py-2 bg-white/10 backdrop-blur-sm rounded-full mb-6"
          >
            <Sparkles className="w-4 h-4 text-yellow-300" />
            <span className="text-sm">Simple, Transparent Pricing</span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-5xl md:text-7xl font-bold mb-6 leading-tight"
          >
            Teachers <span className="text-[#FFD700]">Always Free</span>
            <br />
            <span className="text-white">Schools </span>
            <span className="text-[#FFD700]">Grow With Us</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.2 }}
            className="max-w-3xl mx-auto text-xl text-white/90 mb-10 leading-relaxed"
          >
            We believe in empowering teachers. That's why our platform is completely free for educators. 
            Schools pay for advanced hiring tools to find the best talent.
          </motion.p>
        </div>
      </section>

      {/* Stats Bar */}
      <section className="bg-white py-12 border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-6 md:px-20">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {displayStats.map((stat, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                viewport={{ once: true }}
                className="text-center"
              >
                <div className="text-3xl font-bold text-gray-900 mb-2">{stat.value}</div>
                <div className="text-gray-600 text-sm">{stat.label}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Billing Toggle */}
      <div className="max-w-7xl mx-auto px-6 pt-16">
        <div className="flex justify-center items-center gap-4 mb-12">
          <button
            onClick={() => setBillingCycle("monthly")}
            className={`px-6 py-2 rounded-full font-semibold transition-all ${
              billingCycle === "monthly"
                ? "bg-[#2C7EAD] text-white shadow-md"
                : "bg-gray-100 text-gray-600 hover:bg-gray-200"
            }`}
          >
            Monthly
          </button>
          <button
            onClick={() => setBillingCycle("annual")}
            className={`px-6 py-2 rounded-full font-semibold transition-all flex items-center gap-2 ${
              billingCycle === "annual"
                ? "bg-[#2C7EAD] text-white shadow-md"
                : "bg-gray-100 text-gray-600 hover:bg-gray-200"
            }`}
          >
            Annual
            <span className="text-xs bg-green-500 text-white px-2 py-0.5 rounded-full">Save up to 20%</span>
          </button>
        </div>
      </div>
    
      {/* School Plans Header */}
      <div className="text-center mb-12">
        <h2 className="text-4xl font-bold text-gray-900 mb-4">
          For <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#FF6B6B] to-[#4ECDC4]">Schools</span>
        </h2>
        <p className="text-gray-600 text-lg max-w-2xl mx-auto">
          Advanced hiring tools to find and recruit the best teachers
        </p>
      </div>

      {/* Pricing Cards */}
      <div className="max-w-7xl mx-auto px-6 py-8 pb-20">
        <div className="flex flex-col md:flex-row gap-8 items-stretch justify-center">
          {plansUI.length > 0 ? (
            plansUI.map((plan, index) => (
              <motion.div
                key={plan.id || plan.name}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7, delay: index * 0.1 }}
                viewport={{ once: true }}
                whileHover={{ y: -5 }}
                className={`relative group flex-1 max-w-md mx-auto w-full `}
              >
                {plan.popular && (
                  <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 z-10">
                    <div className="bg-gradient-to-r from-[#F6B400] to-[#FF8C00] text-white px-6 py-2 rounded-full font-bold shadow-lg flex items-center gap-2 text-sm">
                      <Star size={14} fill="currentColor" /> {plan.badge}
                    </div>
                  </div>
                )}
                
                {billingCycle === "annual" && plan.savings > 0 && (
                  <div className="absolute -top-4 right-4 z-10">
                    <div className="bg-green-500 text-white px-3 py-1 rounded-full text-xs font-bold shadow-lg flex items-center gap-1">
                      <Percent size={10} />
                      Save {plan.savings}%
                    </div>
                  </div>
                )}
                
                <div className={`bg-gradient-to-b ${plan.color} rounded-3xl p-8 shadow-xl hover:shadow-2xl transition-all duration-500 h-full`}>
                  <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 h-full flex flex-col justify-between">
                    <div>
                      <div className="flex items-center justify-between mb-6">
                        <div>
                          <h3 className="text-2xl font-bold text-white mb-2">{plan.name}</h3>
                          <div className="flex items-baseline">
                            <span className="text-5xl font-bold text-white">
                              {billingCycle === "monthly" ? plan.monthlyPrice : plan.yearlyPrice}
                            </span>
                            {plan.monthlyPrice !== "Custom" && plan.yearlyPrice !== "Custom" && (
                              <span className="text-white/80 ml-2">/{billingCycle === "monthly" ? "month" : "year"}</span>
                            )}
                          </div>
                          {billingCycle === "annual" && plan.savings > 0 && plan.monthlyPrice !== "Custom" && (
                            <p className="text-white/70 text-sm mt-1">
                              Save {plan.savings}% vs monthly billing
                            </p>
                          )}
                        </div>
                        <div className="p-4 bg-white/20 rounded-xl">
                          <div className="text-white">{plan.icon}</div>
                        </div>
                      </div>
                      
                      {plan.limits && (plan.limits.maxCvsDownloadMonthly || plan.limits.maxCvsDownloadYearly) && (
                        <div className="mb-6 space-y-2">
                          {plan.limits.maxCvsDownloadMonthly && (
                            <div className="flex items-center gap-2 text-sm text-white/90 bg-white/10 rounded-xl p-3">
                              <Download size={16} className="text-white/70" />
                              <span className="font-semibold">
                                Monthly: {plan.limits.maxCvsDownloadMonthly === -1 ? "Unlimited" : `${plan.limits.maxCvsDownloadMonthly} CVs`}
                              </span>
                            </div>
                          )}
                          {plan.limits.maxCvsDownloadYearly && (
                            <div className="flex items-center gap-2 text-sm text-white/90 bg-white/10 rounded-xl p-3">
                              <Download size={16} className="text-white/70" />
                              <span className="font-semibold">
                                Yearly: {plan.limits.maxCvsDownloadYearly === -1 ? "Unlimited" : `${plan.limits.maxCvsDownloadYearly} CVs`}
                              </span>
                            </div>
                          )}
                        </div>
                      )}
                      
                      <div className="space-y-4 mb-8">
                        <h4 className="text-white font-semibold flex items-center gap-2">
                          <Award size={16} className="text-yellow-300" />
                          Key Features:
                        </h4>
                        {plan.features.slice(0, 6).map((feature, idx) => (
                          <div key={idx} className="flex items-start gap-3">
                            <CheckCircle className="w-5 h-5 text-green-300 flex-shrink-0 mt-0.5" />
                            <span className="text-white/90 text-sm">{feature.name}</span>
                          </div>
                        ))}
                        {plan.features.length > 6 && (
                          <div className="text-white/70 text-sm pl-8">
                            +{plan.features.length - 6} more features
                          </div>
                        )}
                      </div>
                    </div>
                    
                    <button
                      onClick={plan.monthlyPrice === "Custom" ? handleContactSales : handleGetStarted}
                      className={`w-full py-4 bg-white text-gray-900 font-bold rounded-xl hover:shadow-xl transition-all duration-300 hover:scale-105 ${
                        plan.popular ? 'shadow-lg' : ''
                      }`}
                    >
                      {plan.monthlyPrice === "Custom" ? "Contact Sales" : "Get Started"}
                    </button>
                  </div>
                </div>
              </motion.div>
            ))
          ) : (
            // Fallback default plans
            <>
              {[
                {
                  name: "Starter",
                  monthlyPrice: "950 SAR",
                  yearlyPrice: "9,120 SAR",
                  features: [
                    { name: "5 Active Job Posts" },
                    { name: "10 Teacher Views/Month" },
                    { name: "Basic Search Filters" },
                    { name: "Email Support" },
                    { name: "Up to 2 Hiring Team Users" }
                  ],
                  color: "from-[#0077BB] to-[#00AEEF]",
                  popular: false,
                  icon: <Rocket className="text-white" size={24} />,
                  savings: 0,
                  limits: { maxCvsDownloadMonthly: 50 },
                  description: "Perfect for small schools starting their hiring journey."
                },
                {
                  name: "Growing",
                  monthlyPrice: "2,250 SAR",
                  yearlyPrice: "21,600 SAR",
                  features: [
                    { name: "15 Active Job Posts" },
                    { name: "30 Teacher Views/Month" },
                    { name: "Advanced Search Filters" },
                    { name: "Priority Support" },
                    { name: "School Branding" },
                    { name: "Up to 5 Hiring Team Users" },
                    { name: "Advanced Analytics" }
                  ],
                  color: "from-[#00AEEF] to-[#F6B400]",
                  popular: true,
                  icon: <TrendingUp className="text-white" size={24} />,
                  savings: 20,
                  limits: { maxCvsDownloadMonthly: 150, maxCvsDownloadYearly: 1800 },
                  description: "Ideal for growing schools with increasing hiring needs."
                },
                {
                  name: "Premium",
                  monthlyPrice: "4,500 SAR",
                  yearlyPrice: "43,200 SAR",
                  features: [
                    { name: "25 Active Job Posts" },
                    { name: "100+ Teacher Views/Month" },
                    { name: "Full Database Access" },
                    { name: "Dedicated Account Manager" },
                    { name: "Unlimited Hiring Team" },
                    { name: "Custom Reports" },
                    { name: "ERP/ATS Integration" }
                  ],
                  color: "from-[#F6B400] to-[#0077BB]",
                  popular: false,
                  icon: <Crown className="text-white" size={24} />,
                  savings: 20,
                  limits: { maxCvsDownloadMonthly: 500, maxCvsDownloadYearly: 6000 },
                  description: "Complete solution for large institutions with high-volume hiring."
                },
                {
                  name: "Enterprise",
                  monthlyPrice: "Custom",
                  yearlyPrice: "Custom",
                  features: [
                    { name: "Unlimited Job Posts" },
                    { name: "Unlimited CV Downloads" },
                    { name: "Custom Integration" },
                    { name: "Dedicated Support Team" },
                    { name: "SLA Agreement" },
                    { name: "Custom Reporting" }
                  ],
                  color: "from-[#8A2BE2] to-[#FF69B4]",
                  popular: false,
                  icon: <Building className="text-white" size={24} />,
                  savings: 0,
                  description: "Tailored solutions for large educational groups and chains."
                }
              ].map((plan, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 40 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.7, delay: index * 0.1 }}
                  viewport={{ once: true }}
                  whileHover={{ y: -5 }}
                  className={`relative group flex-1 max-w-md mx-auto w-full ${plan.popular ? 'scale-105 z-10' : ''}`}
                >
                  {plan.popular && (
                    <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 z-10">
                      <div className="bg-gradient-to-r from-[#F6B400] to-[#FF8C00] text-white px-6 py-2 rounded-full font-bold shadow-lg flex items-center gap-2 text-sm">
                        <Star size={14} fill="currentColor" /> MOST POPULAR
                      </div>
                    </div>
                  )}
                  
                  {billingCycle === "annual" && plan.savings > 0 && (
                    <div className="absolute -top-4 right-4 z-10">
                      <div className="bg-green-500 text-white px-3 py-1 rounded-full text-xs font-bold shadow-lg flex items-center gap-1">
                        <Percent size={10} />
                        Save {plan.savings}%
                      </div>
                    </div>
                  )}
                  
                  <div className={`bg-gradient-to-b ${plan.color} rounded-3xl p-8 shadow-xl hover:shadow-2xl transition-all duration-500 h-full`}>
                    <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 h-full flex flex-col justify-between">
                      <div>
                        <div className="flex items-center justify-between mb-6">
                          <div>
                            <h3 className="text-2xl font-bold text-white mb-2">{plan.name}</h3>
                            <div className="flex items-baseline">
                              <span className="text-5xl font-bold text-white">
                                {billingCycle === "monthly" ? plan.monthlyPrice : plan.yearlyPrice}
                              </span>
                              {plan.monthlyPrice !== "Custom" && plan.yearlyPrice !== "Custom" && (
                                <span className="text-white/80 ml-2">/{billingCycle === "monthly" ? "month" : "year"}</span>
                              )}
                            </div>
                            {billingCycle === "annual" && plan.savings > 0 && plan.monthlyPrice !== "Custom" && (
                              <p className="text-white/70 text-sm mt-1">
                                Save {plan.savings}% vs monthly billing
                              </p>
                            )}
                          </div>
                          <div className="p-4 bg-white/20 rounded-xl">
                            <div className="text-white">{plan.icon}</div>
                          </div>
                        </div>
                        
                        {plan.limits && plan.limits.maxCvsDownloadMonthly && (
                          <div className="mb-6">
                            <div className="flex items-center gap-2 text-sm text-white/90 bg-white/10 rounded-xl p-3">
                              <Download size={16} className="text-white/70" />
                              <span className="font-semibold">
                                Monthly: Up to {plan.limits.maxCvsDownloadMonthly} CVs
                              </span>
                            </div>
                          </div>
                        )}
                        
                        <div className="space-y-4 mb-8">
                          <h4 className="text-white font-semibold flex items-center gap-2">
                            <Award size={16} className="text-yellow-300" />
                            Key Features:
                          </h4>
                          {plan.features.slice(0, 6).map((feature, idx) => (
                            <div key={idx} className="flex items-start gap-3">
                              <CheckCircle className="w-5 h-5 text-green-300 flex-shrink-0 mt-0.5" />
                              <span className="text-white/90 text-sm">{feature.name}</span>
                            </div>
                          ))}
                          {plan.features.length > 6 && (
                            <div className="text-white/70 text-sm pl-8">
                              +{plan.features.length - 6} more features
                            </div>
                          )}
                        </div>
                      </div>
                      
                      <button
                        onClick={plan.monthlyPrice === "Custom" ? handleContactSales : handleGetStarted}
                        className={`w-full py-4 bg-white text-gray-900 font-bold rounded-xl hover:shadow-xl transition-all duration-300 hover:scale-105 ${
                          plan.popular ? 'shadow-lg' : ''
                        }`}
                      >
                        {plan.monthlyPrice === "Custom" ? "Contact Sales" : "Get Started"}
                      </button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </>
          )}
        </div>
      </div>

      {/* Comparison Table */}
      {plansUI.length > 1 && allFeatures.length > 0 && (
        <div className="max-w-7xl mx-auto px-6 pb-20">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
            className="bg-white rounded-2xl shadow-lg p-8 border border-gray-200"
          >
            <div className="text-center mb-10">
              <h2 className="text-3xl font-bold text-gray-900 mb-3">
                Detailed Plan Comparison
              </h2>
              <p className="text-gray-600">Compare all features across our plans</p>
            </div>
            
            <div className="overflow-x-auto rounded-xl border border-gray-200">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-gradient-to-r from-[#2C7EAD] to-[#00AEEF] text-white">
                    <th className="py-4 px-6 font-bold text-left rounded-tl-xl w-1/4">Features</th>
                    {plansUI.map((plan) => (
                      <th key={plan.name} className="py-4 px-6 font-bold text-center">
                        {plan.name}
                        {plan.popular && <span className="block text-xs text-yellow-200 mt-1">Most Popular</span>}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {allFeatures.map((featureName, featureIndex) => (
                    <tr 
                      key={featureIndex} 
                      className={`border-b border-gray-100 hover:bg-blue-50 transition-colors duration-200 ${
                        featureIndex % 2 === 0 ? 'bg-gray-50' : 'bg-white'
                      }`}
                    >
                      <td className="py-4 px-6 font-semibold text-gray-700 text-sm">
                        {featureName}
                      </td>
                      {plansUI.map((plan) => {
                        const feature = plan.features.find(f => f.name === featureName);
                        return (
                          <td key={plan.name} className="py-4 px-6 text-center">
                            {feature ? renderFeatureValue(feature.value) : <span className="text-gray-300">—</span>}
                          </td>
                        );
                      })}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </motion.div>
        </div>
      )}

      {/* CTA Section */}
      <section className="py-24 bg-gradient-to-br from-[#2C7EAD] via-[#1E5F8B] to-[#0D3B66] text-white overflow-hidden relative">
        <div className="relative max-w-4xl mx-auto px-6 md:px-20 text-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl font-bold mb-6">
              Ready to Transform Your Educational Recruitment?
            </h2>
            <p className="text-xl text-white/80 mb-10 max-w-2xl mx-auto">
              Join {stats.totalSchools.toLocaleString()}+ schools and {stats.totalTeachers.toLocaleString()}+ teachers who trust TeachingPath
            </p>
            
            <div className="flex flex-col sm:flex-row gap-6 justify-center mb-16">
              <button
                onClick={() => navigate('/teacher-register')}
                className="px-10 py-5 bg-gradient-to-r from-[#FFD700] to-[#FF9F43] text-gray-900 font-bold rounded-xl hover:shadow-2xl hover:scale-105 transition-all duration-300 shadow-lg flex items-center gap-3"
              >
                <Rocket className="w-5 h-5" />
                Join as Teacher - Free
              </button>
              <button
                onClick={() => navigate('/school-register')}
                className="px-10 py-5 bg-white/10 backdrop-blur-sm border-2 border-white/30 text-white font-bold rounded-xl hover:bg-white hover:text-[#2C7EAD] hover:scale-105 transition-all duration-300 flex items-center gap-3"
              >
                <Building className="w-5 h-5" />
                Register Your School
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-left">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-white/10 rounded-xl">
                  <Phone className="w-6 h-6" />
                </div>
                <div>
                  <div className="font-bold">Call Us</div>
                  <div className="text-sm text-white/80">+966 123 456 789</div>
                </div>
              </div>
              
              <div className="flex items-center gap-4">
                <div className="p-3 bg-white/10 rounded-xl">
                  <Mail className="w-6 h-6" />
                </div>
                <div>
                  <div className="font-bold">Email Us</div>
                  <div className="text-sm text-white/80">sales@teachingpath.com</div>
                </div>
              </div>
              
              <div className="flex items-center gap-4">
                <div className="p-3 bg-white/10 rounded-xl">
                  <Clock className="w-6 h-6" />
                </div>
                <div>
                  <div className="font-bold">Support Hours</div>
                  <div className="text-sm text-white/80">Sun-Thu, 9AM-6PM</div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default Pricing;