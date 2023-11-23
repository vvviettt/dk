import { StyleSheet, Text, View,TouchableOpacity,Image,ScrollView} from 'react-native'
import React from 'react'
import { useSelector} from 'react-redux'
import {Font} from '../../assets/styles/Index'
import config from '../../config'
import moment from 'moment';
import {formatDate} from '../../services/utils'
import ManagerService from '../../services/api/manager/ManagerService'
import {convertAlert} from '../../component/shared/ConvertAlert'
import RegistryBox from '../../component/shared/RegistryBox'
import Loading from '../../component/shared/Loading'

const HomeScreen = ({navigation,route}) => {
    const [isLoading,setIsLoading] = React.useState(true)
    const [listRegister,setListRegister] = React.useState()
    const {user,token} = useSelector(state => state.auth)
    const date = new Date()
    const now = moment(date).format('YYYY-MM-DD')
    // const now ='2022-10-29'
    React.useEffect(()=>{
        if (token){
            setIsLoading(true);
            ManagerService.get_list_regis(now)
            .then((res) =>{
                if (res.status==1){
                    setListRegister(res.data.registries)
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
    },[token])

    return (
        <View style={{flex:1 ,backgroundColor:'#eef2ff'}}>
            <View style={styles.header}>
                <TouchableOpacity style={styles.header_left} onPress={()=>navigation.navigate('Profile')}>
                    <Image 
                        source={{uri:(config.API_BASE_URL+'/'+user.avatar)}}
                        style={{
                            width:40,
                            height:40,
                            resizeMode:'cover',
                            borderRadius:6,
                            marginRight:10,
                        }}
                    />
                    <View>
                        <Text  style={styles.header_left_name}>{user.name}</Text>
                        <Text style={styles.header_left_hi}>Nhân viên</Text>
                    </View>
                </TouchableOpacity>
            </View>
            <ScrollView style={styles.scroll_view}>
                <View style={styles.manager}>
                    <TouchableOpacity style={styles.manager_box} onPress={()=>navigation.navigate('TrackCalender')}>
                        <View style={styles.manager_box_icon}>
                            <Image 
                                source={require('../../assets/icons/CalenderCheckIcon.png')}
                                style={{
                                    width:26.21,
                                    height:32,
                                    resizeMode:'contain'
                                }}
                            />
                        </View>
                        <Text style={styles.manager_content}>Lịch theo dõi đăng kiểm</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.manager_box} onPress={()=>navigation.navigate('RegisteredListForRegistration')}>
                        <View style={styles.manager_box_icon}>
                            <Image 
                                source={require('../../assets/icons/ListRegisterIcon.png')}
                                style={{
                                    width:32,
                                    height:32,
                                    resizeMode:'contain'
                                }}
                            />
                        </View>
                        <Text style={styles.manager_content}>DS Đã đăng ký đăng kiểm</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.manager_box} onPress={()=>navigation.navigate('PaidRegistrationList',{})}>
                        <View style={styles.manager_box_icon}>
                            <Image 
                                source={require('../../assets/icons/ListRegisterPaymentIcon.png')}
                                style={{
                                    width:32,
                                    height:32,
                                    resizeMode:'contain'
                                }}
                            />
                        </View>
                        <Text style={styles.manager_content}>DS Đăng kiểm đã thu tiền</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.manager_box} onPress={()=>navigation.navigate('CompleteRegistryList',{})}>
                        <View style={styles.manager_box_icon}>
                            <Image 
                                source={require('../../assets/icons/CompleteRegistrationIcon.png')}
                                style={{
                                    width:35,
                                    height:36,
                                    resizeMode:'contain'
                                }}
                            />
                        </View>
                        <Text style={styles.manager_content}>DS hoàn thành đăng kiểm</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.manager_box} onPress={()=>{}}>
                        <View style={styles.manager_box_icon}>
                            <Image 
                                source={require('../../assets/icons/TimesheetsIcon.png')}
                                style={{
                                    width:32,
                                    height:32,
                                    resizeMode:'contain'
                                }}
                            />
                        </View>
                        <Text style={styles.manager_content}>Xem bảng chấm công</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.manager_box} onPress={()=>{}}>
                        <View style={styles.manager_box_icon}>
                            <Image 
                                source={require('../../assets/icons/PayrollIcon.png')}
                                style={{
                                    width:32,
                                    height:32,
                                    resizeMode:'contain'
                                }}
                            />
                        </View>
                        <Text style={styles.manager_content}>Xem bảng lương</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.manager_box} onPress={()=>navigation.navigate('Profile')}>
                        <View style={styles.manager_box_icon}>
                            <Image 
                                source={require('../../assets/icons/AccountInformationIcon.png')}
                                style={{
                                    width:32,
                                    height:32,
                                    resizeMode:'contain'
                                }}
                            />
                        </View>
                        <Text style={styles.manager_content}>Thông tin tài khoản</Text>
                    </TouchableOpacity>
                </View>
                <View style={styles.register}>
                    <View style={styles.register_title}>
                        <Text style={styles.register_title_left}>Lịch đăng kiểm hôm nay {formatDate(now).slice(0,5)}</Text>
                        <Text style={styles.register_title_right}>{listRegister?.length} xe</Text>
                    </View>
                    <View>
                        {
                            isLoading ? 
                            <Loading />
                            :
                            (
                                <>
                                    {
                                        listRegister?.length == 0 ? (
                                            <Text style={{
                                                fontFamily:Font.BeVietnamProSemiBold,
                                                marginTop:20,
                                                textAlign:'center',
                                                fontSize:16,
                                                color:'#394B6A'
                                            }}>Hôm nay không có lịch đăng kiểm</Text>
                                        ):(
                                            <></>
                                        )
                                    }
                                    {
                                        listRegister?.map((registration)=>(
                                            <RegistryBox 
                                                key={registration.id} 
                                                data={registration} 
                                                style={styles.box_style}
                                                onPress={()=>navigation.navigate('FollowUpCheckin',{regisId:registration.id})}
                                            />
                                        ))
                                    }
                                </>
                            )
                        }
                    </View>
                </View>
            </ScrollView>
        </View>
    )
}

