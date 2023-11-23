import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import config from "../../config";
import NavigationService from "../NavigationService";

const instance = axios.create({
  baseURL: `${config.API_BASE_URL}/api`
});

const handleSuccessResponse = (response) =>{
    // console.log('data:',response.data);
    return response.data;
}

const handleErrorResponse = async (err) => {
    try {
      const originalConfig = err.config;
      if (originalConfig.url !== "/employee/auth/login" && err.response) {
        if (err.response.status === 401 && !originalConfig._retry) {
          originalConfig._retry = true;
          try {
            const rs = await instance.post("/employee/auth/refresh-token", {
              token: await AsyncStorage.getItem('refresh_token'),
            });
            if (rs.status == 0){
              NavigationService.reset('Auth')
              // console.log(rs);
              throw new Error(rs.message)
            }else{
              await AsyncStorage.setItem("access_token", rs.data.access_token)
              setHeaderConfigAxios(rs.data.access_token)
              return instance({...originalConfig,headers:{
                Authorization:"Bearer " + rs.data.access_token
              }});
            }
          } catch (_error) {
            return Promise.reject(_error);
          }
        }
      }
      return Promise.reject(err.response.data)
    } catch (e) {
      return Promise.reject(e)
    }
};


export const setHeaderConfigAxios = (token) => {
    if(token) {
      instance.defaults.headers.common["Authorization"] = token
        ? "Bearer " + token
        : "";
    }else {
      delete instance.defaults.headers.common["Authorization"];
    }
  };
  
instance.interceptors.response.use(handleSuccessResponse,handleErrorResponse);
  
export default instance;