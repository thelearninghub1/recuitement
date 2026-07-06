// src/pages/SystemAdminDashboard.jsx
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, 
  PieChart, Pie, Cell, LineChart, Line, ResponsiveContainer
} from 'recharts'; 
import { 
  FaSchool, FaUserGraduate, FaBriefcase, FaFileAlt,
  FaChartLine, FaUsers, FaBuilding, FaSignOutAlt,
  FaUser, FaBell, FaCog
} from 'react-icons/fa';
import { toast } from 'react-toastify';
import { logoutUser, clearErrors } from "../../actions/userActions";
import { getJobs } from '../../actions/jobActions';
import { allUserAction } from '../../actions/userActions';

const SystemAdminDashboard = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  
  const { loading, error, user, isAuthenticatedUser } = useSelector((state) => state.loginUser);
  const { users = [], loading: usersLoading } = useSelector((state) => state.allUsers || {});
  const { jobs = [], loading: jobsLoading } = useSelector((state) => state.allJobs || {});
  
  const [dashboardStats, setDashboardStats] = useState({
    totalSchools: 0,
    totalCandidates: 0,
    totalJobs: 0,
    totalApplications: 0,
    activeSchools: 0,
    newCandidatesThisMonth: 0,
    newSchoolsThisMonth: 0,
    activeJobs: 0
  });
  
  const [schoolData, setSchoolData] = useState([]);
  const [applicationTrends, setApplicationTrends] = useState([]);
  const [candidateStatusData, setCandidateStatusData] = useState([]);
  const [jobTypeDistribution, setJobTypeDistribution] = useState([]);
  const [recentActivities, setRecentActivities] = useState([]);

  // Redirect if not authenticated or not system-admin
  useEffect(() => {
    console.log('🔐 Dashboard auth check:', { 
      isAuthenticatedUser, 
      user: user?.role,
      loading 
    });

    if (!loading) {
      if (!isAuthenticatedUser) {
        console.log('❌ Not authenticated, redirecting to login');
        toast.error('Please login to access the dashboard');
        navigate('/system-admin-login');
      } else if (user && user.role !== 'system-admin') {
        console.log('❌ Not a system admin, redirecting to appropriate portal');
        
        switch(user.role) {
          case 'school':
            navigate('/school-profile');
            break;
          case 'candidate':
            navigate('/teacher-profile');
            break;
          default:
            navigate('/');
        }
      }
    }
  }, [isAuthenticatedUser, user, loading, navigate]);

  // Load real data
  useEffect(() => {
    const loadData = async () => {
      try {
        await Promise.all([
          dispatch(allUserAction()),
          dispatch(getJobs())
        ]);
      } catch (error) {
        console.error('Error loading dashboard data:', error);
        toast.error('Failed to load dashboard data');
      }
    };
    
    if (isAuthenticatedUser && user?.role === 'system-admin') {
      loadData();
    }
  }, [dispatch, isAuthenticatedUser, user]);

  // Process real data for dashboard
  useEffect(() => {
    if (users.length > 0 || jobs.length > 0) {
      // Filter users by role
      const schools = users.filter(u => u.role === 'school');
      const candidates = users.filter(u => u.role === 'candidate');
      const activeJobs = jobs.filter(j => j.status === 'active');
      
      // Calculate total applications from jobs
      const totalApplications = jobs.reduce((sum, job) => sum + (job.applicationCount || 0), 0);
      
      // Calculate new users this month
      const currentDate = new Date();
      const firstDayOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
      
      const newCandidatesThisMonth = candidates.filter(c => 
        new Date(c.createdAt) >= firstDayOfMonth
      ).length;
      
      const newSchoolsThisMonth = schools.filter(s => 
        new Date(s.createdAt) >= firstDayOfMonth
      ).length;
      
      setDashboardStats({
        totalSchools: schools.length,
        totalCandidates: candidates.length,
        totalJobs: jobs.length,
        totalApplications: totalApplications,
        activeSchools: schools.filter(s => s.status === 'active').length,
        activeJobs: activeJobs.length,
        newCandidatesThisMonth,
        newSchoolsThisMonth
      });
      
      // Prepare school performance data (top 5 schools by job posts)
      const schoolJobCount = {};
      jobs.forEach(job => {
        const schoolId = job.school?._id || job.school;
        if (schoolId) {
          schoolJobCount[schoolId] = (schoolJobCount[schoolId] || 0) + 1;
        }
      });
      
      const schoolPerformance = Object.entries(schoolJobCount)
        .map(([schoolId, jobCount]) => {
          const school = schools.find(s => s._id === schoolId);
          return {
            name: school?.schoolData?.schoolName || school?.profile?.firstName || 'Unknown School',
            jobs: jobCount,
            applications: jobs
              .filter(j => (j.school?._id === schoolId || j.school === schoolId))
              .reduce((sum, j) => sum + (j.applicationCount || 0), 0),
            candidates: jobs
              .filter(j => (j.school?._id === schoolId || j.school === schoolId))
              .reduce((sum, j) => sum + (j.applicationCount || 0), 0)
          };
        })
        .sort((a, b) => b.jobs - a.jobs)
        .slice(0, 5);
      
      setSchoolData(schoolPerformance);
      
      // Prepare application trends (last 6 months)
      const monthlyData = {};
      const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
      const last6Months = [];
      
      for (let i = 5; i >= 0; i--) {
        const date = new Date();
        date.setMonth(date.getMonth() - i);
        const monthName = months[date.getMonth()];
        const year = date.getFullYear();
        const key = `${monthName} ${year}`;
        last6Months.push(key);
        monthlyData[key] = 0;
      }
      
      jobs.forEach(job => {
        const jobDate = new Date(job.createdAt);
        const monthName = months[jobDate.getMonth()];
        const year = jobDate.getFullYear();
        const key = `${monthName} ${year}`;
        if (last6Months.includes(key)) {
          monthlyData[key] += job.applicationCount || 0;
        }
      });
      
      const trends = last6Months.map(month => ({
        month: month.split(' ')[0],
        applications: monthlyData[month],
        jobs: jobs.filter(j => {
          const jDate = new Date(j.createdAt);
          return months[jDate.getMonth()] === month.split(' ')[0];
        }).length
      }));
      
      setApplicationTrends(trends);
      
      // Candidate status distribution
      const statusCount = {
        active: candidates.filter(c => c.status === 'active').length,
        inactive: candidates.filter(c => c.status === 'inactive').length,
        pending: candidates.filter(c => c.status === 'pending').length
      };
      
      setCandidateStatusData([
        { name: 'Active', value: statusCount.active, color: '#10b981' },
        { name: 'Inactive', value: statusCount.inactive, color: '#ef4444' },
        { name: 'Pending', value: statusCount.pending, color: '#f59e0b' }
      ]);
      
      // Job type distribution
      const jobTypeCount = {};
      jobs.forEach(job => {
        const type = job.jobType || 'Not Specified';
        jobTypeCount[type] = (jobTypeCount[type] || 0) + 1;
      });
      
      const jobTypes = Object.entries(jobTypeCount).map(([name, value]) => ({
        name,
        value,
        color: ['#3b82f6', '#8b5cf6', '#10b981', '#f59e0b', '#ef4444'][Math.floor(Math.random() * 5)]
      }));
      
      setJobTypeDistribution(jobTypes);
      
      // Recent activities (latest 5 jobs and user registrations)
      const recentJobs = jobs
        .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
        .slice(0, 3)
        .map(job => ({
          type: 'job',
          title: `New job posted: ${job.jobTitle}`,
          time: new Date(job.createdAt),
          icon: <FaBriefcase className="text-blue-500" />
        }));
      
      const recentUsers = [...candidates, ...schools]
        .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
        .slice(0, 3)
        .map(user => ({
          type: 'user',
          title: `New ${user.role === 'candidate' ? 'teacher' : 'school'} registered: ${user.email}`,
          time: new Date(user.createdAt),
          icon: user.role === 'candidate' ? <FaUserGraduate className="text-green-500" /> : <FaSchool className="text-purple-500" />
        }));
      
      const activities = [...recentJobs, ...recentUsers]
        .sort((a, b) => b.time - a.time)
        .slice(0, 5);
      
      setRecentActivities(activities);
    }
  }, [users, jobs]);

  // Handle API errors
  useEffect(() => {
    if (error) {
      console.log('❌ Dashboard error:', error);
      toast.error(error);
      dispatch(clearErrors());
    }
  }, [dispatch, error]);

  // Handle logout
  const handleLogout = () => {
    dispatch(logoutUser());
    toast.success('Logged out successfully');
    navigate('/system-admin-login');
  };

  // Quick Actions handlers
  const handleManageSchools = () => {
    navigate('/admin/schools');
  };

  const handleViewCandidates = () => {
    navigate('/admin/candidates');
  };

  const handleJobPostings = () => {
    navigate('/admin/jobs');
  };

  const handleGenerateReports = () => {
    navigate('/admin/analytics');
  };

  const handleSystemSettings = () => {
    navigate('/admin/profile');
  };
    const handleSystemPayments = () => {
    navigate('/admin/payments');
  };

  const handleManageUsers = () => {
    navigate('/admin/memberships');
  };

  // Show loading while checking authentication
  if (loading || usersLoading || jobsLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 mt-30">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  // If not authenticated or not admin, don't render main content
  if (!isAuthenticatedUser || !user || user.role !== 'system-admin') {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50 mt-30">
      {/* Admin Header/Navbar */}
      <nav className="bg-white shadow-md fixed top-0 left-0 right-0 z-50 mt-25">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Left side - Logo */}
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="w-10 h-10 bg-gradient-to-r from-emerald-500 to-teal-600 rounded-xl flex items-center justify-center">
                  <FaUser className="text-white text-lg" />
                </div>
              </div>
              <div className="ml-3">
                <h1 className="text-xl font-bold text-gray-800">Admin Dashboard</h1>
                <p className="text-xs text-gray-500">
                  {user?.adminData?.adminLevel === 'super-admin' ? 'Super Admin' : 'Administrator'}
                </p>
              </div>
            </div>

            {/* Right side - User menu */}
            <div className="flex items-center space-x-4">
              <button className="text-gray-600 hover:text-emerald-600 p-2">
                <FaBell className="text-lg" />
              </button>
              <button 
                onClick={handleSystemSettings}
                className="text-gray-600 hover:text-emerald-600 p-2"
              >
                <FaCog className="text-lg" />
              </button>
              
              {/* User dropdown */}
              <div className="relative group">
                <button className="flex items-center space-x-3 text-gray-700 hover:text-emerald-600">
                  <div className="w-10 h-10 bg-gradient-to-r from-emerald-500 to-teal-600 rounded-full flex items-center justify-center">
                    <span className="text-white font-semibold">
                      {user?.profile?.firstName?.charAt(0) || 'A'}
                    </span>
                  </div>
                  <div className="text-left hidden md:block">
                    <p className="font-medium">
                      {user?.profile?.firstName} {user?.profile?.lastName}
                    </p>
                    <p className="text-xs text-gray-500">{user?.email}</p>
                  </div>
                </button>
                
                {/* Dropdown menu */}
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg py-2 hidden group-hover:block">
                  <div className="px-4 py-2 border-b">
                    <p className="font-medium">Signed in as</p>
                    <p className="text-sm text-gray-600">{user?.email}</p>
                  </div>
                  <button
                    onClick={() => navigate('/admin/profile')}
                    className="w-full text-left px-4 py-2 text-gray-700 hover:bg-gray-100 hover:text-emerald-600"
                  >
                    <FaUser className="inline mr-2" />
                    My Profile
                  </button>
                  <button
                    onClick={handleSystemSettings}
                    className="w-full text-left px-4 py-2 text-gray-700 hover:bg-gray-100 hover:text-emerald-600"
                  >
                    <FaCog className="inline mr-2" />
                    Settings
                  </button>
                  <button
                    onClick={handleLogout}
                    className="w-full text-left px-4 py-2 text-red-600 hover:bg-red-50 hover:text-red-700"
                  >
                    <FaSignOutAlt className="inline mr-2" />
                    Logout
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <div className="pt-16 p-6">
        {/* Welcome Banner */}
        <div className="mb-8">
          <div className="bg-gradient-to-r from-emerald-500 to-teal-600 rounded-2xl p-8 text-white shadow-lg">
            <h1 className="text-3xl font-bold mb-2">
              Welcome back, {user?.profile?.firstName}!
            </h1>
            <p className="text-emerald-100 mb-4">
              System Administrator • {user?.adminData?.adminLevel === 'super-admin' ? 'Full Access' : 'Limited Access'}
            </p>
            <div className="flex flex-wrap gap-4">
              <div className="bg-white/20 backdrop-blur-sm px-4 py-2 rounded-lg">
                <span className="font-medium">Permissions:</span> {user?.adminData?.permissions?.join(', ') || 'full_access'}
              </div>
              <div className="bg-white/20 backdrop-blur-sm px-4 py-2 rounded-lg">
                <span className="font-medium">Member since:</span> {new Date(user?.createdAt).toLocaleDateString()}
              </div>
              <div className="bg-white/20 backdrop-blur-sm px-4 py-2 rounded-lg">
                <span className="font-medium">Status:</span> {user?.status || 'active'}
              </div>
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <StatCard 
            icon={<FaSchool className="text-blue-500" />}
            title="Total Schools"
            value={dashboardStats.totalSchools}
            change={`+${dashboardStats.newSchoolsThisMonth} this month`}
            onClick={handleManageSchools}
          />
          <StatCard 
            icon={<FaUserGraduate className="text-green-500" />}
            title="Total Candidates"
            value={dashboardStats.totalCandidates}
            change={`+${dashboardStats.newCandidatesThisMonth} this month`}
            onClick={handleViewCandidates}
          />
          <StatCard 
            icon={<FaBriefcase className="text-purple-500" />}
            title="Active Jobs"
            value={dashboardStats.activeJobs}
            change={`${dashboardStats.totalJobs} total posts`}
            onClick={handleJobPostings}
          />
          <StatCard 
            icon={<FaFileAlt className="text-orange-500" />}
            title="Applications"
            value={dashboardStats.totalApplications}
            change="Total received"
            onClick={handleGenerateReports}
          />
        </div>

        {/* Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* Applications & Jobs Trend */}
          <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-semibold text-gray-800">Applications & Jobs Trend</h3>
              <button 
                onClick={handleGenerateReports}
                className="text-sm text-emerald-600 hover:text-emerald-700 font-medium"
              >
                View Details →
              </button>
            </div>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={applicationTrends}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="month" stroke="#666" />
                <YAxis stroke="#666" />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: 'white', 
                    border: '1px solid #e5e7eb',
                    borderRadius: '0.5rem'
                  }}
                />
                <Legend />
                <Line 
                  type="monotone" 
                  dataKey="applications" 
                  stroke="#10b981" 
                  strokeWidth={2}
                  name="Applications"
                  dot={{ fill: '#10b981', strokeWidth: 2 }}
                />
                <Line 
                  type="monotone" 
                  dataKey="jobs" 
                  stroke="#3b82f6" 
                  strokeWidth={2}
                  name="Job Posts"
                  dot={{ fill: '#3b82f6', strokeWidth: 2 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>

          {/* Schools Performance */}
          <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-semibold text-gray-800">Top Schools Performance</h3>
              <button 
                onClick={handleManageSchools}
                className="text-sm text-emerald-600 hover:text-emerald-700 font-medium"
              >
                Manage Schools →
              </button>
            </div>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={schoolData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="name" stroke="#666" angle={-45} textAnchor="end" height={80} />
                <YAxis stroke="#666" />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: 'white', 
                    border: '1px solid #e5e7eb',
                    borderRadius: '0.5rem'
                  }}
                />
                <Legend />
                <Bar dataKey="applications" fill="#82ca9d" name="Applications" />
                <Bar dataKey="jobs" fill="#8884d8" name="Job Posts" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

    
        {/* Quick Actions & Recent Activity */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Quick Actions */}
          <div className="lg:col-span-2">
            <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200">
              <h3 className="text-xl font-semibold text-gray-800 mb-4">Quick Actions</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <ActionButton 
                  icon={<FaSchool />}
                  title="Manage Schools"
                  description={`${dashboardStats.totalSchools} total schools`}
                  color="bg-blue-500 hover:bg-blue-600"
                  onClick={handleManageSchools}
                />
                <ActionButton 
                  icon={<FaUserGraduate />}
                  title="View Candidates"
                  description={`${dashboardStats.totalCandidates} teacher candidates`}
                  color="bg-green-500 hover:bg-green-600"
                  onClick={handleViewCandidates}
                />
                <ActionButton 
                  icon={<FaBriefcase />}
                  title="Job Postings"
                  description={`${dashboardStats.activeJobs} active jobs`}
                  color="bg-purple-500 hover:bg-purple-600"
                  onClick={handleJobPostings}
                />
                <ActionButton 
                  icon={<FaFileAlt />}
                  title="Generate Reports"
                  description="Create detailed analytics"
                  color="bg-orange-500 hover:bg-orange-600"
                  onClick={handleGenerateReports}
                />
                <ActionButton 
                  icon={<FaUsers />}
                  title="Manage Memberships"
                  description="View all platform users"
                  color="bg-red-500 hover:bg-red-600"
                  onClick={handleManageUsers}
                />
                <ActionButton 
                  icon={<FaCog />}
                  title="Payment Approvals"
                  description="Approve Schools Payments"
                  color="bg-gray-700 hover:bg-gray-800"
                  onClick={handleSystemPayments}
                />
              </div>
            </div>
          </div>

          {/* Recent Activities */}
          <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200">
            <h3 className="text-xl font-semibold text-gray-800 mb-4">Recent Activities</h3>
            <div className="space-y-4 max-h-[400px] overflow-y-auto">
              {recentActivities.length > 0 ? (
                recentActivities.map((activity, index) => (
                  <div key={index} className="flex items-start gap-3 p-3 hover:bg-gray-50 rounded-lg transition-colors">
                    <div className="p-2 bg-gray-100 rounded-lg">
                      {activity.icon}
                    </div>
                    <div className="flex-1">
                      <p className="text-sm text-gray-800">{activity.title}</p>
                      <p className="text-xs text-gray-500 mt-1">
                        {new Date(activity.time).toLocaleString()}
                      </p>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-8">
                  <div className="text-gray-400 text-4xl mb-2">📊</div>
                  <p className="text-gray-500 text-sm">No recent activities</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// Stat Card Component
const StatCard = ({ icon, title, value, change, onClick }) => (
  <div 
    onClick={onClick}
    className="bg-white p-6 rounded-lg shadow-md border-l-4 border-emerald-400 hover:shadow-lg transition-all cursor-pointer hover:border-emerald-600 hover:scale-[1.02]"
  >
    <div className="flex items-center justify-between">
      <div>
        <p className="text-gray-600 text-sm mb-1">{title}</p>
        <p className="text-2xl font-bold text-gray-800">{value.toLocaleString()}</p>
        <p className="text-green-500 text-sm mt-1">{change}</p>
      </div>
      <div className="text-3xl bg-emerald-50 p-3 rounded-lg">
        {icon}
      </div>
    </div>
  </div>
);

// Action Button Component
const ActionButton = ({ icon, title, description, color, onClick }) => (
  <button 
    onClick={onClick}
    className={`${color} text-white p-4 rounded-lg text-left hover:shadow-lg transition-all transform hover:scale-[1.02]`}
  >
    <div className="flex items-start">
      <div className="text-xl mr-3">{icon}</div>
      <div>
        <h4 className="font-semibold">{title}</h4>
        <p className="text-sm opacity-90 mt-1">{description}</p>
      </div>
    </div>
  </button>
);

export default SystemAdminDashboard;