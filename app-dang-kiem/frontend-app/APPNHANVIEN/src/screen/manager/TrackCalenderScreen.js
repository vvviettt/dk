import { StyleSheet, Text, View ,ScrollView} from 'react-native'
import React from 'react'
import {useSelector} from 'react-redux'
import Header from '../../component/layout/Header'
import Loading from '../../component/shared/Loading'
import RegistryBox from '../../component/shared/RegistryBox'
import moment from 'moment'
import CalenderFullSize from '../../component/shared/CalenderFullSize'
import ManagerService from '../../services/api/manager/ManagerService'
import {convertAlert} from '../../component/shared/ConvertAlert'
import {Font} from '../../assets/styles/Index'
import {formatDate} from '../../services/utils'

const TrackCalenderScreen = ({navigation,route}) => {
    const {token} = useSelector(state => state.auth)
    const datedemo = new Date()
    const now = moment(datedemo).format('YYYY-MM-DD')
    const [date,setDate] = React.useState(now)
    const [isLoading,setIsLoading] = React.useState(true)
    const [listDate,setListDate] = React.useState()
    const [loadingChangeDay,setLoadingChangeDay] = React.useState(false)
    const [data,setData] = React.useState()
    
    React.useEffect(()=>{
        if (token){
            setLoadingChangeDay(true);
            ManagerService.get_list_regis(date)
            .then((res) =>{
                if (res.status==1){
                    setData(res.data.registries)
                    setLoadingChangeDay(false);
                }else{
                    throw new Error(res.message)
                }
            })
            .catch((err) =>{
                convertAlert('Thông báo',err.message);
                setLoadingChangeDay(false);
            })
        }
        return () => {}
    },[token])
    React.useEffect(() =>{
        if(token){
            setIsLoading(true);
            ManagerService.get_list_date()
            .then((res) =>{
                if (res.status==1){
                    setListDate(res.data.rows)
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
    React.useEffect(()=>{
        if (date){
            setLoadingChangeDay(true);
            ManagerService.get_list_regis(date)
            .then((res) =>{
                if (res.status==1){
                    setData(res.data.registries)
                    setLoadingChangeDay(false);
                }else{
                    throw new Error(res.message)
                }
            })
            .catch((err) =>{
                convertAlert('Thông báo',err.message);
                setLoadingChangeDay(false);
            })
        }
        return () => {}
    },[date])

    return (
        <View style={{flex:1}}>
            <Header onGoBack={()=>navigation.goBack()} title='Lịch theo dõi đăng kiểm'/>
            {
                isLoading ?
                (
                    <Loading />
                ):(
                    <>
                        <ScrollView style={{flex:1 ,backgroundColor:'#F7FAFF'}}>
                            <CalenderFullSize 
                                style={styles.calender_style} 
                                listDate={listDate}
                                onPressDate={(day)=>setDate(day)}
                                dateSelect={date}
                            />
                            {
                                loadingChangeDay ?
                                (
                                    <Loading />
                                ):(
                                    <>
                                        {
                                            <View style={styles.content}>
                                                <Text style={styles.content_title}>
                                                    {
                                                        moment(date).day() == 0 ?
                                                        'Chủ nhật' : 'Thứ ' + (moment(date).day() + 1)
                                                    } 
                                                    , ngày {formatDate(date)}
                                                </Text>
                                                {
                                                    data.length == 0 ? (
                                                        <Text style={{
                                                            textAlign:'center',
                                                            fontFamily:Font.BeVietnamProMedium,
                                                            fontSize:16,
                                                            lineHeight:24,
                                                            marginTop:50
                                                        }}>Hôm nay không có lịch đăng kiểm</Text>
                                                    ):(
                                                        <>
                                                        {
                                                            data?.map((registration)=>
                                                            <RegistryBox 
                                                                key={registration.id} 
                                                                data={registration} 
                                                                style={styles.box_style}
                                                                onPress={()=>navigation.navigate('FollowUpCheckin',{regisId:registration.id})}
                                                            />
                                                            )
                                                        }
                                                        </>
                                                    )
                                                }
                                            </View>
                                        }
                                    </>
                                )
                            }
                        </ScrollView>
                    </>
                )
            }
        </View>
    )
}

export default TrackCalenderScreen

const styles = StyleSheet.create({
    calender_style:{
    },
    content:{
        paddingHorizontal:15,
        paddingTop:25
    },
    content_title:{
        fontFamily:Font.BeVietnamProBold,
        fontSize:12,
        lineHeight:18,
        fontWeight:'700',
        color:'#394B6A',
        textTransform:'uppercase',
        marginBottom:15
    },
    box_style:{
        marginBottom:15
    }
})