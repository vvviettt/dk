import { StyleSheet, Text, View,ScrollView } from 'react-native'
import React from 'react'
import Header from '../../component/layout/Header'
import {Font} from '../../assets/styles/Index'
import ErrorContent from '../../component/shared/ErrorContent'
import Loading from '../../component/shared/Loading'
import {converLicensePlate} from '../../services/utils/index'
import {convertAlert} from '../../component/shared/ConvertAlert'
import NavigationService from '../../services/NavigationService'
import NotificationService from '../../services/api/notification/NotificationService'
import CheckNullData from '../../component/shared/CheckNullData'
import { CommonActions } from '@react-navigation/native';

const NotificationInfringesScreen = ({navigation,route}) => {
    const {notiId} = route.params
    const [data,setData] = React.useState({})
    const [isLoading,setIsLoading] = React.useState(true)
    React.useEffect(() =>{
        if(notiId){
            setIsLoading(true);
            NotificationService.get_notifications_byId(notiId)
            .then((res) =>{
                setData(res.data)
                setIsLoading(false);
            })
            .catch((err) =>{
                convertAlert('Thông báo',err.message);
                setIsLoading(false);
            })
        }
    },[notiId])

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
                )} title='Danh sách lỗi vi phạm'/>
            {
                isLoading == true ?
                (
                    <Loading />
                ):(
                    <View style={styles.page_content}>
                        <View style={styles.car_infor}>
                            <View style={styles.car_infor_left}>
                                <Text style={styles.car_infor_title}>Biển kiểm soát</Text>
                                <Text style={styles.license_plates_style}>{converLicensePlate(data?.data)}</Text>
                            </View>
                            <View style={styles.car_infor_right}>
                                <Text style={styles.car_infor_title}>Số lỗi</Text>
                                <Text style={styles.number_error}>{data?.errors.length}</Text>
                            </View>
                        </View>
                        <ScrollView style={styles.scroll_view}>
                            <CheckNullData data={data}>
                                {
                                    data?.errors.map(e=>(
                                        <ErrorContent data={e} key={e.id}/>
                                    ))
                                }
                            </CheckNullData>
                        </ScrollView>
                    </View>
                )
            }
        </View>
    )
}

export default NotificationInfringesScreen

const styles = StyleSheet.create({
    page_content:{
        width:'100%',
        flex:1,
    },
    car_infor:{
        width:'100%',
        paddingHorizontal:15,
        paddingVertical:20,
        backgroundColor:'#F7FAFF',
        borderBottomColor:'#E1E9F6',
        borderBottomWidth:5,
        borderStyle:'solid',
        flexDirection:'row',
        justifyContent:'space-between'
    },
    car_infor_left:{
        alignItems:'flex-start',
        width:'70%'
    },
    car_infor_right:{
        alignItems:'flex-end',
        width:'30%'
    },
    car_infor_title:{
        fontFamily:Font.BeVietnamProRegular,
        fontSize:12,
        lineHeight:18,
        fontWeight:'400',
        textTransform:'uppercase',
        color:'#394B6A'
    },
    license_plates_style:{
        fontFamily:Font.BeVietnamProSemiBold,
        fontSize:16,
        lineHeight:24,
        fontWeight:'600',
        textTransform:'uppercase',
        color:'#394B6A',
    },
    number_error:{
        fontFamily:Font.BeVietnamProBold,
        fontSize:16,
        lineHeight:24,
        fontWeight:'700',
        textTransform:'uppercase',
        color:'#BF0000',
    },
    scroll_view:{
        flex:1,
        backgroundColor:'#FFFFFF',
    }
})