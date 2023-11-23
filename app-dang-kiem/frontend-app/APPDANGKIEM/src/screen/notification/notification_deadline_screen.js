import { StyleSheet, Text, View,ScrollView,Image } from 'react-native'
import React from 'react'
import Header from '../../component/layout/Header'
import Loading from '../../component/shared/Loading'
import Footer from '../../component/layout/Footer'
import {Font} from '../../assets/styles/Index'
import {converLicensePlate, formatDate} from '../../services/utils'
import ErrorContent from '../../component/shared/ErrorContent'
import moment from 'moment';
import NotificationService from '../../services/api/notification/NotificationService'
import {useSelector} from 'react-redux'
import CheckNullData from '../../component/shared/CheckNullData'
import { CommonActions } from '@react-navigation/native';

const NotificationDeadlineScreen = ({navigation,route}) => {
    const {notiId} = route.params 
    const [data,setData] = React.useState({})
    const {token} = useSelector(state => state.auth)
    const [isLoading,setIsLoading] = React.useState(true)
    const date = new Date()
    const now = moment(date).format('YYYY-MM-DD')
    const getDay = (firstDate , secondDate) =>{
        const first = new Date(firstDate).getTime()
        const second = new Date(secondDate).getTime()
        return (first-second)/86400000
    }
    const handleNavigate = () =>{
        navigation.navigate('Registration/Add',{})
    }
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

    },[token])

    return (
        <View style={{flex:1}}>
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
                                            source={require('../../assets/icons/NotificationNearTimeIcon.png')}
                                            style={{
                                                width:32,
                                                height:32,
                                                marginRight:10
                                            }}
                                        />
                                        <Text style={styles.group_text}>Xe của bạn gần tới hạn đăng kiểm</Text>
                                    </View>
                                    <View style={styles.group_content}>
                                        <Text style={styles.group_content_title}>Thông tin  chung</Text>
                                        <Text style={styles.group_content_license_plates}>{converLicensePlate(data?.data)}</Text>
                                        <View style={styles.group_content_time}>
                                            <Text style={styles.group_content_time_left}>Ngày đến hạn đăng kiểm: {formatDate(data.date)}</Text>
                                            {
                                                now == data.date ?
                                                (
                                                    <Text style={styles.group_content_time_right}>Ngày hôm nay</Text>
                                                ):(
                                                    <></>
                                                )
                                            }
                                            {
                                                now > data.date ? 
                                                (
                                                    <Text style={styles.group_content_time_right}>Trễ {-getDay(data?.date,now)} ngày</Text>
                                                ):(
                                                    <></>
                                                )
                                            }
                                            {
                                                now < data.date ? 
                                                (
                                                    <Text style={styles.group_content_time_right}>Còn {getDay(data?.date,now)} ngày</Text>
                                                ):(
                                                    <></>
                                                )
                                            }
                                        </View>
                                    </View>
                                </View>
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
                                        data?.errors.map(e=>(
                                            <ErrorContent data={e} key={e.id}/>
                                        ))
                                    }
                                </View>
                            </CheckNullData>
                        </ScrollView>
                        <Footer 
                            buttonOkContent='ĐĂNG KÝ ĐĂNG KIỂM NGAY'
                            onClickButtonOk={handleNavigate}
                            footer_style={styles.footer_style}
                        />
                    </>
                )
            }
        </View>
    )
}

export default NotificationDeadlineScreen

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