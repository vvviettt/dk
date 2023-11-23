import { StyleSheet, Text, View,ScrollView,Image } from 'react-native'
import React from 'react'
import Header from '../../component/layout/Header'
import Loading from '../../component/shared/Loading'
import {Font} from '../../assets/styles/Index'
import {converLicensePlate, formatDate} from '../../services/utils'
import {useSelector} from 'react-redux'
import NotificationService from '../../services/api/notification/NotificationService'
import NavigationService from '../../services/NavigationService'
import CheckNullData from '../../component/shared/CheckNullData'

const NotificationDetailTwoScreen = ({navigation,route}) => {
    const {notiId} = route.params 
    const {token} = useSelector(state => state.auth)
    const [data,setData] = React.useState()
    const [isLoading,setIsLoading] = React.useState(true)

    React.useEffect(()=>{
        if(token){
            setIsLoading(true);
            NotificationService.get_notifications_byId(notiId)
            .then((res) =>{
                if (res.status==1){
                    setData(res.data.detail)
                    setIsLoading(false);
                }
            })
            .catch((err) =>{
                alert(err.message);
                setIsLoading(false);
            })
        }
        return () => {}
    },[token])
    console.log(data);
    return (
        <View style={{flex:1,backgroundColor:'#F7FAFF'}}>
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
                                            source={require('../../assets/icons/NotificationHaveIcon.png')}
                                            style={{
                                                width:32,
                                                height:32,
                                                marginRight:10
                                            }}
                                        />
                                        <Text style={styles.group_text}>Xe đã hoàn thành phí và lệ phí</Text>
                                    </View>
                                    <View style={styles.group_content}>
                                        <Text style={styles.group_content_title}>Thông tin  chung</Text>
                                        <Text style={styles.group_content_license_plates}>{converLicensePlate(data?.license_plates)}</Text>
                                        <View style={styles.group_content_time}>
                                            <Text style={styles.group_content_time_left}>Ngày đến hạn đăng kiểm: {formatDate(data?.date)}</Text>
                                        </View>
                                        <Text style={styles.group_content_time_left}>Tên chủ xe: {data?.owner_name}</Text>
                                        <Text style={styles.group_content_time_left}>Số điện thoại: {data?.owner_phone}</Text>
                                    </View>
                                </View>
                            </CheckNullData>
                        </ScrollView>
                    </>
                )
            }
        </View>
    )
}

export default NotificationDetailTwoScreen

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
        flex:1,
        fontFamily:Font.BeVietnamProRegular,
        fontSize:13,
        lineHeight:18,
        color:'#2C3442',
        fontWeight:'400',
    },
    content:{
        backgroundColor:'#FFFFFF',
    },
    footer_style:{
        backgroundColor:'#FFFFFF'
    }
})