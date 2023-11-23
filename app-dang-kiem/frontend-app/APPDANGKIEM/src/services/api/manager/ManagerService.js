import instance from "../../https/apiConfig";

const ENDPOINTS = {
    LISTREGISTRIES:'/customer/registries/list-registries',
    COSTCALCULATION:'/customer/registries/cost-calculation',
    REGISTERREGISTRATION:'/customer/registries',
    REGISTRATIONINFOR:'/customer/registries/info',
    GETHISTORYREGISTER:'/customer/registries/list-registries-history'
};

const get_list_regis = ({limit = 1000, page = 1}) => {
    return  instance.get(ENDPOINTS.LISTREGISTRIES, {params:{
        limit,
        page,
    }})
}

const get_cost_caculation = (data) =>{
    return instance.post(ENDPOINTS.COSTCALCULATION,data)
}

const register_for_registration = (data)=>{
    return instance.post(ENDPOINTS.REGISTERREGISTRATION,data)
}

const registration_infor = (registryId) =>{
    return instance.get(ENDPOINTS.REGISTRATIONINFOR,{params:{
        registryId:registryId
    }})
}

const del_registration = (registryId) =>{
    return instance.delete(ENDPOINTS.REGISTRATIONINFOR,{params:{
        registryId:registryId
    }})
}

const update_registration = (registryId,data) =>{
    return instance.put(ENDPOINTS.REGISTRATIONINFOR,data,{params:{
        registryId:registryId
    }})
}

const get_hitory_register = (licensePlate) => {
    return instance.get(ENDPOINTS.GETHISTORYREGISTER,{params:{
        licensePlate:licensePlate
    }})
}

const ManagerService ={
    get_list_regis,
    get_cost_caculation,
    register_for_registration,
    registration_infor,
    del_registration,
    update_registration,
    get_hitory_register
}

export default ManagerService;