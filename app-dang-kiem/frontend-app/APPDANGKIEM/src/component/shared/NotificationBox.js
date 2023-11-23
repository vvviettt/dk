import { StyleSheet, Text, View,TouchableOpacity,Image } from 'react-native'
import React from 'react'
import {Font} from '../../assets/styles/Index'

const NotificationBox = ({
    data,
    onPress,
}) => {
    return (
        <TouchableOpacity style={[styles.notification,{
            backgroundColor:data.is_read == true ? '#FFFFFF' : '#F0FFFA'
        }]} onPress={()=>onPress()}>
            {
                data.type == 1?
                (
                    <Image 
                        source={require('../../assets/icons/NotificationNearTimeIcon.png')}
                        style={{
                            width:32,
                            height:32,
                            marginRight:10
                        }}
                    />
                ):(
                    <></>
                )
            }
            {
                data.type == 2 ?
                (
                    <Image 
                        source={require('../../assets/icons/NotificationHaveIcon.png')}
                        style={{
                            width:32,
                            height:32,
                            marginRight:10
                        }}
                    />
                ):(
                    <></>
                )
            }
            {
                data.type == 4 ?
                (
                    <Image 
                        source={require('../../assets/icons/NotificationShareIcon.png')}
                        style={{
                            width:32,
                            height:32,
                            marginRight:10
                        }}
                    />
                ):(
                    <></>
                )
            }
            {
                (data.type == 6 || data.type == 7)?
                (
                    <Image 
                        source={require('../../assets/icons/CompleteRegistrationIcon.png')}
                        style={{
                            width:32,
                            height:32,
                            marginRight:10
                        }}
                    />
                ):(
                    <></>
                )
            }
            <View style={styles.group}>
                <Text style={
                    data.is_read == true ? 
                    styles.content_read: styles.content_not_read
                }>{data.content}</Text>
                <Text style={styles.time}>{data.time}</Text>
            </View>
        </TouchableOpacity>
    )
}

export default NotificationBox

const styles = StyleSheet.create({
    notification:{
        flexDirection:'row',
        padding:15,
        borderBottomColor:'#E1E9F6',
        borderBottomWidth:1,
        borderStyle:'solid',
    },
    group:{
        width:'100%',
        paddingRight:0,
        flex:1
    },
    content_read:{
        fontFamily:Font.BeVietnamProRegular,
        fontSize:14,
        fontWeight:"400",
        lineHeight:22,
        color:'#394B6A'
    },
    content_not_read:{
        fontFamily:Font.BeVietnamProSemiBold,
        fontSize:14,
        fontWeight:"600",
        lineHeight:22,
        color:'#394B6A'
    },
    time:{
        fontFamily:Font.BeVietnamProRegular,
        fontSize:12,
        fontWeight:"400",
        lineHeight:22,
        color:'#394B6A',
        marginTop:5
    }
})