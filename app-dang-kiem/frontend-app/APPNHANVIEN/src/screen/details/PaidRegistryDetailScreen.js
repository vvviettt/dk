import { StyleSheet, Text, View ,ScrollView,Image,TouchableOpacity, Linking} from 'react-native'
import React from 'react'
import Header from '../../component/layout/Header'
import config from '../../config'
import {Font} from '../../assets/styles/Index'
import {useSelector} from 'react-redux'
import ManagerService from '../../services/api/manager/ManagerService'
import {convertAlert} from '../../component/shared/ConvertAlert'
import {converLicensePlate, formatDate} from '../../services/utils'
import Loading from '../../component/shared/Loading'
import WModal from '../../element/WModal'
import moment from 'moment'
import DateTimePicker from '../../component/shared/DateTimePicker'
import CheckNullData from '../../component/shared/CheckNullData'
import { CommonActions } from '@react-navigation/native';

const PaidRegistryDetailScreen = ({navigation,route}) => {
    const {regisId} = route.params
    const {token} = useSelector(state => state.auth)
    const [data,setData] = React.useState()
    const [isLoading,setIsLoading] = React.useState(true)
    const [showCalender,setShowCalender] = React.useState(false)
    const [date,setDate] = React.useState()
    const [visible,setVisible] = React.useState(false)
    const [type,setType] = React.useState(0)
    const [visibleStepTwo,setVisibleStepTwo] = React.useState(false)
    const [loadingSubmit,setLoadingSubmit] = React.useState(false)
    const [planDate,setPlanDate] = React.useState()
    const [costPlanDate,setCostPlanDate] = React.useState()
    const [calenderType,setCalenderType] = React.useState()
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
            id : regisId,
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
                                day : data.date
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


    React.useEffect(()=>{
        if (token){
            setIsLoading(true);
            ManagerService.get_register_detail(regisId)
            .then((res) =>{
                if (res.status==1){
                    setData(res.data.registry)
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
    },[token])

    return (
        <View style={{flex:1 ,backgroundColor:'#FFFFFF'}}>
            <Header onGoBack={()=>navigation.goBack()} title="DS đăng kiểm đã thu tiền" />
            {
                isLoading?
                (
                    <Loading />
                ):(
                    <ScrollView style={styles.scroll_view}>
                        <CheckNullData data={data}>
                            <View style={styles.information}>
                                <View style={styles.information_general}>
                                    <Text style={styles.information_general_title}>Thông tin chung</Text>
                                    <Text style={styles.information_general_licensePlates}>{converLicensePlate(data?.license_plate)}</Text>
                                </View>
                                <View style={styles.information_address}>
                                    {
                                        data?.carImages ? (
                                            <Image 
                                                source={{uri:config.API_BASE_URL+'/'+data?.carImages}}
                                                style={{
                                                    width:60,
                                                    height:60,
                                                    resizeMode:'cover',
                                                    borderRadius:6,
                                                }}
                                            />
                                        ):(
                                            <View style={{
                                                width:60,
                                                height:60,
                                                alignItems:'center',
                                                justifyContent:'center',
                                                borderRadius:6,
                                                borderWidth:1,
                                                borderColor:'#EFF2F8'
                                            }}>
                                                <Text style={{
                                                    textAlign:'center',
                                                    fontFamily:Font.BeVietnamProRegular,
                                                    fontSize:13
                                                }}>Chưa thêm ảnh</Text>
                                            </View>
                                        )
                                    }
                                    {
                                        data?.address ? (
                                            <View style={styles.information_address_group}>
                                                <Text style={styles.information_address_content}>Nhờ đăng kiểm hộ</Text>
                                                <Text style={[styles.information_address_content]}>Địa chỉ: {data?.address}</Text>
                                            </View>
                                        ):(
                                            <></>
                                        )
                                    }
                                </View>
                            </View>
                            <View style={[styles.group,{paddingHorizontal:15}]}>
                                <Text style={styles.group_title}>Ngày đăng ký đăng kiểm</Text>
                                <Text style={{...styles.group_content,borderBottomWidth:0,paddingBottom:0}}>{formatDate(data?.date)}</Text>
                            </View>
                            <View style={styles.line}/>
                            <View>
                                <View style={styles.information_group}>
                                    <TouchableOpacity 
                                        onPress={()=>{
                                            const url=`tel://${data?.owner_phone}`
                                            Linking.openURL(url)
                                        }}
                                    >
                                        <View style={styles.information_owner}>
                                            <Text style={styles.information_owner_title}>Chủ xe</Text>
                                            <View style={styles.information_owner_group}>
                                                {
                                                    data?.userImage ? (
                                                        <Image 
                                                            source={{uri:config.API_BASE_URL+'/'+data?.userImage}}
                                                            style={{
                                                                width:44,
                                                                height:44,
                                                                resizeMode:'cover',
                                                                borderRadius:6,
                                                            }}
                                                        />
                                                    ):(
                                                        <View style={{
                                                            width:44,
                                                            height:44,
                                                            alignItems:'center',
                                                            justifyContent:'center',
                                                            borderRadius:6,
                                                            borderWidth:1,
                                                            borderColor:'#EFF2F8'
                                                        }}>
                                                            <Text style={{
                                                                textAlign:'center',
                                                                fontFamily:Font.BeVietnamProRegular,
                                                                fontSize:9
                                                            }}>Chưa thêm ảnh</Text>
                                                        </View>
                                                    )
                                                }
                                                <View style={{
                                                    marginLeft:10,
                                                }}>
                                                    <Text style={styles.information_owner_name}>{data?.owner_name}</Text>
                                                    <View style={styles.information_owner_group}>
                                                        <Image 
                                                            source={require('../../assets/icons/PhoneCallIcon.png')}
                                                            style={{
                                                                width:14,
                                                                height:14,
                                                            }}
                                                        />
                                                        <Text style={styles.information_owner_phone}>{data?.owner_phone}</Text>
                                                    </View>
                                                </View>
                                            </View>
                                        </View>
                                    </TouchableOpacity>
                                    <View>
                                        <TouchableOpacity onPress={()=>{
                                            setType(1)
                                            setVisible(true)
                                        }} style={styles.regis_btn_success}>
                                            <Text style={[styles.regis_btn_text,{
                                                color:'#FFFFFF'
                                            }]}>Đạt KĐ</Text>
                                        </TouchableOpacity>
                                        <TouchableOpacity onPress={()=>{
                                            setType(0)
                                            setVisible(true)
                                        }} style={styles.regis_btn_unsuccess}>
                                            <Text style={[styles.regis_btn_text,{
                                                color:'#FFFFFF'
                                            }]}>Không đạt KĐ</Text>
                                        </TouchableOpacity>
                                    </View>
                                </View>
                                <View style={styles.information_car}>
                                    <Text  style={styles.information_car_title}>Thông tin xe</Text>
                                    <View style={styles.group}>
                                        <Text style={styles.group_title}>Chủng loại phương tiện</Text>
                                        <Text style={styles.group_content}>{data?.category_name}</Text>
                                    </View>
                                    <View style={styles.group}>
                                        <Text style={styles.group_title}>Loại phương tiện</Text>
                                        <Text style={styles.group_content}>{data?.car_type}</Text>
                                    </View>
                                    <View style={styles.group}>
                                        <Text style={styles.group_title}>Năm sản xuất</Text>
                                        <Text style={styles.group_content}>{data?.manufacture_at}</Text>
                                    </View>
                                </View>
                            </View>
                        </CheckNullData>
                    </ScrollView>   
                )
            }
            <DateTimePicker 
                isVisible={showCalender} 
                setVisible={()=>setShowCalender(false)}  
                date={moment(date).format("YYYY-MM-DD")}
                setDate={(date)=>{
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
                                <Text style={{fontFamily:Font.BeVietnamProBold}}> {converLicensePlate(data?.license_plate)}</Text> đăng kiểm ngày 
                                <Text style={{fontFamily:Font.BeVietnamProBold}}> {formatDate(data?.date)}</Text> 
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
    )
}

export default PaidRegistryDetailScreen

const styles = StyleSheet.create({
    scroll_view:{
        flex:1,
    },
    information:{
        paddingHorizontal:15,
        flexDirection:"row",
        alignItems:'center',
        paddingTop:30
    },
    information_general:{
        flex:1,
        marginRight:20,
    },
    information_group:{
        flexDirection:'row',
        justifyContent:'space-between',
        alignItems:'center',
        paddingHorizontal:15,
        paddingBottom:20,
        borderBottomColor:'#E1E9F6',
        borderBottomWidth:1,
    },
    information_general_title:{
        fontFamily:Font.BeVietnamProBold,
        color:'#2C3442',
        fontSize:16,
        lineHeight:24,
        fontWeight:'700',
        marginBottom:10,
    },
    information_general_licensePlates:{
        fontFamily:Font.BeVietnamProBold,
        color:'#2C3442',
        fontSize:14,
        lineHeight:20,
        fontWeight:'700',
    },
    information_address:{
        flex:1,
        flexDirection:"row-reverse",
        alignItems:'center',
    },
    information_address_group:{
        flex:1,
        marginRight:5,
    },
    information_address_content:{
        fontFamily:Font.BeVietnamProRegular,
        fontSize:11,
        fontStyle:'italic',
        lineHeight:18,
        color:'#394B6A',
        opacity:0.8,
    },
    line:{
        marginLeft:30,
        marginRight:70,
        paddingLeft:30,
        paddingRight:70,
        height:1,
        backgroundColor:'#E1E9F6',
        marginVertical:25
    },
    information_owner:{
    },
    information_owner_title:{
        fontFamily:Font.BeVietnamProRegular,
        fontSize:12,
        lineHeight:18,
        color:'#394B6A',
        opacity:0.8,
        marginBottom:6,
    },
    information_owner_name:{
        fontFamily:Font.BeVietnamProMedium,
        fontWeight:'500',
        fontSize:14,
        lineHeight:20,
        color:'#2E333D',
        marginBottom:6,
    },
    information_owner_group:{
        flexDirection:'row',
        alignItems:'center'
    },
    information_owner_phone:{
        fontFamily:Font.BeVietnamProRegular,
        fontWeight:'400',
        fontSize:13,
        lineHeight:20,
        color:'#2E333D',
        marginLeft:6,
    },
    information_car:{
        paddingHorizontal:15,
        paddingTop:20,
    },
    information_car_title:{
        fontFamily:Font.BeVietnamProBold,
        color:'#2C3442',
        fontSize:16,
        lineHeight:24,
        fontWeight:'700',
    },
    group:{
        marginTop:15,
    },
    group_title:{
        fontFamily:Font.BeVietnamProRegular,
        color:'#2C3442',
        fontSize:13,
        lineHeight:18,
        fontWeight:'400',
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
    regis_btn_success:{
        paddingHorizontal:18,
        paddingVertical:4,
        backgroundColor:'#0F6AA9',
        borderRadius:3,
        alignItems:'center',
        marginBottom:10,
    },
    regis_btn_text:{
        fontFamily:Font.BeVietnamProBold,
        fontSize:12,
        lineHeight:22,
    },
    regis_btn_unsuccess:{
        paddingHorizontal:18,
        paddingVertical:4,
        backgroundColor:'#8D91A1',
        borderRadius:3,
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