import { StyleSheet, Text, View,ScrollView,Image } from 'react-native'
import React from 'react'
import Header from '../../component/layout/Header'
import Loading from '../../component/shared/Loading'
import {Font} from '../../assets/styles/Index'
import {converLicensePlate, formatDate} from '../../services/utils'
import ErrorContent from '../../component/shared/ErrorContent'
import moment from 'moment';
import NavigationService from '../../services/NavigationService'
import NotificationService from '../../services/api/notification/NotificationService'
import {useSelector} from 'react-redux'
import {convertAlert} from '../../component/shared/ConvertAlert'
import CheckNullData from '../../component/shared/CheckNullData'

const NotificationDetailOneScreen = ({navigation,route}) => {
    const {notiId} = route.params 
    const {token} = useSelector(state => state.auth)
    const [data,setData] = React.useState()
    const [isLoading,setIsLoading] = React.useState(true)
    const date = new Date()
    const now = moment(date).format('YYYY-MM-DD')

    const getDay = (firstDate , secondDate) =>{
        const first = new Date(firstDate).getTime()
        const second = new Date(secondDate).getTime()
        return (first-second)/86400000
    }

    React.useEffect(()=>{
        if(token){
            setIsLoading(true);
            NotificationService.get_notifications_byId(notiId)
            .then((res) =>{
                if (res.status==1){
                    setData(res.data.detail)
                    setIsLoading(false);
                }else throw new Error(res.message)
            })
            .catch((err) =>{
                convertAlert('Thông báo',err.message);
                setIsLoading(false);
            })
        }
        return () => {}
    },[token])
    return (
        <View style={{flex:1}}>
            <Header onGoBack={()=>NavigationService.reset('BottomNavigation')} title='chi tiết Thông báo'/>
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
                                            source={require('../../assets/icons/NotificationNearTimeIcon.png')}
                                            style={{
                                                width:32,
                                                height:32,
                                                marginRight:10
                                            }}
                                        />
                                        <Text style={styles.group_text}>Đăng ký đăng kiểm mới</Text>
                                    </View>
                                    <View style={styles.group_content}>
                                        <Text style={styles.group_content_title}>Thông tin  chung</Text>
                                        <Text style={styles.group_content_license_plates}>{converLicensePlate(data?.license_plates)}</Text>
                                        <View style={styles.group_content_time}>
                                            <Text style={styles.group_content_time_left}>Ngày đến hạn đăng kiểm: {formatDate(data?.date)}</Text>
                                            {
                                                now == data?.date ?
                                                (
                                                    <Text style={styles.group_content_time_right}>Ngày hôm nay</Text>
                                                ):(
                                                    <></>
                                                )
                                            }
                                            {
                                                now > data?.date ? 
                                                (
                                                    <Text style={styles.group_content_time_right}>Trễ {-getDay(data?.date,now)} ngày</Text>
                                                ):(
                                                    <></>
                                                )
                                            }
                                            {
                                                now < data?.date ? 
                                                (
                                                    <Text style={styles.group_content_time_right}>Còn {getDay(data?.date,now)} ngày</Text>
                                                ):(
                                                    <></>
                                                )
                                            }
                                        </View>
                                        <Text style={styles.group_content_time_left}>Tên chủ xe: {data?.owner_name}</Text>
                                        <Text style={styles.group_content_time_left}>Số điện thoại: {data?.owner_phone}</Text>
                                    </View>
                                </View>
                                {
                                    data?.address ? (
                                        <View style={styles.content}>
                                            <View style={{
                                                padding:15,
                                                paddingBottom:5,
                                                borderBottomColor:'#E1E9F6',
                                                borderBottomWidth:1,
                                            }}>
                                                <Text style={styles.group_content_title}>Thông tin đăng kiểm hộ</Text>
                                                <Text style={styles.group_content_time_left}>Địa chỉ nhận xe: {data?.address}</Text>
                                                <Text style={styles.group_content_time_left}>Phí đăng kiểm hộ:</Text>
                                            </View>
                                        </View>
                                    ):(
                                        <></>
                                    )
                                }
                                <View style={styles.content}>
                                    <View style={{
                                        padding:15,
                                        paddingBottom:5,
                                        borderBottomColor:'#E1E9F6',
                                        borderBottomWidth:1,
                                    }}>
                                        <Text style={styles.group_content_title}>lỗi vi phạm</Text>
                                    </View>
                                    {
                                        data?.infringes.map(e=>(
                                            <ErrorContent data={e} key={e.id}/>
                                        ))
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

export default NotificationDetailOneScreen

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
    group_content_license_plates:{
        fontFamily:Font.BeVietnamProBold,
        fontSize:14,
        lineHeight:20,
        color:'#2C3442',
        fontWeight:'700',
        marginBottom:10
    },
    group_content_time:{
        flexDirection:'row',
        alignItems:'center',
        justifyContent:'space-between',
    },
    group_content_time_left:{
        width:'68%',
        textAlign:'left',
        flex:1,
        fontFamily:Font.BeVietnamProRegular,
        fontSize:13,
        lineHeight:18,
        color:'#2C3442',
        fontWeight:'400',
        marginBottom:6,
    },
    group_content_time_right:{
        width:'28%',
        textAlign:'right',
        flex:1,
        fontFamily:Font.BeVietnamProRegular,
        fontSize:13,
        lineHeight:18,
        color:'#BF0000',
        fontWeight:'400',
        fontStyle:'italic',
    },
    content:{

    },
    footer_style:{
        backgroundColor:'#FFFFFF'
    }
})