import { StyleSheet, Text, View ,ScrollView,Image,TouchableOpacity, Linking} from 'react-native'
import React from 'react'
import Header from '../../component/layout/Header'
import config from '../../config'
import {Font} from '../../assets/styles/Index'
import {useSelector} from 'react-redux'
import ManagerService from '../../services/api/manager/ManagerService'
import {convertAlert} from '../../component/shared/ConvertAlert'
import {converLicensePlate} from '../../services/utils'
import Loading from '../../component/shared/Loading'
import CheckNullData from '../../component/shared/CheckNullData'

const FollowUpCheckinScreen = ({navigation,route}) => {
    const {regisId} = route.params
    const {token} = useSelector(state => state.auth)
    const [data,setData] = React.useState()
    const [isLoading,setIsLoading] = React.useState(true)
    console.log(data);
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
            <Header onGoBack={()=>navigation.goBack()} title="Theo dõi khám đăng kiểm" />
            {
                isLoading?
                (
                    <Loading />
                ):(
                    <ScrollView style={styles.scroll_view}>
                        <CheckNullData data={data}>
                            <View style={styles.information}>
                                <View style={styles.information_general}>
                                    <Text style={styles.information_general_title}>Thông tin chung</Text>
                                    <Text style={styles.information_general_licensePlates}>{converLicensePlate(data?.license_plate)}</Text>
                                </View>
                                <View style={styles.information_address}>
                                    {
                                        data?.carImages ? (
                                            <Image 
                                                source={{uri:config.API_BASE_URL+'/'+data?.carImages}}
                                                style={{
                                                    width:60,
                                                    height:60,
                                                    resizeMode:'cover',
                                                    borderRadius:6,
                                                }}
                                            />
                                        ):(
                                            <View style={{
                                                width:60,
                                                height:60,
                                                alignItems:'center',
                                                justifyContent:'center',
                                                borderRadius:6,
                                                borderWidth:1,
                                                borderColor:'#EFF2F8'
                                            }}>
                                                <Text style={{
                                                    textAlign:'center',
                                                    fontFamily:Font.BeVietnamProRegular,
                                                    fontSize:13
                                                }}>Chưa thêm ảnh</Text>
                                            </View>
                                        )
                                    }
                                    {
                                        data?.address ? (
                                            <View style={styles.information_address_group}>
                                                <Text style={styles.information_address_content}>Nhờ đăng kiểm hộ</Text>
                                                <Text style={styles.information_address_content}>Địa chỉ: {data?.address}</Text>
                                            </View>
                                        ):(
                                            <></>
                                        )
                                    }
                                </View>
                            </View>
                            <View style={styles.line}/>
                            <View >
                                <TouchableOpacity 
                                    onPress={()=>{
                                        const url=`tel://${data?.owner_phone}`
                                        Linking.openURL(url)
                                    }}
                                >
                                    <View style={styles.information_owner}>
                                        <Text style={styles.information_owner_title}>Chủ xe</Text>
                                        <View style={styles.information_owner_group}>
                                            {
                                                data?.userImage ? (
                                                    <Image 
                                                        source={{uri:config.API_BASE_URL+'/'+data?.userImage}}
                                                        style={{
                                                            width:44,
                                                            height:44,
                                                            resizeMode:'cover',
                                                            borderRadius:6,
                                                        }}
                                                    />
                                                ):(
                                                    <View style={{
                                                        width:44,
                                                        height:44,
                                                        alignItems:'center',
                                                        justifyContent:'center',
                                                        borderRadius:6,
                                                        borderWidth:1,
                                                        borderColor:'#EFF2F8'
                                                    }}>
                                                        <Text style={{
                                                            textAlign:'center',
                                                            fontFamily:Font.BeVietnamProRegular,
                                                            fontSize:9
                                                        }}>Chưa thêm ảnh</Text>
                                                    </View>
                                                )
                                            }
                                            <View style={{
                                                marginLeft:10,
                                            }}>
                                                <Text style={styles.information_owner_name}>{data?.owner_name}</Text>
                                                <View style={styles.information_owner_group}>
                                                    <Image 
                                                        source={require('../../assets/icons/PhoneCallIcon.png')}
                                                        style={{
                                                            width:14,
                                                            height:14,
                                                        }}
                                                    />
                                                    <Text style={styles.information_owner_phone}>{data?.owner_phone}</Text>
                                                </View>
                                            </View>
                                        </View>
                                    </View>
                                </TouchableOpacity>
                                <View style={styles.information_car}>
                                    <Text  style={styles.information_car_title}>Thông tin xe</Text>
                                    <View style={styles.group}>
                                        <Text style={styles.group_title}>Chủng loại phương tiện</Text>
                                        <Text style={styles.group_content}>{data?.category_name}</Text>
                                    </View>
                                    <View style={styles.group}>
                                        <Text style={styles.group_title}>Loại phương tiện</Text>
                                        <Text style={styles.group_content}>{data?.car_type}</Text>
                                    </View>
                                    <View style={styles.group}>
                                        <Text style={styles.group_title}>Năm sản xuất</Text>
                                        <Text style={styles.group_content}>{data?.manufacture_at}</Text>
                                    </View>
                                </View>
                            </View>
                        </CheckNullData>
                    </ScrollView>   
                )
            }
        </View>
    )
}

