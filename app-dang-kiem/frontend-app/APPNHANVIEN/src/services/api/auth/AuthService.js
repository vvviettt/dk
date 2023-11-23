import instance from "../../https/apiConfig";

const ENDPOINTS = {
    LOGIN: '/employee/auth/login',
    RESET_PASSWORD : '/customer/verifyAndResetPassword',
    EXIST_PHONENUMBER : '/customer/checkPhoneNumberExists',
    SIGN_UP : '/customer/registerApp',
    GET_PROFILE : '/customer/getInfoOfUser',
    UPLOAD_IMAGE: '/customer/updateAvatarOfUser',
    UPDATE_PROFILE: '/employee/auth/user',
    CHANGE_PASSWORD : '/employee/auth/password',
    GETNOTIFICATION:'/employee/notification/check'
};

const login = (data) => {
    return  instance.post(ENDPOINTS.LOGIN, data)
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

const updateProfile = (data) => {
    const formData = new FormData()
    if (data.photos) formData.append('photos', data.photos)
    formData.append('phone', data.phone)
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
    return  instance.patch(ENDPOINTS.CHANGE_PASSWORD, data)
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
    getNotification,
    updateNotification,
}

export default authService;