import { StyleSheet, Text, View ,ScrollView,Image, TouchableOpacity, TextInput} from 'react-native'
import React from 'react'
import Header from '../../component/layout/Header'
import Loading from '../../component/shared/Loading'
import Footer from '../../component/layout/Footer'
import {useToast} from 'react-native-toast-notifications'
import NavigationService from '../../services/NavigationService'
import WToast from '../../element/WToast'
import moment from 'moment';
import ManagerService from '../../services/api/manager/ManagerService'
import {converLicensePlate, convertDate, convertPrice, formatDate} from '../../services/utils'
import {Font} from '../../assets/styles/Index'
import {useSelector} from 'react-redux'
import WModal from '../../element/WModal'
import FeeContent from '../../component/shared/FeeContent'
import DateTimePicker from '../../component/shared/DateTimePicker'
import WSelectDate from '../../element/WSelectDate'
import DateTimePickerModal from 'react-native-modal-datetime-picker';
import CarService from '../../services/api/car/CarService'
import {convertAlert} from '../../component/shared/ConvertAlert'
import { CommonActions } from '@react-navigation/native';
import MapService from '../../services/api/MapService.js/MapService'

const RegistrationUpdateScreen = ({navigation,route}) => {
    const {registryId,addressMap,origins} = route.params
    const demo = new Date()
    const now = moment(demo).format('YYYY-MM-DD')
    const {user,token} = useSelector(state => state.auth)
    const [data,setData] = React.useState()
    const [isLoading,setIsLoading] = React.useState(true)
    const [distance,setDistance] = React.useState()
    const [visible,setVisible] = React.useState(false);
    const [loadingSubmit,setLoadingSubmit] = React.useState(false)
    const [dateCalender,setDateCalender] = React.useState()
    const [check,setCheck] = React.useState(false)
    const [feeList,setFeeList] = React.useState()
    const [showCalender,setShowCalender] = React.useState(false)
    const [carId,setCarId] = React.useState()
    const [address,setAddress] = React.useState()
    const [time,setTime] = React.useState('')
    const [timePickerShow,setTimePickerShow] = React.useState(false)
    const [date,setDate] = React.useState()
    const [haveError,setHaveError] = React.useState()
    const toast = useToast();
    const closeModal = () =>{
        setVisible(false);
    }
    const hideDatePicker = () => {
        setShowCalender(false)
    };

    const handleConfirmTime = (time) => {
        setTimePickerShow(false)
        const timeConvert = new Date(time);
        let hour;
        let minute;
        if (timeConvert.getHours() < 10 ){
            hour = "0"+ timeConvert.getHours().toString();
        }else{
            hour =timeConvert.getHours().toString();
        }
        if (timeConvert.getMinutes() < 10 ){
            minute = "0"+ timeConvert.getMinutes().toString();
        }else{
            minute =timeConvert.getMinutes().toString();
        }
        if (hour && minute) setTime(hour+":"+minute)
        if (date != "") setDisabled(false)
    }
    const handleConfirm = (currentDate) => {
        hideDatePicker();
        if (moment(currentDate).format('YYYY-MM-DD') >= now){
            setDateCalender(moment(currentDate).format('YYYY-MM-DD'))
            setDate(formatDate(moment(currentDate).format('YYYY-MM-DD')))
            setDisabled(false)
        }else{
            convertAlert('Cảnh báo','Ngày bạn chọn không hợp lệ');
            setDate('')
            setDisabled(true)
        }
    };
    const onBlurDateInput = () =>{
        if (moment(convertDate(date)).isValid() && moment(convertDate(date)).format('YYYY-MM-DD') >= now){
            setDateCalender(moment(convertDate(date)).format('YYYY-MM-DD'))
        }else{
            convertAlert('Cảnh báo','Ngày bạn chọn không hợp lệ');
            setDate('')
        }
    }
    React.useEffect(()=>{
        if(token){
            setIsLoading(true);
            ManagerService.registration_infor(registryId)
            .then((res) =>{
                if (res.status==1){
                    setAddress(res.data.address)
                    if (res.data.address) setCheck(true)
                    setCarId(res.data.carId)
                    setDate(formatDate(res.data.date))
                    setData(res.data)
                    setDateCalender(res.data.date)
                    setFeeList(res.data.fee)
                    setTime(res.data.registry_time.slice(0,5))
                    setIsLoading(false);
                    CarService.check_error(res.data.carId)
                    .then((res)=>{
                        if (res.status == 1){
                            setHaveError(res.data.isValid)
                            setIsLoading(false);
                        }else throw new Error(res.message)
                    })
                }else throw new Error(res.message)
            })
            .catch((err) =>{
                convertAlert('Thông báo',err.message);
                setIsLoading(false);
            })
        }
    },[token])

    const handleUpdate = () =>{
        setLoadingSubmit(true)
        let data
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
            }
        }
        ManagerService.update_registration(registryId,data)
            .then((res) =>{
                if (res.status == 2 ){
                    toast.hideAll();
                    toast.show(
                        <WToast 
                            content={res.message} 
                            showTouch={false}
                            icon={require('../../assets/icons/SuccessIcon.png')}
                            iconStyle={{
                                width:24,
                                height:24,
                                marginRight:15,
                                marginTop:5
                            }}
                        />
                        ,{
                        type:'custom_type'
                    });
                    setLoadingSubmit(false)
                    closeModal()
                    navigation.dispatch(
                        CommonActions.reset({
                          index: 1,
                          routes: [
                            { name: 'BottomNavigation' },
                            {
                              name: 'Registration/List',
                            },
                          ],
                        })
                    )
                }else
                if (res.status==1){
                    toast.hideAll();
                    toast.show(
                        <WToast 
                            content={res.message} 
                            showTouch={false}
                            icon={require('../../assets/icons/SuccessIcon.png')}
                            iconStyle={{
                                width:24,
                                height:24,
                                marginRight:15,
                                marginTop:5
                            }}
                        />
                        ,{
                        type:'custom_type'
                    });
                    setLoadingSubmit(false)
                    closeModal()
                    navigation.dispatch(
                        CommonActions.reset({
                          index: 1,
                          routes: [
                            { name: 'BottomNavigation' },
                            {
                              name: 'Registration/List',
                            },
                          ],
                        })
                    )
                }else throw new Error(res.message)
            })
            .catch((err) =>{
                closeModal()
                convertAlert('Thông báo',err.message);
                setLoadingSubmit(false);
            })
    }

    React.useEffect(()=>{
        if (addressMap) {
            setAddress(addressMap)
            setIsLoading(true);
            MapService.get_distance(origins)
            .then(res => {
                setDistance(res.data.rows[0].elements[0])
                const data = {
                    carId : carId,
                    address : addressMap,
                    distance: res.data.rows[0].elements[0].distance.value / 1000,
                }
                ManagerService.get_cost_caculation(data)
                .then((res) =>{
                    setFeeList(res.data.fee)
                    console.log(res);
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
        navigation.navigate("Map",{address:address,registryId:registryId,date:date,carId:carId,nameScreen:"Registration/Update"})
    }

    return (
        <View style={{flex:1}}>
            <Header onGoBack={()=>navigation.goBack()} title='Chỉnh sửa đăng ký đăng kiểm'/>
            {
                isLoading ? (
                    <Loading />
                ):(
                    <>
                        <ScrollView style={styles.scroll_view}>
                            <View style={styles.session_top}>
                                <View style={styles.group}>
                                    <Text style={styles.group_title}>Xe đăng ký</Text>
                                    <Text style={styles.group_content}>{converLicensePlate(data?.license_plates)}</Text>
                                </View>
                                {/* <WSelectDate
                                    date={date}
                                    label='ngày đăng ký'
                                    select_style={styles.group}
                                    setDate={(date)=>setDate(date)}
                                    onPressIconCalender={()=>setShowCalender(true)}
                                    onBlur={()=>onBlurDateInput()}
                                /> */}
                                <View style={{flexDirection:'row',paddingVertical:10}}>
                                    <WSelectDate
                                        date={date}
                                        label='ngày đăng ký'
                                        select_style={styles.input_picker}
                                        setDate={(date)=>setDate(date)}
                                        onPressIconCalender={()=>setShowCalender(true)}
                                        onBlur={()=>onBlurDateInput()}
                                    />
                                    <View style={{width:15}}/>
                                    <View style={[styles.input_picker]}>
                                        <Text style={styles.group_title}>Giờ đăng ký</Text>
                                        <TouchableOpacity 
                                            style={styles.form_style}
                                            onPress={()=>{setTimePickerShow(true)}}
                                        >
                                            <Text style={[
                                                styles.group_content,
                                                [{
                                                    lineHeight:28,
                                                    color: time == '' ? "#757F8E" : "#2C3442"
                                                }]
                                            ]}>{time == '' ? "hh:mm" : time}</Text>
                                        </TouchableOpacity>
                                    </View>
                                </View>
                            </View>
                            <View style={styles.session_bottom}>
                                <View style={styles.group}>
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
                                            // <WTextInput 
                                            //     text={address}
                                            //     setText={(address)=>setAddress(address)}
                                            //     label='Địa chỉ nhận xe'
                                            //     group_style={styles.group}
                                            //     onBlur={handleBlurInput}
                                            // />
                                            <View style={[styles.text_input,styles.group]}>
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
                                        ):(
                                            <></>
                                        )
                                    }
                                    <FeeContent 
                                        title='Phí cấp giấy chứng nhận kiểm định'
                                        price={convertPrice(feeList?.license_fee) + " đ"}
                                    />
                                    <FeeContent 
                                        title='Phí đường bộ/tháng'
                                        price={convertPrice(feeList?.road_fee) + " đ"}
                                    />
                                </View>
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
                            buttonOkContent={'CẬP NHẬT'}
                            onClickButtonOk={()=>{
                                if (haveError) handleUpdate()
                                else setVisible(true)
                            }}
                            onClickButtonCancle={()=>navigation.goBack()}
                            disabled={loadingSubmit}
                            loading={loadingSubmit}
                            haveButtonCancel={true}
                            footer_style={{
                                backgroundColor:'#FFFFFF'
                            }}
                        />
                    </>
                )
            }
            <DateTimePicker 
                isVisible={showCalender} 
                setVisible={()=>setShowCalender(false)}  
                date={moment(dateCalender).format("YYYY-MM-DD")}
                setDate={(date)=>handleConfirm(date)}
            />
            <DateTimePickerModal
                mode="time"
                onCancel={()=>setTimePickerShow(false)}
                onConfirm={handleConfirmTime}
                isVisible={timePickerShow}
                date={new Date()}
                is24Hour={true}

            />
            <WModal 
                modalVisible={visible}
                closeModal={closeModal}
                handleConfirm={handleUpdate}
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
                            }}>Xe có lỗi vi phạm chưa được xử lý, bạn có chắc chắn cập nhập đăng ký đăng kiểm?</Text>
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

export default RegistrationUpdateScreen

const styles = StyleSheet.create({
    scroll_view:{
        flex:1,
        backgroundColor:'#FFFFFF',
    },
    session_top:{
        paddingHorizontal:15,
    },
    input_picker:{
        flex:1,
    },
    group:{
        marginTop:30,
    },
    text_input:{
        marginTop:20
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
    group_title:{
        fontFamily:Font.BeVietnamProSemiBold,
        color:'#394B6A',
        fontSize:11,
        lineHeight:16,
        fontWeight:'600',
        textTransform:'uppercase'
    },
    group_content:{
        paddingVertical:10,
        borderBottomColor:'#E1E9F6',
        borderBottomWidth:1,
        borderStyle:'solid',
        fontFamily:Font.BeVietnamProSemiBold,
        fontSize:14,
        fontWeight:'600',
        color:'#2C3442'
    },
    session_bottom:{
        paddingHorizontal:15
    },
    address:{
    },
    check:{
        flexDirection:'row',
        alignItems:'center',
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
        borderColor:'#AAB0AA',
        backgroundColor:'#AAB0AA'
    },
    check_box_text:{
        fontFamily:Font.BeVietnamProRegular,
        fontSize:14,
        fontWeight:'400',
        lineHeight:20,
        color:'#2C3442'
    },
    fee_group:{
        width:'100%',
        marginTop:25,
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