export default HomeScreen

const styles = StyleSheet.create({
    header:{
        flexDirection:'row',
        justifyContent:'space-between',
        width:'100%',
        paddingHorizontal:15,
        marginTop:50,
        alignItems:'center'
    },
    header_left:{
        flexDirection:'row'
    },
    header_left_hi:{
        fontFamily:Font.BeVietnamProRegular,
        fontSize:11,
        lineHeight:16,
        color:'#394B6A',
        fontWeight:'400',
    },
    header_left_name:{
        fontFamily:Font.BeVietnamProMedium,
        fontSize:17,
        fontWeight:'500',
        lineHeight:24,
        color:'#2E333D',
    },
    header_right:{
        flexDirection:'row'
    },
    header_right_point:{
        fontFamily:Font.BeVietnamProMedium,
        fontSize:13,
        fontWeight:'500',
        lineHeight:18,
        color:'#394B6A',
    },
    scroll_view:{
        width:'100%',
        flex:1,
        paddingHorizontal:15,
        backgroundColor:'#eef2ff',
        paddingBottom:20
    },
    manager:{
        paddingTop:25,
        flexDirection:'row',
        width:'100%',
        flexWrap:'wrap',
        justifyContent:'space-between'
    },
    manager_box:{
        width:'31%',
        paddingHorizontal:15,
        paddingVertical:10,
        flexDirection:'column',
        borderRadius:6,
        shadowColor: '#0000000D',
        shadowOffset: {width: 2, height: 8},
        shadowOpacity: 0,
        shadowRadius: 0,
        backgroundColor:'#FFFFFF',
        justifyContent:'space-between',
        marginBottom:15
    },
    manager_box_icon:{
        width:'auto',
        height:30,
        marginBottom:8
    },
    icon_style:{
        flex:1,
        width:null,
        height:null,
        resizeMode:'contain',
    },
    manager_content:{
        fontFamily:Font.BeVietnamProRegular,
        fontSize:10,
        lineHeight:16,
        fontWeight:'400',
        color:'#394B6A'
    },
    register:{

    },
    register_title:{
        justifyContent:'space-between',
        alignItems:'center',
        flexDirection:'row',
    },
    register_title_left:{
        width:'70%',
        fontFamily:Font.BeVietnamProMedium,
        fontSize:12,
        lineHeight:18,
        color:'#394B6A',
        fontWeight:'500',
        textTransform:'uppercase'
    },
    register_title_right:{
        fontFamily:Font.BeVietnamProBold,
        fontSize:12,
        lineHeight:18,
        color:'#0F6AA9',
        fontWeight:'700',
        textTransform:'uppercase'
    },
    box_style:{
        marginTop:10
    },
})