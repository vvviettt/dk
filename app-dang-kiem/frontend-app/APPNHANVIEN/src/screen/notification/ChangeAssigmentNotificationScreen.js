import { StyleSheet, Text, View ,ScrollView, Image} from 'react-native'
import React from 'react'
import NotificationService from '../../services/api/notification/NotificationService'
import Loading from '../../component/shared/Loading'
import {useSelector} from 'react-redux'
import CheckNullData from '../../component/shared/CheckNullData'
import Header from '../../component/layout/Header'
import {Font} from '../../assets/styles/Index'
import {converLicensePlate, convertPrice, formatDate} from '../../services/utils'
import moment from 'moment';
import ErrorContent from '../../component/shared/ErrorContent'
import NavigationService from '../../services/NavigationService'

const ChangeAssigmentNotificationScreen = ({navigation,route}) => {
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
    console.log(data);
    return (
        <View style={{flex:1}}>
            <Header onGoBack={()=>NavigationService.reset('BottomNavigation')} title='chi tiết Thông báo'/>
            {
                isLoading ? 
                (
                    <Loading />
                ):(
                    <ScrollView style={styles.scroll_view}>
                        <CheckNullData data={data}>
                            <View style={styles.container}>
                                <View style={styles.group_image}>
                                    <Image 
                                        source={require('../../assets/icons/AssigmentNotificationIcon.png')}
                                        style={{
                                            width:32,
                                            height:32,
                                            marginRight:10
                                        }}
                                    />
                                    <Text style={styles.group_text}>Thay đổi phân công đăng kiểm</Text>
                                </View>
                                <View style={styles.wraper}>
                                    <Text style={styles.title}>Thông tin  chung</Text>
                                    <Text style={[styles.content,{fontWeight:"700",fontSize:14}]}>{converLicensePlate(data?.license_plate)}</Text>
                                    <Text style={styles.content}>Ngày đến hạn đăng kiểm: {formatDate(data?.date)}</Text>
                                    {
                                        now == data?.date ?
                                        (
                                            <Text style={[styles.content,{color:"#BF0000"}]}>Ngày hôm nay</Text>
                                        ):(
                                            <></>
                                        )
                                    }
                                    {
                                        now > data?.date ? 
                                        (
                                            <Text style={[styles.content,{color:"#BF0000"}]}>Trễ {-getDay(data?.date,now)} ngày</Text>
                                        ):(
                                            <></>
                                        )
                                    }
                                    {
                                        now < data?.date ? 
                                        (
                                            <Text style={[styles.content,{color:"#BF0000"}]}>Còn {getDay(data?.date,now)} ngày</Text>
                                        ):(
                                            <></>
                                        )
                                    }
                                    <Text style={styles.content}>Tên chủ xe: {data?.owner_name}</Text>
                                    <Text style={styles.content}>Số điện thoại: {data?.owner_phone}</Text>
                                </View>
                            </View>
                            <View style={styles.container}>
                                <View style={styles.wraper}>
                                    <Text style={styles.title}>Thông tin đăng kiểm hộ</Text>
                                    <Text style={styles.content}>Thời gian nhận xe: Lúc {data?.car_delivery_time?.slice(0,5)} ngày {formatDate(data?.date)}</Text>
                                    <Text style={styles.content}>Địa chỉ nhận xe: {data?.address}</Text>
                                    <Text style={styles.content}>Phí đăng kiểm hộ: {convertPrice(data?.serviceCost)}đ</Text>
                                </View>
                            </View>
                            <View style={styles.container}>
                                <View style={styles.wraper}>
                                    <Text style={styles.title}>Thông tin người nhận xe</Text>
                                    <Text style={styles.content}>Tên người nhận: {data?.staff_name}</Text>
                                    <Text style={styles.content}>Điện thoại: {data?.phone_number}</Text>
                                </View>
                            </View>
                            {
                                data?.infringes?.length != 0 ? (
                                    <View style={styles.container}>
                                        <View style={styles.wraper}>
                                            <Text style={styles.title}>Lỗi vi phạm</Text>
                                            {
                                                data?.infringes.map(e=>(
                                                    <ErrorContent data={e} key={e.id}/>
                                                ))
                                            }
                                        </View>
                                    </View>
                                ):(
                                    <></>
                                )
                            }
                        </CheckNullData>
                    </ScrollView>
                )
            }
        </View>
    )
}

export default ChangeAssigmentNotificationScreen

const styles = StyleSheet.create({
    scroll_view:{
        flex:1,
        backgroundColor:'#F7FAFF'
    },
    container:{
        paddingHorizontal:15,
        borderBottomColor:'#F2F6FC',
        borderBottomWidth:10,
        borderStyle:'solid',
    },
    wraper:{
        paddingVertical:20
    },
    title:{
        fontFamily:Font.BeVietnamProBold,
        fontSize:12,
        lineHeight:24,
        color:'#0F6AA9',
        fontWeight:'700',
        textTransform:'uppercase',
        marginBottom:2
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
        marginTop:15,
    },
    group_text:{
        fontFamily:Font.BeVietnamProRegular,
        fontSize:16,
        lineHeight:24,
        fontWeight:'400',
        color:'#2C3442',
        flex:1
    },
    content:{
        marginTop:8,
        fontFamily:Font.BeVietnamProMedium,
        fontSize:13,
        lineHeight:18,
        color:'#2C3442',
        fontWeight:'400',
    },
})