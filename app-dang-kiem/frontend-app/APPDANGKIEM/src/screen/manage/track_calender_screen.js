import { StyleSheet, Text, View,ScrollView } from 'react-native'
import React from 'react'
import Header from '../../component/layout/Header'
import {Font} from '../../assets/styles/Index'
import {useSelector} from 'react-redux'
import HomeService from '../../services/api/home/HomeService'
import Loading from '../../component/shared/Loading'
import {formatDate} from '../../services/utils'
import moment from 'moment'
import RegistryBox from '../../component/shared/RegistryBox'
import {convertAlert} from '../../component/shared/ConvertAlert'
import CheckNullData from '../../component/shared/CheckNullData'

const TrackCalenderScreen = ({navigation,route}) => {
    const {day} = route.params
    const [date,setDate] = React.useState(day.dateString)
    const [loadingChangeDay,setLoadingChangeDay] = React.useState(true)
    const [data,setData] = React.useState()
    const {token} = useSelector(state => state.auth)

    React.useEffect(() =>{
        if(token){
            setLoadingChangeDay(true)
            HomeService.get_list_register_by_day(date)
                .then((res)=>{
                    if (res.status==1){
                        setData(res.data.rows)
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
    },[token])
    return (
        <View style={{flex:1}}>
            <Header onGoBack={()=>navigation.navigate('BottomNavigation')} title='Lịch theo dõi'/>
            <ScrollView style={{flex:1 ,backgroundColor:'#F7FAFF'}}>
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
                                    <CheckNullData data={data}>
                                        {
                                            data?.length == 0 ? (
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
                                                            onPress={()=>navigation.navigate('Registration/Detail',{registryId:registration.id})}
                                                        />
                                                    )
                                                }
                                                </>
                                            )
                                        }
                                    </CheckNullData>
                                </View>
                            }
                        </>
                    )
                }
            </ScrollView>
        </View>
  )
}

export default TrackCalenderScreen

const styles = StyleSheet.create({
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