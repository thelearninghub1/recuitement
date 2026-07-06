import {
    // Job Constants
    ALL_JOBS_REQUEST, ALL_JOBS_SUCCESS, ALL_JOBS_FAIL,
    JOB_DETAILS_REQUEST, JOB_DETAILS_SUCCESS, JOB_DETAILS_FAIL,
    MY_JOBS_REQUEST, MY_JOBS_SUCCESS, MY_JOBS_FAIL,
    CREATE_JOB_REQUEST, CREATE_JOB_SUCCESS, CREATE_JOB_FAIL, CREATE_JOB_RESET,
    UPDATE_JOB_REQUEST, UPDATE_JOB_SUCCESS, UPDATE_JOB_FAIL, UPDATE_JOB_RESET,
    DELETE_JOB_REQUEST, DELETE_JOB_SUCCESS, DELETE_JOB_FAIL, DELETE_JOB_RESET,
    
    // Application Constants
    APPLY_JOB_REQUEST, APPLY_JOB_SUCCESS, APPLY_JOB_FAIL, APPLY_JOB_RESET,
    MY_APPLICATIONS_REQUEST, MY_APPLICATIONS_SUCCESS, MY_APPLICATIONS_FAIL,
    JOB_APPLICATIONS_REQUEST, JOB_APPLICATIONS_SUCCESS, JOB_APPLICATIONS_FAIL,
    UPDATE_STATUS_REQUEST, UPDATE_STATUS_SUCCESS, UPDATE_STATUS_FAIL, UPDATE_STATUS_RESET,
    
    // Export Constants
    EXPORT_APPLICATIONS_REQUEST, EXPORT_APPLICATIONS_SUCCESS, EXPORT_APPLICATIONS_FAIL,

    // Stats & Utils
    JOB_STATS_REQUEST, JOB_STATS_SUCCESS, JOB_STATS_FAIL,
    CLEAR_ERRORS
} from "../constants/jobConstants";

/**
 * 1. GENERAL JOB REDUCER
 * Handles public listings, single job viewing, and school-specific job lists
 */
export const jobsReducer = (state = { jobs: [] }, action) => {
    switch (action.type) {
        case ALL_JOBS_REQUEST:
        case JOB_DETAILS_REQUEST: 
        case MY_JOBS_REQUEST:
            return {
                ...state,
                loading: true,
            };

        case ALL_JOBS_SUCCESS:
            return {
                loading: false,
                jobs: action.payload.jobs,
                totalJobs: action.payload.total,
                pages: action.payload.pages,
                page: action.payload.page,
            };

        case MY_JOBS_SUCCESS:
            return {
                loading: false,
                jobs: action.payload.jobs,
                total: action.payload.total,
            };

        case JOB_DETAILS_SUCCESS:
            return {
                loading: false,
                job: action.payload.job,
            };

        case ALL_JOBS_FAIL:
        case JOB_DETAILS_FAIL:
        case MY_JOBS_FAIL:
            return {
                ...state,
                loading: false,
                error: action.payload,
            };

        case CLEAR_ERRORS:
            return {
                ...state,
                error: null,
            };

        default:
            return state;
    }
};

/**
 * 2. JOB MANAGEMENT REDUCER
 * Handles CRUD operations: Creating, Updating, and Deleting (School & Admin)
 */
export const jobActionReducer = (state = {}, action) => {
    switch (action.type) {
        case CREATE_JOB_REQUEST:
        case UPDATE_JOB_REQUEST:
        case DELETE_JOB_REQUEST:
            return {
                ...state,
                loading: true,
            };

        case CREATE_JOB_SUCCESS:
        case UPDATE_JOB_SUCCESS:
            return {
                ...state,
                loading: false, 
                success: action.payload.success,
                job: action.payload.job,
                message: action.payload.message
            };

        case DELETE_JOB_SUCCESS:
            return {
                ...state,
                loading: false,
                isDeleted: action.payload.success,
                message: action.payload.message
            };

        case CREATE_JOB_FAIL:
        case UPDATE_JOB_FAIL:
        case DELETE_JOB_FAIL:
            return {
                ...state,
                loading: false,
                error: action.payload,
            };

        case CREATE_JOB_RESET:
        case UPDATE_JOB_RESET:
            return {
                ...state,
                success: false,
            };

        case DELETE_JOB_RESET:
            return {
                ...state,
                isDeleted: false,
                message: null
            };

        case CLEAR_ERRORS:
            return {
                ...state,
                error: null,
            };

        default:
            return state;
    }
};

/**
 * 3. APPLICATION REDUCER
 * Handles Candidate submissions and School management of applicants
 */
export const applicationsReducer = (state = { applications: [] }, action) => {
    switch (action.type) {
        case APPLY_JOB_REQUEST:
        case MY_APPLICATIONS_REQUEST:
        case JOB_APPLICATIONS_REQUEST:
        case UPDATE_STATUS_REQUEST:
            return {
                ...state,
                loading: true,
            };

        case APPLY_JOB_SUCCESS:
        case UPDATE_STATUS_SUCCESS:
            return {
                ...state,
                loading: false,
                success: action.payload.success,
                message: action.payload.message
            };

        case MY_APPLICATIONS_SUCCESS:
        case JOB_APPLICATIONS_SUCCESS:
            return {
                loading: false,
                applications: action.payload.applications,
                total: action.payload.total,
                pages: action.payload.pages
            };

        case APPLY_JOB_FAIL:
        case MY_APPLICATIONS_FAIL:
        case JOB_APPLICATIONS_FAIL:
        case UPDATE_STATUS_FAIL:
            return {
                ...state,
                loading: false,
                error: action.payload,
            };

        case APPLY_JOB_RESET:
        case UPDATE_STATUS_RESET:
            return {
                ...state,
                success: false,
            };

        case CLEAR_ERRORS:
            return {
                ...state,
                error: null,
            };

        default:
            return state;
    }
};

/**
 * 4. EXPORT REDUCER
 * Handles the state of CSV/Excel exporting
 */
export const exportApplicationsReducer = (state = {}, action) => {
    switch (action.type) {
        case EXPORT_APPLICATIONS_REQUEST:
            return { 
                loading: true
             };
        case EXPORT_APPLICATIONS_SUCCESS:
            return { 
                loading: false,
                success: true 
            };
        case EXPORT_APPLICATIONS_FAIL:
            return { 
                loading: false, 
                error: action.payload
             };
        case CLEAR_ERRORS:
            return { 
                ...state, 
                error: null
             };
        default:
            return state;
    }
};

/**
 * 5. JOB STATISTICS REDUCER
 */
export const jobStatsReducer = (state = { stats: {} }, action) => {
    switch (action.type) {
        case JOB_STATS_REQUEST:
            return { 
                loading: true 
            };
        case JOB_STATS_SUCCESS:
            return { 
                loading: false, 
                stats: action.payload.stats
             };
        case JOB_STATS_FAIL:
            return { 
                loading: false, 
                error: action.payload 
            };
        case CLEAR_ERRORS:
            return { 
                ...state, 
                error: null 
            };
        default:
            return state;
    }
};