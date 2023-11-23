import { CHANGE_PROFILE, CHANGE_PROFILE_FAILED, CHANGE_PROFILE_SUCCESS, CHECK_PHONE, 
  CHECK_PHONE_FAILED, 
  CHECK_PHONE_SUCCESS, 
  FACEBOOK_LOGIN, 
  GET_PROFILE, 
  GOOGLE_LOGIN, 
  LOGIN, 
  LOGIN_FAILED, 
  LOGIN_SUCCESS, 
  LOGOUT, 
  RESET_PASSWORD, 
  RESET_PASSWORD_FAILED, 
  RESET_PASSWORD_SUCCESS, 
  SET_NOTIFICATION, 
  SET_NOTIFICATION_FAILED, 
  SIGN_UP_FAILED, 
  SIGN_UP_SUCCESS, 
  UPLOAD_IMAGE} from "./actionTypes";
import NavigationService from "../../services/NavigationService"
import authService from '../../services/api/auth/AuthService';
import { setHeaderConfigAxios } from "../../services/https/apiConfig";
import AsyncStorage from "@react-native-async-storage/async-storage";
import {convertAlert} from "../../component/shared/ConvertAlert";


export const logout = () => (dispatch) => {
  dispatch({
    type: LOGOUT
  })
  NavigationService.reset('Auth')
}

export const clearToken = () => (dispatch) => {
  dispatch({
    type: LOGOUT
  })
}

export const haveNotification = () => async (dispatch) => {
  dispatch({
    type: SET_NOTIFICATION,
    payload:true, 
  })
};

export const notHaveNotification= () => async (dispatch) => {
  dispatch({
    type: SET_NOTIFICATION_FAILED,
    payload:false, 
  })
};

export const getProfile = () => async (dispatch) => {
  try {
    const payload = await authService.getProfile();
    const resData = payload.data;
    if (payload.status == 1){
      dispatch({
        type: LOGOUT
      })
    }
    else{
      throw new Error(payload.message)
    }
  } catch (error) {
      convertAlert('Thông báo',error.message)
      dispatch({
        type: LOGOUT
      })
      NavigationService.reset('Auth')
  }
};

export const changeProfile = (data) => async (dispatch) => {
  dispatch({
    type: CHANGE_PROFILE
  })
  try {
    const payload = await authService.updateProfile(data)
    if (payload.status == 1){
        dispatch({
          type: CHANGE_PROFILE_SUCCESS,
          payload:{
            phoneNumber:data.phone,
            email:data.email,
            avatar:payload.data.avatar,
          }
        })
        NavigationService.navigate('Profile')
    }
    else{
      throw new Error(payload.message)
    }
  } catch (error) {
      convertAlert('Thông báo',error.message)
      dispatch({
        type: CHANGE_PROFILE_FAILED,
        payload: error
      })
  }
};

export const login = (data) => async (dispatch) => {
    dispatch({
      type: LOGIN
    })
    try {
      const payload = await authService.login(data)
      const resData = payload.data;
      if (payload.status == 1){
          setHeaderConfigAxios(resData.access_token);
          await AsyncStorage.setItem("access_token", resData.access_token);
          await AsyncStorage.setItem("refresh_token", resData.refreshToken);
          dispatch({
            type: LOGIN_SUCCESS,
            payload:resData
          })
            NavigationService.reset('BottomNavigation')
      }
      else{
        throw new Error(payload.message)
      }
    } catch (error) {
        convertAlert('Thông báo',error.message)
        dispatch({
          type: LOGIN_FAILED,
          payload: "Đăng nhập thất bại"
        })
    }
  };

  export const getNotification = () => async (dispatch) => {
    dispatch({
      type: SET_NOTIFICATION,
      payload:false
    })
    try {
      const payload = await authService.getNotification()
      const resData = payload.data;
      if (payload.status == 1){
        if (resData.status == 1){
          dispatch({
            type: SET_NOTIFICATION,
            payload:true
          })
        }else{
          dispatch({
            type: SET_NOTIFICATION,
            payload:false
          })
        }
      }
      else{
        throw new Error(payload.message)
      }
    } catch (error) {
        dispatch({
          type: SET_NOTIFICATION_FAILED,
          payload: false
        })
    }
  };
  
export const resetPassword = (data) => async (dispatch) => {
  dispatch({
    type: RESET_PASSWORD
  })
  try {
    const payload = await authService.resetPassword(data)
    if (payload.status == 1){
        dispatch({
          type: RESET_PASSWORD_SUCCESS
        })
        NavigationService.reset('Login');
    }
    else{
      throw new Error(payload.message)
    }
  } catch (error) {
    alert(error)
      dispatch({
        type: RESET_PASSWORD_FAILED,
        payload: error
      })
  }
};

export const changePassword = (data) => async (dispatch) => {
  dispatch({
    type: RESET_PASSWORD
  })
  try {
    const payload = await authService.changePassword(data)
    if (payload.status == 1){
        dispatch({
          type: RESET_PASSWORD_SUCCESS
        })
        NavigationService.reset('Login');
    }
    else{
      throw new Error(payload.message)
    }
  } catch (error) {
    alert(error)
      dispatch({
        type: RESET_PASSWORD_FAILED,
        payload: error
      })
  }
};

export const signUp = (data) => async (dispatch) => {
  try {
    const payload = await authService.signUp(data)
    if (payload.status == 1){
        dispatch({
          type: SIGN_UP_SUCCESS
        })
        NavigationService.reset('Login');
    }
    else{
      throw new Error(payload.message)
    }
  } catch (error) {
    alert(error)
      dispatch({
        type: SIGN_UP_FAILED,
        payload: error
      })
  }
};