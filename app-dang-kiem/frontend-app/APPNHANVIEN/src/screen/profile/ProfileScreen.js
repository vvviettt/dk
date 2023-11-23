import { StyleSheet, Text, View ,ScrollView,Image,TouchableOpacity} from 'react-native'
import React from 'react'
import Header from '../../component/layout/Header'
import Footer from '../../component/layout/Footer'
import { useDispatch, useSelector } from 'react-redux'
import { logout } from '../../store/auth'
import {Font} from '../../assets/styles/Index'
import config from '../../config'

const ProfileScreen = ({navigation,route}) => {
    const {user} = useSelector(state => state.auth)
    const dispatch = useDispatch();
    const handleLogout = ()=>{
        dispatch(logout());
    }
    return (
        <View style={{flex:1}}>
            <Header onGoBack={()=>navigation.goBack()} title='Thông tin tài khoản'/>
            <ScrollView style={styles.scroll_view}>
                <View style={styles.user}>
                    <Image 
                        source={{uri:(config.API_BASE_URL+'/'+user.avatar)}}
                        style={styles.user_img}
                    />
                    <Text style={styles.user_name}>{user.name}</Text>
                    <Text style={styles.user_role}>Nhân viên</Text>
                </View>
                <View style={styles.information}>
                    <View style={styles.information_row}>
                        <View style={styles.infor_left}>
                            <View style={styles.icon}>
                                <Image 
                                    source={require('../../assets/icons/EmailIcon.png')}
                                    style={{
                                        width:14,
                                        height:14,
                                    }}
                                />
                            </View>
                            <Text style={styles.text_normal_style}>Email</Text>
                        </View>
                        <View style={styles.infor_right}>
                            <Text style={[styles.text_normal_style,{color:'#2C3442'}]}>{user.email}</Text>
                        </View>
                    </View>
                    <View style={styles.information_row}>
                        <View style={styles.infor_left}>
                            <View style={styles.icon}>
                                <Image 
                                    source={require('../../assets/icons/PhoneIcon.png')}
                                    style={{
                                        width:16,
                                        height:16,
                                    }}
                                />
                            </View>
                            <Text style={styles.text_normal_style}>Điện thoại</Text>
                        </View>
                        <View style={styles.infor_right}>
                            <Text style={[styles.text_normal_style,{color:'#2C3442'}]}>{user.phone}</Text>
                        </View>
                    </View>
                    <View style={styles.information_row}>
                        <TouchableOpacity style={styles.infor_left} onPress={()=>navigation.navigate('ChangePassword')}>
                            <View style={styles.icon}>
                                <Image 
                                    source={require('../../assets/icons/ChangePasswordIcon.png')}
                                    style={{
                                        width:14,
                                        height:14,
                                    }}
                                />
                            </View>
                            <Text style={styles.text_touch_style}>Đổi mật khẩu</Text>
                        </TouchableOpacity>
                    </View>
                    <View style={styles.information_row}>
                        <TouchableOpacity style={styles.infor_left} onPress={()=>handleLogout()}>
                            <View style={styles.icon}>
                                <Image 
                                    source={require('../../assets/icons/LogoutIcon.png')}
                                    style={{
                                        width:14,
                                        height:14,
                                    }}
                                />
                            </View>
                            <Text style={styles.text_touch_style}>Đăng xuất</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </ScrollView>
            <Footer 
                buttonOkContent={'Cập nhật thông tin'}
                onClickButtonOk={()=>navigation.navigate('ChangeProfile')}
                footer_style={styles.footer_style}
            />
        </View>
    )
}

export default ProfileScreen

const styles = StyleSheet.create({
    scroll_view:{
        backgroundColor:'#F7FAFF',
    },
    user:{
        paddingTop:30,
        alignItems:'center',
        backgroundColor:'#FFFFFF',
    },
    user_img:{
        width:128,
        height:128,
        borderRadius:6
    },
    user_name:{
        fontFamily:Font.BeVietnamProSemiBold,
        fontSize:14,
        fontWeight:'600',
        lineHeight:22,
        marginTop:12,
        color:'#2C3442',
    },
    user_role:{
        fontFamily:Font.BeVietnamProRegular,
        fontSize:11,
        fontWeight:'400',
        lineHeight:16,
        marginTop:4,
        color:'#394B6A',
        textTransform:'uppercase'
    },
    information:{
        backgroundColor:'#FFFFFF',
        paddingTop:30,
        paddingHorizontal:30,
    },
    information_row:{
        paddingVertical:15,
        borderTopColor:'#E1E9F6',
        borderStyle:'solid',
        borderTopWidth:1,
        flexDirection:'row',
        justifyContent:'space-between',
        alignItems:'center',
    },
    infor_left:{
        flexDirection:'row',
        alignItems:'center',
    },
    infor_right:{

    },
    icon:{
        width:16,
        height:16,
        alignItems:'flex-start',
        justifyContent:'center',
        marginRight:10
    },
    text_normal_style:{
        fontFamily:Font.BeVietnamProRegular,
        fontSize:13,
        fontWeight:'400',
        lineHeight:22,
        color:'#394B6A'
    },
    text_touch_style:{
        fontFamily:Font.BeVietnamProMedium,
        fontSize:13,
        fontWeight:'400',
        lineHeight:22,
        color:'#126FAF'
    },
    footer_style:{
        backgroundColor:'#F7FAFF',
    }
})