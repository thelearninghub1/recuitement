import axios from 'axios';
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
  CLEAR_SUBSCRIPTION_ERRORS,
  DECREASE_CV_COUNT_REQUEST,
  DECREASE_CV_COUNT_SUCCESS,
  DECREASE_CV_COUNT_FAIL
} from '../constants/subscriptionConstants';

//const BASE_URI = `http://localhost:5000/api`;
const BASE_URI = `/api`;

// Get My Subscription (School only)
export const getMySubscription = () => async (dispatch) => {
  try {
    dispatch({ type: GET_MY_SUBSCRIPTION_REQUEST });

    const config = {
      withCredentials: true
    };

    const { data } = await axios.get(`${BASE_URI}/subscriptions/me`, config);

    dispatch({
      type: GET_MY_SUBSCRIPTION_SUCCESS,
      payload: data
    });

    return data;

  } catch (error) {
    dispatch({
      type: GET_MY_SUBSCRIPTION_FAIL,
      payload: error.response?.data?.message || error.message
    });
  }
};

// Check if School Can Post a Job
export const checkCanPostJob = () => async (dispatch) => {
  try {
    dispatch({ type: CHECK_CAN_POST_JOB_REQUEST });

    const config = {
      withCredentials: true
    };

    const { data } = await axios.get(`${BASE_URI}/subscriptions/can-post-job`, config);

    dispatch({
      type: CHECK_CAN_POST_JOB_SUCCESS,
      payload: data
    });

    return data;

  } catch (error) {
    dispatch({
      type: CHECK_CAN_POST_JOB_FAIL,
      payload: error.response?.data?.message || error.message
    });
  }
};

// Increment Job Post Count (Call when school posts a job)
export const incrementJobPost = () => async (dispatch) => {
  try {
    dispatch({ type: INCREMENT_JOB_POST_REQUEST });

    const config = {
      headers: { 'Content-Type': 'application/json' },
      withCredentials: true
    };

    const { data } = await axios.post(`${BASE_URI}/subscriptions/increment-job`, {}, config);

    dispatch({
      type: INCREMENT_JOB_POST_SUCCESS,
      payload: data
    });

    return data;

  } catch (error) {
    dispatch({
      type: INCREMENT_JOB_POST_FAIL,
      payload: error.response?.data?.message || error.message
    });
  }
};

// Decrease CV count when downloading a CV
export const decreaseCvCount = () => async (dispatch) => {
  try {
    dispatch({ type: DECREASE_CV_COUNT_REQUEST });

    const config = {
      headers: { 'Content-Type': 'application/json' },
      withCredentials: true
    };
 
    const { data } = await axios.post(`${BASE_URI}/subscriptions/decrease-cv`, {}, config);

    dispatch({
      type: DECREASE_CV_COUNT_SUCCESS,
      payload: data
    });

    return data;

  } catch (error) {
    dispatch({
      type: DECREASE_CV_COUNT_FAIL,
      payload: error.response?.data?.message || error.message
    });
  }
};

// Clear Subscription Errors
export const clearSubscriptionErrors = () => (dispatch) => {
  dispatch({ type: CLEAR_SUBSCRIPTION_ERRORS });
};

// Reset Actions
export const resetIncrementJobPost = () => (dispatch) => {
  dispatch({ type: 'INCREMENT_JOB_POST_RESET' });
};

