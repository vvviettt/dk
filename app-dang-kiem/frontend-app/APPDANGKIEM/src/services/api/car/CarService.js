import instance from "../../https/apiConfig";

const ENDPOINTS = {
    CUSTOMERCAR:'/customer/cars',
    CHECKREGISTRY:'/customer/cars/check-registry',
    CHECKERROR:'/customer/cars/check-error-by-id',
    GETERROR:'/customer/cars/errors-by-id',
    GETCATEGORY:'/customer/cars/category',
    GETCARTYPE:'/customer/cars/types',
    GETERRORBYCAR:'/customer/cars/errors-by-license-plate',
    ADDNEWCAR:'/customer/cars',
    GETCARINFOR:'/customer/cars/info',
    GETFLIE:'/customer/registries/profile',
    GETLIMITVEHICLES:'/customer/registries/limit-vehicles'
};

const get_list_cus_car = () => {
    return  instance.get(ENDPOINTS.CUSTOMERCAR)
}

const check_registry = (carId) =>{
    return instance.get(ENDPOINTS.CHECKREGISTRY+'/'+carId)
}

const check_error = (carId) =>{
    return instance.get(ENDPOINTS.CHECKERROR+'/'+carId)
}

const get_err_car = (carId) =>{
    return instance.get(ENDPOINTS.GETERROR+'/'+carId)
}

const get_category = () =>{
    return instance.get(ENDPOINTS.GETCATEGORY)
}

const get_car_type = ({categoryId}) =>{
    return instance.get(ENDPOINTS.GETCARTYPE,{params:{
        categoryId
    }})
}

const get_err_by_licensePlate = ({licensePlate}) =>{
    return instance.get(ENDPOINTS.GETERRORBYCAR,{params:{
        licensePlate
    }})
}

const add_new_car = (data) =>{
    const formData = new FormData()
    formData.append('license_plate', data.license_plate)
    formData.append('manufacture_at', data.manufacture_at)
    formData.append('type', data.type)
    for (let i = 0 ; i< data.photos.length;i++){
        formData.append('photos', data.photos[i])
    }
    return instance.post(ENDPOINTS.ADDNEWCAR,formData,{
        headers: {
            'Content-Type': `multipart/form-data`,
        }
    })
}

const get_carInfor_byId = (carId) =>{
    return instance.get(ENDPOINTS.GETCARINFOR,{params:{
        carId:carId
    }})
}

const delete_car_byId = (carId) => {
    return instance.delete(ENDPOINTS.GETCARINFOR,{params:{
        carId:carId
    }})
}

const update_car_byId = (carId,data) =>{
    const formData = new FormData()
    formData.append('license_plate', data.license_plate)
    formData.append('manufacture_at', data.manufacture_at)
    formData.append('type', data.type)
    for (let i = 0 ; i< data.delete.length;i++){
        if (i==0) formData.append('delete[0]', data.delete[i]) 
        else
        formData.append('delete', data.delete[i])
    }
    for (let i = 0 ; i< data.photos.length;i++){
        formData.append('photos', data.photos[i])
    }
    return instance.put(ENDPOINTS.GETCARINFOR,formData,{
        headers: {
            'Content-Type': `multipart/form-data`,
        },
        params:{
            carId:carId
        }
    })
}

const get_list_file = () =>{
    return instance.get(ENDPOINTS.GETFLIE)
}
const get_limit_vehicles_by_date = (date) =>{
    return instance.get(ENDPOINTS.GETLIMITVEHICLES,{params:{
        date:date
    }})
}

const CarService ={
    get_list_cus_car,
    check_registry,
    check_error,
    get_err_car,
    get_category,
    get_car_type,
    get_err_by_licensePlate,
    add_new_car,
    get_carInfor_byId,
    delete_car_byId,
    update_car_byId,
    get_list_file,
    get_limit_vehicles_by_date
}

export default CarService;