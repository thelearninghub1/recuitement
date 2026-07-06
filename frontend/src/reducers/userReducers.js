import { LOGIN_USER_FAIL , LOGIN_USER_REQUEST , LOGIN_USER_SUCCESS , CLEAR_ERRORS, REGISTER_USER_REQUEST, REGISTER_USER_SUCCESS, REGISTER_USER_FAIL, FORGOT_PASSWORD_REQUEST, FORGOT_PASSWORD_SUCCESS, FORGOT_PASSWORD_FAIL, FORGOT_PASSWORD_RESET, RESET_PASSWORD_REQUEST, RESET_PASSWORD_SUCCESS, RESET_PASSWORD_FAIL, LOAD_USER_REQUEST, LOAD_USER_SUCCESS, LOAD_USER_FAIL, UPDATE_PASSWORD_REQUEST, UPDATE_PASSWORD_SUCCESS, UPDATE_PASSWORD_FAIL, UPDATE_PASSWORD_RESET, LOGOUT_USER_SUCCESS, LOGOUT_USER_FAIL, ALL_USER_REQUEST, ALL_USER_SUCCESS, ALL_USER_FAIL, DELETE_USER_REQUEST, DELETE_USER_SUCCESS, DELETE_USER_FAIL, DELETE_USER_RESET, USER_DETAILS_REQUEST, USER_DETAILS_SUCCESS, USER_DETAILS_FAIL, UPDATE_USER_REQUEST, UPDATE_USER_SUCCESS, UPDATE_USER_FAIL, UPDATE_USER_RESET } from "../constants/userConstants";



// Login User Reducer - FIXED VERSION
export const loginUserReducer = (state = { user: {} }, action) => {
  switch (action.type) {
    case LOGIN_USER_REQUEST:
    case REGISTER_USER_REQUEST:
    case LOAD_USER_REQUEST:
      return {
        ...state,
        loading: true,
        isAuthenticatedUser: false,
        success: false
      }

    case LOGIN_USER_SUCCESS:
    case REGISTER_USER_SUCCESS:
    case LOAD_USER_SUCCESS:
      return {
        ...state,
        loading: false,
        user: action.payload.user,
        isAuthenticatedUser: true,
        success: true
      }

    case LOGOUT_USER_SUCCESS:
      return {
        loading: false,
        user: null,
        isAuthenticatedUser: false,
        success: true, // ADD THIS
        error: null // ADD THIS
      }

    case LOGIN_USER_FAIL:
    case REGISTER_USER_FAIL:
      return {
        ...state,
        loading: false,
        error: action.payload,
        isAuthenticatedUser: false,
        user: null,
        success: false
      }

    case LOGOUT_USER_FAIL:
      return {
        ...state,
        loading: false,
        error: action.payload,
        success: false // ADD THIS
      }

    case LOAD_USER_FAIL:
      return {
        loading: false,
        error: action.payload,
        isAuthenticatedUser: false,
        user: null,
        success: false
      }

    case CLEAR_ERRORS:
      return {
        ...state,
        error: null
      }

    default:
      return state;
  }
};

// Forgot Password 
export const forgotPasswordReducer = (state={forgotPassword:{}},action) => {

    switch (action.type) {
        case FORGOT_PASSWORD_REQUEST:
            case RESET_PASSWORD_REQUEST:
            return {
                ...state,
                loading: true,
            }
        case FORGOT_PASSWORD_SUCCESS:
            return {
                ...state,
                loading: false,
                success: action.payload.success,
                message: action.payload.message
            }  
        case RESET_PASSWORD_SUCCESS:
            return {
                ...state,
                loading: false,
                success: action.payload.success
            }    
        case FORGOT_PASSWORD_FAIL:
            case RESET_PASSWORD_FAIL:
            return {
                ...state,
                loading: false,
                error: action.payload
            } 

        case FORGOT_PASSWORD_RESET:
            return {
                ...state,
                loading: false,
                success: false,

            }         
        case CLEAR_ERRORS:
            return {
                ...state,
                error:null
            }    
    
        default:
            return state;
    }
};



// Update User Password
export const updateUserPasswordReducer = (state={user:{}}, action) => {
    switch (action.type) {
        case UPDATE_PASSWORD_REQUEST:
            case DELETE_USER_REQUEST:
                case UPDATE_USER_REQUEST:
            return {
                ...state,
                loading: true
            }
        case UPDATE_PASSWORD_SUCCESS:
            return {
                ...state,
                loading: false,
                success: action.payload.success,
            }    
            case UPDATE_USER_SUCCESS:
                return {
                    ...state,
                    loading: false,
                    success: action.payload.success,
                    user: action.payload.user
                }  
 
        case DELETE_USER_SUCCESS:
            return {
                ...state,
                loading: false,
                success: action.payload.success,
                message: action.payload.message
            }    
        case UPDATE_PASSWORD_FAIL:
            case DELETE_USER_FAIL:
                case UPDATE_USER_FAIL:
            return {
                ...state,
                loading: false,
                error: action.payload
            }    
        case UPDATE_PASSWORD_RESET:
            return {
                ...state,
                loading: false,
                success:false
            }  
        case UPDATE_USER_RESET:
          return  {
                ...state,
                loading: false,
                success:false ,
            }    
        case DELETE_USER_RESET:
            return {
                ...state,
                loading: false,
                success:false,
                message:null

            }   
        case CLEAR_ERRORS:
            return {
                ...state,
                error:null
            }    
            
    
        default:
            return state;
    }
};


// Get Single User Details -- Super Admin 
export const singleUserDetailsReducer = (state={user:{}}, action) => {
    switch (action.type) {
    case USER_DETAILS_REQUEST: 
    return { 
        ...state,
        loading: true
    }

    case USER_DETAILS_SUCCESS:
        return {
            ...state,
            loading: false,
            user:action.payload.user
        }
    case USER_DETAILS_FAIL:
        return {
            ...state,
            loading: false,
            error: action.payload
        }   
        
    case CLEAR_ERRORS:
        return {
            ...state,
            error:null
        }    
        
        default:
            return state;
        
    
    }
}


/// All Users --Admin
export const allUserReducer = (state={users:[]},action) => {
    switch (action.type) {
        case ALL_USER_REQUEST:
            return {
                ...state,
                loading: true
            }
        case ALL_USER_SUCCESS:
            return {
                ...state,
                loading: false,
                users: action.payload.users
            }  
        case ALL_USER_FAIL:
            return {
                ...state,
                loading: false,
                errors: action.payload
            }
        case CLEAR_ERRORS:
            return {
                ...state,
                error:null
            }          
            
    
        default:
            return state;
    }
};