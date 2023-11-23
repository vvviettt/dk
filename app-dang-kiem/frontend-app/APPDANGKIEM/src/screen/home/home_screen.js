import { StyleSheet, Text, View,ScrollView, Image,TouchableOpacity} from 'react-native'
import React from 'react'
import {Font} from '../../assets/styles/Index'
import CalenderFullSize from '../../component/shared/CalenderFullSize'
import config from '../../config'
import {useDispatch, useSelector} from 'react-redux'
import HomeService from '../../services/api/home/HomeService'
import Loading from '../../component/shared/Loading'
import {convertAlert} from '../../component/shared/ConvertAlert'
import {getProfile} from '../../store/auth'

const HomepageScreen = ({navigation}) => {
    const [isLoading,setIsLoading] = React.useState(true)
    const [listDate,setListDate] = React.useState({})
    const dispatch = useDispatch();
    const {user,token} = useSelector(state => state.auth)
    React.useEffect(()=>{
        const handleResetProfile = () => {
            dispatch(getProfile())
        } 
        handleResetProfile();
    },[])
    React.useEffect(() =>{
        if(token){
            setIsLoading(true);
            HomeService.get_list_register()
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
    },[token])

    return (
        <View style={{flex:1 ,backgroundColor:'#eef2ff'}}>
            <View style={styles.header}>
                <TouchableOpacity style={styles.header_left} onPress={()=>navigation.push('Profile')}>
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
                        <Text style={styles.header_left_hi}>XIN CHÀO!</Text>
                        <Text  style={styles.header_left_name}>{user.name}</Text>
                    </View>
                </TouchableOpacity>
                {/* Thông tin tích điểm */}
                {/* <View style={styles.header_right}>
                    <Image 
                        source={require('../../assets/icons/StarIcon.png')}
                        style={{
                            width:16.78,
                            height:16,
                            marginRight:4
                        }}
                    />
                    <Text style={styles.header_right_point}>{77} điểm</Text>
                </View> */}
            </View>
            <ScrollView style={styles.scroll_view}>
                {
                    isLoading ? 
                    (
                        <Loading />
                    ):(
                        <CalenderFullSize style={styles.calender_style} listDate={listDate}/>
                    )
                }
                <View style={styles.manager}>
                    <TouchableOpacity style={styles.manager_box} onPress={()=>navigation.push("Registration/List")}>
                        <View style={styles.manager_box_icon}>
                            <Image 
                                source={require('../../assets/icons/ListRegisterIcon.png')}
                                style={{
                                    width:26.21,
                                    height:32,
                                    resizeMode:'contain'
                                }}
                            />
                        </View>
                        <Text style={styles.manager_content}>Danh sách đăng ký</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.manager_box} onPress={()=>navigation.push("Car/List")}>
                        <View style={styles.manager_box_icon}>
                            <Image 
                                source={require('../../assets/icons/ListCarIcon.png')}
                                style={{
                                    width:32,
                                    height:32,
                                    resizeMode:'contain'
                                }}
                            />
                        </View>
                        <Text style={styles.manager_content}>Danh sách xe của bạn</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.manager_box} onPress={()=>navigation.push("History/List")}>
                        <View style={styles.manager_box_icon}>
                            <Image 
                                source={require('../../assets/icons/ListRegisterIcon.png')}
                                style={{
                                    width:31.57,
                                    height:32,
                                    resizeMode:'contain'
                                }}
                            />
                        </View>
                        <Text style={styles.manager_content}>Xem lịch sử đăng kiểm</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.manager_box}>
                        <View style={styles.manager_box_icon}>
                            <Image 
                                source={require('../../assets/icons/PointInformationIcon.png')}
                                style={{
                                    width:24.53,
                                    height:32,
                                    resizeMode:'contain'
                                }}
                            />
                        </View>
                        <Text style={styles.manager_content}>Thông tin tích điểm</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.manager_box} onPress={()=>navigation.push("Infringes/Search")}>
                        <View style={styles.manager_box_icon}>
                            <Image 
                                source={require('../../assets/icons/SearchErrorIcon.png')}
                                style={{
                                    width:32,
                                    height:32,
                                    resizeMode:'contain'
                                }}
                            />
                        </View>
                        <Text style={styles.manager_content}>Tra cứu lỗi vi phạm</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.manager_box} onPress={()=>navigation.push("Profile")}>
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
            </ScrollView>
        </View>
    )
}

export default HomepageScreen

const styles = StyleSheet.create({
    header:{
        flexDirection:'row',
        justifyContent:'space-between',
        width:'100%',
        paddingHorizontal:15,
        marginTop:50,
        paddingBottom:15,
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
    calender_style:{
        marginTop:10,
        marginBottom:30
    },
    manager:{
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
        fontSize:12,
        lineHeight:16,
        fontWeight:'400',
        color:'#394B6A'
    }
})