export default FollowUpCheckinScreen

const styles = StyleSheet.create({
    scroll_view:{
        flex:1,
    },
    information:{
        paddingHorizontal:15,
        flexDirection:"row",
        alignItems:'center',
        paddingTop:30
    },
    information_general:{
        flex:1,
        marginRight:20,
    },
    information_general_title:{
        fontFamily:Font.BeVietnamProBold,
        color:'#2C3442',
        fontSize:16,
        lineHeight:24,
        fontWeight:'700',
        marginBottom:10,
    },
    information_general_licensePlates:{
        fontFamily:Font.BeVietnamProBold,
        color:'#2C3442',
        fontSize:14,
        lineHeight:20,
        fontWeight:'700',
    },
    information_address:{
        flex:1,
        flexDirection:"row-reverse",
        alignItems:'center',
    },
    information_address_group:{
        flex:1,
        marginRight:5,
    },
    information_address_content:{
        fontFamily:Font.BeVietnamProRegular,
        fontSize:11,
        fontStyle:'italic',
        lineHeight:18,
        color:'#394B6A',
        opacity:0.8,
    },
    line:{
        marginLeft:30,
        marginRight:70,
        paddingLeft:30,
        paddingRight:70,
        height:1,
        backgroundColor:'#E1E9F6',
        marginVertical:25
    },
    information_owner:{
        paddingHorizontal:15,
        paddingBottom:20,
        borderBottomColor:'#E1E9F6',
        borderBottomWidth:1,
    },
    information_owner_title:{
        fontFamily:Font.BeVietnamProRegular,
        fontSize:12,
        lineHeight:18,
        color:'#394B6A',
        opacity:0.8,
        marginBottom:6,
    },
    information_owner_name:{
        fontFamily:Font.BeVietnamProMedium,
        fontWeight:'500',
        fontSize:14,
        lineHeight:20,
        color:'#2E333D',
        marginBottom:6,
    },
    information_owner_group:{
        flexDirection:'row',
        alignItems:'center'
    },
    information_owner_phone:{
        fontFamily:Font.BeVietnamProRegular,
        fontWeight:'400',
        fontSize:13,
        lineHeight:20,
        color:'#2E333D',
        marginLeft:6,
    },
    information_car:{
        paddingHorizontal:15,
        paddingTop:20,
    },
    information_car_title:{
        fontFamily:Font.BeVietnamProBold,
        color:'#2C3442',
        fontSize:16,
        lineHeight:24,
        fontWeight:'700',
    },
    group:{
        marginTop:15,
    },
    group_title:{
        fontFamily:Font.BeVietnamProRegular,
        color:'#2C3442',
        fontSize:13,
        lineHeight:18,
        fontWeight:'400',
    },
    group_content:{
        paddingVertical:10,
        borderBottomColor:'#E1E9F6',
        borderBottomWidth:1,
        borderStyle:'solid',
        fontFamily:Font.BeVietnamProSemiBold,
        fontSize:14,
        fontWeight:'600',
        color:'#2C3442'
    },
})