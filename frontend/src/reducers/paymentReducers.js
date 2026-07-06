import {
  GET_ALL_PAYMENTS_REQUEST,
  GET_ALL_PAYMENTS_SUCCESS,
  GET_ALL_PAYMENTS_FAIL,
  GET_PAYMENT_REQUEST,
  GET_PAYMENT_SUCCESS,
  GET_PAYMENT_FAIL,
  SUBMIT_PAYMENT_REQUEST,
  SUBMIT_PAYMENT_SUCCESS,
  SUBMIT_PAYMENT_FAIL,
  SUBMIT_PAYMENT_RESET,
  APPROVE_PAYMENT_REQUEST,
  APPROVE_PAYMENT_SUCCESS,
  APPROVE_PAYMENT_FAIL,
  APPROVE_PAYMENT_RESET,
  DENY_PAYMENT_REQUEST,
  DENY_PAYMENT_SUCCESS,
  DENY_PAYMENT_FAIL,
  DENY_PAYMENT_RESET,
  GET_PAYMENT_STATS_REQUEST,
  GET_PAYMENT_STATS_SUCCESS,
  GET_PAYMENT_STATS_FAIL,
  CLEAR_PAYMENT_ERRORS
} from '../constants/paymentConstants';

// Get All Payments Reducer
export const getAllPaymentsReducer = (state = { payments: [], loading: false }, action) => {
  switch (action.type) {
    case GET_ALL_PAYMENTS_REQUEST:
      return {
        ...state,
        loading: true
      };
    
    case GET_ALL_PAYMENTS_SUCCESS:
      return {
        ...state,
        loading: false,
        payments: action.payload.payments || action.payload,
        count: action.payload.count,
        total: action.payload.total,
        page: action.payload.page,
        pages: action.payload.pages
      };
    
    case GET_ALL_PAYMENTS_FAIL:
      return {
        ...state,
        loading: false,
        error: action.payload,
        payments: []
      };
    
    case CLEAR_PAYMENT_ERRORS:
      return {
        ...state,
        error: null
      };
    
    default:
      return state;
  }
};

// Get Single Payment Reducer
export const getPaymentReducer = (state = { payment: {}, loading: false }, action) => {
  switch (action.type) {
    case GET_PAYMENT_REQUEST:
      return {
        ...state,
        loading: true,
        payment: {}
      };
    
    case GET_PAYMENT_SUCCESS:
      return {
        ...state,
        loading: false,
        payment: action.payload.payment
      };
    
    case GET_PAYMENT_FAIL:
      return {
        ...state,
        loading: false,
        error: action.payload
      };
    
    case CLEAR_PAYMENT_ERRORS:
      return {
        ...state,
        error: null
      };
    
    default:
      return state;
  }
};

// Submit Payment Reducer (School)
export const submitPaymentReducer = (state = { payment: {}, success: false }, action) => {
  switch (action.type) {
    case SUBMIT_PAYMENT_REQUEST:
      return {
        ...state,
        loading: true
      };
    
    case SUBMIT_PAYMENT_SUCCESS:
      return {
        ...state,
        loading: false,
        success: true,
        payment: action.payload.payment
      };
    
    case SUBMIT_PAYMENT_FAIL:
      return {
        ...state,
        loading: false,
        error: action.payload,
        success: false
      };
    
    case SUBMIT_PAYMENT_RESET:
      return {
        ...state,
        success: false,
        payment: {}
      };
    
    case CLEAR_PAYMENT_ERRORS:
      return {
        ...state,
        error: null
      };
    
    default:
      return state;
  }
};

// Approve Payment Reducer (Admin)
export const approvePaymentReducer = (state = { payment: {}, success: false }, action) => {
  switch (action.type) {
    case APPROVE_PAYMENT_REQUEST:
      return {
        ...state,
        loading: true
      };
    
    case APPROVE_PAYMENT_SUCCESS:
      return {
        ...state,
        loading: false,
        success: true,
        payment: action.payload.payment
      };
    
    case APPROVE_PAYMENT_FAIL:
      return {
        ...state,
        loading: false,
        error: action.payload,
        success: false
      };
    
    case APPROVE_PAYMENT_RESET:
      return {
        ...state,
        success: false,
        payment: {}
      };
    
    case CLEAR_PAYMENT_ERRORS:
      return {
        ...state,
        error: null
      };
    
    default:
      return state;
  }
};

// Deny Payment Reducer (Admin)
export const denyPaymentReducer = (state = { payment: {}, success: false }, action) => {
  switch (action.type) {
    case DENY_PAYMENT_REQUEST:
      return {
        ...state,
        loading: true
      };
    
    case DENY_PAYMENT_SUCCESS:
      return {
        ...state,
        loading: false,
        success: true,
        payment: action.payload.payment,
        message: action.payload.message
      };
    
    case DENY_PAYMENT_FAIL:
      return {
        ...state,
        loading: false,
        error: action.payload,
        success: false
      };
    
    case DENY_PAYMENT_RESET:
      return {
        ...state,
        success: false,
        payment: {}
      };
    
    case CLEAR_PAYMENT_ERRORS:
      return {
        ...state,
        error: null
      };
    
    default:
      return state;
  }
};

// Get Payment Stats Reducer (Admin)
export const getPaymentStatsReducer = (state = { stats: {}, loading: false }, action) => {
  switch (action.type) {
    case GET_PAYMENT_STATS_REQUEST:
      return {
        ...state,
        loading: true
      };
    
    case GET_PAYMENT_STATS_SUCCESS:
      return {
        ...state,
        loading: false,
        stats: action.payload.stats,
        monthlyRevenue: action.payload.monthlyRevenue
      };
    
    case GET_PAYMENT_STATS_FAIL:
      return {
        ...state,
        loading: false,
        error: action.payload
      };
    
    case CLEAR_PAYMENT_ERRORS:
      return {
        ...state,
        error: null
      };
    
    default:
      return state;
  }
};