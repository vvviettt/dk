import { StyleSheet, Text, View,ScrollView , TouchableOpacity} from 'react-native'
import React from 'react'
import Header from '../../component/layout/Header'
import Footer from '../../component/layout/Footer'
import {Font} from '../../assets/styles/Index'
import WSelectDate from '../../element/WSelectDate'
import moment from 'moment';
import RuleContent from '../../component/shared/RuleContent'
import DateTimePicker from '../../component/shared/DateTimePicker'
import { converLicensePlate, convertDate, formatDate} from '../../services/utils'
import DateTimePickerModal from 'react-native-modal-datetime-picker';
import SelectDropdown from 'react-native-select-dropdown'
import {useSelector} from 'react-redux'
import CarService from '../../services/api/car/CarService'
import Loading from '../../component/shared/Loading'
import {convertAlert} from '../../component/shared/ConvertAlert'
import WModal from '../../element/WModal'

const RegistrationAdd = ({navigation,route}) => {

    const demo = new Date()
    const now = moment(demo).format('YYYY-MM-DD')
    const {carIndex,Id,license} = route.params
    const {token} = useSelector(state => state.auth)
    const [licensePlates,setLicensePlates] = React.useState(license)
    const [visible,setVisible] = React.useState(false);
    const [carId,setCarId] = React.useState(Id)
    const [car,setCar] = React.useState()
    const [file,setFile] = React.useState()
    const [date,setDate] = React.useState('')
    const [time,setTime] = React.useState('')
    const [timePickerShow,setTimePickerShow] = React.useState(false)
    const [dateCalender,setDateCalender] = React.useState()
    const [showCalender,setShowCalender] = React.useState(false)
    const [disabled,setDisabled] = React.useState(true)
    const [loadingSubmit,setLoadingSubmit] = React.useState(false)
    const [isLoading,setIsLoading] = React.useState(true)
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
            if (time != "") setDisabled(false)
        }else{
            convertAlert('Cảnh báo','Ngày bạn nhập không hợp lệ')
            setDate('')
            setDisabled(true)
        }
    };
    const onBlurDateInput = () =>{
        if (moment(convertDate(date)).isValid() && moment(convertDate(date)).format('YYYY-MM-DD') >= now){
            setDateCalender(moment(convertDate(date)).format('YYYY-MM-DD'))
            setDisabled(false)
        }else{
            convertAlert('Cảnh báo','Ngày bạn nhập không hợp lệ')
            setDate('')
            setDisabled(true)
        }
    }

    const handleContinue = () =>{
        setLoadingSubmit(true)
        CarService.check_registry(carId)
            .then((res) =>{
                if (res.data.isValid == true ) {
                    CarService.get_limit_vehicles_by_date(convertDate(date))
                        .then((res)=>{
                            if (res.data.amount_registries >= res.data.number_vehicles){
                                setLoadingSubmit(false)
                                setVisible(true)
                            }else{
                                setLoadingSubmit(false)
                                navigation.navigate('Registration/Add/Detail',{licensePlates,date,carId,time})
                            }
                        })
                        .catch((err) =>{
                            setLoadingSubmit(false)
                            convertAlert('Thông báo',err.message);
                        })
                }
                else{
                    throw new Error(res.message)
                }
            })
            .catch((err) =>{
                setLoadingSubmit(false)
                convertAlert('Thông báo',err.message);
        })
    }

    React.useEffect(() =>{
        if(token){
            setIsLoading(true);
            CarService.get_list_cus_car({})
            .then((res) =>{
                setCar(res.data.rows)
                setIsLoading(false);
                if (file != null) setIsLoading(false);
            })
            .catch((err) =>{
                setIsLoading(false);
                convertAlert('Thông báo',err.message);
            })
            CarService.get_list_file()
            .then((res) =>{
                setFile(res.data.profile)
                if (car != null) setIsLoading(false);
            })
            .catch((err) =>{
                setIsLoading(false);
                convertAlert('Thông báo',err.message);
            })
        }
    },[token])
    return (
        <View style={{flex:1}}>
            <Header onGoBack={()=>navigation.goBack()} title='Đăng ký đăng kiểm'/>
            {
                isLoading == true ?
                (
                    <Loading />
                ):
                (
                    <>
                        <ScrollView style={styles.scroll_view}>
                            <View style={styles.input_group}>
                                <View style={[styles.select_input,styles.input_style]}>
                                    <Text style={styles.label}>Xe đăng ký</Text>
                                    <SelectDropdown
                                        data={car}
                                        defaultValueByIndex={carIndex}
                                        onSelect={(selectedItem, index) => {
                                            setCarId(selectedItem.id)
                                            setLicensePlates(selectedItem.license_plates)
                                        }}
                                        buttonTextAfterSelection={(selectedItem, index) => {
                                            return converLicensePlate(selectedItem.license_plates)
                                        }}
                                        rowTextForSelection={(item, index) => {
                                            return converLicensePlate(item.license_plates)
                                        }}
                                        buttonStyle={styles.form_style}
                                        buttonTextStyle={styles.input_text_style}
                                        defaultButtonText="-Chọn-"
                                        dropdownIconPosition='right'
                                        dropdownStyle={styles.dropdownStyle}
                                        rowStyle={styles.rowStyle}
                                        rowTextStyle={styles.rowTextStyle}
                                        selectedRowTextStyle={styles.selectedRowTextStyle}
                                    />
                                </View>
                                <View style={[styles.input_style,{flexDirection:'row'}]}>
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
                                        <Text style={styles.label}>Giờ đăng ký</Text>
                                        <TouchableOpacity 
                                            style={styles.form_style}
                                            onPress={()=>{setTimePickerShow(true)}}
                                        >
                                            <Text style={[
                                                styles.input_text_style,
                                                [{
                                                    lineHeight:28,
                                                    color: time == '' ? "#757F8E" : "#2C3442"
                                                }]
                                            ]}>{time == '' ? "hh:mm" : time}</Text>
                                        </TouchableOpacity>
                                    </View>
                                </View>
                            </View>
                            <View style={styles.rule_group}>
                                <Text style={{
                                    fontFamily:Font.BeVietnamProBold,
                                    color:'#2C3442',
                                    fontSize:14,
                                    lineHeight:22,
                                    fontWeight:'700',
                                    marginBottom:15
                                }}>Khi đem xe đi đăng kiểm cần có:</Text>
                                {
                                    file?.map((e)=>(
                                        <RuleContent content={e.name} key={e.id}/>
                                    ))
                                }
                            </View>
                        </ScrollView>
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
                        <Footer 
                            buttonOkContent={'Tiếp tục'}
                            onClickButtonOk={handleContinue}
                            footer_style={styles.footer_style}
                            haveButtonCancel={true}
                            onClickButtonCancle={()=>navigation.goBack()}
                            disabled={disabled}
                            loading={loadingSubmit}
                        />
                    </>
                )
            }
            <WModal 
                modalVisible={visible}
                closeModal={closeModal}
                handleConfirm={()=>{
                    setVisible(false)
                    navigation.navigate('Registration/Add/Detail',{licensePlates,date,carId})
                }}
                // modalContent='Xe có lỗi vi phạm chưa được xử lý, bạn có chắc chắn đăng ký đăng kiểm?'
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
                            }}>Khung giờ này hiện đang có nhiều đăng ký cùng lúc và có thể sẽ cần đợi xử lý lâu hơn</Text>
                        </View>
                    </>
                )}
            />
        </View>
    )
}

export default RegistrationAdd

const styles = StyleSheet.create({
    scroll_view:{
        flex:1,
        backgroundColor:'#FFFFFF',
    },
    input_group:{
        width:'100%',
        paddingHorizontal:15,
        borderBottomColor:'#E1E9F6',
        borderBottomWidth:5,
        borderStyle:'solid',
        paddingBottom:30
    },
    input_style:{
        marginTop:30
    },  
    input_picker:{
        flex:1,
    },
    rule_group:{
        marginTop:25,
        width:'100%',
        paddingHorizontal:15
    },
    footer_style:{
        backgroundColor:'#FFFFFF'
    },
    select_input:{
        width:'100%'
    },
    label:{
        fontFamily:Font.BeVietnamProSemiBold,
        color:'#394B6A',
        fontSize:11,
        lineHeight:16,
        fontWeight:'600',
        textTransform:'uppercase'
    },
    form_style:{
        width:'100%',
        backgroundColor:'#FFFFFF',
        paddingHorizontal:0,
        height:'auto',
        paddingVertical:10,
        borderBottomColor:'#E1E9F6',
        borderBottomWidth:1,
        borderStyle:'solid',
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
    }
})