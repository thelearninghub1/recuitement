import axios from 'axios';
import {
    // Job Constants
    ALL_JOBS_REQUEST, ALL_JOBS_SUCCESS, ALL_JOBS_FAIL,
    JOB_DETAILS_REQUEST, JOB_DETAILS_SUCCESS, JOB_DETAILS_FAIL,
    MY_JOBS_REQUEST, MY_JOBS_SUCCESS, MY_JOBS_FAIL,
    CREATE_JOB_REQUEST, CREATE_JOB_SUCCESS, CREATE_JOB_FAIL,
    UPDATE_JOB_REQUEST, UPDATE_JOB_SUCCESS, UPDATE_JOB_FAIL,
    DELETE_JOB_REQUEST, DELETE_JOB_SUCCESS, DELETE_JOB_FAIL,
    
    // Application Constants
    APPLY_JOB_REQUEST, APPLY_JOB_SUCCESS, APPLY_JOB_FAIL,
    MY_APPLICATIONS_REQUEST, MY_APPLICATIONS_SUCCESS, MY_APPLICATIONS_FAIL,
    JOB_APPLICATIONS_REQUEST, JOB_APPLICATIONS_SUCCESS, JOB_APPLICATIONS_FAIL,
    UPDATE_STATUS_REQUEST, UPDATE_STATUS_SUCCESS, UPDATE_STATUS_FAIL,
    
    // Export Constants
    EXPORT_APPLICATIONS_REQUEST, EXPORT_APPLICATIONS_SUCCESS, EXPORT_APPLICATIONS_FAIL,

    // Stats & Utils
    JOB_STATS_REQUEST, JOB_STATS_SUCCESS, JOB_STATS_FAIL,
    CLEAR_ERRORS
} from "../constants/jobConstants";

//const BASE_URI = `http://localhost:5000/api`;
const BASE_URI = `/api`;


// --- JOB ACTIONS --- 

// Get All Jobs (Public)
export const getAllJobs = (params = {}) => async (dispatch) => {
    try {
        dispatch({ type: ALL_JOBS_REQUEST });

        const { keyword = '', page = 1, location = '', jobType = '', category = '' } = params;
        let link = `${BASE_URI}/jobs?search=${keyword}&page=${page}`;
        
        if (location) link += `&location=${location}`;
        if (jobType) link += `&jobType=${jobType}`;
        if (category) link += `&category=${category}`;

        const { data } = await axios.get(link);

        dispatch({
            type: ALL_JOBS_SUCCESS,
            payload: data
        });
    } catch (error) {
        dispatch({
            type: ALL_JOBS_FAIL,
            payload: error.response?.data?.message || error.message
        });
    }
};


// Get All Jobs 
export const getJobs = () => async (dispatch) => {
    try {
        dispatch({ type: ALL_JOBS_REQUEST });

        
        

        const { data } = await axios.get(`${BASE_URI}/all/jobs`);

        dispatch({
            type: ALL_JOBS_SUCCESS,
            payload: data
        });
    } catch (error) {
        dispatch({
            type: ALL_JOBS_FAIL,
            payload: error.response?.data?.message || error.message
        });
    }
};
// Get Single Job Details
export const getJobDetails = (id) => async (dispatch) => {
    try {
        dispatch({ type: JOB_DETAILS_REQUEST });

        const { data } = await axios.get(`${BASE_URI}/jobs/${id}`);

        dispatch({
            type: JOB_DETAILS_SUCCESS,
            payload: data
        });
    } catch (error) {
        dispatch({
            type: JOB_DETAILS_FAIL,
            payload: error.response?.data?.message || error.message
        });
    }
};

// Create New Job (School Only)
export const createJob = (jobData) => async (dispatch) => {
    try {
        dispatch({ type: CREATE_JOB_REQUEST });

        const config = {
            headers: { 'Content-Type': 'application/json' },
            withCredentials: true
        };

        const { data } = await axios.post(`${BASE_URI}/create/job`, jobData, config);

        dispatch({
            type: CREATE_JOB_SUCCESS,
            payload: data
        });
    } catch (error) {
        dispatch({
            type: CREATE_JOB_FAIL,
            payload: error.response?.data?.message || error.message
        });
    }
};

// Update Job (School or Admin)
export const updateJob = (id, jobData) => async (dispatch) => {
    try {
        dispatch({ type: UPDATE_JOB_REQUEST });

        const config = {
            headers: { 'Content-Type': 'application/json' },
            withCredentials: true
        };

        const { data } = await axios.put(`${BASE_URI}/admin/jobs/${id}`, jobData, config);

        dispatch({
            type: UPDATE_JOB_SUCCESS,
            payload: data
        });
    } catch (error) {
        dispatch({
            type: UPDATE_JOB_FAIL,
            payload: error.response?.data?.message || error.message
        });
    }
};

