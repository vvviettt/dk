import { StyleSheet, Text, View,ScrollView,Image,TouchableOpacity ,TextInput} from 'react-native'
import React, {useEffect} from 'react'
import Header from '../../component/layout/Header'
import Footer from '../../component/layout/Footer'
import {Font} from '../../assets/styles/Index'
import {convertDate, convertPrice} from '../../services/utils'
import FeeContent from '../../component/shared/FeeContent'
import {useSelector} from 'react-redux'
import ManagerService from '../../services/api/manager/ManagerService'
import Loading from '../../component/shared/Loading'
import WModal from '../../element/WModal'
import CarService from '../../services/api/car/CarService'
import {convertAlert} from '../../component/shared/ConvertAlert'
import MapService from '../../services/api/MapService.js/MapService'

const RegistrationAddDetailScreen = ({navigation,route}) => {
    const {licensePlates,date,carId,time,addressMap,origins} = route.params
    const {token} = useSelector(state => state.auth)
    const [address,setAddress] = React.useState()
    const [distance,setDistance] = React.useState()
    const [visible,setVisible] = React.useState(false);
    const [feeList,setFeeList] = React.useState()
    const [check,setCheck] = React.useState(false)
    const [loadingSubmit,setLoadingSubmit] = React.useState(false)
    const [isLoading,setIsLoading] = React.useState(true)
    const [haveError,setHaveError] = React.useState()
    const closeModal = () =>{
        setVisible(false);
    }
    useEffect(()=>{
        if(token){
            setIsLoading(true);
            const data = {
                carId : carId,
            }
            ManagerService.get_cost_caculation(data)
            .then((res) =>{
                if (res.status == 1){
                    setFeeList(res.data.fee)
                    CarService.check_error(carId)
                    .then((res)=>{
                        if (res.status == 1){
                            setHaveError(res.data.isValid)
                            setIsLoading(false);
                        }else throw new Error(res.message)
                    })
                    .catch((err) =>{
                        convertAlert('Thông báo',err.message);
                        setIsLoading(false);
                    })
                }else throw new Error(res.message)
            })
            .catch((err) =>{
                convertAlert('Thông báo',err.message);
                setIsLoading(false);
            })
        }
    },[token])

    const handleBlurInput = () =>{
        setIsLoading(true);
        const data = {
            carId : carId,
            address : address
        }
        ManagerService.get_cost_caculation(data)
            .then((res) =>{
                setFeeList(res.data.fee)
                setIsLoading(false);
            })
            .catch((err) =>{
                convertAlert("Thông báo",err.message)
                setFeeList({
                    tariff:feeList.tariff,
                    license_fee:feeList.license_fee,
                    serviceCost:0
                })
                setIsLoading(false);
            })
    }

    const handleSubmit = ()=>{
        setLoadingSubmit(true);
        let data
        if (check == true && (!address || address == "")){
            convertAlert("Thông báo","Vui lòng chọn địa chỉ")
            setLoadingSubmit(false)
        }
        else{
            if (check == true){
                data = {
                    carId: carId,
                    address : address,
                    date:convertDate(date),
                    tariff:feeList.tariff,
                    license_fee:feeList.license_fee,
                    road_fee:feeList.road_fee,
                    serviceCost:feeList.serviceCost,
                    registry_time:time,
                }
            }else{
                data = {
                    carId: carId,
                    date:convertDate(date),
                    tariff:feeList.tariff,
                    license_fee:feeList.license_fee,
                    road_fee:feeList.road_fee,
                    registry_time:time,
                }
            }
            ManagerService.register_for_registration(data)
                .then((res) =>{
                    // console.log(res.data);
                    if (res.status == 2 ){
                        setLoadingSubmit(false)
                        closeModal()
                        navigation.navigate('Success',{isValid:haveError,licensePlates})
                    }else {
                        if (res.status == 1 ){
                            setLoadingSubmit(false)
                            closeModal()
                            navigation.navigate('Success',{isValid:haveError,licensePlates})
                        }else throw new Error(res.message)
                    }
                })
                .catch((err) =>{
                    convertAlert('Thông báo',err.message);
                    setLoadingSubmit(false)
                    closeModal()
                })
        }
        
    }

    React.useEffect(()=>{
        if (addressMap) {
            setAddress(addressMap)
            setIsLoading(true);
            MapService.get_distance(origins)
            .then(res => {
                // console.log(res.data.rows[0]);
                setDistance(res.data.rows[0].elements[0])
                const data = {
                    carId : carId,
                    address : addressMap,
                    distance: res.data.rows[0].elements[0].distance.value / 1000,
                }
                ManagerService.get_cost_caculation(data)
                .then((res) =>{
                    setFeeList(res.data.fee)
                    setIsLoading(false);
                })
                .catch((err) =>{
                    convertAlert("Thông báo",err.message)
                    setFeeList({
                        tariff:feeList.tariff,
                        license_fee:feeList.license_fee,
                        serviceCost:0
                    })
                    setIsLoading(false);
                })
            })
        }
        return ()=>{}
    },[addressMap])

    const showMap = () => {
        navigation.navigate("Map",{address:address,licensePlates:licensePlates,time:time,date:date,carId:carId,nameScreen:"Registration/Add/Detail"})
    }
    return (
        <View style={{flex:1}}>
            <Header onGoBack={()=>navigation.goBack()} title='Chi tiết phí đăng kiểm DỰ KIẾN'/>
            {
                isLoading ?
                (
                    <Loading />
                ):(
                    <>
                    <ScrollView style={styles.scroll_view}>
                        <View style={styles.input_group}>
                            <TouchableOpacity style={styles.check} onPress={()=>setCheck(!check)}>
                                <View style={[styles.check_box,{
                                    backgroundColor: check ? '#06B217' : '#FFFFFF'
                                }]}>
                                    <Image
                                        source={require('../../assets/icons/CheckSmallIcon.png')}
                                        style={{
                                            width:14,
                                            height:10.5
                                        }}
                                    />
                                </View>
                                <Text style={styles.check_box_text}>Nhờ nhân viên đi đăng kiểm hộ</Text>
                            </TouchableOpacity>
                            {
                                check ? 
                                (
                                    <View style={[styles.text_input]}>
                                        <Text style={styles.label_style}>Địa chỉ nhận xe</Text>
                                        <TextInput
                                            value={address}
                                            // onChangeText={(address) =>{setAddress(address)}}
                                            style={styles.input_style}
                                            placeholder="Nhập"
                                            placeholderTextColor={'#757F8E'}
                                            // onBlur={handleBlurInput}
                                            
                                        />
                                        <TouchableOpacity style={styles.icon_position} onPress={()=>showMap()}>
                                            <Image 
                                                source={require('../../assets/icons/mapIcon.png')}
                                                style={styles.icon_style}
                                            />
                                        </TouchableOpacity>
                                    </View>

                                ):
                                (
                                    <></>
                                )
                            }
                        </View>
                        <View style={styles.fee_group}>
                            <FeeContent 
                                title='Phí kiểm định xe cơ giới'
                                price={convertPrice(feeList?.tariff) + " đ"}
                            />
                            {
                                check ? 
                                (
                                    <FeeContent 
                                        title='Phí đăng kiểm hộ'
                                        price={
                                            convertPrice(feeList?.serviceCost) + " đ"
                                            + (distance ? "/" + distance?.distance.text: "")
                                        }
                                    />
                                ):
                                (
                                    <></>
                                )
                            }
                            <FeeContent 
                                title='Phí cấp giấy chứng nhận kiểm định'
                                price={`${convertPrice(feeList?.license_fee)} đ`}
                            />
                            <FeeContent 
                                title='Phí đường bộ/tháng'
                                price={`${convertPrice(feeList?.road_fee)} đ`}
                            />
                        </View>
                        <View style={{paddingHorizontal:15}}>
                            <View style={styles.note}>
                                <Text style={styles.note_title}>Lưu ý:</Text>
                                <Text style={styles.note_content}>Tổng cộng dự kiến chỉ là số liệu tham khảo. 
                                    Số tiền thực tế có thể sẽ thay đổi tùy thuộc vào thời gian thanh toán Phí bảo trì đường bộ
                                </Text>
                            </View>
                        </View>
                    </ScrollView>
                    <Footer 
                        buttonOkContent={'Gửi'}
                        onClickButtonOk={()=>{
                            if (haveError == true) handleSubmit()
                            else setVisible(true)
                        }}
                        footer_style={styles.footer_style}
                        haveButtonCancel={true}
                        onClickButtonCancle={()=>navigation.goBack()}
                        loading={loadingSubmit}
                        disabled={loadingSubmit}
                    />
                    </>
                )
            }
            <WModal 
                modalVisible={visible}
                closeModal={closeModal}
                handleConfirm={handleSubmit}
                component={(
                    <>
                        <View style={{
                            backgroundColor:'#FFFFFF',
                            borderRadius:6,
                            padding:22
                        }}>
                            <Text style={{
                                fontFamily:Font.BeVietnamProRegular,
                                fontSize:14,
                                fontWeight:'400',
                                lineHeight:22,
                                textAlign:'center',
                                color:'#2C3442',
                            }}>Xe có lỗi vi phạm chưa được xử lý, bạn có chắc chắn đăng ký đăng kiểm?</Text>
                            <TouchableOpacity onPress={()=>{
                                navigation.navigate('Infringes/Car/Detail',{carId})
                                setVisible(false)
                            }}>
                                <Text style={styles.list_error}>Xem danh sách lỗi</Text>
                            </TouchableOpacity>
                        </View>
                    </>
                )}
            />
        </View>
    )
}

