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
import { CommonActions } from '@react-navigation/native';

const NotificationRegistryScreen = ({navigation,route}) => {
    const {notiId} = route.params 
    console.log(notiId);
    const {token} = useSelector(state => state.auth)
    const [data,setData] = React.useState({})
    const [isLoading,setIsLoading] = React.useState(true)
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
                alert(err.message);
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
                                            source={require('../../assets/icons/NotificationHaveIcon.png')}
                                            style={{
                                                width:32,
                                                height:32,
                                                marginRight:10
                                            }}
                                        />
                                        <Text style={styles.group_text}>Xe của bạn có lịch đăng kiểm</Text>
                                    </View>
                                    <View style={styles.group_content}>
                                        <Text style={styles.group_content_title}>Thông tin  chung</Text>
                                        <Text style={styles.group_content_license_plates}>{converLicensePlate(data?.data)}</Text>
                                        {
                                            data?.planDate ? ( 
                                                <Text style={styles.group_content_time_left}>Ngày đến hạn đăng kiểm: {formatDate(data?.planDate)}</Text>
                                            ):(
                                                <></>
                                            )
                                        }
                                    </View>
                                </View>
                                <View style={styles.content}>
                                    <View style={{
                                        padding:15,
                                    }}>
                                        <Text style={styles.group_content_title}>Thông tin đăng kiểm</Text>
                                        <Text style={{
                                            fontFamily:Font.BeVietnamProRegular,
                                            fontSize:13,
                                            lineHeight:18,
                                            fontWeight:'400',
                                            color:'#2C3442'
                                        }}>
                                            Ngày đã đăng ký đăng kiểm: <Text style={{
                                                fontFamily:Font.BeVietnamProBold,
                                                fontSize:13,
                                                lineHeight:18,
                                                fontWeight:'700',
                                                color:'#00A32E'
                                            }}>{formatDate(data?.date)}</Text> 
                                        </Text>
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

export default NotificationRegistryScreen

const styles = StyleSheet.create({
    scroll_view:{
        flex:1,
        backgroundColor:'#F7FAFF'
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