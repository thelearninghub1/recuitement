import { CLEAR_ERRORS, CONTACT_US_FAIL, CONTACT_US_REQUEST, CONTACT_US_SUCCESS } from "../constants/contactConstants";
import axios from 'axios';

//const BASE_URI = `http://localhost:5000/api`;
const BASE_URI = `/api`;

// Create Contact Action
export const createContactUsAction = (contactData) => async (dispatch) => {
    try {
        dispatch({ type: CONTACT_US_REQUEST });

        const config = { 
            headers: { 
                "Content-Type": "application/json"  // Changed to application/json
            }
        };

        // Send as JSON object instead of FormData
        const { data } = await axios.post(`${BASE_URI}/contact`, contactData, config);

        dispatch({
            type: CONTACT_US_SUCCESS,
            payload: data
        });

    } catch (error) {
        dispatch({
            type: CONTACT_US_FAIL,
            payload: error.response?.data?.message || "Something went wrong"
        });
    }
};

// Clear Errors
export const clearErrors = () => async (dispatch) => {
    dispatch({
        type: CLEAR_ERRORS
    });
};