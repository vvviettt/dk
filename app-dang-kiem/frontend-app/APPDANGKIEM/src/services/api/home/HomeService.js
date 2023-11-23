import instance from "../../https/apiConfig";

const ENDPOINTS = {
    LISTREGISTER : '/customer/registries/list-registries-future',
    LISTREGISTERBYID:'/customer/registries/list-registries-date',
    GETHOTLINE:'/customer/registries/hot-line'
};

const get_list_register = () =>{
    return instance.get(ENDPOINTS.LISTREGISTER)
}

const get_hotline = () =>{
    return instance.get(ENDPOINTS.GETHOTLINE)
}

const get_list_register_by_day = (date) =>{
    return instance.get(ENDPOINTS.LISTREGISTERBYID,{params:{
        date:date
    }})
}

const HomeService ={
    get_list_register,
    get_list_register_by_day,
    get_hotline
}

export default HomeService;