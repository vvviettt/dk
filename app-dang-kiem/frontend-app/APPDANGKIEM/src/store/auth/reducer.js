import { CHANGE_PROFILE, 
  CHANGE_PROFILE_FAILED, 
  CHANGE_PROFILE_SUCCESS,
  GET_PROFILE, 
  LOGIN,
  LOGIN_FAILED, 
  LOGIN_SUCCESS, 
  LOGOUT, 
  RESET_PASSWORD, 
  RESET_PASSWORD_FAILED, 
  RESET_PASSWORD_SUCCESS, 
  SEND_OTP, 
  SEND_OTP_FAILED, 
  SEND_OTP_SUCCESS, 
  SIGN_UP, 
  SIGN_UP_FAILED, 
  SIGN_UP_SUCCESS, 
  VERIFY_OTP,
  VERIFY_OTP_FAILED,
  VERIFY_OTP_SUCCESS,
  SET_NOTIFICATION,
  SET_NOTIFICATION_FAILED
  } from "./actionTypes";

const initialState = {
    user: {},
    phoneNumber:'',
    token: '',
    verified: false,
    msgError: '',
    isChanged:false,
    loading: false,
    loadingFacebook:false,
    loadingGoogle:false,
    password: '',
    haveNotification:false,
};

function reducer(state = initialState, { type, payload }){
    switch (type) {
      case LOGIN:
        return {
          ...state,
          token: '',
          user: {},
          msgError: '',
          loading: true
        }
      case LOGIN_SUCCESS:
      return {
        ...state,
        token: payload.access_token,
        user: payload.info,
        msgError: '',
        loading: false,
        loadingFacebook:false,
        loadingGoogle:false,
      }
      case LOGIN_FAILED:
      return {
        ...state,
        token: '',
        user: {},
        msgError: payload || '',
        loading: false,
        loadingFacebook:false,
        loadingGoogle:false,
      }
      case LOGOUT: 
        return initialState
      case GET_PROFILE:
        return{
        ...state,
        user: {
          ...state.user,
          ...payload,
        },
      }
      case CHANGE_PROFILE:
        return{
        ...state,
        loading: true,
        isChanged:true,
      }
      case CHANGE_PROFILE_SUCCESS:
        return{
        ...state,
        user: {
          ...state.user,
          ...payload,
        },
        loading:false,
        isChanged:false,
      }
      case CHANGE_PROFILE_FAILED:
        return{
        ...state,
        loading:false,
        isChanged:false,
        msgError: payload || "",
      }
      case SEND_OTP:
      return {
        ...state,
        msgError: '',
        loading: true
      }
      case SEND_OTP_FAILED:
      return {
        ...state,
        phoneNumber:'',
        msgError: payload || "",
        loading: false
      }
      case SEND_OTP_SUCCESS:
      return {
        ...state,
        phoneNumber:payload,
        loading: false
      }
      case VERIFY_OTP:
      return {
        ...state,
        verified: false,
        msgError: '',
        loading: true
      }
      case VERIFY_OTP_FAILED:
      return {
        ...state,
        verified: false,
        msgError: payload || '',
        loading: false
      }
      case VERIFY_OTP_SUCCESS:
      return {
        ...state,
        verified: true,
        msgError: '',
        loading: false
      }
      case RESET_PASSWORD:
      return {
        ...state,
        msgError: '',
        loading: true
      }
      case RESET_PASSWORD_FAILED:
      return {
        ...state,
        msgError: payload || '',
        loading: false
      }
      case RESET_PASSWORD_SUCCESS:
      return {
        ...state,
        msgError: '',
        loading: false
      }
      case SIGN_UP:
      return {
        ...state,
        msgError: '',
        phoneNumber: payload.phone_number,
        password: payload.password,
      }
      case SIGN_UP_FAILED:
      return {
        ...state,
        msgError: payload || '',
        phoneNumber:'',
        password: '',
        loading: false
      }
      case SIGN_UP_SUCCESS:
      return {
        ...state,
        msgError: '',
        loading: false
      }
      case SET_NOTIFICATION:
        return {
          ...state,
          haveNotification:payload,
        }
      case SET_NOTIFICATION_FAILED:
        return {
          ...state,
          haveNotification:payload,
        }
      default :
        return state;
    }
}


export default reducer;