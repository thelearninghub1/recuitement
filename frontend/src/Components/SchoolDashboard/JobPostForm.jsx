import React, { useState, useEffect } from 'react';
import { 
  Save, MapPin, Clock, DollarSign, Users, Calendar, 
  BookOpen, Share2, Briefcase, GraduationCap, FileText, 
  Mail, Globe, Eye, Plus, RefreshCw, ChevronLeft, ChevronRight,
  User, Users as UsersIcon, Briefcase as BriefcaseIcon
} from 'lucide-react';
import { toast } from "react-toastify";
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { createJob, clearJobErrors, getMyJobs } from '../../actions/jobActions';
import { CREATE_JOB_RESET } from '../../constants/jobConstants';

const JobPostForm = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  
  // State for showing form or job list
  const [showForm, setShowForm] = useState(false);
  
  // Get school user data from Redux
  const { user } = useSelector((state) => state.loginUser);
  
  // Redux states
  const { loading: createLoading, error: createError, success: createSuccess } = useSelector((state) => state.jobAction);
  const { loading: jobsLoading, error: jobsError, jobs = [] } = useSelector((state) => state.allJobs);

  // Function to generate job ID
  const generateJobId = () => {
    const prefix = 'JOB';
    const timestamp = Date.now().toString().slice(-6);
    const randomNum = Math.floor(Math.random() * 1000).toString().padStart(3, '0');
    return `${prefix}-${timestamp}-${randomNum}`;
  };

  // Default form state structure
  const defaultFormData = {
    jobId: generateJobId(),
    jobTitle: '',
    jobTitleOther: '',
    gender: [],
    category: '',
    jobDescription: '',
    preferredNationality: '',
    preferredNationalityOther: '',
    estimatedJoiningDate: '',
    jobType: '',
    jobTypeOther: '',
    jobApplyType: '',
    jobApplyTypeOther: '',
    applicationEmail: user?.email || '',
    salaryPaidBy: '',
    salaryPaidByOther: '',
    minSalary: '',
    maxSalary: '',
    experienceRequired: '',
    experienceRequiredOther: '',
    careerLevel: '',
    careerLevelOther: '',
    minQualification: '',
    minQualificationOther: '',
    degreeMajor: '',
    degreeMajorOther: '',
    location: '',
    locationOther: '',
    curriculumRequired: [],
    curriculumOther: '',
    englishCertRequired: '',
    englishCertOther: '',
    teachingLicenseRequired: '',
    teachingLicenseOther: '',
    attestedDegreeRequired: '',
    nonTeachingRole: [],
    nonTeachingRoleOther: '',
    applicationDeadline: '',
    residencyStatus: '',
    residencyStatusOther: ''
  };

  const [formData, setFormData] = useState(defaultFormData);

  // Generate new job ID when showing form
  useEffect(() => {
    if (showForm) {
      setFormData(prev => ({
        ...prev,
        jobId: generateJobId(),
        applicationEmail: user?.email || ''
      }));
    }
  }, [showForm, user]);

  // Load jobs on component mount
  useEffect(() => {
    dispatch(getMyJobs());
  }, [dispatch]);

  // Handle success
  useEffect(() => {
    if (createSuccess) {
      toast.success('Job posted successfully!');
      dispatch({ type: CREATE_JOB_RESET });
      dispatch(getMyJobs());
      setShowForm(false);
      setFormData(defaultFormData);
    }
  }, [createSuccess, dispatch]);

  // Handle errors
  useEffect(() => {
    if (createError) {
      toast.error(createError);
      dispatch(clearJobErrors());
    }
  }, [createError, dispatch]);

  // Handle regular input changes
  const handleInputChange = (field, value) => {
    setFormData(prev => ({ 
      ...prev, 
      [field]: value 
    }));
  };

  // Handle array selections (for checkboxes)
  const handleArrayChange = (field, value) => {
    setFormData(prev => {
      const currentArray = prev[field] || [];
      const newArray = currentArray.includes(value)
        ? currentArray.filter(item => item !== value)
        : [...currentArray, value];
      
      // Limit to 4 items for curriculum and 2 for non-teaching role
      if (field === 'curriculumRequired' && newArray.length > 4) {
        return prev;
      }
      if (field === 'nonTeachingRole' && newArray.length > 2) {
        return prev;
      }
      
      return { ...prev, [field]: newArray };
    });
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const jobData = {
      ...formData,
      status: 'active',
      isFeatured: false,
      viewCount: 0,
      applicationCount: 0,
      country: 'Saudi Arabia',
      city: formData.location === 'Other' ? formData.locationOther : formData.location,
      workMode: 'On-site'
    };

    Object.keys(jobData).forEach(key => {
      if (jobData[key] === '' || jobData[key] === null || jobData[key] === undefined) {
        delete jobData[key];
      }
    });

    if (jobData.curriculumRequired && jobData.curriculumRequired.length === 0) {
      delete jobData.curriculumRequired;
    }
    if (jobData.nonTeachingRole && jobData.nonTeachingRole.length === 0) {
      delete jobData.nonTeachingRole;
    }
    if (jobData.gender && jobData.gender.length === 0) {
      delete jobData.gender;
    }

    try {
      await dispatch(createJob(jobData));
    } catch (err) {
      toast.error('Failed to create job posting');
    }
  };

  // Handle refresh jobs
  const handleRefreshJobs = () => {
    dispatch(getMyJobs());
    toast.success('Jobs list refreshed!');
  };

  // Handle view applications
  const handleViewApplications = (jobId) => {
    navigate(`/jobs/${jobId}/applications`);
  };

  // Format date for display
  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
      });
    } catch (error) {
      return 'Invalid Date';
    }
  };

  // Format date for input field
  const formatDateForInput = (dateString) => {
    if (!dateString) return '';
    try {
      const date = new Date(dateString);
      return date.toISOString().split('T')[0];
    } catch (error) {
      return '';
    }
  };

  // Get tomorrow's date for min date restrictions
  const getTomorrowDate = () => {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    return tomorrow.toISOString().split('T')[0];
  };

  // Get next month date for max date restrictions
  const getNextMonthDate = () => {
    const nextMonth = new Date();
    nextMonth.setMonth(nextMonth.getMonth() + 12);
    return nextMonth.toISOString().split('T')[0];
  };

  // Check if "Other" option should show input
  const showOtherInput = (field, otherField) => {
    return formData[field] === 'Other' || formData[field]?.includes('Other');
  };

  // Saudi Arabia cities list
  const saudiCities = [
    'Riyadh', 'Jeddah', 'Mecca', 'Medina', 'Dammam', 
    'Khobar', 'Dhahran', 'Tabuk', 'Abha', 'Jizan',
    'Hail', 'Buraidah', 'Najran', 'Al Jouf', 'Arar',
    'Sakakah', 'Yanbu', 'Taif', 'Qassim', 'Other'
  ];

  // Job title categories
  const jobTitles = [
    'Accounting & Finance',
    'Accounts Teacher',
    'Activity/Event Coordinator',
    'Arabic Teacher',
    'Art/Visual Arts Teacher',
    'Biology Teacher',
    'Business Studies Teacher',
    'Chemistry Teacher',
    'Computer Science / ICT Teacher',
    'Economics Teacher',
    'English / ESL Teacher',
    'French Teacher',
    'HR Executive',
    'HR Manager',
    'KG Head / KG Teacher',
    'Librarian',
    'Management',
    'Maths Teacher',
    'Music Teacher',
    'Physics Teacher',
    'Physical Education (PE) Teacher',
    'Quran Teacher',
    'Special Edu./Shadow Teacher',
    'Other'
  ];

  // Categories
  const categories = [
    'Accounting/Finance',
    'Administration/HR',
    'Non Teaching',
    'Safety/Security',
    'Teaching'
  ];

  // Nationalities
  const nationalities = [
    'Saudi',
    'Native Speaker',
    'Non Native Speaker',
    'Any',
    'Other'
  ];

  // Job types
  const jobTypes = [
    'Full Time',
    'Part Time',
    'Temporary',
    'Internship',
    'Other'
  ];

  // Apply types
  const applyTypes = [
    'Through website',
    'By Email',
    'Other'
  ];

  // Salary payment types
  const salaryPaymentTypes = [
    'Monthly',
    'Weekly',
    'Hourly',
    'Other'
  ];

  // Experience levels
  const experienceLevels = [
    '1',
    '2',
    '3',
    '4',
    '5',
    'More than 5 years',
    'Other'
  ];

  // Career levels
  const careerLevels = [
    'Entry-Level',
    'Mid-Level',
    'Senior-Level',
    'Specialist/Expert-Level',
    'Managerial/Administrative Level',
    'Other'
  ];

  // Qualification levels
  const qualifications = [
    'Doctorate Degree',
    'M Phil Degree',
    'Associate Degree',
    'Masters Degree',
    'Bachelors Degree',
    'Diploma',
    'Other'
  ];

  // Degree majors
  const degreeMajors = [
    'Accounting & Finance',
    'Arabic & Quran',
    'Arts and Graphic Design',
    'Biology',
    'Business Administration',
    'Business Studies',
    'Chemistry',
    'Commerce',
    'Computer Science / ICT',
    'Economics',
    'Education',
    'English Language/Literature',
    'Engineering (BE/B.Sc)',
    'EYFS/Montessori Diploma/Childhood Diploma',
    'French',
    'Hindi',
    'History',
    'Human Resource',
    'Islamic Studies/Islamiyat',
    'Library Information System',
    'Management',
    'Maths',
    'MBBS/BDS',
    'Nutrition',
    'Pakistan Studies',
    'Physics',
    'Physical Education (PE)',
    'Social Science',
    'Urdu',
    'Other'
  ];

  // Curriculums - Updated with more options
  const curriculums = [
    'AdvancED (American Curriculum)',
    'British Curriculum',
    'Edexcel',
    'FBISE (Pakistani Board)',
    'Finnish (HEI)',
    'Cambridge',
    'CBSE (Indian Board)',
    'IB Program',
    'IPC',
    'Preparatory (University)',
    'Polytechnic College (TVTC)',
    'SABIS',
    'Saudi National Curriculum',
    'American Curriculum',
    'Australian Curriculum',
    'Canadian Curriculum',
    'French Curriculum',
    'German Curriculum',
    'Japanese Curriculum',
    'Korean Curriculum',
    'Singapore Curriculum',
    'Other'
  ];

  // English certificates
  const englishCertificates = [
    'CELTA',
    'TESOL',
    'TEFL',
    'Not Required',
    'Other'
  ];

  // Teaching licenses
  const teachingLicenses = [
    'QTS',
    'PGCE',
    'Other',
    'Not Required'
  ];

  // Non-teaching roles
  const nonTeachingRoles = [
    'Academic Coordinator',
    'Activity/Event Coordinator',
    'Admission Counsellor',
    'Business Operations Manager',
    'Compliance Manager',
    'Data Manager',
    'Director of Curriculum and Instruction',
    'Director of External Affairs',
    'Director of School Transformation',
    'Family Engagement Manager',
    'HR Executive',
    'HR Manager',
    'Instructional Coach',
    'Manager of Talent Acquisition',
    'Recruitment Specialist',
    'Substitute Teacher',
    'Teaching Assistant',
    'Other'
  ];

  // Residency statuses
  const residencyStatuses = [
    'Work Visa Provided',
    'Transferable Visa Preferred',
    'Ajeer Accepted Only',
    'Other'
  ];

  // RENDER JOB LIST VIEW
  if (!showForm) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="flex justify-between items-center mb-8">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">My Job Postings</h1>
              <p className="text-gray-600 mt-2">Your active job postings will appear here.</p>
            </div>
            
            <div className="flex gap-3">
              <button
                onClick={handleRefreshJobs}
                disabled={jobsLoading}
                className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 disabled:opacity-50 text-sm"
              >
                <RefreshCw className={`w-4 h-4 ${jobsLoading ? 'animate-spin' : ''}`} />
                Refresh
              </button>
              
              <button
                onClick={() => setShowForm(true)}
                className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-600 to-blue-400 text-white rounded-lg font-semibold hover:shadow-lg transition-all duration-200 text-sm"
              >
                <Plus className="w-4 h-4" />
                Post New Job
              </button>
            </div>
          </div>

          {/* Loading State */}
          {jobsLoading && (
            <div className="flex justify-center items-center h-64">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            </div>
          )}

          {/* Error State */}
          {jobsError && !jobsLoading && (
            <div className="text-center py-8">
              <p className="text-red-600">Error loading jobs: {jobsError}</p>
              <button
                onClick={handleRefreshJobs}
                className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-sm"
              >
                Retry
              </button>
            </div>
          )}

          {/* Job List */}
          {!jobsLoading && !jobsError && (
            <div className="grid grid-cols-1 gap-6">
              {jobs.length === 0 ? (
                <div className="text-center py-12 bg-white rounded-xl shadow">
                  <div className="text-gray-400 mb-4">
                    <Users className="w-16 h-16 mx-auto" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">No active job postings</h3>
                  <p className="text-gray-600 mb-6">Get started by posting your first job opening.</p>
                  <button
                    onClick={() => setShowForm(true)}
                    className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-blue-400 text-white rounded-lg font-semibold hover:shadow-lg transition-all duration-200 text-sm"
                  >
                    <Plus className="w-5 h-5" />
                    Post Your First Job
                  </button>
                </div>
              ) : (
                jobs.map((job) => (
                  <div key={job._id} className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300">
                    <div className="p-6">
                      <div className="flex justify-between items-start">
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2">
<h3 className="text-xl font-bold text-gray-900">
  {job.jobTitle === 'Other' && job.jobTitleOther 
    ? job.jobTitleOther 
    : job.jobTitle}
</h3>
{job.jobTitle === 'Other' && job.jobTitleOther && (
  <span className="text-sm text-gray-500">(Other)</span>
)}
{job.jobTitle !== 'Other' && job.jobTitleOther && (
  <span className="text-sm text-gray-500">({job.jobTitleOther})</span>
)}
                            <span className="px-3 py-1 bg-green-100 text-green-800 text-xs font-semibold rounded-full">
                              Active
                            </span>
                          </div>
                          <p className="text-gray-600 mb-4 line-clamp-2">{job.jobDescription}</p>
                          
                          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                            <div className="flex items-center gap-2">
                              <MapPin className="w-4 h-4 text-gray-400" />
                              <span className="text-sm text-gray-700">{job.location || job.city}</span>
                            </div>
                            
                            <div className="flex items-center gap-2">
                              <Calendar className="w-4 h-4 text-gray-400" />
                              <span className="text-sm text-gray-700">
                                Deadline: {formatDate(job.applicationDeadline)}
                              </span>
                            </div>
                            
                            <div className="flex items-center gap-2">
                              <DollarSign className="w-4 h-4 text-gray-400" />
                              <span className="text-sm text-gray-700">
                                {job.minSalary && job.maxSalary 
                                  ? `${job.minSalary} - ${job.maxSalary} SAR` 
                                  : 'Salary negotiable'}
                              </span>
                            </div>
                            
                            <div className="flex items-center gap-2">
                              <Users className="w-4 h-4 text-gray-400" />
                              <span className="text-sm text-gray-700">
                                Applications: {job.applicationCount || 0}
                              </span>
                            </div>
                          </div>
                        </div>
                        
                        <div className="flex flex-col gap-2 ml-4">
                          <button
                            onClick={() => handleViewApplications(job._id)}
                            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm"
                          >
                            <Eye className="w-4 h-4" />
                            View Applications
                          </button>
                          
                          <div className="text-xs text-gray-500 text-right">
                            Job ID: {job.jobId}
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex flex-wrap gap-2 mt-4">
                        <span className="px-3 py-1 bg-gray-100 text-gray-700 text-sm rounded-full">
                          {job.category}
                        </span>
                        <span className="px-3 py-1 bg-gray-100 text-gray-700 text-sm rounded-full">
                          {job.jobType}
                        </span>
                        {job.curriculumRequired && job.curriculumRequired.length > 0 && (
                          <span className="px-3 py-1 bg-gray-100 text-gray-700 text-sm rounded-full">
                            {job.curriculumRequired.join(', ')}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          )}
        </div>
      </div>
    );
  }

  // RENDER FORM VIEW
  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Form Header */}
        <div className="mb-8">
          <button
            onClick={() => setShowForm(false)}
            className="flex items-center gap-2 text-blue-600 hover:text-blue-800 mb-4 text-sm"
          >
            <ChevronLeft className="w-4 h-4" />
            Back to Job Listings
          </button>
          
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Post a New Job</h1>
              <p className="text-gray-600 mt-2">Fill in the details below to create a new job posting.</p>
            </div>
          </div>
        </div>

        {/* Job Post Form */}
        <form onSubmit={handleSubmit} className="bg-white rounded-2xl shadow-lg p-6">
          {/* Job ID & Basic Information */}
          <div className="border-b border-gray-200 pb-6">
            <h3 className="text-xl font-semibold text-gray-800 mb-4 flex items-center gap-2">
              <Briefcase className="w-5 h-5" />
              Job Basic Information
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Job ID Field - Auto-generated */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Job ID *
                  <span className="text-gray-500 text-xs ml-2">(Auto-generated)</span>
                </label>
                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    value={formData.jobId}
                    readOnly
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl bg-gray-50 text-gray-600 h-[52px]"
                  />
                  <button
                    type="button"
                    onClick={() => handleInputChange('jobId', generateJobId())}
                    className="px-4 py-3 border border-gray-300 rounded-xl hover:bg-gray-50 text-sm h-[52px] whitespace-nowrap"
                  >
                    Regenerate
                  </button>
                </div>
              </div>
              
              {/* Gender Field - Redesigned with card-style checkboxes */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Gender (Select all that apply)
                </label>
                <div className="grid grid-cols-3 gap-3">
                  {['Male', 'Female'].map((genderOption) => {
                    const isSelected = formData.gender?.includes(genderOption);
                    const icons = {
                      'Male': <User className="w-5 h-5" />,
                      'Female': <User className="w-5 h-5" />,
                      'Both': <UsersIcon className="w-5 h-5" />
                    };
                    const colors = {
                      'Male': 'border-blue-200 hover:border-blue-400 hover:bg-blue-50',
                      'Female': 'border-pink-200 hover:border-pink-400 hover:bg-pink-50',
                      'Both': 'border-purple-200 hover:border-purple-400 hover:bg-purple-50'
                    };
                    const selectedColors = {
                      'Male': 'border-blue-500 bg-blue-50 ring-2 ring-blue-500',
                      'Female': 'border-pink-500 bg-pink-50 ring-2 ring-pink-500',
                      'Both': 'border-purple-500 bg-purple-50 ring-2 ring-purple-500'
                    };
                  
                    return (
                      <label
                        key={genderOption}
                        className={`
                          flex flex-col items-center justify-center p-4 border-2 rounded-xl cursor-pointer 
                          transition-all duration-200 
                          ${isSelected ? selectedColors[genderOption] : colors[genderOption]}
                          hover:shadow-md
                        `}
                      >
                        <input
                          type="checkbox"
                          checked={isSelected}
                          onChange={() => handleArrayChange('gender', genderOption)}
                          className="hidden"
                        />
                        <div className={`${isSelected ? 'text-blue-600' : 'text-gray-500'}`}>
                          {icons[genderOption]}
                        </div>
                        <span className={`mt-2 text-sm font-medium ${isSelected ? 'text-gray-900' : 'text-gray-700'}`}>
                          {genderOption}
                        </span>
                        {isSelected && (
                          <span className="mt-1 text-xs text-blue-600">✓ Selected</span>
                        )}
                      </label>
                    );
                  })}
                </div>
                <div className="flex items-center justify-between mt-2">
                  <p className="text-sm text-gray-500">
                    Selected: <span className="font-semibold text-gray-700">{formData.gender?.length || 0}</span>
                  </p>
                  {formData.gender?.length > 0 && (
                    <span className="text-xs text-blue-600 bg-blue-50 px-2 py-1 rounded-full">
                      {formData.gender.join(' + ')}
                    </span>
                  )}
                </div>
              </div>
            </div>

            <div className="mt-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Job Title *
              </label>
              <select
                value={formData.jobTitle}
                onChange={(e) => handleInputChange('jobTitle', e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent h-[52px] text-sm"
                required
              >
                <option value="">Select Job Title</option>
                {jobTitles.map(title => (
                  <option key={title} value={title}>{title}</option>
                ))}
              </select>
              
              {showOtherInput('jobTitle', 'jobTitleOther') && (
                <div className="mt-3">
                  <input
                    type="text"
                    value={formData.jobTitleOther}
                    onChange={(e) => handleInputChange('jobTitleOther', e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent h-[52px] text-sm"
                    placeholder="Please specify job title"
                  />
                </div>
              )}
            </div>

            <div className="mt-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Category *
              </label>
              <select
                value={formData.category}
                onChange={(e) => handleInputChange('category', e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent h-[52px] text-sm"
                required
              >
                <option value="">Select Category</option>
                {categories.map(category => (
                  <option key={category} value={category}>{category}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Job Description */}
          <div className="border-b border-gray-200 pb-6">
            <h3 className="text-xl font-semibold text-gray-800 mb-4 flex items-center gap-2">
              <FileText className="w-5 h-5" />
              Job Description *
            </h3>
           
            <textarea
              value={formData.jobDescription}
              onChange={(e) => handleInputChange('jobDescription', e.target.value)}
              rows={6}
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none text-sm"
              placeholder="Describe the job responsibilities, duties, and requirements..."
              required
            />
          </div>

          {/* Nationality & Location */}
          <div className="border-b border-gray-200 pb-6">
            <h3 className="text-xl font-semibold text-gray-800 mb-4 flex items-center gap-2">
              <Globe className="w-5 h-5" />
              Nationality & Location
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Preferred Nationality
                </label>
                <select
                  value={formData.preferredNationality}
                  onChange={(e) => handleInputChange('preferredNationality', e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent h-[52px] text-sm"
                >
                  <option value="">Select Preferred Nationality</option>
                  {nationalities.map(nationality => (
                    <option key={nationality} value={nationality}>{nationality}</option>
                  ))}
                </select>
                
                {showOtherInput('preferredNationality', 'preferredNationalityOther') && (
                  <div className="mt-3">
                    <input
                      type="text"
                      value={formData.preferredNationalityOther}
                      onChange={(e) => handleInputChange('preferredNationalityOther', e.target.value)}
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent h-[52px] text-sm"
                      placeholder="Please specify nationality"
                    />
                  </div>
                )}
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Estimated Date of Joining *
                </label>
                <input
                  type="date"
                  value={formatDateForInput(formData.estimatedJoiningDate)}
                  onChange={(e) => handleInputChange('estimatedJoiningDate', e.target.value)}
                  min={getTomorrowDate()}
                  max={getNextMonthDate()}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent h-[52px] text-sm"
                  required
                />
              </div>
            </div>

            <div className="mt-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Location of the Job *
              </label>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {saudiCities.map(city => (
                  <label key={city} className="flex items-center p-3 border rounded-lg cursor-pointer hover:bg-gray-50 text-sm">
                    <input
                      type="radio"
                      name="location"
                      value={city}
                      checked={formData.location === city}
                      onChange={(e) => handleInputChange('location', e.target.value)}
                      className="mr-2"
                      required
                    />
                    <span>{city}</span>
                  </label>
                ))}
              </div>
              
              {showOtherInput('location', 'locationOther') && (
                <div className="mt-3">
                  <input
                    type="text"
                    value={formData.locationOther}
                    onChange={(e) => handleInputChange('locationOther', e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent h-[52px] text-sm"
                    placeholder="Please specify location"
                  />
                </div>
              )}
            </div>
          </div>

          {/* Job Type & Application */}
          <div className="border-b border-gray-200 pb-6">
            <h3 className="text-xl font-semibold text-gray-800 mb-4 flex items-center gap-2">
              <Clock className="w-5 h-5" />
              Job Type & Application
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Type *
                </label>
                <select
                  value={formData.jobType}
                  onChange={(e) => handleInputChange('jobType', e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent h-[52px] text-sm"
                  required
                >
                  <option value="">Select Job Type</option>
                  {jobTypes.map(type => (
                    <option key={type} value={type}>{type}</option>
                  ))}
                </select>
                
                {showOtherInput('jobType', 'jobTypeOther') && (
                  <div className="mt-3">
                    <input
                      type="text"
                      value={formData.jobTypeOther}
                      onChange={(e) => handleInputChange('jobTypeOther', e.target.value)}
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent h-[52px] text-sm"
                      placeholder="Please specify job type"
                    />
                  </div>
                )}
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Job Apply Type *
                </label>
                <select
                  value={formData.jobApplyType}
                  onChange={(e) => handleInputChange('jobApplyType', e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent h-[52px] text-sm"
                  required
                >
                  <option value="">Select Apply Type</option>
                  {applyTypes.map(type => (
                    <option key={type} value={type}>{type}</option>
                  ))}
                </select>
                
                {showOtherInput('jobApplyType', 'jobApplyTypeOther') && (
                  <div className="mt-3">
                    <input
                      type="text"
                      value={formData.jobApplyTypeOther}
                      onChange={(e) => handleInputChange('jobApplyTypeOther', e.target.value)}
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent h-[52px] text-sm"
                      placeholder="Please specify apply type"
                    />
                  </div>
                )}
              </div>
            </div>

            <div className="mt-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                CVs shall be sent to this email *
                <span className="text-gray-500 text-xs ml-2">(Your registered school email)</span>
              </label>
              <div className="flex items-center gap-2">
                <Mail className="w-5 h-5 text-blue-500" />
                <input
                  type="email"
                  value={formData.applicationEmail}
                  onChange={(e) => handleInputChange('applicationEmail', e.target.value)}
                  className="flex-1 px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent h-[52px] text-sm bg-gray-50"
                  placeholder="Your school email"
                  required
                  readOnly
                />
              </div>
              <p className="text-xs text-gray-500 mt-2">
                This is your registered school email: <span className="font-medium">{user?.email}</span>
              </p>
            </div>
          </div>

          {/* Salary Information */}
          <div className="border-b border-gray-200 pb-6">
            <h3 className="text-xl font-semibold text-gray-800 mb-4 flex items-center gap-2">
              <DollarSign className="w-5 h-5" />
              Salary Information (Currency: Riyal)
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Salary Paid by *
                </label>
                <select
                  value={formData.salaryPaidBy}
                  onChange={(e) => handleInputChange('salaryPaidBy', e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent h-[52px] text-sm"
                  required
                >
                  <option value="">Select Payment Type</option>
                  {salaryPaymentTypes.map(type => (
                    <option key={type} value={type}>{type}</option>
                  ))}
                </select>
                
                {showOtherInput('salaryPaidBy', 'salaryPaidByOther') && (
                  <div className="mt-3">
                    <input
                      type="text"
                      value={formData.salaryPaidByOther}
                      onChange={(e) => handleInputChange('salaryPaidByOther', e.target.value)}
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent h-[52px] text-sm"
                      placeholder="Please specify payment type"
                    />
                  </div>
                )}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Minimum Salary (Riyal)
                </label>
                <input
                  type="number"
                  value={formData.minSalary}
                  onChange={(e) => handleInputChange('minSalary', e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent h-[52px] text-sm"
                  placeholder="e.g., 5000"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Maximum Salary (Riyal)
                </label>
                <input
                  type="number"
                  value={formData.maxSalary}
                  onChange={(e) => handleInputChange('maxSalary', e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent h-[52px] text-sm"
                  placeholder="e.g., 10000"
                />
              </div>
            </div>
          </div>

          {/* Experience & Qualifications */}
          <div className="border-b border-gray-200 pb-6">
            <h3 className="text-xl font-semibold text-gray-800 mb-4 flex items-center gap-2">
              <GraduationCap className="w-5 h-5" />
              Experience & Qualifications
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Experience Required in years *
                </label>
                <select
                  value={formData.experienceRequired}
                  onChange={(e) => handleInputChange('experienceRequired', e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent h-[52px] text-sm"
                  required
                >
                  <option value="">Select Experience</option>
                  {experienceLevels.map(exp => (
                    <option key={exp} value={exp}>{exp}</option>
                  ))}
                </select>
                
                {showOtherInput('experienceRequired', 'experienceRequiredOther') && (
                  <div className="mt-3">
                    <input
                      type="text"
                      value={formData.experienceRequiredOther}
                      onChange={(e) => handleInputChange('experienceRequiredOther', e.target.value)}
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent h-[52px] text-sm"
                      placeholder="Please specify experience"
                    />
                  </div>
                )}
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Career Level *
                </label>
                <select
                  value={formData.careerLevel}
                  onChange={(e) => handleInputChange('careerLevel', e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent h-[52px] text-sm"
                  required
                >
                  <option value="">Select Career Level</option>
                  {careerLevels.map(level => (
                    <option key={level} value={level}>{level}</option>
                  ))}
                </select>
                
                {showOtherInput('careerLevel', 'careerLevelOther') && (
                  <div className="mt-3">
                    <input
                      type="text"
                      value={formData.careerLevelOther}
                      onChange={(e) => handleInputChange('careerLevelOther', e.target.value)}
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent h-[52px] text-sm"
                      placeholder="Please specify career level"
                    />
                  </div>
                )}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Minimum Qualification Needed *
                </label>
                <select
                  value={formData.minQualification}
                  onChange={(e) => handleInputChange('minQualification', e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent h-[52px] text-sm"
                  required
                >
                  <option value="">Select Qualification</option>
                  {qualifications.map(qual => (
                    <option key={qual} value={qual}>{qual}</option>
                  ))}
                </select>
                
                {showOtherInput('minQualification', 'minQualificationOther') && (
                  <div className="mt-3">
                    <input
                      type="text"
                      value={formData.minQualificationOther}
                      onChange={(e) => handleInputChange('minQualificationOther', e.target.value)}
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent h-[52px] text-sm"
                      placeholder="Please specify qualification"
                    />
                  </div>
                )}
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Degree shall be in (Major) *
                </label>
                <select
                  value={formData.degreeMajor}
                  onChange={(e) => handleInputChange('degreeMajor', e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent h-[52px] text-sm"
                  required
                >
                  <option value="">Select Major</option>
                  {degreeMajors.map(major => (
                    <option key={major} value={major}>{major}</option>
                  ))}
                </select>
                
                {showOtherInput('degreeMajor', 'degreeMajorOther') && (
                  <div className="mt-3">
                    <input
                      type="text"
                      value={formData.degreeMajorOther}
                      onChange={(e) => handleInputChange('degreeMajorOther', e.target.value)}
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent h-[52px] text-sm"
                      placeholder="Please specify major"
                    />
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Teaching Requirements */}
          <div className="border-b border-gray-200 pb-6">
            <h3 className="text-xl font-semibold text-gray-800 mb-4 flex items-center gap-2">
              <BookOpen className="w-5 h-5" />
              Teaching Requirements
            </h3>
            
            <div className="mb-6">
              <div className="flex items-center justify-between mb-3">
                <label className="block text-sm font-medium text-gray-700">
                  Curriculum Required to Teach
                </label>
                <div className="flex items-center gap-2">
                  <span className="text-xs text-gray-500 bg-gray-100 px-3 py-1 rounded-full">
                    Select up to 4
                  </span>
                  <span className="text-sm font-medium text-blue-600 bg-blue-50 px-3 py-1 rounded-full">
                    {formData.curriculumRequired?.length || 0}/4 Selected
                  </span>
                </div>
              </div>
              
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
                {curriculums.map((curriculum) => {
                  const isSelected = formData.curriculumRequired?.includes(curriculum);
                  const isDisabled = formData.curriculumRequired?.length >= 4 && !isSelected;
                  
                  return (
                    <label
                      key={curriculum}
                      className={`
                        flex items-center p-3 border-2 rounded-xl cursor-pointer transition-all duration-200
                        ${isSelected 
                          ? 'border-green-500 bg-green-50 ring-2 ring-green-500' 
                          : isDisabled
                            ? 'border-gray-200 bg-gray-50 cursor-not-allowed opacity-60'
                            : 'border-gray-200 hover:border-blue-400 hover:bg-blue-50'
                        }
                      `}
                    >
                      <input
                        type="checkbox"
                        checked={isSelected}
                        onChange={() => handleArrayChange('curriculumRequired', curriculum)}
                        disabled={isDisabled}
                        className="hidden"
                      />
                      <div className="flex items-center gap-2 w-full">
                        <div className={`
                          w-4 h-4 rounded border-2 flex items-center justify-center flex-shrink-0
                          ${isSelected 
                            ? 'bg-green-500 border-green-500' 
                            : 'border-gray-300'
                          }
                        `}>
                          {isSelected && (
                            <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                            </svg>
                          )}
                        </div>
                        <span className={`text-sm ${isSelected ? 'text-gray-900 font-medium' : 'text-gray-700'}`}>
                          {curriculum}
                        </span>
                      </div>
                    </label>
                  );
                })}
              </div>
              
              {showOtherInput('curriculumRequired', 'curriculumOther') && (
                <div className="mt-3">
                  <input
                    type="text"
                    value={formData.curriculumOther}
                    onChange={(e) => handleInputChange('curriculumOther', e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent h-[52px] text-sm"
                    placeholder="Please specify curriculum"
                  />
                </div>
              )}
              
              {formData.curriculumRequired?.length > 0 && (
                <div className="mt-3 flex flex-wrap gap-2">
                  {formData.curriculumRequired.map((curr) => (
                    <span key={curr} className="inline-flex items-center gap-1 px-3 py-1 bg-green-100 text-green-800 text-xs rounded-full">
                      {curr}
                      <button
                        type="button"
                        onClick={() => handleArrayChange('curriculumRequired', curr)}
                        className="ml-1 text-green-600 hover:text-green-800"
                      >
                        ×
                      </button>
                    </span>
                  ))}
                </div>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  English Teaching Certificate Required
                </label>
                <select
                  value={formData.englishCertRequired}
                  onChange={(e) => handleInputChange('englishCertRequired', e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent h-[52px] text-sm"
                >
                  <option value="">Select Certificate</option>
                  {englishCertificates.map(cert => (
                    <option key={cert} value={cert}>{cert}</option>
                  ))}
                </select>
                
                {showOtherInput('englishCertRequired', 'englishCertOther') && (
                  <div className="mt-3">
                    <input
                      type="text"
                      value={formData.englishCertOther}
                      onChange={(e) => handleInputChange('englishCertOther', e.target.value)}
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent h-[52px] text-sm"
                      placeholder="Please specify certificate"
                    />
                  </div>
                )}
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  General Teaching License Required *
                </label>
                <select
                  value={formData.teachingLicenseRequired}
                  onChange={(e) => handleInputChange('teachingLicenseRequired', e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent h-[52px] text-sm"
                  required
                >
                  <option value="">Select License</option>
                  {teachingLicenses.map(license => (
                    <option key={license} value={license}>{license}</option>
                  ))}
                </select>
                
                {showOtherInput('teachingLicenseRequired', 'teachingLicenseOther') && (
                  <div className="mt-3">
                    <input
                      type="text"
                      value={formData.teachingLicenseOther}
                      onChange={(e) => handleInputChange('teachingLicenseOther', e.target.value)}
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent h-[52px] text-sm"
                      placeholder="Please specify license"
                    />
                  </div>
                )}
              </div>
            </div>

            <div className="mt-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Attested Degree Required *
              </label>
              <div className="flex gap-4 text-sm">
                <label className="flex items-center">
                  <input
                    type="radio"
                    name="attestedDegreeRequired"
                    value="Yes"
                    checked={formData.attestedDegreeRequired === 'Yes'}
                    onChange={(e) => handleInputChange('attestedDegreeRequired', e.target.value)}
                    className="mr-2"
                    required
                  />
                  <span>Yes</span>
                </label>
                <label className="flex items-center">
                  <input
                    type="radio"
                    name="attestedDegreeRequired"
                    value="No"
                    checked={formData.attestedDegreeRequired === 'No'}
                    onChange={(e) => handleInputChange('attestedDegreeRequired', e.target.value)}
                    className="mr-2"
                  />
                  <span>No</span>
                </label>
                <label className="flex items-center">
                  <input
                    type="radio"
                    name="attestedDegreeRequired"
                    value="Non-Teaching Role"
                    checked={formData.attestedDegreeRequired === 'Non-Teaching Role'}
                    onChange={(e) => handleInputChange('attestedDegreeRequired', e.target.value)}
                    className="mr-2"
                  />
                  <span>Non-Teaching Role</span>
                </label>
              </div>
            </div>

            {formData.attestedDegreeRequired === 'Non-Teaching Role' && (
              <div className="mt-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Non-Teaching Role (Select up to 2)
                </label>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                  {nonTeachingRoles.map(role => (
                    <label key={role} className="flex items-center p-3 border rounded-lg cursor-pointer hover:bg-gray-50 text-sm">
                      <input
                        type="checkbox"
                        checked={formData.nonTeachingRole?.includes(role)}
                        onChange={() => handleArrayChange('nonTeachingRole', role)}
                        disabled={
                          formData.nonTeachingRole?.length >= 2 && 
                          !formData.nonTeachingRole?.includes(role)
                        }
                        className="mr-2"
                      />
                      <span>{role}</span>
                    </label>
                  ))}
                </div>
                
                {showOtherInput('nonTeachingRole', 'nonTeachingRoleOther') && (
                  <div className="mt-3">
                    <input
                      type="text"
                      value={formData.nonTeachingRoleOther}
                      onChange={(e) => handleInputChange('nonTeachingRoleOther', e.target.value)}
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent h-[52px] text-sm"
                      placeholder="Please specify role"
                    />
                  </div>
                )}
                <p className="text-sm text-gray-500 mt-2">
                  Selected: {formData.nonTeachingRole?.length || 0}/2
                </p>
              </div>
            )}
          </div>

          {/* Application & Residency */}
          <div className="border-b border-gray-200 pb-6">
            <h3 className="text-xl font-semibold text-gray-800 mb-4 flex items-center gap-2">
              <Calendar className="w-5 h-5" />
              Application & Residency Details
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Application Deadline *
                </label>
                <input
                  type="date"
                  value={formatDateForInput(formData.applicationDeadline)}
                  onChange={(e) => handleInputChange('applicationDeadline', e.target.value)}
                  min={getTomorrowDate()}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent h-[52px] text-sm"
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Residency Status *
                </label>
                <select
                  value={formData.residencyStatus}
                  onChange={(e) => handleInputChange('residencyStatus', e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent h-[52px] text-sm"
                  required
                >
                  <option value="">Select Residency Status</option>
                  {residencyStatuses.map(status => (
                    <option key={status} value={status}>{status}</option>
                  ))}
                </select>
                
                {showOtherInput('residencyStatus', 'residencyStatusOther') && (
                  <div className="mt-3">
                    <input
                      type="text"
                      value={formData.residencyStatusOther}
                      onChange={(e) => handleInputChange('residencyStatusOther', e.target.value)}
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent h-[52px] text-sm"
                      placeholder="Please specify residency status"
                    />
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Submit Section */}
          <div className="pt-6">
            <div className="flex justify-end gap-3">
              <button
                type="button"
                onClick={() => setShowForm(false)}
                className="px-6 py-3 border border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 transition-all duration-200 text-sm font-medium"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={createLoading}
                className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-blue-400 text-white rounded-xl font-semibold hover:shadow-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed text-sm"
              >
                {createLoading ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                    Publishing...
                  </>
                ) : (
                  <>
                    <Save className="w-4 h-4" />
                    Publish Job
                  </>
                )}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default JobPostForm;