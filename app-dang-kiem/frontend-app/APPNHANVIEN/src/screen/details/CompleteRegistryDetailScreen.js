import { StyleSheet, Text, View,ScrollView } from 'react-native'
import React from 'react'
import Header from '../../component/layout/Header'
import {useSelector} from 'react-redux'
import ManagerService from '../../services/api/manager/ManagerService'
import {convertAlert} from '../../component/shared/ConvertAlert'
import Loading from '../../component/shared/Loading'
import {converLicensePlate, formatDate} from '../../services/utils'
import config from '../../config'
import {Font} from '../../assets/styles/Index'
import CheckNullData from '../../component/shared/CheckNullData'

const CompleteRegistryDetailScreen = ({navigation,route}) => {
    const {regisId} = route.params
    const {token} = useSelector(state => state.auth)
    const [isLoading,setIsLoading] = React.useState(true)
    const [data,setData] = React.useState()

    React.useEffect(()=>{
        if (token){
            setIsLoading(true);
            ManagerService.get_register_detail(regisId)
            .then((res) =>{
                if (res.status==1){
                    setData(res.data.registry)
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

    return (
        <View style={{flex:1 ,backgroundColor:'#FFFFFF'}}>
            <Header onGoBack={()=>navigation.goBack()} title="chi tiết đăng kiểm đã hoàn thành" />
            {
                isLoading ? (
                    <Loading />
                ):(
                    <>
                        <ScrollView style={styles.scrollView}>
                            <CheckNullData data={data}>
                                <View style={[styles.container,styles.general]}>
                                    <Text style={styles.title}>Thông tin chung</Text>
                                    <View style={[styles.row,styles.space_between]}>
                                        <View style={[styles.row,styles.car]}>
                                            {
                                                data?.carImages ? 
                                                (
                                                    <Image 
                                                        source={{uri:(config.API_BASE_URL+'/'+data.carImages)}}
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
                                                <Text style={styles.car_title}>Biển kiểm soát</Text>
                                                <Text style={styles.car_licensePlate}>{converLicensePlate(data?.license_plate)}</Text>
                                            </View>
                                        </View>
                                        <Text style={styles.btn_pass}>Đạt</Text>
                                    </View>
                                </View>
                                <View style={[styles.container,styles.registry]}>
                                    <View style={[styles.row,styles.space_between]}>
                                        <Text style={styles.title}>Thông tin đăng kiểm</Text>
                                        {
                                            data?.address ? (
                                                <Text style={styles.btn_address}>Đăng kiểm hộ</Text>
                                            ):(
                                                <></>
                                            )
                                        }
                                    </View>
                                    <View style={styles.box}>
                                        <Text style={styles.box_title}>Ngày đăng kiểm</Text>
                                        <Text style={styles.box_content}>{formatDate(data?.date)}</Text>
                                    </View>
                                    {
                                        data?.address ? (
                                            <View style={styles.box}>
                                                <Text style={styles.box_title}>Thông tin đăng kiểm hộ</Text>
                                                <Text style={styles.box_content}>{data?.address}</Text>
                                            </View>
                                        ):(
                                            <></>
                                        )
                                    }
                                    <View style={styles.box}>
                                        <Text style={styles.box_title}>Ngày hết hạn đăng kiểm</Text>
                                        <Text style={styles.box_content}>{formatDate(data?.date)}</Text>
                                    </View>
                                    <View style={styles.box}>
                                        <Text style={styles.box_title}>Ngày hết Hạn phí bảo trì đường bộ</Text>
                                        <Text style={styles.box_content}>{formatDate(data?.date)}</Text>
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

export default CompleteRegistryDetailScreen

const styles = StyleSheet.create({
    scrollView:{
        flex:1,
    },
    title:{
        fontFamily:Font.BeVietnamProBold,
        fontSize:12,
        lineHeight:24,
        color:'#0F6AA9',
        fontWeight:'700',
        textTransform:'uppercase',
        marginBottom:10,
    },
    container:{
        paddingHorizontal:15,
    },
    general:{
        paddingVertical:20,
        borderBottomColor:'#F2F6FC',
        borderBottomWidth:10,
    },
    car:{

    },
    car_title:{
        fontFamily:Font.BeVietnamProMedium,
        fontSize:10,
        lineHeight:18,
        color:'#394B6A',
        opacity:0.7,
        textTransform:'uppercase',
    },
    car_licensePlate:{
        fontFamily:Font.BeVietnamProSemiBold,
        fontSize:16,
        lineHeight:24,
        color:'#394B6A',
        textTransform:'uppercase',
    },
    btn_pass:{
        fontFamily:Font.BeVietnamProMedium,
        fontSize:11,
        lineHeight:16,
        color:'#008334',
        paddingHorizontal:40,
        borderRadius:100,
        backgroundColor:'#BCEBCF',
        paddingVertical:4,
    },
    registry:{
        paddingVertical:20,
    },
    btn_address:{
        fontFamily:Font.BeVietnamProMedium,
        fontSize:11,
        lineHeight:16,
        color:'#00A32E',
        paddingHorizontal:13,
        borderRadius:100,
        backgroundColor:'#E2FFD9',
        paddingVertical:4,
    },
    row:{
        flexDirection:'row',
        alignItems:'center',
    },
    space_between:{
        justifyContent:'space-between'
    },
    box:{
        marginTop:20,
        paddingBottom:10,
        borderBottomColor:'#E1E9F6',
        borderBottomWidth:1,
    },
    box_title:{
        fontFamily:Font.BeVietnamProSemiBold,
        fontSize:11,
        lineHeight:16,
        fontWeight:'600',
        color:'#394B6A',
        textTransform:'uppercase',
        opacity:0.7,
        marginBottom:10,
    },
    box_content:{
        fontFamily:Font.BeVietnamProMedium,
        fontSize:14,
        lineHeight:22,
        fontWeight:'500',
        color:'#2C3442',
    },
})