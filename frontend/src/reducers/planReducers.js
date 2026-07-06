// reducers/planReducers.js

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
  CREATE_PLAN_RESET,
  UPDATE_PLAN_REQUEST,
  UPDATE_PLAN_SUCCESS,
  UPDATE_PLAN_FAIL,
  UPDATE_PLAN_RESET,
  DELETE_PLAN_REQUEST,
  DELETE_PLAN_SUCCESS,
  DELETE_PLAN_FAIL,
  DELETE_PLAN_RESET,
  TOGGLE_PLAN_ACTIVE_REQUEST,
  TOGGLE_PLAN_ACTIVE_SUCCESS,
  TOGGLE_PLAN_ACTIVE_FAIL,
  SET_POPULAR_PLAN_REQUEST,
  SET_POPULAR_PLAN_SUCCESS,
  SET_POPULAR_PLAN_FAIL,
  CLEAR_PLAN_ERRORS
} from '../constants/planConstants';

// Get All Plans Reducer
export const getAllPlansReducer = (state = { plans: [], loading: false }, action) => {
  switch (action.type) {
    case GET_ALL_PLANS_REQUEST:
      return {
        ...state,
        loading: true,
        plans: []
      };
    
    case GET_ALL_PLANS_SUCCESS:
      return {
        ...state,
        loading: false,
        plans: action.payload.plans,
        count: action.payload.count
      };
    
    case GET_ALL_PLANS_FAIL:
      return {
        ...state,
        loading: false,
        error: action.payload
      };
    
    case CLEAR_PLAN_ERRORS:
      return {
        ...state,
        error: null
      };
    
    default:
      return state;
  }
};

// Get Single Plan Reducer
export const getPlanReducer = (state = { plan: null, loading: false }, action) => {
  switch (action.type) {
    case GET_PLAN_REQUEST:
      return {
        ...state,
        loading: true,
        plan: null
      };
    
    case GET_PLAN_SUCCESS:
      return {
        ...state,
        loading: false,
        plan: action.payload.plan
      };
    
    case GET_PLAN_FAIL:
      return {
        ...state,
        loading: false,
        error: action.payload
      };
    
    case CLEAR_PLAN_ERRORS:
      return {
        ...state,
        error: null
      };
    
    default:
      return state;
  }
};

// Create Plan Reducer
export const createPlanReducer = (state = { plan: null, loading: false, success: false }, action) => {
  switch (action.type) {
    case CREATE_PLAN_REQUEST:
      return {
        ...state,
        loading: true
      };
    
    case CREATE_PLAN_SUCCESS:
      return {
        ...state,
        loading: false,
        success: true,
        plan: action.payload.plan
      };
    
    case CREATE_PLAN_FAIL:
      return {
        ...state,
        loading: false,
        error: action.payload
      };
    
    case CREATE_PLAN_RESET:
      return {
        ...state,
        success: false,
        plan: null,
        error: null
      };
    
    case CLEAR_PLAN_ERRORS:
      return {
        ...state,
        error: null
      };
    
    default:
      return state;
  }
};

// Update Plan Reducer
export const updatePlanReducer = (state = { plan: null, loading: false, success: false }, action) => {
  switch (action.type) {
    case UPDATE_PLAN_REQUEST:
      return {
        ...state,
        loading: true
      };
    
    case UPDATE_PLAN_SUCCESS:
      return {
        ...state,
        loading: false,
        success: true,
        plan: action.payload.plan
      };
    
    case UPDATE_PLAN_FAIL:
      return {
        ...state,
        loading: false,
        error: action.payload
      };
    
    case UPDATE_PLAN_RESET:
      return {
        ...state,
        success: false,
        plan: null,
        error: null
      };
    
    case CLEAR_PLAN_ERRORS:
      return {
        ...state,
        error: null
      };
    
    default:
      return state;
  }
};

// Delete Plan Reducer
export const deletePlanReducer = (state = { loading: false, success: false }, action) => {
  switch (action.type) {
    case DELETE_PLAN_REQUEST:
      return {
        ...state,
        loading: true
      };
    
    case DELETE_PLAN_SUCCESS:
      return {
        ...state,
        loading: false,
        success: true,
        message: action.payload.message
      };
    
    case DELETE_PLAN_FAIL:
      return {
        ...state,
        loading: false,
        error: action.payload
      };
    
    case DELETE_PLAN_RESET:
      return {
        ...state,
        success: false,
        message: null,
        error: null
      };
    
    case CLEAR_PLAN_ERRORS:
      return {
        ...state,
        error: null
      };
    
    default:
      return state;
  }
};

// Toggle Plan Active Status Reducer
export const togglePlanActiveReducer = (state = { plan: null, loading: false, success: false }, action) => {
  switch (action.type) {
    case TOGGLE_PLAN_ACTIVE_REQUEST:
      return {
        ...state,
        loading: true
      };
    
    case TOGGLE_PLAN_ACTIVE_SUCCESS:
      return {
        ...state,
        loading: false,
        success: true,
        plan: action.payload.plan
      };
    
    case TOGGLE_PLAN_ACTIVE_FAIL:
      return {
        ...state,
        loading: false,
        error: action.payload
      };
    
    case CLEAR_PLAN_ERRORS:
      return {
        ...state,
        error: null
      };
    
    default:
      return state;
  }
};

// Set Popular Plan Reducer
export const setPopularPlanReducer = (state = { plan: null, loading: false, success: false }, action) => {
  switch (action.type) {
    case SET_POPULAR_PLAN_REQUEST:
      return {
        ...state,
        loading: true
      };
    
    case SET_POPULAR_PLAN_SUCCESS:
      return {
        ...state,
        loading: false,
        success: true,
        plan: action.payload.plan,
        message: action.payload.message
      };
    
    case SET_POPULAR_PLAN_FAIL:
      return {
        ...state,
        loading: false,
        error: action.payload
      };
    
    case CLEAR_PLAN_ERRORS:
      return {
        ...state,
        error: null
      };
    
    default:
      return state;
  }
};