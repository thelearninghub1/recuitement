import { useDispatch } from 'react-redux';
import './App.css'
import {BrowserRouter as Router , Routes , Route} from 'react-router-dom';
import Home from './Components/Layout/Home/Home';
import Header from './Components/Layout/Header/Header';
import Footer from './Components/Layout/Footer/Footer';
import ContactUs from './Components/Layout/Contact/ContactUs';
import Pricing from './Components/Layout/Pricing/Pricing';
import Features from './Components/Layout/Features/Features';
import About from './Components/Layout/About/About';
import TeacherRegister from './Components/Auth/TeacherRegister';
import TeacherProfile from './Components/CandidateDashboard/TeacherProfile';
import TeacherLogin from './Components/Auth/TeacherLogin';
import UpdatePassword from './Components/CandidateDashboard/UpdatePassword';
import UpdateProfile from './Components/CandidateDashboard/UpdateProfile';
import Dashboard from './Components/CandidateDashboard/ApplyJob';
import SchoolDashboard from './Components/SchoolDashboard/SchoolDasboard';
import SchoolRegister from './Components/Auth/SchoolRegister';
import SchoolProfile from './Components/SchoolDashboard/SchoolProfile';
import SchoolEditProfile from './Components/SchoolDashboard/SchoolEditProfile';
import SchoolUpdatePassword from './Components/SchoolDashboard/SchoolUpdatePassword';
import SchoolLogin from './Components/Auth/SchoolLogin';
import SystemAdminDashboard from './Components/Admin/SystemAdminDashboard';
import CandidatesDashboard from './Components/Admin/CandidatesDashboard';
import PostedJobsDashboard from './Components/Admin/PostedJobsDasboard';
import SchoolsDashboard from './Components/Admin/SchoolsDashboard';
import GenerateReportsDashboard from './Components/Admin/GenerateReportsDashboard';
import AdminLogin from './Components/Admin/AdminLogin';
import NotFoundPage from './Components/Layout/PageNotFound/PageNotFound';
import ForgotPassword from './Components/Auth/ForgotPassword';
import ResetPassword from './Components/Auth/ResetPassword';
import { useSelector } from 'react-redux';
import { useEffect, useState } from 'react';
import { loadUser } from './actions/userActions';
import AppliedJobs from './Components/CandidateDashboard/AppliedJobs';
import JobDetails from './Components/CandidateDashboard/JobDetails';
import JobApplications from './Components/SchoolDashboard/JobApplications';
import AdminRegister from './Components/Admin/AdminRegister';
import AdminProfile from './Components/Admin/AdminProfile';
import EditJobPage from './Components/Admin/EditJobPage';
import SchoolMembership from './Components/SchoolDashboard/SchoolMembership';
import BillingDetails from './Components/SchoolDashboard/BillingDetails';
import PayNow from './Components/SchoolDashboard/PayNow';
import MyMembership from './Components/SchoolDashboard/MyMembership';
import AllJobsPage from './Components/Layout/Home/AllJobsPage';
import BrowseTeachersPage from './Components/Layout/Home/BrowseTeachersPage';
import ViewSchoolsPage from './Components/Layout/Home/ViewSchoolsPage';
import PrivacyPolicy from './Components/Layout/PrivacyPolicy/PrivacyPolicy';
import ScrollToTop from './ScrollToTop';
import WhatsApp from './Components/Layout/WhatsApp';
import MembershipDashboard from './Components/Admin/Membership/MembershipDashboard';
import PaymentDashboard from './Components/Admin/PaymentDashboard';



