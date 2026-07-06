import {
  GET_MY_SUBSCRIPTION_REQUEST,
  GET_MY_SUBSCRIPTION_SUCCESS,
  GET_MY_SUBSCRIPTION_FAIL,
  CHECK_CAN_POST_JOB_REQUEST,
  CHECK_CAN_POST_JOB_SUCCESS,
  CHECK_CAN_POST_JOB_FAIL,
  INCREMENT_JOB_POST_REQUEST,
  INCREMENT_JOB_POST_SUCCESS,
  INCREMENT_JOB_POST_FAIL,
  INCREMENT_JOB_POST_RESET,
  CLEAR_SUBSCRIPTION_ERRORS,
  DECREASE_CV_COUNT_REQUEST,
  DECREASE_CV_COUNT_SUCCESS,
  DECREASE_CV_COUNT_FAIL,
  DECREASE_CV_COUNT_RESET
} from '../constants/subscriptionConstants';

// Get My Subscription Reducer
export const getMySubscriptionReducer = (state = { subscription: null, usageStats: null, paymentHistory: [], loading: false }, action) => {
  switch (action.type) {
    case GET_MY_SUBSCRIPTION_REQUEST:
      return {
        ...state,
        loading: true
      };
    
    case GET_MY_SUBSCRIPTION_SUCCESS:
      return {
        ...state,
        loading: false,
        subscription: action.payload.subscription,
        usageStats: action.payload.usageStats,
        paymentHistory: action.payload.paymentHistory,
        success: true
      };
    
    case GET_MY_SUBSCRIPTION_FAIL:
      return {
        ...state,
        loading: false,
        error: action.payload,
        subscription: null,
        usageStats: null,
        paymentHistory: []
      };
    
    case CLEAR_SUBSCRIPTION_ERRORS:
      return {
        ...state,
        error: null
      };
    
    default:
      return state;
  }
};

// Check Can Post Job Reducer
export const checkCanPostJobReducer = (state = { canPost: false, remainingJobs: 0, reason: null, loading: false }, action) => {
  switch (action.type) {
    case CHECK_CAN_POST_JOB_REQUEST:
      return {
        ...state,
        loading: true
      };
    
    case CHECK_CAN_POST_JOB_SUCCESS:
      return {
        ...state,
        loading: false,
        canPost: action.payload.canPost,
        remainingJobs: action.payload.remainingJobs || 0,
        reason: action.payload.reason || null,
        success: true
      };
    
    case CHECK_CAN_POST_JOB_FAIL:
      return {
        ...state,
        loading: false,
        error: action.payload,
        canPost: false,
        remainingJobs: 0,
        reason: null
      };
    
    case CLEAR_SUBSCRIPTION_ERRORS:
      return {
        ...state,
        error: null
      };
    
    default:
      return state;
  }
};

// Increment Job Post Reducer
export const incrementJobPostReducer = (state = { success: false, loading: false }, action) => {
  switch (action.type) {
    case INCREMENT_JOB_POST_REQUEST:
      return {
        ...state,
        loading: true
      };
    
    case INCREMENT_JOB_POST_SUCCESS:
      return {
        ...state,
        loading: false,
        success: true
      };
    
    case INCREMENT_JOB_POST_FAIL:
      return {
        ...state,
        loading: false,
        error: action.payload,
        success: false
      };
    
    case INCREMENT_JOB_POST_RESET:
      return {
        ...state,
        success: false
      };
    
    case CLEAR_SUBSCRIPTION_ERRORS:
      return {
        ...state,
        error: null
      };
    
    default:
      return state;
  }
};


// Decrease CV Count Reducer
export const decreaseCvCountReducer = (state = { success: false, remaining: 0 }, action) => {
  switch (action.type) {
    case DECREASE_CV_COUNT_REQUEST:
      return {
        ...state,
        loading: true
      };
    
    case DECREASE_CV_COUNT_SUCCESS:
      return {
        ...state,
        loading: false,
        success: true,
        remaining: action.payload.remaining,
        message: action.payload.message
      };
    
    case DECREASE_CV_COUNT_FAIL:
      return {
        ...state,
        loading: false,
        error: action.payload,
        success: false
      };
    
    case DECREASE_CV_COUNT_RESET:
      return {
        ...state,
        success: false,
        remaining: 0
      };
    
    case CLEAR_SUBSCRIPTION_ERRORS:
      return {
        ...state,
        error: null
      };
    
    default:
      return state;
  }
};