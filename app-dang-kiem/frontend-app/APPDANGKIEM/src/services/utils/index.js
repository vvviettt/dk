

const formatPhone = (phone)=>{
    return phone ? phone.replace(phone.substr(3, 4),"****") :""
}

const convertPhone = (phone)=>{
    return phone? phone.replace(phone.substr(0,1),"+84") :""
}

const formatDate = (date)=>{
    return date ? date.split("-").reverse().join("/") : ""
}

const convertDate = (date)=>{
    return date ? date.split("/").reverse().join("-") : ""
}

const converLicensePlate = (license_plate) =>{
    if (license_plate){
        if (isNaN(license_plate[3]))
        return license_plate ? (license_plate.slice(0,4) + ' - ' +license_plate.slice(4,license_plate.length)):''
        else 
        return license_plate ? (license_plate.slice(0,3) + ' - ' +license_plate.slice(3,license_plate.length)):''
    }else return ''
}

const reConvertLicensePlate = (license_plate) => {
    if (license_plate){
        if (isNaN(license_plate[3]))
        return license_plate ? (license_plate.slice(0,4)  +license_plate.slice(7,license_plate.length)):''
        else
        return license_plate ? (license_plate.slice(0,3)  +license_plate.slice(6,license_plate.length)):''
    }else return ''
}

const convertPrice= (price)=>{
    if(price){
    const arr = [];
    const priceSTR= price.toString();
    for (let index = priceSTR.length; index >0; index -= 3) {
      index - 3 >0 ?arr.push(priceSTR.slice(index - 3,index )) :arr.push(priceSTR.slice(0,index )) ;
    }
    arr.reverse();
    return arr.join(".");
    }
    return "0";
}

const formatDateBuy = (date)=>{
    if(date){
        let arr = date.split(" ").reverse();
        arr[1] = formatDate(arr[1].toString());
        
        return arr.join(" ");
    }
    return "";
}

export {
    formatPhone,
    convertPhone,
    convertPrice,
    formatDate,
    formatDateBuy,
    convertDate,
    converLicensePlate,
    reConvertLicensePlate
}