export default RegistrationAddDetailScreen

const styles = StyleSheet.create({
    scroll_view:{
        flex:1,
        backgroundColor:'#FFFFFF',
    },
    text_input:{
        marginTop:20
    },
    input_group:{
        width:'100%',
        paddingHorizontal:15,
        borderBottomColor:'#E1E9F6',
        borderBottomWidth:5,
        borderStyle:'solid',
        paddingBottom:30
    },
    check:{
        flexDirection:'row',
        alignItems:'center',
        marginTop:20,
    },
    check_box:{
        alignItems:'center',
        width:22,
        height:22,
        justifyContent:'center',
        marginRight:12,
        borderRadius:2,
        borderWidth:1,
        borderStyle:'solid',
        borderColor:'#06B217'
    },
    check_box_text:{
        fontFamily:Font.BeVietnamProRegular,
        fontSize:14,
        fontWeight:'400',
        lineHeight:20,
        color:'#2C3442'
    },
    label_style:{
        fontFamily:Font.BeVietnamProSemiBold,
        color:'#394B6A',
        fontSize:11,
        lineHeight:16,
        fontWeight:'600',
        textTransform:'uppercase',
        opacity:0.7,
    },
    input_style:{
        paddingVertical:10,
        borderBottomColor:'#E1E9F6',
        borderBottomWidth:1,
        borderStyle:'solid',
        fontFamily:Font.BeVietnamProSemiBold,
        fontSize:14,
        fontWeight:'600',
        color:'#2C3442',
        backgroundColor:"#FFFFFF",
        paddingRight:40 
    }, 
    icon_position:{
        position:'absolute',
        bottom:5,
        right:-10,
        padding:10
    },
    icon_style:{
        width:14,
        height:14,
    },
    fee_group:{
        width:'100%',
        paddingHorizontal:15,
        marginTop:25,
    },
    fee_group_select:{
        flexDirection:'row',
        justifyContent:'space-between',
        alignItems:'center',
        borderBottomColor:'#E1E9F6',
        borderBottomWidth:1,
        borderStyle:'solid',
        paddingBottom:25,
    },
    select_box:{
        flexDirection:'row',
        width:'68%',
        alignItems:'center'
    },
    select_box_style:{
        fontFamily:Font.BeVietnamProRegular,
        fontWeight:'400',
        fontSize:13,
        lineHeight:18,
        color:'#2C3442',
        marginRight:5
    },
    fee_content:{
        fontFamily:Font.BeVietnamProRegular,
        fontWeight:'400',
        fontSize:13,
        lineHeight:18,
        color:'#2C3442',
        width:'28%',
        textAlign:'right'
    },
    total:{
        width:'100%',
        flexDirection:'row',
        justifyContent:'space-between',
        alignItems:'center',
        marginTop:20,
    },
    total_title:{
        fontFamily:Font.BeVietnamProSemiBold,
        fontSize:14,
        lineHeight:20,
        fontWeight:'600',
        textTransform:'uppercase',
        color:'#2C3442'
    },
    total_content:{
        fontFamily:Font.BeVietnamProBold,
        fontSize:14,
        lineHeight:20,
        fontWeight:'700',
        color:'#BF0000'
    },
    note:{
        marginTop:10,
        width:'100%',
        padding:15,
        backgroundColor:'#EFF2F8',
        borderRadius:6
    },
    note_title:{
        fontFamily:Font.BeVietnamProBold,
        fontSize:13,
        lineHeight:20,
        fontWeight:'700',
        color:'#BF0000',
        fontStyle:'italic',
    },
    note_content:{
        fontFamily:Font.BeVietnamProRegular,
        fontSize:13,
        lineHeight:20,
        fontWeight:'400',
        color:'#2C3442',
        fontStyle:'italic',
    },
    footer_style:{
        backgroundColor:'#FFFFFF'
    },
    input_text_style:{
        textAlign:'left',
        marginHorizontal:0,
        fontFamily:Font.BeVietnamProSemiBold,
        color:'#394B6A',
        fontSize:14,
        lineHeight:22,
        fontWeight:'600',
    },
    dropdownStyle:{
        borderRadius:6,
    },
    rowStyle:{
        paddingHorizontal:30
    },
    rowTextStyle:{
        textAlign:'left',
        marginHorizontal:0,
        fontFamily:Font.BeVietnamProSemiBold,
        color:'#394B6A',
        fontSize:14,
        lineHeight:22,
        fontWeight:'600',
    },
    selectedRowTextStyle:{
        color:'#BF0000'
    },
    form_style:{
        width:'100%',
        backgroundColor:'#FFFFFF',
        paddingHorizontal:0,
        height:'auto',
    },
    list_error:{
        fontFamily:Font.BeVietnamProSemiBold,
        fontWeight:'600',
        fontSize:10,
        lineHeight:22,
        color:'#3C61EA',
        textTransform:'uppercase',
        textDecorationLine:'underline',
        textAlign:'center'
    },
})