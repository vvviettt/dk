import { StyleSheet, Text, View, Image,TouchableOpacity, ScrollView } from 'react-native'
import React from 'react'
import Header from '../../component/layout/Header'
import DateTimePicker from '../../component/shared/DateTimePicker'
import moment from 'moment';
import {converLicensePlate, formatDate} from '../../services/utils';
import {Font} from '../../assets/styles/Index';
import {useSelector} from 'react-redux';
import Loading from '../../component/shared/Loading';
import {convertAlert} from '../../component/shared/ConvertAlert';
import ManagerService from '../../services/api/manager/ManagerService';
import RegisForRegistrationBox from '../../component/shared/RegisForRegistrationBox';
import WModal from '../../element/WModal';
import {Searchbar} from 'react-native-paper';
import NavigationService from '../../services/NavigationService';
import CheckNullData from '../../component/shared/CheckNullData';
import { CommonActions } from '@react-navigation/native';

const PaidRegistrationListScreen = ({navigation,route}) => {
    const datedemo = new Date()
    const {day} = route.params 
    const now = moment(datedemo).format('YYYY-MM-DD')
    const [showCalender,setShowCalender] = React.useState(false)
    const [date,setDate] = React.useState(day ? day : now)
    const [isLoading,setIsLoading] = React.useState(true)
    const [visible,setVisible] = React.useState(false);
    const [data,setData] = React.useState()
    const [select,setSelect] = React.useState()
    const {user,token} = useSelector(state => state.auth)
    const [type,setType] = React.useState(0)
    const [filteredDataSource,setFilteredDataSource] = React.useState()
    const [text,setText] = React.useState('')
    const [visibleStepTwo,setVisibleStepTwo] = React.useState(false)
    const [planDate,setPlanDate] = React.useState()
    const [costPlanDate,setCostPlanDate] = React.useState()
    const [calenderType,setCalenderType] = React.useState()
    const [loadingSubmit,setLoadingSubmit] = React.useState(false)

    const openDateSearch = () => {
        setCalenderType(0)
        setShowCalender(true)
    }

    const onpenDatePickerPlanDate = () => {
        setCalenderType(1)
        setShowCalender(true)
    }

    const onpenDatePickerCostPlanDate = () => {
        setCalenderType(2)
        setShowCalender(true)
    }

    const closeModal = () =>{
        setVisible(false);
    }
    const handleSubmit = () =>{
        setLoadingSubmit(true)
        const dataSubmit ={
            id : select.id,
            type : type ,
            plan_date : planDate,
            cost_plan_date : costPlanDate
        }
        // console.log("data submit",dataSubmit);
        ManagerService.handle_complete(dataSubmit)
        .then((res) =>{
            if (res.status==1){
                setLoadingSubmit(false)
                navigation.dispatch(
                    CommonActions.reset({
                      index: 1,
                      routes: [
                        { name: 'BottomNavigation' },
                        {
                            name: 'CompleteRegistryList',
                            params: { 
                                day : date
                            },
                        },
                      ],
                    })
                )
                setVisible(false)
                setVisibleStepTwo(false)
            }else{
                throw new Error(res.message)
            }
        })
        .catch((err) =>{
            convertAlert('Thông báo',err.message);
            setLoadingSubmit(false)
            setVisible(false)
            setVisibleStepTwo(false)
        })
    }

    const closeModalStepTwo = () => {
        setVisibleStepTwo(false)
    }

    const openStepTwo = () => {
        setVisible(false)
        setVisibleStepTwo(true)
    }

    const searchFilterFunction = (text) => {
        // Check if searched text is not blank
        if (text != '') {
            const newData = data.filter(function (item) {
                const itemName = item.owner_name
                ? item.owner_name.toUpperCase()
                : ''.toUpperCase();
                const itemData = item.license_plate
                ? item.license_plate.toUpperCase()
                : ''.toUpperCase();
                const textData = text.toUpperCase();
                return itemData.indexOf(textData) > -1 || itemName.indexOf(textData) > -1 ;
            });
            setFilteredDataSource(newData);
            setText(text);
        } else {
          // Inserted text is blank
          // Update FilteredDataSource with masterDataSource
          setFilteredDataSource(data);
          setText(text);
        }
    };


    React.useEffect(()=>{
        if (token){
            setIsLoading(true)
            ManagerService.get_register_list_type(1,date)
            .then((res) =>{
                if (res.status==1){
                    setData(res.data.registries)
                    setFilteredDataSource(res.data.registries)
                    setIsLoading(false);
                }else{
                    throw new Error(res.message)
                }
            })
            .catch((err) =>{
                convertAlert('Thông báo',err.message);
                setIsLoading(false);
            })
        }
        return () => {}
    },[date])

    return (
        <View style={{flex:1 ,backgroundColor:'#FFFFFF'}}>
            <Header onGoBack={()=>navigation.goBack()} title="DS đăng kiểm đã thu tiền" />
            <View style={{flex:1}}>
                <TouchableOpacity onPress={openDateSearch} style={styles.calender}>
                    <Image
                        source={require('../../assets/icons/CalenderIcon.png')}
                        style={{
                            width:14,
                            height:14,
                        }}
                    />
                    <Text style={styles.calender_title}>{formatDate(date)}</Text>
                </TouchableOpacity>
                <Searchbar
                    placeholder="Nhập biển số xe/chủ xe"
                    onChangeText={searchFilterFunction}
                    value={text}
                />
                <ScrollView style={styles.scrollView}>
                    {
                        isLoading ? (
                            <Loading />
                        ):(
                            <CheckNullData data={filteredDataSource}>
                                {
                                    filteredDataSource?.length == 0 ? (
                                        <Text style={styles.dataNull}>Không có dữ liệu</Text>
                                    ):(
                                        <></>
                                    )
                                }
                                {
                                    filteredDataSource?.map((registry)=>(
                                        <RegisForRegistrationBox
                                            key={registry.id}
                                            data={registry}
                                            onPressSuccess={()=>{
                                                setSelect(registry)
                                                setType(1)
                                                setVisible(true)
                                            }}
                                            onPressUnsuccess={()=>{
                                                setSelect(registry)
                                                setType(0)
                                                setVisible(true)
                                            }}
                                            type={1}
                                            onPress={()=>NavigationService.navigate('PaidRegistryDetail',{regisId:registry.id})}
                                        />
                                    ))
                                }
                            </CheckNullData>
                        )
                    }
                </ScrollView>
                <DateTimePicker 
                    isVisible={showCalender} 
                    setVisible={()=>setShowCalender(false)}  
                    date={moment(date).format("YYYY-MM-DD")}
                    setDate={(date)=>{
                        if (calenderType == 0) setDate(date)
                        if (calenderType == 1) setPlanDate(date)
                        if (calenderType == 2) setCostPlanDate(date)
                    }}
                />
                <WModal 
                    modalVisible={visible}
                    closeModal={closeModal}
                    handleConfirm={type == 1 ? openStepTwo : handleSubmit }
                    okBtnText='Xác nhận'
                    loading={loadingSubmit}
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
                                }}>
                                    Xe có biển kiếm soát
                                    <Text style={{fontFamily:Font.BeVietnamProBold}}> {converLicensePlate(select?.license_plate)}</Text> đăng kiểm ngày 
                                    <Text style={{fontFamily:Font.BeVietnamProBold}}> {formatDate(select?.date)}</Text> 
                                    {
                                        type == 1 ? (
                                            <Text> đạt kiểm định</Text>
                                        ):(
                                            <Text> không đạt kiểm định</Text>
                                        )
                                    }
                                </Text>
                            </View>
                        </>
                    )}
                />
                <WModal 
                    modalVisible={visibleStepTwo}
                    closeModal={closeModalStepTwo}
                    handleConfirm={handleSubmit}
                    okBtnText='Lưu'
                    cancelBtnText='Hủy'
                    loading={loadingSubmit}
                    component={(
                        <>
                            <View style={{
                                backgroundColor:'#FFFFFF',
                                borderRadius:6,
                            }}>
                                <Text style={styles.modal_title}>Xác nhận Đạt</Text>
                                <View style={styles.modal_select}>
                                    <Text style={styles.modal_select_title}>Có hiệu lực đến</Text>
                                    <TouchableOpacity style={styles.modal_select_input} onPress={onpenDatePickerPlanDate}>
                                        <Text style={[styles.modal_select_text,planDate ? {opacity:1}:{}]}>{planDate ? formatDate(planDate) : 'dd/mm/yyyy'}</Text>
                                        <Image 
                                            source={require('../../assets/icons/CalenderIcon.png')}
                                            style={{
                                                width:14,
                                                height:14,
                                                resizeMode:'cover',
                                            }}
                                        />
                                    </TouchableOpacity>
                                </View>
                                <View style={styles.modal_select}>
                                    <Text style={styles.modal_select_title}>Ngày đóng phí bảo trì đường bộ</Text>
                                    <TouchableOpacity style={styles.modal_select_input} onPress={onpenDatePickerCostPlanDate}>
                                        <Text style={[styles.modal_select_text,costPlanDate ? {opacity:1}:{}]}>{costPlanDate ? formatDate(costPlanDate) : 'dd/mm/yyyy'}</Text>
                                        <Image 
                                            source={require('../../assets/icons/CalenderIcon.png')}
                                            style={{
                                                width:14,
                                                height:14,
                                                resizeMode:'cover',
                                            }}
                                        />
                                    </TouchableOpacity>
                                </View>          
                            </View>
                        </>
                    )}
                />
            </View>
        </View>
    )
}

