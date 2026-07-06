import {
  LOGIN_USER_FAIL, LOGIN_USER_REQUEST, LOGIN_USER_SUCCESS, CLEAR_ERRORS,
  REGISTER_USER_FAIL, REGISTER_USER_REQUEST, REGISTER_USER_SUCCESS,
  FORGOT_PASSWORD_FAIL, FORGOT_PASSWORD_REQUEST, FORGOT_PASSWORD_SUCCESS,
  RESET_PASSWORD_FAIL, RESET_PASSWORD_REQUEST, RESET_PASSWORD_SUCCESS,
  LOAD_USER_FAIL, LOAD_USER_REQUEST, LOAD_USER_SUCCESS,
  UPDATE_PASSWORD_FAIL, UPDATE_PASSWORD_REQUEST, UPDATE_PASSWORD_SUCCESS,
  LOGOUT_USER_FAIL, LOGOUT_USER_SUCCESS,
  ALL_USER_FAIL, ALL_USER_REQUEST, ALL_USER_SUCCESS,
  DELETE_USER_FAIL, DELETE_USER_REQUEST, DELETE_USER_SUCCESS,
  USER_DETAILS_FAIL, USER_DETAILS_REQUEST, USER_DETAILS_SUCCESS,
  UPDATE_USER_REQUEST, UPDATE_USER_SUCCESS, UPDATE_USER_FAIL
} from "../constants/userConstants";
 
import axios from 'axios';

//const BASE_URI = `http://localhost:5000/api`;
const BASE_URI = `/api`;


// Login Candidate & School User Action
export const loginUserAction = (email, password) => async (dispatch) => {
  try {
    dispatch({ type: LOGIN_USER_REQUEST });

    const config = {
      headers: { 'Content-Type': 'application/json' },
      withCredentials: true
    }

    const { data } = await axios.post(`${BASE_URI}/auth/login`, { email, password }, config);

    dispatch({
      type: LOGIN_USER_SUCCESS,
      payload: data
    });

  } catch (error) {
    dispatch({
      type: LOGIN_USER_FAIL,
      payload: error.response?.data?.message || error.message
    });
  }
};

// Register Candidates User Action 
export const registerCandidatesAction = (newUserData) => async (dispatch) => {
  try {
    dispatch({ type: REGISTER_USER_REQUEST });

    const config = {
      headers: { "Content-Type": "multipart/form-data" },
      withCredentials: true
    };

    const { data } = await axios.post(`${BASE_URI}/auth/register/candidate`, newUserData, config);

    dispatch({
      type: REGISTER_USER_SUCCESS,
      payload: data
    });

  } catch (error) {
    dispatch({
      type: REGISTER_USER_FAIL,
      payload: error.response?.data?.message || error.message
    });
  }
};

// Register Schools User Action 
export const registerSchoolAction = (newUserData) => async (dispatch) => {
  try {
    dispatch({ type: REGISTER_USER_REQUEST });

    const config = {
      headers: { "Content-Type": "multipart/form-data" },
      withCredentials: true
    };

    const { data } = await axios.post(`${BASE_URI}/auth/register/school`, newUserData, config);

    dispatch({
      type: REGISTER_USER_SUCCESS,
      payload: data
    });

  } catch (error) {
    dispatch({
      type: REGISTER_USER_FAIL,
      payload: error.response?.data?.message || error.message
    });
  }
};

// Forgot Password 
export const forgotPasswordAction = (email) => async (dispatch) => {
  try {
    dispatch({ type: FORGOT_PASSWORD_REQUEST });

    const config = {
      headers: { "Content-Type": "application/json" }
    }

    const { data } = await axios.post(`${BASE_URI}/auth/forgotpassword`, { email }, config);

    dispatch({
      type: FORGOT_PASSWORD_SUCCESS,
      payload: data
    });

  } catch (error) {
    dispatch({
      type: FORGOT_PASSWORD_FAIL,
      payload: error.response?.data?.message || error.message
    });
  }
};

// Reset Password
export const resetPasswordAction = (token, password) => async (dispatch) => {
  try {
    dispatch({ type: RESET_PASSWORD_REQUEST });

    const config = {
      headers: { "Content-Type": "application/json" },
      withCredentials: true
    }

    const { data } = await axios.put(`${BASE_URI}/auth/resetpassword/${token}`, {password}, config);

    dispatch({
      type: RESET_PASSWORD_SUCCESS,
      payload: data
    });

  } catch (error) {
    dispatch({
      type: RESET_PASSWORD_FAIL,
      payload: error.response?.data?.message || error.message
    });
  }
};

