import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  Briefcase, Users, BarChart3, MessageSquare, 
  Settings, Bell, Plus, ArrowLeft, Database
} from 'lucide-react';
import { useDispatch, useSelector } from 'react-redux';
import { getMyJobs, getJobApplications } from '../../actions/jobActions';
import JobPostForm from './JobPostForm';

const SchoolDashboard = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('overview');
  const [showNewJobForm, setShowNewJobForm] = useState(false);
  
  // State for applications count
  const [totalApplications, setTotalApplications] = useState(0);
  const [applicationsLoading, setApplicationsLoading] = useState(false);

  // Get jobs from Redux state
  const { jobs = [], loading: jobsLoading } = useSelector((state) => state.allJobs || { jobs: [] });
  const { user } = useSelector((state) => state.loginUser);
  
  // Get applications from Redux state
  const applicationsState = useSelector((state) => state.applications || {});
  const { applications = [], loading: appLoading } = applicationsState;

  const tabs = [
    { id: 'overview', label: 'Overview', icon: BarChart3 },
    { id: 'jobs', label: 'Job Postings', icon: Briefcase },
  ];

  // Load jobs on component mount
  useEffect(() => {
    dispatch(getMyJobs());
  }, [dispatch]);

  // Fetch applications for each job and calculate total
  useEffect(() => {
    const fetchAllApplications = async () => {
      if (jobs.length === 0) {
        setTotalApplications(0);
        return;
      }

      setApplicationsLoading(true);
      let total = 0;

      try {
        // Fetch applications for each job
        for (const job of jobs) {
          await dispatch(getJobApplications(job._id));
        }
      } catch (error) {
        console.error('Error fetching applications:', error);
      } finally {
        setApplicationsLoading(false);
      }
    };

    fetchAllApplications();
  }, [jobs, dispatch]);

  // Update total applications count whenever applications state changes
  useEffect(() => {
    if (applications && Array.isArray(applications)) {
      setTotalApplications(applications.length);
    }
  }, [applications]);

  // Alternative: Store all applications in a map
  const [allApplications, setAllApplications] = useState([]);
  
  useEffect(() => {
    // When applications change, add them to allApplications if not already there
    if (applications && applications.length > 0) {
      // Check if we already have these applications
      const existingIds = new Set(allApplications.map(app => app._id));
      const newApps = applications.filter(app => !existingIds.has(app._id));
      if (newApps.length > 0) {
        setAllApplications(prev => [...prev, ...newApps]);
      }
    }
  }, [applications]);

  // Calculate total from allApplications
  useEffect(() => {
    setTotalApplications(allApplications.length);
  }, [allApplications]);

  const handleJobSubmit = (jobData) => {
    console.log('Job submitted:', jobData);
    setShowNewJobForm(false);
    // API call to save job
  };

  // Count active jobs (or all jobs)
  const totalJobs = jobs.length;
  const activeJobs = jobs.filter(job => job.status === 'active').length;

  const renderContent = () => {
    switch (activeTab) {
      case 'overview':
        return (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="bg-white rounded-2xl shadow-lg p-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">Quick Stats</h3>
              
              {/* Stats Grid */}
              <div className="grid grid-cols-2 gap-4">
                {/* Total Jobs Card */}
                <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-600 font-medium">Total Jobs</p>
                      {jobsLoading ? (
                        <div className="h-8 w-12 bg-gray-200 animate-pulse rounded mt-1"></div>
                      ) : (
                        <p className="text-2xl font-bold text-gray-900">{totalJobs}</p>
                      )}
                    </div>
                    <div className="bg-blue-500 rounded-lg p-2">
                      <Briefcase className="w-5 h-5 text-white" />
                    </div>
                  </div>
                </div>

                {/* Active Jobs Card */}
                <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-xl p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-600 font-medium">Active Jobs</p>
                      {jobsLoading ? (
                        <div className="h-8 w-12 bg-gray-200 animate-pulse rounded mt-1"></div>
                      ) : (
                        <p className="text-2xl font-bold text-gray-900">{activeJobs}</p>
                      )}
                    </div>
                    <div className="bg-green-500 rounded-lg p-2">
                      <BarChart3 className="w-5 h-5 text-white" />
                    </div>
                  </div>
                </div>
              </div>

              {/* Teachers Database Button */}
              <button
                onClick={() => navigate('/teachers-database')}
                className="mt-6 w-full flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-[#0077BB] to-[#00AEEF] text-white rounded-xl font-semibold hover:shadow-lg transition-all duration-200"
              >
                <Database className="w-5 h-5" />
                Browse Teachers Database
              </button>

              {/* Recent Jobs List */}
              {!jobsLoading && jobs.length > 0 && (
                <div className="mt-6 pt-6 border-t border-gray-200">
                  <h4 className="text-sm font-semibold text-gray-700 mb-3">Recent Job Postings</h4>
                  <div className="space-y-2">
                    {jobs.slice(0, 5).map((job) => (
                      <div key={job._id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                        <div className="flex items-center gap-3">
                          <div className={`w-2 h-2 rounded-full ${job.status === 'active' ? 'bg-green-500' : 'bg-gray-400'}`}></div>
                          <span className="text-sm font-medium text-gray-800">
                            {job.jobTitle === 'Other' && job.jobTitleOther 
                              ? job.jobTitleOther 
                              : job.jobTitle}
                          </span>
                        </div>
                        <span className="text-xs text-gray-500">
                          {new Date(job.createdAt).toLocaleDateString()}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {!jobsLoading && jobs.length === 0 && (
                <div className="mt-6 pt-6 border-t border-gray-200 text-center">
                  <p className="text-gray-500 text-sm">No jobs posted yet</p>
                  <button
                    onClick={() => {
                      setActiveTab('jobs');
                      setShowNewJobForm(true);
                    }}
                    className="mt-2 text-sm text-blue-600 hover:text-blue-800 font-medium"
                  >
                    Post your first job →
                  </button>
                </div>
              )}
            </div>

            <div className="bg-white rounded-2xl shadow-lg p-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">Recent Activity</h3>
              <div className="space-y-4">
                {!jobsLoading && jobs.length > 0 ? (
                  jobs.slice(0, 5).map((job) => (
                    <div key={job._id} className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
                      <div className="bg-blue-100 rounded-full p-2 mt-1">
                        <Briefcase className="w-4 h-4 text-blue-600" />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-800">
                          {job.jobTitle === 'Other' && job.jobTitleOther 
                            ? job.jobTitleOther 
                            : job.jobTitle}
                        </p>
                        <p className="text-xs text-gray-500">
                          {job.status === 'active' ? 'Posted' : 'Updated'} • {new Date(job.createdAt).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-8">
                    <p className="text-gray-500">No recent activity</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        );
      
      case 'jobs':
        return (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold text-gray-800">View & Post Jobs</h2>
              <button
                onClick={() => setShowNewJobForm(true)}
                className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-[#0077BB] to-[#00AEEF] text-white rounded-xl font-semibold hover:shadow-lg transition-all duration-200"
              >
                <Plus className="w-5 h-5" />
                Click Me
              </button>
            </div>

            {showNewJobForm ? (
              <JobPostForm onSubmit={handleJobSubmit} />
            ) : (
              <div className="bg-white rounded-2xl shadow-lg p-6">
                {/* Quick Stats Summary */}
                <div className="grid grid-cols-2 gap-4 mb-6">
                  <div className="bg-blue-50 rounded-lg p-4 text-center">
                    <p className="text-2xl font-bold text-blue-600">{totalJobs}</p>
                    <p className="text-sm text-gray-600">Total Jobs</p>
                  </div>
                  <div className="bg-green-50 rounded-lg p-4 text-center">
                    <p className="text-2xl font-bold text-green-600">{activeJobs}</p>
                    <p className="text-sm text-gray-600">Active</p>
                  </div>
                </div>

                {/* Jobs List */}
                {jobsLoading ? (
                  <div className="flex justify-center py-12">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                  </div>
                ) : jobs.length === 0 ? (
                  <div className="text-center py-12">
                    <Briefcase className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                    <p className="text-gray-600">No active job postings</p>
                    <p className="text-sm text-gray-400 mt-2">Click "Click Me" to post your first job</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {jobs.map((job) => {
                      // Get application count for this specific job from allApplications
                      const jobAppCount = allApplications.filter(app => app.job?._id === job._id || app.job === job._id).length;
                      return (
                        <div key={job._id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                          <div className="flex justify-between items-start">
                            <div>
                              <h4 className="font-semibold text-gray-800">
                                {job.jobTitle === 'Other' && job.jobTitleOther 
                                  ? job.jobTitleOther 
                                  : job.jobTitle}
                              </h4>
                              <p className="text-sm text-gray-500 mt-1">{job.location || job.city}</p>
                              <p className="text-xs text-purple-600 mt-1">
                                {jobAppCount} application{jobAppCount !== 1 ? 's' : ''}
                              </p>
                            </div>
                            <span className={`px-3 py-1 text-xs font-semibold rounded-full ${
                              job.status === 'active' 
                                ? 'bg-green-100 text-green-800' 
                                : 'bg-gray-100 text-gray-600'
                            }`}>
                              {job.status || 'Active'}
                            </span>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            )}
          </div>
        );
      
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 mt-40">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center gap-4">
              <Link 
                to="/school-profile" 
                className="flex items-center gap-2 text-gray-600 hover:text-[#0077BB] transition-colors"
              >
                <ArrowLeft className="w-5 h-5" />
                <span className="font-medium hidden sm:inline">Back to Profile</span>
                <span className="font-medium sm:hidden">Back</span>
              </Link>
              <h1 className="text-2xl font-bold text-gray-800">School Dashboard</h1>
            </div>
            
            <div className="flex items-center gap-4">
              <button className="p-2 text-gray-400 hover:text-gray-600">
                <Bell className="w-6 h-6" />
              </button>
              <div className="w-8 h-8 bg-gradient-to-r from-[#0077BB] to-[#00AEEF] rounded-full"></div>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar */}
          <div className="lg:w-64 flex-shrink-0">
            <nav className="bg-white rounded-2xl shadow-sm p-4">
              <ul className="space-y-2">
                {tabs.map(tab => {
                  const Icon = tab.icon;
                  return (
                    <li key={tab.id}>
                      <button
                        onClick={() => setActiveTab(tab.id)}
                        className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-left transition-colors duration-200 ${
                          activeTab === tab.id
                            ? 'bg-[#0077BB] text-white'
                            : 'text-gray-700 hover:bg-gray-100'
                        }`}
                      >
                        <Icon className="w-5 h-5" />
                        <span className="font-medium">{tab.label}</span>
                      </button>
                    </li>
                  );
                })}
              </ul>

              {/* Teachers Database Button in Sidebar */}
              <button
                onClick={() => navigate('/teachers-database')}
                className="mt-4 w-full flex items-center gap-3 px-4 py-3 rounded-xl text-left text-gray-700 hover:bg-gray-100 transition-colors duration-200"
              >
                <Database className="w-5 h-5" />
                <span className="font-medium">Teachers Database</span>
              </button>
            </nav>
          </div>

          {/* Main Content */}
          <div className="flex-1">
            {renderContent()}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SchoolDashboard;