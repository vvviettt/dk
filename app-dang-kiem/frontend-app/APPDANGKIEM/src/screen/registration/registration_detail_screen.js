import { StyleSheet, Text, View ,ScrollView,Image} from 'react-native'
import React from 'react'
import Header from '../../component/layout/Header'
import Loading from '../../component/shared/Loading'
import Footer from '../../component/layout/Footer'
import {useToast} from 'react-native-toast-notifications'
import NavigationService from '../../services/NavigationService'
import WToast from '../../element/WToast'
import ManagerService from '../../services/api/manager/ManagerService'
import {converLicensePlate, convertPrice, formatDate} from '../../services/utils'
import {Font} from '../../assets/styles/Index'
import {useSelector} from 'react-redux'
import WModal from '../../element/WModal'
import FeeContent from '../../component/shared/FeeContent'
import {convertAlert} from '../../component/shared/ConvertAlert'
import CheckNullData from '../../component/shared/CheckNullData'
import { CommonActions } from '@react-navigation/native';

const RegistrationDetailScreen = ({navigation,route}) => {
    const {registryId} = route.params
    const {user,token} = useSelector(state => state.auth)
    const [data,setData] = React.useState()
    const [isLoading,setIsLoading] = React.useState(true)
    const [visible,setVisible] = React.useState(false);
    const [loadingSubmit,setLoadingSubmit] = React.useState(false)
    const toast = useToast();
    const closeModal = () =>{
        setVisible(false);
    }
    console.log(data);
    const handleDelete = () =>{
        setLoadingSubmit(true);
        ManagerService.del_registration(registryId)
            .then((res) =>{
                if (res.status == 1 ){
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
                    );
                }else throw new Error(res.message)
            })
            .catch((err) =>{
                setVisible(false);
                convertAlert('Thông báo',err.message);
                setLoadingSubmit(false);
        })
    }
    React.useEffect(()=>{
        if(token){
            setIsLoading(true);
            ManagerService.registration_infor(registryId)
            .then((res) =>{
                if (res.status==1){
                    setData(res.data)
                    setIsLoading(false);
                }else throw new Error(res.message)
            })
            .catch((err) =>{
                convertAlert('Thông báo',err.message);
                setIsLoading(false);
            })
        }
    },[token])
    return (
        <View style={{flex:1}}>
            <Header onGoBack={()=>navigation.goBack()} title='Chi tiết đăng ký đăng kiểm'/>
            {
                isLoading ? (
                    <Loading />
                ):(
                    <>
                        <ScrollView style={styles.scroll_view}>
                            <CheckNullData data={data}>
                                <View style={styles.session_top}>
                                    <View style={styles.group}>
                                        <Text style={styles.group_title}>Xe đăng ký</Text>
                                        <Text style={styles.group_content}>{converLicensePlate(data?.license_plates)}</Text>
                                    </View>
                                    <View style={[styles.group,{flexDirection:"row"}]}>
                                        <View style={{flex:1}}>
                                            <Text style={styles.group_title}>Ngày đăng ký</Text>
                                            <Text style={styles.group_content}>{formatDate(data?.date)}</Text>
                                        </View>
                                        <View style={{width:15}}/>
                                        <View style={{flex:1}}>
                                            <Text style={styles.group_title}>Giờ đăng ký</Text>
                                            <Text style={styles.group_content}>{data?.registry_time.slice(0,5)}</Text>
                                        </View>
                                    </View>
                                </View>
                                <View style={styles.session_bottom}>
                                    {
                                        data?.address ? 
                                        (
                                            <View style={styles.address}>
                                                <View style={styles.check}>
                                                    <View style={styles.check_box}>
                                                        <Image
                                                            source={require('../../assets/icons/CheckSmallIcon.png')}
                                                            style={{
                                                                width:14,
                                                                height:10.5
                                                            }}
                                                        />
                                                    </View>
                                                    <Text style={styles.check_box_text}>Nhờ nhân viên đi đăng kiểm hộ</Text>
                                                </View>
                                                <View>
                                                <View style={styles.group}>
                                                    <Text style={styles.group_title}>Địa chỉ nhận xe</Text>
                                                    <Text style={styles.group_content}>{data?.address}</Text>
                                                </View>
                                                </View>
                                            </View>
                                        ):(
                                            <></>
                                        )
                                    }
                                    <View style={styles.fee_group}>
                                        <FeeContent 
                                            title='Phí kiểm định xe cơ giới'
                                            price={convertPrice(data?.fee.tariff) + " đ"}
                                        />
                                        {
                                            data?.address ? 
                                            (
                                                <FeeContent 
                                                    title='Phí đăng kiểm hộ'
                                                    price={convertPrice(data?.fee.serviceCost) + " đ"}
                                                />
                                            ):(
                                                <></>
                                            )
                                        }
                                        <FeeContent 
                                            title='Phí cấp giấy chứng nhận kiểm định'
                                            price={convertPrice(data?.fee.license_fee) + " đ"}
                                        />
                                        <FeeContent 
                                            title='Phí đường bộ/tháng'
                                            price={convertPrice(data?.fee.road_fee) + " đ"}
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
                                {
                                    data?.staff ? (
                                        <View>
                                            <Text style={styles.title}>Thông tin đăng kiểm hộ</Text>
                                            <View style={styles.group}>
                                                <Text style={styles.group_title}>Nhân viên nhận xe</Text>
                                                <Text style={styles.group_content}>{data?.staff?.name}</Text>
                                            </View>
                                            <View style={styles.group}>
                                                <Text style={styles.group_title}>Ngày sinh</Text>
                                                <Text style={styles.group_content}>{data?.staff?.date_birth}</Text>
                                            </View>
                                            <View style={styles.group}>
                                                <Text style={styles.group_title}>CMND số</Text>
                                                <Text style={styles.group_content}>{data?.staff?.id_card}</Text>
                                            </View>
                                            <View style={styles.group}>
                                                <Text style={styles.group_title}>Số điện thoại</Text>
                                                <Text style={styles.group_content}>{data?.staff?.phone_number}</Text>
                                            </View>
                                            <View style={styles.group}>
                                                <Text style={styles.group_title}>Thời gian nhận xe</Text>
                                                <Text style={styles.group_content}>{data?.staff?.car_delivery_time.slice(0,5)}</Text>
                                            </View>
                                        </View>
                                    ):(
                                        <></>
                                    )
                                }
                            </CheckNullData>
                        </ScrollView>
                        {
                            data?.isPay == 0 ?(
                                <Footer 
                                    buttonOkContent={'CẬP NHẬT'}
                                    onClickButtonOk={()=>navigation.navigate('Registration/Update',{registryId:data?.id})}
                                    onClickButtonCancle={()=>setVisible(true)}
                                    disabled={loadingSubmit}
                                    loading={loadingSubmit}
                                    buttonCancleContent='XÓA'
                                    haveButtonCancel={true}
                                    footer_style={{
                                        backgroundColor:'#FFFFFF'
                                    }}
                                />
                            ):(
                                <></>
                            )
                        }
                    </>
                )
            }
            <WModal 
                modalVisible={visible}
                closeModal={closeModal}
                handleConfirm={handleDelete}
                modalContent='Bạn có chắc muốn xóa không?'
            />
        </View>
  )
}

export default RegistrationDetailScreen

const styles = StyleSheet.create({
    scroll_view:{
        flex:1,
        backgroundColor:'#FFFFFF',
    },
    session_top:{

    },
    group:{
        paddingHorizontal:15,
        marginTop:30,
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

    },
    address:{
    },
    title:{
        fontFamily:Font.BeVietnamProBold,
        color:'#2C3442',
        fontSize:16,
        lineHeight:24,
        fontWeight:'700',
        marginHorizontal:15,
        marginTop:35
    },
    check:{
        flexDirection:'row',
        alignItems:'center',
        marginTop:20,
        paddingHorizontal:15
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
        paddingHorizontal:15,
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
})