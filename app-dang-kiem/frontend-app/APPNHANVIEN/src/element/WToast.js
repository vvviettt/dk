import { StyleSheet, Text, View,Image,TouchableOpacity } from 'react-native'
import React from 'react'
import {Font} from '../assets/styles/Index'
const WToast = ({
    content,
    goToListError,
    showTouch = true,
    icon,
    iconStyle
}) => {
  return (
    <View style={styles.toast}>
        {
            icon  ?
            (
                <Image 
                    source={icon}
                    style={iconStyle}
                />
            ):(
                <Image 
                    source={require('../assets/icons/WarningIcon.png')}
                    style={styles.icon}
                />
            )
        }
        <View style={styles.group_content}>
            <Text style={styles.content}>{content}</Text>
            {
                showTouch?
                (
                    <TouchableOpacity onPress={()=>goToListError()}>
                        <Text style={styles.list_error}>Xem danh sách lỗi</Text>
                    </TouchableOpacity>
                ):(
                    <></>
                )
            }
        </View>
    </View>
  )
}

export default WToast

const styles = StyleSheet.create({
    toast:{
        padding:15,
        backgroundColor:'#FFFFFF',
        borderRadius:6,
        flexDirection:'row',
        marginHorizontal:15,
        shadowColor: '#2C3442',
        shadowOffset: {width: 4, height: -12},
        shadowOpacity: 0,
        shadowRadius: 0,
    },
    icon:{
        width:24,
        height:24,
        marginRight:15,
        marginTop:5
    },
    group_content:{
        flex:1,
    },
    content:{
        fontFamily:Font.BeVietnamProRegular,
        fontWeight:'400',
        fontSize:13,
        lineHeight:22,
        color:'#2C3442'
    },
    list_error:{
        fontFamily:Font.BeVietnamProSemiBold,
        fontWeight:'600',
        fontSize:10,
        lineHeight:22,
        color:'#3C61EA',
        textTransform:'uppercase',
        textDecorationLine:'underline',
    }
})