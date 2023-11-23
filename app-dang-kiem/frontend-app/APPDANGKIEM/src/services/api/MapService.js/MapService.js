import axios from "axios";
import config from "../../../config";

const ENDPOINTS = {
    GETDISTANCEMATRIX : 'https://rsapi.goong.io/DistanceMatrix',
    AUTOCOMPLETE:'https://rsapi.goong.io/Place/AutoComplete',
    GETNAMEBYPOSITION:'https://rsapi.goong.io/Geocode',
    GETPLACEBYID:'https://rsapi.goong.io/Place/Detail',
    GETIMAGEDISTANCE:'https://rsapi.goong.io/staticmap/route'
};

const auto_complete = (text) =>{
    return axios.get(ENDPOINTS.AUTOCOMPLETE,{
        params:{
            api_key:config.API_KEY,
            input:text,
            location:'16.05638957685639,108.20458492264152'
        }
    })
}

const get_place_by_id = (id) =>{
    return axios.get(ENDPOINTS.GETPLACEBYID,{
        params:{
            api_key:config.API_KEY,
            place_id:id
        }
    })
}

const get_place_by_name = (name) =>{
    return axios.get(ENDPOINTS.GETNAMEBYPOSITION,{
        params:{
            api_key:config.API_KEY,
            address:name
        }
    })
}

const get_distance = (origins) => {
    return axios.get(ENDPOINTS.GETDISTANCEMATRIX,{
        params:{
            api_key:config.API_KEY,
            origins:origins,
            destinations:"16.0119633,108.1837542",
            vehicle:"car"
        }
    })
}

const get_image_distance = (origin) => {
    return axios.get(ENDPOINTS.GETIMAGEDISTANCE,{
        params:{
            api_key:config.API_KEY,
            origin:origin,
            destination:"16.0119633,108.1837542",
            vehicle:"car"
        }
    })
}

const MapService ={
    auto_complete,
    get_place_by_id,
    get_place_by_name,
    get_distance,
    get_image_distance
}

export default MapService;