export default PaidRegistrationListScreen

const styles = StyleSheet.create({
    calender:{
        alignItems:'center',
        flexDirection:'row',
        justifyContent:'center',
        paddingVertical:15,
        borderBottomColor:'#E1E9F6',
        borderBottomWidth:1,
    },
    calender_title:{
        fontFamily:Font.BeVietnamProRegular,
        fontSize:13,
        lineHeight:18,
        color:'#394B6A',
        marginLeft:10,
    },
    scrollView:{
        flex:1,
    },
    dataNull:{
        fontFamily:Font.BeVietnamProRegular,
        fontSize:18,
        lineHeight:28,
        color:'#394B6A',
        textAlign:'center',
        marginTop:30,
    },
    modal_title:{
        fontFamily:Font.BeVietnamProBold,
        fontSize:16,
        lineHeight:22,
        color:'#2C3442',
        padding:20,
        paddingBottom:15,
        borderBottomColor:'#E1E9F6',
        borderBottomWidth:1,
        marginBottom:20
    },
    modal_select:{
        paddingHorizontal:20,
        paddingBottom:20,
    },
    modal_select_title:{
        fontFamily:Font.BeVietnamProRegular,
        fontSize:13,
        lineHeight:20,
        color:'#5C5F62',
        marginBottom:6,
    },
    modal_select_input:{
        flexDirection:'row',
        paddingHorizontal:12,
        paddingVertical:6,
        alignItems:'center',
        justifyContent:'space-between',
        borderWidth:1,
        borderRadius:3,
        borderColor:'#E1E9F6'
    },
    modal_select_text:{
        fontFamily:Font.BeVietnamProRegular,
        fontSize:13,
        lineHeight:20,
        color:'#36383A',
        opacity: 0.5,
    }
})