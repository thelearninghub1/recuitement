import { configureStore} from '@reduxjs/toolkit';
import { allUserReducer, forgotPasswordReducer, loginUserReducer, singleUserDetailsReducer, updateUserPasswordReducer } from './reducers/userReducers';
import { applicationsReducer, exportApplicationsReducer, jobActionReducer, jobsReducer, jobStatsReducer } from './reducers/jobReducers';
import { createContactUsReducer } from './reducers/contactUsReducers';
import { createPlanReducer, deletePlanReducer, getAllPlansReducer, getPlanReducer, setPopularPlanReducer, togglePlanActiveReducer, updatePlanReducer } from './reducers/planReducers';
import { approvePaymentReducer, denyPaymentReducer, getAllPaymentsReducer, getPaymentReducer, getPaymentStatsReducer, submitPaymentReducer } from './reducers/paymentReducers';
import { checkCanPostJobReducer, decreaseCvCountReducer, getMySubscriptionReducer, incrementJobPostReducer } from './reducers/subscriptionReducers';


const store = configureStore({
    reducer:{
        loginUser:loginUserReducer,
        forgotPassword:forgotPasswordReducer,
        updatePassword:updateUserPasswordReducer,
        allUsers:allUserReducer,
        getSingleUser:singleUserDetailsReducer,
        // --- JOB STATE ---
        // Handles fetching all jobs and job  details (Public/School)
        allJobs: jobsReducer, 
        
        // Handles Create, Update, Delete actions (Admin/School)
        jobAction: jobActionReducer, 

        // --- APPLICATION STATE ---
        // Handles candidate applications and status management
        applications: applicationsReducer,

        // --- ADMIN ANALYTICS ---
        jobStats: jobStatsReducer,

        exportApplications: exportApplicationsReducer,
        createContactUs:createContactUsReducer,

         // Plan Reducers (NEW)
    getAllPlans: getAllPlansReducer,
    getPlan: getPlanReducer,
    createPlan: createPlanReducer,
    updatePlan: updatePlanReducer,
    deletePlan: deletePlanReducer,
    togglePlanActive: togglePlanActiveReducer,
    setPopularPlan: setPopularPlanReducer,

     // Payment Reducers (NEW)
    getAllPayments: getAllPaymentsReducer,
    getPayment: getPaymentReducer,
    submitPayment: submitPaymentReducer,
    approvePayment: approvePaymentReducer,
    denyPayment: denyPaymentReducer,
    getPaymentStats: getPaymentStatsReducer,
 
    // Subscription Reducers (NEW)
    getMySubscription: getMySubscriptionReducer,
    checkCanPostJob: checkCanPostJobReducer,
    incrementJobPost: incrementJobPostReducer,
    decreaseCvCount: decreaseCvCountReducer  // ADD THIS


    }
});

export default store;