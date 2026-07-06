import axios from 'axios';
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
  APPROVE_PAYMENT_REQUEST,
  APPROVE_PAYMENT_SUCCESS,
  APPROVE_PAYMENT_FAIL,
  DENY_PAYMENT_REQUEST,
  DENY_PAYMENT_SUCCESS,
  DENY_PAYMENT_FAIL,
  GET_PAYMENT_STATS_REQUEST,
  GET_PAYMENT_STATS_SUCCESS,
  GET_PAYMENT_STATS_FAIL,
  CLEAR_PAYMENT_ERRORS
} from '../constants/paymentConstants';

//const BASE_URI = `http://localhost:5000/api`;
const BASE_URI = `/api`;

// Get All Payments (Admin sees all, School sees own)
export const getAllPayments = (page = 1, limit = 10, status = '', search = '') => async (dispatch) => {
  try {
    dispatch({ type: GET_ALL_PAYMENTS_REQUEST });

    const config = {
      withCredentials: true
    };

    let url = `${BASE_URI}/payments?page=${page}&limit=${limit}`;
    if (status) url += `&status=${status}`;
    if (search) url += `&search=${search}`;

    const { data } = await axios.get(url, config);

    dispatch({
      type: GET_ALL_PAYMENTS_SUCCESS,
      payload: data
    });

  } catch (error) {
    dispatch({
      type: GET_ALL_PAYMENTS_FAIL,
      payload: error.response?.data?.message || error.message
    });
  }
};

// Get Single Payment
export const getPayment = (id) => async (dispatch) => {
  try {
    dispatch({ type: GET_PAYMENT_REQUEST });

    const config = {
      withCredentials: true
    };

    const { data } = await axios.get(`${BASE_URI}/payments/${id}`, config);

    dispatch({
      type: GET_PAYMENT_SUCCESS,
      payload: data
    });

  } catch (error) {
    dispatch({
      type: GET_PAYMENT_FAIL,
      payload: error.response?.data?.message || error.message
    });
  }
};

// Submit Payment (School only)
export const submitPayment = (paymentData) => async (dispatch) => {
  try {
    dispatch({ type: SUBMIT_PAYMENT_REQUEST });

    const config = {
      headers: { 'Content-Type': 'multipart/form-data' },
      withCredentials: true
    };

    const { data } = await axios.post(`${BASE_URI}/payments`, paymentData, config);

    dispatch({
      type: SUBMIT_PAYMENT_SUCCESS,
      payload: data
    });

    return data;

  } catch (error) {
    dispatch({
      type: SUBMIT_PAYMENT_FAIL,
      payload: error.response?.data?.message || error.message
    });
  }
};

// Approve Payment (Admin only)
export const approvePayment = (id, adminNotes = '') => async (dispatch) => {
  try {
    dispatch({ type: APPROVE_PAYMENT_REQUEST });

    const config = {
      headers: { 'Content-Type': 'application/json' },
      withCredentials: true
    };

    const { data } = await axios.put(`${BASE_URI}/payments/${id}/approve`, { adminNotes }, config);

    dispatch({
      type: APPROVE_PAYMENT_SUCCESS,
      payload: data
    });

    return data;

  } catch (error) {
    dispatch({
      type: APPROVE_PAYMENT_FAIL,
      payload: error.response?.data?.message || error.message
    });
  }
};

// Deny Payment (Admin only)
export const denyPayment = (id, reason, adminNotes = '') => async (dispatch) => {
  try {
    dispatch({ type: DENY_PAYMENT_REQUEST });

    const config = {
      headers: { 'Content-Type': 'application/json' },
      withCredentials: true
    };

    const { data } = await axios.put(`${BASE_URI}/payments/${id}/deny`, { reason, adminNotes }, config);

    dispatch({
      type: DENY_PAYMENT_SUCCESS,
      payload: data
    });

    return data;

  } catch (error) {
    dispatch({
      type: DENY_PAYMENT_FAIL,
      payload: error.response?.data?.message || error.message
    });
  }
};

// Get Payment Stats (Admin only)
export const getPaymentStats = () => async (dispatch) => {
  try {
    dispatch({ type: GET_PAYMENT_STATS_REQUEST });

    const config = {
      withCredentials: true
    };

    const { data } = await axios.get(`${BASE_URI}/payments/stats`, config);

    dispatch({
      type: GET_PAYMENT_STATS_SUCCESS,
      payload: data
    });

  } catch (error) {
    dispatch({
      type: GET_PAYMENT_STATS_FAIL,
      payload: error.response?.data?.message || error.message
    });
  }
};

// Clear Payment Errors
export const clearPaymentErrors = () => (dispatch) => {
  dispatch({ type: CLEAR_PAYMENT_ERRORS });
};

// Reset Actions
export const resetSubmitPayment = () => (dispatch) => {
  dispatch({ type: 'SUBMIT_PAYMENT_RESET' });
};

export const resetApprovePayment = () => (dispatch) => {
  dispatch({ type: 'APPROVE_PAYMENT_RESET' });
};

export const resetDenyPayment = () => (dispatch) => {
  dispatch({ type: 'DENY_PAYMENT_RESET' });
};