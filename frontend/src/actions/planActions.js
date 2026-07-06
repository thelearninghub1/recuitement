// actions/planActions.js

import axios from 'axios';
import {
  GET_ALL_PLANS_REQUEST,
  GET_ALL_PLANS_SUCCESS,
  GET_ALL_PLANS_FAIL,
  GET_PLAN_REQUEST,
  GET_PLAN_SUCCESS,
  GET_PLAN_FAIL,
  CREATE_PLAN_REQUEST,
  CREATE_PLAN_SUCCESS,
  CREATE_PLAN_FAIL,
  UPDATE_PLAN_REQUEST,
  UPDATE_PLAN_SUCCESS,
  UPDATE_PLAN_FAIL,
  DELETE_PLAN_REQUEST,
  DELETE_PLAN_SUCCESS,
  DELETE_PLAN_FAIL,
  TOGGLE_PLAN_ACTIVE_REQUEST,
  TOGGLE_PLAN_ACTIVE_SUCCESS,
  TOGGLE_PLAN_ACTIVE_FAIL,
  SET_POPULAR_PLAN_REQUEST,
  SET_POPULAR_PLAN_SUCCESS,
  SET_POPULAR_PLAN_FAIL,
  CLEAR_PLAN_ERRORS
} from '../constants/planConstants';

//const BASE_URI = `http://localhost:5000/api`;
const BASE_URI = `/api`;

// Get All Plans - Simplified (backend handles admin vs non-admin)
export const getAllPlans = () => async (dispatch) => {
  try {
    dispatch({ type: GET_ALL_PLANS_REQUEST });

    const config = {
      withCredentials: true
    };

    const { data } = await axios.get(`${BASE_URI}/plans`, config);

    dispatch({
      type: GET_ALL_PLANS_SUCCESS,
      payload: data
    });

  } catch (error) {
    dispatch({
      type: GET_ALL_PLANS_FAIL,
      payload: error.response?.data?.message || error.message
    });
  }
};

// Get Single Plan
export const getPlan = (id) => async (dispatch) => {
  try {
    dispatch({ type: GET_PLAN_REQUEST });

    const config = {
      withCredentials: true
    };

    const { data } = await axios.get(`${BASE_URI}/plans/${id}`, config);

    dispatch({
      type: GET_PLAN_SUCCESS,
      payload: data
    });

  } catch (error) {
    dispatch({
      type: GET_PLAN_FAIL,
      payload: error.response?.data?.message || error.message
    });
  }
};

// Create Plan (Admin only)
export const createPlan = (planData) => async (dispatch) => {
  try {
    dispatch({ type: CREATE_PLAN_REQUEST });

    const config = {
      headers: { 'Content-Type': 'application/json' },
      withCredentials: true
    };

    const { data } = await axios.post(`${BASE_URI}/plans`, planData, config);

    dispatch({
      type: CREATE_PLAN_SUCCESS,
      payload: data
    });

    return { success: true, data };

  } catch (error) {
    const errorMessage = error.response?.data?.message || error.message;
    dispatch({
      type: CREATE_PLAN_FAIL,
      payload: errorMessage
    });
    
    return { success: false, error: errorMessage };
  }
};

// Update Plan (Admin only)
export const updatePlan = (id, planData) => async (dispatch) => {
  try {
    dispatch({ type: UPDATE_PLAN_REQUEST });

    const config = {
      headers: { 'Content-Type': 'application/json' },
      withCredentials: true
    };

    const { data } = await axios.put(`${BASE_URI}/plans/${id}`, planData, config);

    dispatch({
      type: UPDATE_PLAN_SUCCESS,
      payload: data
    });

    return { success: true, data };

  } catch (error) {
    const errorMessage = error.response?.data?.message || error.message;
    dispatch({
      type: UPDATE_PLAN_FAIL,
      payload: errorMessage
    });
    
    return { success: false, error: errorMessage };
  }
};

// Delete Plan (Admin only)
export const deletePlan = (id) => async (dispatch) => {
  try {
    dispatch({ type: DELETE_PLAN_REQUEST });

    const config = {
      withCredentials: true
    };

    const { data } = await axios.delete(`${BASE_URI}/plans/${id}`, config);

    dispatch({
      type: DELETE_PLAN_SUCCESS,
      payload: data
    });

    return { success: true, data };

  } catch (error) {
    const errorMessage = error.response?.data?.message || error.message;
    dispatch({
      type: DELETE_PLAN_FAIL,
      payload: errorMessage
    });
    
    return { success: false, error: errorMessage };
  }
};

// Toggle Plan Active Status (Admin only)
export const togglePlanActive = (id) => async (dispatch) => {
  try {
    dispatch({ type: TOGGLE_PLAN_ACTIVE_REQUEST });

    const config = {
      withCredentials: true
    };

    const { data } = await axios.patch(`${BASE_URI}/plans/${id}/toggle-active`, {}, config);

    dispatch({
      type: TOGGLE_PLAN_ACTIVE_SUCCESS,
      payload: data
    });

    return { success: true, data };

  } catch (error) {
    const errorMessage = error.response?.data?.message || error.message;
    dispatch({
      type: TOGGLE_PLAN_ACTIVE_FAIL,
      payload: errorMessage
    });
    
    return { success: false, error: errorMessage };
  }
};

// Set Popular Plan (Admin only)
export const setPopularPlan = (id) => async (dispatch) => {
  try {
    dispatch({ type: SET_POPULAR_PLAN_REQUEST });

    const config = {
      withCredentials: true
    };

    const { data } = await axios.patch(`${BASE_URI}/plans/${id}/set-popular`, {}, config);

    dispatch({
      type: SET_POPULAR_PLAN_SUCCESS,
      payload: data
    });

    return { success: true, data };

  } catch (error) {
    const errorMessage = error.response?.data?.message || error.message;
    dispatch({
      type: SET_POPULAR_PLAN_FAIL,
      payload: errorMessage
    });
    
    return { success: false, error: errorMessage };
  }
};

// Clear Plan Errors
export const clearPlanErrors = () => (dispatch) => {
  dispatch({ type: CLEAR_PLAN_ERRORS });
};

// Reset Actions
export const resetCreatePlan = () => (dispatch) => {
  dispatch({ type: 'CREATE_PLAN_RESET' });
};

export const resetUpdatePlan = () => (dispatch) => {
  dispatch({ type: 'UPDATE_PLAN_RESET' });
};

export const resetDeletePlan = () => (dispatch) => {
  dispatch({ type: 'DELETE_PLAN_RESET' });
};