// Load User
export const loadUser = () => async (dispatch) => {
  try {
    dispatch({ type: LOAD_USER_REQUEST });

    const config = {
      withCredentials: true
    };

    const { data } = await axios.get(`${BASE_URI}/auth/me`, config);

    dispatch({
      type: LOAD_USER_SUCCESS,
      payload: data
    });

  } catch (error) {
    dispatch({
      type: LOAD_USER_FAIL,
      payload: error.response?.data?.message || error.message
    });
  }
};

// Update Password
export const updatePasswordAction = (passwords) => async (dispatch) => {
  try {
    dispatch({ type: UPDATE_PASSWORD_REQUEST });

    const config = {
      headers: { "Content-Type": "application/json" },
      withCredentials: true
    };

    const { data } = await axios.put(`${BASE_URI}/auth/updatepassword`, passwords, config);

    dispatch({
      type: UPDATE_PASSWORD_SUCCESS,
      payload: data
    });

  } catch (error) {
    dispatch({
      type: UPDATE_PASSWORD_FAIL,
      payload: error.response?.data?.message || error.message
    });
  }
};


// Logout User - FIXED VERSION
export const logoutUser = () => async (dispatch) => {
  try {
    const config = {
      withCredentials: true
    };

    await axios.get(`${BASE_URI}/auth/logout`, config);

    // Clear localStorage after successful logout
    localStorage.removeItem('token');
    localStorage.removeItem('userInfo');

    dispatch({
      type: LOGOUT_USER_SUCCESS,
    });

  } catch (error) {
    dispatch({
      type: LOGOUT_USER_FAIL, 
      payload: error.response?.data?.message || error.message
    });
  }
}

// All Users  --Admin
export const allUserAction = () => async (dispatch) => {
  try {
    dispatch({ type: ALL_USER_REQUEST });

    const config = {
      headers: { "Content-Type": "application/json" },
      withCredentials: true
    };

    const { data } = await axios.get(`${BASE_URI}/users`, config);

    dispatch({
      type: ALL_USER_SUCCESS,
      payload: data
    });

  } catch (error) {
    dispatch({
      type: ALL_USER_FAIL,
      payload: error.response?.data?.message || error.message
    });
  }
}

// Delete User  ---Admin
export const deleteUserAction = (id) => async (dispatch) => {
  try {
    dispatch({ type: DELETE_USER_REQUEST });

    const config = {
      headers: { "Content-Type": "application/json" },
      withCredentials: true
    };

    const { data } = await axios.delete(`${BASE_URI}/users/${id}`, config);

    dispatch({
      type: DELETE_USER_SUCCESS,
      payload: data
    });

  } catch (error) {
    dispatch({
      type: DELETE_USER_FAIL,
      payload: error.response?.data?.message || error.message
    });
  }
}

// Get Single User Details --  Admin
export const getUserDetails = (id) => async (dispatch) => {
  try {
    dispatch({ type: USER_DETAILS_REQUEST });

    const config = {
      withCredentials: true
    };

    const { data } = await axios.get(`${BASE_URI}/users/${id}`, config);

    dispatch({
      type: USER_DETAILS_SUCCESS,
      payload: data
    });

  } catch (error) {
    dispatch({
      type: USER_DETAILS_FAIL,
      payload: error.response?.data?.message || error.message
    });
  }
}
// School 
export const updateUserProfile = (userData) => async (dispatch) => {
  try {
    dispatch({ type: UPDATE_USER_REQUEST });


    const config = {
      headers: { "Content-Type": "multipart/form-data" },
      withCredentials: true
    };

    const { data } = await axios.put(`${BASE_URI}/auth/profile`, userData, config);
    

    dispatch({
      type: UPDATE_USER_SUCCESS,
      payload: data
    });
    

  } catch (error) {    
    dispatch({
      type: UPDATE_USER_FAIL,
      payload: error.response?.data?.message || error.message
    });
  }
};
// Teacher 
export const updateTeacherProfile = (userData) => async (dispatch) => {
  try {
    dispatch({ type: UPDATE_USER_REQUEST });


    const config = {
      headers: { "Content-Type": "multipart/form-data" },
      withCredentials: true
    };

    const { data } = await axios.put(`${BASE_URI}/auth/teacher/profile`, userData, config);
    

    dispatch({
      type: UPDATE_USER_SUCCESS,
      payload: data
    });
    

  } catch (error) {    
    dispatch({
      type: UPDATE_USER_FAIL,
      payload: error.response?.data?.message || error.message
    });
  }
};

// Clear Errors 
export const clearErrors = () => async (dispatch) => {
  dispatch({ type: CLEAR_ERRORS });
}