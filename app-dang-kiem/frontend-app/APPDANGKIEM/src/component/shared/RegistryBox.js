import { StyleSheet, Text, View,Image,TouchableOpacity } from 'react-native'
import React from 'react'
import {converLicensePlate, convertPrice,formatDate} from '../../services/utils'
import {Font} from '../../assets/styles/Index'
import config from '../../config'

const RegistryBox = ({
    data,
    style,
    onPress
}) => {
  return (
    <TouchableOpacity onPress={()=>onPress()}>
        <View style={[styles.box,style]}>
            <View style={styles.box_left}>
                {
                    data.display_image ?
                    (
                        <Image 
                            source={{ uri:(config.API_BASE_URL+'/'+data.display_image)}}
                            style={styles.image}
                        />
                    ):(
                        <View style={{
                            width:40,
                            height:40,
                            alignItems:'center',
                            justifyContent:'center',
                            borderRadius:4,
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
            </View>
            <View style={styles.box_right}>
                <Text style={styles.license_plates}>{converLicensePlate(data.license_plate)}</Text>
                <Text style={styles.content_style}>Loại: {data.type}</Text>
                {
                    data.completed_at ? 
                    (
                        <Text style={styles.content_style}>Đăng kiểm gần nhất: {formatDate(data.completed_at)}</Text>
                    ):(
                        <></>
                    )
                }
                {
                    data.status == 0 ? 
                    (
                        <View style={[styles.content_box,{backgroundColor:'#B6DCFF'}]}>
                            <Text style={[styles.content_box_style,{color:'#025686'}]}>Đã đăng  ký</Text>
                        </View>
                    ):
                    (
                        <>
                            {
                                data.status == 1 ? 
                                (
                                    <View style={[styles.content_box,{backgroundColor:'#FFE9B1'}]}>
                                        <Text style={[styles.content_box_style,{color:'#714B14'}]}>Đã nộp tiền</Text>
                                    </View>
                                )
                                :
                                (
                                    // <View style={[styles.content_box,{backgroundColor:'#BCEBCF'}]}>
                                    //     <Text style={[styles.content_box_style,{color:'#008334'}]}>Đã xác nhận</Text>
                                    // </View>
                                    <></>
                                )
                            }
                        </>
                    )
                }
                {
                    data.registration_for ? 
                    <Text style={styles.registration_for}>Có nhờ đăng kiểm hộ - {data.registration_for}</Text>
                    :<></>
                }
            </View>
        </View>
    </TouchableOpacity>
  )
}

export default RegistryBox

const styles = StyleSheet.create({
    box:{
        width:'100%',
        padding:15,
        backgroundColor:'#FFFFFF',
        borderRadius:6,
        shadowColor: '#0000000D',
        shadowOffset: {width: 2, height: 8},
        shadowOpacity: 0,
        shadowRadius: 0,
        flexDirection:'row'
    },
    box_left:{
        marginRight:10
    },
    box_right:{
        flex:1,
    },
    image:{
        width:40,
        height:40,
        resizeMode:'cover',
        borderRadius:3,
    },
    license_plates:{
        fontFamily:Font.BeVietnamProMedium,
        fontSize:14,
        lineHeight:20,
        color:'#2C3442',
        fontWeight:'500'
    },
    content_style:{
        fontFamily:Font.BeVietnamProRegular,
        fontSize:12,
        lineHeight:18,
        color:'#2C3442',
        fontWeight:'400',
        marginTop:4
    },
    content_box:{
        width:100,
        height:24,
        borderRadius:100,
        justifyContent:'center',
        alignItems:'center',
        marginVertical:6
    },
    content_box_style:{
        fontFamily:Font.BeVietnamProMedium,
        fontSize:11,
        lineHeight:16,
        fontWeight:'500'
    },
    registration_for:{
        fontFamily:Font.BeVietnamProRegular,
        fontSize:12,
        fontStyle:'italic',
        fontWeight:'400',
        lineHeight:16
    }
})