// Get School's Own Jobs
export const getMyJobs = () => async (dispatch) => {
    try {
        dispatch({ type: MY_JOBS_REQUEST });
 const config = { 
            headers: { 'Content-Type': 'application/json' },
            withCredentials: true
         };
       
        const { data } = await axios.get(`${BASE_URI}/jobs/school/myjobs`,config);

        dispatch({
            type: MY_JOBS_SUCCESS,
            payload: data
        });
    } catch (error) {
        dispatch({
            type: MY_JOBS_FAIL,
            payload: error.response?.data?.message || error.message
        });
    }
};

// Delete Job (Admin/School)
export const deleteJob = (id) => async (dispatch) => {
    try {
        dispatch({ type: DELETE_JOB_REQUEST });

        const config = { withCredentials: true };
        const { data } = await axios.delete(`${BASE_URI}/admin/jobs/${id}`, config);

        dispatch({
            type: DELETE_JOB_SUCCESS,
            payload: data
        });
    } catch (error) {
        dispatch({
            type: DELETE_JOB_FAIL,
            payload: error.response?.data?.message || error.message
        });
    }
};

// --- APPLICATION ACTIONS ---

// Apply for Job (Candidate)
export const applyForJob = (id, applicationData) => async (dispatch) => {
    try {
        dispatch({ type: APPLY_JOB_REQUEST });

        const config = {
            headers: { 'Content-Type': 'multipart/form-data' },
            withCredentials: true
        };

        const { data } = await axios.post(`${BASE_URI}/jobs/${id}/apply`, applicationData, config);

        dispatch({
            type: APPLY_JOB_SUCCESS,
            payload: data
        });
    } catch (error) {
        dispatch({
            type: APPLY_JOB_FAIL,
            payload: error.response?.data?.message || error.message
        });
    }
};

// Get Candidate's My Applications
export const getMyApplications = () => async (dispatch) => {
    try {
        dispatch({ type: MY_APPLICATIONS_REQUEST });

        const config = { withCredentials: true };
        const { data } = await axios.get(`${BASE_URI}/applications/myapplications`, config);

        dispatch({
            type: MY_APPLICATIONS_SUCCESS,
            payload: data
        });
    } catch (error) {
        dispatch({
            type: MY_APPLICATIONS_FAIL,
            payload: error.response?.data?.message || error.message
        });
    }
};

// Get Applications for a Specific Job (School)
export const getJobApplications = (id) => async (dispatch) => {
    try {
        dispatch({ type: JOB_APPLICATIONS_REQUEST });

        const config = { withCredentials: true };
        const { data } = await axios.get(`${BASE_URI}/jobs/${id}/applications`, config);

        dispatch({
            type: JOB_APPLICATIONS_SUCCESS,
            payload: data
        });
    } catch (error) {
        dispatch({
            type: JOB_APPLICATIONS_FAIL,
            payload: error.response?.data?.message || error.message
        });
    }
};

// Update Application Status (School/Admin)
export const updateApplicationStatus = (id, statusData) => async (dispatch) => {
    try {
        dispatch({ type: UPDATE_STATUS_REQUEST });

        const config = {
            headers: { 'Content-Type': 'application/json' },
            withCredentials: true
        };

        const { data } = await axios.put(`${BASE_URI}/applications/${id}/status`, statusData, config);

        dispatch({
            type: UPDATE_STATUS_SUCCESS,
            payload: data
        });
    } catch (error) {
        dispatch({
            type: UPDATE_STATUS_FAIL,
            payload: error.response?.data?.message || error.message
        });
    }
};

// --- EXPORT & STATS ---

// Export Job Applications to CSV (School)
export const exportApplicationsAction = (id) => async (dispatch) => {
    try {
        dispatch({ type: EXPORT_APPLICATIONS_REQUEST });

        const config = { 
            withCredentials: true,
            responseType: 'blob' // Required for binary file data
        };

        const { data } = await axios.get(`${BASE_URI}/jobs/${id}/applications/export`, config);

        // Logic to trigger browser download automatically
        const url = window.URL.createObjectURL(new Blob([data]));
        const link = document.createElement('a');
        link.href = url;
        link.setAttribute('download', `Applications_Job_${id}.csv`);
        document.body.appendChild(link);
        link.click();
        link.remove();

        dispatch({ type: EXPORT_APPLICATIONS_SUCCESS });
    } catch (error) {
        dispatch({
            type: EXPORT_APPLICATIONS_FAIL,
            payload: error.response?.data?.message || "Failed to export CSV"
        });
    }
};

// Get Job Stats (Admin)
export const getJobStats = () => async (dispatch) => {
    try {
        dispatch({ type: JOB_STATS_REQUEST });

        const config = { withCredentials: true };
        const { data } = await axios.get(`${BASE_URI}/jobs/stats/overview`, config);

        dispatch({
            type: JOB_STATS_SUCCESS,
            payload: data
        });
    } catch (error) {
        dispatch({
            type: JOB_STATS_FAIL,
            payload: error.response?.data?.message || error.message
        });
    }
};

// Clear Errors
export const clearJobErrors = () => async (dispatch) => {
    dispatch({ type: CLEAR_ERRORS });
};