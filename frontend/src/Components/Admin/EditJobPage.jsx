// src/pages/EditJobPage.jsx
import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams, useNavigate } from 'react-router-dom';
import { getJobDetails, updateJob, clearJobErrors } from '../../actions/jobActions';
import { UPDATE_JOB_RESET } from '../../constants/jobConstants';
import { toast } from 'react-toastify';
import { 
  ArrowLeft, Save, RefreshCw, AlertCircle, 
  Calendar, MapPin, Users, Briefcase, Eye 
} from 'lucide-react';

const EditJobPage = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  
  const { loading, error, job } = useSelector((state) => state.allJobs);
  const { loading: updateLoading, error: updateError, success: updateSuccess } = useSelector((state) => state.jobAction);
  
  const [formData, setFormData] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Load job details
  useEffect(() => {
    if (id) {
      dispatch(getJobDetails(id));
    }
  }, [dispatch, id]);

  // Prepare form data when job is loaded
  useEffect(() => {
    if (job) {
      // Transform API data to match form structure
      const preparedData = {
        jobId: job.jobId || '',
        jobTitle: job.jobTitle || '',
        jobTitleOther: job.jobTitleOther || '',
        gender: job.gender || '',
        category: job.category || '',
        jobDescription: job.jobDescription || '',
        preferredNationality: job.preferredNationality || '',
        preferredNationalityOther: job.preferredNationalityOther || '',
        estimatedJoiningDate: job.estimatedJoiningDate ? 
          new Date(job.estimatedJoiningDate).toISOString().split('T')[0] : '',
        jobType: job.jobType || '',
        jobTypeOther: job.jobTypeOther || '',
        jobApplyType: job.jobApplyType || '',
        jobApplyTypeOther: job.jobApplyTypeOther || '',
        applicationEmail: job.applicationEmail || '',
        salaryPaidBy: job.salaryPaidBy || '',
        salaryPaidByOther: job.salaryPaidByOther || '',
        minSalary: job.minSalary || '',
        maxSalary: job.maxSalary || '',
        experienceRequired: job.experienceRequired || '',
        experienceRequiredOther: job.experienceRequiredOther || '',
        careerLevel: job.careerLevel || '',
        careerLevelOther: job.careerLevelOther || '',
        minQualification: job.minQualification || '',
        minQualificationOther: job.minQualificationOther || '',
        degreeMajor: job.degreeMajor || '',
        degreeMajorOther: job.degreeMajorOther || '',
        location: job.location || '',
        locationOther: job.locationOther || '',
        curriculumRequired: job.curriculumRequired || [],
        curriculumOther: job.curriculumOther || '',
        englishCertRequired: job.englishCertRequired || '',
        englishCertOther: job.englishCertOther || '',
        teachingLicenseRequired: job.teachingLicenseRequired || '',
        teachingLicenseOther: job.teachingLicenseOther || '',
        attestedDegreeRequired: job.attestedDegreeRequired || '',
        nonTeachingRole: job.nonTeachingRole || [],
        nonTeachingRoleOther: job.nonTeachingRoleOther || '',
        applicationDeadline: job.applicationDeadline ? 
          new Date(job.applicationDeadline).toISOString().split('T')[0] : '',
        residencyStatus: job.residencyStatus || '',
        residencyStatusOther: job.residencyStatusOther || ''
      };
      setFormData(preparedData);
    }
  }, [job]);

  // Handle success and error states
  useEffect(() => {
    if (updateSuccess) {
      toast.success('Job updated successfully!');
      dispatch({ type: UPDATE_JOB_RESET });
      navigate(`/admin/jobs`);
    }
    
    if (updateError) {
      toast.error(updateError);
      dispatch(clearJobErrors());
      setIsSubmitting(false);
    }
  }, [updateSuccess, updateError, dispatch, navigate, id]);

  // Handle form input changes
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
      
      // Limit to 2 items for curriculum and non-teaching role
      if ((field === 'curriculumRequired' || field === 'nonTeachingRole') && newArray.length > 2) {
        return prev;
      }
      
      return { ...prev, [field]: newArray };
    });
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Prepare the data for API
    const jobData = {
      ...formData,
      country: job.country || 'Saudi Arabia',
      city: formData.location === 'Other' ? formData.locationOther : formData.location,
      workMode: job.workMode || 'On-site'
    };

    // Clean up empty fields
    Object.keys(jobData).forEach(key => {
      if (jobData[key] === '' || jobData[key] === null || jobData[key] === undefined) {
        delete jobData[key];
      }
    });

    // Clean up arrays
    if (jobData.curriculumRequired && jobData.curriculumRequired.length === 0) {
      delete jobData.curriculumRequired;
    }
    if (jobData.nonTeachingRole && jobData.nonTeachingRole.length === 0) {
      delete jobData.nonTeachingRole;
    }

    try {
      await dispatch(updateJob(id, jobData));
    } catch (err) {
      toast.error('Failed to update job posting');
      setIsSubmitting(false);
    }
  };

  // Handle refresh
  const handleRefresh = () => {
    dispatch(getJobDetails(id));
    toast.info('Refreshing job details...');
  };

  // Handle view job details
  const handleViewJob = () => {
    navigate(`/admin/jobs`);
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

  // Check if "Other" option should show input
  const showOtherInput = (field, otherField) => {
    return formData[field] === 'Other' || formData[field]?.includes('Other');
  };

  // Static data arrays (same as in JobPostForm)
  const saudiCities = [
    'Riyadh', 'Jeddah', 'Mecca', 'Medina', 'Dammam', 
    'Khobar', 'Dhahran', 'Tabuk', 'Abha', 'Jizan',
    'Hail', 'Buraidah', 'Najran', 'Al Jouf', 'Arar',
    'Sakakah', 'Yanbu', 'Taif', 'Qassim', 'Other'
  ];

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

  const categories = [
    'Accounting/Finance',
    'Administration/HR',
    'Non Teaching',
    'Safety/Security',
    'Teaching'
  ];

  const nationalities = [
    'Saudi',
    'Native Speaker',
    'Non Native Speaker',
    'Any',
    'Other'
  ];

  const jobTypes = [
    'Full Time',
    'Part Time',
    'Temporary',
    'Internship',
    'Other'
  ];

  const applyTypes = [
    'Through website',
    'By Email',
    'Other'
  ];

  const salaryPaymentTypes = [
    'Monthly',
    'Weekly',
    'Hourly',
    'Other'
  ];

  const experienceLevels = [
    '1',
    '2',
    '3',
    '4',
    '5',
    'More than 5 years',
    'Other'
  ];

  const careerLevels = [
    'Entry-Level',
    'Mid-Level',
    'Senior-Level',
    'Specialist/Expert-Level',
    'Managerial/Administrative Level',
    'Other'
  ];

  const qualifications = [
    'Doctorate Degree',
    'M Phil Degree',
    'Associate Degree',
    'Masters Degree',
    'Bachelors Degree',
    'Diploma',
    'Other'
  ];

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
    'Other'
  ];

  const englishCertificates = [
    'CELTA',
    'TESOL',
    'TEFL',
    'Not Required',
    'Other'
  ];

  const teachingLicenses = [
    'QTS',
    'PGCE',
    'Other',
    'Not Required'
  ];

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

  const residencyStatuses = [
    'Business Visa Provided',
    'Transferable Iqama Preferred',
    'Iqama Visa Provided',
    'Ajeer Accepted Only',
    'Other'
  ];

  // Loading state
  if (loading || !formData) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading job details...</p>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="max-w-md text-center">
          <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Error Loading Job</h2>
          <p className="text-gray-600 mb-6">{error}</p>
          <div className="flex gap-3 justify-center">
            <button
              onClick={handleRefresh}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              Retry
            </button>
            <button
              onClick={() => navigate('/admin/jobs')}
              className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
            >
              Back to Jobs
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Main render
  return (
    <div className="min-h-screen bg-gray-50  mt-30 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <button
            onClick={() => navigate(`/admin/jobs`)}
            className="flex items-center gap-2 text-blue-600 hover:text-blue-800 mb-4"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Job Details
          </button>
          
          <div className="flex justify-between items-start">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <h1 className="text-3xl font-bold text-gray-900">Edit Job</h1>
                <span className="px-3 py-1 bg-blue-100 text-blue-800 text-sm font-semibold rounded-full">
                  ID: {job.jobId}
                </span>
              </div>
              <p className="text-gray-600">Update the job details below.</p>
            </div>
            
            <div className="flex flex-col gap-3">
              <div className="flex gap-2">
                <button
                  onClick={handleRefresh}
                  disabled={loading}
                  className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 disabled:opacity-50"
                >
                  <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
                  Refresh
                </button>
                
                <button
                  className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
                >
                  <Users className="w-4 h-4" />
                  Applications ({job.applicationCount || 0})
                </button>
              </div>
              
              <div className="text-sm text-gray-500">
                Last updated: {formatDate(job.updatedAt)}
              </div>
            </div>
          </div>
        </div>

        {/* Job Info Summary */}
        <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
          <div className="flex justify-between items-center">
            <div>
              <h2 className="text-xl font-semibold text-gray-900">{job.jobTitle}</h2>
              {job.jobTitleOther && (
                <p className="text-gray-600 text-sm">({job.jobTitleOther})</p>
              )}
            </div>
            
            <div className="flex items-center gap-2">
              <span className="px-3 py-1 bg-green-100 text-green-800 text-sm font-semibold rounded-full">
                {job.status || 'Active'}
              </span>
              {job.isFeatured && (
                <span className="px-3 py-1 bg-purple-100 text-purple-800 text-sm font-semibold rounded-full">
                  Featured
                </span>
              )}
            </div>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4">
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
              <Briefcase className="w-4 h-4 text-gray-400" />
              <span className="text-sm text-gray-700">{job.category}</span>
            </div>
            
            <div className="flex items-center gap-2">
              <Users className="w-4 h-4 text-gray-400" />
              <span className="text-sm text-gray-700">
                Views: {job.viewCount || 0}
              </span>
            </div>
          </div>
        </div>

        {/* Edit Form */}
        <form onSubmit={handleSubmit} className="bg-white rounded-2xl shadow-lg p-6">
          {/* Job ID & Basic Information */}
          <div className="border-b border-gray-200 pb-6">
            <h3 className="text-xl font-semibold text-gray-800 mb-4">
              Job Basic Information
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Job ID *
                </label>
                <input
                  type="text"
                  value={formData.jobId}
                  onChange={(e) => handleInputChange('jobId', e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                  placeholder="e.g., JOB-2024-001"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Gender
                </label>
                <select
                  value={formData.gender}
                  onChange={(e) => handleInputChange('gender', e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="">Select Gender</option>
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                </select>
              </div>
            </div>

            <div className="mt-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Job Title *
              </label>
              <select
                value={formData.jobTitle}
                onChange={(e) => handleInputChange('jobTitle', e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
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
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Please specify job title"
                  />
                </div>
              )}
            </div>

            <div className="mt-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Category *
              </label>
              <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
                {categories.map(category => (
                  <label key={category} className="flex items-center p-3 border rounded-lg cursor-pointer hover:bg-gray-50">
                    <input
                      type="radio"
                      name="category"
                      value={category}
                      checked={formData.category === category}
                      onChange={(e) => handleInputChange('category', e.target.value)}
                      className="mr-2"
                      required
                    />
                    <span className="text-sm">{category}</span>
                  </label>
                ))}
              </div>
            </div>
          </div>

          {/* Job Description */}
          <div className="border-b border-gray-200 pb-6">
            <h3 className="text-xl font-semibold text-gray-800 mb-4">
              Job Description *
            </h3>
           
            <textarea
              value={formData.jobDescription}
              onChange={(e) => handleInputChange('jobDescription', e.target.value)}
              rows={6}
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
              placeholder="Describe the job responsibilities, duties, and requirements..."
              required
            />
          </div>

          {/* Nationality & Location */}
          <div className="border-b border-gray-200 pb-6">
            <h3 className="text-xl font-semibold text-gray-800 mb-4">
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
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
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
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
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
                  value={formData.estimatedJoiningDate}
                  onChange={(e) => handleInputChange('estimatedJoiningDate', e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
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
                  <label key={city} className="flex items-center p-3 border rounded-lg cursor-pointer hover:bg-gray-50">
                    <input
                      type="radio"
                      name="location"
                      value={city}
                      checked={formData.location === city}
                      onChange={(e) => handleInputChange('location', e.target.value)}
                      className="mr-2"
                      required
                    />
                    <span className="text-sm">{city}</span>
                  </label>
                ))}
              </div>
              
              {showOtherInput('location', 'locationOther') && (
                <div className="mt-3">
                  <input
                    type="text"
                    value={formData.locationOther}
                    onChange={(e) => handleInputChange('locationOther', e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Please specify location"
                  />
                </div>
              )}
            </div>
          </div>

          {/* Job Type & Application */}
          <div className="border-b border-gray-200 pb-6">
            <h3 className="text-xl font-semibold text-gray-800 mb-4">
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
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
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
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
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
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
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
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Please specify apply type"
                    />
                  </div>
                )}
              </div>
            </div>

            <div className="mt-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                CVs shall be sent to this email *
              </label>
              <input
                type="email"
                value={formData.applicationEmail}
                onChange={(e) => handleInputChange('applicationEmail', e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
                placeholder="hr@company.com"
              />
            </div>
          </div>

          {/* Salary Information */}
          <div className="border-b border-gray-200 pb-6">
            <h3 className="text-xl font-semibold text-gray-800 mb-4">
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
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
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
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
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
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
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
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="e.g., 10000"
                />
              </div>
            </div>
          </div>

          {/* Experience & Qualifications */}
          <div className="border-b border-gray-200 pb-6">
            <h3 className="text-xl font-semibold text-gray-800 mb-4">
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
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
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
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
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
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
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
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
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
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
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
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
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
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
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
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Please specify major"
                    />
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Teaching Requirements */}
          <div className="border-b border-gray-200 pb-6">
            <h3 className="text-xl font-semibold text-gray-800 mb-4">
              Teaching Requirements
            </h3>
            
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Curriculum Required to Teach (Select 1-2)
              </label>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {curriculums.map(curriculum => (
                  <label key={curriculum} className="flex items-center p-3 border rounded-lg cursor-pointer hover:bg-gray-50">
                    <input
                      type="checkbox"
                      checked={formData.curriculumRequired?.includes(curriculum)}
                      onChange={() => handleArrayChange('curriculumRequired', curriculum)}
                      disabled={
                        formData.curriculumRequired?.length >= 2 && 
                        !formData.curriculumRequired?.includes(curriculum)
                      }
                      className="mr-2"
                    />
                    <span className="text-sm">{curriculum}</span>
                  </label>
                ))}
              </div>
              
              {showOtherInput('curriculumRequired', 'curriculumOther') && (
                <div className="mt-3">
                  <input
                    type="text"
                    value={formData.curriculumOther}
                    onChange={(e) => handleInputChange('curriculumOther', e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Please specify curriculum"
                  />
                </div>
              )}
              <p className="text-sm text-gray-500 mt-2">
                Selected: {formData.curriculumRequired?.length || 0}/2
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  English Teaching Certificate Required
                </label>
                <select
                  value={formData.englishCertRequired}
                  onChange={(e) => handleInputChange('englishCertRequired', e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
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
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
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
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
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
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
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
              <div className="flex gap-4">
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
                    <label key={role} className="flex items-center p-3 border rounded-lg cursor-pointer hover:bg-gray-50">
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
                      <span className="text-sm">{role}</span>
                    </label>
                  ))}
                </div>
                
                {showOtherInput('nonTeachingRole', 'nonTeachingRoleOther') && (
                  <div className="mt-3">
                    <input
                      type="text"
                      value={formData.nonTeachingRoleOther}
                      onChange={(e) => handleInputChange('nonTeachingRoleOther', e.target.value)}
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
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
            <h3 className="text-xl font-semibold text-gray-800 mb-4">
              Application & Residency Details
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Application Deadline *
                </label>
                <input
                  type="date"
                  value={formData.applicationDeadline}
                  onChange={(e) => handleInputChange('applicationDeadline', e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
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
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
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
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Please specify residency status"
                    />
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Submit Section */}
          <div className="pt-6">
            <div className="flex justify-between items-center">
              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={() => navigate(`/admin/jobs`)}
                  className="flex items-center gap-2 px-6 py-3 border border-gray-300 text-gray-700 rounded-xl font-semibold hover:bg-gray-50 transition-all duration-200"
                >
                  Cancel
                </button>
              </div>
              
              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={handleViewJob}
                  className="flex items-center gap-2 px-6 py-3 border border-blue-600 text-blue-600 rounded-xl font-semibold hover:bg-blue-50 transition-all duration-200"
                >
                  <Eye className="w-5 h-5" />
                  View Job
                </button>
                
                <button
                  type="submit"
                  disabled={isSubmitting || updateLoading}
                  className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-blue-400 text-white rounded-xl font-semibold hover:shadow-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isSubmitting || updateLoading ? (
                    <>
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                      Updating...
                    </>
                  ) : (
                    <>
                      <Save className="w-5 h-5" />
                      Update Job Post
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditJobPage;