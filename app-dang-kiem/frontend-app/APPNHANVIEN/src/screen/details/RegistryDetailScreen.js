import { StyleSheet, Text, View ,ScrollView,Image,TouchableOpacity, Linking,TextInput} from 'react-native'
import React from 'react'
import Header from '../../component/layout/Header'
import config from '../../config'
import {Font} from '../../assets/styles/Index'
import {useSelector} from 'react-redux'
import ManagerService from '../../services/api/manager/ManagerService'
import {convertAlert} from '../../component/shared/ConvertAlert'
import {converLicensePlate, convertNonPrice, convertPrice, formatDate} from '../../services/utils'
import Loading from '../../component/shared/Loading'
import WModal from '../../element/WModal'
import CheckNullData from '../../component/shared/CheckNullData'
import { CommonActions } from '@react-navigation/native';

const RegistryDetailScreen = ({navigation,route}) => {
    const {regisId} = route.params
    const [data,setData] = React.useState()
    const [isLoading,setIsLoading] = React.useState(true)
    const [visible,setVisible] = React.useState(false);
    const [loadingSubmit,setLoadingSubmit] = React.useState(false)
    const {token} = useSelector(state => state.auth)
    const [visibleStepTwo,setVisibleStepTwo] = React.useState(false)
    const [regisFee,setRegisFee] = React.useState()
    const [registryFee,setRegistryFee] = React.useState()
    const [anotherFee,setAnotherFee] = React.useState()
    const closeModal = () =>{
        setVisible(false);
    }
    const closeModalStepTwo = () => {
        setVisibleStepTwo(false)
    }

    const openStepTwo = () => {
        setVisible(false)
        setVisibleStepTwo(true)
    }

    const handleSubmit = () =>{
        setLoadingSubmit(true)
        const dataSubmit = {
            id:regisId
        }
        ManagerService.handle_payment(dataSubmit)
        .then((res)=>{
            if (res.status==1){
                navigation.dispatch(
                    CommonActions.reset({
                      index: 1,
                      routes: [
                        { name: 'BottomNavigation' },
                        {
                            name: 'PaidRegistrationList',
                            params: { 
                                day : data?.date
                            },
                        },
                      ],
                    })
                )
                setVisible(false)
                setLoadingSubmit(false)
            }else throw new Error(res.message)
        })
        .catch((err)=>{
            setVisible(false)
            setLoadingSubmit(false)
            convertAlert('Thông báo',err.message)
        })
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
            <Header onGoBack={()=>navigation.goBack()} title="Chi tiết Đăng ký đăng kiểm" />
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
                                    <TouchableOpacity onPress={()=>setVisible(true)} style={styles.regis_btn_success}>
                                        <Text style={[styles.regis_btn_text,{
                                            color:'#FFFFFF'
                                        }]}>Đã thu tiền</Text>
                                    </TouchableOpacity>
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
                                <View style={styles.emloyee}>
                                    <Text style={styles.emloyee_title}>Thông tin đăng kiểm hộ</Text>
                                    {
                                        data?.staff_id ? (
                                            <>
                                                <View style={styles.group}>
                                                    <Text style={styles.group_title}>Nhân viên nhận xe</Text>
                                                    <Text style={styles.group_content}>{data?.staff_name}</Text>
                                                </View>
                                                <View style={styles.group}>
                                                    <Text style={styles.group_title}>Ngày sinh</Text>
                                                    <Text style={styles.group_content}>{data?.date_birth}</Text>
                                                </View>
                                                <View style={styles.group}>
                                                    <Text style={styles.group_title}>CMND số</Text>
                                                    <Text style={styles.group_content}>{data?.id_card}</Text>
                                                </View>
                                                <View style={styles.group}>
                                                    <Text style={styles.group_title}>Số điện thoại</Text>
                                                    <Text style={styles.group_content}>{data?.phone_number}</Text>
                                                </View>
                                                <View style={styles.group}>
                                                    <Text style={styles.group_title}>Thời gian nhận xe</Text>
                                                    <Text style={styles.group_content}>{data?.car_delivery_time}</Text>
                                                </View>
                                            </>
                                        ):(
                                            <></>
                                        )
                                    }
                                </View>
                            </View>
                        </CheckNullData>
                    </ScrollView>   
                )
            }
            <WModal 
                modalVisible={visible}
                closeModal={closeModal}
                handleConfirm={openStepTwo}
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
                                Bạn có chắc muốn xác nhận thanh toán phí và lệ phí đăng kiểm cho xe có biển kiểm soát 
                                <Text style={{fontFamily:Font.BeVietnamProBold}}> {converLicensePlate(data?.license_plate)}</Text> đăng kiểm ngày 
                                <Text style={{fontFamily:Font.BeVietnamProBold}}> {formatDate(data?.date)}</Text> không?
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
                                <Text style={styles.modal_title}>Thu phí </Text>
                                <View style={styles.modal_select}>
                                    <Text style={styles.modal_select_title}>Phí đăng kiểm</Text>
                                    <TextInput
                                        value={regisFee}
                                        keyboardType="numeric"
                                        onChangeText={
                                            text=>{text !="" ? 
                                                setRegisFee(convertPrice(convertNonPrice(text))): setRegisFee("")}
                                        }
                                        style ={styles.modal_select_input}
                                    />
                                </View>
                                <View style={styles.modal_select}>
                                    <Text style={styles.modal_select_title}>Lệ phí đăng kiểm</Text>
                                    <TextInput
                                        value={registryFee}
                                        keyboardType="numeric"
                                        onChangeText={
                                            text=>{text !="" ? 
                                                setRegistryFee(convertPrice(convertNonPrice(text))): setRegistryFee("")}
                                        }
                                        style ={styles.modal_select_input}
                                    />
                                </View>  
                                <View style={styles.modal_select}>
                                    <Text style={styles.modal_select_title}>Phí khác</Text>
                                    <TextInput
                                        value={anotherFee}
                                        keyboardType="numeric"
                                        onChangeText={
                                            text=>{text !="" ? 
                                                setAnotherFee(convertPrice(convertNonPrice(text))): setAnotherFee("")}
                                        }
                                        style ={styles.modal_select_input}
                                    />
                                </View>         
                            </View>
                        </>
                    )}
                />
        </View>
    )
}

export default RegistryDetailScreen

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
    },
    regis_btn_text:{
        fontFamily:Font.BeVietnamProBold,
        fontSize:12,
        lineHeight:22,
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
    },
    emloyee:{
        marginTop:20,
        paddingHorizontal:15,
    },
    emloyee_title:{
        fontFamily:Font.BeVietnamProBold,
        color:'#2C3442',
        fontSize:16,
        lineHeight:24,
        fontWeight:'700',
    },
})