function App() {
  const dispatch = useDispatch();
  const {isAuthenticatedUser, user, loading} = useSelector((state)=>state.loginUser);
  const [userLoaded, setUserLoaded] = useState(false);

  useEffect(() => {
    const initializeApp = async () => {
      await dispatch(loadUser());
      setUserLoaded(true);
    };

    if (!userLoaded) {
      initializeApp();
    }
  }, [dispatch, userLoaded]);

  // Show loading while checking authentication
  if (!userLoaded || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  return ( 
    <Router>
      <ScrollToTop/>
      <Header/>
      <WhatsApp />
      <Routes>
        {/* Common Routes */}

        <Route path='/' element={<Home/>} />
        <Route path='/pricing' element={<Pricing/>} />
        <Route path='/schools' element={<ViewSchoolsPage/>} />
        <Route path='/contact-us' element={<ContactUs/>} />
        <Route path='/features' element={<Features/>} />
        <Route path='/about' element={<About/>} />
        <Route path='/school/post' element={<AllJobsPage/>} />
         <Route path='/teachers' element={<BrowseTeachersPage/>} />
        <Route path='/*' element={<NotFoundPage/>} />
        <Route path='/forgot-password' element={<ForgotPassword/>} />
        <Route path='/reset-password/:token' element={<ResetPassword/>} />
        <Route path='/privacy-policy' element={<PrivacyPolicy/>} />


        {/* Candidates Routes */}
        <Route path='/teacher-login' element={<TeacherLogin/>} />
        <Route path='/teacher-register' element={<TeacherRegister/>} />
        <Route 
          path='/teacher-profile' 
          element={
            isAuthenticatedUser && user?.role === "candidate" ? 
            <TeacherProfile/> : 
            <TeacherLogin/>
          } 
        />
          <Route 
          path='/applied-jobs' 
          element={
            isAuthenticatedUser && user?.role === "candidate" ? 
            <AppliedJobs/> : 
            <TeacherLogin/>
          } 
        />
         <Route 
          path='/job/:id' 
          element={
            isAuthenticatedUser && user?.role === "candidate" ? 
            <JobDetails/> : 
            <TeacherLogin/>
          } 
        />
        <Route 
          path='/teacher-password-update' 
          element={
            isAuthenticatedUser && user?.role === "candidate" ? 
            <UpdatePassword/> : 
            <TeacherLogin/>
          } 
        />
        <Route 
          path='/teacher-edit-profile' 
          element={
            isAuthenticatedUser && user?.role === "candidate" ? 
            <UpdateProfile/> : 
            <TeacherLogin/>
          } 
        />
        <Route 
          path='/jobs-dashboard' 
          element={
            isAuthenticatedUser && user?.role === "candidate" ? 
            <Dashboard/> : 
            <TeacherLogin/>
          } 
        />

        {/* Schools Routes */}
        <Route path='/school-login' element={<SchoolLogin/>} />
        <Route path='/school-register' element={<SchoolRegister/>} />
        <Route 
          path='/school-profile' 
          element={
            isAuthenticatedUser && user?.role === "school" ? 
            <SchoolProfile/> : 
            <SchoolLogin/>
          } 
        />
        <Route 
          path='/membership-plans' 
          element={
            isAuthenticatedUser && user?.role === "school" ? 
            <SchoolMembership/> : 
            <SchoolLogin/>
          } 
        />
           <Route 
          path='/billing-details' 
          element={
            isAuthenticatedUser && user?.role === "school" ? 
            <BillingDetails/> : 
            <SchoolLogin/>
          } 
        />
         <Route 
          path='/pay-now' 
          element={
            isAuthenticatedUser && user?.role === "school" ? 
            <PayNow/> : 
            <SchoolLogin/>
          } 
        />
         
           <Route 
          path='/my-membership-plans' 
          element={
            isAuthenticatedUser && user?.role === "school" ? 
            <MyMembership/> : 
            <SchoolLogin/>
          } 
        />
        <Route 
          path='/school-edit-profile' 
          element={
            isAuthenticatedUser && user?.role === "school" ? 
            <SchoolEditProfile/> : 
            <SchoolLogin/>
          } 
        />
        <Route 
          path='/school-password-update' 
          element={
            isAuthenticatedUser && user?.role === "school" ? 
            <SchoolUpdatePassword/> : 
            <SchoolLogin/>
          } 
        />
        <Route 
          path='/school-dashboard' 
          element={
            isAuthenticatedUser && user?.role === "school" ? 
            <SchoolDashboard/> : 
            <SchoolLogin/>
          } 
        />
 <Route 
          path='/jobs/:id/applications' 
          element={
            isAuthenticatedUser && user?.role === "school" ? 
            <JobApplications/> : 
            <SchoolLogin/>
          } 
        />
     
      

        {/* Admin Routes */}
        <Route path='/system-admin-login' element={<AdminLogin/>} />
        <Route path='/register-system-admin' element={<AdminRegister/>} />
        {/* Membership Plans Admin Routes  */}
          <Route 
          path='/admin/memberships' 
          element={
            isAuthenticatedUser && user?.role === "system-admin" ? 
            <MembershipDashboard/> : 
            <AdminLogin/>
          } 
        />
       
        <Route 
          path='/system-admin-dashboard' 
          element={
            isAuthenticatedUser && user?.role === "system-admin" ? 
            <SystemAdminDashboard/> : 
            <AdminLogin/>
          } 
        />
     
         <Route 
          path='/jobs/:id/edit' 
          element={
            isAuthenticatedUser && user?.role === "system-admin" ? 
            <EditJobPage/> : 
            <AdminLogin/>
          } 
        />
         <Route 
          path='/admin/profile' 
          element={
            isAuthenticatedUser && user?.role === "system-admin" ? 
            <AdminProfile/> : 
            <AdminLogin/>
          } 
        />
        <Route 
          path='/admin/candidates' 
          element={
            isAuthenticatedUser && user?.role === "system-admin" ? 
            <CandidatesDashboard/> : 
            <AdminLogin/>
          } 
        />
          <Route 
          path='/admin/payments' 
          element={
            isAuthenticatedUser && user?.role === "system-admin" ? 
            <PaymentDashboard/> : 
            <AdminLogin/>
          } 
        />
        <Route 
          path='/admin/jobs' 
          element={
            isAuthenticatedUser && user?.role === "system-admin" ? 
            <PostedJobsDashboard/> : 
            <AdminLogin/>
          } 
        />
        <Route 
          path='/admin/schools' 
          element={
            isAuthenticatedUser && user?.role === "system-admin" ? 
            <SchoolsDashboard/> : 
            <AdminLogin/>
          } 
        />
        <Route 
          path='/admin/analytics' 
          element={
            isAuthenticatedUser && user?.role === "system-admin" ? 
            <GenerateReportsDashboard/> : 
            <AdminLogin/>
          } 
        />
      </Routes>
      <Footer/>
    </Router>
  );
}

export default App;