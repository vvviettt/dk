import instance from "../../https/apiConfig";

const ENDPOINTS = {
    LISTNOTIFICATION:'/employee/notification/list',
    NOTIFICATIONDETAIL:'/employee/notification'
};

const get_notifications = ({limit = 10, page = 1}) => {
    return  instance.get(ENDPOINTS.LISTNOTIFICATION, {params:{
        limit,
        page,
    }})
}

const get_notifications_byId = (id) =>{
    return  instance.get(ENDPOINTS.NOTIFICATIONDETAIL, {params:{
        id:id
    }})
}

const NotificationService ={
    get_notifications,
    get_notifications_byId
}

export default NotificationService;