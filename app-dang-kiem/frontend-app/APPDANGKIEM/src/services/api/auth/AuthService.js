import instance from "../../https/apiConfig";

const ENDPOINTS = {
    LOGIN: '/customer/auth/login',
    LOGOUT:'/customer/auth/logout',
    RESETPROFILE:'/customer/auth/user',
    RESET_PASSWORD : '/customer/verifyAndResetPassword',
    EXIST_PHONENUMBER : '/customer/checkPhoneNumberExists',
    SIGN_UP : '/customer/registerApp',
    GET_PROFILE : '/customer/auth/user',
    UPLOAD_IMAGE: '/customer/updateAvatarOfUser',
    UPDATE_PROFILE: '/customer/auth/user',
    CHANGE_PASSWORD : '/customer/changePassword',
    GETNOTIFICATION:'/customer/notifications/check'
};

const login = (data) => {
    return  instance.post(ENDPOINTS.LOGIN, data)
}

const logout = (data) => {
    return  instance.post(ENDPOINTS.LOGOUT, data)
}

const reset_profile = () => {
    return  instance.post(ENDPOINTS.RESETPROFILE)
}

const uploadImage = (image) => {
    const formData = new FormData()
    formData.append('avatar_image', image.avatar_image)
    return  instance.post(ENDPOINTS.UPLOAD_IMAGE,
        formData
    ,{
        headers: {
          'accept': 'application/json',
          'Content-Type': `multipart/form-data`,
        }
    })
}

const getNotificationStatus = () => {
    return instance.get(ENDPOINTS.GET_PROFILE)
}

const updateProfile = (data) => {
    const formData = new FormData()
    if (data.photos) formData.append('photos', data.photos)
    formData.append('name', data.name)
    formData.append('email', data.email)
    formData.append('removed', data.removed)
    return  instance.patch(ENDPOINTS.UPDATE_PROFILE,
        formData
    ,{
        headers: {
          'accept': 'application/json',
          'Content-Type': `multipart/form-data`,
        }
    })
}

const getProfile = () => {
    return instance.get(ENDPOINTS.GET_PROFILE)
}

const resetPassword = (data) => {
    return  instance.post(ENDPOINTS.RESET_PASSWORD, data)
}


const changePassword = (data) => {
    return  instance.post(ENDPOINTS.CHANGE_PASSWORD, data)
}

const existPhoneNumber =(data)=>{
    return  instance.post(ENDPOINTS.EXIST_PHONENUMBER, data)
}

const signUp =(data)=>{
    return  instance.post(ENDPOINTS.SIGN_UP, data)
}

const getNotification =()=>{
    return  instance.get(ENDPOINTS.GETNOTIFICATION)
}

const updateNotification = () => {
    return  instance.put(ENDPOINTS.GETNOTIFICATION)
}

const authService ={
    login,
    resetPassword,
    existPhoneNumber,
    signUp,
    getProfile,
    uploadImage,
    updateProfile,
    changePassword,
    logout,
    reset_profile,
    getNotificationStatus,
    getNotification,
    updateNotification
}

export default authService;