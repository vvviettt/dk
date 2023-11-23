import { StyleSheet, Text, View,ScrollView,Image } from 'react-native'
import React from 'react'
import Header from '../../component/layout/Header'
import NavigationService from '../../services/NavigationService'
import {useSelector} from 'react-redux'
import NotificationService from '../../services/api/notification/NotificationService'
import Loading from '../../component/shared/Loading'
import {Font} from '../../assets/styles/Index'
import {converLicensePlate, formatDate} from '../../services/utils'
import CheckNullData from '../../component/shared/CheckNullData'
import {convertAlert} from '../../component/shared/ConvertAlert'
import { CommonActions } from '@react-navigation/native';

const NotificationStatusScreen = ({navigation,route}) => {
    const {notiId} = route.params 
    const {token} = useSelector(state => state.auth)
    const [data,setData] = React.useState()
    const [isLoading,setIsLoading] = React.useState(true)
    console.log(data);
    React.useEffect(()=>{
        if(token){
            setIsLoading(true);
            NotificationService.get_notifications_byId(notiId)
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

    },[notiId])
    return (
        <View style={{flex:1,backgroundColor:'#F7FAFF'}}>
            <Header onGoBack={()=>navigation.dispatch(
                    CommonActions.reset({
                      index: 0,
                      routes: [
                        { 
                            name: 'BottomNavigation',
                            params: { 
                                isNotification : true
                            },
                        },
                      ],
                    })
                )} title='chi tiết Thông báo'/>
            {
                isLoading ? 
                (
                    <Loading />
                ):(
                    <>
                        <ScrollView style={styles.scroll_view}>
                            <CheckNullData data={data}>
                                <View style={styles.session}>
                                    <View style={styles.group_image}>
                                        <Image 
                                            source={require('../../assets/icons/CompleteRegistrationIcon.png')}
                                            style={{
                                                width:35,
                                                height:36,
                                                marginRight:10
                                            }}
                                        />
                                        <Text style={styles.group_text}>Xe của bạn đã {data?.type == 6 ? "đạt" : "không đạt"} đăng kiểm</Text>
                                    </View>
                                    <View style={styles.group_content}>
                                        <Text style={styles.group_content_title}>Thông tin chung</Text>
                                        <View style={[styles.row,{justifyContent:'space-between'}]}>
                                            <View style={styles.row}>
                                                {/* <Image 
                                                    source={{uri:config.API_BASE_URL+'/'+data?.carImages}}
                                                    style={{
                                                        width:44,
                                                        height:44,
                                                        resizeMode:'cover',
                                                        borderRadius:3,
                                                        marginRight:10,
                                                    }}
                                                /> */}
                                                <View>
                                                    <Text style={styles.license_plates}>Biển kiểm soát</Text>
                                                    <Text style={styles.group_content_license_plates}>{converLicensePlate(data?.data)}</Text>
                                                </View>
                                            </View>
                                            {
                                                data?.type == 6 ? (
                                                    <Text style={styles.pass}>Đạt</Text>
                                                ):(
                                                    <Text style={styles.not_pass}>Không đạt</Text>
                                                )
                                            }
                                        </View>
                                        <View>
                                            
                                        </View>
                                    </View>
                                </View>
                                <View style={styles.content}>
                                    <View style={[styles.row,{justifyContent:'space-between'}]}>
                                        <Text style={styles.title}>Thông tin đăng kiểm</Text>
                                        {
                                            data?.detail?.address ? (
                                                <Text style={styles.addres}>Đăng kiểm hộ</Text>
                                            ):(
                                                <></>
                                            )
                                        }
                                    </View>
                                    <View style={styles.content_box}>
                                        <Text style={styles.content_box_title}>ngày đăng kiểm</Text>
                                        <Text style={styles.content_box_text}>{formatDate(data?.detail?.date) ? formatDate(data?.detail?.date) : "Không có dữ liệu"}</Text>
                                    </View>
                                    {
                                        data?.detail?.address ? 
                                        (
                                            <View style={styles.content_box}>
                                                <Text style={styles.content_box_title}>Thông tin đăng kiểm hộ</Text>
                                                <Text style={styles.content_box_text}>Nhận xe tại {data?.detail?.address}</Text>
                                            </View>
                                        ):(
                                            <></>
                                        )
                                    }
                                    {
                                        data?.type == 6 && (
                                            <>
                                                <View style={styles.content_box}>
                                                    <Text style={styles.content_box_title}>ngày hết hạn đăng kiểm</Text>
                                                    <Text style={styles.content_box_text}>{formatDate(data?.detail?.plan_date) ? formatDate(data?.detail?.plan_date) : "Không có dữ liệu"}</Text>
                                                </View>
                                                <View style={{marginTop:20}}>
                                                    <Text style={styles.content_box_title}>Ngày hết Hạn phí bảo trì đường bộ</Text>
                                                    <Text style={styles.content_box_text}>{formatDate(data?.detail?.payment_date) ? formatDate(data?.detail?.payment_date) : "Không có dữ liệu"}</Text>
                                                </View>
                                            </>
                                        )
                                    }
                                </View>
                            </CheckNullData>
                        </ScrollView>
                    </>
                )
            }
        </View>
    )
}

export default NotificationStatusScreen

const styles = StyleSheet.create({
    scroll_view:{
        flex:1,
        backgroundColor:'#FFFFFF'
    },
    session:{
        paddingHorizontal:15,
        paddingTop:15,
        paddingBottom:20,
        borderBottomColor:'#F2F6FC',
        borderBottomWidth:10,
        borderStyle:'solid',
        backgroundColor:'#FFFFFF',
    },
    group_image:{
        flexDirection:'row',
        alignItems:'center',
        padding:20,
        backgroundColor:'#F8FAFF',
        borderRadius:6,
        borderWidth:2,
        borderColor:'#C1E1F6',
        borderStyle:'solid',
    },
    row:{
        flexDirection:'row',
        alignItems:'center'
    },
    group_text:{
        fontFamily:Font.BeVietnamProRegular,
        fontSize:16,
        lineHeight:24,
        fontWeight:'400',
        color:'#2C3442',
        flex:1
    },
    group_content:{
        marginTop:20,
    },
    group_content_title:{
        fontFamily:Font.BeVietnamProBold,
        fontSize:12,
        lineHeight:24,
        color:'#0F6AA9',
        fontWeight:'700',
        textTransform:'uppercase',
        marginBottom:10
    },
    license_plates:{
        fontFamily:Font.BeVietnamProMedium,
        fontSize:10,
        lineHeight:18,
        color:'#394B6A',
        fontWeight:'500',
    },
    group_content_license_plates:{
        fontFamily:Font.BeVietnamProSemiBold,
        fontSize:16,
        lineHeight:24,
        color:'#394B6A',
        fontWeight:'700',
    },
    pass:{
        fontFamily:Font.BeVietnamProMedium,
        fontSize:11,
        lineHeight:16,
        color:'#008334',
        fontWeight:'500',
        paddingHorizontal:38,
        paddingVertical:4,
        backgroundColor:'#BCEBCF',
        borderRadius:100,
    },
    not_pass:{
        fontFamily:Font.BeVietnamProMedium,
        fontSize:11,
        lineHeight:16,
        color:'#830000',
        fontWeight:'500',
        paddingHorizontal:20,
        paddingVertical:4,
        backgroundColor:'#FFD05B',
        borderRadius:100,
    },
    content:{
        paddingHorizontal:15,
        paddingVertical:20,
        borderBottomColor:'#F2F6FC',
        borderBottomWidth:10,
    },
    title:{
        fontFamily:Font.BeVietnamProBold,
        fontSize:12,
        lineHeight:24,
        color:'#0F6AA9',
        fontWeight:'700',
        textTransform:'uppercase',
    },
    content_box:{
        marginTop:20,
        paddingBottom:10,
        borderBottomColor:'#E1E9F6',
        borderBottomWidth:1,
    },
    content_box_title:{
        fontFamily:Font.BeVietnamProSemiBold,
        fontSize:11,
        lineHeight:16,
        fontWeight:'600',
        color:'#394B6A',
        textTransform:'uppercase',
        opacity:0.7,
        marginBottom:10,
    },
    content_box_text:{
        fontFamily:Font.BeVietnamProMedium,
        fontSize:14,
        lineHeight:22,
        fontWeight:'500',
        color:'#2C3442',
    },
    addres:{
        fontFamily:Font.BeVietnamProMedium,
        fontSize:11,
        lineHeight:16,
        fontWeight:'500',
        color:'#00A32E',
        paddingHorizontal:13,
        paddingVertical:4,
        backgroundColor:'#E2FFD9',
        borderRadius:100,
    },
    footer_style:{
        backgroundColor:'#FFFFFF'
    }
})