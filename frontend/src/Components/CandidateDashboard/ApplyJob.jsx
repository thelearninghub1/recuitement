import React, { useState, useEffect } from "react";
import { 
  Search, MapPin, Building, Clock, DollarSign, 
  Filter, Briefcase, Calendar, Users, Star,
  Bookmark, Share2, ArrowLeft, CheckCircle,
  ExternalLink, Heart, HeartOff, Globe,
  X, Upload, FileText, Send
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { getAllJobs, getJobDetails, clearJobErrors, applyForJob } from "../../actions/jobActions";
import { useDispatch, useSelector } from "react-redux";
import { APPLY_JOB_RESET } from "../../constants/jobConstants";

const Dashboard = () => {
  const dispatch = useDispatch();
  const { loading: jobsLoading, error: jobsError, jobs: allJobs = [], totalJobs } = useSelector((state) => state.allJobs);
  const { success: applySuccess, error: applyError, loading: applyLoading } = useSelector((state) => state.applications);
  const { user } = useSelector((state) => state.loginUser);

  const [jobs, setJobs] = useState([]);
  const [filteredJobs, setFilteredJobs] = useState([]);
  const [selectedJob, setSelectedJob] = useState(null);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [savedJobs, setSavedJobs] = useState(new Set());
  const [appliedJobs, setAppliedJobs] = useState(new Set());
  
  // Application Modal State
  const [showApplicationModal, setShowApplicationModal] = useState(false);
  const [selectedJobForApplication, setSelectedJobForApplication] = useState(null);
  const [resumeFile, setResumeFile] = useState(null);
  const [coverLetterFile, setCoverLetterFile] = useState(null);
  const [uploading, setUploading] = useState(false);

  // Filter states - Only KSA
  const [filters, setFilters] = useState({
    jobType: [],
    city: [],
    workMode: [],
    experience: [],
    salaryRange: [0, 50000],
    postedDate: "",
    curriculum: []
  });

  const navigate = useNavigate();

  // KSA Cities
  const ksaCities = [
    "Riyadh", "Jeddah", "Mecca", "Medina", "Dammam", 
    "Khobar", "Taif", "Tabuk", "Abha", "Jazan",
    "Hofuf", "Al Kharj", "Al Qatif", "Yanbu", "Najran"
  ];

  // Filter options - Only KSA
  const filterOptions = {
    jobType: ["Full Time", "Part Time", "Contract", "Temporary"],
    city: ksaCities,
    workMode: ["On-site", "Remote", "Hybrid"],
    experience: ["Entry Level", "1-2 years", "3-5 years", "More than 5 years"],
    postedDate: ["1", "3", "7", "14", "30"], // days
    curriculum: ["American Curriculum", "British Curriculum", "IB", "IGCSE", "Cambridge", "Early Years Foundation Stage", "Online Teaching", "International Curriculum", "Arabic Curriculum"]
  };

  // Fetch all jobs on component mount
  useEffect(() => {
    dispatch(getAllJobs());
  }, [dispatch]);

  // Handle jobs data when it loads
  useEffect(() => {
    if (allJobs && allJobs.length > 0) {
     const formattedJobs = allJobs.map(job => ({
  id: job._id,
  title: job.jobTitle === 'Other' && job.jobTitleOther 
    ? job.jobTitleOther 
    : job.jobTitle,
  jobTitle: job.jobTitle, // Keep original for reference
  jobTitleOther: job.jobTitleOther, // Keep for reference
  company: job.school?.name || "School in Saudi Arabia",
  country: job.country || "Saudi Arabia",
  city: job.city || "Riyadh",
  type: job.jobType || "Full Time",
  workMode: job.workMode || "On-site",
  experience: job.experienceRequired || "3-5 years",
  salary: job.minSalary && job.maxSalary 
    ? `${job.minSalary.toLocaleString()} - ${job.maxSalary.toLocaleString()} SAR` 
    : "Negotiable",
  postedDate: job.createdAt ? new Date(job.createdAt).toISOString().split('T')[0] : new Date().toISOString().split('T')[0],
  deadline: job.applicationDeadline ? new Date(job.applicationDeadline).toISOString().split('T')[0] : new Date().toISOString().split('T')[0],
  curriculum: Array.isArray(job.curriculumRequired) ? job.curriculumRequired : [job.curriculumRequired || "International Curriculum"],
  description: job.jobDescription || "Teaching position in Saudi Arabia",
  requirements: [
    `Experience: ${job.experienceRequired || "3-5 years"}`,
    `Qualification: ${job.minQualification || "Bachelor's Degree"}`,
    job.degreeMajor ? `Major: ${job.degreeMajor}` : "Relevant degree required",
    job.englishCertRequired ? `English Certification: ${job.englishCertRequired}` : "English proficiency required",
    job.teachingLicenseRequired ? `Teaching License: ${job.teachingLicenseRequired}` : "Teaching certification required"
  ].filter(Boolean),
  benefits: [
    "Competitive tax-free salary",
    "Housing allowance",
    "Medical insurance",
    "Annual flight tickets",
    "Professional development opportunities"
  ],
  companyInfo: {
    size: "500-1000 students",
    type: "International School",
    established: "2000"
  }
}));
      
      setJobs(formattedJobs);
      setFilteredJobs(formattedJobs);
      setLoading(false);
    } else if (!jobsLoading && allJobs) {
      setLoading(false);
    }
  }, [allJobs, jobsLoading]);

  // Clear errors on unmount
  useEffect(() => {
    return () => {
      dispatch(clearJobErrors());
    };
  }, [dispatch]);

  // Handle API errors
  useEffect(() => {
    if (jobsError) {
      toast.error(jobsError);
    }
  }, [jobsError]);

  // Handle application success
  useEffect(() => {
    if (applySuccess) {
      toast.success("Application submitted successfully!");
      setAppliedJobs(prev => new Set([...prev, selectedJobForApplication?.id]));
      setShowApplicationModal(false);
      setResumeFile(null);
      setCoverLetterFile(null);
      dispatch({
        type:APPLY_JOB_RESET
      })

    }
    if (applyError) {
      toast.error(applyError);
    }
  }, [applySuccess, applyError, selectedJobForApplication]);

  // Apply filters when filters or search term changes
  useEffect(() => {
    filterJobs();
  }, [filters, searchTerm, jobs]);

  const filterJobs = () => {
    let result = [...jobs];

    // Search filter
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      result = result.filter(job =>
        job.title.toLowerCase().includes(term) ||
        job.company.toLowerCase().includes(term) ||
        job.city.toLowerCase().includes(term)
      );
    }

    // Job type filter
    if (filters.jobType.length > 0) {
      result = result.filter(job => filters.jobType.includes(job.type));
    }

    // City filter
    if (filters.city.length > 0) {
      result = result.filter(job => filters.city.includes(job.city));
    }

    // Work mode filter
    if (filters.workMode.length > 0) {
      result = result.filter(job => filters.workMode.includes(job.workMode));
    }

    // Experience filter
    if (filters.experience.length > 0) {
      result = result.filter(job => {
        const jobExp = job.experience.toLowerCase();
        return filters.experience.some(exp => {
          const expLower = exp.toLowerCase();
          if (expLower.includes("entry")) return jobExp.includes("entry") || jobExp.includes("1");
          if (expLower.includes("1-2")) return jobExp.includes("1-2") || jobExp.includes("2");
          if (expLower.includes("3-5")) return jobExp.includes("3-5") || jobExp.includes("3") || jobExp.includes("4");
          if (expLower.includes("more than")) return jobExp.includes("more than") || jobExp.includes("5+") || jobExp.includes("5");
          return jobExp.includes(expLower);
        });
      });
    }

    // Curriculum filter
    if (filters.curriculum.length > 0) {
      result = result.filter(job => 
        job.curriculum.some(curriculum => 
          filters.curriculum.includes(curriculum)
        )
      );
    }

    // Posted date filter
    if (filters.postedDate) {
      const days = parseInt(filters.postedDate);
      const cutoffDate = new Date();
      cutoffDate.setDate(cutoffDate.getDate() - days);
      
      result = result.filter(job => {
        const postedDate = new Date(job.postedDate);
        return postedDate >= cutoffDate;
      });
    }

    // Salary range filter (extract min salary from salary string)
    result = result.filter(job => {
      const salaryText = job.salary;
      let minSalary = 0;
      
      // Extract first number from salary range
      const match = salaryText.match(/(\d+,\d+|\d+)/);
      if (match) {
        minSalary = parseInt(match[1].replace(',', ''));
      }
      
      return minSalary >= filters.salaryRange[0] && minSalary <= filters.salaryRange[1];
    });

    setFilteredJobs(result);
  };

  const handleFilterChange = (category, value) => {
    setFilters(prev => {
      if (Array.isArray(prev[category])) {
        const currentValues = prev[category];
        if (currentValues.includes(value)) {
          return {
            ...prev,
            [category]: currentValues.filter(item => item !== value)
          };
        } else {
          return {
            ...prev,
            [category]: [...currentValues, value]
          };
        }
      } else {
        return {
          ...prev,
          [category]: value
        };
      }
    });
  };

  const clearFilters = () => {
    setFilters({
      jobType: [],
      city: [],
      workMode: [],
      experience: [],
      salaryRange: [0, 50000],
      postedDate: "",
      curriculum: []
    });
    setSearchTerm("");
  };

  const toggleSaveJob = (id) => {
    setSavedJobs(prev => {
      const newSaved = new Set(prev);
      if (newSaved.has(id)) {
        newSaved.delete(id);
        toast.info("Job removed from saved");
      } else {
        newSaved.add(id);
        toast.success("Job saved successfully!");
      }
      return newSaved;
    });
  };

 

  const handleApplyClick = (job) => {
    console.log('Applying for job:', job);
    console.log('Job ID:', job.id || job._id);
    
    if (!user) {
        toast.error("Please login to apply for jobs");
        navigate('/teacher-login');
        return;
    }
    
    setSelectedJobForApplication(job);
    setShowApplicationModal(true);
};

const handleApplicationSubmit = async () => {
    if (!resumeFile) {
        toast.error("Please upload your resume to apply for this position.");
        return;
    }

    if (!selectedJobForApplication) {
        toast.error("No job selected for application");
        return;
    }

    // Get the job ID from selectedJobForApplication
    const jobId = selectedJobForApplication.id || selectedJobForApplication._id;
    
    if (!jobId) {
        toast.error("Invalid job data - missing job ID");
        return;
    }

    // Prepare form data
    const formData = new FormData();
    
    // Add user info
    formData.append('fullName', `${user?.profile?.firstName || ''} ${user?.profile?.lastName || ''}`.trim());
    formData.append('email', user?.email || '');
    
    // Add phone number if available
    const phoneInput = document.querySelector('input[type="tel"]');
    if (phoneInput?.value) {
        formData.append('phoneNumber', phoneInput.value);
    }
    
    // Add current location if available
    const locationInput = document.querySelector('input[placeholder*="City"]');
    if (locationInput?.value) {
        formData.append('currentLocation', locationInput.value);
    }
    
    // Add files
    formData.append('resume', resumeFile);
    if (coverLetterFile) {
        formData.append('coverLetter', coverLetterFile);
    }
    
    // Add additional information if available
    const additionalInfo = document.querySelector('textarea');
    if (additionalInfo?.value) {
        formData.append('additionalInfo', additionalInfo.value);
    }
    
    // Debug log
    console.log('Applying for job with ID:', jobId);
    console.log('Form data prepared');
    
    // Dispatch application action with jobId as first parameter
    dispatch(applyForJob(jobId, formData));
};

  const handleFileChange = (setFileFunction) => (event) => {
    const file = event.target.files[0];
    if (file) {
      const allowedTypes = ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
      const maxSize = 5 * 1024 * 1024;

      if (!allowedTypes.includes(file.type)) {
        toast.error('Please upload a PDF or Word document.');
        return;
      }

      if (file.size > maxSize) {
        toast.error('File size must be less than 5MB.');
        return;
      }

      setFileFunction(file);
      toast.success(`${file.name} uploaded successfully!`);
    }
  };

  const calculateDaysAgo = (dateString) => {
    const posted = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now - posted);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  const calculateDaysUntil = (dateString) => {
    const deadline = new Date(dateString);
    const now = new Date();
    const diffTime = deadline - now;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays > 0 ? diffDays : 0;
  };

  const handleViewJobDetails = async (id) => {
    try {
      dispatch(getJobDetails(id));
    } catch (error) {
      toast.error("Failed to load job details");
    }
  };

  // Application Modal Component
  const ApplicationModal = () => {
    if (!showApplicationModal || !selectedJobForApplication) return null;

    return (
      <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4 transition-all duration-300">
        <div className="bg-white rounded-3xl shadow-2xl max-w-4xl w-full max-h-[70vh] overflow-hidden transform transition-all duration-300 scale-100">
          {/* Modal Header */}
          <div className="bg-gradient-to-r from-[#0077BB] to-[#00AEEF] p-8 text-white relative">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <h2 className="text-3xl font-bold mb-2">Apply for Position</h2>
<p className="text-blue-100 text-xl font-medium mb-1">
  {selectedJobForApplication.jobTitle === 'Other' && selectedJobForApplication.jobTitleOther 
    ? selectedJobForApplication.jobTitleOther 
    : selectedJobForApplication.title}
</p>                <p className="text-blue-200">{selectedJobForApplication.company}</p>
                <div className="flex items-center gap-4 mt-4 text-blue-100">
                  <div className="flex items-center gap-2">
                    <MapPin className="w-4 h-4" />
                    <span>{selectedJobForApplication.city}, Saudi Arabia</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Briefcase className="w-4 h-4" />
                    <span>{selectedJobForApplication.type}</span>
                  </div>
                </div>
              </div>
              <button
                onClick={() => setShowApplicationModal(false)}
                className="p-3 hover:bg-white/20 rounded-2xl transition-all duration-200 hover:scale-110 ml-4"
              >
                <X className="w-6 h-6" />
              </button>
            </div>
          </div>

          {/* Modal Content - Horizontal Layout */}
          <div className="flex flex-col lg:flex-row max-h-[calc(90vh-200px)]">
            {/* Left Side - Application Form */}
            <div className="flex-1 p-8 border-r border-gray-200 overflow-y-auto">
              <div className="space-y-8">
                {/* Personal Information */}
                <div className="space-y-6">
                  <h3 className="text-2xl font-bold text-gray-800 border-b border-gray-200 pb-3">
                    Application Details
                  </h3>
                  
                  {/* Personal Info Fields */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className="block text-sm font-semibold text-gray-700">Full Name *</label>
                      <input
                        type="text"
                        defaultValue={`${user?.profile?.firstName || ''} ${user?.profile?.lastName || ''}`.trim()}                      
                        className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#0077BB] focus:border-transparent transition-all duration-200"
                        readOnly
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="block text-sm font-semibold text-gray-700">Email Address *</label>
                      <input
                        type="email"
                        defaultValue={user?.email || ""}
                        className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#0077BB] focus:border-transparent transition-all duration-200"
                        readOnly
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="block text-sm font-semibold text-gray-700">Phone Number</label>
                      <input
                        type="tel"
                        placeholder="+966 XXX XXX XXX"
                        defaultValue={user?.profile?.mobile || ""}

                        className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#0077BB] focus:border-transparent transition-all duration-200"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="block text-sm font-semibold text-gray-700">Current Location</label>
                      <input
                        type="text"
                        placeholder="City, Saudi Arabia"
                        defaultValue={`${user?.candidateData?.currentCity || ''}, ${user?.candidateData?.countryOfResidence || ''}`.trim()}                        className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#0077BB] focus:border-transparent transition-all duration-200"
                      />
                    </div>
                  </div>
                </div>

                {/* Resume Upload */}
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <label className="block text-lg font-semibold text-gray-800">
                      Upload Resume <span className="text-red-500">*</span>
                    </label>
                    {resumeFile && (
                      <div className="flex items-center gap-2 text-green-600">
                        <CheckCircle className="w-5 h-5" />
                        <span className="text-sm font-medium">Uploaded</span>
                      </div>
                    )}
                  </div>
                  
                  <div className="border-3 border-dashed border-gray-300 rounded-2xl p-8 text-center transition-all duration-300 hover:border-[#0077BB] hover:bg-blue-50 group">
                    <input
                      type="file"
                      id="resume-upload"
                      accept=".pdf,.doc,.docx"
                      onChange={handleFileChange(setResumeFile)}
                      className="hidden"
                    />
                    <label htmlFor="resume-upload" className="cursor-pointer block">
                      <div className="w-20 h-20 bg-blue-100 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:bg-blue-200 transition-all duration-300">
                        <Upload className="w-10 h-10 text-[#0077BB]" />
                      </div>
                      <p className="text-xl font-semibold text-gray-800 mb-3">
                        {resumeFile ? "Resume Uploaded Successfully" : "Click to Upload Resume"}
                      </p>
                      <p className="text-gray-600 mb-2">
                        {resumeFile ? resumeFile.name : "Drag & drop or click to browse files"}
                      </p>
                      <p className="text-sm text-gray-500">PDF, DOC, DOCX (Max 5MB)</p>
                    </label>
                  </div>
                </div>

                {/* Cover Letter Upload */}
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <label className="block text-lg font-semibold text-gray-800">
                      Cover Letter 
                      <span className="text-gray-500 text-sm font-normal ml-2">(Optional)</span>
                    </label>
                    {coverLetterFile && (
                      <div className="flex items-center gap-2 text-blue-600">
                        <CheckCircle className="w-5 h-5" />
                        <span className="text-sm font-medium">Added</span>
                      </div>
                    )}
                  </div>
                  
                  <div className="border-3 border-dashed border-gray-300 rounded-2xl p-8 text-center transition-all duration-300 hover:border-[#00AEEF] hover:bg-blue-50 group">
                    <input
                      type="file"
                      id="cover-letter-upload"
                      accept=".pdf,.doc,.docx"
                      onChange={handleFileChange(setCoverLetterFile)}
                      className="hidden"
                    />
                    <label htmlFor="cover-letter-upload" className="cursor-pointer block">
                      <div className="w-20 h-20 bg-gray-100 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:bg-blue-100 transition-all duration-300">
                        <FileText className="w-10 h-10 text-gray-500 group-hover:text-[#00AEEF]" />
                      </div>
                      <p className="text-xl font-semibold text-gray-800 mb-3">
                        {coverLetterFile ? "Cover Letter Added" : "Add Cover Letter"}
                      </p>
                      <p className="text-gray-600 mb-2">
                        {coverLetterFile ? coverLetterFile.name : "Optional supporting document"}
                      </p>
                      <p className="text-sm text-gray-500">PDF, DOC, DOCX (Max 5MB)</p>
                    </label>
                  </div>
                </div>

                {/* Additional Information */}
                <div className="space-y-4">
                  <label className="block text-lg font-semibold text-gray-800">
                    Additional Information
                    <span className="text-gray-500 text-sm font-normal ml-2">(Optional)</span>
                  </label>
                  <textarea
                    placeholder="Tell us why you're interested in this position and why you'd be a great fit..."
                    rows="4"
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#0077BB] focus:border-transparent transition-all duration-200 resize-none"
                  />
                </div>
              </div>
            </div>

            {/* Right Side - Job Summary & Actions */}
            <div className="lg:w-96 bg-gray-50 p-8 overflow-y-auto">
              <div className="space-y-8">
                {/* Job Summary */}
                <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-200">
                  <h4 className="text-lg font-bold text-gray-800 mb-4">Job Summary</h4>
                  <div className="space-y-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-blue-100 rounded-xl flex items-center justify-center">
                        <Building className="w-5 h-5 text-blue-600" />
                      </div>
                      <div>
                        <p className="text-sm text-gray-600">Company</p>
                        <p className="font-semibold text-gray-800">{selectedJobForApplication.company}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-green-100 rounded-xl flex items-center justify-center">
                        <MapPin className="w-5 h-5 text-green-600" />
                      </div>
                      <div>
                        <p className="text-sm text-gray-600">Location</p>
                        <p className="font-semibold text-gray-800">{selectedJobForApplication.city}, KSA</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-purple-100 rounded-xl flex items-center justify-center">
                        <Briefcase className="w-5 h-5 text-purple-600" />
                      </div>
                      <div>
                        <p className="text-sm text-gray-600">Type</p>
                        <p className="font-semibold text-gray-800">{selectedJobForApplication.type}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-orange-100 rounded-xl flex items-center justify-center">
                        <DollarSign className="w-5 h-5 text-orange-600" />
                      </div>
                      <div>
                        <p className="text-sm text-gray-600">Salary</p>
                        <p className="font-semibold text-gray-800">{selectedJobForApplication.salary}</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Application Progress */}
                <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-200">
                  <h4 className="text-lg font-bold text-gray-800 mb-4">Application Progress</h4>
                  <div className="space-y-4">
                    <div className="flex items-center gap-3">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                        resumeFile ? 'bg-green-500' : 'bg-gray-300'
                      }`}>
                        {resumeFile ? (
                          <CheckCircle className="w-5 h-5 text-white" />
                        ) : (
                          <span className="text-white text-sm font-bold">1</span>
                        )}
                      </div>
                      <div className="flex-1">
                        <p className="font-medium text-gray-800">Resume Upload</p>
                        <p className="text-sm text-gray-600">Required document</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                        coverLetterFile ? 'bg-green-500' : 'bg-gray-300'
                      }`}>
                        {coverLetterFile ? (
                          <CheckCircle className="w-5 h-5 text-white" />
                        ) : (
                          <span className="text-white text-sm font-bold">2</span>
                        )}
                      </div>
                      <div className="flex-1">
                        <p className="font-medium text-gray-800">Cover Letter</p>
                        <p className="text-sm text-gray-600">Optional document</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-gray-300 flex items-center justify-center">
                        <span className="text-white text-sm font-bold">3</span>
                      </div>
                      <div className="flex-1">
                        <p className="font-medium text-gray-800">Review & Submit</p>
                        <p className="text-sm text-gray-600">Final step</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Important Notes */}
                <div className="bg-blue-50 rounded-2xl p-6 border border-blue-200">
                  <div className="flex items-start gap-3">
                    <div className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                      <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                      </svg>
                    </div>
                    <div>
                      <p className="font-semibold text-blue-800 mb-2">Application Tips</p>
                      <ul className="text-sm text-blue-700 space-y-1">
                        <li>• Ensure your resume is up-to-date</li>
                        <li>• Highlight relevant teaching experience</li>
                        <li>• Mention any Saudi-specific qualifications</li>
                        <li>• Double-check contact information</li>
                      </ul>
                    </div>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="space-y-4">
                  <button
                    onClick={handleApplicationSubmit}
                    disabled={!resumeFile || applyLoading || uploading}
                    className="w-full px-8 py-4 bg-gradient-to-r from-[#0077BB] to-[#00AEEF] text-white rounded-2xl font-bold hover:shadow-2xl transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-3 hover:scale-105 transform text-lg"
                  >
                    {applyLoading || uploading ? (
                      <>
                        <div className="w-6 h-6 border-3 border-white border-t-transparent rounded-full animate-spin" />
                        <span>Submitting Application...</span>
                      </>
                    ) : (
                      <>
                        <Send className="w-6 h-6" />
                        <span>Submit Application</span>
                      </>
                    )}
                  </button>
                  
                  <button
                    onClick={() => setShowApplicationModal(false)}
                    className="w-full px-8 py-4 border-2 border-gray-300 text-gray-700 rounded-2xl font-semibold hover:bg-gray-50 hover:border-gray-400 transition-all duration-200 hover:shadow-lg"
                  >
                    Cancel Application
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  if (jobsLoading || loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-[#0077BB] border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading teaching jobs in Saudi Arabia...</p>
        </div>
      </div>
    );
  }

  if (jobsError) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 flex items-center justify-center">
        <div className="text-center bg-white p-8 rounded-2xl shadow-lg max-w-md">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <X className="w-8 h-8 text-red-500" />
          </div>
          <h3 className="text-xl font-semibold text-gray-800 mb-2">Error Loading Jobs</h3>
          <p className="text-gray-600 mb-4">{jobsError}</p>
          <button
            onClick={() => window.location.reload()}
            className="px-6 py-3 bg-gradient-to-r from-[#0077BB] to-[#00AEEF] text-white rounded-xl font-semibold hover:shadow-lg transition-all duration-200"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen mt-30 bg-gradient-to-br from-blue-50 to-indigo-50 py-8 px-4 md:px-8 font-sans">
      <ApplicationModal />
      
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="bg-white rounded-2xl shadow-lg p-6 mb-8">
          <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
            <div>
              <h1 className="text-2xl md:text-3xl font-bold text-gray-800 mb-2 flex items-center gap-2">
                <Building className="w-8 h-8 text-[#0077BB]" />
                Teaching Jobs in Saudi Arabia
              </h1>
              <p className="text-gray-600">
                Discover teaching opportunities across {ksaCities.length} cities in Saudi Arabia
              </p>
            </div>
            
            <div className="flex items-center gap-4">
              <button
                onClick={() => navigate('/teacher-profile')}
                className="flex items-center gap-2 px-4 py-2 text-[#0077BB] hover:text-[#005588] transition-colors duration-200"
              >
                <ArrowLeft className="w-4 h-4" />
                Back to Profile
              </button>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Filters Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl shadow-lg p-6 sticky top-8">
              {/* Search Bar */}
              <div className="relative mb-6">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  placeholder="Search jobs, companies, cities..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#0077BB] focus:border-transparent transition-all duration-200"
                />
              </div>

              {/* Filter Header */}
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
                  <Filter className="w-5 h-5 text-[#0077BB]" />
                  Filters
                </h3>
                <button
                  onClick={clearFilters}
                  className="text-sm text-[#0077BB] hover:text-[#005588] transition-colors duration-200"
                >
                  Clear All
                </button>
              </div>

              {/* Job Type Filter */}
              <div className="mb-6">
                <h4 className="font-medium text-gray-700 mb-3">Job Type</h4>
                <div className="space-y-2">
                  {filterOptions.jobType.map(type => (
                    <label key={type} className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={filters.jobType.includes(type)}
                        onChange={() => handleFilterChange('jobType', type)}
                        className="rounded border-gray-300 text-[#0077BB] focus:ring-[#0077BB]"
                      />
                      <span className="text-sm text-gray-600">{type}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* City Filter - Only KSA Cities */}
              <div className="mb-6">
                <h4 className="font-medium text-gray-700 mb-3">City</h4>
                <div className="space-y-2 max-h-40 overflow-y-auto">
                  {filterOptions.city.map(city => (
                    <label key={city} className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={filters.city.includes(city)}
                        onChange={() => handleFilterChange('city', city)}
                        className="rounded border-gray-300 text-[#0077BB] focus:ring-[#0077BB]"
                      />
                      <span className="text-sm text-gray-600">{city}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Work Mode Filter */}
              <div className="mb-6">
                <h4 className="font-medium text-gray-700 mb-3">Work Mode</h4>
                <div className="space-y-2">
                  {filterOptions.workMode.map(mode => (
                    <label key={mode} className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={filters.workMode.includes(mode)}
                        onChange={() => handleFilterChange('workMode', mode)}
                        className="rounded border-gray-300 text-[#0077BB] focus:ring-[#0077BB]"
                      />
                      <span className="text-sm text-gray-600">{mode}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Experience Filter */}
              <div className="mb-6">
                <h4 className="font-medium text-gray-700 mb-3">Experience Level</h4>
                <div className="space-y-2">
                  {filterOptions.experience.map(exp => (
                    <label key={exp} className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={filters.experience.includes(exp)}
                        onChange={() => handleFilterChange('experience', exp)}
                        className="rounded border-gray-300 text-[#0077BB] focus:ring-[#0077BB]"
                      />
                      <span className="text-sm text-gray-600">{exp}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Curriculum Filter */}
              <div className="mb-6">
                <h4 className="font-medium text-gray-700 mb-3">Curriculum</h4>
                <div className="space-y-2 max-h-40 overflow-y-auto">
                  {filterOptions.curriculum.map(curriculum => (
                    <label key={curriculum} className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={filters.curriculum.includes(curriculum)}
                        onChange={() => handleFilterChange('curriculum', curriculum)}
                        className="rounded border-gray-300 text-[#0077BB] focus:ring-[#0077BB]"
                      />
                      <span className="text-sm text-gray-600">{curriculum}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Posted Date Filter */}
              <div className="mb-6">
                <h4 className="font-medium text-gray-700 mb-3">Posted Date</h4>
                <select
                  value={filters.postedDate}
                  onChange={(e) => handleFilterChange('postedDate', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0077BB] focus:border-transparent transition-all duration-200"
                >
                  <option value="">Any Time</option>
                  <option value="1">Last 24 hours</option>
                  <option value="3">Last 3 days</option>
                  <option value="7">Last 7 days</option>
                  <option value="14">Last 14 days</option>
                  <option value="30">Last 30 days</option>
                </select>
              </div>

              {/* Salary Range Filter */}
              <div className="mb-6">
                <h4 className="font-medium text-gray-700 mb-3">
                  Salary Range: {filters.salaryRange[0].toLocaleString()} - {filters.salaryRange[1].toLocaleString()} SAR
                </h4>
                <div className="space-y-3">
                  <input
                    type="range"
                    min="0"
                    max="50000"
                    step="1000"
                    value={filters.salaryRange[0]}
                    onChange={(e) => setFilters(prev => ({
                      ...prev,
                      salaryRange: [parseInt(e.target.value), prev.salaryRange[1]]
                    }))}
                    className="w-full"
                  />
                  <input
                    type="range"
                    min="0"
                    max="50000"
                    step="1000"
                    value={filters.salaryRange[1]}
                    onChange={(e) => setFilters(prev => ({
                      ...prev,
                      salaryRange: [prev.salaryRange[0], parseInt(e.target.value)]
                    }))}
                    className="w-full"
                  />
                </div>
              </div>

              {/* Results Count */}
              <div className="p-4 bg-blue-50 rounded-xl text-center">
                <p className="text-lg font-semibold text-[#0077BB]">{filteredJobs.length}</p>
                <p className="text-sm text-gray-600">Jobs in Saudi Arabia</p>
              </div>
            </div>
          </div>

          {/* Jobs List & Details */}
          <div className="lg:col-span-3">
            {selectedJob ? (
              /* Job Details View */
              <div className="bg-white rounded-2xl shadow-lg">
                {/* Job Header */}
                <div className="p-6 border-b border-gray-200">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <button
                          onClick={() => setSelectedJob(null)}
                          className="flex items-center gap-2 text-[#0077BB] hover:text-[#005588] transition-colors duration-200"
                        >
                          <ArrowLeft className="w-4 h-4" />
                          Back to Jobs
                        </button>
                      </div>
                      <h2 className="text-2xl font-bold text-gray-800 mb-2">
  {selectedJob.jobTitle === 'Other' && selectedJob.jobTitleOther 
    ? selectedJob.jobTitleOther 
    : selectedJob.title}
</h2>
                      <p className="text-xl text-gray-600 mb-4">{selectedJob.company}</p>
                      
                      <div className="flex flex-wrap gap-4 text-sm text-gray-600">
                        <div className="flex items-center gap-1">
                          <MapPin className="w-4 h-4" />
                          {selectedJob.city}, Saudi Arabia
                        </div>
                        <div className="flex items-center gap-1">
                          <Briefcase className="w-4 h-4" />
                          {selectedJob.type}
                        </div>
                        <div className="flex items-center gap-1">
                          <Clock className="w-4 h-4" />
                          {selectedJob.workMode}
                        </div>
                        <div className="flex items-center gap-1">
                          <DollarSign className="w-4 h-4" />
                          {selectedJob.salary}
                        </div>
                        <div className="flex items-center gap-1">
                          <Calendar className="w-4 h-4" />
                          Posted {calculateDaysAgo(selectedJob.postedDate)} days ago
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => toggleSaveJob(selectedJob.id)}
                        className="p-2 text-gray-400 hover:text-red-500 transition-colors duration-200"
                      >
                        {savedJobs.has(selectedJob.id) ? (
                          <Heart className="w-5 h-5 text-red-500" />
                        ) : (
                          <HeartOff className="w-5 h-5" />
                        )}
                      </button>
                      <button className="p-2 text-gray-400 hover:text-blue-500 transition-colors duration-200">
                        <Share2 className="w-5 h-5" />
                      </button>
                    </div>
                  </div>

                  <div className="flex gap-3">
                    {appliedJobs.has(selectedJob.id) ? (
                      <button
                        disabled
                        className="flex items-center gap-2 px-6 py-3 bg-green-500 text-white rounded-xl font-semibold cursor-not-allowed"
                      >
                        <CheckCircle className="w-5 h-5" />
                        Applied Successfully
                      </button>
                    ) : (
                      <button
    onClick={() => handleApplyClick(selectedJob)}
    className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-[#0077BB] to-[#00AEEF] text-white rounded-xl font-semibold hover:shadow-lg transition-all duration-200"
>
    <Briefcase className="w-5 h-5" />
    Apply Now
</button>
                    )}
                    <button className="flex items-center gap-2 px-6 py-3 border border-gray-300 text-gray-700 rounded-xl font-semibold hover:bg-gray-50 transition-all duration-200">
                      <ExternalLink className="w-5 h-5" />
                      View Company
                    </button>
                  </div>
                </div>

                {/* Job Content */}
                <div className="p-6 space-y-8">
                  {/* Location & Curriculum */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="bg-blue-50 rounded-xl p-4">
                      <h4 className="font-semibold text-blue-800 mb-2 flex items-center gap-2">
                        <MapPin className="w-4 h-4" />
                        Location
                      </h4>
                      <p className="text-blue-700">{selectedJob.city}, Saudi Arabia</p>
                      <p className="text-sm text-blue-600 mt-1">{selectedJob.workMode}</p>
                    </div>
                    <div className="bg-green-50 rounded-xl p-4">
                      <h4 className="font-semibold text-green-800 mb-2 flex items-center gap-2">
                        <Bookmark className="w-4 h-4" />
                        Curriculum
                      </h4>
                      <div className="flex flex-wrap gap-1">
                        {selectedJob.curriculum.map((curr, index) => (
                          <span key={index} className="px-2 py-1 bg-green-100 text-green-700 rounded-lg text-xs">
                            {curr}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Job Description */}
                  <div>
                    <h3 className="text-xl font-semibold text-gray-800 mb-4">Job Description</h3>
                    <p className="text-gray-700 leading-relaxed">{selectedJob.description}</p>
                  </div>

                  {/* Requirements */}
                  <div>
                    <h3 className="text-xl font-semibold text-gray-800 mb-4">Requirements</h3>
                    <ul className="space-y-2">
                      {selectedJob.requirements.map((req, index) => (
                        <li key={index} className="flex items-start gap-2 text-gray-700">
                          <CheckCircle className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                          <span>{req}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Benefits */}
                  <div>
                    <h3 className="text-xl font-semibold text-gray-800 mb-4">Benefits</h3>
                    <ul className="space-y-2">
                      {selectedJob.benefits.map((benefit, index) => (
                        <li key={index} className="flex items-start gap-2 text-gray-700">
                          <Star className="w-5 h-5 text-yellow-500 mt-0.5 flex-shrink-0" />
                          <span>{benefit}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Company Info */}
                  <div className="bg-gray-50 rounded-xl p-6">
                    <h3 className="text-xl font-semibold text-gray-800 mb-4">About the Company</h3>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div>
                        <p className="text-sm text-gray-600">Company Size</p>
                        <p className="font-medium text-gray-800">{selectedJob.companyInfo.size}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600">School Type</p>
                        <p className="font-medium text-gray-800">{selectedJob.companyInfo.type}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600">Established</p>
                        <p className="font-medium text-gray-800">{selectedJob.companyInfo.established}</p>
                      </div>
                    </div>
                  </div>

                  {/* Application Deadline */}
                  <div className="bg-blue-50 rounded-xl p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="font-semibold text-blue-800 mb-1">Application Deadline</h4>
                        <p className="text-blue-700">
                          {new Date(selectedJob.deadline).toLocaleDateString('en-US', {
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric'
                          })}
                        </p>
                      </div>
                      {!appliedJobs.has(selectedJob.id) && (
                        <button
                          onClick={() => handleApplyClick(selectedJob)}
                          className="px-6 py-3 bg-gradient-to-r from-[#0077BB] to-[#00AEEF] text-white rounded-xl font-semibold hover:shadow-lg transition-all duration-200"
                        >
                          Apply Now
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              /* Jobs List View */
              <div className="space-y-4">
                {filteredJobs.length === 0 ? (
                  <div className="bg-white rounded-2xl shadow-lg p-8 text-center">
                    <Briefcase className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-xl font-semibold text-gray-800 mb-2">No Jobs Found</h3>
                    <p className="text-gray-600 mb-4">Try adjusting your filters or search terms</p>
                    <button
                      onClick={clearFilters}
                      className="px-6 py-3 bg-gradient-to-r from-[#0077BB] to-[#00AEEF] text-white rounded-xl font-semibold hover:shadow-lg transition-all duration-200"
                    >
                      Clear All Filters
                    </button>
                  </div>
                ) : (
                  filteredJobs.map(job => (
                    <div
                      key={job.id}
                      className="bg-white rounded-2xl shadow-lg p-6 hover:shadow-xl transition-all duration-200 cursor-pointer border-2 border-transparent hover:border-blue-200"
                      onClick={() => setSelectedJob(job)}
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-start gap-3 mb-3">
                            <div className="w-12 h-12 bg-gradient-to-r from-[#0077BB] to-[#00AEEF] rounded-xl flex items-center justify-center">
                              <Building className="w-6 h-6 text-white" />
                            </div>
                            <div className="flex-1">
                              <h3 className="text-lg font-semibold text-gray-800 mb-1">
  {job.jobTitle === 'Other' && job.jobTitleOther 
    ? job.jobTitleOther 
    : job.title}
</h3>
                              <p className="text-gray-600 mb-2">{job.company}</p>
                              
                              <div className="flex flex-wrap gap-3 text-sm text-gray-500 mb-2">
                                <span className="flex items-center gap-1">
                                  <MapPin className="w-4 h-4" />
                                  {job.city}, Saudi Arabia
                                </span>
                                <span className="flex items-center gap-1">
                                  <Briefcase className="w-4 h-4" />
                                  {job.type}
                                </span>
                                <span className="flex items-center gap-1">
                                  <Clock className="w-4 h-4" />
                                  {job.workMode}
                                </span>
                                <span className="flex items-center gap-1">
                                  <DollarSign className="w-4 h-4" />
                                  {job.salary}
                                </span>
                              </div>

                              {/* Curriculum Tags */}
                              <div className="flex flex-wrap gap-1 mb-3">
                                {job.curriculum.map((curr, index) => (
                                  <span key={index} className="px-2 py-1 bg-blue-100 text-blue-700 rounded-lg text-xs">
                                    {curr}
                                  </span>
                                ))}
                              </div>
                            </div>
                          </div>
                          
                          <p className="text-gray-700 line-clamp-2 mb-3">{job.description}</p>
                          
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-4 text-sm text-gray-500">
                              <span>Posted {calculateDaysAgo(job.postedDate)} days ago</span>
                              <span>•</span>
                              <span>Expires in {calculateDaysUntil(job.deadline)} days</span>
                            </div>
                            
                            <div className="flex items-center gap-2">
                              {appliedJobs.has(job.id) && (
                                <span className="px-2 py-1 bg-green-100 text-green-700 rounded-lg text-xs font-medium">
                                  Applied
                                </span>
                              )}
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  toggleSaveJob(job.id);
                                }}
                                className="p-1 text-gray-400 hover:text-red-500 transition-colors duration-200"
                              >
                                {savedJobs.has(job.id) ? (
                                  <Heart className="w-5 h-5 text-red-500" />
                                ) : (
                                  <HeartOff className="w-5 h-5" />
                                )}
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;