import { StyleSheet, Text, View, ScrollView,Image } from 'react-native'
import React from 'react'
import Header from '../../component/layout/Header'
import {useSelector} from 'react-redux'
import Loading from '../../component/shared/Loading'
import {converLicensePlate, convertPrice, formatDate} from '../../services/utils'
import {Font} from '../../assets/styles/Index'
import ManagerService from '../../services/api/manager/ManagerService'
import config from '../../config'
import {convertAlert} from '../../component/shared/ConvertAlert'
import CheckNullData from '../../component/shared/CheckNullData'

const HistoryDetailScreen = ({navigation,route}) => {
    const {registryId,car} = route.params
    const {token} = useSelector(state => state.auth)
    const [data,setData] = React.useState()
    const [isLoading,setIsLoading] = React.useState(true)

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
            <Header onGoBack={()=>navigation.goBack()} title='Chi tiết lịch sử'/>
            {
                isLoading ?(
                    <Loading />
                ):(
                    <ScrollView style={styles.scrollView}>
                        <CheckNullData data={data}>
                            <View style={styles.general}>
                                <Text style={styles.title}>Thông tin chung</Text>
                                <View style={styles.general_group}>
                                    <View style={styles.general_group_left}>
                                    {
                                            car.display_image ? 
                                            (
                                                <Image 
                                                    source={{uri:(config.API_BASE_URL+'/'+car.display_image)}}
                                                    style={{
                                                        width:44,
                                                        height:44,
                                                        borderRadius:3,
                                                        resizeMode:'cover',
                                                        marginRight:12,
                                                    }}
                                                />
                                            ):(
                                                <View style={{
                                                    width:44,
                                                    height:44,
                                                    alignItems:'center',
                                                    justifyContent:'center',
                                                    borderRadius:4,
                                                    borderWidth:1,
                                                    borderColor:'#394B6A',
                                                    marginRight:12,
                                                }}>
                                                    <Text style={{
                                                        textAlign:'center',
                                                        fontFamily:Font.BeVietnamProRegular,
                                                        fontSize:9
                                                    }}>Chưa thêm ảnh</Text>
                                                </View>
                                            )
                                        }
                                        <View>
                                            <Text style={styles.general_group_title}>Biển kiểm soát</Text>
                                            <Text style={styles.general_group_content}>{converLicensePlate(car.license_plates)}</Text>
                                        </View>
                                    </View>
                                    {
                                        data?.address ? (
                                            <Text style={styles.general_group_right}>Đăng kiểm hộ</Text>
                                        ):(
                                            <></>
                                        )
                                    }
                                </View>
                            </View>
                            <View style={styles.content}>
                                <Text style={styles.title}>Thông tin đăng kiểm</Text>
                                <View style={styles.content_box}>
                                    <Text style={styles.content_box_title}>ngày đăng kiểm</Text>
                                    <Text style={styles.content_box_text}>{formatDate(data?.date)}</Text>
                                </View>
                                {
                                    data?.address ? 
                                    (
                                        <View style={styles.content_box}>
                                            <Text style={styles.content_box_title}>Thông tin đăng kiểm hộ</Text>
                                            <Text style={styles.content_box_text}>Nhận xe tại {data?.address}</Text>
                                        </View>
                                    ):(
                                        <></>
                                    )
                                }
                                <View style={styles.content_box}>
                                    <Text style={styles.content_box_title}>ngày hết hạn đăng kiểm</Text>
                                    <Text style={styles.content_box_text}>{formatDate(data?.planDate)}</Text>
                                </View>
                                <View style={{marginTop:20}}>
                                    <Text style={styles.content_box_title}>Ngày hết Hạn phí bảo trì đường bộ</Text>
                                    <Text style={styles.content_box_text}>{formatDate(data?.paymentAt)}</Text>
                                </View>
                            </View>
                            <View style={styles.fee}>
                                <Text style={styles.title}>Thông tin phí</Text>
                                <View style={styles.fee_group}>
                                    <Text style={styles.fee_group_left}>Phí kiểm định xe cơ giới</Text>
                                    <Text style={styles.fee_group_right}>{convertPrice(data?.fee.tariff)} đ</Text>
                                </View>
                                {
                                    data?.address ? 
                                    (
                                        <View style={styles.fee_group}>
                                            <Text style={styles.fee_group_left}>Phí đăng kiểm hộ</Text>
                                            <Text style={styles.fee_group_right}>{convertPrice(data?.fee.serviceCost)} đ</Text>
                                        </View>
                                    ):(
                                        <></>
                                    )
                                }
                                <View style={styles.fee_group}>
                                    <Text style={styles.fee_group_left}>Phí cấp giấy chứng nhận kiểm định</Text>
                                    <Text style={styles.fee_group_right}>{convertPrice(data?.fee.license_fee)} đ</Text>
                                </View>
                                <View style={styles.fee_group}>
                                    <Text style={styles.fee_group_left}>Phí đường bộ/tháng</Text>
                                    <Text style={styles.fee_group_right}>{convertPrice(data?.fee.road_fee)} đ</Text>
                                </View>
                            </View>
                        </CheckNullData>
                    </ScrollView>
                )
            }
        </View>
    )
}

export default HistoryDetailScreen

const styles = StyleSheet.create({
    scrollView:{
        flex:1,
        backgroundColor:'#FFFFFF'
    },
    general:{
        paddingHorizontal:15,
        paddingVertical:20,
        borderBottomColor:'#F2F6FC',
        borderBottomWidth:10,
    },
    title:{
        fontFamily:Font.BeVietnamProBold,
        fontSize:12,
        lineHeight:24,
        fontWeight:'700',
        textTransform:'uppercase',
        color:'#0F6AA9',
    },
    general_content:{

    },
    general_group:{
        flexDirection:'row',
        justifyContent:'space-between',
        alignItems:'center',
        marginTop:10,
    },
    general_group_title:{
        fontFamily:Font.BeVietnamProMedium,
        fontSize:10,
        lineHeight:18,
        fontWeight:'500',
        color:'#394B6A',
        textTransform:'uppercase',
    },
    general_group_content:{
        fontFamily:Font.BeVietnamProSemiBold,
        fontSize:16,
        lineHeight:24,
        fontWeight:'600',
        color:'#394B6A',
    },
    general_group_left:{
        flexDirection:'row',
        flex:1,
        alignItems:'center'
    },
    general_group_right:{
        fontFamily:Font.BeVietnamProMedium,
        fontSize:11,
        lineHeight:16,
        fontWeight:'500',
        color:'#00A32E',
        paddingHorizontal:13,
        paddingVertical:4,
        backgroundColor:'#E2FFD9',
        borderRadius:100,
        marginLeft:50,
    },
    content:{
        paddingHorizontal:15,
        paddingVertical:20,
        borderBottomColor:'#F2F6FC',
        borderBottomWidth:10,
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
    fee:{   
        paddingHorizontal:15,
        paddingVertical:20,
    },
    fee_group:{
        marginTop:20,
        flexDirection:'row',
        alignItems:'center',
        justifyContent:'space-between',
    },
    fee_group_left:{
        marginRight:50,
        flex:1,
        fontFamily:Font.BeVietnamProRegular,
        fontSize:13,
        lineHeight:18,
        fontWeight:'400',
        color:'#394B6A',
        opacity:0.7,
    },
    fee_group_right:{
        fontFamily:Font.BeVietnamProMedium,
        fontSize:13,
        lineHeight:18,
        fontWeight:'500',
        color:'#2C3442',
    }
})