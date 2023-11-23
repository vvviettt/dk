import instance from "../../https/apiConfig";

const ENDPOINTS = {
    LISTREGISTERBYDATE:'/employee/registry',
    REGISTERDETAIL:'/employee/registry/info',
    REGISTRYLISTTYPE:'/employee/registry/list',
    CONFIRMPAYSUCCESS:'/employee/registry/pay',
    COMPLETEREGISTRY:'/employee/registry/complete',
    LISTREGISTERSDATE:'/employee/registry/list-registries-date',
};

const get_list_regis = (date) => {
    return  instance.get(ENDPOINTS.LISTREGISTERBYDATE, {params:{
        date:date
    }})
}

const get_register_detail = (regisId) => {
    return  instance.get(ENDPOINTS.REGISTERDETAIL, {params:{
        id:regisId
    }})
}

const get_register_list_type = (type,date) => {
    return  instance.get(ENDPOINTS.REGISTRYLISTTYPE, {params:{
        date:date,
        type:type,
    }})
}

const handle_payment = (data) => {
    return  instance.put(ENDPOINTS.CONFIRMPAYSUCCESS, data)
}

const handle_complete = (data) => {
    return  instance.put(ENDPOINTS.COMPLETEREGISTRY, data)
}

const get_list_date = () => {
    return  instance.get(ENDPOINTS.LISTREGISTERSDATE)
}

const ManagerService ={
    get_list_regis,
    get_register_detail,
    get_register_list_type,
    handle_payment,
    handle_complete,
    get_list_date
}

export default ManagerService;